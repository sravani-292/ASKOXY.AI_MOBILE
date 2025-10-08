import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import RealtimeMainScreen from "./RealTimeMainScreenForCall";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function VoiceCallModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <RealtimeMainScreen onClose={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000812" },
});