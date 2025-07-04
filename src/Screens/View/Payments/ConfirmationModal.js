import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');

const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  subTotal,
  deliveryFee,
  handlingFee,
  userInfo = {},
  orderItems = [],
  deliveryAddress = '',
  estimatedTime = '10 - 24 hours',
  paymentMethod = 'Cash on Delivery',
  loading,
  // New props for wallet and coupon
  walletBalance = 0,
  walletAmountUsed = 0,
  couponApplied = null, // { code: 'SAVE20', discount: 50, type: 'fixed' } or { code: 'SAVE10', discount: 10, type: 'percentage' }
  onWalletToggle,
  isWalletEnabled = false,
  waitingLoader = false

}) => {
  const [isProcessing, setIsProcessing] = useState(loading);
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  // Calculate totals with wallet and coupon
  const calculateTotals = () => {
    let itemTotal = subTotal;
    let couponDiscount = 0;
    
    // Calculate coupon discount
    if (couponApplied) {
      if (couponApplied.type === 'percentage') {
        couponDiscount = Math.round((itemTotal * couponApplied.discount) / 100);
      } else {
        couponDiscount = couponApplied.discount;
      }
    }
    
    const subtotalAfterCoupon = itemTotal - couponDiscount;
    const totalBeforeWallet = subtotalAfterCoupon + deliveryFee + handlingFee;
    const finalTotal = Math.max(0, totalBeforeWallet - walletAmountUsed);
    
    return {
      itemTotal,
      couponDiscount,
      subtotalAfterCoupon,
      totalBeforeWallet,
      finalTotal
    };
  };

  const totals = calculateTotals();
  const savings = Math.round(subTotal * 0.05); // Example: 5% savings

  const formatCurrency = (amount) => `₹${amount}`;

  const formatAddress = (addressObj) => {
    if (typeof addressObj === 'string') {
      return addressObj;
    }
    
    if (typeof addressObj === 'object' && addressObj !== null) {
      const parts = [];
      
      if (addressObj.flatNo) parts.push(addressObj.flatNo);
      if (addressObj.residenceName) parts.push(addressObj.residenceName);
      if (addressObj.address) parts.push(addressObj.address);
      if (addressObj.area) parts.push(addressObj.area);
      if (addressObj.landMark) parts.push(`Near ${addressObj.landMark}`);
      if (addressObj.pincode) parts.push(addressObj.pincode);
      
      return parts.filter(Boolean).join(', ');
    }
    
    return 'Address not available';
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    
    try {
      await onConfirm();
    } catch (error) {
      Alert.alert('Payment Failed', 'Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWalletToggle = () => {
    if (onWalletToggle) {
      onWalletToggle(!isWalletEnabled);
    }
  };

  const OrderSummaryItem = ({ name, quantity, price }) => (
    <View style={styles.orderItem}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemQuantity}>Qty: {quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>{formatCurrency(price)}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Order Confirmation</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* User Info */}
            {userInfo.name && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customer Details</Text>
                <Text style={styles.userInfo}>👤 {userInfo.name}</Text>
                {userInfo.phone && (
                  <Text style={styles.userInfo}>📱 {userInfo.phone}</Text>
                )}
              </View>
            )}

            {/* Delivery Info */}
            {deliveryAddress && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Delivery Information</Text>
                <Text style={styles.deliveryInfo}>📍 {formatAddress(deliveryAddress)}</Text>
                <Text style={styles.estimatedTime}>⏱️ Est. delivery: {estimatedTime}</Text>
              </View>
            )}

            {/* Order Items */}
            {orderItems.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Order Summary</Text>
                {orderItems.map((item, index) => (
                  <OrderSummaryItem
                    key={index}
                    name={item.name}
                    quantity={item.quantity}
                    price={item.price}
                  />
                ))}
              </View>
            )}

            {/* Coupon Applied */}
            {couponApplied && couponApplied.code && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Coupon Applied</Text>
                <View style={styles.couponContainer}>
                  <View style={styles.couponInfo}>
                    <Text style={styles.couponCode}>🎟️ {couponApplied.code.toUpperCase()}</Text>
                    <Text style={styles.couponSavings}>
                      You saved {formatCurrency(totals.couponDiscount)}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Wallet Section */}
            {walletBalance > 0 && (
              <View style={styles.section}>
                {/* <Text style={styles.sectionTitle}>Wallet</Text> */}
                <View style={styles.walletContainer}>
                  <View style={styles.walletInfo}>
                    {/* <Text style={styles.walletBalance}>
                      💰 Available Balance: {formatCurrency(walletBalance)}
                    </Text> */}
                    {isWalletEnabled && walletAmountUsed > 0 && (
                      <Text style={styles.walletUsed}>
                     Wallet Amount Used: {formatCurrency(walletAmountUsed)}
                      </Text>
                    )}
                  </View>
                  {onWalletToggle && (
                    <TouchableOpacity 
                      style={[
                        styles.walletToggle, 
                        isWalletEnabled ? styles.walletToggleActive : styles.walletToggleInactive
                      ]}
                      onPress={handleWalletToggle}
                    >
                      <Text style={[
                        styles.walletToggleText,
                        isWalletEnabled ? styles.walletToggleTextActive : styles.walletToggleTextInactive
                      ]}>
                        {isWalletEnabled ? 'Applied' : 'Apply'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Price Breakdown */}
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.billSummary}
                onPress={() => setShowBreakdown(!showBreakdown)}
                activeOpacity={0.7}
              >
                <View style={styles.billHeader}>
                  <Text style={styles.sectionTitle}>Bill Details</Text>
                  <View style={styles.billSummaryRight}>
                    <Text style={styles.totalValue}>{formatCurrency(totals.finalTotal)}</Text>
                    <Text style={styles.expandIcon}>{showBreakdown ? '▲' : '▼'}</Text>
                  </View>
                </View>
                <Text style={styles.viewDetailsText}>
                  {showBreakdown ? 'Hide breakdown' : 'Tap to view breakdown'}
                </Text>
              </TouchableOpacity>

              {showBreakdown && (
                <View style={styles.breakdownContainer}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Item Total</Text>
                    <Text style={styles.priceValue}>{formatCurrency(totals.itemTotal)}</Text>
                  </View>

                  {/* Coupon Discount */}
                  {couponApplied && totals.couponDiscount > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={[styles.priceLabel, styles.discountText]}>
                        Coupon Discount ({couponApplied.code})
                      </Text>
                      <Text style={[styles.priceValue, styles.discountText]}>
                        -{formatCurrency(totals.couponDiscount)}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Delivery Fee</Text>
                    <Text style={styles.priceValue}>{formatCurrency(deliveryFee)}</Text>
                  </View>
                  
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Handling Fee</Text>
                    <Text style={styles.priceValue}>{formatCurrency(handlingFee)}</Text>
                  </View>

                  {/* Wallet Amount Used */}
                  {walletAmountUsed > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={[styles.priceLabel, styles.walletDiscountText]}>
                        Wallet Amount Used
                      </Text>
                      <Text style={[styles.priceValue, styles.walletDiscountText]}>
                        -{formatCurrency(walletAmountUsed)}
                      </Text>
                    </View>
                  )}

                  {savings > 0 && (
                    <View style={styles.priceRow}>
                      <Text style={[styles.priceLabel, styles.savingsText]}>You Saved</Text>
                      <Text style={[styles.priceValue, styles.savingsText]}>-{formatCurrency(savings)}</Text>
                    </View>
                  )}

                  <View style={styles.separator} />
                  
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalValue}>{formatCurrency(totals.finalTotal)}</Text>
                  </View>

                  {/* Total Savings Summary */}
                  {(totals.couponDiscount > 0 || walletAmountUsed > 0 || savings > 0) && (
                    <View style={styles.totalSavingsContainer}>
                      <Text style={styles.totalSavingsText}>
                        🎉 Total Savings: {formatCurrency(totals.couponDiscount + walletAmountUsed + savings)}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Payment Method */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.paymentMethod}>
                <Text style={styles.paymentMethodText}>💳 {paymentMethod==="ONLINE"?"Online":"Cash on Delivery"}</Text>
                {totals.finalTotal === 0 && (
                  <Text style={styles.fullWalletPayment}>
                    ✅ Fully paid with wallet
                  </Text>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            {loading?(
                <>
                   <View style={styles.lottieAnimationContainer}>
                        <LottieView
                            source= {require('../../../../assets/Animations/orderProcessing.json')}
                            autoPlay
                            loop={false}
                            style={styles.processingLottie}
                        />
                   </View>
                </>
            ) : !waitingLoader ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                onPress={onClose} 
                style={[styles.button, styles.cancelButton]}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleConfirmPayment} 
                style={[styles.button, styles.confirmButton]}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.confirmButtonText}>Processing...</Text>
                  </View>
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {totals.finalTotal === 0 ? 'Confirm Order' : `Pay ${formatCurrency(totals.finalTotal)}`}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
        )
    :(
        <View style={styles.lottieAnimationContainer}>
            <LottieView
                source= {require('../../../../assets/Animations/orderConfirm.json')}
                autoPlay
                loop={false}
                style={styles.processingLottie}
            />
        </View>
    )}

            {/* Security Note */}
            <Text style={styles.securityNote}>
              🔒 Your payment is secured with end-to-end encryption
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
  deliveryInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 18,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#4caf50',
    fontWeight: '500',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  // Coupon Styles
  couponContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4caf50',
    borderStyle: 'dashed',
  },
  couponInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
  },
  couponSavings: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
  },
  // Wallet Styles
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  walletInfo: {
    flex: 1,
  },
  walletBalance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  walletUsed: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
    marginTop: 2,
  },
  walletToggle: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  walletToggleActive: {
    backgroundColor: '#4caf50',
  },
  walletToggleInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  walletToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  walletToggleTextActive: {
    color: '#fff',
  },
  walletToggleTextInactive: {
    color: '#4caf50',
  },
  billSummary: {
    marginBottom: 10,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billSummaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandIcon: {
    fontSize: 12,
    color: '#666',
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  breakdownContainer: {
    marginTop: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  discountText: {
    color: '#4caf50',
    fontWeight: '600',
  },
  walletDiscountText: {
    color: '#ff9800',
    fontWeight: '600',
  },
  savingsText: {
    color: '#4caf50',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  totalSavingsContainer: {
    backgroundColor: '#e8f5e8',
    borderRadius: 6,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  totalSavingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e7d32',
  },
  paymentMethod: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    width:width*0.8
  },
  fullWalletPayment: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '600',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#4caf50',
    shadowColor: '#4caf50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityNote: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 20,
    paddingBottom: 20,
    fontStyle: 'italic',
  },
  lottieAnimation:{
    width: 100,
    height: 50
  },
  processingLottie:{
    width:width*0.5,
    height:width*0.5
  },
  lottieAnimationContainer: {
    height: 40,
    justifyContent: 'center',
     alignItems: 'center',
     width:width*0.7,
     marginBottom:20,
     backgroundColor:'white',
     borderRadius:10,
     elevation:5,
     borderWidth:1,
     borderColor:'grey',
     shadowColor: '#000',
     shadowOffset: { 
        width: 0, 
        height: 0 
         },
     shadowOpacity: 0.15,
     shadowRadius: 10,
     alignSelf:"center"
  },
});

export default ConfirmationModal;