import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LanguageConfig } from "../util/types";

type Props = {
  selectedLanguage: LanguageConfig | null;
  isSessionActive: boolean;
};

export default function RealtimeHeader({ selectedLanguage, isSessionActive }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>ASKOXY.AI</Text>
      <Text style={styles.subtitle}>
        {selectedLanguage ? selectedLanguage.nativeName + " ASSISTANT" : "SELECTING LANGUAGE..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 70, paddingHorizontal: 16, paddingTop: 18, backgroundColor: "#041022", alignItems: "center" },
  title: { color: "#7de3ff", fontSize: 18, fontWeight: "700" },
  subtitle: { color: "#bfefff", fontSize: 12 },
});