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
import CartScreen from "./CartScreen";
const { height, width } = Dimensions.get("window");
import { useSelector } from "react-redux";
import BASE_URL, { userStage } from "../../../../Config";
import { useFocusEffect } from "@react-navigation/native";
import { set } from "core-js/core/dict";

const RiceProductDetails = ({ route, navigation }) => {

  //with zakya response
  console.log("rice product details", route.params.details.zakyaResponseList);
  // console.log("rice product items",route.params.item);

  // console.log("Rice Product Details route", route.params.details.categoryName);

  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [categoryImage, setCategoryIamge] = useState();
  const [loadingItems, setLoadingItems] = useState({});
  const [cartData, setCartData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [categoryName, setCategoryName] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setItems(route.params.details.zakyaResponseList);
    setCategoryName(route.params.details.categoryName);
    setCategoryIamge(route.params.details.categoryImage);
  }, []);

  const handleAdd = async (item) => {
  console.log("handle add",{item});
    setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: true }));
    await handleAddToCart(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: false }));
  };

  const handleIncrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: true }));
    await incrementQuantity(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: false }));
  };

  const handleDecrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: true }));
    await decrementQuantity(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: false }));
  };
  const userData = useSelector((state) => state.counter);

  useFocusEffect(
    useCallback(() => {
      if (userData) {
        fetchCartItems();
      }
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

      const cartData = response.data.customerCartResponseList;
     if(cartData){
      const cartItemsMap = cartData.reduce((acc, item) => {
        if (!item.itemId || !item.cartQuantity) {
          console.error("Missing itemId or cartQuantity in item:", item);
          return acc;
        }
        acc[item.itemId] = item.cartQuantity;
        return acc;
      }, {});

      console.log({cartItemsMap});
      

      setCartItems(cartItemsMap);
      setCartCount(cartData.length);
      setCartData(response.data.customerCartResponseList);
    }else{
      setCartItems({})
      setCartCount(0)
      setCartData(response.data.customerCartResponseList)
    }
    } catch (error) {
      setError(error.response);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          {userData && (
            <Pressable
              onPress={() => {
                // navigation.navigate("My Cart");
                navigation.navigate("Home", { screen: "My Cart" })
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

  const UpdateCartCount = (newCount) => setCartCount(newCount);
  const handleAddToCart = async (item) => {
    console.log("add to cart", item.itemID);

    if (!userData) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    }
    const data = { customerId: customerId, itemId: item.itemID };
    console.log({ data });

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

      if (response.data.errorMessage == "Item added to cart successfully") {
        Alert.alert("Success", "Item added to cart successfully");

        fetchCartItems();
      } else {
        setLoader(false);
        Alert.alert("Alert", response.data.errorMessage);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const incrementQuantity = async (item) => {
    console.log("incremented cart data", item);

    const data = {
      customerId: customerId,
      itemId: item.itemID,
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

      await fetchCartItems();
    } catch (error) {}
  };

  const decrementQuantity = async (item) => {
    // console.log("decrement item", item);

    const newQuantity = cartItems[item.itemID];
    // console.log("new quantity",newQuantity);
    
    const cartItem = cartData.find(
      (cartData) => cartData.itemId === item.itemID
    );

    console.log("cart item",cartItem);
    
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
        fetchCartItems();
        Alert.alert("Item removed", "Item removed from the cart");
        
      } catch (error) {
        console.log(error.response);
      }
    } else {
      const data = {
        customerId: customerId,
        itemId: item.itemID,
      };
      try {
        await axios.patch(
          BASE_URL == "test1"
            ? BASE_URL + "erice-service/cart/decrementCartData"
            : BASE_URL + "cart-service/cart/decrementCartData",
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchCartItems();
      } catch (error) {
        // console.log("Error decrementing item quantity:", error.response);
      }
    }
  };

  const renderItem = ({ item }) => {
    const itemQuantity1 = cartItems[item.itemID] || 0;

    return (
      <Animated.View key={item.itemID}>
        <View style={styles.productContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Item Details", { item })}
          >
            <Image
              source={{ uri: item.imageType }}
              style={styles.productImage}
            />
          </TouchableOpacity>

          <View>
            <Text>{item.priceMrp}</Text>

            <Text style={styles.productName}>{item.itemName}{cartItems[item.itemID] }</Text>

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
              {item.itemWeight} {item.weightUnit}
            </Text>
            {cartItems && cartItems[item.itemID] > 0 ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleDecrease(item)}
                  disabled={loadingItems[item.itemID]}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                {/* Show loader in the middle when loading */}
                {loadingItems[item.itemID] ? (
                  <ActivityIndicator
                    size="small"
                    color="#000"
                    style={styles.loader}
                  />
                ) : (
                  <Text style={styles.quantityText}>{cartItems[item.itemID]}</Text>
                )}
                {route.params.details.categoryName != "Sample Rice" ? (
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleIncrease(item)}
                    disabled={loadingItems[item.itemID]}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={styles.quantityButton1}
                    // onPress={() => incrementQuantity(item)}
                    onPress={() => handleIncrease(item)}
                    disabled={loadingItems[item.itemID]}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </View>
                )}
              </View>
            ) : (
              <View>
                {loader == false ? (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAdd(item)}
                  >
                    <Text style={styles.addButtonText}>
                      {loadingItems[item.itemID] ? "Adding..." : "Add to Cart"}
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
          keyExtractor={(item) => item.itemID}
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
    marginVertical: 10,
    borderColor: "#000",
    borderWidth: 2,
    
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
    // alignSelf:"center",
    // justifyContent:"center
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
});
