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

  describe('send', () => {
    it('ethereum', async () => {
      jest.spyOn(storeApi, 'getNextReceiveIndex').mockResolvedValueOnce({
        addressIndex: 0,
        bip44Path: 60,
        isRegistered: false,
      });
      jest.spyOn(storeApi, 'registerAddress').mockResolvedValueOnce({
        status: 'ok',
      });
      const txid = await keychain.send({
        amount: '1',
        assetId: 'ethereum',
        memo: 'test',
        to: '0xA3Dcd899C0f3832DFDFed9479a9d828c6A4EB2A7',
        userId: 'asdf',
        walletId: 0,
      });

      expect(txid).toBe(
        '0xf86a018506fc23ac0082520894a3dcd899c0f3832dfdfed9479a9d828c6a4eb2a7863362ee6e0800802ea0e300c8c94eccd46a8f894bab135fc718efbc07470043368011309b4f9364dcaea057c585ecc0574a85c1952d43cce1e23cbc25d143f0b6789481250f27e63e9c69'
      );
    });
  });
});
