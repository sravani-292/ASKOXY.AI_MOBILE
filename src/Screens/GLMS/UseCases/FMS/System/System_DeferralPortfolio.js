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
import ImageModal from "../../ImageModal";

const System_DeferralPortfolio = () => {
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
        <Text style={styles.title}>Repayment Deferral Portfolio Wise</Text>
        <Text style={styles.subtitle}>Comprehensive System Documentation</Text>
      </View> */}
      
      <View style={styles.content}>
        {/* Description */}
        <Section title="Description" icon={Info} iconColor="#3b82f6">
          <Text style={styles.paragraph}>
            Portfolio Wise Repayment Deferral (also called Batch Wise Deferral)
            allows the bank to defer EMIs across the entire customer portfolio,
            typically during festive periods. It bypasses individual rule checks
            and applies globally via a batch upload. Customers are charged a
            deferral fee.
          </Text>
        </Section>

        {/* Actors */}
        <Section title="Actors" icon={Users} iconColor="#8b5cf6">
          <ListItem>User</ListItem>
          <ListItem>Checker</ListItem>
        </Section>

        {/* User Actions & System Responses */}
        <Section title="User Actions & System Responses" icon={List} iconColor="#3b82f6">
          <NumberedListItem number={1}>
            User prepares a file with portfolio deferral details:
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>Agreement ID</ListItem>
            <ListItem>Customer Name</ListItem>
            <ListItem>Finance Amount</ListItem>
            <ListItem>No. of Deferrals</ListItem>
            <ListItem>Effective Date</ListItem>
            <ListItem>etc.</ListItem>
          </View>

          <NumberedListItem number={2}>
            User uploads the file into the system and submits it.
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>System action: Accepts the file upload.</ListItem>
          </View>

          <NumberedListItem number={3}>
            Checker reviews and verifies the file details.
          </NumberedListItem>

          <NumberedListItem number={4}>
            If found correct, Checker authorizes the deferral.
          </NumberedListItem>

          <NumberedListItem number={5}>
            System marks the deferrals and notifies all customers listed in the batch.
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>System action: Applies deferrals and sends notifications.</ListItem>
          </View>
        </Section>

        {/* Precondition */}
        <Section title="Precondition" icon={CheckCircle} iconColor="#10b981">
          <ListItem>
            Valid finance accounts exist; batch deferral needed (e.g., festive
            season offer).
          </ListItem>
        </Section>

        {/* Post Condition */}
        <Section title="Post Condition" icon={CheckCircle} iconColor="#10b981">
          <ListItem>
            Deferral applied to all portfolio accounts listed in the uploaded
            file.
          </ListItem>
        </Section>

        {/* Straight Through Process (STP) */}
        <Section title="Straight Through Process (STP)" icon={ArrowRight} iconColor="#f59e0b">
          <View style={styles.processFlow}>
            <Text style={styles.processText}>
              Create File → Upload File → Checker Authorization → Mark Deferrals → Notify Customers
            </Text>
          </View>
        </Section>

        {/* Alternative Flows */}
        <Section title="Alternative Flows" icon={ArrowRight} iconColor="#06b6d4">
          <ListItem>
            If discrepancies are found by the checker, the file is returned
            for user modification.
          </ListItem>
        </Section>

        {/* Exception Flows */}
        <Section title="Exception Flows" icon={AlertCircle} iconColor="#ef4444">
          <ListItem>File format invalid → System rejects upload.</ListItem>
          <ListItem>
            Missing fields → Error prompts user to correct and resubmit.
          </ListItem>
          <ListItem>Authorization fails → No deferrals marked.</ListItem>
        </Section>

        {/* User Activity Diagram (Flowchart) */}
        <Section title="User Activity Diagram (Flowchart)" icon={List} iconColor="#3b82f6">
          <View style={styles.processFlow}>
            <Text style={styles.processText}>
              Start → Create Upload File → Upload & Submit → Checker Verifies →
              Authorize? → Deferral Marked & Notified → End (If discrepancy →
              Modify File → Resubmit)
            </Text>
          </View>
        </Section>

        {/* Parking Lot */}
        <Section title="Parking Lot" icon={Info} iconColor="#f59e0b">
          <ListItem>
            Enhance file validation to check format and required fields before
            allowing upload.
          </ListItem>
        </Section>

        {/* System Components Involved */}
        <Section title="System Components Involved" icon={Settings} iconColor="#6366f1">
          <ListItem>Batch Upload Engine</ListItem>
          <ListItem>Deferral Processing Module</ListItem>
          <ListItem>Notification System</ListItem>
        </Section>

        {/* Test Scenarios */}
        <Section title="Test Scenarios" icon={TestTube} iconColor="#ec4899">
          <ListItem>Upload valid file and verify successful deferral marking.</ListItem>
          <ListItem>
            Upload file with missing/incorrect data and expect system
            rejections.
          </ListItem>
          <ListItem>
            Ensure customer notifications are triggered post authorization.
          </ListItem>
        </Section>

        {/* Infra & Deployment Notes */}
        <Section title="Infra & Deployment Notes" icon={Server} iconColor="#14b8a6">
          <ListItem>
            Secure handling of upload files; system must log all upload
            attempts and authorization actions.
          </ListItem>
        </Section>

        {/* Dev Team Ownership */}
        <Section title="Dev Team Ownership" icon={User} iconColor="#8b5cf6">
          <View style={styles.ownershipInfo}>
            <View style={styles.ownershipRow}>
              <Text style={styles.ownershipLabel}>Squad:</Text>
              <Text style={styles.ownershipValue}>Deferral Automation Team</Text>
            </View>
            <View style={styles.ownershipRow}>
              <Text style={styles.ownershipLabel}>Contact:</Text>
              <Text style={styles.ownershipValue}>Ravi Mehta</Text>
            </View>
            <View style={styles.ownershipRow}>
              <Text style={styles.ownershipLabel}>JIRA:</Text>
              <Text style={styles.ownershipValue}>DEF-BATCH-003</Text>
            </View>
            <View style={styles.ownershipRow}>
              <Text style={styles.ownershipLabel}>Git Repo:</Text>
              <Text style={styles.ownershipValue}>git.company.com/batch-deferral</Text>
            </View>
            <ImageModal imageSource={'https://i.ibb.co/rRLjxCB0/portfolio-wise-defferral.jpg'}/>
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

export default System_DeferralPortfolio;