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
  ];

  const pathMap = {
    'rice-products': 'Rice Products',
    'offer': 'OxyLoans',
  };


  const handleDeepLink = (event) => {
    const url = event.url;
    const { path, queryParams } = Linking.parse(url);

    console.log('🔗 Dynamic link opened:', url);
    console.log('Parsed path:', path, 'Query:', queryParams);

    const cleanedUrl = url.replace('askoxy.ai://', '');
    const [encodedScreen, idFromPath] = cleanedUrl.split('/');
    const screen = decodeURIComponent(encodedScreen);

    const id = queryParams.id || idFromPath;

    if (screen && validScreens.includes(screen)) {
      setTimeout(() => {
        setScreenName(screen);
        console.log('Navigating to screen:', screen, 'with ID:', id);
        const offerId = id.split('?')[0]; // Extracting offerId if present
        console.log('Offer ID from deep link:', offerId);
        if("Rice Products" === screen) {
          navigationRef.current?.navigate(screen, { category: "All CATEGORIES",
                  offerId: offerId});
        }else{
         navigationRef.current?.navigate(screen, { id });
        }
      }, 1000);
    } else if (path) {
      const [screenKey, id] = path.split('/');
      const screenName = pathMap[screenKey];
      if (screenName) {
        navigationRef.current?.navigate(screenName, { id });
      } else {
        console.warn('Unmapped screen key:', screenKey);
      }
    } else {
      console.warn('No valid screen detected in deep link.');
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
