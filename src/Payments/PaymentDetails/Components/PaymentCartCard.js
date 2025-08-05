import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../../../../../Redux/constants/theme";
const { height, width } = Dimensions.get("window");

const PaymentCartCard = ({
  item,
  isLimitedStock,
  loadingItems,
  removalLoading,
  cartItems,
  containerDecision,
  containerItemIds,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const calculateDiscount = (mrp, price) => {
    if (isNaN(((mrp - price) / mrp) * 100)) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const isOutOfStock = isLimitedStock[item.itemId] === "outOfStock";
  const isLowStock = isLimitedStock[item.itemId] === "lowStock";
  const isLoading = loadingItems[item.itemId];
  const isRemoving = removalLoading[item.cartId];

  // Handle removal loading state
  if (isRemoving) {
    return (
      <View style={[styles.cartItem, styles.removalLoader]}>
        <ActivityIndicator size="small" color="#ecb01e" />
        <Text style={styles.removingText}>Removing...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.cartItem, isOutOfStock && styles.outOfStockCard]}>
      {/* Stock Status Badges */}
      {isLowStock && (
        <View style={styles.limitedStockBadge}>
          <Text style={styles.limitedStockText}>
            {item.quantity > 1 ? `${item.quantity} left` : `${item.quantity} left`}
          </Text>
        </View>
      )}

      {isOutOfStock && (
        <View style={styles.outOfStockBadge}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        </View>
      )}

      {/* Main Content Row */}
      <View style={styles.cardContent}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          {/* Offer Badge */}
          {item.status === "FREE" && (
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeText}>FREE</Text>
            </View>
          )}
          {item.status === "COMBO" && (
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeText}>COMBO</Text>
            </View>
          )}
          
          <Image
            source={{ uri: item.image }}
            style={styles.itemImage}
            onError={() => console.log("Failed to load image")}
          />
        </View>

        {/* Product Details */}
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.itemName}
          </Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.crossedPrice}>₹{item.priceMrp}</Text>
            <Text style={styles.boldPrice}>₹{item.itemPrice}</Text>
            <Text style={styles.discountText}>
              ({calculateDiscount(item.priceMrp, item.itemPrice)}% OFF)
            </Text>
          </View>
          
          <View style={styles.weightRow}>
            <Text style={styles.itemWeight}>
              {item.weight} {item.weight === 1 ? item.units.replace(/s$/, "") : item.units}
            </Text>
            {/* Delete Button */}
            {!isOutOfStock && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onRemove(item)}
              >
                <MaterialIcons name="delete" size={16} color="#FF0000" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quantity Controls */}
        <View style={styles.quantitySection}>
          {/* Item Total */}
          <Text style={styles.itemTotal}>
            ₹{(item.itemPrice * item.cartQuantity).toFixed(2)}
          </Text>
          
          {!isOutOfStock ? (
            <View style={styles.quantityControls}>
              {/* Decrease Button */}
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  styles.decreaseButton,
                  (isLoading || item.status != "ADD") && styles.disabledButton,
                ]}
                onPress={() => onDecrease(item)}
                disabled={isLoading || item.status != "ADD"}
              >
                <MaterialIcons name="remove" size={16} color="#fff" />
              </TouchableOpacity>

              {/* Quantity Display */}
              <View style={styles.quantityDisplay}>
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS?.services || "#4B0082"}
                  />
                ) : (
                  <Text style={styles.quantityText}>{item.cartQuantity}</Text>
                )}
              </View>

              {/* Increase Button */}
              {item.itemPrice === 1 ||
              (containerDecision === "yes" &&
                containerItemIds.includes(item.itemId)) ? (
                <View style={[styles.quantityButton, styles.disabledIncreaseButton]}>
                  <MaterialIcons name="add" size={16} color="#999" />
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    styles.increaseButton,
                    (isLoading ||
                      cartItems[item.itemId] === item.quantity ||
                      item.status != "ADD") && styles.disabledButton,
                  ]}
                  onPress={() => onIncrease(item)}
                  disabled={
                    isLoading ||
                    cartItems[item.itemId] === item.quantity ||
                    item.status != "ADD"
                  }
                >
                  <MaterialIcons name="add" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => onDecrease(item)}
              style={styles.removeButton}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>


      </View>

      {/* Free Sample Note */}
      {item.itemQuantity === 1 && (
        <Text style={styles.noteText}>
          Note: Only one free sample allowed per user.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    backgroundColor: "#fff",
    width: width * 0.95,
    marginVertical: 4,
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
    minHeight: 80,
    marginBottom:"2"
  },
  outOfStockCard: {
    opacity: 0.6,
    backgroundColor: "#f5f5f5",
  },
  limitedStockBadge: {
    position: "absolute",
    top: -3,
    right: 50,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  limitedStockText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  outOfStockBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#FF0000",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  outOfStockText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  offerBadge: {
    position: "absolute",
    top: -5,
    left: -5,
    backgroundColor: "#FF4D4F",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    elevation: 2,
    zIndex: 1,
  },
  offerBadgeText: {
    color: "#FFF",
    fontSize: 8,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  itemDetails: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    lineHeight: 18,
    marginBottom: 4,
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  crossedPrice: {
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 11,
    marginRight: 6,
  },
  boldPrice: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 12,
    marginRight: 6,
  },
  discountText: {
    fontSize: 10,
    color: "#FF6B35",
    fontWeight: "500",
  },
  itemWeight: {
    fontSize: 11,
    color: "#666",
    marginRight: 8,
  },
  quantitySection: {
    alignItems: "center",
    paddingHorizontal: 4,
    minWidth: 80,
   marginRight:20
  },
  itemTotal: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS?.services || "#4B0082",
    marginBottom: 6,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 2,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  decreaseButton: {
    backgroundColor: "#D1B3FF",
  },
  increaseButton: {
    backgroundColor: COLORS?.services || "#4B0082",
  },
  disabledIncreaseButton: {
    backgroundColor: "#e0e0e0",
  },
  disabledButton: {
    backgroundColor: "#bdc3c7",
    opacity: 0.6,
    elevation: 0,
  },
  quantityDisplay: {
    minWidth: 28,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  quantityText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2c3e50",
  },
  removeButton: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  removeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 4,
    backgroundColor: "#fff0f0",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  removalLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  removingText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#666",
  },
  noteText: {
    fontSize: 10,
    color: "#666",
    fontStyle: "italic",
    marginTop: 4,
    textAlign: "center",
  },
});

export default PaymentCartCard;