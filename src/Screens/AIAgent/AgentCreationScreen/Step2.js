import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const Step2 = ({ formData, handleChange }) => {
  const [descriptionLength, setDescriptionLength] = useState(formData.description.length);

  const handleDescriptionChange = (text) => {
    if (text.length <= 300) {
      handleChange("description", text);
      setDescriptionLength(text.length);
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Step 2 - Purpose & Target</Text>

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Describe your agent's purpose and capabilities"
        value={formData.description}
        onChangeText={handleDescriptionChange}
        multiline
        maxLength={300}
        accessible={true}
        accessibilityLabel="Agent Description"
      />
      <View style={styles.charCounterContainer}>
        <Text style={styles.charCounter}>
          {descriptionLength}/300
        </Text>
        {descriptionLength >= 300 && (
          <Text style={styles.charLimitWarning}>Maximum characters reached</Text>
        )}
      </View>

      <Text style={styles.label}>Target User *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Students, Professionals, Parents"
        value={formData.targetUser}
        onChangeText={(v) => handleChange("targetUser", v)}
        accessible={true}
        accessibilityLabel="Target User"
      />

      <Text style={styles.label}>Main Problem Solved *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Difficulty in learning math concepts"
        value={formData.mainProblemSolved}
        onChangeText={(v) => handleChange("mainProblemSolved", v)}
        accessible={true}
        accessibilityLabel="Main Problem Solved"
      />

      <Text style={styles.label}>Unique Solution *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Interactive AI tutor with real-time feedback"
        value={formData.uniqueSolution}
        onChangeText={(v) => handleChange("uniqueSolution", v)}
        accessible={true}
        accessibilityLabel="Unique Solution"
      />

      <Text style={styles.label}>Business (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., EdTech Startup"
        value={formData.business}
        onChangeText={(v) => handleChange("business", v)}
        accessible={true}
        accessibilityLabel="Business"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginBottom: 20, 
    color: "#1F2937" 
  },
  label: { 
    fontSize: 14, 
    fontWeight: "600", 
    marginBottom: 6, 
    marginTop: 12, 
    color: "#374151" 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  charCounterContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: -8,
    marginBottom: 12,
  },
  charCounter: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  charLimitWarning: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },
});

export default Step2;