// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   Image,
//   Dimensions,
//   RefreshControl,
//   Button,
//   Modal,
//   TouchableWithoutFeedback,
//   ScrollView,
// } from "react-native";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import axios from "axios";
// import { COLORS } from "../../../../Redux/constants/theme";
// import AntDesign from "react-native-vector-icons/AntDesign";
// import { useSelector } from "react-redux";
// import BASE_URL, { userStage } from "../../../../Config";
// const { width, height } = Dimensions.get("window");
// import { Picker } from "@react-native-picker/picker";
// import { Ionicons } from "@expo/vector-icons";
// import Icon from "react-native-vector-icons/FontAwesome";

// const OrderScreen = () => {
//   const userData = useSelector((state) => state.counter);
//   const token = userData.accessToken;
//   const customerId = userData.userId;
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedDay, setSelectedDay] = useState({});
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState({});
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const [days, setDays] = useState([]);
//   const [orderStatus, setOrderStatus] = useState();
//   const [updatedDate, setUpdatedate] = useState();
//   const navigation = useNavigation();
//   const [slotLoader, setSlotLoader] = useState(false);
//   const [slotsData, setSlotsData] = useState([]);
//   const[dateTimeModalVisible,setDateTimeModalVisible]=useState(false)
//   const [error, setError] = useState(null);
//   const [loader, setLoader] = useState(false);
//   const[selectedSlot,setSelectedSlot]=useState(null)
//   const [timeSlotData, setTimeSlotData] = useState([]);
// const[orderId,setOrderId]=useState('')


//   useFocusEffect(
//     useCallback(() => {
//       getOrders();
//       // fetchTimeSlot();
//     }, [])
//   );

//   const getNextThreeDays = () => {
//     const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  
//     const nextThreeDays = [1, 2, 3, 4, 5, 6, 7].map(offset => {
//       const date = new Date();
//       date.setDate(date.getDate() + offset);
//       // console.log("dates",date)
//       return {
//         dayOfWeek: daysOfWeek[date.getDay()].toUpperCase(),
//         date: `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`,
//         formattedDay: daysOfWeek[date.getDay()]
//       };
//     });
  
//     return nextThreeDays;
//   };
  
//   const fetchTimeSlot = (value) => {
//     setLoading(true);
//     setError(null);
//     console.log({value})
//     setOrderId(value)
//     axios({
//       method: "get",
//       url: BASE_URL + `order-service/fetchTimeSlotlist`,
//     })
//     .then((response) => {
//       // console.log("Response fetch time slot", response.data);
      
//       // Get potential days
//       const potentialDays = getNextThreeDays();
      
//       // Filter slots based on availability
//       const processedData = [];
      
//       for (let dayInfo of potentialDays) {
//         // Find the corresponding slot for this day
//         const matchingSlot = response.data.find(
//           slot => slot.dayOfWeek === dayInfo.dayOfWeek && slot.isAvailable === false
//         );
        
//         if (matchingSlot) {
//           const dayEntry = {
//             id: matchingSlot.id,
//             day: dayInfo.formattedDay,
//             date: dayInfo.date,
//             slots: [
//               { id: `${matchingSlot.id}-1`, time: matchingSlot.timeSlot1 },
//               { id: `${matchingSlot.id}-2`, time: matchingSlot.timeSlot2 },
//               { id: `${matchingSlot.id}-3`, time: matchingSlot.timeSlot3 },
//               { id: `${matchingSlot.id}-4`, time: matchingSlot.timeSlot4 }
//             ],
//             isAvailable: matchingSlot.isAvailable
//           };
          
//           processedData.push(dayEntry);
          
//           // Stop when we have exactly 3 days
//           if (processedData.length === 3) break;
//         }
//       }
      
//       // Ensure we always have 3 days
//       while (processedData.length < 3) {
//         console.warn("Not enough days with unavailable slots");
//         // You might want to handle this case, perhaps by adding placeholder days
//         processedData.push({
//           id: null,
//           day: 'No Slot',
//           date: 'N/A',
//           slots: [],
//           isAvailable: true
//         });
//       }
      
//       setTimeSlotData(processedData);
//       setDateTimeModalVisible(true);
//       setLoading(false);
//     })
//     .catch((error) => {
//       console.error("Error fetching time slots", error);
//       setLoading(false);
//       Alert.alert("Error", "Failed to fetch time slots");
//     });
//   };
  
//   // Handling slot selection remains the same
//   const handleSlotSelect = (day, date, time) => {
//     const selection = { day, date, time };
//     setSelectedSlot({day,date,time})
//     console.log("Selected delivery slot:", selection);
    
//     let data = {
//       "dayOfWeek": day.toUpperCase(),
//       "expectedDeliveryDate": date,
//       "orderId": orderId,
//       "timeSlot": time,
//       "userId": customerId
//     };
    
//     console.log("Sending data:", data);
//     setLoader(true)
//     axios({
//       method: "patch",
//       url: BASE_URL + `order-service/userSelectedDiffslot`,
//       data: data
//     })
//     .then((response) => {
//       console.log("Update Time Slot", response.data);
//       setDateTimeModalVisible(false);
//       getOrders();
//       setLoader(false)
//       Alert.alert("Success", "Successfully updated time slot");
//     })
//     .catch((error) => {
//       console.log("Update Time Slot Error", error.response);
//       setDateTimeModalVisible(false);
//       setLoader(false)
//       Alert.alert("Error", "Failed to update time slot");
//     });
//   };
//   // Flatten data for ScrollView approach
//   const flattenedData = timeSlotData.flatMap(dateObj => {
//     return [
//       { type: 'header', day: dateObj.day, date: dateObj.date },
//       ...dateObj.slots.map(slot => ({ 
//         type: 'slot', 
//         ...slot, 
//         day: dateObj.day, 
//         date: dateObj.date 
//       }))
//     ];
//   });  
  


//   const onRefresh = () => {
//     getOrders();
//   };

//   const getOrders = async () => {
//     const data = {
//       userId: customerId,
//     };
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         BASE_URL + "order-service/getAllOrders_customerId",
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // console.log("Order data", response.data);

//       if (response.data) {
//         setOrders(response.data);
//         console.log("orders",orders.orderId)
//         response.data.forEach((item) => {
//           console.log(item.newOrderId, item.orderStatus);
//           console.log("orderdate", item.orderDate);
//           setOrderStatus(item.orderStatus);
//         });
//       } else {
//         alert("No orders found!");
//       }
//     } catch (error) {
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getOrderStatusText = (orderStatus) => {
//     if (orderStatus === "PickedUp") {
//       return "PickedUp";
//     }

//     const statusNumber = Number(orderStatus);
//     switch (statusNumber) {
//       case 0:
//         return "Incomplete";
//       case 1:
//         return "Placed";
//       case 2:
//         return "Accepted";
//       case 3:
//         return "Assigned";
//       case 4:
//         return "Delivered";
//       case 5:
//         return "Rejected";
//       case 6:
//         return "Cancelled";
//       default:
//         return "Unknown";
//     }
//   };

//   useEffect(() => {
//     getOrders();
//   }, []);

//   const orderDetails = (item) => {
//     console.log("sravaniOrders", item.orderId);
//     const status = getOrderStatusText(item.orderStatus);
//     console.log({ status });

//     navigation.navigate("Order Details", {
//       order_id: item.orderId,
//       status,
//       new_Order_Id: item.newOrderId,
//     });
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const renderOrder = ({ item }) => (
//     <>
     
//  <View style={styles.orderView}>
//       <Text style={styles.date}>{formatDate(item?.orderDate)}</Text>

//       <View style={styles.orderList}>
//         <View style={styles.imageContainer}>
//           <Image
//             source={require("../../../../assets/tick.png")}
//             style={styles.tickImage}
//           />
//         </View>

//         <View style={styles.orderInfo}>
//           <Text style={styles.orderId}>
//             Order Id: <Text>{item.newOrderId}</Text>
//           </Text>
//           <Text style={styles.orderAmount}>
//             Amount: Rs. {parseFloat(item.grandTotal).toFixed(2)}
//           </Text>
//           <Text style={styles.paymentType}>
//             Payment: {item.paymentType === 2 ? "ONLINE" : "COD"}
//             {item.paymentType === 2 && item.paymentStatus === 0 && (
//               <Text style={styles.paymentPending}> (Pending)</Text>
//             )}
//           </Text>
//           <Text style={styles.status}>
//             Status: {getOrderStatusText(item.orderStatus)}
//           </Text>
//         </View>
//         <TouchableOpacity onPress={() => orderDetails(item)} style={styles.arrowButton}>
//   <Ionicons name="chevron-forward" size={24} color="black" />
// </TouchableOpacity>

//       </View>
//       <View style={{ width: width * 0.9, alignSelf: "center" }}>
//         {item.timeSlot !== "" && (
//           <>
//           <View style={styles.timeSlotContainer}>
//             <View style={styles.infoContainer}>
//               <AntDesign name="clockcircle" size={15} color="gray" />
//               <Text style={styles.timeText}>
//                 {item.expectedDeliveryDate} {item.dayOfWeek} ({item.timeSlot})
//               </Text>
//             </View>

          

//               {(item.orderStatus =="1" || item.orderStatus=="2") && (
//               <TouchableOpacity
//                   style={styles.updateButton}
//                   onPress={() =>fetchTimeSlot(item.orderId)
//                     // setSelectedOrderId(
//                     //   selectedOrderId === item.orderId ? null : item.orderId
//                     // )
//                   }
//                   >
//                     <Text style={{color:"#0384d5"}}>Update Time Slot</Text>
//                   {/* <Icon
//                     name="edit"
//                     size={15}
//                     color="#fff"
//                     style={styles.icon}
//                   /> */}
//                 </TouchableOpacity>
//                )} 



//             {selectedOrderId === item.orderId && (
//               // <View style={styles.pickerSection}>
//               //   <Text style={styles.label}>Select Day:</Text>
//               //   <View style={styles.pickerContainer}>
//               //     <TouchableOpacity>
//               //     <Picker
//               //       selectedValue={selectedDay[selectedOrderId]}
//               //       onValueChange={(e)=>handleDayChange(e,item.orderId)}
//               //       style={styles.picker}
//               //     >
//               //       <Picker.Item
//               //         label="SELECT A DAY"
//               //         value=""
//               //         enabled={false}
//               //         color="gray"
//               //       />
//               //       {days.map((day) => (
//               //         <Picker.Item
//               //           key={day.value}
//               //           label={day.label}
//               //           value={day.value}
//               //         />
//               //       ))}
//               //     </Picker>
//               //     </TouchableOpacity>
//               //   </View>

//               //   {timeSlots[selectedOrderId]?.length > 0 && (
//               //     <>
//               //       <Text style={styles.label}>Select Time Slot:</Text>
//               //       <View style={styles.pickerContainer}>
//               //         <Picker
//               //           selectedValue={selectedTimeSlot}
//               //           onValueChange={(e)=>setSelectedTimeSlot(prev=>({...prev,[selectedOrderId]:e}))}
//               //           style={styles.picker}
//               //         >
//               //           <Picker.Item
//               //             label="Select a time slot"
//               //             value=""
//               //             enabled={false}
//               //             color="gray"
//               //           />
//               //           {timeSlots[selectedOrderId].map((slot, index) => (
//               //             <Picker.Item key={index} label={slot} value={slot} />
//               //           ))}
//               //         </Picker>
//               //       </View>
//               //       {selectedTimeSlot[selectedOrderId] && (
//               //         <TouchableOpacity
//               //           style={[
//               //             styles.updateButton1,
//               //             slotLoader && { opacity: 0.7 },
//               //           ]}
//               //           onPress={handleSlotUpdate}
//               //           disabled={slotLoader}
//               //         >
//               //           <Text style={styles.buttonText1}>
//               //             {slotLoader ? (
//               //               <ActivityIndicator size="small" color="#ffffff" />
//               //             ) : (
//               //               "Save Changes"
//               //             )}
//               //           </Text>
//               //         </TouchableOpacity>
//               //       )}
//               //     </>
//               //   )}
//               // </View>
//               setDateTimeModalVisible(true)
//             )}

//           </View>

        
//           </>
//         )}

       
       
//       </View>
//     </View>
    
//     </>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator size="large" color="#000" />
//         <Text>Loading Orders...</Text>
//       </View>
//     );
//   }

//   return (
//     <>
//       <View
//         style={styles.container}
//         refreshControl={
//           <RefreshControl refreshing={loading} onRefresh={onRefresh} />
//         }
//       >
//         {orders.length === 0 ? (
//           <Text style={styles.noOrdersText}>No orders found!</Text>
//         ) : (
//           <>
//             <FlatList
//               data={orders}
//               renderItem={renderOrder}
//               keyExtractor={(item) => item.orderId.toString()}
//               contentContainerStyle={styles.orderview}
//               showsVerticalScrollIndicator={false}
//               showsHorizontalScrollIndicator={false}
//               nestedScrollEnabled={true}
//             />
//           </>
//         )}
//       </View>

//       {/* Update Date / Time Slot */}
// <Modal
//       animationType="slide"
//       transparent={true}
//       visible={dateTimeModalVisible}
//       onRequestClose={() => setDateTimeModalVisible(false)}
//     >
//       <View style={styles.modalContainer1}>
//         <View style={styles.modalContent}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Select Delivery time slot</Text>
//             <TouchableOpacity onPress={() => setDateTimeModalVisible(false)}>
//               <Text style={styles.closeButton}>✕</Text>
//             </TouchableOpacity>
//           </View>

//           {loader ? (
//             <View style={styles.loadingOverlay}>
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator 
//                 size="large" 
//                 color="#4CAF50" 
//                 style={styles.loadingIndicator}
//               />
//               <Text style={styles.loadingTitle}>Confirming Time Slot</Text>
//               {selectedSlot && (
//                 <View style={styles.selectedSlotDetails}>
//                   <Text style={styles.loadingSubtitle}>
//                     {selectedSlot.time} - {selectedSlot.day}, {selectedSlot.date}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           </View>
//           ) : error ? (
//             <View style={styles.errorContainer}>
//               <Text style={styles.errorText}>{error}</Text>
//             </View>
//           ) : (
//             <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
//               {flattenedData.map((item, index) => {
//                 if (item.type === 'header') {
//                   return (
//                     <View key={`header-${index}`} style={styles.sectionHeader}>
//                       <Text style={styles.dayText}>{item.day}</Text>
//                       <Text style={styles.dayText}>{item.date}</Text>
//                     </View>
//                   );
//                 } else {
//                   return (
//                     <TouchableOpacity
//                       key={`slot-${item.id}`}
//                       style={styles.timeSlotButton}
//                       onPress={() => handleSlotSelect(item.day, item.date, item.time)}
//                     >
//                       <Text style={styles.timeSlotText}>{item.time}</Text>
//                       <View style={styles.divider} />
//                     </TouchableOpacity>
//                   );
//                 }
//               })}
//             </ScrollView>
//           )}
//         </View>
//       </View>
//     </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f1f1f1",
//     padding: 10,
//   },
//   loader: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noOrdersText: {
//     textAlign: "center",
//     marginTop: 200,
//     fontSize: 18,
//     color: "#555",
//   },
//   orderView: {
//     backgroundColor: "white",
//     width: width * 0.9,
//     borderRadius: 10,
//     padding: 10,
//     alignSelf: "center",
//     margin: 10,
//     elevation: 5,
//   },
//   orderList: {
//     borderRadius: 10,
//     padding: 15,
//     flexDirection: "row",
//   },
//   imageContainer: {
//     backgroundColor: COLORS.quantitybutton,
//     borderRadius: 7,
//     padding: 10,
//     width: width * 0.2,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 15,
//   },
//   tickImage: {
//     width: 40,
//     height: 40,
//   },
//   orderInfo: {
//     flex: 1,
//   },
//   date: {
//     fontSize: 12,
//     color: "#888",
//     textAlign: "right",
//   },
//   orderId: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginTop: 5,
//   },
//   orderAmount: {
//     fontSize: 13,
//     marginVertical: 5,
//   },
//   paymentType: {
//     fontSize: 15,
//     color: COLORS.services,
//   },
//   paymentPending: {
//     color: "red",
//   },
//   status: {
//     fontSize: 14,
//     color: "#888",
//     marginTop: 5,
//   },
//   orderview: {
//     paddingBottom: 120,
//   },
//   footer: {
//     marginBottom: 50,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#f9f9f9",
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//   },
//   footerButton: {
//     flex: 1,
//     marginHorizontal: 8,
//     padding: 12,
//     borderRadius: 8,
//     backgroundColor: "#e87f02",
//     alignItems: "center",
//   },
//   footerButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },

//   updateButton1: {
//     backgroundColor: COLORS.services,
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//     alignSelf: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//     alignSelf: "center",
//   },
//   buttonText1: {
//     color: "#fff",
//     fontSize: 17,
//     fontWeight: "bold",
//     paddingVertical: 5,
//     alignSelf: "center",
//   },
//   modalOverlay: {
//     flex: 2,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     width: "95%",
//     backgroundColor: "white",
//     padding: 5,
//     borderRadius: 10,
//     alignItems: "center",
//     height: 600,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   dayContainer: {
//     marginBottom: 15,
//   },
//   dayText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   slotButton: {
//     padding: 5,
//     backgroundColor: "#ddd",
//     marginVertical: 5,
//     borderRadius: 5,
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   selectedSlot: {
//     backgroundColor: "#4CAF50",
//   },
//   slotText: {
//     color: "black",
//   },
//   selectedSlotText: {
//     color: "white",
//   },
//   rowContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   container1: {
//     padding: 20,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     width: width * 1,
//     alignSelf: "center",
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },

//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   card1: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 10,
//     // shadowColor: "#000",
//     // shadowOffset: { width: 0, height: 2 },
//     // shadowOpacity: 0.1,
//     // shadowRadius: 4,
//     // elevation: 3,
//   },
//   infoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 5,
//     width: width * 0.65,
//     justifyContent: "space-between",
//   },
//   timeText: {
//     fontSize: 14,
//     color: "#333",
//     marginLeft: 8,
//   },
//   updateButton: {
//     // backgroundColor: COLORS.services,
//     // paddingVertical: 5,
//     // paddingHorizontal: 8,
//     // borderRadius: 5,
//     // flexDirection: "row",
//     // alignItems: "center",
//     // justifyContent: "center",
//     alignSelf: "flex-end",
//     marginLeft: 15,
//    marginBottom:12
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//     marginLeft: 5,
//   },
//   pickerSection: {
//     marginTop: 15,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#555",
//     marginBottom: 5,
//   },
//   pickerContainer: {
//     backgroundColor: "#f0f0f0",
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     marginBottom: 10,
//   },
//   picker: {
//     height: 60,
//     width: width * 0.8,
//   },
//   buttonText1: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   arrowButton: {
//     padding: 10, 
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   timeSlotContainer: {
//     marginTop: 10,
//     padding: 12,
//     // backgroundColor:COLORS.quantitybutton,
//     backgroundColor:"#fff",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     width:width*0.8,
//     alignSelf:"center"
//   },
//   timeSlotText: {
//     fontSize: 16,
//     fontWeight: "600",
//     textAlign: "center",
//     color: "#333",
//   },
//   modalContainer1: {
//     flex: 1,
//     // backgroundColor:"black",
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     height:height/1
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     height: height/2,
//     borderRadius: 10,
//     width:width*0.9,
//     alignSelf:"center"
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eeeeee',
//   },
//   modalTitle1: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333333',
//   },
//   closeButton: {
//     fontSize: 24,
//     color: '#333333',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   sectionHeader: {
//     padding: 15,
//     backgroundColor: '#ffffff',
//     flexDirection:"row",
//     justifyContent:"space-between"
//   },
//   dayText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333333',
//   },
//   dateText: {
//     fontSize: 16,
//     color: '#666666',
//     marginTop: 5,
//   },
//   timeSlotButton: {
//     padding: 15,
//     backgroundColor: '#ffffff',
//   },
//   timeSlotText: {
//     fontSize: 16,
//     color: '#333333',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#eeeeee',
//     marginTop: 15,
//   },
//   selectedInfo: {
//     marginTop: 20,
//     padding: 15,
//     backgroundColor: '#e6f7ff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#91d5ff',
//   },
//   selectedTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333333',
//   },
//   selectedText: {
//     fontSize: 14,
//     color: '#333333',
//     marginBottom: 5,
//   },
//   selectedSlotDetails: {
//     backgroundColor: '#F0F0F0',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   loadingOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.9)', // Semi-transparent white overlay
//   },
//   loadingContainer: {
//     width: '80%',
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   loadingIndicator: {
//     marginBottom: 15,
//   },
//   loadingTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 10,
//   },
  
// });

// export default OrderScreen;




















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
              { id: `${matchingSlot.id}-2`, time: matchingSlot.timeSlot2 },
              { id: `${matchingSlot.id}-3`, time: matchingSlot.timeSlot3 },
              { id: `${matchingSlot.id}-4`, time: matchingSlot.timeSlot4 }
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
            <Ionicons name="chevron-forward" size={24} color="#333" />
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

  // Time slot selection modal content
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
});

export default OrderScreen;
