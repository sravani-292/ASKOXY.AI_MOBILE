// ✅ MOBILE (React Native) - WishlistButton.js
import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

const WishlistButton = ({ product }) => {
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      const stored = await AsyncStorage.getItem("WISHLIST");
      const wishlist = stored ? JSON.parse(stored) : [];
      const exists = wishlist.some((item) => item.itemId === product.itemId);
      setInWishlist(exists);
    //   console.log({wishlist});
    };
    checkWishlist();
  }, [product.id]);

  const toggleWishlist = async () => {
    try {
      const stored = await AsyncStorage.getItem("WISHLIST");
      let wishlist = stored ? JSON.parse(stored) : [];

      if (inWishlist) {
        wishlist = wishlist.filter((item) => item.id !== product.id);
      } else {
        wishlist.push(product);
      }

      await AsyncStorage.setItem("WISHLIST", JSON.stringify(wishlist));
      setInWishlist(!inWishlist);
    } catch (err) {
      console.error("Wishlist error", err);
    }
  };

  return (
    // <TouchableOpacity onPress={toggleWishlist}>
    //   <Ionicons
    //     name={inWishlist ? "heart" : "heart-outline"}
    //     size={24}
    //     color={inWishlist ? "red" : "gray"}
    //   />
    // </TouchableOpacity>
    <TouchableOpacity 
                style={styles.favoriteButton}
                activeOpacity={0.7}
                onPress={toggleWishlist}
              >
                <LinearGradient
                  colors={['#ffffff', '#faf5ff']}
                  style={styles.favoriteGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons 
                  name={inWishlist ? "heart" : "heart-outline"}
                  color={inWishlist ? "#6032cbff" : "#8B5CF6"}
                  size={16} />
                </LinearGradient>
              </TouchableOpacity>
  );
};

export default WishlistButton;

const styles = StyleSheet.create({
   favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  
  favoriteGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
