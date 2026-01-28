import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
// import * as FileSystem from "expo-file-system";
import {File,Directory,Paths} from 'expo-file-system';
import * as Sharing from "expo-sharing";
import { useSelector } from "react-redux";
import Checkbox from "expo-checkbox";
import { COLORS } from "../../../../Redux/constants/theme";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL, { userStage } from "../../../../Config";
import useReorder from "./Reorder";
const { width, height } = Dimensions.get("window");
const OrderDetails = () => {
  const { handleReorder } = useReorder();
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const [orderstatus, setOrderStatus] = useState();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsmodelVisible] = useState(false);
  const [isExchangeVisible, setIsExchangeVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { order_id, status } = route.params;
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedCancelItems, setSelectedCancelItems] = useState({});
  const [selectedExchangeItems, setSelectedExchangeItems] = useState({});
  const [hideCancelbtn, setHideCancelBtn] = useState(false);
  const [isExchangeComplete, setIsExchangeComplete] = useState(false);
  const [comments, setComments] = useState();
  const [orderFeedback, setOrderFeedback] = useState([]);
  const [deliveryBoyDetails, setDeliveryBoyDetails] = useState([]);
  const [canExchange, setCanExchange] = useState(false);
  const [exchangeInfo, setExchangeInfo] = useState(null);
  const [invoice, setInvoice] = useState();
  const [downloading, setDownloading] = useState(false);
  const [downloadedUri, setDownloadedUri] = useState(null);
  // console.log("order id", order_id);
const emojis = [
    { emoji: "😡", label: "Very Bad", color: "#FFB3B3", value: "POOR" },
    { emoji: "😟", label: "Bad", color: "#FFD9B3", value: "BELOWAVERAGE" },
    { emoji: "🙂", label: "Average", color: "#FFFFB3", value: "AVERAGE" },
    { emoji: "😃", label: "Good", color: "#D9FFB3", value: "GOOD" },
    { emoji: "🤩", label: "Excellent", color: "#B3FFB3", value: "EXCELLENT" },
  ];
const [selectedEmoji, setSelectedEmoji] = useState(null);

  const handleEmojiPress = (index) => {
    setSelectedEmoji(index);
    console.log("Selected emoji:", emojis[index].value);
  };


  let selectedLabel = "";
  const handleSubmit = () => {
    if (selectedEmoji === null || selectedEmoji === undefined) {
      Alert.alert("Feedback Required", "Please select an emoji to proceed.");
    } else {
      selectedLabel = emojis[selectedEmoji].value;
      console.log("Selected feedback:", selectedLabel);
    }
    console.log(comments);

    let data = {
      comments: comments,
      feedbackStatus: selectedLabel,
      feedback_user_id: customerId,
      orderid: order_id,
    };
    console.log({ data });

    axios({
      method: "post",
      url: BASE_URL + "order-service/submitfeedback",
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("feedback submitted response", response.data);
        Alert.alert("Success", "Feedback submitted successfully!", [
          {
            text: "OK",
            onPress: () => {
              feedbackGet();
            },
          },
        ]);
        getOrderDetails();
        // navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error", "Failed to submit feedback.");
      });
  };



  function deliveryBoyDetailsfunc() {
    let data = {
      orderId: order_id,
      orderStatus: status,
    };
    axios({
      method: "post",
      url: BASE_URL + `order-service/deliveryBoyAssigneData`,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        // console.log("deliveryBoyAssigneData Response", response.data[0]);
        setDeliveryBoyDetails(response.data[0]);
      })
      .catch((err) => {
        console.log("deliveryBoyAssigneData error", err.response);
      });
  }
  useEffect(() => {
  getOrderDetails();
    feedbackGet();
    deliveryBoyDetailsfunc();
    const checkIfDownloaded = async () => {
    const storedUri = await AsyncStorage.getItem("downloadedInvoiceUri");
   if (storedUri) {
  const file = new File(storedUri);
  if (file.exists) {
    setDownloadedUri(storedUri);
  }
}
  };

  checkIfDownloaded();
  }, []);

  const feedbackGet = async () => {
    setLoading(true);
    axios({
      method: "get",
      url:
        BASE_URL +
        `order-service/feedback?feedbackUserId=${customerId}&orderid=${order_id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        // console.log("feedbackGet", response);
        setOrderFeedback(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error", error.response);
      });
  };



  const getOrderDetails = async () => {
    console.log("getting order details");

    const data = {
      method: "get",
      url: BASE_URL + "order-service/getOrdersByOrderId/" + order_id,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios(data);

      console.log("order data", response);

      setOrderData(response.data);
      checkExchangeEligibility(response.data);
      console.log("invoice url", response.data[0].invoiceUrl);

      setInvoice(response.data[0].invoiceUrl);
      const orderStatus = response.data[0].orderStatus;
      setOrderStatus(orderStatus);
    } catch (error) {
      // console.error("Error fetching order details:", error.response);
    }
  };

  function checkExchangeEligibility(orderData) {
    console.log("Starting exchange eligibility check");

    const order = Array.isArray(orderData) ? orderData[0] : orderData;

    console.log("Processing order:", order.orderId);

    // Check if orderHistory exists and is an array
    if (!order.orderHistory || !Array.isArray(order.orderHistory)) {
      console.log("Order history is missing or not an array");
      setCanExchange(false);
      return;
    }

    console.log("Order history length:", order.orderHistory.length);

    let deliveredDateEntry = null;

    //iterate through order history to find the delivered date----
    for (let i = 0; i < order.orderHistory.length; i++) {
      const entry = order.orderHistory[i];
      console.log(`Checking entry ${i}:`, entry);

      if (entry && entry.deliveredDate) {
        console.log(
          `Found delivered date entry at index ${i}:`,
          entry.deliveredDate
        );
        deliveredDateEntry = entry;
        break;
      }
    }

    if (!deliveredDateEntry) {
      console.log("No delivered date entry found");
      setCanExchange(false);
      return;
    }

    // Parse the delivery date
    const deliveredDate = new Date(deliveredDateEntry.deliveredDate);
    console.log("Delivered date:", deliveredDate);

    const exchangeEndDate = new Date(deliveredDate);
    exchangeEndDate.setDate(deliveredDate.getDate() + 10);
    console.log("Exchange end date:", exchangeEndDate);

    const currentDate = new Date();
    console.log("Current date:", currentDate);

    const canExchange =
      currentDate >= deliveredDate && currentDate <= exchangeEndDate;
    console.log("Can exchange:", canExchange);

    setCanExchange(canExchange);
  }

  const toggleExchangeItemSelection = (id, quantity) => {
    setSelectedExchangeItems((prev) => ({
      ...prev,
      [id]: prev[id]
        ? { ...prev[id], checked: !prev[id].checked }
        : { checked: true, reason: "", quantity },
    }));
  };

  const handleExchangeReason = (id, text) => {
    setSelectedExchangeItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], reason: text },
    }));
  };

  const handleExchangeSubmit = () => {
    const result = Object.entries(selectedExchangeItems)
      .filter(([_, value]) => value.checked)
      .map(([key, value]) => ({
        itemId: key,
        reason: value.reason,
      }));

    const checkbox = Object.entries(selectedExchangeItems).filter(
      ([_, value]) => value.checked
    );

    if (checkbox.length == 0) {
      Alert.alert("Error", "Please select at least one item for exchange.");
      return;
    }

    const hasEmptyReasons = result.some((item) => !item.reason);

    if (hasEmptyReasons) {
      Alert.alert("Error", "Please provide a reason for Exchange.");
      return;
    }

    const data = {
      exchangeListItemRequest: result,
      exchangeQuantity: 1,
      orderId: order_id,
      type: "exchange",
      userId: customerId,
    };
    console.log("exchange data", data);
    setLoading(true);
    axios({
      url: `${BASE_URL}order-service/exchangeOrder`,
      method: "patch",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    })
      .then((res) => {
        console.log(" exchange response", res);
        Alert.alert("Success", res.data.type, [
          {
            text: "OK",
            onPress: () => navigation.navigate("My Exchanged Item Details"),
          },
        ]);
        setIsExchangeVisible(false);
        getOrderDetails();
        setLoading(false);
      })
      .catch((err) => {
        // console.log("error cancel", err.response);
      });
  };

  const handleDownload = async (invoice) => {
  if (!invoice) {
    Alert.alert("Invalid invoice link");
    return;
  }

  try {
    setDownloading(true);

    // Create a File instance for the destination
    const destinationFile = new File(Paths.document, "invoice.pdf");

    // Download the file
    const downloadedFile = await File.downloadFileAsync(invoice, destinationFile);

    console.log("Finished downloading to ", downloadedFile.uri);

    setDownloadedUri(downloadedFile.uri);
    await AsyncStorage.setItem("downloadedInvoiceUri", downloadedFile.uri);
    Alert.alert("Invoice Download completed");
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert("Error", "Failed to download invoice.");
  } finally {
    setDownloading(false);
  }
};

  const openInvoice = async () => {
    if (downloadedUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(downloadedUri);
    } else {
      Alert.alert("No downloaded file found.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
      </View>
    );
  }

  const orderDetails = orderData.length > 0 ? orderData[0] : null;
  if (!orderDetails) {
    return (
      <View style={styles.center}>
        <Text style={styles.heading}>Loading Order Details...</Text>
      </View>
    );
  }

  const {
    customerName,
    customerMobile,
    mobileNumber,
    grandTotal,
    orderItems,
    deliveryFee,
    paymentType,
    orderAddress,
    pinCode,
    couponValue,
    walletAmount,
    subTotal,
    gstAmount,
    discountAmount,
    orderHistory,
    orderDate
  } = orderDetails;
  // console.log("Order details", orderDetails);

  const toggleCancelItemSelection = (id) => {
    setSelectedCancelItems((prev) => ({
      ...prev,
      [id]: prev[id]
        ? { ...prev[id], checked: !prev[id].checked }
        : { checked: true, reason: "" },
    }));
  };

  const handleCancelReason = (id, text) => {
    setSelectedCancelItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], reason: text },
    }));
  };

  const handleCancelSubmit = () => {
    const result = Object.entries(selectedCancelItems)
      .filter(([_, value]) => value.checked)
      .map(([key, value]) => ({
        itemId: key,
        cancelReason: value.reason,
        orderId: order_id,
      }));

    const hasEmptyReasons = result.some((item) => !item.cancelReason);

    if (hasEmptyReasons) {
      Alert.alert(
        "Error",
        "Please provide a reason for cancelling all selected items."
      );
      return;
    }

    setLoading(true);
    const data = {
      userId: customerId,
      refundDtoList: result,
    };

    // console.log({ data });

    axios({
      url: `${BASE_URL}erice-service/order/user_cancel_orderBasedOnItemId`,
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: data,
    })
      .then((res) => {
        // console.log("response", res.data);
        Alert.alert("Success", res.data.message, [
          {
            text: "OK",
            onPress: () => navigation.navigate("My Cancelled Item Details"),
          },
        ]);
        setIsmodelVisible(false);
        getOrderDetails();
        setLoading(false);
      })
      .catch((err) => {
        // console.log("error cancel", err.response);
      });
  };

  const makeCall = (phoneNumber) => {
    const cleanedNumber = phoneNumber.replace(/\D/g, "");
    const phoneUrl = `tel:${cleanedNumber}`;

    Linking.openURL(phoneUrl).catch((error) => {
      Alert.alert("Error", "Failed to open the phone dialer.");
      console.error("Error:", error);
    });
  };

  const allItemsExchangeRequested = orderItems.every(
    (item) => item.status === "EXCHANGEREQUESTED"
  );

   const orderPlacedTime = new Date(orderDetails.orderDate);
  const now = new Date();
  const timeDifferenceMs = now - orderPlacedTime;
  const hours24InMs = 24 * 60 * 60 * 1000;
  const isWithin24Hours = timeDifferenceMs<hours24InMs;

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.receiptHeader}>
          {/* Order ID Section */}
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>
              Order ID:{" "}
              <Text style={styles.orderIdValue}>
                {route.params.new_Order_Id}
              </Text>
            </Text>
          </View>

        </View>
        {/* Order Items */}
        {orderItems.length > 0 ? (
          <Text style={styles.sectionTitle}>Order Items</Text>
        ) : null}
        {orderItems.length > 0 ? (
          <View>
            <View style={styles.section}>
              <View style={styles.headerRow}>
                <Text style={styles.headerText}>Item Name</Text>
                <Text style={styles.headerText}>Qty</Text>
                <Text style={styles.headerText}>Price</Text>
                <Text style={styles.headerText}>Total</Text>
              </View>
              <FlatList
                data={orderItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    {item.status === "EXCHANGEREQUESTED" && (
                      <View style={styles.exchangeLabelContainer}>
                        <Text style={styles.exchangeLabel}>
                          Exchange Requested
                        </Text>
                      </View>
                    )}
                    <View
                      style={[
                        styles.itemRow,
                        item.status === "EXCHANGEREQUESTED" &&
                          styles.exchangeRequestedItem,
                      ]}
                    >
                      <Text style={styles.itemName}>{item.itemName}</Text>
                      <Text style={styles.itemDetail}>{item.quantity}</Text>
                      <Text style={styles.itemDetail}>
                        ₹{item.price / item.quantity}
                      </Text>
                      <Text style={styles.itemDetail}>₹{item.price}</Text>
                    </View>
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.listContent}
              />
              {orderstatus === "4" && (
                <TouchableOpacity
                  style={styles.reorderButton}
                  onPress={() => handleReorder(orderItems)}
                >
                  <Text style={styles.reorderIcon}>🔄</Text>
                  <Text style={styles.reorderButtonText}>Reorder Items</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : null}

        {/* Feedback */}
        {orderstatus === "4" ? (
          <View>
            {orderFeedback.length === 0 ? (
              <View>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
                >
                  Rate your order Experience{" "}
                </Text>
                <View style={styles.section}>
                  <View>
                    <View style={styles.emojiContainer}>
                      {emojis.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.emojiBox,
                            selectedEmoji === index && {
                              backgroundColor: item.color,
                            },
                          ]}
                          onPress={() => handleEmojiPress(index)}
                        >
                          <Text style={styles.emoji}>{item.emoji}</Text>
                          <Text style={styles.emojiLabel}>{item.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your feedback (Optional)"
                        value={comments}
                        multiline={true}
                        onChangeText={(text) => setComments(text)}
                        noOfLines={4}
                        scrollEnabled="true"
                      />

                      {selectedEmoji != null ? (
                        <TouchableOpacity
                          onPress={handleSubmit}
                          style={styles.sendBtn}
                        >
                          <Icon name="send" size={20} color="white" />
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.ViewSendBtn}>
                          <Icon name="send" size={18} color="white" />
                        </View>
                      )}
                    </View>
                    {/* <TouchableOpacity
                     style={styles.submitButton}
                    onPress={handleSubmit}
                       >
               <Text style={styles.submitButtonText}>Submit</Text>
                 </TouchableOpacity> */}
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.feedbackTitle}>
                  Your Submitted Feedback
                </Text>

                <View>
                  <View style={styles.feedbackContainer}>
                    <View style={styles.feedbackBox}>
                      <View style={styles.feedbackRow}>
                        <Text style={styles.feedbackLabel}>
                          Feedback Status :
                        </Text>
                        <Text style={styles.feedbackText}>
                          {orderFeedback[0]?.feedbackStatus || "Not Available"}
                        </Text>
                      </View>
                      <View style={styles.feedbackRow}>
                        <Text style={styles.feedbackLabel}>Comments :</Text>
                        <Text style={styles.feedbackText}>
                          {orderFeedback[0]?.comments || "No comments provided"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : null}

        {/* Address Details */}
        <Text style={styles.sectionTitle}>Address Details</Text>
        {isWithin24Hours && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Update Order Address", {
                  orderAddress,
                  order_id,
                })
              }
              style={{
                flexDirection: "row",
                justifyContent:"flex-end",
                // alignItems: "center",
                marginLeft:200
              }}
            >
              <FontAwesome name="edit" size={20} color="#ecb01e" />

              <Text
                style={{
                  color: "#4B0082",
                  fontWeight: "600",
                  fontSize: 16,
                  marginBottom: 2,
                }}
              >
                Update
              </Text>
            </TouchableOpacity>
          )}

        <View style={styles.section}>
          <Text style={styles.detailText}>
            Customer Name:{" "}
            <Text style={styles.detailValue}>{customerName} </Text>
          </Text>
          <Text style={styles.detailText}>
            Mobile:{" "}
            <Text style={styles.detailValue}>
              {mobileNumber ? mobileNumber : customerMobile}
            </Text>
          </Text>

          <Text style={styles.detailText}>
            Pincode:{" "}
            <Text style={styles.detailValue}>{orderAddress?.pincode}</Text>
          </Text>
          <Text style={styles.detailText}>Address:</Text>
          <Text style={styles.detailValue}>
            {" "}
            {orderAddress?.flatNo}, {orderAddress?.landMark},
            {orderAddress?.address}
          </Text>
        </View>

        {/* Time Slot Details */}
        <Text style={styles.sectionTitle}>Selected Time Slot Details</Text>

        <View style={styles.section}>
          {orderDetails.timeSlot != "" ? (
            <Text style={styles.detailText}>
              Expected Time Slot :{" "}
              <Text style={styles.detailValue}>
                {orderDetails.dayOfWeek} , {orderDetails.expectedDeliveryDate} ,{" "}
                {orderDetails.timeSlot}{" "}
              </Text>
            </Text>
          ) : (
            <Text>No time Slot Selected</Text>
          )}
        </View>

        {orderstatus == "5" ? (
          <View>
            <Text style={styles.sectionTitle}>Rejected Reason</Text>
            <View style={styles.section}>
              <Text>{orderDetails.reason} </Text>
            </View>
          </View>
        ) : null}

        {/* Delivery Boy Details */}
        {orderstatus === "3" || orderstatus == "PickedUp" ? (
          <>
            <Text style={styles.sectionTitle}>Delivery Boy Details</Text>
            <View>
              <View style={styles.section1}>
                <View style={{ width: width * 0.65 }}>
                  <Text>
                    Delivery Boy Name:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {deliveryBoyDetails?.deliveryBoyName}
                    </Text>
                  </Text>
                  <Text>
                    Delivery Boy Mobile Number:{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {deliveryBoyDetails?.deliveryBoyMobile}
                    </Text>
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#4CAF50",
                    borderRadius: 5,
                    width: 40,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => makeCall(deliveryBoyDetails.deliveryBoyMobile)}
                >
                  <FontAwesome name="phone" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : null}

        {/* Billing Details */}
        <Text style={styles.sectionTitle}>Billing Details</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Sub Total:</Text>
            <Text style={styles.value}>₹{subTotal}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Delivery Fee:</Text>
            <Text style={styles.value}>+{deliveryFee}</Text>
          </View>

          {gstAmount != null && gstAmount != 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>GST:</Text>
              <Text style={styles.value}>+{gstAmount?.toFixed(2)}</Text>
            </View>
          )}

          {couponValue != null && couponValue != 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Coupon Value:</Text>
              <Text style={styles.value}>-₹{couponValue}</Text>
            </View>
          )}

          {walletAmount != null && walletAmount != 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Wallet Amount:</Text>
              <Text style={styles.value}>-₹{walletAmount}</Text>
            </View>
          )}
          {discountAmount != null && discountAmount != 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Coupon Applied:</Text>
              <Text style={styles.value}>-₹{discountAmount}</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Payment Type:</Text>
            <Text style={styles.value}>
              {paymentType == 2 ? "ONLINE" : "COD"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Order Status:</Text>
            <Text style={styles.value}>{status}</Text>
          </View>

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>
        </View>
        {/* Invoice Download Section */}
          <View style={styles.invoiceContainer}>
            {invoice && typeof invoice === "string" && invoice.trim() !== "" ? (
              downloading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#4CAF50" />
                  <Text style={styles.loadingText}>Downloading...</Text>
                </View>
              ) : downloadedUri ? (
                <TouchableOpacity
                  style={[styles.invoiceButton, styles.viewButton]}
                  onPress={openInvoice}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>View Downloaded Invoice</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.invoiceButton, styles.downloadButton]}
                  onPress={() => handleDownload(invoice)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Download Invoice</Text>
                </TouchableOpacity>
              )
            ) : null}
          </View>
      </ScrollView>
      {orderstatus === "6" ? (
        <View style={styles.footer}>
          <Text style={styles.cancelButtonText1}>
            You Already Cancelled This Order
          </Text>
        </View>
      ) : null}

      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        {orderstatus !== "6" && orderItems.length != 0 && (
          <View>
            {orderstatus == 1 || orderstatus == 2 || orderstatus == 3 ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginHorizontal: 5,
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                }}
              >
              
              </View>
            ) : orderstatus == 4 && canExchange ? (
              allItemsExchangeRequested ? (
                <View style={{ padding: 10, alignItems: "center" }}>
                  <Text style={{ color: "red", fontSize: 16 }}>
                    All items in the order are already requested for exchange.
                  </Text>
                </View>
              ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginHorizontal: 5,
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                }}
              >
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsExchangeVisible(true)

                  }
                >
                  <View>
                    <Text style={styles.cancelButtonText}>Exchange Order</Text>
                  </View>
                </TouchableOpacity>
              </View>)
            ) : null}
          </View>
        )}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() =>
            navigation.navigate("Write To Us", { orderId: order_id })
          }
        >
          <Text style={styles.cancelButtonText}>Write To Us</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.footer1}>
        {orderstatus == 4 && canExchange && allItemsExchangeRequested && (
          <View style={styles.exchangeMessageContainer}>
            <Text style={styles.exchangeMessage}>
              All items in the order are already requested for exchange.
            </Text>
          </View>
        )}

        <View style={styles.footerButtonsContainer}>
          {orderstatus !== "6" &&
            orderItems.length !== 0 &&
            orderstatus == 4 &&
            canExchange &&
            !allItemsExchangeRequested && (
              <TouchableOpacity
                style={styles.exchangeButton}
                onPress={() => setIsExchangeVisible(true)}
              >
                <Text style={styles.buttonText}>Exchange Order</Text>
              </TouchableOpacity>
            )}

          <TouchableOpacity
            style={[
              styles.writeToUsButton,

              (orderstatus == "6" ||
                orderItems.length == 0 ||
                orderstatus != 4 ||
                !canExchange ||
                allItemsExchangeRequested) &&
                styles.fullWidthButton,
            ]}
            onPress={() =>
              navigation.navigate("Write To Us", { orderId: order_id })
            }
          >
            <Text style={styles.buttonText}>Write To Us</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isModalVisible && (
        <Modal visible={isModalVisible} transparent animationType="slide">
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Cancel Items</Text>
              <FlatList
                data={orderItems}
                keyExtractor={(item) => item.itemId.toString()}
                renderItem={({ item }) => (
                  <View>
                    <View style={styles.itemRow}>
                      <Checkbox
                        value={
                          selectedCancelItems[item.itemId]?.checked || false
                        }
                        onValueChange={() =>
                          toggleCancelItemSelection(item.itemId)
                        }
                        color="green"
                      />
                      <Text style={styles.itemName}>{item.itemName}</Text>
                      <Text style={styles.itemDetail}>{item.quantity}</Text>
                      <Text style={styles.itemDetail}>₹{item.price}</Text>
                    </View>
                    {selectedCancelItems[item.itemId]?.checked && (
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Please enter a reason for cancellation"
                        multiline
                        numberOfLines={4}
                        value={selectedCancelItems[item.itemId]?.reason || ""}
                        onChangeText={(text) =>
                          handleCancelReason(item.itemId, text)
                        }
                      />
                    )}
                  </View>
                )}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsmodelVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => handleCancelSubmit()}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                {loading && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                  >
                    <ActivityIndicator size="large" color="#000" />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
      {/* {orderstatus === "4" ? (
        <View style={styles.footer1}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => cancelOrder()}
            disabled={true}
          >
            <Text style={styles.cancelButtonText1}>
              This Order Has Already Been Delivered
            </Text>
          </TouchableOpacity>
        </View>
      ) : null} */}
      {isExchangeVisible && (
        <Modal visible={isExchangeVisible} transparent animationType="slide">
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Exchange Items</Text>
              <FlatList
                data={orderItems.filter(
                  (item) => item.status !== "EXCHANGEREQUESTED"
                )}
                keyExtractor={(item) => item.itemId}
                renderItem={({ item }) => (
                  <View>
                    <View style={styles.itemRow}>
                      <Checkbox
                        value={
                          selectedExchangeItems[item.itemId]?.checked || false
                        }
                        onValueChange={() =>
                          toggleExchangeItemSelection(
                            item.itemId,
                            item.quantity
                          )
                        }
                        color="green"
                      />
                      <Text style={styles.itemName}>{item.itemName}</Text>
                      <Text style={styles.itemDetail}>{item.quantity}</Text>
                      <Text style={styles.itemDetail}>₹{item.price}</Text>
                    </View>
                    {selectedExchangeItems[item.itemId]?.checked && (
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Please enter a reason for Exchange"
                        multiline
                        numberOfLines={4}
                        value={selectedExchangeItems[item.itemId]?.reason || ""}
                        onChangeText={(text) =>
                          handleExchangeReason(item.itemId, text)
                        }
                      />
                    )}
                  </View>
                )}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton1}
                  onPress={() => setIsExchangeVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => handleExchangeSubmit()}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                {loading && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                  >
                    <ActivityIndicator size="large" color="#000" />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  receiptHeader: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderIdContainer: {
    marginBottom: 20,
    alignItems: "center",
  },

  orderIdLabel: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#626262",
    textAlign: "center",
  },
  orderId: {
    color: "#fff",
    fontSize: 20,
    marginTop: 5,
  },
  orderIdValue: {
    fontWeight: "normal",
    color: "#000",
  },

  invoiceContainer: {
    alignItems: "center",
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },

  invoiceButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width:width*0.8,
    // minWidth: 200,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginBottom:200
  },

  downloadButton: {
    backgroundColor: "#fff",
  },

  viewButton: {
    backgroundColor: "#fff",
  },

  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#dcdcdc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    width: width * 0.9,
  },
  section1: {
    backgroundColor: "#dcdcdc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  detailValue: {
    fontWeight: "600",
    color: "#333",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    flexWrap: "wrap",
  },

  itemName: {
    paddingLeft: 5,
    fontSize: 13,
    flex: 1.5,
    color: "#000",
    width: width * 0.3,
  },
  itemDetail: {
    fontSize: 15,
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
    alignSelf: "center",
  },

  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  feebacksection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    width: width * 0.7,
    // height: 40,
  },
  sendBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: width * 0.1,
    height: 40,
  },
  ViewSendBtn: {
    backgroundColor: "#808080",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: width * 0.1,
    height: 40,
    marginRight: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    // paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
  },

  emojiBox: {
    // width: 65,
    // height: 65,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 7,
  },
  emoji: {
    fontSize: 32,
  },
  emojiLabel: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    width: width * 0.4,
  },
  submitButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    width: width * 0.4,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f2f2f2",
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  headerText1: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  totalSection: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#dcdcdc",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FA7070",
  },
  flatNo: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  landMark: {
    fontSize: 16,
    color: "#000",
    fontStyle: "italic",
  },
  address: {
    fontSize: 16,
    color: "#000",
    textDecorationLine: "underline",
  },
  // cancelButton: {
  //   marginBottom: 15,
  //   backgroundColor: "#fff",
  //   padding: 10,
  //   borderRadius: 5,
  //   // alignItems: "center",
  //   marginTop: 10,
  //   marginRight: 10,
  // },
  cancelButtonTextModal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButtonText1: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
  },
  footer: {
    padding: 5,
    borderTopColor: "#ccc",
  },
  footer1: {
    marginTop: 30,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
  },
  modalContainer: {
    position: "absolute",

    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    marginTop: height * 0.3,
    width: width * 0.9,
    height: "auto",
  },
  modal: {
    padding: 30,
    borderRadius: 15,
    width: width * 0.85,
    // elevation:5,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  modalTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
  },
  modalInput: {
    width: width * 0.8,
    height: height / 8,
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    marginBottom: 25,
    marginLeft: 10,
  },
  modalInput1: {
    width: width * 0.8,
    // height: height/2,
    borderColor: "#ccc",
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: width * 0.8,
  },
  cancelButtonModal: {
    backgroundColor: "grey",
    width: width * 0.35,
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    // marginRight:10
  },
  submitButtonModal: {
    backgroundColor: "#4caf50",
    width: width * 0.35,
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  cancelButton1: {
    // backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#00bfff",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  checkboxSelected: {
    backgroundColor: "blue",
    borderColor: "blue",
  },
  checkboxTick: {
    color: "white",
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#A6AEBF",
    marginHorizontal: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#fff",
  },
  heading: {
    color: COLORS.services,
  },
  feedbackContainer: {
    marginVertical: 15,
    // paddingHorizontal: 10,
    backgroundColor: "#dcdcdc",
    width: width * 0.9,
    borderRadius: 10,
  },
  feedbackTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  feedbackBox: {
    padding: 15,
    borderRadius: 40,
  },
  feedbackRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  feedbackLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 5,
  },
  feedbackText: {
    fontSize: 16,
    color: "#555",
  },
  exchangeRequestedItem: {
    backgroundColor: "#f8f9fa",
  },
  exchangeLabel: {
    // width: '100%',
    marginTop: 6,
    color: COLORS.services,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    alignSelf: "center",
    fontWeight: "bold",
  },
  footer: {
    marginBottom: 100,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  exchangeMessageContainer: {
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#fff3f3",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ffcccb",
  },
  exchangeMessage: {
    color: COLORS.services,
    fontSize: 14,
    textAlign: "center",
  },
  footerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  exchangeButton: {
    backgroundColor: "#A6AEBF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  writeToUsButton: {
    backgroundColor: "#A6AEBF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  reorderButton: {
    backgroundColor: "#38a169",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#38a169",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  reorderIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  reorderButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default OrderDetails;
