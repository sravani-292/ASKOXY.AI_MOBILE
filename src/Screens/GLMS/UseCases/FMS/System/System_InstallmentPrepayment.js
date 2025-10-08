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

const System_InstallmentPrepayment = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Heading */}
      <View style={styles.header}>
        <Text style={styles.headerText}>WF_Installment_Prepayment</Text>
      </View>
      
      <View style={styles.card}>
        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.text}>
            The Installment Prepayment feature allows the Financial Management
            System (FMS) to process advance payments from customers toward their
            future installments. This functionality enables efficient loan
            management by reducing loan tenure and re-allocating installments
            when prepayment is made.
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
              <Text style={styles.bulletPoint}>• Bank Officer</Text>
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
              <Text style={styles.bulletPoint}>• Finance Department</Text>
              <Text style={styles.bulletPoint}>• Loan Operations</Text>
              <Text style={styles.bulletPoint}>• Customer</Text>
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
            <Text style={styles.numberedPoint}>1. Customer provides a prepayment amount toward future installments.</Text>
            <Text style={styles.numberedPoint}>2. User logs into the FMS and navigates to the Installment Prepayment screen.</Text>
            <Text style={styles.numberedPoint}>3. Enters the following payment details:</Text>
            <View style={styles.nestedList}>
              <Text style={styles.bulletPoint}>• Prepayment ID</Text>
              <Text style={styles.bulletPoint}>• Customer Name</Text>
              <Text style={styles.bulletPoint}>• Agreement ID</Text>
              <Text style={styles.bulletPoint}>• Prepayment Amount</Text>
              <Text style={styles.bulletPoint}>• Account No.</Text>
              <Text style={styles.bulletPoint}>• Agreement Number</Text>
              <Text style={styles.bulletPoint}>• Installment Amount</Text>
              <Text style={styles.bulletPoint}>• Principal Amount</Text>
              <Text style={styles.bulletPoint}>• Balance Installment Amount</Text>
            </View>
            <Text style={styles.numberedPoint}>4. System calculates number of installments the prepayment covers.</Text>
            <Text style={styles.numberedPoint}>5. System updates the installment schedule:</Text>
            <View style={styles.nestedList}>
              <Text style={styles.bulletPoint}>• Allocates the received amount to the last installment(s).</Text>
              <Text style={styles.bulletPoint}>• Reduces the loan tenure accordingly.</Text>
            </View>
            <Text style={styles.numberedPoint}>6. User saves or resets the record.</Text>
            <Text style={styles.numberedPoint}>7. System confirms successful prepayment entry.</Text>
          </View>
        </View>

        {/* Precondition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Precondition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Customer has provided a valid prepayment amount.</Text>
            <Text style={styles.bulletPoint}>• Active loan agreement exists in the system.</Text>
          </View>
        </View>

        {/* Post Condition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Post Condition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Prepayment is applied.</Text>
            <Text style={styles.bulletPoint}>• Loan tenure is adjusted.</Text>
          </View>
        </View>

        {/* Straight Through Process (STP) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Straight Through Process (STP)</Text>
          </View>
          <Text style={styles.text}>
            Receive Prepayment → Login to FMS → Navigate to Prepayment Screen →
            Enter Details → Save Entry → Tenure Updated → Logout
          </Text>
        </View>

        {/* Alternative Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Alternative Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Manual allocation of prepayment in case of specific business rules.</Text>
            <Text style={styles.bulletPoint}>• Partial prepayment across multiple agreements (future enhancement).</Text>
          </View>
        </View>

        {/* Exception Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={18} color="#dc2626" />
            <Text style={styles.sectionTitle}>Exception Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Invalid account or agreement details.</Text>
            <Text style={styles.bulletPoint}>• Prepayment less than minimum installment amount.</Text>
            <Text style={styles.bulletPoint}>• System downtime during submission.</Text>
          </View>
        </View>

        {/* User Activity Diagram (Flowchart) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>User Activity Diagram (Flowchart)</Text>
          </View>
          <Text style={styles.text}>
            Start → Receive Prepayment → Enter Prepayment Info → System
            Calculates Installments → Save Entry → Update Schedule → End
          </Text>
        </View>

        {/* Parking Lot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Parking Lot</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Option to re-apply prepayments against principal vs. tenure.</Text>
            <Text style={styles.bulletPoint}>• Automated SMS/email alerts for prepayment acknowledgment.</Text>
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
              <Text style={styles.bulletPoint}>• Installment Prepayment Screen</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>DB Tables</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Installment Ledger</Text>
              <Text style={styles.bulletPoint}>• Customer Agreement Table</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>APIs</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Prepayment Processor</Text>
              <Text style={styles.bulletPoint}>• Schedule Updater</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Services</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Installment Recalculation Engine</Text>
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
            <Text style={styles.bulletPoint}>• Prepayment of 1, 2, 3 installments.</Text>
            <Text style={styles.bulletPoint}>• Verification of tenure update.</Text>
            <Text style={styles.bulletPoint}>• Rejection scenarios for invalid data.</Text>
          </View>
        </View>

        {/* Infra & Deployment Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Server size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Infra & Deployment Notes</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Ensure prepayment logic adheres to regulatory norms.</Text>
            <Text style={styles.bulletPoint}>• Schedule recalculations should trigger batch processes as needed.</Text>
          </View>
        </View>

        {/* Dev Team Ownership */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Dev Team Ownership</Text>
          </View>
          <Text style={styles.text}>
            Squad: Loan Management Systems Team{"\n"}
            Contact: Lead Dev - prepayment_fms@bankdomain.com{"\n"}
            JIRA: WF-INST-PREPAY-01{"\n"}
            Git Repo: /fms/installment/prepayment
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
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

export default System_InstallmentPrepayment;