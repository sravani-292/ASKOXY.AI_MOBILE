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

const System_SettlementsCheque = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Heading */}
      <View style={styles.header}>
        <Text style={styles.headerText}>WF_Settlements - Cheque (Receipt/Payment) Processing</Text>
      </View>
      
      <View style={styles.card}>
        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.text}>
            Cheque (Receipt/Payment) Processing in the Settlements module of the
            Financial Management System (FMS) handles the recording, tracking,
            and updating of cheque instruments used for financial transactions.
            The process includes handling deposits, realizations, bounces,
            cancellations, and placing or lifting holds. It applies to both
            receipt and payment cheques and ensures accurate recording and
            reconciliation of all instrument-based transactions.
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
              <Text style={styles.bulletPoint}>• Bank Staff responsible for cheque processing</Text>
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
              <Text style={styles.bulletPoint}>• Settlements Team</Text>
              <Text style={styles.bulletPoint}>• Core Banking System</Text>
              <Text style={styles.bulletPoint}>• QA</Text>
              <Text style={styles.bulletPoint}>• Audit</Text>
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
            <Text style={styles.numberedPoint}>2. Navigates to Receipt/Payment Processing in the Settlements module.</Text>
            <Text style={styles.numberedPoint}>3. Enters cheque details including:</Text>
            <View style={styles.nestedList}>
              <Text style={styles.bulletPoint}>• Payment Mode</Text>
              <Text style={styles.bulletPoint}>• Agreement Number</Text>
              <Text style={styles.bulletPoint}>• In Favor Of</Text>
              <Text style={styles.bulletPoint}>• Cheque Number</Text>
              <Text style={styles.bulletPoint}>• Date</Text>
              <Text style={styles.bulletPoint}>• Amount</Text>
              <Text style={styles.bulletPoint}>• Currency</Text>
              <Text style={styles.bulletPoint}>• Cheque Type</Text>
              <Text style={styles.bulletPoint}>• Branch Details</Text>
            </View>
            <Text style={styles.numberedPoint}>4. Saves the entry.</Text>
            <Text style={styles.numberedPoint}>5. System records and updates cheque processing status accordingly.</Text>
            <Text style={styles.numberedPoint}>6. Optional actions: place on hold, cancel payment, or realize/bounce.</Text>
          </View>
        </View>

        {/* Precondition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Precondition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• User must collect and verify all cheque details.</Text>
          </View>
        </View>

        {/* Post Condition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Post Condition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Receipt/Payment cheque transactions are successfully processed and updated.</Text>
          </View>
        </View>

        {/* Straight Through Process (STP) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Straight Through Process (STP)</Text>
          </View>
          <Text style={styles.text}>
            Login → Navigate to Cheque Processing → Enter Cheque Details → Save
            Entry → Logout
          </Text>
        </View>

        {/* Alternative Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Alternative Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Cheque Hold Placement or Removal</Text>
            <Text style={styles.bulletPoint}>• Cheque Bounce Handling (Cleared/Uncleared)</Text>
            <Text style={styles.bulletPoint}>• Cancellation of Payment Receipt</Text>
          </View>
        </View>

        {/* Exception Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={18} color="#dc2626" />
            <Text style={styles.sectionTitle}>Exception Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Invalid cheque number or date.</Text>
            <Text style={styles.bulletPoint}>• Missing mandatory fields during entry.</Text>
            <Text style={styles.bulletPoint}>• Bounce not handled in time.</Text>
          </View>
        </View>

        {/* User Activity Diagram (Flowchart) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>User Activity Diagram (Flowchart)</Text>
          </View>
          <Text style={styles.text}>
            Start → Login → Cheque Entry → Save or Hold → Process Outcome → End
          </Text>
        </View>

        {/* Parking Lot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Parking Lot</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Auto-reconciliation of cheque statuses with clearing house.</Text>
            <Text style={styles.bulletPoint}>• Integration with mobile cheque capture.</Text>
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
              <Text style={styles.bulletPoint}>• Cheque Processing Screen in FMS</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>APIs</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Payment Gateway</Text>
              <Text style={styles.bulletPoint}>• Cheque Clearing Status</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>DB Tables</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Cheque Ledger</Text>
              <Text style={styles.bulletPoint}>• Receipt/Payment History</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Services</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Status Update Engine</Text>
              <Text style={styles.bulletPoint}>• Notification System</Text>
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
            <Text style={styles.bulletPoint}>• Valid receipt and payment entry.</Text>
            <Text style={styles.bulletPoint}>• Hold and release scenarios.</Text>
            <Text style={styles.bulletPoint}>• Bounce recording and reversal.</Text>
            <Text style={styles.bulletPoint}>• Cancellation and re-processing of cheques.</Text>
          </View>
        </View>

        {/* Infra & Deployment Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Server size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Infra & Deployment Notes</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• High availability needed for real-time entry.</Text>
            <Text style={styles.bulletPoint}>• End-of-Day triggers for bounce status checks.</Text>
            <Text style={styles.bulletPoint}>• Requires secured access with audit trails.</Text>
          </View>
        </View>

        {/* Dev Team Ownership */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Dev Team Ownership</Text>
          </View>
          <Text style={styles.text}>
            Squad: Payments & Settlements Team{"\n"}
            Contact: Lead Dev - cheque_processing@bankdomain.com{"\n"}
            JIRA: WF-CHEQUE-SETTLE-01{"\n"}
            Git Repo: /settlements/cheque-processing
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

export default System_SettlementsCheque;