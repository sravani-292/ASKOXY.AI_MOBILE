import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigationState} from "@react-navigation/native";
import BASE_URL, { userStage } from "../../../../Config";
import PhoneInput from "react-native-phone-number-input";
import { pre } from "framer-motion/m";

const { height, width } = Dimensions.get("window");

const Profile = ({ navigation }) => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const phoneInput = React.createRef();

  const [formData, setFormData] = useState({
    firstName: "",
    firstName_error: false,
    lastName: "",
    lastName_error: false,
    email: "",
    email_error: false,
    validEmail: false,
    phone: "",
    phone_error: false,
    backupPhone: "",
    backupPhone_error: false,
    whatsappNumber: "",
    whatsappNumber_error: false,
    ValidwhatsappNumber_error: false,
    otp: "",
    otp_error: false,
    otpShow: false,
  });
  const [profileLoader, setProfileLoader] = useState(false);
  const [whatsappVerifyModal, setWhatsappVerifyModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [countryCode, setcountryCode] = useState("91");
  const [profileData, setProfileData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [frndNumber, setFrndNumber] = useState("");
    const [error1, setError1] = useState(null);
  const [frndNumber_error, setFrndNumber_error] = useState(false);
  const [code, setCode] = useState("91");
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSession, setOtpSession] = useState("");
  const [salt, setSalt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSame, setIsSame] = useState(null);
  const [mobileVerified,setMobileVerified]=useState(false);
  const [whatsappVerified,setWhatsappVerified]=useState(false);
   const currentScreen = useNavigationState(
      (state) => state.routes[state.index]?.name
    );
  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [currentScreen])
  );

  const profileWhatsappNumber = (value) => {
    setFormData({
      ...formData,
      whatsappNumber_error: false,
      ValidwhatsappNumber_error: false,
    });
    try {
      // setWhatsappNumber(value);
      
      setFormData({ ...formData, whatsappNumber: value });


      console.log({ value });
      // const callingCode = phoneInput.getCallingCode(value);
      console.log("satdfegfrhjjhnhj",formData.whatsappNumber);
      
      // console.log(callingCode);
      // setcountryCode(callingCode);
      const isValid = /^[0-9]*$/.test(value);
      if (isValid) {
        setErrorMessage("");
        setFormData({ ...formData, whatsappNumber: value });
      } else {
        setFormData({ ...formData, ValidwhatsappNumber_error: true });
        return;
      }
    } catch (error) {
      // Handle any parsing errors
    }
  };
  
  const getProfile = async () => {
    console.log("profile get call response");
    setProfileLoader(true);
    try {
      const response = await axios({
        method: "GET",
        url:
          BASE_URL +
          `user-service/customerProfileDetails?customerId=${customerId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWhatsappVerified(response.data.whatsappVerified);
      setMobileVerified(response.data.mobileVerified);
      setProfileLoader(false);
      if (response.status === 200) {
        // setUser(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          whatsappNumber: response.data.whatsappNumber,
          backupPhone: response.data.alterMobileNumber.trim(" "),
          phone: response.data.mobileNumber,
          status: response.data.whatsappVerified,
        });
      }
    } catch (error) {
      setProfileLoader(false);
      console.error("ERROR", error);
    } finally {
      setProfileLoader(false);
    }
  };

  const handleProfileSubmit = async () => {
    console.log("for profile saving call");
    if (formData.firstName == "" || formData.firstName == null) {
      setFormData({ ...formData, firstName_error: true });
      return false;
    }
    if (formData.firstName == "" || formData.firstName == null) {
      setFormData({ ...formData, firstName_error: true });
      return false;
    }
    if (formData.lastName == "" || formData.lastName == null) {
      setFormData({ ...formData, lastName_error: true });
      return false;
    }
    if (formData.email == "" || formData.email == null) {
      setFormData({ ...formData, email_error: true });
      return false;
    }
    if (formData.whatsappNumber != null) {
      if (formData.phone == "" || formData.phone == null) {
        setFormData({ ...formData, phone_error: true });
        return false;
      }
    }
    if (formData.backupPhone == "" || formData.backupPhone == null) {
      setFormData({ ...formData, backupPhone_error: true });
      return false;
    }
    if (formData.backupPhone.length != 10) {
      Alert.alert("Error", "Alternative Mobile Number should be 10 digits");
      return false;
    }
    if (
      formData.backupPhone === formData.phone ||
      formData.backupPhone === formData.whatsappNumber
    ) {
      Alert.alert(
        "Failed",
        "Alternative Mobile Number should not be same as whatsapp number or mobile number"
      );
      return false;
    }

    setIsLoading(true);
    let data ={
      userFirstName: formData.firstName,
      userLastName: formData.lastName,
      customerEmail: formData.email,
      customerId: customerId,
      alterMobileNumber: formData.backupPhone,
      whatsappNumber: isSame ? formData.phone : formData.whatsappNumber || "",        
      mobileNumber: formData.phone,
    }
    console.log("profile save call data",data);
    
    try {
      const response = await axios.patch(
        BASE_URL + "user-service/profileUpdate",
        {
          userFirstName: formData.firstName,
          userLastName: formData.lastName,
          customerEmail: formData.email,
          customerId: customerId,
          alterMobileNumber: formData.backupPhone,
          whatsappNumber: isSame ? formData.phone : formData.whatsappNumber || "",        
          mobileNumber: formData.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("profile save call ", response.data);
      setIsLoading(false);
      if (response.data.errorMessage == null) {
        console.log("Profile call response: ", response.data);
        console.log("Profile data:", profileData);
        getProfile();
        Alert.alert("Success", "Profile saved successfully");
      } else {
        Alert.alert("Alert", response.data.errorMessage);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error.response);
      Alert.alert("Failed", error.response?.data);
    }
  };

  function handleSendOtp() {
    if (formData.whatsappNumber === "") {
      setFormData({ ...formData, whatsappNumber_error: true });
      return false;
    }
    if (formData.whatsappNumber.length > 10) {
    
      setFormData({ ...formData, whatsappNumber_error: true });
      return false;
    }
    let data = {
      countryCode: "+" + code,
      chatId: formData.whatsappNumber,
      id: customerId,
    };
    console.log({ data });
    setLoading(true);
    axios({
      method: "post",
      url: BASE_URL + `user-service/sendWhatsappOtpqAndVerify`,
      data: data,
    })
      .then((response) => {
        console.log("user-service/sendWhatsappOtpqAndVerify", response.data);
        if (
          // 9059433013
          response.data.whatsappOtpSession == null ||
          response.data.whatsappOtpSession == "" ||
          response.data.salt == null ||
          response.data.salt == ""
        ) {
          Alert.alert("Failed", "This WhatsApp number already exists.");
          setLoading(false);
        } else {
          setFormData({ ...formData, otpShow: true ,whatsappNumber_error:false});
          setLoading(false);
          setOtpSession(response.data.whatsappOtpSession);
          setSalt(response.data.salt);
        }
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false);
      });
  }

  function handleVerifyOtp() {
    if (formData.whatsappNumber === "") {
      //  setWhatsappNumber_Error(true);
      setFormData({ ...formData, whatsappNumber_error: true });
      return false;
    }
    if (formData.whatsappNumber.length > 10) {
      setFormData({ ...formData, ValidwhatsappNumber_error: true });

      return false;
    }
    if (formData.otp === "") {
      setWhatsappOtp_Error(true);
      setErrors({ ...errors, whatsappOtpError: "Please enter otp" });
      return false;
    }

    if (formData.otp.length < 4 || formData.otp.length > 5) {
      Alert.alert("Failed", "Please enter valid otp");
      return false;
    }
    let data = {
      countryCode: "+" + code,
      chatId: formData.whatsappNumber,
      id: customerId,
      salt: salt,
      whatsappOtp: formData.otp,
      whatsappOtpSession: otpSession,
    };
    console.log({ data });
    setLoading(true);
    axios({
      method: "post",
      url: BASE_URL + `user-service/sendWhatsappOtpqAndVerify`,
      data: data,
    })
      .then((response) => {
        console.log("verification otp",response);
        
        console.log(response.data);
       
        if(response.status==200){
          Alert.alert("Success", "Whatsapp number verified successfully");
        }
        setWhatsappVerifyModal(false);
        setOtpSent(false);
        setLoading(false);
        setProfileForm({ ...profileForm, status: true });
        setFormData(prevState => ({ ...prevState,setwhatsappNumber_error: false ,setValidwhatsappNumber_error:false}));
        // getProfile()
      })
      .catch((error) => {
        console.log(error.response);
        Alert.alert(
          "Failed",
          error.response.data.message ||
            "Something went wrong, Please try again"
        );
        setLoading(false);
      });
  }

  const handleReferNumber = (value) => {
    console.log("handleReferNumber");
    
    setFrndNumber_error(false);
    setError1(false)
    try {
      console.log({ value });
      console.log("varalakshmi");
      console.log("getcallingcode", phoneInput.current.getCallingCode(value));
      if (phoneInput.current) {
        console.log("getCallingCode", phoneInput.current.getCallingCode(value));
      }
      const callingCode = phoneInput.current.getCallingCode(value);
      console.log({callingCode});
      setCode(callingCode);
      console.log("value", {value});
      
      setFrndNumber(value);
      console.log("referee number", value);
    } catch (error) {}
  };

  const SubmitReferNumber = () => {
     console.log({ frndNumber });

   
    if (frndNumber == "") {
      // setFormData({ ...formData, frndNumber_error: true });
      setFrndNumber_error(true);
      return false;
    }
    if (!frndNumber) { 
      setError1("Please enter a phone number.");
      return false;
    } else if (!phoneInput.current.isValidNumber(frndNumber)) {
      setError1("Invalid phone number. Please check the format.");
      return false;
    }

    if (userData.whatsappNumber !== null) {
      console.log("User Data whatsappNumber",userData.whatsappNumber);
      const code = "+" + code;
      
      if (userData.whatsappNumber) { 
        const num = userData.whatsappNumber.replace(code, "");
        console.log("num", num);
        
        if (num === frndNumber) {
          Alert.alert("Failed", "Self referral is not allowed");
          return false;
        }
      }
    } else {
      console.log("User Data  mobileNumber",userData.mobileNumber);
      
      if (userData.mobileNumber === frndNumber) {
        Alert.alert("Failed", "Self referral is not allowed");
        return false;
      }
    }
    
    

    let data = {
      referealId: customerId,
      refereeMobileNumber: frndNumber,
      countryCode: "+" + code,
    };

    console.log({ data });
    setLoader(true);
    axios({
      method: "post",
      url: BASE_URL + "user-service/inviteaUser",
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("response", response);
        setLoader(false);
        if (response.data.status == false) {
          Alert.alert("Failed", response.data.message);
        } else {
          Alert.alert("Success", "Successfully you referred a user");
          setModalVisible(false);
          setFrndNumber("");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log(error.response);
        Alert.alert("Failed", error.response.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
     
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView} keyboardShouldPersistTaps="always"
      >
        {isSame == false &&(
        <TouchableOpacity
          style={{
            backgroundColor: "#2ecc71",
            padding: 1,
            alignSelf: "flex-end",
            margin: 10,
            borderRadius: 8,
            marginRight: 20,
          }}
          onPress={() => setWhatsappVerifyModal(true)}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                margin: 5,
                fontSize: 16,
                color: "white",
                fontWeight: "800",
              }}
            >
              Verify 
            
            </Text>
            <MaterialCommunityIcons
              name="whatsapp"
              size={20}
              color="white"
              style={styles.whatsappIcon}
            />
          </View>
        </TouchableOpacity>)}

      
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="person"
                size={20}
                color="#6c757d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={formData.firstName}
                placeholder="First Name"
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    firstName: text,
                    firstName_error: false,
                  })
                }
              />
            </View>
            {formData.firstName_error && (
              <Text style={{ color: "red", alignSelf: "center" }}>
                First Name is mandatory
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="person"
                size={20}
                color="#6c757d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={formData.lastName}
                placeholder="Last Name"
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    lastName: text,
                    lastName_error: false,
                  })
                }
              />
            </View>
            {formData.lastName_error && (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Last Name is mandatory
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="email"
                size={20}
                color="#6c757d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={formData.email}
                placeholder="Email Address"
                keyboardType="email-address"
               
                onChangeText={(text) => {
                  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
                    setFormData({
                      ...formData,
                      email: text,
                      validEmail: false,
                      email_error: false,
                    });
                  } else {
                    setFormData({
                      ...formData,
                      email: text,
                      validEmail: true,
                      email_error: false,
                    });
                  }
                }}
              />
            </View>
            {formData.email_error && (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Email is mandatory
              </Text>
            )}
            {formData.validEmail && (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Invalid Email
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="phone"
                size={20}
                color="#6c757d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                
                value={
                  formData.phone || (formData.status && formData.whatsappNumber)
                }
                placeholder="Phone Number"
                keyboardType="phone-pad"
                onChangeText={(number) =>
                  setFormData({
                    ...formData,
                    phone: number,
                    phone_error: false,
                  })
                }
                editable={false}
              />
            </View>
            {formData.phone_error && (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Phone Number is mandatory
              </Text>
            )}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Please provide a backup mobile number. We'll use it only if your
              registered number can't be reached.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="phone-forwarded"
                size={20}
                color="#6c757d"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={formData.backupPhone}
                placeholder="Backup Phone Number"
                keyboardType="phone-pad"
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    backupPhone: text,
                    backupPhone_error: false,
                  })
                }
                maxLength={10}
              />
            </View>
            {formData.backupPhone_error && (
              <Text style={{ color: "red", alignSelf: "center" }}>
                Backup Phone Number is mandatory
              </Text>
            )}
          </View>
         {/* for question */}
         {mobileVerified && !whatsappVerified &&(
  <View
    style={{
      padding: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Text
      style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
        flexShrink: 1,
        marginRight: 5,
      }}
    >
      Is your mobile number the same as your WhatsApp number?
    </Text>

    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          backgroundColor: isSame === true ? "#4CAF50" : "#ddd",
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 5,
          marginRight: 5,
          minWidth: width / 7,
          alignItems: "center",
        }}
        onPress={() => setIsSame(true)}
      >
        <Text style={{ color: isSame === true ? "#fff" : "#000" }}>Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: isSame === false ? "#4CAF50" : "#ddd",
          paddingVertical: 8,
          paddingHorizontal: 8,
          borderRadius: 5,
          minWidth: width / 8,
          alignItems: "center",
        }}
        onPress={() => setIsSame(false)}
      >
        <Text style={{ color: isSame === false ? "#fff" : "#000" }}>No</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

          {isLoading == false ? (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleProfileSubmit()}
            >
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.saveButton}>
              <ActivityIndicator size="small" color="white" />
            </View>
          )}
        </View>

        {/* Verify Your Whatsapp MNumber */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={whatsappVerifyModal}
          onRequestClose={() => {
            setWhatsappVerifyModal(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Header with close button */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Whatsapp Number Verification
                </Text>
                <Pressable onPress={() => setWhatsappVerifyModal(false)}>
                  <Ionicons name="close" size={24} color="#9ca3af" />
                </Pressable>
              </View>

              {/* Description text */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>WhatsApp Number</Text>

                <PhoneInput
                  placeholder="Whatsapp Number"
                  containerStyle={styles.input1}
                  textInputStyle={styles.phonestyle}
                  codeTextStyle={styles.phonestyle1}
                  ref={phoneInput}
                  // ref={(ref) => (phoneInput = ref)}
                  defaultValue={formData.whatsappNumber}
                  defaultCode="IN"
                  layout="first"
                  onChangeText={profileWhatsappNumber}
                />
              </View>
              {formData.whatsappNumber_error == true ? (
                <Text style={{ color: "red", alignSelf: "center" }}>
                  Whatspp Number is mandatory
                </Text>
              ) : null}

              {formData.ValidwhatsappNumber_error == true ? (
                <Text style={{ color: "red", alignSelf: "center" }}>
                  Invalid Whatspp Number
                </Text>
              ) : null}

              {formData.otpShow == true ? (
                <View style={styles.buttonContainer}>
                  <View>
                    <TextInput
                      style={styles.otpinput}
                      value={formData.otp}
                      placeholder="Enter Otp"
                      keyboardType="phone-pad"
                      maxLength={4}
                      onChangeText={(number) =>
                        setFormData({
                          ...formData,
                          otp: number,
                          otp_error: false,
                        })
                      }
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => handleVerifyOtp()}
                    >
                      <Text style={styles.submitButtonText}>Verify Otp</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.buttonContainer}>
                  {loading == false ? (
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => handleSendOtp()}
                    >
                      <Text style={styles.submitButtonText}>Send Otp</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.submitButton}>
                      <ActivityIndicator size={25} color="white" />
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* Refer A Friend */}

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // setFormData({ ...formData, frndNumber: false });
            setFrndNumber("");
            setFrndNumber_error(false);
            setModalVisible(false), setLoader(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Header with close button */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Enter Referee Details</Text>
                <Pressable onPress={() => {setModalVisible(false),setFrndNumber("")}}>
                  <Ionicons name="close" size={24} color="#9ca3af" />
                </Pressable>
              </View>

              {/* Description text */}
              <Text style={styles.modalDescription}>
                Please enter the phone number of the person you want to refer.
              </Text>

              <View style={styles.phoneInputWrapper}>
                <PhoneInput
                  placeholder="Whatsapp Number"
                  containerStyle={styles.input1}
                  textInputStyle={styles.phonestyle}
                  codeTextStyle={styles.phonestyle1}
                  ref={phoneInput}
                  // ref={(ref) => (phoneInput = ref)}
                  defaultValue={frndNumber}
                  defaultCode="IN"
                  layout="first"
                  onChangeText={handleReferNumber}
                />
              </View>
              {frndNumber_error == true ? (
                <Text style={{ color: "red", alignSelf: "center" }}>
                 Phone Number is mandatory
                </Text>
              ) : null}


               {error1 && (
                            <Text
                              style={{ color: "red", marginBottom: 10, alignSelf: "center" }}
                            >
                              {error1}
                            </Text>
                          )}

              <View style={styles.buttonContainer1}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setModalVisible(false),
                      setFrndNumber(""),
                      setLoader(false),
                      setFrndNumber_error(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                {loader == false ? (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => SubmitReferNumber()}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.submitButton}>
                    <ActivityIndicator size={25} color="white" />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Subscription")}
              style={[styles.quickActionButton, styles.subscriptionButton]}
            >
              <Ionicons name="card-outline" size={20} color="#fff" />
              <Text style={styles.quickActionText}>Subscription</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Wallet")}
              style={[styles.quickActionButton, styles.walletButton]}
            >
              <MaterialIcons
                name="account-balance-wallet"
                size={20}
                color="#fff"
              />
              <Text style={styles.quickActionText}>Wallet</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Terms and Conditions")}
              style={[styles.quickActionButton, styles.faqButton]}
            >
              <MaterialIcons name="help-outline" size={20} color="#fff" />
              <Text style={styles.quickActionText}>FAQs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Write To Us")}
              style={[styles.quickActionButton, styles.writeButton]}
            >
              <MaterialCommunityIcons
                name="pencil-outline"
                size={20}
                color="#fff"
              />
              <Text style={styles.quickActionText}>Write To Us</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={[styles.quickActionButton, styles.referButton]}
            >
              <FontAwesome5 name="user-friends" size={18} color="#fff" />
              <Text style={styles.quickActionText}>Refer a Friend</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Referral History")}
              style={[styles.quickActionButton, styles.historyButton]}
            >
              <MaterialIcons name="history" size={20} color="#fff" />
              <Text style={styles.quickActionText}>Referral History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 20,
    marginBottom: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },

  formContainer: {
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#495057",
    marginBottom: 6,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    // paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#495057",
  },
  otpinput: {
    borderColor: "#c0c0c0",
    borderWidth: 1,
    height: 40,
    width: width * 0.4,
    paddingLeft: 10,
    // backgroundColor:"black"
  },
  inputIcon: {
    margin: 10,
  },
  whatsappIcon: {
    alignSelf: "flex-end",
    padding: 5,
    fontWeight: "900",
  },
  infoBox: {
    backgroundColor: "#f8f9fa",
    borderLeftWidth: 4,
    borderLeftColor: "#6c757d",
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: "#5e35b1",
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
    alignItems: "center",
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 1,
  },
  quickActionText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "500",
  },
  subscriptionButton: {
    backgroundColor: "#ffa000",
  },
  walletButton: {
    backgroundColor: "#ff9800",
  },
  faqButton: {
    backgroundColor: "#ffa726",
  },
  writeButton: {
    backgroundColor: "#ffb74d",
  },
  referButton: {
    backgroundColor: "#2ecc71",
  },
  historyButton: {
    backgroundColor: "#27ae60",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  activeNavItem: {
    borderTopWidth: 3,
    borderTopColor: "#5e35b1",
    paddingTop: 5,
  },
  activeNavText: {
    fontSize: 12,
    color: "#5e35b1",
    fontWeight: "500",
    marginTop: 4,
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
    width: width / 1.3,
    alignSelf: "center",
    height: 45,
    elevation: 4,
    backgroundColor: "white",
    borderColor: "black",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    height: "auto",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "green",
  },
  modalDescription: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 24,
  },
  phoneInputWrapper: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  buttonContainer1: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#6b7280",
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: "#8b5cf6",
  },
  submitButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default Profile;
