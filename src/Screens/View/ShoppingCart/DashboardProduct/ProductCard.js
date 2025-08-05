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
    width:width*0.31,
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 340,
    marginTop:8,
    marginBottom:8,
    marginRight:8,
  },
  itemImageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    alignSelf:"center",
  },
  discountBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#6b21a8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    zIndex: 1,
  },
  discountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  
  },
  fallbackImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  fallbackImageText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  itemDetailsContainer: {
    paddingBottom: 15,
    paddingTop:8,
    paddingRight:8,
    flex: 1,
    height: 200,
    justifyContent: "flex-start",
    marginBottom:10
  },
  itemInfoContainer: {
    flex:1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: "400",
    // color: "#1f2937",
    // marginLeft: 6,
    flex: 1,
    lineHeight: 18,
    flexWrap:"wrap",
  },
  itemWeight: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 5,
    // marginLeft: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    height: 26,
    width: "100%",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6b21a8",
  },
  itemMRP: {
    fontSize: 14,
    color: "#bf4343ff",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  buttonContainer: {
    height: 30,
    marginTop: -35,
    justifyContent: "center",
    width: "80%",
    // position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  addButton: {
    marginLeft:-20,
    backgroundColor: "#6b21a8",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginTop:2
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  quantityContainer: {
    marginTop:0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 30,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
   bmvCoinsBadge:{
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    // zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-between",
    marginBottom:15
  },
  bmvCoinsText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b21a8',
    opacity: 0.9,
  },
  bmvCoinsContainer:{
    position:"relative",
    top:-40,
    width:width*0.26,
    marginBottom:10
  }
});

export default ProductCard;