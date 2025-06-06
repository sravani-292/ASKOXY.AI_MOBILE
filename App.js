import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { StyleSheet, LogBox, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import allReducers from './Redux/reducers';
import NetworkAlert from "./src/Authorization/NetworkAlert";
import StacksScreens from "./src/Navigations/StacksScreens";
import GoogleAnalyticsService from "./src/Components/GoogleAnalytic";
import * as Linking from 'expo-linking';
import { initializeApp, getApps } from 'firebase/app';

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


export default function App() {
  const navigationRef = useRef();
  const routeNameRef = useRef();

  const firebaseConfig = {
    apiKey: "AIzaSyBIm498LNCbEUlatGp4k6JQXOrrUI0SjFE",
    authDomain: "erice-241012.firebaseapp.com",
    projectId: "erice-241012",
    appId: "1:834341780860:android:2a62736e85889c243cb8f9",
    databaseURL: "https://erice-241012.firebaseio.com",
    storageBucket: "erice-241012.firebasestorage.app",
    messagingSenderId: "834341780860",
  };


  useEffect(() => {
   const handleDeepLink = (event) => {
  const url = event.url;
  const { path, queryParams } = Linking.parse(url);

  console.log('🔗 Dynamic link opened:', url);
  console.log('Parsed path:', path, 'Query:', queryParams);

  // Handle query-based navigation (e.g., ?screen=Rice Products&id=123)
  if (queryParams?.screen && navigationRef.current) {
    const screenName = queryParams.screen;
    const id = queryParams.id;

    // Optional: validate screen name or map it if needed
    if (screenName === 'Rice Products') {
      navigationRef.current.navigate(screenName, { id });
      return;
    }
  }

  // Fallback path-based navigation
  if (path && navigationRef.current) {
    const segments = path.split('/');
    const screenKey = segments[0];
    const id = segments[1];
    
    const pathMap = {
      'rice-products': 'Rice Products',
      'offer': 'OxyLoans',
    };

    const screenName = pathMap[screenKey];
    if (screenName) {
      navigationRef.current.navigate(screenName, { id });
    } else {
      console.warn('No screen mapped for path:', screenKey);
    }
  }
};


    const resolveDynamicLink = async (shortLink) => {
  try {
    const API_KEY = 'AIzaSyBIm498LNCbEUlatGp4k6JQXOrrUI0SjFE'; // Replace with your real key if needed
    const response = await fetch(
      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks/resolve?shortDynamicLink=${encodeURIComponent(shortLink)}&key=${API_KEY}`
    );
    const data = await response.json();
    const resolvedUrl = data.previewLink || data.deepLink;

    if (resolvedUrl) {
      const parsed = Linking.parse(resolvedUrl);
      const { queryParams } = parsed;

      console.log('🎯 UTM Params:', queryParams);

      const utmSource = queryParams?.utm_source;
      const utmMedium = queryParams?.utm_medium;
      const utmCampaign = queryParams?.utm_campaign;

      if (utmSource || utmCampaign) {
        Alert.alert('Campaign Info', `Source: ${utmSource}\nCampaign: ${utmCampaign}`);
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
      await resolveDynamicLink(url); // UTM extractor
    }

    handleDeepLink({ url }); // Navigate to correct screen
  }
};


    const subscription = Linking.addEventListener('url', handleDeepLink);
    checkInitialLink();

       try {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
    console.log('Firebase initialized');
  }
} catch (e) {
  console.error('Firebase init error:', e);
}

    return () => {
      subscription.remove();
    };
  
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer
          ref={navigationRef}
          linking={linking}
          onReady={async () => {
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
