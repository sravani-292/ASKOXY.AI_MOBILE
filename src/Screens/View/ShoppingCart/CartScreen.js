import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Modal,
  Animated,
  Easing
} from "react-native";
import axios from "axios";
import { StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../../../Redux/constants/theme";
import { Alert } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

import ContainerOfferModal from "./ContainerOfferModal";

import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("window");
import BASE_URL, { userStage } from "../../../../Config";
import LottieView from "lottie-react-native";
import ContainerSoftCopy from "./ContainerSoftCopy";

const CartScreen = () => {
  // State management for user data
  const userData = useSelector((state) => state?.counter || {});
  const token = userData?.accessToken || '';
  const customerId = userData?.userId || '';

  // Input validation for user data
  if (!token || !customerId) {
    // Handle missing credentials
    useEffect(() => {
      Alert.alert(
        "Authentication Error",
        "Please login again to continue",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    }, []);
  }

  const navigation = useNavigation();
  const [cartData, setCartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loadingItems, setLoadingItems] = useState({});
  const [removalLoading, setRemovalLoading] = useState({});
  const [user, setUser] = useState({});
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [hasWeight, setHasWeight] = useState("");
  const [containerAddedPrice, setContainerAddedPrice] = useState(false);
  const [apiAttempts, setApiAttempts] = useState(0); // Track API retries
  const [lastFetchTime, setLastFetchTime] = useState(0); // Rate limiting
  const [checkoutInProgress, setCheckoutInProgress] = useState(false); // Prevent double checkout

  const [address, setAddress] = useState({
    email: "",
    mobileNumber: "",
    name: "",
    alterMobileNumber: "",
  });
  
  const locationdata = {
    flatNo: "",
    landMark: "",
    pincode: "",
    address: "",
    addressType: "",
    latitude: "",
    longitude: "",
    status: false,
  };

  const addressdata = {
    addressId: "",
    hasId: false,
  };
  
  const [containerDecision, setContainerDecision] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showOfferAvail, setShowOfferAvail] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [versionChange, setVersionChange] = useState("English");
  const scaleValue = new Animated.Value(1); // Initial scale value for zoom-in animation

  // Constants moved to a proper configuration object for easier maintenance
  const CONTAINER_TYPES = {
    SMALL: {
      id: "53d7f68c-f770-4a70-ad67-ee2726a1f8f3",
      WEIGHT: "10",
      NAME: "10kg Rice Container",
      Price: 2000
    },
    LARGE: {
      id: "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61",
      WEIGHT: "26",
      NAME: "26kg Rice Container",
      Price: 2500
    }
  };

  // Maximum number of API retry attempts
  const MAX_API_ATTEMPTS = 3;
  // Minimum time between API calls in milliseconds
  const API_RATE_LIMIT = 500;

  // Zoom-in animation
  useEffect(() => {
    if (modalVisible) {
      Animated.timing(scaleValue, {
        toValue: 1, // Fully expanded
        duration: 500, // Animation duration
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset scale when modal is hidden
      scaleValue.setValue(1);
    }
  }, [modalVisible]);

  // Load container decision and check cart status
  useEffect(() => {
    // Load saved container decision
    const loadContainerDecision = async () => {
      try {
        const savedDecision = await AsyncStorage.getItem('containerDecision');
        if (savedDecision) {
          setContainerDecision(savedDecision);
        }
      } catch (error) {
        console.log("Error loading container decision:", error);
        // Fallback to default state
        setContainerDecision(null);
      }
    };

    // Check if containers that should be in cart are still there
    const checkCartForContainers = () => {
      if (!Array.isArray(cartData) || cartData.length === 0) {
        return;
      }
      
      const containerExists = cartData.some(item => 
        item && item.itemId && (
          item.itemId === CONTAINER_TYPES.LARGE.id || 
          item.itemId === CONTAINER_TYPES.SMALL.id
        )
      );
      
      if (!containerExists && containerDecision === 'yes') {
        // If user had a container but it's no longer in cart, reset decision
        setContainerDecision(null);
        setContainerAddedPrice(false);
        try {
          AsyncStorage.removeItem('containerDecision')
            .catch(err => console.log("Error removing container decision:", err));
        } catch (error) {
          console.log("AsyncStorage removal error:", error);
        }
      }
    };
    
    loadContainerDecision();
    checkCartForContainers();
  }, [cartData, containerDecision]);

  // Handle container "Yes" button
  const handleYes = async() => {
    if (!customerId || !token) {
      Alert.alert("Error", "Authentication required. Please login again.");
      return;
    }
    
    setContainerDecision('yes');
  
    try {
      await AsyncStorage.setItem('containerDecision', 'yes');
    } catch (error) {
      console.log("Error saving container decision:", error);
    }
    
    setModalVisible(false);

    // Validate weight before proceeding
    if (!hasWeight) {
      console.error("Weight is undefined");
      Alert.alert("Error", "Container weight not specified");
      return;
    }

    const containerId = hasWeight === "26kgs" ? CONTAINER_TYPES.LARGE.id : CONTAINER_TYPES.SMALL.id;
    
    if (!containerId) {
      console.error("Container ID is undefined");
      return;
    }
    
    const data = { customerId: customerId, itemId: containerId };
    
    try {
      setLoading(true);
      const response = await axios.post(
        BASE_URL + "cart-service/cart/add_Items_ToCart",
        data,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
    
      console.log("item added response", response?.data);
      
      if (response?.data?.errorMessage === "Item added to cart successfully") {
        Alert.alert("Success", `Successfully added ${hasWeight} container to your cart`);
        fetchCartData();
      } else {
        Alert.alert("Alert", response?.data?.errorMessage || "Failed to add container");
      }
    } catch (error) {
      console.error("Error adding container:", error?.response?.data || error?.message || error);
      Alert.alert("Error", "Failed to add container to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle container "No" button
  const handleNo = async() => {
    setModalVisible(false);
    setContainerDecision('no');
    setContainerAddedPrice(false);
    
    try {
      await AsyncStorage.setItem('containerDecision', 'no');
    } catch (error) {
      console.log("Error saving container decision:", error);
    }
  };

  // Handle quantity increase for cart items
  const handleIncrease = async (item) => {
    if (!item || !item.itemId) {
      console.error("Invalid item data for quantity increase");
      return;
    }
    
    // Prevent multiple rapid clicks
    if (loadingItems[item.itemId]) return;
    
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    
    try {
      await increaseCartItem(item);
    } catch (error) {
      console.error("Error increasing quantity:", error);
      Alert.alert("Error", "Failed to increase quantity. Please try again.");
    } finally {
      setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
    }
  };

  // Handle quantity decrease for cart items
  const handleDecrease = async (item) => {
    if (!item || !item.itemId) {
      console.error("Invalid item data for quantity decrease");
      return;
    }
    
    // Prevent multiple rapid clicks
    if (loadingItems[item.itemId]) return;
    
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    
    try {
      // Check if quantity will be reduced to zero
      const currentQuantity = cartItems[item.itemId] || item.cartQuantity || 0;
      
      if (currentQuantity <= 1) {
        // Ask before removing the last item
        handleRemove(item);
      } else {
        await decreaseCartItem(item);
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      Alert.alert("Error", "Failed to decrease quantity. Please try again.");
    } finally {
      // Use a reasonable timeout to prevent too many API calls
      setTimeout(() => {
        setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
      }, 800);
    }
  };

  // Handle item removal from cart
  const handleRemove = async (item) => {
    if (!item || !item.cartId) {
      console.error("Invalid item data for removal", item);
      return;
    }

    // Prevent multiple removal requests for same item
    if (removalLoading[item.cartId]) return;
    
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove "${item.itemName || 'this item'}" from your cart?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setRemovalLoading((prevState) => ({
              ...prevState,
              [item.cartId]: true,
            }));

            try {
              await removeCartItem(item);
            } catch (error) {
              console.error("Error removing item:", error);
              Alert.alert("Error", "Failed to remove item. Please try again.");
            } finally {
              setRemovalLoading((prevState) => ({
                ...prevState,
                [item.cartId]: false,
              }));
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Fetch cart data with rate limiting and retry logic
  const fetchCartData = async (force = false) => {
    // Input validation
    if (!customerId || !token) {
      console.error("Missing customer ID or token");
      setError("Authentication error. Please login again.");
      setLoading(false);
      return;
    }
    
    // Rate limiting to prevent excessive API calls
    const now = Date.now();
    if (!force && now - lastFetchTime < API_RATE_LIMIT) {
      console.log("Rate limiting cart fetch");
      return;
    }
    
    setLastFetchTime(now);
    setLoading(true);
    
    try {
      const response = await axios.get(
        `${BASE_URL}cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      // Response validation
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }
      
      console.log("Cart API response status:", response.status);
      
      const cartData = response?.data?.customerCartResponseList || [];
      
      // Reset API attempts on success
      setApiAttempts(0);
      
      // Type checking for proper array
      if (!Array.isArray(cartData)) {
        console.error("Cart data is not an array:", cartData);
        setCartData([]);
        setIsLimitedStock({});
        setCartItems({});
        setLoading(false);
        return;
      }
      
      // Extract weights for container logic
      const weightArray = cartData
        .filter(item => item && item.weight !== undefined && item.weight !== null)
        .map(item => item.weight);
      
      console.log("Cart item weights:", weightArray);

      // Process cart items to map quantities and stock status
      const cartItemsMap = cartData.reduce((acc, item) => {
        // Skip invalid items
        if (!item || !item.itemId || item.cartQuantity === undefined || item.quantity === undefined) {
          console.error("Invalid item in cartData:", item);
          return acc;
        }
        acc[item.itemId] = item.cartQuantity;
        return acc;
      }, {});

      // Track items with limited stock
      const limitedStockMap = cartData.reduce((acc, item) => {
        if (!item) return acc;
        
        if (item.quantity === 0) {
          acc[item.itemId] = "outOfStock";
        } else if (item.quantity <= 5) {
          acc[item.itemId] = "lowStock";
        }
        return acc;
      }, {});

      setError(null);
      setCartData(cartData);
      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
      
      // Check for container eligibility
      checkContainerEligibility(cartData);
      
      // Calculate total
      totalCart();
      
      return weightArray;
    } catch (error) {
      console.error("Cart fetch error:", error?.response?.data || error?.message || error);
      
      setError("Failed to load cart data. Please try again.");
      
      // Implement retry logic for transient errors
      if (apiAttempts < MAX_API_ATTEMPTS) {
        console.log(`Retrying cart fetch (${apiAttempts + 1}/${MAX_API_ATTEMPTS})...`);
        setApiAttempts(apiAttempts + 1);
        setTimeout(() => fetchCartData(true), 1000);
      }
    } finally {
      setLoading(false);
      setLoadingItems({});
    }
  };

  // Check container eligibility based on cart items
  function checkContainerEligibility(cartData) {
    if (!customerId) {
      console.error("Missing customer ID for container check");
      return;
    }
    
    // Handle empty cart case explicitly
    if (!Array.isArray(cartData) || cartData.length === 0) {
      console.log("Cart is empty, no container offer triggered");
      return;
    }
    
    // First check the container interest API
    axios
      .get(`${BASE_URL}cart-service/cart/ContainerInterested/${customerId}`)
      .then((response) => {
        console.log("Container interest API response:", response?.data);

        // If user already made a container decision, respect it
        // if (response?.data?.freeContainerStatus === "Interested") {
        //   console.log("User already interested in container, no alert needed");
        //   setModalVisible(false);
        //   return;
        // }
        
        // Container eligibility logic - only show if user hasn't decided yet
        if (response?.data?.freeContainerStatus === null) {
          const validItems = cartData.filter(item => item && typeof item === 'object');
          
          // Check for specific weight items
          const has10kg = validItems.some(item => Number(item.weight) === 10);
          const has26kg = validItems.some(item => Number(item.weight) === 26);
          const has1kg = validItems.some(item => Number(item.weight) === 1);
          
          if (has10kg && has26kg) {
            setHasWeight("26kgs"); // Prefer larger container when both exist
            setContainerAddedPrice(true);
            setModalVisible(true);
          } else if (has26kg) {
            setHasWeight("26kgs");
            setContainerAddedPrice(true);
            setModalVisible(true);
          } else if (has10kg) {
            setHasWeight("10kgs");
            setContainerAddedPrice(true);
            setModalVisible(true);
          }else if (has1kg) {

          // Check for 1kg special offer
          checkOneKgOfferEligibility(validItems, has1kg);
          }
        } else {
          // Even if container status is set, still check 1kg offers
          const validItems = cartData.filter(item => item && typeof item === 'object');
          const has1kg = validItems.some(item => Number(item.weight) === 1);
          
          checkOneKgOfferEligibility(validItems, has1kg);
        }
      })
      .catch((error) => {
        console.error("Error checking container interest:", error?.response?.data || error?.message || error);
        
        // Fallback to local logic if API fails
        const validItems = cartData.filter(item => item && typeof item === 'object');
        const has1kg = validItems.some(item => Number(item.weight) === 1);
        checkOneKgOfferEligibility(validItems, has1kg);
      });
  }

  // Check eligibility for 1kg special offer
  function checkOneKgOfferEligibility(cartItems, has1kg) {
    // Handle empty cart case explicitly
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      console.log("Cart is empty, no 1kg offer triggered");
      return;
    }

    if (!has1kg || !customerId) return;

    console.log("Checking 1kg offer eligibility...");
    
    // Find 1kg items and check if any already have quantity >= 2
    const oneKgBags = cartItems.filter(
      item => item && Number(item.weight) === 1
    );
    
    const anyOneKgHasTwoOrMore = oneKgBags.some(
      item => item.cartQuantity >= 2
    );

    // Check offer API for eligibility
    axios
      .get(`${BASE_URL}cart-service/cart/oneKgOffer?customerId=${customerId}`)
      .then((response) => {
        
        // Show offer if eligible and no item already has quantity >= 2
        if (response?.data && response?.data.cartQuantity < 2 && !anyOneKgHasTwoOrMore) {
          setShowOffer(true);
        } else {
          setShowOffer(false);
        }
      })
      .catch((error) => {
        console.error("Error checking 1kg offer:", error?.response?.data || error?.message || error);
        setShowOffer(false);
      });
  }

  // Handle adding cheapest 1kg bag for promotion
  const handleAddCheapest1kgBag = async () => {
    if (!customerId || !token) {
      Alert.alert("Error", "Authentication required. Please login again.");
      return;
    }
    
    try {
      // Filter all 1kg bags
      const oneKgBags = (cartData || []).filter(
        item => item && Number(item.weight) === 1
      );

      if (oneKgBags.length === 0) {
        Alert.alert("Error", "No 1kg bag found in your cart");
        setShowOffer(false);
        return;
      }

      // Find the one with the lowest price
      const cheapestBag = oneKgBags.reduce((min, curr) =>
        (!min || (Number(curr.itemPrice) < Number(min.itemPrice))) ? curr : min
      );

      if (!cheapestBag || !cheapestBag.itemId) {
        Alert.alert("Error", "Could not identify eligible bag");
        return;
      }

      const currentQuantity = cartItems[cheapestBag.itemId] || cheapestBag.cartQuantity || 0;
      const newQuantity = currentQuantity + 1;

      // Call API to increase quantity
      const response = await axios.patch(
        `${BASE_URL}cart-service/cart/incrementCartData`,
        {
          cartQuantity: newQuantity,
          customerId,
          itemId: cheapestBag.itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response?.status === 200) {
        setShowOffer(false);
        Alert.alert("Success", `Added 1 more ${cheapestBag.itemName} to your cart!`);
        await fetchCartData(true); // Force refresh cart
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Failed to add 1kg item:", error?.response?.data || error?.message || error);
      Alert.alert("Error", "Could not update the cart. Please try again.");
      setShowOffer(false);
    }
  };

  // Set up effect to refresh cart when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchCartData();
      totalCart();
      
      // Check for deactivated account status
      handleDeactivateStatus();
      
      return () => {
        // Clean up any pending operations
        setLoading(false);
        setLoadingItems({});
        setRemovalLoading({});
      };
    }, [customerId, token])
  );

  // Handle refresh action
  const onRefresh = useCallback(() => {
    fetchCartData(true);
    totalCart();
  }, [customerId, token]);

  // Check user profile completeness
  const getProfile = async () => {
    if (!customerId) {
      Alert.alert("Error", "User ID not found. Please log in again.");
      return false;
    }
    
    try {
      const response = await axios.get(
        `${BASE_URL}user-service/customerProfileDetails?customerId=${customerId}`
      );

      if (response?.status === 200) {
        if (!response.data?.firstName) {
          Alert.alert(
            "Incomplete Profile",
            "Please fill out your profile details to proceed with checkout.",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("Profile"),
              },
            ]
          );
          return false;
        }
        return true;
      } else {
        console.error("Unexpected profile response status:", response?.status);
        return false;
      }
    } catch (error) {
      console.error("Profile error:", error?.response?.data || error?.message || error);
      Alert.alert("Error", "Could not verify your profile. Please try again.");
      return false;
    }
  };

  // Calculate cart total
  const totalCart = async () => {
    if (!customerId || !token) {
      console.error("Missing credentials for totalCart");
      return;
    }
    
    try {
      const response = await axios({
        url: `${BASE_URL}cart-service/cart/cartItemData`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          customerId: customerId,
        },
        timeout: 5000,
      });

      if (response?.data?.totalSum !== undefined) {
        // console.log("Total sum response:", response.data);
        setGrandTotal(Number(response.data.totalSum));
      } else {
        console.error("Invalid total sum in response:", response?.data);
        // Calculate total manually as fallback
        if (Array.isArray(cartData) && cartData.length > 0) {
          const calculatedTotal = cartData.reduce((total, item) => {
            if (!item || !item.itemPrice || !item.cartQuantity) return total;
            return total + (Number(item.itemPrice) * Number(item.cartQuantity));
          }, 0);
          setGrandTotal(calculatedTotal);
        } else {
          setGrandTotal(0);
        }
      }
    } catch (error) {
      console.error("Total calculation error:", error?.response?.data || error?.message || error);
      setError("Failed to calculate cart total");
      
      // Fallback to manual calculation
      if (Array.isArray(cartData) && cartData.length > 0) {
        const calculatedTotal = cartData.reduce((total, item) => {
          if (!item || !item.itemPrice || !item.cartQuantity) return total;
          return total + (Number(item.itemPrice) * Number(item.cartQuantity));
        }, 0);
        setGrandTotal(calculatedTotal);
      }
    }
  };

  // Navigate to item details
  const handleImagePress = (item) => {
    if (!item) return;
    navigation.navigate("Item Details", { item });
  };

  // Increase item quantity in cart
  const increaseCartItem = async (item) => {
    if (!item || !item.itemId || !customerId || !token) {
      console.error("Missing data for quantity increase");
      return;
    }
    
    try {
      const response = await axios.patch(
        `${BASE_URL}cart-service/cart/incrementCartData`,
        {
          customerId: customerId,
          itemId: item.itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      
      if (response?.status !== 200) {
        throw new Error(`Unexpected response status: ${response?.status}`);
      }
      
      fetchCartData();
      totalCart();
    } catch (err) {
      console.error("Error increasing quantity:", err?.response?.data || err?.message || err);
      throw err; // Let the caller handle the error
    }
  };

  // Decrease item quantity in cart
  const decreaseCartItem = async (item) => {
    if (!item || !item.itemId || !customerId || !token) {
      console.error("Missing data for quantity decrease");
      return;
    }
    
    try {
      // Check if we're removing the last item
      if ((cartItems[item.itemId] || item.cartQuantity || 0) <= 1) {
        handleRemove(item);
        return;
      }
      
      const response = await axios.patch(
        `${BASE_URL}cart-service/cart/decrementCartData`,
        {
          customerId: customerId,
          itemId: item.itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response?.status !== 200) {
        throw new Error(`Unexpected response status: ${response?.status}`);
      }
      
      fetchCartData();
      totalCart();
    } catch (error) {
      console.error("Error decreasing quantity:", error?.response?.data || error?.message || error);
      throw error; // Let the caller handle the error
    }
  };

  // Remove item from cart
  const removeCartItem = async (item) => {
    if (!item || !item.cartId || !token) {
      console.error("Missing data for item removal", item);
      return;
    }
    
    try {
      const response = await axios.delete(
        `${BASE_URL}cart-service/cart/remove`,
        {
          data: {
            id: item.cartId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.status !== 200) {
        throw new Error(`Unexpected response status: ${response?.status}`);
      }
      
      console.log("Item removal response:", response?.data);
      
      // Reset container decision if a container was removed
      const containerLargeId = CONTAINER_TYPES.LARGE.id;
      const containerSmallId = CONTAINER_TYPES.SMALL.id;
      
      if (item.itemId === containerLargeId || item.itemId === containerSmallId) {
        setContainerDecision(null);
        setContainerAddedPrice(false);
        
        try {
          await AsyncStorage.removeItem('containerDecision');
          console.log("Container decision reset");
        } catch (error) {
          console.log("Error resetting container decision:", error);
        }
      }
      
      fetchCartData();
      totalCart();
    } catch (error) {
      console.error("Error removing cart item:", error?.response?.data || error?.message || error);
      throw error; // Let the caller handle the error
    }
  };

  // Check if account is deactivated
  const handleDeactivateStatus = async () => {
    try {
      const reactivate = await AsyncStorage.getItem("deactivate");
      if (reactivate === "false") {
        Alert.alert(
          "Deactivated Account",
          "Your account is currently deactivated. Would you like to reactivate it to continue?",
          [
            { 
              text: "Yes", 
              onPress: () => navigation.navigate("Write To Us") 
            },
            { 
              text: "No",
              style: "cancel" 
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error("Error checking account status:", error);
    }
  };

  // Validate cart before proceeding to checkout
  const validateCartBeforeCheckout = () => {
    if (!Array.isArray(cartData) || cartData.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before checking out.");
      return false;
    }
    
    // Check for out-of-stock items
    const outOfStockItems = cartData.filter(item => 
      item && isLimitedStock[item.itemId] === "outOfStock"
    );

    if (outOfStockItems.length > 0) {
      const itemNames = outOfStockItems.map(item => item.itemName).join(", ");
      Alert.alert(
        "Out of Stock Items",
        `The following items are out of stock: ${itemNames}. Please remove them before proceeding.`,
        [{ text: "OK" }]
      );
      return false;
    }
    
    // Check for items with too low stock
    const tooManyItems = cartData.filter(item => 
      item && item.cartQuantity > item.quantity
    );
    
    if (tooManyItems.length > 0) {
      const itemNames = tooManyItems.map(item => 
        `${item.itemName} (requested: ${item.cartQuantity}, available: ${item.quantity})`
      ).join(", ");
      
      Alert.alert(
        "Limited Stock",
        `The following items have limited stock: ${itemNames}. Please update quantities before proceeding.`,
        [{ text: "OK" }]
      );
      return false;
    }
    
    return true;
  };

  // Handle checkout process
  const handleCheckout = async () => {
    const profile = await getProfile();

    if (!profile) {
      return;
    }

    const outOfStockItems = cartData.filter((item) => {
      return isLimitedStock[item.itemId] === "outOfStock";
    });

    if (outOfStockItems.length > 0) {
      Alert.alert(
        "🚨 Some Items Are Out of Stock!",
        `The following items are currently unavailable:\n\n${outOfStockItems
          .map((item) => `- 🛑 ${item.itemName}`)
          .join("\n")}\n\nPlease remove them to proceed.`,
        [{ text: "OK", style: "cancel" }]
      );
      return;
    }

    let insufficientStockItems = [];

    cartData.forEach((item) => {
      if (item.cartQuantity > item.quantity) {
        insufficientStockItems.push(
          `${item.itemName}: Only ${item.quantity} left, but you added ${item.cartQuantity}`
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
              navigation.navigate("My Cart");
            },
          },
        ]
      );
      return false;
    }

    // ✅ Proceed to checkout
    navigation.navigate("Checkout", {
      subtotal: cartData.reduce(
        (acc, item) =>
          acc + item.priceMrp * (cartItems[item.itemId] || item.cartQuantity),
        0
      ),
      locationdata,
      addressdata,
    
    });
  };

  // Empty cart component
  const EmptyCartComponent = () => {
    return (
      <View style={styles.emptyCartContainer}> 
      {/* <MaterialIcons
                  name="shopping-cart"
                  size={80}
                  color="#A9A9A9"
                  style={styles.emptyCartImage}
                /> */}
      <View style={styles.emptyCartView}>
        <LottieView 
          source={require("../../../../assets/emptyLoading.json")}
          autoPlay
          loop
          style={styles.emptyCartImage}
        />
        </View>
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopNowButton}
          onPress={() => navigation.navigate("Rice Products", {
            screen: "Rice Products",
            category: "All CATEGORIES",
          })}
        >
          <Text style={styles.shopNowButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Loading component
  const LoadingComponent = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your cart...</Text>
      </View>
    );
  };

  // Item stock indicator
  const StockIndicator = ({ itemId }) => {
    const stockStatus = isLimitedStock[itemId];
    
    if (!stockStatus) return null;
    
    return (
      <View 
        style={[
          styles.stockIndicator, 
          stockStatus === "outOfStock" ? styles.outOfStock : styles.lowStock
        ]}
      >
        <Text style={styles.stockIndicatorText}>
          {stockStatus === "outOfStock" ? "Out of Stock" : "Low Stock"}
        </Text>
      </View>
    );
  };


  // Offer Modal for 1kg promotion
  const OneKgOfferModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showOffer}
        onRequestClose={() => setShowOffer(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowOffer(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.offerModalContainer}>
                <View style={styles.offerModalHeader}>
                  <Text style={styles.offerModalTitle}>Special Offer!</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowOffer(false)}
                  >
                    <MaterialIcons name="close" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.offerModalBody}>
                  <Image
                    source={require("../../../../assets/offer.png")}
                    style={styles.offerImage}
                    resizeMode="contain"
                  />
                  
                  <Text style={styles.offerModalText}>
                  Buy 1kg and Get 1kg Absolutely FREE! 🛍
                  </Text>
                  <Text style={styles.noteText}><Text style={{fontWeight:"bold"}}>📍 Note:</Text>
                    The 1kg + 1kg Free Offer is valid only once per user and applies exclusively to 1kg rice bags.
                    This offer can only be redeemed once per address and is applicable on the first successful delivery only.
                    Once claimed, it cannot be reused. Grab it while it lasts!</Text>
                    <Text style={styles.noteText}>📍 గమనిక: 1+1 కేజీ రైస్ ఆఫర్ ఒకే చిరునామాకు ఒక్కసారి మాత్రమే — మొదటి విజయవంతమైన డెలివరీకి మాత్రమే వర్తిస్తుంది.
                  </Text>
                </View>
                
                <View style={styles.offerModalFooter}>
                  <TouchableOpacity
                    style={[styles.offerModalButton, styles.offerCancelButton]}
                    onPress={() => setShowOffer(false)}
                  >
                    <Text style={styles.offerButtonTextCancel}>No, Thanks</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.offerModalButton, styles.offerConfirmButton]}
                    onPress={handleAddCheapest1kgBag}
                  >
                    <Text style={styles.offerButtonTextConfirm}>Add One More</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  // Render individual cart item
  const renderItem = ({ item }) => {
    // Guard against invalid items
    if (!item || !item.itemId || !item.itemName) {
      console.error("Invalid item data:", item);
      return null;
    }
    
    const isLoading = loadingItems[item.itemId] || false;
    const isRemoving = removalLoading[item.cartId] || false;
    const isOutOfStock = isLimitedStock[item.itemId] === "outOfStock";
    const isLowStock = isLimitedStock[item.itemId] === "lowStock";
    
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => handleImagePress(item)}
          disabled={isOutOfStock}
          style={[styles.itemImageContainer, isOutOfStock && styles.disabledItem]}
        >
          <Image
            source={{ uri: item.image || "https://via.placeholder.com/150" }}
            style={styles.itemImage}
            resizeMode="cover"
            defaultSource={{ uri: "https://via.placeholder.com/150" }}
          />
          <StockIndicator itemId={item.itemId} />
        </TouchableOpacity>
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.itemName}
          </Text>
          
          <Text style={styles.itemWeight}>
            {item.weight} {item.weight===1? "kg":item.units}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>₹{item.itemPrice}</Text>
          </View>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                (isLoading || isOutOfStock) && styles.disabledButton
              ]}
              onPress={() => handleDecrease(item)}
              disabled={isLoading || isOutOfStock}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <View style={styles.quantityTextContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.quantityText}>
                  {cartItems[item.itemId] || item.cartQuantity || 0}
                </Text>
              )}
            </View>
            
            <TouchableOpacity
              style={[
                styles.quantityButton,
                (isLoading || isOutOfStock || (item.quantity && item.cartQuantity >= item.quantity)) && styles.disabledButton
              ]}
              onPress={() => handleIncrease(item)}
              disabled={isLoading || isOutOfStock || (item.quantity && item.cartQuantity >= item.quantity)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemove(item)}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <ActivityIndicator size="small" color="red" />
          ) : (
            <MaterialIcons name="delete-outline" size={22} color="red" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Main render method
  return (
    <View style={styles.container}>
      {/* Container offer modal */}
      {/* <ContainerOfferModal modalVisible={modalVisible} setModalVisible={setModalVisible} hasWeight={hasWeight} onAccept={handleYes} onDecline={() => setModalVisible(false)} /> */}
      <ContainerSoftCopy visible={modalVisible} hasWeight = {hasWeight} onClose={()=>setModalVisible(false)} addContainer={handleYes} cartData={cartData}/>
      {/* 1kg offer modal */}
      <OneKgOfferModal />
      
      {/* Show loading component if loading */}
      {loading && !error ? (
        <LoadingComponent />
      ) : error ? (
        // Show error message
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchCartData(true)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : Array.isArray(cartData) && cartData.length > 0 ? (
        // Show cart items
        <View style={styles.cartContent}>
          <FlatList
            data={cartData}
            renderItem={renderItem}
            keyExtractor={(item) => (item?.cartId?.toString() || Math.random().toString())}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            // ListFooterComponentStyle={styles.listFooter}
            ListFooterComponent={
              <View style={{ height: 100 }} />
            }
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
              />
            }
          />
          
          {/* Cart total and checkout button */}
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>₹{grandTotal.toFixed(2)}</Text>
            </View>

            <View style={styles.checkoutButtonContainer}>    
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => navigation.navigate("Rice Products",{screen:"Rice Products",category:"All CATEGORIES"})}
              disabled={checkoutInProgress}
            >
              {checkoutInProgress ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.checkoutButtonText}>ADD MORE</Text>
              )}
            </TouchableOpacity>        
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              disabled={checkoutInProgress}
            >
              {checkoutInProgress ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              )}
            </TouchableOpacity>
            </View>
            
            
          </View>
        </View>
      ) : (
        // Show empty cart
        <EmptyCartComponent />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  cartContent: {
    flex: 1,
    // marginBottom: 60,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 120,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  itemWeight: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 32,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  quantityTextContainer: {
    width: 40,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    width: 36,
    height: 36,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    elevation: 10,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  checkoutButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCartView:{
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
  },
  emptyCartImage: {
    width: "100%",
    height: "100%",
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  modalHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  modalBody: {
    padding: 16,
    alignItems: "center",
  },
  containerImage: {
    width: width * 0.5,
    height: width * 0.3,
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  containerPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  modalFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderRightWidth: 0.5,
    borderRightColor: "#e1e1e1",
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderLeftWidth: 0.5,
    borderLeftColor: "#e1e1e1",
  },
  buttonTextCancel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  buttonTextConfirm: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  stockIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 2,
    alignItems: "center",
  },
  outOfStock: {
    backgroundColor: "rgba(255, 0, 0, 0.7)",
  },
  lowStock: {
    backgroundColor: "rgba(255, 165, 0, 0.7)",
  },
  stockIndicatorText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  disabledItem: {
    opacity: 0.6,
  },
  offerModalContainer: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  offerModalHeader: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  offerModalBody: {
    padding: 16,
    alignItems: "center",
  },
  offerImage: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 10,
  },
  offerModalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  offerModalFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  offerModalButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  offerCancelButton: {
    backgroundColor: "#f5f5f5",
  },
  offerConfirmButton: {
    backgroundColor: "#FFD700",
  },
  offerButtonTextCancel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  offerButtonTextConfirm: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  noteText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },

});

export default CartScreen;