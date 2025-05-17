import React, { useState, useCallback } from "react";
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
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { COLORS } from "../../../../Redux/constants/theme";
import { useSelector } from "react-redux";
import BASE_URL from "../../../../Config";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "react-native-vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

const OrderScreen = () => {
  const navigation = useNavigation();
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  
  // State variables
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeSlotData, setTimeSlotData] = useState([]);
  const [dateTimeModalVisible, setDateTimeModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load orders when screen is focused
  useFocusEffect(
    useCallback(() => {
      getOrders();
    }, [])
  );

  // Helper function to get next seven days for scheduling
  const getNextSevenDays = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  
    return [1, 2, 3, 4, 5, 6, 7].map(offset => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      return {
        dayOfWeek: daysOfWeek[date.getDay()].toUpperCase(),
        date: `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`,
        formattedDay: daysOfWeek[date.getDay()]
      };
    });
  };
  
  // Fetch time slots for rescheduling
  const fetchTimeSlot = (selectedOrderId) => {
    setLoading(true);
    setError(null);
    setOrderId(selectedOrderId);
    
    axios({
      method: "get",
      url: BASE_URL + `order-service/fetchTimeSlotlist`,
    })
    .then((response) => {
      const potentialDays = getNextSevenDays();
      const processedData = [];
      
      for (let dayInfo of potentialDays) {
        // Find matching slot for this day
        const matchingSlot = response.data.find(
          slot => slot.dayOfWeek === dayInfo.dayOfWeek && slot.isAvailable === false
        );
        
        if (matchingSlot) {
          const dayEntry = {
            id: matchingSlot.id,
            day: dayInfo.formattedDay,
            date: dayInfo.date,
            slots: [
              { id: `${matchingSlot.id}-1`, time: matchingSlot.timeSlot1 },
              // { id: `${matchingSlot.id}-2`, time: matchingSlot.timeSlot2 },
              // { id: `${matchingSlot.id}-3`, time: matchingSlot.timeSlot3 },
              // { id: `${matchingSlot.id}-4`, time: matchingSlot.timeSlot4 }
            ],
            isAvailable: matchingSlot.isAvailable
          };
          
          processedData.push(dayEntry);
          
          // Take first 3 available days
          if (processedData.length === 3) break;
        }
      }
      
      // Ensure we always have 3 days even if not enough slots found
      while (processedData.length < 3) {
        processedData.push({
          id: null,
          day: 'No Slot',
          date: 'N/A',
          slots: [],
          isAvailable: true
        });
      }
      
      setTimeSlotData(processedData);
      setDateTimeModalVisible(true);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching time slots", error);
      setLoading(false);
      Alert.alert("Error", "Failed to fetch time slots");
    });
  };
  
  // Handle time slot selection and update
  const handleSlotSelect = (day, date, time) => {
    setSelectedSlot({day, date, time});
    
    const data = {
      "dayOfWeek": day.toUpperCase(),
      "expectedDeliveryDate": date,
      "orderId": orderId,
      "timeSlot": time,
      "userId": customerId
    };
    
    setLoader(true);
    axios({
      method: "patch",
      url: BASE_URL + `order-service/userSelectedDiffslot`,
      data: data
    })
    .then((response) => {
      setDateTimeModalVisible(false);
      getOrders();
      setLoader(false);
      Alert.alert("Success", "Successfully updated delivery time slot");
    })
    .catch((error) => {
      console.log("Update Time Slot Error", error.response);
      setDateTimeModalVisible(false);
      setLoader(false);
      Alert.alert("Error", "Failed to update time slot");
    });
  };

  // Pull to refresh orders
  const onRefresh = () => {
    setRefreshing(true);
    getOrders().then(() => setRefreshing(false));
  };

  // Fetch all orders
  const getOrders = async () => {
    const data = { userId: customerId };
    setLoading(true);

    try {
      const response = await axios.post(
        BASE_URL + "order-service/getAllOrders_customerId",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
     console.log("Order data", response);
     
      if (response.data) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Human-readable order status
  const getOrderStatusText = (orderStatus) => {
    if (orderStatus === "PickedUp") {
      return "Picked Up";
    }

    const statusNumber = Number(orderStatus);
    switch (statusNumber) {
      case 0: return "Incomplete";
      case 1: return "Placed";
      case 2: return "Accepted";
      case 3: return "Assigned";
      case 4: return "Delivered";
      case 5: return "Rejected";
      case 6: return "Cancelled";
      default: return "Unknown";
    }
  };

  // Get status color for visual indication
  const getStatusColor = (orderStatus) => {
    const statusNumber = Number(orderStatus);
    switch (statusNumber) {
      case 1: return "#4B0082"; 
      case 2: return "#4B0082";
      case 3: return "#4B0082"; 
      case 4: return "#4CAF50";
      case 5:
      case 6: return "#F44336"; 
      default: return "#757575"; 
    }
  };

  // Navigate to order details
  const navigateToOrderDetails = (item) => {
    const status = getOrderStatusText(item.orderStatus);
    navigation.navigate("Order Details", {
      order_id: item.orderId,
      status,
      new_Order_Id: item.newOrderId,
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render individual order item
  const renderOrder = ({ item }) => {
    const statusText = getOrderStatusText(item.orderStatus);
    const statusColor = getStatusColor(item.orderStatus);
    const canUpdateTimeSlot = item.orderStatus == "1" || item.orderStatus == "2";
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order #{item.newOrderId}</Text>
          <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
        </View>
        
        <View style={styles.orderContent}>
          <View style={styles.orderIconContainer}>
            <View style={[styles.orderIcon, { backgroundColor: COLORS.quantitybutton }]}>
              <Image
                source={require("../../../../assets/tick.png")}
                style={styles.tickImage}
              />
            </View>
          </View>
          
          <View style={styles.orderDetails}>
            <Text style={styles.orderAmount}>
              ₹{parseFloat(item.grandTotal).toFixed(2)}
            </Text>
            
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentLabel}>Payment:</Text>
              <Text style={styles.paymentType}>
                {item.paymentType === 2 ? "ONLINE" : "COD"}
                {item.paymentType === 2 && item.paymentStatus === 0 && (
                  <Text style={styles.paymentPending}> (Pending)</Text>
                )}
              </Text>
            </View>
            
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Status:</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>{statusText}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => navigateToOrderDetails(item)}
          >
            <Ionicons name="chevron-forward" size={30} color="#4B0082" />
          </TouchableOpacity>
        </View>
        
        {item.timeSlot !== "" && (
          <View style={styles.deliveryInfoSection}>
            <View style={styles.deliveryInfo}>
              <AntDesign name="clockcircle" size={16} color="#555" />
              <Text style={styles.deliveryTimeText}>
                {item.expectedDeliveryDate} • {item.dayOfWeek} • {item.timeSlot}
              </Text>
            </View>
            
            {canUpdateTimeSlot && (
              <TouchableOpacity
                style={styles.rescheduleButton}
                onPress={() => fetchTimeSlot(item.orderId)}
              >
                <AntDesign name="calendar" size={14} color={COLORS.services} style={styles.rescheduleIcon} />
                <Text style={styles.rescheduleText}>Reschedule</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

 
  const renderTimeSlotModal = () => {
   
    const flattenedData = timeSlotData.flatMap(dateObj => {
      return [
        { type: 'header', day: dateObj.day, date: dateObj.date },
        ...dateObj.slots.map(slot => ({ 
          type: 'slot', 
          ...slot, 
          day: dateObj.day, 
          date: dateObj.date 
        }))
      ];
    });
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={dateTimeModalVisible}
        onRequestClose={() => setDateTimeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Time Slot</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setDateTimeModalVisible(false)}
              >
                <AntDesign name="close" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            {loader ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.services} />
                <Text style={styles.loadingText}>Confirming Time Slot</Text>
                {selectedSlot && (
                  <View style={styles.selectedSlotInfo}>
                    <Text style={styles.selectedSlotText}>
                      {selectedSlot.time} - {selectedSlot.day}, {selectedSlot.date}
                    </Text>
                  </View>
                )}
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <AntDesign name="exclamationcircle" size={30} color="#F44336" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <ScrollView style={styles.timeSlotsScrollView}>
                {flattenedData.map((item, index) => {
                  if (item.type === 'header') {
                    return (
                      <View key={`header-${index}`} style={styles.dayHeaderContainer}>
                        <Text style={styles.dayName}>{item.day}</Text>
                        <Text style={styles.dayDate}>{item.date}</Text>
                      </View>
                    );
                  } else {
                    return (
                      <TouchableOpacity
                        key={`slot-${item.id}`}
                        style={styles.slotButton}
                        onPress={() => handleSlotSelect(item.day, item.date, item.time)}
                      >
                        <Text style={styles.slotTime}>{item.time}</Text>
                        <AntDesign name="right" size={16} color="#555" />
                      </TouchableOpacity>
                    );
                  }
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Main component render
  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color={COLORS.services} />
          <Text style={styles.loadingMessage}>Loading your orders...</Text>
        </View>
      ) : (
        <>
          {orders.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <AntDesign name="inbox" size={64} color="#999" />
              <Text style={styles.emptyStateText}>No orders found</Text>
             
            </View>
          ) : (
            <FlatList
              data={orders}
              renderItem={renderOrder}
              keyExtractor={(item) => item.orderId.toString()}
              contentContainerStyle={styles.ordersList}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  colors={[COLORS.services]} 
                />
              }
            />
          )}
        </>
      )}
       <View style={styles.footer}>
        <TouchableOpacity
          style={styles.exchangeButton}
          onPress={() => navigation.navigate("My Exchanged Item Details")}
        >
          <Text style={styles.exchangeButtonText}>View Exchanged Items</Text>
        </TouchableOpacity>
      </View>
      {renderTimeSlotModal()}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 12,
  },
  
  // Loading states
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingMessage: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  
  // Empty state
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#777",
    marginTop: 8,
  },
  
  // Order list
  ordersList: {
    paddingBottom: 90,
  },
  
  // Order card
  orderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  
  // Order header
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  orderDate: {
    fontSize: 12,
    color: "#777",
  },
  
  // Order content
  orderContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  orderIconContainer: {
    marginRight: 16,
  },
  orderIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tickImage: {
    width: 30,
    height: 30,
  },
  
  // Order details
  orderDetails: {
    flex: 1,
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  
  // Payment info
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#555",
    marginRight: 4,
  },
  paymentType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  paymentPending: {
    color: "#f44336",
    fontWeight: "600",
  },
  
  // Status
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: "#555",
    marginRight: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  
  // Details button
  detailsButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Delivery info section
  deliveryInfoSection: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    // flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deliveryTimeText: {
    fontSize: 13,
    color: "#555",
    marginLeft: 8,
  },
  
  // Reschedule button
  rescheduleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.services,
    marginLeft:width/2,
    marginTop:10
  },
  rescheduleIcon: {
    marginRight: 4,
  },
  rescheduleText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.services,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: width * 0.9,
    maxHeight: height * 0.7,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  
  // Time slots scroll view
  timeSlotsScrollView: {
    maxHeight: height * 0.5,
  },
  dayHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dayName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dayDate: {
    fontSize: 14,
    color: "#555",
  },
  
  // Time slot buttons
  slotButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  slotTime: {
    fontSize: 16,
    color: "#333",
  },
  
  // Loading in modal
  loadingContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
  },
  selectedSlotInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#e8f4fd",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bde0fd",
    width: "100%",
    alignItems: "center",
  },
  selectedSlotText: {
    fontSize: 14,
    color: "#1976d2",
  },
  
  // Error container
  errorContainer: {
    padding: 30,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginTop: 16,
  },
  footer: {
    position: 'absolute',
    marginBottom:70,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  exchangeButton: {
    backgroundColor: COLORS.services,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  exchangeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default OrderScreen;
