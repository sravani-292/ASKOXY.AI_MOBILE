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

const PDC_Printing_Use_Case = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Heading */}
      <View style={styles.header}>
        <Text style={styles.headerText}>PDC Printing</Text>
      </View>
      
      <View style={styles.card}>
        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.text}>
            This use case describes the process of printing Post Dated Cheques
            (PDCs) once a finance application has been approved and the customer
            has opted to repay via PDCs. The process includes collecting blank
            cheques, saving repayment details, and printing cheques with
            appropriate installment information based on the repayment schedule.
          </Text>
        </View>

        {/* Actors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Actors</Text>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Customer-facing</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Finance Officer</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>System roles</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Loan Origination System (LOS)</Text>
              <Text style={styles.bulletPoint}>• PDC Printing Module</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Software stakeholders</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• API Developer</Text>
              <Text style={styles.bulletPoint}>• QA Engineer</Text>
              <Text style={styles.bulletPoint}>• Infra Team</Text>
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
            <Text style={styles.numberedPoint}>1. User receives blank PDCs from the customer.</Text>
            <Text style={styles.numberedPoint}>2. User sets 'PDC' as the repayment mode in the system.</Text>
            <Text style={styles.numberedPoint}>3. System enables PDC collections section for input.</Text>
            <Text style={styles.numberedPoint}>4. User enters Application ID to fetch loan details.</Text>
            <Text style={styles.numberedPoint}>5. System displays due installments and allows selection.</Text>
            <Text style={styles.numberedPoint}>6. User inserts cheques into the printer.</Text>
            <Text style={styles.numberedPoint}>7. System prints each cheque with Payee Name, Due Date, and Installment Amount.</Text>
          </View>
        </View>

        {/* Precondition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Precondition</Text>
          </View>
          <Text style={styles.text}>
            Customer must have submitted the PDC cheques and selected 'PDC' as
            the mode of repayment.
          </Text>
        </View>

        {/* Post Condition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Post Condition</Text>
          </View>
          <Text style={styles.text}>
            PDCs are printed with the correct details and ready for installment
            processing.
          </Text>
        </View>

        {/* Straight Through Process (STP) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Straight Through Process (STP)</Text>
          </View>
          <Text style={styles.text}>
            Login → Enter Application ID → Insert Cheques → Print → Logout
          </Text>
        </View>

        {/* Alternative Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Alternative Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Reprinting a cheque in case of misprint</Text>
            <Text style={styles.bulletPoint}>• Printing revised cheques in case of updated financial parameters</Text>
          </View>
        </View>

        {/* Exception Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={18} color="#dc2626" />
            <Text style={styles.sectionTitle}>Exception Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Printer jam or error</Text>
            <Text style={styles.bulletPoint}>• Incorrect Application ID entered</Text>
            <Text style={styles.bulletPoint}>• Missing or invalid cheque paper</Text>
          </View>
        </View>

        {/* User Activity Diagram (Flowchart) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>User Activity Diagram (Flowchart)</Text>
          </View>
          <Text style={styles.text}>
            Start → Receive PDCs → Enter Repayment Info → Enter Application ID →
            Load Installments → Insert Cheques → Print Cheques → End
          </Text>
        </View>

        {/* Parking Lot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Parking Lot</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Integration with digital cheque systems</Text>
            <Text style={styles.bulletPoint}>• Auto-verification of printed data using OCR</Text>
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
              <Text style={styles.bulletPoint}>• PDC Collections Screen</Text>
              <Text style={styles.bulletPoint}>• Print Interface</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>APIs</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Application Lookup</Text>
              <Text style={styles.bulletPoint}>• Installment Fetch</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>DB Tables</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• RepaymentSchedule</Text>
              <Text style={styles.bulletPoint}>• ChequePrintLog</Text>
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
            <Text style={styles.bulletPoint}>• Successful cheque printing</Text>
            <Text style={styles.bulletPoint}>• Invalid application ID input</Text>
            <Text style={styles.bulletPoint}>• Printer error simulation</Text>
            <Text style={styles.bulletPoint}>• Installment schedule update and reprint</Text>
          </View>
        </View>

        {/* Infra & Deployment Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Server size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Infra & Deployment Notes</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Requires secure printer connectivity</Text>
            <Text style={styles.bulletPoint}>• Printer drivers must be pre-installed</Text>
            <Text style={styles.bulletPoint}>• Rollout in phased manner by region</Text>
          </View>
        </View>

        {/* Dev Team Ownership */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Dev Team Ownership</Text>
          </View>
          <Text style={styles.text}>
            Squad: Lending Ops Automation{"\n"}
            Contact: lending-tech-lead@company.com{"\n"}
            Jira: PDC-PRINT-101{"\n"}
            Repo: gitlab.com/company/lending/pdc-printing
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

export default PDC_Printing_Use_Case;