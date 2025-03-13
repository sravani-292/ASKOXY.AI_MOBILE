import React, { useEffect, useState } from "react";
import { View, Text, Button, Linking, ActivityIndicator } from "react-native";
import VersionCheck from "react-native-version-check-expo";

const UpdateChecker = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [updateNeeded, setUpdateNeeded] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");

  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const latestVersion = await VersionCheck.getLatestVersion();
        const currentVersion = VersionCheck.getCurrentVersion();
        const isNeeded = VersionCheck.needUpdate({ currentVersion, latestVersion });

        if (isNeeded?.isNeeded) {
          setUpdateNeeded(true);
          setStoreUrl(await VersionCheck.getStoreUrl());
        }
      } catch (error) {
        console.log("Error checking for update:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkForUpdate();
  }, []);

  const handleUpdatePress = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  if (isChecking) {
    return <ActivityIndicator size="large" />;
  }

  if (!updateNeeded) {
    return null; // No update required
  }

  return (
    <>
    {updateNeeded && (
    <View style={{ padding: 10 }}>
      <Text>A new update is available!</Text>
      <Button title="Update Now" onPress={handleUpdatePress} />
    </View>
    )}
    </>
  );
};

export default UpdateChecker;
