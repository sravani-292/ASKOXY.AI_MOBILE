// components/CategorySection.js
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import ProductCard from "./ProductCard";
import { handleDecrementorRemovalCart,handleGetProfileData } from "../../../ApiService";
import { supabase } from "../../../Config/supabaseClient";

const CategorySection = ({
  categories,
  addToCart,
  removeFromCart,
  getItemInCart,
  calculateDiscount,
  customerId,
  cartData,
  loading = false,
  isLoading,
  setIsLoading,
  maxItemsToShow = 5,
  onSeeAll,
  onChargeCart,
  // New props for filtering and prioritizing
  weightFilter = null, // { min: 0, max: 1000 } or null for no filter
  priorityItems = [], // Array of itemIds to show first (can be passed as prop)
  enableWeightFilter = true, // Enable/disable weight filter UI
  dynamicContent,
}) => {
  const [categoryLoading, setCategoryLoading] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedWeightFilter, setSelectedWeightFilter] =
    useState(weightFilter);
  const [priorityItemsByName, setPriorityItemsByName] = useState([]);
  const [loadingPriorityItems, setLoadingPriorityItems] = useState(true);
  const navigation = useNavigation();
  const ASKOXY_PRIORITY_NAMES = ["askoxy.ai"];

  // Fallback priority items (used if Supabase fails)
  const fallbackPriorityItems = [
    "Premium Rice",
    "Organic Wheat",
    "Basmati Rice",
    "Fresh Milk",
    "Organic Vegetables",
    "Premium Oil",
    "Fresh Fruits",
    "Whole Wheat Flour",
  ];

  // Fetch priority items from Supabase
  const fetchPriorityItems = useCallback(async () => {
    try {
      setLoadingPriorityItems(true);

      const { data, error } = await supabase
        .from("priority_items")
        .select("*")
        .eq("is_active", true)
        .order("priority_order", { ascending: true });

      if (error) {
        console.error("Error fetching priority items:", error);
        setPriorityItemsByName(fallbackPriorityItems);
        return;
      }

      if (data && data.length > 0) {
        // Extract item names from Supabase data
        const priorityNames = data.map((item) => item.item_name || item.name);
        setPriorityItemsByName(priorityNames);
      } else {
        // Use fallback if no data found
        setPriorityItemsByName(fallbackPriorityItems);
      }
    } catch (error) {
      console.error("Error fetching priority items:", error);
      setPriorityItemsByName(fallbackPriorityItems);
    } finally {
      setLoadingPriorityItems(false);
    }
  }, []);

  // Set up real-time subscription for priority items
  useEffect(() => {
    // Initial fetch
    fetchPriorityItems();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel("priority_items_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "priority_items",
        },
        (payload) => {
          console.log("Priority items changed:", payload);
          fetchPriorityItems(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchPriorityItems]);

  // Predefined weight ranges
  const weightRanges = [
    { label: "All", value: null },
    { label: "0-100g", value: { min: 0, max: 100 } },
    { label: "100-250g", value: { min: 100, max: 250 } },
    { label: "250-500g", value: { min: 250, max: 500 } },
    { label: "500g-1kg", value: { min: 500, max: 1000 } },
    { label: "1kg+", value: { min: 1000, max: Infinity } },
  ];

  // Fixed: Properly determine loading state
  const isMainLoading = loading || loadingPriorityItems || isLoading;

  // Update parent loading state when internal loading changes
  useEffect(() => {
    if (categories) {
      setIsLoading(false);
    }
  }, [loadingPriorityItems, categories]);

  // Memoize cart lookup to avoid recalculation
  const cartLookup = useMemo(() => {
    if (!cartData || !Array.isArray(cartData)) {
      return {};
    }
    const lookup = {};
    cartData.forEach((cartItem) => {
      if (cartItem && cartItem.itemId) {
        lookup[cartItem.itemId] = cartItem;
      }
    });

    return lookup;
  }, [cartData]);

  // Function to filter items by weight
  const filterItemsByWeight = useCallback((items, weightFilter) => {
    if (!weightFilter || !items) return items;
    return items.filter((item) => {
      const weight = item.itemWeight || 0;
      return weight >= weightFilter.min && weight <= weightFilter.max;
    });
  }, []);

  // Function to sort items with priority items first (by name or ID)
  const sortItemsWithPriority = useCallback(
    (items, priorityItems, priorityItemsByName) => {
      // Combine both prop-based priority items and name-based priority items
      const allPriorityItems = [...(priorityItems || [])];

      // Add items that match priority names
      const priorityByName = items.filter(
        (item) =>
          priorityItemsByName.includes(item.itemName) ||
          priorityItemsByName.includes(item.itemTitle) ||
          priorityItemsByName.some(
            (name) =>
              item.itemName?.toLowerCase().includes(name.toLowerCase()) ||
              item.itemTitle?.toLowerCase().includes(name.toLowerCase())
          )
      );

      // Add their IDs to priority list
      priorityByName.forEach((item) => {
        if (!allPriorityItems.includes(item.itemId)) {
          allPriorityItems.push(item.itemId);
        }
      });

      if (allPriorityItems.length === 0) return items;

      const prioritySet = new Set(allPriorityItems);
      const priorityItemsFiltered = items.filter((item) =>
        prioritySet.has(item.itemId)
      );
      const regularItems = items.filter(
        (item) => !prioritySet.has(item.itemId)
      );

      // Sort priority items by their order in priorityItems array and then by name priority
      const sortedPriorityItems = priorityItemsFiltered.sort((a, b) => {
        const aIdIndex = allPriorityItems.indexOf(a.itemId);
        const bIdIndex = allPriorityItems.indexOf(b.itemId);

        // If both have ID priority, sort by ID priority
        if (aIdIndex !== -1 && bIdIndex !== -1) {
          return aIdIndex - bIdIndex;
        }

        // If only one has ID priority, it goes first
        if (aIdIndex !== -1) return -1;
        if (bIdIndex !== -1) return 1;

        // Both are name-based, sort by name priority order
        const aNameIndex = priorityItemsByName.findIndex(
          (name) =>
            a.itemName?.toLowerCase().includes(name.toLowerCase()) ||
            a.itemTitle?.toLowerCase().includes(name.toLowerCase())
        );
        const bNameIndex = priorityItemsByName.findIndex(
          (name) =>
            b.itemName?.toLowerCase().includes(name.toLowerCase()) ||
            b.itemTitle?.toLowerCase().includes(name.toLowerCase())
        );

        return aNameIndex - bNameIndex;
      });

      return [...sortedPriorityItems, ...regularItems];
    },
    []
  );

  // Process and filter items for each category
  const processedCategories = useMemo(() => {
    return Array.isArray(categories)
      ? categories
      : categories?.categories || [];
  }, [categories]);

 const filteredCategories = useMemo(() => {
  return processedCategories.map(category => {
    let items = category.itemsResponseDtoList || [];
    
    // Apply weight filter
    if (selectedWeightFilter) {
      items = filterItemsByWeight(items, selectedWeightFilter);
    }
    
    //FORCE ASKOXY.AI ITEMS TO APPEAR FIRST (case-insensitive)
    const KEYWORD = "askoxy.ai";
    items = [...items].sort((a, b) => {
      const aHas = (a.itemName || "").toLowerCase().includes(KEYWORD);
      const bHas = (b.itemName || "").toLowerCase().includes(KEYWORD);
      
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0; // preserve original order within groups
    });
    
    return {
      ...category,
      itemsResponseDtoList: items,
      originalItemCount: category.itemsResponseDtoList?.length || 0,
      filteredItemCount: items.length
    };
  });
}, [processedCategories, selectedWeightFilter, filterItemsByWeight]);

  // Handle category loading state
  const handleCategoryAction = useCallback(async (categoryName, action) => {
    setCategoryLoading((prev) => ({ ...prev, [categoryName]: true }));
    try {
      await action();
    } catch (error) {
      console.error("Category action error:", error);
    } finally {
      setCategoryLoading((prev) => ({ ...prev, [categoryName]: false }));
    }
  }, []);

  // Handle expanding/collapsing categories
  const toggleCategoryExpansion = useCallback((categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  }, []);

  // Handle see all navigation
  const handleSeeAll = useCallback(
    async (category) => {
      if (onSeeAll) {
        await handleCategoryAction(category.categoryName, () => {
          onSeeAll(category);
        });
      } else {
        // Default behavior - expand the category
        toggleCategoryExpansion(category.categoryName);
      }
    },
    [onSeeAll, handleCategoryAction, toggleCategoryExpansion]
  );

 

  // Handle weight filter change
  const handleWeightFilterChange = useCallback((weightRange) => {
    setSelectedWeightFilter(weightRange);
  }, []);

  // Optimized add to cart handler
  const handleAddToCart = useCallback(
  async (item, type) => {
    //  Step 1: Check login
    if (!customerId) {
      Alert.alert("Login Required", "Please login to continue.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }

    //  Step 2: Fetch profile data (if not already in Redux)
    let userProfile = null;
    try {
      const profileResponse = await handleGetProfileData(customerId);
      userProfile = profileResponse.data; // Adjust based on your API response structure
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      Alert.alert("Error", "Unable to verify your profile. Please try again.");
      return;
    }

    //  Step 3: Check required fields
    const { firstName, email, mobileNumber } = userProfile || {};
    const isProfileComplete = !!(firstName && mobileNumber);

    if (!isProfileComplete) {
      Alert.alert(
        "Complete Your Profile",
        "Please fill all required details  to proceed.",
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

    // Step 4: Add to cart
    try {
      // console.log(item, "...........", type);
      await addToCart(item, type);
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  },
  [addToCart, customerId, navigation]
);
  // Optimized remove from cart handler
  const handleRemoveFromCart = useCallback(
    async (cartId, customerId, quantity, itemId) => {
      try {
        if (quantity === 1) {
          console.log("quantity", quantity, "removing total");
          await removeFromCart(cartId);
        } else {
          console.log("quantity", quantity, "removing one");
          await handleDecrementorRemovalCart({ customerId, itemId });
          if (onChargeCart) {
            onChargeCart();
          }
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    },
    [removeFromCart, onChargeCart]
  );

  // Fixed: Show loading only when actually loading and categories are empty
  if (isMainLoading && (!categories || processedCategories.length === 0)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>
          {loadingPriorityItems
            ? "Loading priority items..."
            : "Loading categories..."}
        </Text>
      </View>
    );
  }

  // Show message if no categories after loading
  if (!isMainLoading && processedCategories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="basket-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No categories available</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>
          {loadingPriorityItems
            ? "Loading priority items..."
            : "Loading categories..."}
        </Text>
      </View>
    );
  }

  return (
    <View key={categories?.categoryType || "categories"}>
      {/* Weight Filter Section */}
      {enableWeightFilter && (
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Filter by Weight</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            {weightRanges.map((range, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.filterChip,
                  selectedWeightFilter === range.value &&
                    styles.filterChipSelected,
                ]}
                onPress={() => handleWeightFilterChange(range.value)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedWeightFilter === range.value &&
                      styles.filterChipTextSelected,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Loading overlay for priority items while showing content */}
      {loadingPriorityItems && processedCategories.length > 0 && (
        <View style={styles.overlayLoadingContainer}>
          <View style={styles.overlayLoader}>
            <ActivityIndicator size="small" color="#8B5CF6" />
            <Text style={styles.overlayLoadingText}>
              Updating priority items...
            </Text>
          </View>
        </View>
      )}

      {/* Categories Content */}
      {filteredCategories.map((category) => {
        const isLoadingCategory = categoryLoading[category.categoryName];
        const isExpanded = expandedCategories[category.categoryName];
        const totalItems = category.filteredItemCount;
        const shouldShowSeeAll = totalItems > maxItemsToShow;
        const itemsToShow = isExpanded
          ? category.itemsResponseDtoList
          : category.itemsResponseDtoList?.slice(0, maxItemsToShow) || [];

        // Skip category if no items after filtering
        if (totalItems === 0) return null;

        return (
          <View key={category.categoryName} style={styles.section}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Image
                  style={styles.logo}
                  source={{ uri: category.categoryLogo }}
                  defaultSource={require("../../../../assets/SVG/askoxy.png")}
                />
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{category.categoryName}</Text>
                  <View style={styles.itemCountContainer}>
                    <Text style={styles.itemCount}>
                      {isExpanded
                        ? `${totalItems} items`
                        : `${itemsToShow.length}${
                            shouldShowSeeAll ? `/${totalItems}` : ""
                          } items`}
                    </Text>
                    {selectedWeightFilter &&
                      category.originalItemCount !== totalItems && (
                        <Text style={styles.filteredText}>
                          (filtered from {category.originalItemCount})
                        </Text>
                      )}
                  </View>
                </View>
                {isLoadingCategory && (
                  <View style={styles.categoryLoaderContainer}>
                    <ActivityIndicator size="small" color="#8B5CF6" />
                  </View>
                )}
              </View>

              {shouldShowSeeAll && (
                <TouchableOpacity
                  onPress={() => handleSeeAll(category)}
                  disabled={isLoadingCategory}
                  style={[
                    styles.seeAllButton,
                    isLoadingCategory && styles.disabledButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.seeAll,
                      isLoadingCategory && styles.disabledText,
                    ]}
                  >
                    {isExpanded ? "Show Less" : "See All"}
                  </Text>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-forward"}
                    size={14}
                    color="#FF6B35"
                    style={styles.seeAllIcon}
                  />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scroll}
              nestedScrollEnabled={true}
              scrollEventThrottle={16}
            >
              {itemsToShow.map((item, index) => {
                const cartItem = cartLookup[item.itemId] || null;
                const discount = calculateDiscount(
                  item.itemMrp,
                  item.itemPrice
                );

                // Check if item is priority (by ID or name)
                const isPriorityById = priorityItems.includes(item.itemId);
                const isPriorityByName = priorityItemsByName.some(
                  (name) =>
                    item.itemName?.toLowerCase().includes(name.toLowerCase()) ||
                    item.itemTitle?.toLowerCase().includes(name.toLowerCase())
                );
                const isPriorityItem = isPriorityById || isPriorityByName;

                return (
                  <View key={item.itemId} style={styles.productWrapper}>
                    <ProductCard
                      item={item}
                      onAddToCart={handleAddToCart}
                      cartItem={cartItem}
                      onDecrement={handleRemoveFromCart}
                      discount={discount}
                      customerId={customerId}
                      dynamicContent={dynamicContent}
                    />
                  </View>
                );
              })}

              {/* Show "See All" card at the end if there are more items */}
              {shouldShowSeeAll && !isExpanded && (
                <TouchableOpacity
                  style={styles.seeAllCard}
                  onPress={() => handleSeeAll(category)}
                  disabled={isLoadingCategory}
                >
                  <View style={styles.seeAllCardContent}>
                    <Ionicons name="grid-outline" size={24} color="#8B5CF6" />
                    <Text style={styles.seeAllCardText}>See All</Text>
                    <Text style={styles.seeAllCardSubtext}>
                      +{totalItems - maxItemsToShow} more
                    </Text>
                    {isLoadingCategory && (
                      <View style={styles.seeAllCardLoaderContainer}>
                        <ActivityIndicator size="small" color="#8B5CF6" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    marginTop: 10,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 30,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  filterScroll: {
    marginHorizontal: -4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterChipSelected: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  filterChipText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterChipTextSelected: {
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    height: 45,
    width: 45,
    // borderRadius: 100,
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  itemCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  itemCount: {
    fontSize: 12,
    color: "#666",
  },
  filteredText: {
    fontSize: 11,
    color: "#8B5CF6",
    marginLeft: 6,
    fontStyle: "italic",
  },
  categoryLoaderContainer: {
    marginLeft: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  seeAll: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "500",
  },
  seeAllIcon: {
    marginLeft: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.5,
  },
  scroll: {
    paddingHorizontal: 16,
  },
  productWrapper: {
    position: "relative",
  },
  seeAllCard: {
    width: 120,
    marginRight: 14,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#8B5CF6",
    borderStyle: "dashed",
    overflow: "hidden",
    marginBottom: 15,
  },
  seeAllCardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    minHeight: 200,
  },
  seeAllCardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5CF6",
    marginTop: 8,
  },
  seeAllCardSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  seeAllCardLoaderContainer: {
    marginTop: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 8,
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 200,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 200,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
    textAlign: "center",
  },
  overlayLoadingContainer: {
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 1000,
  },
  overlayLoader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overlayLoadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});

export default CategorySection;
