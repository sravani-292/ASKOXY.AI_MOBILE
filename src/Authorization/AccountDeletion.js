import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get device width for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TEXT_WIDTH = SCREEN_WIDTH - 40; // Account for padding (20px on each side)

const AccountDeletionScreen = ({ navigation }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [otherReason, setOtherReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const deletionReasons = [
    { id: 1, reason: 'I don\'t order rice frequently enough' },
    { id: 2, reason: 'Delivery times are too long' },
    { id: 3, reason: 'I found another rice delivery service' },
    { id: 4, reason: 'Product quality did not meet expectations' },
    { id: 5, reason: 'The prices are too high' },
    { id: 6, reason: 'Other' },
  ];

  const handleDeleteAccount = async () => {
    if (!selectedReason) {
      Alert.alert('Required', 'Please select a reason for deleting your account');
      return;
    }

    if (selectedReason === 6 && !otherReason.trim()) {
      Alert.alert('Required', 'Please provide details about why you are deleting your account');
      return;
    }

    Alert.alert(
      'Confirm Permanent Deletion',
      'Are you sure you want to permanently delete your account? This action cannot be undone, and all your order history, addresses, and payment information will be permanently erased.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, Delete Permanently', style: 'destructive', onPress: performHardDelete }
      ]
    );
  };

//   const performHardDelete = async () => {
//     setIsLoading(true);

//     try {
//       // Simulate hard deletion by removing all local data
//       const keysToRemove = [
//         'USER_TOKEN',
//         'USER_DATA',
//         'ADDRESSES',
//         'PAYMENT_METHODS',
//         'ORDER_HISTORY',
//         'FAVORITES',
//         'CART_ITEMS',
//         'USER_PREFERENCES'
//       ];

//       // Record deletion reason for analytics
//       const deletionData = {
//         reasonId: selectedReason,
//         reasonText: selectedReason === 6 ? otherReason : deletionReasons.find(r => r.id === selectedReason).reason,
//         deletedAt: new Date().toISOString()
//       };
      
//       await AsyncStorage.setItem('DELETION_ANALYTICS', JSON.stringify(deletionData));
      
//       // Perform multi-key deletion
//       await AsyncStorage.multiRemove(keysToRemove);
      
//       // Simulate processing time
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       // Show confirmation and navigate to welcome screen
//       Alert.alert(
//         'Account Deleted',
//         'Your account and all associated data have been permanently deleted.',
//         [{ 
//           text: 'OK', 
//           onPress: () => navigation.reset({
//             index: 0,
//             routes: [{ name: 'Service' }],
//           })
//         }]
//       );
//     } catch (error) {
//       Alert.alert('Error', 'There was a problem deleting your account. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };


const performHardDelete = async () => {
    setIsLoading(true);
  
    try {
      // List of all keys to delete
      const keys = [
        'USER_TOKEN',
        'USER_DATA',
        'ADDRESSES',
        'PAYMENT_METHODS',
        'ORDER_HISTORY',
        'FAVORITES',
        'CART_ITEMS',
        'USER_PREFERENCES'
      ];
  
      // Save deletion analytics
      const deletionData = {
        reasonId: selectedReason,
        reasonText: selectedReason === 6 
          ? otherReason 
          : deletionReasons.find(r => r.id === selectedReason)?.reason || 'No reason',
        deletedAt: new Date().toISOString()
      };
      await AsyncStorage.setItem('DELETION_ANALYTICS', JSON.stringify(deletionData));
  
      // Delete each key individually
      for (const key of keys) {
        await AsyncStorage.removeItem(key);
      }
      await AsyncStorage.removeItem('userData'); // Remove user data
  
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));
  
      // Alert and redirect
      Alert.alert(
        'Account Deleted',
        'Your account and all associated data have been permanently deleted.',
        [
          {
            text: 'OK',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Service Screen' }],
            }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'There was a problem deleting your account. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  
  const renderReasonItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.reasonItem,
        selectedReason === item.id && styles.selectedReasonItem
      ]}
      onPress={() => setSelectedReason(item.id)}
    >
      <Text style={[styles.reasonText, { width: TEXT_WIDTH - 60 }]}>{item.reason}</Text>
      {selectedReason === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#8BC34A" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { width: TEXT_WIDTH }]}>ASKOXY.AI</Text>
            <Text style={[styles.logoSubtext, { width: TEXT_WIDTH }]}>Premium Rice Delivery</Text>
          </View>

          <Text style={[styles.messageTitle, { width: TEXT_WIDTH }]}>
            We're sorry to see you go
          </Text>
          
          <Text style={[styles.messageText, { width: TEXT_WIDTH }]}>
            Your account and all associated data will be permanently deleted.
            This action cannot be undone. Please tell us why you're leaving:
          </Text>

          <View style={styles.reasonsContainer}>
            {deletionReasons.map(renderReasonItem)}
          </View>

          {selectedReason === 6 && (
            <TextInput
              style={[styles.otherReasonInput, { width: TEXT_WIDTH }]}
              placeholder="Please tell us more..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={otherReason}
              onChangeText={setOtherReason}
            />
          )}

          <View style={[styles.policyContainer, { width: TEXT_WIDTH }]}>
            <Text style={[styles.policyTitle, { width: TEXT_WIDTH - 32 }]}>Account Deletion Information</Text>
            <Text style={[styles.policyText, { width: TEXT_WIDTH - 32 }]}>
              When you delete your ASKOXY.AI account:
            </Text>
            <Text style={[styles.policyPoint, { width: TEXT_WIDTH - 40 }]}>• Your account will be permanently deleted immediately</Text>
            <Text style={[styles.policyPoint, { width: TEXT_WIDTH - 40 }]}>• All order history and receipts will be erased</Text>
            <Text style={[styles.policyPoint, { width: TEXT_WIDTH - 40 }]}>• Your delivery addresses will be removed from our database</Text>
            <Text style={[styles.policyPoint, { width: TEXT_WIDTH - 40 }]}>• Your payment information will be securely deleted</Text>
            <Text style={[styles.policyPoint, { width: TEXT_WIDTH - 40 }]}>• Your loyalty points and rewards will be forfeited</Text>
            <Text style={[styles.policyFooter, { width: TEXT_WIDTH - 32 }]}>
              This is a hard delete - we don't retain any information and you'll need to create a new account if you wish to use our service again.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.deleteButton, isLoading && styles.disabledButton, { width: TEXT_WIDTH }]}
            onPress={handleDeleteAccount}
            disabled={isLoading}
          >
            <Text style={[styles.deleteButtonText, { width: TEXT_WIDTH - 40 }]}>
              {isLoading ? 'Deleting Account...' : 'Permanently Delete My Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.cancelButton, { width: TEXT_WIDTH }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelButtonText, { width: TEXT_WIDTH - 40 }]}>Keep My Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    // flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
    marginTop: -20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8BC34A',
    textAlign: 'center',
  },
  logoSubtext: {
    fontSize: 16,
    color: '#689F38',
    marginTop: 4,
    textAlign: 'center',
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  reasonsContainer: {
    marginBottom: 20,
    width: '100%',
  },
  reasonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  selectedReasonItem: {
    borderColor: '#8BC34A',
    backgroundColor: 'rgba(139, 195, 74, 0.05)',
  },
  reasonText: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  otherReasonInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  policyContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  policyText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  policyPoint: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 6,
    paddingLeft: 4,
  },
  policyFooter: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#ffcdd2',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default AccountDeletionScreen;