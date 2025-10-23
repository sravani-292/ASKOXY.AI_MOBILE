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
  useColorScheme,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import axios from "axios";
import { TextInput } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
import GoogleAnalyticsService from "../Components/GoogleAnalytic";


const Login = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    mobileNumber_error: false,
    validMobileNumber_error: false,
    otp: "",
    otp_error: false,
    validOtpError: false,
    loading: false,
  });
  const [isTelugu, setIsTelugu] = useState(true);
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const isLightMode = theme === "light"; 

    // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  // console.log({ BASE_URL });
  const phoneInput = React.createRef();

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [mobileOtpSession, setMobileOtpSession] = useState();
  const [saltSession, setSaltSession] = useState(""); 
  const [otpGeneratedTime, setOtpGeneratedTime] = useState("");
  const [message, setMessage] = useState(false);
  const [authMethod, setAuthMethod] = useState("sms");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappNumber_Error, setWhatsappNumber_Error] = useState(false);
  const [phoneNumber_Error, setPhoneNumber_Error] = useState(false);
  const [errorNumberInput, seterrorNumberInput] = useState(false);
  const [validError, setValidError] = useState(false);
  const [error1, setError1] = useState(null);
  const [countryCode, setcountryCode] = useState("91");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otpMessage, setOtpMessage] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

   // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
 
  useFocusEffect(
    useCallback(() => {
      const checkLoginData = async () => {

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
            if (user.accessToken) {
              dispatch(AccessToken(user));
              navigation.navigate("Home");
            }
          }
        } catch (error) {
          console.error("Error fetching login data", error.response);
        }
      };

      checkLoginData();
      // getVersion();

    }, [currentScreen])
  );

  const currentScreen = useNavigationState(
    (state) => state.routes[state.index]?.name
  );

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
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
  
      // ✅ Updated: Save the subscription and call remove() during cleanup
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );
  
      return () => backHandler.remove(); // ✅ correct way to clean up
    }, [currentScreen])
  );
  

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardOpen(true));
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
      if (!otpSent) {
        // handleSendOtp()
      }else{
        // handleVerifyOtp()
      }
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [authMethod, phoneNumber, whatsappNumber, otpSent]);



  const handleSendOtp = async () => {
    // console.log("sdmbv",authMethod,countryCode,whatsappNumber)
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    if (authMethod === "whatsapp") {
      if (whatsappNumber == "" || whatsappNumber == null) {
        setWhatsappNumber_Error(true);
        return false;
      }
      if (!whatsappNumber) { 
        setError1("Please enter a phone number.");
        return false;
      } else if (!phoneInput.current.isValidNumber(whatsappNumber)) {
        setError1("Invalid phone number. Please check the format.");
        return false;
      }
    } else {
      if (phoneNumber == "" || phoneNumber == null) {
        setPhoneNumber_Error(true);
        return false;
      }
      if (phoneNumber.length != 10) {
        setValidError(true);
        return false;
      }
    }
    let data;
    data =
      authMethod === "whatsapp"
        ? {
            countryCode: "+" + countryCode,
            whatsappNumber,
            userType: "Login",
            registrationType: "whatsapp",
          }
        : {
            countryCode: "+91",
            mobileNumber: phoneNumber,
            userType: "Login",
            registrationType: "sms",
          };
    console.log({ data });
    console.log("Before API call, loading:", formData.loading);
    setFormData(prev => ({ ...prev, loading: true }));
    console.log("After setting loading, loading:", formData.loading);
    axios({
      method: "post",
      url: BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
      data: data,
    })
      .then((response) => {
        console.log("response", response);
        setFormData({
          ...formData,
          loading: false,
        });
        if (response.data.mobileOtpSession) {
          setWhatsappNumber_Error(false);
          setMessage(true);
          setMobileOtpSession(response.data.mobileOtpSession);
          setSaltSession(response.data.salt);
          setOtpGeneratedTime(response.data.otpGeneratedTime);
          setOtpMessage(true);
          setOtpSent(true);
        } else {
          Alert, alert("Failed", "Failed to send OTP.Try again");
        }
      })
      .catch((error) => {
        console.log("error", error.response.status);

        // if (error.response.status == 409||error.response.status == 500) {
        //   Alert.alert("Sorry", "Error occurred. Please try again after some time.");
        // }
        setOtpSent(false);
        setFormData({
          ...formData,
          loading: false,
        });
        Alert.alert("Sorry", "You  are not registered,Please signup", [
          {
            text: "ok",
            onPress: () => navigation.navigate("RegisterScreen"),
          },
        ]);
       
      });
  };

  const handleVerifyOtp = () => {
    if(!otpSent){
      return
    }
    if (formData.otp == "" || formData.otp == null) {
      setOtpError(true);
      return false;
    }
    if (authMethod === "whatsapp") {
      if (formData.otp.length != 4) {
        setFormData({ ...formData, validOtpError: true });
        return false;
      }
    } else {
      if (formData.otp.length != 6) {
        setFormData({ ...formData, validOtpError: true });
        return false;
      }
    }
    setFormData({ ...formData, loading: true });
    let data;
    if (authMethod == "whatsapp") {
      data = {
        countryCode: "+" + countryCode,
        whatsappNumber: whatsappNumber,
        whatsappOtpSession: mobileOtpSession,
        whatsappOtpValue: formData.otp,
        userType: "Login",
        salt: saltSession,
        expiryTime: otpGeneratedTime,
        registrationType: "whatsapp",
      };
    } else {
      data = {
        countryCode: "+91",
        mobileNumber: phoneNumber,
        mobileOtpSession: mobileOtpSession,
        mobileOtpValue: formData.otp,
        userType: "Login",
        salt: saltSession,
        expiryTime: otpGeneratedTime,
        registrationType: "mobile",
      };
    }
    // console.log({ data });
    console.log("otp verification data", data);

    axios({
      method: "post",
      url: BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
      data: data,
    })
      .then(async (response) => {
        console.log("response", response);
        setFormData({ ...formData, loading: false, otp: "" });
        setOtpError(false);
        if (response.data.primaryType == "CUSTOMER") {
         
          if (response.data.accessToken != null) {
            setOtpSent(false);
            dispatch(AccessToken(response.data));
            await AsyncStorage.setItem(
              "userData",
              JSON.stringify(response.data)
            );
            

            if (
              response.data.userStatus == "ACTIVE" ||
              response.data.userStatus == null
            ) {
              GoogleAnalyticsService.login(authMethod == "whatsapp" ? "whatsapp" : "SMS");
              navigation.reset({
                index: 0,
                routes: [{ name: "Home", params: { screen: "Dashboard" } }],
              });
            } else {
              Alert.alert(
                "Deactivated",
                "Your account is deactivated, Are you want to reactivate your account to continue?",
                [
                  { text: "Yes", onPress: () => navigation.navigate("Active") },
                  { text: "No", onPress: () => BackHandler.exitApp() },
                ]
              );
            }
          } else {
            Alert.alert("Error", "Invalid credentials.");
          }
        } else {
          Alert.alert(
            "Failed",
            `You have logged in as ${response.data.primaryType} , Please login as Customer`
          );
        }
      })
      .catch((error) => {
        setFormData({ ...formData, loading: false });
        
        console.log("login error",error.response.status);
        console.log("login error",error.response);
        
        if (error.response.status == 409) {
          Alert.alert("Failed", error.response.data.message);
        }
        if (error.response.status == 400) {
          Alert.alert("Failed", "Invalid Credentials");
        }
        // if(error.response.status == 500){
        //   Alert.alert("Error Occured,Please try it after some time")
        // }
      });
  };


  const handlePhoneNumberChange = (value) => {
    console.log({ value });
    setValidError(false);
    seterrorNumberInput(false);
    setWhatsappNumber_Error(false);
    setError1(false);
    try {
      setWhatsappNumber(value);

      //  console.log({value})
      const callingCode = phoneInput.getCallingCode(value);
      // console.log(callingCode);
      setcountryCode(callingCode);
    } catch (error) {
      // Handle any parsing errors
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior="padding"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always">
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
       
            {/* Header Section with Images */}
            <View style={styles.headerSection}>
              <View style={styles.decorativeImagesContainer}>
                <Image
                  source={require("../../assets/Images/orange.png")}
                  style={styles.orangeImage}
                />
              </View>
              <View style={styles.logoContainer}>
                <Animated.View
                  style={[
                    styles.oxylogoView,
                    {
                      opacity: fadeAnim,
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <Image
                    source={require("../../assets/Images/logo1.png")}
                    style={styles.oxyricelogo}
                  />
                </Animated.View>
                <View style={styles.greenImageView}>
                  <Image
                    source={require("../../assets/Images/green.png")}
                    style={styles.greenImage}
                  />
                </View>
              </View>
            </View>
          {/* Login Section */}
           {/* Login Card */}
            <Animated.View
              style={[
                styles.loginCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >


{/* {otpSent==false?
             <View style={{ backgroundColor: "white", margin: 20, padding: 10, borderRadius: 10, elevation: 5 }}>
             <View style={{ flexDirection: "row", alignItems: "center" }}>
               <Text style={{ fontSize: 18 }}>⚠️</Text>
               <View style={{ width: width * 0.75, marginLeft: 10 }}>
                 {isTelugu ? (
                   <>
                     <Text style={{ fontSize: 16, fontWeight: "bold",marginBottom:10 }}>ERICE కస్టమర్లకు గమనిక</Text>
                     <Text style={{ fontSize: 15 }}>
                       మీ డేటా మైగ్రేట్ చేయబడింది. SMS ఎంపికను ఉపయోగించి లాగిన్ అవ్వండి. మీ మొబైల్ మరియు WhatsApp నంబర్లు ఒకటే అయితే, మీరు WhatsApp ద్వారా కూడా లాగిన్ అవ్వవచ్చు.
                     </Text>
                   </>
                 ) : (
                   <>
                     <Text style={{ fontSize: 16, fontWeight: "bold",marginBottom:10 }}>Attention Erice Customers</Text>
                     <Text style={{ fontSize: 15 }}>
                       Your data has been migrated. Log in using the SMS option. If your mobile and WhatsApp numbers are the same, you can also log in via WhatsApp.
                     </Text>
                   </>
                 )}
               </View>
             </View>

             <TouchableOpacity
               onPress={() => setIsTelugu(!isTelugu)}
               style={{
                 right: 10,
                 padding: 4,
                 borderRadius: 5,
                 backgroundColor: "#f0f0f0",
                 opacity: 0.7,
                 alignSelf:"flex-end"
               }}
             >
               <Text style={{ fontSize: 14, fontWeight: "bold", color: "blue" }}>
                 {isTelugu ? "English Version" : "Telugu Version"}
               </Text>
             </TouchableOpacity>
           </View>
             :null} */}

            {/* Welcome Text */}
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome Back!</Text>
                <Text style={styles.subtitleText}>
                  Login to continue your journey
                </Text>
              </View>

                          {/* Auth Method Selector */}
              <View style={styles.authMethodContainer}>
                <TouchableOpacity
                  style={[
                    styles.authMethodButton,
                    authMethod === "sms" && styles.activeAuthMethod,
                  ]}
                  onPress={() => {
                    setAuthMethod("sms");
                    setOtpSent(false);
                    setWhatsappNumber("");
                    setWhatsappNumber_Error(false);
                    setOtpMessage(false);
                    setPhoneNumber_Error(false);
                    setPhoneNumber("");
                    setFormData({ ...formData, loading: false, otp: "" });
                  }}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      authMethod === "sms" && styles.activeIconContainer,
                    ]}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={22}
                      color={authMethod === "sms" ? "#fff" : "#3d2a71"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.authMethodText,
                      authMethod === "sms" && styles.activeAuthMethodText,
                    ]}
                  >
                    SMS
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.authMethodButton,
                    authMethod === "whatsapp" && styles.activeAuthMethod,
                  ]}
                  onPress={() => {
                    setAuthMethod("whatsapp");
                    setOtpSent(false);
                    setWhatsappNumber("");
                    setOtpMessage(false);
                    setWhatsappNumber_Error(false);
                    setPhoneNumber("");
                    setPhoneNumber_Error(false);
                    setFormData({ ...formData, loading: false, otp: "" });
                  }}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      authMethod === "whatsapp" && styles.activeIconContainer,
                    ]}
                  >
                    <Ionicons
                      name="logo-whatsapp"
                      size={22}
                      color={authMethod === "whatsapp" ? "#fff" : "#3d2a71"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.authMethodText,
                      authMethod === "whatsapp" && styles.activeAuthMethodText,
                    ]}
                  >
                    WhatsApp
                  </Text>
                </TouchableOpacity>
              </View>

            {/* {authMethod === "whatsapp" && otpSent && (
              <Text style={{ textAlign: "center", color: "#fff" }}>
                OTP send to your whatsapp number
              </Text>
            )} */}
            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              {authMethod === "whatsapp" ? (
                <View style={styles.phoneInputContainer}>
                  <PhoneInput
                    placeholder="Whatsapp Number"
                    placeholderTextColor={isDarkMode ? '#111111ff' : '#555'}
                    ref={phoneInput}
                    containerStyle={[styles.input1, { backgroundColor: isDarkMode ? '#fff' : '#fff' }]}
                    textInputStyle={[styles.phonestyle,{ backgroundColor: isDarkMode ? '#fff' : '#fff',color: isDarkMode ? '#000' : '#000' }]}
                    codeTextStyle={[styles.phonestyle1,{ color: isDarkMode ? '#000' : '#fff' }]}
                    // ref={(ref) => (phoneInput = ref)}
                    defaultValue={whatsappNumber}
                    defaultCode="IN"
                    layout="first"
                    onChangeText={handlePhoneNumberChange}
                    onSubmitEditing={() => {
                      Keyboard.dismiss(); // Dismiss keyboard first
                      setTimeout(() => handleSendOtp(), 50); // Delay to ensure keyboard is fully dismissed
                    }}
                  />
                </View>
              ) : (
                <>
                  {/* {authMethod === "sms" && otpSent && (
                    <Text style={{ textAlign: "center", color: "#fff" }}>
                      OTP send to your Mobile number
                    </Text>
                  )} */}
                  <TextInput
                    style={[styles.input, otpSent && styles.disabledInput,{ backgroundColor: isDarkMode ? '#333' : '#fff',color: isDarkMode ? '#fff' : '#000' }]}
                    placeholder="Enter your phone number"
                    placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                    keyboardType="number-pad"
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text.replace(/[ \-.,]/g, "")),
                        setPhoneNumber_Error(false),
                        setValidError(false);
                    }}
                    // editable={!otpSent}
                    maxLength={10}
                    onSubmitEditing={handleSendOtp}
                  />
                </>
              )}
            </View>

            {whatsappNumber_Error && (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Please enter the whatsapp number
              </Text>
            )}

            {phoneNumber_Error && (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Please enter the Mobile number
              </Text>
            )}
            {validError && (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Invalid Mobile Number
              </Text>
            )}

            {error1 && (
              <Text
                style={{ color: "red", marginBottom: 10, alignSelf: "center" }}
              >
                {error1}
              </Text>
            )}

            {otpMessage && (
              <Text
                style={{
                  textTransform: "uppercase",
                  color: "white",
                  alignSelf: "center",
                  marginBottom: 5,
                }}
              >
                Otp sent to {authMethod}
              </Text>
            )}
            {errorMessage && (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Please enter numbers only. Special characters are not allowed.
              </Text>
            )}

            {/* OTP Input (shown only after OTP is sent) */}
            {otpSent && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: isDarkMode ? '#333' : '#fff',color: isDarkMode ? '#fff' : '#000' }]}
                  placeholder="Enter OTP code"
                  placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                  keyboardType="number-pad"
                  value={formData.otp}
                  onChangeText={(numeric) => {
                    setFormData({
                      ...formData,
                      otp: numeric,
                      validOtpError: false,
                    }),
                      setOtpError(false),
                      setOtpMessage(false);
                  }}
                  maxLength={authMethod === "whatsapp" ? 4 : 6}
                  onSubmitEditing={()=>handleVerifyOtp()}
                />
              </View>
            )}

            {otpError && (
              <Text style={{ color: "red", alignSelf: "center",width:width*0.35 }}>
                Please enter OTP
              </Text>
            )}
            {formData.validOtpError && (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Invalid OTP
              </Text>
            )}

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => handleSendOtp()}
              disabled={loading}
            >
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {!otpSent ? (
                <>
                  <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => {
                        // Dismiss the keyboard
                        Keyboard.dismiss();

                        // Call handleSendOtp() after ensuring keyboard is dismissed
                        setTimeout(() => {
                          handleSendOtp();
                        }, 50); // 50ms delay ensures API hits after keyboard closes
                      }}
                      disabled={loading}
                    >
                      {formData.loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.submitText}>Send OTP</Text>
                      )}
                    </TouchableOpacity>

                </>
              ) : (
                <View style={styles.otpButtonsContainer}>
                  <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={() => handleVerifyOtp()}
                    disabled={loading}
                  >
                    {formData.loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.emailbtn}
              onPress={() => navigation.navigate("LoginWithPassword")}
            >
              <MaterialCommunityIcons name="email" size={30} />
            </TouchableOpacity>
            {/* Register Link */}
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("RegisterScreen"),
                    setOtpSent(false),
                    setWhatsappNumber(""),
                    setPhoneNumber_Error(false),
                    setFormData({ ...formData, loading: false, otp: "" });
                }}
              >
                <Text style={styles.linkButtonText}>Register</Text>
              </TouchableOpacity>
            </View>
            </Animated.View>
          </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
 headerSection: {
    backgroundColor: "#fff",
  },
  decorativeImagesContainer: {
    position: "relative",
  },
  orangeImage: {
    height: 150,
    width: 150,
    marginBottom: -45,
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 80,
  },
  oxylogoView: {
    marginLeft: width * 0.08,
  },
  oxyricelogo: {
    width: 200,
    height: 70,
    resizeMode: "contain",
  },
  greenImageView: {
    alignItems: "flex-end",
  },
  greenImage: {
    height: 110,
    width: 65,
  },
   loginCard: {
    flex: 1,
    backgroundColor: "#3d2a71",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -height / 25,
    paddingTop: 35,
    paddingHorizontal: 25,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeSection: {
    marginBottom: 30,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "400",
  },
  logingreenView: {
     flex: 1,
    backgroundColor: "#3d2a71",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -height / 25,
    paddingTop: 35,
    paddingHorizontal: 25,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  loginTxt: {
    color: "white",
    fontWeight: "800",
    fontSize: 25,
    margin: 20,
    alignSelf: "center",
    fontSize: 30,
    // fontStyle: "italic",
  },
  authMethodContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 25,
    justifyContent: "center",
  },
  authMethodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    width: width * 0.4,
    gap: 8,
  },
  activeAuthMethod: {
    backgroundColor: "#f9b91a",
    shadowColor: "#f9b91a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  authMethodText: {
    fontSize: 15,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.9)",
  },
  activeAuthMethodText: {
    color: "#fff",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    // paddingVertical: 12,
    fontSize: 16,
    // marginTop: 10,
    width: width / 1.2,
    alignSelf: "center",
    height: 45,
  },
  disabledInput: {
    backgroundColor: "#e8e8e8",
    color: "#888",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  countryCodeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    marginRight: 5,
    color: "#3d2a71",
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginVertical: 15,
  },
  submitButton: {
    backgroundColor: "#f9b91a", // Orange color
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    width: width / 1.2,
    alignSelf: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  otpButtonsContainer: {
    flexDirection: "column",
    gap: 10,
  },
  verifyButton: {
    backgroundColor: "#f9b91a", // Orange color
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    width: width / 1.2,
    alignSelf: "center",
  },
  resendButton: {
    borderWidth: 1,
    borderColor: "#3d2a71",
    borderRadius: 10,
    marginHorizontal: 30,
    // paddingVertical: 12,
    alignItems: "flex-end",
  },
  resendText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  linkText: {
    color: "white",
    fontSize: 14,
  },
  linkButtonText: {
    color: "#f9b91a",
    fontSize: 14,
    fontWeight: "bold",
  },
  phonestyle: {
    width: "100%",
    height: 39,
  },
  phonestyle1: {
    height: 20,
  },
  input1: {
    marginTop: 10,
    width: width / 1.2,
    alignSelf: "center",
    height: 45,
    elevation: 4,
    backgroundColor: "white",
    borderColor: "black",
  },
  emailbtn: {
    backgroundColor: "white",
    padding: 5,
    width: 40,
    height: 40,
    alignSelf: "center",
    alignItems: "center",
  },
});