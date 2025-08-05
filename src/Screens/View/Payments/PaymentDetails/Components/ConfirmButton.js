import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../../../../../../Redux/constants/theme";


export default function ConfirmButton({ loading, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={loading ? null : onPress}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.txt}>Confirm Order</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: COLORS.services, padding: 16, borderRadius: 8, alignItems: "center", marginTop: 20 },
  txt: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});