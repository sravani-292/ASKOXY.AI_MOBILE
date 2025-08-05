// components/SearchBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ searchQuery, setSearchQuery,navigation }) => (
  <View style={styles.searchContainer}>
    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
    <TextInput
      style={styles.searchInput}
      placeholder="Search for products..."
      value={searchQuery}
      onChangeText={setSearchQuery}
      onFocus={() => navigation.navigate("Search Screen")}
      placeholderTextColor="#999"
    />
    {/* <TouchableOpacity style={styles.micButton}>
      <Ionicons name="mic" size={20} color="#FF6B35" />
    </TouchableOpacity> */}
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  micButton: {
    padding: 4,
  },
});

export default SearchBar;
