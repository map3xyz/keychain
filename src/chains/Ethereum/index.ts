import {TW, WalletCore} from '@trustwallet/wallet-core';
import {EthereumMessageSigner} from '@trustwallet/wallet-core/dist/src/wallet-core';

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

  // get nonce
  // get gas price
  // get gas limit
  buildTransaction = (privateKey: Uint8Array, to: string, _amount: string) => {
    const {AnySigner, HexCoding} = this.tw;
    const gasPrice = '0x6FC23AC00'; // 30000000000 (30 Gwei)
    const gasLimit = '0x5208'; // 21000
    const nonce = '0x1';
    const chainId = '0x5';
    const amount = '0x3362EE6E0800'; // 56500000000000 (0.0000565 ETH)

    const input = TW.Ethereum.Proto.SigningInput.create({
      chainId: HexCoding.decode(chainId),
      gasLimit: HexCoding.decode(gasLimit),
      gasPrice: HexCoding.decode(gasPrice),
      nonce: HexCoding.decode(nonce),
      privateKey,
      toAddress: to,
      transaction: TW.Ethereum.Proto.Transaction.create({
        transfer: TW.Ethereum.Proto.Transaction.Transfer.create({
          amount: HexCoding.decode(amount),
        }),
      }),
    });

    const encoded = TW.Ethereum.Proto.SigningInput.encode(input).finish();
    const outputData = AnySigner.sign(encoded, this.coinType);
    const output = TW.Ethereum.Proto.SigningOutput.decode(outputData);

    return HexCoding.encode(output.encoded);
  };

  deriveAddress = (publicKey: WalletCore['PublicKey']['prototype']) => {
    const {AnyAddress} = this.tw;
    const address = AnyAddress.createWithPublicKey(publicKey, this.coinType);
    return address.description();
  };
}

export default Ethereum;
