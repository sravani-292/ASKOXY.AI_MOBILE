import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TopTabBarModal = ({ 
  visible, 
  onClose, 
  categories = [], 
  selectedCategory, 
  onCategorySelect,
  title = "Select Category",
  showCloseButton = true,
  animationType = "slide"
}) => {
  const [activeTab, setActiveTab] = useState(selectedCategory || null);

  // Enhanced gradient color mapping
  const getGradientForCategory = (categoryType) => {
    const colorMap = {
      'RICE': {
        gradientColors: ['#FF6B6B', '#FF8E8E'],
        bgColor: '#FFE8E8',
        shadowColor: '#FF6B6B'
      },
      'GROCERY': {
        gradientColors: ['#4ECDC4', '#6FE7DD'],
        bgColor: '#E8F9F8',
        shadowColor: '#4ECDC4'
      },
      'GOLD': {
        gradientColors: ['#FFD93D', '#FFE066'],
        bgColor: '#FFF8E1',
        shadowColor: '#FFD93D'
      },
      'VEGETABLES': {
        gradientColors: ['#4CAF50', '#66BB6A'],
        bgColor: '#E8F5E8',
        shadowColor: '#4CAF50'
      },
      'FRUITS': {
        gradientColors: ['#FF9800', '#FFB74D'],
        bgColor: '#FFF3E0',
        shadowColor: '#FF9800'
      },
      'DAIRY': {
        gradientColors: ['#2196F3', '#42A5F5'],
        bgColor: '#E3F2FD',
        shadowColor: '#2196F3'
      },
      'MEAT': {
        gradientColors: ['#F44336', '#EF5350'],
        bgColor: '#FFEBEE',
        shadowColor: '#F44336'
      },
      'BEVERAGES': {
        gradientColors: ['#9C27B0', '#BA68C8'],
        bgColor: '#F3E5F5',
        shadowColor: '#9C27B0'
      },
      'ELECTRONICS': {
        gradientColors: ['#607D8B', '#78909C'],
        bgColor: '#ECEFF1',
        shadowColor: '#607D8B'
      },
      'CLOTHING': {
        gradientColors: ['#E91E63', '#F06292'],
        bgColor: '#FCE4EC',
        shadowColor: '#E91E63'
      }
    };
    
    return colorMap[categoryType?.toUpperCase()] || {
      gradientColors: ['#9E9E9E', '#BDBDBD'],
      bgColor: '#F5F5F5',
      shadowColor: '#9E9E9E'
    };
  };

  // Process categories with enhanced data structure
  const processedCategories = categories.map((category, index) => {
    const categoryType = category.categoryType || category.type || category.name || category.category;
    const categoryId = category.id || category.categoryId || `category-${index}`;
    
    return {
      ...category,
      categoryType,
      id: categoryId,
      ...getGradientForCategory(categoryType)
    };
  });

  // Default categories for demonstration
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
    },
    { 
      categoryType: 'VEGETABLES',
      id: 'vegetables-default',
      ...getGradientForCategory('VEGETABLES')
    },
    { 
      categoryType: 'FRUITS',
      id: 'fruits-default',
      ...getGradientForCategory('FRUITS')
    },
    { 
      categoryType: 'DAIRY',
      id: 'dairy-default',
      ...getGradientForCategory('DAIRY')
    }
  ];

  const tabsToShow = processedCategories.length > 0 ? processedCategories : defaultCategories;
  const selectedTabData = tabsToShow.find(tab => 
    activeTab?.id === tab.id || 
    activeTab?.categoryType === tab.categoryType ||
    activeTab === tab.categoryType
  );

  const handleTabSelect = (category) => {
    setActiveTab(category);
    onCategorySelect && onCategorySelect(category);
  };

  const handleConfirm = () => {
    onClose && onClose(activeTab);
  };

  const handleCancel = () => {
    setActiveTab(selectedCategory);
    onClose && onClose(null);
  };

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      presentationStyle="fullScreen"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header with background gradient based on active tab */}
        <LinearGradient
          colors={selectedTabData ? 
            [...selectedTabData.gradientColors, selectedTabData.gradientColors[1] + '20'] : 
            ['#F8F9FA', '#FFFFFF']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerContainer}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>{title}</Text>
            
            <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
              <Text style={[styles.headerButtonText, styles.confirmButton]}>Done</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Tab Bar Container */}
        <View style={[
          styles.tabBarContainer,
          selectedTabData && {
            backgroundColor: selectedTabData.bgColor,
            shadowColor: selectedTabData.shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5
          }
        ]}>
          {/* Scrollable Tab Bar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            style={styles.tabScrollView}
          >
            <View style={styles.tabContainer}>
              {tabsToShow.map((category, index) => {
                const isActive = activeTab?.categoryType === category.categoryType || 
                               activeTab?.id === category.id ||
                               activeTab === category.categoryType;
                
                return (
                  <TouchableOpacity
                    key={category.id || `${category.categoryType}-${index}`}
                    onPress={() => handleTabSelect(category)}
                    style={[
                      styles.tab,
                      index === 0 && styles.tabFirst,
                      index === tabsToShow.length - 1 && styles.tabLast,
                      isActive && styles.tabActive
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
          </ScrollView>
          
          {/* Active Tab Indicator */}
          {selectedTabData && (
            <View style={styles.activeTabIndicator}>
              <LinearGradient
                colors={selectedTabData.gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.indicatorGradient}
              />
            </View>
          )}
        </View>

        {/* Content Area */}
        <ScrollView style={styles.contentContainer}>
          <View style={styles.contentArea}>
            {selectedTabData ? (
              <View style={styles.selectedCategoryInfo}>
                <Text style={styles.selectedCategoryTitle}>
                  Selected: {selectedTabData.categoryType}
                </Text>
                <View style={[
                  styles.selectedCategoryCard,
                  { backgroundColor: selectedTabData.bgColor }
                ]}>
                  <LinearGradient
                    colors={selectedTabData.gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.categoryCardGradient}
                  >
                    <Text style={styles.categoryCardText}>
                      {selectedTabData.categoryType}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
            ) : (
              <View style={styles.placeholderContent}>
                <Text style={styles.placeholderText}>
                  Select a category from the tabs above
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 60,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  confirmButton: {
    color: '#007AFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    position: 'relative',
  },
  tabScrollView: {
    flexGrow: 0,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    borderRadius: 6,
    marginHorizontal: 4,
    overflow: 'hidden',
    minHeight: 44,
    minWidth: 80,
  },
  tabActive: {
    transform: [{ scale: 1.05 }],
  },
  tabActiveGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tabInactive: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabFirst: {
    marginLeft: 0,
  },
  tabLast: {
    marginRight: 0,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  indicatorGradient: {
    flex: 1,
    height: 3,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentArea: {
    padding: 20,
  },
  selectedCategoryInfo: {
    alignItems: 'center',
  },
  selectedCategoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 20,
  },
  selectedCategoryCard: {
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryCardGradient: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCardText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
};

export default TopTabBarModal;