import { vi, afterEach } from 'vitest';

// Mock the Chrome storage API for testing
const mockChromeStorage = {
  storage: {
    local: {
      storage: {} as Record<string, any>,
      set: vi.fn(async (data: any) => {
        Object.assign(mockChromeStorage.storage.local.storage, data);
      }),
      get: vi.fn(async (keys: any) => {
        if (Array.isArray(keys)) {
          const result: Record<string, any> = {};
          keys.forEach((key: any) => {
            if (mockChromeStorage.storage.local.storage[key] !== undefined) {
              result[key] = mockChromeStorage.storage.local.storage[key];
            }
          });
          return result;
        } else {
          return mockChromeStorage.storage.local.storage[keys] || {};
        }
      }),
      remove: vi.fn(async (keys: any) => {
        if (Array.isArray(keys)) {
          keys.forEach((key: any) => {
            delete mockChromeStorage.storage.local.storage[key];
          });
        } else {
          delete mockChromeStorage.storage.local.storage[keys];
        }
      })
    }
  }
};

// Mock global chrome object
(global as any).chrome = mockChromeStorage.storage;

// Mock crypto object for testing
if (typeof global.crypto === 'undefined') {
  (global as any).crypto = {
    subtle: {
      importKey: vi.fn(),
      deriveKey: vi.fn(),
      encrypt: vi.fn(),
      decrypt: vi.fn(),
      getRandomValues: vi.fn((array: Uint8Array) => {
        // Simple mock for getRandomValues
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      })
    },
    getRandomValues: vi.fn((array: Uint8Array) => {
      // Simple mock for getRandomValues
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    })
  };
}

// Mock TextEncoder and TextDecoder if not available
if (typeof global.TextEncoder === 'undefined') {
  (global as any).TextEncoder = class TextEncoder {
    encode(str: string) {
      return new Uint8Array(Buffer.from(str, 'utf-8'));
    }
  };
}

if (typeof global.TextDecoder === 'undefined') {
  (global as any).TextDecoder = class TextDecoder {
    decode(buffer: BufferSource) {
      if (buffer instanceof Uint8Array) {
        return Buffer.from(buffer).toString('utf-8');
      }
      return Buffer.from(buffer as ArrayBuffer).toString('utf-8');
    }
  };
}

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn()
};

afterEach(() => {
  // Clear storage between tests
  mockChromeStorage.storage.local.storage = {};
  vi.clearAllMocks();
});

// Export for potential use in tests
export { mockChromeStorage };
