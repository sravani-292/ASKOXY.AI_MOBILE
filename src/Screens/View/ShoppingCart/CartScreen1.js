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
import { Alert } from "react-native";
import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("window");
import BASE_URL, { userStage } from "../../../../Config";
import { COLORS } from "../../../../Redux/constants/theme";
const CartScreen = () => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  // console.log({userData})
  //  if(!userData){
  //   Alert.alert("Please login to continue", [
  //     { text: "OK", onPress: () => navigation.navigate("Login") }
  //   ]);
  // }

  useEffect(() => {
    if (!userData) {
      navigation.replace("Login Prompt");
    }
  }, [userData, navigation]);

  const navigation = useNavigation();
  const [cartData, setCartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [removalLoading, setRemovalLoading] = useState({});
  const [user, setUser] = useState({});
  const [deleteLoader, setDeleteLoader] = useState(false);

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
    setLoadingItems((prevState) => ({ ...prevState, [item.cartId]: true }));
    await increaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.cartId]: false }));
  };

  const handleDecrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.cartId]: true }));
    await decreaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.cartId]: false }));
  };

  const handleRemove = async (item) => {
    setRemovalLoading((prevState) => ({ ...prevState, [item.cartId]: true }));
    await removeCartItem(item);
    setRemovalLoading((prevState) => ({ ...prevState, [item.cartId]: false }));
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
        setCartData(response.data.customerCartResponseList);
        console.log(response.data.customerCartResponseList);

        console.log("cart length", cartData.length);
        setError(null);
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
      showToast("Error loading profile");
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
    // console.log("reactivate");
    const reactivate = await AsyncStorage.getItem("deactivate");
    // console.log({reactivate});
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
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : cartData && cartData.length > 0 ? (
        <FlatList
          data={cartData}
          keyExtractor={(item) => item.itemId.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              {removalLoading[item.cartId] ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#000" />
                </View>
              ) : (
                <>
                  {/* <Text>dcx</Text> */}
                  {item.itemQuantity == 1 ? (
                    <Text
                      style={{
                        textAlign: "center",
                        color: "red",
                        marginBottom: 5,
                        fontWeight: "bold",
                      }}
                    >
                      Note : Only one free sample is allowed per user.
                    </Text>
                  ) : null}
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
                        <View>
                        {/* <View style={styles.priceContainer}> */}
                        {/* <Text style={[styles.itemPrice, styles.crossedPrice]}>
                            MRP: ₹{item.priceMrp}
                          </Text>
                          <Text style={[styles.itemPrice]}>
                           <Text style={styles.value}> ₹{item.itemPrice}</Text>
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
                         Weight: <Text style={styles.value}>{item.itemQuantity} {item.units}</Text> 
                        </Text> */}
                          <View style={styles.rowContainer}>
                            {/* MRP and Price Side by Side */}
                            <View style={styles.column}>
                              <Text
                                style={[styles.itemPrice, styles.crossedPrice]}
                              >
                                MRP: ₹{item.priceMrp}
                              </Text>
                            </View>
                            <View style={styles.column}>
                              <Text style={styles.itemPrice}>
                                <Text style={styles.value}>
                                  {" "}
                                  ₹{item.itemPrice}
                                </Text>
                              </Text>
                            </View>
                          </View>

                          <View style={styles.rowContainer}>
                            {/* Discount Percentage and Weight Side by Side */}
                            <View style={styles.column}>
                              <Text>
                                (
                                {Math.round(
                                  ((item.priceMrp - item.itemPrice) /
                                    item.priceMrp) *
                                    100
                                )}
                                % OFF)
                              </Text>
                            </View>
                            <View style={styles.column}>
                              <Text style={styles.itemWeight}>
                                Weight:{" "}
                                <Text style={styles.value}>
                                  {item.itemQuantity} {item.units}
                                </Text>
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.quantityContainer}>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleDecrease(item)}
                            disabled={loadingItems[item.cartId]}
                          >
                            <Text style={styles.buttonText}>-</Text>
                          </TouchableOpacity>
                          {/* Show loader in the middle when loading */}
                          {loadingItems[item.cartId] ? (
                            <ActivityIndicator
                              size="small"
                              color="#000"
                              style={styles.loader}
                            />
                          ) : (
                            <Text style={styles.quantityText}>
                              {item.cartQuantity}
                            </Text>
                          )}

                          {item.itemQuantity != 1 ? (
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => handleIncrease(item)}
                              disabled={loadingItems[item.cartId]}
                            >
                              <Text style={styles.buttonText}>+</Text>
                            </TouchableOpacity>
                          ) : (
                            <View
                              style={styles.quantityButton1}
                              onPress={() => handleIncrease(item)}
                              disabled={loadingItems[item.cartId]}
                            >
                              <Text style={styles.buttonText}>+</Text>
                            </View>
                          )}
                          <Text style={styles.itemTotal}>
                            Total :
                            <Text style={styles.value}>
                              ₹{(item.itemPrice * item.cartQuantity).toFixed(2)}
                            </Text>
                          </Text>
                        </View>
                        {/* {deleteLoader==false? */}
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
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>Browse Items</Text>
          </TouchableOpacity>
        </View>
      )}
      {cartData && cartData.length > 0 && (
        <>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Grand Total : ₹{grandTotal}</Text>
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
                if (
                  (!address.email || address.email.trim() === "") &&
                  (!address.firstName || address.firstName.trim() === "") &&
                  (!address.lastName || address.lastName.trim() === "") &&
                  (!address.alterMobileNumber ||
                    address.alterMobileNumber.trim() === "")
                ) {
                  // Show alert if user profile is incomplete
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
                } else {
                  // Navigate to checkout page if profile is complete
                  navigation.navigate("Checkout", {
                    subtotal: cartData.reduce(
                      (acc, item) => acc + item.priceMrp * item.cartQuantity,
                      0
                    ),
                    locationdata,
                    addressdata,
                  });
                }
              }}
            >
              <Text style={styles.actionButtonText}> Checkout</Text>
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
    width: width * 0.2,
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
    color: COLORS.primary,
    fontWeight: "bold",
  },
  itemWeight: {
    color: "#000",
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: COLORS.quantitybutton,
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  quantityButton1: {
    backgroundColor: COLORS.quantitybutton,
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  buttonText: {
    fontWeight: "bold",
  },
  quantityText: {
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#EF4444",
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    width: 150,
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
    backgroundColor: COLORS.primary,
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
    marginLeft: 15,
    marginBottom: 10,
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
    zIndex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  // itemPrice: {
  //   fontSize: 16,
  //   marginRight: 10,
  // },
  crossedPrice: {
    textDecorationLine: "line-through",
    color: "#D32F2F",
  },
  boldPrice: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
  label: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
  value: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 70,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  column: {
    flexDirection:"row",
    column:"2",
    fontWeight:"bold"
  },

  crossedPrice: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  itemWeight: {
    fontSize: 14,
  },
});

export default CartScreen;
