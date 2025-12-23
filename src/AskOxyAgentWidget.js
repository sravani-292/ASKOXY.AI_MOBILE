import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const AskOxyAgentWidget = ({ agentUrl }) => {
  const [visible, setVisible] = useState(false);

  if (!agentUrl) {
    return null; // no URL means no widget
  }

  return (
    <>
      {/* Floating Button */}
      <TouchableOpacity style={styles.floatingBtn} onPress={() => setVisible(true)}>
        <Text style={styles.floatingBtnIcon}>💬</Text>
      </TouchableOpacity>

      {/* Modal with WebView */}
      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>AskOxy Assistant</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setVisible(false)}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* WebView */}
          <WebView
            source={{ uri: agentUrl }}
            style={{ flex: 1 }}
            startInLoadingState={true}
          />

        </View>
      </Modal>
    </>
  );
};

export default AskOxyAgentWidget;

const styles = StyleSheet.create({
  floatingBtn: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#667eea",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  floatingBtnIcon: {
    fontSize: 32,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 60,
    backgroundColor: "#667eea",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  closeBtnText: {
    fontSize: 18,
    color: "#fff",
  },
});
