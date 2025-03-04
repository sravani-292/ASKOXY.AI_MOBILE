import React, { useState, useEffect ,useCallback} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import BASE_URL,{userStage} from "../../../../Config"
import { useNavigation } from "@react-navigation/native";
import encryptEas from "../../../Screens/View/Payments/components/encryptEas";
import decryptEas from "../../../Screens/View/Payments/components/decryptEas";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS } from "../../../../Redux/constants/theme";
import { useFocusEffect } from '@react-navigation/native'
import Ionicons from "react-native-vector-icons/Ionicons"

const { width, height } = Dimensions.get("window");


const SubscriptionHistory = () => {
 const userData = useSelector((state) => state.counter);
  // console.log({userData})
  const customerId = userData.userId;

  const token = userData.accessToken;

const[details,setDetails]=useState([])


  const getSubscription = async () => {
    // setLoading(true)
   axios({
    method: "post",
    url: userStage=="test1" ?BASE_URL +
    "erice-service/subscription-plans/getSubscriptionsDetailsForaCustomer":BASE_URL+`order-service/getallsubscriptionsforacustomer?customerId=${customerId}`,
    headers: {
    Authorization: `Bearer ${token}`,
    },
   
   })
   .then((response)=>{
    console.log("response",response.data)
    setDetails(response.data)
   })
   .catch((error)=>{
    console.log(error.response)
   })
    
  }


  useFocusEffect(
    useCallback(()=>{
      getSubscription();
    },[])
  )



  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Plan Amount & Icon */}
      <View style={styles.row}>
        <Ionicons name="card-outline" size={24} color="#9333ea" />
        <Text style={styles.planAmount}>Plan Amount: INR {item.amount}</Text>
      </View>

      {/* Wallet & Usage Info */}
      <Text style={styles.walletText}>Wallet Balance: <Text style={styles.walletText}> INR {item.getAmount} </Text>|| Usage Limit: INR {item.limitAmount}</Text>

      {/* Date & Transaction ID */}
      <Text style={styles.dateText}>📅 {item.transcationDate}</Text>

      {/* Footer: Status & Transaction ID */}
      <View style={styles.footer}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.paymentStatus}</Text>
        </View>
        <Text style={styles.transactionId}>Transaction ID: {item.id}</Text>
      </View>
    </View>
  );
  return (
    
    <View>
      <FlatList
        data={details}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

export default SubscriptionHistory;

const styles = StyleSheet.create({
  listContainer: { paddingBottom: 10 },
  card: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  planAmount: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  walletText: { fontSize: 16, color: "#444", marginBottom: 5 },
  dateText: { fontSize: 12, color: "gray" },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  statusContainer: { backgroundColor: "#d1fae5", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  statusText: { color: "#059669", fontWeight: "bold" },
  transactionId: { fontSize: 12, color: "#555",width:width*0.7 },

})