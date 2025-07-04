// components/Header.js
import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles/HeaderStyles";

const Header = ({ userData, handleLogout }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <Image
        source={require("../../../../assets/Images/logo2.png")}
        style={styles.logo}
      />
      <View style={styles.headerRightContainer}>
        {userData ? (
          <TouchableOpacity onPress={handleLogout} style={styles.authButton}>
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
    </View>
  );
};

export default Header;
