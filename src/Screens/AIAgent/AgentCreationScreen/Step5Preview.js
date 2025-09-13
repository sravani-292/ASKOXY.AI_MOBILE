import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const Step5Preview = ({ formData }) => {
  // Hide internal fields
  const { agentStatus, status, activeStatus, ...previewData } = formData;
  // Group fields
  const sections = {
    "Basic Info": ["agentName", "domain", "subDomain", "gender", "ageLimit", "language", "voiceStatus"],
    "Purpose": ["description", "targetUser", "mainProblemSolved", "uniqueSolution", "business"],
    "Personality": ["conversationTone", "responseFormat", "usageModel", "instructions"],
    "Wrap Up": ["conStarter1", "conStarter2", "conStarter3", "conStarter4", "contactDetails", "userRole"],
    "Feedback": ["rateThisPlatform", "userExperience", "shareYourFeedback"],
  };

  const formatValue = (key, value) => {
    if (value === true) return "Yes";
    if (value === false) return "No";
    if (typeof value === "number") return value.toString();
    return value || "-";
  };

  return (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.title}>Preview Your Agent</Text>
      {Object.entries(sections).map(([sectionTitle, fields]) => (
        <View key={sectionTitle} style={styles.section}>
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
          {fields.map((key) => (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Text>
              <Text style={styles.value}>{formatValue(key, previewData[key])}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 20, color: "#1F2937" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12, color: "#6366F1" },
  row: { flexDirection: "row", marginBottom: 8, paddingVertical: 4 },
  label: { fontWeight: "600", width: 140, fontSize: 14, color: "#374151" },
  value: { flex: 1, fontSize: 14, color: "#333" },
});

export default Step5Preview;