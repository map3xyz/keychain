import axios from 'axios';

import {getNextReceiveIndex, registerAddress} from '../src/store-api';

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
      wallet: 0,
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
        wallet: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb25zb2xlIiwib3JnX2lkIjoiYjQ5YzNjMDItZWJlMi00Y2U3LTgwNjAtODI0ODlmYjFiMDI5Iiwicm9sZXMiOlsiYW5vbnltb3VzIl0sImlhdCI6MTY2OTU5NjgzNywiZXhwIjoxNzAxMTMyODM3fQ.ZXzNFV4l4JMYExqyYPzxsF1lwyEeIMOYGgmkxI9puW0',
        },
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
      wallet: 0,
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
        wallet: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb25zb2xlIiwib3JnX2lkIjoiYjQ5YzNjMDItZWJlMi00Y2U3LTgwNjAtODI0ODlmYjFiMDI5Iiwicm9sZXMiOlsiYW5vbnltb3VzIl0sImlhdCI6MTY2OTU5NjgzNywiZXhwIjoxNzAxMTMyODM3fQ.ZXzNFV4l4JMYExqyYPzxsF1lwyEeIMOYGgmkxI9puW0',
        },
      }
    );
  });
});
