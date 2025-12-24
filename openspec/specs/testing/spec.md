# testing Specification

## Purpose
TBD - created by archiving change migrate-to-vitest. Update Purpose after archive.
## Requirements
### Requirement: Vitest Configuration
The testing infrastructure SHALL use Vitest as the test runner with native TypeScript support.

#### Scenario: Configuration File Exists
- **WHEN** the project is initialized
- **THEN** vitest.config.ts SHALL exist with proper TypeScript configuration
- **AND** testEnvironment SHALL be set to 'node'
- **AND** test patterns SHALL match *.test.ts files

#### Scenario: Setup File Exists
- **WHEN** tests are initialized
- **THEN** vitest.setup.ts SHALL exist with Chrome API mocks
- **AND** crypto mocks SHALL be configured for browser crypto APIs
- **AND** TextEncoder/TextDecoder SHALL be available globally

### Requirement: Test Script Commands
The package.json SHALL provide npm scripts for running Vitest tests.

#### Scenario: Test Execution
- **WHEN** developer runs `npm test`
- **THEN** all tests SHALL execute with Vitest
- **AND** test results SHALL be displayed in the console

#### Scenario: Watch Mode
- **WHEN** developer runs `npm run test:watch`
- **THEN** Vitest SHALL enter watch mode
- **AND** tests SHALL re-run on file changes

#### Scenario: Coverage Report
- **WHEN** developer runs `npm run test:coverage`
- **THEN** Vitest SHALL generate coverage reports
- **AND** reports SHALL be saved to coverage directory

### Requirement: Mock Compatibility
Vitest SHALL provide compatible mocks for all Chrome Extension APIs used in tests.

#### Scenario: Chrome Storage Mock
- **WHEN** tests access chrome.storage.local
- **THEN** a mock implementation SHALL be available
- **AND** set/get/remove operations SHALL work synchronously

#### Scenario: Crypto API Mock
- **WHEN** tests use crypto.subtle or crypto.getRandomValues
- **THEN** mock implementations SHALL be available
- **AND** functions SHALL return predictable values for testing

#### Scenario: Timer Mocks
- **WHEN** tests use vi.useFakeTimers()
- **THEN** timers SHALL be controllable via vi.advanceTimersByTime()
- **AND** vi.runAllTimersAsync() SHALL execute all pending timers

