# Design: Jest to Vitest Migration

## Context
The project currently uses Jest 30.2.0 with ts-jest 29.4.6 for testing. This setup requires:
- Separate configuration in jest.config.js
- TypeScript compilation via ts-jest
- Custom setup in jest.setup.js for Chrome API and crypto mocks

The testing infrastructure is critical for verifying:
- Storage layer (ChromeStorageManager)
- Payment processing logic
- Various utility functions

Stakeholders: Developers running tests, CI/CD pipelines

## Goals / Non-Goals

**Goals:**
- Faster test execution with Vitest
- Native TypeScript support without ts-jest
- Maintained compatibility with existing test suites
- Equivalent mock functionality for Chrome APIs and crypto
- Similar watch mode and coverage reporting

**Non-Goals:**
- Changing test coverage thresholds
- Refactoring test logic or assertions
- Modifying test file structure or naming conventions

## Decisions

### Decision 1: Use Vitest with native TypeScript support
**Why:** Vitest has built-in TypeScript support via Vite, eliminating the need for ts-jest and simplifying configuration.

**Alternatives considered:**
- Jest with ts-jest (current) - slower, more complex setup
- Jest with swc/esbuild - still requires Jest, less mature than Vitest
- uvu/minitest - too minimal, lacks mocking capabilities needed for Chrome APIs

### Decision 2: Use vitest/ui for interactive testing
**Why:** Provides browser-based test UI similar to Jest's watch mode but more modern.

### Decision 3: Keep existing test file structure and naming
**Why:** No need to migrate test file names (e.g., *.test.ts). Vitest supports Jest-compatible patterns.

### Decision 4: Use vitest.setup.ts for global mocks
**Why:** Vitest supports setup files similar to Jest, maintaining consistency with current Chrome API and crypto mocks.

## Risks / Trade-offs

**Risk:** Some Jest-specific features may not have 1:1 Vitest equivalents
**Mitigation:** Document feature parity; use Vitest's Jest compatibility mode

**Risk:** Test execution environment differences (node vs jsdom)
**Mitigation:** Configure Vitest with `environment: 'node'` to match Jest config

**Risk:** Mocking differences between Jest.fn() and vi.fn()
**Mitigation:** Global find/replace of `jest` with `vi` for mock functions

## Migration Plan

**Phase 1: Infrastructure Setup**
1. Install Vitest dependencies
2. Create vitest.config.ts
3. Create vitest.setup.ts (migrated from jest.setup.js)
4. Update package.json scripts

**Phase 2: Test File Migration**
1. Update imports: `jest.mock()` → `vi.mock()`, `jest.fn()` → `vi.fn()`
2. Update timer mocks: `jest.useFakeTimers()` → `vi.useFakeTimers()`
3. Update mock implementations
4. Verify all tests pass

**Phase 3: Cleanup**
1. Remove Jest dependencies
2. Delete jest.config.js and jest.setup.js
3. Update documentation

**Rollback:** Revert package.json changes and restore Jest config files if critical test failures cannot be resolved

## Open Questions
- None anticipated; Vitest has strong Jest compatibility
