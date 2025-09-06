// Enhanced NewDashBoard.js with Gradient Backgrounds
import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { 
  ScrollView, 
  RefreshControl, 
  StatusBar, 
  SafeAreaView,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

import BASE_URL from '../../../../Config';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import PromoBanner from '../components/PromoBanner';
import CategoryTabs from '../components/CategoryTabs';
import CategorySection from '../components/CategorySection';
import useServiceScreenData from '../../ServiceScreen/hooks/useServiceScreenData';
import { transformCategories } from '../untils/Helpers';
import OfferModal from '../../View/ShoppingCart/DashboardProduct/OfferModal';
import OrderFeedback from '../../ServiceScreen/components/OrderFeedback';
import LoginModal from '../../../Components/LoginModal';

import ChatFAB from '../../../Components/ChatFAB';
import ChatPopup from '../../../Components/ChatPopup';
import useChat from '../../../hooks/useChat';
import { handleTranslateProduct } from '../../../hooks/translateProduct';

const { height: screenHeight } = Dimensions.get('window');

// Define gradient themes for different categories
const gradientThemes = {
  'RICE': {
    colors: ['#FF9A9E', '#FECFEF', '#FECFEF'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }
  },
  'Grocery': {
    colors: ['#A8E6CF', '#DCEDC8', '#F1F8E9'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }
  },
  'GOLD': {
    colors: ['#FFB74D', '#FFF3E0', '#FFF8E1'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }
  },
  'FESTIVAL': {
    colors: ['#E1F5FE', '#F0F8FF', '#FFFFFF'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }
  },
  'Meat': {
    colors: ['#FFCDD2', '#F8BBD9', '#F3E5F5'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }
  },
  'Beverages': {
    colors: ['#E3F2FD', '#BBDEFB', '#90CAF9'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }
  },
  'default': {
    colors: ['#F5F5F5', '#FFFFFF', '#FAFAFA'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }
  }
};

const getHeaderGradient = (activeCategory) => {
  const themes = {
    'RICE': ['#FF9A9E', '#FECFEF'],
    'Grocery': ['#A8E6CF', '#DCEDC8'],
    'GOLD': ['#FFB74D', '#FFF3E0'],
    'FESTIVAL': ['#E1F5FE', '#F0F8FF'],
    'Meat': ['#FFCDD2', '#F8BBD9'],
    'Beverages': ['#E3F2FD', '#BBDEFB'],
    'default': ['#F5F5F5', '#FFFFFF']
  };
  return themes[activeCategory] || themes['default'];
};

export default function NewDashBoard() {

  const {
    userData,
    loginModal,
    setLoginModal,
    loading,
    banners,
    bannersLoading,
    activeIndex,
    setActiveIndex,
    data,
    handleLogout,
    handleBannerPress,
    handleServicePress,
    selectedMainCategory,
    setSelectedMainCategory,
    getCategories,
    visibilityMap,
    bannerHeight,
    addToCart,
    removeFromCart, 
    setCart,
    cart, 
    setSummary,
    summary,
    selectedCategoryType,
    setSelectedCategoryType,
    fetchCartItems,
    isLoading,
    setIsLoading,
    formData,
    comboItems,
    setComboItems,
    offerShow,
    setOfferShow
  } = useServiceScreenData();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const customerId = userData?.userId;
  const navigation = useNavigation();

    const [showChat, setShowChat] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [botName, setBotName] = useState('ASKOXY_Bot');
  const [dynamicContent, setDynamicContent] = useState();

  const { messages, handleUserMessage, isChatLoading } = useChat({ language, botName });

  // Get current gradient theme based on selected category
  const getCurrentGradientTheme = useCallback(() => {
    const categoryName = selectedCategoryType || 'default';
    console.log("categoryName",categoryName);
    return gradientThemes[categoryName] || gradientThemes['default'];
  }, [selectedCategoryType]);

  // Animate background change when category changes
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [selectedCategoryType, fadeAnim]);

  // Enhanced refresh handler with error handling
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      // Add actual refresh logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);   

  // Optimized scroll handler with debouncing
  const handleScroll = useCallback(
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { 
        useNativeDriver: false,
        listener: (event) => {
          const currentOffset = event.nativeEvent.contentOffset.y;
          setIsScrolling(currentOffset > 50);
        }
      }
    ),
    []
  );

  // Scroll to top functionality
  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  // Enhanced category tab change handler
  const handleCategoryChange = useCallback((categoryType) => {
    setSelectedCategoryType(categoryType);
    // Trigger background animation
    Animated.timing(fadeAnim, {
      toValue: 0.8,
      duration: 100,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [fadeAnim, setSelectedCategoryType]);

  // Memoize static components
  const memoizedHeader = useMemo(() => (
    <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
      <Header navigation={navigation} userData={userData} profileData={formData} headerGradientColors={getHeaderGradient(selectedCategoryType)}/>
    </Animated.View>
  ), [headerOpacity]);

  const memoizedSearchBar = useMemo(() => (
    <SearchBar 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery}
      navigation={navigation}
      onFocus={() => {navigation.navigate("Search Screen")}}
    />
  ), [searchQuery]);

  // Focus effect for screen activation
  useFocusEffect(
    useCallback(() => {
      handleDescripion();
      // Set the status bar to dark content
      StatusBar.setBarStyle('dark-content');
      return () => StatusBar.setBarStyle('default');
    }, [])
  );

  const calculateDiscount = useCallback((mrp, price) => {
    if (mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  }, []);

  // Optional: You can still keep this for compatibility
  const getItemInCart = useCallback((itemId) => {
    return cart?.customerCartResponseList?.find(
      cartItem => cartItem.itemId === itemId
    );
  }, [cart?.customerCartResponseList]);

  const handleSeeAll = async (category) => {
    console.log('Navigate to category page:', category.categoryName);
    navigation.navigate('Rice Products',{
        screenName: 'Rice Products',
        category: category.categoryName,
        categoryType: selectedCategoryType
    });
  };

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

  const transformedCategories = transformCategories(getCategories);
  const currentGradient = getCurrentGradientTheme();

  return (
    <SafeAreaView style={[styles.container, {paddingTop: userData ? 20 : Platform.OS === "android" ? StatusBar.currentHeight : 0}]}>
      <StatusBar backgroundColor="transparent" translucent  barStyle="light-content" animated />
      
      {/* Animated Gradient Background */}
      <Animated.View style={[styles.gradientContainer, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={currentGradient.colors}
          start={currentGradient.start}
          end={currentGradient.end}
          style={styles.gradient}
        />
      </Animated.View>

      {memoizedHeader}
      
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
            title="Pull to refresh"
          />
        }
        contentContainerStyle={styles.scrollContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      >
        {memoizedSearchBar}
        <PromoBanner />
        <CategoryTabs 
          categories={transformedCategories} 
          activeTab={selectedCategoryType} 
          setActiveTab={handleCategoryChange}
          onTabPress={setSelectedMainCategory}
          setIsLoading={setIsLoading}
        />
        <CategorySection
          categories={selectedMainCategory}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          getItemInCart={getItemInCart}
          calculateDiscount={calculateDiscount}
          customerId={customerId}
          cartData={cart}
          loading={loading} 
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          maxItemsToShow={5}
          onSeeAll={handleSeeAll}
          onChargeCart={fetchCartItems}
          enableWeightFilter={false}
          weightFilter={{ min: 0, max: 500 }}
          dynamicContent={dynamicContent}
        />
        {comboItems &&(
               <OfferModal
                  visible={offerShow}
                  onClose={() => setOfferShow(false)}
                  comboOffers={comboItems}
                />
        )}
      </ScrollView>

      {/* Scroll to top button with gradient background */}
      {isScrolling && (
        <Animated.View style={styles.scrollToTopButton}>
          <TouchableOpacity onPress={scrollToTop} style={styles.scrollButton}>
            <LinearGradient
              colors={['#FF6B35', '#FF8A50']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scrollButtonGradient}
            >
              <Ionicons name="arrow-up" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* login modal */}
      {!userData && <LoginModal visible={loginModal} onClose={() => {setLoginModal(false)}} />}

        {/* Order Feedback */}
          {userData && <OrderFeedback/> }

           <ChatFAB onPress={() => setShowChat(!showChat)} />
      {showChat && (
        <ChatPopup
          onSend={handleUserMessage}
          messages={[...messages].reverse()}
          isLoading={isChatLoading}
          language={language}
          onTranslateProduct={handleTranslateProduct}
          onClose={() => setShowChat(!showChat)}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  gradient: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: 'transparent',
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    zIndex: 1000,
  },
  scrollButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});