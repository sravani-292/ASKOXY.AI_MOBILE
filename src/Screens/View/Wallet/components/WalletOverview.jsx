import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function WalletOverview({walletAmount,income,expenses}) {
  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Total Balance</Text>
        <Text style={styles.balanceAmount}>₹{walletAmount || 0}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
              <MaterialCommunityIcons name="arrow-down" size={20} color="white" />
            </View>
            <View>
              <Text style={styles.statLabel}>Credit</Text>
              <Text style={styles.statAmount}>₹{income}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#F44336' }]}>
              <MaterialCommunityIcons name="arrow-up" size={20} color="white" />
            </View>
            <View>
              <Text style={styles.statLabel}>Debit</Text>
              <Text style={styles.statAmount}>₹{expenses}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
});