import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Dimensions,
  Text,
  Animated,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import BASE_URL from "../../../../../Config";
import LottieView from "lottie-react-native";
import { COLORS } from "../../../../../Redux/constants/theme";
import ProductHeader from "./ProductHeader";
import ProductCard from "./ProductCard";
import FilterModal from "./FilterModal";
import EmptyState from "./EmptyState";
// import GoldDetailModal from "../GoldDetailedModal";
import SidebarComponent from "./SidebarComponent";
import {
  handleCustomerCartData,
  handleUserAddorIncrementCart,
  handleDecrementorRemovalCart,
  handleGetProfileData,
} from "../../../../ApiService";
import OfferModal from "./OfferModal";
import { useCart } from "../../../../../until/CartCount";

const { width } = Dimensions.get("window");

const UserDashboard = () => {

  const route = useRoute();
  
  // console.log("route params", route.params);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    route?.params?.category || "All CATEGORIES"
  );
  const [selectedCategoryType, setSelectedCategoryType] = useState(
    route?.params?.categoryType || "RICE"
  );
  const [offerWeight, setOfferWeight] = useState(route?.params?.offerId || 1);
  const [loadingItems, setLoadingItems] = useState({});
  const { cartCount, setCartCount } = useCart();
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
const[offerShow,setOfferShow]=useState(false)
  const [comboOffersData, setComboOffersData] = useState([]);
  const [dynamicContent, setDynamicContent] = useState();

  const navigation = useNavigation();
  const sidebarScrollViewRef = useRef(null);
  const topScrollViewRef = useRef(null);
  const categoryTypeScrollViewRef = useRef(null);
  const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;

  // Check if category type is RICE or GOLD for conditional rendering
  const isCategoryTypeRice = selectedCategoryType === "RICE";
  const isCategoryTypeGold = selectedCategoryType === "GOLD";

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

   useEffect(() => {
    if (selectedCategory === "All CATEGORIES") {
      navigation.setOptions({
        title: selectedCategoryType
      });
    } else {
      navigation.setOptions({
        title: selectedCategory
      });
    }
    
  }, [selectedCategory, selectedCategoryType, navigation]);

  useFocusEffect(
    useCallback(() => {
      console.log("UserDashboard focused", selectedCategory, selectedCategoryType);
     
    }, [userData])
  );

  useEffect(() => {
 if (userData) {
        fetchCartItems();
      }
      getAllCategories();
      handleDescripion();
  }, [route.params,userData]);
 
   const handleDescripion = useCallback(async() => {
        try{
            const response = await axios({
            method: "get",
            url: BASE_URL + `user-service/allBmvDiscriptionData`,
          })
          // console.log("response of description",response.data);
          const data = response.data
  
         const targetId = `1ee1d800-45e2-4918-ac97-382a298dbf78`
          const matched = data.find(item => item.id === targetId);
          if (matched) {
            setDynamicContent(matched.discription);
          }
        }
        catch(error){
          console.log(error);
        }
    }, []);

  // Scroll to selected category in sidebar
  useEffect(() => {
    // console.log("Selected category changed:", selectedCategory);
    if (selectedCategory && sidebarScrollViewRef.current) {
      const currentCategories = arrangeCategories(
        categories,
        selectedCategoryType
      );
      const categoryIndex = currentCategories.findIndex(
        (cat) => cat.categoryName === selectedCategory
      );

      if (categoryIndex !== -1) {
        const scrollPosition = categoryIndex * 70;
        setTimeout(() => {
          sidebarScrollViewRef.current.scrollTo({
            y: scrollPosition,
            animated: true,
          });
        }, 300);
      }
    }
  }, [selectedCategory, categories, selectedCategoryType]);

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
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Get available category types from data
const getAvailableCategoryTypes = () => {
  const priority = ["Rice", "Grocery", "Gold"];

  const categoryTypes = categories
    .map((group) => group.categoryType?.trim())
    .filter(Boolean);

  const unique = [...new Set(categoryTypes)];

  // Sort by priority: move Rice, Grocery, Gold to top (if present)
  const sorted = [
    ...priority.filter((p) => unique.includes(p)),
    ...unique.filter((t) => !priority.includes(t)),
  ];

  return sorted;
};


 const arrangeCategories = (allCategoryGroups, categoryType) => {
  if (!Array.isArray(allCategoryGroups) || allCategoryGroups.length === 0)
    return [];

  const matchedGroup = allCategoryGroups.find(
    (group) =>
      group.categoryType?.trim().toLowerCase() ===
      categoryType?.trim().toLowerCase()
  );

  if (!matchedGroup || !Array.isArray(matchedGroup.categories)) return [];

  let categories = [...matchedGroup.categories];

  // ✅ Search for "Combo Offer" instead of "Combo Rice"
  const comboIndex = categories.findIndex((cat) =>
  ["combo offers", "combo rice"].includes(cat.categoryName?.trim().toLowerCase())
);

  if (comboIndex !== -1) {
    const comboItem = categories.splice(comboIndex, 1)[0];
    return [comboItem, ...categories];
  }

  return categories;
};


  // Parse weight from string
  const parseWeight = (weightStr) => {
    if (!weightStr) return 0;

    const numMatch = weightStr.toString().match(/(\d+(\.\d+)?)/);
    if (numMatch) {
      return parseFloat(numMatch[0]);
    }
  return 0;
};

  // Sort items
  const sortItems = (items, order) => {
    return [...items].sort((a, b) => {
      // First priority: in-stock items
      if (a.quantity > 0 && b.quantity === 0) return -1;
      if (a.quantity === 0 && b.quantity > 0) return 1;

      // Second priority: sort by selected order
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

  // Apply filters and sort
  const applyFiltersAndSort = (items, weightFilter) => {
  let filtered = items;
  
  if (weightFilter) {
    filtered = items.filter(item => {
      return item.weight === weightFilter || item.weightKg === weightFilter;
    });
  }
   return sortItems(filtered, sortOrder);
};

  // Handle category type change
  const handleCategoryTypeChange = (categoryType) => {
    setSelectedCategoryType(categoryType);
    setSelectedCategory("All CATEGORIES");
    setSelectedWeightFilter(null);

    // Get items for the new category type
    const items = categories
      .filter(
        (group) =>
          group.categoryType?.toLowerCase() === categoryType?.toLowerCase()
      )
      .flatMap(
        (group) =>
          group.categories?.flatMap((cat) => cat.itemsResponseDtoList || []) ||
          []
      );

    setAllItems(items);
    setFilteredItems(sortItems(items, "weightAsc"));
  };

const handleAddToCart = async (item) => {
    if (!userData || !customerId) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "Cancel" },
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }

    try {
      const profileResponse = await handleGetProfileData(customerId);
      const profile = profileResponse.data;

      const { firstName, mobileNumber } = profile || {};
      const isProfileComplete = !!(firstName && mobileNumber);

      if (!isProfileComplete) {
        Alert.alert(
          "Complete Your Profile",
          "Please fill your profile details to proceed..",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Go to Profile",
              onPress: () => navigation.navigate("Profile Edit"),
            },
          ]
        );
        return;
      }
    } catch (error) {
      console.error("Profile validation error:", error);
      Alert.alert(
        "Profile Check Failed",
        "Unable to verify your profile. Please try again or contact support."
      );
      return;
    }

    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };

    try {
      const response = await handleUserAddorIncrementCart(data, "ADD");

      Alert.alert(
        "Success",
        response.cartResponse?.errorMessage || "Item added to cart",
        [
          {
            text: "OK",
            onPress: () => {
              if (response.comboOffers) {
                setComboOffersData(response.comboOffers);
                setOfferShow(true);
              }
            },
          },
        ]
      );

      fetchCartItems();

      // Fetch offers
      const [activeRes, eligibleRes] = await Promise.all([
        fetch(`${BASE_URL}cart-service/cart/activeOffers`),
        fetch(`${BASE_URL}cart-service/cart/userEligibleOffer/${customerId}`),
      ]);

      const activeOffers = await activeRes.json();
      const userEligibleOffers = await eligibleRes.json();
      const validActiveOffers = activeOffers.filter((offer) => offer.active);

      if (!validActiveOffers.length) return;

      const usedOfferWeights = userEligibleOffers
        .filter((o) => o.eligible)
        .map((o) => o.weight);
      const usedOfferNames = userEligibleOffers
        .filter((o) => o.eligible)
        .map((o) => o.offerName);

      const itemWeight = item.weight;
      const units = item.units;
      let alertShown = false;

      // FIXED: Define hasUsedOfferForWeight BEFORE using it!
      const hasUsedOfferForWeight = usedOfferWeights.includes(itemWeight);

      // Non-container offer reuse check
      if (hasUsedOfferForWeight && itemWeight !== 10 && itemWeight !== 26) {
        const usedOffer = userEligibleOffers.find(
          (o) => o.eligible && o.weight === itemWeight
        );
        if (usedOffer) {
          alertShown = true;
        }
      }

      //  Container Offer (10kg or 26kg)
      if (
        !alertShown &&
        (itemWeight === 10 || itemWeight === 26) &&
        units === "kgs"
      ) {
        const hasUsedContainer = userEligibleOffers.some(
          (uo) => uo.eligible && (uo.weight === 10 || uo.weight === 26)
        );
        if (hasUsedContainer) {
          alertShown = true;
        } else {
          const matchedContainerOffer = validActiveOffers.find(
            (offer) =>
              offer.minQtyKg === itemWeight &&
              units === "kgs" &&
              (offer.minQtyKg === 10 || offer.minQtyKg === 26) &&
              !usedOfferNames.includes(offer.offerName)
          );

          if (matchedContainerOffer) {
            setTimeout(() => {
              Alert.alert(
                "Container Offer",
                `${matchedContainerOffer.offerName} FREE!`
              );
            }, 1000);
            alertShown = true;
          }
        }
      }

      // Special Offer (1kg or 5kg)
      if (!alertShown && (itemWeight === 1 || itemWeight === 5)) {
        const matchedSpecialOffer = validActiveOffers.find(
          (offer) =>
            offer.minQtyKg === itemWeight &&
            (offer.minQtyKg === 1 || offer.minQtyKg === 5) &&
            !usedOfferNames.includes(offer.offerName) &&
            offer.freeItemName?.toLowerCase() === item.itemName?.toLowerCase()
        );

        if (matchedSpecialOffer) {
          setTimeout(() => {
            Alert.alert(
              "Special Offer",
              `${matchedSpecialOffer.offerName} is active!`
            );
          }, 1000);
          alertShown = true;
        }
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  };
  // Increment quantity
  const incrementQuantity = async (item) => {
    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await handleUserAddorIncrementCart(data,"Increment");
      // Alert.alert("Success", response.data.errorMessage);
      await fetchCartItems();
    } catch (error) {
      Alert.alert("Error", "Failed to update quantity. Please try again.");
    }
  };

  // Decrement quantity
  const decrementQuantity = async (item) => {
    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await handleDecrementorRemovalCart(data);
      // Alert.alert("Success", response.data.errorMessage);
      fetchCartItems();
    } catch (error) {
      Alert.alert(
        "Failed",
        error.response?.data?.errorMessage || "An error occurred"
      );
      fetchCartItems();
    }
  };

  // Get all categories
  const getAllCategories = async () => {
    setLoading(true);
    await axios
      .get(`${BASE_URL}product-service/showGroupItemsForCustomrs`)
      .then((response) => {
        setCategories(response.data);

        const categoryType = selectedCategoryType;

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

        if (route.params.category && route.params.category !== "All CATEGORIES") {
          console.log("Function started.....", route.params.category);

          const weight = route.params.offerId;
          const finalWeightFilter =
            selectedWeightFilter === weight ? null : weight;

          setSelectedWeightFilter(finalWeightFilter);
           
          console.log("Selected weight filter:", weight);
          
          let itemsToFilter = [];

          if (selectedCategory === "All CATEGORIES") {
            itemsToFilter = items;
          } else {
            itemsToFilter = response.data
              .flatMap((group) => group.categories || [])
              .filter(
                (cat) =>
                  cat.categoryName?.trim().toLowerCase() ===
                  route.params.category.trim().toLowerCase()
              )
              .flatMap((cat) => cat.itemsResponseDtoList || []);
          }

          setFilteredItems(itemsToFilter);
          console.log("Filtered items:route.params.category");
          
        } 
        else {
          if (selectedCategory === "All CATEGORIES") {
            const weight = route.params.offerId;
          const finalWeightFilter =
            selectedWeightFilter === weight ? null : weight;
          if( weight) {
             setSelectedWeightFilter(finalWeightFilter);
            setFilteredItems(applyFiltersAndSort(items, finalWeightFilter));
          }else{
            setFilteredItems(sortItems(items, "weightAsc"));
          }
          } else {
            const filtered = response.data
              .filter(
                (cat) =>
                  cat.categoryName?.trim().toLowerCase() ===
                  selectedCategory?.trim().toLowerCase()
              )
              .flatMap((cat) => cat.itemsResponseDtoList || []);

            setFilteredItems(sortItems(filtered, "weightAsc"));
            // console.log("Filtered items:", filtered);
          }
        }
        //  console.log("Filtered items: at getAllCategories");
         
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
        Alert.alert("Error", "Failed to fetch categories. Please try again.");
      });
  };

  // Filter by category
const filterByCategory = (categoryName) => {
  setSelectedCategory(categoryName || "All CATEGORIES");

  const currentCategoryGroup = categories.find(
    (group) =>
      group.categoryType?.toLowerCase() ===
      selectedCategoryType?.toLowerCase()
  );

  if (!currentCategoryGroup) {
    setFilteredItems([]);
    return;
  }

  let itemsToFilter = [];

  if (categoryName === "All CATEGORIES") {
    itemsToFilter = currentCategoryGroup.categories?.flatMap(
      (cat) => cat.itemsResponseDtoList || []
    ) || [];
  } else {
    const matchedCategory = currentCategoryGroup.categories?.find(
      (cat) =>
        cat?.categoryName.trim().toLowerCase() ===
        categoryName?.trim().toLowerCase()
    );
    itemsToFilter = matchedCategory?.itemsResponseDtoList || [];
  }

  //  have to Apply both weight filter and sorting while category changes
  setFilteredItems(applyFiltersAndSort(itemsToFilter, selectedWeightFilter));
};

  // Filter by weight
 const filterByWeight = (weight) => {
    let finalWeightFilter = selectedWeightFilter === weight ? null : weight;
    setSelectedWeightFilter(finalWeightFilter);

    let itemsToFilter = [];

    if (selectedCategory === "All CATEGORIES") {
      itemsToFilter = allItems;
    } else {
      const currentCategoryGroup = categories.find(
        (group) =>
          group.categoryType?.toLowerCase() ===
          selectedCategoryType?.toLowerCase()
      );

      const matchedCategory = currentCategoryGroup?.categories?.find(
        (cat) =>
          cat?.categoryName.trim().toLowerCase() ===
          selectedCategory?.trim().toLowerCase()
      );

      itemsToFilter = matchedCategory?.itemsResponseDtoList || [];
    }
    setFilteredItems(applyFiltersAndSort(itemsToFilter, finalWeightFilter));
  };
  // Apply filters
 const applyFilters = () => {
    let itemsToFilter = [];

    if (selectedCategory === "All CATEGORIES") {
      itemsToFilter = allItems;
    } else {
      const currentCategoryGroup = categories.find(
        (group) =>
          group.categoryType?.toLowerCase() ===
          selectedCategoryType?.toLowerCase()
      );

      const matchedCategory = currentCategoryGroup?.categories?.find(
        (cat) =>
          cat.categoryName?.trim().toLowerCase() ===
          selectedCategory?.trim().toLowerCase()
      );

      itemsToFilter = matchedCategory?.itemsResponseDtoList || [];
    }

    setFilteredItems(applyFiltersAndSort(itemsToFilter));
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

    const matchedGroup = categories.find(
      (group) =>
        group.categoryType?.trim().toLowerCase() ===
        selectedCategoryType?.trim().toLowerCase()
    );

    if (!matchedGroup) {
      setFilteredItems([]);
      return;
    }

    const itemsFromSelectedCategory = matchedGroup.categories
      ?.filter((cat) =>
        isAllCategories
          ? true
          : cat.categoryName?.trim().toLowerCase() ===
            selectedCategory?.trim().toLowerCase()
      )
      ?.flatMap((cat) => cat.itemsResponseDtoList || []);

    if (!normalizedSearchText) {
      const filtered = applyFiltersAndSort(
        itemsFromSelectedCategory,
        selectedWeightFilter
      );
      setFilteredItems(filtered);
      return;
    }

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
    setSearchText("");
    filterByCategory(selectedCategory);
  };

  const footer = () => <View style={styles.footer} />;

  const renderItem = ({ item }) => (
    <ProductCard
      item={item}
      navigation={navigation}
      cartItems={cartItems}
      loadingItems={loadingItems}
      removalLoading={removalLoading}
      handleAdd={handleAdd}
      handleIncrease={handleIncrease}
      handleDecrease={handleDecrease}
      handleGoldItemPress={handleGoldItemPress}
      isCategoryTypeGold={isCategoryTypeGold}
      imageErrors={imageErrors}
      category={selectedCategory}
      categoryType={selectedCategoryType}
      dynamicContent={dynamicContent}
    />
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <LottieView
          source={require("../../../../../assets/AnimationLoading.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Category Types Header */}
     

      {/* <ProductHeader
        searchText={searchText}
        setSearchText={(text) => {
          setSearchText(text);
          filterItemsBySearch(text);
        }}
        handleClearText={handleClearText}
        cartData={cartData}
        cartCount={cartCount}
        userData={userData}
        navigation={navigation}
        selectedWeightFilter={selectedWeightFilter}
        filterByWeight={filterByWeight}
        isCategoryTypeRice={isCategoryTypeRice}
        arrangeCategories={arrangeCategories} // <-- Add this line
      /> */}

        <ProductHeader
        searchText={searchText}
        setSearchText={setSearchText}
        handleClearText={handleClearText}
        cartData={cartData}
        cartCount={cartCount}
        userData={userData} 
        navigation={navigation}
        selectedWeightFilter={selectedWeightFilter}
        filterByWeight={filterByWeight}
        isCategoryTypeRice={selectedCategoryType === "RICE"}
        getAvailableCategoryTypes={getAvailableCategoryTypes}
        selectedCategoryType={selectedCategoryType}
        handleCategoryTypeChange={handleCategoryTypeChange}
        categoryTypeScrollViewRef={categoryTypeScrollViewRef}
      />
      <FilterModal
        filterModalVisible={filterModalVisible}
        setFilterModalVisible={setFilterModalVisible}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
      />
      {/* <View style={styles.categoryTypesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={categoryTypeScrollViewRef}
          contentContainerStyle={styles.categoryTypesScrollContainer}
        >
          {getAvailableCategoryTypes().map((categoryType) => (
            <TouchableOpacity
              key={categoryType}
              onPress={() => handleCategoryTypeChange(categoryType)}
              style={[
                styles.categoryTypeButton,
                selectedCategoryType === categoryType &&
                  styles.selectedCategoryTypeButton,
              ]}
            >
              <Text
                style={[
                  styles.categoryTypeText,
                  selectedCategoryType === categoryType &&
                    styles.selectedCategoryTypeText,
                ]}
              >
                {categoryType}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View> */}
      <View style={styles.rowContainer}>
        <View style={{width:width*0.2,alignSelf:"flex-start"}}>
        <SidebarComponent
          categories={categories}
          arrangeCategories={arrangeCategories}
          selectedCategoryType={selectedCategoryType}
          selectedCategory={selectedCategory}
          filterByCategory={filterByCategory}
          sidebarScrollViewRef={sidebarScrollViewRef}
          styles={styles}
        />
        </View>
        <View style={{width:width*0.8}}>
        {filteredItems.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            key={`${selectedCategoryType}-${selectedCategory}`}
            data={filteredItems}
            extraData={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.itemId.toString()}
            numColumns={2}
            ListFooterComponent={footer}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            style={styles.productGrid}
          />
        )}
        </View>
      </View>

  {offerShow && (
        <OfferModal
          visible={offerShow}
          comboOffers={comboOffersData}
          onClose={() => setOfferShow(false)}
        />

      )}
   {/* 
      <GoldDetailModal
        visible={modalVisible}
        itemId={selectedItemId}
        onClose={() => setModalVisible(false)}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  categoryTypesContainer: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  categoryTypesScrollContainer: {
    paddingHorizontal: 15,
  },
  categoryTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dee2e6",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategoryTypeButton: {
    backgroundColor: COLORS.services,
    borderColor: COLORS.services,
  },
  categoryTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#495057",
    textTransform: "capitalize",
  },
  selectedCategoryTypeText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    // width:2,
    backgroundColor: "#f8f9fa",
    borderRightWidth: 1,
    borderRightColor: "#e9ecef",
  },
  sidebarContent: {
    paddingVertical: 12,
  },
  sidebarItem: {
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 5,
    marginVertical: 2,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  selectedSidebarItem: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: COLORS.services,
  },
  sidebarImage: {
    width: 55,
    height: 55,
    // borderRadius: 20,
    marginBottom: 5,
  },
  sidebarImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.services,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  sidebarImageText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  sidebarText: {
    fontSize: 10,
    textAlign: "center",
    color: "#495057",
    fontWeight: "500",
    width:width*0.17,
    fontSize:13,
  },
  selectedSidebarText: {
    color: COLORS.services,
    fontWeight: "400",
  },
  productGrid: {
    flex: 1,
  },
  listContainer: {
    padding: 18,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  footer: {
    height: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default UserDashboard;
