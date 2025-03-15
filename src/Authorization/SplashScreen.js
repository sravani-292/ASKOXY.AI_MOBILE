import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet,Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import Ionicons from "react-native-vector-icons/Ionicons"

const {width,height}=Dimensions.get('window'|| 'screen' )
const SplashScreen = ({ navigation }) => {
  // Initialize animated value
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000, // Adjust duration as needed
      useNativeDriver: true,
    }).start(() => {
      // After animation completes, navigate to the login or register screen
      navigation.replace('Service Screen'); // Change 'Login' to the appropriate screen
    });
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>navigation.replace('Service Screen')} style={{alignSelf:"flex-end",top:-25,right:25}}>
      <Ionicons name={"close"} size={36} />
      </TouchableOpacity>
      <Animated.Image
        source={require('../../assets/holi1.png')} // Replace with your logo path
        style={[styles.logo, { opacity: fadeAnim }]} // Apply animated opacity
        resizeMode="contain"
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Optional: set the background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width*0.9, // Adjust size as needed
    height: height/2,
  },
});

export default SplashScreen;
