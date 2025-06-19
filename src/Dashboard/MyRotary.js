import React, { useState,useEffect } from "react";
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
import BASE_URL, { userStage } from "../../Config";
import {
  getAllCampaignDetails,
  getUserFeedback,
  submitUserIntrest,
  handleGetProfileData,
} from "../ApiService";

import UserTypeModal from "./UserTypeModal";

const { width, height } = Dimensions.get("window");

const MyRotary = ({navigation}) => {
  const userData = useSelector((state) => state.counter);
  console.log({ userData });
   const token = userData.accessToken;
  const customerId = userData.userId;
  const [loading, setLoading] = useState(false);
  const[AlreadyInterested,setAlreadyInterested]=useState(false)
  const[profileData,setProfileData]=useState()
  const [modalVisible, setModalVisible] = useState(false);
const [selectedUserTypes, setSelectedUserTypes] = useState("");
  // const[number,setNumber]=useState()
  console.log("userData", userData);
  let number;

  useEffect(()=>{
 if(userData==null){
      Alert.alert("Alert","Please login to continue",[
        {text:"OK",onPress:()=>navigation.navigate("Login")},
        {text:"Cancel"}
      ])
      return;
    }else{
      getCall()
      getProfile()
    }  },[])

  const getProfile = async () => {
      try {
        const response = await handleGetProfileData(customerId);
        console.log("Profile Response:", response);
    
        if (response && response.status === 200) {
          setProfileData(response.data); // assuming setProfileData is defined
        } else {
          console.warn("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };


     const getCall = async () => {
      try {
        const data = {
          userId: userData.userId,
        };
    
        const response = await getUserFeedback(data); 
    
        const hasFreeAI = response?.data?.some(
          (item) => item.askOxyOfers === "ROTARIAN"
        );
    
        if (hasFreeAI) {
          setAlreadyInterested(true);
        } else {
          setAlreadyInterested(false);
        }
    
      } catch (error) {
        console.log("Error fetching user feedback:", error?.response || error.message);
      }
    };

  const handleInterestedClick = () => {
    if (!userData) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    }
    setModalVisible(true);
  };

  // Handle modal submission
  const handleModalSubmit = async (selectedTypesString) => {
    setSelectedUserTypes(selectedTypesString);
    setModalVisible(false);
    
    // Call the API with selected types
    await interestedfunc(selectedTypesString);
  };

  // Handle modal cancellation
  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const interestedfunc = async (selectedTypes = "") => {
  if (userData == null) {
    Alert.alert("Alert", "Please login to continue", [
      { text: "OK", onPress: () => navigation.navigate("Login") },
      { text: "Cancel" },
    ]);
    return;
  }

  console.log("varalakshmi");

  let number = null;

  if (profileData?.whatsappNumber && profileData?.mobileNumber) {
    console.log("sravani");
    number = profileData.whatsappNumber;
    console.log("whatsapp number", number);
  } else if (profileData?.whatsappNumber && profileData?.whatsappNumber !== "") {
    number = profileData.whatsappNumber;
  } else if (profileData?.mobileNumber && profileData?.mobileNumber !== "") {
    number = profileData.mobileNumber;
  }

  if (!number) {
    console.log("Error", "No valid phone number found.");
    return;
  }

  const data = {
    askOxyOfers: "ROTARIAN",
    userId: userData.userId,
    mobileNumber: number,
    projectType: "ASKOXY",
    userRole: selectedTypes.toLocaleUpperCase(), 
  };

  console.log(data);
  setLoading(true);

  try {
    const response = await submitUserIntrest(data);
    console.log(response.data);
    // Alert.alert("Success", "Your interest has been submitted successfully!");
     Alert.alert(
            "Success", 
            `Your interest as ${selectedTypes} has been submitted successfully!`,
            [{ text: "OK" }]
          );
  } catch (error) {
    console.log(error);
    if (error.response?.status === 400) {
      Alert.alert("Failed", "You have already participated. Thank you!");
    } else {
      Alert.alert("Failed", error.response?.data || "Something went wrong!");
    }
  } finally {
    setLoading(false);
  }
};




  return (
    <ScrollView style={styles.container}>
      {/* Banner Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/myrotary.png")} // Replace with your image path
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

{AlreadyInterested==false?
<>
        {/* Button */}
        {loading == false ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#6f2dbd" }]} // Add background color here
            onPress={() => handleInterestedClick()}
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
        </>
        :
        <View
            style={[styles.button, { backgroundColor: "#9367c7" }]} // Add background color here
          >
            <Text style={styles.buttonText}>Already Participated</Text>
          </View>
        }
    </View>
     <UserTypeModal
        visible={modalVisible}
        onSubmit={handleModalSubmit}
        onCancel={handleModalCancel}
      />
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
