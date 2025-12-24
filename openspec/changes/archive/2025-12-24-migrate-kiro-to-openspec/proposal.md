# Change: Migrate Kiro Specs to OpenSpec

## Why
The project is transitioning from Kiro to OpenSpec for better specification-driven development and tracking of changes.

## What Changes
- Formalize all requirements from `.kiro/specs/lightning-tipping-extension/` into OpenSpec capabilities.
- Reformat requirements into the `SHALL`/`MUST` format with explicit `#### Scenario:` headers.
- Split the monolithic design document into capability-specific technical patterns.

## Impact
- Affected specs: `wallet`, `tipping-detection`, `payment-processor`, `posting-integration`, `user-interface`.
- Affected code: None (this is a documentation and process migration).
