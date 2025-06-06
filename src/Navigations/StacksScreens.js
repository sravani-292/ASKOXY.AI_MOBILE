import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Platform, ActivityIndicator } from "react-native";
import axios from "axios";
import BASE_URL from "../../Config";
// Screens imports
import Services from "../Dashboard/Services";
import Login from "../Authorization/Login";
import Register from "../Authorization/Register";
import About from "../Screens/View/PurchaseFlow/About";
import LoginWithPassword from "../Authorization/LoginWithPassword";
import Refund from "../Screens/View/Payments/Refund";
import Activated from "../Authorization/Activated";
import Support from "../Screens/View/ContactUs/Active_Support";
import Tabs from "./BottomTabs";
import RiceProductDetails from "../Screens/View/ShoppingCart/RiceProductDetails";
import ProductView from "../Components/productsDesign/ProductView";
import WalletPage from "../Screens/View/WalletSubscriptions/WalletScreen";
import AddressBook from "../Screens/View/Address/AddressBook";
import CheckOut from "../Screens/View/PurchaseFlow/CheckOut";
import Rice from "../Screens/View/ShoppingCart/Rice";
import MyLocationPage from "../Screens/View/Address/MyLocationPage";
import SplashScreen from "../Authorization/SplashScreen";
import OrderSummary from "../Screens/View/PurchaseFlow/OrderSummary";
import PaymentDetails from "../Screens/View/Payments/PaymentScreen";
import OrderDetails from "../Screens/View/Orders/OrderDetails";
import TicketHistory from "../Screens/View/ContactUs/TicketHistory";
import TicketHistoryComments from "../Screens/View/ContactUs/TicketHistoryComments";
import ItemDetails from "../Screens/View/ShoppingCart/ItemDetails";
import UserCancelledOrderDetails from "../Screens/View/Orders/UserCancelledOrderDetails";
import UserExchangeOrderDetails from "../Screens/View/Orders/UserExchangeOrderDetails";
import ContainerPolicy from "../Dashboard/FreeContainer";
import WriteToUs from "../Screens/View/ContactUs/WriteToUs";
import UserDashboard from "../Screens/View/ShoppingCart/UserDashboard";
import ChatGpt from "../Authorization/NewLogin";
import CartScreen from "../Screens/View/ShoppingCart/CartScreen1";

import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../Redux/constants/theme";
import ReferralHistory from "../Screens/View/Referral Links/ReferralHistory";
import Main from "../Screens/View/WalletSubscriptions/Main";
import ProfileScreen from "../Screens/View/Profile/ProfileScreen";
import NewAddressBook from "../Screens/View/Address/NewAddressBook";

import OffersModel from "../Screens/View/Offers/OffersModal";

import Rudraksha from "../Dashboard/Rudraksha";
import FreeAIAndGenAI from "../Dashboard/FreeAIAndGenAI";
import LegalService from "../Dashboard/LegalService";
import Machines from "../Dashboard/Machines";
import MyRotary from "../Dashboard/MyRotary";
import AbroadCategories from "../Dashboard/AbroadCategories";
import FreeContainer from "../Dashboard/FreeContainer";
import WeAreHiring from "../Dashboard/WeAreHiring";
import CryptoCurrency from "../Dashboard/CryptoCurrency";
import ViewCoinsTransferHistory from "../../src/Screens/View/MyCrypto/ViewCoinsTransferHistory";

import Explore from "../Dashboard/ExploreGpts/Explore";
import UniversityGPT from "../Dashboard/ExploreGpts/UniversityGpt";
import CountriesDisplay from "../Dashboard/StudentX/CountriesDisplay";
import UniversitiesDisplay from "../Dashboard/StudentX/UniversitiesDisplay";
import UniversityDetails from "../Dashboard/StudentX/UniversitiesDetails";
import ServiceScreen from "../ServiceScreen";
import ReferFriend from "../Screens/View/Referral Links/ReferFriend";
import BarcodeScanner from "../Screens/View/Profile/BarcodeScanner";
import AddressBookScreen from "../Screens/View/Profile/AddressScreen";
import StoreLocatorScreen from "../StoreLocation";
import AppUpdateScreen from "../../AppUpdateScreen";
import PremiumPlan from "../Screens/View/WalletSubscriptions/PremiumPlan";
import CampaignScreen from "../Campaign";
import OxyLoans from "../Dashboard/Oxyloans";
import OfferLetters from "../Dashboard/offerletters";
import StudyAbroad from "../StudyAbroad";
import AllService from "../AllService";
import AccountDeletionScreen from "../Authorization/AccountDeletion";

import * as Linking from 'expo-linking';

const json = require("../../app.json"); 
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={COLORS.services} />
    <Text style={{ marginTop: 20 }}>Checking for updates...</Text>
  </View>
);

// Define deep link configuration
const linking = {
  prefixes: [
    'https://askoxy.ai',
    'askoxy.ai://'
  ],
  config: {
    screens: {
      Home: 'home',
      Product: 'Rice Product/:id',
      OrderSummary: 'order-summary/:id',
      // Add more routes here as needed
    },
  },
};

export default function StacksScreens() {

  const Stack = createStackNavigator();
  const [platform, setPlatform] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);
  const [currentVersion, setCurrentVersion] = useState("");
  const [displayVersion, setDisplayVersion] = useState("");
  const [lastChecked, setLastChecked] = useState("");
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(true);
  const [needsUpdate, setNeedsUpdate] = useState(false);

  useEffect(() => {
    // Set platform and current version
    if (Platform.OS === "ios") {
      setPlatform("IOS");
      setCurrentVersion(parseInt(json.expo?.ios?.buildNumber || "1", 10));
    } else {
      setPlatform("ANDROID");
      setCurrentVersion(parseInt(json.expo?.android?.versionCode || "1", 10));
    }
  }, []);
  

  useEffect(() => {
    if (platform) {
      checkForUpdate();
    }
  }, [platform]);

  const checkForUpdate = async () => {
    if (!platform) return;
    try {
      setIsCheckingForUpdates(true);
      const response = await axios.get(
        `${BASE_URL}product-service/getAllVersions?userType=CUSTOMER&versionType=${platform}`
      );
      
      const data = response.data;
      
      // Process the update data - handle both array and single object response
      if (data) {
        let latestVersion;
        
        if (Array.isArray(data) && data.length > 0) {
          latestVersion = data.reduce((latest, current) => {
            const currentVersionNum = parseInt(current.version, 10);
            const latestVersionNum = parseInt(latest.version, 10);
            return currentVersionNum > latestVersionNum ? current : latest;
          }, data[0]);
        } else {
          // Single object response
          latestVersion = data;
        }
        
        // Parse the server version as integer for proper comparison
        const latestVersionNum = parseInt(latestVersion.version, 10);
        
       
        const updateRequired = latestVersionNum > currentVersion;
        
        console.log(
          "Update needed:",
          updateRequired,
          "Latest:",
          latestVersionNum,
          "Current:",
          currentVersion
        );
        
        // Set the update status
        setUpdateStatus({ available: updateRequired });
        setNeedsUpdate(updateRequired);
      } else {
      
        setUpdateStatus({ available: false });
        setNeedsUpdate(false);
      }
    } catch (err) {
      console.error("Error checking for updates:", err);
     
      setUpdateStatus({ available: false });
      setNeedsUpdate(false);
    } finally {
      setIsCheckingForUpdates(false);
    }
  };

 
  if (isCheckingForUpdates) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      linking={linking}
      initialRouteName={needsUpdate ? "App Update" : "Service Screen"}
      screenOptions={{
        headerShown: true,
        headerTintColor: "white",
        headerTitleStyle: styles.headerTitleStyle,
        headerMode: "float",
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.services,
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="Active" component={Activated} />
      <Stack.Screen
        name="LoginWithPassword"
        component={LoginWithPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={Register}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Rice Product Detail"
        component={RiceProductDetails}
        options={({ route }) => ({
          title: route.params.name,
          headerShown: true,
        })}
      />
      {/* <Stack.Screen name="Services" component={Services}/> */}
      <Stack.Screen name="Product View" component={ProductView} />
      <Stack.Screen name="Wallet" component={WalletPage} />
      <Stack.Screen name="Subscription" component={Main} />

      <Stack.Screen name="Terms and Conditions" component={About} />
      <Stack.Screen name="Account Deletion" component={AccountDeletionScreen}/>
      <Stack.Screen name="Address Book" component={AddressBook} />
      <Stack.Screen name="MyLocationPage" component={MyLocationPage} />
      <Stack.Screen name="Checkout" component={CheckOut} />
      <Stack.Screen name="Splash Screen" component={SplashScreen} />
      <Stack.Screen name="Order Summary" component={OrderSummary} />
      <Stack.Screen name="Payment Details" component={PaymentDetails} />
      <Stack.Screen name="Order Details" component={OrderDetails} />
      <Stack.Screen name="Ticket History" component={TicketHistory} />
      <Stack.Screen name="View Comments" component={TicketHistoryComments} />
      <Stack.Screen name="Item Details" component={ItemDetails} />
      <Stack.Screen name="Refund" component={Refund} />
      <Stack.Screen name="Rice Products" component={UserDashboard} />
      <Stack.Screen name="Write To Us" component={WriteToUs} />
      <Stack.Screen name="ChatGpt" component={ChatGpt} />
      <Stack.Screen name="Referral History" component={ReferralHistory} />

      <Stack.Screen
        name="My Cancelled Item Details"
        component={UserCancelledOrderDetails}
      />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="Container Policy" component={ContainerPolicy} />

      <Stack.Screen
        name="FREE RUDRAKSHA"
        component={Rudraksha}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" },
        }}
      />
      <Stack.Screen
        name="FREE AI & GEN AI"
        component={FreeAIAndGenAI}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" },
        }}
      />
      <Stack.Screen
        name="STUDY ABROAD"
        component={AbroadCategories}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" },
        }}
      />
      <Stack.Screen
        name="LEGAL SERVICE"
        component={LegalService}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" },
        }}
      />
      <Stack.Screen
        name="Machines"
        component={Machines}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" },
        }}
      />
      <Stack.Screen
        name="MY ROTARY "
        component={MyRotary}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" },
        }}
      />
      <Stack.Screen
        name="FREE CONTAINER"
        component={FreeContainer}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" },
        }}
      />
      <Stack.Screen
        name="We Are Hiring"
        component={WeAreHiring}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" },
        }}
      />
      <Stack.Screen
        name="Crypto Currency"
        component={CryptoCurrency}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" },
        }}
      />
      <Stack.Screen
        name="GPTs"
        component={Explore}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" },
        }}
      />
      <Stack.Screen
        name="Explore Gpt"
        component={UniversityGPT}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" }
        }}
      />
      <Stack.Screen
        name="Countries"
        component={CountriesDisplay}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Universities Display"
        component={UniversitiesDisplay}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Universities Details"
        component={UniversityDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile Edit"
        component={ProfileScreen}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Service Screen"
        component={ServiceScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Campaign"
        component={CampaignScreen}
        options={({ route }) => ({
          title: route.params?.campaignType || "Campaigns",
        })}
      />

      <Stack.Screen
        name="Invite a friend"
        component={ReferFriend}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Scan"
        component={BarcodeScanner}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Saved Address"
        component={AddressBookScreen}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Store Location"
        component={StoreLocatorScreen}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="App Update"
        component={AppUpdateScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="OxyLoans"
        component={OxyLoans}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Offer Letters"
        component={OfferLetters}
       options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Study"
        component={StudyAbroad}
        options={{ headerShown: true }}
      />



<Stack.Screen
   name="Services"
   component={AllService}
    options={{ headerShown: true }}
  />

<Stack.Screen
        name="My Exchanged Item Details"
        component={UserExchangeOrderDetails}
      />

      <Stack.Screen
        name = "View BMVcoins History"
        component={ViewCoinsTransferHistory}
        />

      <Stack.Screen 
         name= "Special Offers"
         component={OffersModel}
         />

        <Stack.Screen name="New Address Book" component={NewAddressBook}/>


    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignSelf: "center",
    justifyContent: "center",
  },
});