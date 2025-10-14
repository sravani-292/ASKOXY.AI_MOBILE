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
import ImageModal from "../../ImageModal"
const System_DeferralFinanceWise = () => {
  const Section = ({ title, icon: Icon, iconColor, children }) => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Icon size={22} color={iconColor} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
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
      <View style={styles.numberedContent}>
        <Text style={styles.listText}>{children}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Repayment Deferral Finance Wise</Text>
        <Text style={styles.subtitle}>Comprehensive System Documentation</Text>
      </View> */}
      
      <View style={styles.content}>
        {/* Description */}
        <Section title="Description" icon={Info} iconColor="#3b82f6">
          <Text style={styles.paragraph}>
            Finance Wise Repayment Deferral allows a customer to defer their EMI
            payments for a particular finance account, typically requested
            around special periods like festivals. This deferral process is
            initiated individually for specific finances based on customer
            requests. It includes steps for rule validation, schedule
            regeneration, and approval by a checker.
          </Text>
        </Section>

        {/* Actors */}
        <Section title="Actors" icon={Users} iconColor="#8b5cf6">
          <ListItem>Customer</ListItem>
          <ListItem>User</ListItem>
          <ListItem>Checker</ListItem>
        </Section>

        {/* User Actions & System Responses */}
        <Section title="User Actions & System Responses" icon={List} iconColor="#3b82f6">
          <NumberedListItem number={1}>
            Customer submits a deferral request, specifying number of deferrals.
          </NumberedListItem>

          <NumberedListItem number={2}>
            User verifies the request and checks the applicable deferral rules.
          </NumberedListItem>

          <NumberedListItem number={3}>
            If rules are met, user retrieves the finance account by Agreement ID.
          </NumberedListItem>

          <NumberedListItem number={4}>
            System displays deferral details screen including Agreement ID, Customer ID, EMI amount, etc.
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>System action: Displays deferral details screen.</ListItem>
          </View>

          <NumberedListItem number={5}>
            User enters:
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>Deferral Effective Date</ListItem>
            <ListItem>Number of Deferrals</ListItem>
            <ListItem>Deferral Charges</ListItem>
            <ListItem>Next Repayment Date</ListItem>
          </View>

          <NumberedListItem number={6}>
            User generates new repayment schedule and submits for checker authorization.
          </NumberedListItem>

          <NumberedListItem number={7}>
            Checker verifies and authorizes.
          </NumberedListItem>

          <NumberedListItem number={8}>
            System notifies customer of updated repayment schedule.
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>System action: Sends notification to customer.</ListItem>
          </View>
        </Section>

        {/* Precondition */}
        <Section title="Precondition" icon={CheckCircle} iconColor="#10b981">
          <ListItem>
            Customer has a valid finance account and submits a formal deferral request.
          </ListItem>
        </Section>

        {/* Post Condition */}
        <Section title="Post Condition" icon={CheckCircle} iconColor="#10b981">
          <ListItem>
            New repayment schedule is applied to the finance account and shared with the customer.
          </ListItem>
        </Section>

        {/* Straight Through Process (STP) */}
        <Section title="Straight Through Process (STP)" icon={ArrowRight} iconColor="#f59e0b">
          <View style={styles.processFlow}>
            <Text style={styles.processText}>
              Customer Request → Verify Rules → Enter Deferral Details → Generate & Submit Schedule → Checker Authorization → Notify Customer
            </Text>
          </View>
        </Section>

        {/* Alternative Flows */}
        <Section title="Alternative Flows" icon={ArrowRight} iconColor="#06b6d4">
          <ListItem>
            If finance account fails eligibility check, system will prevent submission.
          </ListItem>
        </Section>

        {/* Exception Flows */}
        <Section title="Exception Flows" icon={AlertCircle} iconColor="#ef4444">
          <ListItem>
            Checker finds discrepancy → Returns to user for modification.
          </ListItem>
          <ListItem>
            User updates and resubmits the deferral record for authorization.
          </ListItem>
        </Section>

        {/* User Activity Diagram (Flowchart) */}
        <Section title="User Activity Diagram (Flowchart)" icon={List} iconColor="#3b82f6">
          <View style={styles.processFlow}>
            <Text style={styles.processText}>
              Start → Customer Request → Rule Verification → Eligibility Met? → Retrieve Account → Enter Deferral Details → Submit → Checker Review → Authorized? → Notify Customer → End
            </Text>
          </View>
        </Section>

        {/* Parking Lot */}
        <Section title="Parking Lot" icon={Info} iconColor="#f59e0b">
          <ListItem>
            Add pre-validation check for finance eligibility before screen launch.
          </ListItem>
        </Section>

        {/* System Components Involved */}
        <Section title="System Components Involved" icon={Settings} iconColor="#6366f1">
          <ListItem>Repayment Schedule Engine</ListItem>
          <ListItem>Finance Account Management Module</ListItem>
          <ListItem>Notification System</ListItem>
        </Section>

        {/* Test Scenarios */}
        <Section title="Test Scenarios" icon={TestTube} iconColor="#ec4899">
          <ListItem>
            Submit a valid deferral request and validate updated schedule.
          </ListItem>
          <ListItem>Submit with missing parameters and expect system errors.</ListItem>
          <ListItem>
            Checker returns with discrepancy and verify resubmission flow.
          </ListItem>
          <ListItem>Confirm customer receives deferral notification.</ListItem>
        </Section>

        {/* Infra & Deployment Notes */}
        <Section title="Infra & Deployment Notes" icon={Server} iconColor="#14b8a6">
          <ListItem>Maintain backup of original repayment schedule.</ListItem>
          <ListItem>Audit logging required for each deferral action.</ListItem>
        </Section>

        {/* Dev Team Ownership */}
        <Section title="Dev Team Ownership" icon={User} iconColor="#8b5cf6">
          <View style={styles.ownershipInfo}>
            <View style={styles.ownershipRow}>
              <Text style={styles.ownershipLabel}>Squad:</Text>
              <Text style={styles.ownershipValue}>Repayment Processing Team</Text>
            </View>
            <View style={styles.ownershipRow}>
              <Text style={styles.ownershipLabel}>Contact:</Text>
              <Text style={styles.ownershipValue}>Sneha Reddy</Text>
            </View>
            <View style={styles.ownershipRow}>
              <Text style={styles.ownershipLabel}>JIRA:</Text>
              <Text style={styles.ownershipValue}>DEF-FIN-002</Text>
            </View>
            <View style={styles.ownershipRow}>
              <Text style={styles.ownershipLabel}>Git Repo:</Text>
              <Text style={styles.ownershipValue}>git.company.com/finance-deferral</Text>
            </View>
          </View>
          <ImageModal imageSource={'https://i.ibb.co/SXDC5zTj/32.png'}/>
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#3b82f6",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#dbeafe",
    textAlign: "center",
  },
  content: {
    padding: 16,
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  sectionContent: {
    padding: 20,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4b5563",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingRight: 10,
  },
  numberedListItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingRight: 10,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    marginTop: 8,
    marginRight: 12,
    flexShrink: 0,
  },
  numberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 0,
    flexShrink: 0,
  },
  number: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e40af",
  },
  numberedContent: {
    flex: 1,
    flexShrink: 1,
  },
  listText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 23,
    color: "#374151",
  },
  nestedList: {
    marginTop: 8,
    marginLeft: 40,
    marginBottom: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: "#e5e7eb",
  },
  processFlow: {
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  processText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#1e40af",
    fontWeight: "500",
  },
  ownershipInfo: {
    gap: 14,
  },
  ownershipRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
  },
  ownershipLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6b7280",
    width: 100,
    flexShrink: 0,
  },
  ownershipValue: {
    fontSize: 15,
    color: "#111827",
    flex: 1,
    flexShrink: 1,
  },
});

export default System_DeferralFinanceWise;