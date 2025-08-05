// import React, { useState, useEffect } from "react";
// import { View, Text, Button, Alert, StyleSheet,Dimensions,TouchableOpacity } from "react-native";
// import { useSelector } from "react-redux";
// import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
// import { COLORS } from "../../../../Redux/constants/theme";
// import axios from "axios";
// import BASE_URL from "../../../../Config";

// const { width } = Dimensions.get("window");

// const PaymentType = ({ selectedPaymentMode, setSelectedPaymentMode,grandTotalAmount }) => {
//   const userData = useSelector((state) => state.counter);
//   const token = userData.accessToken;
//   const customerId = userData.userId;

//   const [showCOD, setShowCOD] = useState(false);
//   const [paymentMethods, setPaymentMethods] = useState([]);

//   useEffect(() => {
//     fetchPaymentMethods();
//   }, []);

//   const fetchPaymentMethods = async () => {
//     console.log("into payment method");

//       try {
//         const response = await axios.get(
//           BASE_URL + `order-service/getCodAndOnlinePaymetStatus`
//         );
//         // console.log("Payment method response", response.data);
//         const data = response.data;
//         const paymentMethods = data.filter((item) => item.status === true);
//         // console.log("Payment methods", paymentMethods);
//         setPaymentMethods(paymentMethods);
//       } catch (error) {
//         console.log("Error fetching payment methods", error);
//       }
//   };

//     const handlePaymentModeSelect = (mode) => {
//     setSelectedPaymentMode(mode);
//     // console.log({ mode });
//   };

//   return (
//      <View
//           style={[
//             styles.paymentMethodContainer,
//             { marginTop: 20, marginBottom: 20 },
//           ]}
//         >
//           <Text style={styles.paymentHeader}>Choose Payment Method</Text>

//           {paymentMethods.some(
//                       (method) =>
//                         method.paymentStatus === "ONLINE" && method.status === true
//                     ) && (
//                       <TouchableOpacity
//                         style={[
//                           styles.paymentOption,
//                           selectedPaymentMode === "ONLINE" && styles.selectedOption,
//                         ]}
//                         onPress={() => handlePaymentModeSelect("ONLINE")}
//                       >
//                         <FontAwesome5
//                           name="credit-card"
//                           size={24}
//                           color={
//                             selectedPaymentMode === "ONLINE"
//                               ? COLORS.backgroundcolour
//                               : "black"
//                           }
//                         />
//                         <Text style={styles.optionText}>Online Payment</Text>
//                       </TouchableOpacity>
//                     )}

//           {grandTotalAmount > 100 && (
//             <View>
//               <TouchableOpacity
//                 style={styles.otherOptionContainer}
//                 onPress={() => setShowCOD(!showCOD)}
//               >
//                 <View style={styles.otherOptionTextContainer}>
//                   <Text style={styles.otherOptionText}>Other</Text>
//                   <MaterialIcons
//                     name="keyboard-arrow-right"
//                     size={24}
//                     color="black"
//                     style={styles.otherOptionIcon}
//                   />
//                 </View>
//               </TouchableOpacity>
//               <View>
//                 {showCOD &&  paymentMethods.some(
//                               (method) =>
//                                 method.paymentStatus === "COD" && method.status === true
//                             ) && (
//                               <TouchableOpacity
//                                 style={[
//                                   styles.paymentOption,
//                                   selectedPaymentMode === "COD" && styles.selectedOption,
//                                 ]}
//                                 onPress={() => handlePaymentModeSelect("COD")}
//                               >
//                                 <MaterialIcons
//                                   name="delivery-dining"
//                                   size={24}
//                                   color={
//                                     selectedPaymentMode === "COD"
//                                       ? COLORS.backgroundcolour
//                                       : "black"
//                                   }
//                                 />
//                                 <Text style={styles.optionText}>Cash on Delivery</Text>
//                               </TouchableOpacity>
//                             )}

//               </View>
//             </View>
//           )}
//         </View>
//   );
// };

// export default PaymentType;

// const styles = StyleSheet.create({
//      paymentMethodContainer: {
//     padding: 20,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     width: width * 0.9,
//     alignSelf: "center",
//   },
//     paymentHeader: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//     paymentOption: {
//       alignItems: "center",
//       padding: 16,
//       borderWidth: 1,
//       borderColor: "#ccc",
//       borderRadius: 8,
//       width: width * 0.8,
//       backgroundColor: "#c0c0c0",
//       borderRadius: 10,
//       // width: 180,
//       height: 90,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.1,
//       shadowRadius: 5,
//       elevation: 4,
//       marginBottom: 15,
//       marginTop: 10,
//     },
//     paymentOptions: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       marginBottom: 20,
//     },

//   selectedOption: {
//     borderColor: COLORS.services,
//     borderWidth: 2,
//   },
//   selectedOption: {
//     borderColor: COLORS.services,
//     backgroundColor: "#e6f7ff"
//  },
//   optionText: {
//     fontSize: 16,
//     marginTop: 8,
//     width: 150,
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//    otherOptionTextContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginLeft: 10,
//     justifyContent: "space-between",
//     width: width * 0.7,
//   },
//   otherOptionIcon: {
//     fontSize: 24,
//     color: "#333",
//     alignSelf: "flex-end",
//   },
//   otherOptionText: {
//     fontSize: 16,
//     color: "#333",
//     marginLeft: 10,
//     fontWeight: "bold",
//     alignSelf: "flex-start",
//   },
//     otherOptionContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     width: width * 0.8,
//     paddingHorizontal: 10,
//     marginLeft: 5,
//   },

// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../../../Redux/constants/theme";
import axios from "axios";
import BASE_URL from "../../../../../../Config";

const { width, height } = Dimensions.get("window");

const PaymentType = ({
  selectedPaymentMode,
  setSelectedPaymentMode,
  grandTotalAmount,
  confirmPayment,
  loading,
}) => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;

  const [showCOD, setShowCOD] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    // console.log("into payment method");
    try {
      const response = await axios.get(
        BASE_URL + `order-service/getCodAndOnlinePaymetStatus`
      );
      const data = response.data;
      const paymentMethods = data.filter((item) => item.status === true);
      setPaymentMethods(paymentMethods);
    } catch (error) {
      console.log("Error fetching payment methods", error);
    }
  };

  const handlePaymentModeSelect = (mode) => {
    setSelectedPaymentMode(mode);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.fixedBottomContainer}>
      {/* Expandable Payment Methods Section */}
      {isExpanded && (
        <View style={styles.expandedPaymentSection}>
          <ScrollView
            style={styles.paymentScrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.paymentMethodContainer}>
              <Text style={styles.paymentHeader}>Choose Payment Method</Text>

              {/* Online Payment Option */}
              {paymentMethods.some(
                (method) =>
                  method.paymentStatus === "ONLINE" && method.status === true
              ) && (
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    selectedPaymentMode === "ONLINE" && styles.selectedOption,
                  ]}
                  onPress={() => {
                    handlePaymentModeSelect("ONLINE");
                    setIsExpanded(false);
                  }}
                >
                  <FontAwesome5
                    name="credit-card"
                    size={20}
                    color={
                      selectedPaymentMode === "ONLINE"
                        ? COLORS.backgroundcolour
                        : "black"
                    }
                  />
                  <Text style={styles.optionText}>Online Payment</Text>
                </TouchableOpacity>
              )}

              {/* COD Option */}
              {grandTotalAmount > 100 &&
                paymentMethods.some(
                  (method) =>
                    method.paymentStatus === "COD" && method.status === true
                ) && (
                  <TouchableOpacity
                    style={[
                      styles.paymentOption,
                      selectedPaymentMode === "COD" && styles.selectedOption,
                    ]}
                    onPress={() => {
                      handlePaymentModeSelect("COD");
                      setIsExpanded(false);
                    }}
                  >
                    <MaterialIcons
                      name="delivery-dining"
                      size={20}
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
          </ScrollView>
        </View>
      )}

      {/* Main Bottom Tab */}
      <View style={styles.bottomTab}>
        {/* Payment Method Selector */}
        <TouchableOpacity style={styles.paymentSelector} onPress={toggleExpand}>
          <View style={styles.paymentSelectorContent}>
            <View style={styles.paymentSelectorLeft}>
              {selectedPaymentMode === "ONLINE" ? (
                <FontAwesome5
                  name="credit-card"
                  size={16}
                  color={COLORS.services}
                />
              ) : selectedPaymentMode === "COD" ? (
                <MaterialIcons
                  name="delivery-dining"
                  size={16}
                  color={COLORS.services}
                />
              ) : (
                <MaterialIcons name="payment" size={16} color="#666" />
              )}
              <Text style={styles.paymentSelectorText}>
                {selectedPaymentMode === "ONLINE"
                  ? "Online Payment"
                  : selectedPaymentMode === "COD"
                  ? "Cash on Delivery"
                  : "Select Payment"}
              </Text>
            </View>
            <MaterialIcons
              name={isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-up"}
              size={20}
              color="#666"
            />
          </View>
        </TouchableOpacity>

        {/* Total and Place Order Section */}
        <View style={styles.orderSection}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₹{grandTotalAmount}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.placeOrderButton,
              !selectedPaymentMode && styles.disabledButton,
            ]}
            onPress={confirmPayment}
            disabled={loading || !selectedPaymentMode}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.placeOrderText}>Place Order</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedBottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  expandedPaymentSection: {
    maxHeight: height * 0.4,
    backgroundColor: "#f8f9fa",
  },
  paymentScrollView: {
    maxHeight: height * 0.35,
  },
  paymentMethodContainer: {
    padding: 15,
    backgroundColor: "#f8f9fa",
  },
  paymentHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    borderColor: COLORS.services || "#007bff",
    backgroundColor: "#e6f3ff",
    borderWidth: 2,
  },
  optionText: {
    fontSize: 14,
    marginLeft: 12,
    fontWeight: "500",
    color: "#333",
  },
  bottomTab: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  paymentSelector: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  paymentSelectorContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentSelectorLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentSelectorText: {
    fontSize: 14,
    marginLeft: 8,
    color: "#333",
    fontWeight: "500",
  },
  orderSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalSection: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeOrderButton: {
    backgroundColor: COLORS.services || "#007bff",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PaymentType;
