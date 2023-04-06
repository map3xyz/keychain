import {initWasm} from '@trustwallet/wallet-core';
import express from 'express';

// eslint-disable-next-line node/no-unpublished-import
import config from '../map3.config.example.json';
import {Keychain} from './keychain';
import {hmacMiddleware} from './middlewares/hmac';
import {GetAddressParametersType, SendParametersType} from './types';
import {catcher} from './utils/catcher';
import {logger} from './utils/logger';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(hmacMiddleware);

logger.info('Starting server...');
(async () => {
  try {
    if (!process.env.MNEMONIC) {
      throw new Error('MNEMONIC is required');
    }
    if (process.env.MNEMONIC.split(' ').length !== 24) {
      throw new Error('MNEMONIC must be 24 words');
    }
    if (!config.storeApiKey) {
      throw new Error('storeApiKey is required');
    }

    const tw = await initWasm();

    const isValidMnemonic = tw.Mnemonic.isValid(process.env.MNEMONIC);
    if (!isValidMnemonic) {
      throw new Error('Invalid mnemonic');
    }

    const keychain = new Keychain({
      config,
      mnemonic: process.env.MNEMONIC,
      tw,
    });

    app.post('/', async (req, res) => {
      const fn = 'send' as string;
      const data_getAddress = {
        function: 'getAddress',
        parameters: {
          assetId: '55b0c6c4-b817-4eeb-a2d2-da713d5a9674',
          userId: 'test-user-06',
          walletId: 0,
        } as GetAddressParametersType,
      };
      const data_send = {
        function: 'send',
        parameters: {
          assetId: '55b0c6c4-b817-4eeb-a2d2-da713d5a9674',
          to: 'tb1q5tjzphlnyhdltv7v9mw2hjyqk7zdzl49z8c7xd',
          userId: 'test-user-06',
          walletId: 0,
        } as SendParametersType,
      };

      switch (fn) {
        case 'getAddress': {
          try {
            const {address, memo} = await keychain.getAddress(
              data_getAddress.parameters
            );
            res.send({address, memo});
          } catch (e) {
            const error = catcher(e);
            logger.error(error);
            res.status(500);
            if (error) {
              res.send({error});
            } else {
              res.send('Unknown error');
            }
          }
          break;
        }
        case 'send':
          {
            try {
              const result = await keychain.send(data_send.parameters);
              res.send(result);
            } catch (e) {
              const error = catcher(e);
              logger.error(error);
              res.status(500);
              if (error) {
                res.send({error});
              } else {
                res.send('Unknown error');
              }
            }
          }
          break;
        default:
          res.send('Invalid function');
      }
    });

    const server = app.listen(PORT, () => {
      logger.info(`⚡ Server is running here 👉 http://localhost:${PORT}`);
    });

    process.on('SIGTERM', () => {
      logger.debug('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.debug('HTTP server closed');
      });
    });
  } catch (e) {
    const error = catcher(e);
    logger.error(error);
  }
})();
