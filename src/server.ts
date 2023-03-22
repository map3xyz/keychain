import * as express from 'express';
import {getAddress} from './app';
import {GetAddressParametersType} from './types';

const app = express();

const PORT = process.env.PORT || 4000;

app.post('/', async (req, res) => {
  // hmac stuff
  const data = {
    function: 'getAddress',
    parameters: {
      user: 'asdf',
      assetId: 'da5eb9b1-7e2b-4976-a260-07a3eab89618',
      custody: 'internal',
      wallet: 0,
    } as GetAddressParametersType,
  };

  switch (data.function) {
    case 'getAddress': {
      const {address, memo} = await getAddress(data.parameters);
      res.send({address, memo});
      break;
    }
    default:
      res.send('Invalid function');
  }
});

app.listen(PORT, () =>
  console.log(`⚡ Server is running here 👉 http://localhost:${PORT}`)
);
