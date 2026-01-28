
import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const WishlistButton = ({ product }) => {
  const [inWishlist, setInWishlist] = useState(false);

  const PRODUCT_KEY = product.itemId; 

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const stored = await AsyncStorage.getItem("WISHLIST");
        const wishlist = stored ? JSON.parse(stored) : [];

        const exists = wishlist.some(
          item => item.itemId === PRODUCT_KEY
        );

        setInWishlist(exists);
      } catch (e) {
        console.error("Wishlist read error", e);
      }
    };

    checkWishlist();
  }, [PRODUCT_KEY]);

  const toggleWishlist = async () => {
    try {
      const stored = await AsyncStorage.getItem("WISHLIST");
      let wishlist = stored ? JSON.parse(stored) : [];

      if (inWishlist) {
        wishlist = wishlist.filter(
          item => item.itemId !== PRODUCT_KEY
        );
      } else {
        // avoid duplicates
        if (!wishlist.some(item => item.itemId === PRODUCT_KEY)) {
          wishlist.push(product);
        }
      }

      await AsyncStorage.setItem("WISHLIST", JSON.stringify(wishlist));
      setInWishlist(prev => !prev);
    } catch (err) {
      console.error("Wishlist error", err);
    }
  };

  return (
    <TouchableOpacity
      style={styles.favoriteButton}
      activeOpacity={0.7}
      onPress={toggleWishlist}
    >
      <LinearGradient
        colors={["#ffffff", "#faf5ff"]}
        style={styles.favoriteGradient}
      >
        <Ionicons
          name={inWishlist ? "heart" : "heart-outline"}
          color={inWishlist ? "#6032cbff" : "#8B5CF6"}
          size={16}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default WishlistButton;

const styles = StyleSheet.create({
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: "hidden",
  },
  favoriteGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

