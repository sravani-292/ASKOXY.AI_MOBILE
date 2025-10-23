import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  // State: Track GIF status
  const [isGifLoaded, setIsGifLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  // Anim: Fade-in after load
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer;

    const startAnimation = () => {
      // Fade in smoothly
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500, // Snappy: 1.5s fade
        useNativeDriver: true,
      }).start(() => {
        // Hold 1s, then navigate (total ~2.5s post-load)
        timer = setTimeout(() => navigation.replace('Login'), 4800);
      });
    };

    if (isGifLoaded && !hasError) {
      startAnimation();
    } else if (hasError) {
      // Fallback: Quick navigate on error
      timer = setTimeout(() => navigation.replace('Login'), 1000);
    }

    return () => timer && clearTimeout(timer);
  }, [isGifLoaded, hasError, fadeAnim, navigation]);

  // Optional: Force-skip for testing (uncomment)
  // useEffect(() => {
  //   setTimeout(() => navigation.replace('Login'), 3000);
  // }, [navigation]);

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

      {/* Try GIF first; fallback to static if error */}
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
        // Fallback: Static image (add your PNG here; ~50KB)
        <Image
          source={require('../../assets/Diwali_Greetings (1).gif')} // Create this: screenshot of GIF frame
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
    width: width*0.9, // Smaller for faster decode
    height: height-250,
    marginTop: 20, // Space for spinner
  },
  loadingSpinner: {
    position: 'absolute',
    alignSelf: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
});

export default SplashScreen;