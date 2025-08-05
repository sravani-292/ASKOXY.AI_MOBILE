import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import BASE_URL from '../../../../Config';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const ComboItemsScreen = () => {
    const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const [cart, setCart] = useState({});
  const [data,setData] = useState();
  const navigation = useNavigation();

  const addToCart = (itemId, comboId, itemData) => {
    const key = `${comboId}-${itemId}`;
    
    setCart(prev => ({
      ...prev,
      [key]: {
        quantity: (prev[key]?.quantity || 0) + 1,
        comboId,
        itemId,
        itemData
      }
    }));
  };

  const removeFromCart = (itemId, comboId) => {
    const key = `${comboId}-${itemId}`;
    
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[key]) {
        if (newCart[key].quantity > 1) {
          newCart[key].quantity -= 1;
        } else {
          delete newCart[key];
        }
      }
      return newCart;
    });
  };

  const getItemQuantity = (itemId, comboId) => {
    const key = `${comboId}-${itemId}`;
    return cart[key]?.quantity || 0;
  };

  const calculateDiscount = (mrp, price) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.discountedPrice, 0);
  };

  const calculateTotalMRP = (items) => {
    return items.reduce((total, item) => total + item.itemMrp, 0);
  };

const getComboData = async () => {
  console.log("Function `getComboData` called");

  console.log("Token:", token);
  console.log("Base URL:", BASE_URL);

  try {
    const response = await axios.get(
      `${BASE_URL}product-service/combo-offers?page=0&size=10`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Raw API Response:", response.data);

    if (response.data?.content?.length > 0) {
      console.log("Combo offers fetched:", response.data.content.length);
      setData(response.data);
    } else {
      console.warn("No content found in combo offer response");
      setData(null);
    }
  } catch (error) {
    console.error("API error:", error?.response?.data || error.message || error);
  }
};


useEffect(() => {
  getComboData()
}, []);

  const renderMainItem = (comboItem) => {
    const mainItemId = `main-${comboItem.comboItemId}`;
    const quantity = getItemQuantity(mainItemId, comboItem.comboItemId);
    
    return (
      <View style={styles.individualItemContainer}>
        <View style={styles.itemImagePlaceholder}>
          <Text style={styles.itemImageText}>🍚</Text>
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>
            {comboItem.comboItemName}
          </Text>
          <Text style={styles.itemWeight}>
            {comboItem.itemWeight} {comboItem.units}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.discountedPrice}>Free with add-ons</Text>
          </View>
          <View style={styles.mainItemBadge}>
            <Text style={styles.mainItemText}>Main Item</Text>
          </View>
        </View>
        <View style={styles.itemActions}>
          {quantity > 0 ? (
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeFromCart(mainItemId, comboItem.comboItemId)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addToCartButton}
              onPress={() => addToCart(mainItemId, comboItem.comboItemId, {
                name: comboItem.comboItemName,
                weight: comboItem.itemWeight,
                units: comboItem.units,
                price: 0
              })}
            >
              <Text style={styles.addToCartText}>Add Rice</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderIndividualItem = ({ item, comboId, index }) => {
    const discount = calculateDiscount(item.itemMrp, item.itemPrice);
    // Create unique ID by combining individualItemId with combo ID and index
    const uniqueItemId = `${item.individualItemId}-${comboId}-${index}`;
    const quantity = getItemQuantity(uniqueItemId, comboId);
    
    return (
      <View style={styles.individualItemContainer}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.itemName.trim()}
          </Text>
          <Text style={styles.itemWeight}>
            {item.itemWeight} {item.units} • Qty: {item.quantity}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.discountedPrice}>₹{item.discountedPrice}</Text>
            <Text style={styles.originalPrice}>₹{item.itemPrice}</Text>
            <Text style={styles.mrpPrice}>₹{item.itemMrp}</Text>
          </View>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
          <View style={styles.addOnBadge}>
            <Text style={styles.addOnText}>Optional Add-on</Text>
          </View>
        </View>
        <View style={styles.itemActions}>
          {quantity > 0 ? (
            <View style={styles.quantityContainer}>
            <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeFromCart(uniqueItemId, comboId)}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addToCartButton}
              onPress={() => addToCart(uniqueItemId, comboId, item)}
            >
              <Text style={styles.addToCartText}>Add Extra</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderComboItem = ({ item }) => {
    return (
      <View style={styles.comboContainer}>
        <View style={styles.comboHeader}>
          <Text style={styles.comboTitle}>{item.comboItemName}</Text>
          <View style={styles.comboWeightContainer}>
            <Text style={styles.comboWeight}>{item.itemWeight} {item.units}</Text>
          </View>
        </View>

        <Text style={styles.includesLabel}>Main Item:</Text>
        <View style={styles.mainItemContainer}>
          {renderMainItem(item)}
        </View>

        <Text style={styles.includesLabel}>Optional Add-ons:</Text>
        <Text style={styles.addOnDescription}>
          You can add these items separately (each sold individually)
        </Text>
        <FlatList
          data={item.items}
          renderItem={({ item: subItem, index }) => renderIndividualItem({ 
            item: subItem, 
            comboId: item.comboItemId,
            index: index  // Pass index to create unique ID
          })}
          keyExtractor={(subItem, index) => `${subItem.individualItemId}-${item.comboItemId}-${index}`}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  };

  return (
   <View style={styles.container}>
  <View style={styles.header}>
    {getTotalCartItems() > 0 && (
      <View style={styles.cartIndicator}>
        <Text style={styles.cartText}>Cart: {getTotalCartItems()} items</Text>
      </View>
    )}
  </View>

  {data?.content ? (
    <FlatList
      data={data?.content}
      renderItem={renderComboItem}
      keyExtractor={(item) => item.comboItemId}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  ) : (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <View style={{ padding: 40, backgroundColor: "#c0c0c0" }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>No offers available</Text>
      </View>
    </View>
  )}

  {/* View Cart Button */}
  {getTotalCartItems() > 0 && (
    <View style={styles.viewCartContainer}>
      <TouchableOpacity style={styles.viewCartButton} onPress={() => navigation.navigate("My Cart")}>
        <Text style={styles.viewCartText}>View Cart ({getTotalCartItems()} items)</Text>
      </TouchableOpacity>
    </View>
  )}
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  comboContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  comboHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  comboTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  comboWeightContainer: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  comboWeight: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },
  addedToCartIndicator: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  addedToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mainItemContainer: {
    marginBottom: 16,
  },
  mainItemBadge: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  mainItemText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cartIndicator: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  cartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  comboTotalPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  totalPriceLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  totalDiscountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginRight: 8,
  },
  totalMrpPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  totalDiscountBadge: {
    backgroundColor: '#ff5722',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  totalDiscountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  includesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  addOnDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  addOnBadge: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  addOnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  individualItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageText: {
    fontSize: 32,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemWeight: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  mrpPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#ff5722',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemActions: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 8,
    minWidth: 80,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quantityButton: {
    backgroundColor: '#2e7d32',
    width: 30,
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  disabledText: {
    color: '#666',
  },
  addMainFirstText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#f44336',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewCartContainer: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: 10,
  backgroundColor: '#fff',
  borderTopWidth: 1,
  borderColor: '#ccc',
  alignItems: 'center',
},

viewCartButton: {
  backgroundColor: '#1e90ff',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 25,
  width: '90%',
  alignItems: 'center',
},

viewCartText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
});

export default ComboItemsScreen;