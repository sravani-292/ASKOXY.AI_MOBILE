import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../../../Redux/constants/theme";

import { useSelector } from "react-redux";
import BASE_URL, { userStage } from "../../../../Config";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
const { width, height } = Dimensions.get("window");

const OrderScreen = () => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      getOrders();
    }, [])
  );

  const onRefresh = () => {
    getOrders();
  };

  const getOrders = async () => {
    const data = {
      userId: customerId,
    };
    setLoading(true);

    try {
      const response = await axios.post(
        userStage == "test1"
          ? BASE_URL + "erice-service/order/getAllOrders_customerId"
          : BASE_URL + "order-service/getAllOrders_customerId",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order data", response.data);

      if (response.data) {
        setOrders(response.data);
        response.data.forEach((item) => {
          console.log(item.newOrderId, item.orderStatus);
        });
      } else {
        alert("No orders found!");
      }
    } catch (error) {
      // console.error('Error fetching orders:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  // const getOrderStatusText = (orderStatus) => {
  //   // console.log("order status",orderStatus);
  //   const statusNumber = Number(orderStatus);
  //   switch (statusNumber) {
  //     case 0:
  //       return "Incomplete";
  //     case 1:
  //       return "Placed";
  //     case 2:
  //       return "Accepted";
  //     case 3:
  //       return "Assigned";
  //     case 4:
  //       return "Delivered";
  //     case 5:
  //       return "Rejected";
  //     case 6:
  //       return "Cancelled";
  //     default:
  //       return "Unknown";
  //   }
  // };

  const getOrderStatusText = (orderStatus) => {
    if (orderStatus === "PickedUp") {
      return "PickedUp";
    }

    const statusNumber = Number(orderStatus);
    switch (statusNumber) {
      case 0:
        return "Incomplete";
      case 1:
        return "Placed";
      case 2:
        return "Accepted";
      case 3:
        return "Assigned";
      case 4:
        return "Delivered";
      case 5:
        return "Rejected";
      case 6:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // Navigate to order details page
  const orderDetails = (item) => {
    console.log("sravaniOrders", item.orderId);
    const status = getOrderStatusText(item.orderStatus);
    console.log({ status });

    navigation.navigate("Order Details", {
      order_id: item.orderId,
      status,
      new_Order_Id: item.newOrderId,
    });
  };

  // Render each order
  const renderOrder = ({ item }) => (
    <TouchableOpacity
      style={styles.orderList}
      onPress={() => orderDetails(item)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../../assets/tick.png")}
          style={styles.tickImage}
        />
      </View>
      <View style={styles.orderInfo}>
        {/* <Text style={styles.date}>{item?.orderDate?.slice(0, 10)}</Text> */}
        <Text style={styles.date}>
          {dayjs(item?.orderDate).format("MMM DD, YYYY hh:mm:ss A")}
        </Text>
        <Text style={styles.orderId}>
          Order Id: <Text>{item.newOrderId}</Text>
        </Text>
        <Text style={styles.orderAmount}>
          Amount: Rs. {parseFloat(item.grandTotal).toFixed(2)}
        </Text>
        <Text style={styles.paymentType}>
          Payment: {item.paymentType === 2 ? "ONLINE" : "COD"}
          {item.paymentType === 2 && item.paymentStatus === 0 && (
            <Text style={styles.paymentPending}> (Pending)</Text>
          )}
        </Text>
        <Text style={styles.status}>
          Status: {getOrderStatusText(item.orderStatus)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading Orders...</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      {orders.length === 0 ? (
        <Text style={styles.noOrdersText}>No orders found!</Text>
      ) : (
        <>
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.orderId.toString()}
            contentContainerStyle={styles.orderview}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />

          {/* <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate("My Cancelled Item Details")}
      >
        <Text style={styles.footerButtonText}>Cancelled Items</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate("My Exchanged Item Details")}
      >
        <Text style={styles.footerButtonText}>Exchanged Items</Text>
      </TouchableOpacity>
    </View> */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noOrdersText: {
    textAlign: "center",
    marginTop: 200,
    fontSize: 18,
    color: "#555",
  },
  orderList: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
    // paddingBottom:100
  },
  imageContainer: {
    backgroundColor: COLORS.quantitybutton,
    borderRadius: 7,
    padding: 10,
    width: width * 0.2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  tickImage: {
    width: 40,
    height: 40,
  },
  orderInfo: {
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
  orderId: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  orderAmount: {
    fontSize: 13,
    marginVertical: 5,
  },
  paymentType: {
    fontSize: 15,
    color: COLORS.services,
  },
  paymentPending: {
    color: "red",
  },
  status: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  orderview: {
    paddingBottom: 120,
  },
  footer: {
    marginBottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#e87f02",
    alignItems: "center",
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default OrderScreen;
