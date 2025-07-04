import React, { useEffect, useState, useLayoutEffect,useCallback,useRef} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
  Dimensions,
  ScrollView,
  FlatList
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation,useFocusEffect } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
import { COLORS } from "../../../../Redux/constants/theme";
import Icon from "react-native-vector-icons/Ionicons";
import BASE_URL, { userStage } from "../../../../Config";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import GoogleAnalyticsService from "../../../Components/GoogleAnalytic";
import {
  handleCustomerCartData,
  handleGetProfileData,
  handleUserAddorIncrementCart,
  handleDecrementorRemovalCart,
  handleRemoveItem,
  handleRemoveFreeItem,
} from "../../../../src/ApiService";

const ItemDetails = ({ route, navigation }) => {
  const { item } = route?.params;
  console.log("Item details page", item);

  const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;
  const [user, setUser] = useState();
  const [cartData, setCartData] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [loadingItems, setLoadingItems] = useState({});
  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [itemImages, setItemImages] = useState([]);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // ADD THIS LINE - Declare the autoScrollInterval ref
  const autoScrollInterval = useRef(null);

  useEffect(() => {
    analytic();
    fetchCartData();
  }, []);

  const analytic = async () => {
    await GoogleAnalyticsService.viewItem(
      item.itemId,
      item.itemName,
      item.itemPrice,
    )
  }

  useFocusEffect(
    useCallback(() => {
      if (item?.itemId) {
        getImages(item?.itemId);
      }
      
      // Cleanup interval when screen loses focus
      return () => {
        if (autoScrollInterval.current) {
          clearInterval(autoScrollInterval.current);
        }
      };
    }, [item])
  );

  const getImages = async (itemId) => {
    console.log("Fetching images for itemId:", itemId);
    
    try {
      const response = await axios.get(`${BASE_URL}product-service/ImagesViewBasedOnItemId?itemId=${itemId}`);
      const realImages = response?.data?.map(item => item.imageUrl).filter(Boolean);
      
      if (realImages.length > 0) {
        setItemImages(realImages);
        setCurrentIndex(0); // Reset to first image
      } else {
        setItemImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setItemImages([]);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
    }
  }).current;

  const viewConfigRef = useRef({ 
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 100 
  });

  // REMOVE THE DUPLICATE useEffect - Keep only this one
  useEffect(() => {
    // Clear existing interval
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }

    // Only start auto-scroll if we have multiple images
    if (itemImages.length > 1) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % itemImages.length;
          
          // Scroll to next image
          if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
              index: nextIndex,
              animated: true,
            });
          }
          
          return nextIndex;
        });
      }, 3000);
    }

    // Cleanup interval on unmount or when itemImages change
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [itemImages]);

  // Handle scroll begin (pause auto-scroll when user interacts)
  const onScrollBeginDrag = useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
  }, []);

  // Resume auto-scroll after user stops interacting
  const onScrollEndDrag = useCallback(() => {
    if (itemImages.length > 1) {
      autoScrollInterval.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % itemImages.length;
          
          if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
              index: nextIndex,
              animated: true,
            });
          }
          
          return nextIndex;
        });
      }, 3000);
    }
  }, [itemImages]);


  // Don't render carousel if no images - MOVE THIS CHECK TO RENDER
  const renderImageCarousel = () => {
    if (itemImages.length === 0) {
      return (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.itemImage }} style={styles.detailImage} />
        </View>
      );
    }

    return (
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={itemImages}
          keyExtractor={(item, index) => `${index}-${item}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef.current}
          onScrollBeginDrag={onScrollBeginDrag}
          onScrollEndDrag={onScrollEndDrag}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={renderImage}
        />
        
        {/* Dots indicator - only show if more than 1 image */}
        {itemImages.length > 1 && (
          <View style={styles.dotsContainer}>
            {itemImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderImage = ({ item: imageUrl, index }) => (
    <View style={styles.imageContainer}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image} 
        resizeMode="contain"
        onError={(error) => console.log('Image load error:', error)}
      />
    </View>
  );

  // REMOVED THE DUPLICATE useEffect BLOCKS

  const fetchCartData = async () => {
    console.log("fetching cart data");
    try {
      const response = await handleCustomerCartData(customerId)
      console.log("API Response from cart", response);
      const cartData = response?.data?.customerCartResponseList;
      if (!cartData || !Array.isArray(cartData) || cartData.length === 0) {
        setCartData([]);
        setCartItems({});
        setIsLimitedStock({});
        setCartCount(0);
        return;
      }

      console.log("cartData:", cartData);

      // Mapping items to their quantities
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

      console.log("Cart Items Map:", cartItemsMap);

      const limitedStockMap = cartData.reduce((acc, item) => {
        if (item.quantity === 0) {
          acc[item.itemId] = "outOfStock";
        } else if (item.quantity <= 5) {
          acc[item.itemId] = "lowStock";
        }
        return acc;
      }, {});
      console.log("Limited Stock Map:", limitedStockMap);

      // Updating state
      setCartData(cartData);
      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
      setCartCount(cartData.length);
    } catch (error) {
      console.log(error);
      console.error("Error fetching cart items:", error.response.status);
    }
  };

  const handleAdd = async (item) => {
    console.log("handle add", { item });
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await handleAddToCart(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

 

  const handleIncrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await increaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const handleDecrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await decreaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const decreaseCartItem = async (item) => {
    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await handleDecrementorRemovalCart(data);
      Alert.alert("Success", response.data.errorMessage);
      fetchCartData();
    } catch (error) {
      console.log("Error decrementing cart item:", error);
    }
  };

  const increaseCartItem = async (item) => {
    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await handleUserAddorIncrementCart(data);
      fetchCartData();
    } catch (error) {
      console.error("Error incrementing cart item:", error.response);
    }
  };

  const getCartItemById = (targetCartId) => {
    const filteredCart = cartData.filter(
      (item) => item.itemId === targetCartId
    );

    if (filteredCart.length > 0) {
      return filteredCart[0];
    } else {
      console.log("No item found with cartId:", targetCartId);
      return null;
    }
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
      fetchCartData();

      // Fetch active and eligible offers
      const [activeRes, eligibleRes] = await Promise.all([
        fetch(`${BASE_URL}cart-service/cart/activeOffers`),
        fetch(`${BASE_URL}cart-service/cart/userEligibleOffer/${customerId}`),
      ]);

      const activeOffers = await activeRes.json();
      const userEligibleOffers = await eligibleRes.json();

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
      let alertShown = false;

      // Check if user has already used an offer for this weight
      const hasUsedOfferForWeight = usedOfferWeights.includes(itemWeight);

      // 1️⃣ Check for already used offer for the same weight (non-container offers)
      if (hasUsedOfferForWeight && itemWeight !== 10 && itemWeight !== 26) {
        const usedOffer = userEligibleOffers.find(
          (o) => o.eligible && o.weight === itemWeight
        );
        if (usedOffer) {
          // setTimeout(() => {
          //   Alert.alert(
          //     "Offer Already Availed",
          //     `You have already availed the ${usedOffer.offerName} for ${itemWeight}kg.`
          //   );
          // }, 1000);
          alertShown = true;
        }
      }

      // 2️⃣ Container Offer (10kg or 26kg, only one per user)
      if (!alertShown && (itemWeight === 10 || itemWeight === 26)) {
        // Check if user has already used a container offer (10kg or 26kg)
        const hasUsedContainer = userEligibleOffers.some(
          (uo) => uo.eligible && (uo.weight === 10 || uo.weight === 26)
        );

        if (hasUsedContainer) {
          // setTimeout(() => {
          //   Alert.alert(
          //     "Container Offer Already Availed",
          //     "You have already availed a container offer. Only one container offer (10kg or 26kg) can be used."
          //   );
          // }, 1000);
          alertShown = true;
        } else {
          const matchedContainerOffer = validActiveOffers.find(
            (offer) =>
              offer.minQtyKg === itemWeight &&
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
            offer.freeItemName.toLowerCase() === item.itemName.toLowerCase()
        );

        if (matchedSpecialOffer) {
          console.log("Matched Special Offer:", matchedSpecialOffer);
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
      console.error("Add to cart error", error);
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    }
  };

  

  return (
    <View style={styles.detailsContainer}>
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
        
        {/* Render Image Carousel */}
        {renderImageCarousel()}
        
        {/* Star Ratings */}
        <View style={styles.ratingContainer}>
          {[...Array(4)].map((_, index) => (
            <FontAwesome key={index} name="star" size={20} color="gold" />
          ))}
          {/* Half Star */}
          <FontAwesome name="star-half-full" size={20} color="gold" />
          {/* Static Rating Text */}
          <Text style={styles.ratingText}>4.8/5</Text>
        </View>
        <Text style={styles.itemName}>{item.itemName.toUpperCase()}</Text>
      </View>
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, padding: 5 }}
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mrp:</Text>
            <Text style={styles.mrpvalue}>₹ {item.itemMrp}/-</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>₹ {item.itemPrice}/-</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Weight:</Text>
            <Text style={styles.itemWeight}>
              {item.weight} {item.weight === 1 ? item.units.replace(/s$/, '') : item.units}
            </Text>
          </View>
          
          {item.itemDescription && (
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionLabel}>Description:</Text>
              <Text style={styles.descriptionText}>{item.itemDescription}</Text>
            </View>
          )}
          
          <View style={styles.infoRow1}>
            <Text style={{ alignSelf: "center", alignItems: "center" }}>
              {item.itemQuantity1}
            </Text>
            {isLimitedStock[item.itemId] == "lowStock" && (
              <View style={styles.limitedStockBadge}>
                <Text style={styles.limitedStockText}>
                  {item.quantity > 1
                    ? `${item.quantity} items left`
                    : `${item.quantity} item left`}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actionRow}>
            {cartItems[item.itemId] > 0 || loadingItems[item.itemId] ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseCartItem(item)}
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

                {/* Increase Button */}
                {item.itemPrice == 1 ? (
                  <View
                    style={styles.quantityButton1}
                    onPress={() => handleIncrease(item)}
                    disabled={loadingItems[item.itemId]}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </View>
                ) : (
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
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    item.quantity === 0 ? styles.disabledButton : {},
                  ]}
                  onPress={() => handleAdd(item)}
                  disabled={item.quantity === 0}
                >
                  <Text style={styles.addbuttontext}>
                    {item.quantity === 0
                      ? "Out of Stock"
                      : loadingItems[item.itemId]
                      ? "Adding..."
                      : "Add to Cart"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.smallButton}
          >
            <Text style={styles.buttonText}>Add More</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (userData) {
                navigation.navigate("Home", { screen: "My Cart" });
              } else {
                Alert.alert("Alert", "Please login to continue", [
                  { text: "OK", onPress: () => navigation.navigate("Login") },
                  { text: "Cancel" },
                ]);
              }
            }}
            style={styles.smallButton}
          >
            <Text style={styles.buttonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ItemDetails;

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  actionRow: {
    height: height / 3,
   
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  detailImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
    backgroundColor: "#eaeaea",
    alignItems:"center",
    alignSelf:"center"
  },
  itemName: {
  marginTop: 10,
  fontSize: 15,
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
  padding: 10,
  flexWrap: "wrap",       // Add this (optional but helpful inside row layout)
},

  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  infoRow1: {
    alignSelf: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  descriptionContainer: {
    marginTop: 15,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: COLORS.services,
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    color: "#fff",
    alignItems: "center",
    alignSelf: "center",
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
    color: "#000",
  },
  loader: {
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: COLORS.services,
    width: 100,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 10,
    alignItems: "center",
    alignSelf: "center",
  },
  addbuttontext: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  ViewButton: {
    backgroundColor: COLORS.services,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 70,
  },
  viewButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 70,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: COLORS.services,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  largeButton: {
    width: "60%",
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // Text color
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    // borderWidth: 1,
    // borderColor: "#ddd",
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
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
    elevation: 4, // Adds a shadow effect
  },
  mrpvalue: {
    textDecorationLine: "line-through",
    color: "#D32F2F",
  },
  limitedStockBadge: {
    // position: "absolute",
    top: 10,
    // left: 20,
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
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    alignItems: "center",
  },
  discountBadge: {
    position: "absolute",
    top: 1,
    // bottom:1,
    left: width * 0.2,
    // right:width*0.2,
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    justifyContent:"center"
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginLeft: 5,
  },
  quantityButton1: {
    backgroundColor: "#c0c0c0",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    alignItems: "center",
  },
   carouselContainer: {
    // Add your container styles here
  },
  imageContainer: {
    width: width,
    // Add your image container styles here
  },
  image: {
    width: '100%',
    height: 300, // Adjust as needed
    // Add your image styles here
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    // Add your dots container styles here
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    // Add your dot styles here
  },
  activeDot: {
    backgroundColor: '#007AFF',
    // Add your active dot styles here
  },
  inactiveDot: {
    backgroundColor: '#C7C7CC',
    // Add your inactive dot styles here
  },
});
