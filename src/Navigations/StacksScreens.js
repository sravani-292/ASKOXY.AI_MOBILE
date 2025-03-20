import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Screens imports
import Services from "../Dashboard/Services"
// import Login from "../Authorization/NewLogin"
import Login from "../Authorization/Login";
import Register from "../Authorization/Register";
import About from "../Screens/View/PurchaseFlow/About"
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
import DashboardStack from "../Screens/View/Dashboard/DashboardStack";
import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../Redux/constants/theme";
import ReferralHistory from "../Screens/View/Referral Links/ReferralHistory"
import Main from "../Screens/View/WalletSubscriptions/Main";
import ProfileScreen from "../Screens/View/Profile/ProfileScreen";


import Rudraksha from "../Dashboard/Rudraksha";
import FreeAIAndGenAI from "../Dashboard/FreeAIAndGenAI";
import LegalService from "../Dashboard/LegalService";
import Machines from "../Dashboard/Machines";
import MyRotary from "../Dashboard/MyRotary";
import AbroadCategories from "../Dashboard/AbroadCategories";
import FreeContainer from "../Dashboard/FreeContainer"
import WeAreHiring from "../Dashboard/WeAreHiring";
import CryptoCurrency from "../Dashboard/CryptoCurrency"


import Explore from "../Dashboard/ExploreGpts/Explore";
import UniversityGPT from "../Dashboard/ExploreGpts/UniversityGpt";



import ServiceScreen from "../ServiceScreen"



export default function StacksScreens() {
  const Stack = createStackNavigator();
  return (
    
    <Stack.Navigator
      // initialRouteName="Crypto Currency"
      // initialRouteName="Login"
      initialRouteName ="Service Screen"
      screenOptions={{
        headerShown: true,
        headerTintColor: "white",
        headerTitleStyle: styles.headerTitleStyle,
        headerMode: "float",
        headerShown: true,
        headerStyle: {
          backgroundColor:COLORS.services,
        },
      }}
    >
     <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
      name="mobileLogin"
      component={MobileLogin}
      options={{ headerShown: false }}
      /> */}

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
        options={{ headerShown: false}}
      />
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
      <Stack.Screen name="Subscription" component={Main}/>
      {/* <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen
        name="Subscription History"
        component={SubscriptionHistory}
      /> */}
      <Stack.Screen name="Terms and Conditions" component={About}/>
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
      <Stack.Screen name="Rice Products" component={UserDashboard} />
      <Stack.Screen name="Write To Us" component={WriteToUs}/>
      {/* <Stack.Screen name="Rice Products" component={Rice}/> */}
      <Stack.Screen name="ChatGpt" component={ChatGpt}/>
      <Stack.Screen name="Referral History" component={ReferralHistory}/>

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
      {/* <Stack.Screen
        name="Study Abroad"
        component={AbroadCategories}
        options={{
          headerStyle: { backgroundColor: "#3d2a71" },
          headerRight: ({ navigation }) => (
            <View>
             
              <Dropdown
                style={styles.dropdown}
                data={data}
                labelField="label"
                valueField="value"
                placeholder="Select Gpt"
                value={selectGpt}
                onChange={(item) => {
                  setSelectGpt(item.value);
                  
                }}
              />
            </View>
          ), 
        }}
      /> */}
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
      <Stack.Screen name="Crypto Currency" component={CryptoCurrency} 
      options={{
          headerStyle: { backgroundColor: "#3d2a71" }, 
        }} />
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
          headerStyle: { backgroundColor: "#3d2a71" },
        }}
      />

      <Stack.Screen
        name="Profile edit"
        component={ProfileScreen}
        options={{ headerShown: true }}
      />

      <Stack.Screen
        name="Service Screen"
        component={ServiceScreen}
        options={{headerShown: false}}
        // options={{
        //   headerStyle: { backgroundColor: "white" },
        //   headerTintColor: "blue", // Change this to your preferred color
        // }}
      />

      
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
