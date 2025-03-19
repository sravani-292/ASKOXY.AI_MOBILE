import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  BackHandler,
} from "react-native";
import axios from "axios";
import { TextInput } from "react-native-paper";
import { StatusBar } from 'expo-status-bar';
// import { Ionicons } from '@expo/vector-icons';
import Ionicons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import PhoneInput from "react-native-phone-number-input";
import {
  useNavigation,
  useFocusEffect,
  useNavigationState,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { AccessToken } from "../../Redux/action/index";
import BASE_URL, { userStage } from "../../Config";
const { height, width } = Dimensions.get("window");
import Icon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
// import dynamicLinks from '@react-native-firebase/dynamic-links';
// import { initializeApp } from '@react-native-firebase/app';

const Register = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    mobileNumber_error: false,
    validMobileNumber_error: false,
    otp: "",
    otp_error: false,
    validOtpError: false,
    loading: false,
    password:'',
    password_error:false
  });
  console.log({ BASE_URL });
  const [showOtp, setShowOtp] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [mobileOtpSession, setMobileOtpSession] = useState();
  const [saltSession, setSaltSession] = useState("");
  const [otpGeneratedTime, setOtpGeneratedTime] = useState("");
  const [message, setMessage] = useState(false);
  const [authMethod, setAuthMethod] = useState('whatsapp'); // 'whatsapp' or 'sms'
  const [phoneNumber, setPhoneNumber] = useState('');
  const[whatsappNumber,setWhatsappNumber]=useState('')
  const[whatsappNumber_Error,setWhatsappNumber_Error]=useState(false)
  const[phoneNumber_Error,setPhoneNumber_Error]=useState(false)
  const[errorNumberInput,seterrorNumberInput]=useState(false)
  const[validError,setValidError]=useState(false)
  const [countryCode, setcountryCode] = useState('91');
  const [otpSent, setOtpSent] = useState(false);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
const[loading,setLoading]=useState(false)
const[secureText,setSecureText]=useState(true)

  const toggleSecureText=()=>{
    setSecureText(!secureText)
  }



  useFocusEffect(
    useCallback(() => {
      const checkLoginData = async () => {
        console.log("expo");

        try {
          const loginData = await AsyncStorage.getItem("userData");
          const storedmobilenumber = await AsyncStorage.getItem("mobileNumber");
          console.log("logindata", loginData);

          console.log(storedmobilenumber);

          // setMobileNumber(storedmobilenumber);
          setFormData({ ...formData, mobileNumber: storedmobilenumber });
          console.log("mobileNumber", formData.mobileNumber);

          if (loginData) {
            const user = JSON.parse(loginData);
            // if (user.accessToken) {
            //   dispatch(AccessToken(user));
            //   navigation.navigate("Home");
          }
        } catch (error) {
          console.error("Error fetching login data", error.response);
        }
      };

      checkLoginData();
      // getVersion();
    }, [])
  );

  const currentScreen = useNavigationState(
    (state) => state.routes[state.index]?.name
  );

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        // if (currentScreen === 'Login') {
        // Custom behavior for Login screen
        Alert.alert(
          "Exit",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );

        return true;
      };

      // Add BackHandler event listener
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);

      // Cleanup
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [currentScreen])
  );


 
  const handlePhoneNumberChange = (value) => {
    console.log({value})
    setValidError(false)
    seterrorNumberInput(false)
    setWhatsappNumber_Error(false)
    try {
      setWhatsappNumber(value);
    //   if(value.length>13 || value.length<10){
    //     setValidError(true)
    //     return false;
    // }
       console.log({value})
      const callingCode = phoneInput.getCallingCode(value);
      console.log({callingCode});
      setcountryCode(callingCode);
      // setWhatsappNumber(value)
      // console.log(countryCode)
    } catch (error) {
      // Handle any parsing errors
    }
  };

  function handlePasswordfunc(){
    console.log({countryCode})
    var Number=countryCode+whatsappNumber
if(authMethod=="whatsapp"){
    if(whatsappNumber=="" || whatsappNumber == null){
      alert("Please enter Whatsapp Number")
      return false
    }
  }else{
    if(phoneNumber=="" || phoneNumber == null){
      alert("Please enter Mobile Number")
      return false
    }
  }

    console.log( BASE_URL+`user-service/hiddenLoginByMobileNumber/${authMethod === "whatsapp"?whatsappNumber:phoneNumber}`
    )
    setLoading(true)
    if(formData.password=="@$k0xy"){
    axios({
      method:"post",
      url:BASE_URL+`user-service/hiddenLoginByMobileNumber/${authMethod === "whatsapp"?whatsappNumber:phoneNumber}`
    })
    .then(async(response)=>{
      console.log(response.data)
      setLoading(false)
      if (response.data.primaryType == "CUSTOMER") {
        if (response.data.accessToken != null) {
          dispatch(AccessToken(response.data));
          await AsyncStorage.setItem(
            "userData",
            JSON.stringify(response.data)
          );
          navigation.navigate('Home')
        }
        else{
          Alert.alert('Failed',"AccessToken does not exist")
        }
      } else{
        Alert.alert(
                   "Failed",
                   `You have logged in as ${response.data.primaryType} , Please login as Customer`
                 )
                }
    })
    .catch((error)=>{
      setLoading(false)
      console.log(error.response)
      Alert.alert("Failed",error.response.data.error)
    })
    }
    else{
    Alert.alert("Failed","Password is incorrect")
    return false
    }
  }

  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior="padding"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          {/* Top Images */}
          <View>
            <View>
              <Image
                source={require("../../assets/Images/orange.png")}
                style={styles.orangeImage}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "flex-end",
                marginBottom: 100,
                justifyContent: "space-between",
              }}
            >
              <View style={styles.oxylogoView}>
                <Image
                  source={require("../../assets/Images/logo1.png")}
                  style={styles.oxyricelogo}
                />
              </View>
              <View style={styles.greenImageView}>
                <Image
                  source={require("../../assets/Images/green.png")}
                  style={styles.greenImage}
                />
              </View>
            </View>
          </View>

          {/* Login Section */}
          <View style={styles.logingreenView}>
            {/* <Image
              source={require("../assets/Images/rice.png")}
              style={styles.riceImage}
            /> */}
            <Text style={styles.loginTxt}>Login with Password</Text>

            <View style={styles.authMethodContainer}>
              <TouchableOpacity 
                style={[styles.authMethodButton, authMethod === 'whatsapp' && styles.activeAuthMethod]}
                onPress={() => {setAuthMethod('whatsapp'),setOtpSent(false),setWhatsappNumber(''),setPhoneNumber_Error('')} }
                // disabled={otpSent}
              >
                <Ionicons name="logo-whatsapp" size={20} color={authMethod === 'whatsapp' ? '#3d2a71' : '#fff'} />
                <Text style={[styles.authMethodText, authMethod === 'whatsapp' && styles.activeAuthMethodText]}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.authMethodButton, authMethod === 'sms' && styles.activeAuthMethod]}
                onPress={() => {setAuthMethod('sms'),setOtpSent(false),setWhatsappNumber(''),setWhatsappNumber('')}}
                // disabled={otpSent}
              >
                <Ionicons name="chatbubble-outline" size={20} color={authMethod === 'sms' ? '#3d2a71' : '#fff'} />
                <Text style={[styles.authMethodText, authMethod === 'sms' && styles.activeAuthMethodText]}>SMS</Text>
              </TouchableOpacity>
            </View>
            
            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              {/* <Text style={styles.inputLabel}>Phone Number</Text> */}
              {authMethod === 'whatsapp' ? (
                <View style={styles.phoneInputContainer}>
                
                   <PhoneInput
            placeholder="Whatsapp Number"
              containerStyle={styles.input1}
              textInputStyle={styles.phonestyle}
              codeTextStyle={styles.phonestyle1}
              ref={(ref) => (phoneInput = ref)}
              defaultValue={whatsappNumber}
              defaultCode="IN"
              layout="first"              
              onChangeText={handlePhoneNumberChange}
            />
                
                  
                  
                </View>
              ) : (
                <TextInput
                  style={[styles.input, otpSent && styles.disabledInput]}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(text)=>{setPhoneNumber(text),setPhoneNumber_Error(false)}}
                  editable={!otpSent}
                />
              )}
            </View>

            {whatsappNumber_Error && (
              <Text style={{ color: "red", alignSelf:"center" }}>
                Please enter the whatsapp number
              </Text>
            )}

{phoneNumber_Error && (
              <Text style={{ color: "red", alignSelf:"center" }}>
                Please enter the Mobile number
              </Text>
            )}
            

            <TextInput
                style={styles.input1}
                placeholder="Enter Password"
                mode="outlined"
                value={formData.password.trim(' ')}
                dense={true}
                activeOutlineColor="#e87f02"
                secureTextEntry={secureText}
                right={<TextInput.Icon
                         icon={secureText ? "eye-off" : "eye"}
                         onPress={toggleSecureText}
                         forceTextInputFocus={false} 
                         />}
                onChangeText={(text) => {
                  setFormData({
                    ...formData,
                    password: text,
                    password_error: false,
                  });
                }}
              />

              {formData.password_error ? (
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  Password is mandatory
                </Text>
              ) : null}



            <View style={styles.otpButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.verifyButton} 
                    onPress={()=>handlePasswordfunc()}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitText}>Submit</Text>
                    )}
                  </TouchableOpacity>
                  
                
                </View>
            <TouchableOpacity style={styles.phonebtn} onPress={()=>navigation.navigate('Login')}>
              <FontAwesome name="mobile" size={30}/>
            </TouchableOpacity>
            {/* Register Link */}
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Already Registered ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkButtonText}>Login</Text>
              </TouchableOpacity>
            </View>


          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  orangeImage: {
    height: 170,
    width: 170,
    marginBottom: -20,
  },
  oxyricelogo: {
    width: 180,
    height: 60,
    marginRight: width / 6,
  },
  oxylogoView: {
    height: 1,
  },
  greenImage: {
    height: 120,
    width: 70,
  },
  riceImage: {
    height: 180,
    width: 180,
    alignSelf: "flex-end",
    marginTop: -95,
  },
  logingreenView: {
    flex: 2,
    backgroundColor: "#3d2a71",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: - height / 11,
    // height: height/2,
  },
  phonebtn:{
    backgroundColor:"white",
    padding:5,
    width:40,
    height:40,
    alignSelf:"center",
    alignItems:"center",
    margin:20
  },

  loginTxt: {
    color: "white",
    fontWeight: "500",
    fontSize: 25,
    margin: 20,
    alignSelf: "center",
  },
  authMethodContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-evenly',
  },
  authMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    width:width*0.4,
  },
  activeAuthMethod: {
    backgroundColor: '#fff',
  },
  authMethodText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#fff',
  },
  activeAuthMethodText: {
    color: '#3d2a71',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    // paddingVertical: 12,
    fontSize: 16,
    // marginTop: 10,
    width:width/1.2,
    alignSelf: "center",
    height: 45,
  },
  disabledInput: {
    backgroundColor: '#e8e8e8',
    color: '#888',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center"
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    marginRight: 5,
    color: '#3d2a71',
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginVertical: 15,
  },
  submitButton: {
    backgroundColor: '#f9b91a', // Orange color
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    width:width/1.2,
    alignSelf:"center"
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  otpButtonsContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  verifyButton: {
    backgroundColor: '#f9b91a', // Orange color
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    width:width/1.2,
    alignSelf:"center",
    marginTop:20
  },
  resendButton: {
    borderWidth: 1,
    borderColor: '#3d2a71',
    borderRadius: 10,
    marginHorizontal:30,
    // paddingVertical: 12,
    alignItems: 'flex-end',
  },
  resendText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: 'white',
    fontSize: 14,
  },
  linkButtonText: {
    color: '#f9b91a',
    fontSize: 14,
    fontWeight: 'bold',
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
    width:width/1.2,
    alignSelf: "center",
    height: 45,
    elevation:4,
    backgroundColor:"white",
    borderColor:"black"
  },
});
