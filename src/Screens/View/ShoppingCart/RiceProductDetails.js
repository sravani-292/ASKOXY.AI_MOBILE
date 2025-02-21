import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
const { height, width } = Dimensions.get("window");
import { useSelector } from "react-redux";
import BASE_URL, { userStage } from "../../../../Config";
import { useFocusEffect } from "@react-navigation/native";
import { set } from "core-js/core/dict";

const RiceProductDetails = ({ route, navigation }) => {
  // WITHOUT ZAKYA RESPONSE
  // console.log("Rice Product Details route",route.params.details.categoryName)

  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [categoryImage, setCategoryIamge] = useState();
  const [loadingItems, setLoadingItems] = useState({});
  const [cartData, setCartData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isLimitedStock, setIsLimitedStock] = useState({});

  // const [userData, setUserData] = useState();
  console.log("rice product details", route.params);

  const [error, setError] = useState();

  useEffect(() => {
    setItems(route.params.details.itemsResponseDtoList);
    setCategoryIamge(route.params.details.categoryLogo);
  }, []);
  const handleAdd = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await handleAddToCart(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const handleIncrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await incrementQuantity(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const handleDecrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await decrementQuantity(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };
  const userData = useSelector((state) => state.counter);

  useFocusEffect(
    useCallback(() => {
      if (userData) {
        fetchCartItems();
      }
      console.log("userData", userData);
    }, [])
  );

  //
  const token = userData?.accessToken;
  const customerId = userData?.userId;

  const fetchCartItems = async () => {
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
      console.log("API Response:", response); // Log full response
      const cartData = response?.data?.customerCartResponseList;

      if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
        console.error("cartData is empty or invalid:", cartData);
        setCartData([]);
        setCartItems({});
        setIsLimitedStock({});
        setCartCount(0);
        return; // Stop execution if cartData is invalid
      }

      console.log("cartData:", cartData); // Log valid cart data

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
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          {userData && (
            <Pressable
              onPress={() => {
                console.log({ userData });
                navigation.navigate("Home", { screen: "My Cart" });
              }}
            >
              <View style={styles.cartIconContainer}>
                <Icon name="cart-outline" size={30} color="#FFF" />

                {cartCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -8,
                      top: -5,
                      backgroundColor: "#FF6F00",
                      borderRadius: 10,
                      paddingHorizontal: 5,
                      paddingVertical: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFF",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {cartCount}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )}
        </View>
      ),
    });
  }, [navigation, cartCount]);

  // const UpdateCartCount = (newCount) => setCartCount(newCount);
  const handleAddToCart = async (item) => {
    console.log("add to cart", item);

    if (!userData) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    }
    const data = { customerId: customerId, itemId: item.itemId };
    // setLoader(true)
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
      // setLoader(false)
      console.log("added response", response);

      if (response.data.errorMessage == "Item added to cart successfully") {
        Alert.alert("Success", "Item added to cart successfully");

        fetchCartItems();
      } else {
        setLoader(false);
        console.log("adding item to customer", response);

        Alert.alert("Alert", response.data.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      console.error("Error adding item to cart:", error.response);
    }
  };

  const incrementQuantity = async (item) => {
    // const newQuantity = cartItems[item.itemId] + 1;
    // cartItems[item.itemId] will return the cartQuantity value and then increased the cart quantity by 1
    //cartItems = { 101: 2, 102: 3 };
    //If item.itemId is 101, then cartItems[item.itemId] would return 2 (the quantity of item 101).
    //The + 1 increments the item’s current quantity by one.
    const data = {
      customerId: customerId,
      itemId: item.itemId,
      // quantity: newQuantity,
    };
    try {
      const response = await axios.patch(
        userStage == "test1"
          ? BASE_URL + "erice-service/cart/incrementCartData"
          : BASE_URL + "cart-service/cart/incrementCartData",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchCartItems();
      console.log("incremented response", response);
    } catch (error) {
      console.log("Error incrementing item quantity:", error);
    }
  };

  const decrementQuantity = async (item) => {
    const newQuantity = cartItems[item.itemId];
    console.log("cartData type:", Array.isArray(cartData));
    const cartItem = cartData.find(
      (cartData) => cartData.itemId === item.itemId
    );
    console.log("cart item", cartItem);

    if (newQuantity === 1) {
      try {
        const response = await axios.delete(
          userStage == "test1"
            ? BASE_URL + "erice-service/cart/remove"
            : BASE_URL + "cart-service/cart/remove",
          {
            data: {
              id: cartItem.cartId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("item removal", response);

        Alert.alert("Item removed", "Item removed from the cart");
        fetchCartItems();
      } catch (error) {
        // console.log(error.response);
      }
    } else {
      const data = {
        customerId: customerId,
        itemId: item.itemId,
      };
      try {
        const response = await axios.patch(
          userStage == "test1"
            ? BASE_URL + "erice-service/cart/decrementCartData"
            : BASE_URL + "cart-service/cart/decrementCartData",
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("decremented cart data", response);
        fetchCartItems();
      } catch (error) {
        console.error("Error decrementing item quantity:", error);
      }
    }
  };

  const renderItem = ({ item }) => {
    const itemQuantity1 = cartItems[item.itemId] || 0;
    const isLimitedStock = cartItems[item.itemId] === 1;
    return (
      <Animated.View key={item.itemId}>
        <View style={styles.productContainer}>
          {/* Show "1 item left" message above the image */}
          {isLimitedStock[item.itemId] && (
            <View style={styles.limitedStockBadge}>
              <Text style={styles.limitedStockText}>1 item left</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate("Item Details", { item })}
          >
            <Image
              source={{ uri: item.itemImage }}
              style={styles.productImage}
            />
          </TouchableOpacity>

          <View>
            <Text>{item.priceMrp}</Text>
            <Text style={styles.productName}>{item.itemName}</Text>

            {route.params.details.categoryName === "Sample Rice" ? (
              <Text style={styles.productPrice}> ₹ {item.itemPrice}</Text>
            ) : (
              <>
                <Text style={styles.mrpText}>
                  MRP: ₹{" "}
                  <Text style={styles.crossedPrice}>{item.itemMrp}/-</Text>
                </Text>
                <Text style={styles.discountPercentage}>
                  (
                  {Math.round(
                    ((item.itemMrp - item.itemPrice) / item.itemMrp) * 100
                  )}
                  % OFF)
                </Text>
                <Text style={styles.productPrice}> ₹ {item.itemPrice}/-</Text>
              </>
            )}

            <Text style={styles.productWeight}>
              {item.weight} {item.units}
            </Text>
            {cartItems[item.itemId] > 0 ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  // onPress={() => decrementQuantity(item)}
                  onPress={() => handleDecrease(item)}
                  disabled={loadingItems[item.itemId]}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                {/* Show loader in the middle when loading */}
                {loadingItems[item.itemId] ? (
                  <ActivityIndicator
                    size="small"
                    color="#000"
                    style={styles.loader}
                  />
                ) : (
                  <Text style={styles.quantityText}>{itemQuantity1}</Text>
                )}
                {route.params.details.categoryName != "Sample Rice" ? (
                 <TouchableOpacity
                 style={[
                   styles.quantityButton,
                   (isLimitedStock[item.itemId] || item.quantity == cartItems[item.itemId]) && styles.disabledButton,
                 ]}
                 onPress={() => handleIncrease(item)}
                 disabled={
                   loadingItems[item.itemId] || isLimitedStock[item.itemId] || item.quantity == cartItems[item.itemId]
                 }
               >
                 <Text style={styles.quantityButtonText}>+</Text>
               </TouchableOpacity>
                ) : (
                  <View
                    style={styles.quantityButton1}
                    // onPress={() => incrementQuantity(item)}
                    onPress={() => handleIncrease(item)}
                    disabled={loadingItems[item.itemId]}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </View>
                )}
              </View>
            ) : (
              <View>
                {loader == false ? (
                  // <TouchableOpacity
                  //   style={styles.addButton}
                  //   onPress={() => handleAdd(item)}
                  // >
                  //   {/* <Text style={styles.addButtonText}>Add to Cart</Text> */}
                  //   <Text style={styles.addButtonText}>
                  //     {loadingItems[item.itemId] ? "Adding..." : "Add to Cart"}
                  //   </Text>
                  // </TouchableOpacity>
                  <TouchableOpacity
                  style={[
                    styles.addButton,
                    item.quantity === 0 ? styles.disabledButton : {}, // ✅ Corrected condition
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
                
                ) : (
                  <View style={styles.addButton}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        // source={require("../../assets/Images/1.jpg")}
        source={{ uri: categoryImage }}
        style={styles.banner}
      />
      {route.params.details.categoryName == "Sample Rice" ? (
        <Text style={styles.noteText}>
          Note : Only one free sample is allowed per user.
        </Text>
      ) : null}
      <ScrollView>
        <FlatList
          data={items}
          keyExtractor={(item) => item.itemId}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
};

export default RiceProductDetails;

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    width: width,
    height: 250,
    // resizeMode: "cover",
    marginVertical: 10,
  },
  cartIconContainer: {
    position: "relative",
  },
  productContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    height: height / 8,
    width: width * 0.25,
    justifyContent: "center",
    alignSelf: "center",
    margin: 5,
    marginRight: 30,
    // marginTop:20
  },
  productName: {
    width: width * 0.6,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  noteText: {
    alignSelf: "center",
    color: "red",
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 16,
    width: width * 0.8,
    textAlign: "center",
  },

  productPrice: {
    fontSize: 16,
    color: "#388E3C",
    fontWeight: "bold",
    marginTop: 4,
  },
  productWeight: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#FF6F00",
    width: 90,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: "#FF6F00",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  quantityButton1: {
    backgroundColor: "#c0c0c0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  quantityButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 15,
  },
  mrpText: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#888",
    textDecorationColor: "#D32F2F",
    textDecorationStyle: "solid",
    marginBottom: 5,
    paddingRight: 10,
  },
  crossedPrice: {
    textDecorationLine: "line-through",
    color: "#D32F2F",
    marginRight: 5,
  },
  limitedStockBadge: {
    position: "absolute",
    top: 10,
    left: 20,
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    zIndex: 10,
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
