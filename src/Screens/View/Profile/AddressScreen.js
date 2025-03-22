import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from "axios"; 
import { useSelector } from "react-redux";
import BASE_URL,{userStage} from "../../../../Config";
const { width, height } = Dimensions.get('window');

const AddressBookScreen = ({ navigation }) => {
      const userData = useSelector((state) => state.counter);
      const token = userData.accessToken;
  const customerId = userData.userId;
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);

useEffect(()=>{
    fetchOrderAddress()
},[])
  const fetchOrderAddress = async () => {
    setLoading(true);
    try {
      const response = await axios({
        url: BASE_URL+`user-service/getAllAdd?customerId=${customerId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("All addresss are :", response.data);

      if (response && response.data) {
        setAddresses(response.data);
      } else {
        console.warn("API returned empty or invalid data");
        setAddresses([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching order address data:", error);
      setLoading(false);
    }
  };







  const renderAddressItem = ({ item }) => {
    const isSelected = selectedAddress === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.addressCard,
          isSelected ? styles.selectedAddressCard : null
        ]}
        onPress={() => setSelectedAddress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.addressHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.addressName}>{item.addressType}</Text>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </View>
          
          
        </View>
        
        <Text style={styles.recipientName}>{item.address}</Text>
        <Text style={styles.addressLine}>{`${item.flatNo}, ${item.landMark} ${item.pincode}`}</Text>

        {/* <Text style={styles.addressLine}>{item.street}</Text>
        {item.apartment ? <Text style={styles.addressLine}>{item.address}</Text> : null}
        <Text style={styles.addressLine}>{`${item.flatNo}, ${item.landMark} ${item.pincode}`}</Text> */}
        {/* <Text style={styles.addressLine}>{item.country}</Text>
        <Text style={styles.phoneNumber}>{item.phone}</Text> */}
        
        {/* {isSelected && !item.isDefault && (
          <TouchableOpacity 
            style={styles.setDefaultButton}
            onPress={() => handleSetDefaultAddress(item.id)}
          >
            <Text style={styles.setDefaultText}>Set as Default</Text>
          </TouchableOpacity>
        )} */}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <View style={styles.rightHeaderPlaceholder} />
      </View> */}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading your addresses...</Text>
        </View>
      ) : (
        <>
          {addresses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="location-outline" size={80} color="#ccc" />
              <Text style={styles.emptyText}>You don't have any saved addresses</Text>
              {/* <Text style={styles.emptySubText}>Add an address to make checkout faster</Text> */}
            </View>
          ) : (
            <FlatList
              data={addresses}
              renderItem={renderAddressItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
          
        
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  rightHeaderPlaceholder: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6200ee',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100, // Extra space for Add button
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedAddressCard: {
    borderColor: '#6200ee',
    borderWidth: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  defaultBadge: {
    backgroundColor: '#e0f2f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  defaultText: {
    fontSize: 12,
    color: '#00897b',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 5,
  },
  addressLine: {
    fontSize: 15,
    color: '#666',
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 15,
    color: '#666',
    marginTop: 6,
  },
  setDefaultButton: {
    marginTop: 12,
    backgroundColor: '#f0ebff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  setDefaultText: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});

export default AddressBookScreen;