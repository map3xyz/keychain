import {initWasm} from '@trustwallet/wallet-core';

import ChainFactory from '.';

describe('chains', () => {
  it('throws if bip44Path is not known', async () => {
    const tw = await initWasm();
    expect(() => ChainFactory({bip44Path: 999, tw})).toThrow(
      'Unknown bip44Path: 999'
    );
  });
});
