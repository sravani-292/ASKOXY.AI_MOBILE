import React, { useState ,useEffect} from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("window");
import BASE_URL,{userStage} from "../../Config";
import {getAllCampaignDetails,getUserFeedback,submitUserIntrest,handleGetProfileData} from '../ApiService'
import UserTypeModal from "./UserTypeModal";

const LegalService = ({ navigation }) => {
  const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;
  const [loading, setLoading] = useState(false);
  const[AlreadyInterested,setAlreadyInterested]=useState(false)
  const[profileData,setProfileData]=useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserTypes, setSelectedUserTypes] = useState("");
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
        (item) => item.askOxyOfers === "LEGALSERVICES"
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
  console.log("sravani");

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
    number = profileData.whatsappNumber;
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
    askOxyOfers: "LEGALSERVICES",
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
     Alert.alert(
        "Success", 
        `Your interest as ${selectedTypes} has been submitted successfully!`,
        [{ text: "OK" }]
      );}
    catch (error) {
    console.log("error", error.response);
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
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/legalservice.png")} // Replace with the correct image path
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome, Lawyers and Advocates! </Text>
        <Text style={styles.subtitle}>
          {" "}
          Elevate Your Legal Practice with AskOxy.ai
        </Text>

        <View style={styles.bulletContainer}>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: "bold" }}>
              • Enhance Your Professional Presence :
            </Text>{" "}
            Increase your visibility among individuals seeking legal guidance.
          </Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: "bold" }}>• Share Expertise :</Text>{" "}
            Publish legal insights to educate and establish your authority.
          </Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: "bold" }}>
              {" "}
              • Collaborate on Legal Publications :
            </Text>{" "}
            Partner with professionals to create impactful legal content.
          </Text>
          <Text style={styles.bulletText}>
            <Text style={{ fontWeight: "bold" }}>
              • Expand Your Legal Network :
            </Text>{" "}
            Be part of a vibrant, trusted platform for knowledge sharing and
            collaboration.
          </Text>
          {/* <Text style={styles.bulletText}>
            • Expand Your Network: Be part of a vibrant, trusted platform for
            lawyers and advocates.
          </Text> */}
        </View>

<View style={{ marginBottom: 20,justifyContent: "space-between",flexDirection: "row" }}>
{AlreadyInterested==false?
        <>
        {loading == false ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleInterestedClick()}
          >
            <Text style={styles.buttonText}>I'm Interested</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              <ActivityIndicator size="small" color="#fff" />
            </Text>
          </View>
        )}
        </>
        :
        <View
            style={styles.button1}
            // onPress={() => handleInterestedClick()}
          >
            <Text style={styles.buttonText}>Already Participated</Text>
          </View>
        }
        {/* <TouchableOpacity
            style={[styles.button,{marginLeft: 10}]}
            onPress={() => navigation.navigate("Legal GPT")}
          >
            <Text style={styles.buttonText}>Legal GPT</Text>
          </TouchableOpacity> */}
         </View>
        
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
    paddingHorizontal: 16,
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
    backgroundColor: "#3d2a71",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  button1: {
    backgroundColor: "#9367c7",
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

export default LegalService;
