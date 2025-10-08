import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const RepaymentDeferralBatchWise = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainCard}>
        <Text style={styles.title}>
          Work Flow – Repayment Deferral: Batch (Portfolio) Wise Deferral
        </Text>

        <View style={styles.card}>
          <Text style={styles.text}>
            Deferral is an option in which a customer defers their future EMI
            for a certain period of time, and the bank charges some fees to do
            the same. Such scenarios happen mostly around festivals. The
            deferral process can be for individual finances, batch-wise, or
            globally for the entire portfolio.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Deferral Types:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Finance Wise Deferral</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Batch Wise Deferral</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Constitution Based Deferral</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Batch Wise Deferral</Text>
          <Text style={styles.text}>
            Batch Wise Deferral is a process wherein deferral of Installment is
            done for the entire portfolio. Batch Wise deferral is usually
            provided to the customer during festive seasons and is applied to
            the entire portfolio. No deferral rule matrix is looked upon in case
            of global deferrals. Deferment fees will be charged in case of
            global deferrals. For global deferrals, a file will be provided that
            will have the list of finances for which deferral is to be done.
            This file will get uploaded into the system and the deferral process
            will be executed.
          </Text>
          
          <Text style={styles.subsectionTitle}>Actors:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>User</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Checker</Text>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Actions:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                User: Initiates the Repayment deferral for the Batch (Portfolio).
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Checker: Verifies the Deferral record details and authorizes the
                same if found correct.
              </Text>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Pre Condition:</Text>
          <Text style={styles.text}>
            Existing Finance Account & Need for Repayment Deferral.
          </Text>

          <Text style={styles.subsectionTitle}>Post Condition:</Text>
          <Text style={styles.text}>
            Repayment Deferral marked to the Batch (Portfolio).
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User creates a file containing the Deferral details pertaining
                to the portfolio such as:
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Agreement ID</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Customer Name</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Finance Amount</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>No of Deferrals</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Deferral Effective Date</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Next Payment Date</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Deferral Charge Amount</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Once the file is prepared, the User uploads the file into the
                system for Deferral marking.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User selects the file and upload date and submits for upload.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Once the file is uploaded, the Checker verifies the file and
                authorizes the same if found correct.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Once the file is authorized, the Customers pertaining to the
                portfolio will be notified on the deferral.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchartCard}>
            <Text style={styles.flowchartText}>
              1. User: Creates the Upload file for Deferral.
            </Text>
            <Text style={styles.flowchartText}>
              2. User: Initiates the process for Batch Wise deferral marking.
            </Text>
            <Text style={styles.flowchartText}>
              3. User: Selects the file in Deferral Option.
            </Text>
            <Text style={styles.flowchartText}>4. User: Submits the record.</Text>
            <Text style={styles.flowchartText}>
              5. Checker: Retrieves the deferral file and verifies the Deferral
              details.
            </Text>
            <Text style={[styles.flowchartText, styles.indented]}>
              - If discrepancy, User modifies the deferral details and resubmits
              for authorization.
            </Text>
            <Text style={styles.flowchartText}>6. Checker: Authorizes if correct.</Text>
            <Text style={styles.flowchartText}>
              7. System: Deferral marked successfully, and Customers are
              notified on the deferral.
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
  mainCard: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1f2937",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1f2937",
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
    color: "#374151",
  },
  text: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 8,
  },
  listContainer: {
    marginLeft: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: "#374151",
    marginRight: 8,
    lineHeight: 20,
  },
  flowchartCard: {
    borderWidth: 1,
    borderColor: "#6b7280",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
  },
  flowchartText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 6,
  },
  indented: {
    marginLeft: 16,
  },
});

export default RepaymentDeferralBatchWise;