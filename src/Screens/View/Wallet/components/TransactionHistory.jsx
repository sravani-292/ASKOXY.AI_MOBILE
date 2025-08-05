import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList,Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../../../../Redux/constants/theme';
const {width,height}=Dimensions.get('window');
const transactions = [
  {
    id: '1',
    type: 1,
    title: 'Salary Deposit',
    amount: 3000,
    date: '2025-03-12',
    category: 'Income',
  },
  {
    id: '2',
    type: 2,
    title: 'Grocery Shopping',
    amount: 150.75,
    date: '2025-03-11',
    category: 'Shopping',
  },
  {
    id: '3',
    type: 2,
    title: 'Netflix Subscription',
    amount: 14.99,
    date: '2025-03-10',
    category: 'Entertainment',
  },
  {
    id: '4',
    type: 1,
    title: 'Freelance Payment',
    amount: 240,
    date: '2025-03-09',
    category: 'Income',
  },
];

export default function TransactionHistory({walletTxs}) {
  const [filter, setFilter] = useState('all');

  const filteredTransactions = walletTxs.filter(t => {
    if (filter === 'all') return true;
    return t.walletTxType === filter;
  });


  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionLeft}>
        <View style={[
          styles.categoryIcon,
          { backgroundColor: item.walletTxType === 1 ? '#4CAF50' : '#F44336' }
        ]}>
          <MaterialCommunityIcons
            name={item.walletTxType === 1 ? 'arrow-down' : 'arrow-up'}
            size={20}
            color="white"
          />
        </View>
        <View>
          {/* <Text style={styles.transactionTitle}>{item.walletTxType === 1 ? item.walletTxPurpose === 2 ? `Order ID : #${item.orderId || ""}` : item.walletTxPurpose === 3? "Subscription" :`Refereed To : #${item.refereedTo}`:"Debit"}</Text> */}
          <Text style={styles.transactionTitle}>
            {item.walletTxType === 1 ? "Credit" : "Debit"}
          </Text>
          <Text style={styles.transactionCategory}>• {item.walletTxDesc}</Text>
          <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleDateString()} </Text>
        </View>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: item.walletTxType === 1? '#4CAF50' : '#F44336' ,

          // textAlign: 'right', 
          // alignSelf: 'flex-end' 
        }
      ]}>
        {item.walletTxType === 1 ? '+' : '-'}{item.walletTxAmount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 1 && styles.activeFilter]}
          onPress={() => setFilter(1)}
        >
          <Text style={[styles.filterText, filter === 1 && styles.activeFilterText]}>Credit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 2 && styles.activeFilter]}
          onPress={() => setFilter(2)}
        >
          <Text style={[styles.filterText, filter === 2 && styles.activeFilterText]}>Debit</Text>
        </TouchableOpacity>
      </View>
  
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.transactionList}
        ListFooterComponentStyle={styles.footerStyle}
        ListFooterComponent={<View style={{height:height*0.001}}></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  activeFilter: {
    backgroundColor: COLORS.services,
  },
  filterText: {
    color: '#666',
  },
  activeFilterText: {
    color: 'white',
  },
  transactionList: {
    padding: 15,
    width:width*0.8,
    
    // marginRight:20,
    // alignSelf:"center"
  },
  transactionCard: {
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
    width:width*0.9
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    width:width*0.5
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    width:width*0.7
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom:50,
    marginLeft:-90  
    // marginLeft:width*0.

  },
  footerStyle:{
    marginBottom:height*0.1
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    width:width*0.6
  },
});