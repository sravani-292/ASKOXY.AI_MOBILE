import axios from 'axios';
import BASE_URL from '../../../../Config';

class CartService {
  static async addToCart(customerId, token, itemId, quantity = 1) {
    try {
      const response = await axios.post(
        `${BASE_URL}/cart-service/cart/addItem`, 
        {
          customerId,
          itemId,
          cartQuantity: quantity
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Add to Cart Error:', error.response?.data || error.message);
      throw error;
    }
  }

  static async updateCartItemQuantity(customerId, token, itemId, quantity) {
    try {
      const response = await axios.put(
        `${BASE_URL}/cart-service/cart/updateItemQuantity`,
        {
          customerId,
          itemId,
          cartQuantity: quantity
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Update Cart Quantity Error:', error.response?.data || error.message);
      throw error;
    }
  }

  static async removeFromCart(customerId, token, itemId) {
    try {
      const response = await axios.delete(
        `${BASE_URL}/cart-service/cart/removeItem`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: {
            customerId,
            itemId
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Remove from Cart Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default CartService;