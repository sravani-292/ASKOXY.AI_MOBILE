import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Subscription from "./Subscription";
import SubscriptionHistory from "./SubscriptionHistory";

export default function Main() {
  const [activeTab, setActiveTab] = useState("Subscription");

  return (
    <View style={styles.container}>
      {/* Custom Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "Subscription" && styles.activeTab]}
          onPress={() => setActiveTab("Subscription")}
        >
          <Text style={[styles.tabText, activeTab === "Subscription" && styles.activeTabText]}>
            Subscription
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "SubscriptionHistory" && styles.activeTab]}
          onPress={() => setActiveTab("SubscriptionHistory")}
        >
          <Text style={[styles.tabText, activeTab === "SubscriptionHistory" && styles.activeTabText]}>
            Subscription History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Render Content Based on Active Tab */}
      <View style={styles.contentContainer}>
        {activeTab === "Subscription" ? <Subscription /> : <SubscriptionHistory />}
      </View>
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  tabContainer: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, backgroundColor: "#f5f5f5" },
  tabButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#9333ea" },
  tabText: { fontSize: 16, fontWeight: "bold", color: "black" },
  activeTabText: { color: "#9333ea" },
  contentContainer: { flex: 1, padding: 10 },
});
