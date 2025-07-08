import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();

  const handleCategoryPress = (categoryName) => {
    filterByCategory(categoryName);
    
    // Update the navigation title based on selection
    if (categoryName === "All CATEGORIES") {
      // When "All Categories" is selected, show the category type as the title
      navigation.setOptions({
        title: selectedCategoryType || "Rice Products"
      });
    } else {
      // When a specific category is selected, show that category name as the title
      navigation.setOptions({
        title: categoryName
      });
    }
  };

  return (
    <ScrollView
      style={styles.sidebar}
      contentContainerStyle={styles.sidebarContent}
      ref={sidebarScrollViewRef}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        onPress={() => handleCategoryPress("All CATEGORIES")}
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
          onPress={() => handleCategoryPress(category.categoryName)}
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