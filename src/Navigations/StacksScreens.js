import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Screens imports
import Services from "../Screens/View/Dashboard/Services"
// import Login from "../Authorization/Login";
import Login from "../Authorization/NewLogin"
// import Register from "../Authorization/Register";
import Register from "../Authorization/NewRegister";
import Dashboard from "../Authorization/Dashboard";
import LoginWithPassword from "../Authorization/LoginWithPassword";
import Refund from "../Screens/View/Payments/Refund";
import Activated from "../Authorization/Activated";
import Support from "../Screens/View/ContactUs/Active_Support";
import Tabs from "./BottomTabs";
import RiceProductDetails from "../Screens/View/ShoppingCart/RiceProductDetails";
import ProductView from "../Components/productsDesign/ProductView";
import WalletPage from "../Screens/View/WalletSubscriptions/WalletScreen";
import AddressBook from "../Screens/View/Address/AddressBook";
import Subscription from "../Screens/View/WalletSubscriptions/Subscription";
import SubscriptionHistory from "../Screens/View/WalletSubscriptions/SubscriptionHistory";
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
import ContainerPolicy from "../Screens/View/Dashboard/FreeContainer";
import WriteToUs from "../Screens/View/ContactUs/WriteToUs";
import UserDashboard from "../Screens/View/ShoppingCart/UserDashboard";
import ChatGpt from "../Authorization/NewLogin";
import CartScreen from "../Screens/View/ShoppingCart/CartScreen1";
import DashboardStack from "../Screens/View/Dashboard/DashboardStack";
import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../Redux/constants/theme";

export default function StacksScreens() {
  const Stack = createStackNavigator();
  return (
    
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: true,
        headerTintColor: "white",
        headerTitleStyle: styles.headerTitleStyle,
        headerMode: "float",
        headerShown: true,
        headerStyle: {
          backgroundColor:COLORS.primary,
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
      {/* <Stack.Screen
        name="CampaignServices"
        component={DashboardStack}
        options={{ headerShown: false}}
      /> */}
      <Stack.Screen
        name="Home"
        component={Tabs}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="Rice Product Detail"
        component={RiceProductDetails}
        options={({ route }) => ({
          title: route.params.name,
          headerShown: true,
        })}
      />
      <Stack.Screen name="Services" component={Services}/>
      <Stack.Screen name="Product View" component={ProductView} />
      <Stack.Screen name="Wallet" component={WalletPage} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen
        name="Subscription History"
        component={SubscriptionHistory}
      />
      <Stack.Screen name="Address Book" component={AddressBook} />
      <Stack.Screen name="MyLocationPage" component={MyLocationPage} />
      <Stack.Screen name="Checkout" component={CheckOut} />
      <Stack.Screen name="Splash Screen" component={SplashScreen} />
      <Stack.Screen name="Order Summary" component={OrderSummary} />
      <Stack.Screen name="Payment Details" component={PaymentDetails} />
      <Stack.Screen name="Order Details" component={OrderDetails}  />
      <Stack.Screen name="Ticket History" component={TicketHistory} />
      <Stack.Screen name="View Comments" component={TicketHistoryComments} />
      <Stack.Screen name="Item Details" component={ItemDetails}  />
      <Stack.Screen name="Refund" component={Refund} />
      <Stack.Screen name="Dashboard" component={UserDashboard} />
      <Stack.Screen name="Write To Us" component={WriteToUs}/>
      {/* <Stack.Screen name="Dashboard" component={Rice}/> */}
      <Stack.Screen name="LandingPage" component={UserDashboard}/>
      <Stack.Screen name="ChatGpt" component={ChatGpt}/>

      {/* <Stack.Screen name="My Cart" component={CartScreen}/> */}

      <Stack.Screen
        name="My Cancelled Item Details"
        component={UserCancelledOrderDetails}
      />
      <Stack.Screen
        name="My Exchanged Item Details"
        component={UserExchangeOrderDetails}
      />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="Container Policy" component={ContainerPolicy} />
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
