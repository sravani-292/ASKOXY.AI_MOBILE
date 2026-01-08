import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import axios from "axios";
import debounce from "lodash.debounce";
import BASE_URL from "../../../../../Config";
import ProductCardSearch from "../../ShoppingCart/Search/ProductCardSearch";
import ViewCartButton from "../../ShoppingCart/Search/ViewCartButton";
import {
  handleCustomerCartData,
  handleUserAddorIncrementCart,
  handleDecrementorRemovalCart,
  handleGetProfileData,
} from "../../../../ApiService";
import { useCart } from "../../../../../until/CartCount";

const SearchScreen = ({ route }) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState(
    route.params?.initialSearch || ""
  );
  const [itemsToShow, setItemsToShow] = useState([]); // Combined state for all/search results
  const [loading, setLoading] = useState(true); // Start as true to show loader
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Cart states (unchanged)
  const [cartItems, setCartItems] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const [removalLoading, setRemovalLoading] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [cartData, setCartData] = useState([]);

  const { cartCount, setCartCount } = useCart();
  const userData = useSelector((state) => state.counter);
  const customerId = userData?.userId;

  // for fetching initial items
  const fetchInitialItems = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}product-service/showGroupItemsForCustomrs`
      );
      const items = response.data.flatMap((group) =>
        (group.categories || []).flatMap((cat) =>
          (cat.itemsResponseDtoList || []).map((item) => ({
            ...item,
            category: cat.categoryName,
            categoryType: group.categoryType,
          }))
        )
      );

      // SORT TO SHOW ASKOXY BRAND ITEMS FIRST
      const KEYWORD = "askoxy.ai";
      const sortedItems = [...items].sort((a, b) => {
        const aHas = (a.itemName || "").toLowerCase().includes(KEYWORD);
        const bHas = (b.itemName || "").toLowerCase().includes(KEYWORD);
        if (aHas && !bHas) return -1; // ASKOXY first
        if (!aHas && bHas) return 1; // ASKOXY first
        return 0; // keep original order for non-ASKOXY
      });

      setItemsToShow(sortedItems); // Now ASKOXY items appear first
      setInitialDataLoaded(true);
    } catch (error) {
      console.error("Initial items fetch error:", error);
      Alert.alert("Error", "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart items
  const fetchCartItems = async () => {
    if (!customerId) return;
    try {
      const response = await handleCustomerCartData(customerId);
      const cartData = response?.data?.customerCartResponseList;
      const totalCartCount =
        cartData?.reduce((total, item) => total + item.cartQuantity, 0) || 0;

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
          item.quantity === undefined ||
          item.status !== "ADD"
        ) {
          return acc;
        }
        acc[item.itemId] = item.cartQuantity;
        return acc;
      }, {});

      const limitedStockMap = cartData.reduce((acc, item) => {
        if (item.quantity === 0) acc[item.itemId] = "outOfStock";
        else if (item.quantity <= 5) acc[item.itemId] = "lowStock";
        return acc;
      }, {});

      setCartData(cartData);
      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
      setCartCount(totalCartCount);
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  // Dynamic search API call
  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      fetchInitialItems();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}product-service/dynamicSearch`,
        {
          params: { q: query },
        }
      );

      const items = response.data.items.flatMap((category) =>
        (category.itemsResponseDtoList || []).map((item) => ({
          ...item,
          category: category.categoryName,
        }))
      );
     console.log("search items",items);
     
      setItemsToShow(items);
    } catch (error) {
      console.error("Search API error:", error);
      Alert.alert("Search Error", "Failed to fetch results.");
      setItemsToShow([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((text) => fetchSearchResults(text), 300),
    []
  );

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleClearSearch = () => {
    setSearchText("");
    fetchInitialItems();
  };

  // Lifecycle
  useFocusEffect(
    useCallback(() => {
      fetchInitialItems();
      if (customerId) fetchCartItems();
    }, [customerId])
  );

  // Handlers 
  const handleItemPress = (item) =>
  navigation.navigate("Item Details", { item });
  const navigateToCart = () => navigation.navigate("My Cart");

 const handleAdd = async (item) => {
  setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));

  // Step 1: Check login
  if (!userData || !customerId) {
    Alert.alert("Alert", "Please login to continue", [
      { text: "Cancel" },
      { text: "OK", onPress: () => navigation.navigate("Login") },
    ]);
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    return;
  }

  // Step 2: Check profile completeness
  try {
    const profileResponse = await handleGetProfileData(customerId);
    const profile = profileResponse.data;
    
    // Adjust field names to match YOUR API
    const { firstName, mobileNumber } = profile || {};
    const isProfileComplete = !!(firstName && mobileNumber);
    
    if (!isProfileComplete) {
      Alert.alert(
        "Complete Your Profile",
        "Please fill your profile details to proceed.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Go to Profile", 
            onPress: () => {
              setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
              navigation.navigate("Profile Edit");
            }
          },
        ]
      );
      return;
    }
  } catch (error) {
    console.error("Profile check failed:", error);
    Alert.alert("Error", "Unable to verify profile. Please try again.");
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    return;
  }

  //  Step 3: Add to cart
  try {
    await handleUserAddorIncrementCart({ customerId, itemId: item.itemId });
    fetchCartItems();
  } catch (error) {
      Alert.alert("Error", "Failed to add item.");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };


  
  const handleIncrease = async (item) => {
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));
    try {
      await handleUserAddorIncrementCart({ customerId, itemId: item.itemId });
      fetchCartItems();
    } catch (error) {
      Alert.alert("Error", "Failed to update quantity.");
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const handleDecrease = async (item) => {
    setRemovalLoading((prev) => ({ ...prev, [item.itemId]: true }));
    try {
      await handleDecrementorRemovalCart({ customerId, itemId: item.itemId });
      fetchCartItems();
    } catch (error) {
      Alert.alert(
        "Failed",
        error.response?.data?.errorMessage || "An error occurred"
      );
    } finally {
      setRemovalLoading((prev) => ({ ...prev, [item.itemId]: false }));
    }
  };

  const handleImageError = (itemId) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  // Render item (list view only for search)
  const renderSearchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.searchItem}
      onPress={() => handleItemPress(item)}
    >
      <Image
        source={{ uri: item.itemImage }}
        style={styles.itemImage}
        onError={() => handleImageError(item.itemId)}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item }) => (
    <ProductCardSearch
      item={item}
      navigation={navigation}
      cartItems={cartItems}
      loadingItems={loadingItems}
      removalLoading={removalLoading}
      handleAdd={handleAdd}
      handleIncrease={handleIncrease}
      handleDecrease={handleDecrease}
      imageErrors={imageErrors}
      isLimitedStock={isLimitedStock}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color="#757575"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search for products..."
            placeholderTextColor="#757575"
            value={searchText}
            onChangeText={handleSearchTextChange}
            style={styles.input}
            returnKeyType="search"
            autoFocus={true}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
            >
              <MaterialIcons name="close" size={20} color="#757575" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {loading && !initialDataLoaded ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8e44ad" />
          </View>
        ) : itemsToShow.length > 0 ? (
          // In your render return block
          <FlatList
            key={searchText ? "list" : "grid"}
            data={itemsToShow}
            renderItem={searchText ? renderSearchItem : renderGridItem}
            keyExtractor={(item) => item.itemId}
            numColumns={searchText ? 1 : 2}
            contentContainerStyle={
              searchText ? styles.searchResults : styles.gridResults
            }
            columnWrapperStyle={searchText ? undefined : styles.gridRow}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="search-off" size={64} color="#d1d5db" />
            <Text style={styles.noResultsText}>No products found</Text>
          </View>
        )}
      </View>

      <ViewCartButton cartCount={cartCount} onPress={navigateToCart} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBackground: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 40,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  resultsContainer: {
    flex: 1,
  },
  searchResults: {
    paddingBottom: 80,
  },
  gridResults: {
    padding: 16,
    paddingBottom: 80,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: "#333",
  },
  itemCategory: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  promotionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  promotionText: {
    fontSize: 12,
    color: "#666",
  },
  shopNowButton: {
    backgroundColor: "#ff3f6c",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  shopNowText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#4b5563",
    textAlign: "center",
  },
  noResultsSubText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },

  showAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
    backgroundColor: "#f9f0ff",
  },
  showAllText: {
    fontSize: 14,
    color: "#8e44ad",
    marginLeft: 8,
  },
  showAllQuery: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#8e44ad",
    marginLeft: 4,
    marginRight: 4,
  },
});

export default SearchScreen;
