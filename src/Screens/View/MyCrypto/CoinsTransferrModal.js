import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { COLORS } from "../../../../Redux/constants/theme";
import { Ionicons } from "react-native-vector-icons";

import BASE_URL from "../../../../Config";
import axios from "axios";
const { width } = Dimensions.get("window");

export const getTransferrMobileNumbers = async (fromMobile) => {
  console.log(fromMobile);
  
  try {
    const response = await axios.get(`${BASE_URL}user-service/bmvhistory`, {
    params: { mobileNumber: fromMobile },
    });
    console.log("bmv coins transfer response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};
const CoinsTransferrModal = ({ visible, onClose, availableCoins }) => {
  const navigation = useNavigation();
  const userData = useSelector((state) => state.counter);
 
  const token = userData?.accessToken;
  const customerId = userData?.userId;
  const mobileNumber = userData?.mobileNumber;
  const whatsappNumber = userData?.whatsappNumber;
  const whatsappwithoutcountry = whatsappNumber?.slice(3);
  const [recipientMobile, setRecipientMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);


  const handleTransfer = async () => {
    const fromMobile = mobileNumber ? mobileNumber : whatsappwithoutcountry;
    if(recipientMobile == fromMobile){
      Alert.alert("Error", "Self transfer is not allowed.");
      return; 
    }
    if (!recipientMobile.match(/^\d{10}$/)) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }
    if (Number(amount) > availableCoins) {
      Alert.alert("Error", "Insufficient balance.");
      return;
    }
    console.log("Sending to API:", {
      from_mobile: fromMobile,
      to_mobile: recipientMobile,
      amount: amount,
    });

    try {
      setLoading(true);
      const response = await axios.post(
        BASE_URL + "user-service/assetTransfer",
        {
          from_mobile: fromMobile,
          to_mobile: recipientMobile,
          amount: amount,
        }
      );
      console.log("coins transfor response", response);

      if (response.status==200) {
       Alert.alert(
      "Success",
      "Coins transferred successfully!",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("View BMVcoins History"), 
        }
      ],
      { cancelable: false }
    );
        onClose();
      } else {
        Alert.alert("Failed", response.data.message || "Transfer failed.");
      }
    } catch (error) {
       if(error.response.status==409){
        Alert.alert("Error", "Recipient mobile number is not registered.");
       }
      if(error.response.status==500){
        Alert.alert("Error", "Error occurred while transferring coins."); 
      }
      console.error(error.response);
    } finally {
      setLoading(false);
    }
};

 

  return (
    <Modal visible={visible} transparent animationType="fade" >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <Text style={styles.title}>Transfer BMVCoins</Text>
           <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
          <Text style={styles.label}>Recipient Mobile Number</Text>
          <TextInput
            placeholder="Enter 10-digit  registered mobile number"
            keyboardType="number-pad"
            maxLength={10}
            value={recipientMobile}
            onChangeText={setRecipientMobile}
            style={styles.input}
          />

          <Text style={styles.label}>
            Amount{" "}
            <Text style={styles.available}>Available: {availableCoins}</Text>
          </Text>
          <TextInput
            placeholder="Enter amount to transfer"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleTransfer()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Transfer BMVCoins</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CoinsTransferrModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: width * 0.85,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },
  available: {
    color: "#888",
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    height:60
  },
  button: {
    backgroundColor: COLORS.primary || "#6A0DAD",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
    closeButton: {
    position: "absolute",
    top: 10,
    right: 5,
    zIndex: 10,
    padding: 6,
    borderRadius: 16,
  },
});
