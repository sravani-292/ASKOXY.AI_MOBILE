// components/SearchBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const SearchBar = ({ searchQuery, setSearchQuery, navigation, countValue }) => {
  const safeCount = typeof countValue === "number" ? countValue : 0;

  return (
    <View style={styles.header}>
      {/* Search Bar Section */}
      <View style={styles.searchFilterRow}>
        <View
          style={[
            styles.searchContainer,
            safeCount === 0 ? styles.fullWidth : styles.reducedWidth,
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color="#757575"
            style={styles.searchIcon}
          />

          <TextInput
            placeholder="Search for items..."
            placeholderTextColor="#757575"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => navigation.navigate("Search Screen")}
            style={styles.input}
            returnKeyType="search"
            clearButtonMode="never"
          />
        </View>

        {safeCount > 0 && (
          <TouchableOpacity
            onPress={() => navigation.navigate("My Cart")}
            style={styles.cartIconContainer}
          >
            <Ionicons name="cart-outline" size={32} color="#757575" />

            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{safeCount}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 42,
  },
  fullWidth: {
    flex: 0.9,
  },
  reducedWidth: {
    flex: 0.95,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  cartIconContainer: {
    marginLeft: 8,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#6b21a8",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default SearchBar;
