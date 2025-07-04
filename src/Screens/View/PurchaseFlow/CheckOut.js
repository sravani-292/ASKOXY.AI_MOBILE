import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../../../Redux/constants/theme";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/FontAwesome";
import BASE_URL, { userStage } from "../../../../Config";
import { getCoordinates } from "../Address/LocationService";
import GoogleAnalyticsService from "../../../Components/GoogleAnalytic";
import {
  handleCustomerCartData,
  handleGetProfileData,
  handleUserAddorIncrementCart,
  handleDecrementorRemovalCart,
  handleRemoveItem,
  handleRemoveFreeItem,
} from "../../../ApiService";
import CartCard from "../ShoppingCart/Cart/CartCard";
const CheckOut = ({ navigation, route }) => {
  // console.log("from cartscreen", route.params);

  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  console.log({ customerId });

  const [profileForm, setProfileForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
  });
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [grandTotal, setGrandTotal] = useState(0);
  const [addressData, setAddressData] = useState();
  const [status, setStatus] = useState(false);
  const [cartData, setCartData] = useState();
  const [removalLoading, setRemovalLoading] = useState({});
  const [loadingItems, setLoadingItems] = useState({});
  const [loading, setLoading] = useState();
  const [grandStatus, setGrandStatus] = useState(false);
  const [isLimitedStock, setIsLimitedStock] = useState({});
  const [cartItems, setCartItems] = useState({});
  const [locationData, setLocationData] = useState({
    flatNo: "",
    landMark: "",
    pincode: "",
    address: "",
    addressType: "",
    latitude: "",
    longitude: "",
    area: "",
    houseType: "",
    residenceName: "",
  });


  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      fetchCartData();
      console.log("from my location page", route.params.locationdata);
      if (route.params.locationdata.status == false) {
        fetchOrderAddress();
      } else {
        setStatus(route.params.locationdata.status);
        setAddressData(route.params.locationdata);
        console.log("location data", route.params.locationdata);

        setLocationData({
          customerId: customerId,
          flatNo: route.params.locationdata?.flatNo,
          landMark: route.params.locationdata?.landMark,
          pincode: route.params.locationdata?.pincode,
          address: route.params.locationdata?.address,
          addressType: route.params.locationdata?.addressType,
          latitude: route.params.locationdata?.latitude,
          longitude: route.params.locationdata?.longitude,
          area: route.params.locationdata?.area || "",
          houseType: route.params.locationdata?.houseType || "",
          residenceName: route.params.locationdata?.residenceName || "",
        });
      }
      return () => {
        // Clean up any side effects here if needed
      };
    }, [route.params.locationdata])
  );

  const handleIncrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await increaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const handleDecrease = async (item) => {
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: true }));
    await decreaseCartItem(item);
    setLoadingItems((prevState) => ({ ...prevState, [item.itemId]: false }));
  };

  const fetchCartData = async () => {
    try {
      // setLoading(true);
      const response = await handleCustomerCartData(customerId);
      const totalGstToPay = response.data?.totalGstAmountToPay || 0;
      setGrandTotal(response.data?.amountToPay + totalGstToPay);
      const cartData = response?.data?.customerCartResponseList;

      if (!cartData || !Array.isArray(cartData)) {
        setCartData([]);
        setIsLimitedStock({});
        setCartItems({});
        setGrandStatus(true);
        setLoading(false);
        return;
      }

      const limitedStockMap = cartData.reduce((acc, item) => {
        if (item.quantity === 0) {
          acc[item.itemId] = "outOfStock";
        } else if (item.quantity <= 5) {
          acc[item.itemId] = "lowStock";
        }
        return acc;
      }, {});

      const cartItemsMap = cartData.reduce((acc, item) => {
        if (
          !item.itemId ||
          item.cartQuantity === undefined ||
          item.quantity === undefined
        ) {
          console.error("Invalid item in cartData:", item);
          return acc;
        }

        // 👉 Key is itemId + status (e.g. "7e56a04f..._ADD", "7e56a04f..._FREE")
        const key = `${item.itemId}_${item.status}`;
        acc[key] = item.cartQuantity;
        return acc;
      }, {});

      setCartData(cartData);
      setIsLimitedStock(limitedStockMap);
      setCartItems(cartItemsMap);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setError("Failed to load cart data");
    } finally {
      setLoading(false);
    }
  };

  let alertShown = false;

  const handlePlaceOrder = async () => {
    const outOfStockItems = cartData.filter((item) => {
      console.log(
        `Checking item: ${item.itemId}, Stock: ${isLimitedStock[item.itemId]}`
      );
      return isLimitedStock[item.itemId] === true;
    });
    if (outOfStockItems.length > 0) {
      Alert.alert(
        "🚨 Some Items Are Out of Stock!",
        `The following items are currently unavailable:\n\n${outOfStockItems
          .map((item) => ` - 🛑 ${item.itemName}`)
          .join("\n")}\n\nPlease remove them to proceed.`,
        [{ text: "OK", style: "cancel" }]
      );
      return;
    }

    const value =
      locationData.address +
      "," +
      locationData.landMark +
      "," +
      locationData.pincode;

    if (
      !alertShown &&
      (locationData.address == "" || locationData.address == null) &&
      (addressList == null || addressList.length == 0)
    ) {
      Alert.alert(
        "Address is Mandatory",
        "Please select an address / Add new address before proceeding.",
        [{ text: "OK", onPress: () => navigation.navigate("Address Book") }]
      );
      alertShown = true;
      return false;
    }

    if (value != null || value != "") {
      const { status, isWithin, distanceInKm, coord1 } = await getCoordinates(
        value
      );

      if (isWithin == true) {
        console.log("within radius");

        if (grandTotal == 0 || grandTotal == null) {
          setGrandStatus(true);
          Alert.alert(
            "Sorry",
            "Your cart is empty. Please add some items to your cart."
          );
          return false;
        } else {
          navigation.navigate("Payment Details", {
            addressData: locationData,
            items: cartData,
          });
        }
      } else {
        // console.log("Not within radius");
        return false;
      }
    }
  };

  const increaseCartItem = async (item) => {
    const currentQuantity = item.cartQuantity;
    try {
      const response = await axios.patch(
        BASE_URL + `cart-service/cart/incrementCartData`,
        {
          customerId: customerId,
          itemId: item.itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCartData();
      setLoading(false);
    } catch (err) {
      console.error("Error updating cart item quantity:", err.response);
    }
  };

  const decreaseCartItem = async (item) => {
    const data = {
      customerId: customerId,
      itemId: item.itemId,
    };
    try {
      const response = await handleDecrementorRemovalCart(data);

      fetchCartData();
    } catch (error) {
      console.log("Error decrementing cart item:", error);
    }
  };

  const handleRemove = async (item) => {
    if (!item?.cartId) {
      console.error("Invalid item data for removal", item);
      return;
    }
    try {
      let response;

      if (item.status === "FREE") {
        const freePayload = {
          id: item.cartId,
          customerId: customerId,
          itemId: item.itemId,
          status: "FREE",
        };
        response = await handleRemoveFreeItem(freePayload);
      } else {
        response = await handleRemoveItem(item.cartId);
      }

      // console.log("Remove response:", response);
      Alert.alert("Success", "Item removed successfully");

      fetchCartData();
    } catch (error) {
      Alert.alert("Error", "Failed to remove item. Please try again.");
    } finally {
      setRemovalLoading((prevState) => ({
        ...prevState,
        [item.cartId]: false,
      }));
    }
  };

  const fetchOrderAddress = async () => {
    try {
      const response = await axios({
        url: BASE_URL + `user-service/getAllAdd?customerId=${customerId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("address responseeeeeeee", response.data);

      setAddressList(response.data);
      response.data.slice(-1).map(
        (address) => (
          setSelectedAddressId(address.id),
          setLocationData({
            flatNo: address.flatNo,
            landMark: address.landMark,
            pincode: address.pincode,
            address: address.address,
            addressType: address?.addressType,
            latitude: address.latitude,
            longitude: address.longitude,
            area: address?.area || "",
            houseType: address?.houseType || "",
            residenceName: address?.residenceName || "",
          })
        )
      );
      // console.log("address response", response.data);
    } catch (error) {
      console.error("Error fetching order address data:", error.response);
      setError("Failed to fetch order address data");
    }
  };

  const changeLocation = () => {
    console.log("varam");
    console.log(route.params.locationdata);
    navigation.navigate("Address Book");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Address</Text>
      <TouchableOpacity onPress={changeLocation}>
        {addressList === undefined ||
        addressList.length == 0 ||
        locationData == null ? (
          <Text style={styles.addButton}>+ Add Address</Text>
        ) : (
          <View style={{ flexDirection: "row", marginLeft: 180 }}>
            <Icon name="edit" size={18} color="#ecb01e" style={styles.icon} />
            <Text style={styles.addButton}>Change Address</Text>
          </View>
        )}
      </TouchableOpacity>

      {status ? (
        <View style={styles.addressRow}>
          <Text style={styles.addressText}>
            {locationData.flatNo}, {locationData.landMark}
          </Text>
          <Text style={styles.addressDetail}>
            Address: {locationData.address}
          </Text>
        </View>
      ) : addressList.length > 0 ? (
        addressList.slice(-1).map((address, index) => (
          <View key={index} style={styles.addressRow}>
            {/* {handleAddress(address)} */}
            <View style={styles.iconAndTextContainer}>
              <Icon
                name="map-marker"
                size={30}
                color="#007bff"
                style={styles.icon}
              />
              <View style={styles.addressContainer}>
                <Text style={styles.addressText}>
                  {address.flatNo}, {address.landMark},{address.pincode}
                </Text>

                <Text style={styles.addressText}>{address.address}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.noDeliveryRow}>
          <Text style={styles.noDeliveryText}>
            No address found. Add a new address above.
          </Text>
        </View>
      )}

      {
        grandStatus === true &&
         (
           <View style={styles.card}>
            <MaterialIcons
              name="shopping-cart"
              size={80}
              color="#A9A9A9"
              style={styles.icon}
            />
            <Text style={{ fontSize: 18, color: "#333", marginBottom: 20 }}>
              Your cart is empty
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.services,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
              onPress={() =>
                navigation.navigate("Dashboard")
              }
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>
                Browse Products
              </Text>
            </TouchableOpacity>
          </View>
        )
      }

      <View style={styles.container1}>
        {!grandStatus ? <Text>My Cart</Text> : null}
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : cartData || cartData != null || cartData != [] ? (
          <FlatList
            data={cartData}
            keyExtractor={(item) => item.itemId.toString()}
            renderItem={({ item }) => (
              <CartCard
                item={item}
                isLimitedStock={isLimitedStock}
                loadingItems={loadingItems}
                removalLoading={removalLoading}
                cartItems={cartItems}
                //   containerDecision={containerDecision}
                //   containerItemIds={containerItemIds}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            )}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="always"
          />
        ) : (
          <View>
          {/* <Text>Browse</Text> */}
        </View>
        )}
      </View>
      {/* Payment Details */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View style={styles.paymentDetails}>
          <Text style={styles.grandTotalText}>Grand Total: ₹{grandTotal.toFixed(2)}</Text>
        </View>
      )}

      <View style={{ marginTop: 30 }}>
        <TouchableOpacity
          style={[styles.placeOrderButton]}
          onPress={() => handlePlaceOrder()}
        >
          <Text style={styles.placeOrderButtonText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
    width: "100%",
  },
  container1: {
    marginTop: 5,
    padding: 10,
    height: height * 0.3,
    flex: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 8,
    textAlign: "left",
    marginTop: 10,
  },
  addButton: {
    color: "#ecb01e",
    textAlign: "right",
    fontWeight: "600",
    marginBottom: 15,
    marginLeft: 0,
  },
  addressRow: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 2,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#495057",
  },
  addressDetail: {
    fontSize: 12,
    color: "#6c757d",
  },
  noDeliveryRow: {
    backgroundColor: "#e9ecef",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  noDeliveryText: {
    color: "#6c757d",
  },

  paymentDetails: {
    // marginTop:30,
    alignSelf: "center",
    marginRight: 10,
  },

  grandTotalText: {
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#28a745",
  },

  placeOrderButton: {
    backgroundColor: COLORS.services,
    padding: 10,
    alignSelf: "center",
    borderRadius: 8,
    width: width * 0.9,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  placeOrderButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
  },

  flatListContent: {
    paddingBottom: 80,
  },

  iconAndTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  addressContainer: {
    flex: 1,
  },

  icon: {
    paddingLeft: 30,
    marginRight: 5,
    fontWeight: "bold",
  },
  card:{
    justifyContent:"center",
    alignSelf:"center",
    marginTop:30
  }
});

export default CheckOut;
