import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState, useCallback } from "react";
import BASE_URL from "../../../../Config";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo vector icons if not already installed

const { width } = Dimensions.get("window");

const UserExchangeOrderDetails = () => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [exchangedItems, setExchangedItems] = useState([]);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getUserExchangedItems();
    }, [])
  );

  const getUserExchangedItems = async () => {
    setLoading(true);
    try {
      const response = await axios({
        url: `${BASE_URL}order-service/getExchangeOrders/${customerId}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      setExchangedItems(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching exchanged items:", error);
      setError("Failed to load exchanged items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Ionicons name="repeat" size={20} color="#FF7F3E" />
        <Text style={styles.itemName}>{item.itemName}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order ID:</Text>
          <Text style={styles.detailValue}>{item.orderId}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Price:</Text>
          <Text style={styles.detailValue}>{parseFloat(item.itemPrice).toFixed(2)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Exchange Requested</Text>
          </View>
        </View>
        
        <View style={styles.reasonContainer}>
          <Text style={styles.detailLabel}>Exchange Reason:</Text>
          <Text style={styles.reasonText}>{item.reason || "No reason provided"}</Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.dateText}>Requested on {formatDate(item.exchangeRequestDate)}</Text>
        </View>
      </View>
    </View>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="swap-horizontal" size={60} color="#CCCCCC" />
      <Text style={styles.noDataText}>No exchange requests found</Text>
      <Text style={styles.noDataSubtext}>
        Items you request for exchange will appear here
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7F3E" />
        <Text style={styles.loadingText}>Loading exchange requests...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F8" />
      
     

      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={exchangedItems}
            keyExtractor={(item, index) => item.itemId || `exchange-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={EmptyListComponent}
            scrollEnabled={false} // Disable FlatList scrolling as ScrollView will handle it
            nestedScrollEnabled={true}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserExchangeOrderDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
  },
  list: {
    padding: 16,
    paddingBottom: 30,
  },
  itemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginHorizontal: 16,
  },
  detailsContainer: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#FFE8DD",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusText: {
    color: "#FF7F3E",
    fontSize: 12,
    fontWeight: "600",
  },
  reasonContainer: {
    marginTop: 4,
    marginBottom: 12,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  reasonText: {
    fontSize: 14,
    color: "#333333",
    marginTop: 4,
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  dateText: {
    fontSize: 13,
    color: "#666666",
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  noDataText: {
    color: "#666666",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  noDataSubtext: {
    color: "#999999",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#666666",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
  },
});