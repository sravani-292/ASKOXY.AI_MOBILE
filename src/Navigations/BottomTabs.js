// Tabs.js
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
import OrderScreen from '../../src/Screens/View/Orders/OrderScreen';
import CartScreen from '../Screens/View/ShoppingCart/Cart/CartScreen';
import NewDashBoard from '../Screens/New_Dashbord/screen/NewDashBoard';
import Home from '../Home';
import BharathAgentstore from '../Screens/Genoxy/BharathAgentstore';
import { COLORS } from '../../Redux/constants/theme';

// IMPORTANT: now using StoreTabs (a nested tab navigator)
import StoreTabs from './StoreTabs';

const { height, width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const TabArr = [
  { route: 'Landing', label: 'Home', icon: require('../../assets/BottomTabImages/landing.png'), gradient: ['#667eea', '#764ba2'], component: Home },
  { route: 'Dashboard', label: 'Dashboard', icon: require('../../assets/BottomTabImages/Home.png'), gradient: ['#f093fb', '#f5576c'], component: NewDashBoard },
  // AI Store now points to StoreTabs (nested tab navigator)
  { route: 'AI Store', label: 'AI Store', icon: require('../../assets/BottomTabImages/storefront.png'), gradient: ['#ff7e5f', '#feb47b'], component: BharathAgentstore },
  { route: 'Wallet', label: 'Wallet', icon: require('../../assets/BottomTabImages/wallet.png'), gradient: ['#4facfe', '#00f2fe'], component: MainWallet },
  { route: 'My Cart', label: 'Cart', icon: require('../../assets/BottomTabImages/cart.png'), gradient: ["#7957c8ff", "#6a0dad"], component: CartScreen },
  { route: 'Profile', label: 'Profile', icon: require('../../assets/BottomTabImages/profile.png'), gradient: ['#6a11cb', '#2575fc'], component: ProfileSettings },
];

// AnimatedTabButton: guarded for safety (won't crash if item is undefined)
const AnimatedTabButton = React.memo(({ item, onPress, accessibilityState }) => {
  if (!item) return null; // safety guard

  const focused = accessibilityState.selected;
  const { cartCount } = useCart();
  const animatedValue = useRef(new Animated.Value(focused ? 1 : 0)).current;

  const animatedStyles = useMemo(() => ({
    scale: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }),
    opacity: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
  }), [animatedValue]);

  useEffect(() => {
    Animated.timing(animatedValue, { toValue: focused ? 1 : 0, duration: 150, useNativeDriver: true }).start();
  }, [focused, animatedValue]);

  const iconStyle = useMemo(() => [styles.tabIcon, { tintColor: focused ? COLORS.white : COLORS.services }], [focused]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabButton} activeOpacity={0.8}>
      <View style={styles.tabContainer}>
        <Animated.View style={[styles.background, { transform: [{ scale: animatedStyles.scale }], opacity: animatedStyles.opacity }]}>
          <LinearGradient colors={item.gradient} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        </Animated.View>

        <View style={styles.tabIconContainer}>
          {item.icon ? (
            <Image source={item.icon} resizeMode="contain" style={iconStyle} />
          ) : (
            <Ionicons name="ellipse-outline" size={24} />
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
});

// CustomTabBar: skip routes we don't have metadata for and allow hiding in tabBar prop
const CustomTabBar = React.memo(({ state, descriptors, navigation }) => {
  const tabData = useMemo(() => state.routes.map((route, index) => {
    const item = TabArr.find((tab) => tab.route === route.name);
    const isFocused = state.index === index;
    return { route, index, item, isFocused, key: route.key };
  }), [state.routes, state.index]);

  const handlePress = useCallback((routeName, routeKey, isFocused) => {
    const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) navigation.navigate(routeName);
  }, [navigation]);

  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBarContainer}>
        <View style={styles.tabButtonsContainer}>
          {tabData.map(({ route, item, isFocused, key }) => (
            // if item missing (shouldn't happen if TabArr matches your Tab.Screen), skip it gracefully
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
    </View>
  );
});

const Tabs = ({ navigation }) => {
  const userData = useSelector((state) => state.counter);

  const handleLogout = useCallback(() => {
    AsyncStorage.removeItem('userData');
    navigation.navigate('Login');
  }, [navigation]);

  const getScreenOptions = useCallback((item) => ({
    headerShown: ['Profile', 'Wallet', 'My Cart', 'My Orders','AI Store'].includes(item.route),
    headerRight: item.route === 'Profile' ? () => (
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={25} color="#000" />
      </TouchableOpacity>
    ) : undefined,
    headerStyle: { backgroundColor: ['Profile', 'Wallet'].includes(item.route) ? '#fff' : undefined },
    headerTitleStyle: { color: ['Profile', 'Wallet'].includes(item.route) ? '#000' : undefined },
  }), [handleLogout]);

  // IMPORTANT: hide main custom tab bar when AI Store is focused so StoreTabs' own tab bar can show
  const tabNavigatorProps = useMemo(() => ({
    initialRouteName: "Landing",
    tabBar: (props) => {
      const focusedRoute = props.state.routes[props.state.index].name;
      // if (focusedRoute === 'AI Store') return null; // hide parent custom tab for AI Store
      return <CustomTabBar {...props} />;
    },
    screenOptions: {
      headerShown: true,
      tabBarShowLabel: false,
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
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: Platform.OS === 'ios' ? 20 : 10, paddingHorizontal: 20 },
  tabBarContainer: { height: 65, borderRadius: 25, overflow: 'hidden', backgroundColor: COLORS.white, borderWidth: 2, borderColor: '#dcdcdc', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8 },
  tabButtonsContainer: { flexDirection: 'row', flex: 1 },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  tabContainer: { alignItems: 'center', justifyContent: 'center', width: '80%', height: '100%', position: 'relative' },
  background: { ...StyleSheet.absoluteFillObject, borderRadius: 14, overflow: 'hidden' },
  gradient: { flex: 1 },
  tabIconContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  tabIcon: { width: 28, height: 28, resizeMode: 'contain' },
  cartBadge: { position: 'absolute', top: -5, right: -10, backgroundColor: 'red', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1, minWidth: 16, alignItems: 'center' },
  cartBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  logoutButton: { marginRight: 20, padding: 4 },
});

export default Tabs
