import { StyleSheet, Text, View ,TextInput,TouchableOpacity,FlatList,ScrollView,Image,Dimensions,Alert,Pressable,  ActivityIndicator,SafeAreaView,BackHandler
} from 'react-native'
import React,{useEffect,useState,useCallback,useLayoutEffect} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import BASE_URL,{userStage} from "../../../../Config";
import useCart from './useCart';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigationState } from '@react-navigation/native';
const{width,height}=Dimensions.get('window');
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from '../../../../Redux/constants/theme';
import LottieView from 'lottie-react-native';

const UserDashboard = () => {
  const[loading,setLoading]=useState(false);
  const[categories,setCategories]=useState([]);
  const[filteredItems,setFilteredItems]=useState([]);
  const[selectedCategory,setSelectedCategory]=useState("All Categories");
  const navigation = useNavigation();
  const[loadingItems, setLoadingItems] = useState({});
  const[cartCount, setCartCount] = useState();
  const[cartItems,setCartItems]=useState({});
  const[cartData,setCartData]=useState([]);
  const[loader,setLoader]=useState(false); 
  const[seletedState,setSelectedState]=useState(null);
    
const currentScreen = useNavigationState(
    (state) => state.routes[state.index]?.name
  );

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
       
          Alert.alert(
            'Exit App',
            'Are you sure you want to exit?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'OK', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false }
          )
  
        return true;
      };
  
      // Add BackHandler event listener
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  
      // Cleanup
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [currentScreen])
  )

   const handleAdd = async (item) => {
    console.log("handle add",{item});
     setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: true }));
      await handleAddToCart(item);
      setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: false }));
    };
  
    const handleIncrease = async (item) => {
      setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: true }));
      await incrementQuantity(item);
      setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: false }));
    };
  
    const handleDecrease = async (item) => {
      setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: true }));
      await decrementQuantity(item);
      setLoadingItems((prevState) => ({ ...prevState, [item.itemID]: false }));
    };
    const userData = useSelector((state) => state.counter);
  
    useFocusEffect(
      useCallback(() => {
        if (userData) {
          fetchCartItems();
        }
      }, [])
    );
  
    
    const token = userData?.accessToken;
    const customerId = userData?.userId;
  
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          userStage == "test1"
            ? BASE_URL +
                `erice-service/cart/customersCartItems?customerId=${customerId}`
            : BASE_URL +
                `cart-service/cart/customersCartItems?customerId=${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("cart data updated response", response.data);
        setLoading(false);
       const cartData = response.data.customerCartResponseList;
    if(cartData){
        const cartItemsMap = cartData.reduce((acc, item) => {
          if (!item.itemId || !item.cartQuantity) {
            console.error("Missing itemId or cartQuantity in item:", item);
            return acc;
          }
          acc[item.itemId] = item.cartQuantity;
          return acc;
        }, {});
  
        console.log({cartItemsMap});
        
  
        setCartItems(cartItemsMap);
        setCartCount(cartData.length);
        setCartData(response.data.customerCartResponseList);
      }else{
        setCartItems({})
        setCartCount(0)
        setCartData(response.data.customerCartResponseList)
      }
      } catch (error) {
        setError(error.response);
      }
    };
  
 
  
const UpdateCartCount = (newCount) => setCartCount(newCount);
    const handleAddToCart = async (item) => {
      console.log("add to cart", item.itemID);
  
      if (!userData) {
        Alert.alert("Alert", "Please login to continue", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
          { text: "Cancel" },
        ]);
        return;
      }
      const data = { customerId: customerId, itemId: item.itemID };
      console.log({ data });
  
      try {
        const response = await axios.post(
          userStage == "test1"
            ? BASE_URL + "erice-service/cart/add_Items_ToCart"
            : BASE_URL + "cart-service/cart/add_Items_ToCart",
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (response.data.errorMessage == "Item added to cart successfully") {
          Alert.alert("Success", "Item added to cart successfully");
  
          fetchCartItems();
        } else {
          setLoader(false);
          Alert.alert("Alert", response.data.errorMessage);
        }
      } catch (error) {
        setLoader(false);
      }
    };
  
    const incrementQuantity = async (item) => {
      console.log("incremented cart data", item);
  
      const data = {
        customerId: customerId,
        itemId: item.itemID,
      };
      try {
        const response = await axios.patch(
          userStage == "test1"
            ? BASE_URL + "erice-service/cart/incrementCartData"
            : BASE_URL + "cart-service/cart/incrementCartData",
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        await fetchCartItems();
      } catch (error) {}
    };
  
    const decrementQuantity = async (item) => {
  
    const newQuantity = cartItems[item.itemID];
     const cartItem = cartData.find(
        (cartData) => cartData.itemId === item.itemID
      );
      console.log("cart item",cartItem);
      
      if (newQuantity === 1) {
        try {
          const response = await axios.delete(
            userStage == "test1"
              ? BASE_URL + "erice-service/cart/remove"
              : BASE_URL + "cart-service/cart/remove",
            {
              data: {
                id: cartItem.cartId,
              },
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          fetchCartItems();
          Alert.alert("Item removed", "Item removed from the cart");
          
        } catch (error) {
          console.log(error.response);
        }
      } else {
        const data = {
          customerId: customerId,
          itemId: item.itemID,
        };
        try {
          await axios.patch(
            userStage == "test1"
              ? BASE_URL + "erice-service/cart/decrementCartData"
              : BASE_URL + "cart-service/cart/decrementCartData",
            data,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          fetchCartItems();
        } catch (error) {
          console.log("Error decrementing item quantity:", error.response);
        }
      }
    };
  


  useEffect(()=>{
    getAllCategories();
  },[]);

   const getAllCategories = () => {
    setLoading(true);
    axios
      .get(userStage=="test1"?BASE_URL + "erice-service/user/showItemsForCustomrs":BASE_URL +"product-service/getItemsList", {
        // headers: { Authorization: `Bearer ${token}` },
       })
      .then((response) => {
        console.log("rice main page",response.data);
        setCategories(response.data);
        setSelectedCategory("All Categories");
        const groupedArray = response.data.map(category=>category.zakyaResponseList);
        const allItems = groupedArray.flat();
        setFilteredItems(allItems); 
        setTimeout(() => {
        setLoading(false);
        }, 3000);
      })
      .catch((error) => {
        console.log(error.response);
        setLoading(false);
      });
  };
 

    const filterByCategory = (category) => {
      console.log(category);
      setSelectedCategory(category);
      if (category === "All Categories") {
        const groupedArray = categories.map(category=>category.zakyaResponseList);
        const allItems = groupedArray.flat();
          setFilteredItems(allItems);      
        } else {
          const filtered = categories.filter(cat => cat.categoryName === category)
              .flatMap(cat => cat.zakyaResponseList);
          setFilteredItems(filtered);
      }
  };
  
   if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <LottieView 
            source={require("../../../../assets/AnimationLoading.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
      );
    }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" ,paddingTop:height/15}}>
    <View style={{ padding:10}}>
        {/* Search Bar */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center",width:width*0.8,borderWidth:2,borderColor:"#000" }}>
        {/* Search Input */}
        <View style={{ flexDirection: "row",alignItems:"center",justifyContent:"space-between"}}> 
          <TextInput
          placeholder="Search for items..."
          style={{
            padding: 10,
            marginLeft: 15,
            borderWidth: 1,
            borderRadius: 20,
            marginBottom: 10,
            width: width * 0.8,
          }}
          />
          <Icon name="search" size={20} color="gray" style={{ marginRight:20}} />
          </View>

        {/* Cart Icon (Pressable for Navigation) */}
        {userData !=null && (
        <Pressable onPress={() => navigation.navigate("Home",{screen:"My Cart"})}>
          <View style={styles.cartIconContainer}>
            <Icon name="cart-outline" size={35} color="#000" />
            
            {/* Cart Count Badge */}
            {cartCount != 0 &&(
              <View
                style={{
                  position: "absolute",
                  marginBottom:20,
                  right: -4,
                  top: -5,
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                }}
              >
                <Text
                  style={{
                    color: "#FFF",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {cartCount}
                </Text>
              </View>
             )} 
          </View>
      </Pressable>
        )}
      </View>
       
          
        {/* Category Buttons */}
        <ScrollView horizontal>
          <View style={{alignSelf:"center",alignItems:"center",alignSelf:"center"}}>
            <View style={{ flexDirection: "row", marginBottom: 10, height: height / 12, alignSelf: "center", marginTop: 15 ,alignItems:"center"}}>
                <TouchableOpacity onPress={() => filterByCategory("All Categories")}>
                    <Text style={[styles.firstrow, { backgroundColor: selectedCategory === "All Categories" ? COLORS.title : "lightgray" }]}>
                        All Categories
                    </Text>
                </TouchableOpacity>
                {categories.map((category, index) => (
                    <TouchableOpacity key={index} onPress={() => filterByCategory(category.categoryName)}>
                        <Text style={[
                            styles.firstrow,
                            { backgroundColor: selectedCategory === category.categoryName ? "gold" : "lightgray" }
                        ]}>
                            {category.categoryName}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            </View>
        </ScrollView>

        {/* Items List */}
        <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.itemID.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
                <View style={styles.itemCard}>
                 
                    <View style={styles.imageContainer} >
                    <TouchableOpacity onPress={() => navigation.navigate("Item Details", { item })}>
                        <Image source={{ uri: item.imageType }} style={styles.itemImage} />
                        </TouchableOpacity>
                    </View>
                   

                    {/* Product Details */}
                    <View style={{height:height/20}}>
                    <Text style={styles.itemName}>{item.itemName}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.newPrice}>₹{item.itemPrice}</Text>
                        <Text style={styles.oldPrice}>₹{item.itemMrp}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.itemWeight}>{item.itemWeight} {item.weightUnit} </Text>

                        {/* Add Button */}
                        {cartItems && cartItems[item.itemID] > 0 ? (
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => handleDecrease(item)}
                                    disabled={loadingItems[item.itemID]}
                                >
                                    <Text style={styles.quantityButtonText}>-</Text>
                                </TouchableOpacity>
                                
                                {loadingItems[item.itemID] ? (
                                    <ActivityIndicator size="small" color="#000" style={styles.loader} />
                                ) : (
                                    <Text style={styles.quantityText}>{cartItems[item.itemID]}</Text>
                                )}

                                {/* {route.params.details.categoryName !== "Sample Rice" ? (
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => handleIncrease(item)}
                                        disabled={loadingItems[item.itemID]}
                                    >
                                        <Text style={styles.quantityButtonText}>+</Text>
                                    </TouchableOpacity>
                                ) : ( */}
                                    <TouchableOpacity
                                        style={styles.quantityButton1}
                                        onPress={() => handleIncrease(item)}
                                        disabled={loadingItems[item.itemID]}
                                    >
                                        <Text style={styles.quantityButtonText}>+</Text>
                                    </TouchableOpacity>
                                {/* )} */}
                            </View>
                        ) : (
                            <View>
                                {!loader ? (
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={() => handleAdd(item)}
                                    >
                                        <Text style={styles.addText}>
                                            {loadingItems[item.itemID] ? "Adding..." : "Add to Cart"}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.addButton}>
                                        <ActivityIndicator size="small" color="white" />
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            )}
        />
    </View>
    
    </SafeAreaView>
);

}

export default UserDashboard;
const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 15,
      backgroundColor:COLORS.backgroundcolour,
  },
  searchBar: {
      padding: 12,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      backgroundColor: "#fff",
      marginBottom: 15,
  },
 

row: {
    justifyContent: "space-between",
    marginBottom: 10,
},
itemCard: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
},
imageContainer: {
    position: "relative",
    alignItems: "center",
},
itemImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
},

labelText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
},
itemName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
},
priceContainer: {
  // width:width/2,
  marginTop:20,
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "center",
},
newPrice: {
 fontSize: 14,
  fontWeight: "bold",
  color:COLORS.primary,
  marginLeft:-30,
},
oldPrice: {
marginLeft:50,
  fontSize: 12,
  color: "#757575",
  textDecorationLine: "line-through",
},

itemWeight: {
  marginLeft:10,
    fontSize: 12,
    color: "#757575",
},
addButton: {
    backgroundColor:COLORS.title2,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginLeft:5,
    marginRight:5,
    borderRadius: 5,
    marginLeft: 40,
    width:width/5,
    paddingLeft:5,
    paddingRight:5,
},
addText: {
    color: "#fff",
    fontSize: 14,
    // fontWeight: "bold",
    alignSelf: "center",
    alignItems: "center",
},
firstrow:{
 padding: 15,
  marginLeft: 5,
  borderRadius:20,
  width:width*0.4,
  alignSelf:"center",
  allItems:"center",
},

 quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft:30
  },
  quantityButton: {
    backgroundColor: "#f6ebfb",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  quantityButton1: {
    backgroundColor: "#f6ebfb",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  quantityButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 15,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: "#3e2723",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
  },
});

