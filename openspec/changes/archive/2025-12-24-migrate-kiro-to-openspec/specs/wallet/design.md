## Context
Technical patterns for non-custodial wallet management and security.

## Decisions
- **Mnemonic Encryption**: Use AES-256 encryption for the mnemonic seed before storing.
- **Key Derivation**: Use PBKDF2 for deriving the encryption key from a user-provided PIN.
- **Storage**: Use `chrome.storage.local` for persistent storage of encrypted data.

## Risks / Trade-offs
- **PIN Dependency**: If a user loses their PIN, they MUST use their mnemonic to recover. The extension does not store the PIN or unencrypted mnemonic.
