import React, { useState, useRef ,useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  BackHandler,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AccessToken } from "../../Redux/action";
import BASE_URL,{userStage} from "../../Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../Redux/constants/theme";

const { width, height } = Dimensions.get("window");

const NewLogin = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    mobileNumber: "",
    mobileNumber_Error: false,
    validMobileNumber_Error: false,
    otp: ["", "", "", ""],
    otp_Error: "",
    validOtp_Error: "",
    loading: false,
    showOtp: false,
    otpSession: "",
    otpGeneratedTime: "",
    saltSession: "",
  });


 useEffect(() => {
  console.log("🔄 showOtp Updated:", loginData.showOtp);
  setLoginData((prev) => ({ ...prev })); 
}, [loginData.showOtp]);

  
  const otpRefs = useRef([...Array(4)].map(() => useRef(null))); 

  const handleOtpChange = (text, index) => {
    let newOtp = [...loginData.otp];
    newOtp[index] = text.replace(/\D/g, ""); // Allow only digits
    setLoginData((prevState) => ({ ...prevState, otp: newOtp }));

    // ✅ Move to the next input if text is entered
    if (text && index < 3 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].current.focus();
    }
  };

  const handleOtpClear = (index) => {
    let newOtp = [...loginData.otp];
    newOtp[index] = "";
    setLoginData((prevState) => ({ ...prevState, otp: newOtp }));

    // ✅ Keep focus on the current input
    if (otpRefs.current[index]) {
      otpRefs.current[index].current.focus();
    }
  };

  const handleOtpBackspace = (index) => {
    if (index > 0 && !loginData.otp[index]) {
      let newOtp = [...loginData.otp];
      newOtp[index - 1] = "";
      setLoginData((prevState) => ({ ...prevState, otp: newOtp }));

      // ✅ Move focus back to previous input
      otpRefs.current[index - 1]?.current.focus();
    }
  };
  const handleSendOtp = async () => {
    if (loginData.loading) return;
    if (loginData.mobileNumber === "" || loginData.mobileNumber == null) {
      setLoginData((prevState) => ({ ...prevState, mobileNumber_Error: true }));
      return;
    }
    if (loginData.mobileNumber.length !== 10) {
      setLoginData((prevState) => ({
        ...prevState,
        validMobileNumber_Error: true,
      }));
      return;
    }

    let data = {
      whatsappNumber: "+91" + loginData.mobileNumber,
      userType: "Login",
      registrationType: "whatsapp",
    };
     console.log({data});
     
    setLoginData((prevState) => ({ ...prevState, loading: true }));

    try {
      const response = await axios.post(
        userStage =="test1" ? BASE_URL+`erice-service/user/login-or-register`:
        BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
        data
      );
      console.log("response",response);
      
      
      if (response.data?.mobileOtpSession) {
        setLoginData((prevState) => ({
          ...prevState,
          otpSession: response.data.mobileOtpSession,
          otpGeneratedTime: response.data.otpGeneratedTime,
          saltSession: response.data.salt,
          loading: false,
          showOtp: true, 
        }));
        console.log("🔄 Updated State:", {
          otpSession: response.data.mobileOtpSession,
          showOtp: true,
        });
      } else {
        Alert.alert("Error", "Failed to send OTP. Try again.");
      }
    } catch (error) {
      console.log(error);
      setLoginData((prevState) => ({ ...prevState, showOtp: false }));
      Alert.alert("Sorry", "You are not registered, Please signup",[
        { 
          text: "OK", 
          onPress: () => navigation.navigate("RegisterScreen") 
        }
      ]);
    } finally {
      setLoginData((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const handleVerifyOtp = async () => {
    if (loginData.loading) return;
    if (loginData.otp.some((value) => value === "")) {
      setLoginData((prevState) => ({ ...prevState, otp_Error: true }));
      return false;
    }

    setLoginData((prevState) => ({ ...prevState, loading: true }));

    let data = {
      whatsappNumber: "+91" + loginData.mobileNumber,
      whatsappOtpSession: loginData.otpSession,
      whatsappOtpValue: loginData.otp.join(""),
      userType: "Login",
      salt: loginData.saltSession,
      expiryTime: loginData.otpGeneratedTime,
    };

    try {
      const response = await axios.post(
        userStage =="test1"?`erice-service/user/login-or-register`:
        `${BASE_URL}user-service/registerwithMobileAndWhatsappNumber`,
        data
      );

      if (response.data.accessToken) {
        dispatch(AccessToken(response.data));
        await AsyncStorage.setItem("userData", JSON.stringify(response.data));
        await AsyncStorage.setItem("mobileNumber", loginData.mobileNumber);
        setLoginData((prevState) => ({ ...prevState, otp: "" }));
        setLoginData((prevState) =>({...prevState,otpSession: ""}))
        setLoginData((prevState) =>({...prevState,showOtp:false}))
        // if (
        //   response.data.userStatus === "ACTIVE" ||
        //   response.data.userStatus === null
        // ) {
        //   navigation.navigate("Home", { screen: "UserDashboard" });
        // } else {
        //   Alert.alert(
        //     "Deactivated",
        //     "Your account is deactivated. Do you want to reactivate your account?",
        //     [
        //       { text: "Yes", onPress: () => navigation.navigate("Active") },
        //       { text: "No", onPress: () => BackHandler.exitApp() },
        //     ]
        //   );
        // }
        navigation.navigate("Home",{screen:"UserDashboard"});
      } else {
        Alert.alert("Error", "Invalid credentials.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setLoginData((prevState) => ({
        ...prevState,
        otp_Error: false,
        validOtp_Error: true,
      }));
      Alert.alert("Failed", "Invalid Credentials");
    } finally {
      setLoginData((prevState) => ({ ...prevState, loading: false }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/Images/logo.png")}
        />
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputWrapper}>
          <View style={styles.fixedPrefix}>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
              }}
              style={styles.flag}
            />
            <Text style={styles.countryCode}>+91</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter WhatsApp Number"
            keyboardType="numeric"
            maxLength={10}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "");
              setLoginData({
                ...loginData,
                mobileNumber: numericText,
                mobileNumber_Error: false,
                validMobileNumber_Error: false,
              });
            }}
          />
        </View>

        {loginData.mobileNumber_Error && (
          <Text style={styles.errorText}>Mobile Number is mandatory</Text>
        )}
        {loginData.validMobileNumber_Error && (
          <Text style={styles.errorText}>Invalid Mobile Number</Text>
        )}

        {!loginData.showOtp && (
          <TouchableOpacity
            style={styles.sendOtp}
            onPress={() => handleSendOtp()}
            disabled={loginData.loading}
          >
            {loginData.loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        )}

        {loginData.showOtp && (
          <>
            <View style={styles.otpContainer}>
              {Array.isArray(loginData.otp) &&
                loginData.otp.map((value, index) => (
                  <View key={index} style={{ position: "relative" }}>
                    <TextInput
                      ref={otpRefs.current[index]}
                      style={styles.otpBox}
                      keyboardType="numeric"
                      maxLength={1}
                      value={value}
                      autoFocus={index === 0}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === "Backspace") {
                          handleOtpBackspace(index);
                        }
                      }}
                    />
                    {value !== "" && (
                      <TouchableOpacity
                        onPress={() => handleOtpClear(index)}
                        style={{ position: "absolute", top: -10, right: -5 }}
                      >
                        {/* <Text style={{ fontSize: 18, color: "red" }}>❌</Text> */}
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
            </View>
            <View>
              {loginData.otp_Error && (
                <Text style={styles.errorText}>OTP is mandatory.</Text>
              )}
              {loginData.validOtp_Error && (
                <Text style={styles.errorText}>
                  Invalid OTP. Please enter a valid OTP.
                </Text>
              )}
            </View>
          </>
        )}

        {loginData.showOtp && (
          <TouchableOpacity onPress={() => handleSendOtp()}>
            <Text style={styles.resendOtp}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        {loginData.showOtp && (
          <TouchableOpacity
            style={styles.verifyOtp}
            onPress={() => handleVerifyOtp()}
          >
            {loginData.loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        )}
        <View
          style={{
            flexDirection: "row",
            textAlign: "center",
            width: width * 0.5,
            alignSelf: "center",
            marginTop: 10,
            
          }}
        >
          <Text style={{ color: COLORS.primary, fontSize: 16 ,marginLeft:-25}}>
            Not yet Registered ?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            <Text
              style={{
                color: "#e87f02",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {" "}
              Register Now{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NewLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDDAF7",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: width * 0.5,
    height: height * 0.15,
    resizeMode: "contain",
  },
  loginContainer: {
    backgroundColor: "#fff",
    width: width * 0.85,
    borderRadius: 15,
    height: height / 2.7,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "88%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  fixedPrefix: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  flag: {
    width: 24,
    height: 16,
    resizeMode: "contain",
    marginRight: 5,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  sendOtp: {
    marginTop: 40,
    backgroundColor: COLORS.title2,
    width: width * 0.6,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    textAlign: "center",
    fontSize: 18,
  },
  resendOtp: {
    color: "orange",
    fontWeight: "bold",
    marginTop: 10,
    marginLeft:200
  },
  verifyOtp: {
    marginTop: 20,
    backgroundColor: COLORS.title2,
    width: width * 0.6,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
});
