import {initWasm} from '@trustwallet/wallet-core';

import * as storeApi from '../store-api';
import {Keychain} from '.';

let keychain: Keychain;

describe('keychain', () => {
  beforeAll(async () => {
    const tw = await initWasm();
    keychain = new Keychain({
      mnemonic: process.env.MNEMONIC!,
      tw,
    });
  });

  describe('getAddress', () => {
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

      expect(address).toBe('bc1qyvlz4t2y9c9ksfd7uu9kfv8rmhhjxvfwrnyqmc');
    });
    it('ethereum', async () => {
      jest.spyOn(storeApi, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 60,
        isRegistered: false,
      });
      jest.spyOn(storeApi, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      const {address} = await keychain.getAddress({
        assetId: 'ethereum',
        userId: 'asdf',
        walletId: 0,
      });

      expect(address).toStrictEqual(
        '0x7ec628b32e1bd65a8716e5829B195b5241F63632'
      );
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
        assetId: 'litcoin',
        userId: 'asdf',
        walletId: 0,
      });

      expect(address).toBe('ltc1qaetzxxme6h7qhwg5lvjff3tagjtdn5gkpnl005');
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

      expect(address).toBe('ltc1qaetzxxme6h7qhwg5lvjff3tagjtdn5gkpnl005');
      expect(storeApi.registerAddress).toHaveBeenCalledWith({
        address: 'ltc1qaetzxxme6h7qhwg5lvjff3tagjtdn5gkpnl005',
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
