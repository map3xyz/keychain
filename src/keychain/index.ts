require('dotenv').config();

import {WalletCore} from '@trustwallet/wallet-core';

import {GetAddressParametersType, SendParametersType} from '../types';
import {Wallet} from './wallet';

export class Keychain {
  tw: WalletCore;
  hdwallet: WalletCore['HDWallet']['prototype'];
  wallets: Wallet[];

  constructor(args: {
    config: {wallets: {apiKey: string; id: number; name: string}[]};
    mnemonic: string;
    tw: WalletCore;
  }) {
    const {config, mnemonic, tw} = args;

    this.tw = tw;
    this.hdwallet = tw.HDWallet.createWithMnemonic(mnemonic, '');
    this.wallets = config.wallets.map(({apiKey, id, name}) => {
      return new Wallet({apiKey, keychain: this, name, walletId: id});
    });
  }

  getAddress = async (
    params: GetAddressParametersType
  ): Promise<{
    address: string;
    memo?: string;
  }> => {
    const wallet = this.wallets[params.walletId];
    return wallet.getAddress(params);
  };

  send = async (params: SendParametersType) => {
    const wallet = this.wallets[params.walletId];
    return wallet.send(params);
  };
}
