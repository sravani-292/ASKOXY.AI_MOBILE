import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const ProductHeader = ({
  searchText,
  setSearchText,
  handleClearText,
  cartData,
  cartCount,
  userData,
  navigation,
  setFilterModalVisible,
  selectedWeightFilter,
  filterByWeight,
  arrangeCategories = () => {}, // <-- Default empty function
  isCategoryTypeRice,
  // Add these new props for category types
  getAvailableCategoryTypes = () => [],
  selectedCategoryType,
  handleCategoryTypeChange,
  categoryTypeScrollViewRef,
}) => {
  return (
    <View style={styles.header}>
      {/* Search Bar Section */}
      <View style={styles.searchFilterRow}>
        <View
          style={[
            styles.searchContainer,
            !cartData || cartData.length === 0
              ? styles.fullWidth
              : styles.reducedWidth,
          ]}
        >
          <Icon
            name="search"
            size={20}
            color="#757575"
            style={styles.searchIcon}
          />

          <TextInput
            placeholder="Search for items..."
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              // filterItemsBySearch is called from parent
            }}
            onFocus={() => navigation.navigate("Search Screen")}
            style={styles.input}
            returnKeyType="search"
            clearButtonMode="never"
          />

          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={handleClearText}
              style={styles.clearButton}
            >
              <Icon name="close-circle" size={20} color="#757575" />
            </TouchableOpacity>
          )}
        </View>

        {userData && cartCount > 0 && (
          <Pressable
            // onPress={() => navigation.navigate("Home", { screen: "My Cart" })}
            onPress={() => navigation.navigate("My Cart")}
            style={styles.cartIconContainer}
          >
            <Icon name="cart-outline" size={32} color="#000" />

            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        )}
      </View>

      {/* Category Types Section */}
      <View style={styles.categoryTypesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={categoryTypeScrollViewRef}
          contentContainerStyle={styles.categoryTypesScrollContainer}
        >
          {getAvailableCategoryTypes().map((categoryType) => (
            <TouchableOpacity
              key={categoryType}
              onPress={() => handleCategoryTypeChange(categoryType)}
              style={[
                styles.categoryTypeButton,
                selectedCategoryType === categoryType &&
                  styles.selectedCategoryTypeButton,
              ]}
            >
              <Text
                style={[
                  styles.categoryTypeText,
                  selectedCategoryType === categoryType &&
                    styles.selectedCategoryTypeText,
                ]}
              >
                {categoryType}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Weight Filter Buttons */}
      {isCategoryTypeRice && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.weightFilterContainer}
          contentContainerStyle={styles.weightFilterContent}
        >
          <TouchableOpacity
            style={[
              styles.weightFilterButton,
              selectedWeightFilter === 1 && styles.selectedWeightFilterButton,
            ]}
            onPress={() => filterByWeight(1)}
          >
            <Text
              style={
                selectedWeightFilter === 1
                  ? styles.selectedWeightFilterText
                  : styles.weightFilterText
              }
            >
              1kg
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.weightFilterButton,
              selectedWeightFilter === 5 && styles.selectedWeightFilterButton,
            ]}
            onPress={() => filterByWeight(5)}
          >
            <Text
              style={
                selectedWeightFilter === 5
                  ? styles.selectedWeightFilterText
                  : styles.weightFilterText
              }
            >
              5kg
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.weightFilterButton,
              selectedWeightFilter === 10 && styles.selectedWeightFilterButton,
            ]}
            onPress={() => filterByWeight(10)}
          >
            <Text
              style={
                selectedWeightFilter === 10
                  ? styles.selectedWeightFilterText
                  : styles.weightFilterText
              }
            >
              10kg
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.weightFilterButton,
              selectedWeightFilter === 26 && styles.selectedWeightFilterButton,
            ]}
            onPress={() => filterByWeight(26)}
          >
            <Text
              style={
                selectedWeightFilter === 26
                  ? styles.selectedWeightFilterText
                  : styles.weightFilterText
              }
            >
              26kg
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 42,
  },
  fullWidth: {
    flex: 0.9,
  },
  reducedWidth: {
    flex: 0.95,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  cartIconContainer: {
    marginLeft: 8,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#6b21a8",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Category Types styles
  categoryTypesContainer: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  categoryTypesScrollContainer: {
    paddingHorizontal: 5,
  },
  categoryTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dee2e6",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategoryTypeButton: {
    backgroundColor: "#6b21a8",
    borderColor: "#6b21a8",
  },
  categoryTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#495057",
    textTransform: "capitalize",
  },
  selectedCategoryTypeText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  // Weight Filter styles
  weightFilterContainer: {
    marginBottom: 10,
  },
  weightFilterContent: {
    paddingHorizontal: 5,
  },
  weightFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 5,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  selectedWeightFilterButton: {
    backgroundColor: "#ddd6fe",
    borderColor: "#6b21a8",
  },
  weightFilterText: {
    fontSize: 14,
    color: "#4b5563",
  },
  selectedWeightFilterText: {
    fontSize: 14,
    color: "#6b21a8",
    fontWeight: "600",
  },
});

export default ProductHeader;