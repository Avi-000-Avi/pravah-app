/**
 * Persistent key/value storage adapter.
 *
 * Prefers `react-native-mmkv` (native, fast, persisted to disk).
 * Falls back to an in-memory Map when MMKV is unavailable — this
 * happens in Expo Go (Nitro Modules can't be loaded) and on web.
 *
 * The fallback is session-scoped: data is lost on reload. This is
 * fine for UI testing in Expo Go but means auth sessions won't
 * persist across app restarts there. In a development or production
 * build, MMKV is used and sessions persist normally.
 */

export interface KeyValueStorage {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  remove(key: string): void;
}

function createInMemoryStorage(): KeyValueStorage {
  const store = new Map<string, string>();
  return {
    getString: (key) => store.get(key),
    set: (key, value) => {
      store.set(key, value);
    },
    remove: (key) => {
      store.delete(key);
    },
  };
}

function createMmkvStorage(): KeyValueStorage | null {
  try {
    // Lazy require so the module is never evaluated when unavailable
    // (Expo Go, web). A top-level import would crash before this guard.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mmkvModule = require('react-native-mmkv');
    const mmkv = mmkvModule.createMMKV({ id: 'pravah-storage' });
    return {
      getString: (key) => mmkv.getString(key),
      set: (key, value) => {
        mmkv.set(key, value);
      },
      remove: (key) => {
        mmkv.remove(key);
      },
    };
  } catch (error) {
    if (__DEV__) {
      console.warn(
        '[storage] MMKV unavailable, falling back to in-memory storage (Expo Go or web?)',
        error,
      );
    }
    return null;
  }
}

export const storage: KeyValueStorage = createMmkvStorage() ?? createInMemoryStorage();
