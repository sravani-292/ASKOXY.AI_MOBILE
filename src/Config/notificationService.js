import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { supabase } from './supabaseClient';
import { generateUUID } from '../../until/generateUUID';

export async function registerAndSaveTokenToSupabase(userId = null) {
  if (!Device.isDevice) {
    alert('Use physical device for push notifications');
    return;
  }

  // 1. Get or generate device ID
  let deviceId = await AsyncStorage.getItem('anonDeviceId');
  if (!deviceId) {
    deviceId = generateUUID();
    await AsyncStorage.setItem('anonDeviceId', deviceId);
  }

  // 2. Ask permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (finalStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
   Alert.alert(
    "Enable Notifications",
    "To get updates on offers and order status, please enable notifications from your app settings.",
    [
      {
        text: "Not Now",
        style: "cancel"
      },
      {
        text: "Open Settings",
        onPress: () => Linking.openSettings()
      }
    ]
  );
    return
  }

  // 3. Get push token
  const { data: pushToken } = await Notifications.getExpoPushTokenAsync();
   // 4. Get FCM Token (only works with EAS Build + FCM setup)
  let fcmToken = null;
  if (Platform.OS === 'android') {
    try {
      const { data } = await Notifications.getDevicePushTokenAsync({ provider: 'fcm' });
      fcmToken = data;
      console.log('FCM Token:', fcmToken);
    } catch (err) {
      console.warn('⚠️ Could not get FCM token:', err.message);
    }
  }
  const lastToken = await AsyncStorage.getItem('lastSupabaseToken');

  if (pushToken === lastToken) {

    console.log('⚠️ Push token unchanged, skipping update', pushToken ,"And lastToken", lastToken);
  } else {
    // 4. Upsert token by device ID
    const { error: upsertError } = await supabase
      .from('push_tokens')
      .upsert(
        [
          {
            user_id: userId || null,
            device_id: deviceId,
            token: pushToken,
            is_anonymous: !userId,
            timestamp: new Date().toISOString(),
            fcm_token: fcmToken,
          },
        ],
        {
          onConflict: 'device_id',
        }
      );

    if (upsertError) {
      console.error('❌ Failed to upsert token:', upsertError.message);
    } else {
      await AsyncStorage.setItem('lastSupabaseToken', pushToken);
      console.log('✅ Push token saved to Supabase');
    }
  }

  // 5. After login — update user_id if missing
  if (userId) {
    const { data: existing, error: fetchError } = await supabase
      .from('push_tokens')
      .select('user_id')
      .eq('device_id', deviceId)
      .single();

    if (!fetchError && existing && !existing.user_id) {
      const { error: updateError } = await supabase
        .from('push_tokens')
        .update({ user_id: userId, is_anonymous: false })
        .eq('device_id', deviceId);

      if (updateError) {
        console.error('❌ Failed to update userId after login:', updateError.message);
      } else {
        console.log('✅ Updated token row with userId');
      }
    }
  }

  // 6. Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}
