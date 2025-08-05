// components/CartButton.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartButton = ({ totalItems, totalValue, onPress }) => (
  <TouchableOpacity style={styles.cartButton} onPress={onPress}>
    <View style={styles.content}>
      <Text style={styles.text}>
        {totalItems} items | ₹{totalValue}
      </Text>
      <Text style={styles.subtext}>Go to cart</Text>
    </View>
    <Ionicons name="arrow-forward" size={20} color="#fff" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cartButton: {
    backgroundColor: '#6158d2ff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
});

export default CartButton;
