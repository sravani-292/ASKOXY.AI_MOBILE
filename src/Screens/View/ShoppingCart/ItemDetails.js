import React, { useEffect, useState, useLayoutEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Modal,
  Dimensions
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../../../../Redux/constants/theme";
import {LinearGradient} from 'expo-linear-gradient';
import {FontAwesome6} from '@expo/vector-icons';

import BASE_URL from "../../../../Config";
import {
  handleCustomerCartData,
  handleUserAddorIncrementCart,
  handleDecrementorRemovalCart,
} from "../../../../src/ApiService";
import OfferModal from "./DashboardProduct/OfferModal";

import { useCart } from "../../../../until/CartCount";
import BVMCoins from "../Profile/BVMCoins";

const { width, height } = Dimensions.get("window");

const ItemDetails = ({ route }) => {
  const { item } = route?.params;
  const {setCartCount} = useCart();
  const navigation = useNavigation();
  const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;
  
  // State declarations
  const [cartItems, setCartItems] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [itemImages, setItemImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offerShow, setOfferShow] = useState(false);
  const [comboOffersData, setComboOffersData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [dynamicContent, setDynamicContent] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  
  const flatListRef = useRef(null);
  const autoScrollInterval = useRef(null);

  // Navigation setup
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <>
        {          route.params?.categoryType?(
        <TouchableOpacity 
          onPress={() => navigation.navigate("Rice Products", { 
            screen: route.params?.category, 
            categoryType: route.params?.categoryType,
            category: route.params?.category
          })} 
          style={{ marginLeft: 10 }}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={{ marginLeft: 10 }}
          >
            <Icon name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
          
        </>
      ),
    });
  }, [navigation]);

  // Initial data fetching
  useEffect(() => {
    fetchCartData();
    if (item?.itemId) {
      getImages(item?.itemId);
    }
    handleDescripion()
  }, []);

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

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (autoScrollInterval.current) {
          clearInterval(autoScrollInterval.current);
        }
      };
    }, [item])
  );

  // Image handling functions
 const getImages = async (itemId) => {
  try {
    const response = await axios.get(`${BASE_URL}product-service/ImagesViewBasedOnItemId?itemId=${itemId}`);
    const imagesData = response?.data || [];
    const realImages = Array.isArray(imagesData) 
      ? imagesData.map(item => item.imageUrl).filter(Boolean) 
      : [];
    setItemImages(realImages.length > 0 ? realImages : []);
  } catch (error) {
    console.error("Error fetching images:", error);
    setItemImages([]);
  }
};

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Cart functions
  const fetchCartData = async () => {
    try {
      const response = await handleCustomerCartData(customerId);
      const cartData = response?.data?.customerCartResponseList || [];
      
      const cartItemsMap = cartData.reduce((acc, item) => {
        if (item.itemId && item.cartQuantity !== undefined && item.status === "ADD") {
          acc[item.itemId] = item.cartQuantity;
        }
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

      const totalCartCount = cartData.reduce(
         (total, item) => total + item.cartQuantity,
         0
       );

      setCartCount(totalCartCount || 0);

      setCartItems(cartItemsMap);
      setIsLimitedStock(limitedStockMap);
    } catch (error) {
      console.error("", error);
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

    setLoadingItems(prev => ({ ...prev, [item.itemId]: true }));
    
    try {
      const data = { customerId, itemId: item.itemId };
      const response = await handleUserAddorIncrementCart(data, "ADD");
      
      Alert.alert(
        "Success",
        response.cartResponse?.errorMessage || "Item added to cart",
        [{
          text: "ok",
          onPress: () => {
            if (response.comboOffers) {
              setComboOffersData(response.comboOffers);
              setOfferShow(true);
            }
          }
        }]
      );
      
      fetchCartData();
    } catch (error) {
      console.error("Add to cart error", error);
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.itemId]: false }));
    }
  };

  const handleIncrease = async (item) => {
    setLoadingItems(prev => ({ ...prev, [item.itemId]: true }));
    try {
      await handleUserAddorIncrementCart({ customerId, itemId: item.itemId }, "Increment");
      fetchCartData();
    } catch (error) {
      console.error("Error incrementing cart item:", error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.itemId]: false }));
    }
  };

  const handleDecrease = async (item) => {
    setLoadingItems(prev => ({ ...prev, [item.itemId]: true }));
    try {
      await handleDecrementorRemovalCart({ customerId, itemId: item.itemId });
      fetchCartData();
    } catch (error) {
      console.error("Error decrementing cart item:", error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.itemId]: false }));
    }
  };

  // Render functions
  const renderImageCarousel = () => {
    const imageUrl = item?.itemImage;
    
    if (!imageUrl) return null;

    return (
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => openModal(imageUrl)}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.detailImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  const renderPriceSection = () => (
    <>
    <View >
      {item.itemMrp > item.itemPrice && (
        <>        
        <View style={{flexDirection:"row"}}>
          <Text style={styles.originalPrice}>₹{item.itemMrp}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(((item.itemMrp - item.itemPrice) / item.itemMrp) * 100)}% OFF
            </Text>
          </View>
        </View>
        <Text style={styles.currentPrice}>₹{item.itemPrice}</Text>
        

        </>
      )}

    </View>
    
    </>
  );

  const renderRatingSection = () => (
    <View style={styles.ratingContainer}>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4].map((i) => (
          <FontAwesome key={i} name="star" size={16} color="#FFD700" />
        ))}
        <FontAwesome name="star-half-full" size={16} color="#FFD700" />
      </View>
      <Text style={styles.ratingText}>4.1 (1.3k)</Text>
    </View>
  );

const renderQuantityControls = () => {
  if (cartItems[item.itemId] > 0 || loadingItems[item.itemId]) {
    return (
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleDecrease(item)}
          disabled={loadingItems[item.itemId]}
        >
          <LinearGradient
            colors={['#ff6b6b', '#ff8e53']}
            style={styles.gradientButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </LinearGradient>
        </TouchableOpacity>

        {loadingItems[item.itemId] ? (
          <ActivityIndicator size="small" color="#6200ea" />
        ) : (
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>{cartItems[item.itemId]}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.quantityButton,
            cartItems[item.itemId] === item.quantity && styles.disabledButton
          ]}
          onPress={() => handleIncrease(item)}
          disabled={loadingItems[item.itemId] || cartItems[item.itemId] === item.quantity}
        >
          <LinearGradient
             colors={['#f44336', '#ff7961']}
            style={styles.gradientButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={[
          styles.addButton,
          item.quantity === 0 && styles.disabledButton
        ]}
        onPress={() => handleAddToCart(item)}
        disabled={item.quantity === 0}
      >
        <LinearGradient
          colors={item.quantity === 0 ? ['#d3d3d3', '#a9a9a9'] : ['#6200ea', '#8b00ff']}
          style={styles.gradientAddButton}
        >
          <Text style={styles.addButtonText}>
            {item.quantity === 0 ? "Out of Stock" : "Add"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
};

  const renderDeliveryInfo = () => (
    <View style={styles.deliveryInfo}>
      <View style={styles.deliveryRow}>
        <Icon name="time-outline" size={16} color="#555" />
        <Text style={styles.deliveryText}>Estimated Delivery: 6 mins</Text>
      </View>
      <View style={styles.deliveryRow}>
        <MaterialIcons name="no-returns" size={16} color="#555" />
        <Text style={styles.deliveryText}>No Return Or Exchange</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        {renderImageCarousel()}

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.itemName}>{item.itemName}</Text>
         
          {/* Rating */}
          {renderRatingSection()}
          

           <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weight : {item.weight} {item.weight === 1 ? item.units.replace(/s$/, '') : item.units}
</Text>
            {/* <Text style={styles.infoValue}>
              {item.weight} {item.weight === 1 ? item.units.replace(/s$/, '') : item.units}
            </Text> */}
          </View>
          {/* Price */}
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                      {renderPriceSection()}

             {renderQuantityControls()}

          </View>

           <View style={styles.bmvCoinsContainer}>
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.bmvCoinsBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.bmvCoinsText}>You will get {item.bmvCoins} BMVCOINS</Text>
              
            <TouchableOpacity
              style={styles.cartButton}
              onPress={()=>setModalShow(true)}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="circle-info" color="#fff" size={24} containerStyle={styles.icon} />
            </TouchableOpacity>
            </LinearGradient>
            </View>
          
          {/* Weight */}
         
          
          {/* Description */}
          {item.itemDescription && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{item.itemDescription}</Text>
            </View>
          )}
          
          
          {/* Stock Status */}
          {isLimitedStock[item.itemId] === "lowStock" && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>
                {item.quantity > 1 ? `${item.quantity} items left` : "Last item!"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer with action buttons */}
      <View style={styles.footer}>
       
        
        <View style={styles.footerButtons}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Add More</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.primaryButton}
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
          >
            <Text style={styles.primaryButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <OfferModal
        visible={offerShow}
        comboOffers={comboOffersData}
        onClose={() => setOfferShow(false)}
      />

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
      <BVMCoins modalVisible={modalShow} onCloseModal={()=>{setModalShow(false)}} content={dynamicContent}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  detailImage: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
  },
  infoContainer: {
    padding: 20,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  netQty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  starContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#EEE',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  highlightsContainer: {
    marginTop: 15,
  },
  highlightText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  highlightBold: {
    fontWeight: 'bold',
  },
  deliveryInfo: {
    marginTop: 20,
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 8,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  stockBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6B6B',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 15,
  },
  stockText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginRight:15
  },
  quantityButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 5,
    padding:5
  },
  gradientButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quantityContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  gradientAddButton: {
    padding:10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
 
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.services,
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.services,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.services,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullImage: {
    width: width,
    height: width,
  },
   bmvCoinsBadge:{
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 12,
    // zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-between",
    marginBottom:15
  },
  bmvCoinsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    opacity: 0.9,
  },
  bmvCoinsContainer:{
    marginTop:10,
    // position:"relative",
    // top:-40,
    width:width*0.9,
    // marginBottom:10
  }
});

export default ItemDetails;