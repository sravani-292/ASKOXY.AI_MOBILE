import { Platform } from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

class GoogleAnalyticsService {
   // Using static readonly for constants
   private static readonly MEASUREMENT_ID: string = 'G-7F5MXCYZ7W';
   private static readonly API_SECRET: string = process.env.GOOGLE_ANALYTICS_API_SECRET;

   static async sendEvent(eventName: string, eventParams: Record<string, any> = {}): Promise<boolean> {
     try {
       // Generate or retrieve client ID
       const clientId = await this.getOrCreateClientId();

       // Base event data with type annotation
       const baseParams: Record<string, any> = {
         client_id: clientId,
         events: [{
           name: eventName,
           params: {
             ...eventParams,
             platform: Platform.OS,
             device_type: await Device.getDeviceTypeAsync(),
             device_name: Device.deviceName,
            //  app_version: Device.appVersion,
             timestamp: Date.now()
           }
         }]
       };

       // Send event to Google Analytics
       const response = await fetch(
         `https://www.google-analytics.com/mp/collect?measurement_id=${GoogleAnalyticsService.MEASUREMENT_ID}&api_secret=${GoogleAnalyticsService.API_SECRET}`,
         {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(baseParams)
         }
       );

       return response.ok;
     } catch (error) {
       console.error('Google Analytics tracking error:', error);
       return false;
     }
   }

   static async getOrCreateClientId(): Promise<string> {
     try {
       // In a real app, you'd use secure storage
       let clientId = await AsyncStorage.getItem('ga_client_id');

       if (!clientId) {
         // Generate a new client ID if not exists
         clientId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
         await AsyncStorage.setItem('ga_client_id', clientId);
       }

       return clientId;
     } catch (error) {
       // Fallback client ID generation
       return `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
     }
   }

   // Convenience methods for common events
   static async screenView(screenName: string): Promise<boolean> {
     return this.sendEvent('screen_view', { screen_name: screenName });
   }

   static async login(method: string): Promise<boolean> {
     return this.sendEvent('login', { method });
   }

   static async signup(method: string): Promise<boolean> {
     return this.sendEvent('sign_up', { method });
   }
}

export default GoogleAnalyticsService;