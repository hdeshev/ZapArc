# Project Context

## Purpose
A non-custodial Bitcoin tipping browser extension powered by the Lightning Network and Breez SDK Spark. It enables seamless tipping across any website by standardizing the tipping format (`[lntip:lnurl:<address>:<amounts>]`), detecting these requests, and providing an integrated wallet for payments.

## Tech Stack
- **Language**: TypeScript
- **Platform**: Chrome Extension (Manifest V3)
- **Lightning Integration**: Breez SDK Spark (`@breeztech/breez-sdk-spark`)
- **Build Tools**: Webpack, ts-loader
- **Cryptography**: `bip39`, `crypto-browserify` (AES-256 for wallet encryption)
- **UI**: Vanilla HTML/CSS/TypeScript, `qrcode` for payment generation

## Project Conventions

### Code Style
- **Function Limits**: Max 50 lines per function.
- **Complexity**: Max 4 levels of nesting, max 4 parameters per function (use objects for more).
- **File Limits**: Max 300 lines per file; one responsibility per file.
- **Naming**: Consistent camelCase for variables/functions, PascalCase for classes/types.
- **Organization**: Group by feature/component (background, content, popup, settings).

### Architecture Patterns
- **Central Coordinator**: The background service worker manages the Breez SDK instance and coordinates state between all extension components.
- **Communication**: Use `chrome.runtime.sendMessage` and `chrome.tabs.sendMessage` for cross-component messaging.
- **State Management**: Sensitive data (mnemonic) is encrypted with AES-256 (PBKDF2 derivation from user PIN) and stored in `chrome.storage.local`.
- **Heuristic Detection**: Uses platform-specific selectors (Facebook, Twitter, Reddit) and generic heuristics for identifying posting areas on other sites.

### Testing Strategy
- **Manual Verification**: Use `test.html` and `test-settings.html` for local testing of tip detection and UI components.
- **Static Analysis**: Run `npm run type-check` for TypeScript validation.
- **Unit Testing**: Jest for business logic (mocking Breez SDK and Chrome APIs).

### Git Workflow
- **Commit Style**: Logical grouping of changes with descriptive messages (see `CLAUDE.md`).
- **Standard**: Follow standard Git flow with main branch and feature-based commits.

## Domain Context
- **Lightning Network**: P2P layer for instant Bitcoin payments.
- **LNURL**: A protocol for communication between Lightning wallets and services (specifically LNURL-pay).
- **Tip Format**: `[lntip:lnurl:<LNURL_STRING>:<SATS1>:<SATS2>:<SATS3>]` (e.g., `[lntip:lnurl:lnurl1...:100:500:1000]`).
- **Metadata Support**: Detection of `<meta name="lntip" content="...">` for site-wide tipping integration.

## Important Constraints
- **Non-Custodial**: Users must have full control over their keys; the extension must never transmit private keys or unencrypted mnemonics.
- **Performance**: DOM scanning must be throttled (max 1/sec) to avoid slowing down the user's browser.
- **Privacy**: No tracking or analytics without explicit opt-in; transaction history remains local.
- **Persistence**: Breez SDK state must be managed carefully within the ephemeral nature of Manifest V3 service workers.

## External Dependencies
- **Breez SDK Spark**: Primary interface for Lightning Network functionality.
- **Chrome Extension APIs**: For browser integration (Storage, Tabs, Runtime, Scripting).
- **LNURL Protocols**: For standardized payment requests and address resolution.
