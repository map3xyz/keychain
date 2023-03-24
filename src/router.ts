import axios from 'axios';
import {
  GetAddressParametersType,
  GetNextReceiveIndexResponseType,
  RegisterAddressParametersType,
} from './types';

const BASE_URL = `${process.env.MAP3_STORE_API}/api/store/keychain-address`;

const headers = {
  'Content-Type': 'application/json',
  authorization: `Bearer ${process.env.MAP3_STORE_API_KEY}`,
};

const getNextReceiveIndex = async (
  params: GetAddressParametersType
): Promise<GetNextReceiveIndexResponseType> => {
  const response: {data: GetNextReceiveIndexResponseType} = await axios.post(
    `${BASE_URL}/address-index`,
    params,
    {
      headers,
    }
  );

  const {data} = response;
  return data;
};

const registerAddress = async (
  params: RegisterAddressParametersType
): Promise<{status?: 'ok'; error?: string}> => {
  const response = await axios.post(`${BASE_URL}/register-address`, params, {
    headers,
  });

  return response.data;
};

export {getNextReceiveIndex, registerAddress};
