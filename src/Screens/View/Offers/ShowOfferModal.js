import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PromoBannerList from './PromoBannerList';
import useServiceScreenData from '../../ServiceScreen/hooks/useServiceScreenData';

const mockComboOffers = {
  content: [
    {
      comboItemId: '1',
      comboItemName: 'Sri Lalitha HMT Special Combo',
      itemWeight: 26,
      units: 'kgs',
      minQty: 0,
      imageUrl: null,
      items: [
        {
          itemName: 'Premium Cashews Whole',
          discountedPrice: 86,
          itemWeight: 1,
          units: 'kgs',
          quantity: 1,
        },
        {
          itemName: 'Basmati Rice Premium',
          discountedPrice: 150,
          itemWeight: 5,
          units: 'kgs',
          quantity: 1,
        },
        {
          itemName: 'Organic Almonds',
          discountedPrice: 120,
          itemWeight: 0.5,
          units: 'kgs',
          quantity: 2,
        },
      ],
    },
    {
      comboItemId: '2',
      comboItemName: 'Family Pack Rice & Pulses',
      itemWeight: 15,
      units: 'kgs',
      minQty: 1,
      imageUrl: null,
      items: [
        {
          itemName: 'Toor Dal',
          discountedPrice: 80,
          itemWeight: 2,
          units: 'kgs',
          quantity: 1,
        },
        {
          itemName: 'Moong Dal',
          discountedPrice: 75,
          itemWeight: 1,
          units: 'kgs',
          quantity: 1,
        },
      ],
    },
  ],
};

const mockIndividualOffers = [
  {
    id: 'i1',
    offerName: 'Buy 2kg Premium HMT + Get Free Rice',
    minQtyKg: 2,
    minQty: 2,
    freeItemName: 'Premium HMT Rice',
    freeQty: 1,
    freeOnce: true,
    active: true,
  },
  {
    id: 'i2',
    offerName: 'Bulk Purchase Discount - 5kg',
    minQtyKg: 5,
    minQty: 5,
    freeItemName: 'Cooking Oil',
    freeQty: 1,
    freeOnce: false,
    active: true,
  },
  {
    id: 'i3',
    offerName: 'Weekend Special - 3kg Pack',
    minQtyKg: 3,
    minQty: 3,
    freeItemName: 'Spice Mix',
    freeQty: 2,
    freeOnce: true,
    active: false,
  },
];

const ShowOfferModal = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('combo');
  const [minWeight, setMinWeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const {  
    addToCart,
    removeFromCart, 
    setCart,
    cart, 
    setSummary,
    summary,
  } = useServiceScreenData();

  // Memoized categories for better performance
  const categories = useMemo(() => [
    // { key: 'all', label: 'All Offers' },
    { key: 'combo', label: 'Combo Deals' },
    // { key: 'individual', label: 'Individual Offers' },
  ], []);

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const comboData = mockComboOffers;
      const individualData = mockIndividualOffers;
      const combined = [];

      // Process combo offers
      comboData.content.forEach((combo) => {
        const totalPrice = combo.items.reduce(
          (sum, item) => sum + (item.discountedPrice * item.quantity),
          0
        );
        const totalItems = combo.items.length;
        
        combined.push({
          id: combo.comboItemId,
          title: combo.comboItemName,
          category: 'combo',
          weight: combo.itemWeight,
          unit: combo.units,
          type: 'combo',
          items: combo.items,
          totalPrice,
          totalItems,
          description: `${totalItems} items included`,
        });
      });

      // Process individual offers (only active ones)
      individualData
        .filter(offer => offer.active)
        .forEach((offer) => {
          combined.push({
            id: offer.id,
            title: offer.offerName,
            category: 'individual',
            weight: offer.minQtyKg,
            unit: 'kg',
            type: 'individual',
            freeItemName: offer.freeItemName,
            freeQty: offer.freeQty,
            minQty: offer.minQty,
            freeOnce: offer.freeOnce,
            description: `Get ${offer.freeQty} ${offer.freeItemName} free`,
          });
        });

      setOffers(combined);
      setFilteredOffers(combined);
    } catch (err) {
      setError('Failed to load offers. Please try again.');
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const filterOffers = useCallback(() => {
    let filtered = [...offers];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((offer) => offer.category === selectedCategory);
    }

    // Weight range filter
    if (minWeight || maxWeight) {
      filtered = filtered.filter((offer) => {
        const weight = offer.weight;
        const min = minWeight ? parseFloat(minWeight) : 0;
        const max = maxWeight ? parseFloat(maxWeight) : Infinity;
        
        // Validate weight range
        if (min > max && maxWeight) {
          return false;
        }
        
        return weight >= min && weight <= max;
      });
    }

    setFilteredOffers(filtered);
  }, [offers, selectedCategory, minWeight, maxWeight]);

  useEffect(() => {
    filterOffers();
  }, [filterOffers]);

  const openModal = useCallback((offer) => {
    setSelectedOffer(offer);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedOffer(null);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory('combo');
    setMinWeight('');
    setMaxWeight('');
  }, []);

  const handleWeightInput = useCallback((text, type) => {
    // Allow only numbers and decimal point
    const cleanText = text.replace(/[^0-9.]/g, '');
    
    if (type === 'min') {
      setMinWeight(cleanText);
    } else {
      setMaxWeight(cleanText);
    }
  }, []);

  const retryFetch = useCallback(() => {
    fetchOffers();
  }, [fetchOffers]);

  const CategoryButton = ({ category, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        isSelected && styles.selectedCategory,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.buttonText,
        isSelected && styles.selectedButtonText,
      ]}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );

  const OfferItem = ({ offer }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openModal(offer)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title} numberOfLines={2}>
          {offer.title}
        </Text>
        <View style={[
          styles.badge,
          offer.type === 'combo' ? styles.comboBadge : styles.individualBadge
        ]}>
          <Text style={styles.badgeText}>
            {offer.type === 'combo' ? 'COMBO' : 'OFFER'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={1}>
        {offer.description}
      </Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.details}>
          Weight: {offer.weight} {offer.unit}
        </Text>
        {offer.type === 'combo' && (
          <Text style={styles.price}>₹{offer.totalPrice}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No offers found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your filters or check back later
      </Text>
      <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
        <Text style={styles.clearButtonText}>Clear Filters</Text>
      </TouchableOpacity>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
      <Text style={styles.errorSubtitle}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={retryFetch}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007aff" />
          <Text style={styles.loadingText}>Loading offers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && offers.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Special Offers</Text>
      </View>

      {/* Category Filters */}
      {/* <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <CategoryButton
            key={category.key}
            category={category}
            isSelected={selectedCategory === category.key}
            onPress={() => setSelectedCategory(category.key)}
          />
        ))}
      </ScrollView> */}

      {/* Offers List */}
      {/* {selectedCategory === 'combo' && (  
        <ComboOffersList 
           cart = {cart}
           onAddToCart={addToCart}
           onRemoveFromCart={removeFromCart}
            setCart={setCart}
            setSummary={setSummary}
           />
        )} */}
      <PromoBannerList />

       {/* <FlatList
        data={filteredOffers}
         horizontal
         keyExtractor={(item) => item.id}
         renderItem={({ item }) => <OfferItem offer={item} />}
         contentContainerStyle={styles.listContainer}
         showsVerticalScrollIndicator={false}
         ListEmptyComponent={renderEmptyState}
        refreshing={loading}
         onRefresh={retryFetch}
       /> */}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedOffer && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle} numberOfLines={3}>
                      {selectedOffer.title}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeIcon}
                      onPress={closeModal}
                    >
                      <Text style={styles.closeIconText}>×</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalContent}>
                    <Text style={styles.modalDetails}>
                      Weight: {selectedOffer.weight} {selectedOffer.unit}
                    </Text>

                    {selectedOffer.type === 'combo' && (
                      <View style={styles.comboSection}>
                        <Text style={styles.sectionTitle}>Combo Items:</Text>
                        {selectedOffer.items.map((item, index) => (
                          <View key={index} style={styles.comboItem}>
                            <Text style={styles.comboItemName}>
                              • {item.itemName}
                            </Text>
                            <Text style={styles.comboItemDetails}>
                              {item.quantity} × {item.itemWeight} {item.units} - ₹{item.discountedPrice}
                            </Text>
                          </View>
                        ))}
                        <View style={styles.totalSection}>
                          <Text style={styles.totalText}>
                            Total: ₹{selectedOffer.totalPrice}
                          </Text>
                        </View>
                      </View>
                    )}

                    {selectedOffer.type === 'individual' && (
                      <View style={styles.individualSection}>
                        <Text style={styles.sectionTitle}>Offer Details:</Text>
                        <Text style={styles.offerDetail}>
                          Free Item: {selectedOffer.freeItemName}
                        </Text>
                        <Text style={styles.offerDetail}>
                          Free Quantity: {selectedOffer.freeQty}
                        </Text>
                        <Text style={styles.offerDetail}>
                          Minimum Purchase: {selectedOffer.minQty} kg
                        </Text>
                        <Text style={styles.offerDetail}>
                          Offer Type: {selectedOffer.freeOnce ? 'One-time' : 'Repeatable'}
                        </Text>
                      </View>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryScroll: {
    maxHeight: 60,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#e8f4f8',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#d1ecf1',
  },
  selectedCategory: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  buttonText: {
    color: '#007aff',
    fontWeight: '600',
    fontSize: 14,
  },
  selectedButtonText: {
    color: 'white',
  },
  weightFilterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  weightFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  weightInput: {
    flex: 1,
    padding: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  weightSeparator: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 1,
    minWidth: 300,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  comboBadge: {
    backgroundColor: '#ff9500',
  },
  individualBadge: {
    backgroundColor: '#34c759',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    fontSize: 13,
    color: '#666',
  },
  price: {
    fontSize: 16,
    color: '#007aff',
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff3b30',
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 10,
  },
  closeIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },
  closeIconText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  modalDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  comboSection: {
    marginBottom: 20,
  },
  comboItem: {
    marginBottom: 12,
    paddingLeft: 10,
  },
  comboItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  comboItemDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  totalSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007aff',
  },
  individualSection: {
    marginBottom: 20,
  },
  offerDetail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 10,
  },
  closeButton: {
    backgroundColor: '#007aff',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ShowOfferModal;