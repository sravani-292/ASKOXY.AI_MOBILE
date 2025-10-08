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
import Home from '../Home';
import { COLORS } from '../../Redux/constants/theme';
import BharathAgentstore from '../Screens/Genoxy/BharathAgentstore';
import AgentCreationScreen from '../Screens/AIAgent/AgentCreationScreen';
import MyAgents from '../Screens/AIAgent/UserFlow/MyAgent';

const Tab = createBottomTabNavigator();

const TabArr = [
  {
    route: 'Landing',
    label: 'Back to Home',
    icon: require('../../assets/BottomTabImages/landing.png'),
    activeIcon: require('../../assets/BottomTabImages/landing.png'),
    gradient: ['#667eea', '#764ba2'],
  },
  // {
  //   route: 'My Agents',
  //   label: 'Agents',
  //   icon: require('../../assets/BottomTabImages/MyAgent.png'),
  //   activeIcon: require('../../assets/BottomTabImages/MyAgent.png'),
  //   gradient: ['#f093fb', '#f5576c'],
  //   component: MyAgents,
  // },
  {
    route: 'Store',
    label: 'Store',
    icon: require('../../assets/BottomTabImages/storefront.png'),
    activeIcon: require('../../assets/BottomTabImages/storefront.png'),
    gradient: ['#ff7e5f', '#feb47b'],
    component: BharathAgentstore,
  },
  // {
  //   route: 'Create Agent',
  //   label: 'Create Agent',
  //   icon: require('../../assets/BottomTabImages/createAgent.png'),
  //   activeIcon: require('../../assets/BottomTabImages/createAgent.png'),
  //   gradient: ['#7957c8ff', '#6a0dad'],
  //   component: AgentCreationScreen,
  // },
];

const AnimatedTabButton = React.memo(({ item, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;
  const { cartCount } = useCart();

  const animatedValue = useRef(new Animated.Value(focused ? 1 : 0)).current;

  const animatedStyles = useMemo(
    () => ({
      scale: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.1],
      }),
      opacity: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    }),
    [animatedValue]
  );

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: focused ? 1 : 0,
      duration: 100, // Reduced from 150ms for snappier feel
      useNativeDriver: true,
    }).start();
  }, [focused, animatedValue]);

  const iconStyle = useMemo(
    () => [
      styles.tabIcon,
      { tintColor: focused ? COLORS.white : COLORS.services },
    ],
    [focused]
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabButton} activeOpacity={0.8}>
      <View style={styles.tabContainer}>
        <Animated.View
          style={[
            styles.background,
            {
              transform: [{ scale: animatedStyles.scale }],
              opacity: animatedStyles.opacity,
            },
          ]}
        >
          <LinearGradient
            colors={item.gradient}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <View style={styles.tabIconContainer}>
          <Image source={item.icon} resizeMode="contain" style={iconStyle} />
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

const CustomTabBar = React.memo(({ state, navigation }) => {
  const tabData = useMemo(
    () =>
      state.routes.map((route, index) => {
        const item = TabArr.find((tab) => tab.route === route.name);
        const isFocused = state.index === index;

        return {
          route,
          index,
          item,
          isFocused,
          key: route.key,
        };
      }),
    [state.routes, state.index]
  );

  const handlePress = useCallback(
    (routeName, routeKey, isFocused) => {
      console.log({ routeName, isFocused }," Handling tab press");
      if (routeName === 'Landing') {
        // Always navigate to main 'Landing' for single-tap responsiveness
        navigation.getParent()?.navigate('Landing');
        return;
      }

      const event = navigation.emit({
        type: 'tabPress',
        target: routeKey,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(routeName);
      } else if (isFocused && routeName === 'Store') {
        // Keep existing reset logic for Store
        navigation.reset({
          index: 0,
          routes: [{ name: 'Store' }],
        });
      }
    },
    [navigation]
  );

  return (
    <View style={styles.tabBarWrapper}>
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
    </View>
  );
});

const LandingRedirect = ({ navigation }) => {
  useEffect(() => {
    // Navigate immediately without setTimeout
    navigation.getParent()?.navigate('Landing');
  }, [navigation]);

  return null;
};

const StoreTabs = ({ navigation }) => {
  const userData = useSelector((state) => state.counter);

  // NEW: Ensure Store is the initial route on mount
  useEffect(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Store' }],
    });
  }, [navigation]);

  const handleLogout = useCallback(() => {
    AsyncStorage.removeItem('userData');
    navigation.getParent()?.navigate('Login');
  }, [navigation]);

  const getScreenOptions = useCallback(
    (item) => ({
      headerShown: ['Profile', 'Wallet', 'Store', 'Create Agent','My Agents'].includes(item.route),
      headerRight:
        item.route === 'Profile' || item.route === 'Wallet' || item.route === 'Store' || item.route === 'Create Agent'
          ? () => (
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={25} color="#000" />
              </TouchableOpacity>
            )
          : undefined,
      headerStyle: {
        backgroundColor: ['Profile', 'Wallet', 'Store', 'Create Agent'].includes(item.route)
          ? '#fff'
          : undefined,
      },
      headerTitleStyle: {
        color: ['Profile', 'Wallet', 'Store', 'Create Agent'].includes(item.route) ? '#000' : undefined,
      },
      ...(item.route === 'Landing' && { headerShown: false }),
    }),
    [handleLogout]
  );

  return (
    <Tab.Navigator
      initialRouteName="Store"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: false,
        header: (props) => <CustomNavigationBar {...props} />,
      }}
    >
      {TabArr.map((item) => (
        <Tab.Screen
          key={item.route}
          name={item.route}
          component={item.component}
          options={getScreenOptions(item)}
          children={item.route === 'Landing' ? (props) => <LandingRedirect {...props} /> : undefined}
        />
      ))}
    </Tab.Navigator>
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
    width: '80%',
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
  logoutButton: {
    marginRight: 20,
    padding: 4,
  },
});

export default StoreTabs;