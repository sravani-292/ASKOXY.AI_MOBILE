 import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Linking,
  Image,
  Alert,
  TextInput,
  Dimensions,
  ScrollView,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { RadioButton, Checkbox, ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import encryptEas from "../../../Screens/View/Payments/components/encryptEas";
import decryptEas from "../../../Screens/View/Payments/components/decryptEas";
import { COLORS } from "../../../../Redux/constants/theme"
import BASE_URL,{userStage}from "../../../../Config";
import { err } from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";
const { width, height } = Dimensions.get("window");

const PaymentDetails = ({ navigation, route }) => {
  // console.log("payment screen", route.params);
    // "totalGstSum": 0, "totalSum": 1295, "totalSumWithGstSum": 1295,

  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const [transactionId, setTransactionId] = useState();
  const [couponCode, setCouponCode] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("1");
  // const [totalAmount, setTotalAmount] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const [coupenDetails, setCoupenDetails] = useState("");
  const [coupenApplied, setCoupenApplied] = useState(false);
  const [walletTotal, setWalletTotal] = useState("");
  const [deliveryBoyFee,setDeliveryBoyFee] = useState(0);
  // wallet states
  const [useWallet, setUseWallet] = useState(false);
  const [totalSum, setTotalSum] = useState("");
  const [walletAmount, setWalletAmount] = useState();
  const [status, setStatus] = useState();
  const [totalGstSum,setTotalGstSum] =useState();
  const [grandTotalAmount, setGrandTotalAmount] = useState();
  const [subTotal,setSubTotal] = useState()
  const [message, setMessge] = useState();
  const [cartData,setCartData] = useState();
  const [usedWalletAmount,setUsedWalletAmount] = useState();
  const [afterWallet,setAfterWallet]=useState();
  const [profileForm, setProfileForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const items = route.params?.items || [];


  const totalCart = async () => {
    try {
      const response = await axios({
        url:
          userStage == "test1"
            ? BASE_URL + "erice-service/cart/cartItemData"
            : BASE_URL + "cart-service/cart/cartItemData",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          customerId: customerId,
        },
      });
      //  console.log("cart",response.data);
       
        const cartResponse = response.data.cartResponseList;
        // console.log("cart response",cartResponse);
         setCartData(cartResponse);
       const totalDeliveryFee = response.data?.cartResponseList.reduce((sum, item) => sum + item.deliveryBoyFee, 0);
        // console.log({totalDeliveryFee});
        setTotalGstSum(response.data.totalGstSum)
        setDeliveryBoyFee(totalDeliveryFee)
        setGrandTotal(response.data.totalSumWithGstSum)
    } catch (error) {
      // setError("Failed to fetch cart data");
    }
  };
  
  var addressDetails = route.params.address;

  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);

  var calculatedTotal;
  useEffect(() => {
    calculatedTotal = items.reduce(
      (total, item) => total + item.cartQuantity * item.itemPrice,
      0
    );
    console.log(
      "grand total",
      items.reduce(
        (total, item) => total + item.cartQuantity * item.itemPrice,
        0
      )
    );
    // console.log("calculated total", calculatedTotal);
    // setTotalAmount(calculatedTotal);
    setSubTotal(calculatedTotal);
    grandTotalfunc()
  }, [items]);

  const handlePaymentModeSelect = (mode) => {
    setSelectedPaymentMode(mode);
    // console.log({ mode });
  };

  const deleteCoupen = () => {
    setCouponCode("");
    setCoupenApplied(false);
    // setTotalAmount(calculatedTotal);
    // console.log("coupen removed");
    Alert.alert("coupen removed successfully");
  };

  const confirmPayment = () => {
    if (selectedPaymentMode == null || selectedPaymentMode == "") {
      Alert.alert("Please select payment method");
      return
    } else {
      handleOrderConfirmation();
    }
  };

  const validateCartBeforeCheckout = (cartItems, navigation) => {
    let insufficientStockItems = [];

    cartItems.forEach(item => {
        if (item.cartItemQuantity > item.quantity) {
            insufficientStockItems.push(
                `${item.itemName}: Only ${item.quantity} left, but you added ${item.cartItemQuantity}`
            );
        }
    });

    if (insufficientStockItems.length > 0) {
        Alert.alert(
            "Insufficient Stock",
            "Some items in your cart have insufficient stock:\n" + insufficientStockItems.join("\n"),
            [
                { text: "OK", onPress: () => {  navigation.navigate("Home",{screen:"My Cart"}) }}
            ]
        );
        return false; 
    }

    return true; 
};


  const handleOrderConfirmation = () => {
    // console.log("Cart Data payment :", cartData); 
    
    if (!cartData || cartData.length === 0) {
        // console.log("cartData is empty or undefined");
        return;
    }
    const zeroQuantityItems = cartData
      .filter(item => item.quantity === 0)
      .map(item => item.itemName); 
  
    if (zeroQuantityItems.length > 0) {
      
      const itemNames = zeroQuantityItems.join(", ");
      Alert.alert(
        "Sorry for the inconvenience",
        `We noticed that the following items in your cart have zero quantity: ${itemNames}. 
      
         Please update or remove them before proceeding with your order.`,
        [
          {  onPress: () =>  navigation.navigate("Home",{screen:"My Cart"}), 
           } 
        ]
      );
      return; 
    }
    else if(!validateCartBeforeCheckout(cartData)){
      return;
    }
    else{
    placeOrder();
    }
  };

  useEffect(() => {
    getProfile();
    getOffers();
    getWalletAmount();
    totalCart();
    // setDeliveryBoyFee(200);
  }, [grandTotalAmount, deliveryBoyFee]);

  // get wallet amount
  const getWalletAmount = async () => {
    try {
      const response = await axios.post(
        userStage=="test1"?
        BASE_URL + `erice-service/cart/applyWalletAmountToCustomer`:BASE_URL+`order-service/applyWalletAmountToCustomer`,
        {
          customerId: customerId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        // console.log("==========useWallet=============");
        // console.log("getWalletAmount:", response.data);
        setWalletAmount(response.data.usableWalletAmountForOrder);
        // console.log("wallet amount", walletAmount);
        setMessge(response.data.message);
        setTotalSum(response.data.totalSum);
        setStatus();
        setWalletTotal(
          grandTotal - response.data.usableWalletAmountForOrder
        );
        // console.log("wallet total", walletTotal);
        // console.log("==========useWallet=============");
      }
    } catch (error) {
      console.error(
        "Error applying wallet amount:",
        error.response?.data || error.message
      );
    }
  };

 
  // Handle checkbox toggle
  const handleCheckboxToggle = () => {
    const newValue = !useWallet;
    // console.log({ newValue });
    setUseWallet(newValue);
    getWalletAmount();

    if (newValue) {
      Alert.alert(
        "Wallet Amount Used",
        `You are using ${walletAmount} from your wallet.`,
        [
          {
            text: "OK",
          },
        ]
      );
    } else {
      Alert.alert(
        "Wallet Amount Deselected",
        `You have removed the usage of ${walletAmount} from your wallet.`,
        [
          {
            text: "OK",
          },
        ]
      );
    }
  };

  const getProfile = async () => {
    try {
      const response = await axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
         url: userStage =="test1"?
                        BASE_URL +
                        `erice-service/user/customerProfileDetails?customerId=${customerId}`:BASE_URL+`user-service/customerProfileDetails?customerId=${customerId}`,
      });
      // console.log(response.data);

      if (response.status === 200) {
        // console.log(response.data);
        setProfileForm({
          customer_name: response.data.name,
          customer_email: response.data.email,
          customer_mobile: response.data.mobileNumber,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  var postData;


  const placeOrder = () => {
    if(loading==true){
      return;
    }
    // console.log({ selectedPaymentMode });
    let wallet;
    if (useWallet) {
      wallet = walletAmount;
    } else {
      wallet = null;
    }
    let coupon, coupenAmount;
    if (coupenApplied && coupenDetails > 0) {
      coupon = couponCode.toUpperCase();
      coupenAmount = coupenDetails;
    } else {
      coupon = null;
      coupenAmount = 0;
    }
    postData = {
      address: addressDetails.address,
      amount: grandTotalAmount,
      customerId: customerId,
      flatNo: addressDetails.flatNo,
      landMark: addressDetails.landMark,
      orderStatus: selectedPaymentMode,
      pincode: addressDetails.pincode,
      walletAmount: usedWalletAmount,
      couponCodeUsed: coupon,
      couponCodeValue: coupenDetails,
      deliveryBoyFee:deliveryBoyFee,
      subTotal:subTotal,
      gstAmount:totalGstSum
    };

    // console.log({ postData });
    // console.log("postdata", postData);

    setLoading(true);
    axios({
      method: "POST",
      url: userStage=="test1"?BASE_URL+"erice-service/checkout/orderPlacedPaymet":BASE_URL+"order-service/orderPlacedPaymet",
      data: postData,
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("Order Placed Response:", response.data);
        if (response.data.status) {
          Alert.alert(
            "Sorry",
            response.data.status,
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("Home",{screen:"My Cart"}), 
              },
            ]
          );
          return;
        }
        // Handle COD or other payment types here
        if (selectedPaymentMode === null || selectedPaymentMode === "COD") {
          Alert.alert(
            "Order Confirmed!",
            "Your order has been placed successfully . Thank you for shopping with us!",
            [
              {
                text: "OK",
                onPress: () => {
                  setLoading(false); 
                  navigation.navigate("My Orders");
                },
              },
            ]
          );
          // setLoading(false);
        
        } else {
          console.log("paymentId==================", response.data);
          setTransactionId(response.data.paymentId);
          // onlinePaymentFunc()
          // console.log("==========");
          const data = {
            mid: "1152305",
            // amount: grandTotalAmount,
            amount: 1,
            merchantTransactionId: response.data.paymentId,
            transactionDate: new Date(),
            terminalId: "getepay.merchant128638@icici",
            udf1: profileForm.customer_mobile,
            udf2: profileForm.customer_name,
            udf3: profileForm.customer_email,
            udf4: "",
            udf5: "",
            udf6: "",
            udf7: "",
            udf8: "",
            udf9: "",
            udf10: "",
            ru: "https://app.oxybricks.world/interact/paymentreturn",
            callbackUrl:
              "https://fintech.oxyloans.com/oxyloans/v1/user/getepay",
            currency: "INR",
            paymentMode: "ALL",
            bankId: "",
            txnType: "single",
            productType: "IPG",
            txnNote: "Rice Order In Live",
            vpa: "Getepay.merchant129014@icici",
          };
          // console.log({ data });
          getepayPortal(data);
        }

        
      })
      .catch((error) => {
        console.error("Order Placement Error:", error.response);
        Alert.alert("Error", error.response.data.error);
        setLoading(false);
      });
  };

  useEffect(() => {
    // console.log("djhftghngdxhkjhfghjcvyhds");
    if (
      paymentStatus == "PENDING" ||
      paymentStatus == "" ||
      paymentStatus == null || paymentStatus == "INITIATED"
    ) {
      const data = setInterval(() => {
        Requery(paymentId);
      }, 4000);
      return () => clearInterval(data);
    } else {
    }
  }, [paymentStatus, paymentId]);

  const getepayPortal = async (data) => {
    console.log("getepayPortal", data);
    const JsonData = JSON.stringify(data);
    console.log("ytfddd");

    var ciphertext = encryptEas(JsonData);
    var newCipher = ciphertext.toUpperCase();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      mid: data.mid,
      terminalId: data.terminalId,
      req: newCipher,
    });
    console.log("========");
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    await fetch(
      "https://portal.getepay.in:8443/getepayPortal/pg/generateInvoice",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        //  console.log("===getepayPortal result======")
        //  console.log("result",result);
        var resultobj = JSON.parse(result);
        // console.log(resultobj);
        var responseurl = resultobj.response;
        var data = decryptEas(responseurl);
        console.log("===getepayPortal data======");
        console.log(data);
        data = JSON.parse(data);
        setPaymentId(data.paymentId);
        // paymentID = data.paymentId
        Alert.alert(
          "Cart Summary",
          `The total amount for your cart is ₹${grandTotalAmount.toFixed(
            2
          )}. Please proceed to checkout to complete your purchase.`,
          [
            {
              text: "No",
              onPress: () => {},
            },
            {
              text: "yes",
              onPress: () => {
                Linking.openURL(data.qrIntent);
                Requery(data.paymentId);
                setPaymentStatus(null)
              },
            },
          ]
        );
      })
      .catch((error) =>{ console.log("getepayPortal", error.response)
        setLoading(false)
      });
  };

  const getOffers = async () => {
    setLoading(true);
    try {
      // Updated API URL and headers
      const response = await axios.get(
        userStage=="test1"?
        BASE_URL + "erice-service/coupons/getallcoupons":BASE_URL+"order-service/getAllCoupons",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };
  //for applying coupen
  const handleApplyCoupon = () => {
    const data = {
      couponCode: couponCode.toUpperCase(),
      customerId: customerId,
      subTotal: subTotal,
    };
    // console.log("Total amount is  :", subTotal);

    const response = axios
      .post( userStage == "test1"?BASE_URL + "erice-service/coupons/applycoupontocustomer":BASE_URL+"order-service/applycoupontocustomer", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log("coupen applied", response.data);
        const { discount, grandTotal } = response.data;
        // setGrandTotal(grandTotal);
        setCoupenDetails(discount);
        Alert.alert(response.data.message);
        setCoupenApplied(response.data.couponApplied);
        // console.log("coupenapplied state", response.data.couponApplied);
      })
      .catch((error) => {
        console.log("error", error.response);
      });
  };

  function Requery(paymentId) {
    console.log("requery");
    
    // setLoading(true);
    if (
      paymentStatus === "PENDING" ||
      paymentStatus === "" ||
      paymentStatus === null || paymentStatus === "INITIATED"
    ) {
      // console.log("Before.....",paymentId)

      const Config = {
        "Getepay Mid": 1152305,
        "Getepay Terminal Id": "getepay.merchant128638@icici",
        "Getepay Key": "kNnyys8WnsuOXgBlB9/onBZQ0jiYNhh4Wmj2HsrV/wY=",
        "Getepay IV": "L8Q+DeKb+IL65ghKXP1spg==",
      };

      const JsonData = {
        mid: Config["Getepay Mid"],
        paymentId: parseInt(paymentId),
        referenceNo: "",
        status: "",
        terminalId: Config["Getepay Terminal Id"],
        vpa: "",
      };

      var ciphertext = encryptEas(
        JSON.stringify(JsonData),
        Config["Getepay Key"],
        Config["Getepay IV"]
      );

      var newCipher = ciphertext.toUpperCase();

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Cookie",
        "AWSALBAPP-0=remove; AWSALBAPP-1=remove; AWSALBAPP-2=remove; AWSALBAPP-3=remove"
      );

      var raw = JSON.stringify({
        mid: Config["Getepay Mid"],
        terminalId: Config["Getepay Terminal Id"],
        req: newCipher,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "https://portal.getepay.in:8443/getepayPortal/pg/invoiceStatus",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          var resultobj = JSON.parse(result);
          if (resultobj.response != null) {
            console.log("Requery ID result", paymentId);
            var responseurl = resultobj.response;
            console.log({ responseurl });
            var data = decryptEas(responseurl);
            data = JSON.parse(data);
            console.log("Payment Result", data);
            setPaymentStatus(data.paymentStatus);
            console.log(data.paymentStatus);
            if (
              data.paymentStatus == "SUCCESS" ||
              data.paymentStatus == "FAILED"
            ) {
              // clearInterval(intervalId); 294182409
              axios({
                method: "POST",
                url: userStage=="test1"?BASE_URL + "erice-service/checkout/orderPlacedPaymet":BASE_URL
                +"order-service/orderPlacedPaymet",
                data: {
                  ...postData,
                  paymentId: transactionId,
                  paymentStatus: data.paymentStatus,
                },
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
                .then((secondResponse) => {
                  console.log(
                    "Order Placed with Payment API:",
                    secondResponse.data
                  );
                  Alert.alert(
                    "Order Confirmed!",
                    "Your order has been placed successfully . Thank you for shopping with us!",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          setLoading(false); 
                          navigation.navigate("My Orders");
                        },
                      },
                    ]
                  );
                })
                .catch((error) => {
                  console.error("Error in payment confirmation:", error);
                  setLoading(false)
                });
            } else {
              setLoading(false)
            }
          }
        })
        .catch((error) => {console.log("Payment Status", error)
          setLoading(false)
        });
    }
   
  }

  // function grandTotalfunc() {
  //   if (coupenApplied === true && useWallet === true) {
  //     // Alert.alert("Coupen and useWallet Applied",(grandTotal-billAmount))
  //     setGrandTotalAmount(grandTotal - (coupenDetails + walletAmount)+deliveryBoyFee+totalGstSum);
  //     console.log(
  //       "grans total after wallet and coupen",
  //       grandTotal,
  //       coupenDetails,
  //       walletAmount,
  //       grandTotal - (coupenDetails + walletAmount)
  //     );
  //   } else if (coupenApplied === true || useWallet === true) {
  //     if (coupenApplied === true) {
  //       setGrandTotalAmount((grandTotal+deliveryBoyFee) - coupenDetails);
  //       // Alert.alert("Coupen Applied",grandTotal)
  //       console.log({ grandTotal });

  //       console.log(grandTotal - coupenDetails);
  //     }
  //     if (useWallet === true) {
  //       console.log("wal;let",walletTotal);
        
  //       setGrandTotalAmount(walletTotal+deliveryBoyFee);
  //       console.log(walletAmount);

  //       // Alert.alert("Wallet Applied",(grandTotal-walletAmount))
  //     }
  //   } else {
  //     setGrandTotalAmount(subTotal+deliveryBoyFee+totalGstSum);
  //     // Alert.alert("None",totalAmount)
  //   }
  // }


  function grandTotalfunc() {
    let total = grandTotal + deliveryBoyFee; // Start with total including delivery fee
    let usedWallet = 0; // Track how much wallet is actually used

    if (coupenApplied) {
        total -= coupenDetails;
    }

    if (useWallet && walletAmount > 0) {  // Process only if user has wallet balance
        if (walletAmount >= total) {
            usedWallet = total;  // Use only what's needed
            total = 0;  
        } else {
            usedWallet = walletAmount; // Use full wallet balance
            total -= walletAmount;
        }
    }

    // Ensure total is never negative
    total = Math.max(0, total);

    setAfterWallet(walletAmount ? walletAmount - usedWallet : 0); // Update remaining wallet balance
    setUsedWalletAmount(usedWallet);  // Store how much wallet is used
    setGrandTotalAmount(total);

    if(total === 0){
      // console.log("Get all Values",{total});
      
      setSelectedPaymentMode('COD');
    }

    // console.log("Used Wallet:", usedWallet);
    // console.log("Final Grand Total:", total);
}

  useEffect(() => {
    grandTotalfunc();
  }, [coupenApplied, useWallet, grandTotalAmount,grandTotal,deliveryBoyFee,totalGstSum]);

  return (
    <View style={styles.container}>
      {/* Apply Coupon Section */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.cardHeader}>Apply Coupon</Text>
          </View>
          <View style={styles.couponRow}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
              editable={!coupenApplied}
            />
            {coupenApplied == true ? (
              <TouchableOpacity
                style={styles.delete}
                onPress={() => deleteCoupen()}
              >
                <Text
                  style={{
                    color: "#fd7e14",
                    fontSize: 15,
                    fontStyle: "normal",
                    fontWeight: "bold",
                  }}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => handleApplyCoupon()}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
         {/* wallet amount */}
        {walletAmount > 0 ? (
          <View style={styles.walletContainer}>
            <View style={styles.walletHeader}>
              <Checkbox
                status={useWallet ? "checked" : "unchecked"}
                onPress={handleCheckboxToggle}
                color="#00bfff"
                uncheckedColor="#ccc"
              />
              <Text style={styles.checkboxLabel}>Use Wallet Balance</Text>
            </View>
            <Text style={styles.walletMessage}>
              You can use up to{" "}
              <Text style={styles.highlight}>₹{walletAmount}</Text> from your
              wallet for this order.
            </Text>
          </View>
        ) : (
          <View style={styles.wallet}>
            <Text style={styles.label}>Note:</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
        )}
        {/* Payment Methods */}
        <Text style={styles.paymentHeader}>Choose Payment Method</Text>
        <View style={styles.paymentOptions}>
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
              color={selectedPaymentMode === "ONLINE" ? COLORS.backgroundcolour : "black"}
            />
            <Text style={styles.optionText}>Online Payment</Text>
          </TouchableOpacity>
          {grandTotalAmount != 1?(
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
              color={selectedPaymentMode === "COD" ? COLORS.backgroundcolour : "black"}
            />
            <Text style={styles.optionText}>Cash on Delivery</Text>
          </TouchableOpacity>
          ):null}
        </View>

        {/* Payment Details */}
        <View style={styles.paymentDetails}>
          <Text style={styles.detailsHeader}>Payment Details</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.detailsLabel}>Sub Total</Text>
            <Text style={styles.detailsValue}>₹{subTotal}</Text>
          </View>

          {coupenApplied == true && (
            <View style={styles.paymentRow}>
              <Text style={styles.detailsLabel}>Coupon Applied</Text>
              <Text style={styles.detailsValue}>-₹{coupenDetails}</Text>
            </View>
          )}
          {useWallet == true && (
            <View style={styles.paymentRow}>
              <Text style={styles.detailsLabel}>from Wallet</Text>
              <Text style={styles.detailsValue}>-₹{usedWalletAmount}</Text>
            </View>
          )}
          <View style={styles.paymentRow}>
            <Text style={styles.detailsLabel}>Delivery Fee</Text>
            <Text style={styles.detailsValue}>+₹{deliveryBoyFee}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.detailsLabel}>GST</Text>
            <Text style={styles.detailsValue}>+₹{totalGstSum}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.paymentRow}>
            <Text style={styles.detailsLabelBold}>Grand Total</Text>
            {/* <Text style={styles.detailsValueBold}>₹{grandTotalAmount+deliveryBoyFee}</Text> */}
            <Text style={styles.detailsValueBold}>₹{grandTotalAmount}</Text>

          </View>
      

          {loading == true ? (
            <View style={styles.confirmButton}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmPayment}
            >
              <Text style={styles.confirmText}>Confirm Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  orderDetails: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 8,
  },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemQuantity: { fontSize: 14, color: "#555" },
  itemPrice: { fontSize: 16, fontWeight: "bold" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 8,
  },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalAmount: { fontSize: 18, fontWeight: "bold", color: "green" },
  paymentHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  paymentOptions: {
    width: width * 0.7,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    marginVertical: 20,
    padding: 10,
    backgroundColor: "#4DA1A9",
    borderRadius: 12,
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6, 
  },
  paymentOption: {
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    // width: "40%",
    width: width * 0.4,
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
  },
  selectedOption: { borderColor:COLORS.services, backgroundColor: "#e6f7ff" },
  optionText: { fontSize: 16, marginTop: 8 },
  confirmButton: {
    backgroundColor:COLORS.title,
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  card: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 7,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  couponRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: COLORS.title,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  paymentHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
  optionText: {
    marginTop: 5,
    fontSize: 14,
  },
  paymentDetails: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  detailsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  detailsLabel: {
    fontSize: 16,
    color: "#555",
  },
  detailsLabelBold: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailsValue: {
    fontSize: 16,
    color: "#555",
  },
  detailsValueBold: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 10,
  },
  confirmButton: {
    backgroundColor: COLORS.services,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  couponDetails: {
    flexDirection: "row",
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.backgroundcolour,
    borderRadius: 8,
  },
  couponText: {
    fontSize: 16,
    color: "#333",
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  delete: {
    marginLeft: 20,
    marginRight: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  detailsContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  wallet: {
    padding: 16,
    margin: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  walletContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 10,
    color: "#333",
  },
  walletMessage: {
    fontSize: 12,
    color: "#000",
  },
  highlight: {
    color: COLORS.services,
    fontWeight: "bold",
  },
});

export default PaymentDetails;
