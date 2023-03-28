import {debug} from 'console';
import * as express from 'express';

import {Keychain} from './app';
import {GetAddressParametersType} from './types';

const app = express();

const PORT = process.env.PORT || 4000;

if (!process.env.MNEMONIC) {
  throw new Error('MNEMONIC is required');
}
if (!process.env.MAP3_STORE_API_KEY) {
  throw new Error('MAP3_STORE_API_KEY is required');
}

const keychain = new Keychain({
  mnemonic: process.env.MNEMONIC,
});

app.post('/', async (req, res) => {
  // hmac stuff
  const data = {
    function: 'getAddress',
    parameters: {
      assetId: '38975bff-987f-4a06-b488-c75177e06914',
      userId: 'test-user-03',
      wallet: 0,
    } as GetAddressParametersType,
  };

  switch (data.function) {
    case 'getAddress': {
      try {
        const {address, memo} = await keychain.getAddress(data.parameters);
        res.send({address, memo});
      } catch (e: any) {
        res.status(500);
        if (e.message && e.response.data.error) {
          res.send({error: e.response.data.error});
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

const server = app.listen(PORT, () =>
  console.log(`⚡ Server is running here 👉 http://localhost:${PORT}`)
);

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    debug('HTTP server closed');
  });
});
