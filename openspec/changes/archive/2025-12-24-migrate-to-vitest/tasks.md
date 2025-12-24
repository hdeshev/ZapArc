# Tasks: Jest to Vitest Migration

## 1. Infrastructure Setup
- [x] 1.1 Install vitest and @vitest/ui as dev dependencies
- [x] 1.2 Remove @types/jest and jest from devDependencies
- [x] 1.3 Remove ts-jest from devDependencies
- [x] 1.4 Create vitest.config.ts with TypeScript support
- [x] 1.5 Migrate jest.setup.js to vitest.setup.ts
  - [x] Convert jest.fn() to vi.fn()
  - [x] Convert jest.mock() to vi.mock()
  - [x] Convert jest.clearAllMocks() to vi.clearAllMocks()
- [x] 1.6 Update package.json test scripts:
  - [x] Change "test" from jest to vitest
  - [x] Change "test:watch" from jest --watch to vitest
  - [x] Change "test:coverage" from jest --coverage to vitest --coverage

## 2. Test File Migration
- [x] 2.1 Migrate src/utils/storage.test.ts
  - [x] Replace jest with vi for mock functions
  - [x] Update jest.useFakeTimers() to vi.useFakeTimers()
  - [x] Update jest.runAllTimersAsync() to vi.runAllTimersAsync()
- [x] 2.2 Migrate src/utils/payment-processor.test.ts
  - [x] Replace jest with vi for mock functions
  - [x] Update timer-related code
  - [x] Verify all mocks work correctly

## 3. Validation
- [x] 3.1 Run `npm test` and verify all tests pass
- [x] 3.2 Run `npm run test:watch` and verify watch mode works
- [x] 3.3 Run `npm run test:coverage` and verify coverage reports generate
- [x] 3.4 Verify Chrome API mocks work correctly in both test files
- [x] 3.5 Verify crypto mocks work correctly

## 4. Cleanup
- [x] 4.1 Delete jest.config.js
- [x] 4.2 Delete jest.setup.js
- [x] 4.3 Update CLAUDE.md to reference Vitest instead of Jest (if applicable)
- [x] 4.4 Run `npm run type-check` to verify no TypeScript errors

## 5. Documentation
- [x] 5.1 Update README.md to reference Vitest instead of Jest (if applicable)
- [x] 5.2 Update AGENTS.md testing guidance if it references Jest
