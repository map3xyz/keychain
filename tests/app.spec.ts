import {Keychain} from '../src/app';
import * as router from '../src/router';

const keychain = new Keychain(
  process.env.MNEMONIC!,
  process.env.STORE_API_KEY!
);

describe('app', () => {
  describe('getAddress', () => {
    it('bitcoin', async () => {
      jest.spyOn(router, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 0,
        isRegistered: false,
      });
      jest.spyOn(router, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      const {address} = await keychain.getAddress({
        assetId: 'bitcoin',
        custody: 'internal',
        userId: 'asdf',
        wallet: 0,
      });

      expect(address).toBe('bc1qyvlz4t2y9c9ksfd7uu9kfv8rmhhjxvfwrnyqmc');
    });
    it('ethereum', async () => {
      jest.spyOn(router, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 60,
        isRegistered: false,
      });
      jest.spyOn(router, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      const {address} = await keychain.getAddress({
        assetId: 'ethereum',
        custody: 'internal',
        userId: 'asdf',
        wallet: 0,
      });

      expect(address).toStrictEqual(
        '0x7ec628b32e1bd65a8716e5829B195b5241F63632'
      );
    });
    it('litecoin', async () => {
      jest.spyOn(router, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 2,
        isRegistered: false,
      });
      jest.spyOn(router, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      const {address} = await keychain.getAddress({
        assetId: 'litcoin',
        custody: 'internal',
        userId: 'asdf',
        wallet: 0,
      });

      expect(address).toBe('ltc1qaetzxxme6h7qhwg5lvjff3tagjtdn5gkpnl005');
    });
    it('registers address', async () => {
      jest.spyOn(router, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 2,
        isRegistered: false,
      });
      jest.spyOn(router, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });

      const {address} = await keychain.getAddress({
        assetId: 'litecoin',
        custody: 'internal',
        userId: 'asdf',
        wallet: 0,
      });

      expect(address).toBe('ltc1qaetzxxme6h7qhwg5lvjff3tagjtdn5gkpnl005');
      expect(router.registerAddress).toHaveBeenCalledWith({
        address: 'ltc1qaetzxxme6h7qhwg5lvjff3tagjtdn5gkpnl005',
        addressIndex: 0,
        assetId: 'litecoin',
        bip44Path: 2,
        custody: 'internal',
        userId: 'asdf',
        wallet: 0,
      });
    });
    it('does not return address if registration fails', async () => {
      jest.spyOn(router, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 2,
        isRegistered: false,
      });
      jest.spyOn(router, 'registerAddress').mockResolvedValueOnce({
        error: 'some error',
      });

      await expect(
        keychain.getAddress({
          assetId: 'litecoin',
          custody: 'internal',
          userId: 'asdf',
          wallet: 0,
        })
      ).rejects.toThrow('Address registration failed');
    });
  });
});
