require('dotenv').config();

import {WalletCore} from '@trustwallet/wallet-core';
import {HDWallet} from '@trustwallet/wallet-core/dist/src/wallet-core';

import {GetAddressParametersType, SendParametersType} from '../types';
import {Wallet} from './wallet';

export class Keychain {
  tw: WalletCore;
  hdwallet: HDWallet;
  wallets: Wallet[];

  constructor(args: {mnemonic: string; tw: WalletCore}) {
    const {mnemonic, tw} = args;

    this.tw = tw;
    this.hdwallet = tw.HDWallet.createWithMnemonic(mnemonic, '');
    this.wallets = [new Wallet({keychain: this, walletId: 0})];
  }

  getAddress = async (
    params: GetAddressParametersType
  ): Promise<{
    address: string;
    memo?: string;
  }> => {
    const wallet = this.wallets[params.wallet];
    return wallet.getAddress(params);
  };

  send = async (params: SendParametersType) => {
    const wallet = this.wallets[params.walletId];
    return wallet.send(params);
  };
}
