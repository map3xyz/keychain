import axios from 'axios';

import config from '../map3.config.example.json';
import {getNextReceiveIndex, getUTXOs, registerAddress} from '../src/store-api';

const headers = {
  'Content-Type': 'application/json',
  authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb25zb2xlIiwib3JnX2lkIjoiZjQ5ZWNkNGMtNTkyMy00Y2M5LWE4NTQtYWFjZGYzNjliOTdlIiwicm9sZXMiOlsicmVhZCIsIndyaXRlIl0sImlhdCI6MTY4MDYxMTU3MCwiZXhwIjoxNzEyMTQ3NTcwfQ.1HeMAiSEJzkA_x06c_Nk4oH_7ckZzNsjlyaO-Kca7R0',
};

describe('router', () => {
  it('getNextReceiveIndex', () => {
    jest.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        bip44Path: 0,
        index: 0,
        isRegistered: false,
        keychainId: 'keychain-uuid',
      },
    });
    const result = getNextReceiveIndex({
      accessToken: config.wallets[0].apiKey,
      assetId: 'bitcoin',
      userId: 'asdf',
      walletId: 0,
    });
    expect(result).resolves.toEqual({
      bip44Path: 0,
      index: 0,
      isRegistered: false,
      keychainId: 'keychain-uuid',
    });
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.MAP3_STORE_API}/api/store/keychain-address/address-index`,
      {
        accessToken: config.wallets[0].apiKey,
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
      keychainId: 'keychain-uuid',
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
        keychainId: 'keychain-uuid',
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
      amount: 1000,
      assetId: 'bitcoin',
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
        amount: 1000,
        assetId: 'bitcoin',
        userId: 'asdf',
        walletId: 0,
      },
      {
        headers,
      }
    );
  });
});
