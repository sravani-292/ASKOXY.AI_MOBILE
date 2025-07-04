// import React from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { COLORS } from "../../../../../Redux/constants/theme";

// const CartCard = ({
//   item,
//   isLimitedStock,
//   loadingItems,
//   removalLoading,
//   cartItems,
//   containerDecision,
//   containerItemIds,
//   onIncrease,
//   onDecrease,
//   onRemove,
// }) => {
//   const calculateDiscount = (mrp, price) => {
//     if (isNaN(((mrp - price) / mrp) * 100)) return 0;
//     return Math.round(((mrp - price) / mrp) * 100);
//   };

//   const isOutOfStock = isLimitedStock[item.itemId] === "outOfStock";
//   const isLowStock = isLimitedStock[item.itemId] === "lowStock";
//   const isLoading = loadingItems[item.itemId];
//   const isRemoving = removalLoading[item.cartId];

//   // Handle removal loading state
//   if (isRemoving) {
//     return (
//       <View style={[styles.cartItem, styles.removalLoader]}>
//         <ActivityIndicator size="large" color="#ecb01e" />
//         <Text style={styles.removingText}>Removing {item.itemName}...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.cartItem, isOutOfStock && styles.outOfStockCard]}>
//       {/* Low Stock Badge */}
//       {isLowStock && (
//         <View style={styles.limitedStockBadge}>
//           <Text style={styles.limitedStockText}>
//             {item.quantity > 1
//               ? `${item.quantity} items left`
//               : `${item.quantity} item left`}
//           </Text>
//         </View>
//       )}

//       {/* Out of Stock Badge */}
//       {isOutOfStock && (
//         <View style={styles.outOfStockContainer}>
//           <Text style={styles.outOfStockText}>Out of Stock</Text>
//           <TouchableOpacity
//             onPress={() => onDecrease(item)}
//             style={styles.removeButton}
//           >
//             <Text style={styles.removeText}>Please remove it</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Free Sample Note */}
//       {item.itemQuantity === 1 && (
//         <Text style={styles.noteText}>
//           Note: Only one free sample is allowed per user.
//         </Text>
//       )}

//       <View style={styles.cardContent}>
//         {/* Product Image */}
//         <View style={styles.imageContainer}>
//           <Image
//             source={{ uri: item.image }}
//             style={styles.itemImage}
//             onError={() => console.log("Failed to load image")}
//           />
//           {/* Offer Badge */}
//           {item.status === "FREE" && (
//             <View style={styles.offerBadge}>
//               <Text style={styles.offerBadgeText}>OFFER</Text>
//             </View>
//           )}
//         </View>

//         {/* Product Details */}
//         <View style={styles.itemDetails}>
//           <Text style={styles.itemName}>{item.itemName}</Text>

//           {/* Price Section */}
//           <View style={styles.priceContainer}>
//             <Text style={[styles.itemPrice, styles.crossedPrice]}>
//               MRP: ₹{item.priceMrp}
//             </Text>
//             <Text style={[styles.itemPrice, styles.boldPrice]}>
//               ₹{item.itemPrice}
//             </Text>
//           </View>

//           {/* Discount */}
//           <Text style={styles.discountText}>
//             ({calculateDiscount(item.priceMrp, item.itemPrice)}% OFF)
//           </Text>

//           {/* Weight */}
//           <Text style={styles.itemWeight}>
//             Weight: {item.weight}{" "}
//             {item.weight === 1 ? item.units.replace(/s$/, "") : item.units}
//           </Text>

//           {/* Quantity Controls */}
//           {!isOutOfStock && (
//             <View style={styles.quantityContainer}>
//               {/* Decrease Button */}
//               <TouchableOpacity
//                 style={[
//                   styles.quantityButton,
//                   (isLoading || item.status === "FREE") &&
//                     styles.disabledButton,
//                 ]}
//                 onPress={() => onDecrease(item)}
//                 disabled={isLoading || item.status === "FREE"}
//               >
//                 <Text style={styles.buttonText}>-</Text>
//               </TouchableOpacity>

//               {/* Quantity Display */}
//               {isLoading ? (
//                 <ActivityIndicator
//                   size="small"
//                   color="#000"
//                   style={styles.loader}
//                 />
//               ) : (
//                 <Text style={styles.quantityText}>{item.cartQuantity}</Text>
//               )}

//               {/* Increase Button */}
//               {item.itemPrice === 1 ||
//               (containerDecision === "yes" &&
//                 containerItemIds.includes(item.itemId)) ? (
//                 <View
//                   style={[
//                     styles.quantityButton1,
//                     item.status === "FREE" && styles.disabledButton,
//                   ]}
//                 >
//                   <Text style={styles.quantityButtonText}>+</Text>
//                 </View>
//               ) : (
//                 <TouchableOpacity
//                   style={[
//                     styles.quantityButton,
//                     (isLoading ||
//                       cartItems[item.itemId] === item.quantity ||
//                       item.status === "FREE") &&
//                       styles.disabledButton,
//                   ]}
//                   onPress={() => onIncrease(item)}
//                   disabled={
//                     isLoading ||
//                     cartItems[item.itemId] === item.quantity ||
//                     item.status === "FREE"
//                   }
//                 >
//                   <Text style={styles.buttonText}>+</Text>
//                 </TouchableOpacity>
//               )}

//               {/* Item Total */}
//               <Text style={styles.itemTotal}>
//                 ₹{(item.itemPrice * item.cartQuantity).toFixed(2)}
//               </Text>
//             </View>
//           )}

//           {/* Delete Button */}
//           {!isOutOfStock && (
//             <TouchableOpacity
//               style={styles.deleteButton}
//               onPress={() => onRemove(item)}
//             >
//               <MaterialIcons name="delete" size={23} color="#FF0000" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   cartItem: {
//     backgroundColor: "#fff",
//     marginHorizontal: 5,
//     marginVertical: 8,
//     borderRadius: 12,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     position: "relative",
//   },
//   outOfStockCard: {
//     opacity: 0.6,
//     backgroundColor: "#f5f5f5",
//   },
//   limitedStockBadge: {
//     position: "absolute",
//     top: -5,
//     right: 10,
//     backgroundColor: "#FF6B35",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     zIndex: 1,
//   },
//   limitedStockText: {
//     color: "#fff",
//     fontSize: 10,
//     fontWeight: "bold",
//   },
//   outOfStockContainer: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     alignItems: "center",
//     zIndex: 1,
//   },
//   outOfStockText: {
//     color: "#FF0000",
//     fontWeight: "bold",
//     fontSize: 12,
//   },
//   removeButton: {
//     backgroundColor: "#FF0000",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginTop: 4,
//   },
//   removeText: {
//     color: "#fff",
//     fontSize: 10,
//   },
//   noteText: {
//     fontSize: 12,
//     color: "#666",
//     fontStyle: "italic",
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   cardContent: {
//     flexDirection: "row",
//   },
//   imageContainer: {
//     position: "relative",
//     marginRight: 16,
//     justifyContent: "center",
//     alignSelf: "center",
//   },
//   itemImage: {
//     width: 100,
//     height: 120,
//     borderRadius: 8,
//     backgroundColor: "#f0f0f0",
//     justifyContent: "center",
//     alignSelf: "center",
//   },
//   offerBadge: {
//     position: "absolute",
//     top: -5,
//     left: -5,
//     backgroundColor: "#FFD700",
//     paddingHorizontal: 15,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   offerBadgeText: {
//     color: COLORS.services,
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   itemDetails: {
//     flex: 1,
//     justifyContent: "space-between",
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 4,
//   },
//   priceContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   itemPrice: {
//     fontSize: 14,
//     marginRight: 8,
//   },
//   crossedPrice: {
//     textDecorationLine: "line-through",
//     color: "#999",
//   },
//   boldPrice: {
//     fontWeight: "bold",
//     color: "#333",
//   },
//   discountText: {
//     fontSize: 12,
//     color: "#FF6B35",
//     fontWeight: "500",
//     marginBottom: 4,
//   },
//   itemWeight: {
//     fontSize: 15,
//     color: "#666",
//     marginBottom: 12,
//   },
//   quantityContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   quantityButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: COLORS?.services || "#4B0082",
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 8,
//   },
//   quantityButton1: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#ccc",
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 8,
//   },
//   disabledButton: {
//     backgroundColor: "#ccc",
//     opacity: 0.6,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   quantityButtonText: {
//     color: "#999",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   quantityText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     marginHorizontal: 12,
//     minWidth: 20,
//     textAlign: "center",
//   },
//   loader: {
//     marginHorizontal: 12,
//   },
//   itemTotal: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//     marginLeft: "auto",
//   },
//   deleteButton: {
//     alignSelf: "flex-end",
//     padding: 4,
//   },
//   removalLoader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 24,
//   },
//   removingText: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: "#666",
//   },
// });

// export default CartCard;


import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../../../../Redux/constants/theme";

const CartCard = ({
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
        <ActivityIndicator size="large" color="#ecb01e" />
        <Text style={styles.removingText}>Removing {item.itemName}...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.cartItem, isOutOfStock && styles.outOfStockCard]}>
      {/* Low Stock Badge */}
      {isLowStock && (
        <View style={styles.limitedStockBadge}>
          <Text style={styles.limitedStockText}>
            {item.quantity > 1
              ? `${item.quantity} items left`
              : `${item.quantity} item left`}
          </Text>
        </View>
      )}

      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <View style={styles.outOfStockContainer}>
          <Text style={styles.outOfStockText}>Out of Stock</Text>
          <TouchableOpacity
            onPress={() => onDecrease(item)}
            style={styles.removeButton}
          >
            <Text style={styles.removeText}>Please remove it</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Free Sample Note */}
      {item.itemQuantity === 1 && (
        <Text style={styles.noteText}>
          Note: Only one free sample is allowed per user.
        </Text>
      )}

      <View style={styles.cardContent}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.itemImage}
            onError={() => console.log("Failed to load image")}
          />
          {/* Offer Badge */}
          {item.status === "FREE" && (
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeText}>OFFER</Text>
            </View>
          )}
        </View>

        {/* Product Details */}
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.itemName}</Text>

          {/* Price Section */}
          <View style={styles.priceContainer}>
            <Text style={[styles.itemPrice, styles.crossedPrice]}>
              MRP: ₹{item.priceMrp}
            </Text>
            <Text style={[styles.itemPrice, styles.boldPrice]}>
              ₹{item.itemPrice}
            </Text>
          </View>

          {/* Discount */}
          <Text style={styles.discountText}>
            ({calculateDiscount(item.priceMrp, item.itemPrice)}% OFF)
          </Text>

          {/* Weight */}
          <Text style={styles.itemWeight}>
            Weight: {item.weight}{" "}
            {item.weight === 1 ? item.units.replace(/s$/, "") : item.units}
          </Text>

          {/* Quantity Controls */}
          {!isOutOfStock && (
            <View style={styles.quantityContainer}>
              <View style={styles.quantityControlsWrapper}>
                {/* Decrease Button */}
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    styles.decreaseButton,
                    (isLoading || item.status === "FREE") &&
                      styles.disabledButton,
                  ]}
                  onPress={() => onDecrease(item)}
                  disabled={isLoading || item.status === "FREE"}
                >
                  <MaterialIcons name="remove" size={18} color="#fff" />
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
                    <MaterialIcons name="add" size={18} color="#999" />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      styles.increaseButton,
                      (isLoading ||
                        cartItems[item.itemId] === item.quantity ||
                        item.status === "FREE") &&
                        styles.disabledButton,
                    ]}
                    onPress={() => onIncrease(item)}
                    disabled={
                      isLoading ||
                      cartItems[item.itemId] === item.quantity ||
                      item.status === "FREE"
                    }
                  >
                    <MaterialIcons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Item Total */}
              <View style={styles.totalContainer}>
                <Text style={styles.itemTotal}>
                  ₹{(item.itemPrice * item.cartQuantity).toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/* Delete Button */}
          {!isOutOfStock && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onRemove(item)}
            >
              <MaterialIcons name="delete" size={23} color="#FF0000" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    backgroundColor: "#fff",
    marginHorizontal: 5,
    marginVertical: 8,
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  outOfStockCard: {
    opacity: 0.6,
    backgroundColor: "#f5f5f5",
  },
  limitedStockBadge: {
    position: "absolute",
    top: -5,
    right: 10,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  limitedStockText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  outOfStockContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    alignItems: "center",
    zIndex: 1,
  },
  outOfStockText: {
    color: "#FF0000",
    fontWeight: "bold",
    fontSize: 12,
  },
  removeButton: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  removeText: {
    color: "#fff",
    fontSize: 10,
  },
  noteText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 8,
    textAlign: "center",
  },
  cardContent: {
    flexDirection: "row",
  },
  imageContainer: {
    position: "relative",
    marginRight: 16,
    justifyContent: "center",
    alignSelf: "center",
  },
  itemImage: {
    width: 100,
    height: 120,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignSelf: "center",
  },
  offerBadge: {
    position: "absolute",
    top: -5,
    left: -5,
    backgroundColor: "#FFD700",
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 8,
  },
  offerBadgeText: {
    color: COLORS.services,
    fontSize: 20,
    fontWeight: "bold",
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    marginRight: 8,
  },
  crossedPrice: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  boldPrice: {
    fontWeight: "bold",
    color: "#333",
  },
  discountText: {
    fontSize: 12,
    color: "#FF6B35",
    fontWeight: "500",
    marginBottom: 4,
  },
  itemWeight: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
  },
  // Enhanced Quantity Container Styles
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 4,
  },
  quantityControlsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 25,
    padding: 2,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  decreaseButton: {
    backgroundColor: "#f87171",
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
    shadowOpacity: 0,
  },
  quantityDisplay: {
    minWidth: 50,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
  },
  totalContainer: {
    backgroundColor: "#f1f2f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS?.services || "#4B0082",
  },
  deleteButton: {
    alignSelf: "flex-end",
    padding: 4,
    backgroundColor: "#fff0f0",
    borderRadius: 8,
    marginTop: 4,
  },
  removalLoader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  removingText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#666",
  },
});

export default CartCard;