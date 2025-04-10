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

const LegalService = ({ navigation }) => {
  const userData = useSelector((state) => state.counter);
  // console.log({ userData });
  const [loading, setLoading] = useState(false);
  const[AlreadyInterested,setAlreadyInterested]=useState(false)
  const[profileData,setProfileData]=useState()
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
      axios({
       method:"get",
       url:BASE_URL+ `user-service/customerProfileDetails?customerId=${userData.userId}`
      })
      .then((response)=>{
       console.log(response.data)
       setProfileData(response.data)
      })
      .catch((error)=>{
       console.log(error.response.data)
      })
     };
  
    function getCall(){
      let data={
        userId: userData.userId
      }
      axios.post(BASE_URL+`marketing-service/campgin/allOfferesDetailsForAUser`,data)
      .then((response)=>{
        console.log(response.data)
        const hasFreeAI = response.data.some(item => item.askOxyOfers === "LEGALSERVICES");
  
    if (hasFreeAI) {
      // Alert.alert("Yes", "askOxyOfers contains FREEAI");
      setAlreadyInterested(true)
    } else {
      // Alert.alert("No","askOxyOfers does not contain FREEAI");
      setAlreadyInterested(false)
    }
      })
      .catch((error)=>{
        console.log(error.response)
      })
    }

  function legalServicefunc() {
    console.log("sravani");
    
    if (userData == null) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    } 
    console.log("varalakshmi");
    let number =null;
    
    
  if(profileData?.whatsappNumber && profileData?.mobileNumber)   {
  number=(profileData.whatsappNumber)
  
}
else if(profileData?.whatsappNumber && profileData?.whatsappNumber) {
  number=(profileData.whatsappNumber)
 
}
else if(profileData?.mobileNumber && profileData?.mobileNumber) {
  number=(profileData.mobileNumber)
 
}

if (!number) {
  console.log ("Error", "No valid phone number found.");
    return;
  }
      let data = {
        askOxyOfers: "LEGALSERVICES",
        userId: userData.userId,
        mobileNumber: number,
        projectType: "ASKOXY",
      };
      console.log(data);
       setLoading(true)
      axios({
        method: "post",
        url:  BASE_URL + "marketing-service/campgin/askOxyOfferes",
        data: data,
      })
        .then((response) => {
          console.log(response.data);
          setLoading(false);
          Alert.alert(
            "Success",
            "Your interest has been submitted successfully!"
          );
        })
        .catch((error) => {
          console.log("error",error.response);
          setLoading(false);
          if (error.response.status == 400) {
            Alert.alert("Failed", "You have already participated. Thank you!")
          }
          else {
            Alert.alert("Failed", error.response.data);
          }
    
        })
      
  }

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


{AlreadyInterested==false?
        <>
        {loading == false ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => legalServicefunc()}
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
            onPress={() => legalServicefunc()}
          >
            <Text style={styles.buttonText}>Already Participated</Text>
          </View>
        }
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
