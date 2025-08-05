import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RadioGroup from 'react-native-radio-buttons-group';

const { width } = Dimensions.get('window');

const TimeSlotModal = ({
  visible,
  onClose,
  days,
  timeSlots,
  selectedDay,
  selectedTimeSlot,
  onDayChange,
  onTimeSlotChange,
  onConfirm,
}) => {

  const radioButtonsData = timeSlots.map((slot) => ({
    id: slot,
    label: slot,
    value: slot,
    selected: slot === selectedTimeSlot,
  }));

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Delivery Date & Time</Text>

          <Text style={styles.label}>Select Date:</Text>
          {Platform.OS === 'android' ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDay}
                onValueChange={(itemValue) => onDayChange(itemValue)}
                style={styles.picker}
              >
                {days.map((day) => (
                  <Picker.Item key={day.value} label={day.label} value={day.value} />
                ))}
              </Picker>
            </View>
          ) : (
            <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedDay}
              onValueChange={(itemValue) => onDayChange(itemValue)}
              style={styles.picker}
            >
              {days.map((day) => (
                <Picker.Item key={day.value} label={day.label} value={day.value} />
              ))}
            </Picker>
          </View>
          )}
          
          <Text style={styles.label}>Select Time Slot:</Text>
          {Platform.OS === 'android' ? (
            <View style={styles.radioGroupContainer}>
              <RadioGroup 
                radioButtons={radioButtonsData}
                onPress={(id) => onTimeSlotChange(id)}
                selectedId={selectedTimeSlot}
                layout="column"
              />
            </View>
          ) : (
            <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTimeSlot}
              onValueChange={(itemValue) => onTimeSlotChange(itemValue)}
              style={styles.picker}
            >
              {timeSlots.map((slot) => (
                <Picker.Item key={slot} label={slot} value={slot} />
              ))}
            </Picker>
          </View>
          )}


          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  radioGroupContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimeSlotModal;