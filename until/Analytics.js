import * as Analytics from "expo-firebase-analytics";

// Function to track events
export const trackEvent = async (eventName, params = {}) => {
  await Analytics.logEvent(eventName, params);
};

// Function to track screen views
export const trackScreen = async (screenName) => {
  await Analytics.setCurrentScreen(screenName);
};
