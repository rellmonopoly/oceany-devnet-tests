export const PUBLIC_DEVNET_RPC = 'https://api.devnet.solana.com';

function validateRpcUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('RPC endpoint must be an HTTPS URL.');
  }

  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password || url.hash) {
    throw new Error('RPC endpoint must be an HTTPS URL without embedded credentials or a fragment.');
  }

  return url.toString();
}

async function genesisHash(endpoint, fetchImpl) {
  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getGenesisHash' }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    // Provider errors may include a URL with an API token; keep output generic.
    throw new Error('RPC request failed.');
  }

  if (!response.ok) throw new Error('RPC returned an unsuccessful HTTP status.');

  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error('RPC returned invalid JSON.');
  }

  if (body?.jsonrpc !== '2.0' || body?.id !== 1 || typeof body?.result !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{32,64}$/.test(body.result)) {
    throw new Error('RPC returned an invalid genesis hash response.');
  }

  return body.result;
}

export async function checkDevnetRpc({ rpcUrl = PUBLIC_DEVNET_RPC, fetchImpl = globalThis.fetch } = {}) {
  const endpoint = validateRpcUrl(rpcUrl);
  const referenceHash = await genesisHash(PUBLIC_DEVNET_RPC, fetchImpl);
  if (endpoint === new URL(PUBLIC_DEVNET_RPC).toString()) return true;

  const endpointHash = await genesisHash(endpoint, fetchImpl);
  if (endpointHash !== referenceHash) {
    throw new Error('RPC endpoint does not match Solana devnet.');
  }

  return true;
}
