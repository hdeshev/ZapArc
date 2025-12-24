## ADDED Requirements

### Requirement: Automatic Tip Appending
The system SHALL automatically append the standardized tip format to posts and comments on enabled domains.

#### Scenario: Append to Post
- **WHEN** a user is on a whitelisted domain and enters a recognized posting context (textarea/editable)
- **THEN** the system SHALL append `\n[lntip:lnurl:<user_lnurl>:<amounts>]` to the end of the content.

### Requirement: Platform and Heuristic Detection
The system SHALL use both specific selectors and generic heuristics to find where to append tips.

#### Scenario: Known Platform Detection
- **WHEN** on Facebook, Twitter, or Reddit
- **THEN** the system SHALL use platform-specific CSS selectors to identify post/comment boxes.

#### Scenario: Heuristic Fallback
- **WHEN** on a user-added domain
- **THEN** the system SHALL use patterns like textarea size and placeholder text to identify posting areas.

### Requirement: Selective Facebook Posting
The system SHALL allow granular control over which Facebook groups allow tip appending.

#### Scenario: Selective Group Mode
- **WHEN** "Selective group posting" is enabled
- **THEN** the system SHALL only append tips if the current group ID is in the user's allowed list.

#### Scenario: Prompt for New Group
- **WHEN** visiting a new Facebook group URL in selective mode
- **THEN** the system SHALL prompt the user to add the group to the allowed list.
