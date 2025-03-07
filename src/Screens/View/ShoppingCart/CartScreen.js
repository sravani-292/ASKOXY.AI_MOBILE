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
        console.log("cart screen cart data", response);
        
        setLoading(false);
        const cartData = response?.data?.customerCartResponseList;
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
        setCartItems(cartItemsMap);
        setIsLimitedStock(limitedStockMap);
        setLoading(false);
        setLoadingItems((prevState) => ({
          ...prevState,
          [cartData.itemId]: false,
        }));
      })
      .catch((error) => {
        setError("Failed to load cart data");
        setLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchCartData();
      totalCart();
    }, [])
  );

  const onRefresh = () => {
    fetchCartData();
    totalCart();
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}user-service/customerProfileDetails?customerId=${customerId}`
      );

      if (response.status === 200) {
        if (!response.data.email) {
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

      fetchCartData();
      totalCart();
    } catch (error) {
      console.error("Error removing cart item:", error);
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
                          Weight: {item.weight} {item.units}
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
                            </TouchableOpacity>

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
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text style={styles.browseButtonText}>Browse Items</Text>
          </TouchableOpacity>
        </View>
      )}
      {cartData && cartData.length > 0 && (
        <>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Grand Total: ₹{grandTotal}</Text>
          </View>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("Dashboard")}
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
  totalContainer: {
    fontWeight: "bold",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#D1D5DB",
    marginLeft: 0,
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
});

export default CartScreen;
