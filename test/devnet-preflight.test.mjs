import assert from 'node:assert/strict';
import test from 'node:test';
import { checkDevnetRpc, PUBLIC_DEVNET_RPC } from '../lib/devnet-preflight.mjs';

const DEVNET_HASH = 'GH7ome3EiwEr7tu9JuTh2dpYWBJK3z69Xm1ZE3MEE6JC';
const OTHER_HASH = '11111111111111111111111111111111';

function rpcResponse(hash = DEVNET_HASH) {
  return { ok: true, json: async () => ({ jsonrpc: '2.0', id: 1, result: hash }) };
}

test('public devnet endpoint needs one read-only RPC call', async () => {
  const calls = [];
  await checkDevnetRpc({ fetchImpl: async (url, request) => {
    calls.push({ url, request });
    return rpcResponse();
  } });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, PUBLIC_DEVNET_RPC);
  assert.equal(JSON.parse(calls[0].request.body).method, 'getGenesisHash');
});

test('custom endpoint passes only when its genesis hash matches devnet', async () => {
  const calls = [];
  await checkDevnetRpc({ rpcUrl: 'https://rpc.example.test/path?token=private', fetchImpl: async (url) => {
    calls.push(url);
    return rpcResponse();
  } });
  assert.equal(calls.length, 2);
});

test('mainnet or another cluster fails closed', async () => {
  await assert.rejects(checkDevnetRpc({ rpcUrl: 'https://rpc.example.test', fetchImpl: async (url) =>
    rpcResponse(url === PUBLIC_DEVNET_RPC ? DEVNET_HASH : OTHER_HASH),
  }), /does not match Solana devnet/);
});

test('insecure or credential-bearing endpoint is rejected before any request', async () => {
  let called = false;
  const fetchImpl = async () => { called = true; return rpcResponse(); };
  for (const rpcUrl of ['http://rpc.example.test', 'https://user:password@rpc.example.test', 'not-a-url']) {
    await assert.rejects(checkDevnetRpc({ rpcUrl, fetchImpl }), /HTTPS URL/);
  }
  assert.equal(called, false);
});

test('provider errors never expose its URL', async () => {
  const rpcUrl = 'https://rpc.example.test/path?token=private';
  let calls = 0;
  await assert.rejects(checkDevnetRpc({ rpcUrl, fetchImpl: async () => {
    calls += 1;
    if (calls === 1) return rpcResponse();
    throw new Error(`failed at ${rpcUrl}`);
  } }), (error) => error.message === 'RPC request failed.' && !error.message.includes('private'));
});
