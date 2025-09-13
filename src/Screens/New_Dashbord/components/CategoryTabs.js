import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced gradient themes for different categories
const categoryGradientThemes = {
  'RICE': {
    containerGradient: ['#FF9A9E', '#FECFEF'],
    activeGradient: ['#FF6B6B', '#FF8E8E'],
    inactiveColor: '#FFE5E5',
  },
  'Grocery': {
    containerGradient: ['#E6E6FA', '#D8BFD8'], // Lavender → Thistle
    activeGradient: ['#9370DB', '#BA55D3'],    // Medium Purple → Orchid
    inactiveColor: '#F3E5F5',                  // Light lavender-pink
  },
  'GOLD': {
    containerGradient: ['#FFB74D', '#FFF3E0'],
    activeGradient: ['#FF9800', '#FFB74D'],
    inactiveColor: '#FFF8E1',
  },
  'FESTIVAL': {
    containerGradient: ['#E1F5FE', '#F0F8FF'],
    activeGradient: ['#2196F3', '#42A5F5'],
    inactiveColor: '#E3F2FD',
  },
  'Meat': {
    containerGradient: ['#FFCDD2', '#F8BBD9'],
    activeGradient: ['#E91E63', '#F06292'],
    inactiveColor: '#FCE4EC',
  },
  'Beverages': {
    containerGradient: ['#E3F2FD', '#BBDEFB'],
    activeGradient: ['#2196F3', '#64B5F6'],
    inactiveColor: '#E1F5FE',
  },
  'default': {
    containerGradient: ['#F5F5F5', '#FFFFFF'],
    activeGradient: ['#4A148C', '#7B1FA2'],
    inactiveColor: '#f8f8f8',
  }
};


const CategoryTabs = ({ 
  categories = [], 
  activeTab = 'default', 
  setActiveTab = () => {}, 
  loading = false, 
  onTabPress = () => {}, 
  setIsLoading = () => {} 
}) => {
  // Always call hooks first, before any conditional logic
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Get current theme based on active tab
  const getCurrentTheme = () => {
    const theme = categoryGradientThemes[activeTab] || categoryGradientThemes['default'];
    return theme;
  };

  // Animate container when active tab changes
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 150,
          useNativeDriver: false,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [activeTab]);

  // Now do conditional rendering AFTER all hooks are called
  if (!categories || categories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading categories...</Text>
      </View>
    );
  }

  const CategoryButton = ({ category, isActive }) => {
    // Safety check for category object
    if (!category) {
      return null;
    }

    const currentTheme = getCurrentTheme();
    const iconBackgroundColor = isActive ? category.color || currentTheme.activeGradient[0] : currentTheme.inactiveColor;

    const handlePress = () => {
      try {
        if (setActiveTab && typeof setActiveTab === 'function') {
          setActiveTab(category.name);
        }
        if (onTabPress && typeof onTabPress === 'function') {
          onTabPress(category);
        }
        if (setIsLoading && typeof setIsLoading === 'function') {
          setIsLoading(true);
        }
      } catch (error) {
        console.error('Error in CategoryButton press:', error);
      }
    };

    return (
      <TouchableOpacity
        style={[
          styles.categoryTouchable,
          isActive && styles.activeCategoryButton,
        ]}
        onPress={handlePress}
        activeOpacity={0.6}
        disabled={loading}
      >
        <View style={styles.categoryIconContainer}>
          {isActive ? (
            <LinearGradient
              colors={category.color ? [category.color, `${category.color}88`] : currentTheme.activeGradient}
              style={styles.categoryIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.categoryEmoji, isActive && styles.activeCategoryEmoji]}>
                {category.icon || '📦'}
              </Text>
            </LinearGradient>
          ) : (
            <View style={[styles.categoryIcon, { backgroundColor: iconBackgroundColor }]}>
              <Text style={styles.categoryEmoji}>{category.icon || '📦'}</Text>
            </View>
          )}
          {isActive && (
            <LinearGradient
              colors={category.color ? [category.color, `${category.color}CC`] : currentTheme.activeGradient}
              style={styles.activeDot}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
        </View>

        <Text
          style={[
            styles.categoryText,
            isActive && [styles.activeCategoryText, { color: category.color || currentTheme.activeGradient[0] }],
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {category.name.toUpperCase() || 'Unknown'}
        </Text>

        {isActive && (
          <LinearGradient
            colors={category.color ? [category.color, `${category.color}AA`] : currentTheme.activeGradient}
            style={styles.activeIndicator}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const currentTheme = getCurrentTheme();

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <LinearGradient
        colors={currentTheme.containerGradient}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          decelerationRate="fast"
          scrollEventThrottle={16}
        >
          {categories && categories.length > 0 && categories.map((category) => {
            // Ensure category has required properties
            if (!category || !category.name) {
              return null;
            }
            
            return (
              <CategoryButton
                key={category.name}
                category={{
                  name: category.name || 'Unknown',
                  icon: category.icon || '📦',
                  color: category.color || currentTheme.activeGradient[0],
                  ...category
                }}
                isActive={activeTab === category.name}
              />
            );
          })}
        </ScrollView>

        <LinearGradient
          colors={[currentTheme.containerGradient[0], currentTheme.containerGradient[1], '#f0f0f0']}
          style={styles.bottomDivider}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
  },
  gradientBackground: {
    paddingBottom: 8,
  },
  scrollView: {
    paddingHorizontal: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  categoryTouchable: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    minWidth: 70,
    position: 'relative',
    marginRight: 24,
  },
  activeCategoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ scale: 1.05 }],
  },
  categoryIconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryEmoji: {
    fontSize: 26,
  },
  activeCategoryEmoji: {
    fontSize: 28,
    textShadowColor: '#00000030',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  activeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  categoryText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  activeCategoryText: {
    fontWeight: '700',
    fontSize: 14,
    textShadowColor: '#00000015',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 3,
    borderRadius: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  bottomDivider: {
    height: 2,
    marginHorizontal: 16,
    borderRadius: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    margin: 8,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default CategoryTabs;