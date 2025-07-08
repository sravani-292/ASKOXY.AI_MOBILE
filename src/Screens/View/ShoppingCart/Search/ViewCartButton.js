import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const ViewCartButton = ({ cartCount, onPress }) => {
  if (cartCount <= 0) return null;
  
  return (
    <TouchableOpacity 
      style={styles.viewCartButton}
      onPress={onPress}
    >
      <View style={styles.viewCartContent}>
        <View style={styles.viewCartInfo}>
          <Text style={styles.viewCartCount}>{cartCount} {cartCount === 1 ? 'item' : 'items'}</Text>
          <Text style={styles.viewCartText}>View Cart</Text>
        </View>
        <MaterialIcons name="arrow-forward" size={24} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewCartButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#6b21a8',
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  viewCartContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewCartInfo: {
    flexDirection: 'column',
  },
  viewCartCount: {
    color: '#e5e7eb',
    fontSize: 12,
    marginBottom: 2,
  },
  viewCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ViewCartButton;