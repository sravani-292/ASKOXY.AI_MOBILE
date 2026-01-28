import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BASE_URL from '../../../Config';
import PromoCarousel from './PromoBanner';

const { width } = Dimensions.get('window');

const NewDashBoard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
    console.log("srvice screen");
  // Memoize categories to prevent recreation
  const categories = useMemo(() => [
    { name: 'All', icon: '🛒' },
    { name: 'Grocery', icon: '🥬' },
    { name: 'Rice', icon: '🍚' },
    { name: 'Gold', icon: '💍' },
  ], []);

  // Optimize API call with useCallback
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('https://meta.oxyloans.com/api/product-service/showGroupItemsForCustomrs');
      const data = await response.json();
      setApiData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Optimize filtering with useMemo
  const computedFilteredData = useMemo(() => {
    let result = apiData;

    // Apply tab filter
    if (activeTab !== 'All') {
      result = result.filter(item => 
        item.categoryType.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery.trim() !== '') {
      result = result.map(categoryType => ({
        ...categoryType,
        categories: categoryType.categories.map(category => ({
          ...category,
          itemsResponseDtoList: category.itemsResponseDtoList.filter(item =>
            item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
          )
        })).filter(category => category.itemsResponseDtoList.length > 0)
      })).filter(categoryType => categoryType.categories.length > 0);
    }

    return result;
  }, [apiData, activeTab, searchQuery]);

  // Update filtered data when computed data changes
  useEffect(() => {
    setFilteredData(computedFilteredData);
  }, [computedFilteredData]);

  // Optimize cart functions with useCallback
  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.itemId === item.itemId);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  }, []);

  const getItemInCart = useCallback((itemId) => {
    return cartItems.find(item => item.itemId === itemId);
  }, [cartItems]);

  const calculateDiscount = useCallback((mrp, price) => {
    return Math.round(((mrp - price) / mrp) * 100);
  }, []);

  // Memoize cart calculations
  const { totalCartItems, totalCartValue } = useMemo(() => {
    const items = cartItems.reduce((total, item) => total + item.quantity, 0);
    const value = cartItems.reduce((total, item) => total + (item.itemPrice * item.quantity), 0);
    return { totalCartItems: items, totalCartValue: value };
  }, [cartItems]);

  // Optimize header rendering with useCallback
  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={20} color="#FF6B35" />
        <View style={styles.locationText}>
          <Text style={styles.deliveryText}>Delivery to Sai Krishna</Text>
          <Text style={styles.addressText}>
            Lig 24, 3rd Floor, K P H B Phase 7, Kukatpally, Hyderabad, Telang...
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.profileButton}>
        <Ionicons name="person" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  ), []);

  // Optimize search bar with useCallback
  const renderSearchBar = useCallback(() => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search for products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#999"
      />
      <TouchableOpacity style={styles.micButton}>
        <Ionicons name="mic" size={20} color="#FF6B35" />
      </TouchableOpacity>
    </View>
  ), [searchQuery]);

  // Optimize category rendering
  const renderCategoryItem = useCallback(({ item: category }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        activeTab === category.name && styles.activeCategoryButton,
      ]}
      onPress={() => setActiveTab(category.name)}
    >
      <View style={styles.categoryIcon}>
        <Text style={styles.categoryEmoji}>{category.icon}</Text>
      </View>
      <Text
        style={[
          styles.categoryText,
          activeTab === category.name && styles.activeCategoryText,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  ), [activeTab]);

  const renderCategories = useCallback(() => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.name}
          style={[
            styles.categoryButton,
            activeTab === category.name && styles.activeCategoryButton,
          ]}
          onPress={() => setActiveTab(category.name)}
        >
          <View style={styles.categoryIcon}>
            <Text style={styles.categoryEmoji}>{category.icon}</Text>
          </View>
          <Text
            style={[
              styles.categoryText,
              activeTab === category.name && styles.activeCategoryText,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  ), [activeTab, categories]);

  // Optimize product card rendering
  const renderProductCard = useCallback((item) => {
    const cartItem = getItemInCart(item.itemId);
    const discount = calculateDiscount(item.itemMrp, item.itemPrice);
    
    return (
      <View key={item.itemId} style={styles.productCard}>
        <View style={styles.productHeader}>
          {/* <Text style={styles.deliveryTime}>9 MINS</Text> */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addToCart(item)}
          >
            {cartItem ? (
              <View style={styles.cartQuantity}>
                <Text style={styles.cartQuantityText}>{cartItem.quantity}</Text>
              </View>
            ) : (
              <Ionicons name="add" size={20} color="#4ECDC4" />
            )}
          </TouchableOpacity>
        </View>
        <Image 
          source={{ uri: item.itemImage }} 
          style={styles.productImage}
          resizeMode="contain"
          // Add image optimization
          loadingIndicatorSource={require('../../../assets/SVG/askoxy.png')}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productWeight}>{item.weight}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.itemName}</Text>
          <View style={styles.priceContainer}>
            {discount > 0 && (
              <Text style={styles.discountBadge}>{discount}% OFF</Text>
            )}
            <Text style={styles.price}>₹{item.itemPrice}</Text>
            {item.itemMrp > item.itemPrice && (
              <Text style={styles.originalPrice}>₹{item.itemMrp}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }, [getItemInCart, calculateDiscount, addToCart]);

  // Optimize category section rendering
  const renderCategorySection = useCallback((categoryTypeData) => {
    return (
      <View key={categoryTypeData.categoryType}>
        {categoryTypeData.categories.map((category) => (
          <View key={category.categoryName} style={styles.categorySection}>
            <View style={styles.sectionHeader}>
              <View style={styles.categoryHeaderContent}>
                <Image 
                  style={styles.categoryLogo} 
                  source={{uri: category.categoryLogo}} 
                  resizeMode="cover"
                />
                <Text style={styles.sectionTitle}>{category.categoryName}</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.productsScroll}
              // Add performance optimizations
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              windowSize={10}
            >
              {category.itemsResponseDtoList.map(renderProductCard)}
            </ScrollView>
          </View>
        ))}
      </View>
    );
  }, [renderProductCard]);

  // Optimize bottom bar rendering
  const renderBottomBar = useCallback(() => (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.bottomBarItem}>
        <Ionicons name="home" size={24} color="#666" />
        <Text style={styles.bottomBarText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomBarItem}>
        <Ionicons name="flash" size={24} color="#FF6B35" />
        <Text style={[styles.bottomBarText, { color: '#FF6B35' }]}>Instamart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomBarItem}>
        <Ionicons name="grid" size={24} color="#666" />
        <Text style={styles.bottomBarText}>Categories</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomBarItem}>
        <Ionicons name="refresh" size={24} color="#666" />
        <Text style={styles.bottomBarText}>Reorder</Text>
      </TouchableOpacity>
    </View>
  ), []);

  // Optimize cart button rendering
  const renderCartButton = useCallback(() => (
    <TouchableOpacity style={styles.cartButton}>
      <View style={styles.cartButtonContent}>
        <Text style={styles.cartButtonText}>
          {totalCartItems} items | ₹{totalCartValue}
        </Text>
        <Text style={styles.cartButtonSubtext}>Go to cart</Text>
      </View>
      <Ionicons name="arrow-forward" size={20} color="#fff" />
    </TouchableOpacity>
  ), [totalCartItems, totalCartValue]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderHeader()}
      {renderSearchBar()}
      {renderCategories()}
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        // Add performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      >
        <PromoCarousel />
        
        {filteredData.length > 0 ? (
          filteredData.map(renderCategorySection)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No products found for your search' : 'No products available'}
            </Text>
          </View>
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {cartItems.length > 0 && renderCartButton()}
      {/* {renderBottomBar()} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 8,
    flex: 1,
  },
  deliveryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  micButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 8,
    marginBottom: 10,
    // height: 60,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeCategoryButton: {
    borderBottomWidth: 3,
    borderBottomStyle: 'solid',
    borderBottomColor: '#FF6B35',
    borderRadius: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 44,
  },
  activeCategoryText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  content: {
    // flex: 1,
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryLogo: {
    height: 35,
    width: 35,
    borderRadius: 100,
    marginRight: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    
  },
  seeAll: {
    fontSize: 14,
    color: '#FF6B35',
  },
  productsScroll: {
    paddingHorizontal: 16,
  },
  productCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryTime: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  cartQuantity: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartQuantityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productWeight: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  discountBadge: {
    fontSize: 10,
    color: '#FF6B35',
    backgroundColor: '#FFF3F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
  cartButton: {
    backgroundColor: '#4ECDC4',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartButtonContent: {
    flex: 1,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cartButtonSubtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
  },
  bottomBarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomBarText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default NewDashBoard;