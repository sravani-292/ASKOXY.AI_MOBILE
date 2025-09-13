import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Text,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../../until/CartCount' 
import { COLORS } from '../../Redux/constants/theme'; 

const TabArr = [
  { route: 'Landing', label: 'Home', icon: require('../../assets/BottomTabImages/landing.png'), gradient: ['#667eea', '#764ba2'] },
  { route: 'Dashboard', label: 'Dashboard', icon: require('../../assets/BottomTabImages/Home.png'), gradient: ['#f093fb', '#f5576c'] },
  { route: 'AI Store', label: 'AI Store', icon: require('../../assets/BottomTabImages/storefront.png'), gradient: ['#ff7e5f', '#feb47b'] },
  { route: 'Wallet', label: 'Wallet', icon: require('../../assets/BottomTabImages/wallet.png'), gradient: ['#4facfe', '#00f2fe'] },
  { route: 'My Cart', label: 'Cart', icon: require('../../assets/BottomTabImages/cart.png'), gradient: ["#7957c8ff", "#6a0dad"] },
  { route: 'Profile', label: 'Profile', icon: require('../../assets/BottomTabImages/profile.png'), gradient: ['#6a11cb', '#2575fc'] },
];

const AnimatedTabButton = ({ item, onPress, isFocused }) => {
  const { cartCount } = useCart();
  const animatedValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  const animatedStyles = {
    scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }),
    opacity: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  const iconStyle = [styles.tabIcon, { tintColor: isFocused ? COLORS.white : COLORS.services }];

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabButton} activeOpacity={0.8}>
      <View style={styles.tabContainer}>
        <Animated.View style={[styles.background, { transform: [{ scale: animatedStyles.scale }], opacity: animatedStyles.opacity }]}>
          <LinearGradient
            colors={item.gradient}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <View style={styles.tabIconContainer}>
          {item.icon ? (
            <Image source={item.icon} resizeMode="contain" style={iconStyle} />
          ) : (
            <Text>?</Text>
          )}

          {item.route === 'My Cart' && cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MyTabBar = ({ activeTab, onTabPress }) => {
      console.log('✅ MyTabBar is rendering! activeTab =', activeTab); // 👈 ADD THIS

  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBarContainer}>
        <View style={styles.tabButtonsContainer}>
          {TabArr.map((item) => (
            <AnimatedTabButton
              key={item.route}
              item={item}
              isFocused={activeTab === item.route}
              onPress={() => onTabPress(item.route)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 20,
    zIndex: 999, 
  },
  tabBarContainer: {
    height: 65,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#dcdcdc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    zIndex: 1, 
  },
  tabIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default MyTabBar;