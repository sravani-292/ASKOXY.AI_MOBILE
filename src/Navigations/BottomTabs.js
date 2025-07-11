import React, { useEffect, useState, useCallback, use } from "react";
import { Image, StyleSheet, View, Text, Dimensions,TouchableOpacity,Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import CustomNavigationBar from "../Components/AppBar";
import ProfilePage from "../Screens/View/PurchaseFlow/Profile";
import ProfileSettings from "../Screens/View/Profile/ProfileView";
import MainWallet from "../Screens/View/Wallet/Main";
import OrderScreen from "../../src/Screens/View/Orders/OrderScreen";
import CartScreen from "../Screens/View/ShoppingCart/Cart/CartScreen";
// import ServiceScreen from "../ServiceScreen";
import ServiceScreen from "../Screens/ServiceScreen";
import Home from "../Home";
import { COLORS } from "../../Redux/constants/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL, { userStage } from "../../Config";
import UserDashboard from "../Screens/View/ShoppingCart/UserDashboard";
const { height, width } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

const Tabs = () => {
  const [cartCount, setCartCount] = useState(0);
  const userData = useSelector((state) => state.counter);

 

  useFocusEffect(
    useCallback(() => {
      fetchCartCount();
    }, [])
  );

  const fetchCartCount = () => {
    const token = userData?.accessToken;
    const customerId = userData?.userId;
    axios
      .get(
        BASE_URL +
              `cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // console.log("cart response in bottom tabs",response);
        if (response.data && Array.isArray(response.data.customerCartResponseList)) {
          const cartData = response?.data?.customerCartResponseList;
          const totalCartCount = cartData.reduce((total, item) => total + item.cartQuantity, 0);
          setCartCount(totalCartCount);
        } else {
          setCartCount(0); 
        }
      })
      .catch((error) => {
        console.error("Failed to fetch cart count:", error);
      });
  };

  const cartCountValue = (focused) => {
    if (focused) {
      fetchCartCount();
    } else {
      fetchCartCount();
    }
  };

  const getIconColor = (focused) => ({
    tintColor: focused ? COLORS.services : "#000",
  });

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        header: (props) => <CustomNavigationBar {...props} />,
      }}
    >

{/* <Tab.Screen
        name="Landing"
        component={Home}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconContainer]}>
              <Image
                source={require("../../assets/BottomTabImages/landing.png")}
                resizeMode="contain"
                style={[styles.tabIcon,getIconColor(focused)]}
              />
              <Text style={[styles.tabLabel, focused && styles.focusedLabel]}>
                Home
              </Text>
            </View>
          ),
        }}
      /> */}


<Tab.Screen
        name="Dashboard"
        component={ServiceScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconContainer]}>
              <Image
                source={require("../../assets/BottomTabImages/Home.png")}
                resizeMode="contain"
                style={[styles.tabIcon,getIconColor(focused)]}
              />
              <Text style={[styles.tabLabel, focused && styles.focusedLabel]}>
                Dashboard
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Wallet"
        component={MainWallet}
        options={{
          headerShown: true,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Image
                source={require("../../assets/BottomTabImages/wallet.png")}
                resizeMode="contain"
                style={[styles.tabIcon, getIconColor(focused)]}
              />
              <Text style={[styles.tabLabel, focused && styles.focusedLabel]}>
                Wallet
              </Text>
            </View>
          ),
        }}
      />

 

      <Tab.Screen
        name="My Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Image
                source={require("../../assets/BottomTabImages/cart.png")}
                resizeMode="contain"
                style={[styles.tabIcon, getIconColor(focused)]}
              />
              {fetchCartCount()}
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
              <Text style={[styles.tabLabel, focused && styles.focusedLabel]}>
                Cart
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="My Orders"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Image
                source={require("../../assets/BottomTabImages/order.png")}
                resizeMode="contain"
                style={[styles.tabIcon, getIconColor(focused)]}
              />
              <Text style={[styles.tabLabel, focused && styles.focusedLabel]}>
                Orders
              </Text>
            </View>
          ),
        }}
      />
      

      <Tab.Screen
        name="Profile"
        component={ProfileSettings}
        screenOptions={{
          headerShown: true,
        }}
        options={({ navigation }) => ({
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Image
                source={require("../../assets/BottomTabImages/profile.png")}
                resizeMode="contain"
                style={[styles.tabIcon, getIconColor(focused)]}
              />
              <Text style={[styles.tabLabel, focused && styles.focusedLabel]}>
                Profile
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                AsyncStorage.removeItem("userData");
                navigation.navigate("Login");
              }}
            >
              <Ionicons name="log-out-outline" size={25} color="#000" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            color: "#000",
          },
        })}
      />

      {/* <Tab.Screen
        name="Write To Us"
        component={WriteToUs}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <MaterialIcons
                name="support-agent"
                size={24}
                color={focused ? "#fff" : "#205b0b"}
                style={styles.tabIcon}
              />
              <Text style={[styles.tabLabel, focused && styles.focusedLabel]}>
                Support
              </Text>
            </View>
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    paddingVertical: 8,
    bottom: 10,
    height: 60,
    width: width * 1,
    alignSelf: "center",
    // borderRadius: 20,
    // backgroundColor: "#03843b",
    backgroundColor:COLORS.white,
    // borderTopColor: "transparent",
    // shadowColor: COLORS.quantitybutton,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    alignContent: "center",
    borderColor:"#dcdcdc",
    borderWidth:2
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    top: 2,
  },
  tabIcon: {
    width: 35,
    height: 30,
    fontWeight:"bold"
  },
  tabIconHome: {
    width: 45,
    height: 35,
    fontWeight:"bold"
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  tabLabel: {
    marginTop: 1,
    fontSize: 12,
    color:'#000',
  },
  focusedLabel: {
    color: COLORS.services,
    fontWeight: "bold",
  },
  logoutButton: {
    // backgroundColor: 'red',
    marginRight: 20,
  },
});

export default Tabs;
