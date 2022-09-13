import {createServer, IncomingMessage, ServerResponse} from 'http';
import {initWasm, TW} from '@trustwallet/wallet-core';

const hostname = '0.0.0.0';
const port = 8080;

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!!!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

(async function () {
  const start = new Date().getTime();
  console.log('Initializing Wasm...');
  const {CoinType, HexCoding, HDWallet, AnyAddress} = await initWasm();
  console.log(`Done in ${new Date().getTime() - start} ms`);

  const wallet = HDWallet.create(256, '');
  const key = wallet.getKeyForCoin(CoinType.ethereum);
  const pubKey = key.getPublicKeySecp256k1(false);
  const address = AnyAddress.createWithPublicKey(pubKey, CoinType.ethereum);

  console.log(`Create wallet: ${wallet.mnemonic()}`);
  console.log(`Get Ethereum public key: ${HexCoding.encode(pubKey.data())}`);
  console.log(`Get Ethereum address: ${address.description()}`);
  console.log(`CoinType.ethereum.value = ${CoinType.ethereum.value}`);
  console.log('Ethereum protobuf models: \n', TW.Ethereum);

  wallet.delete();
  key.delete();
  pubKey.delete();
  address.delete();
})();
