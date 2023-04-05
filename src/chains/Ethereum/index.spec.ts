import {initWasm} from '@trustwallet/wallet-core';

import config from '../../../map3.config.example.json';
import {Keychain} from '../../keychain';
import * as storeApi from '../../store-api';

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

  describe('getAddress', () => {
    afterEach(() => {
      jest.restoreAllMocks();
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
        '0xA3Dcd899C0f3832DFDFed9479a9d828c6A4EB2A7'
      );
    });
  });
});
