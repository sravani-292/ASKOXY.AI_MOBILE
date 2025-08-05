import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { COLORS } from "../../../../../../Redux/constants/theme";
import { useNavigation } from "@react-navigation/native";
const {width,height} = Dimensions.get('window');
export default function CouponList({
  coupons = [],
  onCopy,
  onUse,
  showViewAll = true,
  couponScreenRoute = "Coupons",
}) {
  const navigation = useNavigation();
  const [expandedCoupons, setExpandedCoupons] = useState({});

  // console.log("CouponList - Coupons data:", coupons);

  if (!coupons || coupons.length === 0) {
    return null;
  }

  const handleViewAll = () => {
    if (navigation && couponScreenRoute) {
      navigation.navigate(couponScreenRoute);
    }
  };

  const toggleCouponDetails = (couponCode) => {
    // console.log("Toggling details for:", couponCode);
    setExpandedCoupons(prev => {
      const newState = {
        ...prev,
        [couponCode]: !prev[couponCode]
      };
      // console.log("New expanded state:", newState);
      return newState;
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Available Coupons ({coupons.length})</Text>
        {showViewAll && (
          <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Coupon Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {coupons.map((coupon, index) => {
          const isExpanded = expandedCoupons[coupon.couponCode] || false;
          // console.log(`Coupon ${coupon.couponCode} expanded:`, isExpanded);
          
          return (
            <View 
              key={coupon.couponCode || index} 
              style={[
                styles.couponCard,
                isExpanded && styles.expandedCard
              ]}
            >
              <View style={styles.contentContainer}>
                <View style={styles.leftSection}>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                      {coupon.discountType === 1
                        ? `₹${coupon.maxDiscount} OFF`
                        : `${coupon.maxDiscount}% OFF`}
                    </Text>
               
                  </View>
                  <Text style={styles.couponCode} numberOfLines={1}>
                    {coupon.couponCode}
                  </Text>
                  <TouchableOpacity
                    style={styles.applyButton}
                    onPress={() => onCopy && onCopy(coupon.couponCode)}
                  >
                    <Text style={styles.applyButtonText}>APPLY</Text>
                  </TouchableOpacity>
                <Text style={styles.toggleLabel}  onPress={() => toggleCouponDetails(coupon.couponCode)}
                activeOpacity={0.7}>
                  {isExpanded ? 'Less' : 'More'}
                </Text>
                </View>

                {/* Right Side - Expandable Details */}
                {isExpanded && (
                  <View style={styles.rightSection}>
                    <View style={styles.detailsContainer}>
                      {coupon.couponDesc && (
                        <Text style={styles.description}>
                          {coupon.couponDesc}
                        </Text>
                      )}
                      <View style={styles.limits}>
                        <View style={styles.limitRow}>
                          <Text style={styles.limitLabel}>Min Order:</Text>
                          <Text style={styles.limitValue}>₹{coupon.minOrder}</Text>
                        </View>
                        <View style={styles.limitRow}>
                          <Text style={styles.limitLabel}>Max Discount:</Text>
                          <Text style={styles.limitValue}>₹{coupon.maxDiscount}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              {/* More/Less Toggle Button - Bottom Right */}
              {/* <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => toggleCouponDetails(coupon.couponCode)}
                activeOpacity={0.7}
              >
                <Text style={styles.toggleLabel}>
                  {isExpanded ? 'Less' : 'More'}
                </Text>
              </TouchableOpacity> */}
            </View>
          );
        })}
      </ScrollView>

      {/* Hint Text */}
      <Text style={styles.hintText}>
        Tap "More" to see coupon details • Swipe to see all coupons
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    height: 24,
  },
  headerText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  viewAllButton: {
    backgroundColor: COLORS.services || "#007bff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewAllText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  scrollView: {
    height: 80,
  },
  scrollContent: {
    paddingRight: 10,
    alignItems: 'flex-start', 
  },
  couponCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    padding: 8,
    marginRight: 10,
    width: 140,
    height: 110,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.services || "#007bff",
    position: "relative",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  expandedCard: {
    width: 320, // Wider for better content display
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    paddingBottom: 20, 
  },
  leftSection: {
    flex: 1,
  
    
  },
  rightSection: {
    flex: 1.2, // Slightly more space for details
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: "#dee2e6",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  discountBadge: {
    backgroundColor: COLORS.title || "#dc3545",
    width:60,
    paddingVertical: 5,
    borderRadius: 4,
    padding:5,
    marginBottom: 3,
   
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  couponCode: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
    marginLeft:10
  },
  applyButton: {
    backgroundColor: COLORS.services || "#007bff",
    paddingVertical: 4,
    paddingHorizontal: 17,
    borderRadius: 4,
    elevation: 1,
    alignSelf: "center"
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 10,
    color: "#666",
    lineHeight: 13,
    marginBottom: 6,
    textAlign: "left", 
  },
  limits: {
    gap: 3,
    marginTop: 2,
  },
  limitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  limitLabel: {
    fontSize: 9,
    color: "#888",
    flex: 1,
  },
  limitValue: {
    fontSize: 9,
    fontWeight: "600",
    color: "#333",
    textAlign: "right", 
  },
  toggleButton: {
    position: "absolute",
    right: 6,
    bottom: 4,
    backgroundColor: "#e9ecef",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.services || "#007bff",
    borderStyle: "dashed",
    zIndex: 10, 
  },
  toggleLabel: {
    color: COLORS.services || "#007bff",
    fontSize: 9,
    fontWeight: "600",
    marginLeft:90,
    marginTop:8
  },
  hintText: {
    fontSize: 10,
    color: "#999",
    textAlign: "center",
    marginTop: 4,
    fontStyle: "italic",
  },
});