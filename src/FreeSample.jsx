import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const FreeSampleScreen = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <MaterialCommunityIcons name="gift-outline" size={28} color="#3d2a71" style={styles.icon} />
        <Text style={styles.title}>Free Sample</Text>
        <Text style={styles.description}>
          Visit the nearest stalls and scan the barcode to get a free sample!
        </Text>
        
        <View style={styles.buttonContainer}>
          {/* Button to Open Map */}
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Store Location")}
          >
            <Ionicons name="location-outline" size={18} color="white" />
            <Text style={styles.buttonText}>Find a Store</Text>
          </TouchableOpacity> */}
          
          {/* Button to Scan Barcode */}
          <TouchableOpacity
            style={[styles.button, styles.scanButton]}
            onPress={() => navigation.navigate("Scan")}
          >
            <Ionicons name="scan-outline" size={18} color="white" />
            <Text style={styles.buttonText}>Scan Barcode</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    width: width * 0.9,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#3d2a71",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    color: "#666",
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#3d2a71",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.48,
  },
  scanButton: {
    backgroundColor: "#b1a9c6",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
});

export default FreeSampleScreen;