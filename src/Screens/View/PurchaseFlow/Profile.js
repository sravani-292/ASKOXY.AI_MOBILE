import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
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
  ActivityIndicator
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

const ProfilePage = () => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
//   console.log({BASE_URL})
//   console.log({userStage})
  const [profileForm, setProfileForm] = useState({
    user_FirstName: "",
    user_LastName: "",
    customer_email: "",
    customer_mobile: "",
    user_mobile: "",
    
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

  useFocusEffect(
    useCallback(() => {
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
      

      if (response.status === 200) {
        setUser(response.data);
        setProfileForm({
          user_FirstName: response.data.firstName,
          user_LastName:response.data.lastName,
          customer_email: response.data.email,
          customer_mobile: response.data.whatsappNumber,
          user_mobile: response.data.alterMobileNumber.trim(" "),
          
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
      console.error(error.response);
      Alert.alert("Failed", error.response?.data?.error);
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
            {errors.customer_name ? (
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
            {errors.customer_name ? (
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

            <TextInput
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
              value={profileForm?.customer_mobile || ""}
              onChangeText={(text) => {
                if (text.length <= 13) {
                  setProfileForm({ ...profileForm, customer_mobile: text });
                }
              }}
              maxLength={13}
              editable={
                !isProfileSaved &&
                (profileForm?.customer_mobile?.length || 0) < 14
              }
              disabled={true}
            />

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

              <TouchableOpacity style={[styles.btn,{backgroundColor:state?"#f44336":COLORS.title}]} onPress={() => navigation.navigate("Active")}>
                        <Text style={styles.optionText}>{state?"Deactivate Account":"Activate Account"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={()=>navigation.navigate("Write To Us")}>
                <Text style={styles.optionText}>Write To Us</Text>

                </TouchableOpacity>
                    </View>
            </View>
          </View>
        </ScrollView>
      </View>
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
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  optionContainer: {
    marginTop: 20,
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
    minWidth: 155,
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
    minWidth: 150,
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
});

export default ProfilePage;
