import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MainCards = ({ onGetStartedPress }) => {
  const cardGradient = ['#6D28D9', '#A78BFA'];
  const buttonBlueGradient = ['#1E40AF', '#60A5FA'];
  const buttonPinkGradient = ['#BE185D', '#F472B6'];
  const buttonGreenGradient = ['#047857', '#34D399'];
  const navigation = useNavigation();

  return (
    <View style={styles.section}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.cardsContainer}
      >
        {/* Global Lending Management System Card */}
        <LinearGradient colors={cardGradient} style={styles.card}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.cardScrollContent}
          >
            <Text style={styles.cardTitle}>Global Lending Management System</Text>
            <Text style={styles.cardDescription}>
              A powerful, AI-enabled platform tailored for the BFSI sector.
              Features over 60+ industry use cases, 50+ expert roles, and inspired
              by Temenos, Finastra, FinOne, and TCS BaNCS.
            </Text>
            <Text style={styles.cardDescription}>
              Mission: Empower organizations to accelerate digital transformation
              and prepare 1M+ professionals for BFSI jobs.
            </Text>
          </ScrollView>

          <LinearGradient colors={buttonBlueGradient} style={styles.cardButton}>
            <TouchableOpacity onPress={onGetStartedPress}>
              <Text style={styles.cardButtonText}>Get Started →</Text>
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>

        {/* Latest Blogs Card */}
        <LinearGradient colors={cardGradient} style={styles.card}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.cardScrollContent}
          >
            <Text style={styles.cardTitle}>Latest Blogs</Text>
            <Text style={styles.cardDescription}>
              Dive into curated articles that explore the future of banking,
              financial technology innovations, AI-driven lending strategies, and
              in-depth professional insights from industry thought leaders.
            </Text>
            <Text style={styles.cardDescription}>
              Stay updated on regulatory changes, digital transformation trends,
              and success stories that empower BFSI professionals to remain
              competitive and informed in a rapidly evolving landscape.
            </Text>
          </ScrollView>

          <LinearGradient colors={buttonPinkGradient} style={styles.cardButton}>
            <TouchableOpacity onPress={() => navigation.navigate('My Blogs')}>
              <Text style={styles.cardButtonText}>Read Blogs →</Text>
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>

        {/* Explore Jobs Card */}
        <LinearGradient colors={cardGradient} style={styles.card}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.cardScrollContent}
          >
            <Text style={styles.cardTitle}>Explore Jobs</Text>
            <Text style={styles.cardDescription}>
              Discover curated job opportunities tailored for AI-savvy BFSI
              professionals across banking, insurance, fintech, and lending
              domains.
            </Text>
            <Text style={styles.cardDescription}>
              Gain access to exclusive roles ranging from data scientists,
              compliance analysts, digital transformation leads, to AI product
              managers. Apply directly through our platform and accelerate your
              career growth in the dynamic fintech ecosystem.
            </Text>
          </ScrollView>

          <LinearGradient colors={buttonGreenGradient} style={styles.cardButton}>
            <TouchableOpacity onPress={() => navigation.navigate('Find Jobs')}>
              <Text style={styles.cardButtonText}>View Jobs →</Text>
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 10,
    marginVertical: 30,
  },
  horizontalScroll: {
    paddingVertical: 10,
  },
  cardsContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width * 0.85,
    minHeight: 300,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardScrollContent: {
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  cardButton: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'center',
  },
  cardButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default MainCards;
