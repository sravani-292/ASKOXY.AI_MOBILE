import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions
} from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import BASE_URL from "../../../../Config";
const {width, height} = Dimensions.get("window");
const OrderSummaryScreen = ({ navigation, route }) => {
  console.log("Order Summary",route)
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState([]);
  const [user,setUser] = useState();
  const[totalAmount,setTotalAmount]=useState('')

  useFocusEffect(
    useCallback(() => {
      fetchCartItems()
      getProfile()
      console.log("from checkout screen", route.params.addressData);
      setAddress(route.params.addressData);
    }, [])
  );

  const fetchCartItems = async () => {
    console.log("3456789034567-90=98403902189`78654567389507");
    setLoading(true)
    try {
      const response = await fetch(
        BASE_URL +
        `cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );
      console.log("cart response",response.data.customerCartResponseList);
      
      const data = response.data.customerCartResponseList;
      setCartItems(data);
      console.log("cartItems",data);
      
      setLoading(false)
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setLoading(false) 
    } finally {
      setLoading(false);
    }
  };


  const getProfile = async () => {
    // const mobile_No = AsyncStorage.getItem('mobileNumber');
   console.log("sreeja")
    try {
      const response = await axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        url:
          BASE_URL +
          `user-service/customerProfileDetails?customerId=${customerId}`,
      });
      // console.log(response.data);

      if (response.status === 200) {
        console.log("customerProfileDetails",response.data);
        setUser(response.data);
       
      }
      // showToast(response.data.msg || 'Profile loaded successfully');
    } catch (error) {
      console.error(error);
      showToast("Error loading profile");
    }
  };
  
 
  const formatOrderDetails = () => {
    let orderDetails = "📦 *Order Summary* 📦\n\n";
  
    // Define column headers with proper spacing
    orderDetails += `Item Name               Quantity   Price\n`;
    orderDetails += `${"-".repeat(45)}\n`;
  
    // Format each cart item with dynamic spacing
    cartItems.forEach((item) => {
      const maxItemNameLength = 20;
      const itemName = item.itemName.length > maxItemNameLength
        ? `${item.itemName.substring(0, maxItemNameLength)}...`
        : item.itemName;
  
      const quantity = item.cartQuantity.toString();
      const price = `₹${item.priceMrp.toFixed(2)}`;
  
      // Add formatted item details with consistent spacing
      orderDetails += `${itemName.padEnd(22)} ${quantity.padStart(8)} ${price.padStart(10)}\n`;
    });
  
    // Calculate total price
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.priceMrp * item.cartQuantity,
      0
    );
  
    // Add summary section
    orderDetails += `${"-".repeat(45)}\n`;
    orderDetails += `🔢 Total Items: ${cartItems.length.toString().padStart(29)}\n`;
    orderDetails += `💸 Total Price: ₹${totalAmount.toFixed(2).padStart(10)}\n`;
    // console.log(totalAmount)
    return orderDetails;
  };
  



  // const handleContinuePress = () => {
  //   console.log("user", user);
  //     const orderDetails = formatOrderDetails();
  //     Alert.alert(
  //       "Confirm Order",
  //       orderDetails,
  //       [
  //         {
  //           text: "Cancel",
  //           style: "cancel",
  //         },
  //         {
  //           text: "Confirm",
  //           onPress: () =>
  //             navigation.navigate("Payment Details", {
  //               items: cartItems,
  //               address: address,
  //             }),
  //         },
  //       ]
  //     );
   
  // };
  const handleContinuePress = () => {
    navigation.navigate("Payment Details", {
      items: cartItems,
      address: address,
    });
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.progressTracker}>
        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.completedStep]}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={styles.stepLabel}>Address</Text>
        </View>
        <View style={styles.connector} />
        <View style={styles.step}>
          <View style={[styles.stepCircle, styles.activeStepCircle]}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={[styles.stepLabel, styles.activeStepLabel]}>
            Order Summary
          </Text>
        </View>
        <View style={styles.connector} />
        <View style={styles.step}>
          <View style={styles.stepCircle}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Payment</Text>
        </View>
      </View>

     
   <View style={styles.addressSection}>
  <View style={styles.addressRow}>
    <Icon name="map-marker" size={20} color="#000" style={styles.addressIcon} />
    <Text style={styles.flatNoText}>{address.flatNo}</Text>
  </View>
  {/* <View style={styles.addressDetailsContainer}> */}
  <View style={{flexDirection:"row",width:width*0.8}}>
    <Text style={styles.addressDetails}>{address.landMark} ,</Text>
    <Text style={styles.addressDetails}> {address.address} ,</Text>
    <Text style={styles.addressDetails}> {address.pincode}</Text>
  </View>
</View>


      {loading ? (
        <ActivityIndicator size="large" color="#fd7e14" style={styles.loader} />
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.cartId.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image
                source={{
                  uri: item.image || "https://via.placeholder.com/150",
                }}
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text>
                 Quantity : <Text> { item.cartQuantity} </Text>
                </Text>
                <Text>Weight :<Text> {item.itemQuantity} kgs</Text></Text>
                <Text>Price: <Text>{item.cartQuantity} x {item.itemPrice} </Text></Text>
                <Text>Total Price : ₹{item.cartQuantity  * item.itemPrice}</Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
        />
      )}

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinuePress}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  progressTracker: { flexDirection: "row", justifyContent: "space-around" },
  activeStep: { fontWeight: "bold", color: "#fd7e14" },

  changeText: { color: "blue", marginTop: 8 },
  loader: { marginVertical: 20 },
  cartItem: {
    flexDirection: "row",
    marginVertical: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  itemImage: { width: 100, height: 60, marginRight: 16, borderRadius: 8 },
  itemDetails: { flex: 1, justifyContent: "center" },
  itemName: { fontWeight: "bold", marginBottom: 4 },
  continueButton: {
    padding: 16,
    // backgroundColor: "blue",
    backgroundColor: "#fd7e14",
    alignItems: "center",
    marginTop: 16,
  },
  continueText: { color: "#fff", fontWeight: "bold" },
  progressTracker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  step: {
    alignItems: "center",
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  completedStep: {
    backgroundColor: "green",
  },
  activeStepCircle: {
    backgroundColor: "#fd7e14",
    borderWidth: 2,
    borderColor: "#fd7e14",
  },
  stepNumber: {
    color: "#fff",
    fontWeight: "bold",
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
  },
  activeStepLabel: {
    color: "#999",
    fontWeight: "bold",
  },
  connector: {
    height: 2,
    backgroundColor: "#ddd",
    flex: 1,
    marginHorizontal: 8,
  },
  addressIcon: {
    marginRight: 10,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    // flex:1
  },
  addressSection: {
    width:width*0.9,
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical:5,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addressIcon: {
    marginRight: 10,
  },
  flatNoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  addressDetailsContainer: {
    marginLeft: 30, 
  },
  addressDetails: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2, 
  },
});

export default OrderSummaryScreen;