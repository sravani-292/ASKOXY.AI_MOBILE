import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import ChatInput from "./ChatInput";
const { width } = Dimensions.get("window");

const roleQuestions = {
  "Management/CXO": [
    "What are the strategic priorities for this year?",
    "Share key financial highlights.",
    "Summarize market expansion plans.",
    "What leadership initiatives are underway?",
  ],
  Operations: [
    "List operational KPIs for this quarter.",
    "Highlight supply chain risks.",
    "What cost optimization measures are in place?",
    "Summarize production efficiency trends.",
  ],
  Infrastructure: [
    "Status of ongoing infrastructure projects?",
    "Maintenance costs for last quarter?",
    "Identify critical facility risks.",
    "Plans for new infrastructure upgrades?",
  ],
  "Information Technology": [
    "List IT/cybersecurity risks mentioned.",
    "Summarize digital transformation initiatives.",
    "Status of current IT projects?",
    "Any system downtime reported?",
  ],
  "Finance & Accounts": [
    "Show revenue and expenses breakdown.",
    "What are outstanding receivables?",
    "Identify financial risks flagged.",
    "Summarize audit findings.",
  ],
  "Human Resources": [
    "Employee attrition rates this year?",
    "Staffing levels across departments?",
    "Training programs conducted?",
    "Key HR challenges reported?",
  ],
  "Legal & Compliance": [
    "List ongoing legal cases.",
    "Compliance violations reported?",
    "Summarize regulatory updates.",
    "Key legal risks identified?",
  ],
  "CSR/Sustainability": [
    "Summarize energy, water, and waste data.",
    "CSR initiatives undertaken?",
    "Sustainability goals achieved?",
    "Key environmental risks?",
  ],
};

const roles = [
  { name: "Management/CXO", icon: "person-circle", color: "#e74c3c" },
  {
    name: "Operations",
    icon: "cogs",
    color: "#3498db",
    type: "MaterialCommunityIcons",
  },
  {
    name: "Infrastructure",
    icon: "building",
    color: "#f39c12",
    type: "FontAwesome5",
  },
  { name: "Information Technology", icon: "laptop", color: "#9b59b6" },
  {
    name: "Finance & Accounts",
    icon: "wallet",
    color: "#27ae60",
    type: "FontAwesome5",
  },
  { name: "Human Resources", icon: "people", color: "#e67e22" },
  {
    name: "Legal & Compliance",
    icon: "gavel",
    color: "#34495e",
    type: "MaterialCommunityIcons",
  },
  {
    name: "CSR/Sustainability",
    icon: "leaf",
    color: "#16a085",
    type: "MaterialCommunityIcons",
  },
];

const generalTabs = [
  "Which business risks are flagged in this year's disclosures?",
  "Show me employee attrition rates for this year.",
  "List IT/cybersecurity risks mentioned in this year's reports",
  "Summarize this year's energy, water, and waste management data",
];

const KLMFashionsLLM = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [query, setQuery] = useState("");

  const handleSend = (selectedQuery) => {
    const finalQuery = selectedQuery || query;
    if (!finalQuery.trim()) return;

    navigation.navigate("GenOxyChatScreen", {
      query: finalQuery,
      category: "KLM",
      assistantId: "asst_6Yq2RvPL50n7n7qF9Vnp5uof",
      categoryType: "KLM Assistant",
      fd:null,
    });

    setQuery("");
  };

  const handleBack = () => {
    if (selectedRole) {
      setSelectedRole(null);
    } else if (selectedOption) {
      setSelectedOption(null);
    } else {
      navigation.goBack();
    }
  };

  const renderIcon = (role) => {
    const IconComponent =
      role.type === "MaterialCommunityIcons"
        ? MaterialCommunityIcons
        : role.type === "FontAwesome5"
        ? FontAwesome5
        : Ionicons;

    return <IconComponent name={role.icon} size={24} color={role.color} />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={26} color="#2c3e50" />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>KLM Fashions</Text>
          <Text style={styles.titleSecondary}>AI Assistant</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>KLM</Text>
          </View>
        </View>
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
          {!selectedOption && !selectedRole && (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>
                Choose how you want to begin
              </Text>
              <Text style={styles.welcomeSubtext}>
                Select from role-based conversations or start with general
                questions
              </Text>
            </View>
          )}

          {!selectedRole && !selectedOption && (
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={[styles.optionBox, styles.roleBasedOption]}
                onPress={() => setSelectedOption("role")}
                activeOpacity={0.8}
              >
                <View style={styles.optionHeader}>
                  <Ionicons name="people-circle" size={28} color="#3498db" />
                  <Text style={styles.optionTitle}>
                    Role-based Conversations
                  </Text>
                </View>
                <Text style={styles.optionDesc}>
                  Pick a specific department or role to get targeted insights
                </Text>
                <View style={styles.optionArrow}>
                  <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionBox, styles.generalOption]}
                onPress={() => setSelectedOption("general")}
                activeOpacity={0.8}
              >
                <View style={styles.optionHeader}>
                  <Ionicons name="chatbubbles" size={28} color="#e74c3c" />
                  <Text style={styles.optionTitle}>General Conversations</Text>
                </View>
                <Text style={styles.optionDesc}>
                  Start with quick questions across all business areas
                </Text>
                <View style={styles.optionArrow}>
                  <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Role selection */}
          {selectedOption === "role" && !selectedRole && (
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionTitle}>Select Your Role</Text>
              <Text style={styles.sectionDescription}>
                Choose the department or role that best matches your inquiry
              </Text>

              <View style={styles.rolesGrid}>
                {roles.map((role, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.roleCard}
                    onPress={() => setSelectedRole(role.name)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.roleIconContainer,
                        { backgroundColor: `${role.color}15` },
                      ]}
                    >
                      {renderIcon(role)}
                    </View>
                    <Text style={styles.roleText}>{role.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Role Questions */}
          {selectedRole && (
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionTitle}>{selectedRole} Questions</Text>
              <Text style={styles.sectionDescription}>
                Tap any question below or type your own
              </Text>

              <View style={styles.questionsGrid}>
                {roleQuestions[selectedRole].map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.questionCard}
                    onPress={() => handleSend(question)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="help-circle-outline"
                      size={20}
                      color="#3498db"
                      style={styles.questionIcon}
                    />
                    <Text style={styles.questionText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* General Conversations */}
          {selectedOption === "general" && (
            <View style={styles.selectionContainer}>
              <Text style={styles.sectionTitle}>Quick Questions</Text>
              <Text style={styles.sectionDescription}>
                Popular questions to get you started
              </Text>

              {generalTabs.map((tab, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.generalCard}
                  onPress={() => handleSend(tab)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="flash"
                    size={20}
                    color="#f39c12"
                    style={styles.generalIcon}
                  />
                  <Text style={styles.generalText}>{tab}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#bdc3c7" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input Section */}
        {/* <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask anything about KLM Fashions..."
                placeholderTextColor="#95a5a6"
                value={query}
                onChangeText={setQuery}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={() => handleSend()}
                blurOnSubmit={false}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  !query.trim() && styles.sendButtonDisabled
                ]}
                onPress={() => handleSend()}
                disabled={!query.trim()}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="send" 
                  size={20} 
                  color={query.trim() ? '#ffffff' : '#bdc3c7'} 
                />
              </TouchableOpacity>
            </View>
            
            {query.length > 0 && (
              <Text style={styles.characterCount}>
                {query.length}/500
              </Text>
            )}
          </View>
        </View> */}
         <ChatInput
          placeholder="Type your query..."
          value={query}
          onChangeText={setQuery}
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

export default KLMFashionsLLM;

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
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
    color: "#e74c3c",
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
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },

  // Content Styles
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeContainer: {
    padding: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 20,
  },

  // Option Cards
  optionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  optionBox: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ecf0f1",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  roleBasedOption: {
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  generalOption: {
    borderLeftWidth: 4,
    borderLeftColor: "#e74c3c",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginLeft: 12,
    flex: 1,
  },
  optionDesc: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
    marginBottom: 8,
  },
  optionArrow: {
    alignSelf: "flex-end",
  },

  // Selection Container
  selectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },

  // Roles Grid
  rolesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  roleCard: {
    width: (width - 52) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ecf0f1",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2c3e50",
    textAlign: "center",
    lineHeight: 16,
  },

  // Questions Grid
  questionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  questionCard: {
    width: (width - 52) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e8f4f8",
    elevation: 2,
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionIcon: {
    marginBottom: 8,
  },
  questionText: {
    fontSize: 13,
    color: "#2c3e50",
    lineHeight: 18,
    fontWeight: "500",
  },

  // General Cards
  generalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ecf0f1",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  generalIcon: {
    marginRight: 12,
  },
  generalText: {
    flex: 1,
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "500",
    lineHeight: 20,
  },

  // Input Section
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
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#2c3e50",
    maxHeight: 120,
    paddingVertical: 0,
    lineHeight: 22,
  },
  sendButton: {
    backgroundColor: "#e74c3c",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#e74c3c",
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
