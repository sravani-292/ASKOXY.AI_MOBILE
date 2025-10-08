import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import {
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

const System_SettlementsPayments = () => {
  const Section = ({ title, icon: Icon, iconColor, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Icon size={20} color={iconColor} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const ListItem = ({ children }) => (
    <View style={styles.listItem}>
      <View style={styles.bullet} />
      <Text style={styles.listText}>{children}</Text>
    </View>
  );

  const NumberedListItem = ({ number, children }) => (
    <View style={styles.numberedListItem}>
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{number}</Text>
      </View>
      <Text style={styles.listText}>{children}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>WF_FMS Settlements - Payments</Text>
      </View>

      <View style={styles.card}>
        {/* Description */}
        <Section title="Description" icon={Info} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            The Payments module in the Financial Management System (FMS)
            facilitates disbursement of funds to business partners such as
            customers, dealers, and builders. Payments are made against dues like
            excess amounts, termination settlements, insurance premiums, and
            disbursals. The system captures payment details and generates payment
            advices based on transactions.
          </Text>
        </Section>

        {/* Actors */}
        <Section title="Actors" icon={Users} iconColor="#2563eb">
          <ListItem>Bank Officer</ListItem>
          <ListItem>Financial Management System (FMS)</ListItem>
          <ListItem>Settlements Team</ListItem>
          <ListItem>Finance Department</ListItem>
          <ListItem>Compliance Team</ListItem>
        </Section>

        {/* User Actions & System Responses */}
        <Section title="User Actions & System Responses" icon={List} iconColor="#2563eb">
          <NumberedListItem number={1}>
            User logs into FMS and navigates to Settlement Payments screen.
          </NumberedListItem>
          <NumberedListItem number={2}>
            Specifies the finance account for which payment is to be initiated.
          </NumberedListItem>
          <NumberedListItem number={3}>
            Enters payment mode (Cheque, Cash, Fund Transfer) and transaction details.
          </NumberedListItem>
          <NumberedListItem number={4}>
            Captures beneficiary details:
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>Cheque ID</ListItem>
            <ListItem>Currency</ListItem>
            <ListItem>Date</ListItem>
            <ListItem>Customer Name</ListItem>
            <ListItem>Amount</ListItem>
            <ListItem>Cheque No</ListItem>
            <ListItem>Payee Info (In Favor Of, Payable At, Account No.)</ListItem>
            <ListItem>Reason for Payment</ListItem>
          </View>
          <NumberedListItem number={5}>
            System generates dues automatically or allows manual adjustments.
          </NumberedListItem>
          <NumberedListItem number={6}>
            User creates payment advices based on category:
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>Disbursal Payments</ListItem>
            <ListItem>Insurance Premium</ListItem>
            <ListItem>Excess Money Refund</ListItem>
          </View>
          <NumberedListItem number={7}>
            System validates and saves payment details.
          </NumberedListItem>
          <NumberedListItem number={8}>
            Payment details are sent for authorization before disbursement.
          </NumberedListItem>
        </Section>

        {/* Precondition */}
        <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
          <ListItem>Finance account exists with pending dues.</ListItem>
          <ListItem>Valid beneficiary details are available.</ListItem>
        </Section>

        {/* Post Condition */}
        <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
          <ListItem>Payment entry created and processed for authorization.</ListItem>
          <ListItem>Payment advices recorded in system logs.</ListItem>
        </Section>

        {/* STP */}
        <Section title="Straight Through Process (STP)" icon={ArrowRight} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            Login → Select Finance → Enter Payment Details → Capture Beneficiary Info →
            Generate Advice → Submit for Authorization → Logout
          </Text>
        </Section>

        {/* Alternative Flows */}
        <Section title="Alternative Flows" icon={ArrowRight} iconColor="#2563eb">
          <ListItem>Manual adjustment of dues.</ListItem>
          <ListItem>Generation of single/multiple advices based on logic.</ListItem>
        </Section>

        {/* Exception Flows */}
        <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
          <ListItem>Invalid beneficiary details.</ListItem>
          <ListItem>Missing mandatory fields during entry.</ListItem>
          <ListItem>Authorization rejection.</ListItem>
        </Section>

        {/* Flowchart */}
        <Section title="User Activity Diagram (Flowchart)" icon={List} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            Start → Login → Select Finance → Enter Payment Info → Capture Beneficiary →
            Generate Advice → Submit for Authorization → End
          </Text>
        </Section>

        {/* Parking Lot */}
        <Section title="Parking Lot" icon={Info} iconColor="#2563eb">
          <ListItem>Auto-suggestion of dues based on history.</ListItem>
          <ListItem>Integration with gateways for direct disbursement.</ListItem>
        </Section>

        {/* System Components */}
        <Section title="System Components Involved" icon={Settings} iconColor="#2563eb">
          <ListItem>Settlements Payment Screen</ListItem>
          <ListItem>Payment Ledger</ListItem>
          <ListItem>Partner Master</ListItem>
          <ListItem>Payment Advice Generator</ListItem>
          <ListItem>Authorization Queue Handler</ListItem>
          <ListItem>Validation Engine</ListItem>
          <ListItem>Maker-Checker Workflow</ListItem>
        </Section>

        {/* Test Scenarios */}
        <Section title="Test Scenarios" icon={TestTube} iconColor="#2563eb">
          <ListItem>Creation of payment advice for all modes.</ListItem>
          <ListItem>Manual adjustment of multiple dues.</ListItem>
          <ListItem>Authorization and rejection flow validation.</ListItem>
          <ListItem>Voucher generation upon approval.</ListItem>
        </Section>

        {/* Infra & Deployment Notes */}
        <Section title="Infra & Deployment Notes" icon={Server} iconColor="#2563eb">
          <ListItem>Ensure maker-checker workflow is secured.</ListItem>
          <ListItem>Reconciliation report setup for all payment types.</ListItem>
        </Section>

        {/* Dev Team Ownership */}
        <Section title="Dev Team Ownership" icon={User} iconColor="#2563eb">
          <View style={styles.teamInfo}>
            <Text style={styles.teamText}><Text style={styles.label}>Squad:</Text> Settlements & Disbursement Team</Text>
            <Text style={styles.teamText}><Text style={styles.label}>Contact:</Text> payments_fms@bankdomain.com</Text>
            <Text style={styles.teamText}><Text style={styles.label}>JIRA:</Text> WF-PAYMENTS-01</Text>
            <Text style={styles.teamText}><Text style={styles.label}>Git Repo:</Text> /fms/settlements/payments</Text>
          </View>
        </Section>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    elevation: 3,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#1e293b", textAlign: "center" },
  card: { margin: 16 },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#1e293b" },
  sectionContent: { padding: 16 },
  paragraph: { fontSize: 16, lineHeight: 24, color: "#475569" },
  listItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12, paddingLeft: 4 },
  numberedListItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#475569", marginTop: 9, marginRight: 12 },
  numberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  number: { fontSize: 14, fontWeight: "600", color: "white" },
  listText: { fontSize: 16, lineHeight: 24, color: "#475569", flex: 1 },
  nestedList: { marginLeft: 36, marginTop: 8, marginBottom: 8 },
  teamInfo: { backgroundColor: "#f8fafc", padding: 12, borderRadius: 8 },
  teamText: { fontSize: 16, lineHeight: 24, color: "#475569", marginBottom: 4 },
  label: { fontWeight: "600", color: "#1e293b" },
});

export default System_SettlementsPayments;
