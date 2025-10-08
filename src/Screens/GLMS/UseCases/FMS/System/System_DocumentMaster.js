import React from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  SafeAreaView 
} from "react-native";
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

const System_DocumentMaster = () => {
  const Section = ({ title, icon: Icon, iconColor = "#2563eb", children }) => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Icon size={18} color={iconColor} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  const ListItem = ({ children }) => (
    <View style={styles.listItem}>
      <View style={styles.bullet} />
      <Text style={styles.listText}>{children}</Text>
    </View>
  );

  const OrderedListItem = ({ number, children }) => (
    <View style={styles.orderedListItem}>
      <Text style={styles.orderedListNumber}>{number}.</Text>
      <Text style={styles.orderedListText}>{children}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        {/* <View style={styles.headerCard}>
          <Text style={styles.title}>WF_Document_Master</Text>
        </View> */}

        <View style={styles.mainCard}>
          {/* Description */}
          <Section title="Description" icon={Info}>
            <Text style={styles.paragraph}>
              This use case outlines the functionality of maintaining a
              centralized Document Master, which tracks documents across various
              contract lifecycle stages such as discounting, purchase,
              rescheduling, etc. The Document Master allows for checklist
              management based on finance type, customer constitution, segment,
              and product. It also supports status updates and deferral tracking.
            </Text>
          </Section>

          {/* Actors */}
          <Section title="Actors" icon={Users}>
            <Text style={styles.subheading}>Primary Actor</Text>
            <View style={styles.listContainer}>
              <ListItem>User</ListItem>
            </View>
          </Section>

          {/* User Actions & System Responses */}
          <Section title="User Actions & System Responses" icon={List}>
            <View style={styles.orderedList}>
              <OrderedListItem number={1}>
                User initiates the Document Master update process.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System prompts for Agreement ID.</ListItem>
              </View>
              
              <OrderedListItem number={2}>
                User enters Agreement ID.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System retrieves and displays the Document Master details including:</ListItem>
                <View style={styles.doubleNestedList}>
                  <ListItem>Document Stage</ListItem>
                  <ListItem>Document For</ListItem>
                  <ListItem>Customer Name</ListItem>
                  <ListItem>Finance Type</ListItem>
                  <ListItem>Guarantor/Co-Applicant</ListItem>
                  <ListItem>Maker ID</ListItem>
                  <ListItem>Checker ID</ListItem>
                  <ListItem>Document Details:</ListItem>
                  <View style={styles.tripleNestedList}>
                    <ListItem>Description</ListItem>
                    <ListItem>Document</ListItem>
                    <ListItem>Mandatory</ListItem>
                    <ListItem>Status</ListItem>
                    <ListItem>Date</ListItem>
                    <ListItem>Tracker No</ListItem>
                    <ListItem>Reason</ListItem>
                    <ListItem>Target Date</ListItem>
                    <ListItem>Validity Date</ListItem>
                    <ListItem>Remarks</ListItem>
                  </View>
                </View>
              </View>
              
              <OrderedListItem number={3}>
                User updates document statuses (waived, pending, complete, incomplete).
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System saves the updated document records.</ListItem>
              </View>
              
              <OrderedListItem number={4}>
                System enables deferral tracking for future monitoring.
              </OrderedListItem>
            </View>
          </Section>

          {/* Precondition */}
          <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>An existing Finance Account must be present in the system.</ListItem>
            </View>
          </Section>

          {/* Post Condition */}
          <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Document statuses updated in the Document Master.</ListItem>
              <ListItem>Deferral tracking in place.</ListItem>
            </View>
          </Section>

          {/* Straight Through Process (STP) */}
          <Section title="Straight Through Process (STP)" icon={ArrowRight}>
            <Text style={styles.paragraph}>
              Login → Retrieve Document Master → Update Status → Save → Logout
            </Text>
          </Section>

          {/* Alternative Flows */}
          <Section title="Alternative Flows" icon={ArrowRight}>
            <View style={styles.listContainer}>
              <ListItem>Manual entry of non-listed documents at the transaction level.</ListItem>
            </View>
          </Section>

          {/* Exception Flows */}
          <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
            <View style={styles.listContainer}>
              <ListItem>Invalid Agreement ID.</ListItem>
              <ListItem>System unresponsive.</ListItem>
              <ListItem>Unauthorized document updates.</ListItem>
            </View>
          </Section>

          {/* User Activity Diagram (Flowchart) */}
          <Section title="User Activity Diagram (Flowchart)" icon={List}>
            <Text style={styles.paragraph}>
              Start → Retrieve Document Master → Display Details → Update → Save → Track → End
            </Text>
          </Section>

          {/* Parking Lot */}
          <Section title="Parking Lot" icon={Info}>
            <View style={styles.listContainer}>
              <ListItem>Auto-update status using document scanning.</ListItem>
              <ListItem>Exception report for missing documents.</ListItem>
            </View>
          </Section>

          {/* System Components Involved */}
          <Section title="System Components Involved" icon={Settings}>
            <View style={styles.listContainer}>
              <ListItem>UI for document entry</ListItem>
              <ListItem>Document Master DB</ListItem>
              <ListItem>Checklist Engine</ListItem>
              <ListItem>Deferral Tracker</ListItem>
            </View>
          </Section>

          {/* Test Scenarios */}
          <Section title="Test Scenarios" icon={TestTube}>
            <View style={styles.listContainer}>
              <ListItem>Valid Agreement ID displays all document details.</ListItem>
              <ListItem>User marks document as incomplete and system logs it.</ListItem>
              <ListItem>User adds missing document manually.</ListItem>
              <ListItem>Save confirmation received.</ListItem>
            </View>
          </Section>

          {/* Infra & Deployment Notes */}
          <Section title="Infra & Deployment Notes" icon={Server}>
            <View style={styles.listContainer}>
              <ListItem>Requires checklist rules engine.</ListItem>
              <ListItem>Accessible by authorized personnel only.</ListItem>
            </View>
          </Section>

          {/* Dev Team Ownership */}
          <Section title="Dev Team Ownership" icon={User}>
            <Text style={styles.paragraph}>
              Squad: Documentation & Compliance Team{"\n"}
              Contact: Ravi Mehta{"\n"}
              JIRA: DOC-789{"\n"}
              Git Repo: git.company.com/FMS/document-master
            </Text>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
  },
  mainCard: {
    // backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 8,
    // elevation: 6,
    // borderWidth: 1,
    // borderColor: "#f1f5f9",
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    textAlign: "left",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginTop: 14,
    marginBottom: 8,
    marginLeft: 4,
  },
  listContainer: {
    marginLeft: 6,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#374151",
    marginTop: 9,
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  orderedList: {
    marginLeft: 6,
  },
  orderedListItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  orderedListNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginRight: 10,
    lineHeight: 20,
    minWidth: 22,
  },
  orderedListText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  nestedList: {
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 10,
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#e2e8f0",
  },
  doubleNestedList: {
    marginLeft: 16,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#f1f5f9",
  },
  tripleNestedList: {
    marginLeft: 16,
    marginTop: 6,
    marginBottom: 6,
    backgroundColor: "#fafafa",
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#e5e7eb",
  },
});

export default System_DocumentMaster;