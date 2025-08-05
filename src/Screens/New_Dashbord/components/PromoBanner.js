import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import BASE_URL from '../../../../Config';

// Get initial dimensions
const { width: initialScreenWidth, height: initialScreenHeight } = Dimensions.get('window');

const PROMO_API = `${BASE_URL}product-service/getComboActiveInfo`;

const PromoCarousel = ({ onExplore, autoScrollInterval = 3000, enableAutoScroll = true }) => {
  const [promoData, setPromoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  // State for dynamic dimensions
  const [screenDimensions, setScreenDimensions] = useState({
    width: initialScreenWidth,
    height: initialScreenHeight,
  });
  
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const autoScrollTimer = useRef(null);
  const scrollTimeout = useRef(null);

  // Listen for dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  // Calculate responsive dimensions
  const responsiveDimensions = useMemo(() => {
    const { width } = screenDimensions;
    const padding = 32; // 16px on each side
    const itemWidth = width - padding;
    const itemSeparatorWidth = 16;
    
    return {
      itemWidth,
      itemSeparatorWidth,
      containerPadding: 16,
      snapToInterval: itemWidth + itemSeparatorWidth,
    };
  }, [screenDimensions]);

  useEffect(() => {
    fetchPromoData();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (enableAutoScroll && promoData.length > 1 && !isUserScrolling) {
      startAutoScroll();
    }
    
    return () => {
      stopAutoScroll();
    };
  }, [enableAutoScroll, promoData.length, isUserScrolling, currentIndex]);

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    autoScrollTimer.current = setInterval(() => {
      if (flatListRef.current && promoData.length > 1) {
        const nextIndex = (currentIndex + 1) % promoData.length;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setCurrentIndex(nextIndex);
      }
    }, autoScrollInterval);
  }, [currentIndex, promoData.length, autoScrollInterval]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  }, []);

  const fetchPromoData = async () => {
    try {
      const response = await fetch(PROMO_API);
      const data = await response.json();
      setPromoData(data);
    } catch (error) {
      console.error('Error fetching promo data:', error);
      setPromoData([{
        itemName: "Fresh Grocery Delivered",
        itemDescription: "Get the freshest groceries delivered to your doorstep",
        imageUrl: null
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Memoize offer details extraction to prevent recalculation
  const extractOfferDetails = useCallback((itemName, itemDescription) => {
    const saveMatch = itemName.match(/save ₹(\d+)/i);
    const priceMatch = itemName.match(/₹(\d+)!/);
    const weightMatch = itemName.match(/(\d+)kg/i);
    
    const shortDescription = itemDescription && itemDescription.length > 60 
      ? `${itemDescription.substring(0, 60)}...`
      : itemDescription;
    
    return {
      savings: saveMatch ? `₹${saveMatch[1]}` : null,
      price: priceMatch ? `₹${priceMatch[1]}` : null,
      weight: weightMatch ? `${weightMatch[1]}kg` : null,
      fullItemName: itemName,
      shortDescription: shortDescription
    };
  }, []);

  // Memoize gradient colors
  const gradientColors = useMemo(() => [
    ['#667eea', '#764ba2'],
    ['#FF6B35', '#FF8E53'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
  ], []);

  const getGradientColors = useCallback((index) => {
    return gradientColors[index % gradientColors.length];
  }, [gradientColors]);

  const navigateToRice = (weight) => {
    console.log('Navigating to Rice Products with weight:', weight.weight);
    navigation.navigate('Rice Products', { offerId: weight.weight });
  };

  // Memoize render item to prevent unnecessary re-renders
  const renderPromoBanner = useCallback(({ item, index }) => {
    const colors = getGradientColors(index);
    const isDefault = !item.imageUrl;
    const offerDetails = extractOfferDetails(item.itemName, item.itemDescription);
    
    return (
      <LinearGradient
        colors={colors}
        style={[styles.promoBanner, { width: responsiveDimensions.itemWidth }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern */}
        <View style={styles.backgroundPattern} />
        
        <View style={styles.promoLayout}>
          {/* Left Section - Offer Details */}
          <View style={styles.offerSection}>
            {isDefault ? (
              <View style={styles.defaultContent}>
                <Text style={styles.brandText}>Fresh</Text>
                <Text style={styles.taglineText}>Grocery Delivered</Text>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>Premium Quality</Text>
                </View>
              </View>
            ) : (
              <View style={styles.offerContent}>
                {/* Savings Badge */}
                {offerDetails.savings && (
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>SAVE {offerDetails.savings}</Text>
                  </View>
                )}
                
                {/* Main Offer - Full ItemName */}
                <Text style={styles.offerTitle} numberOfLines={3}>
                  {offerDetails.fullItemName}
                </Text>
                
                {/* Description - Truncated */}
                {offerDetails.shortDescription && (
                  <Text style={styles.offerDescription} numberOfLines={2}>
                    {offerDetails.shortDescription}
                  </Text>
                )}
                
                {/* Price & Weight */}
                <View style={styles.detailsRow}>
                  {offerDetails.price && (
                    <View style={styles.priceTag}>
                      <Text style={styles.priceText}>{offerDetails.price}</Text>
                    </View>
                  )}
                  {offerDetails.weight && (
                    <View style={styles.weightTag}>
                      <Text style={styles.weightText}>{offerDetails.weight}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
            
            {/* Action Button */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigateToRice?.(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>
                {isDefault ? 'SHOP NOW' : 'GRAB DEAL'}
              </Text>
              <Text style={styles.actionButtonIcon}>→</Text>
            </TouchableOpacity>
          </View>
          
          {/* Right Section - Visual */}
          <View style={styles.visualSection}>
            {item.imageUrl ? (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: item.imageUrl }}
                  style={styles.promoImage}
                  resizeMode="cover"
                  // Add caching and loading optimizations
                  cache="force-cache"
                />
                <View style={styles.imageOverlay} />
              </View>
            ) : (
              <View style={styles.iconContainer}>
                <Text style={styles.mainIcon}>🛒</Text>
                <View style={styles.decorativeCircle} />
              </View>
            )}
          </View>
        </View>
        
        {/* Corner Decoration */}
        <View style={styles.cornerDecoration} />
      </LinearGradient>
    );
  }, [getGradientColors, extractOfferDetails, responsiveDimensions.itemWidth]);

  // Memoize dots rendering
  const renderDots = useCallback(() => (
    <View style={styles.dotsContainer}>
      {promoData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { 
              backgroundColor: index === currentIndex ? '#FF6B35' : '#E0E0E0',
              width: index === currentIndex ? 20 : 8,
            }
          ]}
        />
      ))}
    </View>
  ), [promoData.length, currentIndex]);

  // Updated scroll handler with responsive dimensions
  const handleScroll = useCallback((event) => {
    const slideWidth = responsiveDimensions.itemWidth;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / slideWidth);
    
    // Only update if index actually changed to prevent unnecessary re-renders
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < promoData.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, promoData.length, responsiveDimensions.itemWidth]);

  // Handle scroll begin - stop auto scroll when user starts scrolling
  const handleScrollBeginDrag = useCallback(() => {
    setIsUserScrolling(true);
    stopAutoScroll();
  }, [stopAutoScroll]);

  // Handle scroll end - resume auto scroll after user stops scrolling
  const handleScrollEndDrag = useCallback(() => {
    // Clear any existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    // Resume auto scroll after a delay
    scrollTimeout.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 2000); // Resume auto scroll after 2 seconds of inactivity
  }, []);

  // Handle momentum scroll end with responsive dimensions
  const handleMomentumScrollEnd = useCallback((event) => {
    const slideWidth = responsiveDimensions.itemWidth;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / slideWidth);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < promoData.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, promoData.length, responsiveDimensions.itemWidth]);

  // Memoize key extractor
  const keyExtractor = useCallback((item, index) => {
    return item.itemName ? `${item.itemName}-${index}` : `promo-${index}`;
  }, []);

  // Memoize item separator with responsive width
  const ItemSeparator = useCallback(() => (
    <View style={[styles.itemSeparator, { width: responsiveDimensions.itemSeparatorWidth }]} />
  ), [responsiveDimensions.itemSeparatorWidth]);

  // Handle scroll to index failure (for auto-scroll)
  const handleScrollToIndexFailed = useCallback((info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: info.index,
          animated: true,
        });
      }
    });
  }, []);

  // Updated getItemLayout with responsive dimensions
  const getItemLayout = useCallback((data, index) => ({
    length: responsiveDimensions.itemWidth,
    offset: (responsiveDimensions.itemWidth + responsiveDimensions.itemSeparatorWidth) * index,
    index,
  }), [responsiveDimensions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoScroll();
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [stopAutoScroll]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSpinner} />
        <Text style={styles.loadingText}>Loading amazing deals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={promoData}
        renderItem={renderPromoBanner}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={responsiveDimensions.itemWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        scrollEventThrottle={16}
        contentContainerStyle={[styles.carouselContent, { paddingHorizontal: responsiveDimensions.containerPadding }]}
        ItemSeparatorComponent={ItemSeparator}
        // Performance optimizations with responsive dimensions
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews={true}
        initialNumToRender={2}
      />
      {promoData.length > 1 && renderDots()}
    </View>
  );
};

// Convert to StyleSheet for better performance
const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 16,
  },
  carouselContent: {
    // paddingHorizontal is now dynamic
  },
  itemSeparator: {
    // width is now dynamic
  },
  promoBanner: {
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cornerDecoration: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  promoLayout: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  offerSection: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  defaultContent: {
    flex: 1,
  },
  brandText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: -0.5,
  },
  taglineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  badgeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  offerContent: {
    flex: 1,
  },
  savingsBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    lineHeight: 18,
    marginBottom: 6,
  },
  offerDescription: {
    fontSize: 11,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.85,
    lineHeight: 14,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weightTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  weightText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: 15,
    top: 15,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionButtonIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
  visualSection: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainIcon: {
    fontSize: 36,
    zIndex: 2,
  },
  decorativeCircle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  loadingContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    margin: 16,
  },
  loadingSpinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderTopColor: '#FF6B35',
    marginBottom: 12,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PromoCarousel;