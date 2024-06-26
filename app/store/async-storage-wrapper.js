import ReadOnlyNetworkStore from '../util/test/network-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isE2E } from '../util/test/utils';
import { MMKV } from 'react-native-mmkv';

/**
 * Wrapper class for AsyncStorage.
 */
class AsyncStorageWrapper {
  constructor() {
    /**
     * The underlying storage implementation.
     * Use `ReadOnlyNetworkStore` in test mode otherwise use `AsyncStorage`.
     */
    this.storage = isE2E ? ReadOnlyNetworkStore : new MMKV();
  }

  async getItem(key) {
    try {
      const value = await this.storage.getString(key);
      console.log('***kylan*** getItem', key, value);
      return value;
    } catch (error) {
      if (isE2E) {
        // Fall back to AsyncStorage in test mode if ReadOnlyNetworkStore fails
        return AsyncStorage.getItem(key);
      }
      throw error;
    }
  }

  async setItem(key, value) {
    try {
      const response = await this.storage.setItem(key, value);
      console.log('***kylan*** setItem', key, value);
      return response;
    } catch (error) {
      if (isE2E) {
        // Fall back to AsyncStorage in test mode if ReadOnlyNetworkStore fails
        return await AsyncStorage.setItem(key, value);
      }
      throw error;
    }
  }

  async removeItem(key) {
    try {
      const response = await this.storage.delete(key);
      console.log('***kylan*** removeItem', key);
      return response;
    } catch (error) {
      if (isE2E) {
        // Fall back to AsyncStorage in test mode if ReadOnlyNetworkStore fails
        return await AsyncStorage.removeItem(key);
      }
      throw error;
    }
  }
}

export default new AsyncStorageWrapper();
