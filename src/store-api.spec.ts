import axios from 'axios';

import {utxos} from '../__mocks__';
import config from '../map3.config.example.json';
import {getNextReceiveIndex, getUTXOs, registerAddress} from '../src/store-api';

const headers = {
  'Content-Type': 'application/json',
  authorization: `Bearer ${config.storeApiKey}`,
};

describe('router', () => {
  it('getNextReceiveIndex', () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        bip44Path: 0,
        index: 0,
        isRegistered: false,
      },
    });
    const result = getNextReceiveIndex({
      assetId: 'bitcoin',
      userId: 'asdf',
      walletId: 0,
    });
    expect(result).resolves.toEqual({
      bip44Path: 0,
      index: 0,
      isRegistered: false,
    });
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.MAP3_STORE_API}/api/store/keychain-address/address-index`,
      {
        assetId: 'bitcoin',
        userId: 'asdf',
        walletId: 0,
      },
      {
        headers,
      }
    );
  });
  it('registerAddress', () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        status: 'ok',
      },
    });
    const result = registerAddress({
      address: 'asdf',
      addressIndex: 0,
      assetId: 'bitcoin',
      bip44Path: 0,
      memo: 'asdf',
      userId: 'asdf',
      walletId: 0,
    });
    expect(result).resolves.toEqual({
      status: 'ok',
    });
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.MAP3_STORE_API}/api/store/keychain-address/register-address`,
      {
        address: 'asdf',
        addressIndex: 0,
        assetId: 'bitcoin',
        bip44Path: 0,
        memo: 'asdf',
        userId: 'asdf',
        walletId: 0,
      },
      {
        headers,
      }
    );
  });
  it('getUTXOs', () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: utxos,
    });
    const result = getUTXOs({
      address: 'bc1qpsp72plnsqe6e2dvtsetxtww2cz36ztmfxghpd',
      assetId: 'bitcoin',
    });

    expect(result).resolves.toEqual([
      {
        block_height: 2427702,
        confirmations: 832,
        confirmed: '2023-04-06T18:09:22Z',
        double_spend: false,
        ref_balance: 1544819,
        spent: false,
        tx_hash:
          '896a3ccf29d7ced5b2b490d64e74ee9057f2f82bab60d8131cb3ad5c0626275e',
        tx_input_n: -1,
        tx_output_n: 1,
        value: 1544819,
      },
    ]);
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.MAP3_STORE_API}/api/store/keychain-address/utxos`,
      {
        address: 'bc1qpsp72plnsqe6e2dvtsetxtww2cz36ztmfxghpd',
        assetId: 'bitcoin',
      },
      {
        headers,
      }
    );
  });
});
