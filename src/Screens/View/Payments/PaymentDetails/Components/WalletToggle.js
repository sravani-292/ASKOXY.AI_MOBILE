import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";
import { COLORS } from "../../../../../../Redux/constants/theme";

export default function WalletToggle({ walletAmount, useWallet, message, onToggle, minOrderValue, walletApplicable, grandTotalAmount }) {
  if (!walletAmount && !message) return null;

  return walletAmount > 0 && grandTotalAmount > minOrderValue ? (
    <View style={styles.card}>
      <View style={styles.header}>
        <Checkbox status={useWallet ? "checked" : "unchecked"} onPress={onToggle} color="#00bfff" />
        <Text style={styles.label}>Use Wallet Balance</Text>
      </View>
      <Text style={styles.msg}>
        You can use up to <Text style={styles.highlight}>₹{walletAmount}</Text> from your wallet.
      </Text>
    </View>
  ) : (
    <>
          {walletAmount > 0 && grandTotalAmount === 0 && (
          <View style={styles.wallet}>
            <Text style={styles.label}>Note:</Text>
            {/* <Text style={styles.message}>{message}</Text> */}
            <Text style={styles.message}>
            { walletApplicable === false && grandTotalAmount > 0
                ? `Add ₹${minOrderValue - grandTotalAmount} more to reach the minimum order of ₹${minOrderValue} for wallet usage.`
                : walletApplicable
                  ? "Wallet is applied to this order."
                  : "No wallet balance available."}
          </Text>
          </View>
         )}
          </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0", marginBottom: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  label: { marginLeft: 8, fontSize: 14 },
  msg: { fontSize: 12 },
  highlight: { color: COLORS.services, fontWeight: "bold" },
  note: { padding: 16, marginVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ddd" },
  noteLabel: { fontWeight: "bold", marginBottom: 4 },
  noteMsg: { fontSize: 14 },
});