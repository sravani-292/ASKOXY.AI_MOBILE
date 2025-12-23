import { KeyboardAvoidingView, StyleSheet, Text, View, Platform, ScrollView } from 'react-native'
import React from 'react';
import WithdrawableAmount from './Components/WithdrawableAmount';
import WithdrawRequest from './Components/WithdrawRequest';
const WalletWithdrawComponent = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} 
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          <WithdrawableAmount />
          <WithdrawRequest />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default WalletWithdrawComponent;

const styles = StyleSheet.create({});
