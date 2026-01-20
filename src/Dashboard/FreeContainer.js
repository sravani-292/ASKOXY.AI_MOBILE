import React,{useState,useEffect} from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet,ActivityIndicator,Dimensions,Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
 const FreeContainer = ({navigation}) => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const [loading, setLoading] = useState(false);
  const[AlreadyInterested,setAlreadyInterested]=useState(false)
  const[profileData,setProfileData]=useState()
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserTypes, setSelectedUserTypes] = useState("");

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
    }
  },[])


const getProfile = async () => {
    console.log("customerId",customerId);
     try {
      const response = await handleGetProfileData(customerId);
      // console.log("Profile Response:", response);

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
         (item) => item.askOxyOfers === "FREESAMPLE"
       );
 
       if (hasFreeAI) {
         setAlreadyInterested(true);
       } else {
         setAlreadyInterested(false);
       }
     } catch (error) {
       console.log(
         "Error fetching user feedback:",
         error?.response || error.message
       );
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
     console.log("I am interested in abroad with types:", selectedTypes);
 
     if (!userData) {
       Alert.alert("Alert", "Please login to continue", [
         { text: "OK", onPress: () => navigation.navigate("Login") },
         { text: "Cancel" },
       ]);
       return;
     }
 
     let number = null;
    console.log("profiledata",profileData);
 
     if (profileData?.whatsappNumber) {
       number = profileData.whatsappNumber;
     } else if (profileData?.mobileNumber) {
       number = profileData.mobileNumber;
     }
 
     if (!number) {
       Alert.alert("Error", "No valid phone number found. Please update your profile.");
       return;
     }
 
     const data = {
       askOxyOfers: "FREESAMPLE",
       userId: userData.userId,
       mobileNumber: number,
       projectType: "ASKOXY",
       userRole: selectedTypes.toLocaleUpperCase(), 
     };
 
     console.log("Sending Data:", data);
     setLoading(true);
 
     try {
       const response = await submitUserIntrest(data);
       console.log("STUDYABROAD Response:", response.data);
       await getCall();
       Alert.alert(
         "Success", 
         `Your interest as ${selectedTypes} has been submitted successfully!`,
         [{ text: "OK" }]
       );
     } catch (error) {
       console.error("Error:", error);
       if (error.response?.status === 400) {
         Alert.alert("Already Registered", "You have already participated. Thank you!");
       } else {
         Alert.alert(
           "Failed", 
           error.response?.data?.message || "Something went wrong. Please try again."
         );
       }
     } finally {
       setLoading(false);
     }
   };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
    <ScrollView contentContainerStyle={{ backgroundColor: "#f8f8f8" }} keyboardShouldPersistTaps="always">
      <Text style={styles.header}>Free Rice Samples & Steel Container</Text>
      <Image
        source={require("../../assets/container.jpg")}
        style={styles.image}
      />
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "green",
            textAlign: "center",
          }}
        >
          Special Offer: Free Rice Container! 🎉
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          Buy a 26kg rice bag & get a FREE rice container!
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontStyle: "italic",
            color: "#555",
            marginTop: 5,
            textAlign: "center",
          }}
        >
          (Container remains Oxy Group asset until ownership is earned.)
        </Text>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            How to Earn Ownership:
          </Text>
          <Text style={{ fontSize: 16, marginTop: 5 }}>
            ✅ <Text style={styles.text}>Plan A:</Text> Buy 9 bags in 3 year and
            the container is yours forever.
          </Text>
          <Text style={styles.ortext}>OR</Text>
          <Text style={{ fontSize: 16, marginTop: 5 }}>
            ✅ <Text style={styles.text}>Plan B:</Text> Refer 9 people, and when
            they buy their first bag, the container is yours forever.
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Important Info:
          </Text>
          <Text style={{ fontSize: 16, marginTop: 5, color: "#555" }}>
            ✅ No purchase in 90 days or a 90-day gap between purchases =
            Container will be taken back.
          </Text>
          <Text style={{ marginTop: 5 }}>
            If you are interested in buying a rice bag, please click the I am
            Interested button
          </Text>
         
        </View>

{AlreadyInterested==false?
<>
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
        onPress={() => handleInterestedClick()}
      >
        <Text style={styles.buttonText}>Already Participated</Text>
      </View>
        }
      </View>
    </ScrollView>
     {selectedUserTypes !== "" && (
                  <View style={styles.selectedTypesContainer}>
                    <Text style={styles.selectedTypesLabel}>Selected as:</Text>
                    <Text style={styles.selectedTypesText}>{selectedUserTypes}</Text>
                  </View>
                )}
         <UserTypeModal
        visible={modalVisible}
        onSubmit={handleModalSubmit}
        onCancel={handleModalCancel}
      />
    </View>
</SafeAreaView>
  );
};

export default FreeContainer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignSelf: "center",
  },
  image: {
    height: height * 0.44,
    width: width*0.9 ,
    alignSelf:"center",
    // padding:10
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    padding:20
  },
  subhead: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontWeight: "bold",
    color: "green",
    fontSize: 17,
  },
  ortext: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
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
