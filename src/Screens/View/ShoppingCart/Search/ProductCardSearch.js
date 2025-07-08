import React,{useState}from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const ProductCardSearch = ({
  item,
  navigation,
  cartItems,
  loadingItems,
  removalLoading,
  handleAdd,
  handleIncrease,
  handleDecrease,
  imageErrors,
  
  isLimitedStock
}) => {
  const cartQuantity = cartItems[item.itemId] || 0;
  const isLoading = loadingItems[item.itemId];
  const hasImageError = imageErrors[item.itemId];
  const stockStatus = isLimitedStock[item.itemId];
  
  const getDiscountPercentage = (mrp, price) => {
    if (!mrp || !price || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };
  
  const discountPercentage = getDiscountPercentage(item.itemMrp, item.itemPrice);

  return (
    <View style={styles.productCard}>
       <TouchableOpacity
              onPress={() => navigation.navigate("Item Details", { item })}
            >
      <View style={styles.imageContainer}>
        {!hasImageError && item.itemImage ? (
          <Image
            source={{ uri: item.itemImage }}
            style={styles.productImage}
            // onError={() => setImageErrors(prev => ({ ...prev, [item.itemId]: true }))}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="image" size={40} color="#d1d5db" />
          </View>
        )}
        
        {discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
          </View>
        )}

        {stockStatus === 'outOfStock' && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}

        {stockStatus === 'lowStock' && (
          <View style={styles.lowStockBadge}>
            <Text style={styles.lowStockText}>Low Stock</Text>
          </View>
        )}
        
        {/* Quick Add Button on Image */}
        {/* {stockStatus !== 'outOfStock' && cartQuantity === 0 && (
          <TouchableOpacity
            style={styles.quickAddButton}
            onPress={() => handleAdd(item)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="add" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        )} */}
      </View>
   </TouchableOpacity>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.itemName}
        </Text>
        
        <Text style={styles.weightText}>
          {item.weight} {item.units}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹{item.itemPrice}</Text>
          {item.itemMrp > item.itemPrice && (
            <Text style={styles.originalPrice}>₹{item.itemMrp}</Text>
          )}
        </View>

        {stockStatus !== 'outOfStock' && (
          <View style={styles.cartControls}>
            {cartQuantity === 0 ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAdd(item)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="add" size={16} color="#fff" />
                    <Text style={styles.addButtonText}>ADD</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityButton1, (isLoading || removalLoading[item.itemId]) && 
                    styles.disabledButton]}
                  onPress={() => handleDecrease(item)}
                  disabled={isLoading || removalLoading[item.itemId]}
                >
                  <MaterialIcons name="remove" size={16} color="#fff" />
                </TouchableOpacity>
                
                <View style={styles.quantityDisplay}>
                  {isLoading || removalLoading[item.itemId] ? (
                    <ActivityIndicator size="small" color="#6b21a8" />
                  ) : (
                    <Text style={styles.quantityText}>{cartQuantity}</Text>
                  )}
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    (isLoading || removalLoading[item.itemId] || cartQuantity >= item.quantity) && 
                    styles.disabledButton
                  ]}
                  onPress={() => handleIncrease(item)}
                  disabled={isLoading || removalLoading[item.itemId] || cartQuantity >= item.quantity}
                >
                  <MaterialIcons name="add" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: CARD_WIDTH,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#dc2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lowStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lowStockText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickAddButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#6b21a8',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  weightText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  cartControls: {
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6b21a8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    minHeight: 32,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    padding: 2,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4B0082',
    borderRadius: 4,
    color: '#fff',
  },
   quantityButton1: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f87171',
    borderRadius: 4,
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#CBD5E0',
  },
  quantityDisplay: {
    minWidth:30,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b21a8',
  },
});

export default ProductCardSearch;