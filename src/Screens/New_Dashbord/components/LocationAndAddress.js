import React, { useEffect, useState } from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import axios from 'axios';

import BASE_URL from '../../../../Config';
// Initialize Google Geocoding API
Geocoder.init('AIzaSyAM29otTWBIAefQe6mb7f617BbnXTHtN0M'); // Replace with your real key

const LocationAddress = ({customerId,token}) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(customerId){
      fetchOrderAddress();
    }else{
    getLocationAndAddress();
    }
  }, [customerId]);

  const getLocationAndAddress = async () => {
    try {
        setLoading(true);
      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      // Reverse Geocode using Google
      Geocoder.from(location.coords.latitude, location.coords.longitude)
        .then(json => {
          const formattedAddress = json.results[0].formatted_address;
          setAddress(formattedAddress);
          setLoading(false);
        })
        .catch(err => {
          console.warn(err);
          setAddress('Could not get address');
          setLoading(false);
        });

    } catch (err) {
      console.warn(err);
      setErrorMsg('Something went wrong');
    }
  };

  const fetchOrderAddress = async () => {
    setLoading(true);
    try {
      const response = await axios({
        url: BASE_URL + `user-service/getAllAdd?customerId=${customerId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("address responseeeeeeee", response.data);
        let fullAddress
        response.data.slice(-1).map(
          (address) => (
          fullAddress = `${address.flatNo}, ${address.residenceName}, ${address.houseType}, ${address.area}, ${address.address}, ${address.landMark}, Pincode: ${address.pincode}`,
            setAddress(fullAddress)
          )
        );
      setLoading(false);
      // console.log("address response", response.data);
    } catch (error) {
      console.log("Error fetching order address data:", error);
      setLoading(false);
    }
  };

  return (
    <View>  
        {loading? <Text>Loading...</Text> : 
        <> 
      {address ? <Text style={styles.addressText} numberOfLines={1}>{address}</Text> : <Text>
        {errorMsg && 'Please enable location services'}</Text>}
        </>
        }
    </View>
  );
};

export default LocationAddress;

const styles = StyleSheet.create({
    addressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
