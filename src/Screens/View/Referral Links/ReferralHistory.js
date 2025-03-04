import React, {
    useState,
    useEffect,
    useCallback,
    useLayoutEffect,
    useRef
  } from "react";
  import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
ActivityIndicator
  } from "react-native";
  import { useNavigation } from "@react-navigation/native";
  // import { Ionicons } from "@expo/vector-icons";
  import Ionicons from "react-native-vector-icons/Ionicons";
  import PhoneInput from "react-native-phone-number-input";
  import axios from "axios";
  import { useSelector } from "react-redux";
  import { Entypo } from "@expo/vector-icons";
  import { useFocusEffect } from "@react-navigation/native";
  import * as Location from "expo-location";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import BASE_URL,{userStage} from "../../../../Config";
  import ShareLinks from "../../../../src/Screens/View/Referral Links/ShareLinks";
  import { set } from "core-js/core/dict";
  import { COLORS } from "../../../../Redux/constants/theme";
  const{height,width}=Dimensions.get('window')

export default function ReferralHistory() {
   const userData = useSelector((state) => state.counter);
    const token = userData.accessToken;
    const customerId = userData.userId;
    const[refereesData,setRefereesData]=useState([])
    const[loading,setLoading]=useState(false)
//   const refereesData = [
//     {
//       id: '1',
//       whatsAppNumber: '9165798',
//       referredDate: 'Mar 3, 2025',
//       status: 'Invited'
//     },
//     {
//       id: '2',
//       whatsAppNumber: '8276493',
//       referredDate: 'Mar 1, 2025',
//       status: 'Accepted'
//     },
//     {
//       id: '3',
//       whatsAppNumber: '7391524',
//       referredDate: 'Feb 28, 2025',
//       status: 'Pending'
//     }
//   ];
useEffect(()=>{
    getRefereeDetails()
},[])

function getRefereeDetails(){
    setLoading(true)
    axios({
        method:"get",
        url: 
            userStage =="test1"? BASE_URL + `erice-service/user/customerProfileDetails?customerId=${customerId}`
            :
            BASE_URL+`reference-service/getreferencedetails/${customerId}`,
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        })
        .then((response)=>{
            setLoading(false)
            console.log("response",response.data)
            setRefereesData(response.data)
        })
        .catch((error)=>{
            setLoading(false)
            console.log(error.response)
        })
}


  const renderStatusBadge = (status) => {
    let badgeStyle = styles.statusContainer;
    let textStyle = styles.statusText;
    
    switch(status) {
      case 'Accepted':
        badgeStyle = {...badgeStyle, backgroundColor: '#E8F5E9'};
        textStyle = {...textStyle, color: '#2E7D32'};
        break;
      case 'Pending':
        badgeStyle = {...badgeStyle, backgroundColor: '#E3F2FD'};
        textStyle = {...textStyle, color: '#1565C0'};
        break;
      default: // Invited
        badgeStyle = {...badgeStyle, backgroundColor: '#FFF8E1'};
        textStyle = {...textStyle, color: '#F9A825'};
    }
    
    return (
      <View style={badgeStyle}>
        <Text style={textStyle}>{status}</Text>
      </View>
    );
  };
  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length >= 3) {
      const [year, month, day] = dateArray;
      return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    return 'N/A';
  };
  

  const renderRefereeItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>WhatsApp Number</Text>
          <Text style={styles.detailValue}>{item.whatsappnumber}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Referred Date</Text>
          <Text style={styles.detailValue}>{formatDate(item.created_at)}</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Status</Text>
          {renderStatusBadge(item.referenceStatus)}
        </View>
      </View>
      
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style="dark" /> */}
            {/* Referees List */}

     {loading==false?
      <View>
      <FlatList
        data={refereesData}
        renderItem={renderRefereeItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      </View>
      :
        <ActivityIndicator 
        size="medium" 
        color="#3d2a71"
        />
     }
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerAction: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    paddingVertical: 10,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
  statusContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontWeight: '500',
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  cardActionText: {
    color: '#3366cc',
    marginLeft: 4,
    fontWeight: '500',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    backgroundColor: '#3366cc',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});