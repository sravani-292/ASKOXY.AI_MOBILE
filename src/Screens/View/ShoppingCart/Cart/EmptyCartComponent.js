import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
  Dimensions,
  
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import { COLORS } from "../../../../../Redux/constants/theme";

const {width,height} =  Dimensions.get('window');
const EmptyCartComponent = () => {
     const navigation = useNavigation();
    return (
      <View style={styles.emptyCartContainer}>
        <View style={styles.emptyCartView}>
          <LottieView
            source={require("../../../../../assets/emptyLoading.json")}
            autoPlay
            loop
            style={styles.emptyCartImage}
          />
        </View>
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopNowButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.shopNowButtonText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
    );
  };
  export default EmptyCartComponent;


  const styles = StyleSheet.create({
    emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyCartView: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  emptyCartImage: {
    width: "100%",
    height: "100%",
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  })