import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../../../Config/supabaseClient";

const BillDetails = ({
  subTotal = 0,
  freeItemsDiscount = 0,
  coupenApplied = false,
  coupenDetails = 0,
  useWallet = false,
  usedWalletAmount = 0,
  deliveryBoyFee = 0,
  noteMessage = "",
  totalGstSum = 0,
  grandTotalAmount = 0,
  exchangePeriod = 10,
  exchangePeriodUnit = "days",
  onExchangePolicyChange,
  showExchangePolicy = true,
  currency = "₹",
  customDiscounts = [],
  handlingFee = 0,
  distance = 0,
  minimumDiscountToShow = 10,
  minimumChargeToShow = 5,
  showWalletIfZero = false,
}) => {
  // State management
  const [isChecked, setIsChecked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [promoNote, setPromoNote] = useState("");
  
  // Animation refs
  const animation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Memoized calculations
  const totalSavings = useMemo(() => {
    return (
      (freeItemsDiscount || 0) +
      (coupenApplied ? coupenDetails : 0) +
      (useWallet ? usedWalletAmount : 0) +
      customDiscounts.reduce((sum, discount) => sum + discount.amount, 0)
    );
  }, [freeItemsDiscount, coupenApplied, coupenDetails, useWallet, usedWalletAmount, customDiscounts]);

  // Utility functions
  const formatAmount = useCallback((amount) => {
    return Number(amount || 0).toFixed(2);
  }, []);

  const getAlertStyles = useCallback((type) => {
    const alertConfig = {
      error: { 
        bg: "#fef2f2", 
        border: "#ef4444", 
        text: "#991b1b",
        icon: "alert-circle"
      },
      warning: { 
        bg: "#fffbeb", 
        border: "#f59e0b", 
        text: "#92400e",
        icon: "warning"
      },
      success: { 
        bg: "#f0fdf4", 
        border: "#10b981", 
        text: "#065f46",
        icon: "checkmark-circle"
      },
      info: { 
        bg: "#eff6ff", 
        border: "#3b82f6", 
        text: "#1e40af",
        icon: "information-circle"
      }
    };
    return alertConfig[type] || alertConfig.info;
  }, []);

  // Event handlers with haptic feedback simulation
  const handleCheckboxPress = useCallback(() => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    
    // Scale animation for tactile feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onExchangePolicyChange?.(newCheckedState);
  }, [isChecked, onExchangePolicyChange, scaleAnim]);

  const toggleExpanded = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);

    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
      tension: 120,
      friction: 8,
    }).start();
  }, [isExpanded, animation]);

  // API functions
  const checkNextZeroFeePromo = useCallback(async () => {
    try {
      const { data: slabs, error } = await supabase
        .from("handling_fees")
        .select("*")
        .eq("active", true)
        .order("min_cart", { ascending: true });

      if (error || !slabs) return;

      const nextSlab = slabs.find(
        (slab) =>
          slab.fee === 0 &&
          subTotal < slab.min_cart &&
          (!slab.min_km || distance >= slab.min_km) &&
          (!slab.max_km || distance < slab.max_km)
      );

      if (nextSlab) {
        const difference = Math.ceil(nextSlab.min_cart - subTotal);
        setPromoNote(`Add ${currency}${difference} more for FREE handling charges! 🎉`);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } else {
        setPromoNote("");
        fadeAnim.setValue(0);
      }
    } catch (error) {
      console.error("Error checking promo:", error);
    }
  }, [subTotal, distance, currency, fadeAnim]);

  const fetchAlertRules = useCallback(async () => {
    try {
      const { data: rules, error } = await supabase
        .from("alert_rules")
        .select("*")
        .eq("active", true);

      if (error || !rules) return;

      const values = { subTotal, handlingFee, distance };
      const matched = [];

      rules.forEach((rule) => {
        const result = rule.conditions.map((cond) => {
          const val = values[cond.key];
          if (val === undefined) return false;
          return new Function('val', 'value', `return val ${cond.op} value`)(val, cond.value);
        });

        const pass = rule.logic_type === "AND" 
          ? result.every(Boolean) 
          : result.some(Boolean);

        if (pass) {
          matched.push({ message: rule.message, type: rule.type });
        }
      });

      const uniqueAlerts = Array.from(
        new Map(matched.map((m) => [m.message, m])).values()
      );

      setAlerts(uniqueAlerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  }, [subTotal, handlingFee, distance]);

  // Effects
  useEffect(() => {
    fetchAlertRules();
    checkNextZeroFeePromo();
  }, [fetchAlertRules, checkNextZeroFeePromo]);

  // Components
  const PaymentRow = React.memo(({
    label,
    value,
    isDiscount = false,
    isBold = false,
    isTotal = false,
    showCondition = true,
    icon = null,
  }) => {
    if (!showCondition) return null;

    return (
      <View style={[styles.paymentRow, isTotal && styles.totalRow]}>
        <View style={styles.labelContainer}>
          {icon && (
            <Ionicons 
              name={icon} 
              size={16} 
              color={isDiscount ? "#10b981" : "#6b7280"} 
              style={styles.rowIcon}
            />
          )}
          <Text
            style={[
              isBold ? styles.detailsLabelBold : styles.detailsLabel,
              isTotal && styles.totalLabel,
            ]}
          >
            {label}
          </Text>
        </View>
        <Text
          style={[
            isBold ? styles.detailsValueBold : styles.detailsValue,
            isDiscount && styles.discountValue,
            isTotal && styles.totalValue,
          ]}
        >
          {isDiscount ? "- " : value > 0 ? "+ " : ""}
          {currency}{formatAmount(Math.abs(value))}
        </Text>
      </View>
    );
  });

  const AlertCard = React.memo(({ alert, index }) => {
    const alertStyle = getAlertStyles(alert.type);
    return (
      <Animated.View
        key={index}
        style={[
          styles.alertContainer,
          {
            backgroundColor: alertStyle.bg,
            borderColor: alertStyle.border,
          }
        ]}
      >
        <View style={styles.alertIconContainer}>
          <Ionicons 
            name={alertStyle.icon}
            size={20}
            color={alertStyle.border}
          />
        </View>
        <Text style={[styles.alertText, { color: alertStyle.text }]}>
          {alert.message}
        </Text>
      </Animated.View>
    );
  });

  const SavingsBadge = React.memo(() => {
    if (totalSavings <= 0) return null;
    
    return (
      <View style={styles.savingsBadge}>
        <Ionicons name="trending-down" size={14} color="#10b981" />
        <Text style={styles.savingsText}>
          You saved {currency}{formatAmount(totalSavings)}!
        </Text>
      </View>
    );
  });

  // Animation interpolations
  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const animatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const chevronRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.paymentDetails}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          {/* <Text style={styles.headerTitle}>Order Summary</Text> */}
          <Text style={styles.headerSubtitle}>Payment details</Text>
        </View>

        {/* Exchange Policy Checkbox */}
        {showExchangePolicy && (
          <Animated.View style={[styles.checkboxSection, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleCheckboxPress}
              activeOpacity={0.8}
            >
              <View style={[styles.checkboxWrapper, isChecked && styles.checkboxWrapperChecked]}>
                <Ionicons
                  name={isChecked ? "checkmark" : ""}
                  size={16}
                  color={isChecked ? "#ffffff" : "transparent"}
                />
              </View>
              <View style={styles.exchangePolicyContent}>
                <Text style={styles.exchangePolicyTitle}>Exchange Policy</Text>
                <Text style={styles.exchangePolicyText}>
                  Request exchange within{" "}
                  <Text style={styles.exchangePolicyHighlight}>
                    {exchangePeriod} {exchangePeriodUnit}
                  </Text>{" "}
                  of delivery
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Alert Messages */}
        {alerts.length > 0 && (
          <View style={styles.alertsSection}>
            {alerts.map((alert, index) => (
              <AlertCard key={index} alert={alert} index={index} />
            ))}
          </View>
        )}

        {/* Promo Note */}
        {promoNote !== "" && (
          <Animated.View style={[styles.promoContainer, { opacity: fadeAnim }]}>
            <View style={styles.promoIconContainer}>
              <Ionicons name="gift" size={20} color="#10b981" />
            </View>
            <Text style={styles.promoText}>{promoNote}</Text>
          </Animated.View>
        )}

        {/* Summary Container */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryLabel}>Total Amount</Text>
              <TouchableOpacity
                style={styles.detailsToggle}
                onPress={toggleExpanded}
                activeOpacity={0.7}
              >
                <Ionicons name="receipt-outline" size={16} color="#6b7280" />
                <Text style={styles.detailsToggleText}>
                  {isExpanded ? "Hide" : "Show"} breakdown
                </Text>
                <Animated.View
                  style={[
                    styles.chevronContainer,
                    { transform: [{ rotate: chevronRotation }] }
                  ]}
                >
                  <Ionicons name="chevron-down" size={16} color="#6b7280" />
                </Animated.View>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryRight}>
              <SavingsBadge />
              <Text style={styles.summaryAmount}>
                {currency}{formatAmount(grandTotalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Expanded Details */}
        <Animated.View
          style={[
            styles.expandedContainer,
            {
              height: animatedHeight,
              opacity: animatedOpacity,
            }
          ]}
        >
          <View style={styles.expandedContent}>
            <View style={styles.breakdownHeader}>
              <Ionicons name="calculator-outline" size={20} color="#6b7280" />
              <Text style={styles.detailsHeader}>Payment Breakdown</Text>
            </View>

            <PaymentRow 
              label="Subtotal" 
              value={subTotal} 
              icon="basket-outline"
            />

            <PaymentRow
              label="Item Discount"
              value={freeItemsDiscount}
              isDiscount
              icon="pricetag-outline"
              showCondition={freeItemsDiscount >= minimumDiscountToShow}
            />

            <PaymentRow
              label="Coupon Savings"
              value={coupenDetails}
              isDiscount
              icon="ticket-outline"
              showCondition={coupenApplied && coupenDetails >= minimumDiscountToShow}
            />

            <PaymentRow
              label="Wallet Used"
              value={usedWalletAmount}
              isDiscount
              icon="wallet-outline"
              showCondition={(useWallet && usedWalletAmount > 0) || showWalletIfZero}
            />

            {customDiscounts
              .filter((discount) => discount.amount >= minimumDiscountToShow)
              .map((discount, index) => (
                <PaymentRow
                  key={`discount-${index}`}
                  label={discount.label}
                  value={discount.amount}
                  isDiscount
                  icon="gift-outline"
                />
              ))}

            <PaymentRow
              label="Delivery Fee"
              value={deliveryBoyFee}
              icon="bicycle-outline"
              showCondition={deliveryBoyFee >= minimumChargeToShow}
            />

            <PaymentRow
              label="Handling Fee"
              value={handlingFee}
              icon="cube-outline"
              showCondition={handlingFee >= minimumChargeToShow}
            />

            <PaymentRow 
              label="GST" 
              value={totalGstSum} 
              icon="document-text-outline"
            />

            <View style={styles.divider} />

            <PaymentRow
              label="Grand Total"
              value={grandTotalAmount}
              isBold
              isTotal
              icon="card-outline"
            />

            {totalSavings > 0 && (
              <View style={styles.totalSavingsContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                <Text style={styles.totalSavingsText}>
                  Total Savings: {currency}{formatAmount(totalSavings)}
                </Text>
              </View>
            )}

            {noteMessage && (
              <View style={styles.noteContainer}>
                <Ionicons name="chatbox-outline" size={16} color="#6b7280" />
                <Text style={styles.noteText}>{noteMessage}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  paymentDetails: {
    backgroundColor: "#ffffff",
    margin: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },

  // Header Styles
  headerSection: {
    padding: 16,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 17,
    // color: "#64748b",
    color:"#000",
    fontWeight: "500",
  },

  // Checkbox Styles
  checkboxSection: {
    margin: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  checkboxWrapper: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 1,
    backgroundColor: "#ffffff",
  },
  checkboxWrapperChecked: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  exchangePolicyContent: {
    flex: 1,
  },
  exchangePolicyTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  exchangePolicyText: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 16,
    fontWeight: "400",
  },
  exchangePolicyHighlight: {
    fontWeight: "600",
    color: "#10b981",
  },

  // Alert Styles
  alertsSection: {
    margin: 12,
    marginTop: 0,
  },
  alertContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  alertIconContainer: {
    marginRight: 8,
    marginTop: 1,
  },
  alertText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
  },

  // Promo Styles
  promoContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
    marginTop: 0,
    padding: 12,
    backgroundColor: "#ecfdf5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#10b981",
  },
  promoIconContainer: {
    marginRight: 8,
  },
  promoText: {
    flex: 1,
    fontSize: 12,
    color: "#065f46",
    fontWeight: "600",
    lineHeight: 16,
  },

  // Summary Styles
  summaryContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  summaryLeft: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  summaryRight: {
    alignItems: "flex-end",
  },
  savingsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#10b981",
  },
  savingsText: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "600",
    marginLeft: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: -0.3,
  },
  detailsToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  detailsToggleText: {
    fontSize: 12,
    color: "#6b7280",
    marginHorizontal: 6,
    fontWeight: "500",
  },
  chevronContainer: {
    marginLeft: 2,
  },

  // Expanded Content Styles
  expandedContainer: {
    overflow: "hidden",
  },
  expandedContent: {
    padding: 16,
    paddingTop: 12,
  },
  breakdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  detailsHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginLeft: 6,
  },

  // Payment Row Styles
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 2,
  },
  totalRow: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#f0fdf4",
    marginHorizontal: -6,
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#10b981",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowIcon: {
    marginRight: 6,
  },
  detailsLabel: {
    fontSize: 12,
    color: "#64748b",
    flex: 1,
    fontWeight: "500",
  },
  detailsValue: {
    fontSize: 12,
    color: "#1e293b",
    fontWeight: "600",
  },
  detailsLabelBold: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "700",
    flex: 1,
  },
  detailsValueBold: {
    fontSize: 13,
    color: "#1e293b",
    fontWeight: "700",
  },
  totalLabel: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 16,
    color: "#059669",
    fontWeight: "800",
  },
  discountValue: {
    color: "#10b981",
    fontWeight: "600",
  },

  // Utility Styles
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 12,
    borderRadius: 1,
  },
  totalSavingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    padding: 10,
    backgroundColor: "#ecfdf5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#10b981",
  },
  totalSavingsText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "700",
    marginLeft: 6,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  noteText: {
    flex: 1,
    fontSize: 11,
    color: "#64748b",
    fontStyle: "italic",
    marginLeft: 6,
    lineHeight: 16,
  },
});

export default BillDetails;