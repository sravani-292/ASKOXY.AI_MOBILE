import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function TopTabBar({
  tabs = [],
  selectedKey,
  onTabPress,
  indicatorColor = '#4A148C',
}) {
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const tabRefs = useRef([]).current;

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.key === selectedKey);
    if (index !== -1) {
      setTimeout(() => measureAndAnimateIndicator(index), 100);
    }
  }, [selectedKey]);

  const handleTabPress = (index) => {
    onTabPress?.(tabs[index].key);
    measureAndAnimateIndicator(index);
  };

  const measureAndAnimateIndicator = (index) => {
    const ref = tabRefs[index];
    if (!ref) return;

    ref.measureLayout(scrollViewRef.current, (x, y, width) => {
      Animated.parallel([
        Animated.timing(indicatorPosition, {
          toValue: x,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(indicatorWidth, {
          toValue: width,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }, (err) => console.log('measure failed', err));
  };

  return (
    <View style={styles.tabBarContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.indicator,
            {
              left: indicatorPosition,
              width: indicatorWidth,
              backgroundColor: indicatorColor,
            },
          ]}
        />

        {tabs.map((tab, index) => {
          const isActive = tab.key === selectedKey;
          return (
            <TouchableOpacity
              key={tab.key}
              ref={(ref) => (tabRefs[index] = ref)}
              style={styles.tabButton}
              onPress={() => handleTabPress(index)}
            >
              <View style={styles.tabContent}>
                <FontAwesome5
                  name={isActive ? tab.activeIcon || tab.icon : tab.icon}
                  size={20}
                  color={isActive ? indicatorColor : '#95a5a6'}
                />
                <Text style={[styles.tabText, {
                  color: isActive ? indicatorColor : '#95a5a6',
                  fontWeight: isActive ? '900' : '400',
                }]}>
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  indicator: {
    position: 'absolute',
    height: 3,
    bottom: 0,
    borderRadius: 2,
  },
  tabButton: {
    paddingVertical: 18,
    paddingHorizontal: 22,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 18,
    marginLeft: 6,
  },
});
