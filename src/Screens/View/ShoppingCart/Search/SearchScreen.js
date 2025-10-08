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
  Dimensions,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import BASE_URL from "../../../../../Config";
import axios from "axios";
// Import components
import ProductCardSearch from "../../ShoppingCart/Search/ProductCardSearch";
import ViewCartButton from "../../ShoppingCart/Search/ViewCartButton";
import {
  handleCustomerCartData,
  handleUserAddorIncrementCart,
  handleDecrementorRemovalCart,
} from "../../../../ApiService";
import { useCart } from "../../../../../until/CartCount";

const { width } = Dimensions.get("window");

const SearchScreen = ({ route }) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState(
    route.params?.initialSearch || ""
  );
  const [searchResults, setSearchResults] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const [removalLoading, setRemovalLoading] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [isLimitedStock, setIsLimitedStock] = useState({});
  const { cartCount, setCartCount } = useCart();
  const [recentSearches, setRecentSearches] = useState([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const [availableCategoryTypes, setAvailableCategoryTypes] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [cartData, setCartData] = useState([]);

  // Get user data from Redux store
  const userData = useSelector((state) => state.counter);
  const customerId = userData?.userId;

  useFocusEffect(
    useCallback(() => {
      fetchAllItems();
      if (customerId) {
        fetchCartItems();
      }
    }, [customerId])
  );

  useEffect(() => {
    performSearch();
    // Set search active state based on search text
    setIsSearchActive(searchText.trim().length > 0);
  }, [searchText, allItems]);

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}product-service/showGroupItemsForCustomrs`
      );

      const groupData = response?.data || [];

      // Extract unique category types
      const categoryTypes = [
        ...new Set(groupData.map((group) => group.categoryType)),
      ];
      setAvailableCategoryTypes(categoryTypes);

      // Extract all categories
      const categories = [];
      groupData.forEach((group) => {
        if (Array.isArray(group.categories)) {
          group.categories.forEach((category) => {
            if (category.categoryName) {
              categories.push({
                name: category.categoryName,
                categoryType: group.categoryType,
              });
            }
          });
        }
      });
      setAvailableCategories(categories);

      // Flatten all items across group -> categories -> items
      const items = groupData.flatMap((group) =>
        (group.categories || []).flatMap((category) =>
          (category.itemsResponseDtoList || []).map((item) => ({
            ...item,
            categoryType: group.categoryType,
            category: category.categoryName,
          }))
        )
      );

      setAllItems(items);
      setSearchResults(items); 

      // Detect stock status
      const limitedStockMap = {};
      items.forEach((item) => {
        if (item.quantity === 0) {
          limitedStockMap[item.itemId] = "outOfStock";
        } else if (item.quantity <= 5) {
          limitedStockMap[item.itemId] = "lowStock";
        }
      });
      setIsLimitedStock(limitedStockMap);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert("Error", "Failed to fetch items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    console.log("into the fetchCartItems function");

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
        if (item.quantity === 0) {
          acc[item.itemId] = "outOfStock";
        } else if (item.quantity <= 5) {
          acc[item.itemId] = "lowStock";
        }
        return acc;
      }, {});

      setCartData(cartData);
      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
      setCartCount(totalCartCount);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Option 1: Search items that START with the typed text

  // Advanced search with fuzzy matching for wrong spellings
  const performSearch = () => {
    if (!allItems || allItems.length === 0) return;

    if (!searchText.trim()) {
      // Show all items when search is empty
      setSearchResults(allItems);
      setShowAllResults(false);
      return;
    }

    const searchTerm = searchText.toLowerCase();

    // Helper function to calculate Levenshtein distance
    const levenshteinDistance = (str1, str2) => {
      const matrix = [];

      for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
      }

      for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
      }

      for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }

      return matrix[str2.length][str1.length];
    };

    // Helper function to check if words are similar (fuzzy match)
    const isSimilar = (word1, word2) => {
      const minLength = Math.min(word1.length, word2.length);
      const maxLength = Math.max(word1.length, word2.length);

      // For short words, be more strict
      if (minLength <= 3) {
        return levenshteinDistance(word1, word2) <= 1;
      }

      // For longer words, allow more flexibility
      const allowedDistance = Math.floor(maxLength * 0.3); // 30% error tolerance
      return levenshteinDistance(word1, word2) <= allowedDistance;
    };

    const filtered = allItems.filter((item) => {
      const itemName = item.itemName?.toLowerCase() || "";
      const category = item.category?.toLowerCase() || "";

      const nameWords = itemName.split(" ");
      const categoryWords = category.split(" ");
      const allWords = [...nameWords, ...categoryWords];

      // 1. Exact word start match (highest priority)
      const exactStartMatch = allWords.some((word) =>
        word.startsWith(searchTerm)
      );

      // 2. Contains match (medium priority)
      const containsMatch = allWords.some((word) => word.includes(searchTerm));

      // 3. Fuzzy match for similar spellings (lowest priority)
      const fuzzyMatch = allWords.some((word) => {
        // Only do fuzzy matching for words that are reasonably close in length
        if (Math.abs(word.length - searchTerm.length) > 3) return false;
        return isSimilar(word, searchTerm);
      });

      return exactStartMatch || containsMatch || fuzzyMatch;
    });

    // Sort results by relevance (exact matches first, then fuzzy matches)
    const sortedResults = filtered.sort((a, b) => {
      const aName = a.itemName?.toLowerCase() || "";
      const bName = b.itemName?.toLowerCase() || "";
      const aWords = aName.split(" ");
      const bWords = bName.split(" ");

      // Check exact start matches
      const aExactStart = aWords.some((word) => word.startsWith(searchTerm));
      const bExactStart = bWords.some((word) => word.startsWith(searchTerm));

      if (aExactStart && !bExactStart) return -1;
      if (!aExactStart && bExactStart) return 1;

      // Check contains matches
      const aContains = aWords.some((word) => word.includes(searchTerm));
      const bContains = bWords.some((word) => word.includes(searchTerm));

      if (aContains && !bContains) return -1;
      if (!aContains && bContains) return 1;

      return 0;
    });

    setSearchResults(sortedResults);
    setShowAllResults(sortedResults.length > 0);
  };

  const handleItemPress = (item) => {
  
    navigation.navigate("Item Details", { item });
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearchResults(allItems);
    setShowAllResults(false);
    setIsSearchActive(false);
  };

  const navigateToCart = () => {
    navigation.navigate( "My Cart" );
  };

  const handleAdd = async (item) => {
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));

    if (!userData) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "Cancel" },
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }

    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };

     try {
         // Add item to cart
         const response = await handleUserAddorIncrementCart(data);
         Alert.alert(
           "Success",
           response.cartResponse.errorMessage || "Item added to cart"
         );
         fetchCartItems();
   
         // Fetch active and eligible offers
         const [activeRes, eligibleRes] = await Promise.all([
           fetch(`${BASE_URL}cart-service/cart/activeOffers`),
           fetch(`${BASE_URL}cart-service/cart/userEligibleOffer/${customerId}`),
         ]);
   
         const activeOffers = await activeRes.json();
         const userEligibleOffers = await eligibleRes.json();
         console.log("active offers",activeOffers);
         console.log("user eligible offers",userEligibleOffers);
         
         // Filter only active offers
         const validActiveOffers = activeOffers.filter((offer) => offer.active);
         if (!validActiveOffers.length) return;
   
         // Extract used offer weights and names
         const usedOfferWeights = userEligibleOffers
           .filter((o) => o.eligible)
           .map((o) => o.weight);
         const usedOfferNames = userEligibleOffers
           .filter((o) => o.eligible)
           .map((o) => o.offerName);
   
         const itemWeight = item.weight;
         const units = item.units;
         let alertShown = false;
   
         // Check if user has already used an offer for this weight
         const hasUsedOfferForWeight = usedOfferWeights.includes(itemWeight);
   
         // 1️⃣ Check for already used offer for the same weight (non-container offers)
         if (hasUsedOfferForWeight && itemWeight !== 10 && itemWeight !== 26) {
           const usedOffer = userEligibleOffers.find(
             (o) => o.eligible && o.weight === itemWeight
           );
           if (usedOffer) {
              alertShown = true;
           }
         }
   
         // 2️⃣ Container Offer (10kg or 26kg, only one per user)
     if (!alertShown && (itemWeight === 10 || itemWeight === 26) && units === "kgs") {        // Check if user has already used a container offer (10kg or 26kg)
           const hasUsedContainer = userEligibleOffers.some(
             (uo) =>
               uo.eligible &&
               (uo.weight === 10 || uo.weight === 26 )
           );
           if (hasUsedContainer) {
           
             alertShown = true;
           } else {
             const matchedContainerOffer = validActiveOffers.find(
               (offer) =>
                 offer.minQtyKg === itemWeight && units == "kgs" &&
                 (offer.minQtyKg === 10 || offer.minQtyKg === 26) &&
                 !usedOfferNames.includes(offer.offerName)
             );
   
             if (matchedContainerOffer) {
               setTimeout(() => {
                 Alert.alert(
                   "Container Offer",
                   `${matchedContainerOffer.offerName} FREE! `
                 //  ` Buy ${matchedContainerOffer.minQtyKg}kg and get a ${matchedContainerOffer.freeItemName} free.`
                 );
               }, 1000);
               alertShown = true;
             }
           }
         }
   
         // 3️⃣ Special Offer (2+1 for 1kg or 5+2 for 5kg)
         if (!alertShown && (itemWeight === 1 || itemWeight === 5)) {
           const matchedSpecialOffer = validActiveOffers.find(
             (offer) =>
               offer.minQtyKg === itemWeight &&
               (offer.minQtyKg === 1 || offer.minQtyKg === 5) &&
               !usedOfferNames.includes(offer.offerName) &&
               offer.freeItemName.toLowerCase() === item.itemName.toLowerCase()
           );
   
           if (matchedSpecialOffer) {
             // console.log("Matched Special Offer:", matchedSpecialOffer);
             setTimeout(() => {
               Alert.alert(
                 "Special Offer",
                 `${matchedSpecialOffer.offerName} is active!` 
               );
             }, 1000);
             alertShown = true;
           }
         }
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));

       } catch (error) {
         console.error("Add to cart error", error);
         Alert.alert("Error", "Failed to add item to cart. Please try again.");
       }
  };

  const handleIncrease = async (item) => {
    setLoadingItems((prev) => ({ ...prev, [item.itemId]: true }));

    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await handleUserAddorIncrementCart(data);
      // Alert.alert("Success", response.data.errorMessage);
      await fetchCartItems();
      setLoadingItems((prev) => ({ ...prev, [item.itemId]: false }));
    } catch (error) {
      Alert.alert("Error", "Failed to update quantity. Please try again.");
    }
  };

  const handleDecrease = async (item) => {
    setRemovalLoading((prev) => ({ ...prev, [item.itemId]: true }));

    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await handleDecrementorRemovalCart(data);
      // Alert.alert("Success", response.data.errorMessage);
      await fetchCartItems();
      setRemovalLoading((prev) => ({ ...prev, [item.itemId]: false }));
    } catch (error) {
      Alert.alert(
        "Failed",
        error.response?.data?.errorMessage || "An error occurred"
      );
      fetchCartItems();
    }
  };

  const handleImageError = (itemId) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  // Render item for search results (list view)
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
        {item.promotion ? (
          <View style={styles.promotionContainer}>
            <Text style={styles.promotionText}>{item.promotion}</Text>
            <TouchableOpacity
              style={styles.shopNowButton}
              onPress={() => handleItemPress(item)}
            >
              <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  // Render item for grid view (default view)
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

  const renderShowAllButton = () => {
    if (searchResults.length > 0 && searchText.trim() && !showAllResults) {
      return (
        <TouchableOpacity
          style={styles.showAllButton}
          onPress={() => setShowAllResults(true)}
        >
          <MaterialIcons name="search" size={20} color="#8e44ad" />
          <Text style={styles.showAllText}>Show all results for</Text>
          <Text style={styles.showAllQuery}>"{searchText}"</Text>
          <MaterialIcons name="chevron-right" size={20} color="#8e44ad" />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="light-content" />

      {/* Header with purple background */}
      <View style={styles.headerBackground}>
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
              onChangeText={setSearchText}
              style={styles.input}
              returnKeyType="search"
              clearButtonMode="never"
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
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8e44ad" />
          </View>
        ) : searchResults.length > 0 ? (
          isSearchActive ? (
            // List view for search results
            <FlatList
              key="list"
              data={searchResults}
              renderItem={renderSearchItem}
              keyExtractor={(item) => item.itemId.toString()}
              contentContainerStyle={styles.searchResults}
              ListFooterComponent={renderShowAllButton}
            />
          ) : (
            // Grid view for default display (2 items per row)
            <FlatList
              key="grid"
              data={searchResults}
              renderItem={renderGridItem}
              keyExtractor={(item) => item.itemId.toString()}
              numColumns={2}
              contentContainerStyle={styles.gridResults}
              columnWrapperStyle={styles.gridRow}
            />
          )
        ) : (
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="search-off" size={64} color="#d1d5db" />
            <Text style={styles.noResultsText}>No items found</Text>
            <Text style={styles.noResultsSubText}>
              Try searching with different keywords
            </Text>
          </View>
        )}
      </View>

      {/* View Cart Button */}
      <ViewCartButton cartCount={cartCount} onPress={navigateToCart} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBackground: {
    // backgroundColor: "#ecb01e",
  },
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
    // borderWidth:2
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
