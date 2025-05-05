import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { Provider } from 'react-redux';
import allReducers from './Redux/reducers';
import { createStore } from 'redux';
import { LogBox, Image } from "react-native";
import NetworkAlert from "./src/Authorization/NetworkAlert";
import StacksScreens from "./src/Navigations/StacksScreens";
import GoogleAnalyticsService from "./src/Components/GoogleAnalytic";
LogBox.ignoreLogs(['EventEmitter.removeListener', 'ViewPropTypes', 'VirtualizedList', 'Warnings']);
const store = createStore(
  allReducers
);


export default function App() {

  const navigationRef = React.useRef();
const routeNameRef = React.useRef();


  return (
    <Provider store={store}>

    <PaperProvider>
    <NavigationContainer 
        ref={navigationRef}
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
      <NetworkAlert/>
      <StacksScreens/>
      <StatusBar style="auto" />
    </NavigationContainer>
    </PaperProvider>
    </Provider>
    // <View style={styles.container}>
    //   <Text>hai</Text>
    // </View>
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
