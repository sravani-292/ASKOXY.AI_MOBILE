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
  Modal,
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
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import { COLORS } from "../../../../Redux/constants/theme";
import LottieView from "lottie-react-native";
import RiceLoader from "./RiceLoader";

const UserDashboard = ({route}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || "All CATEGORIES");
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
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [weightRange, setWeightRange] = useState({ min: 0, max: 100 });
  const [sortOrder, setSortOrder] = useState("weightAsc");

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
      console.log(route?.params?.category);
      
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

  // Helper function to parse weight for sorting
  const parseWeight = (weightStr) => {
    if (!weightStr) return 0;
    
    // Try to extract numeric value
    const numMatch = weightStr.toString().match(/(\d+(\.\d+)?)/);
    if (numMatch) {
      return parseFloat(numMatch[0]);
    }
    return 0;
  };

  // Sort items by weight in ascending order (changed from descending)
  const sortItems = (items, order) => {
    return [...items].sort((a, b) => {
      // First priority: in-stock items
      if (a.quantity > 0 && b.quantity === 0) return -1;
      if (a.quantity === 0 && b.quantity > 0) return 1;
      
      // Second priority: sort by selected order
      if (order === "weightAsc") {
        const weightA = parseWeight(a.weight);
        const weightB = parseWeight(b.weight);
        return weightA - weightB; // Changed to ascending
      } else if (order === "weightDesc") {
        const weightA = parseWeight(a.weight);
        const weightB = parseWeight(b.weight);
        return weightB - weightA;
      } else if (order === "priceAsc") {
        return a.itemPrice - b.itemPrice;
      } else if (order === "priceDesc") {
        return b.itemPrice - a.itemPrice;
      }
      
      return 0;
    });
  };

  // Apply all filters and sorting
  const applyFiltersAndSort = (items) => {
    // Filter by price and weight
    const filtered = items.filter(item => {
      const itemPrice = parseFloat(item.itemPrice);
      const itemWeight = parseWeight(item.weight);
      return (itemPrice >= priceRange.min && itemPrice <= priceRange.max) && 
             (itemWeight >= weightRange.min && itemWeight <= weightRange.max);
    });
    
    // Sort the filtered items
    return sortItems(filtered, sortOrder);
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

  // Get an appropriate icon based on item name or category
  const getItemIcon = (item) => {
    const itemNameLower = item.itemName.toLowerCase();
    
    if (itemNameLower.includes("rice")) {
      return <MaterialIcons name="rice-bowl" size={20} color="#6b21a8" />;
    } else if (itemNameLower.includes("wheat") || itemNameLower.includes("flour")) {
      return <FontAwesome name="leaf" size={18} color="#6b21a8" />;
    } else if (itemNameLower.includes("oil")) {
      return <FontAwesome name="tint" size={18} color="#6b21a8" />;
    } else if (itemNameLower.includes("sugar")) {
      return <FontAwesome name="cube" size={18} color="#6b21a8" />;
    } else if (itemNameLower.includes("dal") || itemNameLower.includes("lentil")) {
      return <MaterialIcons name="food-bank" size={20} color="#6b21a8" />;
    } else {
      return <MaterialIcons name="shopping-bag" size={18} color="#6b21a8" />;
    }
  };

  const getAllCategories = () => {
    setLoading(true);
    axios
      .get(BASE_URL + "product-service/showItemsForCustomrs")
      .then((response) => {
        setCategories(response.data);
        
        // Get all items
        const items = response.data.flatMap(
          (category) => category.itemsResponseDtoList || []
        );
        
        setAllItems(items);
        
        if (selectedCategory === "All CATEGORIES") {
          console.log({selectedCategory});
          
          // Apply filters and sorting (now in ascending order by default)
          setFilteredItems(sortItems(items, "weightAsc"));
        } else {
          console.log({selectedCategory});
          const filtered = response.data
            .filter(
              (cat) =>
                cat.categoryName.trim().toLowerCase() ===
              selectedCategory.trim().toLowerCase()
            )
            .flatMap((cat) => cat.itemsResponseDtoList || []);
          
          // Apply filters and sorting (now in ascending order by default)
          setFilteredItems(sortItems(filtered, "weightAsc"));
        }

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
      // Apply filters and sorting
      setFilteredItems(applyFiltersAndSort(allItems));
    } else {
      const filtered = categories
        .filter(
          (cat) =>
            cat.categoryName.trim().toLowerCase() ===
            category.trim().toLowerCase()
        )
        .flatMap((cat) => cat.itemsResponseDtoList || []);
      
      // Apply filters and sorting
      setFilteredItems(applyFiltersAndSort(filtered));
    }
  };

  // Apply filters and update items
  const applyFilters = () => {
    let itemsToFilter = [];
    
    if (selectedCategory === "All CATEGORIES") {
      itemsToFilter = allItems;
    } else {
      itemsToFilter = categories
        .filter(
          (cat) =>
            cat.categoryName.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
        )
        .flatMap((cat) => cat.itemsResponseDtoList || []);
    }
    
    setFilteredItems(applyFiltersAndSort(itemsToFilter));
    setFilterModalVisible(false);
  };

  // Reset filters
  const resetFilters = () => {
    setPriceRange({ min: 0, max: 10000 });
    setWeightRange({ min: 0, max: 100 });
    setSortOrder("weightAsc");
    
    // Reapply the default sorting and filtering
    filterByCategory(selectedCategory);
    setFilterModalVisible(false);
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
        setFilteredItems(applyFiltersAndSort(allItems));
      } else {
        const filtered = categories
          .filter(
            (cat) =>
              cat.categoryName.trim().toLowerCase() ===
              selectedCategory.trim().toLowerCase()
          )
          .flatMap((cat) => cat.itemsResponseDtoList || []);
        setFilteredItems(applyFiltersAndSort(filtered));
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

      // Set filtered results and apply filters and sorting
      setFilteredItems(applyFiltersAndSort(searchResults));
    }
  };

 
  const handleClearText = () => {
    setSearchText("");
    if (selectedCategory === "All CATEGORIES") {
      setFilteredItems(applyFiltersAndSort(allItems));
    } else {
      const filtered = categories
        .filter(
          (cat) =>
            cat.categoryName.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
        )
        .flatMap((cat) => cat.itemsResponseDtoList || []);
      setFilteredItems(applyFiltersAndSort(filtered));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: width * 0.9,
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

          {/* Filter Button */}
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Icon name="filter" size={24} color="#6b21a8" />
          </TouchableOpacity>

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
                marginBottom: 5,
                marginRight: 30,
                height: height / 19,
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
                  <View 
                  style={[
                      styles.firstrow,
                      {
                        backgroundColor:
                          selectedCategory === "All CATEGORIES"
                            ? COLORS.title
                            : "lightgray",
                      },
                    ]}>
                      <Icon name="albums" size={20} color="#6b21a8"  style={{marginRight: 8}}/>
                  <Text style={styles.categoryText}>
                    ALL ITEMS
                  </Text>
                  </View>
                </TouchableOpacity>
                {arrangeCategories(categories).map((category, index) => (
                  <TouchableOpacity
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

        {/* Filter Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={filterModalVisible}
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filter & Sort</Text>
              
              {/* Sort Options */}
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.sortOptions}>
                <TouchableOpacity 
                  style={[styles.sortOption, sortOrder === "weightAsc" && styles.selectedSortOption]}
                  onPress={() => setSortOrder("weightAsc")}
                >
                  <Text style={styles.sortOptionText}>Weight (Low to High)</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sortOption, sortOrder === "weightDesc" && styles.selectedSortOption]}
                  onPress={() => setSortOrder("weightDesc")}
                >
                  <Text style={styles.sortOptionText}>Weight (High to Low)</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sortOption, sortOrder === "priceAsc" && styles.selectedSortOption]}
                  onPress={() => setSortOrder("priceAsc")}
                >
                  <Text style={styles.sortOptionText}>Price (Low to High)</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sortOption, sortOrder === "priceDesc" && styles.selectedSortOption]}
                  onPress={() => setSortOrder("priceDesc")}
                >
                  <Text style={styles.sortOptionText}>Price (High to Low)</Text>
                </TouchableOpacity>
              </View>
              
              {/* Price Range */}
              {/* <Text style={styles.sectionTitle}>Price Range (₹)</Text>
              <View style={styles.rangeInputContainer}>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Min"
                  keyboardType="numeric"
                  value={priceRange.min.toString()}
                  onChangeText={(text) => setPriceRange({...priceRange, min: parseInt(text) || 0})}
                />
                <Text style={styles.rangeText}>to</Text>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Max"
                  keyboardType="numeric"
                  value={priceRange.max.toString()}
                  onChangeText={(text) => setPriceRange({...priceRange, max: parseInt(text) || 10000})}
                />
              </View> */}
              
              {/* Weight Range */}
              {/* <Text style={styles.sectionTitle}>Weight Range (kg)</Text>
              <View style={styles.rangeInputContainer}>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Min"
                  keyboardType="numeric"
                  value={weightRange.min.toString()}
                  onChangeText={(text) => setWeightRange({...weightRange, min: parseInt(text) || 0})}
                />
                <Text style={styles.rangeText}>to</Text>
                <TextInput
                  style={styles.rangeInput}
                  placeholder="Max"
                  keyboardType="numeric"
                  value={weightRange.max.toString()}
                  onChangeText={(text) => setWeightRange({...weightRange, max: parseInt(text) || 100})}
                />
              </View> */}
              
              {/* Buttons */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={resetFilters}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={applyFilters}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.itemId}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={footer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No Items Found</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
{isLimitedStock[item.itemId] === "lowStock" &&(
                  <View style={styles.limitedStockBadge}>
                    <Text style={styles.limitedStockText}>
                      {item.quantity > 1
                        ? `${item.quantity} items left`
                        : `${item.quantity} item left`}
                    </Text>
                  </View>
                )}
                <TouchableOpacity onPress={() => navigation.navigate("Item Details", { item })}>
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
                <Image
                  source={{ uri: item.itemImage  }}
                  style={styles.itemImage}
                  resizeMode="contain"
                />
              </View>
              </TouchableOpacity>

              <View style={styles.itemInfo}>
                <View style={styles.itemNameContainer}>
                  {getItemIcon(item)}
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.itemName}
                  </Text>
                </View>

                <View style={styles.weightContainer}>
                 
                  <Text style={styles.itemWeight}>
  Weight: {item.weight} {item.weight === 1 ? item.units.replace(/s$/, '') : item.units}
            </Text>
                </View>

                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>₹{item.itemPrice}</Text>
                  {item.itemMrp > item.itemPrice && (
                    <Text style={styles.mrpText}>₹{item.itemMrp}</Text>
                  )}
                </View>

                {item.quantity === 0 ? (
                  <View style={styles.outOfStockButton}>
                    <Text style={styles.outOfStockText}>Out of Stock</Text>
                  </View>
                ) : cartItems[item.itemId] ? (
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() => handleDecrease(item)}
                      disabled={loadingItems[item.itemId]}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>

                    <View style={styles.quantityTextContainer}>
                      {loadingItems[item.itemId] ? (
                        <ActivityIndicator size="small" color="#6b21a8" />
                      ) : (
                        <Text style={styles.quantityText}>
                          {cartItems[item.itemId]}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => handleIncrease(item)}
                      disabled={
                        loadingItems[item.itemId] ||
                        isLimitedStock[item.itemId] === "outOfStock" ||
                        cartItems[item.itemId] >= item.quantity
                      }
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAdd(item)}
                    disabled={loadingItems[item.itemId]}
                  >
                    {loadingItems[item.itemId] ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.addButtonText}>ADD</Text>
                    )}
                  </TouchableOpacity>
                )}

                {isLimitedStock[item.itemId] === "lowStock" && (
                  <Text style={styles.limitedStockText}>Limited Stock!</Text>
                )}
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 5,
    height: 45,
  },
  fullWidth: {
    width: "85%",
  },
  reducedWidth: {
    width: "80%",
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 45,
  },
  clearButton: {
    padding: 5,
  },
  filterButton: {
    backgroundColor: "#f0e6ff",
    height: 45,
    width: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 5,
  },
  cartIconContainer: {
    marginTop: 8,
    marginHorizontal: 8,
  },
  firstrow: {
    borderRadius: 20,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    paddingHorizontal: 15,
    flexDirection: "row",
  },
  categoryImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  imageContainer: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  discountBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#6b21a8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    zIndex: 1,
  },
  discountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemInfo: {
    paddingVertical: 8,
  },
  itemNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
    flex: 1,
  },
  weightContainer: {
    marginBottom: 5,
  },
  weightText: {
    fontSize: 12,
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b21a8",
  },
  mrpText: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
    marginLeft: 5,
  },
  outOfStockButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  outOfStockText: {
    color: "#888",
    fontWeight: "600",
    fontSize: 12,
  },
  addButton: {
    backgroundColor: "#6b21a8",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0e6ff",
    borderRadius: 5,
    paddingVertical: 2,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b21a8",
  },
  quantityTextContainer: {
    width: 30,
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b21a8",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    width: "80%",
  },
  limitedStockText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  footer: {
    height: 100,
    marginBottom:50
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    // paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "55%",
    position: "relative",
    // marginBottom:50
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
  },
  sortOptions: {
    marginBottom: 15,
  },
  sortOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  selectedSortOption: {
    backgroundColor: "#e9d5ff",
    borderColor: "#6b21a8",
    borderWidth: 1,
  },
  sortOptionText: {
    fontSize: 14,
  },
  rangeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  rangeText: {
    marginHorizontal: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  resetButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#6b21a8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  applyButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    padding: 5,
  },
});

export default UserDashboard;