import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import BASE_URL, { userStage } from "../../../../Config";

const { width, height } = Dimensions.get("window");

const MyRotary = ({navigation}) => {
  const userData = useSelector((state) => state.counter);
  console.log({ userData });
  const [loading, setLoading] = useState(false);
  function interestedfunc() {
    if (userData == null) {
      
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    } else {
      let data = {
        askOxyOfers: "ROTARIAN",
        id: userData.userId,
        mobileNumber: userData.whatsappNumber,
        projectType: "ASKOXY",
      };
      console.log(data);
      setLoading(true);
      axios({
        method: "post",
        url: 
        // userStage == "test" ? 
        BASE_URL + "marketing-service/campgin/askOxyOfferes" ,
        // : BASE_URL + "auth-service/auth/askOxyOfferes",
        data: data,
      })
        .then((response) => {
          console.log(response.data);
          setLoading(false);
          Alert.alert(
            "Success",
            "Your interest has been submitted successfully!"
          );
          //  if (response.data.status == "SUCCESS") {
          //    navigation.navigate("Otp", { mobileNumber: mobileNumber });
          //  } else {
          //    alert(response.data.message);
          //  }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          if (error.response.status == 400) {
            Alert.alert("Failed", "You have already participated. Thank you!");
          } else {
            Alert.alert("Failed", error.response.data);
          }
        });
    }
  }
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
        {loading == false ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#6f2dbd" }]} // Add background color here
            onPress={() => interestedfunc()}
          >
            <Text style={styles.buttonText}>I'm Interested</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={[styles.button, { backgroundColor: "#6f2dbd" }]} // Add background color here
          >
            <Text style={styles.buttonText}>
              <ActivityIndicator size="small" color="#fff" />
            </Text>
          </View>
        )}
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
    width: width * 0.9,
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
    backgroundColor: "#3d2a71",
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
