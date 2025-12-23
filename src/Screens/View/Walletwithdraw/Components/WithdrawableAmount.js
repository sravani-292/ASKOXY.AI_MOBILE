import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getWalletWithdrawalAmount } from './Withdrawapis';

const WithdrawableAmount = () => {
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;
  const [withdrawableAmount, setWithdrawableAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWithdrawableAmount = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getWalletWithdrawalAmount(customerId);
        console.log("Withdrawable amount response:", response.data);
        setWithdrawableAmount(response.data?.withDrawalAmount || 0);
      } catch (error) {
        console.error("Error fetching withdrawable amount:", error);
        setError("Failed to fetch withdrawable amount");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchWithdrawableAmount();
    }
  }, [customerId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.compactCard}>
          <ActivityIndicator size="small" color="#4CAF50" />
          <Text style={styles.compactText}>Loading balance...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={[styles.compactCard, styles.errorCard]}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.compactErrorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.compactCard}>
        <View style={styles.contentRow}>
          <View style={styles.labelContainer}>
            <Text style={styles.compactTitle}>Available Balance</Text>
            <Text style={styles.compactSubtitle}>Ready to withdraw</Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.compactAmount}>
              {formatCurrency(withdrawableAmount)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default WithdrawableAmount

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: '100%',
  },
  compactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  labelContainer: {
    flex: 1,
    marginRight: 12,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  compactSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  compactAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  compactText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#fff5f5',
    borderColor: '#fed7d7',
  },
  errorIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  compactErrorText: {
    fontSize: 14,
    color: '#e53e3e',
    fontWeight: '500',
    flex: 1,
  },
});