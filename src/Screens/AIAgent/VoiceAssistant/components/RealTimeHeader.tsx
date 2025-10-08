// src/realtime/RealtimeHeader.native.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LanguageConfig } from "../util/types";

type Props = {
  selectedLanguage: LanguageConfig | null;
  isSessionActive: boolean;
  isConnecting: boolean;
  onBackClick: () => void;
  onStartSession: () => void;
  onStopSession: () => void;
  currentScreen: "welcome" | "start" | "conversation";
};

export default function RealtimeHeader({
  selectedLanguage,
  isSessionActive,
  isConnecting,
  onBackClick,
  onStartSession,
  onStopSession,
  currentScreen,
}: Props) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>ASKOXY.AI</Text>
        <Text style={styles.subtitle}>
          {selectedLanguage ? selectedLanguage.nativeName + " ASSISTANT" : "MULTILANGUAGE VOICE ASSISTANT"} {/* Concatenate for safety */}
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        {currentScreen === "start" && (
          <TouchableOpacity style={styles.startBtn} onPress={onStartSession} disabled={isConnecting}>
            <Text style={styles.btnText}>{isConnecting ? "Starting..." : "Start"}</Text>
          </TouchableOpacity>
        )}
        {currentScreen === "conversation" && (
          <TouchableOpacity style={styles.stopBtn} onPress={onStopSession}>
            <Text style={styles.btnText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 70, paddingHorizontal: 16, paddingTop: 18, backgroundColor: "#041022", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#7de3ff", fontSize: 18, fontWeight: "700" },
  subtitle: { color: "#bfefff", fontSize: 12 },
  startBtn: { backgroundColor: "#00c853", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 22, marginLeft: 8 },
  stopBtn: { backgroundColor: "#ff1744", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 22, marginLeft: 8 },
  btnText: { color: "white", fontWeight: "700" },
});