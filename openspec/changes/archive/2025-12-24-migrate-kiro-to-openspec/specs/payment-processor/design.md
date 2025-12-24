## Context
Lightning Network payment execution using Breez SDK Spark.

## Decisions
- **Breez SDK Spark**: Use as the primary interface for all Lightning operations (WASM-based).
- **LNURL-pay**: Support parsing and paying LNURLs via `sdk.parseLnurl` and `sdk.payLnurl`.
- **Payment History**: Keep a local cache of transactions for quick UI rendering.
- **External Wallets**: Support QR code generation for users without a local wallet balance.
