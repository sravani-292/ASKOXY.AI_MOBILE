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

const System_PostDisbursalEdit = () => {
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
      <View style={styles.numberedListContent}>
        <Text style={styles.listText}>{children}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Post Disbursal Edit</Text>
      </View> */}
      
      <View style={styles.mainContent}>
        {/* Description */}
        <Section title="Description" icon={Info} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            The 'Post Disbursal Edit' use case allows a user to update
            non-financial information in a finance account. This includes adding
            new guarantor and co-applicant details (existing ones cannot be
            edited), address and contact information, work details, remarks,
            finance details, and instrument details. The primary goal is to
            ensure that the finance account reflects up-to-date non-financial
            data.
          </Text>
        </Section>

        {/* Actors */}
        <Section title="Actors" icon={Users} iconColor="#2563eb">
          <ListItem>User</ListItem>
        </Section>

        {/* User Actions & System Responses */}
        <Section title="User Actions & System Responses" icon={List} iconColor="#2563eb">
          <NumberedListItem number={1}>
            User initiates the process to modify non-financial data of a finance account.
          </NumberedListItem>
          
          <NumberedListItem number={2}>
            User inputs Agreement ID to fetch the account.
          </NumberedListItem>
          
          <NumberedListItem number={3}>
            System displays the finance account information.
          </NumberedListItem>
          
          <View style={styles.systemAction}>
            <Text style={styles.systemActionText}>System action: Retrieves and displays account details.</Text>
          </View>
          
          <NumberedListItem number={4}>
            User selects relevant tabs to add or update permissible fields like:
          </NumberedListItem>
          
          <View style={styles.nestedList}>
            <ListItem>Guarantor Details (addition only)</ListItem>
            <ListItem>Co-applicant Details (addition only)</ListItem>
            <ListItem>Address & Contact Information</ListItem>
            <ListItem>Work Details</ListItem>
            <ListItem>Instrument Details</ListItem>
          </View>
          
          <NumberedListItem number={5}>
            User modifies or adds the necessary fields and saves the changes.
          </NumberedListItem>
          
          <NumberedListItem number={6}>
            System validates and confirms the successful update of information.
          </NumberedListItem>
          
          <View style={styles.systemAction}>
            <Text style={styles.systemActionText}>System action: Validates and saves changes.</Text>
          </View>
        </Section>

        {/* Precondition */}
        <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
          <ListItem>
            A valid existing or new Finance Account must exist in the system.
          </ListItem>
        </Section>

        {/* Post Condition */}
        <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
          <ListItem>
            Non-financial information of the finance account is successfully updated.
          </ListItem>
        </Section>

        {/* Straight Through Process (STP) */}
        <Section title="Straight Through Process (STP)" icon={ArrowRight} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            Initiate Edit → Input Agreement ID → Retrieve & Display Account → Modify/Add Info → Save → Confirmation
          </Text>
        </Section>

        {/* Alternative Flows */}
        <Section title="Alternative Flows" icon={ArrowRight} iconColor="#2563eb">
          <ListItem>
            If an incorrect Agreement ID is entered, account details will not be retrieved.
          </ListItem>
        </Section>

        {/* Exception Flows */}
        <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
          <ListItem>
            Attempting to modify existing guarantor/co-applicant results in system error.
          </ListItem>
          <ListItem>Save operation fails due to validation or system issues.</ListItem>
        </Section>

        {/* User Activity Diagram (Flowchart) */}
        <Section title="User Activity Diagram (Flowchart)" icon={List} iconColor="#2563eb">
          <Text style={styles.paragraph}>
            Start → Initiate Edit → Retrieve Account by Agreement ID → Display Account Details → Modify/Add Info → Save Record → Confirmation → End
          </Text>
        </Section>

        {/* Parking Lot */}
        <Section title="Parking Lot" icon={Info} iconColor="#2563eb">
          <ListItem>
            Consider enhancement to allow edits of existing guarantor/co-applicant details in future releases.
          </ListItem>
        </Section>

        {/* System Components Involved */}
        <Section title="System Components Involved" icon={Settings} iconColor="#2563eb">
          <ListItem>Finance Management System</ListItem>
          <ListItem>Customer Information System</ListItem>
          <ListItem>Document and Instrument Module</ListItem>
        </Section>

        {/* Test Scenarios */}
        <Section title="Test Scenarios" icon={TestTube} iconColor="#2563eb">
          <ListItem>Successfully add a new guarantor.</ListItem>
          <ListItem>Modify work details.</ListItem>
          <ListItem>Add co-applicant with full details.</ListItem>
          <ListItem>Attempt to edit existing guarantor (expect failure).</ListItem>
          <ListItem>Save address and contact updates.</ListItem>
        </Section>

        {/* Infra & Deployment Notes */}
        <Section title="Infra & Deployment Notes" icon={Server} iconColor="#2563eb">
          <ListItem>All updates should be audited.</ListItem>
          <ListItem>Ensure transaction logging and validation before commit.</ListItem>
          <ListItem>
            System must have active linkage with customer modules for new entries.
          </ListItem>
        </Section>

        {/* Dev Team Ownership */}
        <Section title="Dev Team Ownership" icon={User} iconColor="#2563eb">
          <View style={styles.teamContainer}>
            <View style={styles.teamRow}>
              <Text style={styles.teamLabel}>Squad:</Text>
              <Text style={styles.teamValue}>Post Disbursal Systems Team</Text>
            </View>
            <View style={styles.teamRow}>
              <Text style={styles.teamLabel}>Contact:</Text>
              <Text style={styles.teamValue}>Tanvi Agarwal</Text>
            </View>
            <View style={styles.teamRow}>
              <Text style={styles.teamLabel}>JIRA:</Text>
              <Text style={styles.teamValue}>PD-FMS-022</Text>
            </View>
            <View style={styles.teamRow}>
              <Text style={styles.teamLabel}>Git Repo:</Text>
              <Text style={styles.teamValue}>git.company.com/FMS/post-disbursal</Text>
            </View>
          </View>
        </Section>
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
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
  },
  mainContent: {
    padding: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  sectionContent: {
    padding: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
    textAlign: "left",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingLeft: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4b5563",
    marginTop: 9,
    marginRight: 12,
    marginLeft: 4,
  },
  numberedListItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  numberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
  numberedListContent: {
    flex: 1,
  },
  listText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
    flex: 1,
  },
  nestedList: {
    marginLeft: 40,
    marginTop: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#d1d5db",
  },
  systemAction: {
    marginLeft: 40,
    marginTop: 4,
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#2563eb",
  },
  systemActionText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
    fontStyle: "italic",
  },
  teamContainer: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
  },
  teamRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  teamLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    width: 80,
  },
  teamValue: {
    fontSize: 16,
    color: "#4b5563",
    flex: 1,
  },
});

export default System_PostDisbursalEdit;