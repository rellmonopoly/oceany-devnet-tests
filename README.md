# Oceany devnet tests

Public, synthetic test material for Oceany's Solana devnet product QA. This repository is separate from the marketplace application and contains no production credentials, customer data, or private release notes.

## Scope

- Check that a Solana RPC endpoint is on devnet before using a test wallet.
- Follow the [manual QA checklist](docs/qa-checklist.md) for creator minting, product association, listing boundaries, and wallet roles once the public test repository is ready.
- Use the clearly labeled [synthetic test image](fixtures/oceany-devnet-test.png) for a creator mint. It is a QA fixture, not the Oceany membership NFT or a sale asset.
- Keep test results and evidence in a private QA record. Publish only sanitized, reusable scripts and fixtures here.

This repository does **not** deploy the marketplace, enable sales, or perform a mint. Digital-only purchases remain unavailable until Oceany has a reviewed sale program. Physical and phygital payment testing has separate release gates.

## Run the preflight

Install Node.js 22 or newer, then run:

```powershell
npm test
npm run check:devnet
```

The check uses Solana's public devnet RPC by default. To check a different RPC endpoint, set `DEVNET_RPC_URL` in your local shell. Never commit a provider URL containing an API key. The command prints only a pass/fail result and never prints the endpoint.

```powershell
$env:DEVNET_RPC_URL = 'https://your-devnet-rpc.example'
npm run check:devnet
Remove-Item Env:DEVNET_RPC_URL
```

The script compares the endpoint's `getGenesisHash` result with Solana's [public devnet endpoint](https://solana.com/docs/references/clusters). Matching hashes are a basic cluster preflight, not a guarantee that a provider is trustworthy or that later transactions will succeed. It sends no transaction and needs no wallet. The public endpoint is rate-limited; do not use it as production infrastructure.

## Boundaries

Use only test wallets and synthetic product data on devnet. Devnet tokens have no monetary value and the network may reset. Never publish recovery phrases, secret keys, signed authentication challenges, customer information, private staging URLs, payment identifiers, or raw NFC tag identifiers. See [SECURITY.md](SECURITY.md).
