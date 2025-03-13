import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const subscriptions = [
  {
    id: '1',
    title: 'Netflix',
    amount: 14.99,
    nextBilling: '2025-04-10',
    icon: 'movie',
    color: '#E50914',
  },
  {
    id: '2',
    title: 'Spotify',
    amount: 9.99,
    nextBilling: '2025-04-15',
    icon: 'music',
    color: '#1DB954',
  },
  {
    id: '3',
    title: 'iCloud',
    amount: 2.99,
    nextBilling: '2025-04-01',
    icon: 'cloud',
    color: '#007AFF',
  },
  {
    id: '4',
    title: 'YouTube Premium',
    amount: 11.99,
    nextBilling: '2025-04-05',
    icon: 'youtube',
    color: '#FF0000',
  },
];

export default function SubscriptionHistory() {
  const renderSubscription = ({ item }) => (
    <View style={styles.subscriptionCard}>
      <View style={styles.subscriptionLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <MaterialCommunityIcons name={item.icon} size={24} color="white" />
        </View>
        <View>
          <Text style={styles.subscriptionTitle}>{item.title}</Text>
          <Text style={styles.nextBilling}>Next billing: {item.nextBilling}</Text>
        </View>
      </View>
      <Text style={styles.amount}>${item.amount}/mo</Text>
    </View>
  );

  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Monthly Subscriptions</Text>
        <Text style={styles.totalAmount}>${totalMonthly.toFixed(2)}</Text>
      </View>

      <FlatList
        data={subscriptions}
        renderItem={renderSubscription}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.subscriptionList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  totalCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subscriptionList: {
    paddingTop: 8,
  },
  subscriptionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  subscriptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  nextBilling: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});