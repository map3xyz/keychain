import {initWasm} from '@trustwallet/wallet-core';
import {GetAddressParametersType} from './types';

export const getAddress = async (
  {user, assetId, custody, wallet}: GetAddressParametersType,
  apiKey: string
): Promise<{
  address: string;
  memo?: string;
}> => {
  if (!process.env.MNEMONIC) {
    throw new Error('MNEMONIC not set');
  }
  const {CoinType, HDWallet, AnyAddress} = await initWasm();
  const hdwallet = HDWallet.createWithMnemonic(process.env.MNEMONIC, '');
  // call store get the next index for org, asset, custody
  const key = hdwallet.getKeyForCoin({value: bip44Path});
  const pubKey = key.getPublicKeySecp256k1(false);
  const address = AnyAddress.createWithPublicKey(pubKey, CoinType.ethereum);
  return {address: address.description()};
};

// preMVP
(async function () {
  const start = new Date().getTime();
  console.log('Initializing Wasm...');
  const {CoinType, HexCoding, HDWallet, AnyAddress} = await initWasm();
  console.log(`Done in ${new Date().getTime() - start} ms`);

  const wallet = HDWallet.create(256, '');
  const key = wallet.getKeyForCoin(CoinType.ethereum);
  const pubKey = key.getPublicKeySecp256k1(false);
  const address = AnyAddress.createWithPublicKey(pubKey, CoinType.ethereum);

  // Derive addresses using bip-44 paths
  const key0 = wallet.getDerivedKey(CoinType.ethereum, 0, 0, 0);
  const pubkey0 = key0.getPublicKeySecp256k1(false);
  const address0 = AnyAddress.createWithPublicKey(pubkey0, CoinType.ethereum);

  console.log(`Create wallet: ${wallet.mnemonic()}`);
  console.log(`Get Ethereum public key: ${HexCoding.encode(pubKey.data())}`);
  console.log(`Get Ethereum address: ${address.description()}`);
  console.log(`CoinType.ethereum.value = ${CoinType.ethereum.value}`);
  // console.log('Ethereum protobuf models: \n', TW.Ethereum);

  console.log(`ETH address 0: ${address0.description()}`);
  console.log(
    `ETH addresses match: ${address0.description() === address.description()}`
  );

  wallet.delete();
  key.delete();
  pubKey.delete();
  address.delete();
})();
