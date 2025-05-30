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
  Platform,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { RadioButton, Checkbox, ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import encryptEas from "../../../Screens/View/Payments/components/encryptEas";
import decryptEas from "../../../Screens/View/Payments/components/decryptEas";
import { COLORS } from "../../../../Redux/constants/theme";
import BASE_URL, { userStage } from "../../../../Config";
import { err } from "react-native-svg";
import { Dropdown } from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");

const PaymentDetails = ({ navigation, route }) => {
  console.log("payment screen", route.params);
  // "totalGstSum": 0, "totalSum": 1295, "totalSumWithGstSum": 1295,

  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const [transactionId, setTransactionId] = useState();
  const [couponCode, setCouponCode] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("1");
  const [grandTotal, setGrandTotal] = useState("");
  const [coupenDetails, setCoupenDetails] = useState("");
  const [coupenApplied, setCoupenApplied] = useState(false);
  const [walletTotal, setWalletTotal] = useState("");
  const [deliveryBoyFee, setDeliveryBoyFee] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [totalSum, setTotalSum] = useState("");
  const [walletAmount, setWalletAmount] = useState();
  const [status, setStatus] = useState();
  const [totalGstSum, setTotalGstSum] = useState();
  const [grandTotalAmount, setGrandTotalAmount] = useState();
  const [subTotal, setSubTotal] = useState();
  const [message, setMessge] = useState();
  const [cartData, setCartData] = useState();
  const [usedWalletAmount, setUsedWalletAmount] = useState();
  const [afterWallet, setAfterWallet] = useState();

  const [selectedDay, setSelectedDay] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [days, setDays] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderDate, setOrderDate] = useState(new Date());
  const [updatedDate, setUpdatedate] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const [slotsData, setSlotsData] = useState();
  const [selectedPlanType, setSelectedPlanType] = useState(null);
  const [planA, setPlanA] = useState("");
  const [planB, setPlanB] = useState("");
  const [softCopyIntrested, setSoftcopyIntrested] = useState(false);
  const [userIntrest, setUserIntrest] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [profileForm, setProfileForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
    whatsapp_number: "",

    emailError: false,
    validateEmail: false,
  });
  const [loading, setLoading] = useState(false);
  const items = route.params?.items || [];

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getPlanType = async () => {
    try {
      if (selectedPlan !== null) {
        if (selectedPlan === "A") {
          setPlanA("YES");
          setPlanB("");
        } else if (selectedPlan === "B") {
          setPlanA("");
          setPlanB("YES");
        }
      } else {
        console.log("No plan type found in AsyncStorage");

        setPlanA("");
        setPlanB("");
      }
    } catch (error) {
      console.log("Error fetching selected plan type:", error);
    }
  };

  const handleGetPaymentMethod = async () => {
    console.log("into payment method");

    try {
      const response = await axios.get(
        BASE_URL + `order-service/getCodAndOnlinePaymetStatus`
      );
      console.log("Payment method response", response.data);
      const data = response.data;
      const paymentMethods = data.filter((item) => item.status === true);
      console.log("Payment methods", paymentMethods);
      setPaymentMethods(paymentMethods);
    } catch (error) {
      console.log("Error fetching payment methods", error);
    }
  };
  const freeContainerSoftCopy = () => {
    const email = profileForm.customer_email?.trim();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isEmailEmpty = !email;

    if (isEmailEmpty || !isValidEmail) {
      setProfileForm((prevForm) => ({
        ...prevForm,
        emailError: isEmailEmpty,
        validateEmail: !isValidEmail && !isEmailEmpty,
      }));
      return;
    }
    if (!selectedPlan) {
      Alert.alert("Please select plan type");
      return;
    }

    const requestBody = {
      user_id: customerId,
      address: addressDetails.address,
      adharnum: "",
      communityApartment: addressDetails.flatNo,
      containerprovideddate: "",
      created_at: new Date(),
      deliveryboyname: "",
      email: email,
      mobilenumber: profileForm.customer_mobile || profileForm.whatsapp_number,
      orderid: "",
      pincode: addressDetails.pincode,
      plana: planA,
      planb: planB,
      referemncemobilenumbers: "",
      referreroffer: "CONTAINER",
    };

    setLoading(true);
    console.log("requestBody", requestBody);

    const API_URL = `https://meta.oxyglobal.tech/api/reference-service/referenceoffer`;

    axios
      .post(API_URL, requestBody, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Container softcopy response:", response);
        if (response.status === 200) {
          setSoftcopyIntrested(true);
          setModalVisible(false);
        }
        setProfileForm((prevForm) => ({
          ...prevForm,
          emailError: false,
          validateEmail: false,
        }));
      })
      .catch((error) => {
        console.error("Error in container softcopy API:", error.response);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}order-service/fetchTimeSlotlist`
      );
      const data = response.data;
      console.log({ data });

      setSlotsData(data);
      let updatedOrderDate = new Date();
      updatedOrderDate.setDate(updatedOrderDate.getDate() + 1);
      setOrderDate(updatedOrderDate);

      const tomorrowDate = updatedOrderDate
        .toLocaleDateString("en-GB") // "en-GB" gives "DD/MM/YYYY"
        .split("/")
        .join("-");

      console.log("New Date (Updatedate):", tomorrowDate);
      setUpdatedate(tomorrowDate);

      // Get the next 7 days, starting from tomorrow
      const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(updatedOrderDate);
        date.setDate(updatedOrderDate.getDate() + i);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
        return {
          dayOfWeek: date
            .toLocaleDateString("en-GB", { weekday: "long" })
            .toUpperCase(),
          formattedDate: formattedDate,
        };
      });

      console.log("Next seven days:", nextSevenDays);

      const availableDays = nextSevenDays
        .filter((day) => {
          const matchedDay = data.find((d) => d.dayOfWeek === day.dayOfWeek);
          return matchedDay && matchedDay.isAvailable === true;
        })
        .slice(0, 3);

      console.log("Filtered available days:", availableDays);

      const transformedDays = availableDays.map((day) => ({
        label: `${day.dayOfWeek} ( ${day.formattedDate})`,
        value: day.dayOfWeek,
      }));

      console.log("Transformed days:", transformedDays);
      setDays(transformedDays);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const checkOfferEligibility = async (customerId) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}order-service/freeContainerBasedOnUserId?userId=${customerId}`
      );

      const hasInterested = data.some(
        (item) => item.freeContainer === "Interested"
      );

      // setShowButtons(!hasInterested);
    } catch (error) {
      console.error(
        "Error fetching offer details:",
        error?.response?.status,
        error?.response?.data
      );
      // setShowButtons(true);
    }
  };

  const handleOfferResponse = async (orderId, userId, userResponse) => {
    try {
      setLoading(true);

      const requestBody = {
        freeContainer: userResponse,
        orderId: orderId,
        userId: customerId,
      };

      console.log(" free Request Body:", requestBody);

      const API_URL = `${BASE_URL}order-service/freeContainer`;

      const response = await axios.post(API_URL, requestBody, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("API Response:", response);

      console.log(response);
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong!"
      );
    } finally {
      Alert.alert(
        "Thank You!",
        "Your interest has been successfully registered.",
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
    }
  };

  const handleDayChange = (selectedDay) => {
    setSelectedDay(selectedDay);
    console.log("selectedDay", selectedDay);
    console.log("Days array before filtering:", days);
    console.log(
      "Available Days:",
      days.map((d) => `"${d.value}"`)
    );
    console.log("Selected Day:", `"${selectedDay}"`);

    const selectedDayData = days.find(
      (d) =>
        d.value?.trim()?.toUpperCase() === selectedDay?.trim()?.toUpperCase()
    );

    console.log({ selectedDayData });

    if (selectedDayData) {
      const fullDayData = slotsData.find((d) => d.dayOfWeek === selectedDay);

      if (fullDayData) {
        setSelectedDate(selectedDayData.formattedDate || "");
        setTimeSlots(
          [
            fullDayData.timeSlot1,
            fullDayData.timeSlot2,
            fullDayData.timeSlot3,
            fullDayData.timeSlot4,
          ]
          // .filter(Boolean)
        );
      } else {
        setTimeSlots([]);
      }
    } else {
      setTimeSlots([]);
    }
  };

  const totalCart = async () => {
    console.log("into total cart function");

    try {
      const response = await axios({
        url: BASE_URL + "cart-service/cart/cartItemData",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          customerId: customerId,
        },
      });

      console.log("cart items", response.data.cartResponseList);

      const cartResponse = response.data.cartResponseList;

      setCartData(cartResponse);

      const totalDeliveryFee = cartResponse.reduce(
        (sum, item) => sum + item.deliveryBoyFee,
        0
      );
      setTotalGstSum(response.data.totalGstSum);
      setDeliveryBoyFee(totalDeliveryFee);
      setGrandTotal(response.data.totalSumWithGstSum);

      const containerItemIds = [
        "53d7f68c-f770-4a70-ad67-ee2726a1f8f3", // Stainless Steel Rice Vault - 20Kg+
        "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61", // Premium Steel Rice Storage - 35kg+
      ];

      const containerItemNames = [
        "Stainless Steel Rice Vault - 20Kg+",
        "Premium Steel Rice Storage - 35kg+",
      ];

      const isUserInterested = cartResponse.some(
        (item) =>
          containerItemIds.includes(item.itemId) ||
          containerItemNames.includes(item.itemName)
      );

      console.log("Is user interested in rice containers?", isUserInterested);

      setUserIntrest(isUserInterested);
    } catch (error) {
      // setError("Failed to fetch cart data");
      console.error("Error fetching cart data:", error);
    }
  };

  //address details from previous page
  var addressDetails = route.params.addressData;

  const [selectedPaymentMode, setSelectedPaymentMode] = useState("ONLINE");

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
    console.log("calculated total", calculatedTotal);

    setSubTotal(calculatedTotal);
    grandTotalfunc();
  }, [items]);

  const handlePaymentModeSelect = (mode) => {
    setSelectedPaymentMode(mode);
    // console.log({ mode });
  };

  const deleteCoupen = () => {
    setCouponCode("");
    setCoupenApplied(false);

    Alert.alert("coupen removed successfully");
  };

  const confirmPayment = () => {
    if (selectedTimeSlot == null || selectedTimeSlot == "") {
      Alert.alert("Please select time slot to proceed");
    } else if (selectedPaymentMode == null || selectedPaymentMode == "") {
      Alert.alert("Please select payment method");
      return;
    } else {
      handleOrderConfirmation();
    }
  };

  const validateCartBeforeCheckout = (cartItems, navigation) => {
    let insufficientStockItems = [];

    cartItems.forEach((item) => {
      if (item.cartItemQuantity > item.quantity) {
        insufficientStockItems.push(
          `${item.itemName}: Only ${item.quantity} left, but you added ${item.cartItemQuantity}`
        );
      }
    });

    if (insufficientStockItems.length > 0) {
      Alert.alert(
        "Insufficient Stock",
        "Some items in your cart have insufficient stock:\n" +
          insufficientStockItems.join("\n"),
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Home", { screen: "My Cart" });
            },
          },
        ]
      );
      return false;
    }

    return true;
  };

  const handleOrderConfirmation = () => {
    if (!cartData || cartData.length === 0) {
      return;
    }
    if (grandTotalAmount == 0) {
      setSelectedPaymentMode("COD");
    }
    const zeroQuantityItems = cartData
      .filter((item) => item.quantity === 0)
      .map((item) => item.itemName);

    if (zeroQuantityItems.length > 0) {
      const itemNames = zeroQuantityItems.join(", ");
      Alert.alert(
        "Sorry for the inconvenience",
        `We noticed that the following items in your cart have zero quantity: ${itemNames}. 
      
         Please update or remove them before proceeding with your order.`,
        [{ onPress: () => navigation.navigate("Home", { screen: "My Cart" }) }]
      );
      return;
    } else if (!validateCartBeforeCheckout(cartData)) {
      return;
    } else {
      placeOrder();
    }
  };

  useEffect(() => {
    getProfile();
    getOffers();
    getWalletAmount();
    totalCart();
    fetchTimeSlots();
    getPlanType();
    handleGetPaymentMethod();
    checkOfferEligibility(customerId);
  }, [grandTotalAmount, deliveryBoyFee]);

  const getWalletAmount = async () => {
    try {
      const response = await axios.post(
        BASE_URL + `order-service/applyWalletAmountToCustomer`,
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
        setWalletAmount(response.data.usableWalletAmountForOrder);
        setMessge(response.data.message);
        setTotalSum(response.data.totalSum);
        setStatus();
        setWalletTotal(grandTotal - response.data.usableWalletAmountForOrder);
      }
    } catch (error) {
      console.error(
        "Error applying wallet amount:",
        error.response?.data || error.message
      );
    }
  };

  const handleCheckboxToggle = () => {
    const newValue = !useWallet;

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
    console.log("sravani profile");

    console.log("into profile call");

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
      console.log("profile call response", response.data);

      if (response.status === 200) {
        setProfileForm({
          customer_name: response.data.firstName,
          customer_email: response.data.email,
          customer_mobile:
            response.data?.mobileNumber || response.data?.whatsappNumber,
          // whatsapp_number: response.data?.whatsappNumber,
          customer_email: response.data?.email,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  var postData;

  const placeOrder = () => {
    console.log("grandTotalAmount", grandTotalAmount);

    if (loading == true) {
      return;
    }
    if (!isChecked) {
      Alert.alert(
        "Confirmation Required",
        "Please confirm that the exchange can be taken within 10 days after delivery."
      );
      return;
    }
    if (selectedPlan) {
      if (softCopyIntrested == false) {
        setModalVisible(true);
      }
    }

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
      latitude: addressDetails.latitude ?? 0,
      longitude: addressDetails.longitude ?? 0,
      walletAmount: usedWalletAmount,
      couponCode: coupon,
      couponValue: coupenDetails,
      deliveryBoyFee: deliveryBoyFee,
      subTotal: subTotal,
      gstAmount: totalGstSum,
      orderFrom: "MOBILE",
      dayOfWeek: selectedDay,
      expectedDeliveryDate: updatedDate,
      timeSlot: selectedTimeSlot,
      latitude: addressDetails.latitude,
      longitude: addressDetails.longitude,
    };

    console.log({ postData });
    console.log("postdata", postData);

    setLoading(true);
    console.log({ postData });

    axios({
      method: "POST",
      url: BASE_URL + "order-service/orderPlacedPaymet",
      data: postData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("Order Placed with Payment API:", response);
        console.log("order id after placing the order", response.data.orderId);
        setOrderId(response.data.orderId);
        if (response.data.status) {
          Alert.alert("Sorry", response.data.status, [
            {
              text: "OK",
              onPress: () => navigation.navigate("Home", { screen: "My Cart" }),
            },
          ]);
          return;
        }

        if (selectedPaymentMode === null || selectedPaymentMode === "COD") {
          const message = showButtons
            ? "🎉 Special Offer: Free Rice Container! 🎉\n\n" +
              "Buy 9 bags of 26kg / 10kg in 3 years OR refer 9 friends. " +
              "When they buy their first bag, the container is yours forever.\n\n" +
              "* No purchase in 45 days OR a 45-day gap between purchases = Container will be taken back."
            : "Your order has been placed successfully. Thank you for shopping with us!";

          const buttons = showButtons
            ? [
                {
                  text: "Interested",
                  onPress: () =>
                    handleOfferResponse(
                      response.data.orderId,
                      customerId,
                      "Interested"
                    ),
                },
                {
                  text: "Not Interested",
                  onPress: () =>
                    handleOfferResponse(
                      response.data.orderId,
                      customerId,
                      "Not Interested"
                    ),
                  style: "cancel",
                },
              ]
            : [
                {
                  text: "OK",
                  onPress: () => {
                    setLoading(false);
                    navigation.navigate("My Orders");
                  },
                },
              ];

          Alert.alert("Order Confirmed!", message, buttons);
        } else {
          setTransactionId(response.data.paymentId);

          const data = {
            mid: "1152305",
            amount: grandTotalAmount,
            amount: 1,
            // merchantTransactionId: response.data.paymentId,
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
        console.error("Order Placement Error:", error);
        Alert.alert("Error", error.response.data.error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (
      paymentStatus == "PENDING" ||
      paymentStatus == "" ||
      paymentStatus == null ||
      paymentStatus == "INITIATED"
    ) {
      const data = setInterval(() => {
        Requery(paymentId);
      }, 4000);
      return () => clearInterval(data);
    } else {
    }
  }, [paymentStatus, paymentId]);

  const getepayPortal = async (data) => {
    // console.log("getepayPortal", data);
    const JsonData = JSON.stringify(data);
    // console.log("ytfddd");

    var ciphertext = encryptEas(JsonData);
    var newCipher = ciphertext.toUpperCase();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      mid: data.mid,
      terminalId: data.terminalId,
      req: newCipher,
    });
    // console.log("========");
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
        // console.log("===getepayPortal data======");
        // console.log(data);
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
                setPaymentStatus(null);
              },
            },
          ]
        );
      })
      .catch((error) => {
        console.log("getepayPortal", error.response);
        setLoading(false);
      });
  };

  const getOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        BASE_URL + "order-service/getAllCoupons",
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
      // console.log(error.response);
      setLoading(false);
    }
  };

  const handleApplyCoupon = () => {
    const data = {
      couponCode: couponCode.toUpperCase(),
      customerId: customerId,
      subTotal: subTotal,
    };
    // console.log("Total amount is  :", subTotal);

    const response = axios
      .post(BASE_URL + "order-service/applycoupontocustomer", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log("coupen applied", response.data);
        const { discount, grandTotal } = response.data;

        setCoupenDetails(discount);
        Alert.alert(response.data.message);
        setCoupenApplied(response.data.couponApplied);
      })
      .catch((error) => {
        console.log("error", error.response);
      });
  };

  function Requery(paymentId) {
    if (
      paymentStatus === "PENDING" ||
      paymentStatus === "" ||
      paymentStatus === null ||
      paymentStatus === "INITIATED"
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
            // console.log("Requery ID result", paymentId);
            var responseurl = resultobj.response;
            // console.log({ responseurl });
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
              if (data.paymentStatus === "SUCCESS") {
                axios({
                  method: "get",
                  url:
                    BASE_URL +
                    `/order-service/api/download/invoice?paymentId=${transactionId}&&userId=${customerId}`,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then((response) => {
                    console.log(response.data);
                  })
                  .catch((error) => {
                    console.error("Error in payment confirmation:", error);
                  });
              }
              axios({
                method: "POST",
                url: BASE_URL + "order-service/orderPlacedPaymet",
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
                  const message = showButtons
                    ? "🎉 Special Offer: Free Rice Container! 🎉\n\n" +
                      "Buy 9 bags of 26kg / 10kg in 3 years OR refer 9 friends. " +
                      "When they buy their first bag, the container is yours forever.\n\n" +
                      "* No purchase in 45 days OR a 45-day gap between purchases = Container will be taken back."
                    : "Your order has been placed successfully. Thank you for shopping with us!";

                  const buttons = showButtons
                    ? [
                        {
                          text: "Interested",
                          onPress: () =>
                            handleOfferResponse(
                              secondResponse.data.orderId,
                              customerId,
                              "Interested"
                            ),
                        },
                        {
                          text: "Not Interested",
                          onPress: () =>
                            handleOfferResponse(
                              secondResponse.data.orderId,
                              customerId,
                              "Not Interested"
                            ),
                          style: "cancel",
                        },
                      ]
                    : [
                        {
                          text: "OK",
                          onPress: () => {
                            setLoading(false);
                            navigation.navigate("My Orders");
                          },
                        },
                      ];

                  Alert.alert("Order Confirmed!", message, buttons);
                })
                .catch((error) => {
                  console.error("Error in payment confirmation:", error);
                  setLoading(false);
                });
            } else {
              setLoading(false);
            }
          }
        })
        .catch((error) => {
          console.log("Payment Status", error);
          setLoading(false);
        });
    }
  }

  function grandTotalfunc() {
    let total = grandTotal + deliveryBoyFee;
    let usedWallet = 0;

    if (coupenApplied) {
      total -= coupenDetails;
    }

    if (useWallet && walletAmount > 0) {
      if (walletAmount >= total) {
        usedWallet = total; // Use only what's needed
        total = 0;
      } else {
        usedWallet = walletAmount;
        total -= walletAmount;
      }
    }

    // Ensure total is never negative
    total = Math.max(0, total);

    setAfterWallet(walletAmount ? walletAmount - usedWallet : 0);
    setUsedWalletAmount(usedWallet);
    setGrandTotalAmount(total);

    if (total === 0) {
      // console.log("Get all Values",{total});
      // setSelectedPaymentMode('COD');
    }
  }

  useEffect(() => {
    grandTotalfunc();
  }, [
    coupenApplied,
    useWallet,
    grandTotalAmount,
    grandTotal,
    deliveryBoyFee,
    totalGstSum,
  ]);

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="always"
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

        <View style={styles.container1}>
          <Text style={styles.label}>Select Day:</Text>
          <View style={styles.pickerContainer}>
            <Dropdown
              data={days}
              labelField="label"
              valueField="value"
              placeholder="SELECT A DAY"
              value={selectedDay}
              onChange={(item) => handleDayChange(item.value)}
              style={styles.picker}
              iconStyle={{ marginRight: 20 }}
            />
          </View>

          {timeSlots.length > 0 && (
            <>
              <Text style={styles.label}>Select Time Slot:</Text>
              <View style={styles.pickerContainer}>
                <Dropdown
                  data={timeSlots.map((slot) => ({ label: slot, value: slot }))}
                  labelField="label"
                  valueField="value"
                  placeholder="Select a time slot"
                  value={selectedTimeSlot}
                  onChange={(item) => setSelectedTimeSlot(item.value)}
                  style={styles.picker}
                  iconStyle={{ marginRight: 20 }}
                />
              </View>
            </>
          )}
        </View>
        {/* Payment Methods */}
        <Text style={styles.paymentHeader}>Choose Payment Method</Text>
        <View style={styles.paymentOptions}>
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}

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

        {/* Payment Details */}
        <View style={styles.paymentDetails}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsChecked(!isChecked)}
          >
            <Ionicons
              name={isChecked ? "checkbox" : "square-outline"}
              size={24}
              color={isChecked ? "green" : "gray"}
            />
            <Text style={styles.label1}>
              I confirm that the exchange can be taken within{" "}
              <Text
                style={[
                  styles.label1,
                  { fontWeight: "bold", textTransform: "capitalize" },
                ]}
              >
                10 days
              </Text>{" "}
              after the order has been delivered.
            </Text>
          </TouchableOpacity>
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
            <Text style={styles.detailsValue}>
              +₹{Number((totalGstSum || 0.0).toFixed(2))}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.paymentRow}>
            <Text style={styles.detailsLabelBold}>Grand Total</Text>
            {/* <Text style={styles.detailsValueBold}>₹{grandTotalAmount+deliveryBoyFee}</Text> */}
            <Text style={styles.detailsValueBold}>
              ₹{Number(grandTotalAmount || 0).toFixed(2)}
            </Text>
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

      {userIntrest && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.modalTitle}>
                  <Text style={styles.modalTitle}>
                    🎉 Congratulations! A free container will be delivered with
                    your order. 📦
                  </Text>
                </Text>
                <View style={styles.planSelectionContainer}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      selectedPlan === "planA" && styles.radioButtonSelected,
                    ]}
                    onPress={() => setSelectedPlan("planA")}
                  >
                    <View style={styles.radioCircle}>
                      {selectedPlan === "planA" && (
                        <View style={styles.selectedRadioCircle} />
                      )}
                    </View>
                    <Text style={styles.radioText}>Plan A</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      selectedPlan === "planB" && styles.radioButtonSelected,
                    ]}
                    onPress={() => setSelectedPlan("planB")}
                  >
                    <View style={styles.radioCircle}>
                      {selectedPlan === "planB" && (
                        <View style={styles.selectedRadioCircle} />
                      )}
                    </View>
                    <Text style={styles.radioText}>Plan B</Text>
                  </TouchableOpacity>
                </View>

                {/* Dynamic Content Based on Plan Selection */}
                {selectedPlan === "planA" && (
                  <View style={styles.planContent}>
                    <Text style={styles.planTitle}>Plan A Details</Text>
                    <Text style={styles.planDescription}>
                      Buy 9 bags during the next 3 years, and the container is
                      yours forever.
                    </Text>
                  </View>
                )}

                {selectedPlan === "planB" && (
                  <View style={styles.planContent}>
                    <Text style={styles.planTitle}>Plan B Details</Text>
                    <Text style={styles.planDescription}>
                      Refer 9 people, and when they buy their first bag, the
                      container is yours forever.
                    </Text>
                  </View>
                )}

                <View style={styles.section}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <View style={styles.inputField}>
                      <Text style={styles.inputText}>
                        {profileForm.customer_name}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mobile</Text>
                    <View style={styles.inputField}>
                      <Text style={styles.inputText}>
                        {profileForm.customer_mobile}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>Address</Text>

                <View style={styles.section}>
                  <View style={styles.inputContainer}>
                    <View style={styles.inputField}>
                      <Text style={styles.inputText}>
                        <Text style={styles.addressLabel}>Flat No: </Text>
                        {addressDetails.flatNo}

                        {addressDetails.landMark ? "\n" : ""}
                        {addressDetails.landMark ? (
                          <Text style={styles.addressLabel}>Landmark: </Text>
                        ) : null}
                        {addressDetails.landMark}

                        {addressDetails.pincode ? "\n" : ""}
                        {addressDetails.pincode ? (
                          <Text style={styles.addressLabel}>Pincode: </Text>
                        ) : null}
                        {addressDetails.pincode}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email</Text>

                  <TextInput
                    style={styles.textInput}
                    value={profileForm.customer_email}
                    placeholder="Please enter your email"
                    keyboardType="email-address"
                    onChangeText={(text) => {
                      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        text
                      );
                      setProfileForm((prevForm) => ({
                        ...prevForm,
                        customer_email: text,
                        emailError: text.trim() === "",
                        validateEmail: text.trim() !== "" && !isValidEmail,
                      }));
                    }}
                  />

                  {profileForm.emailError && (
                    <Text style={{ color: "red", alignSelf: "center" }}>
                      Email is mandatory
                    </Text>
                  )}

                  {profileForm.validateEmail && (
                    <Text style={{ color: "red", alignSelf: "center" }}>
                      Invalid Email
                    </Text>
                  )}
                </View>
              </ScrollView>
              <View style={styles.buttonContainer}>
                {/* <TouchableOpacity
                  style={[styles.button, styles.closeButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={[styles.button, styles.okButton]}
                  onPress={() => {
                    freeContainerSoftCopy();
                  }}
                >
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  selectedOption: { borderColor: COLORS.services, backgroundColor: "#e6f7ff" },
  optionText: { fontSize: 16, marginTop: 8 },
  confirmButton: {
    backgroundColor: COLORS.title,
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
    marginLeft: 10,
  },
  label1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
    marginLeft: 18,
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
  container1: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: width * 1,
    alignSelf: "center",
  },

  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonActive: {
    backgroundColor: "#28a745",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 15,
    // overflow: "hidden",
    width: width * 0.8,
    alignSelf: "center",
    paddingLeft: 20,
  },

  picker: {
    height: 50,
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    textAlign: "center",
    padding: 10,
    fontSize: 18,
    color: "blue",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#333",
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    fontWeight: "500",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    backgroundColor: "#f5f5f5",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },
  closeBtn: {
    backgroundColor: "#3498db",
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
    marginTop: 15,
  },
  closeBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  addressLabel: {
    fontWeight: "500",
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  okButton: {
    backgroundColor: "#4CAF50",
  },
  closeButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f5f5f5",
  },
  planSelectionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  radioButtonSelected: {
    backgroundColor: "#f0f8ff",
    borderColor: "#4682b4",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4682b4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRadioCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4682b4",
  },
  radioText: {
    fontSize: 16,
    fontWeight: "500",
  },
  planContent: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  planDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
});

export default PaymentDetails;
