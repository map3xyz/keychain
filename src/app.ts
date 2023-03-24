require('dotenv').config();

import {initWasm} from '@trustwallet/wallet-core';

import * as router from './router';
import {GetAddressParametersType, RegisterAddressParametersType} from './types';

export class Keychain {
  mnemonic: string;
  apiKey: string;

  constructor(mnemonic: string, apiKey: string) {
    this.mnemonic = mnemonic;
    this.apiKey = apiKey;
  }

  private deriveAddressFromPath = async (params: {
    addressIndex: number;
    bip44Path: number;
    wallet: number;
  }) => {
    const {AnyAddress, HDWallet} = await initWasm();
    const {addressIndex, bip44Path, wallet} = params;
    const hdwallet = HDWallet.createWithMnemonic(this.mnemonic, '');
    const key = hdwallet.getDerivedKey(
      {value: bip44Path},
      wallet,
      0,
      addressIndex
    );
    const pubKey = key.getPublicKey({value: bip44Path});
    const address = AnyAddress.createWithPublicKey(pubKey, {value: bip44Path});
    return address.description();
  };

  private registerAddress = async (params: RegisterAddressParametersType) => {
    const registration = await router.registerAddress(params);

    if (registration.status !== 'ok') {
      throw new Error('Address registration failed');
    }
  };

  getAddress = async ({
    assetId,
    custody,
    userId,
    wallet,
  }: GetAddressParametersType): Promise<{
    address: string;
    memo?: string;
  }> => {
    // call store get the next index for org, asset, custody
    const {addressIndex, bip44Path, isRegistered} =
      await router.getNextReceiveIndex({
        assetId,
        custody,
        userId,
        wallet,
      });

    const address = await this.deriveAddressFromPath({
      addressIndex,
      bip44Path,
      wallet,
    });

    // if !registered
    if (!isRegistered) {
      await this.registerAddress({
        address,
        addressIndex,
        assetId,
        bip44Path,
        custody,
        userId,
        wallet,
      });
    }
    return {address};
  };
}
