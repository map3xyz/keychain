require('dotenv').config();

import {WalletCore} from '@trustwallet/wallet-core';

import * as storeAPI from './store-api';
import {GetAddressParametersType, RegisterAddressParametersType} from './types';

export class Keychain {
  #mnemonic: string;
  #tw: WalletCore;

  constructor(args: {mnemonic: string; tw: WalletCore}) {
    this.#mnemonic = args.mnemonic;
    this.#tw = args.tw;
  }

  private deriveAddressFromPath = (params: {
    addressIndex: number;
    bip44Path: number;
    wallet: number;
  }) => {
    const {AnyAddress, HDWallet} = this.#tw;
    const {addressIndex, bip44Path, wallet} = params;
    const hdwallet = HDWallet.createWithMnemonic(this.#mnemonic, '');
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
    const registration = await storeAPI.registerAddress(params);

    if (registration.status !== 'ok') {
      throw new Error('Address registration failed');
    }
  };

  getAddress = async (
    params: GetAddressParametersType
  ): Promise<{
    address: string;
    memo?: string;
  }> => {
    const {addressIndex, bip44Path, isRegistered} =
      await storeAPI.getNextReceiveIndex(params);

    const address = this.deriveAddressFromPath({
      addressIndex,
      bip44Path,
      wallet: params.wallet,
    });

    if (!isRegistered) {
      await this.registerAddress({
        ...params,
        address,
        addressIndex,
        bip44Path,
      });
    }
    return {address};
  };
}
