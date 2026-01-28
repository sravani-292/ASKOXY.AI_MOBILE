import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
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
    loading: false,
  });

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [authMethod, setAuthMethod] = useState("sms");

  const getOtpLength = useCallback(() => {
    return authMethod === "whatsapp" ? 4 : 6;
  }, [authMethod]);

  const otpLength = getOtpLength();

  const [otp, setOtp] = useState(() => Array(otpLength).fill(""));
  const otpStateRef = useRef(Array(otpLength).fill(""));

  useEffect(() => {
    const newLength = getOtpLength();
    const newOtp = Array(newLength).fill("");
    setOtp(newOtp);
    otpStateRef.current = newOtp;
  }, [authMethod, getOtpLength]);

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
  const [isTelugu, setIsTelugu] = useState(true);

  const isAutoFilling = useRef(false);
  const scrollViewRef = useRef(null);

  const handleOtpChange = (value, index) => {
    if (isAutoFilling.current) return;

    const currentLength = getOtpLength();

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

    const digit = value.replace(/\D/g, "");
    if (!digit) return;

    const newOtp = [...otpStateRef.current];
    newOtp[index] = digit;

    otpStateRef.current = newOtp;
    setOtp(newOtp);
    setOtpError(false);
    setValidOtpError(false);

    if (index < currentLength - 1) {
      requestAnimationFrame(() => {
        otpRefs[index + 1]?.current?.focus();
      });
    } else {
      Keyboard.dismiss();
    }
  };

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

  const theme = useColorScheme();
  const isDarkMode = theme === "dark";
  const isLightMode = theme === "light";

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const phoneInput = React.createRef();
  const [mobileOtpSession, setMobileOtpSession] = useState();
  const [saltSession, setSaltSession] = useState("");
  const [otpGeneratedTime, setOtpGeneratedTime] = useState("");
  const [message, setMessage] = useState(false);
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

          if (storedmobilenumber) {
            setFormData({ ...formData, mobileNumber: storedmobilenumber });
          }

          if (loginData) {
            const user = JSON.parse(loginData);
            if (user.accessToken) {
              dispatch(AccessToken(user));
              navigation.navigate("Home");
            }
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

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardOpen(true);
      }
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

  const handleSendOtp = async () => {
    console.log("into the send otp");

    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Reset OTP message at the start
    setOtpMessage(false);

    if (authMethod === "whatsapp") {
      if (!whatsappNumber) {
        setWhatsappNumber_Error(true);
        setError1("Please enter a phone number.");
        return false;
      }
      if (!phoneInput.current?.isValidNumber(whatsappNumber)) {
        setError1("Invalid phone number. Please check the format.");
        return false;
      }
    } else {
      if (!phoneNumber) {
        setPhoneNumber_Error(true);
        return false;
      }
      if (phoneNumber.length !== 10) {
        setValidError(true);
        return false;
      }
    }

    let data =
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

    setFormData((prev) => ({ ...prev, loading: true }));

    axios({
      method: "post",
      url: BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
      data: data,
    })
      .then((response) => {
        console.log("response", response);

        setFormData((prev) => ({ ...prev, loading: false }));

        if (response.data.mobileOtpSession) {
          setWhatsappNumber_Error(false);
          setPhoneNumber_Error(false);
          setValidError(false);
          setError1(null);
          setMessage(true);
          setMobileOtpSession(response.data.mobileOtpSession);
          setSaltSession(response.data.salt);
          setOtpGeneratedTime(response.data.otpGeneratedTime);
          setOtpMessage(true);
          setOtpSent(true);
        } else {
          Alert.alert("Failed", "Failed to send OTP. Try again");
          setOtpMessage(false);
        }
      })
      .catch((error) => {
        console.log("error", error.response?.status);

        setFormData((prev) => ({ ...prev, loading: false }));
        setOtpSent(false);
        setOtpMessage(false);

        Alert.alert("Sorry", "You are not registered. Please signup", [
          {
            text: "ok",
            onPress: () => navigation.navigate("RegisterScreen"),
          },
        ]);
      });
  };

  const handleVerifyOtp = () => {
    console.log("into the verify otp function");

    if (!otpSent) return;

    const otpString = otpStateRef.current.join("");
    const expectedLength = getOtpLength();
    console.log("into the otp block");

    if (otpString.length !== expectedLength) {
      setOtpError(true);
      return;
    }

    setFormData((prev) => ({ ...prev, loading: true }));

    const data =
      authMethod === "whatsapp"
        ? {
            countryCode: "+" + countryCode,
            whatsappNumber: whatsappNumber,
            whatsappOtpSession: mobileOtpSession,
            whatsappOtpValue: otpString,
            userType: "Login",
            salt: saltSession,
            expiryTime: otpGeneratedTime,
            registrationType: "whatsapp",
            primaryType: "CUSTOMER",
          }
        : {
            countryCode: "+91",
            mobileNumber: phoneNumber,
            mobileOtpSession: mobileOtpSession,
            mobileOtpValue: otpString,
            userType: "Login",
            salt: saltSession,
            expiryTime: otpGeneratedTime,
            registrationType: "mobile",
            primaryType: "CUSTOMER",
          };
    console.log("data", data);

    axios
      .post(BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`, data)
      .then(async (response) => {
        console.log("verification response", response);

        setFormData((prev) => ({ ...prev, loading: false }));
        setOtpError(false);

        if (
          response.data.primaryType === "CUSTOMER" &&
          response.data.accessToken
        ) {
          setOtpSent(false);
          dispatch(AccessToken(response.data));
          await AsyncStorage.setItem("userData", JSON.stringify(response.data));

          if (
            response.data.userStatus === "ACTIVE" ||
            !response.data.userStatus
          ) {
            GoogleAnalyticsService.login(
              authMethod === "whatsapp" ? "WhatsApp" : "SMS"
            );
            navigation.reset({
              index: 0,
              routes: [{ name: "Home", params: { screen: "Dashboard" } }],
            });
          } else {
            Alert.alert("Deactivated", "Your account is deactivated...", [
              { text: "Yes", onPress: () => navigation.navigate("Active") },
              { text: "No", onPress: () => BackHandler.exitApp() },
            ]);
          }
        } else {
          Alert.alert("Error", "Invalid credentials.");
        }
      })
      .catch((error) => {
        console.log("verification error", error);

        setFormData((prev) => ({ ...prev, loading: false }));
        if (error.response?.status === 400) {
          Alert.alert("Failed", "Invalid OTP");
          setValidOtpError(true);
        } else {
          Alert.alert("Error", "Verification failed");
        }
      });
  };

  const handlePhoneNumberChange = (value) => {
    setValidError(false);
    seterrorNumberInput(false);
    setWhatsappNumber_Error(false);
    setError1(null);
    try {
      setWhatsappNumber(value);
      const callingCode = phoneInput.current?.getCallingCode();
      if (callingCode) {
        setcountryCode(callingCode);
      }
    } catch (error) {
      console.log("Phone input error:", error);
    }
  };

  // Reset all fields when switching auth method or navigating away
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
    setFormData((prev) => ({ ...prev, loading: false }));

    // Reset OTP array
    const newLength = getOtpLength();
    const newOtp = Array(newLength).fill("");
    setOtp(newOtp);
    otpStateRef.current = newOtp;
  }, [getOtpLength]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#000" : "#fff" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "#fff" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ backgroundColor: "#fff", flex: 1 }}>
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
                <View style={styles.welcomeSection}>
                  <Text style={styles.welcomeText}>Welcome Back!</Text>
                  <Text style={styles.subtitleText}>
                    Login to continue your journey
                  </Text>
                </View>

                <View style={styles.authMethodContainer}>
                  <TouchableOpacity
                    style={[
                      styles.authMethodButton,
                      authMethod === "sms" && styles.activeAuthMethod,
                    ]}
                    onPress={() => {
                      setAuthMethod("sms");
                      resetForm();
                    }}
                    activeOpacity={0.7}
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
                      resetForm();
                    }}
                    activeOpacity={0.7}
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
                        authMethod === "whatsapp" &&
                          styles.activeAuthMethodText,
                      ]}
                    >
                      WhatsApp
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
                        containerStyle={styles.input1}
                        textInputStyle={styles.phonestyle}
                        codeTextStyle={styles.phonestyle1}
                        defaultValue={whatsappNumber}
                        defaultCode="IN"
                        layout="first"
                        onChangeText={handlePhoneNumberChange}
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                          setTimeout(() => handleSendOtp(), 100);
                        }}
                        disabled={otpSent}
                      />
                    </View>
                  ) : (
                    <TextInput
                      style={[styles.input, otpSent && styles.disabledInput]}
                      placeholder="Enter your phone number"
                      placeholderTextColor="#999"
                      keyboardType="number-pad"
                      value={phoneNumber}
                      onChangeText={(text) => {
                        setPhoneNumber(text.replace(/[^0-9]/g, ""));
                        setPhoneNumber_Error(false);
                        setValidError(false);
                      }}
                      maxLength={10}
                      onSubmitEditing={handleSendOtp}
                      underlineColor="transparent"
                      activeUnderlineColor="transparent"
                      editable={!otpSent}
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

                {otpMessage && otpSent && (
                  <Text style={styles.successText}>
                    OTP sent to {authMethod === "sms" ? "SMS" : "WhatsApp"}
                  </Text>
                )}

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
                  <Text style={styles.errorText}>
                    Please enter complete OTP
                  </Text>
                )}
                {validOtpError && (
                  <Text style={styles.errorText}>Invalid OTP</Text>
                )}

                {otpSent && (
                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={() => {
                      const newLength = getOtpLength();
                      const newOtp = Array(newLength).fill("");
                      setOtp(newOtp);
                      otpStateRef.current = newOtp;
                      setOtpError(false);
                      setValidOtpError(false);
                      handleSendOtp();
                    }}
                    disabled={formData.loading}
                  >
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </TouchableOpacity>
                )}

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

                {/* Register Link */}
                <View style={styles.linkContainer}>
                  <Text style={styles.linkText}>Don't have an account? </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("RegisterScreen");
                      resetForm();
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
    </SafeAreaView>
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
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
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
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "400",
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
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.35)",
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
    marginTop: 30,
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
    textAlign: "center",
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
