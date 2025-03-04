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
} from "react-native";
import axios from "axios";
import { TextInput } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { AccessToken } from "../../Redux/action/index";
import BASE_URL from "../../Config";
const { height, width } = Dimensions.get("window");
import Icon from "react-native-vector-icons/Ionicons";

const Register = ({route}) => {
  
  const [formData, setFormData] = useState({
    mobileNumber: "",
    mobileNumber_error: false,
    validMobileNumber_error: false,
    otp: "",
    otp_error: false,
    validOtpError: false,
    refCode:"",
    // showOtp: false,
    loading: false,
    // mobileOtpSession: "",
  });
  const [showOtp, setShowOtp] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [mobileOtpSession, setMobileOtpSession] = useState("");
  const [saltSession,setSaltSession] = useState("");
  const [otpGeneratedTime,setotpGeneratedTime]=useState("")



useEffect(()=>{
  console.log("route",route.params)
if(route.params?.refCode){
  setFormData({...formData, refCode:route.params?.refCode})
}
else{
  setFormData({...formData, refCode:""})
}
},[])




  const handleSendOtp = async () => {
    // if (!validateMobileNumber()) return;
    if (formData.mobileNumber == "" || formData.mobileNumber == null) {
      setFormData({ ...formData, mobileNumber_error: true });
      return;
    }
    if (formData.mobileNumber.length != 10) {
      setFormData({ ...formData, validMobileNumber_error: true });
      return;
    }
    console.log("mobileNumber", formData.mobileNumber);
    let data = {
      whatsappNumber: formData.mobileNumber,
      countryCode:"+91",
      userType: "Register",
      registrationType:"whatsapp"
    };
    console.log({ data });
    setFormData({ ...formData, loading: true });
    try {
      const response = await axios.post(
        BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
        data
      );
      console.log("Send Otp", response.data);

      if (response.data.mobileOtpSession) {
         setMobileOtpSession(response.data.mobileOtpSession);
         setSaltSession(response.data.salt);
         setotpGeneratedTime(response.data.otpGeneratedTime)

        setFormData({
          ...formData,
          // showOtp: true,
          mobileOtpSession: mobileOtpSession,
          loading: false,
        });
        setShowOtp(true);
        
      } else {
        Alert.alert("You are already registered, Please login");
        navigation.navigate("Login");
        
      }
    } catch (error) {
      console.log(error.response);
      
      Alert.alert("Failed", "You are already registered, Please login", [
        {
          text: "Ok",
          onPress: () => navigation.navigate("Login"),
          style: "cancel",
        },
      ]);
    } finally {
      setFormData({ ...formData, loading: false });
    }
  };

  const handleVerifyOtp = () => {
    console.log("for verification otp");
    
    // if (!validateOtp()) return;
     if (formData.otp == "" || formData.otp == null) {
       setFormData({ ...formData, otp_error: true });
       return false;
     }
     if (formData.otp.length != 4) {
       setFormData({ ...formData, validOtpError: true });
       return false;
     }
    //  setLoading(true);
    setFormData({ ...formData, loading: true });
      console.log("log the data before sending it to api");
      
    let data = {
      whatsappNumber: formData.mobileNumber,
      countryCode:"+91",
      whatsappOtpSession: mobileOtpSession,
      whatsappOtpValue: formData.otp,
      registrationType:"whatsapp",
      primaryType: "CUSTOMER",
      userType: "Register",
      salt:saltSession,
      expiryTime:otpGeneratedTime,

      // referrerid: formData.refCode,
    };
    console.log({ data });
    axios({
      method: "post",
      url: BASE_URL + `user-service/registerwithMobileAndWhatsappNumber`,
      data: data,
    })
      .then(function (response) {
        console.log("whatsapp verification",response.data);
        setFormData({ ...formData, loading: false });

        if (response.data.accessToken != null) {
          dispatch(AccessToken(response.data));
          Alert.alert("Success", "Registration successful!");
          navigation.navigate("Home");
        }
      })
      .catch(function (error) {
        console.log(error.response);
        setFormData({ ...formData, loading: false });
          Alert.alert("Failed","Invalid OTP")
      });
  };

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
              source={require("../../assets/Images/rice.png")}
              style={styles.riceImage}
            /> */}
            <Text style={styles.loginTxt}>Register</Text>
            <View style={{ marginTop: 10 }}>
              <TextInput
                style={styles.input}
                mode="outlined"
                placeholder="Enter Mobile Number"
                keyboardType="numeric"
                dense={true}
                // autoFocus
                error={formData.mobileNumber_error}
                activeOutlineColor={
                  formData.mobileNumber_error ? "red" : "#f9b91a"
                }
                value={formData.mobileNumber}
                maxLength={10}
                onChangeText={(text) => {
                  setFormData({
                    ...formData,
                    mobileNumber: text,
                    mobileNumber_error: false,
                    validMobileNumber_error: false,
                  });
                }}
              />
              {formData.mobileNumber_error ? (
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  Mobile Number is mandatory
                </Text>
              ) : null}

              {formData.validMobileNumber_error ? (
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  Invalid Mobile Number
                </Text>
              ) : null}

              {/* Fixed Indian flag and +91 prefix */}
              <View style={styles.fixedPrefix}>
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
                  }}
                  style={styles.flag}
                />
                <View style={styles.divider} />
                <Text style={styles.countryCode}>+91</Text>
              </View>

              {showOtp == false ? (
                <View>
                  {formData.loading == false ? (
                    <View>
                      <TouchableOpacity
                        style={styles.otpbtn}
                        onPress={() => handleSendOtp()}
                      >
                        <Text style={styles.Otptxt}>Send OTP</Text>
                      </TouchableOpacity>
                      <View
                        style={{ flexDirection: "row", alignSelf: "center" }}
                      >
                        <View></View>
                        <View>
                          <TouchableOpacity
                            style={styles.rowbtn}
                            onPress={() =>
                              navigation.navigate("LoginWithPassword")
                            }
                          >
                            {/* <Text>Email</Text> */}
                            <Icon
                              name="mail-outline"
                              color="#f9b91a"
                              size={24}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* <View style={{}} /> */}
                      {/* Not yet Register */}
                      <View
                        style={{
                          flexDirection: "row",
                          textAlign: "center",
                          width: width * 0.5,
                          alignSelf: "center",
                          marginTop: 10,
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 16 }}>
                          Already Registered ?{" "}
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("Login")}
                        >
                          <Text
                            style={{
                              color: "#f9b91a",
                              fontWeight: "bold",
                              fontSize: 16,
                            }}
                          >
                            {" "}
                            Login{" "}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.otpbtn}>
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <TextInput
                    style={styles.input1}
                    placeholder="Enter OTP"
                    mode="outlined"
                    value={formData.otp}
                    dense={true}
                    maxLength={4}
                    keyboardType="number-pad"
                    activeOutlineColor="#f9b91a"
                    autoFocus
                    onChangeText={(text) => {
                      setFormData({
                        ...formData,
                        otp: text,
                        otp_error: false,
                      });
                    }}
                  />

                  {formData.otp_error ? (
                    <Text
                      style={{
                        color: "red",
                        fontSize: 16,
                        fontWeight: "bold",
                        alignSelf: "center",
                      }}
                    >
                      OTP is mandatory
                    </Text>
                  ) : null}

                  {formData.validOtpError ? (
                    <Text
                      style={{
                        color: "red",
                        fontSize: 16,
                        fontWeight: "bold",
                        alignSelf: "center",
                      }}
                    >
                      Invalid OTP
                    </Text>
                  ) : null}

                  {formData.loading == false ? (
                    <TouchableOpacity
                      style={styles.otpbtn}
                      onPress={() => handleVerifyOtp()}
                    >
                      <Text style={styles.Otptxt}>Verify OTP</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.otpbtn}>
                      <ActivityIndicator size="small" color="#fff" />
                    </View>
                  )}
                </View>
              )}
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
    width: 220,
    height: 60,
    // resizeMode: "contain",
    marginRight: width / 8,
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

    // height: height/2,
  },
  loginTxt: {
    color: "white",
    fontWeight: "500",
    fontSize: 25,
    margin: 20,
    alignSelf: "center",
  },
  input1: {
    borderColor: "#f9b91a",
    width: width * 0.8,
    alignSelf: "center",
    height: 45,
    paddingLeft: 10,
    margin: 10,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#f9b91a",
    borderRadius: 5,
    paddingLeft: width * 0.22, // Add padding to accommodate prefix
    fontSize: 16,
    alignSelf: "center",
    width: width * 0.8,
  },
  fixedPrefix: {
    position: "absolute",
    left: width / 7,
    top: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 5,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: "bold",
  },
  otpbtn: {
    width: width * 0.8,
    height: 45,
    backgroundColor: "#f9b91a",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    margin: 20,
  },
  Otptxt: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  rowbtn: {
    //   width: width * 0.35,
    //   height: 45,
    padding: 5,
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    margin: 10,
  },
});
