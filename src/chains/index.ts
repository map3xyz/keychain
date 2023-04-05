import Bitcoin from '../chains/Bitcoin';
import Ethereum from '../chains/Ethereum';
import {ChainArgs} from '../chains/types';

export default (args: ChainArgs) => {
  const {bip44Path, tw} = args;
  switch (bip44Path) {
    case 0:
    case 1:
    case 2:
      return new Bitcoin({bip44Path, tw});
    case 60:
      return new Ethereum({bip44Path, tw});
    default:
      throw new Error(`Unknown bip44Path: ${bip44Path}`);
  }
};
