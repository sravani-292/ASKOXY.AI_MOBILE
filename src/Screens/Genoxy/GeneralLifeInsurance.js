import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatInput from "./ChatInput";
const GeneralLifeInsurance = () => {
  const [selectedTab, setSelectedTab] = useState("life");
  const [userQuery, setUserQuery] = useState("");
  const navigation = useNavigation();

  const lifeInsuranceSections = [
    "👨‍👩‍👧 Can you help me find the right life insurance plan for my family of four?",
    "👩‍👩‍👧 Suggest a suitable life policy for my parents, kids, and myself together.",
    "📘 Please explain in simple words what a life insurance policy usually covers.",
    "⛔ Can you also tell me clearly what life insurance does not cover?",
    "💰 I want a premium estimate — what details should I share to get it?",
    "🏥 Show me hospitals nearby where my family can use cashless facilities linked to this policy.",
    "📑 How do I file a life insurance claim step by step if something happens?",
    "❓ I am confused about life insurance. Can you first explain the basics and then guide me with a few questions to ask?",
  ];

  const generalInsuranceSections = [
    "🚗 What does motor insurance cover in India?",
    "🏥 Can you suggest the best health insurance plans for families?",
    "🏠 What is covered under home insurance?",
    "✈️ Explain travel insurance and when it is useful.",
    "🏢 What is SME insurance and who needs it?",
    "💻 Tell me about cyber insurance and how it protects businesses.",
    "📊 How to compare premiums between general insurance companies?",
    "⚠️ What exclusions should I know in general insurance policies?",
    "📝 How do I file a claim for car accident damage?",
    "🏥 List hospitals offering cashless health insurance services near me.",
  ];

  const handleNavigate = (queryText, category) => {
    if (!queryText.trim()) return;

    // pick assistantId dynamically
    const assistantId =
      category === "life"
        ? "asst_G2jtvsfDcWulax5QDcyWhFX1"
        : "asst_bRxg1cfAfcQ05O3UGUjcAwwC";

    const categoryType =
      category === "life"
        ? "Life Insurance Assistant"
        : "General Insurance Assistant";

    navigation.navigate("GenOxyChatScreen", {
      query: queryText,
      category,
      assistantId,
      categoryType,
      fd:null,
    });

    setUserQuery(""); // reset input
  };

  const renderCards = (data) => {
    // Group cards into rows of 2
    const rows = [];
    for (let i = 0; i < data.length; i += 2) {
      rows.push(data.slice(i, i + 2));
    }

    return (
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.card}
                onPress={() => handleNavigate(item, selectedTab)}
              >
                <Text style={styles.cardText}>{item}</Text>
              </TouchableOpacity>
            ))}
            {/* Add empty space if odd number of cards in last row */}
            {row.length === 1 && <View style={styles.cardPlaceholder} />}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Insurance Assistant</Text>
            <Text style={styles.headerSubtitle}>
              Choose your insurance type and get instant help
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "life" && styles.activeTab]}
              onPress={() => setSelectedTab("life")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "life" && styles.activeTabText,
                ]}
              >
                Life Insurance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === "general" && styles.activeTab,
              ]}
              onPress={() => setSelectedTab("general")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "general" && styles.activeTabText,
                ]}
              >
                General Insurance
              </Text>
            </TouchableOpacity>
          </View>

          {/* Cards */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {selectedTab === "life" && renderCards(lifeInsuranceSections)}
            {selectedTab === "general" && renderCards(generalInsuranceSections)}
          </ScrollView>
        </View>

        {/* Bottom Input */}
        {/* <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your query..."
            placeholderTextColor="#94A3B8"
            value={userQuery}
            onChangeText={setUserQuery}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !userQuery.trim() && styles.sendButtonDisabled]}
            onPress={() => handleNavigate(userQuery, selectedTab)}
            disabled={!userQuery.trim()}
          >
            <Text style={[styles.sendText, !userQuery.trim() && styles.sendTextDisabled]}>➤</Text>
          </TouchableOpacity>
        </View> */}
        <ChatInput
          placeholder="Type your query..."
          value={userQuery}
          onChangeText={setUserQuery}
          onSendMessage={(message) => handleNavigate(message, selectedTab)}
          theme="light"
          showAttachment={true}
          enableVoice={true}
          navigation={navigation}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GeneralLifeInsurance;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "600",
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardPlaceholder: {
    flex: 1,
    marginHorizontal: 4,
  },
  cardText: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 22,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 16 : 16,
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f8fafc",
    color: "#334155",
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#cbd5e1",
    shadowOpacity: 0,
    elevation: 0,
  },
  sendText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sendTextDisabled: {
    color: "#94a3b8",
  },
});
