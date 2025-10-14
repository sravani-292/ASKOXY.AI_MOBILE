import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ImageModal from '../../ImageModal';
// Main Component
const FinanceDetailsViewer = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – Finance Details Viewer
        </Text>
         
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            After the finance is disbursed, details of the finance can be viewed from the Finance Viewer screen for further processing in the Financial Management System (FMS). FMS has a Finance Query screen, which can be used to search an application. One or more of the parameters provided in the query screen can be used to search a finance deal.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Bank Officer</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Bank Officer searches the finance details of a customer by using the Finance ID.</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            The same finance details disbursed through customer acquisition search shall be viewed from the Finance Viewer screen.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            System shows the finance details in view mode.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Bank Officer opens the Financial Management System application.</Text>
            <Text style={styles.listItem}>• Bank Officer navigates to the Finance Query Screen and initiates the process for searching to view the finance details of the customer.</Text>
            <Text style={styles.listItem}>• Bank Officer views the following finance details fetched from the Loan Origination System:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Date</Text>
            <Text style={styles.listItem}>• Branch Name</Text>
            <Text style={styles.listItem}>• Customer Name</Text>
            <Text style={styles.listItem}>• Co-Applicant Details</Text>
            <Text style={styles.listItem}>• Guarantor Details</Text>
            <Text style={styles.listItem}>• Requested Amount</Text>
            <Text style={styles.listItem}>• Sanctioned Amount</Text>
            <Text style={styles.listItem}>• Disbursal Date</Text>
            <Text style={styles.listItem}>• Disbursal Type</Text>
            <Text style={styles.listItem}>• Period</Text>
            <Text style={styles.listItem}>• Employer Details</Text>
            <Text style={styles.listItem}>• Employee Details</Text>
            <Text style={styles.listItem}>• Tenure</Text>
            <Text style={styles.listItem}>• Installments Details</Text>
            <Text style={styles.listItem}>• Installment Plan</Text>
            <Text style={styles.listItem}>• Frequency</Text>
            <Text style={styles.listItem}>• No. of Installments</Text>
            <Text style={styles.listItem}>• Installment Mode</Text>
            <Text style={styles.listItem}>• Advance Installment</Text>
            <Text style={styles.listItem}>• Due Date</Text>
            <Text style={styles.listItem}>• First Installment Date</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Bank Officer sees the complete finance details of the selected Finance ID and other finance-related details in view mode screen only.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>1. Bank Officer: Opens the Financial Management System application.</Text>
            <Text style={styles.flowchartItem}>2. Bank Officer: Navigates to the Finance Query Screen.</Text>
            <Text style={styles.flowchartItem}>3. Bank Officer: Initiates a search using the Finance ID to view customer finance details.</Text>
            <Text style={styles.flowchartItem}>4. System: Displays finance details (e.g., Customer Name, Sanctioned Amount, Tenure) fetched from the Loan Origination System in view mode.</Text>
            <ImageModal imageSource={'https://i.ibb.co/cKxCvbHW/finance-details.jpg'}/>
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

export default FinanceDetailsViewer;