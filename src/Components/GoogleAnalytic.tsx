import { Platform } from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GA4_API_SECRET } from '@env'; // Make sure you have this in your .env file
import uuid from 'react-native-uuid';

class GoogleAnalyticsService {
  private static readonly MEASUREMENT_ID: string = 'G-7F5MXCYZ7W'; // Replace with your ID
  private static readonly API_SECRET: string = GA4_API_SECRET;

  static async sendEvent(eventName: string, eventParams: Record<string, any> = {}): Promise<boolean> {
    try {
      const clientId = await this.getOrCreateClientId();

      const baseParams: Record<string, any> = {
        client_id: clientId,
        events: [
          {
            name: eventName,
            params: {
              ...eventParams,
              platform: Platform.OS,
              device_type: await Device.getDeviceTypeAsync(),
              device_name: Device.deviceName,
              timestamp: Date.now(),
            },
          },
        ],
      };

      const url = `https://www.google-analytics.com/mp/collect?measurement_id=${this.MEASUREMENT_ID}&api_secret=${this.API_SECRET}`;

      let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baseParams),
      });

      // Retry once if failed
      if (!response.ok) {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(baseParams),
        });
      }

      return response.ok;
    } catch (error) {
      console.error('Google Analytics tracking error:', error);
      return false;
    }
  }

  static async getOrCreateClientId(): Promise<string> {
    try {
      let clientId = await AsyncStorage.getItem('ga_client_id');

      if (!clientId) {
        clientId = uuid.v4().toString(); // Generate a UUID
        await AsyncStorage.setItem('ga_client_id', clientId);
      }

      return clientId;
    } catch (error) {
      return uuid.v4().toString(); // Fallback UUID
    }
  }

  // ✅ Screen View Tracking
  static async screenView(screenName: string): Promise<boolean> {
    return this.sendEvent('screen_view', { screen_name: screenName });
  }

  // ✅ User Login
  static async login(method: string): Promise<boolean> {
    return this.sendEvent('login', { method });
  }

  // ✅ User Signup
  static async signup(method: string): Promise<boolean> {
    return this.sendEvent('sign_up', { method });
  }

  // ✅ View Product
  static async viewItem(productId: string, productName: string, price: number): Promise<boolean> {
    return this.sendEvent('view_item', {
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
        },
      ],
    });
  }

  // ✅ Add to Cart
  static async addToCart(productId: string, productName: string, price: number, quantity: number): Promise<boolean> {
    return this.sendEvent('add_to_cart', {
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
          quantity: quantity,
        },
      ],
    });
  }

  // ✅ Begin Checkout
  static async beginCheckout(
    cartItems: Array<{ itemId: string; itemName: string; itemPrice: number; cartItemQuantity: number }>,
    totalValue: number,
  ): Promise<boolean> {
    return this.sendEvent('begin_checkout', {
      value: totalValue,
      currency: 'INR',
      items: cartItems.map(item => ({
        item_id: item.itemId,
        item_name: item.itemName,
        price: item.itemPrice,
        quantity: item.cartItemQuantity,
      })),
    });
  }
  
// 2387
// 9377
// 16ef
  // ✅ Purchase Completed
  static async purchase(
    transactionId: string,
    cartItems: Array<{ itemId: string; itemName: string; itemPrice: number; cartItemQuantity: number }>,
    totalValue: number,
    paymentMethod: string, // 'COD' or 'ONLINE'
  ): Promise<boolean> {
    return this.sendEvent('purchase', {
      transaction_id: transactionId,
      value: totalValue,
      currency: 'INR',
      payment_type: paymentMethod,
      items: cartItems.map(item => ({
        item_id: item.itemId,
        item_name: item.itemName,
        price: item.itemPrice,
        quantity: item.cartItemQuantity,
      })),
    });
  }

  // ✅ Refund
  static async refund(transactionId: string, refundValue: number): Promise<boolean> {
    return this.sendEvent('refund', {
      transaction_id: transactionId,
      value: refundValue,
      currency: 'INR',
    });
  }
}

export default GoogleAnalyticsService;
