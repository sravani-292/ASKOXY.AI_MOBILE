import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { MaterialIcons, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import BVMCoins from '../../Profile/BVMCoins';
const {width,height} = Dimensions.get('window');

const ProductCard = ({ 
  item, 
  navigation, 
  cartItems, 
  loadingItems, 
  removalLoading, 
  handleAdd, 
  handleIncrease, 
  handleDecrease,
  handleGoldItemPress,
  isCategoryTypeGold,
  imageErrors,
  category,
  categoryType,
  dynamicContent
}) => {
  
  // Get appropriate icon for item
  const getItemIcon = (item) => {
    const itemNameLower = item.itemName.toLowerCase();

    if (itemNameLower.includes("rice")) {
      return <MaterialIcons name="rice-bowl" size={20} color="#6b21a8" />;
    } else if (
      itemNameLower.includes("wheat") ||
      itemNameLower.includes("flour")
    ) {
      return <FontAwesome name="leaf" size={18} color="#6b21a8" />;
    } else if (itemNameLower.includes("oil")) {
      return <FontAwesome name="tint" size={18} color="#6b21a8" />;
    } else if (itemNameLower.includes("sugar")) {
      return <FontAwesome name="cube" size={18} color="#6b21a8" />;
    } else if (
      itemNameLower.includes("dal") ||
      itemNameLower.includes("lentil")
    ) {
      return <MaterialIcons name="food-bank" size={20} color="#6b21a8" />;
    } else {
      return <MaterialIcons name="shopping-bag" size={18} color="#6b21a8" />;
    }
  };

  const [modalVisible, setModalVisible] = React.useState(false);
  
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Item Details", { item:item, category:category, categoryType:categoryType,offerId: item.weight })}
      >
        <View style={styles.itemImageContainer}>
          {item.itemMrp > item.itemPrice && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {Math.round(
                  ((item.itemMrp - item.itemPrice) / item.itemMrp) * 100
                )}
                % OFF
              </Text>
            </View>
          )}

          {imageErrors[item.itemId] ? (
            <View style={styles.fallbackImageContainer}>
              <MaterialIcons
                name="image-not-supported"
                size={40}
                color="#aaa"
              />
              <Text style={styles.fallbackImageText}>{item.itemName}</Text>
            </View>
          ) : (
            <Image
              source={{
                uri: item.itemImage || "https://via.placeholder.com/150",
              }}
              style={styles.itemImage}
              resizeMode="contain"
            />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.priceContainer}>
          <Text style={styles.itemPrice}>₹{item.itemPrice}</Text>
          {item.itemMrp > item.itemPrice && (
            <Text style={styles.itemMRP}>₹{item.itemMrp}</Text>
          )}
        </View>

         <View style={styles.priceContainer}>
          <Text style={styles.itemWeight}>
            Weight: {item.weight}{" "}
            {item.weight === 1 ? item.units.replace(/s$/, "") : item.units}
          </Text>
          </View>

      {/* <View style={styles.itemDetailsContainer}> */}
        <View style={styles.itemInfoContainer}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.itemName}
            </Text>
        </View>

        <View style={styles.bmvCoinsContainer}>
              <LinearGradient
                 colors={['#f3e8ff', '#e9d5ff']}
                style={styles.bmvCoinsBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.bmvCoinsText}>You will get  {item.bmvCoins} BMVCOINS</Text>
              
            <TouchableOpacity
              style={styles.cartButton}
              onPress={()=>setModalVisible(true)}
              activeOpacity={0.7}
            >
              <FontAwesome6 name="circle-info" color="#6b21a8" size={20} containerStyle={styles.icon} />
            </TouchableOpacity>
            </LinearGradient>
            </View>
        

        <View style={styles.buttonContainer}>
          {item.quantity === 0 ? (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: "#D3D3D3" }]}
              disabled={true}
            >
              <Text style={styles.addButtonText}>Out of Stock</Text>
            </TouchableOpacity>
          ) : cartItems[item.itemId] ? (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => handleDecrease(item)}
                disabled={
                  loadingItems[item.itemId] || removalLoading[item.itemId]
                }
                style={[
                  styles.quantityButton,
                  {
                    backgroundColor:
                      loadingItems[item.itemId] || removalLoading[item.itemId]
                        ? "#CBD5E0"
                        : "#f87171",
                  },
                ]}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>

              <View style={styles.quantityTextContainer}>
                {loadingItems[item.itemId] || removalLoading[item.itemId] ? (
                  <ActivityIndicator size="small" color="#6b21a8" />
                ) : (
                  <Text style={styles.quantityText}>
                    {cartItems[item.itemId]}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => handleIncrease(item)}
                disabled={
                  loadingItems[item.itemId] ||
                  removalLoading[item.itemId] ||
                  cartItems[item.itemId] >= item.quantity
                }
                style={[
                  styles.quantityButton,
                  loadingItems[item.itemId] ||
                  removalLoading[item.itemId] ||
                  cartItems[item.itemId] >= item.quantity
                    ? {
                        backgroundColor: "#CBD5E0",
                      }
                    : {
                        backgroundColor: "#6b21a8",
                      },
                ]}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => handleAdd(item)}
              disabled={loadingItems[item.itemId]}
              style={styles.addButton}
            >
              {loadingItems[item.itemId] ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>Add to Cart</Text>
              )}
            </TouchableOpacity>
          )}
          {isCategoryTypeGold && (
            <TouchableOpacity onPress={() => handleGoldItemPress(item.itemId)}>
              <Text style={{ textAlign: "center" }}>View Details</Text>
            </TouchableOpacity>
          )}
        </View>
        <BVMCoins modalVisible={modalVisible} onCloseModal={()=>{setModalVisible(false)}} content={dynamicContent}/>
      </View>
    // </View>
  );
};



const styles = StyleSheet.create({
  itemContainer: {
    width: width * 0.31,
    backgroundColor: "#fff",
    borderRadius: 12,
    minHeight: 340, 
    marginTop: 8,
    marginBottom: 8,
    marginRight: 8,
    padding: 8, 
    paddingBottom: 12, 
  },
  itemImageContainer: {
    width: "100%",
    height: 120, 
    position: "relative",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: 8, 
  },
  discountBadge: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "#6b21a8",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
  },
  itemImage: {
    width: "90%",
    height: "90%",
  },
  fallbackImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  fallbackImageText: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  itemInfoContainer: {
    marginBottom: 8,
    minHeight: 36, 
  },
  itemName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#1f2937",
    lineHeight: 16,
    textAlign: "left",
  },
  itemWeight: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 6,
    lineHeight: 14,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    minHeight: 20,
    width: "100%",
    flexWrap: "wrap", 
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6b21a8",
  },
  itemMRP: {
    fontSize: 12,
    color: "#bf4343ff",
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
  bmvCoinsContainer: {
    marginBottom: 8, 
    width: "100%", 
  },
  bmvCoinsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
  },
  bmvCoinsText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6b21a8',
    opacity: 0.9,
    flex: 1, 
    marginRight: 4,
    lineHeight: 12,
  },
  buttonContainer: {
    minHeight: 36, 
    justifyContent: "center",
    width: "100%",
    marginTop: 'auto', 
  },
  addButton: {
    backgroundColor: "#6b21a8",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 36,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 32,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  cartButton: {
    padding: 4,
  },
  icon: {
    marginLeft: 2,
  },
});

export default ProductCard;