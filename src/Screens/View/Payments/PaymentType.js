import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet,Dimensions,TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../Redux/constants/theme";
import axios from "axios";
import BASE_URL from "../../../../Config";

const { width } = Dimensions.get("window");

const PaymentType = ({ selectedPaymentMode, setSelectedPaymentMode,grandTotalAmount }) => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;

  const [showCOD, setShowCOD] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    console.log("into payment method");
  
      try {
        const response = await axios.get(
          BASE_URL + `order-service/getCodAndOnlinePaymetStatus`
        );
        // console.log("Payment method response", response.data);
        const data = response.data;
        const paymentMethods = data.filter((item) => item.status === true);
        // console.log("Payment methods", paymentMethods);
        setPaymentMethods(paymentMethods);
      } catch (error) {
        console.log("Error fetching payment methods", error);
      }
  };

    const handlePaymentModeSelect = (mode) => {
    setSelectedPaymentMode(mode);
    // console.log({ mode });
  };


  return (
     <View
          style={[
            styles.paymentMethodContainer,
            { marginTop: 20, marginBottom: 20 },
          ]}
        >
          <Text style={styles.paymentHeader}>Choose Payment Method</Text>
         

          {paymentMethods.some(
                      (method) =>
                        method.paymentStatus === "ONLINE" && method.status === true
                    ) && (
                      <TouchableOpacity
                        style={[
                          styles.paymentOption,
                          selectedPaymentMode === "ONLINE" && styles.selectedOption,
                        ]}
                        onPress={() => handlePaymentModeSelect("ONLINE")}
                      >
                        <FontAwesome5
                          name="credit-card"
                          size={24}
                          color={
                            selectedPaymentMode === "ONLINE"
                              ? COLORS.backgroundcolour
                              : "black"
                          }
                        />
                        <Text style={styles.optionText}>Online Payment</Text>
                      </TouchableOpacity>
                    )}

          {grandTotalAmount > 100 && (
            <View>
              <TouchableOpacity
                style={styles.otherOptionContainer}
                onPress={() => setShowCOD(!showCOD)}
              >
                <View style={styles.otherOptionTextContainer}>
                  <Text style={styles.otherOptionText}>Other</Text>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={24}
                    color="black"
                    style={styles.otherOptionIcon}
                  />
                </View>
              </TouchableOpacity>
              <View>
                {showCOD &&  paymentMethods.some(
                              (method) =>
                                method.paymentStatus === "COD" && method.status === true
                            ) && (
                              <TouchableOpacity
                                style={[
                                  styles.paymentOption,
                                  selectedPaymentMode === "COD" && styles.selectedOption,
                                ]}
                                onPress={() => handlePaymentModeSelect("COD")}
                              >
                                <MaterialIcons
                                  name="delivery-dining"
                                  size={24}
                                  color={
                                    selectedPaymentMode === "COD"
                                      ? COLORS.backgroundcolour
                                      : "black"
                                  }
                                />
                                <Text style={styles.optionText}>Cash on Delivery</Text>
                              </TouchableOpacity>
                            )} 
                  
              </View>
            </View>
          )} 
        </View>
  );
};


export default PaymentType;


const styles = StyleSheet.create({
     paymentMethodContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: width * 0.9,
    alignSelf: "center",
  },
    paymentHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
    paymentOption: {
      alignItems: "center",
      padding: 16,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      width: width * 0.8,
      backgroundColor: "#c0c0c0",
      borderRadius: 10,
      // width: 180,
      height: 90,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 4,
      marginBottom: 15,
      marginTop: 10,
    },
    paymentOptions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    

  selectedOption: {
    borderColor: COLORS.services,
    borderWidth: 2,
  },
  selectedOption: { 
    borderColor: COLORS.services, 
    backgroundColor: "#e6f7ff" 
 },
  optionText: {
    fontSize: 16,
    marginTop: 8,
    width: 150,
    textAlign: "center",
    fontWeight: "bold",
  },
   otherOptionTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    justifyContent: "space-between",
    width: width * 0.7,
  },
  otherOptionIcon: {
    fontSize: 24,
    color: "#333",
    alignSelf: "flex-end",
  },
  otherOptionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
    otherOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: width * 0.8,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  
});
