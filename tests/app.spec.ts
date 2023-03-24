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
        bip44Path: 0,
        addressIndex: 0,
        isRegistered: false,
      });
      jest.spyOn(router, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      const {address} = await keychain.getAddress({
        userId: 'asdf',
        assetId: 'bitcoin',
        custody: 'internal',
        wallet: 0,
      });

      expect(address).toBe('bc1qyvlz4t2y9c9ksfd7uu9kfv8rmhhjxvfwrnyqmc');
    });
    it('ethereum', async () => {
      jest.spyOn(router, 'getNextReceiveIndex').mockResolvedValueOnce({
        bip44Path: 60,
        addressIndex: 0,
        isRegistered: false,
      });
      jest.spyOn(router, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      const {address} = await keychain.getAddress({
        userId: 'asdf',
        assetId: 'ethereum',
        custody: 'internal',
        wallet: 0,
      });

      expect(address).toStrictEqual(
        '0x7ec628b32e1bd65a8716e5829B195b5241F63632'
      );
    });
    it('litecoin', async () => {
      jest.spyOn(router, 'getNextReceiveIndex').mockResolvedValueOnce({
        bip44Path: 2,
        addressIndex: 0,
        isRegistered: false,
      });
      jest.spyOn(router, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      const {address} = await keychain.getAddress({
        userId: 'asdf',
        assetId: 'litcoin',
        custody: 'internal',
        wallet: 0,
      });

      expect(address).toBe('ltc1qaetzxxme6h7qhwg5lvjff3tagjtdn5gkpnl005');
    });
    it('registers address', async () => {
      jest.spyOn(router, 'getNextReceiveIndex').mockResolvedValueOnce({
        bip44Path: 2,
        addressIndex: 0,
        isRegistered: false,
      });
      jest.spyOn(router, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });

      const {address} = await keychain.getAddress({
        userId: 'asdf',
        assetId: 'litecoin',
        custody: 'internal',
        wallet: 0,
      });

      expect(address).toBe('ltc1qaetzxxme6h7qhwg5lvjff3tagjtdn5gkpnl005');
      expect(router.registerAddress).toHaveBeenCalledWith({
        userId: 'asdf',
        assetId: 'litecoin',
        custody: 'internal',
        wallet: 0,
        address: 'ltc1qaetzxxme6h7qhwg5lvjff3tagjtdn5gkpnl005',
        bip44Path: 2,
        addressIndex: 0,
      });
    });
  });
});
