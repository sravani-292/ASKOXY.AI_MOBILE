import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  subTotal,
  deliveryFee,
  handlingFee,
  deliveryAddress,
  paymentMethod,
  loading,
  setLaoding,
  walletBalance,
  walletAmountUsed,
  isWalletEnabled,
  onWalletToggle,
  couponApplied,
}) => {
  // console.log("delivery address",deliveryAddress);
  
  const renderDetailRow = (label, value) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Your Order</Text>

          {renderDetailRow("Subtotal:", `₹${subTotal ? subTotal.toFixed(2) : '0.00'}`)}
          {renderDetailRow("Delivery Fee:", `₹${deliveryFee ? deliveryFee.toFixed(2) : '0.00'}`)}
          {renderDetailRow("Handling Fee:", `₹${handlingFee ? handlingFee.toFixed(2) : '0.00'}`)}

          {couponApplied && couponApplied.code && (
            renderDetailRow(`Coupon (${couponApplied.code}):`, `-₹${couponApplied.discount ? couponApplied.discount.toFixed(2) : '0.00'}`)
          )}

          {isWalletEnabled && walletAmountUsed > 0 && (
            renderDetailRow("Wallet Used:", `-₹${walletAmountUsed ? walletAmountUsed.toFixed(2) : '0.00'}`)
          )}

          <View style={styles.divider} />

          {renderDetailRow("Payment Method:", paymentMethod || 'N/A')}
          <Text style={styles.addressLabel}>Delivery Address:</Text>
          <Text style={styles.addressText}>
            {deliveryAddress?.flatNo}, {deliveryAddress?.landMark},
            {deliveryAddress?.address}, {deliveryAddress?.area},
            {deliveryAddress?.pincode}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              // disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Place Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginVertical: 15,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  addressText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmationModal;