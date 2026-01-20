import React from 'react';
import {
  StyleProp,
  ViewStyle,
  Animated,
  StyleSheet,
  Platform,
  ScrollView,
  Text,
  I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedFAB } from 'react-native-paper';

const AgentFAB = () => {
  const [isExtended, setIsExtended] = React.useState(true);

  const isIOS = Platform.OS === 'ios';

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  // Define FAB configuration internally
  const fabConfig = {
    icon: 'plus',
    label: 'Add Item',
    animateFrom: 'right',
    visible: true,
    iconMode: 'static',
  };

  // FAB style with adjustment for bottom navigation bar
  const fabStyle = { [fabConfig.animateFrom]: 16, bottom: 80 }; // Increased bottom padding to avoid navigation bar overlap

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView onScroll={onScroll}>
        {[...new Array(10).keys()].map((_, i) => (
          <Text key={i}>{i}</Text>
        ))}
      </ScrollView> */}
     
    </SafeAreaView>
  );
};

export default AgentFAB;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fabStyle: {
    position: 'absolute',
  },
});