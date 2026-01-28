// components/LendingSystems.js
import { Navigation } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

const LendingSystems = () => {
  const navigation=useNavigation()
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Global Lending Management Systems</Text>
      <Text style={styles.sectionSubtitle}>
        Streamline every phase of the loan lifecycle — from origination to collections and servicing.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.subCardsContainer}
      >
        {/* Loan Origination */}
        <View style={styles.subCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.subCardIcon}>👤</Text>
          </View>
          <Text style={styles.subCardTitle}>Loan Origination System</Text>
          <Text style={styles.subCardDescription}>
            Optimized workflows for onboarding and expanding your customer base efficiently.
          </Text>
          <Text style={styles.keyUseCasesTitle}>Key Use Cases</Text>
          <View style={styles.useCasesContainer}>
            <Text style={styles.keyUseCases}>• Customer ID Creation: Seamless identity creation for new customers</Text>
            <Text style={styles.keyUseCases}>• Linking Co-applicant & Guarantor: Connect multiple stakeholders to a single application</Text>
            <Text style={styles.keyUseCases}>• Customer to Loan Mapping: Assign IDs to loans automatically</Text>
            <Text style={styles.keyUseCases}>• Loan Appraisal Workflow: Evaluate & process loans with predefined workflows</Text>
          </View>
          <TouchableOpacity style={styles.learnMoreButton} onPress={()=>navigation.navigate('UseCases',{dashboard:'LOS Dashboard'})}>
            <Text style={styles.learnMoreText}>Learn More →</Text>
          </TouchableOpacity>
        </View>

        {/* Financial Management */}
        <View style={styles.subCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.subCardIcon}>💰</Text>
          </View>
          <Text style={styles.subCardTitle}>Financial Management System</Text>
          <Text style={styles.subCardDescription}>
            End-to-end financial tracking, processing, and reporting for loan servicing.
          </Text>
          <Text style={styles.keyUseCasesTitle}>Key Use Cases</Text>
          <View style={styles.useCasesContainer}>
            <Text style={styles.keyUseCases}>• Asset Details: Auto-compute interests based on rules</Text>
            <Text style={styles.keyUseCases}>• PDC Printing: Apply and track fees across accounts</Text>
            <Text style={styles.keyUseCases}>• Installment Prepayment: Real-time ledger updates and audits</Text>
            <Text style={styles.keyUseCases}>• NPA Grading: Generate balance sheets and statements</Text>
          </View>
          <TouchableOpacity style={styles.learnMoreButton} onPress={()=>navigation.navigate("UseCases",{dashboard:'FMS Dashboard'})}>
            <Text style={styles.learnMoreText}>Learn More →</Text>
          </TouchableOpacity>
        </View>

        {/* Collections Management */}
        <View style={styles.subCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.subCardIcon}>📋</Text>
          </View>
          <Text style={styles.subCardTitle}>Collections Management</Text>
          <Text style={styles.subCardDescription}>
            Tools to manage recovery, reduce delinquency, and automate collection processes.
          </Text>
          <Text style={styles.keyUseCasesTitle}>Key Use Cases</Text>
          <View style={styles.useCasesContainer}>
            <Text style={styles.keyUseCases}>• Allocation Hold: Monitor outstanding debts with ease</Text>
            <Text style={styles.keyUseCases}>• Default Allocation Contract: Automated reminders and communications within system</Text>
            <Text style={styles.keyUseCases}>• Manual Allocation: Customizable repayment timelines</Text>
            <Text style={styles.keyUseCases}>• Manual Reallocation: Seamless payment handling within system</Text>
          </View>
          <TouchableOpacity style={styles.learnMoreButton} onPress={()=>navigation.navigate("UseCases",{dashboard:'CMS Dashboard'})}>
            <Text style={styles.learnMoreText}>Learn More →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  horizontalScroll: {
    paddingVertical: 10,
  },
  subCardsContainer: {
    paddingHorizontal: 10,
  },
  subCard: {
    width: width * 0.75,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  subCardIcon: {
    fontSize: 40,
  },
  subCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  keyUseCasesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  useCasesContainer: {
    marginBottom: 15,
  },
  keyUseCases: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  learnMoreButton: {
    alignSelf: 'flex-start',
  },
  learnMoreText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LendingSystems;