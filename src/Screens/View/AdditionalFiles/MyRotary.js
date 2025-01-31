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
const { width, height } = Dimensions.get("window");
import BASE_URL from "../../../../Config";

const MyRotary = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Banner Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../../assets/myrotary.png")} // Replace with your image path
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome, Rotarian!</Text>

        <View style={styles.bulletContainer}>
          <Text style={styles.bulletText}>
            <Text style={styles.boldText}>0% Fee Marketplace: </Text>
            List your products and services exclusively for fellow Rotarians.
          </Text>
          <Text style={styles.bulletText}>
            <Text style={styles.boldText}>Sell Directly: </Text>
            Reach our vast user base and grow your revenues.
          </Text>
          <Text style={styles.bulletText}>
            <Text style={styles.boldText}>Bulk Purchase Program: </Text>
            We help you maximize profits by buying in bulk.
          </Text>
          <Text style={styles.bulletText}>
            <Text style={styles.boldText}>Double Your Revenues: </Text>
            Connect with new customers and expand your business effortlessly.
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>I'm Interested</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    paddingHorizontal: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A148C", // Purple
    textAlign: "left",
  },
  bulletContainer: {
    marginVertical: 16,
  },
  bulletText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
    color: "#4A148C",
  },
  button: {
    backgroundColor: "#28A745", // Green button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyRotary;
