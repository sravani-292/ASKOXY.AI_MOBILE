import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ImageModal from "../../ImageModal"
const RepaymentDeferralConstitutionBased = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainCard}>
        <Text style={styles.title}>
          Work Flow – Repayment Deferral: Constitution Based Deferral
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
          <Text style={styles.sectionTitle}>Constitution Based Deferral</Text>
          <Text style={styles.text}>
            The Deferral screen has an option to select the constitution of the
            customer. The system allows users to set the deferral policy based
            on rules defined with respect to the customer segment. If the
            customer falls into the SME category, different rules can be defined
            applicable only to SME customers. The Deferral screen includes a
            List of Values (LoV) for selecting the constitution, and the
            finances displayed are based on the customer's constitution. If the
            constitution is selected as SME, the list of all finances under that
            constitution is displayed, and the user can select a single finance
            or all finances. In the Deferral Query screen, the user enters the
            deferral effective date and the number of deferrals. All selected
            finances will be deferred.
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
                User: Initiates the Repayment deferral for Constitution Based
                process.
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
            Repayment Deferral marked to the Finance Account through
            Constitution Based process.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Work Flow:</Text>
          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User initiates the Deferral marking process through a
                constitution-based approach.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User selects the particular constitution to mark deferral in
                the Deferral option.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                System displays the list of Finance Accounts pertaining to the
                constitution.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The User selects the Finance Account for which the deferral needs
                to be marked.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Once the Finance Accounts are selected, the User enters the
                details in the following fields:
              </Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>Deferral Effective Date</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>No of Deferrals</Text>
            </View>
          </View>

          <View style={styles.listContainer}>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Once the above details are captured, the User submits the record
                for deferral marking.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                The Checker verifies the Deferral record details and authorizes
                the same if found correct.
              </Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.text}>
                Once the record is authorized, the customers pertaining to the
                Finance Accounts are notified on the Deferral.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Flowchart Summary:</Text>
          <View style={styles.flowchartCard}>
            <Text style={styles.flowchartText}>
              1. User: Initiates the Deferral marking process with Constitution
              Based Approach.
            </Text>
            <Text style={styles.flowchartText}>
              2. User: Selects the particular constitution in Deferral option.
            </Text>
            <Text style={styles.flowchartText}>
              3. System: Displays the Finance Accounts pertaining to the
              Constitution.
            </Text>
            <Text style={styles.flowchartText}>
              4. User: Selects the Finance Account for which the Deferral needs
              to be marked.
            </Text>
            <Text style={styles.flowchartText}>
              5. User: Captures the Deferral details (Deferral Effective Date,
              No of Deferrals).
            </Text>
            <Text style={styles.flowchartText}>6. User: Submits the record.</Text>
            <Text style={styles.flowchartText}>
              7. Checker: Retrieves the Deferral record and verifies the
              Deferral details.
            </Text>
            <Text style={[styles.flowchartText, styles.indented]}>
              - If discrepancy, User modifies the Deferral details and resubmits
              for authorization.
            </Text>
            <Text style={styles.flowchartText}>8. Checker: Authorizes if correct.</Text>
            <Text style={styles.flowchartText}>
              9. System: Defers marked successfully, and customers are notified
              accordingly.
            </Text>
          </View>
          <ImageModal imageSource={'https://i.ibb.co/VWZsL214/repayment-deferral.jpg'}/>
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

export default RepaymentDeferralConstitutionBased;