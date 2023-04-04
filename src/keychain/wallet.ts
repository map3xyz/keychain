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
    const {AnyAddress} = this.#keychain.tw;
    const {addressIndex, bip44Path} = params;
    const key = this.#keychain.hdwallet.getDerivedKey(
      {value: bip44Path},
      this.walletId,
      0,
      addressIndex
    );
    const pubKey = key.getPublicKey({value: bip44Path});
    const address = AnyAddress.createWithPublicKey(pubKey, {value: bip44Path});
    return address.description();
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
    const {addressIndex, bip44Path, isRegistered, keychainId} =
      await storeAPI.getNextReceiveIndex({...params, accessToken: this.apiKey});

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
        keychainId,
      });
    }
    return {address};
  };

  send = async (
    params: SendParametersType
  ): Promise<{
    txId: string;
  }> => {
    const utxos = await storeAPI.getUTXOs(params);
    return {txId: 'txId'};
  };
}
