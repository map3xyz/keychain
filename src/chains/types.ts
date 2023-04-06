import {WalletCore} from '@trustwallet/wallet-core';

interface Chain {
  bip44Path: number;
  buildTransaction: (params: {
    amount: string;
    change?: string;
    privateKey: WalletCore['PrivateKey']['prototype'];
    to: string;
  }) => string;
  coinType: WalletCore['CoinType']['bitcoin'];
  deriveAddress: (publicKey: WalletCore['PublicKey']['prototype']) => string;
}

export type ChainArgs = {
  bip44Path: number;
  tw: WalletCore;
};

export default Chain;
