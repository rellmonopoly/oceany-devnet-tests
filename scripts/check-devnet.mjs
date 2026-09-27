import { checkDevnetRpc } from '../lib/devnet-preflight.mjs';

try {
  await checkDevnetRpc({ rpcUrl: process.env.DEVNET_RPC_URL });
  process.stdout.write('Devnet RPC preflight passed.\n');
} catch (error) {
  process.stderr.write(`Devnet RPC preflight failed: ${error.message}\n`);
  process.exitCode = 1;
}
