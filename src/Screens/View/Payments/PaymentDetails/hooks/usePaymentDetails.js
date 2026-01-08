import { useState, useEffect } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking
} from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import { getCoordinates } from "../../../Address/LocationService";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/FontAwesome";
import { getFinalDeliveryFee } from "../Components/DeliveryFeeCalculator";
import {checkEligibilityForActiveZones} from "../Components/TodayDeliveryStatus"

// import GoogleAnalyticsService from "../../../../../Components/GoogleAnalytic";

import * as Clipboard from "expo-clipboard";
import {
  handleCustomerCartData,
  handleGetProfileData,
  handleUserAddorIncrementCart,
  handleDecrementorRemovalCart,
  handleRemoveItem,
  handleRemoveFreeItem,
} from "../../../../../ApiService";
import BASE_URL from "../../../../../../Config";
import { COLORS } from "../../../../../../Redux/constants/theme";
import encryptEas from "../../components/encryptEas";
import decryptEas from "../../components/decryptEas";
export const usePaymentDetails = (navigation, route) => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  // State declarations
  // ==================== PAYMENT & TRANSACTION STATE ====================
  const [transactionId, setTransactionId] = useState();
  const [paymentId, setPaymentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("1");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("ONLINE");

  // ==================== PRICING & TOTALS STATE ====================
  const [grandTotal, setGrandTotal] = useState("");
  const [grandTotalAmount, setGrandTotalAmount] = useState();
  const [subTotal, setSubTotal] = useState();
  const [totalSum, setTotalSum] = useState("");
  const [totalCartValue, setTotalCartValue] = useState("");
  const [totalGstSum, setTotalGstSum] = useState();
  const [gstAmount, setGstAmount] = useState("");
  const [itemsGstAmount, setItemsGstAmount] = useState("");
  const [goldMakingCost, setGoldMakingCost] = useState("");
  const [goldGstAmount, setGoldGstAmont] = useState("");
  const [serviceFee, setServiceFee] = useState(0);
  const [handlingFees, setHandlingFees] = useState(0);
  const [deliveryBoyFee, setDeliveryBoyFee] = useState(0);
  const [freeItemsDiscount, setFreeItemsDiscount] = useState("");
  const [freeItemPrice, setFreeItemPrice] = useState("");
  const [distance, setDistance] = useState(0);
  const [smallValue, setSmallValue] = useState(0);
  const [addressDetails, setAddressDetails] = useState("");
  const [cartLoading,setCartLoading] = useState();
  const [minOrderValue, setMinOrderValue] = useState(0);
  // ==================== WALLET STATE ====================
  const [walletTotal, setWalletTotal] = useState("");
  const [walletAmount, setWalletAmount] = useState();
  const [useWallet, setUseWallet] = useState(false);
  const [usedWalletAmount, setUsedWalletAmount] = useState();
  const [afterWallet, setAfterWallet] = useState();
    const [walletApplicable, setWalletApplicable] = useState(false);

  // ==================== COUPON STATE ====================
  const [couponCode, setCouponCode] = useState("");
  const [coupenDetails, setCoupenDetails] = useState("");
  const [coupenApplied, setCoupenApplied] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [appliedCouponSuccessMsg, setAppliedCouponSuccessMsg] = useState({
    code: "",
    amount: "",
    provider: "",
  });

  // ==================== ORDER & DELIVERY STATE ====================
  const [orderId, setOrderId] = useState("");
  const [orderDate, setOrderDate] = useState(new Date());
  const [updatedDate, setUpdatedate] = useState();
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDayName, setSelectedDayName] = useState("");
  const [days, setDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [slotsData, setSlotsData] = useState();
   const [eligibleTime, setEligibleTime] = useState(false);
  const [showEligibleModal, setShowEligibleModal] = useState(false);
  const [eligibleTimeSlot, setEligibleTimeSlot] = useState("");
  const [cartToPlace, setCartToPlace] = useState(false);
  const [minOrderToPlace, setMinOrderToPlace] = useState(0);
  const [addressStatus, setAddressStatus] = useState(true);
  const [pincodeMinValues, setPincodeMinValues] = useState([]);
  const [currentMinValue, setCurrentMinValue] = useState(499);

  // ==================== CART & ITEMS STATE ====================
  const [cartData, setCartData] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const [removalLoading, setRemovalLoading] = useState({});
  const [onlyOneKg, setOnlyOneKg] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [containerDecision, setContainerDecision] = useState(null);

  // ==================== UI STATE ====================
  const [showButtons, setShowButtons] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVissible, setModalVissible] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [waitingLoader, setWaitingLoader] = useState(false);

  // ==================== MODAL CONTENT STATE ====================
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [primaryButtonText, setPrimaryButtonText] = useState("");
  const [secondaryButtonText, setSecondaryButtonText] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessge] = useState();
  const [noteMessage, setNoteMessage] = useState("");

  // ==================== MISC STATE ====================
  const [status, setStatus] = useState();
  const [offeravailable, setOfferAvailable] = useState();
  const [error, setError] = useState(null);
  const [profileForm, setProfileForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
  });

  // ==================== ADDRESS STATE ====================
  const [addressList, setAddressList] = useState([]);
  const [addressData, setAddressData] = useState();
  const [locationData, setLocationData] = useState({
    flatNo: "",
    landMark: "",
    pincode: "",
    address: "",
    addressType: "",
    latitude: "",
    longitude: "",
    area: "",
    houseType: "",
    residenceName: "",
  });

  const containerItemIds = [
    "53d7f68c-f770-4a70-ad67-ee2726a1f8f3",
    "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61",
  ];

  // ==================== USEEFFECT HOOKS ====================

  
  useEffect(() => {
  getOffers();
}, [coupenApplied]);

useEffect(() => {
  getWalletAmount();
}, [useWallet,walletApplicable]); 

useEffect(() => {
  fetchCartData();
}, [grandTotal,addressDetails]); 

useEffect(() => {
  fetchTimeSlots();
}, [route.params?.locationData]); 

useEffect(() => {
  grandTotalfunc();
}, [grandTotal, deliveryBoyFee, handlingFees, useWallet, walletAmount, coupenApplied, coupenDetails]); 

useEffect(() => {
  fetchOrderAddress();
  fetchPincodeMinValues();
}, []);


  // ==================== CART HANDLERS ====================

  const handleIncrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await increaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const handleDecrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await decreaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const increaseCartItem = async (item) => {
    const data = { customerId: customerId, itemId: item.itemId };
    try {
      const response = await handleUserAddorIncrementCart(data);
      fetchCartData();
    } catch (error) {
      console.error("Error incrementing cart item:", error.response);
    }
  };

  const decreaseCartItem = async (item) => {
    const data = { customerId: customerId, itemId: item.itemId };
    try {
      const response = await handleDecrementorRemovalCart(data);
      fetchCartData();
    } catch (error) {
      console.log("Error decrementing cart item:", error.response);
    }
  };

  const handleRemove = async (item) => {
    if (!item?.cartId) {
      console.error("Invalid item data for removal", item);
      return;
    }

    setRemovalLoading((prevState) => ({
      ...prevState,
      [item.cartId]: true,
    }));

    try {
      let response;
      if (item.status === "FREE") {
        const freePayload = {
          id: item.cartId,
          customerId: customerId,
          itemId: item.itemId,
          status: "FREE",
        };
        response = await handleRemoveFreeItem(freePayload);
      } else {
        response = await handleRemoveItem(item.cartId);
      }

      Alert.alert("Success", "Item removed successfully");
      fetchCartData();
    } catch (error) {
      Alert.alert("Error", "Failed to remove item. Please try again.");
    } finally {
      setRemovalLoading((prevState) => ({
        ...prevState,
        [item.cartId]: false,
      }));
    }
  };

  // ==================== COUPON HANDLERS ====================

  const handleApplyCoupon = (couponCode) => {
    console.log({couponCode});
    
    const data = {
      couponCode: couponCode?.toUpperCase(),
      customerId: customerId,
      subTotal: subTotal,
    };

    axios
      .post(BASE_URL + "order-service/applycoupontocustomer", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Coupon response:", response.data);
       const { discount, grandTotal } = response.data;
        setAppliedCouponSuccessMsg({
          code: couponCode.toUpperCase(),
          amount: discount,
          provider: "ASKOXY.AI",
        });
        if(response.data.couponApplied){
          console.log("couponApplied......",response.data.couponApplied );
        setCouponCode(couponCode)
        }else{
          Alert.alert(response.data.message)
        }
        setCoupenDetails(discount);
        setCoupenApplied(response.data.couponApplied);
        setShowSuccess(true);
      })
      .catch((error) => {
        console.log("error", error.response);
      });
  };

  const deleteCoupen = () => {
    setCouponCode("");
    setCoupenApplied(false);
    Alert.alert("coupen removed successfully");
  };

  const copyToClipboard = async (code, discount) => {
    // await Clipboard.setStringAsync(code);
    // setCouponCode(code);
    handleApplyCoupon(code);
  };

  // ==================== WALLET HANDLERS ====================

  const handleCheckboxToggle = () => {
    const newValue = !useWallet;
    setUseWallet(newValue);
    getWalletAmount();

    if (newValue) {
      Alert.alert(
        "Wallet Amount Used",
        `You are using ${walletAmount} from your wallet.`,
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Wallet Amount Deselected",
        `You have removed the usage of ${walletAmount} from your wallet.`,
        [{ text: "OK" }]
      );
    }
  };

  // ==================== ORDER & DELIVERY HANDLERS ====================

  const handleDayChange = (selectedDay) => {
    setSelectedDay(selectedDay);

    const selectedDayData = days.find(
      (d) =>
        d.value?.trim()?.toUpperCase() === selectedDay?.trim()?.toUpperCase()
    );

    // console.log({ selectedDayData });

    if (selectedDayData) {
      const fullDayData = slotsData.find(
        (d) =>
          d.dayOfWeek.trim().toUpperCase() === selectedDay.trim().toUpperCase()
      );

      if (fullDayData) {
        setSelectedDate(selectedDayData.formattedDate || "");
        setUpdatedate(selectedDayData?.formattedDate);

        // console.log("Matching Slot:", fullDayData);

        const timeSlots = [
          { time: fullDayData.timeSlot1, status: fullDayData.slot1Status },
          { time: fullDayData.timeSlot2, status: fullDayData.slot2Status },
          { time: fullDayData.timeSlot3, status: fullDayData.slot3Status },
          { time: fullDayData.timeSlot4, status: fullDayData.slot4Status },
        ];

        const availableTimeStrings = timeSlots
          .filter((slot) => slot.time && !slot.status)
          .map((slot) => slot.time);

        const uniqueAvailableTimes = [...new Set(availableTimeStrings)];
        setTimeSlots(uniqueAvailableTimes);
      } else {
        setTimeSlots([]);
      }
    } else {
      setTimeSlots([]);
    }
  };

  const handleTimeSlotChange = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleExchangePolicyChange = (isAccepted) => {
    // console.log("Exchange policy accepted:", isAccepted);
    setIsChecked(isAccepted);
  };

  // ==================== PAYMENT HANDLERS ====================

  const confirmPayment = () => {
    // console.log({status,addressDetails,addressStatus,selectedTimeSlot,selectedPaymentMode,isChecked,cartToPlace},"....................confirmPayment");
    
    if(!addressDetails){
        openModal(
        "Oops! Something went wrong",
        "Please select Address to proceed",
        "OK",
        "Cancel",
        "error"
      );
      return;
    }
    
    if(!addressStatus){
        openModal(
        "Oops! Something went wrong",
        "Selected address is not serviceable. Please select another address or update the current address.",
        "OK",
        "Cancel",
        "error"
      );
      return;
    }

    if (selectedTimeSlot == null || selectedTimeSlot == "") {
      openModal(
        "Oops! Something went wrong",
        "Please select time slot to proceed",
        "OK",
        "Cancel",
        "error"
      );
      return;
    } else if (selectedPaymentMode == null || selectedPaymentMode == "") {
      openModal(
        "Oops! Something went wrong",
        "Please select payment method",
        "OK",
        "Cancel",
        "error"
      );
      return;
    } else if (!isChecked) {
      openModal(
        "Confirmation Required",
        "Please confirm that the exchange can be taken within 10 days after delivery.",
        "OK",
        "Cancel",
        "info"
      );
      return;
    }else if(grandTotalAmount < currentMinValue){
      openModal(
        "Oops!",
        `Minimum cart value to place an order is ₹${currentMinValue}`,
        "OK",
        "Cancel",
        "error"
      );
      return;
    }else if(!cartToPlace){
      openModal(
        "Oops!",
        `Minimum cart value to place an order is ₹${minOrderToPlace}`,
        "OK",
        "Cancel",
        "error"
      );
      return;
    }else {
      setShowConfirmModal(true);
    }
  };

  // ==================== UI HANDLERS ====================

  const openModal = (
    titleText,
    messageText,
    primaryText,
    secondaryText,
    typeText
  ) => {
    setTitle(titleText);
    setMessageModal(messageText);
    setPrimaryButtonText(primaryText);
    setSecondaryButtonText(secondaryText);
    setType(typeText);
    setModalVissible(true);
  };

  // ==================== DATA FETCHING FUNCTIONS ====================

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response = await handleCustomerCartData(customerId);
      // console.log("cart response11", response.data);

      response.data.customerCartResponseList.map((item) => {
        if (
          (item.weight === 20 || item.weight === 35) &&
          item.status === "FREE"
        ) {
          Alert.alert(
            "🎁 Special Offer: Free Rice Container!",
            `Your cart includes a rice bag that qualifies for a FREE ${item.itemName}!\n\nNote: The container remains an Oxy Group asset until ownership is earned.\n\nAre you sure you want to avail this offer?`,
            [
              {
                text: "No",
                onPress: () => handleRemove(item),
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => {
                  setItemToRemove(item);
                  setModalVisible(true);
                },
              },
            ]
          );
        }
      });

      setSubTotal(response.data?.amountToPay);
      setFreeItemPrice(response.data?.freeItemPriceTotal);
      setGstAmount(response.data?.totalGstAmountToPay);
      setLoading(false);
      setGrandTotal(response.data.amountToPay);

      const cartData = response?.data?.customerCartResponseList;
      // console.log("cartData1111111", cartData);

      const itemsGst = cartData.reduce((sum, item) => {
        if ((item?.goldGst || 0) === 0) {
          return sum + (item?.gstAmount || 0);
        }
        return sum;
      }, 0);
      setItemsGstAmount(itemsGst);

      const totalGoldGst = cartData.reduce(
        (sum, item) => sum + (item?.goldGst || 0),
        0
      );
      setGoldGstAmont(totalGoldGst);

      const totalGoldMakingCost = cartData.reduce(
        (sum, item) => sum + (item?.goldMakingCost || 0),
        0
      );
      setGoldMakingCost(totalGoldMakingCost);

      const weightArray = cartData?.map((item) => item.weight);

      if (!cartData || !Array.isArray(cartData)) {
        setCartData([]);
        setIsLimitedStock({});
        setCartItems({});
        return;
      }

      const cartItemsMap = cartData.reduce((acc, item) => {
        if (
          !item.itemId ||
          item.cartQuantity === undefined ||
          item.quantity === undefined
        ) {
          console.error("Invalid item in cartData:", item);
          return acc;
        }
        acc[item.itemId] = item.cartQuantity;
        return acc;
      }, {});

      // console.log("cartItemsMap", cartItemsMap);

      const limitedStockMap = cartData.reduce((acc, item) => {
        if (item.quantity === 0) {
          acc[item.itemId] = "outOfStock";
        } else if (item.quantity <= 5) {
          acc[item.itemId] = "lowStock";
        }
        return acc;
      }, {});

      // console.log("cart data after fetch", cartData);

      setError(null);
      setCartData(cartData);
      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
      setGoldMakingCost(totalGoldMakingCost);

      const totalGstAmountToPay = response.data?.totalGstAmountToPay;
      setFreeItemsDiscount(response.data?.discountedByFreeItems || 0);
      setTotalGstSum(response.data?.totalGstAmountToPay);

      const amountToPay = Number(response.data?.amountToPay || 0);
      const gst = Number(totalGstAmountToPay || 0);
      const cartAmount = amountToPay + gst;
      setGrandTotal(amountToPay + gst);

      let latitude = 0;
      let longitude = 0;
      // console.log("addressDetails", addressDetails);
      
      if((addressDetails?.latitude === 0 && addressDetails?.longitude === 0) || (addressDetails?.latitude===null && addressDetails?.longitude === null) || (addressDetails?.latitude===undefined && addressDetails?.longitude === undefined) || (addressDetails?.latitude === "0" && addressDetails?.longitude === "0") ){
        // console.log("Getting the coordinates.......");
         const address = addressDetails?.address + "," + addressDetails?.landMark + ","+addressDetails?.area+"," + addressDetails?.pincode;
         const { coord1 } = await getCoordinates(address);
        //  console.log("coord1 payments.....", coord1);
        latitude = coord1.latitude;
        longitude = coord1.longitude;
        // console.log("Latitude:", latitude, "Longitude:", longitude);  
      }else{
        // console.log("Getting the coordinates from the address details.....");
        latitude = addressDetails?.latitude;
        longitude = addressDetails?.longitude;
      }
      const { fee, distance, note,handlingFee, grandTotal,walletApplicable,minOrderForWallet,canPlaceOrder,minOrderToPlace,addressStatus } = await getFinalDeliveryFee(latitude,longitude, cartAmount);
      // console.log({addressStatus})    
      setDeliveryBoyFee(fee || 0);
            setHandlingFees(handlingFee || 0);
            setDistance(distance || 0); 
            setWalletApplicable(walletApplicable || false);  
            setMinOrderValue(minOrderForWallet || 0);
            setMinOrderToPlace(minOrderToPlace || 0);
            setCartToPlace(canPlaceOrder || false);
            setAddressStatus(addressStatus);
            // console.log("Delivery Fee:", fee, "Distance:", distance, "Note:", note, "Handling Fees:", handlingFee, "Grand Total:", grandTotal, "Wallet Applicable:", walletApplicable, "Min Order Value for Wallet:", minOrderForWallet, "Can Place Order:", canPlaceOrder, "Min Order to Place:", minOrderToPlace);
            if(!walletApplicable && minOrderForWallet > cartAmount){
              setUseWallet(false);
              setUsedWalletAmount(0);
            }
         const result = await checkEligibilityForActiveZones(latitude,longitude);
        //  console.log("result",result);
         if(result){
            setEligibleTime(result.eligible)
            setEligibleTimeSlot(result.matchedZone.cutofftime)
            if(result.eligible){
              setShowEligibleModal(true)
              fetchTimeSlots(result.eligible)
            }
         }
      setLoading(false);
      setLoadingItems((prevState) => ({
        ...prevState,
        [cartData.itemId]: false,
      }));

      return weightArray;
    } catch (error) {
      console.log(error);
      setError("Failed to load cart data");
      setLoading(false);
    }
  };

  const fetchPincodeMinValues = async () => {
       axios.get(`${BASE_URL}order-service/getAllUpdatePincodes`,{
        headers:{
          Authorization: `Bearer ${token}`,
        }
       })
       .then((response)=>{
        console.log("pincode min values response",response.data);
              setPincodeMinValues(response.data);
       })
   .catch((error)=>{
    console.log("Error fetching pincode min values:",error.response);
   })
  };

  const getMinValueForPincode = (pincode) => {
    const pincodeData = pincodeMinValues.find(item => item.pinCode == pincode && item.status === true);
    return pincodeData ? pincodeData.minimumVale : 499;
  };

  const fetchOrderAddress = async () => {
    try {
      const response = await axios({
        url: BASE_URL + `user-service/getAllAdd?customerId=${customerId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("api response....", response.data[response.data.length - 1]);
      setAddressStatus(response.data.length == 0 ? false : true)
      setAddressList(response.data);
      setAddressDetails(response.data[response.data.length - 1]);
      
      // Update minimum value based on pincode
      if (response.data.length > 0) {
        const lastAddress = response.data[response.data.length - 1];
        const minValue = getMinValueForPincode(lastAddress.pincode);
        setCurrentMinValue(minValue);
      }
      
    } catch (error) {
      console.error("Error fetching order address data:", error.response);
      setError("Failed to fetch order address data");
    }
  };

  const getOffers = async () => {
    // setLoading(true);

    try {
      const response = await axios.get(
        BASE_URL + "order-service/getAllCoupons"
      );

      if (response && response.data) {
        // Filter only active coupons
        const activeCoupons = response.data.filter(
          (coupon) => coupon.isActive === true && coupon.status === "PUBLIC"
        );
        setCoupons(activeCoupons);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching coupons:", error);
      setLoading(false);
    }
  };

  // ==================== UTILITY FUNCTIONS ====================

  const changeLocation = () => {
    navigation.navigate("Address Book");
  };

  const validateCartBeforeCheckout = (cartData) => {
    // Add your validation logic here
    return true;
  };

  // ==================== CALCULATION FUNCTIONS ====================

  async function grandTotalfunc() {
    let total = grandTotal + deliveryBoyFee + handlingFees;
    let usedWallet = 0;

    if (coupenApplied) {
      total -= coupenDetails;
    }

    if (useWallet && walletAmount > 0) {
      if (walletAmount >= total) {
        usedWallet = total; // Use only what's needed
        total = 0;
      } else {
        usedWallet = walletAmount; // Use full wallet balance
        total -= walletAmount;
      }
    }

    // Ensure total is never negative
    total = Math.max(0, total);

    setAfterWallet(walletAmount ? walletAmount - usedWallet : 0); // Update remaining wallet balance
    setUsedWalletAmount(usedWallet); // Store how much wallet is used
    setGrandTotalAmount(total);

    if (total === 0) {
      console.log("Get all Values",{total});
      // setSelectedPaymentMode('COD');
    }

    // console.log("Used Wallet:", usedWallet);
    // console.log("Final Grand Total:", total);
  }

  const placeOrder = () => {
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

    const type = grandTotal === 0 ? "COD" : selectedPaymentMode;

    // const avail = offeravailable === "YES" ? "YES" : null;

   postData = {
      address: addressDetails?.address,
      amount: grandTotalAmount,
      // amount:"1",
      customerId: customerId,
      flatNo: addressDetails?.flatNo,
      landMark: addressDetails?.landMark,
      orderStatus: type,
      pincode: addressDetails?.pincode,
      latitude: addressDetails?.latitude?? 0 ,
      longitude: addressDetails?.longitude?? 0 ,
      area: addressDetails?.area||"",
      houseType: addressDetails?.houseType||"",
      residenceName: addressDetails?.residenceName||"",
      walletAmount: usedWalletAmount,
      couponCode: coupon,
      couponValue: coupenDetails,
      deliveryBoyFee: deliveryBoyFee,
      subTotal: subTotal,
      gstAmount: totalGstSum,
      orderFrom: Platform.OS,
      dayOfWeek: selectedDay,
      expectedDeliveryDate: updatedDate,
      timeSlot: selectedTimeSlot,
   
      freeTicketAvailable: null,
      handlingFee: handlingFees,
    };

    console.log({ postData });
    // console.log("postdata", postData);

    console.log({ postData });
    setWaitingLoader(true)

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
        // console.log("order id after placing the order", response.data.orderId);
        setOrderId(response.data.orderId);
        // if (response.data.status) {
        //   Alert.alert(
        //     "Sorry",
        //     response.data.status,
        //     [
        //       {
        //         text: "OK",
        //         onPress: () => navigation.navigate("Home",{screen:"My Cart"}),
        //       },
        //     ]
        //   );
        //   return;
        // }
        if (response.data.status) {
          const message = response.data.status;
          // console.log("message", message);

          if (message === "Item not found or out of stock. Order not placed.") {
            Alert.alert("Out of Stock", message, [
              {
                text: "OK",
                onPress: () =>
                  // navigation.navigate("Home", { screen: "My Cart" }),
                navigation.navigate("My Cart"),
              },
            ]);
          } else if (
            message ===
            "We noticed that this offer has already been used at this address. To help you move forward, it’s been removed from the cart."
          ) {
            Alert.alert("Alert", message, [
              {
                text: "OK",
                onPress: () => {},
              },
            ]);
            setLoading(false);
          } else {
            Alert.alert("Notice", message, [
              {
                text: "OK",
                onPress: () => {},
              },
            ]);
          }

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
                    // setLoading(false);
                    setWaitingLoader(false);
                    setModalVissible(false);
                    navigation.navigate("My Orders");
                  },
                },
              ];

          axios
            .post(
              BASE_URL + "user-service/bmvCashBack",
              {
                customerId: customerId,
                orderAmount: grandTotalAmount,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              // console.log("BMV Cash Back Response:", response.data);
            })
            .catch((error) => {
              console.error("Error fetching data: ", error.response);
            });
          setLoading(false);
          setWaitingLoader(true);
          setTimeout(() => {
            Alert.alert("Order Confirmed!", message, buttons);
            //  setWaitingLoader(false)
          }, 1000);
        } else {
          console.log("ONLINE......");
          
          setTransactionId(response.data.paymentId);

          const data = {
            mid: "1152305",
            amount: grandTotalAmount,
            // amount: 1,
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
            txnNote: "Rice Order In Live Mobile App",
            vpa: "Getepay.merchant129014@icici",
          };
          // console.log({ data });
          getepayPortal(data);
          // GoogleAnalyticsService.purchase(
          //   response.data.paymentId,
          //   cartData,
          //   grandTotalAmount,
          //   "ONLINE"
          // );
        }
      })
      .catch((error) => {
        console.error("Order Placement Error:", error);
        Alert.alert("Error", error.response.data.error);
        setLoading(false);
        setWaitingLoader(false)
      });
      
  };


useEffect(() => {
  if (
    paymentStatus === "PENDING" ||
    paymentStatus === "" ||
    paymentStatus === null ||
    paymentStatus === "INITIATED"
  ) {
    const intervalId = setInterval(() => {
      Requery(paymentId);
    }, 4000);

    return () => clearInterval(intervalId);
  }

  // 🚨 Important: clear interval if CANCELLED
  if (paymentStatus === "CANCELLED") {
    return; // nothing runs, interval is stopped
  }
}, [paymentStatus, paymentId]);


  var postData ;

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
              onPress: () => {
                setLoading(false);
                setWaitingLoader(false);
              },
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

  async function Requery(paymentId) {
    console.log("Current Payment Status:", paymentStatus);
    if (
      paymentStatus === "PENDING" ||
      paymentStatus === "" ||
      paymentStatus === null ||
      paymentStatus === "INITIATED"
    ) {
      console.log("Before.....",paymentId)  
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
            console.error("Requery ID result", paymentId);
            var responseurl = resultobj.response;
            // console.error({ responseurl });
            var data = decryptEas(responseurl);
            data = JSON.parse(data);
            // console.error("Payment Result", data);
            if(data.paymentStatus === "PENDING" || data.paymentStatus === "INITIATED"){
            setPaymentStatus(data.paymentStatus);
            }
            // console.error(data.paymentStatus);
            if (
              data.paymentStatus == "SUCCESS" ||
              data.paymentStatus == "FAILED"
            ) {
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
                  alert(
                    "Order Confirmed!",
                    "Your order has been placed successfully. Thank you for shopping with us!"
                  );
                  console.error("Payment Status", data.paymentStatus);
                  console.error("Transaction ID", transactionId);
                  setWaitingLoader(false);
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
                            setModalVissible(false);
                            setWaitingLoader(false);
                            navigation.navigate("My Orders");
                          },
                        },
                      ];
                  
                  Alert.alert("Order Confirmed!", message, buttons);
                })
                .catch((error) => {
                  console.error("Error in payment confirmation:", error);
                  setLoading(false);
                  setWaitingLoader(false);
                  // Alert.alert("Error", "Payment confirmation failed.");
                });
            } else {
              setLoading(false);
              // setWaitingLoader(false);
            }
          }
        })
        .catch((error) => {
          console.log("Payment Status", error);
          setLoading(false);
          setWaitingLoader(false);
        });
    }
  }
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

  const applyCouponDirectly = (code) => {
    setCouponCode(code);
    // You can also automatically apply the coupon here
    // handleApplyCoupon();
  };

  // const fetchTimeSlots = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${BASE_URL}order-service/fetchTimeSlotlist`
  //     );
  //     const data = response.data;
  //     // console.log({ data });

  //     setSlotsData(data);
  //     let updatedOrderDate = new Date();
  //     updatedOrderDate.setDate(updatedOrderDate.getDate() + 1);
  //     setOrderDate(updatedOrderDate);

  //     const tomorrowDate = updatedOrderDate
  //       .toLocaleDateString("en-GB")
  //       .split("/")
  //       .join("-");

  //     // console.log("New Date (Updatedate):", tomorrowDate);

  //     const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
  //       const date = new Date(updatedOrderDate);
  //       date.setDate(updatedOrderDate.getDate() + i);
  //       const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
  //         date.getMonth() + 1
  //       )
  //         .toString()
  //         .padStart(2, "0")}-${date.getFullYear()}`;
  //       return {
  //         dayOfWeek: date
  //           .toLocaleDateString("en-GB", { weekday: "long" })
  //           .toUpperCase(),
  //         formattedDate: formattedDate,
  //       };
  //     });

  //     // console.log("Next seven days:", nextSevenDays);

  //     // Fixed the filter condition - changed isAvailable === false to isAvailable === true
  //     const availableDays = nextSevenDays
  //       .filter((day) => {
  //         const matchedDay = data.find((d) => d.dayOfWeek === day.dayOfWeek);
  //         return matchedDay && matchedDay.isAvailable === false;
  //       })
  //       .slice(0, 3);

  //     // console.log("Filtered available days:", availableDays);

  //     const transformedDays = availableDays.map((day) => ({
  //       label: `${day.dayOfWeek} (${day.formattedDate})`,
  //       value: day.dayOfWeek,
  //       formattedDate: day.formattedDate,
  //     }));

  //     // console.log("Transformed days:", transformedDays);
  //     setDays(transformedDays);

  //     if (Platform.OS === "ios") {
  //       setSelectedDay(transformedDays[0]?.value);
  //       const selectedDayData = transformedDays.find(
  //         (d) =>
  //           d.value?.trim()?.toUpperCase() ===
  //           selectedDay?.trim()?.toUpperCase()
  //       );

  //       // console.log({ selectedDayData });

  //       if (selectedDayData) {
  //         const fullDayData = slotsData.find(
  //           (d) =>
  //             d.dayOfWeek.trim().toUpperCase() ===
  //             selectedDay.trim().toUpperCase()
  //         );

  //         if (fullDayData) {
  //           setSelectedDate(selectedDayData.formattedDate || "");
  //           setUpdatedate(selectedDayData?.formattedDate);

  //           // console.log("Matching Slot:", fullDayData);

  //           const timeSlots = [
  //             { time: fullDayData.timeSlot1, status: fullDayData.slot1Status },
  //             { time: fullDayData.timeSlot2, status: fullDayData.slot2Status },
  //             { time: fullDayData.timeSlot3, status: fullDayData.slot3Status },
  //             { time: fullDayData.timeSlot4, status: fullDayData.slot4Status },
  //           ];

  //           // Filter for available slots only (status === false)
  //           // Assuming false means available and true means unavailable/booked
  //           const availableTimeStrings = timeSlots
  //             .filter((slot) => slot.time && !slot.status)
  //             .map((slot) => slot.time);

  //           // Remove duplicates
  //           const uniqueAvailableTimes = [...new Set(availableTimeStrings)];

  //           // Set only array of time strings
  //           setTimeSlots(uniqueAvailableTimes);
  //           setSelectedTimeSlot(uniqueAvailableTimes[0]);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching time slots:", error);
  //   }
  // };

const fetchTimeSlots = async (eligibleTime) => {
  try {
    const response = await axios.get(`${BASE_URL}order-service/fetchTimeSlotlist`);
    const data = response.data;

    setSlotsData(data);

    let currentDate = new Date();
    let startingDate = new Date(currentDate);

    if (eligibleTime) {
      // For Android & iOS: start from today
      // console.log("eligibleTime", eligibleTime);
      
      startingDate = currentDate;
    } else {
      // For Android & iOS: start from tomorrow
      startingDate.setDate(currentDate.getDate() + 1);
    }

    setOrderDate(startingDate);

    // Create next 7 days list
    const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startingDate);
      date.setDate(startingDate.getDate() + i);

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

    // console.log("Next seven days:", nextSevenDays);

    // Filter for available days (where isAvailable === false)
    const availableDays = nextSevenDays
      .filter((day) => {
        const matchedDay = data.find((d) => d.dayOfWeek === day.dayOfWeek);
        return matchedDay && matchedDay.isAvailable === false;
      })
      .slice(0, 4); // Get first 4 available days

    // console.log("Filtered available days:", availableDays);

    // Transform to label/value format
    const transformedDays = availableDays.map((day) => ({
      label: `${day.dayOfWeek} (${day.formattedDate})`,
      value: day.dayOfWeek,
      formattedDate: day.formattedDate,
    }));

    // console.log("Transformed days:", transformedDays);
    setDays(transformedDays);

    // Handle auto-selection for iOS
  if (Platform.OS === "ios") {
  if (transformedDays.length === 0 || !Array.isArray(slotsData)) return;

  const autoSelectedDay = eligibleTime
    ? transformedDays[0]?.value
    : transformedDays[1]?.value || transformedDays[0]?.value;

  setSelectedDay(autoSelectedDay);

  const selectedDayData = transformedDays.find(
    (d) => d.value.trim().toUpperCase() === autoSelectedDay.trim().toUpperCase()
  );

  if (!selectedDayData) return;

  const fullDayData = slotsData.find(
    (d) => d.dayOfWeek.trim().toUpperCase() === selectedDayData.value.trim().toUpperCase()
  );

  if (!fullDayData) return;

  setSelectedDate(selectedDayData.formattedDate);
  setUpdatedate(selectedDayData.formattedDate);

  const timeSlots = [
    { time: fullDayData.timeSlot1, status: fullDayData.slot1Status },
    { time: fullDayData.timeSlot2, status: fullDayData.slot2Status },
    { time: fullDayData.timeSlot3, status: fullDayData.slot3Status },
    { time: fullDayData.timeSlot4, status: fullDayData.slot4Status },
  ];

  const uniqueAvailableTimes = [...new Set(
    timeSlots
      .filter((slot) => slot.time && !slot.status)
      .map((slot) => slot.time)
  )];

  setTimeSlots(uniqueAvailableTimes);
  setSelectedTimeSlot(uniqueAvailableTimes[0] || null);
}


  } catch (error) {
    console.error("Error fetching time slots:", error);
  }
};

  const processThePayment = () => {
    // Add your payment processing logic here
    // console.log("Processing payment...");
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
        [{ onPress: () => navigation.navigate("My Cart") }]
      );
      return;
    } else if (!validateCartBeforeCheckout(cartData)) {
      return;
    } else {
      console.log("into placeOrder block");
      
      placeOrder();
    }
  };

  return {
    // ==================== PAYMENT & TRANSACTION STATE ====================
    transactionId,
    paymentId,
    paymentStatus,
    selectedPaymentMode,

    // ==================== PRICING & TOTALS STATE ====================
    grandTotal,
    grandTotalAmount,
    subTotal,
    totalSum,
    totalGstSum,
    gstAmount,
    itemsGstAmount,
    goldMakingCost,
    goldGstAmount,
    serviceFee,
    handlingFees,
    deliveryBoyFee,
    freeItemsDiscount,
    distance,
    // ==================== WALLET STATE ====================
    walletTotal,
    walletAmount,
    useWallet,
    usedWalletAmount,
    afterWallet,
    minOrderValue,
    walletApplicable,
    // ==================== COUPON STATE ====================
    couponCode,
    coupenDetails,
    coupenApplied,
    coupons,
    appliedCouponSuccessMsg,

    // ==================== ORDER & DELIVERY STATE ====================
    orderId,
    orderDate,
    updatedDate,
    availableDays,
    selectedDay,
    selectedDate,
    selectedDayName,
    days,
    timeSlots,
    selectedTimeSlot,
    slotsData,
    distance,
    handlingFees,
    showEligibleModal,
    eligibleTimeSlot,
    // ==================== CART & ITEMS STATE ====================
    cartData,
    cartItems,
    isLimitedStock,
    loadingItems,
    removalLoading,
    containerDecision,
    containerItemIds,
    onlyOneKg,
    isChecked,
    minOrderToPlace,
    cartToPlace,
    // ==================== UI STATE ====================
    showButtons,
    showModal,
    modalVisible,
    modalVissible,
    messageModal,
    showConfirmModal,
    showSuccess,
    loading,
    waitingLoader,

    // ==================== MODAL CONTENT STATE ====================
    title,
    type,
    primaryButtonText,
    secondaryButtonText,
    link,
    message,
    noteMessage,

    // ==================== MISC STATE ====================
    status,
    smallValue,
    offeravailable,
    profileForm,
    Icon,

    // ==================== ADDRESS STATE ====================
    addressList,
    locationData,
    addressDetails,
    // ==================== PAYMENT SETTERS ====================
    setTransactionId, 
    setPaymentId,
    setPaymentStatus,
    setSelectedPaymentMode,

    // ==================== PRICING SETTERS ====================
    setGrandTotal,
    setGrandTotalAmount,
    setSubTotal,
    setTotalSum,
    setTotalGstSum,
    setGstAmount,
    setItemsGstAmount,
    setGoldMakingCost,
    setGoldGstAmont,
    setServiceFee,
    setHandlingFees,
    setDeliveryBoyFee,
    setHandlingFees,
    setFreeItemsDiscount,
    
    // ==================== WALLET SETTERS ====================
    setWalletTotal,
    setWalletAmount,
    setUseWallet,
    setUsedWalletAmount,
    setAfterWallet,


    // ==================== COUPON SETTERS ====================
    setCouponCode,
    setCoupenDetails,
    setCoupenApplied,
    setCoupons,
    setAppliedCouponSuccessMsg,

    // ==================== ORDER & DELIVERY SETTERS ====================
    setOrderId,
    setOrderDate,
    setUpdatedate,
    setAvailableDays,
    setSelectedDay,
    setSelectedDate,
    setSelectedDayName,
    setDays,
    setTimeSlots,
    setSelectedTimeSlot,
    setSlotsData,
    setDistance,
    setAddressDetails,
    setShowEligibleModal,
    // ==================== CART & ITEMS SETTERS ====================
    setCartData,
    setCartItems,
    setOnlyOneKg,
    setIsChecked,

    // ==================== UI SETTERS ====================
    setShowButtons,
    setShowModal,
    setModalVisible,
    setModalVissible,
    setMessageModal,
    setShowConfirmModal,
    setShowSuccess,
    setLoading,
    setWaitingLoader,

    // ==================== MODAL CONTENT SETTERS ====================
    setTitle,
    setType,
    setPrimaryButtonText,
    setSecondaryButtonText,
    setLink,
    setMessge,
    setNoteMessage,

    // ==================== MISC SETTERS ====================
    setStatus,
    setSmallValue,
    setOfferAvailable,
    setProfileForm,

    // ==================== ADDRESS SETTERS ====================
    setAddressList,
    setLocationData,
    setAddressData,
    setDistance,
    // ==================== PAYMENT HANDLERS ====================
    confirmPayment,
    processThePayment,

    // ==================== COUPON HANDLERS ====================
    handleApplyCoupon,
    applyCouponDirectly,
    deleteCoupen,

    // ==================== ORDER HANDLERS ====================
    handleOrderConfirmation,
    handleDayChange,
    handleTimeSlotChange,
    handleExchangePolicyChange,

    // ==================== CART HANDLERS ====================
    handleIncrease,
    handleDecrease,
    handleRemoveItem,
    handleRemoveFreeItem,
    handleRemove,

    // ==================== UI HANDLERS ====================
    openModal,
    handleCheckboxToggle,
    copyToClipboard,

    // ==================== COMPUTED VALUES & UTILITIES ====================
    token,
    customerId,
    styles,
    changeLocation,
    fetchOrderAddress,
    fetchTimeSlots,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
    width: "100%",
  },
  container1: {
    marginTop: 5,
    padding: 10,
    height: height * 0.3,
    flex: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 8,
    textAlign: "left",
    marginTop: 10,
  },
  addButton: {
    color: "#ecb01e",
    textAlign: "right",
    fontWeight: "600",
    marginBottom: 15,
    marginLeft: 0,
  },
  addressRow: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 2,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#495057",
  },
  addressDetail: {
    fontSize: 12,
    color: "#6c757d",
  },
  noDeliveryRow: {
    backgroundColor: "#e9ecef",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  noDeliveryText: {
    color: "#6c757d",
  },

  paymentDetails: {
    // marginTop:30,
    alignSelf: "center",
    marginRight: 10,
  },

  grandTotalText: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#28a745",
  },

  placeOrderButton: {
    backgroundColor: COLORS.services,
    padding: 10,
    alignSelf: "center",
    borderRadius: 8,
    width: width * 0.9,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  placeOrderButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
  },

  flatListContent: {
    paddingBottom: 80,
  },

  iconAndTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  addressContainer: {
    flex: 1,
  },

  icon: {
    paddingLeft: 30,
    marginRight: 5,
    fontWeight: "bold",
  },
  card: {
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 30,
  },
  fixedBottomContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    maxHeight: 150, // Compact height
  },

  // Address Section
  addressSection: {
    marginBottom: 12,
  },

  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  changeAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  changeAddressText: {
    fontSize: 12,
    color: "#007bff",
    fontWeight: "500",
  },

  addressText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },

  noAddressText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },

  // Payment + Order Row
  paymentOrderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  paymentSection: {
    flex: 1,
  },

  paymentButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  paymentContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  paymentText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },

  placeOrderButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  placeOrderText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
   cartItemContainer: {
    marginBottom:5,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flatListContent: {
    paddingBottom: 5,
  },

  // Empty Cart Styles
  emptyCartContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 32,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginHorizontal: 16,
  },
  iconCircle: {
    backgroundColor: "#fff",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  iconText: {
    fontSize: 32,
  },
  emptyCartTitle: {
    fontSize: 18,
    color: "#2c3e50",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24,
  },
  emptyCartSubtitle: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: COLORS.services,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: COLORS.services,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    minWidth: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cartContainer: {
    // backgroundColor: "#4B0082",
    fontSize:20,
    fontWeight:"700",
    marginBottom:5,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  headerText1:{
    fontSize:18,
    fontWeight:"600",
    color:"#000"
  }
});

