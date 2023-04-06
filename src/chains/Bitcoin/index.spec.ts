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
    // Known issue
    // deriving addresses from coins that don't exist on TW CoinType enum
    it.skip('bitcoin testnet', async () => {
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

  describe('send', () => {
    it('bitcoin', async () => {
      jest.spyOn(storeApi, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 1,
        isRegistered: false,
      });

      const tx = await keychain.send({
        amount: '546',
        assetId: 'bitcoin-testnet',
        to: 'tb1q5tjzphlnyhdltv7v9mw2hjyqk7zdzl49z8c7xd',
        userId: 'asdf',
        walletId: 0,
      });

      expect(tx).toBe(
        '0x010000000001015e2726065cadb31c13d860ab2bf8f25790ee744ed690b4b2d5ced729cf3c6a890100000000ffffffff022202000000000000160014a2e420dff325dbf5b3cc2edcabc880b784d17ea5c48f1700000000001600140c03e507f38033aca9ac5c32b32dce56051d097b024830450221008955468e7f0fe2fcf567fe93a192c2b83c22e9ceea2df2f9cb63051b5cb26f43022015211f83eaceef41a7cf065e07b4c82aaf7986e33e17e2d903bb86bd5d16f0f0012102df9ef2a7a5552765178b181e1e1afdefc7849985c7dfe9647706dd4fa40df6ac00000000'
      );
    });
  });
});
