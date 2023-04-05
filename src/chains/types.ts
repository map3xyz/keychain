import {WalletCore} from '@trustwallet/wallet-core';

interface Chain {
  bip44Path: number;
  coinType: WalletCore['CoinType']['bitcoin'];

  deriveAddress: (publicKey: WalletCore['PublicKey']['prototype']) => string;
}

export type ChainArgs = {
  bip44Path: number;
  tw: WalletCore;
};

export default Chain;
