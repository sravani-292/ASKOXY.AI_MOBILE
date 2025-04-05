import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import WalletOverview from './components/WalletOverview';
import TransactionHistory from './components/TransactionHistory';
import SubscriptionHistory from './components/SubscriptionHistory';
import Subscription from '../WalletSubscriptions/Subscription';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BASE_URL from '../../../../Config';
import { COLORS } from '../../../../Redux/constants/theme';
export default function MainWallet() {
  const [activeTab, setActiveTab] = useState('transactions');

  const userData = useSelector((state) => state.counter);
      const token = userData.accessToken;
      const customerId = userData.userId;
    
      const [walletTxs, setWalletTxs] = useState([]);
      const [walletAmount, setWalletAmount] = useState(0);
      const [loading, setLoading] = useState(true);
  
      useEffect(() => {
          getWallet();
        }, []);
  
        const getWallet = async () => {
          setLoading(true)
          const data = { customerId: customerId};
          try {
           const response = await axios.post(
           BASE_URL+"order-service/customerWalletData",
              data,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            console.log("customerWalletData",response.data);
            
            const { walletAmount, walletTransactions } = response.data;
            console.log("wallet transactions",response);
            setLoading(false)
            setWalletAmount(walletAmount);
            setWalletTxs(walletTransactions);
            console.log("wallet transactions",walletTxs);
            
          } catch (error) {33333333333333333333333333333333333333333333122222222222222222222221
            console.log(error.response);
          } finally {
            setLoading(false);
          }
        };
      
        if (loading) {
          return (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#9333ea" />
            </View>
          );
        }
  

  return (
    <View style={styles.container}>
      <WalletOverview  walletAmount={walletAmount} income={walletTxs.filter(t => t.walletTxType === 1)
                          .reduce((sum, t) => sum + t.walletTxAmount, 0)
                          .toLocaleString()} expenses={ walletTxs.filter(t => t.walletTxType === 2)
                            .reduce((sum, t) => sum +t.walletTxAmount, 0)
                            .toLocaleString()}/>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
          onPress={() => setActiveTab('transactions')}
        >
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>Transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'subscriptions' && styles.activeTab]}
          onPress={() => setActiveTab('subscriptions')}
        >
          <Text style={[styles.tabText, activeTab === 'subscriptions' && styles.activeTabText]}>Subscriptions</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'transactions' ? (
          <TransactionHistory walletTxs={walletTxs} />
        ) : (
            <>
           {/* <SubscriptionHistory /> */}
           <Subscription/>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: COLORS.services,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});