// App.js
import React, { useState,useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions, 
  Touchable,
  TouchableOpacity,
  Modal,
  Linking,
  TextInput,
  Alert,
  ActivityIndicator
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios  from "axios";
import BASE_URL, { userStage } from "../../Config";
const { width, height } = Dimensions.get("window");
import { useSelector } from "react-redux";

export default function FreeAIAndGenAI({navigation}) {
  const userData = useSelector((state) => state.counter);
  console.log("userData", userData);
  const [profileData, setProfileData] = useState();

  const [modalVisible, setModalVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumber_error, setMobileNumber_error] = useState(false);
  const [mobileNumberValid_error, setMobileNumberValid_error] = useState(false);
  const [loading, setLoading] = useState(false);
  const[AlreadyInterested,setAlreadyInterested]=useState(false)


  function trainingfunc() {
    if (userData == null) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    } else {
    const url = "https://sites.google.com/view/globalecommercemarketplace/home";
    Linking.openURL(url).catch((err) => {
      console.error("Error opening URL:", err);
    });
  }
  }


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
    }},[])

    const getProfile = async () => {
      axios({
       method:"get",
       url:BASE_URL+ `user-service/customerProfileDetails?customerId=${userData.userId}`
      })
      .then((response)=>{
       console.log("profile details",response.data)
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
      const hasFreeAI = response.data.some(item => item.askOxyOfers === "FREEAI");

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

  function interestedfunc() {
    // setModalVisible(true)
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
       console.log ("Error", "No valid phone number found.");
         return;
       }

      let data = {
        askOxyOfers: "FREEAI",
        userId: userData.userId,
        mobileNumber: number,
        projectType: "ASKOXY",
      };
      console.log(data);
      setLoading(true);
      axios({
        method: "post",
        url: BASE_URL + "marketing-service/campgin/askOxyOfferes",
        data: data,
      })
        .then((response) => {
          console.log(response.data);
          setModalVisible(false);
          setLoading(false);
          setMobileNumber("");
          Alert.alert(
            "Success",
            "Your interest has been submitted successfully!"
          );
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Our Offer: Free AI & Gen AI Training</Text>
      {/* <View style={styles.shadowContainer}> */}
      <Image source={require("../../assets/genai.png")} style={styles.img} />
      {/* </View> */}
      <Text style={styles.content}>
        <Text style={styles.bold}>Unlock your career potential</Text> with
        ASKOXY.AI’s free AI & Generative AI training, combined with Java and
        Microservices expertise.
        <Text style={styles.bold}>
          {" "}
          Open to all graduates, pass or fail,
        </Text>{" "}
        this program empowers freshers to land their first job and experienced
        professionals to achieve high-salary roles. 🎓
      </Text>
      <Text style={styles.content}>
        Gain hands-on experience with free project training, guided by visionary
        leader <Text style={styles.bold}>Radhakrishna Thatavarti,</Text> Founder
        & CEO of ASKOXY.AI. 🚀
        <Text style={styles.bold}> Transform your future today!</Text> 🌐
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-around",width:width*0.9,alignSelf:"center"}}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#0384d5" }]} // Add background color here
          onPress={() => trainingfunc()}
        >
          <Text style={styles.buttonText}>Our Training Guide</Text>
        </TouchableOpacity>

{AlreadyInterested ==false?
<>
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
        </>
        :
        <View
            style={[styles.button, { backgroundColor: "#9367c7" }]} // Add background color here
            onPress={() => interestedfunc()}
          >
            <Text style={styles.buttonText}>Already Participated</Text>
          </View>
        }
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false), setMobileNumber("");
          // setFormData({ ...formData, whatsappNumber: "" });
        }} // Android back button close
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon
              name="close"
              size={30}
              onPress={() => setModalVisible(false)}
              style={{ alignSelf: "flex-end" }}
            />
            <Text style={styles.modalText}>Confirm your Whatsapp Number!</Text>

            <View>
              <TextInput
                placeholder="Mobile Number"
                // mode="outlined"
                value={mobileNumber.replace(/[^0-9]/g, "")}
                style={styles.input}
                maxLength={10}
                keyboardType="numeric"
                placeholderTextColor="gray" // Placeholder text color
                error={mobileNumber_error}
                onChangeText={(text) => {
                  setMobileNumber(text), setMobileNumber_error(false);
                }}
              />
              {mobileNumber_error == true ? (
                <Text style={styles.errortxt}>Mobile Number is mandatory</Text>
              ) : null}

              {mobileNumberValid_error == true ? (
                <Text style={styles.errortxt}>
                  Mobile Number should be 10 digits
                </Text>
              ) : null}
            </View>

            {loading == false ? (
              <TouchableOpacity
                style={styles.btn}
                onPress={() => interestedfunc()}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={styles.btn}
                />
              </View>
            )}
          </View>
        </View>
        {/* </View> */}
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6f2dbd",
    marginBottom: 15,
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
    color: "#000000",
  },
  img: {
    width: width * 0.9,
    height: height / 3,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 20,
  },
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    overflow: "hidden",
  },
  trainingbutton: {
    backgroundColor: "#0384d5",
    width: width * 0.4,
    // height: height * 0.06,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  container: {
    padding: 20,
    backgroundColor: "#ffffff",
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6f2dbd",
    marginBottom: 15,
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  bold: {
    fontWeight: "bold",
    color: "#000000",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width * 0.9,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    // alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#4B0082",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: width * 0.8,
    alignSelf: "center",
    margin: 10,
  },
  input: {
    height: 40,
    width: width * 0.8,
    borderColor: "#4B0082",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "black", // Ensure text is visible
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "white",
  },
  input1: {
    height: 100,
    width: width * 0.8,
    borderColor: "#4B0082",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "black", // Ensure text is visible
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "white",
  },
  errortxt: {
    color: "red",
    fontSize: 15,
    marginBottom: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
