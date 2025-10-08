import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// Main Component
const NPAGrading = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – NPA Grading
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            The Bank assigns a grade to each finance based on the repayment pattern of the client. This information helps financing institutions ascertain the creditworthiness of the borrower and the likelihood of repayment within the specified time period. It also aids in identifying potential delinquent clients. The grading is subject to management decisions, and criteria may vary by product.
          </Text>
          <Text style={styles.paragraph}>
            A non-performing asset (NPA) refers to funds invested in finances not producing desired returns. An asset is considered non-performing when receivables are overdue for more than the number of days specified in the NPA criteria. The lender risks losing both the profit and the principal amount. Movement across NPA stages depends on the Days Past Due (DPD), calculated as the difference between the current date and the due date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User defines grading before provisioning to non-performing assets.</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            Only selected accounts are to be marked/graded for NPA.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            NPA stage is done successfully.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User opens the Financial Management System application.</Text>
            <Text style={styles.listItem}>• User navigates to the Finance Grading screen.</Text>
            <Text style={styles.listItem}>• User defines the NPA stage for a finance account, such as Standard, Sub-standard, Doubtful, or Loss.</Text>
            <Text style={styles.listItem}>• User defines the NPA movements for finance accounts to derive the NPA stage:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Forward movement: Moved from a lower NPA stage to a higher NPA stage.</Text>
            <Text style={styles.listItem}>• Backward movement: Moved from a higher NPA stage to a lower NPA stage.</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User operates the NPA stage in two ways:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Automatic NPA marking</Text>
            <Text style={styles.listItem}>• Manual NPA marking</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User grades manually to the finance accounts by entering details in the following fields:</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Agreement ID</Text>
            <Text style={styles.listItem}>• New NPA Stage</Text>
            <Text style={styles.listItem}>• Remarks</Text>
            <Text style={styles.listItem}>• NPA Change Date</Text>
            <Text style={styles.listItem}>• Current NPA Stage</Text>
            <Text style={styles.listItem}>• Final NPA Stage</Text>
            <Text style={styles.listItem}>• NPA Reason</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User saves the transaction after grading the NPA marking manually.</Text>
            <Text style={styles.listItem}>• NPA grading is done successfully.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>1. User: Opens the Financial Management System application and navigates to the Finance Grading screen.</Text>
            <Text style={styles.flowchartItem}>2. User: Defines the NPA stage for a finance account (e.g., Regular, Sub-standard, Bad, Write-off).</Text>
            <Text style={styles.flowchartItem}>3. User: Defines the NPA movements to derive the NPA stage (Forward or Backward movement).</Text>
            <Text style={styles.flowchartItem}>4. User: Operates the NPA stage automatically or manually.</Text>
            <Text style={styles.flowchartItem}>5. User: Processes the finance grading by entering details (e.g., Agreement ID, New NPA Stage, Remarks).</Text>
            <Text style={styles.flowchartItem}>6. User: Submits the record.</Text>
            <Text style={[styles.flowchartItem, styles.indented]}>- If any discrepancy, User corrects the details.</Text>
            <Text style={styles.flowchartItem}>7. System: NPA stage is completed successfully.</Text>
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
  indented: {
    marginLeft: 16,
  },
});

export default NPAGrading;