import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import formatUnit from "../../../../until/unitsChange";
import BVMCoins from "../../View/Profile/BVMCoins";
import WishlistButton from "./WishlistButton";

const ProductCard = ({ item, onAddToCart, cartItem, onDecrement, discount, customerId = null, dynamicContent }) => {
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(""); // 'add', 'increment', 'decrement'
  const [modalVisible, setModalVisible] = useState(false);
  // console.log("product item", item);

  // Memoize calculated values to avoid recalculation on every render
  const calculations = useMemo(() => {
    const savings =
      item.itemMrp > item.itemPrice ? item.itemMrp - item.itemPrice : 0;
    const formattedWeight = `${item.weight}${formatUnit(
      item.weight,
      item.units
    )}`;
    // console.log("categoryType", categoryType);

    const hasDiscount = discount > 0;
    const hasSavings = savings > 0;
    const hasRating = !!item.rating;
    const hasBrand = !!item.brand;
    const cartQuantity = cartItem?.cartQuantity || 0;
    const isInCart = cartItem && cartQuantity > 0;
    const hasQuantity = item?.quantity > 0;
    // console.log("hasquantity", hasQuantity);

    // const isSoldOut = categoryType=== "GOLD" && !hasQuantity && !isInCart;
    const isSoldOut = !hasQuantity && !isInCart;
    // console.log("isSoldOut", isSoldOut);

    return {
      savings,
      formattedWeight,
      hasDiscount,
      hasSavings,
      hasRating,
      hasBrand,
      cartQuantity,
      isInCart,
      isSoldOut,
    };
  }, [item, cartItem, discount]);

  const handleAction = useCallback(
    async (action, type) => {
      if (loading) return;

      setLoading(true);
      setActionType(type);

      try {
        const result = await action();
        console.log(result);
      } catch (error) {
        console.error(`Error ${type}:`, error);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setActionType("");
        }, 300);
      }
    },
    [loading]
  );

  const handleIncrement = useCallback(() => {
    handleAction(() => onAddToCart(item), "increment");
  }, [item, onAddToCart, handleAction]);

  const handleDecrement = useCallback(() => {
    if (!cartItem) return;
    handleAction(
      () =>
        onDecrement(
          cartItem.cartId,
          customerId,
          cartItem.cartQuantity,
          cartItem.itemId
        ),
      "decrement"
    );
  }, [cartItem, customerId, onDecrement, handleAction]);

  const handleAddToCart = useCallback(() => {
    console.log("Adding to cart:", item);
    handleAction(() => onAddToCart(item, "ADD"), "ADD");
  }, [item, onAddToCart, handleAction]);

  const {
    savings,
    formattedWeight,
    hasDiscount,
    hasSavings,
    hasRating,
    hasBrand,
    cartQuantity,
    isInCart,
    hasQuantity,
    isSoldOut,
  } = calculations;

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={["#ffffff", "#f3f0ff"]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Discount Badge */}
        {hasDiscount && (
          <LinearGradient
            colors={["#8B5CF6", "#A78BFA"]}
            style={styles.discountBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </LinearGradient>
        )}

        {/* Product Image Container */}
        <LinearGradient
          colors={["#faf5ff", "#f3e8ff"]}
          style={styles.imageContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image
            source={{ uri: item.itemImage }}
            style={styles.image}
            resizeMode="contain"
            defaultSource={require("../../../../assets/SVG/askoxy.png")}
          />

          <WishlistButton product={item} />
        </LinearGradient>

        <View style={styles.info}>
          {/* Weight and Brand */}
          <View style={styles.weightContainer}>
            <Text style={styles.weight}>{formattedWeight}</Text>
            {hasBrand && (
              <LinearGradient
                colors={["#F3E8FF", "#E9D5FF"]}
                style={styles.brandBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.brandText}>BRAND</Text>
              </LinearGradient>
            )}
          </View>

          {/* Product Name */}
          <View style={{ height: 50 }}>
            <Text style={styles.name} numberOfLines={2}>
              {item.itemName}
            </Text>
          </View>

          {/* Rating (if available) */}
          {hasRating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.ratingCount}>({item.ratingCount || 0})</Text>
            </View>
          )}

          {/* Price Section */}
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{item.itemPrice}</Text>
              {item.itemMrp > item.itemPrice && (
                <Text style={styles.strike}>₹{item.itemMrp}</Text>
              )}
            </View>
            {hasSavings && (
              <Text style={styles.savings}>You save ₹{savings.toFixed(2)}</Text>
            )}
            <View style={styles.bmvCoinsContainer}>
              <LinearGradient
                colors={["#f3e8ff", "#e9d5ff"]}
                style={styles.bmvCoinsBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.bmvCoinsText}>
                  You will get {item.bmvCoins} BMVCOINS
                </Text>

                <TouchableOpacity
                  style={styles.cartButton}
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <FontAwesome6
                    name="circle-info"
                    color="#6b21a8"
                    size={20}
                    containerStyle={styles.icon}
                  />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

          {/* Controls */}
          {/* <View style={styles.controls}>
            {isInCart ? (
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.quantityControls}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TouchableOpacity
                  style={[styles.controlButton, (loading && actionType === 'decrement') && styles.disabledButton]}
                  onPress={handleDecrement}
                  disabled={loading && actionType === 'decrement'}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.controlButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {loading && actionType === 'decrement' ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="remove" size={16} color="#fff" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                
                <View style={styles.quantityContainer}>
                  <Text style={styles.cartQtyText}>{cartQuantity}</Text>
                </View>
                
                <TouchableOpacity
                  style={[styles.controlButton, (loading && actionType === 'increment') && styles.disabledButton]}
                  onPress={handleIncrement}
                  disabled={loading && actionType === 'increment'}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                    style={styles.controlButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {loading && actionType === 'increment' ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="add" size={16} color="#fff" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <TouchableOpacity 
                style={[styles.addButton, (loading && actionType === 'ADD') && styles.disabledButton]} 
                onPress={handleAddToCart} 
                disabled={loading && actionType === 'ADD'}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#f3e8ff', '#e9d5ff']}
                  style={styles.addButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {loading && actionType === 'ADD' ? (
                    <ActivityIndicator size="small" color="#8B5CF6" />
                  ) : (
                    <Ionicons name="add" size={18} color="#8B5CF6" />
                  )}
                  <Text style={styles.addButtonText}>
                    {loading && actionType === 'ADD' ? 'ADDING...' : 'ADD'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View> */}
          <View style={styles.controls}>
            {isInCart ? (
              <LinearGradient
                colors={["#8B5CF6", "#7C3AED"]}
                style={styles.quantityControls}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    loading &&
                      actionType === "decrement" &&
                      styles.disabledButton,
                  ]}
                  onPress={handleDecrement}
                  disabled={loading && actionType === "decrement"}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
                    style={styles.controlButtonGradient}
                  >
                    <Ionicons name="remove" size={16} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.quantityContainer}>
                  <Text style={styles.cartQtyText}>{cartQuantity}</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    loading &&
                      actionType === "increment" &&
                      styles.disabledButton,
                  ]}
                  onPress={handleIncrement}
                  disabled={loading && actionType === "increment"}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
                    style={styles.controlButtonGradient}
                  >
                    <Ionicons name="add" size={16} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            ) : isSoldOut ? (
              <View style={styles.soldOutContainer}>
                <Text style={styles.soldOutText}>SOLD OUT</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.addButton,
                  loading && actionType === "ADD" && styles.disabledButton,
                ]}
                onPress={handleAddToCart}
                disabled={loading && actionType === "ADD"}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#f3e8ff", "#e9d5ff"]}
                  style={styles.addButtonGradient}
                >
                  <Ionicons name="add" size={18} color="#8B5CF6" />
                   <Text style={styles.addButtonText}>
                    {loading && actionType === 'ADD' ? 'ADDING...' : 'ADD'}
                  </Text>              
                    </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      <BVMCoins
        modalVisible={modalVisible}
        onCloseModal={() => {
          setModalVisible(false);
        }}
        content={dynamicContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 170,
    marginRight: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  card: {
    flex: 1,
    borderRadius: 16,
    padding: 0,
    overflow: "hidden",
  },

  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },

  discountText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
  },

  imageContainer: {
    position: "relative",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  image: {
    width: "100%",
    height: 90,
    borderRadius: 8,
  },

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

  info: {
    padding: 12,
    flex: 1,
  },

  weightContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  weight: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },

  brandBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  brandText: {
    fontSize: 8,
    color: "#7C3AED",
    fontWeight: "600",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 18,
    marginBottom: 6,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  ratingText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
    marginLeft: 4,
  },

  ratingCount: {
    fontSize: 11,
    color: "#999",
    marginLeft: 4,
  },

  priceContainer: {
    marginBottom: 12,
    height: 80,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginRight: 8,
  },

  strike: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "line-through",
    fontWeight: "500",
  },

  savings: {
    fontSize: 11,
    color: "#8B5CF6",
    fontWeight: "600",
  },

  controls: {
    marginTop: "auto",
  },

  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: "space-between",
  },

  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
  },

  controlButtonGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityContainer: {
    minWidth: 40,
    alignItems: "center",
  },

  cartQtyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  addButton: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#8B5CF6",
  },

  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  addButtonText: {
    color: "#8B5CF6",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 4,
  },

  disabledButton: {
    opacity: 0.6,
  },
  bmvCoinsContainer: {
    marginBottom: 8,
    width: "100%",
    marginTop: 10,
  },
  bmvCoinsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bmvCoinsText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6b21a8",
    opacity: 0.9,
    flex: 1,
    marginRight: 4,
    lineHeight: 12,
    width: "60%",
  },
  cartButton: {},
  soldOutContainer: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },

  soldOutText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
});

export default ProductCard;
