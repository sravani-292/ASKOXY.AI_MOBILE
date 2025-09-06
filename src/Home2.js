// ✅ FUNCTIONAL SUMMARY
// ASKOXY.AI SUPER APP dashboard with FlatList (3 columns).
// Top section: title + 4 feature cards in a row
// Bottom section: 3-column FlatList grid with icons + labels.

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Top 4 features
const featuresTop = [
  { label: "Genoxy", icon: "chatbubble-ellipses-outline" },
  { label: "Explore AI LLMs", icon: "extension", lib: "MaterialIcons" },
  { label: "Blockchain", icon: "cube-outline" },
  { label: "Crypto", icon: "logo-bitcoin" },
];

// Grid features
const featuresGrid = [
  { label: "Loans & Investments", icon: "cash-outline" },
  { label: "NyayaGPT", icon: "scale-outline" },
  { label: "Real Estate", icon: "business-outline" },
  { label: "Rice2Robo Ecommerce", icon: "smart-toy", lib: "MaterialIcons" },
  { label: "Gold, Silver & Diamonds", icon: "gem", lib: "FontAwesome5" },
  { label: "IT Services", icon: "laptop-outline" },
  { label: "Study Abroad", icon: "airplane-outline" },
  { label: "Jobs, Blogs & Training", icon: "document-text-outline" },
  { label: "IT Services", icon: "git-network-outline" },
];

// Helper for icons
const renderIcon = (item, size = 32) => {
  if (item.lib === "MaterialIcons") {
    return <MaterialIcons name={item.icon} size={size} color="#FFD700" />;
  }
  if (item.lib === "FontAwesome5") {
    return <FontAwesome5 name={item.icon} size={size} color="#FFD700" />;
  }
  return <Ionicons name={item.icon} size={size} color="#FFD700" />;
};

const SuperAppScreen = () => {
  return (
    <LinearGradient colors={["#2E026D", "#4C1D95", "#6D28D9"]} style={styles.container}>
      <SafeAreaView>
        <FlatList
          ListHeaderComponent={
            <>
              {/* Title */}
              <LinearGradient
                colors={["#FFD700", "#FFA500"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.textGradient}
              >
                <Text style={styles.title}>ASKOXY.AI</Text>
              </LinearGradient>
              <Text style={styles.subtitle}>SUPER APP</Text>

              {/* Top Row */}
              <View style={styles.topRow}>
                {featuresTop.map((item, index) => (
                  <LinearGradient
                    key={index}
                    colors={["#FACC15", "#F59E0B"]}
                    style={styles.topCard}
                  >
                    {renderIcon(item, 30)}
                    <Text style={styles.topCardText}>{item.label}</Text>
                  </LinearGradient>
                ))}
              </View>
            </>
          }
          data={featuresGrid}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <View style={styles.gridWrapper}>
              <LinearGradient
                colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0.05)"]}
                style={styles.gridCard}
              >
                {renderIcon(item, 28)}
                <Text style={styles.gridText}>{item.label}</Text>
              </LinearGradient>
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SuperAppScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textGradient: {
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    color: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 25,
    textAlign: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: width - 40,
    alignSelf: "center",
    marginBottom: 25,
  },
  topCard: {
    flex: 1,
    margin: 6,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  topCardText: {
    color: "#111",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
    textAlign: "center",
  },
  grid: {
    paddingBottom: 40,
  },
  gridWrapper: {
    flex: 1 / 3,
    margin: 8,
    alignItems: "center",
  },
  gridCard: {
    width: (width - 80) / 3,
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
});