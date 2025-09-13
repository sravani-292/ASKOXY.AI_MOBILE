import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { CustomButton } from "./index";
import axios from "axios";
import BASE_URL from "../../../../Config"; 

const Step3 = ({ formData, handleChange, instructionOptions, fetchInstructions, isLoading }) => {
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  // Fetch models from API on mount
  useEffect(() => {
    const fetchModels = async () => {
      setModelsLoading(true);
      try {
        const res = await axios.get('http://65.0.147.157:9040/api/ai-service/agent/models');
        const modelData = res.data.data.map(model => ({
          label: model.id,
          value: model.id,
        }));
        setModels(modelData);
      } catch (e) {
        console.error("Model fetch error", e.respones);
        Alert.alert("Error", "Failed to fetch models.");
      }
      setModelsLoading(false);
    };
    fetchModels();
  }, []);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Step 3 - Personality & Instructions</Text>

      <Text style={styles.label}>Conversation Tone *</Text>
      <TextInput
        style={styles.input}
        value={formData.conversationTone}
        onChangeText={(val) => handleChange("conversationTone", val)}
        placeholder="e.g., Friendly, Professional"
        accessible={true}
        accessibilityLabel="Conversation Tone"
      />

      <Text style={styles.label}>Response Format *</Text>
      <TextInput
        style={styles.input}
        value={formData.responseFormat}
        onChangeText={(val) => handleChange("responseFormat", val)}
        placeholder="e.g., Concise, Detailed"
        accessible={true}
        accessibilityLabel="Response Format"
      />

      <Text style={styles.label}>Usage Model *</Text>
      {modelsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#6366F1" size="small" />
          <Text style={styles.loadingText}>Loading models...</Text>
        </View>
      ) : (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={models}
          labelField="label"
          valueField="value"
          placeholder="Select a model"
          value={formData.usageModel}
          onChange={(item) => handleChange("usageModel", item.value)}
          containerStyle={styles.dropdownContainer}
          itemTextStyle={styles.itemTextStyle}
          activeColor="#F1F5F9"
          accessible={true}
          accessibilityLabel="Usage Model"
        />
      )}

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={formData.instructions}
        onChangeText={(val) => handleChange("instructions", val)}
        placeholder="Enter your own instructions or use suggestion below"
        multiline
        accessible={true}
        accessibilityLabel="Instructions"
      />

      <CustomButton
        title={isLoading ? undefined : "Get Instruction Suggestions"}
        onPress={fetchInstructions}
        variant="primary"
        loading={isLoading}
        disabled={isLoading || !formData.description}
      />

      {instructionOptions ? (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggestion:</Text>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => handleChange("instructions", instructionOptions)}
            accessible={true}
            accessibilityLabel="Instruction Suggestion"
          >
            <Text style={styles.suggestionText} numberOfLines={2}>
              {instructionOptions}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.noSuggestionsText}>No suggestions available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 20, color: "#1F2937" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, marginTop: 12, color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    height: 50,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  itemTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  suggestionsContainer: { 
    marginTop: 20,
    marginBottom: 12,
  },
  suggestionsTitle: { 
    fontSize: 14, 
    fontWeight: "600", 
    marginBottom: 10, 
    color: "#374151" 
  },
  suggestionChip: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  suggestionText: { 
    fontSize: 14, 
    color: "#374151",
    fontWeight: "500" 
  },
  noSuggestionsText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
  },
});

export default Step3;