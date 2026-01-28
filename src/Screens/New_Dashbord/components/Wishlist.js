import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);
    const navigation = useNavigation();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const stored = await AsyncStorage.getItem("WISHLIST");
        console.log("Stored Wishlist:", stored);
        setWishlist(stored ? JSON.parse(stored) : []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => { navigation.navigate("Item Details", { item:item })}}>
      <Image source={{ uri: item.itemImage }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{item.itemName}</Text>
        <Text style={styles.description} numberOfLines={3}>{item.itemDescription}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.itemPrice}</Text>
          <Text style={styles.mrp}>MRP: ₹{item.itemMrp}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.weight}>{item.weight} {item.units}</Text>
          <Text style={styles.savings}>Save ₹{item.saveAmount} ({item.savePercentage}%)</Text>
        </View>
        <Text style={styles.coins}>BMV Coins: {item.bmvCoins}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>My Wishlist ({wishlist.length} items)</Text> */}
      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item) => item.itemId}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
    marginRight: 10,
  },
  mrp: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  weight: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  savings: {
    fontSize: 12,
    color: "#27ae60",
    fontWeight: "500",
  },
  coins: {
    fontSize: 12,
    color: "#f39c12",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});

export default WishlistScreen;