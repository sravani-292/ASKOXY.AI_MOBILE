import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import TimeSlotModal from "./TimeSlotModal ";

export default function DateTimeSelector({
  days,
  timeSlots,
  selectedDay,
  selectedTimeSlot,
  updatedDate,
  modalVisible,
  onOpenModal,
  onCloseModal,
  onDayChange,
  onTimeSlotChange,
}) {
  if (Platform.OS === "ios") {
    return (
      <View style={styles.iosBox}>
        <Text style={styles.label}>
          {selectedDay
            ? "Your order will be delivered on:"
            : "Select Date & Time"}
        </Text>
        {selectedDay ? (
          <Text
            style={styles.value}
          >{`${updatedDate} (${selectedDay}), ${selectedTimeSlot}`}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <>
      {/* <TouchableOpacity style={styles.androidBtn} onPress={onOpenModal}>
        <Text style={styles.btnTxt}>
          {selectedDay ? `${updatedDate} (${selectedDay}), ${selectedTimeSlot}` : "Select Date & Time"}
        </Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={[styles.androidBtn, selectedDay && styles.androidBtnSelected]}
        onPress={onOpenModal}
        activeOpacity={0.8}
      >
        <View style={styles.btnContent}>
          {selectedDay ? (
            <>
              <Text style={styles.btnTxtSelected}>
                {updatedDate} ({selectedDay})
              </Text>
              <Text style={styles.btnTimeSelected}>{selectedTimeSlot}</Text>
            </>
          ) : (
            <Text style={styles.btnTxtPlaceholder}>Select Date & Time</Text>
          )}
        </View>
      </TouchableOpacity>
      <TimeSlotModal
        visible={modalVisible}
        onClose={onCloseModal}
        days={days}
        timeSlots={timeSlots}
        selectedDay={selectedDay}
        selectedTimeSlot={selectedTimeSlot}
        onDayChange={onDayChange}
        onTimeSlotChange={onTimeSlotChange}
        onConfirm={onCloseModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  iosBox: { marginVertical: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  value: { fontSize: 16 },
  androidBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 10,
    padding:15
  },
  btnTxt: { fontSize: 16, fontWeight: "bold" },
  androidBtn: {
    backgroundColor: "#D4EBF8",
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },

  androidBtnSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#4B0082",
    elevation: 4,
    shadowOpacity: 0.15,
  },

  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  btnTxtPlaceholder: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    flex: 1,
  },

  btnTxtSelected: {
    fontSize: 16,
    color: "#4B0082",
    fontWeight: "600",
    flex: 1,
  },

  btnTimeSelected: {
    fontSize: 14,
    color: "#4B0082",
    fontWeight: "500",
    marginLeft: 8,
  },
  btnIcon: {
    fontSize: 18,
    marginLeft: 12,
  },
});
