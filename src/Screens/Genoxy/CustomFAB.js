import React, { useState } from "react";
import { View, Modal, TouchableOpacity, StyleSheet, Text } from "react-native";
import { FAB } from "react-native-paper";

const CustomFAB = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
   
  const onStateChange = ({ open }) => setIsModalVisible({ open });

  const { open } = isModalVisible;

  return (
    <>
      <FAB.Group
          open={open}
        //   visible
          style={styles.fab}
          icon={open ? 'close' : 'plus'}
          actions={[
            {
              icon: 'plus',
              label: 'Create Agent',
               onPress: () => {
                navigation.navigate("Agent Creation");
                setIsModalVisible(false);
              }
            },
            {
              icon: 'account',
              label: 'My Agents',
              onPress: () => {
                navigation.navigate("My Agents");
                setIsModalVisible(false);
              },
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
    </>
  );
};

export default CustomFAB;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 100,
    // backgroundColor: "#8B5CF6",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "40%",
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "500",
  },
});