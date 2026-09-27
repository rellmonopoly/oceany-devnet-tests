# Oceany devnet manual QA checklist

Use synthetic products and distinct test wallets. Record pass/fail, date, browser/device, test role, and a sanitized evidence reference in a **private** QA record. A blocked step is not a pass. Do not commit addresses linked to real users, screenshots with personal data, wallet secrets, signed login messages, NFC identifiers, or private staging details.

## Before a mint

- [ ] The separate public `oceany-devnet-tests` repository exists and its contents have been reviewed.
- [ ] `npm test` and `npm run check:devnet` pass. The selected wallet and the marketplace both target Solana devnet.
- [ ] Creator and buyer use separate test wallets. The creator account is approved and can select a test collection.
- [ ] Test artwork and metadata are original or licensed for public use; no private storage URL is embedded.

## Creator and product

- [ ] Creator submits one synthetic NFT mint and receives a devnet transaction confirmation.
- [ ] NFT metadata and media resolve, and the mint belongs to the expected creator wallet and collection.
- [ ] The resulting marketplace product/collection association is correct.
- [ ] A second wallet cannot edit the creator's product or collection.
- [ ] A digital-only asset can be displayed, but its purchase action is unavailable while the custom sale program is pending.

## Listing and ownership boundaries

- [ ] A physical/phygital listing can be drafted and reviewed without enabling checkout.
- [ ] An unrelated wallet cannot list or transfer the product certificate.
- [ ] A resale attempt is blocked when delivery, return, refund, or dispute rules make it ineligible.
- [ ] Certificate handoff and NFC verification remain pending until a test item, completed eligible order, and writable NFC tag are available.

## After each run

- [ ] Confirm no production or mainnet transaction was sent.
- [ ] Keep raw evidence in the private QA record; publish only sanitized defects and reusable test assets.
- [ ] Stop and record the defect if network, wallet role, metadata, ownership, or sale boundaries do not match the expected result.

This checklist does not authorize live sales or remove the independent legal, tax, payment, and release gates for beta checkout. Mainnet Oceany membership NFT issuance is a separate workstream.
