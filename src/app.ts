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

  private deriveAddressFromPath = async (params: {
    bip44Path: number;
    wallet: number;
    addressIndex: number;
  }) => {
    const {HDWallet, AnyAddress} = await initWasm();
    const {bip44Path, wallet, addressIndex} = params;
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

  getAddress = async ({
    userId,
    assetId,
    custody,
    wallet,
  }: GetAddressParametersType): Promise<{
    address: string;
    memo?: string;
  }> => {
    // call store get the next index for org, asset, custody
    const {bip44Path, addressIndex, isRegistered} =
      await router.getNextReceiveIndex({
        userId,
        assetId,
        custody,
        wallet,
      });

    const address = await this.deriveAddressFromPath({
      bip44Path,
      wallet,
      addressIndex,
    });

    // if !registered
    if (!isRegistered) {
      const registration = await router.registerAddress({
        userId,
        assetId,
        custody,
        wallet,
        address,
        bip44Path,
        addressIndex,
      });
    }
    return {address};
  };
}
