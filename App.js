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
