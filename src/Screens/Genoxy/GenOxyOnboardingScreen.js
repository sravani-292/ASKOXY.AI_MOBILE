import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient"; // You may need to install this
import ChatInput from "./ChatInput";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const GenoxyMobileScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("image");

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const newFile = {
          id: Date.now().toString(),
          name: result.assets[0].fileName || "image.jpg",
          type: "image",
          uri: result.assets[0].uri,
        };
        setUploadedFiles((prev) => [...prev, newFile]);
        Alert.alert("Success", "Image uploaded successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload image");
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const newFile = {
          id: Date.now().toString(),
          name: result.assets[0].name,
          type: "document",
          uri: result.assets[0].uri,
          size: result.assets[0].size,
        };
        setUploadedFiles((prev) => [...prev, newFile]);
        Alert.alert("Success", "File uploaded successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload file");
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      Alert.alert("Message Sent", `Your message: "${inputText}"`);
      setInputText("");
    }
  };

  // Category suggestions data
  const categoryData = {
    image: {
      title: "Image Generation",
      suggestions: [
        "Generate a landscape image",
        "Generate a realistic product mockup image",
        "Generate a corporate banner image",
        "Generate an infographic image",
      ],
    },
    learning: {
      title: "Learning",
      suggestions: [
        "Top Skills for 2025",
        "Remote learning tips",
        "AI for professional growth",
        "Create a learning plan",
      ],
    },
    development: {
      title: "Development",
      suggestions: [
        "React authentication",
        "Optimize Node.js API",
        "Clean code practices",
        "Async JavaScript explained",
      ],
    },
    news: {
      title: "News",
      suggestions: [
        "Learn AI research",
        "2025 market trends",
        "Technology policy updates",
        "Financial news summary",
      ],
    },
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    if(category==="image"){
      navigation.navigate("InsuranceLLM", { categoryType: "Insurance LLM" });
    }else if(category==="learning"){
      navigation.navigate("TiEGPT", { categoryType: "TiE GPT" });
    }else if(category==="development"){
      navigation.navigate("KLMFashionsLLM", { categoryType: "KLM Fashions LLM" });
    }
  };

  const CategoryButton = ({
    icon,
    label,
    color = "#8b5cf6",
    category,
    isActive,
  }) => (
    <TouchableOpacity
      style={[styles.categoryButton, isActive && styles.activeCategoryButton]}
      activeOpacity={0.8}
      onPress={() => {setSelectedCategory(category), handleCategoryPress(category)}}
    >
      <View style={[styles.categoryIcon, { backgroundColor: color + "20" }]}>
        <Text style={styles.categoryIconText}>{label ? label.charAt(0).toUpperCase() : "?"}</Text>
      </View>
      <Text
        style={[
          styles.categoryText,
          { color },
          isActive && styles.activeCategoryText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SuggestionButton = ({ text, onPress }) => (
    <TouchableOpacity
      style={styles.suggestionButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.suggestionText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header with Drawer Navigation */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={24} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="sparkles" size={20} color="#ffffff" />
          </View>
        </View>

        {/* <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={22} color="#ffffff" />
        </TouchableOpacity> */}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.subtitle}>
              <Text style={styles.highlightText}>LLM</Text> for every company,
              {"\n"}
              <Text style={styles.highlightText}>SLM</Text> for every
              department,{"\n"}
              and <Text style={styles.highlightText}>AI twin</Text> for every
              employee.
            </Text>

            {/* <TouchableOpacity style={styles.exploreButton} activeOpacity={0.8}>
              <LinearGradient
                colors={["#8b5cf6", "#a855f7"]}
                style={styles.exploreButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.exploreButtonText}>Explore AI LLMs</Text>
              </LinearGradient>
            </TouchableOpacity> */}

            <Text style={styles.selectText}>
              Select an AI LLM and let's get started
            </Text>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              Welcome to <Text style={styles.genoxyText}>AI LLMs</Text>
            </Text>
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <View style={styles.categoryRow}>
              <CategoryButton
                icon="image-outline"
                label="Insurance LLM"
                color="#10b981"
                category="image"
                isActive={selectedCategory === "image"}
              />
              <CategoryButton
                icon="book-outline"
                label="TiE GPT"
                color="#f59e0b"
                category="learning"
                isActive={selectedCategory === "learning"}
              />
            </View>
            <View style={styles.categoryRow}>
              <CategoryButton
                icon="code-slash-outline"
                label="KLM Fashions LLM"
                color="#8b5cf6"
                category="development"
                isActive={selectedCategory === "development"}
              />
            </View>
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#1a1a2e",
    borderBottomWidth: 1,
    borderBottomColor: "#2d2d48",
    marginTop: 30,
  },

  drawerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2d2d48",
    justifyContent: "center",
    alignItems: "center",
  },

  logoContainer: {
    flex: 1,
    alignItems: "center",
  },

  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
  },

  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2d2d48",
    justifyContent: "center",
    alignItems: "center",
  },

  // Content Styles
  content: {
    flex: 1,
  },

  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingTop: 20,
    justifyContent:"center"
  },

  // Hero Section
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
  },

  subtitle: {
    fontSize: 18,
    color: "#e2e8f0",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 25,
  },

  highlightText: {
    color: "#fbbf24",
    fontWeight: "700",
  },

  exploreButton: {
    marginBottom: 15,
  },

  exploreButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },

  exploreButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  selectText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },

  // Welcome Section
  welcomeSection: {
    alignItems: "center",
    marginBottom: 30,
  },

  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },

  genoxyText: {
    color: "#8b5cf6",
  },

  // Categories
  categoriesContainer: {
    marginBottom: 30,
  },

  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  categoryIconText:{
    color: "#8b5cf6",
    fontSize: 25,
    fontWeight: "700",
  },

  categoryButton: {
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#2d2d48",
    width: (screenWidth - 60) / 2,
    borderWidth: 2,
    borderColor: "transparent",
  },

  activeCategoryButton: {
    backgroundColor: "#8b5cf620",
    borderColor: "#8b5cf6",
    transform: [{ scale: 1.02 }],
  },

  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  categoryText: {
    fontSize: 16,
    fontWeight: "600",
  },

  activeCategoryText: {
    fontWeight: "700",
  },

  // Suggestions
  suggestionsContainer: {
    marginBottom: 30,
  },

  suggestionsTitle: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 15,
    fontWeight: "600",
  },

  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  suggestionButton: {
    backgroundColor: "#2d2d48",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    width: (screenWidth - 50) / 2,
    marginBottom: 10,
  },

  suggestionText: {
    color: "#e2e8f0",
    fontSize: 13,
    textAlign: "center",
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
    justifyContent: "center",
  },

  actionButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
  },

  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ef4444",
  },

  actionButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  secondaryButtonText: {
    color: "#ef4444",
  },

  // Files Container
  filesContainer: {
    backgroundColor: "#2d2d48",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },

  filesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 15,
  },

  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  fileIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#8b5cf620",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  fileName: {
    flex: 1,
    fontSize: 14,
    color: "#e2e8f0",
    fontWeight: "500",
  },

  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#ef444420",
  },

  // Input Container
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    backgroundColor: "#1a1a2e",
    borderTopWidth: 1,
    borderTopColor: "#2d2d48",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#2d2d48",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    minHeight: 50,
    maxHeight: 100,
  },

  attachButton: {
    marginRight: 12,
    padding: 6,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    paddingVertical: 4,
    minHeight: 20,
  },

  micButton: {
    marginLeft: 12,
    padding: 6,
  },

  sendButton: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#64748b",
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonActive: {
    backgroundColor: "#8b5cf6",
  },
});

export default GenoxyMobileScreen;
