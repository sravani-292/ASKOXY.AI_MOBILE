import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For call and close icons
import LinearGradient from 'react-native-linear-gradient'; // For gradient backgrounds
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// CallButton component displays a call icon and toggles a modal with phone numbers+91 81432 71103

const CallButton = ({ phoneNumbers = ['+91 81432 71103', '+91 91105 64106'] }) => {
  // State to toggle phone numbers modal visibility
  const [showNumbers, setShowNumbers] = useState(false);
  // Animation value for button press
  const buttonScale = useSharedValue(1);

  // Function to handle phone call
  const makeCall = (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.error('Phone calls not supported on this device');
        }
      })
      .catch((err) => console.error('Error making call:', err));
  };

  // Handle button press animation
  const handleButtonPressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100, easing: Easing.ease });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100, easing: Easing.ease });
  };

  // Animated style for the call button
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Call Icon Button to toggle phone numbers modal */}
      <Animated.View style={[animatedButtonStyle]}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          onPress={() => setShowNumbers(true)}
          accessibilityLabel="Open phone numbers"
          accessibilityHint="Opens a modal to select a phone number to call"
        >
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']} // Purple gradient to match BharathAgentstore
            style={styles.buttonGradient}
          >
            <Ionicons name="call" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal for Phone Numbers */}
      <Modal
        visible={showNumbers && phoneNumbers.length > 0}
        animationType="fade"
        transparent
        onRequestClose={() => setShowNumbers(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']} // Subtle white-to-light-gray gradient
            style={styles.modalContent}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Support</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowNumbers(false)}
                accessibilityLabel="Close phone numbers modal"
                accessibilityHint="Closes the phone number selection modal"
              >
                <Ionicons name="close" size={24} color="#2563eb" />
              </TouchableOpacity>
            </View>

            {/* Phone Numbers List */}
            {phoneNumbers.map((number, index) => (
              <TouchableOpacity
                key={`phone-${index}`}
                style={[
                  styles.numberItem,
                  index % 2 === 0 ? styles.numberItemEven : styles.numberItemOdd,
                ]}
                onPress={() => {
                  makeCall(number);
                  setShowNumbers(false); // Close modal after selection
                }}
                accessibilityLabel={`Call ${number}`}
                accessibilityHint={`Initiates a call to ${number}`}
              >
                <Ionicons name="call-outline" size={20} color="#2563eb" style={styles.numberIcon} />
                <Text style={styles.numberText}>{number}</Text>
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};

export default CallButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8, // Added spacing for integration in BharathAgentstore header
  },
  button: {
    borderRadius: 9999, // Fully rounded
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // Enhanced shadow for Android
  },
  buttonGradient: {
    padding: 12,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker semi-transparent background
  },
  modalContent: {
    borderRadius: 12,
    width: 240, // Slightly wider for better readability
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Subtle border to match BharathAgentstore
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B', // Matches BharathAgentstore text color
  },
  closeButton: {
    padding: 8,
  },
  numberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderRadius: 8, // Rounded corners for list items
  },
  numberItemEven: {
    backgroundColor: '#F8FAFC', // Light gray for even items
  },
  numberItemOdd: {
    backgroundColor: '#FFFFFF', // White for odd items
  },
  numberIcon: {
    marginRight: 12,
  },
  numberText: {
    color: '#2563eb', // Blue text to match BharathAgentstore
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
});