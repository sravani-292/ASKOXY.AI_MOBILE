import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

// Main Component
const SettlementsChequeProcessing = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – Settlements: Cheque (Receipt/Payment) Processing
        </Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview:</Text>
          <Text style={styles.paragraph}>
            Receipt/Payments processing is used to process the instruments
            through which the receipt or payments have been made for further
            processing and updating the status of cheques. The receipts and
            payment cheques are processed in the cheque processing module of the
            Settlements. The receipts are executed for deposits, realization,
            bounces (cleared/unclear), and cancellations. The cheque can be put
            on hold if required for some reasons. The hold can be lifted as and
            when required. The payment made can also be cancelled through the
            Cheque processing screen.
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
              • User processes the cheques for both Receipts & Payments.
            </Text>
          </View>
          
          <Text style={styles.sectionTitle}>Pre Condition:</Text>
          <Text style={styles.paragraph}>
            User collects the details of cheques.
          </Text>
          
          <Text style={styles.sectionTitle}>Post Condition:</Text>
          <Text style={styles.paragraph}>
            Receipt/Payment processing is done successfully.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              • User opens the Financial Management System.
            </Text>
            <Text style={styles.listItem}>
              • User navigates to Receipt/Payment processing in Settlements.
            </Text>
            <Text style={styles.listItem}>
              • User enters the Payment/Receipt processing details in the
              following fields:
            </Text>
          </View>
          
          <View style={[styles.listContainer, styles.nestedList]}>
            <Text style={styles.listItem}>• Payment Mode</Text>
            <Text style={styles.listItem}>• Agreement No.</Text>
            <Text style={styles.listItem}>• In Favor Of</Text>
            <Text style={styles.listItem}>• Cheque No.</Text>
            <Text style={styles.listItem}>• Date</Text>
            <Text style={styles.listItem}>• Amount</Text>
            <Text style={styles.listItem}>• Currency</Text>
            <Text style={styles.listItem}>• Cheque Type</Text>
            <Text style={styles.listItem}>• Branch Details</Text>
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              • User saves the record once the details are captured.
            </Text>
            <Text style={styles.listItem}>
              • Receipt/Payment processing is completed successfully.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchart}>
            <Text style={styles.flowchartItem}>
              1. User: Opens the Financial Management System.
            </Text>
            <Text style={styles.flowchartItem}>
              2. User: Navigates to Receipt/Payment processing in Settlements.
            </Text>
            <Text style={styles.flowchartItem}>
              3. User: Enters the Payment/Receipt processing details (e.g.,
              Payment Mode, Cheque No., Amount).
            </Text>
            <Text style={styles.flowchartItem}>4. User: Saves the record.</Text>
            <Text style={styles.flowchartItem}>
              5. System: Receipt/Payment processing is completed successfully.
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

export default SettlementsChequeProcessing;