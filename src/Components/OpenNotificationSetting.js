import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

const OpenSettingsModal = ({ visible, onClose }) => {
  const handleOpenSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert("Error", "Unable to open settings.");
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>🔔 Enable Notifications</Text>
          <Text style={styles.subtitle}>
            To get updates on special offers and your orders, please enable notifications from your phone settings.
          </Text>

          <TouchableOpacity onPress={handleOpenSettings} style={styles.settingsButton}>
            <Text style={styles.settingsText}>Open App Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default OpenSettingsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingsButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  settingsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    color: '#555',
    fontSize: 15,
  },
});
