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
  Modal,Animated, Easing
} from "react-native";
import axios from "axios";
import { StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../../../Redux/constants/theme";
import { Alert } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("window");
import BASE_URL, { userStage } from "../../../../Config";
const CartScreen = () => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;

  const navigation = useNavigation();
  const [cartData, setCartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [removalLoading, setRemovalLoading] = useState({});
  const [user, setUser] = useState({});
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [hasWeight, setHasWeight] = useState("");
  const[containerAddedPrice,setContainerAddedPrice]=useState(false)
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
  const [showCode, setShowCode] = useState(false);
  const scaleValue = new Animated.Value(0); // Initial scale value for zoom-in animation

  const CONTAINER_TYPES = {
    SMALL: {
      id: "53d7f68c-f770-4a70-ad67-ee2726a1f8f3",
      WEIGHT: "10",
      NAME: "10kg Rice Container",
      Price:2000
    },
    LARGE: {
      id: "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61",
      WEIGHT: "26",
      NAME: "26kg Rice Container",
      Price:2500

    }
  };

  // Zoom-in animation
  useEffect(() => {
    if (modalVisible) {
      Animated.timing(scaleValue, {
        toValue: 1, // Fully expanded
        duration: 500, // Animation duration
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

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
      }
    };

    const checkCartForContainers = () => {
      if (cartData && cartData.length > 0) {
        const containerExists = cartData.some(item => 
          item.itemId === CONTAINER_TYPES.LARGE.id || 
          item.itemId === CONTAINER_TYPES.SMALL.id
        );
        
        if (!containerExists && containerDecision === 'yes') {
          // If the user had a container but it's no longer in the cart, reset decision
          setContainerDecision(null);
          setContainerAddedPrice(false);
          AsyncStorage.removeItem('containerDecision');
        }
      }
    };
    checkCartForContainers();
    loadContainerDecision();
  }, [cartData]);

  const handleYes = async() => {
    // setShowCode(true);
    setContainerDecision('yes');
  
    try {
      await AsyncStorage.setItem('containerDecision', 'yes');
    } catch (error) {
      console.log("Error saving container decision:", error);
    }
    setModalVisible(false);

     const containerId= hasWeight === "26kgs" ? CONTAINER_TYPES.LARGE.id : CONTAINER_TYPES.SMALL.id;
     const data = { customerId: customerId, itemId: containerId };

     try {
      const response = await axios.post(
        BASE_URL + "cart-service/cart/add_Items_ToCart",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    
      console.log("item added response", response.data);
      

  if (response.data.errorMessage == "Item added to cart successfully") {
        Alert.alert("Success", `Successfully added ${hasWeight} container to your cart`);

        fetchCartData();
      } else {
        setLoader(false);
        Alert.alert("Alert", response.data.errorMessage);
      }
    } catch (error) {
      setLoader(false);
    }
  };


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






  const handleIncrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await increaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const handleDecrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await decreaseCartItem(item);
    setTimeout(() => {
      setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
    }, 5000);
  };

  const handleRemove = async (item) => {
    // console.log("removal item", item);

    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
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

            await removeCartItem(item);

            setRemovalLoading((prevState) => ({
              ...prevState,
              [item.cartId]: false,
            }));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const fetchCartData = async () => {
    setLoading(true);
    axios
      .get(
        BASE_URL +
          `cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((response) => {
        console.log("cart api response",response);
        
        console.log("cart screen cart data", response.data);
        setLoading(false);
        const cartData = response?.data?.customerCartResponseList;
        const weightArray = cartData?.map(item => item.weight);
        console.log({weightArray})

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

        const limitedStockMap = cartData.reduce((acc, item) => {
          if (item.quantity === 0) {
            acc[item.itemId] = "outOfStock";
          } else if (item.quantity <= 5) {
            acc[item.itemId] = "lowStock";
          }
          return acc;
        }, {});

        setError(null);

        setCartData(cartData);
        FreeContainerfunc(cartData)
        setCartItems(cartItemsMap);
        setIsLimitedStock(limitedStockMap);
        setLoading(false);
        setLoadingItems((prevState) => ({
          ...prevState,
          [cartData.itemId]: false,
        }));
        return weightArray;
      })
      .catch((error) => {
        console.log(error.response);
        
        setError("Failed to load cart data");
        setLoading(false);
      });
  };

 // ✅ Accept cartData as a parameter
 function FreeContainerfunc(cartData) {
  // if (containerDecision) {
  //   console.log("User already made container decision:", containerDecision);
  //   return;
  // }
  axios
    .get(BASE_URL + `cart-service/cart/ContainerInterested/${customerId}`)
    .then((response) => {
      console.log("Cart API called successfully", response.data);

      // Check if freeContainerStatus is "Interested" - if so, never show the alert
      if (response.data.freeContainerStatus === "Interested") {
        console.log("User already interested in container, no alert will be shown.");
        setModalVisible(false);
        return;
      }

      // ✅ Ensure cartData is valid
      if (!cartData || cartData.length === 0) {
        console.log("Cart is empty, no alert triggered.");
        return;
      }

      // Only proceed to show alerts if freeContainerStatus is null
      if (response.data.freeContainerStatus === null) {
        let has10kg = cartData.some(item => item.weight === 10);
        let has26kg = cartData.some(item => item.weight === 26);

        // ✅ If the cart has more than 0 items, show alerts based on weight
        if (cartData.length > 0) {
          if (has10kg && has26kg) {
            // Alert.alert("You have won a 26kg bag!");
            setHasWeight("26kgs");
            setContainerAddedPrice(true);
            setModalVisible(true);
          } else if (has26kg) {
            // Alert.alert("You have a 26kg bag");
            setHasWeight("26kgs");
            setContainerAddedPrice(true);
            setModalVisible(true);
          } else if (has10kg) {
            setHasWeight("10kgs");
            setContainerAddedPrice(true);
            setModalVisible(true);
          }
          // else {
          //   Alert.alert("No eligible bag found");
          // }
        }
      } else {
        console.log("User container status is not null or 'Interested', no alert triggered.");
      }
    })
    .catch((error) => {
      console.log("Error fetching cart data:", error);
    });
}

useFocusEffect(
  useCallback(() => {
    fetchCartData();
    totalCart();
  }, [])
);


  const onRefresh = () => {
    fetchCartData();
    totalCart();
    FreeContainerfunc()
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}user-service/customerProfileDetails?customerId=${customerId}`
      );

      if (response.status === 200) {
        if (!response.data.firstName) {
          Alert.alert(
            "Incomplete Profile",
            "Please fill out your profile to proceed.",
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
        console.log("Unexpected response status:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Profile error:", error?.response || error);
      return false;
    }
  };

  const totalCart = async () => {
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

      setGrandTotal(response.data.totalSum);
    } catch (error) {
      setError("Failed to fetch cart data");
    }
  };

  const handleImagePress = (item) => {
    navigation.navigate("ItemDetails", { item });
  };

  const increaseCartItem = async (item) => {
    try {
      const response = await axios.patch(
        BASE_URL + `cart-service/cart/incrementCartData`,
        {
          customerId: customerId,
          itemId: item.itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("response after increment", response);

      fetchCartData();
      totalCart();
      setLoading(false);
    } catch (err) {}
  };

  const decreaseCartItem = async (item) => {
    try {
      if (cartItems[item.itemId] > 1) {
        const response = await axios.patch(
          BASE_URL + "cart-service/cart/decrementCartData",
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
        // console.log("response after decrement", response.data);

        fetchCartData();
        totalCart();
        setLoading(false);
      } else {
        handleRemove(item);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const removeCartItem = async (item) => {
    console.log("item to remove", item.cartId);
    try {
      const response = await axios.delete(
        BASE_URL + "cart-service/cart/remove",
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

      console.log("Item",item.itemId)
      console.log("removal response",response);
      
      // if(item.itemId= (containerAddedPrice?hasWeight=="26kgs"?CONTAINER_TYPES.LARGE.id:CONTAINER_TYPES.SMALL.id:0)){
      //   console.log(containerAddedPrice?hasWeight=="26kgs"?CONTAINER_TYPES.LARGE.id:CONTAINER_TYPES.SMALL.id:0)
      //   setContainerAddedPrice(false)
      //   setModalVisible(false)
      // }

      const containerLargeId = CONTAINER_TYPES.LARGE.id;
    const containerSmallId = CONTAINER_TYPES.SMALL.id;
    
    if(item.itemId === containerLargeId || item.itemId === containerSmallId) {
      // Reset container decision when container is removed
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
      console.error("Error removing cart item:", error.response);
    }
  };

  const handleDeactivateStatus = async () => {
    const reactivate = await AsyncStorage.getItem("deactivate");
    if (reactivate == "false") {
      Alert.alert(
        "Deactivated",
        "Your account is deactivated, Are you want to reactivate your account to continue?",
        [
          { text: "Yes", onPress: () => navigation.navigate("Write To Us") },
          { text: "No" },
        ]
      );
    }
  };

  const handleOrderConfirmation = () => {
    const zeroQuantityItems = cartData
      .filter((item) => item.quantity === 0)
      .map((item) => item.itemName);

    if (zeroQuantityItems.length > 0) {
      const itemNames = zeroQuantityItems.join(", ");
      Alert.alert(
        "Sorry for the inconvenience",
        `We noticed that the following items in your cart have zero quantity: ${itemNames}. 
        
           Please update or remove them before proceeding with your order.`,
        [{ text: "OK", onPress: () => navigation.navigate("CartScreen") }]
      );
      return;
    } else if (!validateCartBeforeCheckout) {
      return;
    } else {
      placeOrder();
    }
  };

  const handleProfileCheck = async () => {
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

  return (
    <View
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
    {/* <Text>sdhgv</Text> */}
      {loading ? (
        <ActivityIndicator size="large" color="#9333ea" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : cartData && cartData.length > 0 ? (
        <FlatList
          data={cartData}
          keyExtractor={(item) => item.itemId.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.cartItem,
                item.quantity === 0 && styles.outOfStockCard,
              ]}
               keyboardShouldPersistTaps="always"
            >
              {isLimitedStock[item.itemId] == "lowStock" && (
                <View style={styles.limitedStockBadge}>
                  <Text style={styles.limitedStockText}>
                    {item.quantity > 1
                      ? `${item.quantity} items left`
                      : `${item.quantity} item left`}
                  </Text>
                </View>
              )}
              {isLimitedStock[item.itemId] === "outOfStock" && (
                <View style={styles.outOfStockContainer}>
                  <Text style={styles.outOfStockText}>Out of Stock</Text>

                  <TouchableOpacity
                    onPress={() => handleRemove(item)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeText}>Please remove it</Text>
                  </TouchableOpacity>
                </View>
              )}

              {removalLoading[item.cartId] ? (
                <View style={[styles.cartItem, styles.removalLoader]}>
                  <ActivityIndicator size="large" color="#ecb01e" />
                  <Text style={styles.removingText}>
                    Removing {item.itemName}...
                  </Text>
                </View>
              ) : (
                <>
                  {item.itemQuantity === 1 && (
                    <Text style={styles.noteText}>
                      Note: Only one free sample is allowed per user.
                    </Text>
                  )}
                  <View style={{ flexDirection: "row" }}>
                    <View>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                        onError={() => console.log("Failed to load image")}
                      />
                    </View>
                    <View>
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>{item.itemName}</Text>
                        <View style={styles.priceContainer}>
                          <Text style={[styles.itemPrice, styles.crossedPrice]}>
                            MRP: ₹{item.priceMrp}
                          </Text>
                          <Text style={[styles.itemPrice, styles.boldPrice]}>
                            ₹{item.itemPrice}
                          </Text>
                        </View>
                        <Text style={{ marginTop: 5 }}>
                          (
                          {Math.round(
                            ((item.priceMrp - item.itemPrice) / item.priceMrp) *
                              100
                          )}
                          % OFF)
                        </Text>
                        <Text style={styles.itemWeight}>
  Weight: {item.weight} {item.weight === 1 ? item.units.replace(/s$/, '') : item.units}
</Text>
                        {isLimitedStock[item.itemId] !== "outOfStock" && (
                          <View style={styles.quantityContainer}>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => handleDecrease(item)}
                              disabled={loadingItems[item.itemId]}
                            >
                              <Text style={styles.buttonText}>-</Text>
                            </TouchableOpacity>
                            {loadingItems[item.itemId] ? (
                              <ActivityIndicator
                                size="small"
                                color="#000"
                                style={styles.loader}
                              />
                            ) : (
                              <Text style={styles.quantityText}>
                                {cartItems[item.itemId] || item.cartQuantity}
                              </Text>
                            )}
                              {item.itemPrice==1 ?(
                                                   <View
                                                   style={styles.quantityButton1}
                                                   // onPress={() => incrementQuantity(item)}
                                                   onPress={() => handleIncrease(item)}
                                                   disabled={loadingItems[item.itemId]}
                                                 >
                                                   <Text style={styles.quantityButtonText}>+</Text>
                                                 </View>
                                                ):(
                            <TouchableOpacity
                              style={[
                                styles.quantityButton,
                                cartItems[item.itemId] === item.quantity &&
                                  styles.disabledButton,
                              ]}
                              onPress={() => handleIncrease(item)}
                              disabled={
                                loadingItems[item.itemId] ||
                                cartItems[item.itemId] === item.quantity
                              }
                            >
                              <Text style={styles.buttonText}>+</Text>
                            </TouchableOpacity>)}

                            <Text style={styles.itemTotal}>
                              {/* Total: */}₹
                              {(
                                item.itemPrice *
                                (cartItems[item.itemId] || item.cartQuantity)
                              ).toFixed(2)}
                            </Text>
                          </View>
                        )}
                        {isLimitedStock[item.itemId] !== "outOfStock" && (
                          <TouchableOpacity
                            style={{ marginLeft: 100 }}
                            onPress={() => handleRemove(item)}
                          >
                            <MaterialIcons
                              name="delete"
                              size={23}
                              color="#FF0000"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <View style={styles.card}>
          <MaterialIcons
            name="shopping-cart"
            size={80}
            color="#A9A9A9"
            style={styles.icon}
          />
          <Text style={{ fontSize: 18, color: "#333", marginBottom: 20 }}>
            Your cart is empty
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate("Rice Products",{screen:"Rice Products",category:"All CATEGORIES"})}
          >
            <Text style={styles.browseButtonText}>Browse Items</Text>
          </TouchableOpacity>
        </View>
      )}
      {cartData && cartData.length > 0 && (
        <>
         

{/* <View style={styles.totalContainer}>
  {containerAddedPrice && containerDecision === 'yes' && (
    <>
      <Text style={styles.totalText}>Sub Total: ₹{grandTotal + (containerAddedPrice && containerDecision === 'yes' ? (hasWeight === "26kgs" ? CONTAINER_TYPES.LARGE.Price : CONTAINER_TYPES.SMALL.Price) : 0)}</Text>
    <Text style={styles.totalText}>Container Price: - ₹{(hasWeight === "26kgs" ? CONTAINER_TYPES.LARGE.Price : CONTAINER_TYPES.SMALL.Price)}</Text>
  </>
  )}
  <Text style={styles.totalText}>Grand Total: ₹{grandTotal}</Text>
</View> */}

<View style={styles.totalContainer}>
  {containerAddedPrice && containerDecision === 'yes' && (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>Sub Total:</Text>
        <Text style={styles.value}>₹{grandTotal + (hasWeight === "26kgs" ? CONTAINER_TYPES.LARGE.Price : CONTAINER_TYPES.SMALL.Price)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Container Price:</Text>
        <Text style={styles.discountValue}>-₹{(hasWeight === "26kgs" ? CONTAINER_TYPES.LARGE.Price : CONTAINER_TYPES.SMALL.Price)}</Text>
      </View>
      <View style={styles.divider} />
    </>
  )}
  <View style={styles.grandTotalRow}>
    <Text style={styles.grandTotalLabel}>Grand Total:</Text>
    <Text style={styles.grandTotalValue}>₹{grandTotal}</Text>
  </View>
</View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("Rice Products",{screen:"Rice Products",category:"All CATEGORIES"})}
            >
              <Text style={styles.actionButtonText}>Add More</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleProfileCheck}
            >
              <Text style={styles.actionButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

{/* Modal to display the free container */}
<Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Animated Alert Box */}
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: scaleValue }], // Apply zoom-in animation
              },
            ]}
          >
            <Text style={styles.congratsText}>🎉 Congratulations! 🎉</Text>
            <Text style={styles.messageText}>You’ve Won a {hasWeight==="26kgs"?"26kgs":"10kgs"} Container for FREE!</Text>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>How to Earn Ownership:</Text>
            </View>
            
            <View style={styles.planContainer}>
              <Text style={styles.planTitle}>Plan A:</Text>
              <Text style={styles.planDescription}>
                Buy 9 bags during the next 3 years, and the container is yours forever.
              </Text>
            </View>
            
            <View style={styles.orContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.divider} />
            </View>
            
            <View style={styles.planContainer}>
              <Text style={styles.planTitle}>Plan B:</Text>
              <Text style={styles.planDescription}>
                Refer 9 people, and when they buy their first bag, the container is yours forever.
              </Text>
            </View>
            
            <Text style={styles.questionText}>Do you own it?</Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonYes} onPress={handleYes}>
                <Text style={styles.buttonText}>Yes, I’m Interested!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonNo} onPress={handleNo}>
                <Text style={styles.buttonText}>No, Thanks</Text>
              </TouchableOpacity>
            </View>

            {/* Show Code */}
            {/* {showCode && (
              <Text style={styles.codeText}>Your Code: FREECON26</Text>
            )} */}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 20,
  },
  error: {
    color: "#EF4444",
    textAlign: "center",
    marginTop: 20,
  },
  cartItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    marginLeft: 5,
    width: width * 0.3,
    height: height / 7,
    marginRight: 10,
    borderRadius: 20,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    width: width * 0.5,
  },
  itemPrice: {
    color: "#16A34A",
  },
  itemWeight: {
    color: "#6B7280",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: "#a593df",
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  quantityButton1: {
    backgroundColor: "#D1D5DB",
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  quantityText: {
    fontWeight: "bold",
    backgroundColor: "white",
  },
  removeButton: {
    backgroundColor: "#D32F2F",
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    width: 150,
    zIndex: 2,
    // position:'absolute'
  },
  removeButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 80,
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
    marginTop: 20,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    marginBottom: 70,
  },
  checkoutButton: {
    backgroundColor: COLORS.services,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginBottom: 70,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
 
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 2,
    marginBottom: 20,
    width: width / 3,
    marginTop: 15,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
  },
  card: {
    width: "80%",
    alignItems: "center",
    padding: 20,
    marginLeft: 35,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  loader: {
    alignSelf: "center",
    borderRadius: 4,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    // zIndex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    marginRight: 10,
  },
  crossedPrice: {
    textDecorationLine: "line-through",
    color: "#D32F2F",
  },
  boldPrice: {
    fontWeight: "bold",
    color: "#388E3C",
  },
  limitedStockBadge: {
    position: "absolute",
    top: 10,
    left: 30,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    zIndex: 10,
    marginBottom: 20,
  },
  limitedStockText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "gray",
    opacity: 0.5,
  },
  outOfStockCard: {
    opacity: 0.5,
  },
  outOfStockContainer: {
    position: "relative",
    padding: 10,
    backgroundColor: COLORS.backgroundcolour,
    borderRadius: 8,
    alignItems: "center",
  },
  outOfStockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  outOfStockText: {
    color: "red",
    position: "relative",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    fontSize: 16,
  },
  browseButton: {
    backgroundColor: COLORS.services,
    // padding: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  browseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  outOfStockText: {
    color: COLORS.services,
    fontSize: 14,
    fontWeight: "bold",
  },
  removeText: {
    alignSelf: "center",
    textAlign: "center",
    color: "#fff",
    zIndex: 1,
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginTop: 5,
    // backgroundColor: "#000",
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  removingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#ecb01e",
    textAlign: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  dimItem: {
    opacity: 0.5, // Fades the item while loading
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  messageText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonYes: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonNo: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
  }, 
  buttonText: {
    color: 'white',
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20,
  },
  titleContainer: {
    // marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#212529',
  },
  planContainer: {
    // marginBottom: 16,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 22,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ced4da',
  },
  orText: {
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  totalContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    color: '#495057',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212529',
    textAlign: 'right',
  },
  discountValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2e7d32',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 8,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  grandTotalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#212529',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'right',
  }
});

export default CartScreen;
