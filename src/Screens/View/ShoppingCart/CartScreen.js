import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Modal,
  Animated,
  Easing,
  Platform,
} from "react-native";
import axios from "axios";
import { StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../../../Redux/constants/theme";
import { Alert } from "react-native";
import PriceBreakdownModal from "./PriceBreakdownModal";
import { TouchableWithoutFeedback } from "react-native";
import {
  handleCustomerCartData,
  handleGetProfileData,
  handleUserAddorIncrementCart,
  handleDecrementorRemovalCart,
  handleRemoveItem,
  handleRemoveFreeItem,
} from "../../../../src/ApiService";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("window");
import BASE_URL, { userStage } from "../../../../Config";
import LottieView from "lottie-react-native";
import ContainerPolicy from "../AdditionalFiles/ContainerPolicy";
import ContainerSoftCopy from "./ContainerSoftCopy";
const CartScreen = () => {
  const userData = useSelector((state) => state.counter);
  // console.log("userData", userData);

  const token = userData.accessToken;
  const customerId = userData.userId;

  const navigation = useNavigation();
  const [cartData, setCartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [removalLoading, setRemovalLoading] = useState({});
  const [itemsGstAmount, setItemsGstAmount] = useState("");
  const [goldMakingCost, setGoldMakingCost] = useState("");
  const [goldGstAmount, setGoldGstAmont] = useState("");

  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [hasWeight, setHasWeight] = useState("");
  const [freeItemPrice, setFreeItemPrice] = useState("");
  const [gstAmount, setGstAmount] = useState("");
  const [totalCartValue, setTotalCartValue] = useState("");
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  const [containerAddedPrice, setContainerAddedPrice] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const locationdata = {
    flatNo: "",
    landMark: "",
    pincode: "",
    address: "",
    addressType: "",
    latitude: "",
    longitude: "",
    status: false,
  };

  const addressdata = {
    addressId: "",
    hasId: false,
  };
  const [containerDecision, setContainerDecision] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const scaleValue = new Animated.Value(1);
  const containerItemIds = [
    "53d7f68c-f770-4a70-ad67-ee2726a1f8f3", // Stainless Steel Rice Vault - 20Kg+
    "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61", // Premium Steel Rice Storage - 35kg+
  ];
  const CONTAINER_TYPES = {
    SMALL: {
      id: "53d7f68c-f770-4a70-ad67-ee2726a1f8f3",
      WEIGHT: "10",
      NAME: "10kg Rice Container",
      Price: 2000,
    },
    LARGE: {
      id: "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61",
      WEIGHT: "26",
      NAME: "26kg Rice Container",
      Price: 2500,
    },
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  useEffect(() => {
    const loadContainerDecision = async () => {
      try {
        const savedDecision = await AsyncStorage.getItem("containerDecision");
        if (savedDecision) {
          setContainerDecision(savedDecision);
        }
      } catch (error) {
        // console.log("Error loading container decision:", error);
      }
    };

    const checkCartForContainers = () => {
      if (cartData && cartData.length > 0) {
        const containerExists = cartData.some(
          (item) =>
            item.itemId === CONTAINER_TYPES.LARGE.id ||
            item.itemId === CONTAINER_TYPES.SMALL.id
        );

        if (!containerExists && containerDecision === "yes") {
          setContainerDecision(null);
          setContainerAddedPrice(false);
          AsyncStorage.removeItem("containerDecision");
        }
      }
    };
    checkCartForContainers();
    loadContainerDecision();
  }, [cartData]);

  const handleYes = async () => {
    // setShowCode(true);
    setContainerDecision("yes");

    try {
      await AsyncStorage.setItem("containerDecision", "yes");
    } catch (error) {
      // console.log("Error saving container decision:", error);
    }
    setModalVisible(false);

    const containerId =
      hasWeight === "26kgs"
        ? CONTAINER_TYPES.LARGE.id
        : CONTAINER_TYPES.SMALL.id;
    const data = { customerId: customerId, itemId: containerId };

    try {
      const response = await handleCustomerCartData(data);

      // console.log("Container added response", response);
      if (response.data.errorMessage === "Item added to cart successfully") {
        Alert.alert(
          "Success",
          `Successfully added ${hasWeight} container to your cart`,
          [
            {
              text: "OK",
              // onPress: () => handleSoftCopydecision(),
            },
          ],
          { cancelable: false }
        );

        fetchCartData();
      } else {
        setLoader(false);
        Alert.alert("Alert", response.data.errorMessage);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const handleIncrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await increaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const handleDecrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await decreaseCartItem(item);
    // setTimeout(() => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
    // }, 5000);
  };

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await handleCustomerCartData(customerId);
      console.log("cart response", response.data);
      response.data.customerCartResponseList.map((item) => {
        if (
          (item.weight === 20 || item.weight === 35) &&
          item.status === "FREE"
        ) {
          Alert.alert(
            "🎁 Special Offer: Free Rice Container!",
            `Your cart includes a rice bag that qualifies for a FREE ${item.itemName}!\n\nNote: The container remains an Oxy Group asset until ownership is earned.\n\nAre you sure you want to avail this offer?`,
            [
              {
                text: "No",
                onPress: () => handleRemove(item),
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => {
                  setItemToRemove(item);
                  setModalVisible(true);
                },
              },
            ]
          );
        }
      });

      setTotalCartValue(response.data?.totalCartValue);

      setFreeItemPrice(response.data?.freeItemPriceTotal);
      // console.log("totalGstAmountToPay", response.data?.totalGstAmountToPay);
      setGstAmount(response.data?.totalGstAmountToPay);
      setLoading(false);
      setGrandTotal(response.data.amountToPay);
      const cartData = response?.data?.customerCartResponseList;
      const itemsGst = cartData.reduce((sum, item) => {
        if ((item?.goldGst || 0) === 0) {
          return sum + (item?.gstAmount || 0);
        }
        return sum;
      }, 0);
      setItemsGstAmount(itemsGst);
      const totalGoldGst = cartData.reduce(
        (sum, item) => sum + (item?.goldGst || 0),
        0
      );
      setGoldGstAmont(totalGoldGst);
      const totalGoldMakingCost = cartData.reduce(
        (sum, item) => sum + (item?.goldMakingCost || 0),
        0
      );
      setGoldMakingCost(totalGoldMakingCost);
      const weightArray = cartData?.map((item) => item.weight);
      if (!cartData || !Array.isArray(cartData)) {
        setCartData([]);
        setIsLimitedStock({});
        setCartItems({});
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

      const limitedStockMap = cartData.reduce((acc, item) => {
        if (item.quantity === 0) {
          acc[item.itemId] = "outOfStock";
        } else if (item.quantity <= 5) {
          acc[item.itemId] = "lowStock";
        }
        return acc;
      }, {});
      setError(null);
      setCartData(cartData);
      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
      setLoading(false);
      setLoadingItems((prevState) => ({
        ...prevState,
        [cartData.itemId]: false,
      }));
      return weightArray;
    } catch (error) {
      console.log(error);
      setError("Failed to load cart data");
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCartData();
      getProfile();
    }, [])
  );

  const onRefresh = () => {
    fetchCartData();
  };

  const getProfile = async () => {
    try {
      const response = await handleGetProfileData(customerId, token);
      if (response.status === 200) {
        if (!response.data.firstName) {
          Alert.alert(
            "Incomplete Profile",
            "Please fill out your profile to proceed.",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("Profile"),
              },
            ]
          );
          return false;
        }
        return true;
      } else {
        console.log("Unexpected response status:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Profile error:", error?.response || error);
      return false;
    }
  };

  const increaseCartItem = async (item) => {
    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await handleUserAddorIncrementCart(data);
      console.log("Increment response", response);
      fetchCartData();
    } catch (error) {
      console.error("Error incrementing cart item:", error.response);
    }
  };

  const decreaseCartItem = async (item) => {
    console.log("item to decrement", item);
    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await handleDecrementorRemovalCart(data);
      // console.log("Decrement response", response);
      // Alert.alert("Success", response.data.errorMessage);
      fetchCartData();
    } catch (error) {
      // console.log("Error decrementing cart item:", error.response);
    }
  };

  // const handleRemove = async (item) => {
  //   if (!item?.cartId) {
  //     console.error("Invalid item data for removal", item);
  //     return;
  //   }

  //   try {
  //     const itemWeight = Number(item.weight);
  //     const isWeight10or26 = itemWeight === 10 || itemWeight === 26;

  //     const freeItem = cartData.find((i) => i.status === "FREE");
  //     const sameWeightAddItems = cartData.filter(
  //       (i) => i.status === "ADD" && Number(i.weight) === itemWeight
  //     );

  //     let response;

  //     // Begin Logic Check
  //     let shouldRemoveFreeItem = false;

  //     if (freeItem && isWeight10or26) {
  //       const freeWeight = Number(freeItem.weight);

  //       if (itemWeight === 10) {
  //         if (freeWeight === 35) {
  //           // Don't remove free item if it's 35kg and removing 10kg
  //           shouldRemoveFreeItem = false;
  //         } else if (freeWeight === 20) {
  //           shouldRemoveFreeItem = sameWeightAddItems.length === 1;
  //         }
  //       } else if (itemWeight === 26) {
  //         if (freeWeight === 20) {
  //           shouldRemoveFreeItem = false;
  //         } else if (freeWeight === 35) {
  //           shouldRemoveFreeItem = sameWeightAddItems.length === 1;
  //         }
  //       }
  //     }

  //     if (shouldRemoveFreeItem) {
  //       console.log("Removing both selected item and FREE item.");
  //       // Remove selected item
  //       response = await handleRemoveItem(item.cartId);

  //       // Remove FREE item
  //       const freePayload = {
  //         id: freeItem.cartId,
  //         customerId: customerId,
  //         itemId: freeItem.itemId,
  //         status: "FREE",
  //       };
  //       response = await handleRemoveFreeItem(freePayload);
  //     } else {
  //       console.log("Removing only the selected item.");
  //       response = await handleRemoveItem(item.cartId);
  //     }

  //     console.log("Remove response:", response);
  //     Alert.alert("Success", "Item removed successfully");

  //     fetchCartData();
  //   } catch (error) {
  //     console.error("Error removing item:", error.response);
  //     Alert.alert("Error", "Failed to remove item. Please try again.");
  //   } finally {
  //     setRemovalLoading((prevState) => ({
  //       ...prevState,
  //       [item.cartId]: false,
  //     }));
  //   }
  // };

  const handleRemove = async (item) => {
    if (!item?.cartId) {
      console.error("Invalid item data for removal", item);
      return;
    }

    try {
      let response;

      if (item.status === "FREE") {
        const freePayload = {
          id: item.cartId,
          customerId: customerId,
          itemId: item.itemId,
          status: "FREE",
        };
        response = await handleRemoveFreeItem(freePayload);
      } else {
        response = await handleRemoveItem(item.cartId);
      }

      // console.log("Remove response:", response);
      Alert.alert("Success", "Item removed successfully");

      fetchCartData();
    } catch (error) {
      // console.error("Error removing item:", error.response);
      Alert.alert("Error", "Failed to remove item. Please try again.");
    } finally {
      setRemovalLoading((prevState) => ({
        ...prevState,
        [item.cartId]: false,
      }));
    }
  };

  const handleProfileCheck = async () => {
    try {
      const response = await handleGetProfileData(customerId, token);

      if (response.status === 200) {
        if (!response.data.firstName) {
          Alert.alert(
            "Incomplete Profile",
            "Please fill out your profile to proceed.",
            [
              {
                text: "OK",
                onPress: () => navigation.navigate("Profile"),
              },
            ]
          );
          return false;
        }
      } else {
        Alert.alert("Error", "Failed to fetch profile data.");
        return false;
      }

      const outOfStockItems = cartData.filter(
        (item) => isLimitedStock[item.itemId] === "outOfStock"
      );

      if (outOfStockItems.length > 0) {
        Alert.alert(
          "🚨 Some Items Are Out of Stock!",
          `The following items are currently unavailable:\n\n${outOfStockItems
            .map((item) => `- 🛑 ${item.itemName}`)
            .join("\n")}\n\nPlease remove them to proceed.`,
          [{ text: "OK", style: "cancel" }]
        );
        return false;
      }

      let insufficientStockItems = [];

      cartData.forEach((item) => {
        if (item.cartQuantity > item.quantity) {
          insufficientStockItems.push(
            `${item.itemName}: Only ${item.quantity} left, but you added ${item.cartQuantity}`
          );
        }
      });

      if (insufficientStockItems.length > 0) {
        Alert.alert(
          "Insufficient Stock",
          "Some items in your cart have insufficient stock:\n" +
            insufficientStockItems.join("\n"),
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("My Cart");
              },
            },
          ]
        );
        return false;
      }

      navigation.navigate("Checkout", {
        subtotal: cartData.reduce(
          (acc, item) =>
            acc + item.priceMrp * (cartItems[item.itemId] || item.cartQuantity),
          0
        ),
        locationdata,
        addressdata,
      });
    } catch (error) {
      console.error("Error in handleProfileCheck:", error.response);
      Alert.alert("Error", "Something went wrong while fetching profile data.");
      return false;
    }
  };

  // for empty cart component
  const EmptyCartComponent = () => {
    return (
      <View style={styles.emptyCartContainer}>
        <View style={styles.emptyCartView}>
          <LottieView
            source={require("../../../../assets/emptyLoading.json")}
            autoPlay
            loop
            style={styles.emptyCartImage}
          />
        </View>
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopNowButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.shopNowButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4B0082" />
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : cartData && cartData.length > 0 ? (
        <FlatList
          data={cartData}
          keyExtractor={(item) => item.itemId.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.cartItem,
                item.quantity === 0 && styles.outOfStockCard,
              ]}
              keyboardShouldPersistTaps="always"
            >
              {isLimitedStock[item.itemId] == "lowStock" && (
                <View style={styles.limitedStockBadge}>
                  <Text style={styles.limitedStockText}>
                    {item.quantity > 1
                      ? `${item.quantity} items left`
                      : `${item.quantity} item left`}
                  </Text>
                </View>
              )}
              {isLimitedStock[item.itemId] === "outOfStock" && (
                <View style={styles.outOfStockContainer}>
                  <Text style={styles.outOfStockText}>Out of Stock</Text>

                  <TouchableOpacity
                    onPress={() => handleDecrease(item)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeText}>Please remove it</Text>
                  </TouchableOpacity>
                </View>
              )}

              {removalLoading[item.cartId] ? (
                <View style={[styles.cartItem, styles.removalLoader]}>
                  <ActivityIndicator size="large" color="#ecb01e" />
                  <Text style={styles.removingText}>
                    Removing {item.itemName}...
                  </Text>
                </View>
              ) : (
                <>
                  {item.itemQuantity === 1 && (
                    <Text style={styles.noteText}>
                      Note: Only one free sample is allowed per user.
                    </Text>
                  )}
                  <View style={{ flexDirection: "row" }}>
                    <View>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                        onError={() => console.log("Failed to load image")}
                      />
                    </View>
                    {item.status == "FREE" && (
                      <View style={styles.offerBadge}>
                        <Text style={styles.offerBadgeText}>OFFER</Text>
                      </View>
                    )}
                    <View>
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>{item.itemName}</Text>
                        <View style={styles.priceContainer}>
                          <Text style={[styles.itemPrice, styles.crossedPrice]}>
                            MRP: ₹{item.priceMrp}
                          </Text>
                          <Text style={[styles.itemPrice, styles.boldPrice]}>
                            ₹{item.itemPrice}
                          </Text>
                        </View>
                        <Text style={{ marginTop: 5 }}>
                          {item?.priceMrp === item?.itemPrice
                            ? "(0% OFF)"
                            : `(${Math.round(
                                ((item?.priceMrp - item?.itemPrice) /
                                  item?.priceMrp) *
                                  100
                              )}% OFF)`}
                        </Text>

                        <Text style={styles.itemWeight}>
                          Weight: {item.weight}{" "}
                          {item.weight === 1
                            ? item.units.replace(/s$/, "")
                            : item.units}
                        </Text>

                        {isLimitedStock[item.itemId] !== "outOfStock" && (
                          <View style={styles.quantityContainer}>
                            <TouchableOpacity
                              style={[
                                styles.quantityButton,
                                (loadingItems[item.itemId] ||
                                  item.status === "FREE") &&
                                  styles.disabledButton,
                              ]}
                              onPress={() => handleDecrease(item)}
                              disabled={
                                loadingItems[item.itemId] ||
                                item.status === "FREE"
                              }
                            >
                              <Text style={styles.buttonText}>-</Text>
                            </TouchableOpacity>

                            {loadingItems[item.itemId] ? (
                              <ActivityIndicator
                                size="small"
                                color="#000"
                                style={styles.loader}
                              />
                            ) : (
                              <Text style={styles.quantityText}>
                                {item.cartQuantity}
                              </Text>
                            )}

                            {item.itemPrice === 1 ||
                            (containerDecision === "yes" &&
                              containerItemIds.includes(item.itemId)) ? (
                              <View
                                style={[
                                  styles.quantityButton1,
                                  item.status === "FREE" &&
                                    styles.disabledButton,
                                ]}
                                disabled={true}
                              >
                                <Text style={styles.quantityButtonText}>+</Text>
                              </View>
                            ) : (
                              <TouchableOpacity
                                style={[
                                  styles.quantityButton,
                                  (loadingItems[item.itemId] ||
                                    cartItems[item.itemId] === item.quantity ||
                                    item.status === "FREE") &&
                                    styles.disabledButton,
                                ]}
                                onPress={() => handleIncrease(item)}
                                disabled={
                                  loadingItems[item.itemId] ||
                                  cartItems[item.itemId] === item.quantity ||
                                  item.status === "FREE"
                                }
                              >
                                <Text style={styles.buttonText}>+</Text>
                              </TouchableOpacity>
                            )}

                            <Text style={styles.itemTotal}>
                              ₹{(item.itemPrice * item.cartQuantity).toFixed(2)}
                            </Text>
                          </View>
                        )}
                        {isLimitedStock[item.itemId] !== "outOfStock" && (
                          <TouchableOpacity
                            style={{ marginLeft: 100 }}
                            onPress={() => handleRemove(item)}
                          >
                            <MaterialIcons
                              name="delete"
                              size={23}
                              color="#FF0000"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <EmptyCartComponent />
      )}
      {cartData && cartData.length > 0 && (
        <>
          {!loading && (
            <View style={styles.grandTotalRowContainer}>
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Grand Total:</Text>
                <Text style={styles.grandTotalValue}>
                  ₹{(Number(grandTotal) + Number(gstAmount)).toFixed(2)}
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <TouchableOpacity
                  style={styles.priceBreakupButton}
                  onPress={() => setShowPriceBreakdown(true)}
                  // activeOpacity={0.8}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={14}
                    color="#4B0082"
                    style={{ marginRight: 2 }}
                  />
                  <Text style={styles.priceBreakupText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {showPriceBreakdown && (
            <PriceBreakdownModal
              visible={showPriceBreakdown}
              onClose={() => setShowPriceBreakdown(false)}
              totalCartValue={totalCartValue}
              freeItemPrice={freeItemPrice}
              itemsGstAmount={itemsGstAmount}
              goldGstAmount={goldGstAmount}
              goldMakingCost={goldMakingCost}
              gstAmount={gstAmount}
              grandTotal={grandTotal}
            />
          )}

          {!loading && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("Dashboard")}
              >
                <Text style={styles.actionButtonText}>Add More</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => handleProfileCheck()}
              >
                <Text style={styles.actionButtonText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <ContainerSoftCopy
        visible={modalVisible}
        hasWeight={hasWeight}
        onClose={() => setModalVisible(false)}
        addContainer={handleYes}
        cartData={cartData}
        itemToRemove={itemToRemove} // Add this
        removeItem={handleRemove}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 20,
  },
  error: {
    color: "#EF4444",
    textAlign: "center",
    marginTop: 20,
  },
  cartItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    marginLeft: 5,
    width: width * 0.3,
    height: height / 7,
    marginRight: 10,
    borderRadius: 20,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    width: width * 0.5,
  },
  itemPrice: {
    color: "#16A34A",
  },
  itemWeight: {
    color: "#6B7280",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: "#a593df",
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  quantityButton1: {
    backgroundColor: "#D1D5DB",
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  quantityText: {
    fontWeight: "bold",
    backgroundColor: "white",
  },
  removeButton: {
    backgroundColor: "#D32F2F",
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    width: 150,
    zIndex: 2,
    // position:'absolute'
  },
  removeButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 80,
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
    marginTop: 20,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    marginBottom: 70,
  },
  checkoutButton: {
    backgroundColor: COLORS.services,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginBottom: 70,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },

  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 2,
    marginBottom: 20,
    width: width / 3,
    marginTop: 15,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
  },
  card: {
    width: "80%",
    alignItems: "center",
    padding: 20,
    marginLeft: 35,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  loader: {
    alignSelf: "center",
    borderRadius: 4,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    // zIndex: 1,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    marginRight: 10,
  },
  crossedPrice: {
    textDecorationLine: "line-through",
    color: "#D32F2F",
  },
  boldPrice: {
    fontWeight: "bold",
    color: "#388E3C",
  },
  limitedStockBadge: {
    position: "absolute",
    top: 10,
    left: 30,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    zIndex: 10,
    marginBottom: 20,
  },
  limitedStockText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "gray",
    opacity: 0.5,
  },
  outOfStockCard: {
    opacity: 0.5,
  },
  outOfStockContainer: {
    position: "relative",
    padding: 10,
    backgroundColor: COLORS.backgroundcolour,
    borderRadius: 8,
    alignItems: "center",
  },
  outOfStockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  outOfStockText: {
    color: "red",
    position: "relative",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    fontSize: 16,
  },
  browseButton: {
    backgroundColor: COLORS.services,
    // padding: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  browseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  outOfStockText: {
    color: COLORS.services,
    fontSize: 14,
    fontWeight: "bold",
  },
  removeText: {
    alignSelf: "center",
    textAlign: "center",
    color: "#fff",
    zIndex: 1,
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginTop: 5,
    // backgroundColor: "#000",
    padding: 5,
    borderRadius: 5,
    overflow: "hidden",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  removingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#ecb01e",
    textAlign: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  dimItem: {
    opacity: 0.5, // Fades the item while loading
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  congratsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  messageText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },

  buttonYes: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginLeft: 25,
  },
  buttonNo: {
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 5,
    marginLeft: 15,
  },
  buttonText: {
    color: "white",
  },
  codeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 20,
  },
  titleContainer: {
    // marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#212529",
  },
  planContainer: {
    // marginBottom: 16,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 16,
    color: "#495057",
    lineHeight: 22,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ced4da",
  },
  orText: {
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#6c757d",
  },
  totalContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    color: "#495057",
  },
  value: {
    fontSize: 15,
    fontWeight: "500",
    color: "#212529",
    textAlign: "right",
  },
  discountValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2e7d32",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#dee2e6",
    marginVertical: 8,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  grandTotalLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#212529",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    textAlign: "right",
  },
  offerText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  okButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  offerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    width: "100%",
    textAlign: "center",
  },
  okButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },

  messageText: {
    textAlign: "center",
    marginVertical: 10,
  },

  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },

  // --------------
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 25,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6b00",
    marginBottom: 10,
  },
  messageText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  highlight: {
    fontWeight: "bold",
    color: "#ff6b00",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  plansContainer: {
    marginBottom: 20,
  },
  planOption: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  selectedPlan: {
    borderColor: "#ff6b00",
    backgroundColor: "#fff8f0",
  },
  radioSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#444",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ff6b00",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff6b00",
  },
  radioText: {
    fontSize: 15,
    color: "#000",
    lineHeight: 20,
    paddingLeft: 30,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonNo: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonYes: {
    flex: 2,
    paddingVertical: 12,
    backgroundColor: "#ff6b00",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ffb980",
  },
  buttonNoText: {
    color: "#555",
    fontWeight: "600",
  },
  buttonYesText: {
    color: "white",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 4,
  },
  grandTotalRowContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  offerBadge: {
    position: "absolute",
    top: -10,
    left: 5,
    backgroundColor: "#FF5722",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 8,
    zIndex: 10,
  },
  offerBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCartView: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  emptyCartImage: {
    width: "100%",
    height: "100%",
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  priceBreakupButton: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#f0f0f0",
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 8,
  },
  priceBreakupText: {
    color: "#4B0082",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default CartScreen;
