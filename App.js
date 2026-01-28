import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, LogBox, Alert,Text,TextInput } from "react-native";
import { createNavigationContainerRef, NavigationContainer,useNavigation  } from "@react-navigation/native";
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

// import { navigationRef, isNavigationReadyRef } from './src/NavigationService';

LogBox.ignoreLogs([
  'EventEmitter.removeListener',
  'ViewPropTypes',
  'VirtualizedList',
  'Warnings'
]);

const store = createStore(allReducers);

const linking = {
  prefixes: [
    Linking.createURL('/'),
    'https://oxyrice.page.link',
    'exp://192.168.0.124:8081'
  ],
  config: {
    screens: {
      OxyLoans: 'offer/:id',
      'Rice Products': 'rice-products/:id?',
      NotFound: '*',
    },
  },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true, // optional
  }),
});

const navigationRef = createNavigationContainerRef();
export default function App() {
  // const navigationRef = useRef();
  const routeNameRef = useRef();
    const notificationListener = useRef();
  const responseListener = useRef();
  const isNavigationReadyRef = useRef(false);



  const [screenName, setScreenName] = useState(null);

  

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
    Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

    return () => {
      Notifications.removeNotificationSubscription(receivedListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

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
    'Item Details',
    'AI Store',
    'AI Agent'
    // Add more screen names as needed
  ];

  const tryNavigate = () => {
    if (screen && validScreens.includes(screen)) {
      console.log('✅ Navigating to screen:', screen, 'with params:', params);
      navigationRef.current?.navigate(screen, params || {});
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

    // Clear interval if still not ready after 10s
    setTimeout(() => clearInterval(interval), 10000);
  }
};

 

 useEffect(() => {
  const validScreens = [
    'Login', 'Active', 'LoginWithPassword', 'RegisterScreen', 'SplashScreen', 'Home',
    'Rice Product Detail', 'Product View', 'Wallet', 'Subscription', 'Terms and Conditions',
    'Account Deletion', 'Address Book', 'MyLocationPage', 'Checkout', 'Splash Screen',
    'Order Summary', 'Payment Details', 'Order Details', 'Ticket History', 'View Comments',
    'Item Details', 'Refund', 'Rice Products', 'Write To Us', 'ChatGpt', 'Referral History',
    'My Cancelled Item Details', 'Support', 'Container Policy', 'FREE RUDRAKSHA',
    'FREE AI & GEN AI', 'STUDY ABROAD', 'LEGAL SERVICE', 'Machines', 'MY ROTARY ',
    'FREE CONTAINER', 'We Are Hiring', 'Crypto Currency', 'GPTs', 'Explore Gpt',
    'Countries', 'Universities Display', 'Universities Details', 'Profile Edit',
    'Service Screen', 'Campaign', 'Invite a friend', 'Scan', 'Saved Address',
    'Store Location', 'App Update', 'OxyLoans', 'Offer Letters', 'Study', 'Services',
    'My Exchanged Item Details', 'View BMVcoins History', 'Special Offers', 'New Address Book',
    'wallet', 
  ];

  const pathMap = {
    'rice-products': 'Rice Products',
    'offer': 'Special Offers',
    'offers': 'Special Offers',
    'wallet': 'Wallet',
    'main/wallet': 'Wallet',
    'item': 'Item Details',
    'itemsdisplay': 'Item Details',
    'main/itemsdisplay': 'Item Details',
    "bharath-aistore" : 'AI Agent',
    "all-ai-stores":"AI Store",
    "user-dashboard": 'Rice Products',
    "main/dashboard/products": 'Rice Products'
  };


  const handleDeepLink = (event) => {
    const url = event.url;
    const { path, queryParams } = Linking.parse(url);

    console.log('🔗 Dynamic link opened:', url);
    console.log('Parsed path:', path, 'Query:', queryParams);

    const cleanedUrl = url.replace('askoxy.ai://', '').replace('https://www.askoxy.ai/', '').replace('https://askoxy.ai/', '');
    
    // Split URL and query parameters properly
    const [pathPart, queryPart] = cleanedUrl.split('?');
    const pathSegments = pathPart.split('/');
    
    // Parse query parameters manually if not already parsed
    let finalQueryParams = queryParams || {};
    if (queryPart && Object.keys(finalQueryParams).length === 0) {
      queryPart.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          finalQueryParams[key] = decodeURIComponent(value);
        }
      });
    }
    
    // Handle multi-level paths like main/wallet or main/dashboard/products
    let screenKey, id;
    if (pathSegments.length >= 3 && pathSegments[0] === 'main' && pathSegments[1] === 'dashboard' && pathSegments[2] === 'products') {
      screenKey = 'main/dashboard/products';
    } else if (pathSegments.length >= 3 && pathSegments[0] === 'main' && pathSegments[1] === 'itemsdisplay') {
      screenKey = 'main/itemsdisplay';
      id = pathSegments[2];
    } else if (pathSegments.length >= 2) {
      if (pathSegments[0] === 'main' && pathSegments[1] === 'wallet') {
        screenKey = 'main/wallet';
      } else if (pathSegments[0] === 'itemsdisplay') {
        screenKey = 'itemsdisplay';
        id = pathSegments[1];
      } else {
        screenKey = pathSegments[0];
        id = pathSegments[1];
      }
    } else {
      screenKey = pathSegments[0];
      id = finalQueryParams?.id;
    }

    console.log('Detected screenKey:', screenKey, 'pathSegments:', pathSegments, 'queryParams:', finalQueryParams);

    const screenName = pathMap[screenKey];
    
    if (screenName) {
      console.log('Navigating via pathMap to:', screenName, 'with ID:', id);
      setTimeout(async () => {
        if(screenName === "Special Offers") {
          navigationRef.current?.navigate(screenName, { offerId: id });
        } else if(screenName === "Rice Products" && (id || finalQueryParams?.weight || finalQueryParams?.type)) {
          // Handle deep link to UserDashboard with itemId, weight, or type
          const params = {
            category: "All CATEGORIES",
            categoryType: finalQueryParams?.type || "RICE"
          };
          
          if (id) {
            params.itemId = id;
          }
          
          if (finalQueryParams?.weight) {
            const weightNum = Math.floor(parseFloat(finalQueryParams.weight));
            params.weight = weightNum;
          }
          
          console.log('Navigating to UserDashboard with params:', params);
          navigationRef.current?.navigate(screenName, params);
        } else if(screenName === "Rice Products" && id) {
          // Fetch item data and navigate directly to Item Details
          try {
            console.log('Fetching item data for ID:', id);
            const response = await fetch(`https://meta.oxyloans.com/api/product-service/getItemById?itemId=${id}`);
            if (response.ok) {
              const itemData = await response.json();
              console.log('Item data fetched successfully');
              navigationRef.current?.navigate('Item Details', { item: itemData });
            } else {
              console.error('Failed to fetch item data');
              navigationRef.current?.navigate('Rice Products');
            }
          } catch (error) {
            console.error('Error fetching item data:', error);
            navigationRef.current?.navigate('Rice Products');
          }
        } else if(screenName === "Item Details" && id) {
          // Navigate directly to ItemDetails with itemId
          console.log('Navigating to ItemDetails with itemId:', id);
          navigationRef.current?.navigate(screenName, { itemId: id });
        } else {
          navigationRef.current?.navigate(screenName, id ? { id } : {});
        }
      }, 1000);
    } else {
      // Fallback to original logic
      const [encodedScreen, idFromPath] = cleanedUrl.split('/');
      const screen = decodeURIComponent(encodedScreen);
      const fallbackId = queryParams?.id || idFromPath;
        console.log('Navigating to screen:', screen, 'with ID:', fallbackId);

      if (screen && validScreens.includes(screen)) {
        setTimeout(() => {
          setScreenName(screen);
          console.log('Navigating to screen:', screen, 'with ID:', fallbackId);
          const offerId = fallbackId?.split('?')[0];
          console.log('Offer ID from deep link:', offerId);
          if("Rice Products" === screen) {
            const params = { category: "All CATEGORIES", categoryType: "RICE" };
            
            // Check for itemId or weight in the URL
            if (queryParams?.itemId) {
              params.itemId = queryParams.itemId;
            }
            if (queryParams?.weight) {
              const weightNum = Math.floor(parseFloat(queryParams.weight));
              params.weight = weightNum;
            }
            if (queryParams?.type) {
              params.categoryType = queryParams.type;
            }
            if (offerId) {
              params.offerId = offerId;
            }
            
            navigationRef.current?.navigate(screen, params);
          } else if("Special Offers" === screen) {
            navigationRef.current?.navigate(screen, { offerId: offerId });
          } else {
            navigationRef.current?.navigate(screen, { id: fallbackId });
          }
        }, 1000);
      } else {
        console.warn('No valid screen detected in deep link.');
      }
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
          Alert.alert('Campaign Info', `Source: ${queryParams.utm_source}\nCampaign: ${queryParams.utm_campaign}`);
        }
      }
    } catch (error) {
      console.error('🔥 Error resolving dynamic link:', error);
    }
  };

  const checkInitialLink = async () => {
    const url = await Linking.getInitialURL();
    console.log('Checking initial URL:', url);
    if (url) {
      console.log('🔗 Initial URL:', url);
      if (url.includes('page.link')) {
        await resolveDynamicLink(url);
      }
      handleDeepLink({ url });
    }
  };

  const subscription = Linking.addEventListener('url', handleDeepLink);

  checkInitialLink();

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
        {/* <NavigationContainer
          ref={navigationRef}
          // linking={linking}
           onReady={async () => {
            isNavigationReadyRef.current = true; // ✅ mark as ready
            routeNameRef.current = navigationRef.current.getCurrentRoute().name;
            await GoogleAnalyticsService.screenView(routeNameRef.current);
          }}
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigationRef.current.getCurrentRoute().name;

            if (previousRouteName !== currentRouteName) {
              await GoogleAnalyticsService.screenView(currentRouteName);
            }

            routeNameRef.current = currentRouteName;
          }}
        > */}

  <NavigationContainer
  ref={navigationRef}
  onReady={async () => {
    isNavigationReadyRef.current = true;
    routeNameRef.current = navigationRef.current.getCurrentRoute().name;
    await GoogleAnalyticsService.screenView(routeNameRef.current);
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
          <StacksScreens />
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
