import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

const EmptyState = () => {
  return (
    <View style={styles.noResultsContainer}>
      <Icon name="search" size={60} color="#6b21a8" />
      <Text style={styles.noResultsText}>No items found</Text>
      <Text style={styles.noResultsSubText}>
        Try adjusting your search or filters
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 16,
  },
  noResultsSubText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
});

export default EmptyState;