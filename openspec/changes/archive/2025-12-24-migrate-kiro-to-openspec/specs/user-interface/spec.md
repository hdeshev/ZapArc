## ADDED Requirements

### Requirement: Floating Action Menu
The system SHALL provide a persistent floating menu for quick access to wallet and domain functions.

#### Scenario: Display Floating Icon
- **WHEN** visiting any website
- **THEN** the system SHALL display a draggable floating icon that opens a compact menu on click.

#### Scenario: Domain Management via Menu
- **WHEN** the floating menu is opened
- **THEN** it SHALL show the current domain status (unmanaged/whitelisted/disabled) and allow the user to toggle tipping functionality for that site.

### Requirement: Global Settings and Configuration
The system SHALL provide a central interface for managing user preferences.

#### Scenario: Configure Custom LNURL
- **WHEN** a user provides a custom LNURL-pay address in settings
- **THEN** the system SHALL use that address for all future tip requests instead of the built-in wallet address.

#### Scenario: Customize Default Amounts
- **WHEN** a user updates their default tipping or posting amounts in settings
- **THEN** the system SHALL validate the values and apply them to all future interactions.
