// Example integration for your Login component
// Add this to your existing Login.js file

import { AuthManager } from '../utils/AuthManager';
import { DeepLinkManager } from '../utils/DeepLinkManager';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// In your Login component, after successful authentication:
const handleSuccessfulLogin = async (accessToken, userId, userData) => {
  try {
    // Store authentication data in AsyncStorage
    await AuthManager.storeAuthData(accessToken, userId, userData);
    
    // Update Redux store
    const dispatch = useDispatch();
    dispatch({ type: 'USER_ID', payload: userId });
    
    // Handle any pending deep links
    const hasHandledDeepLink = await DeepLinkManager.handlePostAuthNavigation();
    
    if (!hasHandledDeepLink) {
      // No pending deep link, navigate to home
      navigation.replace('Home');
    }
    // If there was a pending deep link, DeepLinkManager will handle navigation
    
  } catch (error) {
    console.error('Error in post-login handling:', error);
    navigation.replace('Home'); // Fallback
  }
};

// Example usage in your login function:
const loginUser = async (credentials) => {
  try {
    // Your existing login API call
    const response = await loginAPI(credentials);
    
    if (response.success) {
      await handleSuccessfulLogin(
        response.accessToken,
        response.userId,
        response.userData
      );
    }
  } catch (error) {
    // Handle login error
    console.error('Login failed:', error);
  }
};