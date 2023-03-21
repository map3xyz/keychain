import * as express from 'express';
import {getAddress} from './app';
import {GetAddressParametersType} from './types';

const app = express();

const PORT = process.env.PORT || 4000;

app.post('/', async (req, res) => {
  // hmac stuff
  const data = {
    function: 'getAddress',
    apiKey: 'asdf',
    parameters: {
      user: 'asdf',
      assetId: '123-123',
      custody: 'internal',
      wallet: 0,
    } as GetAddressParametersType,
  };

  switch (data.function) {
    case 'getAddress': {
      const {address, memo} = await getAddress(data.parameters, data.apiKey);
      res.send({address, memo});
      break;
    }
    default:
  }
});

app.listen(PORT, () =>
  console.log(`⚡ Server is running here 👉 http://localhost:${PORT}`)
);
