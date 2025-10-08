import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import {
  FileText,
  Users,
  List,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Settings,
  TestTube,
  Server,
  User,
} from "lucide-react-native";

const System_TerminationForeclosure = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Heading */}
      <View style={styles.header}>
        <Text style={styles.headerText}>WF_Termination / Foreclosure / Closure</Text>
      </View>
      
      <View style={styles.card}>
        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.text}>
            Termination refers to the closure of a finance account at the end of
            the agreed tenure, following full repayment of principal and profit.
            Foreclosure or early termination occurs when the customer repays the
            total finance amount before the scheduled end date. Foreclosures
            usually incur additional fees. This use case captures the steps and
            system interactions required to process both standard terminations
            and foreclosures in the Financial Management System (FMS).
          </Text>
        </View>

        {/* Actors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Actors</Text>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Business User</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Bank Staff handling account closures</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>System Roles</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Financial Management System (FMS)</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Stakeholders</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Finance Team</Text>
              <Text style={styles.bulletPoint}>• Collections</Text>
              <Text style={styles.bulletPoint}>• Customer Service</Text>
            </View>
          </View>
        </View>

        {/* User Actions & System Responses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>User Actions & System Responses</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.numberedPoint}>1. User logs into the FMS application.</Text>
            <Text style={styles.numberedPoint}>2. Navigates to the Finance Termination screen.</Text>
            <Text style={styles.numberedPoint}>3. Enters identification data using one or more of:</Text>
            <View style={styles.nestedList}>
              <Text style={styles.bulletPoint}>• Application ID</Text>
              <Text style={styles.bulletPoint}>• Customer ID</Text>
              <Text style={styles.bulletPoint}>• Branch ID</Text>
            </View>
            <Text style={styles.numberedPoint}>4. System retrieves agreement details:</Text>
            <View style={styles.nestedList}>
              <Text style={styles.bulletPoint}>• Agreement ID</Text>
              <Text style={styles.bulletPoint}>• Agreement Date</Text>
              <Text style={styles.bulletPoint}>• Customer Name</Text>
              <Text style={styles.bulletPoint}>• Amount Financed</Text>
              <Text style={styles.bulletPoint}>• Frequency</Text>
              <Text style={styles.bulletPoint}>• Tenure</Text>
              <Text style={styles.bulletPoint}>• Agreement No.</Text>
            </View>
            <Text style={styles.numberedPoint}>5. User reviews dues and refund details:</Text>
            <View style={styles.nestedList}>
              <Text style={styles.bulletPoint}>• Dues:</Text>
              <View style={styles.doubleNestedList}>
                <Text style={styles.bulletPoint}>- Principal</Text>
                <Text style={styles.bulletPoint}>- Residual Value</Text>
                <Text style={styles.bulletPoint}>- Past Due Installments</Text>
                <Text style={styles.bulletPoint}>- Outstanding Payments</Text>
                <Text style={styles.bulletPoint}>- Total Dues</Text>
              </View>
              <Text style={styles.bulletPoint}>• Refunds:</Text>
              <View style={styles.doubleNestedList}>
                <Text style={styles.bulletPoint}>- Excess Amount</Text>
                <Text style={styles.bulletPoint}>- Excess Refunds</Text>
                <Text style={styles.bulletPoint}>- Rebate</Text>
                <Text style={styles.bulletPoint}>- Advance Installments</Text>
                <Text style={styles.bulletPoint}>- Total Refunds</Text>
              </View>
            </View>
            <Text style={styles.numberedPoint}>6. User updates necessary account details.</Text>
            <Text style={styles.numberedPoint}>7. For foreclosure, user applies applicable fees.</Text>
            <Text style={styles.numberedPoint}>8. System processes payment, zeros out balance, and closes the account.</Text>
          </View>
        </View>

        {/* Precondition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Precondition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Only eligible finance accounts are selected for termination or foreclosure.</Text>
          </View>
        </View>

        {/* Post Condition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Post Condition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Finance account is closed successfully, with updated dues and refunds reflected.</Text>
          </View>
        </View>

        {/* Straight Through Process (STP) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Straight Through Process (STP)</Text>
          </View>
          <Text style={styles.text}>
            Login → Navigate to Termination Screen → Enter Account Info → Review
            Details → Apply Fees (if any) → Process Closure → Logout
          </Text>
        </View>

        {/* Alternative Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Alternative Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Manual override of fee for specific foreclosures.</Text>
            <Text style={styles.bulletPoint}>• Closure of account post refund adjustments.</Text>
          </View>
        </View>

        {/* Exception Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={18} color="#dc2626" />
            <Text style={styles.sectionTitle}>Exception Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Attempt to close account with unresolved dues.</Text>
            <Text style={styles.bulletPoint}>• Incomplete customer identification data.</Text>
          </View>
        </View>

        {/* User Activity Diagram (Flowchart) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>User Activity Diagram (Flowchart)</Text>
          </View>
          <Text style={styles.text}>
            Start → Login → Enter ID → Review Details → Apply Fees/Adjustments →
            Process Closure → End
          </Text>
        </View>

        {/* Parking Lot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Parking Lot</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Enhancement for automated eligibility check for foreclosure.</Text>
            <Text style={styles.bulletPoint}>• Notification integration for closure confirmation to customers.</Text>
          </View>
        </View>

        {/* System Components Involved */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>System Components Involved</Text>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>UI</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Finance Termination Interface</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>APIs</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Account Status Validation</Text>
              <Text style={styles.bulletPoint}>• Fee Calculation Engine</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>DB Tables</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Agreement Ledger</Text>
              <Text style={styles.bulletPoint}>• Dues & Refund Ledger</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Services</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Payment Gateway</Text>
              <Text style={styles.bulletPoint}>• Account Closure Processor</Text>
            </View>
          </View>
        </View>

        {/* Test Scenarios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TestTube size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Test Scenarios</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Normal termination at end of term.</Text>
            <Text style={styles.bulletPoint}>• Early termination with foreclosure fees.</Text>
            <Text style={styles.bulletPoint}>• Invalid closure attempts with open dues.</Text>
            <Text style={styles.bulletPoint}>• Verification of dues and refund balance prior to closure.</Text>
          </View>
        </View>

        {/* Infra & Deployment Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Server size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Infra & Deployment Notes</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Real-time sync with payments and account ledger.</Text>
            <Text style={styles.bulletPoint}>• Secure audit logging for termination actions.</Text>
            <Text style={styles.bulletPoint}>• Role-based access for termination processing.</Text>
          </View>
        </View>

        {/* Dev Team Ownership */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Dev Team Ownership</Text>
          </View>
          <Text style={styles.text}>
            Squad: Closure & Lifecycle Events Team{"\n"}
            Contact: Lead Dev - termination_support@bankdomain.com{"\n"}
            JIRA: WF-TERM-FORECLOSE-01{"\n"}
            Git Repo: /finance/termination-module
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 8,
  },
  subsection: {
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
  },
  listContainer: {
    paddingLeft: 8,
  },
  nestedList: {
    paddingLeft: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  doubleNestedList: {
    paddingLeft: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 4,
  },
  numberedPoint: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 8,
  },
});

export default System_TerminationForeclosure;