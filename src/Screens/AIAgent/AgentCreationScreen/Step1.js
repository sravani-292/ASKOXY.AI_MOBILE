import React from "react";
import { View, Text, TextInput, StyleSheet, Switch } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const Step1 = ({ formData, handleChange }) => {
  const domains = [
    { label: "Education", value: "Education" },
    { label: "Finance", value: "Finance" },
    { label: "Banking", value: "Banking" },
    { label: "Other", value: "Other" },
  ];
  const genders = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Neutral", value: "Neutral" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  // Clear customDomain if domain is not "Other"
  const handleDomainChange = (item) => {
    // console.log("Selected domain:", item);
    handleChange("domain", item.value);
    if (item.value === "Other") {
      handleChange("customDomain", "");
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Step 1 - Basic Info</Text>

      <Text style={styles.label}>Agent Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter agent name"
        value={formData.agentName}
        onChangeText={(v) => handleChange("agentName", v)}
        accessible={true}
        accessibilityLabel="Agent Name"
      />

      <Text style={styles.label}>Domain *</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={domains}
        labelField="label"
        valueField="value"
        placeholder="Select a domain"
        value={formData.domain}
        onChange={handleDomainChange}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#F1F5F9"
        accessible={true}
        accessibilityLabel="Domain"
      />
      {formData.domain === "Other" && (
        <>
          <Text style={styles.label}>Custom Domain *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter custom domain"
            value={formData.domain || ""}
            onChangeText={(v) => handleChange("domain", v)}
            accessible={true}
            accessibilityLabel="Custom Domain"
          />
        </>
      )}

      <Text style={styles.label}>Sub Domain *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Mental Health"
        value={formData.subDomain}
        onChangeText={(v) => handleChange("subDomain", v)}
        accessible={true}
        accessibilityLabel="Sub Domain"
      />

      <Text style={styles.label}>Gender</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={genders}
        labelField="label"
        valueField="value"
        placeholder="Select gender"
        value={formData.gender}
        onChange={(item) => handleChange("gender", item.value)}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#F1F5F9"
        accessible={true}
        accessibilityLabel="Gender"
      />

      <Text style={styles.label}>Age Limit</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 18+"
        value={formData.ageLimit}
        onChangeText={(v) => handleChange("ageLimit", v)}
        accessible={true}
        accessibilityLabel="Age Limit"
      />

      <Text style={styles.label}>Language</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., English"
        value={formData.language}
        onChangeText={(v) => handleChange("language", v)}
        accessible={true}
        accessibilityLabel="Language"
      />
      
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
      <Text style={styles.label}>Voice Status</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{formData.voiceStatus ? "Enabled" : "Disabled"}</Text>
        <Switch
          value={formData.voiceStatus}
          onValueChange={(v) => handleChange("voiceStatus", v)}
          trackColor={{ false: "#E5E7EB", true: "#6366F1" }}
          thumbColor={formData.voiceStatus ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#E5E7EB"
          accessible={true}
          accessibilityLabel="Voice Status Toggle"
        />
      </View>
      </View>
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
    color: "#1F2937",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
    color: "#374151",
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
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    height: 50, // Consistent with input height
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    // marginBottom: 12,

  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginRight: 10,
  },
});

export default Step1;