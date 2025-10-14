import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ImageModal from '../../ImageModal';
// Main Component
const SettlementsPayments = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – Settlements: Payments 
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            The Payment module is used for making payments to business partners against dues such as excess amount due or termination amount payable, if any. The User can capture payment details for various business partners (selected through Business Partner type from a list), such as dealers, builders, or customers, against various advices generated. Payment advices are generated during the business transaction/process, including Disbursal Payments, Insurance Premium Payments, and Excess Money Payments.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User captures the payment details to the various business partners.</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            User makes payments to the customer by various modes like cash, cheques, and fund transfer.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            Payments are made to the customers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User opens the Financial Management System application.</Text>
            <Text style={styles.listItem}>• User navigates to the Settlement Payment screen for Settlements.</Text>
            <Text style={styles.listItem}>• The User specifies the finance against which the payment needs to be created.</Text>
            <Text style={styles.listItem}>• Once the finance is specified, the User specifies the mode of payment along with the following details:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Cheque ID</Text>
            <Text style={styles.listItem}>• Currency</Text>
            <Text style={styles.listItem}>• Date</Text>
            <Text style={styles.listItem}>• Customer Name</Text>
            <Text style={styles.listItem}>• Amount</Text>
            <Text style={styles.listItem}>• Cheque No.</Text>
            <Text style={styles.listItem}>• In Favor Of</Text>
            <Text style={styles.listItem}>• Payable At</Text>
            <Text style={styles.listItem}>• Account No.</Text>
            <Text style={styles.listItem}>• Reason</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• The system facilitates the generation of all payable dues automatically or manually.</Text>
            <Text style={styles.listItem}>• At the time of payments, the User adjusts the payments manually.</Text>
            <Text style={styles.listItem}>• User generates various advices based on:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Disbursal Payments</Text>
            <Text style={styles.listItem}>• Insurance Premium Payment</Text>
            <Text style={styles.listItem}>• Excess Money Payment</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User sends the process payment details for authorization before paying the amount to the customer.</Text>
            <Text style={styles.listItem}>• Payments are made to the customers successfully.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>1. User: Opens the Financial Management System application.</Text>
            <Text style={styles.flowchartItem}>2. User: Navigates to the Settlement Payment screen for Settlements.</Text>
            <Text style={styles.flowchartItem}>3. User: Specifies the finance for the payment.</Text>
            <Text style={styles.flowchartItem}>4. User: Specifies the mode of payment and enters details (e.g., Cheque ID, Customer Name, Amount).</Text>
            <Text style={styles.flowchartItem}>5. System: Generates payable dues automatically or manually, with manual adjustments by the User.</Text>
            <Text style={styles.flowchartItem}>6. User: Generates advices for Disbursal Payments, Insurance Premium Payments, or Excess Money Payments.</Text>
            <Text style={styles.flowchartItem}>7. User: Sends payment details for authorization.</Text>
            <Text style={styles.flowchartItem}>8. System: Payments are made to the customers successfully.</Text>
            <ImageModal imageSource={'https://i.ibb.co/KzwZKxyR/settlements-payments.jpg'}/>
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

export default SettlementsPayments;