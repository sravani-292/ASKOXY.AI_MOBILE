import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DeepLinkManager } from '../utils/DeepLinkManager';

const AuthWrapper = ({ children, navigation }) => {
  const reduxUserId = useSelector(state => state.logged);

  useEffect(() => {
    // Handle post-authentication navigation when user logs in
    if (reduxUserId) {
      handlePostAuthNavigation();
    }
  }, [reduxUserId]);

  const handlePostAuthNavigation = async () => {
    try {
      const hasHandledDeepLink = await DeepLinkManager.handlePostAuthNavigation();
      
      if (!hasHandledDeepLink) {
        console.log('✅ User authenticated, no pending deep links');
      }
    } catch (error) {
      console.error('Error in post-auth navigation:', error);
    }
  };

  return children;
};

export default AuthWrapper;