import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const RepaymentDeferralFinanceWise = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainCard}>
        <Text style={styles.title}>
          Work Flow – Repayment Deferral: Finance Wise Deferral
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
          <Text style={styles.sectionTitle}>Finance Wise Deferral</Text>
          <Text style={styles.text}>
            Finance Wise deferral is a process where deferral will be provided
            to a specific finance as per the customer's request.
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
                Customer: Submits the request for Repayment deferral to the user.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                User: Initiates the Repayment deferral as per the request from the
                Customer by considering the Deferral rules.
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
            Existing Finance Account & Repayment Deferral request received from
            the customer.
          </Text>

          <Text style={styles.subsectionTitle}>Post Condition:</Text>
          <Text style={styles.text}>
            Repayment Deferral marked to the Finance Account.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The Customer submits the request for Repayment Deferral by quoting
                the number of deferrals.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User verifies the Deferral request submitted by the customer
                and also verifies the Deferral rules pertaining to the Finance
                Account.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Once the deferral rules satisfy for allowing deferral to the
                Finance Account, the User initiates the process for updation of
                deferral details into the system.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User retrieves the Finance Account details with the Agreement
                ID for updation of deferral details.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The system displays the deferral screen with the following fields:
              </Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <Text style={styles.detailItem}>• Agreement ID</Text>
            <Text style={styles.detailItem}>• Agreement No</Text>
            <Text style={styles.detailItem}>• Customer ID</Text>
            <Text style={styles.detailItem}>• Customer Name</Text>
            <Text style={styles.detailItem}>• Repayment Mode</Text>
            <Text style={styles.detailItem}>• Repayment Frequency</Text>
            <Text style={styles.detailItem}>• Finance Amount</Text>
            <Text style={styles.detailItem}>• EMI Amount</Text>
            <Text style={styles.detailItem}>• Date of Disbursement</Text>
            <Text style={styles.detailItem}>• Disbursed Amount</Text>
            <Text style={styles.detailItem}>• EMI O/s Amount</Text>
            <Text style={styles.detailItem}>• Due Date</Text>
            <Text style={styles.detailItem}>• Rate of Interest</Text>
          </View>

          <Text style={styles.subsectionTitle}>
            Repayment Deferral Parameters:
          </Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Deferral Effective Date</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>No of Deferral Required</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Deferral Charge Amount</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Next Repayment Date</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User captures the above details, generates the New Repayment
                Schedule, and submits the schedule for authorization.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The New Repayment Schedule will be authorized by the Checker.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Once the New Repayment Schedule is authorized, the same is
                notified to the customer.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchartCard}>
            <Text style={styles.flowchartText}>
              1. Customer: Submits the request letter for deferral.
            </Text>
            <Text style={styles.flowchartText}>
              2. User: Verifies the Deferral request and the Deferral rules.
            </Text>
            <Text style={[styles.flowchartText, styles.indented]}>
              - If discrepancy, Customer modifies the Deferral request and
              resubmits.
            </Text>
            <Text style={styles.flowchartText}>
              3. User: Initiates the process for Deferral marking.
            </Text>
            <Text style={styles.flowchartText}>
              4. User: Retrieves the Finance Account details with the Agreement
              ID.
            </Text>
            <Text style={styles.flowchartText}>
              5. User: Captures the details for deferral marking.
            </Text>
            <Text style={styles.flowchartText}>6. User: Submits the Record.</Text>
            <Text style={styles.flowchartText}>
              7. Checker: Retrieves the deferral record and verifies the
              details.
            </Text>
            <Text style={[styles.flowchartText, styles.indented]}>
              - If discrepancy, User modifies the Deferral record.
            </Text>
            <Text style={styles.flowchartText}>8. Checker: Authorizes the record.</Text>
            <Text style={styles.flowchartText}>
              9. System: Deferral marked successfully, and customer notified on
              deferral.
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
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 8,
    marginBottom: 12,
  },
  detailItem: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
    width: "48%",
    marginBottom: 4,
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

export default RepaymentDeferralFinanceWise;