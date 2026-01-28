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
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const EnhancedSplashScreen = ({ navigation }) => {
  const [isGifLoaded, setIsGifLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [greetingData, setGreetingData] = useState(null);

  // Get user data from Redux
  const reduxUserId = useSelector(state => state.logged);

  // Fetch festival greeting
  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        console.log("Today's date:", today);
        const response = await fetch(`https://interviews-zadn.onrender.com/api/data/festival_greetings?date=${today}`);
        const result = await response.json();
        console.log('Greeting fetch result:', result);
        if (result.success && result.data.length > 0) {
          setGreetingData(result.data[0]);
        }
      } catch (error) {
        console.warn('Failed to fetch greeting:', error);
      }
    };
    fetchGreeting();
  }, []);

  useEffect(() => {
    let timer;

    const startAnimation = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        timer = setTimeout(() => checkAuthAndNavigate(), 4000);
      });
    };

    if (isGifLoaded && !hasError) {
      startAnimation();
    } else if (hasError) {
      timer = setTimeout(() => checkAuthAndNavigate(), 1000);
    }

    return () => timer && clearTimeout(timer);
  }, [isGifLoaded, hasError, fadeAnim]);

  const checkAuthAndNavigate = async () => {
    try {
      setIsCheckingAuth(true);
      
      const authData = await AuthManager.getAuthData();
      const isAuthenticated = authData.isAuthenticated || !!reduxUserId;
      
      console.log('🔍 Auth check result:', {
        isAuthenticated,
        hasAccessToken: !!authData.accessToken,
        hasUserId: !!authData.userId,
        reduxUserId: !!reduxUserId
      });

      const pendingDeepLink = await AuthManager.getPendingDeepLink();
      
      if (isAuthenticated) {
        if (pendingDeepLink) {
          console.log('🎯 Found pending deep link, navigating to Home first');
          navigation.replace('Home');
          setTimeout(async () => {
            await DeepLinkManager.handlePostAuthNavigation();
          }, 1000);
        } else {
          navigation.replace('Home');
        }
      } else {
        console.log("not authenticated");
        navigation.replace('New DashBoard');
      }
      
    } catch (error) {
      console.error('Error in auth check:', error);
      navigation.replace('New DashBoard');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  return (
    <View style={styles.container}>
          {/* Skip Button (uncomment for dev) */}
          {/* <TouchableOpacity
            onPress={() => navigation.replace('Login')}
            style={styles.skipButton}
          >
            <Ionicons name="close" size={36} color="#666" />
          </TouchableOpacity> */}
    
          {/* Always show spinner until resolved */}
          <ActivityIndicator size="large" color="#8B5CF6" style={styles.loadingSpinner} />
    
          {/* Try API media first; fallback to local asset */}
          {!hasError ? (
            <Animated.Image
              source={greetingData?.media_url ? { uri: greetingData.media_url } : null}
              style={[styles.logo, { opacity: fadeAnim }]}
              resizeMode="cover"
              onLoad={() => setIsGifLoaded(true)}
              onError={() => {
                console.warn('Media failed—using fallback');
                setHasError(true);
              }}
            />
          ) : (
            // Fallback: Static image
            // <Image
            //   source={require('../../assets/askoxy_V1.gif')}
            //   style={styles.logo}
            //   resizeMode="cover"
            // />
            <View>
              <LottieView 
                source={require('../../assets/AnimationLoading.json')}
                style={styles.logo}
                resizeMode="cover"
                autoPlay
                loop
                onAnimationFinish={() => setIsGifLoaded(true)}
              />
            </View>
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
    width: width * 0.95,
    height: height - 500,
    marginTop: 20,
  },
  loadingSpinner: {
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default EnhancedSplashScreen;