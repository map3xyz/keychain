import axios from 'axios';

// eslint-disable-next-line node/no-unpublished-import
import config from '../map3.config.example.json';
import {
  GetAddressParametersType,
  GetFeeParametersType,
  GetFeeResponseType,
  GetNextReceiveIndexResponseType,
  GetUTXOsParametersType,
  GetUTXOsResponseType,
  RegisterAddressParametersType,
  RegisterAddressResponseType,
} from './types';

const BASE_URL = `${process.env.MAP3_STORE_API}/api/store`;

const headers = {
  'Content-Type': 'application/json',
  authorization: `Bearer ${config.storeApiKey}`,
};

// rename to getUserAddressIndex?
const getNextReceiveIndex = async (
  params: GetAddressParametersType
): Promise<GetNextReceiveIndexResponseType> => {
  const response: {data: GetNextReceiveIndexResponseType} = await axios.post(
    `${BASE_URL}/keychain-address/address-index`,
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
    `${BASE_URL}/keychain-address/register-address`,
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
    `${BASE_URL}/keychain-address/utxos`,
    params,
    {
      headers,
    }
  );

  const {data} = response;
  return data;
};

const getFees = async (
  params: GetFeeParametersType
): Promise<GetFeeResponseType> => {
  const response = await axios.post(`${BASE_URL}/fees`, params, {
    headers,
  });

  const {data} = response;
  return data;
};

export {getFees, getNextReceiveIndex, getUTXOs, registerAddress};
