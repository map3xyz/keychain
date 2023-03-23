require('dotenv').config();

import {initWasm} from '@trustwallet/wallet-core';
import {GetAddressParametersType} from './types';
import * as router from './router';

const deriveAddressFromPath = async (
  bip44Path: number,
  wallet: number,
  index: number
) => {
  if (!process.env.MNEMONIC) {
    throw new Error('MNEMONIC not set');
  }
  const {HDWallet, AnyAddress} = await initWasm();
  const hdwallet = HDWallet.createWithMnemonic(process.env.MNEMONIC, '');
  const key = hdwallet.getDerivedKey({value: bip44Path}, wallet, 0, index);
  const pubKey = key.getPublicKey({value: bip44Path});
  const address = AnyAddress.createWithPublicKey(pubKey, {value: bip44Path});
  return address.description();
};

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
  // call store get the next index for org, asset, custody
  const {bip44Path, index, isRegistered} = await router.getNextReceiveIndex({
    user,
    assetId,
    custody,
    wallet,
  });

  const address = await deriveAddressFromPath(bip44Path, wallet, index);

  // if !registered
  if (!isRegistered) {
    // router.registerAddress({ address });
  }
  return {address};
};
