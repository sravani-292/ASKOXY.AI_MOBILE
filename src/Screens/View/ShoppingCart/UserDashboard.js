import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  BackHandler,
  RefreshControl,
} from "react-native";
import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import BASE_URL, { userStage } from "../../../../Config";
import useCart from "./useCart";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigationState } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../../Redux/constants/theme";
import LottieView from "lottie-react-native";
import RiceLoader from "./RiceLoader";
const UserDashboard = ({route}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(route?.params.category || "All CATEGORIES");
  const navigation = useNavigation();
  const [loadingItems, setLoadingItems] = useState({});
  const [cartCount, setCartCount] = useState();
  const [cartItems, setCartItems] = useState({});
  const [cartData, setCartData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [seletedState, setSelectedState] = useState(null);
  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [removalLoading, setRemovalLoading] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [user, setUser] = useState();

  const scrollViewRef = useRef(null);
  
  const currentScreen = useNavigationState(
    (state) => state.routes[state.index]?.name
  );

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
    setTimeout(() => {
      setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
    }, 5000);
  };
  const handleRemove = async (item) => {
    setRemovalLoading((prevState) => ({ ...prevState, [item.itemId]: true }));
    await removeItem(item);
    setRemovalLoading((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;

  useFocusEffect(
    useCallback(() => {
      if (userData) {
        fetchCartItems();
      }
      console.log(route.params.category);
      
    }, [])
  );
 

  const onRefresh = () => {
    getAllCategories();
  };

  const fetchCartItems = async () => {
    console.log("sravani cart items");

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
      // console.log("cart response", response?.data?.customerCartResponseList);

      const cartData = response?.data?.customerCartResponseList;
      const totalCartCount = cartData.reduce(
        (total, item) => total + item.cartQuantity,
        0
      );

      if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
        setCartData([]);
        setCartItems({});
        setIsLimitedStock({});
        setCartCount(0);
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

      console.log("cart items map", cartItemsMap);

      const limitedStockMap = cartData.reduce((acc, item) => {
        if (item.quantity === 0) {
          acc[item.itemId] = "outOfStock";
        } else if (item.quantity <= 5) {
          acc[item.itemId] = "lowStock";
        }
        return acc;
      }, {});

     console.log({limitedStockMap})
      setCartData(cartData);
      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
      setCartCount(totalCartCount);
      
      setLoadingItems((prevState) => ({
        ...prevState,
        [cartData.itemId]: false,
      }));
    } catch (error) {
      // console.error("Error fetching cart items:", error.response.status);
    }
  };

  const arrangeCategories = (categories) => {
    if (!categories || categories.length === 0) return [];
    
    // Find the exact "Sample Rice" category
    const sampleRiceIndex = categories.findIndex(cat => 
      cat.categoryName === "Sample Rice");
    
    // If "Sample Rice" category is found, move it to the first position
    if (sampleRiceIndex !== -1) {
      const result = [...categories];
      const sampleRiceCategory = result.splice(sampleRiceIndex, 1)[0];
      return [sampleRiceCategory, ...result];
    }
    
    return categories;
  };

  const handleAddToCart = async (item) => {
    if (!userData) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "Cancel" },
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }

    const data = { customerId: customerId, itemId: item.itemId };
       console.log("added data",data);
       
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
    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await axios.patch(
        BASE_URL + "cart-service/cart/incrementCartData",
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchCartItems();
    } catch (error) {}
  };

  const removeItem = async (item) => {
    

    const newQuantity = cartItems[item.itemId];
    const cartItem = cartData.find(
      (cartData) => cartData.itemId === item.itemId
    );
   
  if(!cartItem){
    console.log("cart item is not found");
    Alert.alert("Item is not found in the cart");
    return;
  }
    try {
      const response = await axios.delete(
        BASE_URL + "cart-service/cart/remove",
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

      console.log(" removal response", response);
      
      console.log(" removal response", response.status);
       
      if (response.status==200) {
        const updatedCart = cartData.filter(c => c.itemId !== item.itemId);
        setCartData([...updatedCart]);

        await fetchCartItems(); 
        
        if (updatedCart.length === 0) {
            console.log("Cart is now empty. Resetting states.");
            setCartData([]);
            setCartItems({});
            setIsLimitedStock({});
            setCartCount(0);
        }
        Alert.alert("Success",response.data);
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  const decrementQuantity = async (item) => {
    const newQuantity = cartItems[item.itemId];

    const cartItem = cartData.find(
      (cartData) => cartData.itemId === item.itemId
    );
    console.log("customer cart items", cartItem);

    if (newQuantity === 1) {
      handleRemove(item);
    } else {
      const data = {
        customerId: customerId,
        itemId: item.itemId,
      };
      try {
        await axios.patch(
          BASE_URL + "cart-service/cart/decrementCartData",
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchCartItems();
      } catch (error) {
        console.log("Error decrementing item quantity:", error.response);
      }
    }
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
        setUser(response.data);
      }
    } catch (error) {
      console.error("ERROR", error.response);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      getAllCategories();
    };

    fetchData();
  }, []);

  const getAllCategories = () => {
    setLoading(true);
    axios
      .get(BASE_URL + "product-service/showItemsForCustomrs")
      .then((response) => {
        setCategories(response.data);
        // console.log(response.data[0]);
        
        const allItems = response.data.flatMap(
          (category) => category.itemsResponseDtoList || []
        );
        if (selectedCategory === "All CATEGORIES") {
          console.log({selectedCategory});
          
               const allItems = response.data.flatMap(
            (category) => category.itemsResponseDtoList || []
          ).sort((a, b) => (a.quantity > 0 ? -1 : 1));
          setFilteredItems(allItems);
        } else {
          console.log({selectedCategory});
          const filtered = response.data
            .filter(
              (cat) =>
                cat.categoryName.trim().toLowerCase() ===
              selectedCategory.trim().toLowerCase()
            )
            .flatMap((cat) => cat.itemsResponseDtoList || [])
            .sort((a, b) => (a.quantity > 0 ? -1 : 1));
          setFilteredItems(filtered);
        }

        // setFilteredItems(allItems);

        setTimeout(() => {
          setLoading(false);
        
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 100, animated: true });
        }
      }, 100);
           
        }, 1500);
      })
      .catch((error) => {
        console.log(error);

        setLoading(false);
      });
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);

    if (category === "All CATEGORIES") {
      const allItems = categories.flatMap(
        (category) => category.itemsResponseDtoList || []
      ).sort((a, b) => (a.quantity > 0 ? -1 : 1));
      setFilteredItems(allItems);
    } else {
      const filtered = categories
        .filter(
          (cat) =>
            cat.categoryName.trim().toLowerCase() ===
            category.trim().toLowerCase()
        )
        .flatMap((cat) => cat.itemsResponseDtoList || [])
        .sort((a, b) => (a.quantity > 0 ? -1 : 1));
      setFilteredItems(filtered);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require("../../../../assets/AnimationLoading.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
        {/* <RiceLoader/> */}
      </View>
    );
  }

  function footer() {
    return <View style={styles.footer} />;
  }

  const filterItemsBySearch = (searchText) => {
    if (!searchText.trim()) {
      if (selectedCategory === "All CATEGORIES") {
        const allItems = categories.flatMap(
          (category) => category.itemsResponseDtoList || []
        );
        setFilteredItems(allItems);
      } else {
        const filtered = categories
          .filter(
            (cat) =>
              cat.categoryName.trim().toLowerCase() ===
              selectedCategory.trim().toLowerCase()
          )
          .flatMap((cat) => cat.itemsResponseDtoList || []);
        setFilteredItems(filtered);
      }
    } else {
      let normalizedSearchText = searchText.toLowerCase().trim();

      normalizedSearchText = normalizedSearchText
        .replace(/(\d+)(kgs|kg)/g, "$1 kgs")
        .replace(/\s+/g, " ");

      // Split search input into words
      const searchWords = normalizedSearchText.split(" ");

      // Define packaging-related keywords
      const packagingKeywords = [
        "bag",
        "bags",
        "packet",
        "pack",
        "sack",
        "sacks",
        "kg",
        "kgs",
      ];

      
      const allItems = categories.flatMap(
        (category) => category.itemsResponseDtoList || []
      );

      // Filter items based on name, weight, or packaging type
      const searchResults = allItems.filter((item) => {
        const itemName = item.itemName.toLowerCase();
        const itemWeight = item.weight
          ? item.weight.toString().toLowerCase()
          : "";
        const itemUnits = item.units ? item.units.toLowerCase() : "";

        // Normalize item weight + units (e.g., "10kg" → "10 kgs" and "10 kg")
        const combinedWeightUnit = `${itemWeight} ${itemUnits}`.trim();
        const normalizedItemName = itemName.replace(/(\d+)(kgs|kg)/g, "$1 kgs");

        // Create a combined searchable text
        const searchableText =
          `${normalizedItemName} ${itemWeight} ${itemUnits} ${combinedWeightUnit} ${packagingKeywords.join(
            " "
          )}`.trim();

        // Check if all words in search input exist in searchable text
        return searchWords.every((word) => searchableText.includes(word));
      });

      // Set filtered results
      setFilteredItems(searchResults);
    }
  };

 
  const handleClearText = () => {
    setSearchText("");
    if (selectedCategory === "All CATEGORIES") {
      const allItems = categories.flatMap(
        (category) => category.itemsResponseDtoList || []
      );
      setFilteredItems(allItems);
    } else {
      const filtered = categories
        .filter(
          (cat) =>
            cat.categoryName.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
        )
        .flatMap((cat) => cat.itemsResponseDtoList || []);
      setFilteredItems(filtered);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: width * 0.8,
          }}
        >
          <View
            style={[
              styles.searchContainer,
              cartData == null ? styles.fullWidth : styles.reducedWidth,
            ]}
          >
            <Icon
              name="search"
              size={20}
              color="#757575"
              style={styles.searchIcon}
            />

            <TextInput
              placeholder="Search for items..."
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                filterItemsBySearch(text);
              }}
              style={styles.input}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              returnKeyType="search"
              clearButtonMode="never"
            />

            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={handleClearText}
                style={styles.clearButton}
              >
                <Icon name="close-circle" size={20} color="#757575" />
              </TouchableOpacity>
            )}
          </View>

          {userData != null && cartCount > 0 && (
            <Pressable
              onPress={() => navigation.navigate("Home", { screen: "My Cart" })}
            >
              <View style={styles.cartIconContainer}>
                <Icon name="cart-outline" size={35} color="#000" />

              
                {cartCount != 0 && (
                  <View
                    style={{
                      position: "absolute",
                      marginBottom: 20,
                      right: -4,
                      top: -5,
                      backgroundColor: COLORS.services,
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

        
        <ScrollView horizontal>
          <View
            style={{
              alignSelf: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                marginBottom: 10,
                marginRight: 30,
                height: height / 12,
                alignSelf: "center",
                marginTop: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollViewRef}>
                <TouchableOpacity
                  onPress={() => filterByCategory("All CATEGORIES")}
                >
                  <Text
                    style={[
                      styles.firstrow,
                      {
                        backgroundColor:
                          selectedCategory === "All CATEGORIES"
                            ? COLORS.title
                            : "lightgray",
                      },
                    ]}
                  >
                    ALL ITEMS
                  </Text>
                </TouchableOpacity>
                {arrangeCategories(categories).map((category, index) => (
                  <TouchableOpacity
                    // key={category.categoryName}
                    key={index}
                    onPress={() => filterByCategory(category.categoryName)}
                  >
                    <View
                      style={[
                        styles.firstrow,
                        {
                          backgroundColor:
                            selectedCategory === category.categoryName
                              ? COLORS.title
                              : "lightgray",
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: category.categoryLogo }}
                        style={styles.categoryImage}
                      />
                      <Text style={styles.categoryText}>
                        {category.categoryName.trim().toUpperCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.itemId}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          // ListFooterComponentStyle={styles.footer}
          ListFooterComponent={footer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Items Found</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
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
                {isLimitedStock[item.itemId] === "lowStock" &&(
                  <View style={styles.limitedStockBadge}>
                    <Text style={styles.limitedStockText}>
                      {item.quantity > 1
                        ? `${item.quantity} items left`
                        : `${item.quantity} item left`}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => navigation.navigate("Item Details", { item })}
                >
                  <Image
                    source={{ uri: item.itemImage }}
                    style={styles.itemImage}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.itemName}>{item.itemName}</Text>

              <View style={styles.priceContainer}>
                <Text style={styles.newPrice}>₹{item.itemPrice}</Text>
                <Text style={styles.oldPrice}>₹{item.itemMrp}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.itemWeight}>
                  {item.weight} {item.units}{" "}
                </Text>
                {/* Add Button */}
                {cartItems && cartItems[item.itemId] > 0 ? (
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
                  <View>
                    {!loader ? (
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
                            : removalLoading[item.itemId]
                            ? "Removing"
                            : loadingItems[item.itemId]
                            ? "Adding"
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
          )}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default UserDashboard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: COLORS.backgroundcolour,
    height: "auto",
  },
  searchBar: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },

  row: {
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  itemCard: {
    // flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "45%",
    height: "100%",

  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
  },
  itemImage: {
    width: width / 4,
    height: 130,
    borderRadius: 10,
  },

  labelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    width:width*0.35,
    height:height/11,
    alignSelf:"center"
  },
  priceContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  newPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.services,
    marginLeft: -25,
  },
  oldPrice: {
    marginLeft: 40,
    fontSize: 15,
    color: "#5e606c",
    textDecorationLine: "line-through",
  },

  itemWeight: {
    marginLeft: 13,
    fontSize: 13,
    color: "#757575",
  },
  addButton: {
    backgroundColor: "#6b21a8",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginLeft: 5,
    borderRadius: 5,

    width: width * 0.25,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 14,
    alignSelf: "center",
    alignItems: "center",
  },
  firstrow: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 13,
    borderRadius: 20,
    marginRight: 10,
    width: width * 0.4,
    textAlign: "center",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 30,
    paddingRight: 5,
  },
  quantityButton: {
    backgroundColor: "#a593df",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4,
  },

  quantityButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 15,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: "#3e2723",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },
  limitedStockBadge: {
    position: "absolute",
    top: 10,
    left: 40,
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
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cartIconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    marginLeft: 15,
    marginTop: 8,
  },
  cartBadge: {
    position: "absolute",
    right: -8,
    top: -5,
    backgroundColor: "#FF6F00",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  cartBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    marginBottom: 100,
    marginTop: 150,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 10,
    // width:width*0.8,
    height: 60,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearButton: {
    position: "absolute",
    right: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 8,
  },
  emptyText: {
    textAlign: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  fullWidth: {
    width: width * 0.9,
  },
  reducedWidth: {
    width: width * 0.8,
  },
  discountBadge: {
    position: "absolute",
    // top: 1,
    bottom: 1,
    // left: 5,
    right: 20,
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
  quantityButton1: {
    backgroundColor: "#c0c0c0",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4,
  },
});
