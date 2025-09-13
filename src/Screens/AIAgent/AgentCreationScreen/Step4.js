import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const Step4 = ({ formData, handleChange }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.title}>Step 4 - Wrap Up</Text>
    <Text style={styles.label}>Conversation Starter 1</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g., Hi, how can I help?"
      value={formData.conStarter1}
      onChangeText={(v) => handleChange("conStarter1", v)}
      accessible={true}
      accessibilityLabel="Conversation Starter 1"
    />
    <Text style={styles.label}>Conversation Starter 2</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g., Tell me about your day"
      value={formData.conStarter2}
      onChangeText={(v) => handleChange("conStarter2", v)}
      accessible={true}
      accessibilityLabel="Conversation Starter 2"
    />
    <Text style={styles.label}>Conversation Starter 3</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g., What’s on your mind?"
      value={formData.conStarter3}
      onChangeText={(v) => handleChange("conStarter3", v)}
      accessible={true}
      accessibilityLabel="Conversation Starter 3"
    />
    <Text style={styles.label}>Conversation Starter 4</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g., Let's chat!"
      value={formData.conStarter4}
      onChangeText={(v) => handleChange("conStarter4", v)}
      accessible={true}
      accessibilityLabel="Conversation Starter 4"
    />
    <Text style={styles.label}>Contact Details</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g., email@example.com"
      value={formData.contactDetails}
      onChangeText={(v) => handleChange("contactDetails", v)}
      accessible={true}
      accessibilityLabel="Contact Details"
      keyboardType="email-address"
    />
    <Text style={styles.label}>User Role</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g., Admin, User"
      value={formData.userRole}
      onChangeText={(v) => handleChange("userRole", v)}
      accessible={true}
      accessibilityLabel="User Role"
    />
    <Text style={styles.label}>Feedback</Text>
    <TextInput
      style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
      placeholder="Share your thoughts"
      value={formData.shareYourFeedback}
      onChangeText={(v) => handleChange("shareYourFeedback", v)}
      multiline
      accessible={true}
      accessibilityLabel="Feedback"
    />
    <Text style={styles.label}>Rate This Platform (0-5) *</Text>
    <TextInput 
      style={styles.input}
      placeholder="e.g., 5"
      value={formData.rateThisPlatform.toString()} // Display as string
      onChangeText={(v) => handleChange("rateThisPlatform", v)} // Handled in parent
      keyboardType="numeric" // Fix: Numeric input
      accessible={true}
      accessibilityLabel="Platform Rating"
    />
    <Text style={styles.label}>User Experience (0-5) *</Text>
    <TextInput
      style={styles.input}
      placeholder="e.g., 4"
      value={formData.userExperience.toString()}
      onChangeText={(v) => handleChange("userExperience", v)}
      keyboardType="numeric"
      accessible={true}
      accessibilityLabel="User Experience Rating"
    />
  </View>
);

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
});

export default Step4;