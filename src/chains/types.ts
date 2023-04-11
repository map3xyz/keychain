import {WalletCore} from '@trustwallet/wallet-core';

interface Chain {
  bip44Path: number;
  buildTransaction: (params: {
    amount: string;
    assetId: string;
    change?: string;
    privateKey: WalletCore['PrivateKey']['prototype'];
    to: string;
  }) => Promise<string>;
  coinType: WalletCore['CoinType']['bitcoin'];
  deriveAddress: (publicKey: WalletCore['PublicKey']['prototype']) => string;
}

export type ChainArgs = {
  bip44Path: number;
  tw: WalletCore;
};

export default Chain;
