import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

const FilterModal = ({
  filterModalVisible,
  setFilterModalVisible,
  sortOrder,
  setSortOrder,
  resetFilters,
  applyFilters
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.sortOptions}>
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  sortOrder === "weightAsc" && styles.selectedSortOption,
                ]}
                onPress={() => setSortOrder("weightAsc")}
              >
                <Text
                  style={
                    sortOrder === "weightAsc"
                      ? styles.selectedSortText
                      : styles.sortText
                  }
                >
                  Weight (Low to High)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  sortOrder === "weightDesc" && styles.selectedSortOption,
                ]}
                onPress={() => setSortOrder("weightDesc")}
              >
                <Text
                  style={
                    sortOrder === "weightDesc"
                      ? styles.selectedSortText
                      : styles.sortText
                  }
                >
                  Weight (High to Low)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  sortOrder === "priceAsc" && styles.selectedSortOption,
                ]}
                onPress={() => setSortOrder("priceAsc")}
              >
                <Text
                  style={
                    sortOrder === "priceAsc"
                      ? styles.selectedSortText
                      : styles.sortText
                  }
                >
                  Price (Low to High)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  sortOrder === "priceDesc" && styles.selectedSortOption,
                ]}
                onPress={() => setSortOrder("priceDesc")}
              >
                <Text
                  style={
                    sortOrder === "priceDesc"
                      ? styles.selectedSortText
                      : styles.sortText
                  }
                >
                  Price (High to Low)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  sortOptions: {
    flexDirection: "column",
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
  },
  selectedSortOption: {
    backgroundColor: "#ddd6fe",
  },
  sortText: {
    fontSize: 14,
    color: "#4b5563",
  },
  selectedSortText: {
    fontSize: 14,
    color: "#6b21a8",
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  resetButton: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  resetButtonText: {
    fontSize: 16,
    color: "#4b5563",
    fontWeight: "600",
  },
  applyButton: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6b21a8",
  },
  applyButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default FilterModal;
