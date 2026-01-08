import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthManager {
  static STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    USER_ID: 'userId',
    USER_DATA: 'userData',
    PENDING_DEEP_LINK: 'pendingDeepLink'
  };

  // Check if user is authenticated
  static async isAuthenticated() {
    try {
      const [accessToken, userId] = await Promise.all([
        AsyncStorage.getItem(this.STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(this.STORAGE_KEYS.USER_ID)
      ]);
      
      return !!(accessToken && userId);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // Get authentication data
  static async getAuthData() {
    try {
      const [accessToken, userId, userData] = await Promise.all([
        AsyncStorage.getItem(this.STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(this.STORAGE_KEYS.USER_ID),
        AsyncStorage.getItem(this.STORAGE_KEYS.USER_DATA)
      ]);

      return {
        accessToken,
        userId,
        userData: userData ? JSON.parse(userData) : null,
        isAuthenticated: !!(accessToken && userId)
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return {
        accessToken: null,
        userId: null,
        userData: null,
        isAuthenticated: false
      };
    }
  }

  // Store authentication data
  static async storeAuthData(accessToken, userId, userData = null) {
    try {
      const promises = [
        AsyncStorage.setItem(this.STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        AsyncStorage.setItem(this.STORAGE_KEYS.USER_ID, userId)
      ];

      if (userData) {
        promises.push(
          AsyncStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
        );
      }

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Error storing auth data:', error);
      return false;
    }
  }

  // Clear authentication data
  static async clearAuthData() {
    try {
      await AsyncStorage.multiRemove([
        this.STORAGE_KEYS.ACCESS_TOKEN,
        this.STORAGE_KEYS.USER_ID,
        this.STORAGE_KEYS.USER_DATA
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  }

  // Store pending deep link
  static async storePendingDeepLink(screenName, params = {}) {
    try {
      const deepLinkData = {
        screenName,
        params,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.PENDING_DEEP_LINK, 
        JSON.stringify(deepLinkData)
      );
      return true;
    } catch (error) {
      console.error('Error storing pending deep link:', error);
      return false;
    }
  }

  // Get and clear pending deep link
  static async getPendingDeepLink() {
    try {
      const deepLinkData = await AsyncStorage.getItem(this.STORAGE_KEYS.PENDING_DEEP_LINK);
      if (deepLinkData) {
        await AsyncStorage.removeItem(this.STORAGE_KEYS.PENDING_DEEP_LINK);
        const parsed = JSON.parse(deepLinkData);
        
        // Check if deep link is not too old (24 hours)
        const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
        if (isExpired) {
          return null;
        }
        
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Error getting pending deep link:', error);
      return null;
    }
  }
}