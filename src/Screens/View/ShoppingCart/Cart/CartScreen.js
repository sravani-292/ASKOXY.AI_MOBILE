import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";
import { COLORS } from "../../../../../Redux/constants/theme";
import PriceBreakdownModal from "./PriceBreakdownModal";
import ContainerSoftCopy from "./ContainerSoftCopy";
import CartCard from "./CartCard";
import {
  handleCustomerCartData,
  handleGetProfileData,
  handleUserAddorIncrementCart,
  handleDecrementorRemovalCart,
  handleRemoveItem,
  handleRemoveFreeItem,
} from "../../../../ApiService";
import { useCart } from "../../../../../until/CartCount";
const { width, height } = Dimensions.get("window");
import EmptyCartComponent from "./EmptyCartComponent";
import MyTabBar from "../../../../Navigations/MyTabBar";
   


  
const CartScreen = () => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const navigation = useNavigation();
  const {setCartCount } = useCart();
  // State variables (keeping all your existing state)
  const [cartData, setCartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [removalLoading, setRemovalLoading] = useState({});
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [hasWeight, setHasWeight] = useState("");
  const [freeItemPrice, setFreeItemPrice] = useState("");
  const [gstAmount, setGstAmount] = useState("");
  const [itemsGstAmount, setItemsGstAmount] = useState("");
  const [goldMakingCost, setGoldMakingCost] = useState("");
  const [goldGstAmount, setGoldGstAmont] = useState("");
  const [totalCartValue, setTotalCartValue] = useState("");
  const [containerAddedPrice, setContainerAddedPrice] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [containerDecision, setContainerDecision] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Your existing constants
  const containerItemIds = [
    "53d7f68c-f770-4a70-ad67-ee2726a1f8f3",
    "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61",
  ];

  const CONTAINER_TYPES = {
    SMALL: {
      id: "53d7f68c-f770-4a70-ad67-ee2726a1f8f3",
      WEIGHT: "10",
      NAME: "10kg Rice Container",
      Price: 2000,
    },
    LARGE: {
      id: "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61",
      WEIGHT: "26",
      NAME: "26kg Rice Container",
      Price: 2500,
    },
  };

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

  const handleYes = async () => {
    setContainerDecision("yes");

    try {
      await AsyncStorage.setItem("containerDecision", "yes");
    } catch (error) {
      // console.log("Error saving container decision:", error);
    }
    setModalVisible(false);

    const containerId =
      hasWeight === "26kgs"
        ? CONTAINER_TYPES.LARGE.id
        : CONTAINER_TYPES.SMALL.id;
    const data = { customerId: customerId, itemId: containerId };

    try {
      const response = await handleCustomerCartData(data);

      // console.log("Container added response", response);
      if (response.data.errorMessage === "Item added to cart successfully") {
        Alert.alert(
          "Success",
          `Successfully added ${hasWeight} container to your cart`,
          [
            {
              text: "OK",
              // onPress: () => handleSoftCopydecision(),
            },
          ],
          { cancelable: false }
        );

        fetchCartData();
      } else {
        setLoader(false);
        Alert.alert("Alert", response.data.errorMessage);
      }
    } catch (error) {
      setLoader(false);
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

  // Keep all your other existing functions...
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

  // for fetching cart data
  const fetchCartData = async () => {
    try {
      // setLoading(true);
      const response = await handleCustomerCartData(customerId);
      // console.log("cart response", response.data);
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

      setTotalCartValue(response.data?.totalCartValue);

      setFreeItemPrice(response.data?.freeItemPriceTotal);
      // console.log("totalGstAmountToPay", response.data?.totalGstAmountToPay);
      setGstAmount(response.data?.totalGstAmountToPay);
      setLoading(false);
      setGrandTotal(response.data.amountToPay);
      const cartData = response?.data?.customerCartResponseList;
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

      const limitedStockMap = cartData.reduce((acc, item) => {
        if (item.quantity === 0) {
          acc[item.itemId] = "outOfStock";
        } else if (item.quantity <= 5) {
          acc[item.itemId] = "lowStock";
        }
        return acc;
      }, {});
      const totalCartCount = cartData.reduce(
         (total, item) => total + item.cartQuantity,
         0
       );

      setCartCount(totalCartCount || 0);
      setError(null);
      setCartData(cartData);
      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
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

  const handleProfileCheck = async () => {
    try {
      if (!customerId) {
        Alert.alert("Error", "Customer ID is not available.");
        return false;
      }

      const response = await handleGetProfileData(customerId);

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
      } else {
        Alert.alert("Error", "Failed to fetch profile data.");
        return false;
      }

      const outOfStockItems = cartData.filter(
        (item) => isLimitedStock[item.itemId] === "outOfStock"
      );

      if (outOfStockItems.length > 0) {
        Alert.alert(
          "🚨 Some Items Are Out of Stock!",
          `The following items are currently unavailable:\n\n${outOfStockItems
            .map((item) => `- 🛑 ${item.itemName}`)
            .join("\n")}\n\nPlease remove them to proceed.`,
          [{ text: "OK", style: "cancel" }]
        );
        return false;
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

      navigation.navigate("Payment Details", {
        subtotal: cartData.reduce(
          (acc, item) =>
            acc + item.priceMrp * (cartItems[item.itemId] || item.cartQuantity),
          0
        ),
        locationdata,
        addressdata,
      });
    } catch (error) {
      console.error("Error in handleProfileCheck:", error);
      Alert.alert("Error", "Something went wrong while fetching profile data.");
      return false;
    }
  };
  // for getting profile
  const getProfile = async () => {
    try {
      const response = await handleGetProfileData(customerId);
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

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCartData();
      getProfile();
    }, [])
  );

  const onRefresh = () => {
    fetchCartData();
  };



  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4B0082" />
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : cartData && cartData.length > 0 ? (
        <FlatList
          data={cartData}
          keyExtractor={(item) => item.itemId.toString()}
          renderItem={({ item }) => (
            <CartCard
              item={item}
              isLimitedStock={isLimitedStock}
              loadingItems={loadingItems}
              removalLoading={removalLoading}
              cartItems={cartItems}
              containerDecision={containerDecision}
              containerItemIds={containerItemIds}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          )}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        />
      ) : (
        <EmptyCartComponent />
      )}

      {/* Your existing bottom section with totals and buttons */}
      {cartData && cartData.length > 0 && (
        <>
          {!loading && (
            <View style={styles.grandTotalRowContainer}>
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Grand Total:</Text>
                <Text style={styles.grandTotalValue}>
                  ₹{(Number(grandTotal) + Number(gstAmount)).toFixed(2)}{" "}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <TouchableOpacity
                  style={styles.priceBreakupButton}
                  onPress={() => setShowPriceBreakdown(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color="#4B0082"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.priceBreakupText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!loading && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.addButton}
                // onPress={() => navigation.navigate("Dashboard")}
                // onPress={()=>navigation.goBack()}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: "Rice Products",
                        params: { categoryType: "RICE", category:"All CATEGORIES" },
                      },
                    ],
                  });
                }}
              >
                <Text style={styles.actionButtonText}>Add More</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => handleProfileCheck()}
              >
                <Text style={styles.actionButtonText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          )}

          {showPriceBreakdown && (
            <PriceBreakdownModal
              visible={showPriceBreakdown}
              onClose={() => setShowPriceBreakdown(false)}
              totalCartValue={totalCartValue}
              freeItemPrice={freeItemPrice}
              itemsGstAmount={itemsGstAmount}
              goldGstAmount={goldGstAmount}
              goldMakingCost={goldMakingCost}
              gstAmount={gstAmount}
              grandTotal={grandTotal}
            />
          )}
        </>
      )}

      <ContainerSoftCopy
        visible={modalVisible}
        hasWeight={hasWeight}
        onClose={() => setModalVisible(false)}
        addContainer={handleYes}
        cartData={cartData}
        itemToRemove={itemToRemove}
        removeItem={handleRemove}
      />
        <MyTabBar
        activeTab="My Cart" // must match route name in TabArr
        onTabPress={(routeName) => {
          if (routeName === 'My Cart') return; // already here
          navigation.navigate('Home', { screen: routeName }); // assuming MainTabs wraps your Tabs
        }}
      />
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

  buttonText: {
    color: "white",
  },

  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  grandTotalLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#212529",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    textAlign: "right",
  },

  grandTotalRowContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
 priceBreakupButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  priceBreakupText: {
    fontSize: 16,
    fontWeight: "50",
    color: COLORS.services,
  },
});

export default CartScreen;
