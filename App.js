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
  ],
  config: {
    screens: {
      // Offer: 'offer/:id?',
      Product: 'offer/:id',
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

      if (path && navigationRef.current) {
        const segments = path.split('/');
        const screen = segments[0];
        const id = segments[1];

        navigationRef.current.navigate(screen.charAt(0).toUpperCase() + screen.slice(1), { id });
      }
    };

    const checkInitialLink = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        handleDeepLink({ url });
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
