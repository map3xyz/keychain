import {initWasm} from '@trustwallet/wallet-core';

import config from '../../../map3.config.example.json';
import {Keychain} from '../../keychain';
import * as storeApi from '../../store-api';

let keychain: Keychain;

describe('chains', () => {
  beforeAll(async () => {
    const tw = await initWasm();
    keychain = new Keychain({
      config,
      mnemonic: process.env.MNEMONIC!,
      tw,
    });
  });

  describe('getAddress', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('bitcoin', async () => {
      jest.spyOn(storeApi, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 0,
        isRegistered: false,
      });
      jest.spyOn(storeApi, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      const {address} = await keychain.getAddress({
        assetId: 'bitcoin',
        userId: 'asdf',
        walletId: 0,
      });

      expect(address).toBe('bc1qpsp72plnsqe6e2dvtsetxtww2cz36ztmfxghpd');
    });
    it('bitcoin testnet', async () => {
      jest.spyOn(storeApi, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 1,
        isRegistered: false,
      });
      jest.spyOn(storeApi, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      const {address} = await keychain.getAddress({
        assetId: 'bitcoin',
        userId: 'asdf',
        walletId: 0,
      });
      expect(address).toBe('tb1qq8p994ak933c39d2jaj8n4sg598tnkhnyk5sg5');
    });
    it('litecoin', async () => {
      jest.spyOn(storeApi, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 2,
        isRegistered: false,
      });
      jest.spyOn(storeApi, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      const {address} = await keychain.getAddress({
        assetId: 'litecoin',
        userId: 'asdf',
        walletId: 0,
      });

      expect(address).toBe('ltc1qrw5czevuyhhgzrz2ca6hd8ulncqwnl8dp6gtca');
    });
    it('registers address', async () => {
      jest.spyOn(storeApi, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 2,
        isRegistered: false,
      });
      jest.spyOn(storeApi, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });

      const {address} = await keychain.getAddress({
        assetId: 'litecoin',
        userId: 'asdf',
        walletId: 0,
      });

      expect(address).toBe('ltc1qrw5czevuyhhgzrz2ca6hd8ulncqwnl8dp6gtca');
      expect(storeApi.registerAddress).toHaveBeenCalledWith({
        address: 'ltc1qrw5czevuyhhgzrz2ca6hd8ulncqwnl8dp6gtca',
        addressIndex: 0,
        assetId: 'litecoin',
        bip44Path: 2,
        userId: 'asdf',
        walletId: 0,
      });
    });
    it('does not return address if registration fails', async () => {
      jest.spyOn(storeApi, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 2,
        isRegistered: false,
      });
      jest.spyOn(storeApi, 'registerAddress').mockResolvedValueOnce({
        error: 'some error',
      });

      await expect(
        keychain.getAddress({
          assetId: 'litecoin',
          userId: 'asdf',
          walletId: 0,
        })
      ).rejects.toThrow('Address registration failed');
    });
  });
});
