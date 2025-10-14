import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ImageModal from "../../ImageModal";
const FinanceReschedulingTenureChange = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainCard}>
        <Text style={styles.title}>Work Flow – Finance Rescheduling: Tenure Change</Text>

        <View style={styles.card}>
          <Text style={styles.text}>
            The Finance Rescheduling functionality allows the user to modify the Financial Details of the Finance. On the basis of the modification performed, the system computes the new repayment schedule.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Transactions Supported:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Bulk Prepayment</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Modification of Profit Rate</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Modification of Tenure</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Modification of Tenure</Text>
          <Text style={styles.text}>
            During the lifetime of the finance deal, a customer may visit the bank and request a modification of Tenure of the finance deal to reduce the profit to be paid in the future. This change will impact the installment amount.
          </Text>
          
          <Text style={styles.subsectionTitle}>Actors:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Customer</Text>
            </View>
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
                Customer: Visits the Bank and submits the request for Tenure Change.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                User: Initiates the process for Generation of New Repayment Schedule due to Tenure Change.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Checker: Verifies the New Repayment schedule and authorizes the same if found correct.
              </Text>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>Pre Condition:</Text>
          <Text style={styles.text}>
            Existing Finance Account & Tenure Change to the Finance Account.
          </Text>

          <Text style={styles.subsectionTitle}>Post Condition:</Text>
          <Text style={styles.text}>
            Tenure Change marked to the Finance Account & New Repayment schedule generated.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The Customer walks into the Bank and submits the request for Tenure change of the Finance Account.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User verifies the request and rules pertaining to the Tenure Change.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Once the User is satisfied, they initiate the process for Tenure Change.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                After the Tenure of the Finance account is changed, the User initiates the process for generation of New Repayment schedule.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User retrieves the Finance Account details with the Agreement ID for generation of New Repayment Schedule.
              </Text>
            </View>
          </View>

          <Text style={styles.subsectionTitle}>System Displays:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Finance No</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Agreement ID</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Loan Amount</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Original Tenure</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>EMI Amount</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Due Date</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Reschedule Effective Date</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Repayment Effective Date</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Bulk Refund Amount</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Balance Tenure</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Frequency</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Rate of Interest</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User modifies the Balance Tenure and submits the record for generation of New Repayment Schedule.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The Checker retrieves the New Repayment Schedule with the Agreement ID, verifies, and authorizes if found correct.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Once authorized, the New Repayment schedule is generated, and the customer is notified.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchartCard}>
            <Text style={styles.flowchartText}>
              1. Customer: Visits Bank, submits Tenure Change request.
            </Text>
            <Text style={styles.flowchartText}>
              2. User: Verifies request and rules.
            </Text>
            <Text style={[styles.flowchartText, styles.indented]}>
              - If discrepancy, Customer modifies and resubmits.
            </Text>
            <Text style={styles.flowchartText}>
              3. User: Retrieves Finance Account details with Agreement ID.
            </Text>
            <Text style={styles.flowchartText}>
              4. User: Modifies Balance Tenure, submits for New Repayment Schedule.
            </Text>
            <Text style={styles.flowchartText}>
              5. User: Initiates New Repayment Schedule generation.
            </Text>
            <Text style={styles.flowchartText}>
              6. Checker: Retrieves and verifies New Repayment Schedule.
            </Text>
            <Text style={[styles.flowchartText, styles.indented]}>
              - If discrepancy, User modifies and resubmits.
            </Text>
            <Text style={styles.flowchartText}>
              7. Checker: Authorizes if correct.
            </Text>
            <Text style={styles.flowchartText}>
              8. System: Generates New Repayment Schedule, notifies customer.
            </Text>
            <ImageModal imageSource={'https://i.ibb.co/B2H7yCRk/Work-Flow-Finance-Rescheduling-Tenure-Change.png'}/>
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

export default FinanceReschedulingTenureChange;