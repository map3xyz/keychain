import {WalletCore} from '@trustwallet/wallet-core';

import Chain from '../types';

class Ethereum implements Chain {
  tw: WalletCore;
  coinType: WalletCore['CoinType']['ethereum'];
  bip44Path: number;

  constructor(args: {bip44Path: number; tw: WalletCore}) {
    const {bip44Path, tw} = args;
    this.tw = tw;
    this.bip44Path = bip44Path;
    this.coinType = this.tw.CoinType.ethereum;
  }

  deriveAddress = (publicKey: WalletCore['PublicKey']['prototype']) => {
    const {AnyAddress} = this.tw;
    const address = AnyAddress.createWithPublicKey(publicKey, this.coinType);
    return address.description();
  };
}

export default Ethereum;
