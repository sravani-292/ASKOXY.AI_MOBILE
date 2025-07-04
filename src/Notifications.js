import { useState, useEffect } from 'react';
import { Text, View, Button, Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Set how notifications are handled when received in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Function to send notification to your own device (for testing)
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Hello 👋',
    body: 'This is a test notification!',
    data: { screen: 'Home' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

// Function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission required', 'Push notification permission not granted!');
      return;
    }

    try {
      // Works for both Android (FCM) and iOS (APNs via Expo)
      const { data } = await Notifications.getExpoPushTokenAsync();

      console.log('Expo Push Token:', data);
      token = data;
    } catch (error) {
      console.error('Failed to get push token:', error);
    }
    try{
        const { data: fcmToken } = await Notifications.getDevicePushTokenAsync();
      console.log('FCM Token:', fcmToken); // Use this in Firebase Console
    }
    catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  } else {
    Alert.alert('Physical device required', 'Must use physical device for Push Notifications');
  }

  return token;
}

// Main App Component
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState();
  const [notificationListener, setNotificationListener] = useState();
  const [responseListener, setResponseListener] = useState();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) setExpoPushToken(token);
    });

    const notifListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const respListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('User tapped notification:', response);
    });

    setNotificationListener(notifListener);
    setResponseListener(respListener);

    return () => {
      if (notificationListener) notificationListener.remove();
      if (responseListener) responseListener.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text style={{ fontWeight: 'bold' }}>Expo Push Token:</Text>
      <Text selectable style={{ marginHorizontal: 20 }}>{expoPushToken}</Text>

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>Last Notification:</Text>
        <Text>Title: {notification?.request.content.title}</Text>
        <Text>Body: {notification?.request.content.body}</Text>
        <Text>Data: {JSON.stringify(notification?.request.content.data)}</Text>
      </View>

      <Button
        title="Send Test Notification"
        onPress={async () => {
          if (expoPushToken) {
            await sendPushNotification(expoPushToken);
          } else {
            Alert.alert('Token missing', 'No Expo Push Token found.');
          }
        }}
      />
    </View>
  );
}
