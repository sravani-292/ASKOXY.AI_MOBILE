import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const InsuranceLLM = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleExploreInsurance = () => {
    navigation.navigate("GeneralLifeInsurance");
  };

  const handleFAQs = () => {
    console.log('Navigate to FAQ section');
    navigation.navigate("FAQ on LLM");
  };

  const handleFAQSlide = () => {
    console.log('Navigate to FAQ slides');
    navigation.navigate("FAQ on LLM Images");
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header with Back Navigation */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Insurance LLM</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.menuButton}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heading}>
          বিমা (Bimā) | બીમા (Bīma) | वीमा (Vīmā) | بیمه (Bīma) | बीमा (Bīma) | బీమా (Bīma)
        </Text>
        <Text style={styles.subtitle}>
          Comprehensive Insurance Solutions for India
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Ionicons name="shield-checkmark" size={28} color="#2563EB" />
          <Text style={styles.cardHeaderText}>Insurance in India</Text>
        </View>
        
        <Text style={styles.cardText}>
          In India, insurance is commonly called <Text style={styles.highlight}>Bīma (बीमा / బీమా)</Text> across most languages.
        </Text>
        
        <Text style={styles.cardText}>
          The Insurance Regulatory and Development Authority of India (IRDAI) has approved:
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>26</Text>
            <Text style={styles.statLabel}>Life Insurance Companies</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>33</Text>
            <Text style={styles.statLabel}>General Insurance Companies</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Reinsurance Companies</Text>
          </View>
        </View>
        
        <View style={styles.highlightBox}>
          <Ionicons name="people" size={20} color="#059669" />
          <Text style={styles.highlightText}>
            Citizens buy policies directly from <Text style={styles.boldHighlight}>59 companies</Text>, covering life, motor, health, and more.
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleExploreInsurance}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.primaryButtonText}>
            Let's Explore Life & General Insurance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleFAQs}
          activeOpacity={0.8}
        >
          <Ionicons name="help-circle" size={20} color="#2563EB" style={styles.buttonIcon} />
          <Text style={styles.secondaryButtonText}>
            Insurance AI LLM 100 FAQs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tertiaryButton}
          onPress={handleFAQSlide}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text" size={20} color="#6b7280" style={styles.buttonIcon} />
          <Text style={styles.tertiaryButtonText}>
            FAQ Slides
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default InsuranceLLM;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop:30
  },

  backButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },

  headerRight: {
    width: 44, 
    alignItems: 'center',
  },

  menuButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  scrollView: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },

  heading: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#0f172a',
    marginBottom: 12,
    lineHeight: 24,
    letterSpacing: -0.2,
    paddingHorizontal: 8,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#475569',
    letterSpacing: -0.3,
  },

  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#0f172a',
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  cardHeaderText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 12,
    letterSpacing: -0.4,
  },

  cardText: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 16,
    lineHeight: 24,
    fontWeight: '400',
  },

  highlight: {
    fontWeight: '700',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
    paddingVertical: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 4,
    letterSpacing: -0.5,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: -0.1,
  },

  highlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },

  highlightText: {
    flex: 1,
    fontSize: 15,
    color: '#065f46',
    marginLeft: 12,
    lineHeight: 22,
    fontWeight: '500',
  },

  boldHighlight: {
    fontWeight: '700',
    color: '#047857',
  },

  buttonsContainer: {
    gap: 16,
  },

  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { 
      width: 0, 
      height: 4 
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#1d4ed8',
  },

  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  secondaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
    shadowColor: '#64748b',
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  tertiaryButton: {
    backgroundColor: '#f8fafc',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { 
      width: 0, 
      height: 1 
    },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },

  tertiaryButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  buttonIcon: {
    marginRight: 10,
  },
});