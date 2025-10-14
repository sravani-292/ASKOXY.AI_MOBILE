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
const System_ProfitRateChange = () => {
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
          <Text style={styles.title}>Finance Rescheduling - Profit Rate Change</Text>
        </View> */}

        <View style={styles.mainCard}>
          {/* Description */}
          <Section title="Description" icon={Info}>
            <Text style={styles.paragraph}>
              This use case explains the process to modify the profit (interest)
              rate on an existing finance account. Such a modification typically
              results in a recalculation of the repayment schedule and may
              impact either the installment amount or tenure. The process
              involves request submission, verification, and schedule
              regeneration followed by approval.
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
                Customer visits the bank and submits a request to change the interest rate on the Finance Account.
              </OrderedListItem>
              
              <OrderedListItem number={2}>
                User verifies the request and applicable rules.
              </OrderedListItem>
              
              <OrderedListItem number={3}>
                If valid, User updates the interest rate and retrieves Finance Account details (Agreement ID).
              </OrderedListItem>
              
              <OrderedListItem number={4}>
                System displays:
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>Finance No</ListItem>
                <ListItem>Agreement ID</ListItem>
                <ListItem>Original Loan Amount</ListItem>
                <ListItem>Original Rate of Interest</ListItem>
                <ListItem>Original Tenure</ListItem>
                <ListItem>Due Date</ListItem>
                <ListItem>Reschedule Effective Date</ListItem>
                <ListItem>Repayment Effective Date</ListItem>
                <ListItem>Bulk Refund Amount</ListItem>
                <ListItem>Balance Tenure</ListItem>
                <ListItem>Frequency</ListItem>
                <ListItem>Modified Interest Rate</ListItem>
              </View>
              
              <OrderedListItem number={5}>
                User modifies the interest rate and submits it for New Repayment Schedule generation.
              </OrderedListItem>
              
              <OrderedListItem number={6}>
                Checker retrieves and verifies the New Repayment Schedule using Agreement ID.
              </OrderedListItem>
              
              <OrderedListItem number={7}>
                If found correct, Checker authorizes the schedule.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System action: Processes authorization.</ListItem>
              </View>
              
              <OrderedListItem number={8}>
                Once authorized, the new repayment schedule is generated and the customer is notified.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System action: Generates new repayment schedule and sends notification.</ListItem>
              </View>
              
              <OrderedListItem number={9}>
                If discrepancies are found, User modifies and resubmits the request.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System action: Allows modification and resubmission.</ListItem>
              </View>
            </View>
          </Section>

          {/* Precondition */}
          <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>An active Finance Account and a valid interest rate change request.</ListItem>
            </View>
          </Section>

          {/* Post Condition */}
          <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Interest rate updated.</ListItem>
              <ListItem>A new repayment schedule is generated and shared.</ListItem>
            </View>
          </Section>

          {/* Straight Through Process (STP) */}
          <Section title="Straight Through Process (STP)" icon={ArrowRight}>
            <Text style={styles.paragraph}>
              Customer Visit → Request Verification → Modify Rate → Generate Schedule → Checker Authorization → Notify Customer
            </Text>
          </Section>

          {/* Alternative Flows */}
          <Section title="Alternative Flows" icon={ArrowRight}>
            <View style={styles.listContainer}>
              <ListItem>Discrepant requests are corrected by the User and resubmitted.</ListItem>
            </View>
          </Section>

          {/* Exception Flows */}
          <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
            <View style={styles.listContainer}>
              <ListItem>Invalid finance account.</ListItem>
              <ListItem>Interest rate policy violation.</ListItem>
              <ListItem>System calculation failure.</ListItem>
            </View>
          </Section>

          {/* User Activity Diagram (Flowchart) */}
          <Section title="User Activity Diagram (Flowchart)" icon={List}>
            <Text style={styles.paragraph}>
              Start → Customer submits request → User verifies → Modify Rate → Generate Schedule → Checker validates → Approve or return → Notify Customer → End
            </Text>
          </Section>

          {/* Parking Lot */}
          <Section title="Parking Lot" icon={Info}>
            <View style={styles.listContainer}>
              <ListItem>Potential for automated rate adjustments based on benchmarks or risk ratings.</ListItem>
            </View>
          </Section>

          {/* System Components Involved */}
          <Section title="System Components Involved" icon={Settings}>
            <View style={styles.listContainer}>
              <ListItem>Finance Core Engine</ListItem>
              <ListItem>Repayment Schedule Generator</ListItem>
              <ListItem>User Interface</ListItem>
              <ListItem>Notification Service</ListItem>
            </View>
          </Section>

          {/* Test Scenarios */}
          <Section title="Test Scenarios" icon={TestTube}>
            <View style={styles.listContainer}>
              <ListItem>Valid rate change leads to correct schedule generation.</ListItem>
              <ListItem>Discrepancy leads to resubmission loop.</ListItem>
              <ListItem>Unauthorized rate causes rejection.</ListItem>
              <ListItem>Notification is sent post-schedule generation.</ListItem>
            </View>
          </Section>

          {/* Infra & Deployment Notes */}
          <Section title="Infra & Deployment Notes" icon={Server}>
            <View style={styles.listContainer}>
              <ListItem>Must support audit trail for rate changes.</ListItem>
              <ListItem>Rollback capability in case of failure.</ListItem>
            </View>
          </Section>

          {/* Dev Team Ownership */}
          <Section title="Dev Team Ownership" icon={User}>
            <Text style={styles.paragraph}>
              Squad: Finance Rescheduling Product Team{"\n"}
              Contact: Rajeev Nair{"\n"}
              JIRA: FMS-INT-772{"\n"}
              Git Repo: git.company.com/FMS/interest-rate-change
            </Text>
            <ImageModal imageSource={'https://i.ibb.co/zVk0PwQB/Finance-Rescheduling-rate-of-intrest.png'}/>
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

export default System_ProfitRateChange;