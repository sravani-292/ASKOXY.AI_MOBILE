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

  // Calculate responsive dimensions - Fixed to prevent overlapping
  const responsiveDimensions = useMemo(() => {
    const { width } = screenDimensions;
    const containerPadding = Math.max(16, width * 0.04); // 4% of screen width, minimum 16px
    const itemSeparatorWidth = Math.max(8, width * 0.02); // 2% of screen width, minimum 8px
    const itemWidth = width - (containerPadding * 2);
    
    // Calculate banner height based on screen size
    const bannerHeight = Math.max(140, Math.min(180, width * 0.4)); // Between 140-180px based on screen width
    
    return {
      itemWidth,
      itemSeparatorWidth,
      containerPadding,
      snapToInterval: itemWidth + itemSeparatorWidth,
      bannerHeight,
      isSmallScreen: width < 360,
      isMediumScreen: width >= 360 && width < 400,
      isLargeScreen: width >= 400,
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
    
    // Responsive text truncation based on screen size
    const maxLength = responsiveDimensions.isSmallScreen ? 45 : responsiveDimensions.isMediumScreen ? 55 : 65;
    const shortDescription = itemDescription && itemDescription.length > maxLength 
      ? `${itemDescription.substring(0, maxLength)}...`
      : itemDescription;
    
    return {
      savings: saveMatch ? `₹${saveMatch[1]}` : null,
      price: priceMatch ? `₹${priceMatch[1]}` : null,
      weight: weightMatch ? `${weightMatch[1]}kg` : null,
      fullItemName: itemName,
      shortDescription: shortDescription
    };
  }, [responsiveDimensions]);

  // Memoize gradient colors
 const gradientColors = useMemo(() => [
  ['#667eea', '#764ba2'], // Purple
  ['#FF6B35', '#FF8E53'], // Orange
  ['#f093fb', '#f5576c'], // Pink
  ['#4facfe', '#00f2fe'], // Blue
  ['#ff9a9e', '#fad0c4'], // Soft pink → peach
  ['#a18cd1', '#fbc2eb'], // Lavender → pink
  ['#ff6a00', '#ee0979'], // Orange → magenta
], []);


  const getGradientColors = useCallback((index) => {
    return gradientColors[index % gradientColors.length];
  }, [gradientColors]);

  const navigateToRice = (weight) => {
    console.log('Navigating to Rice Products with weight:', weight.weight);
    navigation.navigate('Rice Products', { offerId: weight.weight });
  };

  // Memoize render item to prevent unnecessary re-renders - Fixed for responsive design
  const renderPromoBanner = useCallback(({ item, index }) => {
    const colors = getGradientColors(index);
    const isDefault = !item.imageUrl;
    const offerDetails = extractOfferDetails(item.itemName, item.itemDescription);
    const { bannerHeight, isSmallScreen, isMediumScreen } = responsiveDimensions;
    
    // Calculate responsive padding and sizes
    const bannerPadding = isSmallScreen ? 12 : isMediumScreen ? 16 : 20;
    const visualSectionWidth = isSmallScreen ? 70 : isMediumScreen ? 85 : 100;
    
    return (
      <LinearGradient
        colors={colors}
        style={[
          styles.promoBanner, 
          { 
            width: responsiveDimensions.itemWidth, 
            height: bannerHeight,
            padding: bannerPadding
          }
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern - Responsive */}
        <View style={[
          styles.backgroundPattern,
          {
            width: bannerHeight * 0.4,
            height: bannerHeight * 0.4,
            borderRadius: bannerHeight * 0.2,
          }
        ]} />
        
        <View style={styles.promoLayout}>
          {/* Left Section - Offer Details */}
          <View style={[styles.offerSection, { paddingRight: isSmallScreen ? 8 : 12 }]}>
            {isDefault ? (
              <View style={styles.defaultContent}>
                <Text style={[
                  styles.brandText,
                  { 
                    fontSize: isSmallScreen ? 24 : isMediumScreen ? 28 : 32,
                    lineHeight: isSmallScreen ? 28 : isMediumScreen ? 32 : 36
                  }
                ]}>Fresh</Text>
                <Text style={[
                  styles.taglineText,
                  { fontSize: isSmallScreen ? 12 : isMediumScreen ? 14 : 16 }
                ]}>Grocery Delivered</Text>
                <View style={[
                  styles.badgeContainer,
                  { 
                    paddingHorizontal: isSmallScreen ? 8 : 12,
                    paddingVertical: isSmallScreen ? 4 : 6,
                    marginTop: isSmallScreen ? 8 : 12
                  }
                ]}>
                  <Text style={[
                    styles.badgeText,
                    { fontSize: isSmallScreen ? 8 : 10 }
                  ]}>Premium Quality</Text>
                </View>
              </View>
            ) : (
              <View style={styles.offerContent}>
                {/* Savings Badge */}
                {offerDetails.savings && (
                  <View style={[
                    styles.savingsBadge,
                    {
                      paddingHorizontal: isSmallScreen ? 6 : 8,
                      paddingVertical: isSmallScreen ? 2 : 4,
                      marginBottom: isSmallScreen ? 4 : 8
                    }
                  ]}>
                    <Text style={[
                      styles.savingsText,
                      { fontSize: isSmallScreen ? 8 : 10 }
                    ]}>SAVE {offerDetails.savings}</Text>
                  </View>
                )}
                
                {/* Main Offer - Responsive font size */}
                <Text 
                  style={[
                    styles.offerTitle,
                    { 
                      fontSize: isSmallScreen ? 11 : isMediumScreen ? 12 : 14,
                      lineHeight: isSmallScreen ? 14 : isMediumScreen ? 16 : 18,
                      marginBottom: isSmallScreen ? 4 : 6
                    }
                  ]} 
                  numberOfLines={isSmallScreen ? 2 : 3}
                >
                  {offerDetails.fullItemName}
                </Text>
                
                {/* Description - Responsive */}
                {offerDetails.shortDescription && (
                  <Text 
                    style={[
                      styles.offerDescription,
                      { 
                        fontSize: isSmallScreen ? 9 : 11,
                        lineHeight: isSmallScreen ? 12 : 14,
                        marginBottom: isSmallScreen ? 4 : 8
                      }
                    ]} 
                    numberOfLines={isSmallScreen ? 1 : 2}
                  >
                    {offerDetails.shortDescription}
                  </Text>
                )}
                
                {/* Price & Weight - Responsive */}
                <View style={styles.detailsRow}>
                  {offerDetails.price && (
                    <View style={[
                      styles.priceTag,
                      {
                        paddingHorizontal: isSmallScreen ? 6 : 8,
                        paddingVertical: isSmallScreen ? 2 : 4,
                        marginRight: isSmallScreen ? 4 : 8
                      }
                    ]}>
                      <Text style={[
                        styles.priceText,
                        { fontSize: isSmallScreen ? 10 : 12 }
                      ]}>{offerDetails.price}</Text>
                    </View>
                  )}
                  {offerDetails.weight && (
                    <View style={[
                      styles.weightTag,
                      {
                        paddingHorizontal: isSmallScreen ? 6 : 8,
                        paddingVertical: isSmallScreen ? 2 : 4
                      }
                    ]}>
                      <Text style={[
                        styles.weightText,
                        { fontSize: isSmallScreen ? 8 : 10 }
                      ]}>{offerDetails.weight}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
          
          {/* Right Section - Visual - Responsive */}
          <View style={[styles.visualSection, { width: visualSectionWidth }]}>
            {item.imageUrl ? (
              <View style={[
                styles.imageContainer,
                {
                  width: visualSectionWidth - 10,
                  height: visualSectionWidth - 10,
                  borderRadius: isSmallScreen ? 8 : 12
                }
              ]}>
                <Image 
                  source={{ uri: item.imageUrl }}
                  style={styles.promoImage}
                  resizeMode="cover"
                  cache="force-cache"
                />
                <View style={[
                  styles.imageOverlay,
                  { borderRadius: isSmallScreen ? 8 : 12 }
                ]} />
              </View>
            ) : (
              <View style={[
                styles.iconContainer,
                {
                  width: visualSectionWidth - 10,
                  height: visualSectionWidth - 10
                }
              ]}>
                <Text style={[
                  styles.mainIcon,
                  { fontSize: isSmallScreen ? 24 : isMediumScreen ? 30 : 36 }
                ]}>🛒</Text>
                <View style={[
                  styles.decorativeCircle,
                  {
                    width: visualSectionWidth - 20,
                    height: visualSectionWidth - 20,
                    borderRadius: (visualSectionWidth - 20) / 2
                  }
                ]} />
              </View>
            )}
          </View>
          
        </View>
        
        {/* Corner Decoration - Responsive */}
        <View style={[
          styles.cornerDecoration,
          {
            width: bannerHeight * 0.25,
            height: bannerHeight * 0.25,
            borderRadius: bannerHeight * 0.125
          }
        ]} />
         {/* Action Button - Responsive */}
            <TouchableOpacity 
              style={[
                styles.actionButton,
                {
                  paddingHorizontal: isSmallScreen ? 8 : 12,
                  paddingVertical: isSmallScreen ? 4 : 6,
                  marginTop: isSmallScreen ? 8 : 15,
                  alignSelf: isSmallScreen ? 'flex-start' : 'flex-end'
                }
              ]}
              onPress={() => navigateToRice?.(item)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.actionButtonText,
                { fontSize: isSmallScreen ? 10 : 12 }
              ]}>
                {isDefault ? 'SHOP NOW' : 'GRAB DEAL'}
              </Text>
              <Text style={[
                styles.actionButtonIcon,
                { fontSize: isSmallScreen ? 12 : 14 }
              ]}>→</Text>
            </TouchableOpacity>
      </LinearGradient>
    );
  }, [getGradientColors, extractOfferDetails, responsiveDimensions]);

  // Memoize dots rendering with responsive sizing
  const renderDots = useCallback(() => (
    <View style={styles.dotsContainer}>
      {promoData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { 
              backgroundColor: index === currentIndex ? '#FF6B35' : '#E0E0E0',
              width: index === currentIndex ? (responsiveDimensions.isSmallScreen ? 16 : 20) : 8,
              height: responsiveDimensions.isSmallScreen ? 6 : 8,
              borderRadius: responsiveDimensions.isSmallScreen ? 3 : 4,
              marginHorizontal: responsiveDimensions.isSmallScreen ? 2 : 4
            }
          ]}
        />
      ))}
    </View>
  ), [promoData.length, currentIndex, responsiveDimensions]);

  // Updated scroll handler with responsive dimensions
  const handleScroll = useCallback((event) => {
    const slideWidth = responsiveDimensions.itemWidth + responsiveDimensions.itemSeparatorWidth;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / slideWidth);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < promoData.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, promoData.length, responsiveDimensions]);

  // Handle scroll begin - stop auto scroll when user starts scrolling
  const handleScrollBeginDrag = useCallback(() => {
    setIsUserScrolling(true);
    stopAutoScroll();
  }, [stopAutoScroll]);

  // Handle scroll end - resume auto scroll after user stops scrolling
  const handleScrollEndDrag = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    scrollTimeout.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 2000);
  }, []);

  // Handle momentum scroll end with responsive dimensions
  const handleMomentumScrollEnd = useCallback((event) => {
    const slideWidth = responsiveDimensions.itemWidth + responsiveDimensions.itemSeparatorWidth;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / slideWidth);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < promoData.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, promoData.length, responsiveDimensions]);

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

  // Updated getItemLayout with responsive dimensions - Fixed for proper spacing
  const getItemLayout = useCallback((data, index) => {
    const itemLength = responsiveDimensions.itemWidth;
    const separatorLength = index < data.length - 1 ? responsiveDimensions.itemSeparatorWidth : 0;
    const offset = index * (itemLength + responsiveDimensions.itemSeparatorWidth);
    
    return {
      length: itemLength,
      offset: offset,
      index,
    };
  }, [responsiveDimensions]);

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
      <View style={[
        styles.loadingContainer,
        { 
          height: responsiveDimensions.bannerHeight,
          margin: responsiveDimensions.containerPadding,
          borderRadius: responsiveDimensions.isSmallScreen ? 16 : 20
        }
      ]}>
        <View style={[
          styles.loadingSpinner,
          {
            width: responsiveDimensions.isSmallScreen ? 20 : 24,
            height: responsiveDimensions.isSmallScreen ? 20 : 24,
            borderRadius: responsiveDimensions.isSmallScreen ? 10 : 12
          }
        ]} />
        <Text style={[
          styles.loadingText,
          { fontSize: responsiveDimensions.isSmallScreen ? 12 : 14 }
        ]}>Loading amazing deals...</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.carouselContainer,
      { marginVertical: responsiveDimensions.containerPadding }
    ]}>
      <FlatList
        ref={flatListRef}
        data={promoData}
        renderItem={renderPromoBanner}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={responsiveDimensions.itemWidth + responsiveDimensions.itemSeparatorWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.carouselContent, 
          { paddingHorizontal: responsiveDimensions.containerPadding }
        ]}
        ItemSeparatorComponent={ItemSeparator}
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
  },
  carouselContent: {
  },
  itemSeparator: {
  },
  promoBanner: {
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cornerDecoration: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  promoLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  offerSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  defaultContent: {
    flex: 1,
  },
  brandText: {
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: -0.5,
  },
  taglineText: {
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  badgeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  offerContent: {
    flex: 1,
  },
  savingsBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  savingsText: {
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  offerTitle: {
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  offerDescription: {
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.85,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', // Allow wrapping on small screens
  },
  priceTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
  },
  priceText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weightTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  weightText: {
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionButtonIcon: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: '600',
  },
  visualSection: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0, // Prevent shrinking
  },
  imageContainer: {
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
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mainIcon: {
    zIndex: 2,
  },
  decorativeCircle: {
    position: 'absolute',
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
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingSpinner: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderTopColor: '#FF6B35',
    marginBottom: 12,
  },
  loadingText: {
    color: '#666',
    fontWeight: '500',
  },
});

export default PromoCarousel;