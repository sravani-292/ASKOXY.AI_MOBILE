import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// Main Component
const TerminationForeclosureClosure = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – Termination / Foreclosure / Closure
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            The closure of a finance account is called termination. Termination refers to the closure of a finance account at the end of the stipulated period after the repayment of principal and profit amount in full. However, termination can also be done before the stipulated period, known as early termination or foreclosure of finance. Early termination occurs if the client repays the entire finance amount before the scheduled termination date. Usually, early termination is penalized with a fee, as specified in the finance.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User processes the termination or foreclosure of the finance accounts.</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            Only selected accounts are to be terminated or foreclosed.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            Termination or foreclosure is done successfully.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User opens the Financial Management System application.</Text>
            <Text style={styles.listItem}>• User navigates to the Finance Termination screen page.</Text>
            <Text style={styles.listItem}>• User enters at least one ID from the following options:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• App ID</Text>
            <Text style={styles.listItem}>• Customer ID</Text>
            <Text style={styles.listItem}>• Branch ID</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User checks the details of the application status, including:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Agreement ID</Text>
            <Text style={styles.listItem}>• Agreement Date</Text>
            <Text style={styles.listItem}>• Amount Financed</Text>
            <Text style={styles.listItem}>• Frequency</Text>
            <Text style={styles.listItem}>• Customer Name</Text>
            <Text style={styles.listItem}>• Tenure</Text>
            <Text style={styles.listItem}>• Agreement No.</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User checks the following fields for 'Dues' and 'Refunds' before termination or foreclosure of the account:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Dues:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.doubleNestedList]}>
            <Text style={styles.listItem}>• Principal Amount</Text>
            <Text style={styles.listItem}>• Residual Value</Text>
            <Text style={styles.listItem}>• Past Due Installments</Text>
            <Text style={styles.listItem}>• Outstanding Payments</Text>
            <Text style={styles.listItem}>• Total Dues</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Refunds:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.doubleNestedList]}>
            <Text style={styles.listItem}>• Excess Amount</Text>
            <Text style={styles.listItem}>• Excess Refunds</Text>
            <Text style={styles.listItem}>• Advice</Text>
            <Text style={styles.listItem}>• Rebate</Text>
            <Text style={styles.listItem}>• Advance Installments</Text>
            <Text style={styles.listItem}>• Total Refunds</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• After making modifications or updates to the accounts, the User processes the payment, and the outstanding balance becomes zero, closing the account.</Text>
            <Text style={styles.listItem}>• To foreclose the account, the User levies some fees to the customer.</Text>
            <Text style={styles.listItem}>• Termination or account foreclosure is done successfully.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>1. User: Opens the Financial Management System application.</Text>
            <Text style={styles.flowchartItem}>2. User: Navigates to the Finance Termination screen.</Text>
            <Text style={styles.flowchartItem}>3. User: Enters at least one ID (App ID, Customer ID, or Branch ID).</Text>
            <Text style={styles.flowchartItem}>4. User: Checks application status details (e.g., Agreement ID, Customer Name).</Text>
            <Text style={styles.flowchartItem}>5. User: Reviews Dues (e.g., Principal Amount, Total Dues) and Refunds (e.g., Excess Amount, Rebate).</Text>
            <Text style={styles.flowchartItem}>6. User: Processes payment to clear the outstanding balance and levies fees for foreclosure if applicable.</Text>
            <Text style={styles.flowchartItem}>7. System: Termination or foreclosure is completed successfully.</Text>
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
  doubleNestedList: {
    marginLeft: 36,
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

export default TerminationForeclosureClosure;