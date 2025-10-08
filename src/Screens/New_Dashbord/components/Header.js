// components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LocationAddress from './LocationAndAddress';
import CallButton from './Call';
import VoiceCallModal from '../../AIAgent/EcommerceVoiceAssistant/screens/VoiceCallModal';

// Default gradient colors if none are provided
const defaultGradientColors = ['#F5F5F5', '#FFFFFF'];

const Header = ({navigation, userData, profileData, headerGradientColors = defaultGradientColors, modalVisible, setModalVisible}) => (
  <LinearGradient
    colors={headerGradientColors}
    style={styles.headerGradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.header}>
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={20} color="#FF6B35" />
        <View style={styles.locationText}>
          <Text style={styles.deliveryText}>
            Delivery {!profileData === null && `to ${profileData.firstName} ${profileData.lastName}`}
          </Text>
          <LocationAddress customerId={userData?.userId} token={userData?.accessToken}/>
        </View>
      </View>
      {userData ? (
        // <TouchableOpacity style={styles.profileButton} onPress={()=>{navigation.navigate('Profile')}}>
        //   <Ionicons name="call" size={24} color="#666" />
        // </TouchableOpacity>
       <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
         <Ionicons name="call" size={24} color="#fff" />
      </TouchableOpacity>
      <VoiceCallModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
      ) : (
        <TouchableOpacity style={styles.profileButton} onPress={()=>{navigation.navigate('Login')}}>
          <Ionicons name="person" size={24} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  headerGradient: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 8,
    flex: 1,
  },
  deliveryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  button: { backgroundColor: "#00bcd4", paddingVertical: 14, paddingHorizontal: 15, borderRadius: 28 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

export default Header;