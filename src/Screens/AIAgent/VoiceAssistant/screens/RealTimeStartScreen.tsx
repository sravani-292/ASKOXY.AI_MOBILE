// src/realtime/RealtimeStartScreen.native.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LanguageConfig } from "../util/types";

type Props = {
  selectedLanguage: LanguageConfig | null; // Allow null for safety
  isConnecting: boolean;
  onStartSession: () => void;
};

export default function StartScreen({ selectedLanguage, isConnecting, onStartSession }: Props) {
  if (!selectedLanguage) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Language...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{selectedLanguage.flag}</Text>
      <Text style={styles.title}>
        {selectedLanguage.code === "te" ? "తెలుగు వాయిస్ అసిస్టెంట్" : selectedLanguage.code === "hi" ? "हिन्दी वॉयस असिस्टेंट" : "English Voice Assistant"}
      </Text>
      <Text style={styles.desc}>Start your conversation with the voice assistant</Text>

      <TouchableOpacity onPress={onStartSession} style={[styles.button, isConnecting && styles.buttonDisabled]} disabled={isConnecting}>
        <Text style={styles.buttonText}>{isConnecting ? "Connecting..." : "Start Conversation"}</Text>
      </TouchableOpacity>

      <View style={styles.disclaimer}>
        <Text style={{ color: "#ffd54f", fontWeight: "700" }}>Disclaimer</Text>
        <Text style={{ color: "#bcd5df", marginTop: 8 }}>
          ASKOXY.AI is a real-time assistant. Language adherence depends on model behavior.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000812", alignItems: "center", justifyContent: "center", padding: 20 },
  emoji: { fontSize: 80, marginBottom: 12 },
  title: { fontSize: 22, color: "#fff", fontWeight: "800", marginBottom: 8, textAlign: "center" },
  desc: { color: "#bfefff", textAlign: "center", marginBottom: 20 },
  button: { backgroundColor: "#00bcd4", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 28 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "700" },
  disclaimer: { marginTop: 24, maxWidth: 420, alignItems: "center" },
});