import {WalletCore} from '@trustwallet/wallet-core';

interface Chain {
  bip44Path: number;
  buildTransaction: (
    privateKey: Uint8Array,
    to: string,
    amount: string
  ) => string;
  coinType: WalletCore['CoinType']['bitcoin'];
  deriveAddress: (publicKey: WalletCore['PublicKey']['prototype']) => string;
}

export type ChainArgs = {
  bip44Path: number;
  tw: WalletCore;
};

export default Chain;
