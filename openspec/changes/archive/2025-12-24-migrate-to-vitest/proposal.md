# Change: Migrate from Jest to Vitest

## Why
Jest introduces complexity with ts-jest configuration and has slower test execution. Vitest provides native TypeScript support, faster test runs, and better compatibility with the Vite ecosystem which is becoming the standard for modern TypeScript projects.

## What Changes
- Replace Jest and ts-jest with Vitest and @vitest/ui
- Update test configuration (jest.config.js → vitest.config.ts)
- Update jest.setup.js to vitest.setup.ts
- Migrate test scripts in package.json
- Update test imports and mocks to Vitest syntax
- Remove Jest-specific dependencies from package.json

## Impact
- Affected specs: testing (new capability)
- Affected code: jest.config.js, jest.setup.js, package.json, src/utils/*.test.ts
- **BREAKING**: Changes test runner tooling
