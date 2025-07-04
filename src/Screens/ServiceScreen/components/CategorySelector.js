import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import styles from "./styles/CategorySelectorStyles";

const CategorySelector = ({ categories = [], selected, onSelect }) => {
  // Function to assign gradient colors to categories from response
  const getGradientForCategory = (categoryType) => {
    const colorMap = {
      'RICE': {
        gradientColors: ['#FF6B6B', '#FF8E8E'],
        bgColor: '#FFE8E8'
      },
      'GROCERY': {
        gradientColors: ['#4ECDC4', '#6FE7DD'],
        bgColor: '#E8F9F8'
      },
      'GOLD': {
        gradientColors: ['#FFD93D', '#FFE066'],
        bgColor: '#FFF8E1'
      },
      'VEGETABLES': {
        gradientColors: ['#4CAF50', '#66BB6A'],
        bgColor: '#E8F5E8'
      },
      'FRUITS': {
        gradientColors: ['#FF9800', '#FFB74D'],
        bgColor: '#FFF3E0'
      },
      'DAIRY': {
        gradientColors: ['#2196F3', '#42A5F5'],
        bgColor: '#E3F2FD'
      },
      'MEAT': {
        gradientColors: ['#F44336', '#EF5350'],
        bgColor: '#FFEBEE'
      },
      'BEVERAGES': {
        gradientColors: ['#9C27B0', '#BA68C8'],
        bgColor: '#F3E5F5'
      },
      'ELECTRONICS': {
        gradientColors: ['#607D8B', '#78909C'],
        bgColor: '#ECEFF1'
      },
      'CLOTHING': {
        gradientColors: ['#E91E63', '#F06292'],
        bgColor: '#FCE4EC'
      }
    };
    
    return colorMap[categoryType?.toUpperCase()] || {
      gradientColors: ['#9E9E9E', '#BDBDBD'],
      bgColor: '#F5F5F5'
    };
  };

  // Process categories from API response and add gradient colors
  const processedCategories = categories.map(category => {
    // Handle different possible API response structures
    const categoryType = category.categoryType || category.type || category.name || category.category;
    const categoryId = category.id || category.categoryId;
    
    return {
      ...category,
      categoryType,
      id: categoryId,
      ...getGradientForCategory(categoryType)
    };
  });

  // Default categories for fallback when no API data
  const defaultCategories = [
    { 
      categoryType: 'RICE',
      id: 'rice-default',
      ...getGradientForCategory('RICE')
    },
    { 
      categoryType: 'GROCERY',
      id: 'grocery-default',
      ...getGradientForCategory('GROCERY')
    },
    { 
      categoryType: 'GOLD',
      id: 'gold-default',
      ...getGradientForCategory('GOLD')
    }
  ];

  const tabsToShow = processedCategories.length > 0 ? processedCategories : defaultCategories;

  return (
    <View style={styles.tabContainer}>
      {tabsToShow.map((category, index) => {
        // Handle different selection comparison methods
        const isActive = selected?.categoryType === category.categoryType || 
                         selected?.id === category.id ||
                         selected === category.categoryType;
        
        return (
          <TouchableOpacity
            key={category.id || `${category.categoryType}-${index}`}
            onPress={() => onSelect(category)}
            style={[
              styles.tab,
              index === 0 && styles.tabFirst,
              index === tabsToShow.length - 1 && styles.tabLast,
            ]}
            activeOpacity={0.7}
          >
            {isActive ? (
              <LinearGradient
                colors={category.gradientColors || ['#007AFF', '#0056CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tabActiveGradient}
              >
                <Text style={styles.tabTextActive}>
                  {category.categoryType}
                </Text>
              </LinearGradient>
            ) : (
              <View style={[
                styles.tabInactive,
                { backgroundColor: category.bgColor || '#F8F9FA' }
              ]}>
                <Text style={styles.tabText}>
                  {category.categoryType}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CategorySelector;