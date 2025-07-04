import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../Config/supabaseClient';

const BillDetails = ({
  subTotal = 0,
  freeItemsDiscount = 0,
  coupenApplied = false,
  coupenDetails = 0,
  useWallet = false,
  usedWalletAmount = 0,
  deliveryBoyFee = 0,
  noteMessage = '',
  totalGstSum = 0,
  grandTotalAmount = 0,
  exchangePeriod = 10,
  exchangePeriodUnit = 'days',
  onExchangePolicyChange,
  showExchangePolicy = true,
  currency = '₹',
  customDiscounts = [],
  handlingFee = 0,
  distance=0,
  // New props for conditional display
  minimumDiscountToShow = 10, // Only show discounts above this amount
  minimumChargeToShow = 5, // Only show charges above this amount
  showWalletIfZero = false, // Show wallet section even if amount is 0
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
const [alerts, setAlerts] = useState([]);
  const [promoNote, setPromoNote] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleCheckboxPress = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onExchangePolicyChange?.(newCheckedState);
  };

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toFixed(2);
  };

  const checkNextZeroFeePromo = async () => {
    const { data: slabs, error } = await supabase
      .from('handling_fees')
      .select('*')
      .eq('active', true)
      .order('min_cart', { ascending: true });

    if (error || !slabs) return;

    const nextSlab = slabs.find(slab =>
      slab.fee === 0 &&
      subTotal < slab.min_cart &&
      (!slab.min_km || distance >= slab.min_km) &&
      (!slab.max_km || distance < slab.max_km)
    );

    if (nextSlab) {
      const difference = Math.ceil(nextSlab.min_cart - subTotal);
      setPromoNote(`Just ₹${difference} away from zero handling charges!`);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }).start();
    } else {
      setPromoNote('');
    }
  };


 useEffect(() => {
  const fetchAlertRules = async () => {
    const { data: rules, error } = await supabase
      .from('alert_rules')
      .select('*')
      .eq('active', true);

    if (error || !rules) return;

    const values = {
      subTotal,
      handlingFee,
      distance,
    };

    console.log("values", values);
    

    const matched = [];

    rules.forEach((rule) => {
      const result = rule.conditions.map((cond) => {
        const val = values[cond.key];
        if (val === undefined) return false;
        return eval(`${val} ${cond.op} ${cond.value}`);
      });

      const pass =
        rule.logic_type === 'AND'
          ? result.every(Boolean)
          : result.some(Boolean);

      if (pass) {
        matched.push({ message: rule.message, type: rule.type });
      }
    });

    // filter unique messages
    const uniqueAlerts = Array.from(
      new Map(matched.map((m) => [m.message, m])).values()
    );
   console.log("uniqueAlerts", uniqueAlerts);
   
    setAlerts(uniqueAlerts);
  };

  fetchAlertRules();
   checkNextZeroFeePromo();
}, [subTotal, handlingFee, distance]);


  // Calculate savings
  const totalSavings = (freeItemsDiscount || 0) + 
                      (coupenApplied ? coupenDetails : 0) + 
                      (useWallet ? usedWalletAmount : 0) +
                      customDiscounts.reduce((sum, discount) => sum + discount.amount, 0);

  const PaymentRow = ({ label, value, isDiscount = false, isBold = false, isTotal = false, showCondition = true }) => {
    if (!showCondition) return null;
    
    return (
      <View style={[styles.paymentRow, isTotal && styles.totalRow]}>
        <Text style={[
          isBold ? styles.detailsLabelBold : styles.detailsLabel,
          isTotal && styles.totalLabel
        ]}>
          {label}
        </Text>
        <Text style={[
          isBold ? styles.detailsValueBold : styles.detailsValue,
          isDiscount && styles.discountValue,
          isTotal && styles.totalValue
        ]}>
          {isDiscount ? '-' : (value > 0 ? '+' : '')}
          {currency}{formatAmount(Math.abs(value))}
        </Text>
      </View>
    );
  };

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400], // Adjust based on your content height
  });

  return (
    <View style={styles.paymentDetails}>
         {/* Exchange Policy Checkbox */}
          {showExchangePolicy && (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={handleCheckboxPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isChecked ? "checkbox" : "square-outline"}
                size={24}
                color={isChecked ? "#4CAF50" : "#757575"}
              />
              <Text style={styles.exchangePolicyText}>
                You can request an exchange within{" "}
                <Text style={styles.exchangePolicyHighlight}>
                  {exchangePeriod} {exchangePeriodUnit}
                </Text>{" "}
                of your order being delivered.
              </Text>
            </TouchableOpacity>
          )}
           {/* Note Message */}
              {alerts.map((alert, i) => (
  <View
    key={i}
    style={{
      backgroundColor:
        alert.type === 'error'
          ? '#fddede'
          : alert.type === 'warning'
          ? '#fff3cd'
          : alert.type === 'success'
          ? '#d4edda'
          : '#e7f3fe',
      borderLeftWidth: 4,
      borderLeftColor:
        alert.type === 'error'
          ? '#f44336'
          : alert.type === 'warning'
          ? '#ff9800'
          : alert.type === 'success'
          ? '#4caf50'
          : '#2196f3',
      padding: 15,
      marginBottom: 6,
      borderRadius: 6,
    }}>
    <Text style={{ color: '#333', fontSize: 16 }}>{alert.message}</Text>
  </View>
))}

{promoNote !== '' && (
  <Animated.View
    style={{
      opacity: fadeAnim,
      backgroundColor: '#e3f9e5',
      borderLeftWidth: 5,
      borderLeftColor: '#4caf50',
      padding: 15,
      borderRadius: 6,
      marginBottom: 8
    }}>
    <Text style={{ fontSize: 16, color: '#2e7d32' }}>{promoNote}</Text>
  </Animated.View>
)}
      {/* Collapsed View - Always Visible */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
            <View >
          <Text style={styles.summaryLabel}>Total Amount</Text>
          <View style={{marginLeft:-10}}>
           <TouchableOpacity 
          style={styles.infoButton}
          onPress={toggleExpanded}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="information-circle-outline" 
            size={16} 
            color="#666" 
          />
          <Text style={styles.infoText}>
            {isExpanded ? 'Hide Details' : 'View Details'}
          </Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#666" 
          />
        </TouchableOpacity>
        </View>
          </View>
          
          <View style={styles.summaryRight}>
            {totalSavings > 0 && (
              <Text style={styles.savingsText}>
                You saved {currency}{formatAmount(totalSavings)}
              </Text>
            )}
            <Text style={styles.summaryAmount}>
              {currency}{formatAmount(grandTotalAmount)}
            </Text>
          </View>
          
        </View>
        
       
      </View>

      {/* Expanded View - Collapsible */}
      <Animated.View style={[styles.expandedContainer, { height: animatedHeight }]}>
        <View style={styles.expandedContent}>

          {/* Payment Details Header */}
          <Text style={styles.detailsHeader}>Payment Breakdown</Text>

          {/* Sub Total */}
          <PaymentRow label="Sub Total" value={subTotal} />

          {/* Discounts Section - Only show if above threshold */}
          <PaymentRow 
            label="Item Discount" 
            value={freeItemsDiscount} 
            isDiscount 
            showCondition={freeItemsDiscount >= minimumDiscountToShow}
          />

          <PaymentRow 
            label="Coupon Discount" 
            value={coupenDetails} 
            isDiscount 
            showCondition={coupenApplied && coupenDetails >= minimumDiscountToShow}
          />

          <PaymentRow 
            label="Wallet Amount Used" 
            value={usedWalletAmount} 
            isDiscount 
            showCondition={(useWallet && usedWalletAmount > 0) || showWalletIfZero}
          />

          {/* Custom Discounts - Only show if above threshold */}
          {customDiscounts
            .filter(discount => discount.amount >= minimumDiscountToShow)
            .map((discount, index) => (
              <PaymentRow
                key={`discount-${index}`}
                label={discount.label}
                value={discount.amount}
                isDiscount
              />
            ))
          }

          {/* Charges Section - Only show if above threshold */}
          <PaymentRow 
            label="Delivery Fee" 
            value={deliveryBoyFee} 
            showCondition={deliveryBoyFee >= minimumChargeToShow}
          />

          <PaymentRow 
            label="Handling Fee" 
            value={handlingFee} 
            showCondition={handlingFee >= minimumChargeToShow}
          />

          {/* Custom Charges - Only show if above threshold */}
          {/* {customCharges
            .filter(charge => charge.amount >= minimumChargeToShow)
            .map((charge, index) => (
              <PaymentRow
                key={`charge-${index}`}
                label={charge.label}
                value={charge.amount}
              />
            ))
          } */}

          <PaymentRow label="GST" value={totalGstSum} />

          {/* Divider */}
          <View style={styles.divider} />

          {/* Grand Total */}
          <PaymentRow
            label="Grand Total"
            value={grandTotalAmount}
            isBold
            isTotal
          />

          {/* Additional Info */}
          {totalSavings > 0 && (
            <View style={styles.savingsContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.savingsDetailText}>
                Total Savings: {currency}{formatAmount(totalSavings)}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  paymentDetails: {
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  summaryContainer: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  savingsText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    // backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 8,
    fontWeight: '500',
  },
  expandedContainer: {
    overflow: 'hidden',
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  exchangePolicyText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  exchangePolicyHighlight: {
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  detailsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  totalRow: {
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    marginHorizontal: -8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  detailsLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailsValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  detailsLabelBold: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
  },
  detailsValueBold: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  discountValue: {
    color: '#4CAF50',
  },
  noteMessage: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginVertical: 8,
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 6,
  },
  savingsDetailText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default BillDetails;