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
  Button,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { COLORS } from "../../../../Redux/constants/theme";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSelector } from "react-redux";
import BASE_URL, { userStage } from "../../../../Config";
const { width, height } = Dimensions.get("window");
import { Picker } from "@react-native-picker/picker";
import { Modal } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

const OrderScreen = () => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [days, setDays] = useState([]);
  const [orderStatus, setOrderStatus] = useState();
  const [updatedDate, setUpdatedate] = useState();
  const navigation = useNavigation();
  const [slotLoader, setSlotLoader] = useState(false);
  const [slotsData, setSlotsData] = useState([]);
  useFocusEffect(
    useCallback(() => {
      getOrders();
      fetchTimeSlots();
    }, [])
  );


  const toggleOrderSelection = (orderId) => {
    setSelectedOrderId((prevSelected) =>
      prevSelected === orderId ? null : orderId
    );
  };
 
  {orderStatus < 3 && (
    <TouchableOpacity
      style={styles.updateButton}
      onPress={() => toggleOrderSelection(item.orderId)}
    >
      <Icon name="edit" size={18} color="#fff" style={styles.icon} />
    </TouchableOpacity>
  )}
  const handleSlotUpdate = async () => {
    setSlotLoader(true);
    console.log("for slot selection");
    const data = {
      dayOfWeek: selectedDay[selectedOrderId],
      expectedDeliveryDate: updatedDate,
      orderId: selectedOrderId,
      timeSlot: selectedTimeSlot[selectedOrderId],
      userId: customerId,
    };
    console.log("for updating timeslot", data);
    axios
      .patch(BASE_URL + `order-service/userSelectedDiffslot`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      .then((response) => {
        console.log(response.data);
        setSlotLoader(false)
        if (response.status == 200) {
          alert("Time slot updated successfully!");
          setSelectedOrderId(null);
          getOrders();
        } else {
          alert("Failed to update time slot.");
        }
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}order-service/fetchTimeSlotlist`
      );
      const data = response.data;
      console.log({ data });
      setSlotsData(data);
      let updatedOrderDate = new Date();
      updatedOrderDate.setDate(updatedOrderDate.getDate() + 1);

      const tomorrowDate = updatedOrderDate
        .toLocaleDateString("en-GB") // "en-GB" gives "DD/MM/YYYY"
        .split("/")
        .join("-");

      console.log("New Date (Updatedate):", tomorrowDate);
      setUpdatedate(tomorrowDate);

      const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(updatedOrderDate);
        date.setDate(updatedOrderDate.getDate() + i);
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getFullYear()}`;
        return {
          dayOfWeek: date
            .toLocaleDateString("en-GB", { weekday: "long" })
            .toUpperCase(),
          formattedDate: formattedDate,
        };
      });

      console.log("Next seven days:", nextSevenDays);

      const availableDays = nextSevenDays
        .filter((day) => {
          const matchedDay = data.find(
            (d) => d.dayOfWeek.toUpperCase() === day.dayOfWeek
          );
          return matchedDay && matchedDay.isAvailable;
        })
        .slice(0, 3);

      console.log("Filtered available days:", availableDays);

      const transformedDays = availableDays.map((day) => ({
        label: `${day.dayOfWeek} ( ${day.formattedDate})`,
        value: day.dayOfWeek,
      }));

      console.log("Transformed days:", transformedDays);
      setDays(transformedDays);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const handleDayChange = (selectedDay, order_id) => {
    setSelectedDay((prev) => ({
      ...prev,
      [order_id]: selectedDay,
    }));
  
    console.log("selectedDay", selectedDay);
    console.log("Days array before filtering:", days);
    console.log(
      "Available Days:",
      days.map((d) => `"${d.value}"`)
    );
    console.log("Selected Day:", `"${selectedDay}"`);
  
    const selectedDayData = days.find(
      (d) =>
        d.value?.trim()?.toUpperCase() === selectedDay?.trim()?.toUpperCase()
    );
  
    console.log({ selectedDayData });
  
    if (selectedDayData) {
      const fullDayData = slotsData.find((d) => d.dayOfWeek === selectedDay);
  
      if (fullDayData) {
        setSelectedDate(selectedDayData.formattedDate || "");
  
        setTimeSlots((prev) => ({
          ...prev,
          [order_id]: [
            fullDayData.timeSlot1,
            fullDayData.timeSlot2,
            fullDayData.timeSlot3,
            fullDayData.timeSlot4,
          ].filter(Boolean), // Remove empty values
        }));
      } else {
        setTimeSlots((prev) => ({
          ...prev,
          [order_id]: [],
        }));
      }
    } else {
      setTimeSlots((prev) => ({
        ...prev,
        [order_id]: [],
      }));
    }
  };
  

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
        BASE_URL + "order-service/getAllOrders_customerId",
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
          console.log("orderdate", item.orderDate);
          setOrderStatus(item.orderStatus);
        });
      } else {
        alert("No orders found!");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderOrder = ({ item }) => (
    <>
      <TouchableOpacity onPress={() => orderDetails(item)}>
        <View style={styles.orderView}>
          <Text style={styles.date}>{formatDate(item?.orderDate)}</Text>

          <View style={styles.orderList}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../../../../assets/tick.png")}
                style={styles.tickImage}
              />
            </View>
            <View style={styles.orderInfo}>
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
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ width: width * 0.9, alignSelf: "center" }}>
        {item.timeSlot !== "" && (
          <View style={styles.card1}>
            <View style={styles.infoContainer}>
              <AntDesign name="clockcircle" size={15} color="gray" />
              <Text style={styles.timeText}>
                {item.expectedDeliveryDate} {item.dayOfWeek} ({item.timeSlot})
              </Text>
              {orderStatus < 3 && (
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={() =>
                    setSelectedOrderId(
                      selectedOrderId === item.orderId ? null : item.orderId
                    )
                  }
                  // onPress={() => toggleOrderSelection(item.orderId)}
                  >
                  <Icon
                    name="edit"
                    size={18}
                    color="#fff"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* {orderStatus < 3 && (
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() =>
            setSelectedOrderId(
              selectedOrderId === item.orderId ? null : item.orderId
            )
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="edit" size={18} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Update</Text>
          </View>
        </TouchableOpacity>
      )} */}

            {selectedOrderId === item.orderId && (
              <View style={styles.pickerSection}>
                <Text style={styles.label}>Select Day:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedDay[selectedOrderId]}
                    onValueChange={(e)=>handleDayChange(e,item.orderId)}
                    style={styles.picker}
                  >
                    <Picker.Item
                      label="SELECT A DAY"
                      value=""
                      enabled={false}
                      color="gray"
                    />
                    {days.map((day) => (
                      <Picker.Item
                        key={day.value}
                        label={day.label}
                        value={day.value}
                      />
                    ))}
                  </Picker>
                </View>

                {timeSlots[selectedOrderId]?.length > 0 && (
                  <>
                    <Text style={styles.label}>Select Time Slot:</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={selectedTimeSlot}
                        onValueChange={(e)=>setSelectedTimeSlot(prev=>({...prev,[selectedOrderId]:e}))}
                        style={styles.picker}
                      >
                        <Picker.Item
                          label="Select a time slot"
                          value=""
                          enabled={false}
                          color="gray"
                        />
                        {timeSlots[selectedOrderId].map((slot, index) => (
                          <Picker.Item key={index} label={slot} value={slot} />
                        ))}
                      </Picker>
                    </View>
                    {selectedTimeSlot[selectedOrderId] && (
                      <TouchableOpacity
                        style={[
                          styles.updateButton1,
                          slotLoader && { opacity: 0.7 },
                        ]}
                        onPress={handleSlotUpdate}
                        disabled={slotLoader}
                      >
                        <Text style={styles.buttonText1}>
                          {slotLoader ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                          ) : (
                            "Save Changes"
                          )}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            )}
          </View>
        )}

       
        <View
          style={{ height: 2, backgroundColor: COLORS.services, marginVertical: 12 }}
        />
      </View>
    </>
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
    <>
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
              nestedScrollEnabled={true}
            />
          </>
        )}
      </View>
    </>
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
  orderView: {
    backgroundColor: "white",
    width: width * 0.9,
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    margin: 10,
    elevation: 5,
  },
  orderList: {
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
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

  updateButton1: {
    backgroundColor: COLORS.services,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "center",
  },
  buttonText1: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    paddingVertical: 5,
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "95%",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    height: 600,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dayContainer: {
    marginBottom: 15,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  slotButton: {
    padding: 5,
    backgroundColor: "#ddd",
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedSlot: {
    backgroundColor: "#4CAF50",
  },
  slotText: {
    color: "black",
  },
  selectedSlotText: {
    color: "white",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  container1: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: width * 1,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card1: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    width: width * 0.65,
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  updateButton: {
    backgroundColor: COLORS.services,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginLeft: 5,
    marginBottom: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  pickerSection: {
    marginTop: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  picker: {
    height: 60,
    width: width * 0.8,
  },
  buttonText1: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default OrderScreen;
