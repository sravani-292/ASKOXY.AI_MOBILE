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
 
const System_AccountClosure = () => {
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
        <View style={styles.headerCard}>
          <Text style={styles.title}>WF_Closure - Account</Text>
        </View>

        <View style={styles.mainCard}>
          {/* Description */}
          <Section title="Description" icon={Info}>
            <Text style={styles.paragraph}>
              This use case covers the closure of a finance account upon repayment
              completion or early termination (foreclosure). The process ensures
              all dues are cleared and refunds handled before officially closing
              the account and notifying the customer.
            </Text>
          </Section>

          {/* Actors */}
          <Section title="Actors" icon={Users}>
            <Text style={styles.subheading}>Customer-facing</Text>
            <View style={styles.listContainer}>
              <ListItem>User (e.g., Bank Officer)</ListItem>
            </View>
            
            <Text style={styles.subheading}>System Roles</Text>
            <View style={styles.listContainer}>
              <ListItem>Finance Account Management System</ListItem>
            </View>
            
            <Text style={styles.subheading}>Software Stakeholders</Text>
            <View style={styles.listContainer}>
              <ListItem>API Dev</ListItem>
              <ListItem>QA</ListItem>
              <ListItem>Infra</ListItem>
              <ListItem>CloudOps</ListItem>
            </View>
          </Section>

          {/* User Actions & System Responses */}
          <Section title="User Actions & System Responses" icon={List}>
            <View style={styles.orderedList}>
              <OrderedListItem number={1}>
                User logs into the system.
              </OrderedListItem>
              
              <OrderedListItem number={2}>
                User enters Agreement ID.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System retrieves Finance Account details.</ListItem>
              </View>
              
              <OrderedListItem number={3}>
                User views Finance Account details including Dues and Refunds.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System displays fields:</ListItem>
                <View style={styles.doubleNestedList}>
                  <ListItem>Agreement ID</ListItem>
                  <ListItem>Customer Name</ListItem>
                  <ListItem>Amount Financed</ListItem>
                  <ListItem>Tenure</ListItem>
                  <ListItem>Profit Rate</ListItem>
                  <ListItem>EMI</ListItem>
                  <ListItem>Dues & Refund components</ListItem>
                </View>
              </View>
              
              <OrderedListItem number={4}>
                User verifies there are no pending dues or refunds.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System allows closure action if conditions are met.</ListItem>
              </View>
              
              <OrderedListItem number={5}>
                User confirms account closure.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System marks account as closed and notifies the customer.</ListItem>
              </View>
            </View>
          </Section>

          {/* Precondition */}
          <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Existing finance account with no pending dues or refunds.</ListItem>
            </View>
          </Section>

          {/* Post Condition */}
          <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Finance account closed and customer notified.</ListItem>
            </View>
          </Section>

          {/* Straight Through Process (STP) */}
          <Section title="Straight Through Process (STP)" icon={ArrowRight}>
            <Text style={styles.paragraph}>
              Login → Enter Agreement ID → Verify Account → Close Account → Notify Customer
            </Text>
          </Section>

          {/* Alternative Flows */}
          <Section title="Alternative Flows" icon={ArrowRight}>
            <View style={styles.listContainer}>
              <ListItem>Can be initiated via web portal or assisted mode (e.g., Branch Officer).</ListItem>
            </View>
          </Section>

          {/* Exception Flows */}
          <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
            <View style={styles.listContainer}>
              <ListItem>Discrepancy in dues/refund → Closure halted, discrepancy resolution required.</ListItem>
            </View>
          </Section>

          {/* User Activity Diagram (Flowchart) */}
          <Section title="User Activity Diagram (Flowchart)" icon={List}>
            <Text style={styles.paragraph}>
              Start → Initiate Closure → Enter Agreement ID → View Account Details
              → Check Dues/Refund → No Issues? → Yes → Close Account → Notify
              Customer → End
            </Text>
          </Section>

          {/* Parking Lot */}
          <Section title="Parking Lot" icon={Info}>
            <View style={styles.listContainer}>
              <ListItem>Auto-notification enhancements.</ListItem>
              <ListItem>Integration with digital ledger or CRM.</ListItem>
            </View>
          </Section>

          {/* System Components Involved */}
          <Section title="System Components Involved" icon={Settings}>
            <Text style={styles.subheading}>UI</Text>
            <View style={styles.listContainer}>
              <ListItem>Finance Account Closure Screen</ListItem>
            </View>
            
            <Text style={styles.subheading}>APIs</Text>
            <View style={styles.listContainer}>
              <ListItem>Account Details Retrieval</ListItem>
              <ListItem>Closure Submission</ListItem>
              <ListItem>Notification Service</ListItem>
            </View>
            
            <Text style={styles.subheading}>DB Tables</Text>
            <View style={styles.listContainer}>
              <ListItem>FinanceAccount</ListItem>
              <ListItem>PaymentHistory</ListItem>
              <ListItem>NotificationLog</ListItem>
            </View>
          </Section>

          {/* Test Scenarios */}
          <Section title="Test Scenarios" icon={TestTube}>
            <View style={styles.listContainer}>
              <ListItem>Valid closure with zero dues/refund.</ListItem>
              <ListItem>Attempt closure with pending dues.</ListItem>
              <ListItem>Attempt closure with excess refund.</ListItem>
              <ListItem>System unavailability during closure.</ListItem>
            </View>
          </Section>

          {/* Infra & Deployment Notes */}
          <Section title="Infra & Deployment Notes" icon={Server}>
            <View style={styles.listContainer}>
              <ListItem>Depends on core finance system and notification microservice.</ListItem>
              <ListItem>Deployed in prod with monitoring hooks.</ListItem>
            </View>
          </Section>

          {/* Dev Team Ownership */}
          <Section title="Dev Team Ownership" icon={User}>
            <Text style={styles.paragraph}>
              Squad: Account Closure Squad{"\n"}
              Contact: closure-team@oxy.ai{"\n"}
              JIRA: AC-101
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
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#f1f5f9",
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
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: "#f1f5f9",
  },
});

export  default System_AccountClosure ;