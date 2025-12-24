## ADDED Requirements

### Requirement: Tipping Interface
The system SHALL provide a user interface to select tip amounts and initiate payments.

#### Scenario: Display Amount Options
- **WHEN** a valid tip request is detected
- **THEN** the system SHALL present 6 amount options (3 author-suggested, 3 user-configured defaults) and a custom input field.

### Requirement: Payment Execution
The system SHALL process payments using either the built-in wallet or external wallets.

#### Scenario: Pay with Built-in Wallet
- **WHEN** a user confirms a tip amount AND has an unlocked built-in wallet
- **THEN** the system SHALL execute the Lightning payment via Breez SDK and show a success/failure message.

#### Scenario: Pay with External Wallet
- **WHEN** a user chooses to show a QR code OR has no built-in wallet
- **THEN** the system SHALL generate and display an LNURL-pay QR code for external scanning.

### Requirement: Blacklist Management
The system SHALL allow users to block specific creators from showing tip prompts.

#### Scenario: Block LNURL
- **WHEN** a user selects "Block this LNURL" from a tip prompt
- **THEN** the system SHALL add it to a local blacklist and suppress future prompts for that LNURL.

### Requirement: Error Recovery
The system SHALL handle network and Lightning-specific errors gracefully.

#### Scenario: Insufficient Balance
- **WHEN** a user attempts a tip but has insufficient funds for the payment and fees
- **THEN** the system SHALL explain the shortfall and suggest a deposit.

#### Scenario: Network Interruption
- **WHEN** a payment fails due to connectivity issues
- **THEN** the system SHALL queue the payment for retry or provide manual fallback options.
