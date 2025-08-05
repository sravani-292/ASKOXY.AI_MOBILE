import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const SuccessAlert = ({ visible, onClose, amount, code, provider }) => (
  
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.overlay}>
      {visible && <ConfettiCannon count={80} origin={{ x: 200, y: -10 }} fadeOut />}
      <View style={styles.popup}>
        <View style={styles.percentIconBox}>
          <Text style={styles.percentText}>%</Text>
        </View>
        <Text style={styles.title}>Saved ₹{amount} using {provider || "Coupon"}</Text>
        <Text style={styles.codeText}>
          <Text style={styles.highlight}>{code}</Text> Code Applied
        </Text>
        <TouchableOpacity style={styles.gotItBtn} onPress={onClose}>
          <Text style={styles.gotItText}>GOT IT</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  popup: { width: 320, backgroundColor: "#fff", borderRadius: 16, alignItems: "center", padding: 20 },
  percentIconBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#e0f8e8", justifyContent: "center", alignItems: "center", marginBottom: 8 },
  percentText: { fontSize: 28, color: "#34c759", fontWeight: "bold" },
  title: { fontSize: 17, fontWeight: "bold", textAlign: "center", color: "#222", marginVertical: 10 },
  codeText: { color: "#7d7d7d", fontSize: 14, textAlign: "center", marginBottom: 6 },
  highlight: { color: "#34c759", fontWeight: "bold" },
  gotItBtn: { marginTop: 14 },
  gotItText: { color: "#fd3a69", fontWeight: "bold", fontSize: 16, letterSpacing: 1 }
});

export default SuccessAlert;
