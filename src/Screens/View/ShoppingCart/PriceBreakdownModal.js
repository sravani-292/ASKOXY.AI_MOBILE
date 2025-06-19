import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

const PriceBreakdownModal = ({ 
  visible,
  onClose,
  totalCartValue, 
  freeItemPrice, 
  itemsGstAmount, 
  goldGstAmount, 
  goldMakingCost, 
  gstAmount, 
  grandTotal 
}) => {
  // Helper function to check if value exists and is greater than 0
  const hasValue = (value) => {
    return value !== null && value !== undefined && value > 0;
  };

  const finalTotal = (grandTotal || 0) + (gstAmount || 0);

  // Check if there's any price data to show
  const hasPriceData = hasValue(totalCartValue) || 
                       hasValue(freeItemPrice) || 
                       hasValue(itemsGstAmount) || 
                       hasValue(goldGstAmount) || 
                       hasValue(goldMakingCost) || 
                       hasValue(gstAmount) || 
                       hasValue(grandTotal);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Price Breakdown</Text>
          </View>

          {/* Price Details */}
          <View style={styles.priceDetailsContainer}>
            {hasPriceData ? (
              <>
                {hasValue(totalCartValue) && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Sub Total:</Text>
                    <Text style={styles.priceValue}>₹{totalCartValue}</Text>
                  </View>
                )}

                {hasValue(freeItemPrice) && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Discount:</Text>
                    <Text style={[styles.priceValue, styles.discountText]}>- ₹{freeItemPrice}</Text>
                  </View>
                )}

                {hasValue(itemsGstAmount) && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Items GST:</Text>
                    <Text style={styles.priceValue}>+ ₹{itemsGstAmount?.toFixed(2)}</Text>
                  </View>
                )}

                {hasValue(goldGstAmount) && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Gold GST:</Text>
                    <Text style={styles.priceValue}>+ ₹{goldGstAmount?.toFixed(2)}</Text>
                  </View>
                )}

                {hasValue(goldMakingCost) && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Gold Making Cost:</Text>
                    <Text style={styles.priceValue}>+ ₹{goldMakingCost?.toFixed(2)}</Text>
                  </View>
                )}

                {/* {hasValue(gstAmount) && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>GST:</Text>
                    <Text style={styles.priceValue}>₹{gstAmount?.toFixed(2)}</Text>
                  </View>
                )} */}

                {/* Only show divider if there are items above and grand total below */}
                {(hasValue(totalCartValue) || hasValue(freeItemPrice) || hasValue(itemsGstAmount) || 
                  hasValue(goldGstAmount) || hasValue(goldMakingCost) || hasValue(gstAmount)) && 
                  hasValue(finalTotal) && (
                  <View style={styles.divider} />
                )}

                {/* Grand Total - show if final total is greater than 0 */}
                {hasValue(finalTotal) && (
                  <View style={[styles.priceRow, styles.grandTotalRow]}>
                    <Text style={styles.grandTotalLabel}>Grand Total:</Text>
                    <Text style={styles.grandTotalValue}>₹{finalTotal.toFixed(2)}</Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No price breakdown available</Text>
              </View>
            )}
          </View>

          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding
    maxHeight: screenHeight * 0.7,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#D1D1D6',
    borderRadius: 2,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  priceDetailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  priceValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  discountText: {
    color: '#34C759',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  grandTotalRow: {
    paddingVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    marginHorizontal: 20,
    backgroundColor: '#4B0082',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default PriceBreakdownModal;