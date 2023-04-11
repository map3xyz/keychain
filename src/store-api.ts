import axios from 'axios';

// eslint-disable-next-line node/no-unpublished-import
import config from '../map3.config.example.json';
import {
  GetAddressParametersType,
  GetNextReceiveIndexResponseType,
  GetUTXOsParametersType,
  GetUTXOsResponseType,
  RegisterAddressParametersType,
  RegisterAddressResponseType,
} from './types';

const BASE_URL = `${process.env.MAP3_STORE_API}/api/store/keychain-address`;

const headers = {
  'Content-Type': 'application/json',
  authorization: `Bearer ${config.storeApiKey}`,
};

// rename to getUserAddressIndex?
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
): Promise<RegisterAddressResponseType> => {
  const response: {data: RegisterAddressResponseType} = await axios.post(
    `${BASE_URL}/register-address`,
    params,
    {
      headers,
    }
  );

  const {data} = response;
  return data;
};

const getUTXOs = async (
  params: GetUTXOsParametersType
): Promise<GetUTXOsResponseType> => {
  const response: {data: GetUTXOsResponseType} = await axios.post(
    `${BASE_URL}/utxos`,
    params,
    {
      headers,
    }
  );

  const {data} = response;
  return data;
};

export {getNextReceiveIndex, getUTXOs, registerAddress};
