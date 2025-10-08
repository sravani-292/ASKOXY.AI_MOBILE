import React, { useRef } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import MainCards from '../GLMS/MainCards';
import VideosSection from './VideosSection';
import LendingSystems from './LendingSystems';

const GlmsHome = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null); // Ref for ScrollView
  const mainCardsRef = useRef(null); // Ref for MainCards component

  // Function to scroll to MainCards
  const scrollToMainCards = () => {
    mainCardsRef.current.measure((x, y, width, height, pageX, pageY) => {
      scrollViewRef.current.scrollTo({ y: pageY, animated: true });
    });
  };

  return (
    <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View ref={mainCardsRef}>
          <MainCards onGetStartedPress={scrollToMainCards} />
           <VideosSection navigation={navigation} />
        <LendingSystems />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GlmsHome;