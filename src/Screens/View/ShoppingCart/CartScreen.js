import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
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
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const handleRemove = async (item) => {
    setRemovalLoading((prevState) => ({ ...prevState, [item.itemId]: true }));
    await removeCartItem(item);
    setRemovalLoading((prevState) => ({ ...prevState, [item.itemId]: false }));
  };
  const fetchCartData = async () => {
    setLoading(true);
    axios
      .get(
        userStage == "test1"
          ? BASE_URL +
              `erice-service/cart/customersCartItems?customerId=${customerId}`
          : BASE_URL +
              `cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((response) => {
        setLoading(false);
        const cartData = response?.data?.customerCartResponseList;
        if (!cartData || !Array.isArray(cartData)) {
          setCartData([]);
          setIsLimitedStock({});
          setCartItems({});
          return;
        }
        console.log("cart length", cartData.length);
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

        console.log("Cart Items Map:", cartItemsMap);
        const limitedStockMap = cartData.reduce((acc, item) => {
          if (item.quantity === 0) {
            acc[item.itemId] = "outOfStock";
          } else if (item.quantity === 1) {
            acc[item.itemId] = "lowStock";
          }
          return acc;
        }, {});
        console.log("limited stock map", limitedStockMap);

        setError(null);

        setCartData(cartData);
        setCartItems(cartItemsMap);
        setIsLimitedStock(limitedStockMap);
        setLoading(false);
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
      getProfile();
    }, [])
  );

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        url:
          userStage == "test1"
            ? BASE_URL +
              `erice-service/user/customerProfileDetails?customerId=${customerId}`
            : BASE_URL +
              `user-service/customerProfileDetails?customerId=${customerId}`,
      });

      if (response.status === 200) {
        console.log("profile", response.data);

        setUser(response.data);
        setAddress(response.data);
      }
    } catch (error) {
      console.log("Error loading profile");
    }
  };
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
      console.log("total cart", response.data);

      setGrandTotal(response.data.totalSum);
    } catch (error) {
      setError("Failed to fetch cart data");
    }
  };

  const handleImagePress = (item) => {
    navigation.navigate("ItemDetails", { item });
  };

  const increaseCartItem = async (item) => {
    const currentQuantity = item.cartQuantity;

    try {
      const response = await axios.patch(
        BASE_URL == "test1"
          ? BASE_URL + `erice-service/cart/incrementCartData`
          : BASE_URL + `cart-service/cart/incrementCartData`,
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
      console.log("response after increment", response);

      fetchCartData();
      totalCart();
      setLoading(false);
    } catch (err) {}
  };

  const decreaseCartItem = async (item) => {
    try {
      if (item.cartQuantity > 1) {
        const newQuantity = item.cartQuantity - 1;

        const response = await axios.patch(
          BASE_URL == "test1"
            ? BASE_URL + `erice-service/cart/decrementCartData`
            : BASE_URL + "cart-service/cart/decrementCartData",
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
        console.log("response after decrement", response.data);

        fetchCartData();
        totalCart();
        setLoading(false);
      } else {
        Alert.alert(
          "Remove Item",
          "Cart quantity is at the minimum. Do you want to remove this item from the cart?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Yes, Remove",
              onPress: () => removeCartItem(item),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {}
  };

  const removeCartItem = async (item) => {
    console.log("item to be removed", item);

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
            try {
              setDeleteLoader(true);
              const response = await axios.delete(
                BASE_URL == "test1"
                  ? BASE_URL + "erice-service/cart/remove"
                  : BASE_URL + "cart-service/cart/remove",
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
              setDeleteLoader(false);
              fetchCartData();
              totalCart();
              setLoading(false);
            } catch (error) {}
          },
        },
      ],
      { cancelable: true }
    );
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

  return (
    <View style={styles.container}>
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
              {isLimitedStock[item.itemId] === "lowStock" && (
                <View style={styles.limitedStockBadge}>
                  <Text style={styles.limitedStockText}>1 item left</Text>
                </View>
              )}
              {isLimitedStock[item.itemId] === "outOfStock" && (
                <View style={styles.outOfStockContainer}>
                  {/* Transparent overlay to block interactions on everything except the remove button */}
                  <View style={styles.disabledOverlay} />

                  <Text style={styles.outOfStockText}>Out of Stock</Text>

                  <TouchableOpacity
                    onPress={() => handleRemove(item)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeText}>Please remove it</Text>
                  </TouchableOpacity>
                </View>
              )}

              {removalLoading[item.itemId] ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#000" />
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
                            Total: ₹
                            {(
                              item.itemPrice *
                              (cartItems[item.itemId] || item.cartQuantity)
                            ).toFixed(2)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={{ marginLeft: 180 }}
                          onPress={() => handleRemove(item)}
                        >
                          <MaterialIcons
                            name="delete"
                            size={23}
                            color="#FF0000"
                          />
                        </TouchableOpacity>
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
              onPress={() => {
                console.log("Limited Stock Map1:", isLimitedStock);

                const outOfStockItems = cartData.filter((item) => {
                  console.log(
                    `Checking item: ${item.itemId}, Stock: ${
                      isLimitedStock[item.itemId]
                    }`
                  );
                  return isLimitedStock[item.itemId] === "outOfStock";
                });

                console.log("Out of Stock Items:", outOfStockItems);

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

                if (
                  !address.email?.trim() ||
                  !address.firstName?.trim() ||
                  !address.lastName?.trim() ||
                  !address.alterMobileNumber?.trim()
                ) {
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
                  return;
                }

                // ✅ Proceed to checkout
                navigation.navigate("Checkout", {
                  subtotal: cartData.reduce(
                    (acc, item) =>
                      acc +
                      item.priceMrp *
                        (cartItems[item.itemId] || item.cartQuantity),
                    0
                  ),
                  locationdata,
                  addressdata,
                });
              }}
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
    // height:"auto",
    // flexDirection: "row",
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
    width: width * 0.3,
    height: height / 8,
    marginRight: 16,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    width: width * 0.6,
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
    backgroundColor: "#fff",
  },
  removeButton: {
    backgroundColor: "#EF4444",
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
    backgroundColor: COLORS.title2,
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
    // marginVertical: 4,
    marginLeft: 2,
    marginBottom: 20,
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
    elevation: 5, // For Android shadow
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
    zIndex: 1,
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
    backgroundColor: COLORS.primary,
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
    color: COLORS.title2,
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
});

export default CartScreen;
