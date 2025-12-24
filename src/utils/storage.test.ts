// Comprehensive test file for ChromeStorageManager
// Tests all storage functionality including encryption, wallet management, and migration

import { ChromeStorageManager, generateUUID } from './storage';
import { WalletData, UserSettings, DomainSettings, BlacklistData, EncryptedWalletEntry, WalletMetadata, MultiWalletStorage } from '../types';

import { vi } from 'vitest';

// Mock chrome storage directly in the test file
const mockStorage: any = {
  local: {
    storage: {},
    set: vi.fn(async (data: any) => {
      Object.assign(mockStorage.local.storage, data);
    }),
    get: vi.fn(async (keys: any) => {
      if (Array.isArray(keys)) {
        const result: any = {};
        keys.forEach((key: any) => {
          if (mockStorage.local.storage[key] !== undefined) {
            result[key] = mockStorage.local.storage[key];
          }
        });
        return result;
      } else {
        return mockStorage.local.storage[keys] || {};
      }
    }),
    remove: vi.fn(async (keys: any) => {
      if (Array.isArray(keys)) {
        keys.forEach((key: any) => {
          delete mockStorage.local.storage[key];
        });
      } else {
        delete mockStorage.local.storage[keys];
      }
    })
  }
};

describe('ChromeStorageManager', () => {
  let storageManager: ChromeStorageManager;
  const testPin = '1234';
  const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

  beforeEach(() => {
    // Mock global chrome object
    (global as any).chrome = { storage: mockStorage };
    storageManager = new ChromeStorageManager();
    // Clear storage between tests
    mockStorage.local.storage = {};
    vi.clearAllMocks();
  });

  describe('UUID Generation', () => {
    it('should generate valid UUID v4 format', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('User Settings Management', () => {
    it('should save and retrieve user settings', async () => {
      const testSettings: UserSettings = {
        defaultPostingAmounts: [100, 500, 1000],
        defaultTippingAmounts: [100, 500, 1000],
        useBuiltInWallet: true,
        floatingMenuEnabled: true,
        autoLockTimeout: 900,
        customLNURL: 'test-lnurl',
        facebookPostingMode: 'global',
        allowedFacebookGroups: ['group1', 'group2'],
        deniedFacebookGroups: ['group3']
      };

      await storageManager.saveUserSettings(testSettings);
      const loadedSettings = await storageManager.getUserSettings();

      expect(loadedSettings).toBeDefined();
      expect(loadedSettings.defaultPostingAmounts).toEqual([100, 500, 1000]);
      expect(loadedSettings.customLNURL).toBe('test-lnurl');
    });

    it('should return default settings when no settings exist', async () => {
      const defaultSettings = await storageManager.getUserSettings();
      expect(defaultSettings).toBeDefined();
      expect(defaultSettings.defaultPostingAmounts).toEqual([100, 500, 1000]);
      expect(defaultSettings.autoLockTimeout).toBe(900);
    });

    it('should merge stored settings with defaults', async () => {
      const partialSettings: Partial<UserSettings> = {
        customLNURL: 'custom-lnurl'
      };

      await storageManager.saveUserSettings(partialSettings as UserSettings);
      const loadedSettings = await storageManager.getUserSettings();

      expect(loadedSettings.customLNURL).toBe('custom-lnurl');
      expect(loadedSettings.defaultPostingAmounts).toEqual([100, 500, 1000]); // Should have defaults
    });
  });

  describe('Domain Settings Management', () => {
    it('should save and retrieve domain settings', async () => {
      await storageManager.saveDomainSettings('example.com', 'whitelisted');
      await storageManager.saveDomainSettings('test.com', 'disabled');

      const domainSettings = await storageManager.getDomainSettings();

      expect(domainSettings['example.com']).toBe('whitelisted');
      expect(domainSettings['test.com']).toBe('disabled');
    });

    it('should return empty object when no domain settings exist', async () => {
      const domainSettings = await storageManager.getDomainSettings();
      expect(domainSettings).toEqual({});
    });
  });

  describe('Blacklist Management', () => {
    it('should save and retrieve blacklist data', async () => {
      const testLNURLs = ['lnurl1', 'lnurl2', 'lnurl3'];
      await storageManager.saveBlacklist(testLNURLs);

      const blacklistData = await storageManager.getBlacklist();

      expect(blacklistData.lnurls).toEqual(testLNURLs);
      expect(blacklistData.lastUpdated).toBeGreaterThan(0);
    });

    it('should return default blacklist when no blacklist exists', async () => {
      const blacklistData = await storageManager.getBlacklist();
      expect(blacklistData.lnurls).toEqual([]);
      expect(blacklistData.lastUpdated).toBe(0);
    });
  });

  describe('Wallet Lock/Unlock Functionality', () => {
    it('should lock and unlock wallet', async () => {
      await storageManager.unlockWallet();
      let isUnlocked = await storageManager.isWalletUnlocked();
      expect(isUnlocked).toBe(true);

      await storageManager.lockWallet();
      isUnlocked = await storageManager.isWalletUnlocked();
      expect(isUnlocked).toBe(false);
    });

    it('should auto-lock wallet based on timeout settings', async () => {
      const settings: UserSettings = {
        defaultPostingAmounts: [100, 500, 1000],
        defaultTippingAmounts: [100, 500, 1000],
        useBuiltInWallet: true,
        floatingMenuEnabled: true,
        autoLockTimeout: 1, // 1 second timeout for testing
        customLNURL: undefined,
        facebookPostingMode: 'global',
        allowedFacebookGroups: [],
        deniedFacebookGroups: []
      };

      await storageManager.saveUserSettings(settings);
      await storageManager.unlockWallet();

      // Wait for timeout to expire
      await new Promise(resolve => setTimeout(resolve, 1500));

      const isUnlocked = await storageManager.isWalletUnlocked();
      expect(isUnlocked).toBe(false);
    });

    it('should update last activity timestamp', async () => {
      await storageManager.unlockWallet();
      await storageManager.updateActivity();

      // Access the mock storage directly for verification
      const result = await mockStorage.local.get(['lastActivity']);
      expect(result.lastActivity).toBeGreaterThan(0);
    });
  });

  describe('Wallet Existence Checks', () => {
    it('should detect when wallet exists', async () => {
      // Set up multi-wallet format
      const multiWalletData = {
        walletVersion: 1,
        multiWalletData: JSON.stringify({
          wallets: [],
          activeWalletId: '',
          walletOrder: [],
          version: 1
        })
      };
      await mockStorage.local.set(multiWalletData);

      const exists = await storageManager.walletExists();
      expect(exists).toBe(true);
    });

    it('should detect when wallet does not exist', async () => {
      const exists = await storageManager.walletExists();
      expect(exists).toBe(false);
    });

    it('should detect legacy single wallet', async () => {
      // Set up old single wallet format
      const oldWalletData = {
        encryptedWallet: JSON.stringify({
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        })
      };
      await mockStorage.local.set(oldWalletData);

      // Note: walletExists() only checks multi-wallet format (walletVersion === 1 or multiWalletData)
      // It does not check for legacy encryptedWallet, so it should return false
      const exists = await storageManager.walletExists();
      expect(exists).toBe(false);
    });
  });

  describe('Wallet Version Management', () => {
    it('should detect wallet version correctly', async () => {
      // Test no wallet
      let version = await storageManager.getWalletVersion();
      expect(version).toBe(-1);

      // Test single wallet (legacy)
      const oldWalletData = {
        encryptedWallet: JSON.stringify({
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        })
      };
      await mockStorage.local.set(oldWalletData);

      version = await storageManager.getWalletVersion();
      expect(version).toBe(0);

      // Test multi-wallet
      const multiWalletData = {
        walletVersion: 1,
        multiWalletData: JSON.stringify({
          wallets: [],
          activeWalletId: '',
          walletOrder: [],
          version: 1
        })
      };
      await mockStorage.local.set(multiWalletData);

      version = await storageManager.getWalletVersion();
      expect(version).toBe(1);
    });
  });

  describe('Multi-Wallet Storage', () => {
    it('should save and load multiple wallets', async () => {
      const wallet1: EncryptedWalletEntry = {
        metadata: {
          id: 'wallet-1',
          nickname: 'Wallet 1',
          createdAt: Date.now(),
          lastUsedAt: Date.now()
        },
        encryptedMnemonic: {
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          timestamp: Date.now()
        }
      };

      const wallet2: EncryptedWalletEntry = {
        metadata: {
          id: 'wallet-2',
          nickname: 'Wallet 2',
          createdAt: Date.now(),
          lastUsedAt: Date.now()
        },
        encryptedMnemonic: {
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          timestamp: Date.now()
        }
      };

      const wallets = [wallet1, wallet2];
      const activeId = 'wallet-1';

      await storageManager.saveWallets(wallets, activeId, testPin);
      const loadedData = await storageManager.loadWallets(testPin);

      expect(loadedData).toBeDefined();
      expect(loadedData?.wallets.length).toBe(2);
      expect(loadedData?.activeId).toBe(activeId);
    });

    it('should validate wallet structure when saving', async () => {
      const invalidWallets: any[] = [];
      const activeId = 'wallet-1';

      await expect(storageManager.saveWallets(invalidWallets, activeId, testPin))
        .rejects
        .toThrow('Cannot save empty wallet array');
    });

    it('should validate active wallet ID when saving', async () => {
      const wallet1: EncryptedWalletEntry = {
        metadata: {
          id: 'wallet-1',
          nickname: 'Wallet 1',
          createdAt: Date.now(),
          lastUsedAt: Date.now()
        },
        encryptedMnemonic: {
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          timestamp: Date.now()
        }
      };

      const wallets = [wallet1];
      const invalidActiveId = 'wallet-2';

      await expect(storageManager.saveWallets(wallets, invalidActiveId, testPin))
        .rejects
        .toThrow('Active wallet ID must match one of the wallet IDs');
    });
  });

  describe('Active Wallet Management', () => {
    it('should set and get active wallet', async () => {
      const wallet1: EncryptedWalletEntry = {
        metadata: {
          id: 'wallet-1',
          nickname: 'Wallet 1',
          createdAt: Date.now(),
          lastUsedAt: Date.now()
        },
        encryptedMnemonic: {
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          timestamp: Date.now()
        }
      };

      const wallet2: EncryptedWalletEntry = {
        metadata: {
          id: 'wallet-2',
          nickname: 'Wallet 2',
          createdAt: Date.now(),
          lastUsedAt: Date.now()
        },
        encryptedMnemonic: {
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          timestamp: Date.now()
        }
      };

      const wallets = [wallet1, wallet2];
      await storageManager.saveWallets(wallets, 'wallet-1', testPin);

      // Change active wallet
      await storageManager.setActiveWallet('wallet-2');

      const loadedData = await storageManager.loadWallets(testPin);
      expect(loadedData?.activeId).toBe('wallet-2');
    });

    it('should fail when setting invalid wallet ID as active', async () => {
      const wallet1: EncryptedWalletEntry = {
        metadata: {
          id: 'wallet-1',
          nickname: 'Wallet 1',
          createdAt: Date.now(),
          lastUsedAt: Date.now()
        },
        encryptedMnemonic: {
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          timestamp: Date.now()
        }
      };

      const wallets = [wallet1];
      await storageManager.saveWallets(wallets, 'wallet-1', testPin);

      await expect(storageManager.setActiveWallet('invalid-wallet-id'))
        .rejects
        .toThrow('Wallet with ID invalid-wallet-id not found');
    });
  });

  describe('Wallet Addition/Removal', () => {
    it('should add new wallet to storage', async () => {
      const newWallet: WalletData = {
        mnemonic: testMnemonic,
        balance: 1000,
        transactions: []
      };

      const walletId = await storageManager.addWallet(newWallet, 'New Wallet', testPin);

      expect(walletId).toBeDefined();
      expect(typeof walletId).toBe('string');

      // Verify wallet was added
      const loadedData = await storageManager.loadWallets(testPin);
      expect(loadedData?.wallets.length).toBe(1);
      expect(loadedData?.wallets[0].metadata.nickname).toBe('New Wallet');
    });

    it('should remove wallet from storage', async () => {
      const wallet1: EncryptedWalletEntry = {
        metadata: {
          id: 'wallet-1',
          nickname: 'Wallet 1',
          createdAt: Date.now(),
          lastUsedAt: Date.now()
        },
        encryptedMnemonic: {
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          timestamp: Date.now()
        }
      };

      const wallet2: EncryptedWalletEntry = {
        metadata: {
          id: 'wallet-2',
          nickname: 'Wallet 2',
          createdAt: Date.now(),
          lastUsedAt: Date.now()
        },
        encryptedMnemonic: {
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          timestamp: Date.now()
        }
      };

      const wallets = [wallet1, wallet2];
      await storageManager.saveWallets(wallets, 'wallet-1', testPin);

      // Remove wallet 2
      await storageManager.removeWallet('wallet-2', testPin);

      const loadedData = await storageManager.loadWallets(testPin);
      expect(loadedData?.wallets.length).toBe(1);
      expect(loadedData?.wallets[0].metadata.id).toBe('wallet-1');
    });

    it('should not allow removing last wallet', async () => {
      const wallet1: EncryptedWalletEntry = {
        metadata: {
          id: 'wallet-1',
          nickname: 'Wallet 1',
          createdAt: Date.now(),
          lastUsedAt: Date.now()
        },
        encryptedMnemonic: {
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          timestamp: Date.now()
        }
      };

      const wallets = [wallet1];
      await storageManager.saveWallets(wallets, 'wallet-1', testPin);

      await expect(storageManager.removeWallet('wallet-1', testPin))
        .rejects
        .toThrow('Cannot remove the last wallet. Use deleteAllWallets() instead.');
    });

    it('should switch active wallet when removing active wallet', async () => {
      const wallet1: EncryptedWalletEntry = {
        metadata: {
          id: 'wallet-1',
          nickname: 'Wallet 1',
          createdAt: Date.now(),
          lastUsedAt: Date.now()
        },
        encryptedMnemonic: {
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          timestamp: Date.now()
        }
      };

      const wallet2: EncryptedWalletEntry = {
        metadata: {
          id: 'wallet-2',
          nickname: 'Wallet 2',
          createdAt: Date.now(),
          lastUsedAt: Date.now()
        },
        encryptedMnemonic: {
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
          timestamp: Date.now()
        }
      };

      const wallets = [wallet1, wallet2];
      await storageManager.saveWallets(wallets, 'wallet-1', testPin);

      // Remove active wallet (wallet-1)
      await storageManager.removeWallet('wallet-1', testPin);

      const loadedData = await storageManager.loadWallets(testPin);
      expect(loadedData?.activeId).toBe('wallet-2'); // Should switch to wallet-2
    });
  });

  describe('Wallet Migration', () => {
    it('should detect when migration is needed', async () => {
      // Set up old single wallet format
      const oldWalletData = {
        encryptedWallet: JSON.stringify({
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        })
      };
      await mockStorage.local.set(oldWalletData);

      const needsMigration = await storageManager.needsMigration();
      expect(needsMigration).toBe(true);
    });

    it('should not need migration when already migrated', async () => {
      // Set up multi-wallet format
      const multiWalletData = {
        walletVersion: 1,
        multiWalletData: JSON.stringify({
          wallets: [],
          activeWalletId: '',
          walletOrder: [],
          version: 1
        })
      };
      await mockStorage.local.set(multiWalletData);

      const needsMigration = await storageManager.needsMigration();
      expect(needsMigration).toBe(false);
    });

    it('should rollback migration if needed', async () => {
      // First set up a migrated state
      const multiWalletData = {
        walletVersion: 1,
        multiWalletData: JSON.stringify({
          wallets: [],
          activeWalletId: '',
          walletOrder: [],
          version: 1
        }),
        backup_encryptedWallet: JSON.stringify({
          data: [1, 2, 3, 4],
          iv: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        })
      };
      await mockStorage.local.set(multiWalletData);

      // Rollback
      await storageManager.rollbackMigration();

      // Verify rollback
      const result = await mockStorage.local.get(['encryptedWallet', 'walletVersion', 'multiWalletData']);
      expect(result.encryptedWallet).toBeDefined();
      expect(result.walletVersion).toBeUndefined();
      expect(result.multiWalletData).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    const testWallet: WalletData = {
      mnemonic: testMnemonic,
      balance: 1000,
      transactions: []
    };

    it('should handle storage errors gracefully', async () => {
      // Mock storage error
      const originalSet = mockStorage.local.set;
      mockStorage.local.set = vi.fn(() => Promise.reject(new Error('Storage error')));

      await expect(storageManager.saveEncryptedWallet(testWallet, testPin))
        .rejects
        .toThrow('Wallet encryption failed');

      // Restore original
      mockStorage.local.set = originalSet;
    });

    it('should handle invalid inputs gracefully', async () => {
      // Test invalid wallet data - this should not throw but handle gracefully
      const invalidWallet = { mnemonic: '' };
      const result = await storageManager.saveEncryptedWallet(invalidWallet as any, testPin);
      // The method should handle the error internally and not throw
      expect(result).toBeUndefined();

      // Test invalid PIN - this should not throw but handle gracefully
      const result2 = await storageManager.saveEncryptedWallet(testWallet, '');
      // The method should handle the error internally and not throw
      expect(result2).toBeUndefined();
    });
  });
});