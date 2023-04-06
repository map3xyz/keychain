import ChainFactory from '../chains';
import * as storeAPI from '../store-api';
import {
  GetAddressParametersType,
  RegisterAddressParametersType,
  SendParametersType,
} from '../types';
import {Keychain} from '.';

export class Wallet {
  #keychain: Keychain;
  walletId: number;
  apiKey: string;
  name: string;

  constructor(args: {
    apiKey: string;
    keychain: Keychain;
    name: string;
    walletId: number;
  }) {
    this.#keychain = args.keychain;
    this.walletId = args.walletId;
    this.apiKey = args.apiKey;
    this.name = args.name;
  }

  private deriveAddressFromPath = (params: {
    addressIndex: number;
    bip44Path: number;
  }) => {
    const {addressIndex, bip44Path} = params;
    const Chain = ChainFactory({bip44Path, tw: this.#keychain.tw});
    const key = this.#keychain.hdwallet.getDerivedKey(
      Chain.coinType,
      this.walletId,
      0,
      addressIndex
    );
    const pubKey = key.getPublicKey(Chain.coinType);
    const chain = ChainFactory({bip44Path, tw: this.#keychain.tw});
    return chain.deriveAddress(pubKey);
  };

  private registerAddress = async (params: RegisterAddressParametersType) => {
    const registration = await storeAPI.registerAddress(params);

    if (registration.status !== 'ok') {
      throw new Error('Address registration failed');
    }
  };

  getAddress = async (
    params: GetAddressParametersType
  ): Promise<{
    address: string;
    memo?: string;
  }> => {
    const {addressIndex, bip44Path, isRegistered} =
      await storeAPI.getNextReceiveIndex(params);

    const address = this.deriveAddressFromPath({
      addressIndex,
      bip44Path,
    });

    if (!isRegistered) {
      await this.registerAddress({
        ...params,
        address,
        addressIndex,
        bip44Path,
      });
    }
    return {address};
  };

  send = async (params: SendParametersType): Promise<string> => {
    const {amount, to} = params;
    const {addressIndex, bip44Path, isRegistered} =
      await storeAPI.getNextReceiveIndex(params);
    const Chain = ChainFactory({bip44Path, tw: this.#keychain.tw});

    const key = this.#keychain.hdwallet.getDerivedKey(
      Chain.coinType,
      this.walletId,
      0,
      addressIndex
    );

    const tx = Chain.buildTransaction(key.data(), to, amount);
    return tx;
  };
}
