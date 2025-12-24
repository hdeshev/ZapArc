# tipping-detection Specification

## Purpose
TBD - created by archiving change migrate-kiro-to-openspec. Update Purpose after archive.
## Requirements
### Requirement: Standardized Tip Pattern Detection
The system SHALL scan page content for the universal tip format to identify tipping opportunities.

#### Scenario: Detect Tip in Text
- **WHEN** a page contains the pattern `[lntip:lnurl:<lnurl>:<amount1>:<amount2>:<amount3>]`
- **THEN** the system SHALL parse the LNURL and suggested amounts.

#### Scenario: Detect Tip in Metadata
- **WHEN** an HTML page contains `<meta name="lntip" content="...">`
- **THEN** the system SHALL parse the tip information from the metadata content.

### Requirement: Efficient Content Scanning
The system MUST perform background scanning without significantly impacting browser performance.

#### Scenario: Throttled Scanning
- **WHEN** the DOM content changes or a page is loaded
- **THEN** the system SHALL throttle scans to a maximum frequency of once per second.

### Requirement: Cross-Platform Consistency
The system SHALL operate identically across all websites and platforms.

#### Scenario: Generic Site Detection
- **WHEN** a user visits any website (Facebook, Twitter, Reddit, or personal blog)
- **THEN** the system SHALL use the same detection logic and standardized format without site-specific rules.

#### Scenario: Dynamic Content Support
- **WHEN** new content is loaded via infinite scroll or AJAX
- **THEN** the system SHALL detect new tip requests in the added elements.

