import axios from 'axios';
import {
  GetAddressParametersType,
  GetNextReceiveIndexResponseType,
  RegisterAddressParametersType,
} from './types';

const BASE_URL = `${process.env.MAP3_STORE_API}/api/store/keychain-address`;

const getNextReceiveIndex = async ({
  userId,
  assetId,
  custody,
  wallet,
}: GetAddressParametersType): Promise<GetNextReceiveIndexResponseType> => {
  const response: {data: GetNextReceiveIndexResponseType} = await axios.post(
    `${BASE_URL}/address-index`,
    {
      userId,
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

const registerAddress = async ({
  userId,
  assetId,
  custody,
  wallet,
  address,
  addressIndex,
  memo,
  bip44Path,
}: RegisterAddressParametersType): Promise<{status?: 'ok'; error?: string}> => {
  const response = await axios.post(
    `${BASE_URL}/register-address`,
    {
      userId,
      assetId,
      custody,
      wallet,
      address,
      addressIndex,
      memo,
      bip44Path,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${process.env.MAP3_STORE_API_KEY}`,
      },
    }
  );

  return response.data;
};

export {getNextReceiveIndex, registerAddress};
