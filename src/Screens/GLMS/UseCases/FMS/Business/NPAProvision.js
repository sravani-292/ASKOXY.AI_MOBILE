import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

// Main Component
const NPAProvision = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – NPA Provisioning
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            Provisioning is a process in which a bank maintains a buffer for each finance if a client becomes delinquent. The provisioning of Finance amount and Profit amount can be done as per the regulatory definition and as per the internal definition.
          </Text>
          <Text style={styles.paragraph}>
            A bank carries out provisioning for both the secured and unsecured portions of finance. The portion of the finance amount backed by security is the secured portion, while the portion not backed by any security is the unsecured portion. The percentage of the finance amount to provision for secured and unsecured portions is defined using the Provisioning Master.
          </Text>
          <Text style={styles.paragraph}>
            Provisioning for the bank's internal use is referred to as Internal Provisioning, and provisioning according to regulatory guidelines is referred to as Regulator Provisioning. The End of Day (EOD) processes handle the NPA Provisioning process. The provisioning processes can be run monthly, quarterly, or yearly.
          </Text>
          <Text style={styles.paragraph}>
            For each NPA stage, the Provisioning Master allows defining different provision percentages for secured and unsecured portions of the finances. The system automatically posts the provisioned amount to the General Ledger (GL) as per the NPA stage of the finance.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User defines provisioning to non-performing assets.</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            Only selected accounts are to be provisioned for NPA.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            NPA provisioning is done successfully.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User opens the Financial Management System application.</Text>
            <Text style={styles.listItem}>• User navigates to the Provisioning screen.</Text>
            <Text style={styles.listItem}>• User performs NPA provisioning in two ways:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Auto Provisioning NPA process with the following fields:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.doubleNestedList]}>
            <Text style={styles.listItem}>• Provision ID</Text>
            <Text style={styles.listItem}>• Effective From</Text>
            <Text style={styles.listItem}>• NPA Criteria</Text>
            <Text style={styles.listItem}>• NPA Stage</Text>
            <Text style={styles.listItem}>• Constitution</Text>
            <Text style={styles.listItem}>• Secured Portion</Text>
            <Text style={styles.listItem}>• Unsecured Portion</Text>
            <Text style={styles.listItem}>• Authorized</Text>
            <Text style={styles.listItem}>• Unauthorized</Text>
            <Text style={styles.listItem}>• Both</Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Manual Provisioning process with the following fields:</Text>
          </View>
          
          <View style={[styles.listContainer, styles.doubleNestedList]}>
            <Text style={styles.listItem}>• Date</Text>
            <Text style={styles.listItem}>• User ID</Text>
            <Text style={styles.listItem}>• Batch ID</Text>
            <Text style={styles.listItem}>• Product</Text>
            <Text style={styles.listItem}>• Previous Provisioned Amount</Text>
            <Text style={styles.listItem}>• Previous Additional Provision Amount</Text>
            <Text style={styles.listItem}>• Customer Name</Text>
            <Text style={styles.listItem}>• Secured Portion</Text>
            <Text style={styles.listItem}>• Unsecured Portion</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User saves the record after completion of NPA provisioning or cancels the details to reset.</Text>
            <Text style={styles.listItem}>• NPA provisioning is done successfully.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>1. User: Opens the Financial Management System application and navigates to the NPA Provisioning screen.</Text>
            <Text style={styles.flowchartItem}>2. User: Defines the NPA provisioning using Auto Provisioning or Manual Provisioning methods.</Text>
            <Text style={styles.flowchartItem}>3. User: Provisions for both secured and unsecured portions of all finance accounts.</Text>
            <Text style={styles.flowchartItem}>4. User: Submits the record.</Text>
            <Text style={[styles.flowchartItem, styles.indented]}>- If any discrepancy, User corrects the details.</Text>
            <Text style={styles.flowchartItem}>5. System: NPA provisioning is completed successfully.</Text>
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
  indented: {
    marginLeft: 16,
  },
});

export default NPAProvision;