import { AuthManager } from './AuthManager';

export class DeepLinkManager {
  // Define screens that require authentication
  static PROTECTED_SCREENS = [
    'Wallet',
    'Profile Edit',
    'Order Details',
    'My Orders',
    'Payment Details',
    'Checkout',
    'Order Summary',
    'Address Book',
    'New Address Book',
    'Saved Address',
    'Referral History',
    'Invite a friend',
    'Ticket History',
    'View Comments',
    'My Cancelled Item Details',
    'My Exchanged Item Details',
    'View BMVcoins History',
    'Wishlist',
    'My Cart',
    'Active Agents',
    'Agent Screen',
    'My Agents',
    'Agent Creation',
    'Agent Preview',
    'Subscription',
    'Wallet Withdraw',
    'Bulk Invite',
    'Update Order Address',
    'GLMS Home',
    'Find Jobs',
    'My Blogs',
    'Add Blog',
    "bharath-aistore",
  ];

  // Define public screens that don't require authentication
  static PUBLIC_SCREENS = [
    'Login',
    'RegisterScreen',
    'SplashScreen',
    'Home',
    'Rice Products',
    'Rice Product Detail',
    'Product View',
    'Item Details',
    'Terms and Conditions',
    'About Us',
    'Support',
    'Container Policy',
    'FREE RUDRAKSHA',
    'FREE AI & GEN AI',
    'STUDY ABROAD',
    'LEGAL SERVICE',
    'Machines',
    'MY ROTARY',
    'FREE CONTAINER',
    'We Are Hiring',
    'Crypto Currency',
    'GPTs',
    'Explore Gpt',
    'Countries',
    'Universities Display',
    'Universities Details',
    'Service Screen',
    'Campaign',
    'Store Location',
    'OxyLoans',
    'Offer Letters',
    'Study',
    'Services',
    'Special Offers',
    'GENOXY',
    'GenOxyOnboardingScreen',
    'GenOxyChatScreen',
    'AssistantChatScreen',
    'DrawerScreens',
    'AI Videos',
    'Our AI Videos',
    'FAQ on LLM',
    'FAQ on LLM Images',
    'Before Login',
    'After Login',
    'Agent Store',
    'Chat With AI',
    'AI Role Selection',
    'Image Creator',
    'Videos',
    'Job Details',
    'Blog Details',
    'The Fan of OG',
    'Agent Assistance',
    'UseCases',
    'New DashBoard',
    'Search Screen',
    'Main Screen',
    'CA Services',
    'Scan',
    'App Update',
    'Coupens'
  ];

  static navigationRef = null;
  static reduxStore = null;

  // Initialize with navigation reference and Redux store
  static initialize(navigationRef, reduxStore = null) {
    this.navigationRef = navigationRef;
    this.reduxStore = reduxStore;
  }

  // Check if screen requires authentication
  static requiresAuth(screenName) {
    return this.PROTECTED_SCREENS.includes(screenName);
  }

  // Get authentication state from Redux store or AsyncStorage
  static async getAuthState() {
    try {
      // First try Redux store
      if (this.reduxStore) {
        const state = this.reduxStore.getState();
        const reduxUserId = state.logged;
        
        if (reduxUserId) {
          const authData = await AuthManager.getAuthData();
          return {
            isAuthenticated: !!(authData.accessToken && reduxUserId),
            userId: reduxUserId,
            accessToken: authData.accessToken,
            userData: authData.userData
          };
        }
      }

      // Fallback to AsyncStorage
      const authData = await AuthManager.getAuthData();
      return {
        isAuthenticated: authData.isAuthenticated,
        userId: authData.userId,
        accessToken: authData.accessToken,
        userData: authData.userData
      };
    } catch (error) {
      console.error('Error getting auth state:', error);
      return {
        isAuthenticated: false,
        userId: null,
        accessToken: null,
        userData: null
      };
    }
  }

  // Handle deep link navigation with authentication check
  static async handleDeepLink(screenName, params = {}) {
    try {
      if (!this.navigationRef?.current) {
        console.warn('Navigation ref not available');
        return false;
      }

      console.log(`🔗 Handling deep link to: ${screenName}`, params);

      // Check if screen requires authentication
      if (this.requiresAuth(screenName)) {
        const authState = await this.getAuthState();
        
        if (!authState.isAuthenticated) {
          console.log(`🔒 Screen ${screenName} requires authentication, redirecting to login`);
          
          // Store the pending deep link
          await AuthManager.storePendingDeepLink(screenName, params);
          
          // Navigate to login
          this.navigationRef.current.navigate('Login');
          return true;
        }
      }

      // Navigate to the target screen
      console.log(`✅ Navigating to ${screenName}`);
      this.navigationRef.current.navigate(screenName, params);
      return true;
    } catch (error) {
      console.error('Error handling deep link:', error);
      return false;
    }
  }

  // Handle post-authentication navigation
  static async handlePostAuthNavigation() {
    try {
      const pendingDeepLink = await AuthManager.getPendingDeepLink();
      
      if (pendingDeepLink && this.navigationRef?.current) {
        console.log('🎯 Executing pending deep link:', pendingDeepLink);
        
        // Small delay to ensure navigation is ready
        setTimeout(() => {
          this.navigationRef.current.navigate(
            pendingDeepLink.screenName, 
            pendingDeepLink.params || {}
          );
        }, 500);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error handling post-auth navigation:', error);
      return false;
    }
  }

  // Parse deep link URL and extract screen name and parameters
  static parseDeepLinkUrl(url) {
    try {
      console.log('🔍 Parsing deep link URL:', url);
      
      // Handle different URL formats
      let cleanUrl = url;
      
      // Remove protocol prefixes
      const prefixes = [
        'https://askoxy.ai/',
        'askoxy.ai://',
        'exp://192.168.0.124:8081/',
        'https://oxyrice.page.link/'
      ];
      
      for (const prefix of prefixes) {
        if (cleanUrl.startsWith(prefix)) {
          cleanUrl = cleanUrl.replace(prefix, '');
          break;
        }
      }

      // Parse URL components
      const [pathPart, queryPart] = cleanUrl.split('?');
      const pathSegments = pathPart.split('/').filter(segment => segment);
      
      // Parse query parameters
      const params = {};
      if (queryPart) {
        queryPart.split('&').forEach(param => {
          const [key, value] = param.split('=');
          if (key && value) {
            params[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });
      }

      // Map common URL patterns to screen names
      const urlToScreenMap = {
        'rice-products': 'Rice Products',
        'product': 'Rice Product Detail',
        'order': 'Order Details',
        'wallet': 'Wallet',
        'profile': 'Profile Edit',
        'offers': 'Special Offers',
        'cart': 'My Cart',
        'wishlist': 'Wishlist',
        'orders': 'My Orders',
        'agents': 'Active Agents',
        'chat': 'GenOxyChatScreen',
        'genoxy': 'GENOXY'
      };

      let screenName = null;
      let screenParams = { ...params };

      if (pathSegments.length > 0) {
        const firstSegment = pathSegments[0].toLowerCase();
        
        // Check direct mapping
        if (urlToScreenMap[firstSegment]) {
          screenName = urlToScreenMap[firstSegment];
          
          // Add ID parameter if present
          if (pathSegments[1]) {
            screenParams.id = pathSegments[1];
          }
        } else {
          // Try to decode as screen name
          const decodedScreen = decodeURIComponent(pathSegments[0]);
          if (this.PROTECTED_SCREENS.includes(decodedScreen) || 
              this.PUBLIC_SCREENS.includes(decodedScreen)) {
            screenName = decodedScreen;
          }
        }
      }

      return {
        screenName,
        params: screenParams,
        originalUrl: url
      };
    } catch (error) {
      console.error('Error parsing deep link URL:', error);
      return {
        screenName: null,
        params: {},
        originalUrl: url
      };
    }
  }

  // Create deep link URL for a screen
  static createDeepLinkUrl(screenName, params = {}) {
    try {
      const baseUrl = 'https://askoxy.ai';
      
      // URL encode screen name
      const encodedScreen = encodeURIComponent(screenName);
      
      // Build query string
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.append(key, params[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const url = `${baseUrl}/${encodedScreen}${queryString ? `?${queryString}` : ''}`;
      
      console.log('🔗 Created deep link URL:', url);
      return url;
    } catch (error) {
      console.error('Error creating deep link URL:', error);
      return null;
    }
  }
}