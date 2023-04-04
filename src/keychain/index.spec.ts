import {initWasm} from '@trustwallet/wallet-core';

import config from '../../map3.config.example.json';
import * as storeApi from '../store-api';
import {Keychain} from '.';

let keychain: Keychain;

describe('keychain', () => {
  beforeAll(async () => {
    const tw = await initWasm();
    keychain = new Keychain({
      config,
      mnemonic: process.env.MNEMONIC!,
      tw,
    });
  });

  describe('send', () => {
    it('bitcoin', async () => {
      jest.spyOn(storeApi, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 0,
        isRegistered: false,
        keychainId: 'keychain-uuid',
      });
      jest.spyOn(storeApi, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      jest.spyOn(storeApi, 'getUTXOs').mockResolvedValueOnce([
        {
          block_height: 302013,
          confirmations: 63066,
          confirmed: '2014-05-22T03:46:25Z',
          double_spend: false,
          ref_balance: 4433416,
          spent: false,
          tx_hash:
            '14b1052855bbf6561bc4db8aa501762e7cc1e86994dda9e782a6b73b1ce0dc1e',
          tx_input_n: -1,
          tx_output_n: 0,
          value: 20213,
        },
      ]);

      keychain.send({
        amount: 10000,
        assetId: 'bitcoin',
        userId: 'asdf',
        walletId: 0,
      });

      expect(storeApi.getUTXOs).toBeCalledWith({
        amount: 10000,
        assetId: 'bitcoin',
        userId: 'asdf',
        walletId: 0,
      });
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
        keychainId: 'keychain-uuid',
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
        keychainId: 'keychain-uuid',
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
        keychainId: 'keychain-uuid',
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
        keychainId: 'keychain-uuid',
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
        keychainId: 'keychain-uuid',
        userId: 'asdf',
        walletId: 0,
      });
    });
    it('does not return address if registration fails', async () => {
      jest.spyOn(storeApi, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 2,
        isRegistered: false,
        keychainId: 'keychain-uuid',
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
