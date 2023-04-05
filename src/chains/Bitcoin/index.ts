import {WalletCore} from '@trustwallet/wallet-core';

import Chain from '../types';

class Bitcoin implements Chain {
  tw: WalletCore;
  coinType: WalletCore['CoinType']['bitcoin'];
  bip44Path: number;

  constructor(args: {bip44Path: number; tw: WalletCore}) {
    const {bip44Path, tw} = args;
    this.tw = tw;
    this.bip44Path = bip44Path;

    switch (bip44Path) {
      case 2:
        this.coinType = this.tw.CoinType.litecoin;
        break;
      default:
        this.coinType = this.tw.CoinType.bitcoin;
    }
  }

  getDerivation = () => {
    const {Derivation} = this.tw;
    switch (this.bip44Path) {
      case 1:
        return Derivation.bitcoinTestnet;
      default:
        return Derivation.bitcoinSegwit;
    }
  };

  deriveAddress = (publicKey: WalletCore['PublicKey']['prototype']) => {
    const {AnyAddress} = this.tw;
    const derivation = this.getDerivation();
    const address = AnyAddress.createWithPublicKeyDerivation(
      publicKey,
      this.coinType,
      derivation
    );
    return address.description();
  };
}

export default Bitcoin;
