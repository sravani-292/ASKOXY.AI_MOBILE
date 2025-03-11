import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
const{width,height}=Dimensions.get("window")

const Machines = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/manufacturing.png")} // Replace with the correct image path
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </View>

   
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  bannerImage: {
    width: width*0.9,
    height: 300,
  },
  textContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A148C", // Purple color
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#4A148C",
    textAlign: "center",
    marginBottom: 16,
  },
  bulletContainer: {
    marginVertical: 16,
  },
  bulletText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#28A745", // Green button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Machines;
