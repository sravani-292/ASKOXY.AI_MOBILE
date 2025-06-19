import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccessToken } from "../../Redux/action/index";

const Logout = () => {
     const userData = useSelector((state) => state.counter);
      const navigation = useNavigation();
     const handleLogout = () => {
    Alert.alert(
      " Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userData");
              navigation.navigate("Login");
            } catch (error) {
              console.error("Error clearing user data:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
    return (
    <View style={styles.headerRightContainer}>
              {userData ? (
                <TouchableOpacity
                  onPress={handleLogout}
                  style={styles.authButton}
                >
                  <MaterialCommunityIcons
                    name="account-arrow-right-outline"
                    size={22}
                    color="#FFFFFF"
                  />
                  <Text style={styles.authButtonText}>Logout</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  style={styles.authButton}
                >
                  <MaterialCommunityIcons
                    name="account-arrow-left-outline"
                    size={22}
                    color="#FFFFFF"
                  />
                  <Text style={styles.authButtonText}>Login</Text>
                </TouchableOpacity>
              )}
            </View>
    )
}

export default Logout

const styles = StyleSheet.create({
    headerRightContainer: {
        // flexDirection: "row",
        alignItems: "flex-end",
        marginRight: 25,
    },
    authButton: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "#007BFF",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignItems:"flex-end",

    },
    authButtonText: {
        color: "#FFFFFF",
        marginLeft: 5,
        fontSize: 16,
    },
})