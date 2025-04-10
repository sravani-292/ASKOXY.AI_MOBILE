import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
  StatusBar,
  Linking,
  Dimensions,
  ActivityIndicator,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigationState } from "@react-navigation/native";
import BASE_URL, { userStage } from "../../../../Config";
import PhoneInput from "react-native-phone-number-input";


const { height, width } = Dimensions.get("window");

const ReferFriend = () => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const phoneInput = React.createRef();

  const [frndNumber, setFrndNumber] = useState("");
  const [error1, setError1] = useState(null);
  const [frndNumber_error, setFrndNumber_error] = useState(false);
  const [code, setCode] = useState("91");
  const [loader, setLoader] = useState(false);

  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invitedCount, setInvitedCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);

  const handleShareViaWhatsApp = () => {
    const message = `Hi,

I invite you to join askoxy.ai, an innovative platform offering great services and rewards!

Click the link below to register:
🔹 Web : https://www.askoxy.ai/whatsappregister?ref=${customerId}
🔹 Google Play Store: https://play.google.com/store/apps/details?id=com.oxyrice.oxyrice_customer&ref=${getLastFourDigits(customerId)}
🔹 Apple App Store: https://apps.apple.com/in/app/oxyrice-rice-grocery-delivery/id6738732000?ref=${getLastFourDigits(customerId)}

Your Referral ID: **${getLastFourDigits(customerId)}**`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const getLastFourDigits = (input) => {
    return input.slice(-4); // Extracts the last 4 characters
  };

  const handleReferNumber = (value) => {
    setFrndNumber_error(false);
    setError1(false);
    try {
      const callingCode = phoneInput.current.getCallingCode(value);
      setCode(callingCode);
      setFrndNumber(value);
    } catch (error) {}
  };
useFocusEffect(
  useCallback(()=>{
    getReferenceDetails();
  },[])
)

  const getReferenceDetails=()=>{
    axios({
      method: "get",
      url: BASE_URL + `reference-service/getreferencedetails/${customerId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        // console.log(response.data)
        if (response.data && Array.isArray(response.data)) {
          const invited = response.data.length;
          const success = response.data.filter((item) => item.referenceStatus === "REGISTERED").length;
    
          setInvitedCount(invited);
          setSuccessCount(success);
        }
        // if (response.data.status == false) {
        //   Alert.alert("Failed", response.data.message);
        // } else {
        //   setFrndNumber(response.data.data);
        // }
      })
      .catch((error) => {
        // Alert.alert("Failed", error.response.message)
      })
  }

  const SubmitReferNumber = () => {
    if (frndNumber == "") {
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
      const code = "+" + code;
      if (userData.whatsappNumber) {
        const num = userData.whatsappNumber.replace(code, "");
        if (num === frndNumber) {
          Alert.alert("Failed", "Self referral is not allowed");
          return false;
        }
      }
    } else {
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
        setLoader(false);
        if (response.data.status == false) {
          Alert.alert("Failed", response.data.message);
        } else {
          Alert.alert("Success", "Successfully you referred a user");
          setFrndNumber("");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error",error.response);
        Alert.alert("Failed", error.response.data.error);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.referralStats}>
            <View style={styles.statCard}>
              <MaterialIcons name="people" size={30} color="#4CAF50" />
              <Text style={styles.statTitle}>Total Referrals</Text>
              <Text style={styles.statValue}>{invitedCount}</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="check-circle" size={30} color="#FFA000" />
              <Text style={styles.statTitle}>Active Referrals</Text>
              <Text style={styles.statValue}>{successCount}</Text>
            </View>
          </View>

          <View style={styles.referralOffer}>
            <Text style={styles.offerTitle}>Refer a Friend & Earn ₹50</Text>
            <Text style={styles.offerDescription}>
              Invite your friends to join ASKOXY.AI. When they register using your referral link and place an order for rice, you'll receive ₹50 cashback!
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleShareViaWhatsApp}>
              <Text style={styles.buttonText}>Share via WhatsApp</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.referralOffer}>
            <View style={styles.modalHeader}>
              <Text style={styles.offerTitle}>Enter Referee Details</Text>
            </View>
            <Text style={styles.offerDescription}>
            Share via WhatsApp
            Enter your friend's number to open your whatsapp app with a pre-filled message. No numbers are stored or collected.
            </Text>
            <View style={styles.phoneInputWrapper}>
              <PhoneInput
                placeholder="Whatsapp Number"
                containerStyle={styles.input1}
                textInputStyle={styles.phonestyle}
                codeTextStyle={styles.phonestyle1}
                ref={phoneInput}
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
              <Text style={{ color: "red", marginBottom: 10, alignSelf: "center" }}>
                {error1}
              </Text>
            )}
            <View style={styles.buttonContainer1}>
              {loader == false ? (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => SubmitReferNumber()}
                >
                  <Text style={styles.submitButtonText}>Open WhatsApp with Text</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.submitButton}>
                  <ActivityIndicator size={25} color="white" />
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  referralStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  referralOffer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
  },
  offerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  offerDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#25D366',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  phonestyle: {
    width: '100%',
    height: 39,
  },
  phonestyle1: {
    height: 20,
  },
  input1: {
    marginTop: 10,
    width: width / 1.3,
    alignSelf: 'center',
    height: 45,
    elevation: 4,
    backgroundColor: 'white',
    borderColor: 'black',
  },
  phoneInputWrapper: {
    marginBottom: 24,
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#8b5cf6',
  },
  submitButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default ReferFriend;