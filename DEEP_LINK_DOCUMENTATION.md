# Deep Link Navigation System with Authentication

This system provides comprehensive deep link navigation with conditional access control based on authentication state.

## Features

- ✅ **Authentication-based Access Control**: Protected screens require valid access token and userId
- ✅ **Persistent Deep Link Storage**: Stores pending deep links when user is not authenticated
- ✅ **Post-Authentication Navigation**: Automatically navigates to intended screen after login
- ✅ **Redux Integration**: Works with existing Redux store for user state
- ✅ **AsyncStorage Fallback**: Uses AsyncStorage when Redux is not available
- ✅ **Comprehensive URL Parsing**: Handles multiple URL formats and parameters
- ✅ **Error Handling**: Graceful fallbacks for failed navigation attempts

## Architecture

### Core Components

1. **AuthManager** (`src/utils/AuthManager.js`)
   - Manages authentication state in AsyncStorage
   - Stores and retrieves pending deep links
   - Provides authentication validation methods

2. **DeepLinkManager** (`src/utils/DeepLinkManager.js`)
   - Handles deep link parsing and navigation
   - Implements authentication checks for protected screens
   - Manages post-authentication navigation

3. **EnhancedSplashScreen** (`src/Authorization/EnhancedSplashScreen.js`)
   - Checks authentication state on app startup
   - Handles pending deep links for authenticated users
   - Provides smooth transition to appropriate screen

4. **AuthWrapper** (`src/Components/AuthWrapper.js`)
   - Monitors authentication state changes
   - Triggers post-authentication navigation

## Screen Classification

### Protected Screens (Require Authentication)
```javascript
const PROTECTED_SCREENS = [
  'Wallet', 'Profile Edit', 'Order Details', 'My Orders',
  'Payment Details', 'Checkout', 'Order Summary', 'Address Book',
  'Referral History', 'Wishlist', 'My Cart', 'Active Agents',
  // ... and more
];
```

### Public Screens (No Authentication Required)
```javascript
const PUBLIC_SCREENS = [
  'Login', 'RegisterScreen', 'Home', 'Rice Products',
  'Product View', 'Support', 'About Us', 'Services',
  // ... and more
];
```

## URL Formats Supported

### Direct Screen Navigation
```
https://askoxy.ai/Profile%20Edit
askoxy.ai://wallet
```

### Parameterized URLs
```
https://askoxy.ai/product/123
https://askoxy.ai/order/456?status=pending
askoxy.ai://chat/CustomerSupport
```

### Legacy Format Support
```
https://askoxy.ai/rice-products/category123
https://oxyrice.page.link/offer/789
```

## Implementation Guide

### 1. Replace App.js
Replace your current `App.js` with `App_Enhanced.js` or integrate the changes:

```javascript
// Key changes in App.js
import { DeepLinkManager } from './src/utils/DeepLinkManager';
import AuthWrapper from './src/Components/AuthWrapper';

// Enhanced linking configuration
const linking = {
  prefixes: [
    'https://askoxy.ai',
    'askoxy.ai://',
    // ... other prefixes
  ],
  config: {
    screens: {
      'Profile Edit': 'profile',
      'Order Details': 'order/:id',
      // ... other screen mappings
    },
  },
};
```

### 2. Update Authentication Flow

In your Login component:

```javascript
import { AuthManager } from '../utils/AuthManager';
import { DeepLinkManager } from '../utils/DeepLinkManager';

const handleSuccessfulLogin = async (accessToken, userId, userData) => {
  // Store auth data
  await AuthManager.storeAuthData(accessToken, userId, userData);
  
  // Update Redux
  dispatch({ type: 'USER_ID', payload: userId });
  
  // Handle pending deep links
  const hasHandledDeepLink = await DeepLinkManager.handlePostAuthNavigation();
  
  if (!hasHandledDeepLink) {
    navigation.replace('Home');
  }
};
```

### 3. Update Logout Flow

```javascript
import { AuthManager } from '../utils/AuthManager';

const handleLogout = async () => {
  // Clear auth data
  await AuthManager.clearAuthData();
  
  // Clear Redux
  dispatch({ type: 'USER_ID', payload: null });
  
  // Navigate to login
  navigation.replace('Login');
};
```

## Usage Examples

### Creating Deep Links Programmatically

```javascript
import { DeepLinkManager } from '../utils/DeepLinkManager';

// Create a deep link to user's wallet
const walletLink = DeepLinkManager.createDeepLinkUrl('Wallet');
// Result: https://askoxy.ai/Wallet

// Create a deep link to specific order
const orderLink = DeepLinkManager.createDeepLinkUrl('Order Details', { id: '123' });
// Result: https://askoxy.ai/Order%20Details?id=123
```

### Handling Deep Links in Components

```javascript
import { DeepLinkManager } from '../utils/DeepLinkManager';

// Navigate to a screen with authentication check
const navigateToWallet = () => {
  DeepLinkManager.handleDeepLink('Wallet');
};

// Navigate with parameters
const navigateToOrder = (orderId) => {
  DeepLinkManager.handleDeepLink('Order Details', { id: orderId });
};
```

## Flow Diagrams

### Authentication Flow
```
User clicks deep link → Parse URL → Check if screen requires auth
                                          ↓
                                    Requires Auth?
                                    ↙           ↘
                               Yes                No
                                ↓                ↓
                        Check auth state    Navigate directly
                              ↓
                        Authenticated?
                        ↙           ↘
                    Yes              No
                     ↓                ↓
              Navigate to      Store pending link
              target screen    → Navigate to Login
                                      ↓
                               User logs in
                                      ↓
                               Check pending links
                                      ↓
                               Navigate to original
                               target screen
```

### Deep Link Processing Flow
```
Deep Link URL → Parse URL components → Extract screen name & params
                                              ↓
                                    Screen name valid?
                                    ↙              ↘
                                Yes                 No
                                 ↓                  ↓
                          Apply auth check    Log warning & ignore
                                 ↓
                          Navigate or redirect
```

## Testing

### Test Cases

1. **Authenticated User Deep Links**
   - Test navigation to protected screens
   - Test navigation to public screens
   - Test parameterized URLs

2. **Unauthenticated User Deep Links**
   - Test redirect to login for protected screens
   - Test direct navigation to public screens
   - Test post-login navigation to original target

3. **Edge Cases**
   - Invalid screen names
   - Malformed URLs
   - Network connectivity issues
   - App state restoration

### Test URLs

```javascript
// Protected screen (requires auth)
const testUrls = [
  'askoxy.ai://wallet',
  'https://askoxy.ai/Profile%20Edit',
  'https://askoxy.ai/order/123',
];

// Public screen (no auth required)
const publicUrls = [
  'askoxy.ai://home',
  'https://askoxy.ai/rice-products',
  'https://askoxy.ai/support',
];
```

## Configuration

### Adding New Protected Screens

Update `DeepLinkManager.js`:

```javascript
static PROTECTED_SCREENS = [
  // ... existing screens
  'New Protected Screen',
];
```

### Adding New URL Mappings

Update `App.js` linking configuration:

```javascript
const linking = {
  config: {
    screens: {
      // ... existing mappings
      'New Screen': 'new-screen/:param?',
    },
  },
};
```

## Troubleshooting

### Common Issues

1. **Deep link not working**
   - Check if screen name is in PROTECTED_SCREENS or PUBLIC_SCREENS
   - Verify URL format matches expected patterns
   - Check navigation ref is initialized

2. **Authentication check failing**
   - Verify AsyncStorage has accessToken and userId
   - Check Redux store state
   - Ensure AuthManager.storeAuthData was called after login

3. **Post-login navigation not working**
   - Check if pending deep link was stored correctly
   - Verify DeepLinkManager.handlePostAuthNavigation is called after login
   - Check navigation timing (add delays if needed)

### Debug Logging

Enable debug logging by checking console for:
- `🔗 Deep link received:`
- `🎯 Parsed deep link - Screen:`
- `🔒 Screen requires authentication`
- `✅ Navigating to`

## Security Considerations

1. **URL Validation**: All URLs are parsed and validated before navigation
2. **Authentication Verification**: Protected screens always verify auth state
3. **Parameter Sanitization**: URL parameters are properly decoded and validated
4. **Fallback Handling**: Invalid requests gracefully fall back to safe screens

## Performance

- **Lazy Loading**: Deep link parsing only occurs when needed
- **Caching**: Authentication state is cached to avoid repeated AsyncStorage calls
- **Minimal Dependencies**: Uses only essential React Navigation and Expo APIs
- **Error Boundaries**: Graceful error handling prevents app crashes

This system provides a robust, secure, and user-friendly deep linking experience while maintaining proper authentication controls.