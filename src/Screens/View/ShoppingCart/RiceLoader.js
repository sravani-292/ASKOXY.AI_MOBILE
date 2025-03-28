import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, Animated, Easing, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const riceBags = [
  { id: "1", name: "Basmati Rice", image: require("../../../../assets/myrotary.png") },
  { id: "2", name: "Sona Masoori", image: require("../../../../assets/legal.png") },
  { id: "3", name: "Kolam Rice", image: require("../../../../assets/LegalHub.png") },
  { id: "4", name: "Brown Rice", image: require("../../../../assets/legal.png") },
  { id: "5", name: "Jeera Samba", image: require("../../../../assets/myrotary.png") },
];

const RiceLoader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0]; // Set initial value to 1
  const scaleAnim = useState(new Animated.Value(1))[0]; // Ensure default visibility

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.85,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % riceBags.length);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={["#4B0082", "#5A007A"]} style={styles.container}>
      <View style={styles.card}>
        <Animated.Image
          source={riceBags[currentIndex].image}
          style={[
            styles.image,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        />
        <Animated.Text style={[styles.riceName, { opacity: fadeAnim }]}>
          {riceBags[currentIndex].name}
        </Animated.Text>
      </View>
      <Text style={styles.tagline}>Your Need, Our Priority!</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: width * 0.5,
    height: height * 0.35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    padding: 25,
  },
  image: {
    width: 160, // Increased size for better visibility
    height: 160,
    resizeMode: "contain",
  },
  riceName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5D4037",
    marginTop: 20,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFAB40",
    marginTop: 30,
  },
});

export default RiceLoader;
