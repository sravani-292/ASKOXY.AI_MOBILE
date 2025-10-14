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
import ImageModal from "../../ImageModal";

const System_ReschedulingDueDate = () => {
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
          <Text style={styles.title}>Finance Rescheduling - Due Date Change</Text>
        </View> */}

        <View style={styles.mainCard}>
          {/* Description */}
          <Section title="Description" icon={Info}>
            <Text style={styles.paragraph}>
              This use case addresses the process of changing the due date of
              finance installment payments. It enables users to reschedule future
              repayment dates upon customer request, resulting in a new repayment
              schedule. This is part of the Finance Rescheduling functionality
              which also supports other transactions like Bulk Prepayment, Profit
              Rate Modification, and Tenure Modification.
            </Text>
          </Section>

          {/* Actors */}
          <Section title="Actors" icon={Users}>
            <View style={styles.listContainer}>
              <ListItem>Customer</ListItem>
              <ListItem>User</ListItem>
              <ListItem>Checker</ListItem>
            </View>
          </Section>

          {/* User Actions & System Responses */}
          <Section title="User Actions & System Responses" icon={List}>
            <View style={styles.orderedList}>
              <OrderedListItem number={1}>
                Customer submits a Due Date Change request at the bank.
              </OrderedListItem>
              
              <OrderedListItem number={2}>
                User verifies the request and checks applicable rules.
              </OrderedListItem>
              
              <OrderedListItem number={3}>
                If valid, User initiates Due Date Change and retrieves Finance Account details.
              </OrderedListItem>
              
              <OrderedListItem number={4}>
                System displays:
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>Finance No</ListItem>
                <ListItem>Agreement ID</ListItem>
                <ListItem>Loan Amount</ListItem>
                <ListItem>Original Tenure</ListItem>
                <ListItem>Original Due Date</ListItem>
                <ListItem>Outstanding Amount</ListItem>
                <ListItem>Reschedule Effective Date</ListItem>
                <ListItem>Repayment Effective Date</ListItem>
                <ListItem>Balance Tenure</ListItem>
                <ListItem>Frequency</ListItem>
                <ListItem>Rate of Interest</ListItem>
              </View>
              
              <OrderedListItem number={5}>
                User modifies the Due Date and submits for schedule generation.
              </OrderedListItem>
              
              <OrderedListItem number={6}>
                Checker retrieves and verifies the New Repayment Schedule using Agreement ID.
              </OrderedListItem>
              
              <OrderedListItem number={7}>
                If accurate, Checker authorizes; otherwise, requests correction.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System action: Processes authorization or correction request.</ListItem>
              </View>
              
              <OrderedListItem number={8}>
                Upon authorization, system generates the new schedule and notifies the customer.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System action: Generates new repayment schedule and sends notification.</ListItem>
              </View>
            </View>
          </Section>

          {/* Precondition */}
          <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Customer must have an existing Finance Account with a valid request for Due Date Change.</ListItem>
            </View>
          </Section>

          {/* Post Condition */}
          <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Updated due date is applied.</ListItem>
              <ListItem>A new repayment schedule is generated and communicated.</ListItem>
            </View>
          </Section>

          {/* Straight Through Process (STP) */}
          <Section title="Straight Through Process (STP)" icon={ArrowRight}>
            <Text style={styles.paragraph}>
              Customer Visit → Request Validation → Due Date Modification → Schedule Generation → Authorization → Notification
            </Text>
          </Section>

          {/* Alternative Flows */}
          <Section title="Alternative Flows" icon={ArrowRight}>
            <View style={styles.listContainer}>
              <ListItem>If the Checker finds discrepancies, the request is returned to User for correction.</ListItem>
            </View>
          </Section>

          {/* Exception Flows */}
          <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
            <View style={styles.listContainer}>
              <ListItem>Invalid Agreement ID.</ListItem>
              <ListItem>System errors during schedule generation.</ListItem>
              <ListItem>Rule violation.</ListItem>
            </View>
          </Section>

          {/* User Activity Diagram (Flowchart) */}
          <Section title="User Activity Diagram (Flowchart)" icon={List}>
            <Text style={styles.paragraph}>
              Start → Customer submits request → User verifies → Modify Due Date → Generate Schedule → Checker validates → Approve or return for correction → Notify Customer → End
            </Text>
          </Section>

          {/* Parking Lot */}
          <Section title="Parking Lot" icon={Info}>
            <View style={styles.listContainer}>
              <ListItem>Option to automate due date change based on recurring customer preferences.</ListItem>
            </View>
          </Section>

          {/* System Components Involved */}
          <Section title="System Components Involved" icon={Settings}>
            <View style={styles.listContainer}>
              <ListItem>Repayment Engine</ListItem>
              <ListItem>Finance DB</ListItem>
              <ListItem>Schedule Generator</ListItem>
              <ListItem>Authorization Workflow</ListItem>
            </View>
          </Section>

          {/* Test Scenarios */}
          <Section title="Test Scenarios" icon={TestTube}>
            <View style={styles.listContainer}>
              <ListItem>Valid request successfully generates new schedule.</ListItem>
              <ListItem>Discrepancy results in rejected authorization.</ListItem>
              <ListItem>Invalid Agreement ID prompts error.</ListItem>
              <ListItem>Schedule reflects updated due dates accurately.</ListItem>
            </View>
          </Section>

          {/* Infra & Deployment Notes */}
          <Section title="Infra & Deployment Notes" icon={Server}>
            <View style={styles.listContainer}>
              <ListItem>Ensure synchronization between schedule generator and core finance systems.</ListItem>
            </View>
          </Section>

          {/* Dev Team Ownership */}
          <Section title="Dev Team Ownership" icon={User}>
            <Text style={styles.paragraph}>
              Squad: Finance Platform Services Team{"\n"}
              Contact: Neha Kapoor{"\n"}
              JIRA: FMS-DUE-444{"\n"}
              Git Repo: git.company.com/FMS/due-date-change
            </Text>
            <ImageModal imageSource={'https://i.ibb.co/TqBYG6yQ/Finance-Rescheduling-Due-date-change.png'}/>
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
    backgroundColor: "white",
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
});

export default System_ReschedulingDueDate;