import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../../../../Redux/constants/theme";
import SuccessAlert from "./CoupenSuccessAlert";
export default function ApplyCoupon({
  couponCode,
  setCouponCode,
  coupenApplied,
  onApply,
  onRemove,
  appliedCouponSuccessMsg,
  showSuccess,
  setShowSuccess,
  onClose
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.header}>Apply Coupon</Text>
      <View style={styles.row}>
        <TextInput
          value={couponCode}
          onChangeText={setCouponCode}
          placeholder="Enter coupon code"
          editable={!coupenApplied}
          style={styles.input}
        />

        {coupenApplied ? (
          <TouchableOpacity onPress={onRemove} style={styles.remove}>
            <Text style={styles.removeTxt}>Remove</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={()=>onApply(couponCode)} style={styles.applyBtn}>
            <Text style={styles.applyTxt}>Apply</Text>
          </TouchableOpacity>
        )}
      </View>
      {coupenApplied && (
       <SuccessAlert
        visible={showSuccess}
        onClose={onClose}
        amount={appliedCouponSuccessMsg.amount}
        provider={appliedCouponSuccessMsg.provider}
        code={appliedCouponSuccessMsg.code}
      />)}
    </View>
     
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 8, elevation: 4 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8, marginRight: 10 },
  applyBtn: { backgroundColor: COLORS.title, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8 },
  applyTxt: { color: "#fff", fontWeight: "bold" },
  remove: { marginLeft: 10 },
  removeTxt: { color: "#fd7e14", fontWeight: "bold" },
});