import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import axios from 'axios';
import BASE_URL from '../../../../Config';


const { width, height } = Dimensions.get('window');

const ComboOffersList = ({
  cart = [],
  onAddToCart,
  onRemoveFromCart,
  onCartChange = () => {},
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);

  // Helper function to get item quantity from cart array
  const getItemQuantity = (itemId) => {
    if (!Array.isArray(cart)) return 0;
    
    const cartItem = cart.find(item => item.itemId === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Helper function to get cart item by ID
  const getCartItem = (itemId) => {
    if (!Array.isArray(cart)) return null;
    return cart.find(item => item.itemId === itemId);
  };

  // Helper function to get cart ID for an item
  const getCartId = (itemId) => {
    if (!Array.isArray(cart)) return null;
    const cartItem = cart.find(item => item.itemId === itemId);
    return cartItem ? cartItem.cartId : null;
  };

  // Check if base item exists in cart
  const hasBaseItemInCart = (comboId) => {
    return getItemQuantity(comboId) > 0;
  };

  // Get selected addon for a combo (items with status: "COMBO")
  const getSelectedAddonForCombo = (comboId) => {
    if (!Array.isArray(cart)) return null;
    
    const addonItem = cart.find(item => 
      item.status === 'COMBO' && item.comboId === comboId
    );
    return addonItem ? addonItem.itemId : null;
  };

  const calculateDiscount = (mrp, price) => {
    if (!mrp || !price || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  // Function to chunk data into rows
  const chunkData = (data, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const getComboData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}product-service/combo-offers?page=0&size=10`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setData(res.data?.content || []);
    } catch (err) {
      console.error('Combo fetch error:', err?.message || err);
      Alert.alert('Error', 'Failed to load combo offers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add base item to cart
  const handleAddBaseItem = (combo) => {
    const baseCartItem = {
      itemId: combo.comboItemId,
      itemName: combo.comboItemName,
      itemPrice: combo.itemPrice,
      priceMrp: combo.itemMrp,
      quantity: 1,
      weight: combo.itemWeight,
      units: combo.units,
      image: combo.imageUrl,
      totalPrice: combo.itemPrice,
      status: 'ADD',
    };
    
    onAddToCart(baseCartItem);
    
    // Open modal after adding base item
    setTimeout(() => {
      openComboModal(combo);
    }, 100);
  };

  // Handle addon selection
  const handleAddonSelection = (addonData, comboId) => {
    // Remove existing addon if any
    const existingAddon = cart.find(item => 
      item.status === 'COMBO' && item.comboId === comboId
    );
    
    if (existingAddon && existingAddon.cartId) {
      onRemoveFromCart(existingAddon.cartId);
    }
    
    // Add new addon with status: "COMBO"
    const addonCartItem = {
      itemId: addonData.individualItemId,
      itemName: addonData.itemName,
      itemPrice: addonData.discountedPrice,
      priceMrp: addonData.itemMrp,
      quantity: 1,
      weight: addonData.itemWeight,
      units: addonData.units,
      image: addonData.imageUrl,
      totalPrice: addonData.discountedPrice,
      status: 'COMBO',
      comboId: comboId, // Reference to the base combo item
    };
    
    onAddToCart(addonCartItem);
    setModalVisible(false);
  };

  // Remove addon from cart
  const handleRemoveAddon = (addonId) => {
    const cartId = getCartId(addonId);
    if (cartId) {
      onRemoveFromCart(cartId);
    }
  };

  // Remove base item and all associated addons
  const handleRemoveBaseItem = (comboId) => {
    // Remove base item
    const baseCartId = getCartId(comboId);
    if (baseCartId) {
      console.log(`Removing base item with cartId: ${baseCartId}`);
      
      onRemoveFromCart(baseCartId);
    }
    
    // Remove associated addons
    const addonsToRemove = cart.filter(item => 
      item.status === 'COMBO' && item.comboId === comboId
    );
    
    addonsToRemove.forEach(addon => {
      if (addon.cartId) {
        onRemoveFromCart(addon.cartId);
      }
    });
  };

  const openComboModal = (combo) => {
    setSelectedCombo(combo);
    setModalVisible(true);
  };

  useEffect(() => {
    getComboData();
  }, []);

  useEffect(() => {
    if (Array.isArray(cart)) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
      onCartChange({ totalItems, totalPrice });
    }
  }, [cart]);

  const renderComboCard = ({ item }) => {
    const disabled = item?.disabled;
    const baseQty = getItemQuantity(item.comboItemId);
    const selectedAddon = getSelectedAddonForCombo(item.comboItemId);
    const hasBaseItem = hasBaseItemInCart(item.comboItemId);

    return (
      <View style={[styles.comboCard, disabled && styles.disabledCard]}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {item.imageUrl ? (
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imageText}>🥤</Text>
            </View>
          )}
          {selectedAddon && (
            <View style={styles.comboBadge}>
              <Text style={styles.comboText}>COMBO</Text>
            </View>
          )}
        </View>

        {/* Product Details */}
        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.comboItemName}
          </Text>
          <Text style={styles.productWeight}>
            {item.itemWeight} {item.units}
          </Text>
          
          {/*{hasBaseItem && (
            <View style={styles.comboActiveIndicator}>
              <Text style={styles.comboActiveText}>
                {selectedAddon ? '✓ Combo Active' : '⚠️ Select Add-on'}
              </Text>
            </View>
          )}*/}
        </View>

        {/* Price and Add/Remove Button */}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>₹{item.itemPrice || 0}</Text>
            {item.itemMrp && item.itemMrp > item.itemPrice && (
              <Text style={styles.originalPrice}>₹{item.itemMrp}</Text>
            )}
          </View>
          
          {hasBaseItem ? (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveBaseItem(item.comboItemId)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={disabled}
              style={[
                styles.addButton,
                disabled && styles.disabledButton
              ]}
              onPress={() => handleAddBaseItem(item)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderRow = ({ item: rowData, index }) => {
    return (
      <View style={styles.row}>
        <FlatList
          data={rowData}
          renderItem={renderComboCard}
          keyExtractor={(item) => item.comboItemId}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.horizontalSeparator} />}
          contentContainerStyle={styles.rowContainer}
        />
      </View>
    );
  };

  const renderModalContent = () => {
    if (!selectedCombo) return null;

    const baseQty = getItemQuantity(selectedCombo.comboItemId);
    const selectedAddon = getSelectedAddonForCombo(selectedCombo.comboItemId);

    return (
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        />
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedCombo.comboItemName}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalBody}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Base Item Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Base Item (Added to Cart)</Text>
              <View style={[styles.modalItem, styles.baseItemSelected]}>
                <View style={styles.modalItemImage}>
                  {selectedCombo.imageUrl ? (
                    <Image 
                      source={{ uri: selectedCombo.imageUrl }} 
                      style={styles.modalItemImageStyle}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.modalItemEmoji}>🥤</Text>
                  )}
                </View>
                <View style={styles.modalItemDetails}>
                  <Text style={styles.modalItemName}>{selectedCombo.comboItemName}</Text>
                  <Text style={styles.modalItemSize}>
                    {selectedCombo.itemWeight} {selectedCombo.units}
                  </Text>
                  <Text style={styles.modalItemPrice}>₹{selectedCombo.itemPrice || 0}</Text>
                </View>
                <View style={styles.modalItemStatus}>
                  <Text style={styles.modalItemStatusText}>✓ Added</Text>
                </View>
              </View>
            </View>

            {/* Add-ons Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>
                Choose Add-on {selectedAddon && '(1 selected)'}
              </Text>
              <Text style={styles.modalSectionSubtitle}>
                Select one item to complete your combo and get special pricing
              </Text>
              
              {selectedCombo.items?.map((subItem, index) => {
                const discount = calculateDiscount(subItem.itemMrp, subItem.discountedPrice);
                const isSelected = selectedAddon === subItem.individualItemId;

                return (
                  <View key={`${subItem.individualItemId}-${index}`} style={[styles.modalItem, isSelected && styles.selectedModalItem]}>
                    <View style={styles.modalItemImage}>
                      {subItem.imageUrl ? (
                        <Image 
                          source={{ uri: subItem.imageUrl }} 
                          style={styles.modalItemImageStyle}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={styles.modalItemEmoji}>🥤</Text>
                      )}
                    </View>
                    <View style={styles.modalItemDetails}>
                      <Text style={styles.modalItemName}>{subItem.itemName}</Text>
                      <Text style={styles.modalItemSize}>
                        {subItem.itemWeight} {subItem.units}
                      </Text>
                      <View style={styles.modalPriceRow}>
                        <Text style={styles.modalItemPrice}> ₹{subItem.discountedPrice}</Text>
                        {subItem.itemMrp > subItem.discountedPrice && (
                          <Text style={styles.modalItemOriginalPrice}>₹{subItem.itemMrp}</Text>
                        )}
                      </View>
                      {discount > 0 && (
                        <Text style={styles.modalItemDiscount}>{discount}% Off</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.modalAddButton,
                        isSelected ? styles.modalRemoveButton : styles.modalAddButtonActive
                      ]}
                      onPress={() =>
                        isSelected
                          ? handleRemoveAddon(subItem.individualItemId)
                          : handleAddonSelection(subItem, selectedCombo.comboItemId)
                      }
                    >
                      <Text style={[
                        styles.modalAddButtonText,
                        isSelected && styles.modalRemoveButtonText
                      ]}>
                        {isSelected ? 'Remove' : 'Select'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            {/* Instructions */}
            <View style={styles.modalInstructions}>
              <Text style={styles.modalInstructionsText}>
                💡 Base item is already added to cart. Select an add-on to complete your combo!
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading combo offers...</Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No ombco offers available</Text>
      </View>
    );
  }

  // Chunk data into rows of maximum items per row
  const itemsPerRow = Math.max(1, Math.ceil(data.length / 2)); // Distribute items across 2 rows
  const chunkedData = chunkData(data, itemsPerRow);

  return (
    <>
      <FlatList
        data={chunkedData}
        renderItem={renderRow}
        keyExtractor={(item, index) => `row-${index}`}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  row: {
    marginBottom: 8,
  },
  rowContainer: {
    paddingHorizontal: 8,
  },
  rowSeparator: {
    height: 12,
  },
  horizontalSeparator: {
    width: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  comboCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    width: (width - 64) / 2.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  disabledCard: {
    opacity: 0.5,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 32,
  },
  comboBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF9800',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  comboText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  productDetails: {
    marginBottom: 12,
    height: 40,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
  },
  productWeight: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  comboActiveIndicator: {
    backgroundColor: '#e8f5e8',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  comboActiveText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: 'bold',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  originalPrice: {
    fontSize: 12,
    color: 'red',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 60,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#ff5252',
    borderWidth: 1,
    borderColor: '#ff5252',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 60,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.85,
    minHeight: height * 0.6,
    width: width,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  modalBody: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalSectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedModalItem: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  baseItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  modalItemImage: {
    width: 50,
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  modalItemImageStyle: {
    width: '100%',
    height: '100%',
  },
  modalItemEmoji: {
    fontSize: 24,
  },
  modalItemDetails: {
    flex: 1,
  },
  modalItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#33',
    marginBottom: 2,
  },
  modalItemSize: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  modalItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  modalItemOriginalPrice: {
    fontSize: 12,
    color: 'red',
    textDecorationLine: 'line-through',

  },
  modalItemDiscount: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  modalItemStatus: {
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalItemStatusText: {
    fontSize: 10,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  modalAddButton: {
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 60,
    borderWidth: 1,
  },
  modalAddButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  modalRemoveButton: {
    backgroundColor: '#fff',
    borderColor: '#ff5252',
  },
  modalAddButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
  },
  modalRemoveButtonText: {
    color: '#ff5252',
  },
  modalInstructions: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#ff9800',
  },
  modalInstructionsText: {
    fontSize: 12,
    color: '#e65100',
    lineHeight: 16,
  },
});

export default ComboOffersList;