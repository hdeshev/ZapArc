## ADDED Requirements

### Requirement: Wallet Onboarding and Setup
The system SHALL provide a non-custodial onboarding process for generating or importing BIP39 mnemonic seeds.

#### Scenario: Generate New Wallet
- **WHEN** a user starts the onboarding wizard and selects "Create New Wallet"
- **THEN** the system SHALL display a new 12-word recovery mnemonic and require confirmation of backup.

#### Scenario: Import Existing Wallet
- **WHEN** a user selects "Import Wallet"
- **THEN** the system SHALL allow the user to input their existing BIP39 mnemonic seed.

### Requirement: Secure Key Storage
The system MUST encrypt sensitive wallet data before storing it locally.

#### Scenario: Encrypt Wallet with PIN
- **WHEN** a user completes wallet setup
- **THEN** the system SHALL encrypt the mnemonic using AES-256 with a key derived from a user-provided PIN and store it in `chrome.storage.local`.

### Requirement: Wallet Access and Auto-lock
The system SHALL manage access to the wallet based on authentication and activity.

#### Scenario: Auto-lock after Inactivity
- **WHEN** the extension has been idle for more than 15 minutes
- **THEN** the system SHALL auto-lock the wallet and require the PIN to be re-entered.

### Requirement: Wallet Operations
The system SHALL support core Lightning Network operations (Balance, Deposit, Withdrawal).

#### Scenario: View Balance
- **WHEN** a user opens the extension and the wallet is unlocked
- **THEN** the system SHALL display the current Lightning balance retrieved via Breez SDK.

#### Scenario: Deposit Funds
- **WHEN** a user requests to deposit funds
- **THEN** the system SHALL generate a Lightning Network invoice and display it as a QR code.

#### Scenario: Withdraw Funds
- **WHEN** a user provides a Lightning address or on-chain Bitcoin address
- **THEN** the system SHALL allow sending funds from the wallet.

### Requirement: Privacy Protection
The system SHALL ensure user privacy by keeping data local and minimizing tracking.

#### Scenario: Local Transaction History
- **WHEN** a transaction is completed
- **THEN** the system SHALL store the transaction history only in the local browser storage.

#### Scenario: Minimal Tracking
- **WHEN** the extension is operating
- **THEN** it SHALL NOT track user browsing behavior beyond tip-related activities.
