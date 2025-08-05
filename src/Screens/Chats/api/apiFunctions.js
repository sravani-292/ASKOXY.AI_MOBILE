// apiFunctions.js
import axios from 'axios';

const BASE_URL = 'https://meta.oxyloans.com/api';

export async function get_user_cart({ customerId }) {
  const res = await axios.get(`${BASE_URL}/cart-service/cart/userCartInfo?customerId=${customerId}`);
  return res.data;
}

export async function get_user_profile({ userId }) {
  const res = await axios.get(`${BASE_URL}/users/${userId}`);
  return res.data;
}

export async function get_trending_products() {
 try {
    const response = await fetch('https://meta.oxyloans.com/api/product-service/showGroupItemsForCustomrs');
    const data = await response.json();

    const items = [];

    for (const category of data) {
      for (const cat of category.categories) {
        for (const item of cat.itemsResponseDtoList) {
          items.push({
            id: item.itemId,
            name: item.itemName,
            price: item.itemPrice,
            mrp: item.itemMrp,
            image: item.itemImage,
            description: item.itemDescription,
            saveAmount: item.saveAmount,
            savePercentage: item.savePercentage,
            weight: item.weight,
            units: item.units,
            quantity: item.quantity,
            category: cat.categoryName,
          });
        }
      }
    }    
    return items;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function get_active_offers() {
  const res = await axios.get(`${BASE_URL}/product-service/getComboActiveInfo`);
  return res.data;
}

export async function add_to_cart({ customerId, itemId, quantity }) {
  const res = await axios.post(`${BASE_URL}/cart-service/cart/addAndIncrementCart`, {
    customerId,
    itemId,
    quantity
  });
  return res.data;
}

export async function remove_from_cart({ customerId, itemId }) {
  const res = await axios.post(`${BASE_URL}/cart-service/cart/remove`, {
    customerId,
    itemId
  });
  return res.data;
}

// ➕ Add more as needed...
