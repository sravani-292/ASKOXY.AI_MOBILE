import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// Main Component
const InstallmentPrepayment = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – Installment Prepayment
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            The Installment Prepayment feature allows the user to receive a Prepayment Amount from the customer against Installments Outstanding. The user can enter payment given in advance by the customer for future installments.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actors:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
            <Text style={styles.listItem}>• Customer</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User: Processes the prepayment of installments.</Text>
            <Text style={styles.listItem}>• Customer: Pays the prepayment installment as an advance.</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            The prepayment amount received from the customer is to be processed.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            Installment prepayment is done successfully.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User receives the amount from the customer to process the payment in the system.</Text>
            <Text style={styles.listItem}>• User opens the Financial Management System application.</Text>
            <Text style={styles.listItem}>• User navigates to the Installment Prepayment screen.</Text>
            <Text style={styles.listItem}>• User enters the payment details in the following fields:</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Prepayment ID</Text>
            <Text style={styles.listItem}>• Customer Name</Text>
            <Text style={styles.listItem}>• Agreement ID</Text>
            <Text style={styles.listItem}>• Prepayment Amount</Text>
            <Text style={styles.listItem}>• Account No</Text>
            <Text style={styles.listItem}>• Agreement Number</Text>
            <Text style={styles.listItem}>• Installment Amount</Text>
            <Text style={styles.listItem}>• Principal Amount</Text>
            <Text style={styles.listItem}>• Balance Installment Amount</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• The amount received will be allocated towards the last installment, and the tenure will be reduced by the number of installments prepaid by the customer towards the last installments.</Text>
            <Text style={styles.listItem}>• User saves the record once the process is completed or resets the details.</Text>
            <Text style={styles.listItem}>• Installment prepayment is done successfully.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>1. User: Receives the prepayment amount from the customer.</Text>
            <Text style={styles.flowchartItem}>2. User: Opens the Financial Management System application.</Text>
            <Text style={styles.flowchartItem}>3. User: Navigates to the Installment Prepayment screen.</Text>
            <Text style={styles.flowchartItem}>4. User: Enters the payment details (Prepayment ID, Customer Name, Agreement ID, etc.).</Text>
            <Text style={styles.flowchartItem}>5. System: Allocates the prepayment amount towards the last installment, reducing the tenure.</Text>
            <Text style={styles.flowchartItem}>6. User: Saves the record or resets the details.</Text>
            <Text style={styles.flowchartItem}>7. System: Installment prepayment is completed successfully.</Text>
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

export default InstallmentPrepayment;