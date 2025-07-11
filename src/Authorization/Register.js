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
  Keyboard,
  Platform,
  Dimensions,
  BackHandler,
  useColorScheme,
} from "react-native";
import axios from "axios";
import { TextInput } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
// import { Ionicons } from '@expo/vector-icons';
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
import { Checkbox } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import GoogleAnalyticsService from "../Components/GoogleAnalytic";

const Register = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    mobileNumber_error: false,
    validMobileNumber_error: false,
    otp: "",
    otp_error: false,
    validOtpError: false,
    loading: false,
  });

  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const isLightMode = theme === "light";

  console.log({ BASE_URL });
  const phoneInput = React.createRef();

  const [showOtp, setShowOtp] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [mobileOtpSession, setMobileOtpSession] = useState();
  const [saltSession, setSaltSession] = useState("");
  const [otpGeneratedTime, setOtpGeneratedTime] = useState("");
  const [message, setMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [authMethod, setAuthMethod] = useState("whatsapp"); // 'whatsapp' or 'sms'
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappNumber_Error, setWhatsappNumber_Error] = useState(false);
  const [phoneNumber_Error, setPhoneNumber_Error] = useState(false);
  const [errorNumberInput, seterrorNumberInput] = useState(false);
  const [validError, setValidError] = useState(false);
  const [countryCode, setcountryCode] = useState("91");
  const [otpSent, setOtpSent] = useState(false);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [error1, setError1] = useState(null);
  const [otpMessage, setOtpMessage] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [referCode, setReferCode] = useState(null);
  const [referEmptyError, setReferEmptyError] = useState(false);
  const [consentNotification, setConsentNotification] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  const isButtonEnabled = consentNotification && consentTerms;

  // Handle OTP verification
  // const handleVerifyOTP = () => {
  //   // if (!formData.otp) {
  //   //   alert("Please enter the OTP");
  //   //   return;
  //   // }

  //   setLoading(true);

  //   setTimeout(() => {
  //     setLoading(false);
  //     // alert("Login successful!");
  //   }, 1500);
  // };

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardOpen(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
        if (!otpSent) {
          handleSendOtp();
        } else {
          if (formData.otp.length !== 0) {
            handleVerifyOtp();
          }
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [authMethod, phoneNumber, whatsappNumber, otpSent]);

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

  const getVersion = async () => {
    try {
      const response = await axios.get(
        BASE_URL + "erice-service/user/getAllVersions",
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
          params: {
            userType: "CUSTOMER",
            versionType: "ANDROID",
          },
        }
      );
      console.log("Version response:", response.data);
    } catch (error) {
      console.error("Error fetching version:", error);
    }
  };

  const handleSendOtp = async () => {
    console.log("sdmbv", authMethod, countryCode, whatsappNumber);
    if (authMethod === "whatsapp") {
      if (whatsappNumber == "" || whatsappNumber == null) {
        // console.log("djtcg")
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
        } else {
          Alert, alert("Failed", "Failed to send OTP.Try again");
        }
        setFormData({
          ...formData,
          loading: false,
        });
      })
      .catch((error) => {
        console.log("error", error.response);
        setOtpSent(false);

        Alert.alert("Sorry", error.response.data.message, [
          {
            text: "ok",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
        setFormData({
          ...formData,
          loading: false,
        });

        // if (error.response.status == 400) {
        //   navigation.navigate(userStage == "test1" ? "Register1" : "Register");
        // }
      });
  };

  const handleVerifyOtp = () => {
    if (formData.otp == "" || formData.otp == null) {
      setFormData({ ...formData, otp_error: true });
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

    if (referCode != null) {
      if (referCode.length > 4) {
        setReferEmptyError(true);
        return false;
      }
    }

    //  setLoading(true);
    setFormData({ ...formData, loading: true });
    let data;
    if (authMethod == "whatsapp") {
      data = {
        countryCode: "+" + countryCode,
        whatsappNumber: whatsappNumber,
        whatsappOtpSession: mobileOtpSession,
        whatsappOtpValue: formData.otp,
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
        mobileOtpValue: formData.otp,
        userType: "Register",
        salt: saltSession,
        expiryTime: otpGeneratedTime,
        registrationType: "mobile",
        primaryType: "CUSTOMER",
        registerdFrom: Platform.OS,
        referrerIdForMobile: referCode,
      };
    }
    console.log({ data });
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
            otp: "",
            otp_error: false,
            validOtpError: false,
          });
          if (response.data.accessToken != null) {
            setOtpSent(false);
            dispatch(AccessToken(response.data));
            await AsyncStorage.setItem(
              "userData",
              JSON.stringify(response.data)
            );
            // await AsyncStorage.setItem("mobileNumber", formData.mobileNumber);
            // setFormData({ ...formData, otp: "" });

            if (
              response.data.userStatus == "ACTIVE" ||
              response.data.userStatus == null
            ) {
              GoogleAnalyticsService.signup(
                authMethod == "whatsapp" ? "whatsapp" : "SMS"
              );
              navigation.navigate("Home");
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

        console.log(error.response);
        if (error.response.status == 409) {
          Alert.alert("Failed", error.response.data.message);
        }
        if (error.response.status == 400) {
          Alert.alert("Failed", "Invalid Credentials");
        }
      });
  };

  const handlePhoneNumberChange = (value) => {
    // console.log({value})
    setValidError(false);
    seterrorNumberInput(false);
    setWhatsappNumber_Error(false);
    setError1(false);

    try {
      setWhatsappNumber(value);

      console.log({ value });
      const callingCode = phoneInput.getCallingCode(value);
      console.log(callingCode);
      setcountryCode(callingCode);

      const isValid = /^[0-9]*$/.test(value);
      if (isValid) {
        setErrorMessage("");
        setWhatsappNumber(value);
      } else {
        setErrorMessage(true);
        return;
      }
      // console.log(countryCode)
    } catch (error) {}
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior="padding"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="always"
      >
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
            <Text style={styles.loginTxt}>Register</Text>

            <View style={styles.authMethodContainer}>
              <TouchableOpacity
                style={[
                  styles.authMethodButton,
                  authMethod === "whatsapp" && styles.activeAuthMethod,
                ]}
                onPress={() => {
                  setAuthMethod("whatsapp"),
                    setOtpSent(false),
                    setWhatsappNumber(""),
                    setWhatsappNumber_Error(false),
                    setError1("");
                  setPhoneNumber(""),
                    setPhoneNumber_Error(false),
                    setOtpMessage(false);
                  setFormData({ ...formData, loading: false, otp: "" });
                }}
                // disabled={otpSent}
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
                  setAuthMethod("sms"),
                    setOtpSent(false),
                    setWhatsappNumber(""),
                    setWhatsappNumber_Error(false),
                    setError1("");
                  setPhoneNumber_Error(false),
                    setPhoneNumber(""),
                    setOtpMessage(false);
                  setFormData({ ...formData, loading: false, otp: "" });
                }}
                // disabled={otpSent}
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
            {/* {(authMethod === 'whatsapp'&& otpSent)&&(
                            <Text style={{textAlign:"center",color:"#fff"}}>OTP send to your whatsapp number</Text>
                          )} */}
            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              {/* <Text style={styles.inputLabel}>Phone Number</Text> */}
              {authMethod === "whatsapp" ? (
                <View style={styles.phoneInputContainer}>
                  <PhoneInput
                    placeholder="Whatsapp Number"
                    placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
                    ref={phoneInput}
                    containerStyle={[
                      styles.input1,
                      { backgroundColor: isDarkMode ? "#fff" : "#fff" },
                    ]}
                    textInputStyle={[
                      styles.phonestyle,
                      {
                        backgroundColor: isDarkMode ? "#fff" : "#fff",
                        color: isDarkMode ? "#000" : "#000",
                      },
                    ]}
                    codeTextStyle={[
                      styles.phonestyle1,
                      { color: isDarkMode ? "#000" : "#fff" },
                    ]}
                    // ref={(ref) => (phoneInput = ref)}
                    defaultValue={whatsappNumber}
                    defaultCode="IN"
                    layout="first"
                    onChangeText={handlePhoneNumberChange}
                  />
                </View>
              ) : (
                <>
                  {/* {(authMethod === 'sms'&& otpSent)&&(
                                  <Text style={{textAlign:"center",color:"#fff"}}>OTP send to your Mobile number</Text>
                                )} */}
                  <TextInput
                    style={[
                      styles.input,
                      otpSent && styles.disabledInput,
                      {
                        backgroundColor: isDarkMode ? "#333" : "#fff",
                        color: isDarkMode ? "#fff" : "#000",
                      },
                    ]}
                    placeholder="Enter your phone number"
                    placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text.replace(/[ \-.,]/g, "")),
                        setPhoneNumber_Error(false),
                        setValidError(false);
                    }}
                    editable={!otpSent}
                    maxLength={10}
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
                {/* <Text style={styles.inputLabel}>Enter OTP</Text> */}
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDarkMode ? "#333" : "#fff",
                      color: isDarkMode ? "#fff" : "#000",
                    },
                  ]}
                  placeholder="Enter OTP code"
                  placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
                  keyboardType="number-pad"
                  autoFocus={true}
                  value={formData.otp}
                  onSubmitEditing={() => handleVerifyOtp()}
                  onChangeText={(numeric) => {
                    setFormData({
                      ...formData,
                      otp: numeric,
                      validOtpError: false,
                      otp_error: false,
                    }),
                      setOtpError(false),
                      setOtpMessage(false);
                  }}
                  maxLength={authMethod === "whatsapp" ? 4 : 6}
                />
              </View>
            )}

            {formData.otp_error && (
              <Text style={{ color: "red", alignSelf: "center", width: 100 }}>
                Please enter OTP
              </Text>
            )}
            {formData.validOtpError && (
              <Text style={{ color: "red", alignSelf: "center", width: 100 }}>
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

            <View style={styles.checkboxContainer}></View>
            <View>
              {otpSent && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Referred Code(optional)"
                    value={referCode}
                    onChangeText={(text) => {
                      setReferCode(text);
                      setReferEmptyError("");
                    }}
                  />
                  {referEmptyError ? (
                    <Text style={styles.error}>{referEmptyError}</Text>
                  ) : null}
                </>
              )}
            </View>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={consentNotification ? "checked" : "unchecked"}
                onPress={() => setConsentNotification(!consentNotification)}
                color="#f9b91a"
                uncheckedColor="#ffffff"
              />
              <Text style={styles.checkboxLabel}>
                I want to receive notifications on SMS, RCS & Email from
                ASKOXY.AI
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={consentTerms ? "checked" : "unchecked"}
                onPress={() => setConsentTerms(!consentTerms)}
                color="#f9b91a"
                uncheckedColor="#ffffff"
              />
              <Text style={styles.checkboxLabel}>
                I agree to all the Terms of Services and Privacy Policy.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {!otpSent ? (
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!consentNotification || !consentTerms) &&
                      styles.disabledButton,
                  ]}
                  onPress={() => handleSendOtp()}
                  disabled={loading || !consentNotification || !consentTerms}
                  activeOpacity={0.6}
                >
                  {formData.loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitText}>Send OTP</Text>
                  )}
                </TouchableOpacity>
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
              style={{
                backgroundColor: "white",
                padding: 5,
                width: 40,
                height: 40,
                alignSelf: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("LoginWithPassword")}
            >
              <MaterialCommunityIcons name="email" size={30} />
            </TouchableOpacity>
            {/* Register Link */}
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>Already Registered ? </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Login"),
                    setOtpSent(false),
                    setWhatsappNumber(""),
                    setPhoneNumber_Error(""),
                    setFormData({ ...formData, loading: false, otp: "" });
                }}
              >
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
    marginBottom: -55,
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
    flex: 3,
    backgroundColor: "#3d2a71",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -height / 11,
  },
  loginTxt: {
    color: "white",
    fontWeight: "500",
    fontSize: 25,
    margin: 20,
    alignSelf: "center",
  },
  authMethodContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-evenly",
  },
  authMethodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    width: width * 0.4,
  },
  activeAuthMethod: {
    backgroundColor: "#fff",
  },
  authMethodText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#fff",
  },
  activeAuthMethodText: {
    color: "#3d2a71",
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
    padding: 20,
    color: "#fff",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#FFF",
    marginLeft: 10,
  },
  verifyButton: {
    backgroundColor: "#f9b91a",
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: width * 0.85,
    alignSelf: "center",
  },

  checkboxLabel: {
    color: "#ffffff",
    marginLeft: 8,
  },
  label: {
    flex: 1,
    fontSize: 16,
    marginTop: 4,
    color: "#fff",
  },
  disabledButton: {
    backgroundColor: "rgba(249, 185, 26, 0.6)",
  },
});
