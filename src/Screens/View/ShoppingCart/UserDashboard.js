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
  Modal,
  Animated,
  Easing,
  TouchableWithoutFeedback
} from "react-native";
import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import BASE_URL from "../../../../Config";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigationState } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LottieView from "lottie-react-native";
import GoogleAnalyticsService from "../../../Components/GoogleAnalytic";

const UserDashboard = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    route?.params?.category || "All CATEGORIES"
  );
  const navigation = useNavigation();
  const [loadingItems, setLoadingItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState({});
  const [cartData, setCartData] = useState([]);
  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [removalLoading, setRemovalLoading] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [weightRange, setWeightRange] = useState({ min: 0, max: 100 });
  const [sortOrder, setSortOrder] = useState("weightAsc");
  const [selectedWeightFilter, setSelectedWeightFilter] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [showOffer, setShowOffer] = useState(false);
  const [offerItems, setOfferItems] = useState();
  const [has5kgsOffer, setHas5kgsOffer] = useState(false);
  const [offeravail5kgs, setOfferavail5kgs] = useState(false);

  const scrollViewRef = useRef(null);

  const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;
  const scaleValue = new Animated.Value(1);

  useEffect(() => {
    if (showOffer) {
      Animated.timing(scaleValue, {
        toValue: 1, // Fully expanded
        duration: 500, // Animation duration
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [showOffer]);

  // Handle Item Actions
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
    }, 1000); // Reduced timeout for better UX
  };

  const handleRemove = async (item) => {
    setRemovalLoading((prevState) => ({ ...prevState, [item.itemId]: true }));
    await removeItem(item);
    setRemovalLoading((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  // Focus effect for fetching cart items
  useFocusEffect(
    useCallback(() => {
      if (userData) {
        fetchCartItems();
      }
      getAllCategories();
    }, [userData])
  );

  // Fetch cart items
  const fetchCartItems = async () => {
    if (!customerId || !token) return;
        console.log("Fetching cart items...");
    try {
      const response = await axios.get(
        `${BASE_URL}cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const cartData = response?.data?.customerCartResponseList || [];
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

      const has1kg = cartData.some((item) => item.weight === 1);
      const has5kg = cartData.some((item) => item.weight === 5);
      console.log("has1kg", has1kg);
      console.log("has5kg", has5kg);
      
      // Set state
      setCartData(cartData);
      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
      setCartCount(totalCartCount);

      // Show offer modals or handle logic
      if (has1kg ) {
         checkAndShowOneKgOfferModal(cartData);
      }
       if (has5kg) {
         checkAndShowFiveKgOfferModal(cartData);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error.response);
    }
  };

  // Handle image error
  const handleImageError = (itemId) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  // Check for 1kg offer
  const checkAndShowOneKgOfferModal = async (cartData) => {
    if (!cartData || cartData.length === 0) return;

    console.log("Checking for 1kg offer...");

    const oneKgBags = cartData.filter(
      (item) =>
        parseFloat(item.weight?.toString() || "0") === 1 &&
        item.cartQuantity < item.quantity
    );

    const has1kg = oneKgBags.length > 0;
    const anyOneKgHasTwoOrMore = oneKgBags.some(
      (item) => item.cartQuantity > 2
    );

    let offeravail = 0;

    try {
      const response = await axios.get(
        `${BASE_URL}cart-service/cart/oneKgOffer?customerId=${customerId}`
      );

      if (response.data) {
        offeravail = response.data.cartQuantity;
      }

      console.log("Offer availability:", offeravail);
      console.log("Any 1kg bag has quantity >= 2:", anyOneKgHasTwoOrMore);
      if (has1kg && !anyOneKgHasTwoOrMore && offeravail < 2) {
        const cheapestBag = oneKgBags.reduce((min, curr) =>
          parseFloat(curr.itemPrice) < parseFloat(min.itemPrice) ? curr : min
        );
        
        console.log(
          "cheapest bag",
          has1kg && !anyOneKgHasTwoOrMore && offeravail < 2
        );
        setOfferItems(cheapestBag);
        setShowOffer(true);
      }
    } catch (error) {
      console.error("Error checking 1kg offer:", error);
    }
  };

  const checkAndShowFiveKgOfferModal = async (cartData) => {
    if (!cartData || cartData.length === 0 || !customerId) return;

    console.log("Checking for 5kg offer...");

    const fiveKgBags = cartData.filter(
      (item) =>
        parseFloat(item.weight?.toString() || "0") === 5 &&
        item.cartQuantity < item.quantity
    );
    
    // console.log("fiveKgBags", fiveKgBags);
    
    const has5kg = fiveKgBags.length > 0;
    const alreadyAddedTwoOrMore = fiveKgBags.some(
      (item) => item.cartQuantity < 2
    );

    // console.log("alreadyAddedTwoOrMoreFiveKgs", alreadyAddedTwoOrMore);

    // console.log("has5kg", has5kg);

    if (!has5kg || !alreadyAddedTwoOrMore) return;

    try {
      // const offerKey = `used_5kg_offer_${customerId}`;
      console.log(`used_5kg_offer_${customerId}`);
      
   const response = await axios.get(
        `${BASE_URL}cart-service/cart/freeTicketsforCustomer?customerId=${customerId}`
      );
        console.log("offeravail5kgs", offeravail5kgs);
        const cheapestBag = fiveKgBags.reduce((min, curr) => {
          const currPrice = parseFloat(curr.itemPrice?.toString() || "0");
          const minPrice = parseFloat(min.itemPrice?.toString() || "0");
          return currPrice < minPrice ? curr : min;
        });
        
        if(response.data && response.data.freeTickets === null && alreadyAddedTwoOrMore && !offeravail5kgs){
          setOfferItems(cheapestBag);
          console.log("cheapest bag", cheapestBag);
          // Trigger modal
          setHas5kgsOffer(true); 
        }
    } catch (error) {
      console.error("Error checking 5kg offer:", error.response.data);
    }
  };

  // Add free 1kg bag to cart
  const addFreeOneKgBag = async (item) => {
    try {
      if(!customerId || !token){
        Alert.alert("Error", "Authentication required. Please login again.");
        return;
      }

      if(offerItems && offerItems.weight === 1){
      await axios.patch(
        `${BASE_URL}cart-service/cart/incrementCartData`,
        {
          customerId,
          itemId: offerItems.itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Alert.alert(
        "Success",
        `🎉 1+1 Offer applied! Free ${offerItems.itemName} added.`,
        [
          { text: "OK", onPress: () => setShowOffer(false) },
        ]
      );
      await fetchCartItems();
    }
    } catch (error) {
      console.error("Error applying free 1kg bag:", error);
      Alert.alert("Error", "Failed to add the free bag. Try again.");
    }
  };

  // Arrange categories with Sample Rice first
  const arrangeCategories = (categories) => {
    if (!categories || categories.length === 0) return [];

    const sampleRiceIndex = categories.findIndex(
      (cat) => cat.categoryName === "Sample Rice"
    );

    if (sampleRiceIndex !== -1) {
      const result = [...categories];
      const sampleRiceCategory = result.splice(sampleRiceIndex, 1)[0];
      return [sampleRiceCategory, ...result];
    }

    return categories;
  };

  // Parse weight for sorting
  const parseWeight = (weightStr) => {
    if (!weightStr) return 0;

    const numMatch = weightStr.toString().match(/(\d+(\.\d+)?)/);
    if (numMatch) {
      return parseFloat(numMatch[0]);
    }
    return 0;
  };

  // Sort items by various criteria
  const sortItems = (items, order) => {
    return [...items].sort((a, b) => {
      // Priority: in-stock items
      if (a.quantity > 0 && b.quantity === 0) return -1;
      if (a.quantity === 0 && b.quantity > 0) return 1;

      // Sort by selected order
      if (order === "weightAsc") {
        const weightA = parseWeight(a.weight);
        const weightB = parseWeight(b.weight);
        return weightA - weightB;
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

  // Apply filters and sorting
  const applyFiltersAndSort = (
    items,
    currentWeightFilter = selectedWeightFilter
  ) => {
    let filteredByWeight = items;

    // Apply weight filter if selected
    if (currentWeightFilter !== null) {
      filteredByWeight = items.filter((item) => {
        const itemWeight = parseWeight(item.weight);
        return Math.abs(itemWeight - currentWeightFilter) < 0.1;
      });
    }

    // Filter by price and weight range
    const filtered = filteredByWeight.filter((item) => {
      const itemPrice = parseFloat(item.itemPrice);
      const itemWeight = parseWeight(item.weight);
      return (
        itemPrice >= priceRange.min &&
        itemPrice <= priceRange.max &&
        itemWeight >= weightRange.min &&
        itemWeight <= weightRange.max
      );
    });

    // Sort the filtered items
    return sortItems(filtered, sortOrder);
  };

  // Add item to cart
  const handleAddToCart = async (item) => {
    if (!userData) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "Cancel" },
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }

    const data = { customerId: customerId, itemId: item.itemId };

    try {
      const response = await axios.post(
        `${BASE_URL}cart-service/cart/add_Items_ToCart`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.errorMessage === "Item added to cart successfully") {
        Alert.alert("Success", "Item added to cart successfully");
        await fetchCartItems();
      } else {
        Alert.alert("Alert", response.data.errorMessage);
      }
      GoogleAnalyticsService.viewItem(
        item.itemId,
        item.itemName,
        item.itemPrice,
      );
      GoogleAnalyticsService.addToCart(item.itemId, item.itemName, item.itemPrice, 1);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  };

  // Increment quantity in cart
  const incrementQuantity = async (item) => {
    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      await axios.patch(
        `${BASE_URL}cart-service/cart/incrementCartData`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchCartItems();
    } catch (error) {
      console.error("Error incrementing item quantity:", error);
      Alert.alert("Error", "Failed to update item quantity. Please try again.");
    }
  };

  // Remove item from cart
  const removeItem = async (item) => {
    const cartItem = cartData.find(
      (cartData) => cartData.itemId === item.itemId
    );

    if (!cartItem) {
      Alert.alert("Error", "Item is not found in the cart");
      return;
    }

    try {
      const response = await axios.delete(
        `${BASE_URL}cart-service/cart/remove`,
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

      if (response.status === 200) {
        const updatedCart = cartData.filter((c) => c.itemId !== item.itemId);
        setCartData([...updatedCart]);

        await fetchCartItems();

        if (updatedCart.length === 0) {
          setCartData([]);
          setCartItems({});
          setIsLimitedStock({});
          setCartCount(0);
        }
        Alert.alert("Success", response.data);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Error", "Failed to remove item. Please try again.");
    }
  };

  // Decrement quantity in cart
  const decrementQuantity = async (item) => {
    const newQuantity = cartItems[item.itemId];

    const cartItem = cartData.find(
      (cartData) => cartData.itemId === item.itemId
    );

    if (newQuantity === 1) {
      handleRemove(item);
    } else {
      const data = {
        customerId: customerId,
        itemId: item.itemId,
      };
      try {
        await axios.patch(
          `${BASE_URL}cart-service/cart/decrementCartData`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await fetchCartItems();
      } catch (error) {
        console.error("Error decrementing item quantity:", error);
        Alert.alert(
          "Error",
          "Failed to update item quantity. Please try again."
        );
      }
    }
  };

  // Get all categories and items
  const getAllCategories = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}product-service/showItemsForCustomrs`)
      .then((response) => {
        setCategories(response.data);

        // Get all items
        const items = response.data.flatMap(
          (category) => category.itemsResponseDtoList || []
        );

        setAllItems(items);

        if (selectedCategory === "All CATEGORIES") {
          setFilteredItems(sortItems(items, "weightAsc"));
        } else {
          const filtered = response.data
            .filter(
              (cat) =>
                cat.categoryName.trim().toLowerCase() ===
                selectedCategory.trim().toLowerCase()
            )
            .flatMap((cat) => cat.itemsResponseDtoList || []);

          setFilteredItems(sortItems(filtered, "weightAsc"));
        }

        setTimeout(() => {
          setLoading(false);

          setTimeout(() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({ x: 100, animated: true });
            }
          }, 100);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
        Alert.alert("Error", "Failed to fetch categories. Please try again.");
      });
  };

  // Filter by category
  const filterByCategory = (category) => {
    setSelectedCategory(category);
    setSelectedWeightFilter(null);

    if (category === "All CATEGORIES") {
      setFilteredItems(applyFiltersAndSort(allItems, null));
    } else {
      const filtered = categories
        .filter(
          (cat) =>
            cat.categoryName.trim().toLowerCase() ===
            category.trim().toLowerCase()
        )
        .flatMap((cat) => cat.itemsResponseDtoList || []);

      setFilteredItems(applyFiltersAndSort(filtered, null));
    }
  };

  // Filter by weight
  const filterByWeight = (weight) => {
    const newWeightFilter = selectedWeightFilter === weight ? null : weight;
    setSelectedWeightFilter(newWeightFilter);

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

    setFilteredItems(applyFiltersAndSort(itemsToFilter, newWeightFilter));
  };

  // Apply filters
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

    setFilteredItems(applyFiltersAndSort(itemsToFilter, selectedWeightFilter));
    setFilterModalVisible(false);
  };

  // Reset filters
  const resetFilters = () => {
    setPriceRange({ min: 0, max: 10000 });
    setWeightRange({ min: 0, max: 100 });
    setSortOrder("weightAsc");
    setSelectedWeightFilter(null);

    filterByCategory(selectedCategory);
    setFilterModalVisible(false);
  };

  // Filter items by search
  const filterItemsBySearch = (searchText) => {
    if (!searchText.trim()) {
      if (selectedCategory === "All CATEGORIES") {
        setFilteredItems(applyFiltersAndSort(allItems, selectedWeightFilter));
      } else {
        const filtered = categories
          .filter(
            (cat) =>
              cat.categoryName.trim().toLowerCase() ===
              selectedCategory.trim().toLowerCase()
          )
          .flatMap((cat) => cat.itemsResponseDtoList || []);
        setFilteredItems(applyFiltersAndSort(filtered, selectedWeightFilter));
      }
    } else {
      let normalizedSearchText = searchText.toLowerCase().trim();
      normalizedSearchText = normalizedSearchText
        .replace(/(\d+)(kgs|kg)/g, "$1 kgs")
        .replace(/\s+/g, " ");

      const searchWords = normalizedSearchText.split(" ");
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

      const searchResults = allItems.filter((item) => {
        const itemName = item.itemName.toLowerCase();
        const itemWeight = item.weight
          ? item.weight.toString().toLowerCase()
          : "";
        const itemUnits = item.units ? item.units.toLowerCase() : "";

        const combinedWeightUnit = `${itemWeight} ${itemUnits}`.trim();
        const normalizedItemName = itemName.replace(/(\d+)(kgs|kg)/g, "$1 kgs");

        const searchableText =
          `${normalizedItemName} ${itemWeight} ${itemUnits} ${combinedWeightUnit} ${packagingKeywords.join(
            " "
          )}`.trim();

        return searchWords.every((word) => searchableText.includes(word));
      });

      setFilteredItems(
        applyFiltersAndSort(searchResults, selectedWeightFilter)
      );
    }
  };

  // Clear search
  const handleClearText = () => {
    setSearchText("");
    if (selectedCategory === "All CATEGORIES") {
      setFilteredItems(applyFiltersAndSort(allItems, selectedWeightFilter));
    } else {
      const filtered = categories
        .filter(
          (cat) =>
            cat.categoryName.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
        )
        .flatMap((cat) => cat.itemsResponseDtoList || []);
      setFilteredItems(applyFiltersAndSort(filtered, selectedWeightFilter));
    }
  };

  // Get appropriate icon for item
  const getItemIcon = (item) => {
    const itemNameLower = item.itemName.toLowerCase();

    if (itemNameLower.includes("rice")) {
      return <MaterialIcons name="rice-bowl" size={20} color="#6b21a8" />;
    } else if (
      itemNameLower.includes("wheat") ||
      itemNameLower.includes("flour")
    ) {
      return <FontAwesome name="leaf" size={18} color="#6b21a8" />;
    } else if (itemNameLower.includes("oil")) {
      return <FontAwesome name="tint" size={18} color="#6b21a8" />;
    } else if (itemNameLower.includes("sugar")) {
      return <FontAwesome name="cube" size={18} color="#6b21a8" />;
    } else if (
      itemNameLower.includes("dal") ||
      itemNameLower.includes("lentil")
    ) {
      return <MaterialIcons name="food-bank" size={20} color="#6b21a8" />;
    } else {
      return <MaterialIcons name="shopping-bag" size={18} color="#6b21a8" />;
    }
  };



  // Render item
  // Updated renderItem function with improved layout structure
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Item Details", { item })}
      >
        <View style={styles.itemImageContainer}>
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

          {imageErrors[item.itemId] ? (
            <View style={styles.fallbackImageContainer}>
              <MaterialIcons
                name="image-not-supported"
                size={40}
                color="#aaa"
              />
              <Text style={styles.fallbackImageText}>{item.itemName}</Text>
            </View>
          ) : (
            <Image
              source={{
                uri: item.itemImage || "https://via.placeholder.com/150",
              }}
              style={styles.itemImage}
              resizeMode="contain"
              onError={() => handleImageError(item.itemId)}
            />
          )}

          {/* Stock indicator */}
          {item.quantity === 0 && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
          {item.quantity > 0 && item.quantity <= 5 && (
            <View style={styles.limitedStockBadge}>
              <Text style={styles.limitedStockText}>Limited Stock</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.itemDetailsContainer}>
        <View style={styles.itemInfoContainer}>
          <View style={styles.iconNameContainer}>
            {getItemIcon(item)}
            <Text style={styles.itemName} numberOfLines={2}>
              {item.itemName}
            </Text>
          </View>

          <Text style={styles.itemWeight}>
            Weight: {item.weight}{" "}
            {item.weight === 1 ? item.units.replace(/s$/, "") : item.units}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.itemPrice}>₹{item.itemPrice}</Text>
          {item.itemMrp > item.itemPrice && (
            <Text style={styles.itemMRP}>₹{item.itemMrp}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {item.quantity === 0 ? (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#D3D3D3" }]}
              disabled={true}
            >
              <Text style={styles.addButtonText}>Out of Stock</Text>
            </TouchableOpacity>
          ) : cartItems[item.itemId] ? (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => handleDecrease(item)}
                disabled={
                  loadingItems[item.itemId] || removalLoading[item.itemId]
                }
                style={[
                  styles.quantityButton,
                  {
                    backgroundColor:
                      loadingItems[item.itemId] || removalLoading[item.itemId]
                        ? "#CBD5E0"
                        : "#f87171",
                  },
                ]}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>

              <View style={styles.quantityTextContainer}>
                {loadingItems[item.itemId] || removalLoading[item.itemId] ? (
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
                  removalLoading[item.itemId] ||
                  cartItems[item.itemId] >= item.quantity
                }
                style={[
                  styles.quantityButton,
                  loadingItems[item.itemId] ||
                  removalLoading[item.itemId] ||
                  cartItems[item.itemId] >= item.quantity
                    ? {
                        backgroundColor: "#CBD5E0",
                      }
                    : {
                        backgroundColor: "#6b21a8",
                      },
                ]}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => handleAdd(item)}
              disabled={loadingItems[item.itemId]}
              style={styles.addButton}
            >
              {loadingItems[item.itemId] ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>Add to Cart</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const HandleOneKgOffer = () => {
    return (
       <Modal
              animationType="fade"
              transparent={true}
              visible={showOffer}
              onRequestClose={() => setShowOffer(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowOffer(false)}>
                <View style={oneKgModal.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={oneKgModal.offerModalContainer}>
                      <View style={oneKgModal.offerModalHeader}>
                        <Text style={oneKgModal.offerModalTitle}>🎁 Special Offer!</Text>
                        <TouchableOpacity
                          style={oneKgModal.closeButton}
                          onPress={() => setShowOffer(false)}
                        >
                          <MaterialIcons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                      </View>
                      
                      <View style={oneKgModal.offerModalBody}>
                        <Image
                          source={require("../../../../assets/offer.png")}
                          style={oneKgModal.offerImage}
                          resizeMode="contain"
                        />
                        
                        <Text style={oneKgModal.offerModalText}>
                        Buy 1kg and Get 1kg Absolutely FREE! 🛍
                        </Text>
                        <Text style={oneKgModal.noteText}><Text style={{fontWeight:"bold"}}>📍 Note:</Text>
                          The 1kg + 1kg Free Offer is valid only once per user and applies exclusively to 1kg rice bags.
                          This offer can only be redeemed once per address and is applicable on the first successful delivery only.
                          Once claimed, it cannot be reused. Grab it while it lasts!</Text>
                          <Text style={oneKgModal.noteText}>📍 గమనిక: 1+1 కేజీ రైస్ ఆఫర్ ఒకే చిరునామాకు ఒక్కసారి మాత్రమే — మొదటి విజయవంతమైన డెలివరీకి మాత్రమే వర్తిస్తుంది.
                        </Text>
                      </View>
                      
                      <View style={oneKgModal.offerModalFooter}>
                        <TouchableOpacity
                          style={[oneKgModal.offerModalButton, oneKgModal.offerCancelButton]}
                          onPress={() => setShowOffer(false)}
                        >
                          <Text style={oneKgModal.offerButtonTextCancel}>No, Thanks</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[oneKgModal.offerModalButton, oneKgModal.offerConfirmButton]}
                          onPress={async () => {
                                      setShowOffer(false);
                                      setOfferItems();
                                      addFreeOneKgBag();
                                    }}
                        >
                          <Text style={oneKgModal.offerButtonTextConfirm}>Claim Offer</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
    )
  }

  const HandleFreeTicketOffer = () => {
    return (
      <Modal
        visible={has5kgsOffer}
        transparent
        animationType="fade"
        onRequestClose={() => setHas5kgsOffer(false)}
        onDismiss={() => {
          scaleValue.setValue(100);
        }}
      >
        <View style={modalStyles.modalContainer} pointerEvents="auto">
          <Animated.View
            style={[
              modalStyles.modalContent,
              {
                transform: [{ scale: scaleValue }],
              },
            ]}
            pointerEvents="auto"
          >
            <Text style={modalStyles.offerTitle}>🎁 Special Offer!</Text>

            <Text style={modalStyles.offerText}>
              🎉 Congratulations! You're eligible for a{" "}
              <Text style={{ fontWeight: "bold" }}>Free PVR Movie Ticket</Text>{" "}
              to watch{" "}
              <Text style={{ fontWeight: "bold" }}>HIT: The Third Case</Text>{" "}
              with your purchase of a{" "}
              <Text style={{ fontWeight: "bold" }}>5KG rice bag</Text>!{"\n\n"}
              ✅ Offer valid only once per user{"\n"}
              🎟 Applicable exclusively on 5KG rice bags{"\n"}
              🚚 Redeemable on your first successful delivery only{"\n"}
              ❗ Once claimed, the offer cannot be reused{"\n\n"}
              🔥 Grab yours while it lasts — enjoy the movie on us!
            </Text>
            <TouchableOpacity
              style={modalStyles.okButton}
              onPress={async () => {
                setHas5kgsOffer(false);
                setOfferavail5kgs(true);
                setOfferItems();
              }}
            >
              <Text style={modalStyles.okButtonText}>Got it</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  };
  // Render loading state
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require("../../../../assets/AnimationLoading.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  // Footer component
  function footer() {
    return <View style={styles.footer} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchFilterRow}>
          <View
            style={[
              styles.searchContainer,
              !cartData || cartData.length === 0
                ? styles.fullWidth
                : styles.reducedWidth,
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

          {userData && cartCount > 0 && (
            <Pressable
              onPress={() => navigation.navigate("Home", { screen: "My Cart" })}
              style={styles.cartIconContainer}
            >
              <Icon name="cart-outline" size={32} color="#000" />

              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </Pressable>
          )}
        </View>

        {/* Weight Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.weightFilterContainer}
          contentContainerStyle={styles.weightFilterContent}
        >
          <TouchableOpacity
            style={[
              styles.weightFilterButton,
              selectedWeightFilter === 1 && styles.selectedWeightFilterButton,
            ]}
            onPress={() => filterByWeight(1)}
          >
            <Text
              style={
                selectedWeightFilter === 1
                  ? styles.selectedWeightFilterText
                  : styles.weightFilterText
              }
            >
              1kg
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.weightFilterButton,
              selectedWeightFilter === 5 && styles.selectedWeightFilterButton,
            ]}
            onPress={() => filterByWeight(5)}
          >
            <Text
              style={
                selectedWeightFilter === 5
                  ? styles.selectedWeightFilterText
                  : styles.weightFilterText
              }
            >
              5kg
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.weightFilterButton,
              selectedWeightFilter === 10 && styles.selectedWeightFilterButton,
            ]}
            onPress={() => filterByWeight(10)}
          >
            <Text
              style={
                selectedWeightFilter === 10
                  ? styles.selectedWeightFilterText
                  : styles.weightFilterText
              }
            >
              10kg
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.weightFilterButton,
              selectedWeightFilter === 26 && styles.selectedWeightFilterButton,
            ]}
            onPress={() => filterByWeight(26)}
          >
            <Text
              style={
                selectedWeightFilter === 26
                  ? styles.selectedWeightFilterText
                  : styles.weightFilterText
              }
            >
              26kg
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Category Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
        >
          <View style={styles.categoriesRow}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === "All CATEGORIES" &&
                  styles.selectedCategoryButton,
              ]}
              onPress={() => filterByCategory("All CATEGORIES")}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === "All CATEGORIES" &&
                    styles.selectedCategoryText,
                ]}
              >
                All Categories
              </Text>
            </TouchableOpacity>

            {arrangeCategories(categories).map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.categoryName &&
                    styles.selectedCategoryButton,
                ]}
                onPress={() => filterByCategory(category.categoryName)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.categoryName &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {category.categoryName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter & Sort</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Price Range</Text>
                <View style={styles.rangeContainer}>
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeLabel}>Min</Text>
                    <TextInput
                      style={styles.rangeInput}
                      value={priceRange.min.toString()}
                      onChangeText={(text) => setPriceRange({...priceRange, min: parseInt(text) || 0})}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeLabel}>Max</Text>
                    <TextInput
                      style={styles.rangeInput}
                      value={priceRange.max.toString()}
                      onChangeText={(text) => setPriceRange({...priceRange, max: parseInt(text) || 0})}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View> */}

            {/* <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Weight Range</Text>
                <View style={styles.rangeContainer}>
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeLabel}>Min</Text>
                    <TextInput
                      style={styles.rangeInput}
                      value={weightRange.min.toString()}
                      onChangeText={(text) => setWeightRange({...weightRange, min: parseFloat(text) || 0})}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.rangeInputContainer}>
                    <Text style={styles.rangeLabel}>Max</Text>
                    <TextInput
                      style={styles.rangeInput}
                      value={weightRange.max.toString()}
                      onChangeText={(text) => setWeightRange({...weightRange, max: parseFloat(text) || 0})}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View> */}

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.sortOptions}>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortOrder === "weightAsc" && styles.selectedSortOption,
                  ]}
                  onPress={() => setSortOrder("weightAsc")}
                >
                  <Text
                    style={
                      sortOrder === "weightAsc"
                        ? styles.selectedSortText
                        : styles.sortText
                    }
                  >
                    Weight (Low to High)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortOrder === "weightDesc" && styles.selectedSortOption,
                  ]}
                  onPress={() => setSortOrder("weightDesc")}
                >
                  <Text
                    style={
                      sortOrder === "weightDesc"
                        ? styles.selectedSortText
                        : styles.sortText
                    }
                  >
                    Weight (High to Low)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortOrder === "priceAsc" && styles.selectedSortOption,
                  ]}
                  onPress={() => setSortOrder("priceAsc")}
                >
                  <Text
                    style={
                      sortOrder === "priceAsc"
                        ? styles.selectedSortText
                        : styles.sortText
                    }
                  >
                    Price (Low to High)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortOrder === "priceDesc" && styles.selectedSortOption,
                  ]}
                  onPress={() => setSortOrder("priceDesc")}
                >
                  <Text
                    style={
                      sortOrder === "priceDesc"
                        ? styles.selectedSortText
                        : styles.sortText
                    }
                  >
                    Price (High to Low)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalButtons}>
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
          </View>
        </View>
      </Modal>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Icon name="search" size={60} color="#6b21a8" />
          <Text style={styles.noResultsText}>No items found</Text>
          <Text style={styles.noResultsSubText}>
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.itemId.toString()}
          numColumns={2}
          ListFooterComponent={footer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/*1kg + 1kg Offer Modal */}
      <HandleOneKgOffer />
      

      {/*Free movie ticket Offer Modal */}
      <HandleFreeTicketOffer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 42,
  },
  fullWidth: {
    flex: 0.9,
  },
  reducedWidth: {
    flex: 0.95,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  cartIconContainer: {
    marginLeft: 8,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#6b21a8",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  categoriesRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "#f3f4f6",
  },
  selectedCategoryButton: {
    backgroundColor: "#6b21a8",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#4b5563",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContainer: {
    padding: 8,
    paddingBottom: 100,
  },
  itemContainer: {
    flex: 0.5,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    overflow: "hidden",
    height: 320, // Fixed height for consistent card sizes
    width: (width - 40) / 2, // Calculate exact width for 2 columns with margins
  },
  itemImageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
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
  // Improved item details container with fixed layout
  itemDetailsContainer: {
    padding: 12,
    flex: 1,
    height: 180, // Fixed height for content area
    justifyContent: "flex-start", // Start from top instead of space-between
  },
  // New container for name and weight
  itemInfoContainer: {
    height: 80, // Fixed height for name and weight section
  },
  iconNameContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // Align to top
    marginBottom: 8,
    height: 40, // Fixed height for name area
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 6,
    flex: 1,
    lineHeight: 18, // Consistent line height
  },
  itemWeight: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
    marginLeft: 26, // Align with item name (icon width + left margin)
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    height: 24, // Fixed height for price area
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b21a8",
  },
  itemMRP: {
    fontSize: 14,
    color: "#9ca3af",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  // Fixed position button container at bottom
  buttonContainer: {
    height: 44,
    marginTop: "auto", // Push to bottom of container
    justifyContent: "center",
    width: "100%", // Ensure full width
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  addButton: {
    backgroundColor: "#6b21a8",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40, // Fixed height
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40, // Fixed height matching add button
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 16,
  },
  noResultsSubText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
  footer: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  rangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rangeInputContainer: {
    flex: 0.48,
  },
  rangeLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
  },
  rangeInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  sortOptions: {
    flexDirection: "column",
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
  },
  selectedSortOption: {
    backgroundColor: "#ddd6fe",
  },
  sortText: {
    fontSize: 14,
    color: "#4b5563",
  },
  selectedSortText: {
    fontSize: 14,
    color: "#6b21a8",
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  resetButton: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  resetButtonText: {
    fontSize: 16,
    color: "#4b5563",
    fontWeight: "600",
  },
  applyButton: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6b21a8",
  },
  applyButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  weightFilterContainer: {
    marginBottom: 10,
  },
  weightFilterContent: {
    paddingHorizontal: 5,
  },
  weightFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 5,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedWeightFilterButton: {
    backgroundColor: "#ddd6fe",
    borderColor: "#6b21a8",
  },
  weightFilterText: {
    fontSize: 14,
    color: "#4b5563",
  },
  selectedWeightFilterText: {
    fontSize: 14,
    color: "#6b21a8",
    fontWeight: "600",
  },
});

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 22,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  offerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 15,
    textAlign: "center",
  },
  offerText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    // textAlign: "center",
    color: "#333",
  },
  noteText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  okButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 5,
    elevation: 2,
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const oneKgModal = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  offerModalContainer: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
  },
  offerModalHeader: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  offerModalBody: {
    padding: 16,
    alignItems: "center",
  },
  offerImage: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 10,
  },
  offerModalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  offerModalFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },
  offerModalButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  offerCancelButton: {
    backgroundColor: "#f5f5f5",
  },
  offerConfirmButton: {
    backgroundColor: "#FFD700",
  },
  offerButtonTextCancel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  offerButtonTextConfirm: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

export default UserDashboard;
