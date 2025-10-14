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

const System_DeferralConstitutionWise = () => {
  const Section = ({ title, icon: Icon, iconColor, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Icon size={20} color={iconColor} />
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
      <Text style={styles.listText}>{children}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Repayment Deferral Constitution Wise</Text>
      </View>
      
      <View style={styles.card}>
        {/* Description */}
        <Section title="Description" icon={Info} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            Repayment deferral is a process where customers can postpone their
            EMI payments for a specific period, typically during special
            circumstances like festivals. Constitution Wise Deferral allows
            banks to process deferral requests in bulk, based on customer
            constitution (e.g., SME). Users can apply deferral rules based on
            constitution, which displays all relevant finances under that
            customer segment for selection.
          </Text>
        </Section>

        {/* Actors */}
        <Section title="Actors" icon={Users} iconColor="#2563eb">
          <ListItem>User</ListItem>
          <ListItem>Checker</ListItem>
        </Section>

        {/* User Actions & System Responses */}
        <Section title="User Actions & System Responses" icon={List} iconColor="#2563eb">
          <NumberedListItem number={1}>
            User initiates Constitution Based Repayment Deferral.
          </NumberedListItem>
          <NumberedListItem number={2}>
            User selects the constitution from the dropdown (e.g., SME).
          </NumberedListItem>
          <NumberedListItem number={3}>
            System displays all finance accounts under the selected constitution.
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>System action: Retrieves and displays finance accounts.</ListItem>
          </View>
          <NumberedListItem number={4}>
            User selects one or more finance accounts to defer.
          </NumberedListItem>
          <NumberedListItem number={5}>
            User inputs:
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>Deferral Effective Date</ListItem>
            <ListItem>Number of Deferrals</ListItem>
          </View>
          <NumberedListItem number={6}>
            User submits the deferral record.
          </NumberedListItem>
          <NumberedListItem number={7}>
            Checker reviews and authorizes the record if correct.
          </NumberedListItem>
          <NumberedListItem number={8}>
            System confirms deferral and sends notification to customers.
          </NumberedListItem>
          <View style={styles.nestedList}>
            <ListItem>System action: Applies deferral and sends notifications.</ListItem>
          </View>
        </Section>

        {/* Precondition */}
        <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
          <ListItem>
            Finance Account exists and a need for repayment deferral is
            identified.
          </ListItem>
        </Section>

        {/* Post Condition */}
        <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
          <ListItem>
            Deferral is applied to selected finance accounts based on
            constitution.
          </ListItem>
        </Section>

        {/* Straight Through Process (STP) */}
        <Section title="Straight Through Process (STP)" icon={ArrowRight} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            Initiate → Select Constitution → Display Accounts → Input Deferral
            Details → Submit → Checker Authorization → Notify
          </Text>
        </Section>

        {/* Alternative Flows */}
        <Section title="Alternative Flows" icon={ArrowRight} iconColor="#2563eb">
          <ListItem>
            If the selected constitution has no finance accounts, no data will
            be displayed.
          </ListItem>
        </Section>

        {/* Exception Flows */}
        <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
          <ListItem>
            Discrepancy found by checker → Modification required → Resubmit
            for authorization.
          </ListItem>
          <ListItem>Missing or invalid data → System validation fails.</ListItem>
        </Section>

        {/* User Activity Diagram (Flowchart) */}
        <Section title="User Activity Diagram (Flowchart)" icon={List} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            Start → Initiate Constitution Based Deferral → Select Constitution →
            Display Accounts → Select Accounts → Enter Deferral Info → Submit →
            Checker Verification → Authorization → Notify → End
          </Text>
        </Section>

        {/* Parking Lot */}
        <Section title="Parking Lot" icon={Info} iconColor="#2563eb">
          <ListItem>
            Automated rule assignment for constitutions could reduce manual
            inputs.
          </ListItem>
        </Section>

        {/* System Components Involved */}
        <Section title="System Components Involved" icon={Settings} iconColor="#2563eb">
          <ListItem>Deferral Processing Module</ListItem>
          <ListItem>Customer Segmentation Engine</ListItem>
          <ListItem>Notification Service</ListItem>
        </Section>

        {/* Test Scenarios */}
        <Section title="Test Scenarios" icon={TestTube} iconColor="#2563eb">
          <ListItem>Select SME constitution and apply deferral to all accounts.</ListItem>
          <ListItem>
            Attempt submission with missing effective date (expect error).
          </ListItem>
          <ListItem>Checker rejects due to discrepancy, user resubmits.</ListItem>
          <ListItem>Notification sent upon successful authorization.</ListItem>
        </Section>

        {/* Infra & Deployment Notes */}
        <Section title="Infra & Deployment Notes" icon={Server} iconColor="#2563eb">
          <ListItem>
            Ensure segment rules and constitution values are up to date.
          </ListItem>
          <ListItem>Maintain audit log for all submissions and approvals.</ListItem>
        </Section>

        {/* Dev Team Ownership */}
        <Section title="Dev Team Ownership" icon={User} iconColor="#2563eb">
          <View style={styles.teamInfo}>
            <Text style={styles.teamText}><Text style={styles.label}>Squad:</Text> Repayment Management Team</Text>
            <Text style={styles.teamText}><Text style={styles.label}>Contact:</Text> Sunil Kumar</Text>
            <Text style={styles.teamText}><Text style={styles.label}>JIRA:</Text> DEF-CON-008</Text>
            <Text style={styles.teamText}><Text style={styles.label}>Git Repo:</Text> git.company.com/deferral-module</Text>
          </View>
          <ImageModal imageSource={'https://i.ibb.co/VWZsL214/repayment-deferral.jpg'}/>
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    backgroundColor: "transparent",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
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
    marginBottom: 12,
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
    marginTop: 8,
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

export default System_DeferralConstitutionWise;