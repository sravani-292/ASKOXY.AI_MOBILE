import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/Ionicons";
import BASE_URL, { userStage } from "../../../../Config";

// ItemDetailsScreen Component
const ItemDetails = ({ route, navigation }) => {
  const { item } = route?.params;
  console.log("Item details page", item);

  const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;

  const [cartData, setCartData] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [loadingItems, setLoadingItems] = useState({});
  const [isLimitedStock, setIsLimitedStock] = useState({});
  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    console.log("fetching cart data");
    const url =
      userStage === "test1"
        ? `${BASE_URL}erice-service/cart/customersCartItems?customerId=${customerId}`
        : `${BASE_URL}cart-service/cart/customersCartItems?customerId=${customerId}`;

    console.log("Requesting API:", url);
    try {
      const response = await axios.get(
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
      );
      console.log("API Response:", response); 
      const cartData = response?.data?.customerCartResponseList;

      if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
        console.error("cartData is empty or invalid:", cartData);
        setCartData([]);
        setCartItems({});
        setIsLimitedStock({});
        setCartCount(0);
        return; 
      }

      console.log("cartData:", cartData); 

      // Mapping items to their quantities
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

      // Mapping items with limited stock (quantity = 1)
      const limitedStockMap = cartData.reduce((acc, item) => {
        acc[item.itemId] = item.quantity === 1;
        return acc;
      }, {});

      console.log("Limited Stock Map:", limitedStockMap);

      // Updating state
      setCartData(cartData);
      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
      setCartCount(cartData.length);
    } catch (error) {
      console.error("Error fetching cart items:", error.response.status);
    }
  };

  const handleRemove = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await removeCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
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

  const decreaseCartItem = async (item) => {
    console.log("decrememt cart");

    try {
      const currentQuantity = cartItems[item.itemId];
      console.log("Decreasing item ID:", currentQuantity);

      if (currentQuantity > 1) {
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

        console.log("Item decremented successfully", response.data);

        fetchCartData();
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
    } catch (error) {
      console.error("Failed to decrease cart item:", error);
    }
  };

  const increaseCartItem = async (item) => {
    try {
      console.log("Increasing item ID:", item.itemId);

      const currentQuantity = cartItems[item.itemId] || 0;

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
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Item incremented successfully");

      fetchCartData();
    } catch (error) {
      console.error("Failed to increase cart item:", error);
    }
  };

  const getCartItemById = (targetCartId) => {
    console.log({ targetCartId });

    const filteredCart = cartData.filter(
      (item) => item.itemId === targetCartId
    );

    if (filteredCart.length > 0) {
      console.log("Item found:", filteredCart[0]);
      return filteredCart[0];
    } else {
      console.log("No item found with cartId:", targetCartId);
      return null;
    }
  };

  const removeCartItem = async () => {
    console.log("removed items from cart", cartData);
    console.log("Item", item.itemId);
    const getRemoveId = getCartItemById(item.itemId);
    // Output result
    console.log("Item found:", getRemoveId);

    if (getRemoveId) {
      console.log("Item found:", getRemoveId);
    } else {
      console.log("Item not found with cartId:", getRemoveId);
    }

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
              console.log("Removing cart item with ID:", getRemoveId);

              const response = await axios.delete(
                BASE_URL == "test1"
                  ? BASE_URL + "erice-service/cart/remove"
                  : BASE_URL + "cart-service/cart/remove",
                {
                  data: {
                    id: getRemoveId.cartId,
                  },
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              console.log("Item removed successfully", response.data);

              // Fetch updated cart data and total after item removal
              fetchCartData();
            } catch (error) {
              console.error(
                "Failed to remove cart item:",
                error.response || error.message
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleAddToCart = async (item) => {
    console.log("Adding item to cart:", item);

    if (!userData) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    }
    const data = { customerId: customerId, itemId: item.itemId };
    try {
      const response = await axios.post(
        userStage == "test1"
          ? BASE_URL + "erice-service/cart/add_Items_ToCart"
          : BASE_URL + "cart-service/cart/add_Items_ToCart",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert(response.data.errorMessage);
      console.log("Added item to cart:", response.data);

      fetchCartData();
    } catch (error) {
      console.error("Error adding item to cart:", error.response);
    }
  };

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.itemImage }} style={styles.detailImage} />
        <Text style={styles.itemName}>{item.itemName.toUpperCase()}</Text>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 5 }}
      >
        {item.purchaseDescription && (
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionLabel}>Description:</Text>
            <Text style={styles.descriptionText}>
              {item.purchaseDescription}
            </Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          {/* Item Info */}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mrp:</Text>
            <Text style={styles.mrpvalue}>₹ {item.itemMrp}/-</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>₹ {item.itemPrice}/-</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Weight:</Text>
            <Text style={styles.value}>
              {/* {item.quantity} {item.units} */}
              {item.weight} {item.units}
            </Text>
          </View>
          <View style={styles.infoRow1}>
            <Text style={{ alignSelf: "center", alignItems: "center" }}>
              {item.itemQuantity1}
            </Text>
            {isLimitedStock[item.itemId] && (
              <View style={styles.limitedStockBadge}>
                <Text style={styles.limitedStockText}>1 item left</Text>
              </View>
            )}
          </View>

          {/* Action Section */}
          <View style={styles.actionRow}>
            {cartItems[item.itemId] > 0 || loadingItems[item.itemId] ? (
              <View style={styles.quantityContainer}>
                {/* Decrease Button */}
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleDecrease(item)}
                  disabled={loadingItems[item.itemId]}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                {/* Loader or Quantity */}
                {loadingItems[item.itemId] ? (
                  <ActivityIndicator
                    size="small"
                    color="#000"
                    style={styles.loader}
                  />
                ) : (
                  <Text style={styles.quantityText}>
                    {cartItems[item.itemId]}
                  </Text>
                )}

                {/* Increase Button */}
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    (isLimitedStock[item.itemId] ||
                      item.quantity == cartItems[item.itemId]) &&
                      styles.disabledButton,
                  ]}
                  onPress={() => handleIncrease(item)}
                  disabled={
                    loadingItems[item.itemId] ||
                    isLimitedStock[item.itemId] ||
                    item.quantity == cartItems[item.itemId]
                  }
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {item.itemPrice != 1 ? (
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      item.quantity === 0 ? styles.disabledButton : {}, 
                    ]}
                    onPress={() => handleAdd(item)}
                    disabled={item.quantity === 0}
                  >
                    <Text style={styles.addButtonText}>
                      {item.quantity === 0
                        ? "Out of Stock"
                        : loadingItems[item.itemId]
                        ? "Adding..."
                        : "Add to Cart"}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Dashboard")}
            style={styles.smallButton}
          >
            <Text style={styles.buttonText}>Add More</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (userData) {
                navigation.navigate("Home", { screen: "My Cart" });
              } else {
                Alert.alert("Alert", "Please login to continue", [
                  { text: "OK", onPress: () => navigation.navigate("Login") },
                  { text: "Cancel" },
                ]);
              }
            }}
            style={styles.smallButton}
          >
            <Text style={styles.buttonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ItemDetails;

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  actionRow: {
    height: height / 3,
    // flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  detailImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
    backgroundColor: "#eaeaea",
  },
  itemName: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  infoRow1: {
    alignSelf: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  descriptionContainer: {
    marginTop: 15,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#9333ea",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    color: "#fff",
    alignItems: "center",
    alignSelf: "center",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
    color: "#000",
  },
  loader: {
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#9333ea",
    width: 100,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  addbuttontext: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  ViewButton: {
    backgroundColor: "#9333ea",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 70,
  },
  viewButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 70,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#9333ea",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  largeButton: {
    width: "60%",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // Text color
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 4, // Adds a shadow effect
  },
  mrpvalue: {
    textDecorationLine: "line-through",
    color: "#D32F2F",
  },
  limitedStockBadge: {
    // position: "absolute",
    top: 10,
    // left: 20,
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
});
