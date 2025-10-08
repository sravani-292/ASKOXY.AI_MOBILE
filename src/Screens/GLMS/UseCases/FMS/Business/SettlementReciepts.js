import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// Main Component
const SettlementReciepts = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – Settlements: Receipts
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            The details of all funds received by the financial institution through cheque, cash, draft, or transfer are recorded in the Receipt module of the Settlements. Receipt Advices, i.e., receivables, are generated during the business transaction/process. Receivables can be generated due to:
          </Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Billing process: Installment receivables are generated.</Text>
            <Text style={styles.listItem}>• Late Payment process: Overdue fees receivable from the customer are calculated and created.</Text>
            <Text style={styles.listItem}>• Any other receivable advices, ad-hoc in nature, through manual advice.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User captures the receipt details for various business partners.</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            User generates the receipt advices through the system.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            Receipt Advices are initiated for the customers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User opens the Financial Management System application.</Text>
            <Text style={styles.listItem}>• User navigates to the Receipts screen from Settlements.</Text>
            <Text style={styles.listItem}>• User enters the details in the following fields to generate the 'Receipt Advices' during the business transaction/process:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Cheque ID</Text>
            <Text style={styles.listItem}>• Date</Text>
            <Text style={styles.listItem}>• Currency</Text>
            <Text style={styles.listItem}>• Customer Name</Text>
            <Text style={styles.listItem}>• Account No.</Text>
            <Text style={styles.listItem}>• In Favor Of</Text>
            <Text style={styles.listItem}>• Payable At</Text>
            <Text style={styles.listItem}>• Drawn On</Text>
            <Text style={styles.listItem}>• Reason</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User records all the details of the funds received by the financial institution through the following methods:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Cheque</Text>
            <Text style={styles.listItem}>• Cash</Text>
            <Text style={styles.listItem}>• Draft</Text>
            <Text style={styles.listItem}>• Transfer</Text>
            <Text style={styles.listItem}>• Point of Sale</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Once the details are entered, the payment is saved on the receipt screen, and the payment is processed through the Cheque Processing module with the following stages:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Receipt</Text>
            <Text style={styles.listItem}>• Deposit (Maker & Checker)</Text>
            <Text style={styles.listItem}>• Realization (Maker & Checker)</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User will also process the payment on the receipt screen with cash in two stages:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Receipt</Text>
            <Text style={styles.listItem}>• Receipt Deposit</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• The User saves the payment information, and a payment voucher is required to be generated.</Text>
            <Text style={styles.listItem}>• The voucher will be printed once the record is saved on the receipt of payment.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>1. User: Opens the Financial Management System application.</Text>
            <Text style={styles.flowchartItem}>2. User: Navigates to the Receipts screen from Settlements.</Text>
            <Text style={styles.flowchartItem}>3. User: Enters details (e.g., Cheque ID, Customer Name, Currency) to generate Receipt Advices.</Text>
            <Text style={styles.flowchartItem}>4. User: Records funds received via Cheque, Cash, Draft, Transfer, or Point of Sale.</Text>
            <Text style={styles.flowchartItem}>5. System: Processes payments through the Cheque Processing module (Receipt, Deposit, Realization) or cash stages (Receipt, Receipt Deposit).</Text>
            <Text style={styles.flowchartItem}>6. User: Saves payment information and generates a payment voucher.</Text>
            <Text style={styles.flowchartItem}>7. System: Prints the voucher upon saving the receipt record.</Text>
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

export default SettlementReciepts;