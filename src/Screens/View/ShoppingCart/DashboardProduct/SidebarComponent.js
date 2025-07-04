import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';
import { COLORS } from '../../../../../Redux/constants/theme';

const SidebarComponent = ({
  categories,
  arrangeCategories,
  selectedCategoryType,
  selectedCategory,
  filterByCategory,
  sidebarScrollViewRef,
  styles,
}) => {
  return (
    <ScrollView
      style={styles.sidebar}
      contentContainerStyle={styles.sidebarContent}
      ref={sidebarScrollViewRef}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        onPress={() => filterByCategory("All CATEGORIES")}
        style={[
          styles.sidebarItem,
          selectedCategory === "All CATEGORIES" && styles.selectedSidebarItem
        ]}
      >
        <View style={styles.sidebarImagePlaceholder}>
          <Text style={styles.sidebarImageText}>ALL</Text>
        </View>
        <Text 
          style={[
            styles.sidebarText,
            selectedCategory === "All CATEGORIES" && styles.selectedSidebarText
          ]}
          numberOfLines={2}
        >
          All Categories
        </Text>
      </TouchableOpacity>

      {arrangeCategories(categories, selectedCategoryType).map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => filterByCategory(category.categoryName)}
          style={[
            styles.sidebarItem,
            selectedCategory === category.categoryName && styles.selectedSidebarItem
          ]}
        >
          <Image
            source={{ uri: category.categoryLogo }}
            style={styles.sidebarImage}
            resizeMode="cover"
          />
          <Text 
            style={[
              styles.sidebarText,
              selectedCategory === category.categoryName && styles.selectedSidebarText
            ]}
            numberOfLines={2}
          >
            {category.categoryName}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default SidebarComponent;