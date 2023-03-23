import {getAddress} from '../src/app';

jest.mock('../src/router', () => ({
  getNextReceiveIndex: jest.fn().mockResolvedValue({
    bip44Path: 0,
    index: 0,
    isRegistered: false,
  }),
}));

describe('app', () => {
  describe('getAddress', () => {
    it('runs', async () => {
      const address = await getAddress({
        user: 'asdf',
        assetId: 'bitcoin',
        custody: 'internal',
        wallet: 0,
      });

      expect(address).toStrictEqual({
        address: 'bc1qyvlz4t2y9c9ksfd7uu9kfv8rmhhjxvfwrnyqmc',
      });
    });
  });
});
