import { 
  StyleSheet, 
  Text, 
  View, 
  Dimensions, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { useSelector } from 'react-redux';
import BASE_URL, { userStage } from "../../../../Config";
const { width, height } = Dimensions.get("window");
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from "../../../../Redux/constants/theme";

import axios from 'axios';

const OxyCoupens = () => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;

  const [loading, setLoading] = React.useState(false);
  const [coupons, setCoupons] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getOffers();
    }, [])
  );

  // Function to fetch offers
  const getOffers = async () => {
    console.log("Fetching offers for customerId:", customerId);
    setLoading(true);
    console.log("BASE_URL", BASE_URL);

    try {
      const response = await axios.get(
        BASE_URL + "order-service/getAllCoupons",
      );
      console.log("Response from getAllCoupons:", response);

      if (response && response.data) {
        console.log("Offers fetched successfully", response);
        // Filter only active coupons
       const activeCoupons = response.data.filter(
      (coupon) => coupon.isActive === true && coupon.status === "PUBLIC"
       );
       setCoupons(activeCoupons);
      setLoading(false);
      }
    } catch (error) {
      console.log("Error fetching coupons:", error);
      setLoading(false);
    }
  };

  // Function to copy coupon code
 const copyCouponCode = async (couponCode) => {
  await Clipboard.setStringAsync(couponCode);
  Alert.alert(
    "Coupon Code Copied!",
    `${couponCode} has been copied to clipboard`,
    [{ text: "OK" }]
  );
};

  // Function to format discount type
  const getDiscountText = (coupon) => {
    if (coupon.discountType === 1) {
      // Fixed amount discount
      return `₹${coupon.maxDiscount} OFF`;
    } else {
      // Percentage discount
      return `${coupon.maxDiscount}% OFF`;
    }
  };

  // Function to check if coupon has expiry
  const isExpiringSoon = (endDateTime) => {
    if (!endDateTime) return false;
    const expiryDate = new Date(endDateTime);
    const currentDate = new Date();
    const timeDiff = expiryDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 7 && daysDiff > 0;
  };

  // Render individual coupon item
  const renderCouponItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.couponCard}
      onPress={() => copyCouponCode(item.couponCode)}
      activeOpacity={0.8}
    >
      <View style={styles.couponHeader}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {getDiscountText(item)}
          </Text>
        </View>
        {isExpiringSoon(item.endDateTime) && (
          <View style={styles.expiryBadge}>
            <Text style={styles.expiryText}>Expiring Soon!</Text>
          </View>
        )}
      </View>

      <View style={styles.couponBody}>
        <Text style={styles.couponCode}>{item.couponCode}</Text>
        {item?.couponDesc && (
          <Text style={styles.couponDesc}>{item.couponDesc}</Text>
        )}
        
        <View style={styles.couponDetails}>
          <Text style={styles.minOrderText}>
            Min Order: ₹{item.minOrder}
          </Text>
          <Text style={styles.maxDiscountText}>
            Max Discount: ₹{item.maxDiscount}
          </Text>
        </View>
{/* 
        {item.endDateTime && (
          <Text style={styles.validUntil}>
            Valid until: {new Date(item.endDateTime).toLocaleDateString()}
          </Text>
        )} */}
      </View>

      <View style={styles.tapToCopy}>
        <Text style={styles.tapToCopyText}>Tap to Copy Code</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B0082" />
        <Text style={styles.loadingText}>Loading Coupons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.headerTitle}>Available Coupons</Text> */}
        {/* <Text style={styles.headerSubtitle}>
          {coupons.length} active coupon{coupons.length !== 1 ? 's' : ''} available
        </Text> */}
      </View>

      {coupons.length === 0 ? (
        <View style={styles.noCouponsContainer}>
          <Text style={styles.noCouponsText}>No active coupons available</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={getOffers}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={coupons}
          renderItem={renderCouponItem}
          keyExtractor={(item) => item.couponId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default OxyCoupens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 15,
  },
  couponCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.services,
  },
  discountBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  discountText: {
    color: COLORS.services,
    fontWeight: 'bold',
    fontSize: 16,
  },
  expiryBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  couponBody: {
    padding: 15,
  },
  couponCode: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginBottom: 10,
  },
  couponDesc: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    // fontStyle: 'italic',
  },
  couponDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  minOrderText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  maxDiscountText: {
    fontSize: 14,
    color: '#dc3545',
    fontWeight: '600',
  },
  validUntil: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 5,
  },
  tapToCopy: {
    backgroundColor: '#e9ecef',
    paddingVertical: 8,
    alignItems: 'center',
  },
  tapToCopyText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  noCouponsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noCouponsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: COLORS.services,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});