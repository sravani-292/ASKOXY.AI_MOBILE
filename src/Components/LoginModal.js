import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import GoogleAnalyticsService from './GoogleAnalytic'; // Adjust the import path

const { width } = Dimensions.get('window');

const LoginModal = ({ visible, onClose }) => {
  const translateY = useSharedValue(width); 
  const navigation = useNavigation();

  useEffect(() => {
    // Animate modal
    translateY.value = visible 
      ? withSpring(0, { damping: 15, stiffness: 100 }) 
      : withSpring(width);

    // Track modal visibility
    if (visible) {
      // Log screen view
      GoogleAnalyticsService.screenView('Login Modal');
      
      // Log modal opened event
      GoogleAnalyticsService.sendEvent('login_modal_opened', {
        modal_type: 'welcome_back'
      });
    }
  }, [visible]);

  const handleLogin = async () => {
    try {
      // Track login button press
      await GoogleAnalyticsService.login('modal_login');
      
      // Additional custom event
      await GoogleAnalyticsService.sendEvent('login_button_pressed', {
        modal_source: 'welcome_back_modal'
      });

      // Close modal and navigate
      onClose();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Login tracking error:', error);
    }
  };

  const handleSignup = async () => {
    try {
      // Track signup button press
      await GoogleAnalyticsService.signup('modal_signup');
      
      // Additional custom event
      await GoogleAnalyticsService.sendEvent('signup_button_pressed', {
        modal_source: 'welcome_back_modal'
      });

      // Close modal and navigate
      onClose();
      navigation.navigate('RegisterScreen');
    } catch (error) {
      console.error('Signup tracking error:', error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      // Track forgot password button press
      await GoogleAnalyticsService.sendEvent('forgot_password_pressed', {
        modal_source: 'welcome_back_modal'
      });

      // Navigate to forgot password screen
      navigation.navigate('ForgotPassword');
    } catch (error) {
      console.error('Forgot password tracking error:', error);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <View style={styles.headerContainer}>
            <Text style={styles.loginText} numberOfLines={1} adjustsFontSizeToFit>
              Welcome Back
            </Text>
            <TouchableOpacity 
              onPress={onClose} 
              style={styles.closeIcon}
            >
              <Text style={styles.closeIconText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.descriptionText} numberOfLines={2} adjustsFontSizeToFit>
            Choose how you'd like to continue
          </Text>

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
          >
            <Text style={styles.buttonText} numberOfLines={1} adjustsFontSizeToFit>
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signupButton} 
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText} numberOfLines={1} adjustsFontSizeToFit>
              Sign Up
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity 
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText} numberOfLines={1} adjustsFontSizeToFit>
              Forgot Password?
            </Text>
          </TouchableOpacity> */}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 20,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    width: width * 0.6, // 60% of screen width
    textAlign: 'left',
  },
  closeIcon: {
    padding: 10,
  },
  closeIconText: {
    fontSize: 20,
    color: '#888',
  },
  descriptionText: {
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    width: width * 0.8, // 80% of screen width
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 3,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    width: width * 0.6, // 60% of screen width
    textAlign: 'center',
  },
  signupButtonText: {
    color: "#007bff",
    fontSize: 18,
    fontWeight: "bold",
    width: width * 0.6, // 60% of screen width
    textAlign: 'center',
  },
  forgotPasswordButton: {
    marginTop: 20,
  },
  forgotPasswordText: {
    color: "#007bff",
    fontSize: 16,
    width: width * 0.6, // 60% of screen width
    textAlign: 'center',
  },
});

export default LoginModal;