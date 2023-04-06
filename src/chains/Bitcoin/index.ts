import {TW, WalletCore} from '@trustwallet/wallet-core';

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

  // get UTXOs
  // get fee
  buildTransaction: Chain['buildTransaction'] = ({amount, privateKey, to}) => {
    const {AnySigner, BitcoinScript, HexCoding} = this.tw;

    const utxos = [
      {
        block_height: 2427702,
        confirmations: 5,
        confirmed: '2023-04-06T18:09:22Z',
        double_spend: false,
        ref_balance: 1544819,
        spent: false,
        tx_hash:
          '896a3ccf29d7ced5b2b490d64e74ee9057f2f82bab60d8131cb3ad5c0626275e',
        tx_input_n: -1,
        tx_output_n: 1,
        value: 1544819,
      },
    ];
    const pubKey = privateKey.getPublicKey(this.coinType);
    const from = this.deriveAddress(pubKey);

    const txInput = TW.Bitcoin.Proto.SigningInput.create({
      amount: 546,
      byteFee: 1,
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
    const data = JSON.stringify(output.toJSON());
    console.log(HexCoding.encode(output.encoded));
    console.log(data);
    return data;
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
