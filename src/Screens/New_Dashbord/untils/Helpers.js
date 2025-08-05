const getCategoryDetails = (categoryType) => {
  // Predefined category mappings
  const categoryMappings = {
    'RICE': { icon: '🍚', color: '#FF6B35' },
    'Grocery': { icon: '🛒', color: '#4CAF50' },
    'GOLD': { icon: '🪙', color: '#FFD700' },
    'FESTIVAL': { icon: '🎉', color: '#9C27B0' },
    'ELECTRONICS': { icon: '📱', color: '#2196F3' },
    'CLOTHING': { icon: '👕', color: '#E91E63' },
    'BOOKS': { icon: '📚', color: '#795548' },
    'HEALTH': { icon: '🏥', color: '#4CAF50' },
    'BEAUTY': { icon: '💄', color: '#FF69B4' },
    'SPORTS': { icon: '⚽', color: '#FF5722' },
    'TOYS': { icon: '🧸', color: '#FFC107' },
    'AUTOMOTIVE': { icon: '🚗', color: '#607D8B' },
    'HOME': { icon: '🏠', color: '#8BC34A' },
    'FURNITURE': { icon: '🪑', color: '#A0522D' },
    'TOOLS': { icon: '🔧', color: '#9E9E9E' },
    'GARDEN': { icon: '🌱', color: '#4CAF50' },
    'PET': { icon: '🐕', color: '#FF9800' },
    'FOOD': { icon: '🍕', color: '#FF5722' },
    'DRINKS': { icon: '🥤', color: '#03A9F4' },
    'PHARMACY': { icon: '💊', color: '#009688' },
  };

  // Check if we have a predefined mapping
  if (categoryMappings[categoryType]) {
    return categoryMappings[categoryType];
  }

  // Auto-generate for unknown categories
  return generateCategoryDetails(categoryType);
};

// Auto-generate icon and color for unknown categories
const generateCategoryDetails = (categoryType) => {
  // Color palette for auto-generation
  const colors = [
    '#FF6B35', '#4CAF50', '#2196F3', '#9C27B0', '#FF5722',
    '#607D8B', '#795548', '#E91E63', '#FF9800', '#009688',
    '#FFC107', '#8BC34A', '#3F51B5', '#00BCD4', '#CDDC39',
    '#673AB7', '#F44336', '#9E9E9E', '#FFEB3B', '#FF69B4'
  ];

  // Generate a consistent color based on category name
  const colorIndex = categoryType.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  
  // Generate icon based on category name patterns
  const getIconByPattern = (name) => {
    const lowerName = name.toLowerCase();
    
    // Common patterns
    if (lowerName.includes('food') || lowerName.includes('eat')) return '🍽️';
    if (lowerName.includes('drink') || lowerName.includes('beverage')) return '🥤';
    if (lowerName.includes('tech') || lowerName.includes('electronic')) return '📱';
    if (lowerName.includes('cloth') || lowerName.includes('fashion')) return '👕';
    if (lowerName.includes('book') || lowerName.includes('read')) return '📚';
    if (lowerName.includes('health') || lowerName.includes('medical')) return '🏥';
    if (lowerName.includes('beauty') || lowerName.includes('cosmetic')) return '💄';
    if (lowerName.includes('sport') || lowerName.includes('fitness')) return '⚽';
    if (lowerName.includes('toy') || lowerName.includes('game')) return '🧸';
    if (lowerName.includes('car') || lowerName.includes('auto')) return '🚗';
    if (lowerName.includes('home') || lowerName.includes('house')) return '🏠';
    if (lowerName.includes('furniture')) return '🪑';
    if (lowerName.includes('tool')) return '🔧';
    if (lowerName.includes('garden') || lowerName.includes('plant')) return '🌱';
    if (lowerName.includes('pet') || lowerName.includes('animal')) return '🐕';
    if (lowerName.includes('travel') || lowerName.includes('trip')) return '✈️';
    if (lowerName.includes('music') || lowerName.includes('audio')) return '🎵';
    if (lowerName.includes('office') || lowerName.includes('work')) return '💼';
    if (lowerName.includes('baby') || lowerName.includes('kid')) return '👶';
    
    // Default fallback
    return '📦';
  };

  return {
    icon: getIconByPattern(categoryType),
    color: colors[colorIndex]
  };
};

// Transform your data to work with CategoryTabs
export const transformCategories = (getCategories) => {
  return getCategories.map((cat) => {
    const details = getCategoryDetails(cat.categoryType);
    return {
      name: cat.categoryType,
      icon: details.icon,
      color: details.color,
      categories: cat.categories // Keep the original categories array if needed
    };
  });
};

