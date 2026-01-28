// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Image,
//   KeyboardAvoidingView,
//   Keyboard,
//   Platform,
//   Dimensions,
//   BackHandler,
//   useColorScheme,
//   Animated,
//   TouchableWithoutFeedback,
// } from "react-native";
// import axios from "axios";
// import { TextInput } from "react-native-paper";
// import { StatusBar } from "expo-status-bar";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import PhoneInput from "react-native-phone-number-input";
// import {
//   useNavigation,
//   useFocusEffect,
//   useNavigationState,
// } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useDispatch } from "react-redux";
// import { AccessToken } from "../../Redux/action/index";
// import BASE_URL, { userStage } from "../../Config";
// const { height, width } = Dimensions.get("window");
// import Icon from "react-native-vector-icons/Ionicons";
// import { Checkbox } from "react-native-paper";
// import Feather from "react-native-vector-icons/Feather";
// import GoogleAnalyticsService from "../Components/GoogleAnalytic";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     mobileNumber: "",
//     mobileNumber_error: false,
//     validMobileNumber_error: false,
//     otp: "",
//     otp_error: false,
//     validOtpError: false,
//     loading: false,
//   });

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const otpStateRef = useRef(["", "", "", "", "", ""]);
//   const otpRefs = useRef([...Array(6)].map(() => React.createRef()));

//   const theme = useColorScheme();
//   const isDarkMode = theme === "dark";
//   const isLightMode = theme === "light";

//   // Animation values
//   const [fadeAnim] = useState(new Animated.Value(0));
//   const [slideAnim] = useState(new Animated.Value(50));
//   const [scaleAnim] = useState(new Animated.Value(0.9));

//   const phoneInput = React.createRef();

//   const [showOtp, setShowOtp] = useState(false);
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const [mobileOtpSession, setMobileOtpSession] = useState();
//   const [saltSession, setSaltSession] = useState("");
//   const [otpGeneratedTime, setOtpGeneratedTime] = useState("");
//   const [message, setMessage] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(false);
//   const [authMethod, setAuthMethod] = useState("whatsapp");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [whatsappNumber_Error, setWhatsappNumber_Error] = useState(false);
//   const [phoneNumber_Error, setPhoneNumber_Error] = useState(false);
//   const [errorNumberInput, seterrorNumberInput] = useState(false);
//   const [validError, setValidError] = useState(false);
//   const [countryCode, setcountryCode] = useState("91");
//   const [otpSent, setOtpSent] = useState(false);
//   const [countryPickerVisible, setCountryPickerVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [otpError, setOtpError] = useState(false);
//   const [error1, setError1] = useState(null);
//   const [otpMessage, setOtpMessage] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const [referCode, setReferCode] = useState(null);
//   const [referEmptyError, setReferEmptyError] = useState(false);

//   // Entrance animation
//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 600,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 4,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   // Enhanced OTP handling with autofill support
//   const handleOtpChange = (value, index) => {
//     // Handle autofill: when system pastes full OTP
//     if (value.length > 1) {
//       const digits = value.replace(/[^0-9]/g, "").slice(0, 6);
//       const newOtp = ["", "", "", "", "", ""];

//       for (let i = 0; i < digits.length; i++) {
//         newOtp[i] = digits[i];
//       }

//       otpStateRef.current = newOtp;
//       setOtp(newOtp);
//       setFormData((prev) => ({ ...prev, otp_error: false, validOtpError: false }));

//       // Focus last filled box or blur if complete
//       if (digits.length === 6) {
//         setTimeout(() => {
//           otpRefs.current[5].current?.blur();
//           Keyboard.dismiss();
//         }, 50);
//       } else if (digits.length < 6) {
//         setTimeout(() => otpRefs.current[digits.length]?.current?.focus(), 50);
//       }
//       return;
//     }

//     // Handle single digit input
//     const digit = value.replace(/[^0-9]/g, "").slice(0, 1);
//     const newOtp = [...otpStateRef.current];
//     newOtp[index] = digit;

//     otpStateRef.current = newOtp;
//     setOtp(newOtp);
//     setFormData((prev) => ({ ...prev, otp_error: false, validOtpError: false }));

//     // Auto-focus next box only if there's a digit and we're not at the last box
//     if (digit !== "" && index < 5) {
//       setTimeout(() => otpRefs.current[index + 1].current?.focus(), 10);
//     } else if (digit !== "" && index === 5) {
//       // If last box is filled, dismiss keyboard
//       setTimeout(() => {
//         otpRefs.current[5].current?.blur();
//         Keyboard.dismiss();
//       }, 10);
//     }
//   };

//   const handleOtpKeyPress = (e, index) => {
//     if (e.nativeEvent.key === "Backspace") {
//       const currentOtp = [...otpStateRef.current];

//       if (currentOtp[index] === "" && index > 0) {
//         // Move to previous box if current is empty
//         currentOtp[index - 1] = "";
//         otpStateRef.current = currentOtp;
//         setOtp(currentOtp);
//         setTimeout(() => otpRefs.current[index - 1].current?.focus(), 10);
//       } else if (currentOtp[index] !== "") {
//         // Clear current box
//         currentOtp[index] = "";
//         otpStateRef.current = currentOtp;
//         setOtp(currentOtp);
//       }
//     }
//   };

//   // Sync ref with state
//   useEffect(() => {
//     otpStateRef.current = otp;
//   }, [otp]);

//   const resetOtpInputs = () => {
//     const emptyOtp = ["", "", "", "", "", ""];
//     setOtp(emptyOtp);
//     otpStateRef.current = emptyOtp;
//     setFormData((prev) => ({ 
//       ...prev, 
//       otp: "", 
//       otp_error: false, 
//       validOtpError: false 
//     }));
//   };

//   const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       "keyboardDidShow",
//       () => setIsKeyboardOpen(true)
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       "keyboardDidHide",
//       () => setIsKeyboardOpen(false)
//     );

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       const checkLoginData = async () => {
//         try {
//           const loginData = await AsyncStorage.getItem("userData");
//           const storedmobilenumber = await AsyncStorage.getItem("mobileNumber");

//           if (storedmobilenumber) {
//             setFormData((prev) => ({ ...prev, mobileNumber: storedmobilenumber }));
//           }

//           if (loginData) {
//             const user = JSON.parse(loginData);
//           }
//         } catch (error) {
//           console.error("Error fetching login data", error);
//         }
//       };

//       checkLoginData();
//     }, [])
//   );

//   const currentScreen = useNavigationState(
//     (state) => state.routes[state.index]?.name
//   );

//   useFocusEffect(
//     useCallback(() => {
//       const handleBackPress = () => {
//         Alert.alert(
//           "Exit",
//           "Are you sure you want to exit?",
//           [
//             { text: "Cancel", style: "cancel" },
//             { text: "OK", onPress: () => BackHandler.exitApp() },
//           ],
//           { cancelable: false }
//         );
//         return true;
//       };

//       const backHandler = BackHandler.addEventListener(
//         "hardwareBackPress",
//         handleBackPress
//       );

//       return () => backHandler.remove();
//     }, [currentScreen])
//   );

//   const handleSendOtp = async () => {
//     if (Platform.OS !== "web") {
//       Keyboard.dismiss();
//     }
//     await new Promise((resolve) => setTimeout(resolve, 100));

//     if (authMethod === "whatsapp") {
//       if (whatsappNumber == "" || whatsappNumber == null) {
//         setWhatsappNumber_Error(true);
//         return false;
//       }
//       if (!whatsappNumber) {
//         setError1("Please enter a phone number.");
//         return false;
//       } else if (!phoneInput.current?.isValidNumber(whatsappNumber)) {
//         setError1("Invalid phone number. Please check the format.");
//         return false;
//       }
//     } else {
//       if (phoneNumber == "" || phoneNumber == null) {
//         setPhoneNumber_Error(true);
//         return false;
//       }
//       if (phoneNumber.length != 10) {
//         setValidError(true);
//         return false;
//       }
//     }

//     let data;
//     data =
//       authMethod === "whatsapp"
//         ? {
//             countryCode: "+" + countryCode,
//             whatsappNumber,
//             userType: "Register",
//             registrationType: "whatsapp",
//             referrerIdForMobile: referCode,
//           }
//         : {
//             countryCode: "+91",
//             mobileNumber: phoneNumber,
//             userType: "Register",
//             registrationType: "sms",
//             referrerIdForMobile: referCode,
//           };

//     setFormData((prev) => ({ ...prev, loading: true }));

//     axios({
//       method: "post",
//       url: BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
//       data: data,
//     })
//       .then((response) => {
//         console.log("response", response.data);

//         setFormData((prev) => ({ ...prev, loading: false }));

//         if (response.data.mobileOtpSession) {
//           setMessage(true);
//           setMobileOtpSession(response.data.mobileOtpSession);
//           setSaltSession(response.data.salt);
//           setOtpGeneratedTime(response.data.otpGeneratedTime);
//           setOtpMessage(true);
//           setOtpSent(true);
          
//           // Reset OTP inputs and focus first box
//           resetOtpInputs();
//           setTimeout(() => {
//             if (authMethod === "sms") {
//               otpRefs.current[0].current?.focus();
//             }
//           }, 300);
//         } else {
//           Alert.alert("Failed", "Failed to send OTP. Try again");
//         }
//       })
//       .catch((error) => {
//         console.log("error", error.response);
//         setOtpSent(false);
//         setFormData((prev) => ({ ...prev, loading: false }));

//         Alert.alert("Sorry", error.response?.data?.error || "An error occurred", [
//           {
//             text: "ok",
//             onPress: () => navigation.navigate("Login"),
//           },
//         ]);
//       });
//   };

//   const handleVerifyOtp = () => {
//     let otpValue;

//     if (authMethod === "sms") {
//       // Use OTP boxes for SMS
//       otpValue = otpStateRef.current.join("");
//       if (otpValue.length !== 6) {
//         setFormData((prev) => ({ ...prev, validOtpError: true }));
//         return false;
//       }
//     } else {
//       // Use single input for WhatsApp
//       otpValue = formData.otp;
//       if (otpValue == "" || otpValue == null) {
//         setFormData((prev) => ({ ...prev, otp_error: true }));
//         return false;
//       }
//       if (otpValue.length !== 4) {
//         setFormData((prev) => ({ ...prev, validOtpError: true }));
//         return false;
//       }
//     }

//     if (referCode != null) {
//       if (referCode.length > 4) {
//         setReferEmptyError("Referral code must be 4 characters or less");
//         return false;
//       }
//     }

//     setFormData((prev) => ({ ...prev, loading: true }));

//     let data;
//     if (authMethod == "whatsapp") {
//       data = {
//         countryCode: "+" + countryCode,
//         whatsappNumber: whatsappNumber,
//         whatsappOtpSession: mobileOtpSession,
//         whatsappOtpValue: otpValue,
//         userType: "Register",
//         salt: saltSession,
//         expiryTime: otpGeneratedTime,
//         registrationType: "whatsapp",
//         primaryType: "CUSTOMER",
//         registerdFrom: Platform.OS,
//         referrerIdForMobile: referCode,
//       };
//     } else {
//       data = {
//         countryCode: "+91",
//         mobileNumber: phoneNumber,
//         mobileOtpSession: mobileOtpSession,
//         mobileOtpValue: otpValue,
//         userType: "Register",
//         salt: saltSession,
//         expiryTime: otpGeneratedTime,
//         registrationType: "mobile",
//         primaryType: "CUSTOMER",
//         registerdFrom: Platform.OS,
//         referrerIdForMobile: referCode,
//       };
//     }

//     axios({
//       method: "post",
//       url: BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
//       data: data,
//     })
//       .then(async (response) => {
//         console.log("response", response.data.userStatus);

//         if (response.data.primaryType == "CUSTOMER") {
//           setFormData((prev) => ({
//             ...prev,
//             loading: false,
//             otp: "",
//             otp_error: false,
//             validOtpError: false,
//           }));

//           if (response.data.accessToken != null) {
//             setOtpSent(false);
//             dispatch(AccessToken(response.data));
//             await AsyncStorage.setItem("userData", JSON.stringify(response.data));

//             if (
//               response.data.userStatus == "ACTIVE" ||
//               response.data.userStatus == null
//             ) {
//               GoogleAnalyticsService.signup(
//                 authMethod == "whatsapp" ? "whatsapp" : "SMS"
//               );
//               navigation.navigate("Home");
//             } else {
//               Alert.alert(
//                 "Deactivated",
//                 "Your account is deactivated, Are you want to reactivate your account to continue?",
//                 [
//                   { text: "Yes", onPress: () => navigation.navigate("Active") },
//                   { text: "No", onPress: () => BackHandler.exitApp() },
//                 ]
//               );
//             }
//           } else {
//             Alert.alert("Error", "Invalid credentials.");
//           }
//         } else {
//           Alert.alert(
//             "Failed",
//             `You have logged in as ${response.data.primaryType}, Please login as Customer`
//           );
//         }
//       })
//       .catch((error) => {
//         setFormData((prev) => ({ ...prev, loading: false }));

//         console.log(error.response);
//         if (error.response?.status == 409) {
//           Alert.alert("Failed", error.response.data.error);
//         }
//         if (error.response?.status == 400) {
//           Alert.alert("Failed", "Invalid Credentials");
//         }
//       });
//   };

//   const handlePhoneNumberChange = (value) => {
//     setValidError(false);
//     seterrorNumberInput(false);
//     setWhatsappNumber_Error(false);
//     setError1(false);

//     try {
//       setWhatsappNumber(value);
//       const callingCode = phoneInput.current?.getCallingCode();
//       if (callingCode) {
//         setcountryCode(callingCode);
//       }

//       const isValid = /^[0-9]*$/.test(value);
//       if (isValid) {
//         setErrorMessage("");
//         setWhatsappNumber(value);
//       } else {
//         setErrorMessage(true);
//         return;
//       }
//     } catch (error) {
//       console.log("Phone input error:", error);
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//       <KeyboardAvoidingView
//         style={{ flex: 1, backgroundColor: "#fff" }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1 }}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={{ backgroundColor: "#fff", flex: 1 }}>
//             {/* Top Images */}
//             <View style={styles.headerSection}>
//               <View>
//                 <Image
//                   source={require("../../assets/Images/orange.png")}
//                   style={styles.orangeImage}
//                 />
//               </View>
//               <View style={styles.logoContainer}>
//                 <Animated.View
//                   style={[
//                     styles.oxylogoView,
//                     {
//                       opacity: fadeAnim,
//                       transform: [{ scale: scaleAnim }],
//                     },
//                   ]}
//                 >
//                   <Image
//                     source={require("../../assets/Images/logo1.png")}
//                     style={styles.oxyricelogo}
//                   />
//                 </Animated.View>
//                 <View style={styles.greenImageView}>
//                   <Image
//                     source={require("../../assets/Images/green.png")}
//                     style={styles.greenImage}
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* Register Section */}
//             <Animated.View
//               style={[
//                 styles.logingreenView,
//                 {
//                   opacity: fadeAnim,
//                   transform: [{ translateY: slideAnim }],
//                 },
//               ]}
//             >
//               <View style={styles.welcomeSection}>
//                 <Text style={styles.loginTxt}>Create Account</Text>
//                 <Text style={styles.subtitleText}>Register to get started</Text>
//               </View>

//               <View style={styles.authMethodContainer}>
//                 <TouchableOpacity
//                   style={[
//                     styles.authMethodButton,
//                     authMethod === "whatsapp" && styles.activeAuthMethod,
//                   ]}
//                   onPress={() => {
//                     setAuthMethod("whatsapp");
//                     setOtpSent(false);
//                     setWhatsappNumber("");
//                     setWhatsappNumber_Error(false);
//                     setError1("");
//                     setPhoneNumber("");
//                     setPhoneNumber_Error(false);
//                     setOtpMessage(false);
//                     resetOtpInputs();
//                     setFormData((prev) => ({ ...prev, loading: false, otp: "" }));
//                   }}
//                   activeOpacity={0.7}
//                 >
//                   <View
//                     style={[
//                       styles.iconContainer,
//                       authMethod === "whatsapp" && styles.activeIconContainer,
//                     ]}
//                   >
//                     <Ionicons
//                       name="logo-whatsapp"
//                       size={22}
//                       color={authMethod === "whatsapp" ? "#fff" : "#3d2a71"}
//                     />
//                   </View>
//                   <Text
//                     style={[
//                       styles.authMethodText,
//                       authMethod === "whatsapp" && styles.activeAuthMethodText,
//                     ]}
//                   >
//                     WhatsApp
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[
//                     styles.authMethodButton,
//                     authMethod === "sms" && styles.activeAuthMethod,
//                   ]}
//                   onPress={() => {
//                     setAuthMethod("sms");
//                     setOtpSent(false);
//                     setWhatsappNumber("");
//                     setWhatsappNumber_Error(false);
//                     setError1("");
//                     setPhoneNumber_Error(false);
//                     setPhoneNumber("");
//                     setOtpMessage(false);
//                     resetOtpInputs();
//                     setFormData((prev) => ({ ...prev, loading: false, otp: "" }));
//                   }}
//                   activeOpacity={0.7}
//                 >
//                   <View
//                     style={[
//                       styles.iconContainer,
//                       authMethod === "sms" && styles.activeIconContainer,
//                     ]}
//                   >
//                     <Ionicons
//                       name="chatbubble-outline"
//                       size={22}
//                       color={authMethod === "sms" ? "#fff" : "#3d2a71"}
//                     />
//                   </View>
//                   <Text
//                     style={[
//                       styles.authMethodText,
//                       authMethod === "sms" && styles.activeAuthMethodText,
//                     ]}
//                   >
//                     SMS
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Phone Number Input */}
//               <View style={styles.inputContainer}>
//                 {authMethod === "whatsapp" ? (
//                   <View style={styles.phoneInputContainer}>
//                     <PhoneInput
//                       placeholder="Whatsapp Number"
//                       placeholderTextColor="#999"
//                       ref={phoneInput}
//                       containerStyle={styles.input1}
//                       textInputStyle={styles.phonestyle}
//                       codeTextStyle={styles.phonestyle1}
//                       defaultValue={whatsappNumber}
//                       defaultCode="IN"
//                       layout="first"
//                       onChangeText={handlePhoneNumberChange}
//                       onSubmitEditing={() => {
//                         Keyboard.dismiss();
//                         setTimeout(() => handleSendOtp(), 100);
//                       }}
//                     />
//                   </View>
//                 ) : (
//                   <TextInput
//                     style={[styles.input, otpSent && styles.disabledInput]}
//                     placeholder="Enter your phone number"
//                     placeholderTextColor="#999"
//                     keyboardType="number-pad"
//                     value={phoneNumber}
//                     onChangeText={(text) => {
//                       setPhoneNumber(text.replace(/[^0-9]/g, ""));
//                       setPhoneNumber_Error(false);
//                       setValidError(false);
//                     }}
//                     editable={!otpSent}
//                     maxLength={10}
//                     underlineColor="transparent"
//                     activeUnderlineColor="transparent"
//                     onSubmitEditing={handleSendOtp}
//                   />
//                 )}
//               </View>

//               {/* Error Messages */}
//               {whatsappNumber_Error && (
//                 <Text style={styles.errorText}>
//                   Please enter the whatsapp number
//                 </Text>
//               )}
//               {phoneNumber_Error && (
//                 <Text style={styles.errorText}>
//                   Please enter the Mobile number
//                 </Text>
//               )}
//               {validError && (
//                 <Text style={styles.errorText}>Invalid Mobile Number</Text>
//               )}
//               {error1 && <Text style={styles.errorText}>{error1}</Text>}

//               {/* OTP Sent Message */}
//               {otpMessage && (
//                 <Text style={styles.successText}>
//                   OTP sent to {authMethod === "sms" ? "SMS" : "WhatsApp"}
//                 </Text>
//               )}

//               {errorMessage && (
//                 <Text style={styles.errorText}>
//                   Please enter numbers only. Special characters are not allowed.
//                 </Text>
//               )}

//               {/* OTP Input - 6 boxes for SMS, single input for WhatsApp */}
//               {otpSent && (
//                 <>
//                   {authMethod === "sms" ? (
//                     <View style={styles.otpContainer}>
//                       {otp.map((digit, index) => (
//                         <TextInput
//                           key={index}
//                           ref={otpRefs.current[index]}
//                           style={styles.otpBox}
//                           value={digit}
//                           onChangeText={(value) => handleOtpChange(value, index)}
//                           onKeyPress={(e) => handleOtpKeyPress(e, index)}
//                           keyboardType="number-pad"
//                           maxLength={index === 0 ? 6 : 1}
//                           textAlign="center"
//                           textContentType={index === 0 ? "oneTimeCode" : "none"}
//                           autoComplete={index === 0 ? "sms-otp" : "off"}
//                           importantForAutofill={index === 0 ? "yes" : "no"}
//                           selectTextOnFocus
//                           blurOnSubmit={false}
//                           returnKeyType="done"
//                           editable={true}
//                           underlineColor="transparent"
//                           activeUnderlineColor="transparent"
//                         />
//                       ))}
//                     </View>
//                   ) : (
//                     <View style={styles.inputContainer}>
//                       <TextInput
//                         style={styles.input}
//                         placeholder="Enter OTP code"
//                         placeholderTextColor="#999"
//                         keyboardType="number-pad"
//                         autoFocus={true}
//                         value={formData.otp}
//                         onSubmitEditing={() => handleVerifyOtp()}
//                         onChangeText={(numeric) => {
//                           setFormData((prev) => ({
//                             ...prev,
//                             otp: numeric,
//                             validOtpError: false,
//                             otp_error: false,
//                           }));
//                           setOtpError(false);
//                           setOtpMessage(false);
//                         }}
//                         maxLength={4}
//                         underlineColor="transparent"
//                         activeUnderlineColor="transparent"
//                       />
//                     </View>
//                   )}
//                 </>
//               )}

//               {formData.otp_error && (
//                 <Text style={styles.errorText}>Please enter OTP</Text>
//               )}
//               {formData.validOtpError && (
//                 <Text style={styles.errorText}>Invalid OTP</Text>
//               )}

//               {/* Resend OTP Button */}
//               {otpSent && (
//                 <TouchableOpacity
//                   style={styles.resendButton}
//                   onPress={() => {
//                     resetOtpInputs();
//                     handleSendOtp();
//                   }}
//                   disabled={formData.loading}
//                 >
//                   <Text style={styles.resendText}>Resend OTP</Text>
//                 </TouchableOpacity>
//               )}

//               {/* Referral Code Input */}
//               {otpSent && (
//                 <View style={styles.inputContainer}>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter Referred Code (optional)"
//                     placeholderTextColor="#999"
//                     value={referCode}
//                     onChangeText={(text) => {
//                       setReferCode(text);
//                       setReferEmptyError(false);
//                     }}
//                     maxLength={4}
//                     underlineColor="transparent"
//                     activeUnderlineColor="transparent"
//                   />
//                   {referEmptyError && (
//                     <Text style={styles.errorText}>{referEmptyError}</Text>
//                   )}
//                 </View>
//               )}

//               {/* Action Buttons */}
//               <View style={styles.buttonContainer}>
//                 {!otpSent ? (
//                   <TouchableOpacity
//                     style={[
//                       styles.submitButton,
//                       formData.loading && styles.disabledButton,
//                     ]}
//                     onPress={() => {
//                       Keyboard.dismiss();
//                       setTimeout(() => handleSendOtp(), 100);
//                     }}
//                     disabled={formData.loading}
//                     activeOpacity={0.8}
//                   >
//                     {formData.loading ? (
//                       <ActivityIndicator color="#fff" size="small" />
//                     ) : (
//                       <Text style={styles.submitText}>Send OTP</Text>
//                     )}
//                   </TouchableOpacity>
//                 ) : (
//                   <TouchableOpacity
//                     style={[
//                       styles.verifyButton,
//                       formData.loading && styles.disabledButton,
//                     ]}
//                     onPress={handleVerifyOtp}
//                     disabled={formData.loading}
//                     activeOpacity={0.8}
//                   >
//                     {formData.loading ? (
//                       <ActivityIndicator color="#fff" size="small" />
//                     ) : (
//                       <Text style={styles.submitText}>Verify OTP</Text>
//                     )}
//                   </TouchableOpacity>
//                 )}
//               </View>

//               {/* Email Login Button */}
//               <TouchableOpacity
//                 style={styles.emailbtn}
//                 onPress={() => navigation.navigate("LoginWithPassword")}
//               >
//                 <MaterialCommunityIcons name="email" size={28} color="#3d2a71" />
//               </TouchableOpacity>

//               {/* Login Link */}
//               <View style={styles.linkContainer}>
//                 <Text style={styles.linkText}>Already Registered? </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     navigation.navigate("Login");
//                     setOtpSent(false);
//                     setWhatsappNumber("");
//                     setPhoneNumber("");
//                     setPhoneNumber_Error(false);
//                     resetOtpInputs();
//                     setFormData((prev) => ({ ...prev, loading: false, otp: "" }));
//                   }}
//                 >
//                   <Text style={styles.linkButtonText}>Login</Text>
//                 </TouchableOpacity>
//               </View>
//             </Animated.View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// export default Register;

// const styles = StyleSheet.create({
//   headerSection: {
//     backgroundColor: "#fff",
//   },
//   orangeImage: {
//     height: 150,
//     width: 150,
//     marginBottom: -45,
//   },
//   logoContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 80,
//   },
//   oxyricelogo: {
//     width: 200,
//     height: 70,
//     resizeMode: "contain",
//   },
//   oxylogoView: {
//     marginLeft: width * 0.08,
//   },
//   greenImage: {
//     height: 110,
//     width: 65,
//   },
//   greenImageView: {
//     alignItems: "flex-end",
//   },
//   logingreenView: {
//     flex: 1,
//     backgroundColor: "#3d2a71",
//     borderTopLeftRadius: 40,
//     borderTopRightRadius: 40,
//     marginTop: -height / 25,
//     paddingTop: 35,
//     paddingHorizontal: 25,
//     paddingBottom: 30,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 10,
//   },
//   welcomeSection: {
//     marginBottom: 25,
//     alignItems: "center",
//   },
//   loginTxt: {
//     fontSize: 32,
//     fontWeight: "800",
//     color: "#fff",
//     marginBottom: 8,
//     letterSpacing: 0.5,
//   },
//   subtitleText: {
//     fontSize: 15,
//     color: "rgba(255, 255, 255, 0.85)",
//     fontWeight: "400",
//   },
//   authMethodContainer: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 25,
//     justifyContent: "center",
//   },
//   authMethodButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderRadius: 16,
//     backgroundColor: "rgba(255, 255, 255, 0.15)",
//     width: width * 0.4,
//     gap: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   activeAuthMethod: {
//     backgroundColor: "#f9b91a",
//     shadowColor: "#f9b91a",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   iconContainer: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   activeIconContainer: {
//     backgroundColor: "rgba(255, 255, 255, 0.35)",
//   },
//   authMethodText: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "rgba(255, 255, 255, 0.9)",
//   },
//   activeAuthMethodText: {
//     color: "#fff",
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   input: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     width: width / 1.15,
//     alignSelf: "center",
//     height: 50,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   disabledInput: {
//     backgroundColor: "#e8e8e8",
//     color: "#888",
//   },
//   phoneInputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   phonestyle: {
//     width: "100%",
//     height: 50,
//     fontSize: 16,
//     color: "#000",
//   },
//   phonestyle1: {
//     height: 50,
//     fontSize: 16,
//     color: "#000",
//     marginTop: 25,
//   },
//   input1: {
//     width: width / 1.15,
//     alignSelf: "center",
//     height: 50,
//     backgroundColor: "white",
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   buttonContainer: {
//     marginVertical: 20,
//   },
//   submitButton: {
//     backgroundColor: "#f9b91a",
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     width: width / 1.15,
//     alignSelf: "center",
//     shadowColor: "#f9b91a",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//     minHeight: 54,
//   },
//   verifyButton: {
//     backgroundColor: "#f9b91a",
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     width: width / 1.15,
//     alignSelf: "center",
//     shadowColor: "#f9b91a",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//     minHeight: 54,
//   },
//   disabledButton: {
//     opacity: 0.7,
//   },
//   submitText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     letterSpacing: 0.5,
//   },
//   resendButton: {
//     alignItems: "flex-end",
//     marginRight: 30,
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   resendText: {
//     color: "#f9b91a",
//     fontSize: 15,
//     fontWeight: "600",
//     textDecorationLine: "underline",
//   },
//   linkContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 15,
//   },
//   linkText: {
//     color: "rgba(255, 255, 255, 0.9)",
//     fontSize: 14,
//   },
//   linkButtonText: {
//     color: "#f9b91a",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   emailbtn: {
//     backgroundColor: "white",
//     padding: 8,
//     width: 44,
//     height: 44,
//     alignSelf: "center",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 22,
//     marginTop: 15,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   otpContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 20,
//     paddingHorizontal: 15,
//   },
//   otpBox: {
//     width: 48,
//     height: 48,
//     borderWidth: 2,
//     borderColor: "#f9b91a",
//     borderRadius: 12,
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     backgroundColor: "#fff",
//     color: "#3d2a71",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     alignSelf: "center",
//   },
//   errorText: {
//     color: "#ff6b6b",
//     alignSelf: "center",
//     marginBottom: 10,
//     fontSize: 13,
//     textAlign: "center",
//     paddingHorizontal: 20,
//   },
//   successText: {
//     color: "#4ade80",
//     alignSelf: "center",
//     marginBottom: 10,
//     fontSize: 14,
//     fontWeight: "600",
//     textAlign: "center",
//   },
// });




// // import React, { useState, useEffect, useCallback, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   Alert,
// //   StyleSheet,
// //   ScrollView,
// //   ActivityIndicator,
// //   Image,
// //   KeyboardAvoidingView,
// //   Keyboard,
// //   Platform,
// //   Dimensions,
// //   BackHandler,
// //   Animated,
// //   TouchableWithoutFeedback,
// // } from "react-native";
// // import axios from "axios";
// // import { TextInput } from "react-native-paper";
// // import Ionicons from "react-native-vector-icons/Ionicons";
// // import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// // import PhoneInput from "react-native-phone-number-input";
// // import {
// //   useNavigation,
// //   useFocusEffect,
// //   useNavigationState,
// // } from "@react-navigation/native";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { useDispatch } from "react-redux";
// // import { AccessToken } from "../../Redux/action/index";
// // import BASE_URL from "../../Config";
// // import GoogleAnalyticsService from "../Components/GoogleAnalytic";

// // const { height, width } = Dimensions.get("window");

// // const Register = () => {
// //   const [formData, setFormData] = useState({
// //     mobileNumber: "",
// //     otp: "",
// //     mobileNumber_error: false,
// //     validMobileNumber_error: false,
// //     otp_error: false,
// //     validOtpError: false,
// //     loading: false,
// //   });

// //   const navigation = useNavigation();
// //   const dispatch = useDispatch();

// //   const [authMethod, setAuthMethod] = useState("whatsapp");
// //   const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

// //   // Animation values
// //   const fadeAnim = useRef(new Animated.Value(0)).current;
// //   const scaleAnim = useRef(new Animated.Value(0.8)).current;

// //   // Animate logo on mount
// //   useEffect(() => {
// //     Animated.parallel([
// //       Animated.timing(fadeAnim, {
// //         toValue: 1,
// //         duration: 800,
// //         useNativeDriver: true,
// //       }),
// //       Animated.spring(scaleAnim, {
// //         toValue: 1,
// //         friction: 4,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();
// //   }, []);

// //   const phoneInput = useRef();

// //   const [mobileOtpSession, setMobileOtpSession] = useState();
// //   const [saltSession, setSaltSession] = useState("");
// //   const [otpGeneratedTime, setOtpGeneratedTime] = useState("");
// //   const [message, setMessage] = useState(false);
// //   const [errorMessage, setErrorMessage] = useState(false);
// //   const [phoneNumber, setPhoneNumber] = useState("");
// //   const [whatsappNumber, setWhatsappNumber] = useState("");
// //   const [whatsappNumber_Error, setWhatsappNumber_Error] = useState(false);
// //   const [phoneNumber_Error, setPhoneNumber_Error] = useState(false);
// //   const [validError, setValidError] = useState(false);
// //   const [countryCode, setcountryCode] = useState("91");
// //   const [otpSent, setOtpSent] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error1, setError1] = useState(null);
// //   const [otpMessage, setOtpMessage] = useState(false);
// //   const [referCode, setReferCode] = useState(null);
// //   const [referEmptyError, setReferEmptyError] = useState("");

// //   // Keyboard listeners
// //   useEffect(() => {
// //     const keyboardDidShowListener = Keyboard.addListener(
// //       "keyboardDidShow",
// //       () => setIsKeyboardOpen(true)
// //     );
// //     const keyboardDidHideListener = Keyboard.addListener(
// //       "keyboardDidHide",
// //       () => {
// //         setIsKeyboardOpen(false);
// //         if (!otpSent) {
// //           handleSendOtp();
// //         } else {
// //           if (formData.otp.length !== 0) {
// //             handleVerifyOtp();
// //           }
// //         }
// //       }
// //     );

// //     return () => {
// //       keyboardDidShowListener.remove();
// //       keyboardDidHideListener.remove();
// //     };
// //   }, [otpSent, formData.otp]);

// //   useFocusEffect(
// //     useCallback(() => {
// //       const checkLoginData = async () => {
// //         try {
// //           const loginData = await AsyncStorage.getItem("userData");
// //           const storedmobilenumber = await AsyncStorage.getItem("mobileNumber");

// //           if (storedmobilenumber) {
// //             setFormData((prev) => ({
// //               ...prev,
// //               mobileNumber: storedmobilenumber,
// //             }));
// //           }

// //           if (loginData) {
// //             const user = JSON.parse(loginData);
// //           }
// //         } catch (error) {
// //           console.error("Error fetching login data", error);
// //         }
// //       };

// //       checkLoginData();
// //     }, [])
// //   );

// //   const currentScreen = useNavigationState(
// //     (state) => state.routes[state.index]?.name
// //   );

// //   useFocusEffect(
// //     useCallback(() => {
// //       const handleBackPress = () => {
// //         Alert.alert(
// //           "Exit",
// //           "Are you sure you want to exit?",
// //           [
// //             { text: "Cancel", style: "cancel" },
// //             { text: "OK", onPress: () => BackHandler.exitApp() },
// //           ],
// //           { cancelable: false }
// //         );
// //         return true;
// //       };

// //       const backHandler = BackHandler.addEventListener(
// //         "hardwareBackPress",
// //         handleBackPress
// //       );

// //       return () => backHandler.remove();
// //     }, [currentScreen])
// //   );

// //   const handleSendOtp = async () => {
// //     console.log("Sending OTP", authMethod, countryCode, whatsappNumber);

// //     if (authMethod === "whatsapp") {
// //       if (!whatsappNumber) {
// //         setWhatsappNumber_Error(true);
// //         return false;
// //       }
// //       if (!phoneInput.current?.isValidNumber(whatsappNumber)) {
// //         setError1("Invalid phone number. Please check the format.");
// //         return false;
// //       }
// //     } else {
// //       if (!phoneNumber) {
// //         setPhoneNumber_Error(true);
// //         return false;
// //       }
// //       if (phoneNumber.length !== 10) {
// //         setValidError(true);
// //         return false;
// //       }
// //     }

// //     let data;
// //     data =
// //       authMethod === "whatsapp"
// //         ? {
// //             countryCode: "+" + countryCode,
// //             whatsappNumber,
// //             userType: "Register",
// //             registrationType: "whatsapp",
// //             referrerIdForMobile: referCode,
// //           }
// //         : {
// //             countryCode: "+91",
// //             mobileNumber: phoneNumber,
// //             userType: "Register",
// //             registrationType: "sms",
// //             referrerIdForMobile: referCode,
// //           };

// //     console.log({ data });
// //     setFormData({ ...formData, loading: true });

// //     axios({
// //       method: "post",
// //       url: BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
// //       data: data,
// //     })
// //       .then((response) => {
// //         console.log("response", response.data);

// //         if (response.data.mobileOtpSession) {
// //           setMessage(true);
// //           setMobileOtpSession(response.data.mobileOtpSession);
// //           setSaltSession(response.data.salt);
// //           setOtpGeneratedTime(response.data.otpGeneratedTime);
// //           setOtpMessage(true);
// //           setOtpSent(true);
// //           setFormData({ ...formData, loading: false });
// //         } else {
// //           setFormData({ ...formData, loading: false });
// //           Alert.alert("Failed", "Failed to send OTP. Try again");
// //         }
// //       })
// //       .catch((error) => {
// //         console.log("error", error.response);
// //         setOtpSent(false);
// //         setFormData({ ...formData, loading: false });

// //         Alert.alert("Sorry", error.response.data.error, [
// //           {
// //             text: "ok",
// //             onPress: () => navigation.navigate("Login"),
// //           },
// //         ]);
// //       });
// //   };

// //   const handleVerifyOtp = () => {
// //     console.log("Verifying OTP");

// //     if (!otpSent) return;

// //     const otpLength = authMethod === "whatsapp" ? 4 : 6;

// //     if (!formData.otp) {
// //       setFormData({ ...formData, otp_error: true });
// //       return;
// //     }

// //     if (formData.otp.length !== otpLength) {
// //       setFormData({ ...formData, validOtpError: true });
// //       return;
// //     }

// //     // Validate referral code
// //     if (referCode) {
// //       if (referCode.length > 4) {
// //         setReferEmptyError("Referral code must be 4 characters or less");
// //         return false;
// //       }
// //     }

// //     setFormData({ ...formData, loading: true });

// //     let data;
// //     if (authMethod === "whatsapp") {
// //       data = {
// //         countryCode: "+" + countryCode,
// //         whatsappNumber: whatsappNumber,
// //         whatsappOtpSession: mobileOtpSession,
// //         whatsappOtpValue: formData.otp,
// //         userType: "Register",
// //         salt: saltSession,
// //         expiryTime: otpGeneratedTime,
// //         registrationType: "whatsapp",
// //         primaryType: "CUSTOMER",
// //         registerdFrom: Platform.OS,
// //         referrerIdForMobile: referCode,
// //       };
// //     } else {
// //       data = {
// //         countryCode: "+91",
// //         mobileNumber: phoneNumber,
// //         mobileOtpSession: mobileOtpSession,
// //         mobileOtpValue: formData.otp,
// //         userType: "Register",
// //         salt: saltSession,
// //         expiryTime: otpGeneratedTime,
// //         registrationType: "mobile",
// //         primaryType: "CUSTOMER",
// //         registerdFrom: Platform.OS,
// //         referrerIdForMobile: referCode,
// //       };
// //     }

// //     axios({
// //       method: "post",
// //       url: BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
// //       data: data,
// //     })
// //       .then(async (response) => {
// //         console.log("response", response.data.userStatus);

// //         if (response.data.primaryType === "CUSTOMER") {
// //           setFormData({
// //             ...formData,
// //             loading: false,
// //             otp: "",
// //             otp_error: false,
// //             validOtpError: false,
// //           });

// //           if (response.data.accessToken != null) {
// //             setOtpSent(false);
// //             dispatch(AccessToken(response.data));
// //             await AsyncStorage.setItem(
// //               "userData",
// //               JSON.stringify(response.data)
// //             );

// //             if (
// //               response.data.userStatus === "ACTIVE" ||
// //               response.data.userStatus === null
// //             ) {
// //               GoogleAnalyticsService.signup(
// //                 authMethod === "whatsapp" ? "whatsapp" : "SMS"
// //               );
// //               navigation.reset({
// //                 index: 0,
// //                 routes: [{ name: "Home", params: { screen: "Dashboard" } }],
// //               });
// //             } else {
// //               Alert.alert(
// //                 "Deactivated",
// //                 "Your account is deactivated. Do you want to reactivate your account to continue?",
// //                 [
// //                   {
// //                     text: "Yes",
// //                     onPress: () => navigation.navigate("Active"),
// //                   },
// //                   { text: "No", onPress: () => BackHandler.exitApp() },
// //                 ]
// //               );
// //             }
// //           } else {
// //             Alert.alert("Error", "Invalid credentials.");
// //           }
// //         } else {
// //           Alert.alert(
// //             "Failed",
// //             `You have logged in as ${response.data.primaryType}. Please login as Customer`
// //           );
// //         }
// //       })
// //       .catch((error) => {
// //         setFormData({ ...formData, loading: false });

// //         console.log(error.response);
// //         if (error.response?.status === 409) {
// //           Alert.alert("Failed", error.response.data.error);
// //         }
// //         if (error.response?.status === 400) {
// //           Alert.alert("Failed", "Invalid OTP");
// //         }
// //       });
// //   };

// //   const handlePhoneNumberChange = (value) => {
// //     setValidError(false);
// //     setWhatsappNumber_Error(false);
// //     setError1(false);

// //     try {
// //       setWhatsappNumber(value);
// //       console.log({ value });
// //       const callingCode = phoneInput.current?.getCallingCode();
// //       console.log(callingCode);
// //       if (callingCode) {
// //         setcountryCode(callingCode);
// //       }

// //       const isValid = /^[0-9]*$/.test(value);
// //       if (isValid) {
// //         setErrorMessage("");
// //         setWhatsappNumber(value);
// //       } else {
// //         setErrorMessage(true);
// //         return;
// //       }
// //     } catch (error) {
// //       console.error("Error handling phone number change:", error);
// //     }
// //   };

// //   // Reset all fields when switching auth method
// //   const resetForm = useCallback(() => {
// //     setOtpSent(false);
// //     setWhatsappNumber("");
// //     setPhoneNumber("");
// //     setPhoneNumber_Error(false);
// //     setWhatsappNumber_Error(false);
// //     setOtpMessage(false);
// //     setError1(null);
// //     setValidError(false);
// //     setReferCode(null);
// //     setReferEmptyError("");
// //     setFormData({
// //       mobileNumber: "",
// //       otp: "",
// //       mobileNumber_error: false,
// //       validMobileNumber_error: false,
// //       otp_error: false,
// //       validOtpError: false,
// //       loading: false,
// //     });
// //   }, []);

// //   return (
// //     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
// //       <KeyboardAvoidingView
// //         style={{ flex: 1, backgroundColor: "#fff" }}
// //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// //         keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
// //       >
// //         <ScrollView
// //           contentContainerStyle={{ flexGrow: 1 }}
// //           keyboardShouldPersistTaps="handled"
// //           showsVerticalScrollIndicator={false}
// //         >
// //           <View style={{ backgroundColor: "#fff", flex: 1 }}>
// //             {/* Top Images */}
// //             <View style={styles.headerSection}>
// //               <View>
// //                 <Image
// //                   source={require("../../assets/Images/orange.png")}
// //                   style={styles.orangeImage}
// //                 />
// //               </View>
// //               <View style={styles.logoContainer}>
// //                 <Animated.View
// //                   style={[
// //                     styles.oxylogoView,
// //                     {
// //                       opacity: fadeAnim,
// //                       transform: [{ scale: scaleAnim }],
// //                     },
// //                   ]}
// //                 >
// //                   <Image
// //                     source={require("../../assets/Images/logo1.png")}
// //                     style={styles.oxyricelogo}
// //                   />
// //                 </Animated.View>
// //                 <View style={styles.greenImageView}>
// //                   <Image
// //                     source={require("../../assets/Images/green.png")}
// //                     style={styles.greenImage}
// //                   />
// //                 </View>
// //               </View>
// //             </View>

// //             {/* Login Section */}
// //             <View style={styles.logingreenView}>
// //               <Text style={styles.loginTxt}>Register</Text>

// //               <View style={styles.authMethodContainer}>
// //                 <TouchableOpacity
// //                   style={[
// //                     styles.authMethodButton,
// //                     authMethod === "whatsapp" && styles.activeAuthMethod,
// //                   ]}
// //                   onPress={() => {
// //                     setAuthMethod("whatsapp");
// //                     resetForm();
// //                   }}
// //                 >
// //                   <Ionicons
// //                     name="logo-whatsapp"
// //                     size={20}
// //                     color={authMethod === "whatsapp" ? "#3d2a71" : "#fff"}
// //                   />
// //                   <Text
// //                     style={[
// //                       styles.authMethodText,
// //                       authMethod === "whatsapp" && styles.activeAuthMethodText,
// //                     ]}
// //                   >
// //                     WhatsApp
// //                   </Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   style={[
// //                     styles.authMethodButton,
// //                     authMethod === "sms" && styles.activeAuthMethod,
// //                   ]}
// //                   onPress={() => {
// //                     setAuthMethod("sms");
// //                     resetForm();
// //                   }}
// //                 >
// //                   <Ionicons
// //                     name="chatbubble-outline"
// //                     size={20}
// //                     color={authMethod === "sms" ? "#3d2a71" : "#fff"}
// //                   />
// //                   <Text
// //                     style={[
// //                       styles.authMethodText,
// //                       authMethod === "sms" && styles.activeAuthMethodText,
// //                     ]}
// //                   >
// //                     SMS
// //                   </Text>
// //                 </TouchableOpacity>
// //               </View>

// //               {/* Phone Number Input */}
// //               <View style={styles.inputContainer}>
// //                 {authMethod === "whatsapp" ? (
// //                   <View style={styles.phoneInputContainer}>
// //                     <PhoneInput
// //                       placeholder="Whatsapp Number"
// //                       placeholderTextColor="#999"
// //                       ref={phoneInput}
// //                       containerStyle={[
// //                         styles.input1,
// //                         { backgroundColor: "#fff" },
// //                       ]}
// //                       textInputStyle={[
// //                         styles.phonestyle,
// //                         { backgroundColor: "#fff", color: "#000" },
// //                       ]}
// //                       codeTextStyle={[styles.phonestyle1, { color: "#000" }]}
// //                       defaultValue={whatsappNumber}
// //                       defaultCode="IN"
// //                       layout="first"
// //                       onChangeText={handlePhoneNumberChange}
// //                     />
// //                   </View>
// //                 ) : (
// //                   <TextInput
// //                     style={[
// //                       styles.input,
// //                       otpSent && styles.disabledInput,
// //                       { backgroundColor: "#fff", color: "#000" },
// //                     ]}
// //                     placeholder="Enter your phone number"
// //                     placeholderTextColor="#999"
// //                     keyboardType="phone-pad"
// //                     value={phoneNumber}
// //                     onChangeText={(text) => {
// //                       setPhoneNumber(text.replace(/[ \-.,]/g, ""));
// //                       setPhoneNumber_Error(false);
// //                       setValidError(false);
// //                     }}
// //                     editable={!otpSent}
// //                     maxLength={10}
// //                   />
// //                 )}
// //               </View>

// //               {whatsappNumber_Error && (
// //                 <Text style={styles.errorText}>
// //                   Please enter the whatsapp number
// //                 </Text>
// //               )}

// //               {phoneNumber_Error && (
// //                 <Text style={styles.errorText}>
// //                   Please enter the Mobile number
// //                 </Text>
// //               )}

// //               {validError && (
// //                 <Text style={styles.errorText}>Invalid Mobile Number</Text>
// //               )}

// //               {error1 && <Text style={styles.errorText}>{error1}</Text>}

// //               {otpMessage && (
// //                 <Text style={styles.successText}>
// //                   OTP SENT TO {authMethod.toUpperCase()}
// //                 </Text>
// //               )}

// //               {errorMessage && (
// //                 <Text style={styles.errorText}>
// //                   Please enter numbers only. Special characters are not allowed.
// //                 </Text>
// //               )}

// //               {/* OTP Input (shown only after OTP is sent) */}
// //               {otpSent && (
// //                 <View style={styles.inputContainer}>
// //                   <TextInput
// //                     style={[
// //                       styles.input,
// //                       { backgroundColor: "#fff", color: "#000" },
// //                     ]}
// //                     placeholder="Enter OTP code"
// //                     placeholderTextColor="#999"
// //                     keyboardType="number-pad"
// //                     autoFocus={true}
// //                     value={formData.otp}
// //                     onSubmitEditing={() => handleVerifyOtp()}
// //                     onChangeText={(numeric) => {
// //                       setFormData({
// //                         ...formData,
// //                         otp: numeric,
// //                         validOtpError: false,
// //                         otp_error: false,
// //                       });
// //                       setOtpMessage(false);
// //                     }}
// //                     maxLength={authMethod === "whatsapp" ? 4 : 6}
// //                   />
// //                 </View>
// //               )}

// //               {formData.otp_error && (
// //                 <Text style={styles.errorText}>Please enter OTP</Text>
// //               )}

// //               {formData.validOtpError && (
// //                 <Text style={styles.errorText}>Invalid OTP</Text>
// //               )}

// //               <TouchableOpacity
// //                 style={styles.resendButton}
// //                 onPress={() => handleSendOtp()}
// //                 disabled={loading}
// //               >
// //                 <Text style={styles.resendText}>Resend OTP</Text>
// //               </TouchableOpacity>

// //               {/* Referral Code Input */}
// //               {otpSent && (
// //                 <View style={styles.inputContainer}>
// //                   <TextInput
// //                     style={[styles.input, { backgroundColor: "#fff" }]}
// //                     placeholder="Enter Referral Code (optional)"
// //                     placeholderTextColor="#999"
// //                     value={referCode}
// //                     onChangeText={(text) => {
// //                       setReferCode(text);
// //                       setReferEmptyError("");
// //                     }}
// //                     maxLength={4}
// //                   />
// //                   {referEmptyError ? (
// //                     <Text style={styles.errorText}>{referEmptyError}</Text>
// //                   ) : null}
// //                 </View>
// //               )}

// //               {/* Action Buttons */}
// //               <View style={styles.buttonContainer}>
// //                 {!otpSent ? (
// //                   <TouchableOpacity
// //                     style={[
// //                       styles.submitButton,
// //                       formData.loading && styles.disabledButton,
// //                     ]}
// //                     onPress={() => {
// //                       Keyboard.dismiss();
// //                       setTimeout(() => handleSendOtp(), 100);
// //                     }}
// //                     disabled={formData.loading}
// //                     activeOpacity={0.8}
// //                   >
// //                     {formData.loading ? (
// //                       <ActivityIndicator color="#fff" size="small" />
// //                     ) : (
// //                       <Text style={styles.submitText}>Send OTP</Text>
// //                     )}
// //                   </TouchableOpacity>
// //                 ) : (
// //                   <TouchableOpacity
// //                     style={[
// //                       styles.verifyButton,
// //                       formData.loading && styles.disabledButton,
// //                     ]}
// //                     onPress={handleVerifyOtp}
// //                     disabled={formData.loading}
// //                     activeOpacity={0.8}
// //                   >
// //                     {formData.loading ? (
// //                       <ActivityIndicator color="#fff" size="small" />
// //                     ) : (
// //                       <Text style={styles.submitText}>Verify OTP</Text>
// //                     )}
// //                   </TouchableOpacity>
// //                 )}
// //               </View>

// //               {/* Email Login Button */}
// //               <TouchableOpacity
// //                 style={styles.emailbtn}
// //                 onPress={() => navigation.navigate("LoginWithPassword")}
// //               >
// //                 <MaterialCommunityIcons
// //                   name="email"
// //                   size={28}
// //                   color="#3d2a71"
// //                 />
// //               </TouchableOpacity>

// //               {/* Login Link */}
// //               <View style={styles.linkContainer}>
// //                 <Text style={styles.linkText}>Already Registered? </Text>
// //                 <TouchableOpacity
// //                   onPress={() => {
// //                     navigation.navigate("Login");
// //                     resetForm();
// //                   }}
// //                 >
// //                   <Text style={styles.linkButtonText}>Login</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           </View>
// //         </ScrollView>
// //       </KeyboardAvoidingView>
// //     </TouchableWithoutFeedback>
// //   );
// // };

// // export default Register;

// // const styles = StyleSheet.create({
// //   headerSection: {
// //     backgroundColor: "#fff",
// //   },
// //   orangeImage: {
// //     height: 150,
// //     width: 150,
// //     marginBottom: -45,
// //   },
// //   logoContainer: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 80,
// //   },
// //   oxyricelogo: {
// //     width: 200,
// //     height: 70,
// //     resizeMode: "contain",
// //   },
// //   oxylogoView: {
// //     marginLeft: width * 0.08,
// //   },
// //   greenImage: {
// //     height: 110,
// //     width: 65,
// //   },
// //   greenImageView: {
// //     alignItems: "flex-end",
// //   },
// //   logingreenView: {
// //     flex: 1,
// //     backgroundColor: "#3d2a71",
// //     borderTopLeftRadius: 40,
// //     borderTopRightRadius: 40,
// //     marginTop: -height / 25,
// //     paddingTop: 35,
// //     paddingHorizontal: 25,
// //     paddingBottom: 30,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: -4 },
// //     shadowOpacity: 0.15,
// //     shadowRadius: 12,
// //     elevation: 10,
// //   },
// //   loginTxt: {
// //     fontSize: 32,
// //     fontWeight: "800",
// //     color: "#fff",
// //     marginBottom: 20,
// //     letterSpacing: 0.5,
// //     textAlign: "center",
// //   },
// //   authMethodContainer: {
// //     flexDirection: "row",
// //     gap: 12,
// //     marginBottom: 25,
// //     justifyContent: "center",
// //   },
// //   authMethodButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingVertical: 14,
// //     paddingHorizontal: 20,
// //     borderRadius: 16,
// //     backgroundColor: "rgba(255, 255, 255, 0.15)",
// //     width: width * 0.4,
// //     gap: 8,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   activeAuthMethod: {
// //     backgroundColor: "#f9b91a",
// //     shadowColor: "#f9b91a",
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.4,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   authMethodText: {
// //     fontSize: 15,
// //     fontWeight: "700",
// //     color: "rgba(255, 255, 255, 0.9)",
// //   },
// //   activeAuthMethodText: {
// //     color: "#3d2a71",
// //   },
// //   inputContainer: {
// //     marginBottom: 15,
// //   },
// //   input: {
// //     backgroundColor: "#fff",
// //     borderRadius: 12,
// //     paddingHorizontal: 15,
// //     fontSize: 16,
// //     width: width / 1.15,
// //     alignSelf: "center",
// //     height: 50,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   disabledInput: {
// //     backgroundColor: "#e8e8e8",
// //     color: "#888",
// //   },
// //   phoneInputContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   phonestyle: {
// //     width: "100%",
// //     height: 50,
// //     fontSize: 16,
// //     color: "#000",
// //   },
// //   phonestyle1: {
// //     height: 50,
// //     fontSize: 16,
// //     color: "#000",
// //     marginTop: 25,
// //   },
// //   input1: {
// //     width: width / 1.15,
// //     alignSelf: "center",
// //     height: 50,
// //     backgroundColor: "white",
// //     borderRadius: 12,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   buttonContainer: {
// //     marginVertical: 20,
// //   },
// //   submitButton: {
// //     backgroundColor: "#f9b91a",
// //     borderRadius: 12,
// //     paddingVertical: 16,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     width: width / 1.15,
// //     alignSelf: "center",
// //     shadowColor: "#f9b91a",
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 6,
// //     minHeight: 54,
// //   },
// //   verifyButton: {
// //     backgroundColor: "#f9b91a",
// //     borderRadius: 12,
// //     paddingVertical: 16,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     width: width / 1.15,
// //     alignSelf: "center",
// //     shadowColor: "#f9b91a",
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 6,
// //     minHeight: 54,
// //   },
// //   disabledButton: {
// //     opacity: 0.7,
// //   },
// //   submitText: {
// //     color: "#fff",
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     letterSpacing: 0.5,
// //   },
// //   resendButton: {
// //     alignItems: "flex-end",
// //     marginRight: 30,
// //     marginTop: 10,
// //     marginBottom: 10,
// //   },
// //   resendText: {
// //     color: "#f9b91a",
// //     fontSize: 15,
// //     fontWeight: "600",
// //     textDecorationLine: "underline",
// //   },
// //   linkContainer: {
// //     flexDirection: "row",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginTop: 15,
// //   },
// //   linkText: {
// //     color: "rgba(255, 255, 255, 0.9)",
// //     fontSize: 14,
// //   },
// //   linkButtonText: {
// //     color: "#f9b91a",
// //     fontSize: 14,
// //     fontWeight: "bold",
// //   },
// //   emailbtn: {
// //     backgroundColor: "white",
// //     padding: 8,
// //     width: 44,
// //     height: 44,
// //     alignSelf: "center",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     borderRadius: 22,
// //     marginTop: 15,
// //     marginBottom: 10,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.15,
// //     shadowRadius: 4,
// //     elevation: 4,
// //   },
// //   errorText: {
// //     color: "#ff6b6b",
// //     alignSelf: "center",
// //     marginBottom: 10,
// //     fontSize: 13,
// //     textAlign: "center",
// //     paddingHorizontal: 20,
// //   },
// //   successText: {
// //     color: "#4ade80",
// //     alignSelf: "center",
// //     marginBottom: 10,
// //     fontSize: 14,
// //     fontWeight: "600",
// //     textAlign: "center",
// //   },
// // });




import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  Keyboard,
  Platform,
  Dimensions,
  BackHandler,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { TextInput } from "react-native-paper";
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
import BASE_URL from "../../Config";
import GoogleAnalyticsService from "../Components/GoogleAnalytic";

const { height, width } = Dimensions.get("window");

const Register = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    mobileNumber_error: false,
    validMobileNumber_error: false,
    loading: false,
  });

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [authMethod, setAuthMethod] = useState("whatsapp");

  // Get dynamic OTP length based on auth method
  const getOtpLength = useCallback(() => {
    return authMethod === "whatsapp" ? 4 : 6;
  }, [authMethod]);

  const otpLength = getOtpLength();

  // Initialize OTP state with dynamic length
  const [otp, setOtp] = useState(() => Array(otpLength).fill(""));
  const otpStateRef = useRef(Array(otpLength).fill(""));

  // Update OTP array when auth method changes
  useEffect(() => {
    const newLength = getOtpLength();
    const newOtp = Array(newLength).fill("");
    setOtp(newOtp);
    otpStateRef.current = newOtp;
  }, [authMethod, getOtpLength]);

  // Auto-focus first OTP box for SMS after OTP is sent
  useEffect(() => {
    if (otpSent && authMethod === "sms") {
      setTimeout(() => {
        otpRefs[0]?.current?.focus();
      }, 400);
    }
  }, [otpSent, authMethod]);

  // OTP refs (dynamically sized)
  const otpRefs = useMemo(() => {
    return Array.from({ length: otpLength }, () => React.createRef());
  }, [otpLength]);

  const [validOtpError, setValidOtpError] = useState(false);
  const isAutoFilling = useRef(false);

  // Handle OTP change with autofill support
  const handleOtpChange = (value, index) => {
    if (isAutoFilling.current) return;

    const currentLength = getOtpLength();

    // Handle autofill (paste or SMS autofill)
    if (value.length > 1) {
      isAutoFilling.current = true;

      const digits = value.replace(/\D/g, "").slice(0, currentLength);
      const newOtp = Array(currentLength).fill("");

      digits.split("").forEach((d, i) => {
        if (i < currentLength) newOtp[i] = d;
      });

      otpStateRef.current = newOtp;
      setOtp(newOtp);
      setOtpError(false);
      setValidOtpError(false);

      requestAnimationFrame(() => {
        otpRefs[currentLength - 1]?.current?.blur();
        Keyboard.dismiss();
        isAutoFilling.current = false;
      });
      return;
    }

    // Handle single digit input
    const digit = value.replace(/\D/g, "");
    if (!digit) return;

    const newOtp = [...otpStateRef.current];
    newOtp[index] = digit;

    otpStateRef.current = newOtp;
    setOtp(newOtp);
    setOtpError(false);
    setValidOtpError(false);

    // Move to next input
    if (index < currentLength - 1) {
      requestAnimationFrame(() => {
        otpRefs[index + 1]?.current?.focus();
      });
    } else {
      Keyboard.dismiss();
    }
  };

  // Handle backspace
  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key !== "Backspace") return;

    const currentOtp = [...otpStateRef.current];

    if (currentOtp[index]) {
      currentOtp[index] = "";
    } else if (index > 0) {
      currentOtp[index - 1] = "";
      requestAnimationFrame(() => {
        otpRefs[index - 1]?.current?.focus();
      });
    }

    otpStateRef.current = currentOtp;
    setOtp(currentOtp);
  };

  // Sync ref with state
  useEffect(() => {
    otpStateRef.current = otp;
  }, [otp]);

  const resetOtpInputs = () => {
    const newLength = getOtpLength();
    const emptyOtp = Array(newLength).fill("");
    setOtp(emptyOtp);
    otpStateRef.current = emptyOtp;
    setOtpError(false);
    setValidOtpError(false);
  };

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Animate logo on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const phoneInput = useRef();

  const [mobileOtpSession, setMobileOtpSession] = useState();
  const [saltSession, setSaltSession] = useState("");
  const [otpGeneratedTime, setOtpGeneratedTime] = useState("");
  const [message, setMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappNumber_Error, setWhatsappNumber_Error] = useState(false);
  const [phoneNumber_Error, setPhoneNumber_Error] = useState(false);
  const [validError, setValidError] = useState(false);
  const [countryCode, setcountryCode] = useState("91");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [error1, setError1] = useState(null);
  const [otpMessage, setOtpMessage] = useState(false);
  const [referCode, setReferCode] = useState(null);
  const [referEmptyError, setReferEmptyError] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardOpen(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardOpen(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const checkLoginData = async () => {
        try {
          const loginData = await AsyncStorage.getItem("userData");
          const storedmobilenumber = await AsyncStorage.getItem("mobileNumber");

          if (storedmobilenumber) {
            setFormData((prev) => ({
              ...prev,
              mobileNumber: storedmobilenumber,
            }));
          }

          if (loginData) {
            const user = JSON.parse(loginData);
          }
        } catch (error) {
          console.error("Error fetching login data", error);
        }
      };

      checkLoginData();
    }, [])
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

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => backHandler.remove();
    }, [currentScreen])
  );

  const handleSendOtp = async () => {
    console.log("Sending OTP", authMethod, countryCode, whatsappNumber);
    
    if (authMethod === "whatsapp") {
      if (whatsappNumber == "" || whatsappNumber == null) {
        setWhatsappNumber_Error(true);
        return false;
      }
      if (!phoneInput.current?.isValidNumber(whatsappNumber)) {
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
            userType: "Register",
            registrationType: "whatsapp",
            referrerIdForMobile: referCode,
          }
        : {
            countryCode: "+91",
            mobileNumber: phoneNumber,
            userType: "Register",
            registrationType: "sms",
            referrerIdForMobile: referCode,
          };
    
    console.log({ data });
    setFormData({ ...formData, loading: true });
    
    axios({
      method: "post",
      url: BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
      data: data,
    })
      .then((response) => {
        console.log("response", response.data);

        if (response.data.mobileOtpSession) {
          setMessage(true);
          setMobileOtpSession(response.data.mobileOtpSession);
          setSaltSession(response.data.salt);
          setOtpGeneratedTime(response.data.otpGeneratedTime);
          setOtpMessage(true);
          setOtpSent(true);
          setFormData({ ...formData, loading: false });

          // Reset OTP inputs and focus first box for SMS
          resetOtpInputs();
          setTimeout(() => {
            if (authMethod === "sms") {
              otpRefs[0]?.current?.focus();
            }
          }, 300);
        } else {
          setFormData({ ...formData, loading: false });
          Alert.alert("Failed", "Failed to send OTP. Try again");
        }
      })
      .catch((error) => {
        console.log("error", error.response);
        setOtpSent(false);
        setFormData({ ...formData, loading: false });

        Alert.alert("Sorry", error.response.data.error, [
          {
            text: "ok",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      });
  };

  const handleVerifyOtp = () => {
    console.log("Verifying OTP");

    if (!otpSent) return;

    const otpString = otpStateRef.current.join("");
    const expectedLength = getOtpLength();

    if (otpString.length !== expectedLength) {
      setValidOtpError(true);
      return;
    }

    // Validate referral code
    if (referCode) {
      if (referCode.length > 4) {
        setReferEmptyError("Referral code must be 4 characters or less");
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
        whatsappOtpValue: otpString,
        userType: "Register",
        salt: saltSession,
        expiryTime: otpGeneratedTime,
        registrationType: "whatsapp",
        primaryType: "CUSTOMER",
        registerdFrom: Platform.OS,
        referrerIdForMobile: referCode,
      };
    } else {
      data = {
        countryCode: "+91",
        mobileNumber: phoneNumber,
        mobileOtpSession: mobileOtpSession,
        mobileOtpValue: otpString,
        userType: "Register",
        salt: saltSession,
        expiryTime: otpGeneratedTime,
        registrationType: "mobile",
        primaryType: "CUSTOMER",
        registerdFrom: Platform.OS,
        referrerIdForMobile: referCode,
      };
    }

    axios({
      method: "post",
      url: BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
      data: data,
    })
      .then(async (response) => {
        console.log("response", response.data.userStatus);

        if (response.data.primaryType == "CUSTOMER") {
          setFormData({
            ...formData,
            loading: false,
          });
          setOtpError(false);
          setValidOtpError(false);

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
              GoogleAnalyticsService.signup(
                authMethod == "whatsapp" ? "whatsapp" : "SMS"
              );
              navigation.reset({
                index: 0,
                routes: [{ name: "Home", params: { screen: "Dashboard" } }],
              });
            } else {
              Alert.alert(
                "Deactivated",
                "Your account is deactivated, Are you want to reactivate your account to continue?",
                [
                  {
                    text: "Yes",
                    onPress: () => navigation.navigate("Active"),
                  },
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
            `You have logged in as ${response.data.primaryType}, Please login as Customer`
          );
        }
      })
      .catch((error) => {
        setFormData({ ...formData, loading: false });

        console.log(error.response);
        if (error.response?.status == 409) {
          Alert.alert("Failed", error.response.data.error);
        }
        if (error.response?.status == 400) {
          Alert.alert("Failed", "Invalid OTP");
          setValidOtpError(true);
        }
      });
  };

  const handlePhoneNumberChange = (value) => {
    setValidError(false);
    setWhatsappNumber_Error(false);
    setError1(false);

    try {
      setWhatsappNumber(value);
      console.log({ value });
      const callingCode = phoneInput.current?.getCallingCode();
      console.log(callingCode);
      if (callingCode) {
        setcountryCode(callingCode);
      }

      const isValid = /^[0-9]*$/.test(value);
      if (isValid) {
        setErrorMessage("");
        setWhatsappNumber(value);
      } else {
        setErrorMessage(true);
        return;
      }
    } catch (error) {
      console.error("Error handling phone number change:", error);
    }
  };

  // Reset all fields when switching auth method
  const resetForm = useCallback(() => {
    setOtpSent(false);
    setWhatsappNumber("");
    setPhoneNumber("");
    setPhoneNumber_Error(false);
    setWhatsappNumber_Error(false);
    setOtpMessage(false);
    setOtpError(false);
    setValidOtpError(false);
    setError1(null);
    setValidError(false);
    setReferCode(null);
    setReferEmptyError("");
    resetOtpInputs();
    setFormData((prev) => ({ ...prev, loading: false }));
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ backgroundColor: "#fff", flex: 1 }}>
            {/* Top Images */}
            <View style={styles.headerSection}>
              <View>
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

            {/* Register Section */}
            <View style={styles.logingreenView}>
              <Text style={styles.loginTxt}>Register</Text>

              <View style={styles.authMethodContainer}>
                <TouchableOpacity
                  style={[
                    styles.authMethodButton,
                    authMethod === "whatsapp" && styles.activeAuthMethod,
                  ]}
                  onPress={() => {
                    setAuthMethod("whatsapp");
                    resetForm();
                  }}
                >
                  <Ionicons
                    name="logo-whatsapp"
                    size={20}
                    color={authMethod === "whatsapp" ? "#3d2a71" : "#fff"}
                  />
                  <Text
                    style={[
                      styles.authMethodText,
                      authMethod === "whatsapp" && styles.activeAuthMethodText,
                    ]}
                  >
                    WhatsApp
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.authMethodButton,
                    authMethod === "sms" && styles.activeAuthMethod,
                  ]}
                  onPress={() => {
                    setAuthMethod("sms");
                    resetForm();
                  }}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={20}
                    color={authMethod === "sms" ? "#3d2a71" : "#fff"}
                  />
                  <Text
                    style={[
                      styles.authMethodText,
                      authMethod === "sms" && styles.activeAuthMethodText,
                    ]}
                  >
                    SMS
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputContainer}>
                {authMethod === "whatsapp" ? (
                  <View style={styles.phoneInputContainer}>
                    <PhoneInput
                      placeholder="Whatsapp Number"
                      placeholderTextColor="#999"
                      ref={phoneInput}
                      containerStyle={[
                        styles.input1,
                        { backgroundColor: "#fff" },
                      ]}
                      textInputStyle={[
                        styles.phonestyle,
                        { backgroundColor: "#fff", color: "#000" },
                      ]}
                      codeTextStyle={[styles.phonestyle1, { color: "#000" }]}
                      defaultValue={whatsappNumber}
                      defaultCode="IN"
                      layout="first"
                      onChangeText={handlePhoneNumberChange}
                      disabled={otpSent}
                    />
                  </View>
                ) : (
                  <TextInput
                    style={[
                      styles.input,
                      otpSent && styles.disabledInput,
                      { backgroundColor: "#fff", color: "#000" },
                    ]}
                    placeholder="Enter your phone number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text.replace(/[ \-.,]/g, ""));
                      setPhoneNumber_Error(false);
                      setValidError(false);
                    }}
                    editable={!otpSent}
                    maxLength={10}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                  />
                )}
              </View>

              {whatsappNumber_Error && (
                <Text style={styles.errorText}>
                  Please enter the whatsapp number
                </Text>
              )}

              {phoneNumber_Error && (
                <Text style={styles.errorText}>
                  Please enter the Mobile number
                </Text>
              )}
              
              {validError && (
                <Text style={styles.errorText}>Invalid Mobile Number</Text>
              )}
              
              {error1 && <Text style={styles.errorText}>{error1}</Text>}
              
              {otpMessage && (
                <Text style={styles.successText}>
                  OTP SENT TO {authMethod.toUpperCase()}
                </Text>
              )}

              {errorMessage && (
                <Text style={styles.errorText}>
                  Please enter numbers only. Special characters are not allowed.
                </Text>
              )}

              {/* OTP Boxes (shown only after OTP is sent) */}
              {otpSent && (
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={otpRefs[index]}
                      style={styles.otpBox}
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={(e) => handleOtpKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={index === 0 ? otpLength : 1}
                      textAlign="center"
                      textContentType={index === 0 ? "oneTimeCode" : "none"}
                      autoComplete={index === 0 ? "sms-otp" : "off"}
                      importantForAutofill={index === 0 ? "yes" : "no"}
                      selectTextOnFocus
                      blurOnSubmit={false}
                      returnKeyType="done"
                      editable={true}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                    />
                  ))}
                </View>
              )}

              {otpError && (
                <Text style={styles.errorText}>Please enter complete OTP</Text>
              )}
              
              {validOtpError && (
                <Text style={styles.errorText}>Invalid OTP</Text>
              )}

              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  resetOtpInputs();
                  handleSendOtp();
                }}
                disabled={loading}
              >
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>

              {/* Referral Code Input */}
              {otpSent && (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, { backgroundColor: "#fff" }]}
                    placeholder="Enter Referral Code (optional)"
                    placeholderTextColor="#999"
                    value={referCode}
                    onChangeText={(text) => {
                      setReferCode(text);
                      setReferEmptyError("");
                    }}
                    maxLength={4}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                  />
                  {referEmptyError ? (
                    <Text style={styles.errorText}>{referEmptyError}</Text>
                  ) : null}
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                {!otpSent ? (
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      formData.loading && styles.disabledButton,
                    ]}
                    onPress={() => {
                      Keyboard.dismiss();
                      setTimeout(() => handleSendOtp(), 100);
                    }}
                    disabled={formData.loading}
                    activeOpacity={0.8}
                  >
                    {formData.loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.submitText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.verifyButton,
                      formData.loading && styles.disabledButton,
                    ]}
                    onPress={handleVerifyOtp}
                    disabled={formData.loading}
                    activeOpacity={0.8}
                  >
                    {formData.loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.submitText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>

              {/* Email Login Button */}
              <TouchableOpacity
                style={styles.emailbtn}
                onPress={() => navigation.navigate("LoginWithPassword")}
              >
                <MaterialCommunityIcons
                  name="email"
                  size={28}
                  color="#3d2a71"
                />
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Already Registered? </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Login");
                    resetForm();
                  }}
                >
                  <Text style={styles.linkButtonText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: "#fff",
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
  oxyricelogo: {
    width: 200,
    height: 70,
    resizeMode: "contain",
  },
  oxylogoView: {
    marginLeft: width * 0.08,
  },
  greenImage: {
    height: 110,
    width: 65,
  },
  greenImageView: {
    alignItems: "flex-end",
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
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  loginTxt: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 20,
    letterSpacing: 0.5,
    textAlign: "center",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeAuthMethod: {
    backgroundColor: "#f9b91a",
    shadowColor: "#f9b91a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  authMethodText: {
    fontSize: 15,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.9)",
  },
  activeAuthMethodText: {
    color: "#3d2a71",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    width: width / 1.15,
    alignSelf: "center",
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  phonestyle: {
    width: "100%",
    height: 50,
    fontSize: 16,
    color: "#000",
  },
  phonestyle1: {
    height: 50,
    fontSize: 16,
    color: "#000",
    marginTop: 25,
  },
  input1: {
    width: width / 1.15,
    alignSelf: "center",
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  submitButton: {
    backgroundColor: "#f9b91a",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    width: width / 1.15,
    alignSelf: "center",
    shadowColor: "#f9b91a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 54,
  },
  verifyButton: {
    backgroundColor: "#f9b91a",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    width: width / 1.15,
    alignSelf: "center",
    shadowColor: "#f9b91a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 54,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  resendButton: {
    alignItems: "flex-end",
    marginRight: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  resendText: {
    color: "#f9b91a",
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  linkText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  linkButtonText: {
    color: "#f9b91a",
    fontSize: 14,
    fontWeight: "bold",
  },
  emailbtn: {
    backgroundColor: "white",
    padding: 8,
    width: 44,
    height: 44,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    marginTop: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  otpBox: {
    width: 48,
    height: 58,
    borderWidth: 2,
    borderColor: "#f9b91a",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#fff",
    color: "#3d2a71",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    color: "#ff6b6b",
    alignSelf: "center",
    marginBottom: 10,
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  successText: {
    color: "#4ade80",
    alignSelf: "center",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});