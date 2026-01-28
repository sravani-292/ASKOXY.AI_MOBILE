import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  Text,
  Image,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useCart } from '../../until/CartCount';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomNavigationBar from '../Components/AppBar';
import ProfileSettings from '../Screens/View/Profile/ProfileView';
import MainWallet from '../Screens/View/Wallet/Main';
import CartScreen from '../Screens/View/ShoppingCart/Cart/CartScreen';
import NewDashBoard from '../Screens/New_Dashbord/screen/NewDashBoard';
import Home from '../Home';
import { COLORS } from '../../Redux/constants/theme';
import BharathAgentstore from '../Screens/Genoxy/BharathAgentstore';
import StoreTabs from './StoreTabs';
import AIStore from '../Screens/AIStore/AIStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, scaleFont } from '../utils/scale.js';

const Tab = createBottomTabNavigator();

const TabArr = [
  // { route: 'Landing', label: 'Home', icon: require('../../assets/BottomTabImages/landing.png'), gradient: ['#667eea', '#764ba2'], component: Home },
  { route: 'Dashboard', label: 'Shop', icon: require('../../assets/BottomTabImages/store.png'), gradient: ['#f093fb', '#f5576c'], component: NewDashBoard },
  { route: 'AI Agent', label: 'AI Agent', icon: require('../../assets/BottomTabImages/storefront.png'), gradient: ['#ff7e5f', '#feb47b'], component: BharathAgentstore },
  { route: 'Wallet', label: 'Wallet', icon: require('../../assets/BottomTabImages/wallet.png'), gradient: ['#4facfe', '#00f2fe'], component: MainWallet },
  { route: 'My Cart', label: 'Cart', icon: require('../../assets/BottomTabImages/cart.png'), gradient: ['#7957c8ff', '#6a0dad'], component: CartScreen },
  { route: 'Profile', label: 'Profile', icon: require('../../assets/BottomTabImages/profile.png'), gradient: ['#6a11cb', '#2575fc'], component: ProfileSettings },
];

const AIAgentTabs = [
  { route: 'AI Agent', label: 'AI Agent', icon: require('../../assets/BottomTabImages/storefront.png'), gradient: ['#ff7e5f', '#feb47b'], component: BharathAgentstore },
  { route: 'AI Store', label: 'AI Store', icon: require('../../assets/BottomTabImages/store.png'), gradient: ['#f093fb', '#f5576c'], component: AIStore },
  { route: 'Dashboard', label: 'Home', icon: require('../../assets/BottomTabImages/store.png'), gradient: ['#667eea', '#764ba2'], component: Home },
];

const AnimatedTabButton = React.memo(({ item, onPress, accessibilityState }) => {
  if (!item) return null;

  const focused = accessibilityState.selected;
  const { cartCount } = useCart();
  const animatedValue = useRef(new Animated.Value(focused ? 1 : 0)).current;

  const animatedStyles = useMemo(() => ({
    scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }), // Reduced scale for subtler effect
    opacity: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }), // Fully hide gradient when inactive
  }), [animatedValue]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: focused ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [focused, animatedValue]);

  const iconStyle = useMemo(() => [
    styles.tabIcon,
    { tintColor: focused ? COLORS.white : COLORS.services },
  ], [focused]);

  const labelStyle = useMemo(() => [
    styles.tabLabel,
    { color: focused ? COLORS.white : COLORS.services, fontWeight: focused ? '600' : '500' },
  ], [focused]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabButton} activeOpacity={0.7}>
      <View style={styles.tabContainer}>
        {/* Show gradient background only for active tab */}
        <Animated.View style={[styles.background, { transform: [{ scale: animatedStyles.scale }], opacity: animatedStyles.opacity }]}>
          <LinearGradient colors={item.gradient} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        </Animated.View>
        <View style={styles.tabIconContainer}>
          {item.icon ? (
            <Image source={item.icon} resizeMode="contain" style={iconStyle} />
          ) : (
            <Ionicons name="ellipse-outline" size={scale(22)} />
          )}
          {item.route === 'My Cart' && cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
          <Text style={labelStyle} numberOfLines={1} adjustsFontSizeToFit>
            {item.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const CustomTabBar = React.memo(({ state, descriptors, navigation }) => {
  const focusedRoute = state.routes[state.index].name;
  const currentTabs = ['AI Agent', 'AI Store'].includes(focusedRoute) ? AIAgentTabs : TabArr;
  
  const tabData = useMemo(() => {
    return currentTabs.map((item) => {
      const routeIndex = state.routes.findIndex(route => route.name === item.route);
      if (routeIndex === -1) return null;
      
      const route = state.routes[routeIndex];
      const isFocused = state.index === routeIndex;
      return { route, index: routeIndex, item, isFocused, key: route.key };
    }).filter(Boolean);
  }, [state.routes, state.index, currentTabs]);

  const handlePress = useCallback((routeName, routeKey, isFocused) => {
    const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) navigation.navigate(routeName);
  }, [navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.tabBarWrapper}>
      <View style={styles.tabBarContainer}>
        <View style={styles.tabButtonsContainer}>
          {tabData.map(({ route, item, isFocused, key }) => (
            item ? (
              <AnimatedTabButton
                key={key}
                item={item}
                onPress={() => handlePress(route.name, key, isFocused)}
                accessibilityState={{ selected: isFocused }}
              />
            ) : null
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
});

const Tabs = ({ navigation }) => {
  const userData = useSelector((state) => state.counter);

  const handleLogout = useCallback(() => {
    AsyncStorage.removeItem('userData');
    navigation.navigate('Login');
  }, [navigation]);

  const getScreenOptions = useCallback((item) => {
    const getTitleForRoute = (route) => {
      switch(route) {
        case 'Profile': return 'Profile';
        case 'Wallet': return 'Wallet';
        case 'My Cart': return 'My Cart';
        case 'My Orders': return 'My Orders';
        case 'AI Agent': return 'AI Agent';
        case 'AI Store': return 'Exploring AI Store';
        default: return route;
      }
    };
    
    return {
      headerShown: ['Profile', 'Wallet', 'My Cart', 'My Orders','AI Agent', 'AI Store'].includes(item.route),
      headerTitle: getTitleForRoute(item.route),
      headerRight: item.route === 'Profile' ? () => (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={scale(22)} color="#fff" />
        </TouchableOpacity>
      ) : undefined,
      headerStyle: { backgroundColor: '#3d2a71' },
      headerTitleStyle: { color: 'white' },
      headerTintColor: 'white',
    };
  }, [handleLogout]);

  const tabNavigatorProps = useMemo(() => ({
    initialRouteName: "Dashboard",
    tabBar: (props) => {
      const focusedRoute = props.state.routes[props.state.index].name;
      return <CustomTabBar {...props} />;
    },
    screenOptions: {
      headerShown: true,
      header: (props) => <CustomNavigationBar {...props} />,
    },
  }), []);

  return (
    <Tab.Navigator {...tabNavigatorProps}>
      {TabArr.map((item) => (
        <Tab.Screen
          key={item.route}
          name={item.route}
          component={item.component}
          options={getScreenOptions(item)}
        />
      ))}
      <Tab.Screen
        key="AI Store"
        name="AI Store"
        component={AIStore}
        options={getScreenOptions({ route: 'AI Store' })}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(6), // Reduced padding for smaller size
    paddingBottom: Platform.OS === 'ios' ? 0 : verticalScale(4),
  },
  tabBarContainer: {
    height: verticalScale(60), // Reduced height for compact look
    borderRadius: scale(18), // Smaller border radius
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.12, // Subtler shadow
    shadowRadius: scale(5),
    elevation: 5,
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(5), // Reduced padding
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%', // Slightly reduced for compact layout
    height: '100%',
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: scale(10), // Smaller border radius
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(3), // Reduced padding
  },
  tabIcon: {
    width: scale(22), // Smaller icon size
    height: scale(22),
    resizeMode: 'contain',
  },
  tabLabel: {
    fontSize: scaleFont(10), // Smaller font size
    marginTop: verticalScale(2), // Tighter spacing
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  cartBadge: {
    position: 'absolute',
    top: verticalScale(-5), // Adjusted for smaller size
    right: scale(-7),
    backgroundColor: '#ff3d00',
    borderRadius: scale(8), // Smaller badge
    paddingHorizontal: scale(3),
    paddingVertical: verticalScale(1),
    minWidth: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: scaleFont(8), // Smaller badge text
    fontWeight: '700',
    textAlign: 'center',
  },
  logoutButton: {
    marginRight: scale(14), // Reduced margin
    padding: scale(4),
  },
});

export default Tabs;