import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ChatInput from "./ChatInput";
const { width } = Dimensions.get("window");

const TiEGPT = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");

  const handleSend = (selectedQuery) => {
    const finalQuery = selectedQuery || query;
    if (!finalQuery.trim()) return;

    navigation.navigate("AssistantChatScreen", {
      query: finalQuery,
      assistantId: "asst_r72ouwQLn406qEjw9ftYjc85",
      assistantName: "TiE Assistant",
      fd: null,
    });

    setQuery("");
  };

  const quickQueries = [
    "Show me real estate founders in TiE Hyderabad",
    "Who are the active FinTech advisors I can connect with",
    "List VC fund managers from the TiE network",
    "Which members support early-stage startups?",
    "Connect me with healthcare industry mentors",
    "Find angel investors in my domain",
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={26} color="#2c3e50" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>TiE Hyderabad</Text>
            <Text style={styles.titleSecondary}>Conversations</Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>TiE</Text>
            </View>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Connect with chapter members, investors & industry experts
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Quick Queries Section */}
          <View style={styles.quickQueriesSection}>
            <Text style={styles.sectionTitle}>Quick Queries</Text>
            <Text style={styles.sectionDescription}>
              Tap any query below or type your own question
            </Text>

            <View style={styles.tabsContainer}>
              {quickQueries.map((queryText, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tab,
                    index % 2 === 0 ? styles.leftTab : styles.rightTab,
                  ]}
                  onPress={() => handleSend(queryText)}
                  activeOpacity={0.8}
                >
                  <View style={styles.tabContent}>
                    <Icon
                      name="help-outline"
                      size={20}
                      color="#3498db"
                      style={styles.tabIcon}
                    />
                    <Text style={styles.tabText}>{queryText}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        
        <ChatInput
          placeholder="Type your query..."
          value={query}
          onChangeText={setQuery}
          onSendMessage={(message) => handleSend(message)}
          theme="light"
          showAttachment={true}
          enableVoice={true}
          navigation={navigation}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TiEGPT;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  // Header Styles
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
  },
  titleSecondary: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3498db",
    textAlign: "center",
    marginTop: 2,
  },
  headerRight: {
    width: 44,
    alignItems: "flex-end",
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 20,
  },

  // Content Styles
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  quickQueriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 6,
    textAlign: "center",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tab: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e8f4f8",
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  leftTab: {
    width: (width - 52) / 2,
    marginRight: 6,
  },
  rightTab: {
    width: (width - 52) / 2,
    marginLeft: 6,
  },
  tabContent: {
    padding: 16,
    alignItems: "center",
  },
  tabIcon: {
    marginBottom: 8,
  },
  tabText: {
    fontSize: 13,
    color: "#2c3e50",
    lineHeight: 18,
    fontWeight: "500",
    textAlign: "center",
  },

  // Input Styles
  inputSection: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputContainer: {
    position: "relative",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f8f9fa",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e8f4f8",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
    maxHeight: 120,
    paddingVertical: 0,
    lineHeight: 22,
  },
  sendButton: {
    backgroundColor: "#3498db",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#bdc3c7",
    elevation: 0,
    shadowOpacity: 0,
  },
  characterCount: {
    position: "absolute",
    right: 60,
    bottom: -20,
    fontSize: 12,
    color: "#95a5a6",
  },
});
