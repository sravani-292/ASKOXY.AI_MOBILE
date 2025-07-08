// components/FilterModal.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const FilterModal = ({
  visible,
  onClose,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedCategories,
  selectedCategoryTypes,
  availableCategories,
  availableCategoryTypes,
  sortOption,
  setSortOption,
  toggleCategoryFilter,
  toggleCategoryTypeFilter,
  applyFilters,
  resetFilters
}) => {
  const [activeTab, setActiveTab] = React.useState('price'); // 'price', 'category', 'sort'

  // Group categories by category type for better organization
  const groupedCategories = availableCategories.reduce((acc, category) => {
    if (!acc[category.categoryType]) {
      acc[category.categoryType] = [];
    }
    acc[category.categoryType].push(category.name);
    return acc;
  }, {});

  // Render filter tab content based on active tab
  const renderFilterTabContent = () => {
    switch (activeTab) {
      case 'price':
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <View style={styles.priceInputContainer}>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.priceInputLabel}>Min</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="₹0"
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.priceSeparator} />
              <View style={styles.priceInputWrapper}>
                <Text style={styles.priceInputLabel}>Max</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="₹5000"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        );
      
      case 'category':
        return (
          <>
            {/* Category Type Filter */}
            {availableCategoryTypes.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Category Type</Text>
                <View style={styles.categoryTypeContainer}>
                  {availableCategoryTypes.map((categoryType) => (
                    <TouchableOpacity
                      key={categoryType}
                      style={[
                        styles.categoryTypeChip,
                        selectedCategoryTypes.includes(categoryType) && styles.categoryTypeChipSelected
                      ]}
                      onPress={() => toggleCategoryTypeFilter(categoryType)}
                    >
                      <Text 
                        style={[
                          styles.categoryTypeChipText,
                          selectedCategoryTypes.includes(categoryType) && styles.categoryTypeChipTextSelected
                        ]}
                      >
                        {categoryType}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            {/* Categories organized by category type */}
            {Object.keys(groupedCategories).length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Categories</Text>
                {Object.entries(groupedCategories).map(([categoryType, categories]) => (
                  <View key={categoryType} style={styles.categoryGroup}>
                    <Text style={styles.categoryGroupTitle}>{categoryType}</Text>
                    <View style={styles.categoryContainer}>
                      {categories.map((category) => (
                        <TouchableOpacity
                          key={category}
                          style={[
                            styles.categoryChip,
                            selectedCategories.includes(category) && styles.categoryChipSelected
                          ]}
                          onPress={() => toggleCategoryFilter(category)}
                        >
                          <Text 
                            style={[
                              styles.categoryChipText,
                              selectedCategories.includes(category) && styles.categoryChipTextSelected
                            ]}
                          >
                            {category}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        );
      
      case 'sort':
        return (
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <TouchableOpacity
              style={[styles.sortOption, sortOption === 'default' && styles.sortOptionSelected]}
              onPress={() => setSortOption('default')}
            >
              <Text style={[styles.sortOptionText, sortOption === 'default' && styles.sortOptionTextSelected]}>
                Default
              </Text>
              {sortOption === 'default' && <MaterialIcons name="check" size={18} color="#6b21a8" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.sortOption, sortOption === 'priceLowToHigh' && styles.sortOptionSelected]}
              onPress={() => setSortOption('priceLowToHigh')}
            >
              <Text style={[styles.sortOptionText, sortOption === 'priceLowToHigh' && styles.sortOptionTextSelected]}>
                Price: Low to High
              </Text>
              {sortOption === 'priceLowToHigh' && <MaterialIcons name="check" size={18} color="#6b21a8" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.sortOption, sortOption === 'priceHighToLow' && styles.sortOptionSelected]}
              onPress={() => setSortOption('priceHighToLow')}
            >
              <Text style={[styles.sortOptionText, sortOption === 'priceHighToLow' && styles.sortOptionTextSelected]}>
                Price: High to Low
              </Text>
              {sortOption === 'priceHighToLow' && <MaterialIcons name="check" size={18} color="#6b21a8" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.sortOption, sortOption === 'nameAZ' && styles.sortOptionSelected]}
              onPress={() => setSortOption('nameAZ')}
            >
              <Text style={[styles.sortOptionText, sortOption === 'nameAZ' && styles.sortOptionTextSelected]}>
                Name: A to Z
              </Text>
              {sortOption === 'nameAZ' && <MaterialIcons name="check" size={18} color="#6b21a8" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.sortOption, sortOption === 'nameZA' && styles.sortOptionSelected]}
              onPress={() => setSortOption('nameZA')}
            >
              <Text style={[styles.sortOptionText, sortOption === 'nameZA' && styles.sortOptionTextSelected]}>
                Name: Z to A
              </Text>
              {sortOption === 'nameZA' && <MaterialIcons name="check" size={18} color="#6b21a8" />}
            </TouchableOpacity>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'price' && styles.activeTab]}
              onPress={() => setActiveTab('price')}
            >
              <MaterialIcons 
                name="attach-money" 
                size={20} 
                color={activeTab === 'price' ? "#6b21a8" : "#6b7280"} 
              />
              <Text style={[styles.tabText, activeTab === 'price' && styles.activeTabText]}>
                Price
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'category' && styles.activeTab]}
              onPress={() => setActiveTab('category')}
            >
              <MaterialIcons 
                name="category" 
                size={20} 
                color={activeTab === 'category' ? "#6b21a8" : "#6b7280"} 
              />
              <Text style={[styles.tabText, activeTab === 'category' && styles.activeTabText]}>
                Category
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'sort' && styles.activeTab]}
              onPress={() => setActiveTab('sort')}
            >
              <MaterialIcons 
                name="sort" 
                size={20} 
                color={activeTab === 'sort' ? "#6b21a8" : "#6b7280"} 
              />
              <Text style={[styles.tabText, activeTab === 'sort' && styles.activeTabText]}>
                Sort
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            {renderFilterTabContent()}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6b21a8',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#6b21a8',
    fontWeight: '600',
  },
  modalBody: {
    padding: 16,
    maxHeight: '60%',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#6b21a8',
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#6b21a8',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    backgroundColor: '#6b21a8',
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceInputLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  priceSeparator: {
    width: 12,
    height: 1,
    backgroundColor: '#d1d5db',
    marginHorizontal: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  categoryTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryTypeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryTypeChipSelected: {
    backgroundColor: '#ddd6fe',
    borderColor: '#6b21a8',
  },
  categoryTypeChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  categoryTypeChipTextSelected: {
    color: '#6b21a8',
    fontWeight: '600',
  },
  categoryGroup: {
    marginBottom: 16,
  },
  categoryGroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#ddd6fe',
    borderWidth: 1,
    borderColor: '#6b21a8',
  },
  categoryChipText: {
    fontSize: 12,
    color: '#4b5563',
  },
  categoryChipTextSelected: {
    color: '#6b21a8',
    fontWeight: '600',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sortOptionSelected: {
    backgroundColor: '#f5f3ff',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#4b5563',
  },
  sortOptionTextSelected: {
    color: '#6b21a8',
    fontWeight: '600',
  },
});

export default FilterModal;