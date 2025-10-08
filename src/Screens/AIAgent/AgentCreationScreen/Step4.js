import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import BASE_URL from "../../../../Config";
import { useSelector } from "react-redux";


const Step4 = ({ formData, handleChange }) => {
  const [showVoiceInfo, setShowVoiceInfo] = useState(false);
  const user = useSelector(state => state.counter);
  const token = user.accessToken;
  const userId = user.userId;

  useEffect(()=>{
  getProfile();
},[])

const getProfile=()=>{
  axios.get(`${BASE_URL}user-service/getProfile/${userId}`)
  .then((response)=>{
    console.log("Profile data",response.data);
    // setPersonalDetails(response.data);
     if (response.data?.userName) {
          handleChange("creatorName", response.data.userName);
        }
  })
  .catch((error)=>{
    console.log("Profile error",error); 
  })
}
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Step 4 - Wrap Up</Text>

      <Text style={styles.sectionTitle}>
        Do you want to share Contact Details?
      </Text>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleOption}>Yes</Text>
        <Switch
          value={formData.shareContactDetails === "Yes"}
          onValueChange={(value) =>
            handleChange("shareContactDetails", value ? "Yes" : "No")
          }
          accessibilityLabel="Share Contact Details"
        />
        <Text style={styles.toggleOption}>No</Text>
        <Switch
          value={formData.shareContactDetails === "No"}
          onValueChange={(value) =>
            handleChange("shareContactDetails", value ? "No" : "Yes")
          }
          accessibilityLabel="Don't Share Contact Details"
        />
      </View>

      <Text style={styles.sectionTitle}>Conversation Starter 1</Text>
      <TextInput
        style={styles.input}
        placeholder='e.g., "What service do you need help with today?"'
        placeholderTextColor={"#94A3B8"}
        value={formData.conStarter1}
        onChangeText={(v) => handleChange("conStarter1", v)}
        accessible={true}
        accessibilityLabel="Conversation Starter 1"
      />

      <Text style={styles.sectionTitle}>Conversation Starter 2</Text>
      <TextInput
        style={styles.input}
        placeholder='e.g., "Share your case details..."'
        placeholderTextColor={"#94A3B8"}
        value={formData.conStarter2}
        onChangeText={(v) => handleChange("conStarter2", v)}
        accessible={true}
        accessibilityLabel="Conversation Starter 2"
      />

      <Text style={styles.sectionTitle}>Conversation Starter 3</Text>
      <TextInput
        style={styles.input}
        placeholder='e.g., "Do you want a document template?"'
        placeholderTextColor={"#94A3B8"}
        value={formData.conStarter3}
        onChangeText={(v) => handleChange("conStarter3", v)}
        accessible={true}
        accessibilityLabel="Conversation Starter 3"
      />

      <Text style={styles.sectionTitle}>Conversation Starter 4</Text>
      <TextInput
        style={styles.input}
        placeholder='e.g., "Prefer English/@cwfx/read?"'
        placeholderTextColor={"#94A3B8"}
        value={formData.conStarter4}
        onChangeText={(v) => handleChange("conStarter4", v)}
        accessible={true}
        accessibilityLabel="Conversation Starter 4"
      />

      {/* <Text style={styles.sectionTitle}>Active Status</Text> */}
      <View style={styles.switchContainer}>
      <Text style={styles.sectionTitle}>Active Status</Text>
        <Switch
          value={formData.activeStatus}
          onValueChange={(value) => handleChange("activeStatus", value)}
          accessibilityLabel="Active Status"
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.sectionTitle}>Text Chat</Text>
        <View style={styles.voiceHeader}>
          <Text style={styles.sectionTitle}>Voice</Text>
          <TouchableOpacity
            onPress={() => setShowVoiceInfo(true)}
            style={{ marginTop: 5 }}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#007AFF"
              style={styles.infoIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.switchContainer}>
        <View
          style={{ backgroundColor: "#c0c0c0", padding: 5, borderRadius: 5 }}
        >
          <Text>Active(default)</Text>
        </View>
        <View
          style={{ backgroundColor: "#c0c0c0", padding: 5, borderRadius: 5 }}
        >
          <Text>Disabled</Text>
        </View>
      </View>

      {/* <View style={styles.switchContainer}>
        <View></View>
        <Text style={styles.voiceInfoText}>
          It may launch soon and price is applicable.
        </Text>
      </View> */}

      {/* Voice Info Modal */}
      <Modal
        visible={showVoiceInfo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVoiceInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Voice Feature Information</Text>
            <Text style={styles.modalText}>
              It may launch soon and price is applicable.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowVoiceInfo(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#1F2937",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
    color: "#374151",
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
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleOption: {
    marginRight: 8,
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  voiceHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginLeft: 8,
  },
  voiceInfoText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Step4;
