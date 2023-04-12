import {TW, WalletCore} from '@trustwallet/wallet-core';

import * as storeApi from '../../store-api';
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

  buildTransaction: Chain['buildTransaction'] = async ({
    amount,
    assetId,
    privateKey,
    to,
  }) => {
    const {AnySigner, BitcoinScript, HexCoding} = this.tw;

    const pubKey = privateKey.getPublicKey(this.coinType);
    const from = this.deriveAddress(pubKey);

    const fees = await storeApi.getFees({assetId});
    const utxos = await storeApi.getUTXOs({address: from, assetId});

    const txInput = TW.Bitcoin.Proto.SigningInput.create({
      amount,
      byteFee: fees.high,
      changeAddress: from,
      coinType: this.coinType.value,
      hashType: BitcoinScript.hashTypeForCoin(this.coinType),
      privateKey: [privateKey.data()],
      toAddress: to,
      utxo: utxos.map(utxo =>
        TW.Bitcoin.Proto.UnspentTransaction.create({
          amount: utxo.value,
          outPoint: {
            hash: HexCoding.decode(utxo.tx_hash).reverse(),
            index: utxo.tx_output_n,
            sequence: 4294967295,
          },
          script: BitcoinScript.lockScriptForAddress(
            from,
            this.coinType
          ).data(),
        })
      ),
    });

    const input = TW.Bitcoin.Proto.SigningInput.encode(txInput).finish();
    const txOutput = AnySigner.sign(input, this.coinType);
    const output = TW.Bitcoin.Proto.SigningOutput.decode(txOutput);

    return HexCoding.encode(output.encoded);
  };

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
