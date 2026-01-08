import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { AuthManager } from '../utils/AuthManager';
import { DeepLinkManager } from '../utils/DeepLinkManager';

const { width, height } = Dimensions.get('window');

const EnhancedSplashScreen = ({ navigation }) => {
  const [isGifLoaded, setIsGifLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Get user data from Redux
  const reduxUserId = useSelector(state => state.logged);

  useEffect(() => {
    checkAuthAndNavigate();
  }, []);

  const checkAuthAndNavigate = async () => {
    try {
      setIsCheckingAuth(true);
      
      // Check authentication state
      const authData = await AuthManager.getAuthData();
      const isAuthenticated = authData.isAuthenticated || !!reduxUserId;
      
      console.log('🔍 Auth check result:', {
        isAuthenticated,
        hasAccessToken: !!authData.accessToken,
        hasUserId: !!authData.userId,
        reduxUserId: !!reduxUserId
      });

      // Check for pending deep links
      const pendingDeepLink = await AuthManager.getPendingDeepLink();
      
      // Wait for GIF animation if loaded
      if (isGifLoaded && !hasError) {
        await startAnimation();
      }
      
      // Navigate based on authentication state
      if (isAuthenticated) {
        if (pendingDeepLink) {
          console.log('🎯 Found pending deep link, navigating to Home first');
          // Navigate to Home first, then handle deep link
          navigation.replace('Home');
          
          // Handle pending deep link after navigation
          setTimeout(async () => {
            await DeepLinkManager.handlePostAuthNavigation();
          }, 1000);
        } else {
          navigation.replace('Home');
        }
      } else {
        navigation.replace('Login');
      }
      
    } catch (error) {
      console.error('Error in auth check:', error);
      navigation.replace('Login');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const startAnimation = () => {
    return new Promise((resolve) => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(resolve, 1000); // Hold for 1 second
      });
    });
  };

  useEffect(() => {
    if (hasError) {
      // Quick fallback on error
      setTimeout(() => {
        checkAuthAndNavigate();
      }, 1000);
    }
  }, [hasError]);

  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size="large" 
        color="#8B5CF6" 
        style={styles.loadingSpinner} 
      />

      {!hasError ? (
        <Animated.Image
          source={require('../../assets/Diwali_Greetings (1).gif')}
          style={[styles.logo, { opacity: fadeAnim }]}
          resizeMode="cover"
          onLoad={() => setIsGifLoaded(true)}
          onError={() => {
            console.warn('GIF failed—using fallback');
            setHasError(true);
          }}
        />
      ) : (
        <Image
          source={require('../../assets/Diwali_Greetings (1).gif')}
          style={styles.logo}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.9,
    height: height - 250,
    marginTop: 20,
  },
  loadingSpinner: {
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default EnhancedSplashScreen;