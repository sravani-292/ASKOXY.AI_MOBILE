import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, LogBox, Alert, Text, TextInput } from "react-native";
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import allReducers from './Redux/reducers';
import NetworkAlert from "./src/Authorization/NetworkAlert";
import StacksScreens from "./src/Navigations/StacksScreens";
import GoogleAnalyticsService from "./src/Components/GoogleAnalytic";
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { registerAndSaveTokenToSupabase } from './src/Config/notificationService';
import { CartProvider } from "./until/CartCount";
import { DeepLinkManager } from './src/utils/DeepLinkManager';
import AuthWrapper from './src/Components/AuthWrapper';

LogBox.ignoreLogs([
  'EventEmitter.removeListener',
  'ViewPropTypes',
  'VirtualizedList',
  'Warnings'
]);

const store = createStore(allReducers);
const navigationRef = createNavigationContainerRef();

// Enhanced linking configuration
const linking = {
  prefixes: [
    Linking.createURL('/'),
    'https://askoxy.ai',
    'askoxy.ai://',
    'https://oxyrice.page.link',
    'exp://192.168.0.124:8081'
  ],
  config: {
    screens: {
      Login: 'login',
      RegisterScreen: 'register',
      Home: 'home',
      'New DashBoard': 'dashboard',
      'Rice Products': 'rice-products/:category?',
      'Rice Product Detail': 'product/:id',
      'My Orders': 'orders',
      'Order Details': 'order/:id',
      'Payment Details': 'payment/:id?',
      Wallet: 'wallet',
      'Profile Edit': 'profile',
      'Special Offers': 'offers/:id?',
      OxyLoans: 'loans/:id?',
      'Active Agents': 'agents',
      'GenOxyChatScreen': 'chat/:agentName?',
      NotFound: '*',
    },
  },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const routeNameRef = useRef();
  const notificationListener = useRef();
  const responseListener = useRef();
  const isNavigationReadyRef = useRef(false);
  const [screenName, setScreenName] = useState(null);

  // Initialize DeepLinkManager
  useEffect(() => {
    if (navigationRef.current) {
      DeepLinkManager.initialize(navigationRef, store);
    }
  }, []);

  // Enhanced deep link handling
  const handleDeepLink = async (event) => {
    const url = event.url;
    console.log('🔗 Deep link received:', url);
    
    try {
      const { screenName, params } = DeepLinkManager.parseDeepLinkUrl(url);
      
      if (screenName) {
        console.log(`🎯 Parsed deep link - Screen: ${screenName}, Params:`, params);
        
        // Wait for navigation to be ready
        const waitForNavigation = () => {
          if (isNavigationReadyRef.current && navigationRef.current) {
            DeepLinkManager.handleDeepLink(screenName, params);
          } else {
            setTimeout(waitForNavigation, 500);
          }
        };
        
        waitForNavigation();
      } else {
        console.warn('❌ Could not parse screen name from deep link:', url);
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  };

  const resolveDynamicLink = async (shortLink) => {
    try {
      const API_KEY = 'AIzaSyBIm498LNCbEUlatGp4k6JQXOrrUI0SjFE';
      const response = await fetch(
        `https://firebasedynamiclinks.googleapis.com/v1/shortLinks/resolve?shortDynamicLink=${encodeURIComponent(shortLink)}&key=${API_KEY}`
      );
      const data = await response.json();
      const resolvedUrl = data.previewLink || data.deepLink;

      if (resolvedUrl) {
        const parsed = Linking.parse(resolvedUrl);
        const { queryParams } = parsed;
        if (queryParams?.utm_source || queryParams?.utm_campaign) {
          Alert.alert('Campaign Info', `Source: ${queryParams.utm_source}\\nCampaign: ${queryParams.utm_campaign}`);
        }
      }
    } catch (error) {
      console.error('🔥 Error resolving dynamic link:', error);
    }
  };

  // Enhanced initial link check
  const checkInitialLink = async () => {
    try {
      const url = await Linking.getInitialURL();
      if (url) {
        console.log('🔗 Initial URL detected:', url);
        
        if (url.includes('page.link')) {
          await resolveDynamicLink(url);
        }
        
        // Handle the deep link
        handleDeepLink({ url });
      }
    } catch (error) {
      console.error('Error checking initial link:', error);
    }
  };

  const handleNavigationFromNotification = (response) => {
    const data = response?.notification?.request?.content?.data;
    if (!data) return;

    const { screen, params } = data;

    const validScreens = [
      'Order Details',
      'Rice Product Detail',
      'Campaign',
      'Wallet',
      'Notifications',
      'Study',
      'Profile Edit',
      'Main Screen',
      'Referral History',
      'Product View',
      'Invite a friend',
      'Rice Products',
    ];

    const tryNavigate = () => {
      if (screen && validScreens.includes(screen)) {
        console.log('✅ Navigating to screen:', screen, 'with params:', params);
        DeepLinkManager.handleDeepLink(screen, params || {});
      } else {
        console.warn('❌ Screen not matched or invalid:', screen);
      }
    };

    if (isNavigationReadyRef.current) {
      tryNavigate();
    } else {
      const interval = setInterval(() => {
        if (isNavigationReadyRef.current) {
          tryNavigate();
          clearInterval(interval);
        }
      }, 500);

      setTimeout(() => clearInterval(interval), 10000);
    }
  };

  useEffect(() => {
    // Handle foreground notification
    const receivedListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });

    // Handle tap on notification (background or foreground)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Tapped notification:', response);
      handleNavigationFromNotification(response);
    });

    // Handle tap when app was killed
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      if (response) {
        console.log('App opened via notification (cold start)', response);
        handleNavigationFromNotification(response);
      }
    };

    checkInitialNotification();
    
    // Set default font scaling
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;

    return () => {
      Notifications.removeNotificationSubscription(receivedListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  useEffect(() => {
    // Set up deep link handling
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check for initial deep link
    checkInitialLink();
    
    // Register for notifications
    registerAndSaveTokenToSupabase();

    return () => {
      subscription.remove();
      isNavigationReadyRef.current = false;
    };
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <CartProvider>
          <NavigationContainer
            ref={navigationRef}
            linking={linking}
            onReady={async () => {
              isNavigationReadyRef.current = true;
              routeNameRef.current = navigationRef.current.getCurrentRoute().name;
              await GoogleAnalyticsService.screenView(routeNameRef.current);
              
              // Initialize DeepLinkManager after navigation is ready
              DeepLinkManager.initialize(navigationRef, store);
            }}
            onStateChange={async () => {
              const previousRouteName = routeNameRef.current;
              const currentRouteName = navigationRef.current.getCurrentRoute().name;

              if (previousRouteName !== currentRouteName) {
                await GoogleAnalyticsService.screenView(currentRouteName);
              }

              routeNameRef.current = currentRouteName;
            }}
          >
            <NetworkAlert />
            <AuthWrapper navigation={navigationRef}>
              <StacksScreens />
            </AuthWrapper>
            <StatusBar style="auto" />
          </NavigationContainer>
        </CartProvider>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});