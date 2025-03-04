import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef
} from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ToastAndroid,
  ScrollView,
  TouchableOpacity,
  Share,
  Image,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Linking,
  Pressable,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useSelector } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL,{userStage} from "../../../../Config";
import ShareLinks from "../../../../src/Screens/View/Referral Links/ShareLinks";
import { set } from "core-js/core/dict";
import { COLORS } from "../../../../Redux/constants/theme";
import PhoneInput from "react-native-phone-number-input";

const{height,width}=Dimensions.get('window')


const ProfilePage = () => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  // console.log({userData})
//   console.log({userStage})
  const [profileForm, setProfileForm] = useState({
    user_FirstName: "",
    user_LastName: "",
    customer_email: "",
    customer_mobile: "",
    user_mobile: "",
    phoneNumber:"",
    status:false
  });
  const [errors, setErrors] = useState({
    user_FirstName: "",
    user_LastName: "",
    customer_email: "",
    user_mobile: "",
   
  });
  const [user, setUser] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const navigation = useNavigation();
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [isInitiallySaved, setIsInitiallySaved] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState()
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const[countryode,setcountryCode]=useState('')
  const[loader,setLoader]=useState(false)
   const[whatsappNumber,setWhatsappNumber]=useState('')
    const[whatsappNumber_Error,setWhatsappNumber_Error]=useState(false)
    const [code, setCode] = useState('91');
      const [otpSent, setOtpSent] = useState(false);
      const[otp,setOtp]=useState('')
    const[loading,setLoading]=useState(false)
      const[otpSession,setOtpSession]=useState('')
      const[salt,setSalt]=useState('')
  // const phoneInput = useRef(null);

  useFocusEffect(
    useCallback(() => {
      setOtpSent(false)
      animateProfile();
      getProfile();
      HandledeactivateStatus();
    }, [getProfile])
  );

  const animateProfile = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,

          useNativeDriver: true,
        }),
      ])
    ).start();
  };





  const getProfile = async () => {
    console.log("profile get call response");

     try {
      const response = await axios({
        method: "GET",
        url: userStage =="test1"?
        BASE_URL +
        `erice-service/user/customerProfileDetails?customerId=${customerId}`:BASE_URL+`user-service/customerProfileDetails?customerId=${customerId}`,
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        });
      
console.log("v",response.data)
      if (response.status === 200) {
        setUser(response.data);
        setProfileForm({
          user_FirstName: response.data.firstName,
          user_LastName:response.data.lastName,
          customer_email: response.data.email,
          customer_mobile: response.data.whatsappNumber,
          user_mobile: response.data.alterMobileNumber.trim(" "),
          phoneNumber:response.data.mobileNumber,
          status:response.data.whatsappVerified
        });
      }
    } catch (error) {
      console.error("ERROR",error);
      showToast("Error loading profile");
    }
  };

  const handleProfileSubmit = async () => {
    console.log("for profile saving call");
    if (
      !profileForm.user_FirstName ||
      !profileForm.user_LastName||
      !profileForm.customer_email ||
      errors.customer_email ||
      !profileForm.user_mobile
    ) {
      setErrors({
        user_FirstName: profileForm.user_FirstName
          ? ""
          : "First name should not be empty",
          user_LastName: profileForm.user_LastName
          ? ""
          : "Last  name should not be empty",
        customer_email: profileForm.customer_email
          ? errors.customer_email
          : "Email should not be empty",
        user_mobile: profileForm.user_mobile
          ? ""
          : "Mobile number should not be empty",
       
      });
      return;
    } else if (profileForm.user_mobile.length != 10) {
      Alert.alert("Error", "Alternative Mobile Number should be 10 digits");
      return false;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.patch(
        userStage=="test1"?
        BASE_URL + "erice-service/user/profileUpdate":BASE_URL+"user-service/profileUpdate",
        {
          userFirstName: profileForm.user_FirstName,
          userLastName:profileForm.user_LastName,
          customerEmail: profileForm.customer_email,
          customerId: customerId,
          alterMobileNumber: profileForm.user_mobile,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("profile save call ", response.data);
      if (response.data.errorMessage == null) {
        console.log("Profile call response: ", response.data);
        setErrors({ ...errors, customer_email: "" });
        setProfileData(response.data);
        console.log("Profile data:", profileData);
        getProfile();

        // Mark profile as saved and show success alert
        setIsProfileSaved(true);
        setIsLoading(false);
        Alert.alert("Success", "Profile saved successfully");

        console.log("Profile form data:", profileForm);
      } else {
        // Show error message from the response
        Alert.alert("Alert", response.data.errorMessage);
      }
    } catch (error) {
      setIsLoading(false)
      console.error(error.response);
      Alert.alert("Failed", error.response?.data);
    }
  };

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const changePassword = () => {
    Alert.alert(
      "Change Password",
      "Enter new and old passwords",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: () => {
            if (newPassword.length >= 6) {
              updatePassword({
                newpassword: newPassword,
                oldpassword: oldPassword,
              });
            } else {
              showToast("Minimum length of password is 6 characters");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const updatePassword = async (params) => {
    try {
      const response = await axios.post("customer/update_password", params);
      showToast(response.data.msg || "Password updated successfully");
    } catch (error) {
      console.error(error);
      showToast("Error updating password");
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Please share to your friends/family! https://play.google.com/store/apps/details?id=com.BMV.Money",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      Alert.alert("Oops", error.message);
    }
  };

  const HandledeactivateStatus = async () => {
    // console.log({userData});
    
    const deactivate = userData.userStatus;
    // console.log({deactivate});
    if(deactivate=="ACTIVE"){
      setState(true)
    }else{
      setState(false);
    }
  }

  const handlePhoneNumberChange = (value) => {
    // console.log({value})
    // setValidError(false)
    // seterrorNumberInput(false)
    // setWhatsappNumber_Error(false)
    try {
      setWhatsappNumber(value);
    //   if(value.length>13 || value.length<10){
    //     setValidError(true)
    //     return false;
    // }
       console.log({value})
      const callingCode = phoneInput.getCallingCode(value);
      console.log(callingCode);
      setCode(callingCode);
      // setWhatsappNumber(value)
      // console.log(countryCode)
    } catch (error) {
      // Handle any parsing errors
    }
  };

  const handleSubmit = () => {
    if (phoneNumber.trim() === '') {
      alert('Please enter a phone number');
      return;
    }
    if(userData.whatsappNumber == "+"+countryode+phoneNumber){
      Alert.alert("Failed","Self referral is not allowed")
      return false
    }
    
let data={
  "referealId":customerId,
  "refereeMobileNumber":phoneNumber,
  "countryCode":"+"+countryode
}

console.log({data})
setLoader(true)
    axios({
      method:"post",
      url:BASE_URL+'user-service/inviteaUser',
      data:data, 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      }
    })
    .then((response)=>{
      console.log("response",response.data)
      setLoader(false)
      if(response.data.status==false){
        Alert.alert("Failed",response.data.message)
      }else{
        Alert.alert("Success","Successfully you referred a user")
        setModalVisible(false);
        setPhoneNumber('');
      }
  
    })
    .catch((error)=>{
      setLoader(false)
      console.log(error.response)
      Alert.alert("Failed",error.response.message)

    })
  };

  const handlePhoneNumberChange1 = (value) => {
    // console.log({value})
    // setValidError(false)
    // seterrorNumberInput(false)
    // setWhatsappNumber_Error(false)
    try {
      setWhatsappNumber(value);
  
       console.log({value})
      const callingCode = phoneInput.getCallingCode(value);
      console.log(callingCode);
      setcountryCode(callingCode);
      const isValid = /^[0-9]*$/.test(value);
      if (isValid) {
        setErrorMessage(""); // Clear the error if input is valid
        setWhatsappNumber(value);
      } else {
        setErrorMessage(true);
        return 
      }
    
    } catch (error) {
      // Handle any parsing errors
    }
  };


  function handleSendOtp(){
    let data={
      "countryCode":"+"+code,
        "chatId": whatsappNumber,
        "id": customerId
      }
      console.log({data})
      setLoading(true)
    axios({
      method:"post",
      url:BASE_URL+`user-service/sendWhatsappOtpqAndVerify`,
      data:data
    })
    .then((response)=>{
      console.log(response.data)
      setOtpSent(true)
      setLoading(false)
      setOtpSession(response.data.whatsappOtpSession)
      setSalt(response.data.salt)
    })
    .catch((error)=>{
      console.log(error.response)
      setLoading(false)
    })
  }

  function handleVerifyOtp(){
    let data={
      "countryCode":"+"+code,
        "chatId": whatsappNumber,
        "id": customerId,
        "salt": salt,
  "whatsappOtp": otp,
  "whatsappOtpSession": otpSession
      }
      console.log({data})
      setLoading(true)
    axios({
      method:"post",
      url:BASE_URL+`user-service/sendWhatsappOtpqAndVerify`,
      data:data
    })
    .then((response)=>{
      console.log(response.data)
      setOtpSent(false)
      setLoading(false)
      getProfile()
    })
    .catch((error)=>{
      console.log(error.response)
      setLoading(false)
    })
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.outerContainer}
    >
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Enter  your firstName"
              value={profileForm?.user_FirstName || ""}
              onChangeText={(text) => {
                // Allow only alphabetic characters
                const alphabeticText = text.replace(/[^a-zA-Z]/g, "");
                setProfileForm({
                  ...profileForm,
                  user_FirstName: alphabeticText,
                });
                setErrors({ ...errors, user_FirstName: "" });
              }}
            />
            {errors.user_FirstName ? (
              <Text style={styles.errorText}>{errors.user_FirstName}</Text>
            ) : null}



              <TextInput
              style={styles.input}
              placeholder="Enter  your lastName"
              value={profileForm?.user_LastName|| ""}
              onChangeText={(text) => {
                // Allow only alphabetic characters
                const alphabeticText = text.replace(/[^a-zA-Z]/g, "");
                setProfileForm({
                  ...profileForm,
                  user_LastName: alphabeticText,
                });
                setErrors({ ...errors, user_LastName: "" });
              }}
            />
            {errors.user_LastName ? (
              <Text style={styles.errorText}>{errors.user_LastName}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Enter your e-mail "
              keyboardType="email-address"
              autoCapitalize="none"  
              autoCorrect={false} 
              value={profileForm?.customer_email || ""}
              onChangeText={(text) => {
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
                  setProfileForm({ ...profileForm, customer_email: text });
                  setErrors({ ...errors, customer_email: "" });
                } else {
                  setProfileForm({ ...profileForm, customer_email: text });
                  setErrors({
                    ...errors,
                    customer_email: "Please enter a valid gmail address",
                  });
                }
              }}
            />
            {errors.customer_email ? (
              <Text style={styles.errorText}>{errors.customer_email}</Text>
            ) : null}

            {/* <TextInput
              style={[
                styles.input,
                {
                  backgroundColor:
                    isProfileSaved ||
                    (profileForm?.customer_mobile?.length || 0) === 13
                      ? "#e0e0e0"
                      : "#fff",
                },
              ]}
              placeholder="Enter your mobile number"
              value={profileForm?.phoneNumber || ""}
              onChangeText={(number) => {
                if (number.length <= 13) {
                  setProfileForm({ ...profileForm, phoneNumber: number });
                }
              }}
              maxLength={13}
              editable={
                !isProfileSaved &&
                (profileForm?.customer_mobile?.length || 0) < 14
              }
              disabled={profileForm?.customer_mobile?true:false}
            /> */}

            <TextInput
              style={styles.input}
              placeholder="Enter your alternate mobile number"
              value={profileForm?.user_mobile || ""}
              maxLength={10}
              keyboardType="number-pad"
              onChangeText={(text) => {
                setProfileForm({ ...profileForm, user_mobile: text });
                setErrors({ ...errors, user_mobile: "" });
              }}
            />
            {errors.user_mobile ? (
              <Text style={styles.errorText}>{errors.user_mobile}</Text>
            ) : null}
<Text style={{marginLeft:10}}>Whatsapp Number</Text>

{profileForm.status==true?
<TextInput
              style={styles.input}
              placeholder="Enter your whatsapp Number"
              value={profileForm?.customer_mobile || ""}
              // maxLength={10}
              keyboardType="number-pad"
              editable={false}
              onChangeText={(number) => {
              setProfileForm({ ...profileForm, customer_mobile: number });
                // setErrors({ ...errors, user_mobile: "" });
              }}
            />
            :
<>
      <PhoneInput
            placeholder="Whatsapp Number"
              containerStyle={styles.input1}
              textInputStyle={styles.phonestyle}
              codeTextStyle={styles.phonestyle1}
              ref={(ref) => (phoneInput = ref)}
              defaultValue={whatsappNumber}
              defaultCode="IN"
              layout="first"              
              onChangeText={handlePhoneNumberChange1}
            />
           
            <View>
              {otpSent==false?
              <>
              {loading==false?
                <TouchableOpacity style={[styles.Button,{marginVertical:10}]} onPress={()=>handleSendOtp()}>
                  <Text style={styles.submitButtonText}>Send OTP</Text>
                </TouchableOpacity>
                :
                <View style={[styles.Button,{marginVertical:10}]} >
                  <ActivityIndicator size={30} color="white"/>
                </View>
                }
              </>
              :
              <>
               <TouchableOpacity style={{alignSelf:"flex-end",marginTop:10,marginRight:30}} onPress={()=>handleSendOtp()}>
                <Text>Resend Otp</Text>
            </TouchableOpacity>
              <View style={{flexDirection:"row",marginVertical:10,alignSelf:"center"}}>
                <TextInput style={styles.Otpinput} placeholder="Enter Otp"
                            value={otp}
                            onChangeText={(number)=>setOtp(number)}
                            maxLength={4}
                            keyboardType="numeric"
                            />
                            {loading==false?
                        <TouchableOpacity style={styles.Button} onPress={()=>handleVerifyOtp()}>
                          <Text  style={styles.submitButtonText}>Verify</Text>
                        </TouchableOpacity>
                        :
                        <View  style={styles.Button}  >
                        <ActivityIndicator size={30} color="white"/>
                      </View>}
              </View>
              </>
              }

            </View>
            </>
}

            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                Please provide a backup mobile number. We’ll use it only if your
                registered number can’t be reached.
              </Text>
            </View>
            {/* <TouchableOpacity
              style={{
                backgroundColor: "#007bff",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                marginTop: 5,
              }}
              onPress={() => handleProfileSubmit()}
            >
              <Text style={{ color: "white", fontSize: 16 }}>
                {isProfileSaved || isInitiallySaved
                  ? "Save Profile"
                  : "Save Profile"}
              </Text>
            </TouchableOpacity> */}

          {profileForm.status==true?
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.services,
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 5,
                fontSize: 16,
                fontWeight: "bold",
              }}
              onPress={handleProfileSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={{ color: "white", fontSize: 16 }}>
                  {isProfileSaved || isInitiallySaved
                    ? "Save Profile"
                    : "Save Profile"}
                </Text>
              )}
            </TouchableOpacity>
            :
            <View
              style={{
                backgroundColor: COLORS.backgroundcolour,
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 5,
                fontSize: 16,
                fontWeight: "bold",
              }}
              onPress={handleProfileSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={{ color: "white", fontSize: 16 }}>
                  {isProfileSaved || isInitiallySaved
                    ? "Save Profile"
                    : "Save Profile"}
                </Text>
              )}
            </View>
            }

            <View style={styles.optionContainer}>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate("Subscription")}
              >
                <Text style={styles.optionText}>Subscription</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => navigation.navigate("Wallet")}
              >
                <Entypo
                  name="wallet"
                  size={20}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.optionText}>Wallet</Text>
              </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
              <TouchableOpacity 
style={[styles.btn,{backgroundColor:state?"#f44336":COLORS.title}]}
        onPress={() => navigation.navigate('About Us')}
        >
        {/* <Ionicons name="logo-whatsapp" size={20} color="white" /> */}
        <Text style={styles.referButtonText}>FAQs</Text>
        </TouchableOpacity>
              {/* <TouchableOpacity style={[styles.btn,{backgroundColor:state?"#f44336":COLORS.title}]} onPress={() => navigation.navigate("Active")}>
                        <Text style={styles.optionText}>{state?"Deactivate Account":"Activate Account"}</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate("Write To Us")}>
                <Text style={styles.optionText}>Write To Us</Text>

                </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>

                    <TouchableOpacity 
        style={styles.referButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="logo-whatsapp" size={20} color="white" />
        <Text style={styles.referButtonText}>Refer a Friend</Text>
      </TouchableOpacity>
  <TouchableOpacity style={styles.referButton} onPress={()=>navigation.navigate("Referral History")}>
  <Text style={styles.optionText}>Referral History</Text>

  </TouchableOpacity>
      </View>

      {/* <View style={{ flexDirection: "row", justifyContent: "space-evenly",marginTop:10 }}>

        <TouchableOpacity 
        style={styles.referButton}
        onPress={() => navigation.navigate('About Us')}
        >
        <Text style={styles.referButtonText}>FAQs</Text>
        </TouchableOpacity>

        </View> */}

            </View>
          </View>

        </ScrollView>
      </View>
       {/* Modal */}
       <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header with close button */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter Referee Details</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#9ca3af" />
              </Pressable>
            </View>
            
            {/* Description text */}
            <Text style={styles.modalDescription}>
              Please enter the phone number of the person you want to refer.
            </Text>
            
            {/* PhoneInput component */}
            <View style={styles.phoneInputWrapper}>

              <PhoneInput
                  placeholder="Whatsapp Number"
                  containerStyle={styles.input1}
                  textInputStyle={styles.phonestyle}
                  codeTextStyle={styles.phonestyle1}
                  ref={(ref) => (phoneInput = ref)}
                  defaultValue={phoneNumber}
                  defaultCode="IN"
                  layout="first"              
                  onChangeText={handlePhoneNumberChange}
                />
            </View>
            
            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {setModalVisible(false),setPhoneNumber('')}}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              

              {loader==false?
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={()=>handleSubmit()}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              :
              <View style={styles.submitButton}>
                <ActivityIndicator size={30} color="white"/>
              </View>
              }
            </View>
          </View>
        </View>
      </Modal>
      {/* <View style={{ top: -80, flex: 0.2 }}>
        <ShareLinks />
      </View> */}

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  container: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    // height:"auto"
    flexGrow: 1,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
  
  phonestyle:{
    width:'100%',
    height:39,
  },
  phonestyle1:{
    height:20,
  },
  input1: {
    marginTop: 10,
    width:width/1.3,
    alignSelf: "center",
    height: 45,
    elevation:4,
    backgroundColor:"white",
    borderColor:"black"
  },
  saveButton: {
    backgroundColor: COLORS.services,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  Button:{
    backgroundColor: COLORS.services,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width:width/3,
    alignSelf:"center"
  },
    Button:{
    backgroundColor: COLORS.services,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    // marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width:width/3,
    alignSelf:"center"
  },
  Otpinput:{
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
    width:width*0.4
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  optionContainer: {
    marginTop: 20,
    marginBottom:300
  },
  btn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    // paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width:width*0.4,    
    height: 50,
    backgroundColor: COLORS.title,
  },

  optionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },

  footer: {
    // alignItems: "center",
    marginTop: 30,
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  bold: {
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 10,
    marginBottom: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.title,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
width:width*0.4,    
height: 50,
    alignSelf: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
    alignSelf: "center",
    textAlign: "center",
  },
  icon: {
    marginLeft: 10,
  },
  textContainer: {
    marginHorizontal: 20,
    marginVertical: 1,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 20,
    padding: 8,
    // textAlign: 'center',
    marginHorizontal: 16,
    marginVertical: 0,
    fontWeight: "400",
  },
  noteContainer: {
    backgroundColor: "#F5F5F5",
    borderLeftWidth: 4,
    borderLeftColor: "#888",
    padding: 8,
    marginVertical: 12,
    borderRadius: 4,
  },
  noteText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 18,
  },
  referButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width:width*0.4,    

  },
  referButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'green',
  },
  modalDescription: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24,
  },
  phoneInputWrapper: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#8b5cf6', // Purple color from the image
  },
  submitButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default ProfilePage;
