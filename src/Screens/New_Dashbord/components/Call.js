import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Modal, Platform, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For call and close icons
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
const {height,width}=Dimensions.get('window')
// CallButton component displays a call icon and toggles a modal with phone numbers
import { useSelector } from 'react-redux';
const CallButton = () => {
  // State to toggle phone numbers modal visibility
  const [showNumbers, setShowNumbers] = useState(false);
  const [phoneData, setPhoneData] = useState([]);
  const [loading, setLoading] = useState(false);
  // Animation value for button press
  const buttonScale = useSharedValue(1);
    const user = useSelector((state) => state.counter);
    const userId = user?.userId || user?.id;

  // Fetch phone numbers from API
  const fetchPhoneNumbers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://meta.oxyloans.com/api/user-service/callerNumberToUserMapping/${userId}`);
      const data = await response.json();
      
      if (data && data.callerNumber) {
        setPhoneData([{
          number: data.callerNumber,
          name: data.callerName || 'Unknown',
          email: data.email
        }]);
      }
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      // Fallback to default numbers
      setPhoneData([
        { number: '8143271103', name: 'Support 1' },
        { number: '9110564106', name: 'Support 2' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoneNumbers();
  }, [userId]);

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
            colors={['#667eea', '#764ba2']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="call" size={26} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal for Phone Numbers */}
      <Modal
        visible={showNumbers}
        animationType="fade"
        transparent
        onRequestClose={() => setShowNumbers(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.modalHeaderGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.modalTitle}>📞 Contact Support</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowNumbers(false)}
                accessibilityLabel="Close phone numbers modal"
                accessibilityHint="Closes the phone number selection modal"
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Loading contacts...</Text>
              </View>
            ) : (
              <View style={styles.contactsList}>
                {phoneData.map((contact, index) => (
                  <TouchableOpacity
                    key={`phone-${index}`}
                    style={styles.contactCard}
                    onPress={() => {
                      makeCall(contact.number);
                      setShowNumbers(false);
                    }}
                    accessibilityLabel={`Call ${contact.name} at ${contact.number}`}
                    accessibilityHint={`Initiates a call to ${contact.name} at ${contact.number}`}
                  >
                    <View style={styles.avatarContainer}>
                      <Text style={styles.avatarText}>{contact.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.nameText}>{contact.name}</Text>
                      <Text style={styles.numberText}>📱 {contact.number}</Text>
                      {contact.email && <Text style={styles.emailText}>✉️ {contact.email}</Text>}
                    </View>
                    <View style={styles.callIconContainer}>
                      <Ionicons name="call" size={20} color="#667eea" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
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
    borderRadius: 30,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  buttonGradient: {
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    minHeight: 60,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    borderRadius: 20,
    width: width*0.9,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  modalHeaderGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  contactsList: {
    padding: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  callIconContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
  },
  contactInfo: {
    flex: 1,
  },
  nameText: {
    color: '#1e293b',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  numberText: {
    color: '#667eea',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  emailText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
});