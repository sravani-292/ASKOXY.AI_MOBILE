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
import CartScreen from "../../View/ShoppingCart/CartScreen"
const { height, width } = Dimensions.get("window");
import { useSelector } from "react-redux";
import BASE_URL,{userStage} from "../../../../Config";
import { useFocusEffect } from "@react-navigation/native";
import { set } from "core-js/core/dict";

const RiceProductDetails = ({ route, navigation }) => {
  // console.log("rice product details",route.params.items);
  // console.log("rice product items",route.params.item);
  
  // console.log("Rice Product Details route",route.params.details.categoryName)

  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [categoryImage, setCategoryIamge] = useState();
  const [loadingItems, setLoadingItems] = useState({});
  const [cartData, setCartData] = useState([]);
  const [loader, setLoader] = useState(false);
  // const [userData, setUserData] = useState();
const [categoryName,setCategoryName] = useState();
  const [error, setError] = useState();
    
  useEffect(() => {
    setItems(route.params.items);
    setCategoryName(route.params.categoryName);
    setCategoryIamge(route.params.categoryImage);
    // setCartData(route.params.items)
    // setCartCount(route.params.items.length)
  }, []);
  const handleAdd = async (item) => {
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
      if(userData){
      fetchCartItems();
      }
      // console.log("userData",userData);
      
      
    }, [])
  );

  //
  const token = userData?.accessToken;
  const customerId = userData?.userId;

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        userStage=="test1"?BASE_URL +
          `erice-service/cart/customersCartItems?customerId=${customerId}`:BASE_URL+`cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        // console.log("cart data",response.data.customerCartResponseList);
        
      const cartData = response.data.customerCartResponseList;
      console.log("cart data1",cartData);
     
      const cartItemsMap = cartData.reduce((acc, item) => {

        // acc[item.itemId] = item.cartQuantity;

        // return acc;
        // console.log("Processing item:", item);
        if (!item.itemId || !item.cartQuantity) {
          console.error("Missing itemId or cartQuantity in item:", item);
          return acc;
        }
        acc[item.itemId] = item.cartQuantity;
        return acc;
      }, {});

      // console.log("cartItemsMap",cartItemsMap);
      setCartItems(cartItemsMap);
      setCartCount(cartData.length);
      setCartData(response.data.customerCartResponseList);
    } catch (error) {
      setError(error.response);
      // console.log("Error fetching cart items:", error.response);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          {userData && (
          <Pressable onPress={() => {
              // console.log({userData});
            navigation.navigate("My Cart")
            }}>
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
                    style={{ color: "#FFF", fontSize: 12, fontWeight: "bold" }}
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
    console.log("add to cart",item);
    
    if(!userData){
      Alert.alert("Alert","Please login to continue",[{text:"OK",onPress:()=>navigation.navigate("Login")},{text:"Cancel"}])
      return
    }
    const data = { customerId: customerId, itemId: item.itemID};
    // setLoader(true)
    try {
      const response = await axios.post(
        userStage == "test1"?BASE_URL + "erice-service/cart/add_Items_ToCart":BASE_URL+"cart-service/cart/add_Items_ToCart",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // setLoader(false)
      // console.log("items added to cart", response);
      
      if (response.data.errorMessage == "Item added to cart successfully") {
        Alert.alert("Success", "Item added to cart successfully");
        setCartItems((prevCartItems) => ({
          ...prevCartItems,
          [item.itemID]: 1,
        }));
        UpdateCartCount(cartCount + 1);
        fetchCartItems();
      } else {
        setLoader(false);
        // console.log("adding item to customer",response);
        
        Alert.alert("Alert", response.data.errorMessage);
      }
    } catch (error) {
      setLoader(false);
      // console.log("Error adding item to cart:", error);
    }
  };

  const incrementQuantity = async (item) => {
    console.log("incremented cart data",item);
    
    const newQuantity = cartItems[item.itemID] + 1;
    // cartItems[item.itemId] will return the cartQuantity value and then increased the cart quantity by 1
    //cartItems = { 101: 2, 102: 3 };
    //If item.itemId is 101, then cartItems[item.itemId] would return 2 (the quantity of item 101).
    //The + 1 increments the item’s current quantity by one.
    const data = {
      customerId: customerId,
      itemId: item.itemID,
      // quantity: newQuantity,
    };
    try {
    const response = await axios.patch(
        userStage== "test1"?BASE_URL+"erice-service/cart/incrementCartData":BASE_URL+"cart-service/cart/incrementCartData",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
          // console.log("incremented cart data",response);
          
    await  fetchCartItems();
      // setCartItems((prevCartItems) => ({
      //   ...prevCartItems,
      //   [item.itemId]: newQuantity,
      // }));
    } catch (error) {
      // console.log("Error incrementing item quantity:", error.response);
    }
  };

  const decrementQuantity = async (item) => {
    console.log("decrement item",item);
    
    const newQuantity = cartItems[item.itemID] - 1;
      const cartItem = cartData.find(
      (cartData) => cartData.itemId === item.itemID
    );
    if (newQuantity === 0) {
      setCartItems((prevCartItems) => {
        const updatedCartItems = { ...prevCartItems };
        delete updatedCartItems[item.itemID];
        return updatedCartItems;
      });
      try {
        const response = await axios.delete(
          userStage=="test1"?BASE_URL + "erice-service/cart/remove":BASE_URL+"cart-service/cart/remove",
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

        Alert.alert("Item removed", "Item removed from the cart");
        fetchCartItems();
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
          BASE_URL=="test1"?BASE_URL + "erice-service/cart/decrementCartData":BASE_URL+"cart-service/cart/decrementCartData",
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchCartItems();
        // setCartItems((prevCartItems) => ({
        //   ...prevCartItems,
        //   [item.itemId]: newQuantity,
        // }));
        // console.log("decremented cart data");
        UpdateCartCount(cartCount - 1);
      } catch (error) {
        // console.log("Error decrementing item quantity:", error.response);
      }
    }
  };

  const renderItem = ({ item }) => {
    const itemQuantity1 = cartItems[item.itemID] || 0;

    return (
      <Animated.View key={item.itemId}>
        <View style={styles.productContainer}>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate("Item Details", { item })}
          >
            <Image
              source={{ uri: item.itemImage }}
              style={styles.productImage}
            />
          </TouchableOpacity> */}

          <View>
            <Text>{item.priceMrp}</Text>
            <Text style={styles.productName}>{item.itemName}</Text>

            {route.params.categoryName === "Sample Rice" ? (
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
              {item.quantity} {item.units}
            </Text>
            {itemQuantity1 > 0 ? (
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
                {route.params.categoryName != "Sample Rice" ? (
                  <TouchableOpacity
                    style={styles.quantityButton}
                    // onPress={() => incrementQuantity(item)}
                    onPress={() => handleIncrease(item)}
                    disabled={loadingItems[item.itemId]}
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
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAdd(item)}
                  >
                    {/* <Text style={styles.addButtonText}>Add to Cart</Text> */}
                    <Text style={styles.addButtonText}>
                      {loadingItems[item.itemId] ? "Adding..." : "Add to Cart"}
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
      // <View>
      //   <Text>hai</Text>
      // </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Image
        // source={require("../../assets/Images/1.jpg")}
        source={{ uri: categoryImage }}
        style={styles.banner}
      /> */}
      <Text style={styles.banner}>{route.params.categoryName}</Text>
      {route.params.categoryName == "Sample Rice" ? (
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
      <Text>hello</Text>
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
    borderColor:"#000",
    borderWidth:2
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
});
