import {getNextReceiveIndex} from '../src/router';
import axios from 'axios';

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
      user: 'asdf',
      assetId: 'bitcoin',
      custody: 'internal',
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
        custody: 'internal',
        user: 'asdf',
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
