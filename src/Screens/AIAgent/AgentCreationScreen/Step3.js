import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Checkbox from 'expo-checkbox';

const Step3 = ({ formData, handleChange, instructionOptions, fetchInstructions, isLoading }) => {
 

  // Conversation tone options
  const conversationToneOptions = [
   { label: "Helpful, Professional", value: "Helpful, Professional" },
  { label: "Friendly, Supportive", value: "Friendly, Supportive" },
  { label: "Formal, Concise", value: "Formal, Concise" },
  { label: "Expert, Analytical", value: "Expert, Analytical" },
  { label: "Casual, Empathetic", value: "Casual, Empathetic" },
  ];

  // Options for dropdowns
  const customerOptions = [
  { label: "IT Professionals", value: "IT Professionals" },
  { label: "Doctors", value: "Doctors" },
  { label: "Students", value: "Students" },
  { label: "Lawyers", value: "Lawyers" },
  { label: "Entrepreneurs", value: "Entrepreneurs" },
  { label: "Startups", value: "Startups" },
  { label: "SMBs", value: "SMBs" },
  { label: "Enterprises", value: "Enterprises" },
  { label: "Marketers", value: "Marketers" },
  { label: "Sales Teams", value: "Sales Teams" },
  { label: "HR/Recruiters", value: "HR/Recruiters" },
  { label: "Teachers", value: "Teachers" },
  { label: "Researchers", value: "Researchers" },
  { label: "Designers", value: "Designers" },
  { label: "Product Managers", value: "Product Managers" },
  { label: "Developers", value: "Developers" },
  { label: "Accountants", value: "Accountants" },
  { label: "CXOs", value: "CXOs" },
  { label: "Support Teams", value: "Support Teams" },
  { label: "Operations", value: "Operations" },
  { label: "Manufacturing", value: "Manufacturing" },
  { label: "Bankers", value: "Bankers" },
  { label: "Investors", value: "Investors" },
  { label: "Freelancers", value: "Freelancers" },
  { label: "Consultants", value: "Consultants" },
  { label: "Other", value: "Other" },
  ];
  
  const ageOptions = [
 { label: "Below 18", value: "Below 18" },
  { label: "18-25", value: "18-25" },
  { label: "26-40", value: "26-40" },
  { label: "40-55", value: "40-55" },
  { label: "55+", value: "55+" },
  { label: "Other", value: "Other" },
  ];

  // Handle multi-select dropdown changes
  const handleMultiSelect = (field, items) => {
    handleChange(field, items);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    handleChange(field, newValues);
  };

  return (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.title}>Step 3 - Audience & Configuration</Text>

      <Text style={styles.label}>Target Customers *</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={customerOptions}
        labelField="label"
        valueField="value"
        placeholder="Select target customers"
        value={formData.targetCustomers}
        onChange={(item) => {
          const currentValues = formData.targetCustomers || [];
          if (!currentValues.includes(item.value)) {
            handleMultiSelect("targetCustomers", [...currentValues, item.value]);
          }
        }}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#F1F5F9"
        accessible={true}
        accessibilityLabel="Target Customers"
      />
      
      {/* Display selected customers */}
      <View style={styles.selectedItemsContainer}>
        {formData.targetCustomers?.map((value, index) => {
          const label = customerOptions.find(opt => opt.value === value)?.label;
          return (
            <View key={index} style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>{label}</Text>
              <TouchableOpacity
                onPress={() => {
                  const newValues = formData.targetCustomers.filter(v => v !== value);
                  handleChange("targetCustomers", newValues);
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <Text style={styles.label}>Target Audience Age Limit *</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={ageOptions}
        labelField="label"
        valueField="value"
        placeholder="Select age ranges"
        value={formData.targetAgeLimit}
        onChange={(item) => {
          const currentValues = formData.targetAgeLimit || [];
          if (!currentValues.includes(item.value)) {
            handleMultiSelect("targetAgeLimit", [...currentValues, item.value]);
          }
        }}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#F1F5F9"
        accessible={true}
        accessibilityLabel="Target Age Limit"
      />
      
      {/* Display selected age ranges */}
      <View style={styles.selectedItemsContainer}>
        {formData.targetAgeLimit?.map((value, index) => {
          const label = ageOptions.find(opt => opt.value === value)?.label;
          return (
            <View key={index} style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>{label}</Text>
              <TouchableOpacity
                onPress={() => {
                  const newValues = formData.targetAgeLimit.filter(v => v !== value);
                  handleChange("targetAgeLimit", newValues);
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity> 
            </View>
          );
        })}
      </View>

      <Text style={styles.label}>Target Audience Gender *</Text>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxRow}>
          <Checkbox
            value={formData.targetGender?.includes("male") || false}
            onValueChange={() => handleCheckboxChange("targetGender", "male")}
            color={formData.targetGender?.includes("male") ? "#6366F1" : undefined}
          />
          <Text style={styles.checkboxLabel}>Male</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox
            value={formData.targetGender?.includes("female") || false}
            onValueChange={() => handleCheckboxChange("targetGender", "female")}
            color={formData.targetGender?.includes("female") ? "#6366F1" : undefined}
          />
          <Text style={styles.checkboxLabel}>Female</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Checkbox
            value={formData.targetGender?.includes("other") || false}
            onValueChange={() => handleCheckboxChange("targetGender", "other")}
            color={formData.targetGender?.includes("other") ? "#6366F1" : undefined}
          />
          <Text style={styles.checkboxLabel}>Other</Text>
        </View>
      </View>

      <Text style={styles.label}>Conversation Tone *</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={conversationToneOptions}
        labelField="label"
        valueField="value"
        placeholder="Select conversation tone"
        value={formData.conversationTone}
        onChange={(item) => handleChange("conversationTone", item.value)}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#F1F5F9"
        accessible={true}
        accessibilityLabel="Conversation Tone"
      />

      

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={[styles.input, { height: 150, textAlignVertical: 'top' }]}
        placeholderTextColor={"#94A3B8"}
        value={formData.instructions}
        onChangeText={(val) => handleChange("instructions", val)}
        placeholder="Enter your own instructions or use suggestion below"
        multiline
        accessible={true}
        accessibilityLabel="Instructions"
      />

      <TouchableOpacity
        style={[styles.button, (isLoading || !formData.description) && styles.buttonDisabled]}
        onPress={fetchInstructions}
        disabled={isLoading || !formData.description}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Get Instruction Suggestions</Text>
        )}
      </TouchableOpacity>

      {instructionOptions ? (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Suggestion:</Text>
          <TouchableOpacity
            style={styles.suggestionChip}
            onPress={() => {handleChange("instructions", instructionOptions);alert("Instructions have been updated in the Instructions field. Do you want to update it as well?");}}
            accessible={true}
            accessibilityLabel="Instruction Suggestion"
          >
            <ScrollView>
            <Text style={styles.suggestionText} 
            // numberOfLines={2}
            >
              {instructionOptions}
            </Text>
            </ScrollView>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.noSuggestionsText}>No suggestions available</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
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
    minHeight: 150,
     height: 250,
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
  checkboxContainer: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#374151",
  },
  selectedItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItemText: {
    fontSize: 14,
    color: "#374151",
    marginRight: 6,
  },
  removeButton: {
    backgroundColor: "#9CA3AF",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 16,
  },
  button: {
    backgroundColor: "#6366F1",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Step3;
