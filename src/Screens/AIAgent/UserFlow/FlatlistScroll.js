import React, { useRef, useState } from "react";
import { View, Text, Animated, StyleSheet, Dimensions, FlatList } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ColoredHorizontalScrollFlatList = ({ data, renderItem, keyExtractor }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(1);
  const [layoutWidth, setLayoutWidth] = useState(0);

  const indicatorWidth = layoutWidth * (layoutWidth / contentWidth);
  const translateX = Animated.multiply(scrollX, layoutWidth / contentWidth);

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  return (
    <View style={{ height: 120 }}>
      <AnimatedFlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onContentSizeChange={(w, h) => setContentWidth(w)}
        onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false} // hide default scrollbar
      />

      {/* Custom Horizontal Scroll Bar */}
      <View style={styles.scrollBarContainer}>
        <Animated.View
          style={[
            styles.scrollBar,
            { width: indicatorWidth, transform: [{ translateX }] },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollBarContainer: {
    position: "absolute",
    bottom: 2,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 2,
  },
  scrollBar: {
    height: 4,
    backgroundColor: "blue", // ✅ custom color
    borderRadius: 2,
  },
});

export default ColoredHorizontalScrollFlatList;
