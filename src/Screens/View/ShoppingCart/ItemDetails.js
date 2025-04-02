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
import { COLORS } from "../../../../Redux/constants/theme";
import Icon from "react-native-vector-icons/Ionicons";
import BASE_URL, { userStage } from "../../../../Config";
import FontAwesome from "react-native-vector-icons/FontAwesome";
const ItemDetails = ({ route, navigation }) => {
  const { item } = route?.params;
  console.log("Item details page", item);

  const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;
  const [user, setUser] = useState();
  const [cartData, setCartData] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [loadingItems, setLoadingItems] = useState({});
  const [isLimitedStock, setIsLimitedStock] = useState({});
  
  useEffect(() => {
    // getProfile();
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    console.log("fetching cart data");

    try {
      const response = await axios.get(
        BASE_URL +
          `cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response from cart", response);
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

      
      const limitedStockMap = cartData.reduce((acc, item) => {
        if (item.quantity === 0) {
          acc[item.itemId] = "outOfStock";
        } else if (item.quantity <= 5) {
          acc[item.itemId] = "lowStock";
        }
        return acc;
      }, {});
      console.log("Limited Stock Map:", limitedStockMap);

      // Updating state
      setCartData(cartData);
      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
      setCartCount(cartData.length);
    } catch (error) {
      console.log(error);

      console.error("Error fetching cart items:", error.response.status);
    }
  };

  const handleAdd = async (item) => {
    console.log("handle add", { item });
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await handleAddToCart(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
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
        BASE_URL + `cart-service/cart/incrementCartData`,
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
                BASE_URL + "cart-service/cart/remove",
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

  const getProfile = async () => {
    try {
      const response = await axios({
        method: "GET",
        url:
          BASE_URL +
          `user-service/customerProfileDetails?customerId=${customerId}`,

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("profile get call response");
        setUser(response.data);
      }
    } catch (error) {
      console.error("ERROR", error);
      showToast("Error loading profile");
    }
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
        BASE_URL + "cart-service/cart/add_Items_ToCart",
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
        {/* Discount Badge */}
        {item.itemMrp > item.itemPrice && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(
                ((item.itemMrp - item.itemPrice) / item.itemMrp) * 100
              )}
              % OFF
            </Text>
          </View>
        )}
        <Image source={{ uri: item.itemImage }} style={styles.detailImage} />
        {/* Star Ratings */}
        <View style={styles.ratingContainer}>
          
          {[...Array(4)].map((_, index) => (
            <FontAwesome key={index} name="star" size={20} color="gold" />
          ))}

          {/* Half Star */}
          <FontAwesome name="star-half-full" size={20} color="gold" />

          {/* Static Rating Text */}
          <Text style={styles.ratingText}>4.8/5</Text>
        </View>
        <Text style={styles.itemName}>{item.itemName.toUpperCase()}</Text>
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 5 }}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
      >
        <View style={styles.infoContainer}>
         
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
            
              {item.weight} {item.units}
            </Text>
          </View>
          {item.itemDescription && (
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{item.itemDescription}</Text>
            </View>
          )}
          <View style={styles.infoRow1}>
            <Text style={{ alignSelf: "center", alignItems: "center" }}>
              {item.itemQuantity1}
            </Text>
            {isLimitedStock[item.itemId] == "lowStock" && (
              <View style={styles.limitedStockBadge}>
                <Text style={styles.limitedStockText}>
                  {item.quantity > 1
                    ? `${item.quantity} items left`
                    : `${item.quantity} item left`}
                </Text>
              </View>
            )}
          </View>

        
          <View style={styles.actionRow}>
            {cartItems[item.itemId] > 0 || loadingItems[item.itemId] ? (
              <View style={styles.quantityContainer}>
              
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleDecrease(item)}
                  disabled={loadingItems[item.itemId]}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

               
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
                 {item.itemPrice==1 ?(
                                       <View
                                       style={styles.quantityButton1}
                                       // onPress={() => incrementQuantity(item)}
                                       onPress={() => handleIncrease(item)}
                                       disabled={loadingItems[item.itemId]}
                                     >
                                       <Text style={styles.quantityButtonText}>+</Text>
                                     </View>):(
                <TouchableOpacity
                  style={[
                    cartItems[item.itemId] === item.quantity
                      ? styles.disabledButton
                      : styles.quantityButton,
                  ]}
                  onPress={() => handleIncrease(item)}
                  disabled={
                    loadingItems[item.itemId] ||
                    cartItems[item.itemId] === item.quantity
                  }
                >
                  <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>)}
              </View>
            ) : (
              <>
                {/* {item.itemPrice != 1 ? ( */}
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      item.quantity === 0 ? styles.disabledButton : {},
                    ]}
                    onPress={() => handleAdd(item)}
                    disabled={item.quantity === 0}
                  >
                    <Text style={styles.addbuttontext}>
                      {item.quantity === 0
                        ? "Out of Stock"
                        : loadingItems[item.itemId]
                        ? "Adding..."
                        : "Add to Cart"}
                    </Text>
                  </TouchableOpacity>
                {/* ) : null} */}
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Rice Products",{screen:"Rice Products",category:"All CATEGORIES"})}
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
    backgroundColor: COLORS.services,
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
    backgroundColor: COLORS.services,
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
    backgroundColor: COLORS.services,
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
    backgroundColor: COLORS.services,
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
    // borderWidth: 1,
    // borderColor: "#ddd",
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
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    alignItems: "center",
  },
  discountBadge: {
    position: "absolute",
    top: 1,
    // bottom:1,
    left: width * 0.2,
    // right:width*0.2,
    backgroundColor: "#ffa600",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  discountText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginLeft: 5,
  },
  quantityButton1: {
    backgroundColor: "#c0c0c0",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    alignItems: "center",
  },
});
