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
  BackHandler,
  RefreshControl,
  Modal,
  Platform,
  Animated,
  Easing,
  TouchableWithoutFeedback,
} from "react-native";
import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
import GoogleAnalyticsService from "../../../Components/GoogleAnalytic";
import {
  handleCustomerCartData,
  handleUserAddorIncrementCart,
  handleDecrementorRemovalCart,
} from "../../../../src/ApiService";
import { useCart } from "../../../../until/CartCount";
// import GoldDetailModal from "./GoldDetailedModal";
const UserDashboard = ({ route }) => {
  // console.log("UserDashboard route params:", route.params.categoryType);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    route?.params?.category || "All CATEGORIES"
  );
  const [offerWeight, setOfferWeight] = useState(route?.params?.offerId || 1);
  const navigation = useNavigation();
  const [loadingItems, setLoadingItems] = useState({});
  const { cartCount, setCartCount } = useCart();
  const [cartItems, setCartItems] = useState({});
  const [cartData, setCartData] = useState([]);

  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [removalLoading, setRemovalLoading] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [user, setUser] = useState();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [weightRange, setWeightRange] = useState({ min: 0, max: 100 });
  const [sortOrder, setSortOrder] = useState("weightAsc");
  const [showOffer, setShowOffer] = useState(false);
  const [selectedWeightFilter, setSelectedWeightFilter] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const scrollViewRef = useRef(null);

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
    }, 3000);
  };

  const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;

  useFocusEffect(
    useCallback(() => {
      if (userData) {
        fetchCartItems();
      }

      getAllCategories();
      // console.log(route?.params?.category);
    }, [userData])
  );

  const onRefresh = () => {
    getAllCategories();
  };

  const fetchCartItems = async () => {
    try {
      const response = await handleCustomerCartData(customerId);

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
          item.quantity === undefined ||
          item.status != "ADD"
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
      await checkAndShowOneKgOfferModal();

      setLoadingItems((prevState) => ({
        ...prevState,
        [cartData.itemId]: false,
      }));
    } catch (error) {
      console.error("Error fetching cart items:", error.response.status);
    }
  };

  const checkAndShowOneKgOfferModal = async () => {
    const oneKgBags = cartData.filter(
      (item) =>
        parseFloat(item.weight?.toString() || "0") === 1 &&
        item.cartQuantity < item.quantity
    );

    const has1kg = oneKgBags.length > 0;
    const anyOneKgHasTwoOrMore = oneKgBags.some(
      (item) => item.cartQuantity >= 2
    );

    let offeravail = 0;

    try {
      const response = await axios.get(
        `${BASE_URL}cart-service/cart/oneKgOffer?customerId=${customerId}`
      );

      if (response.data) {
        offeravail = response.data.cartQuantity;
      }

      if (has1kg && !anyOneKgHasTwoOrMore && offeravail < 2) {
        const cheapestBag = oneKgBags.reduce((min, curr) =>
          parseFloat(curr.itemPrice) < parseFloat(min.itemPrice) ? curr : min
        );
      }
    } catch (error) {
      console.error("Error checking 1kg offer:", error);
    }
  };

  const arrangeCategories = (allCategoryGroups) => {
    const { category, categoryType } = route.params;

    console.log("from routes category:", category);
    console.log("from routes categoryType:", categoryType);

    if (!Array.isArray(allCategoryGroups) || allCategoryGroups.length === 0)
      return [];

    const matchedGroup = allCategoryGroups.find(
      (group) =>
        group.categoryType?.trim().toLowerCase() ===
        categoryType?.trim().toLowerCase()
    );

    const matchedItems = matchedGroup?.categories?.find(
      (cat) =>
        cat.categoryName?.trim().toLowerCase() ===
        category?.trim().toLowerCase()
    );

    if (!matchedGroup || !Array.isArray(matchedGroup.categories)) return [];

    let categories = [...matchedGroup.categories];

    const sampleRiceIndex = categories.findIndex(
      (cat) => cat.categoryName === "Sample Rice"
    );

    if (sampleRiceIndex !== -1) {
      const sampleRice = categories.splice(sampleRiceIndex, 1)[0];
      return [sampleRice, ...categories];
    }

    return categories;
  };

  const parseWeight = (weightStr) => {
    if (!weightStr) return 0;

    const numMatch = weightStr.toString().match(/(\d+(\.\d+)?)/);
    if (numMatch) {
      return parseFloat(numMatch[0]);
    }
    return 0;
  };

  // Sort items by weight in ascending order (changed from descending)
  const sortItems = (items, order) => {
    console.log("sort items", items);

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


  
useEffect(() => {
  if (selectedCategory?.includes("Cashew nuts")) {
    const timer = setTimeout(() => {
      Alert.alert(
        "🎉 Hurray!",
        "Get upto ₹40 cashback on your first Cashew nuts purchase!",
        [{ text: "Great!", style: "default" }]
      );
    }, 1300); // Delay by 500ms

    return () => clearTimeout(timer);
  }
}, [selectedCategory]);
  // Apply all filters and sorting
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
      console.log("item", item);

      const itemPrice = parseFloat(item.itemPrice);
      const itemWeight = parseWeight(item.weight);
      return (
        itemPrice >= priceRange.min &&
        itemPrice <= priceRange.max &&
        itemWeight >= weightRange.min &&
        itemWeight <= weightRange.max
      );
    });

    console.log({ filtered });

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

    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };

    try {
      // Add item to cart
      const response = await handleUserAddorIncrementCart(data);
      Alert.alert(
        "Success",
        response.data.errorMessage || "Item added to cart"
      );
      fetchCartItems();

      // Fetch active and eligible offers
      const [activeRes, eligibleRes] = await Promise.all([
        fetch(`${BASE_URL}cart-service/cart/activeOffers`),
        fetch(`${BASE_URL}cart-service/cart/userEligibleOffer/${customerId}`),
      ]);

      const activeOffers = await activeRes.json();
      const userEligibleOffers = await eligibleRes.json();
      console.log("active offers", activeOffers);
      console.log("user eligible offers", userEligibleOffers);

      // Filter only active offers
      const validActiveOffers = activeOffers.filter((offer) => offer.active);
      if (!validActiveOffers.length) return;
      console.log("valid active ", validActiveOffers);

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
          setTimeout(() => {
            // Alert.alert(
            //   "Offer Already Availed",
            //   `You have already availed the ${usedOffer.offerName} for ${itemWeight}kg.`
            // );
          }, 1000);

          alertShown = true;
        }
      }

      // 2️⃣ Container Offer (10kg or 26kg, only one per user)
      if (
        !alertShown &&
        (itemWeight === 10 || itemWeight === 26) &&
        units === "kgs"
      ) {
        // Check if user has already used a container offer (10kg or 26kg)
        console.log("user eligible offers", userEligibleOffers);

        const hasUsedContainer = userEligibleOffers.some(
          (uo) => uo.eligible && (uo.weight === 10 || uo.weight === 26)
        );
        console.log("has used container", hasUsedContainer);

        if (hasUsedContainer) {
          setTimeout(() => {
            // Alert.alert(
            //   "Container Offer Already Availed",
            //   "You have already availed a container offer. Only one container offer (10kg or 26kg) can be used."
            // );
          }, 1000);
          alertShown = true;
        } else {
          const matchedContainerOffer = validActiveOffers.find(
            (offer) =>
              offer.minQtyKg === itemWeight &&
              units == "kgs" &&
              (offer.minQtyKg === 10 || offer.minQtyKg === 26) &&
              !usedOfferNames.includes(offer.offerName)
          );

          if (matchedContainerOffer) {
            setTimeout(() => {
              Alert.alert(
                "Container Offer",
                `${matchedContainerOffer.offerName} FREE! `
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
            offer.freeItemName.toLowerCase() === item.itemName.toLowerCase() &&
            offer.freeItemId === item.itemId
        );
       console.log("matched special offer",matchedSpecialOffer);
       
        if (matchedSpecialOffer) {
          setTimeout(() => {
            Alert.alert(
              "Special Offer",
              `${matchedSpecialOffer.offerName} is active!.` 
              // Buy ${matchedSpecialOffer.minQty} bag(s) of ${matchedSpecialOffer.minQtyKg}kg and get ${matchedSpecialOffer.freeQty}kg free
            );
          }, 1000);
          alertShown = true;
        }
      }
    } catch (error) {
      console.error("Add to cart error", error.response);
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  };

  const incrementQuantity = async (item) => {
    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await handleUserAddorIncrementCart(data);
      Alert.alert("Success", response.data.errorMessage);
      await fetchCartItems();
    } catch (error) {}
  };

  const decrementQuantity = async (item) => {
    const newQuantity = cartItems[item.itemId];

    const cartItem = cartData.find(
      (cartData) => cartData.itemId === item.itemId
    );
    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await handleDecrementorRemovalCart(data);
      Alert.alert("Success", response.data.errorMessage);
      fetchCartItems();
    } catch (error) {
      Alert.alert("Failed", error.response.data.errorMessage);
      fetchCartItems();
    }
  };

  

  const getAllCategories = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}product-service/showGroupItemsForCustomrs`)
      .then((response) => {
        setCategories(response.data);

        console.log("categoryType", route.params.categoryType);
        const categoryType = route?.params?.categoryType;

        const items = response.data
          .filter(
            (group) =>
              group.categoryType?.toLowerCase() === categoryType?.toLowerCase()
          )
          .flatMap(
            (group) =>
              group.categories?.flatMap(
                (cat) => cat.itemsResponseDtoList || []
              ) || []
          );

        setAllItems(items);

        if (route.params.category) {
          const weight = route.params.offerId;
          const finalWeightFilter =
            selectedWeightFilter === weight ? null : weight;

          setSelectedWeightFilter(finalWeightFilter);

          let itemsToFilter = [];

          if (selectedCategory === "All CATEGORIES") {
            itemsToFilter = items;
          } else {
            itemsToFilter = response.data
              .flatMap((group) => group.categories || [])
              .filter(
                (cat) =>
                  cat.categoryName?.trim().toLowerCase() ===
                  route.params.category?.trim().toLowerCase()
              )
              .flatMap((cat) => cat.itemsResponseDtoList || []);
          }

          setFilteredItems(
            itemsToFilter
            // applyFiltersAndSort(itemsToFilter, finalWeightFilter)
          );
        } else {
          if (selectedCategory === "All CATEGORIES") {
            setFilteredItems(sortItems(items, "weightAsc"));
          } else {
            const filtered = response.data
              .filter(
                (cat) =>
                  cat.categoryName?.trim().toLowerCase() ===
                  selectedCategory?.trim().toLowerCase()
              )
              .flatMap((cat) => cat.itemsResponseDtoList || []);

            setFilteredItems(sortItems(filtered, "weightAsc"));
          }
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

  const filterByCategory = (category) => {
    console.log("into the filter by category function");
    console.log("filtering by category:", category);

    const flattenedCategories = categories.flatMap(
      (wrapper) => wrapper.categories || []
    );
    setSelectedCategory(category);

    console.log("Available categories:");
    flattenedCategories.forEach((cat) =>
      console.log(" -", cat.categoryName?.trim().toLowerCase())
    );
    console.log("Matching against:", category?.trim().toLowerCase());

    const matchedCategory = flattenedCategories.find(
      (cat) =>
        cat.categoryName?.trim().toLowerCase() ===
        category?.trim().toLowerCase()
    );

    console.log("Matched Category: ", matchedCategory);

    if (category === "All CATEGORIES") {
      setFilteredItems(
        allItems
        // applyFiltersAndSort(allItems, null)
      );
    } else {
      const filtered = matchedCategory?.itemsResponseDtoList || [];
      // console.log("Filtered Items: ", filtered);
      setFilteredItems(filtered);
    }
  };

  // Filter by weight
  const filterByWeight = (weight) => {
    console.log(" item weight", weight);

    let finalWeightFilter = selectedWeightFilter === weight ? null : weight;
    setSelectedWeightFilter(finalWeightFilter);
    console.log("final weight filter", finalWeightFilter);

    let itemsToFilter = [];

    if (selectedCategory === "All CATEGORIES") {
      itemsToFilter = allItems;
    } else {
      console.log(
        "All available categories:",
        JSON.stringify(categories, null, 2)
      );
      console.log("selected category", selectedCategory);

      const allCategories = categories.flatMap(
        (group) => group.categories || []
      );

      const matchedCategories = allCategories.filter(
        (cat) =>
          cat.categoryName?.trim().toLowerCase() ===
          selectedCategory?.trim().toLowerCase()
      );

      console.log(
        "Matched categories:",
        matchedCategories.map((cat) => cat.categoryName)
      );

      itemsToFilter = matchedCategories.flatMap(
        (cat) => cat.itemsResponseDtoList || []
      );
    }

    // Apply filters
    setFilteredItems(applyFiltersAndSort(itemsToFilter, finalWeightFilter));
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
            cat.categoryName?.trim().toLowerCase() ===
            selectedCategory?.trim().toLowerCase()
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

  const handleGoldItemPress = (itemId) => {
    setSelectedItemId(itemId);
    setModalVisible(true);
  };

  const filterItemsBySearch = (searchText) => {
    const categoryType = route.params?.categoryType;
    console.log("selected category from search:", selectedCategory);
    console.log("from routes categoryType:", categoryType);

    const isAllCategories = selectedCategory === "All CATEGORIES";
    const normalizedSearchText = searchText?.toLowerCase().trim() || "";

    const normalizeWeightText = (text) =>
      text.replace(/(\d+)\s*(kg|kgs)/g, "$1 kgs").replace(/\s+/g, " ");

    const searchWords = normalizeWeightText(normalizedSearchText).split(" ");
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

    // ✅ Step 1: Find group by categoryType (e.g., "GOLD", "RICE", etc.)
    const matchedGroup = categories.find(
      (group) =>
        group.categoryType?.trim().toLowerCase() ===
        categoryType?.trim().toLowerCase()
    );

    if (!matchedGroup) {
      console.warn("No group matched for categoryType:", categoryType);
      setFilteredItems([]);
      return;
    }

    // ✅ Step 2: Narrow down by selectedCategory inside that group
    const itemsFromSelectedCategory = matchedGroup.categories
      ?.filter((cat) =>
        isAllCategories
          ? true
          : cat.categoryName?.trim().toLowerCase() ===
            selectedCategory?.trim().toLowerCase()
      )
      ?.flatMap((cat) => cat.itemsResponseDtoList || []);
    console.log(itemsFromSelectedCategory);

    // ✅ Step 3: If search is empty, just return all items
    if (!normalizedSearchText) {
      const filtered = applyFiltersAndSort(
        itemsFromSelectedCategory,
        selectedWeightFilter
      );
      setFilteredItems(filtered);
      return;
    }

    // ✅ Step 4: Apply search filtering logic
    const filteredBySearch = itemsFromSelectedCategory.filter((item) => {
      const itemName = normalizeWeightText(item?.itemName?.toLowerCase() || "");
      const weight = item?.weight?.toString().toLowerCase() || "";
      const units = item?.units?.toLowerCase() || "";
      const combinedWeight = `${weight} ${units}`.trim();

      const searchableText = `${itemName} ${weight} ${units} ${combinedWeight} ${packagingKeywords.join(
        " "
      )}`;

      return searchWords.every((word) => searchableText.includes(word));
    });

    setFilteredItems(filteredBySearch);
  };

  const handleClearText = () => {
    const categoryType = route.params?.categoryType;
    console.log("categoryType:", categoryType);

    setSearchText("");

    const isAllCategories =
      selectedCategory?.trim().toLowerCase() === "all categories";

    const matchedGroup = categories.find(
      (group) =>
        group.categoryType?.trim().toLowerCase() ===
        categoryType?.trim().toLowerCase()
    );

    console.log("matchedGroup:", matchedGroup);

    if (!matchedGroup || !matchedGroup.categories) {
      setFilteredItems([]);
      return;
    }

    // Show all items in that categoryType (GOLD, KOLAM, etc.)
    const items = matchedGroup.categories
      .filter((cat) =>
        isAllCategories
          ? true // return all items under categoryType
          : cat.categoryName?.trim().toLowerCase() ===
            selectedCategory?.trim().toLowerCase()
      )
      .flatMap((cat) => cat.itemsResponseDtoList || []);

    console.log("items after clear:", items);
    setFilteredItems(items)
    // setFilteredItems(applyFiltersAndSort(items, selectedWeightFilter));
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
              // onError={() => handleImageError(item.itemId)}
            />
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
          {/* {route.params?.categoryType == "GOLD" && (
            <TouchableOpacity onPress={() => handleGoldItemPress(item.itemId)}>
              <Text style={{ textAlign: "center" }}>View Details</Text>
            </TouchableOpacity>
          )} */}
        </View>
      </View>
      {/* Gold Detail Modal */}
      {/* <GoldDetailModal
        visible={modalVisible}
        itemId={selectedItemId}
        onClose={() => setModalVisible(false)}
      /> */}
    </View>
  );

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
                console.log("User is typing:", text);
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
          {/* <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Icon name="filter" size={24} color="#6b21a8" />
          </TouchableOpacity> */}

          {userData && cartCount > 0 && (
            <Pressable
              onPress={() => navigation.navigate("My Cart")}
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
        {route.params?.categoryType == "RICE" && (
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
                selectedWeightFilter === 10 &&
                  styles.selectedWeightFilterButton,
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
                selectedWeightFilter === 26 &&
                  styles.selectedWeightFilterButton,
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
        )}
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
          key={selectedCategory}
          data={filteredItems}
          extraData={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.itemId.toString()}
          numColumns={2}
          ListFooterComponent={footer}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    height: 320,
    width: (width - 40) / 2,
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
    height: 180,
    justifyContent: "flex-start",
  },

  itemInfoContainer: {
    height: 80,
  },
  iconNameContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    height: 40,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  },
  itemWeight: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
    marginLeft: 26,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    height: 24,
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
  buttonContainer: {
    height: 44,
    marginTop: "auto",
    justifyContent: "center",
    width: "100%",
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
    height: 40,
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

export default UserDashboard;
