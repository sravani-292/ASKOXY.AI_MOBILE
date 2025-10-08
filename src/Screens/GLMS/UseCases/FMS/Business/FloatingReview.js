import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// Main Component
const FloatingReview = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – Floating Review Process
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            The Floating Review Process is used to update the profit rate for all finances booked under the floating profit rate type. The system computes the new profit rate applicable for each finance agreement booked under the floating profit rate type, as per the spread and the modified anchor rate, and thus computes the updated repayment schedule applicable to it.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User reviews the floating rate process.</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            Floating Rates and types shall be applied to all the financial instruments.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            Floating Rate Review is done successfully.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User opens the Financial Management System application.</Text>
            <Text style={styles.listItem}>• User navigates to the Floating Review Process screen.</Text>
            <Text style={styles.listItem}>• User recalculates the floating profit rate depending on the change in Prime Lending Rate (PLR).</Text>
            <Text style={styles.listItem}>• User applies the prime rate types to all finances from the Floating Review Process page, including:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Prime Rate Type for EMI & Pre-EMI schedules</Text>
            <Text style={styles.listItem}>• EIBOR</Text>
            <Text style={styles.listItem}>• LIBOR</Text>
            <Text style={styles.listItem}>• Date</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User updates the Floating Rate Reference (FRR) on a daily basis and checks whether the system generates a new schedule for EMI if any changes are made in the profit rate.</Text>
            <Text style={styles.listItem}>• User saves the transaction once the floating review process is done or cancels to reset the details.</Text>
            <Text style={styles.listItem}>• Floating Review Process is done successfully.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>1. User: Opens the Financial Management System application.</Text>
            <Text style={styles.flowchartItem}>2. User: Navigates to the Floating Review Process screen.</Text>
            <Text style={styles.flowchartItem}>3. User: Recalculates the floating profit rate based on changes in the Prime Lending Rate (PLR).</Text>
            <Text style={styles.flowchartItem}>4. User: Applies prime rate types (e.g., EMI/Pre-EMI, EIBOR, LIBOR) to all finances.</Text>
            <Text style={styles.flowchartItem}>5. User: Updates the Floating Rate Reference (FRR) daily and verifies new EMI schedules if the profit rate changes.</Text>
            <Text style={styles.flowchartItem}>6. User: Saves the transaction or cancels to reset.</Text>
            <Text style={styles.flowchartItem}>7. System: Floating Rate Review is completed successfully.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  content: {
    padding: 16,
    backgroundColor: "white",
    margin: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  listContainer: {
    marginLeft: 8,
    marginBottom: 8,
  },
  nestedList: {
    marginLeft: 20,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  flowchart: {
    borderWidth: 1,
    borderColor: "#374151",
    padding: 16,
    borderRadius: 4,
  },
  flowchartItem: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default FloatingReview;