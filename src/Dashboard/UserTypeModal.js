import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
const { width } = Dimensions.get("window");

const UserTypeModal = ({ visible, onSubmit, onCancel }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);

  // User types with descriptions
  const userTypes = [
    {
      id: 1,
      name: "Partner",
      description: "Join as a business partner and collaborate with us",
      icon: "handshake",
      color: "#4CAF50",
    },
    {
      id: 2,
      name: "User",
      description: "Access our services as an individual user",
      icon: "person",
      color: "#2196F3",
    },
    {
      id: 3,
      name: "Freelancer",
      description: "Work with us as an independent professional",
      icon: "work",
      color: "#FF9800",
    },
  ];

  const toggleSelection = (userType) => {
    const isSelected = selectedTypes.find(item => item.id === userType.id);
    
    if (isSelected) {
      // Remove from selection
      setSelectedTypes(selectedTypes.filter(item => item.id !== userType.id));
    } else {
      // Add to selection
      setSelectedTypes([...selectedTypes, userType]);
    }
  };

  const handleSubmit = () => {
    if (selectedTypes.length === 0) {
      Alert.alert("Selection Required", "Please select at least one user type.");
      return;
    }

    // Create a formatted string of selected types
    const selectedString = selectedTypes.map(item => item.name).join(", ");
    
    // Reset selection for next time
    setSelectedTypes([]);
    
    // Call parent's submit handler
    onSubmit(selectedString);
  };

  const handleCancel = () => {
    setSelectedTypes([]);
    onCancel();
  };

  const isSelected = (typeId) => {
    return selectedTypes.find(item => item.id === typeId) !== undefined;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Join Us As</Text>
            <Text style={styles.subtitle}>
              Select how you'd like to engage with our platform
            </Text>
          </View>

          {/* User Types List */}
          <View style={styles.typesContainer}>
            {userTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeItem,
                  isSelected(type.id) && styles.selectedItem,
                  { borderColor: type.color }
                ]}
                onPress={() => toggleSelection(type)}
                activeOpacity={0.7}
              >
                <View style={styles.typeContent}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons 
                      name={type.icon} 
                      size={32} 
                      color={isSelected(type.id) ? "white" : type.color} 
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={[
                      styles.typeName,
                      isSelected(type.id) && styles.selectedText
                    ]}>
                      {type.name}
                    </Text>
                    <Text style={[
                      styles.typeDescription,
                      isSelected(type.id) && styles.selectedDescriptionText
                    ]}>
                      {type.description}
                    </Text>
                  </View>
                </View>
                
                <View style={[
                  styles.checkbox,
                  isSelected(type.id) && { backgroundColor: type.color, borderColor: type.color }
                ]}>
                  {isSelected(type.id) && (
                    <MaterialIcons name="check" size={18} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Selected Count */}
          {/* {selectedTypes.length > 0 && (
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionText}>
                {selectedTypes.length} type{selectedTypes.length > 1 ? 's' : ''} selected
              </Text>
            </View>
          )} */}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                selectedTypes.length === 0 && styles.disabledButton
              ]}
              onPress={handleSubmit}
              activeOpacity={0.7}
              disabled={selectedTypes.length === 0}
            >
              <Text style={[
                styles.submitButtonText,
                selectedTypes.length === 0 && styles.disabledButtonText
              ]}>
                Submit ({selectedTypes.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    maxHeight: '70%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  typesContainer: {
    marginBottom: 20,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedItem: {
    backgroundColor: '#e3f2fd',
    transform: [{ scale: 1.02 }],
  },
  typeContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  typeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedText: {
    color: '#1976d2',
  },
  typeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  selectedDescriptionText: {
    color: '#1565c0',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  selectionInfo: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  selectionText: {
    fontSize: 16,
    color: '#6f2dbd',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: '#6f2dbd',
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999',
  },
});

export default UserTypeModal;