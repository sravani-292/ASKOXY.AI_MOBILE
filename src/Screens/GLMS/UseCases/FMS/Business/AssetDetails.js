import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

// Main Component
const AssetDetails = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – Maintains the Asset Details
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            At the time of entering finance details in the Loan Origination
            System, information about the asset for which the finance is sought
            is entered. This information includes details such as type,
            description, cost, age, and remaining life of the asset. After the
            asset is purchased, the bank needs to ensure that the details of the
            asset are updated in the system. Also, the bank needs to
            periodically inspect the condition of the asset and ensure that it
            is insured adequately.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actor:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• User</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              • User: Updates the Asset details and insurance details in the
              System.
            </Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            System should support to capture the Asset details and insurance
            details.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            Updated Asset details and insurance details saved in database.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              • After the asset is purchased by the customer, the User updates and
              maintains the following details of the asset in the system:
            </Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Supplier</Text>
            <Text style={styles.listItem}>• Delivery Order Date</Text>
            <Text style={styles.listItem}>• Asset Cost</Text>
            <Text style={styles.listItem}>• Origination State</Text>
            <Text style={styles.listItem}>• Installation State</Text>
            <Text style={styles.listItem}>• Registration Number, etc.</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              • Once the User updates the asset details in the system, the User
              needs to physically identify the asset and ensure that it is
              maintained in a good condition and is adequately insured, and
              maintains the following inspection details of the asset in the
              System:
            </Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Asset ID</Text>
            <Text style={styles.listItem}>• Agreement No</Text>
            <Text style={styles.listItem}>• Inspection Date</Text>
            <Text style={styles.listItem}>• Remarks</Text>
            <Text style={styles.listItem}>• Defect Reason (If any)</Text>
            <Text style={styles.listItem}>• Inspection Done By</Text>
            <Text style={styles.listItem}>• Next Inspection Date</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              • After inspection details are entered in the system, the User
              captures the following insurance details in the system:
            </Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>• Asset Description</Text>
            <Text style={styles.listItem}>• Nature of Insurance</Text>
            <Text style={styles.listItem}>• Policy No</Text>
            <Text style={styles.listItem}>• Coverage / Insured Amount</Text>
            <Text style={styles.listItem}>• Insured Date</Text>
            <Text style={styles.listItem}>• Expiry Date</Text>
            <Text style={styles.listItem}>• Premium</Text>
            <Text style={styles.listItem}>• Insurance Company</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              • System saves the updated details in the database.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>
              1. User: Maintains the details of the updated asset in the system.
            </Text>
            <Text style={styles.flowchartItem}>
              2. User: Physically identifies the asset and ensures it is
              maintained in a good condition.
            </Text>
            <Text style={styles.flowchartItem}>
              3. User: Maintains the inspection details of the asset and
              insurance details in the System.
            </Text>
            <Text style={styles.flowchartItem}>4. User: Submits the records.</Text>
            <Text style={styles.flowchartItem}>
              5. System: Saves the updated details in the database.
            </Text>
            <Text style={[styles.flowchartItem, styles.indented]}>
              - For any modification, the User updates the details.
            </Text>
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
  indented: {
    marginLeft: 16,
  },
});

export default AssetDetails;