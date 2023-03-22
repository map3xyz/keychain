require('dotenv').config();

import {initWasm} from '@trustwallet/wallet-core';
import axios from 'axios';
import {GetAddressParametersType} from './types';

export const getAddress = async ({
  user,
  assetId,
  custody,
  wallet,
}: GetAddressParametersType): Promise<{
  address: string;
  memo?: string;
}> => {
  if (!process.env.MNEMONIC) {
    throw new Error('MNEMONIC not set');
  }
  const {HDWallet, AnyAddress} = await initWasm();
  // call store get the next index for org, asset, custody
  const response: {data: {index: 0; bip44Path: 60; isRegistered: false}} =
    await axios.post(
      'http://localhost:3001/api/store/keychain-address/address-index',
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

  const coinType = {value: data.bip44Path};
  const hdwallet = HDWallet.createWithMnemonic(process.env.MNEMONIC, '');
  const key = hdwallet.getDerivedKey(coinType, wallet, 0, data.index);
  const pubKey = key.getPublicKey(coinType);
  const address = AnyAddress.createWithPublicKey(pubKey, coinType);
  // if !registered
  // call store register address
  return {address: address.description()};
};

// preMVP
(async function () {
  const start = new Date().getTime();
  console.log('Initializing Wasm...');
  const {CoinType, HexCoding, HDWallet, AnyAddress} = await initWasm();
  console.log(`Done in ${new Date().getTime() - start} ms`);

  const wallet = HDWallet.create(256, '');
  const key = wallet.getKeyForCoin(CoinType.ethereum);
  const pubKey = key.getPublicKeySecp256k1(false);
  const address = AnyAddress.createWithPublicKey(pubKey, CoinType.ethereum);

  // Derive addresses using bip-44 paths
  const key0 = wallet.getDerivedKey(CoinType.ethereum, 0, 0, 0);
  const pubkey0 = key0.getPublicKeySecp256k1(false);
  const address0 = AnyAddress.createWithPublicKey(pubkey0, CoinType.ethereum);

  console.log(`Create wallet: ${wallet.mnemonic()}`);
  console.log(`Get Ethereum public key: ${HexCoding.encode(pubKey.data())}`);
  console.log(`Get Ethereum address: ${address.description()}`);
  console.log(`CoinType.ethereum.value = ${CoinType.ethereum.value}`);
  // console.log('Ethereum protobuf models: \n', TW.Ethereum);

  console.log(`ETH address 0: ${address0.description()}`);
  console.log(
    `ETH addresses match: ${address0.description() === address.description()}`
  );

  wallet.delete();
  key.delete();
  pubKey.delete();
  address.delete();
})();
