import axios from 'axios';
import {
  GetAddressParametersType,
  GetNextReceiveIndexResponseType,
} from './types';

const getNextReceiveIndex = async ({
  user,
  assetId,
  custody,
  wallet,
}: GetAddressParametersType): Promise<GetNextReceiveIndexResponseType> => {
  const response: {data: GetNextReceiveIndexResponseType} = await axios.post(
    `${process.env.MAP3_STORE_API}/api/store/keychain-address/address-index`,
    {
      user,
      assetId,
      custody,
      wallet,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${process.env.MAP3_STORE_API_KEY}`,
      },
    }
  );

  const {data} = response;
  return data;
};

export {getNextReceiveIndex};
