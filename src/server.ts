import {initWasm} from '@trustwallet/wallet-core';
import express from 'express';

// eslint-disable-next-line node/no-unpublished-import
import config from '../map3.config.json';
import {Keychain} from './keychain';
import {hmacMiddleware} from './middlewares/hmac';
import {GetAddressParametersType} from './types';
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
      // hmac stuff
      const data = {
        function: 'getAddress',
        parameters: {
          assetId: '38975bff-987f-4a06-b488-c75177e06914',
          userId: 'test-user-03',
          walletId: 0,
        } as GetAddressParametersType,
      };

      switch (data.function) {
        case 'getAddress': {
          try {
            const {address, memo} = await keychain.getAddress(data.parameters);
            res.send({address, memo});
          } catch (e) {
            const error = catcher(e);
            res.status(500);
            if (error) {
              res.send({error});
            } else {
              res.send('Unknown error');
            }
          }
          break;
        }
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
