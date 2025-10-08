// src/realtime/RealtimeWelcomeScreen.native.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { LanguageConfig, LANGUAGES } from "../util/types";

type Props = { onLanguageSelect: (lang: LanguageConfig, instructions: string) => void };

const getInstructionsForLang = (lang: LanguageConfig) => {
  if (lang.code === "te") return "Speak Telugu only. ...";
  if (lang.code === "hi") return "Speak Hindi only. ...";
  return "Speak English only. ...";
};

export default function WelcomeScreen({ onLanguageSelect }: Props) {
  const [selected, setSelected] = useState<LanguageConfig | null>(LANGUAGES[0]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to ASKOXY.AI</Text>
      <Text style={styles.sub}>Select language to start conversation</Text>

      <FlatList
        data={LANGUAGES}
        keyExtractor={(i) => i.code}
        contentContainerStyle={{ paddingVertical: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selected?.code === item.code && styles.cardSelected]}
            onPress={() => {
              setSelected(item);
              onLanguageSelect(item, getInstructionsForLang(item));
            }}
          >
            <Text style={styles.flag}>{item.flag}</Text>
            <View>
              <Text style={styles.langTitle}>
                {item.nativeName + " | " + item.name} {/* Fix: Concatenate to avoid literal string between expressions */}
              </Text>
              <Text style={styles.langSubtitle}>
                {item.assistantName || "Assistant"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000812", paddingTop: 60, paddingHorizontal: 16 },
  header: { fontSize: 24, color: "#fff", fontWeight: "800", marginBottom: 4 },
  sub: { color: "#9ad6f8", marginBottom: 12 },
  card: { flexDirection: "row", gap: 12, padding: 12, backgroundColor: "#07122a", borderRadius: 12, marginBottom: 10, alignItems: "center" as const },
  cardSelected: { borderWidth: 1, borderColor: "#00e5ff" },
  flag: { fontSize: 32, marginRight: 12 },
  langTitle: { color: "#fff", fontWeight: "700" },
  langSubtitle: { color: "#bfefff" },
});