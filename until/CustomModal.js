import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const ConfirmModal = ({
  visible,
  onClose,
  type = 'success', // 'success', 'error', 'payment'
  title,
  message,
  primaryButtonText = 'OK',
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  autoClose = false,
  autoCloseDelay = 3000,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close if enabled
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    } else {
      // Hide animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, autoClose, autoCloseDelay]);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getLottieAnimations = () => {
    switch (type) {
      case 'success':
        return {
          source: require('../assets/Animations/success.json'), // You'll need to add this file
          borderColor: '#4CAF50',
          backgroundColor: '#E8F5E8',
          titleColor: '#2E7D32',
        };
      case 'error':
        return {
          source: require('../assets/Animations/error.json'), // You'll need to add this file
          borderColor: '#F44336',
          backgroundColor: '#FFEBEE',
          titleColor: '#C62828',
        };
      case 'payment':
        return {
          source: require('../assets/Animations/payment.json'), // You'll need to add this file
          borderColor: '#2196F3',
          backgroundColor: '#E3F2FD',
          titleColor: '#1565C0',
        };
      default:
        return {
          source: require('../assets/Animations/info.json'), // You'll need to add this file
          borderColor: '#757575',
          backgroundColor: '#F5F5F5',
          titleColor: '#424242',
        };
    }
  };

  const modalStyles = getLottieAnimations();

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress();
    } else {
      handleClose();
    }
  };

  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    }
    handleClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.touchableOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                backgroundColor: modalStyles.backgroundColor,
                borderColor: modalStyles.borderColor,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              {/* Close button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleSecondaryPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>

              {/* Lottie Animation */}
              <View style={styles.animationContainer}>
                <LottieView
                  source={modalStyles.source}
                  autoPlay
                  loop={false}
                  style={styles.lottieAnimation}
                />
              </View>

              {/* Title */}
              {title && (
                <Text
                  style={[
                    styles.title,
                    { color: modalStyles.titleColor },
                  ]}
                >
                  {title}
                </Text>
              )}

              {/* Message */}
              {message && (
                <Text style={styles.message}>{message}</Text>
              )}

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {secondaryButtonText && (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.secondaryButton,
                      { borderColor: modalStyles.borderColor },
                    ]}
                    onPress={handleSecondaryPress}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        styles.secondaryButtonText,
                        { color: modalStyles.borderColor },
                      ]}
                    >
                      {secondaryButtonText}
                    </Text>
                  </TouchableOpacity>
                )}

                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.primaryButton,
                      { backgroundColor: modalStyles.borderColor },
                      secondaryButtonText && styles.buttonMargin,
                    ]}
                    onPress={handlePrimaryPress}
                  >
                    <Text style={[styles.buttonText, styles.primaryButtonText]}>
                      {primaryButtonText}
                    </Text>
                  </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
    borderWidth: 2,
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  animationContainer: {
    marginBottom: 20,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonMargin: {
    marginLeft: 10,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#2196F3',
  },
});

export default ConfirmModal;