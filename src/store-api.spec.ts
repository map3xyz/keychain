import axios from 'axios';

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
      data: [
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
      ],
    });
    const result = getUTXOs({
      amount: '1000',
      assetId: 'bitcoin',
      to: '1GVb4mfQrvymPLz7zeZ3LnQ8sFv3NedZXe',
      userId: 'asdf',
      walletId: 0,
    });

    expect(result).resolves.toEqual([
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
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.MAP3_STORE_API}/api/store/keychain-address/utxos`,
      {
        amount: '1000',
        assetId: 'bitcoin',
        to: '1GVb4mfQrvymPLz7zeZ3LnQ8sFv3NedZXe',
        userId: 'asdf',
        walletId: 0,
      },
      {
        headers,
      }
    );
  });
});
