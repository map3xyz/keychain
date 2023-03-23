require('dotenv').config();

import {initWasm} from '@trustwallet/wallet-core';
import {GetAddressParametersType} from './types';
import * as router from './router';

export class Keychain {
  mnemonic: string;
  apiKey: string;

  constructor(mnemonic: string, apiKey: string) {
    this.mnemonic = mnemonic;
    this.apiKey = apiKey;
  }

  private deriveAddressFromPath = async (
    bip44Path: number,
    wallet: number,
    index: number
  ) => {
    const {HDWallet, AnyAddress} = await initWasm();
    const hdwallet = HDWallet.createWithMnemonic(this.mnemonic, '');
    const key = hdwallet.getDerivedKey({value: bip44Path}, wallet, 0, index);
    const pubKey = key.getPublicKey({value: bip44Path});
    const address = AnyAddress.createWithPublicKey(pubKey, {value: bip44Path});
    return address.description();
  };

  getAddress = async ({
    user,
    assetId,
    custody,
    wallet,
  }: GetAddressParametersType): Promise<{
    address: string;
    memo?: string;
  }> => {
    // call store get the next index for org, asset, custody
    const {bip44Path, index, isRegistered} = await router.getNextReceiveIndex({
      user,
      assetId,
      custody,
      wallet,
    });

    const address = await this.deriveAddressFromPath(bip44Path, wallet, index);

    // if !registered
    if (!isRegistered) {
      // router.registerAddress({ address });
    }
    return {address};
  };
}
