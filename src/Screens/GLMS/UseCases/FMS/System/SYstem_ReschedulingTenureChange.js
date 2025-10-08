import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import {
  Info,
  Users,
  List,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Settings,
  TestTube,
  Server,
  User,
} from "lucide-react-native";


const System_ReschedulingTenureChange = () => {
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
      {/* <View style={styles.header}>
        <Text style={styles.title}>Finance Rescheduling - Tenure Change</Text>
      </View> */}

      {/* ===== CARD AREA ===== */}
      <View style={styles.card}>
        {/* Description */}
        <Section title="Description" icon={Info} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            This use case covers the process of changing the tenure of a finance
            account at the customer's request. Adjusting the tenure affects the
            installment amounts, and a new repayment schedule must be generated.
            The request is handled by a User and verified by a Checker before
            final authorization.
          </Text>
        </Section>

        {/* Actors */}
        <Section title="Actors" icon={Users} iconColor="#2563eb">
          <ListItem>Customer</ListItem>
          <ListItem>User</ListItem>
          <ListItem>Checker</ListItem>
        </Section>

        {/* User Actions & System Responses */}
        <Section title="User Actions & System Responses" icon={List} iconColor="#2563eb">
          <NumberedListItem number={1}>
            Customer visits the bank and submits a request to modify the tenure of an existing Finance Account.
          </NumberedListItem>
          <NumberedListItem number={2}>
            User verifies the request and applicable rules for tenure change.
          </NumberedListItem>
          <NumberedListItem number={3}>
            Upon validation, the User retrieves the Finance Account details using Agreement ID and initiates the process.
          </NumberedListItem>
          <NumberedListItem number={4}>
            System displays the following details:
          </NumberedListItem>

          {/* Nested list */}
          <View style={styles.nestedList}>
            {[
              "Finance No",
              "Agreement ID",
              "Loan Amount",
              "Original Tenure",
              "EMI Amount",
              "Due Date",
              "Reschedule Effective Date",
              "Repayment Effective Date",
              "Bulk Refund Amount",
              "Balance Tenure",
              "Frequency",
              "Rate of Interest",
            ].map((item, index) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </View>

          <NumberedListItem number={5}>
            User modifies the Balance Tenure and submits the request for generation of the New Repayment Schedule.
          </NumberedListItem>

          <NumberedListItem number={6}>
            Checker retrieves the new schedule using Agreement ID, verifies it, and authorizes if correct.
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>System action: Processes authorization.</ListItem>
          </View>

          <NumberedListItem number={7}>
            If authorized, the new repayment schedule is generated and the customer is notified.
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>System action: Generates schedule and sends notification.</ListItem>
          </View>

          <NumberedListItem number={8}>
            If any discrepancy is found, the request is returned to User for correction and resubmission.
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>System action: Allows correction and resubmission.</ListItem>
          </View>
        </Section>

        {/* Preconditions */}
        <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
          <ListItem>
            A valid finance account must exist and the customer must request a tenure change.
          </ListItem>
        </Section>

        {/* Postconditions */}
        <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
          <ListItem>Tenure is modified successfully.</ListItem>
          <ListItem>New repayment schedule is generated and shared with the customer.</ListItem>
        </Section>

        {/* STP */}
        <Section title="Straight Through Process (STP)" icon={ArrowRight} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            Customer Request → Verification → Tenure Modification → Schedule Generation → Authorization → Notification
          </Text>
        </Section>

        {/* Alternative Flows */}
        <Section title="Alternative Flows" icon={ArrowRight} iconColor="#2563eb">
          <ListItem>
            If Checker finds discrepancies, the schedule is returned to User for correction.
          </ListItem>
        </Section>

        {/* Exception Flows */}
        <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
          <ListItem>Invalid account details.</ListItem>
          <ListItem>Rule violation.</ListItem>
          <ListItem>System failure during schedule generation.</ListItem>
        </Section>

        {/* Flowchart */}
        <Section title="User Activity Diagram (Flowchart)" icon={List} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            Start → Submit Request → Verify Request → Modify Tenure → Generate Schedule → Checker Verifies → Authorize or Return → Notify Customer → End
          </Text>
        </Section>

        {/* Parking Lot */}
        <Section title="Parking Lot" icon={Info} iconColor="#2563eb">
          <ListItem>
            Introduce self-service option for tenure changes via digital channels.
          </ListItem>
        </Section>

        {/* System Components */}
        <Section title="System Components Involved" icon={Settings} iconColor="#2563eb">
          <ListItem>Finance Core System</ListItem>
          <ListItem>Schedule Generator</ListItem>
          <ListItem>Authorization Module</ListItem>
          <ListItem>Notification System</ListItem>
        </Section>

        {/* Test Scenarios */}
        <Section title="Test Scenarios" icon={TestTube} iconColor="#2563eb">
          <ListItem>Tenure updated correctly with new EMI calculated.</ListItem>
          <ListItem>Invalid request results in error message.</ListItem>
          <ListItem>Discrepant schedule is rejected by Checker.</ListItem>
          <ListItem>Notification is sent upon approval.</ListItem>
        </Section>

        {/* Infra & Deployment */}
        <Section title="Infra & Deployment Notes" icon={Server} iconColor="#2563eb">
          <ListItem>Ensure versioning of repayment schedules.</ListItem>
          <ListItem>Maintain rollback options.</ListItem>
        </Section>

        {/* Dev Team */}
        <Section title="Dev Team Ownership" icon={User} iconColor="#2563eb">
          <View style={styles.teamInfo}>
            <Text style={styles.teamText}>
              <Text style={styles.label}>Squad:</Text> Finance Adjustments Squad
            </Text>
            <Text style={styles.teamText}>
              <Text style={styles.label}>Contact:</Text> Sneha Das
            </Text>
            <Text style={styles.teamText}>
              <Text style={styles.label}>JIRA:</Text> FMS-TEN-913
            </Text>
            <Text style={styles.teamText}>
              <Text style={styles.label}>Git Repo:</Text> git.company.com/FMS/tenure-change
            </Text>
          </View>
        </Section>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
  },
  card: {
    margin: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  sectionContent: {
    padding: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingLeft: 4,
  },
  numberedListItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#475569",
    marginTop: 9,
    marginRight: 12,
  },
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
  number: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  listText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
    flex: 1,
  },
  nestedList: {
    marginLeft: 36,
    marginTop: 4,
    marginBottom: 8,
  },
  teamInfo: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
  },
  teamText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
    marginBottom: 4,
  },
  label: {
    fontWeight: "600",
    color: "#1e293b",
  },
});

export default System_ReschedulingTenureChange;
