// components/IconTabBar.js
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { COLORS } from "../../../../Redux/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const IconTabBar = ({ 
  tabs = [], 
  selectedKey, 
  onTabPress,
  tabBarHeight = 65,
  showLabels = true,
  iconSize = 20,
  activeColor = "#ffffff",
  inactiveColor = "#d1d5db",
  backgroundColor = COLORS.services,
  indicatorColor = "#ffffff",
  indicatorHeight = 4,
  animationDuration = 300,
  tabSpacing = 12,
  enableShadow = false,
  scrollToCenter = true,
  disabled = false,
}) => {
  const scrollRef = useRef();
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const indicatorOpacity = useRef(new Animated.Value(0)).current;
  const [tabScales, setTabScales] = useState([]);

  // Initialize tabScales when tabs change
  useEffect(() => {
    setTabScales(tabs.map(() => new Animated.Value(1)));
  }, [tabs.length]);
  
  const [layoutMap, setLayoutMap] = useState({});
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);
  const [isLayoutComplete, setIsLayoutComplete] = useState(false);

  // Memoize current tab index for better performance
  const currentTabIndex = useMemo(() => 
    tabs.findIndex((t) => t.key === selectedKey), 
    [tabs, selectedKey]
  );

  const onTabLayout = useCallback((index, event) => {
    const { x, width } = event.nativeEvent.layout;
    setLayoutMap((prev) => {
      const newMap = { ...prev, [index]: { x, width } };
      
      // Check if all tabs have been laid out
      if (Object.keys(newMap).length === tabs.length) {
        setIsLayoutComplete(true);
      }
      
      return newMap;
    });
  }, [tabs.length]);

  const onContainerLayout = useCallback((event) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  // Enhanced animation effect
  useEffect(() => {
    if (!isLayoutComplete || currentTabIndex === -1 || !layoutMap[currentTabIndex]) {
      return;
    }

    const { x, width } = layoutMap[currentTabIndex];

    // Animate indicator with smoother spring animation
    const springConfig = {
      tension: 300,
      friction: 30,
      useNativeDriver: false,
    };

    Animated.parallel([
      Animated.spring(indicatorX, {
        toValue: x,
        ...springConfig,
      }),
      Animated.spring(indicatorWidth, {
        toValue: width,
        ...springConfig,
      }),
      Animated.timing(indicatorOpacity, {
        toValue: 1,
        duration: animationDuration / 2,
        useNativeDriver: false,
      }),
    ]).start();

    // Animate tab scales (subtle bounce effect for active tab)
    if (tabScales.length > 0) {
      tabScales.forEach((scale, index) => {
        Animated.spring(scale, {
          toValue: index === currentTabIndex ? 1.05 : 1,
          tension: 300,
          friction: 20,
          useNativeDriver: true,
        }).start();
      });
    }

    // Enhanced scroll centering
    if (scrollToCenter && scrollRef.current) {
      const scrollOffset = Math.max(0, x - (containerWidth - width) / 2);
      scrollRef.current.scrollTo({
        x: scrollOffset,
        animated: true,
      });
    }
  }, [
    selectedKey, 
    layoutMap, 
    containerWidth, 
    isLayoutComplete, 
    currentTabIndex,
    animationDuration,
    scrollToCenter,
    tabScales
  ]);

  const handleTabPress = useCallback((tabKey, index) => {
    if (disabled || !tabScales[index]) return;
    
    // Add subtle press animation
    Animated.sequence([
      Animated.timing(tabScales[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tabScales[index], {
        toValue: currentTabIndex === index ? 1.05 : 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onTabPress?.(tabKey);
  }, [onTabPress, disabled, tabScales, currentTabIndex]);

  // Memoize rendered tabs for performance
  const renderedTabs = useMemo(() => {
    if (tabScales.length === 0) return null;
    
    return tabs.map((tab, index) => {
      const isActive = tab.key === selectedKey;
      
      return (
        <Animated.View
          key={tab.key}
          style={{
            transform: [{ scale: tabScales[index] || new Animated.Value(1) }],
          }}
        >
          <TouchableOpacity
            onLayout={(e) => onTabLayout(index, e)}
            onPress={() => handleTabPress(tab.key, index)}
            style={[
              styles.tabButton,
              { 
                marginHorizontal: tabSpacing,
                opacity: disabled ? 0.5 : 1,
              }
            ]}
            activeOpacity={0.7}
            disabled={disabled}
          >
            <View style={[
              styles.iconContainer,
              isActive && styles.activeIconContainer
            ]}>
              <FontAwesome5
                name={tab.icon}
                size={iconSize}
                color={isActive ? activeColor : inactiveColor}
              />
            </View>
            
            {showLabels && (
              <Text
                style={[
                  styles.label,
                  {
                    color: isActive ? activeColor : inactiveColor,
                    fontWeight: isActive ? "700" : "500",
                  }
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {tab.label}
              </Text>
            )}
            
            {/* Badge support */}
            {tab.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {typeof tab.badge === 'number' && tab.badge > 99 ? '99+' : tab.badge}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      );
    });
  }, [
    tabs,
    selectedKey,
    tabScales,
    tabSpacing,
    disabled,
    iconSize,
    activeColor,
    inactiveColor,
    showLabels,
    onTabLayout,
    handleTabPress,
  ]);

  const containerStyle = [
    styles.container,
    {
      backgroundColor,
      height: tabBarHeight,
    },
    enableShadow && styles.shadow,
  ];

  return (
    <View style={containerStyle} onLayout={onContainerLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        decelerationRate="fast"
        snapToAlignment="center"
      >
        {renderedTabs}
      </ScrollView>

      {/* Enhanced Animated Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            height: indicatorHeight,
            backgroundColor: indicatorColor,
            width: indicatorWidth,
            opacity: indicatorOpacity,
            transform: [{ translateX: indicatorX }],
          },
        ]}
      />
      
      {/* Optional gradient overlay for better visual depth */}
      {enableShadow && (
        <View style={styles.gradientOverlay} pointerEvents="none" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingVertical: 12,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 4,
    position: 'relative',
    minWidth: 50,
  },
  iconContainer: {
    padding: 2,
    borderRadius: 8,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 80,
  },
  indicator: {
    position: "absolute",
    bottom: 4,
    borderRadius: 2,
    zIndex: 1,
    left: 0,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 12,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    pointerEvents: 'none',
  },
});

export default IconTabBar;