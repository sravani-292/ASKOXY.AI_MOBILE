import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import BASE_URL from "../../../../Config";
import { COLORS } from "../../../../Redux/constants/theme";
import { useSelector } from "react-redux";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"; // Optional for animations

const { width } = Dimensions.get("window");

// Sample translations for static text
const translations = {
  en: {
    headerTitle: "Choose Your AI Role",
    headerSubtitle: "Select a role to get started. You can change this later.",
    continueButton: (roleTitle) => `Continue as ${roleTitle}`,
  },
  te: {
    headerTitle: "మీ AI పాత్రను ఎంచుకోండి",
    headerSubtitle: "ప్రారంభించడానికి ఒక పాత్రను ఎంచుకోండి. మీరు దీనిని తర్వాత మార్చవచ్చు.",
    continueButton: (roleTitle) => `${roleTitle} గా కొనసాగండి`,
  },
  hi: {
    headerTitle: "अपनी AI भूमिका चुनें",
    headerSubtitle: "शुरू करने के लिए एक भूमिका चुनें। आप इसे बाद में बदल सकते हैं।",
    continueButton: (roleTitle) => `${roleTitle} के रूप में जारी रखें`,
  },
};

// Sample static mapping for role descriptions (replace with actual translations or API)
const descriptionTranslations = {
  // Example: Assume API returns descriptions like "Manages user accounts and permissions"
  "Manages user accounts and permissions": {
    en: "Manages user accounts and permissions",
    te: "వినియోగదారు ఖాతాలు మరియు అనుమతులను నిర్వహిస్తుంది",
    hi: "उपयोगकर्ता खातों और अनुमतियों का प्रबंधन करता है",
  },
  // Add more mappings based on actual API descriptions
  // Fallback: If description not in mapping, use English
};

// Placeholder function to translate role descriptions
const translateDescription = (description, language) => {
  if (!description) return "";
  // Use static mapping if available
  const translated = descriptionTranslations[description]?.[language] || description;
  if (language === "en" || translated !== description) return translated;
  // Fallback placeholder for untranslated descriptions
  return language === "te" ? ` ${description}` : language === "hi" ? ` ${description}` : description;
};

// Template for real translation API (uncomment and configure)
// const translateDescription = async (description, language) => {
//   if (!description || language === "en") return description;
//   try {
//     const response = await axios.post(
//       "https://x.ai/api/translate", // Replace with actual translation API endpoint
//       {
//         text: description,
//         target_language: language, // e.g., "te" for Telugu, "hi" for Hindi
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`, // Use your auth token
//         },
//       }
//     );
//     return response.data.translatedText || description;
//   } catch (error) {
//     console.error("Translation Error:", error.response?.data || error.message);
//     return description; // Fallback to English
//   }
// };

// Separate component for RoleCard to use hooks correctly
const RoleCard = ({ item, index, selectedRole, handleRoleSelect, language }) => {
  const [translatedDescription, setTranslatedDescription] = useState(item.description || item.discription);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  useEffect(() => {
    // For static mapping
    setTranslatedDescription(translateDescription(item.description || item.discription, language));
    
    // For real translation API (uncomment and use instead)
    // const fetchTranslation = async () => {
    //   const text = await translateDescription(item.description || item.discription, language);
    //   setTranslatedDescription(text);
    // };
    // fetchTranslation();
  }, [language, item.description, item.discription]);

  const onPressIn = () => {
    scale.value = 0.95;
  };

  const onPressOut = () => {
    scale.value = 1;
  };

  return (
    <Animated.View style={[styles.roleCard, index === 0 && styles.firstCard, animatedStyle]}>
      <TouchableOpacity
        style={[styles.cardContent, selectedRole === item.id && styles.selectedCard]}
        onPress={() => handleRoleSelect(item)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
        accessibilityLabel={`Select ${item.headerTitle} role`}
      >
        <Text style={styles.roleTitle}>{item.headerTitle}</Text>
        <Text style={styles.roleDescription}>{translatedDescription}</Text>
        <TouchableOpacity
          style={[styles.continueButton, selectedRole === item.id && styles.selectedButton]}
          onPress={() => handleRoleSelect(item)}
        >
          <Text style={styles.buttonText}>{translations[language].continueButton(item.headerTitle)}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AIRoleSelection = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [language, setLanguage] = useState("en"); // Default to English
  const navigation = useNavigation();

  const user = useSelector((state) => state.counter);
  const accessToken = user.accessToken;

  const getRoles = useCallback(async () => {
    console.log("Fetching roles...");
    setLoading(true);
    const url = `${BASE_URL}ai-service/agent/getAgentHeaders`;
    console.log("URL:", url);

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Success - Roles response:", response.data);
      setRoles(response.data);
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useFocusEffect(
    useCallback(() => {
      getRoles();
    }, [getRoles])
  );

  const handleRoleSelect = useCallback(
    (item) => {
      setSelectedRole(item.id);
      navigation.navigate("Agent Creation", { selectedRole: item.headerTitle });
      console.log("Selected role:", item);
    },
    [navigation]
  );

  const renderItem = ({ item, index }) => (
    <RoleCard
      item={item}
      index={index}
      selectedRole={selectedRole}
      handleRoleSelect={handleRoleSelect}
      language={language}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{translations[language].headerTitle}</Text>
      <Text style={styles.headerSubtitle}>{translations[language].headerSubtitle}</Text>
      {/* <FlatList
        data={["en", "te", "hi"]}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.langButton, language === item && styles.activeLang]}
            onPress={() => setLanguage(item)}
            accessibilityLabel={`Switch to ${item === "en" ? "English" : item === "te" ? "Telugu" : "Hindi"}`}
          >
            <Text style={[styles.langText, language === item && styles.activeLangText]}>
              {item === "en" ? "English" : item === "te" ? "తెలుగు" : "हिंदी"}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.languageSelector}
      /> */}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={roles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        numColumns={1}
        refreshing={loading}
        onRefresh={getRoles}
      />
    </SafeAreaView>
  );
};

export default AIRoleSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#121212",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  languageSelector: {
    paddingVertical: 8,
    gap: 8,
  },
  langButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  activeLang: {
    backgroundColor: COLORS.services,
  },
  langText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  activeLangText: {
    color: "#fff",
    fontWeight: "600",
  },
  roleCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  firstCard: {
    marginTop: 8,
  },
  selectedCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.services,
    backgroundColor: "#f8fafd",
  },
  cardContent: {
    padding: 20,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#121212",
    marginBottom: 12,
    textAlign: "left",
  },
  roleDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: COLORS.services,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: COLORS.services,
    opacity: 0.9,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});