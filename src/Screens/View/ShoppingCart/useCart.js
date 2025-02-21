import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Alert } from 'react-native';
import BASE_URL, { userStage } from "../../../../Config";

const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grandTotal, setGrandTotal] = useState(null);
  const [error, setError] = useState(null);
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;

 



  // const getItems =()=>{
  //   const data = {
  //     method:'get',
  //     url:userStage=="test1"?BASE_URL + "erice-service/user/showItemsForCustomrs":BASE_URL + "product-service/getItemsList",{
  //       headers:{
  //         Authorization:`Bearer ${token}`
  //       }
  //     }
  //   }
  // }

  const fetchCartItems = useCallback(async () => {
    if (!customerId || !token) return;

    setLoading(true);
    try {
      const response = await axios.get(
        userStage === "test1"
          ? BASE_URL + `erice-service/cart/customersCartItems?customerId=${customerId}`
          : BASE_URL + `cart-service/cart/customersCartItems?customerId=${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.customerCartResponseList);
      console.log("use cart",response.data.customerCartResponseList);
      
      setLoading(false);
    } catch (error) {
      setError("Failed to load cart data");
      setLoading(false);
    }
  }, [customerId, token]);

// function to handle add to cart
  const handleAddToCart = async (itemID) => {
    if (!userData) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    }

    const data = { customerId, itemId: itemID };
    setLoading(true);

    try {
      const response = await axios.post(
        userStage === "test1"
          ? BASE_URL + "erice-service/cart/add_Items_ToCart"
          : BASE_URL + "cart-service/cart/add_Items_ToCart",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.errorMessage === "Item added to cart successfully") {
        Alert.alert("Success", "Item added to cart successfully");
        fetchCartItems();
        return response.data;
      } else {
        Alert.alert("Alert", response.data.errorMessage);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  const increaseCartItem = async (item) => {
    setLoading(true);
    try {
      await axios.patch(
        BASE_URL === "test1"
          ? BASE_URL + `erice-service/cart/incrementCartData`
          : BASE_URL + `cart-service/cart/incrementCartData`,
        {
          customerId,
          itemId: item.itemId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCartItems();
      return response.data
      setLoading(false);
    } catch (error) {
      setError("Failed to update cart item");
      setLoading(false);
    }
  };

  const decreaseCartItem = async (item) => {
    setLoading(true);
    try {
      if (item.cartQuantity > 1) {
        await axios.patch(
          BASE_URL === "test1"
            ? BASE_URL + `erice-service/cart/decrementCartData`
            : BASE_URL + "cart-service/cart/decrementCartData",
          {
            customerId,
            itemId: item.itemId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchCartItems();
        return response.data;
      } else {
        Alert.alert(
          "Remove Item",
          "Cart quantity is at the minimum. Do you want to remove this item from the cart?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Yes, Remove",
              onPress: () => removeCartItem(item),
            },
          ]
        );
      }
      setLoading(false);
    } catch (error) {
      setError("Failed to decrease cart item");
      setLoading(false);
    }
  };

  const removeCartItem = async (item) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: async () => {
            try {
              await axios.delete(
                BASE_URL === "test1"
                  ? BASE_URL + "erice-service/cart/remove"
                  : BASE_URL + "cart-service/cart/remove",
                {
                  data: { id: item.cartId },
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              fetchCartItems();
            } catch (error) {
              setError("Failed to remove cart item");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (customerId && token) {
      fetchCartItems();
    }
  }, [customerId, token]);

  if (!customerId || !token) {
    console.warn("User is not logged in.");
    return {
      cartItems: cartItems||[],
      loading: false,
      error: "User not logged in",
      handleAddToCart: () => {},
      increaseCartItem: () => {},
      decreaseCartItem: () => {},
      removeCartItem: () => {},
      fetchCartItems: () => {},
    };
  }

  return {
    cartItems:cartItems||[],
    loading,
    error,
    handleAddToCart,
    increaseCartItem,
    decreaseCartItem,
    removeCartItem,
    fetchCartItems,
  };
  
};

export default useCart;
