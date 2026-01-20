import React from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

const System_BulkPrepayment = () => {
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
          <Text style={styles.title}>WF_Finance Rescheduling - Bulk Prepayment</Text>
        </View> */}

        <View style={styles.mainCard}>
          {/* Description */}
          <Section title="Description" icon={Info}>
            <Text style={styles.paragraph}>
              This use case describes the process involved when a customer makes a
              bulk prepayment toward their finance deal. Bulk prepayment can
              impact either the tenure or the installment amount, and requires the
              generation of a new repayment schedule. The system will reallocate
              payments starting with accrued but not due profit, followed by
              outstanding principal.
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
                Customer visits the bank and submits bulk prepayment (cash/cheque).
              </OrderedListItem>
              
              <OrderedListItem number={2}>
                User verifies the Finance Account details.
              </OrderedListItem>
              
              <OrderedListItem number={3}>
                User initiates the bulk prepayment process.
              </OrderedListItem>
              
              <OrderedListItem number={4}>
                System accepts bulk payment and prepares for rescheduling.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System action: Accepts payment and initiates rescheduling.</ListItem>
              </View>
              
              <OrderedListItem number={5}>
                User retrieves account details (Agreement ID, Loan Type, Outstanding, Due Date, etc.).
              </OrderedListItem>
              
              <OrderedListItem number={6}>
                User enters bulk refund amount and submits for rescheduling.
              </OrderedListItem>
              
              <OrderedListItem number={7}>
                Checker retrieves and verifies the new repayment schedule.
              </OrderedListItem>
              
              <OrderedListItem number={8}>
                If approved, system generates and notifies customer.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System action: Generates new repayment schedule and sends notification.</ListItem>
              </View>
              
              <OrderedListItem number={9}>
                If discrepancies are found, the request is modified and resubmitted.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System action: Allows modification and resubmission of the request.</ListItem>
              </View>
            </View>
          </Section>

          {/* Precondition */}
          <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>An existing Finance Account and a bulk repayment request must be present.</ListItem>
            </View>
          </Section>

          {/* Post Condition */}
          <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Bulk prepayment is recorded.</ListItem>
              <ListItem>A new repayment schedule is generated and approved.</ListItem>
            </View>
          </Section>

          {/* Straight Through Process (STP) */}
          <Section title="Straight Through Process (STP)" icon={ArrowRight}>
            <Text style={styles.paragraph}>
              Customer Visit → Initiate Bulk Payment → Generate Repayment Schedule → Checker Authorization → Notify Customer
            </Text>
          </Section>

          {/* Alternative Flows */}
          <Section title="Alternative Flows" icon={ArrowRight}>
            <View style={styles.listContainer}>
              <ListItem>Discrepancy handling by modifying the request and resubmitting.</ListItem>
            </View>
          </Section>

          {/* Exception Flows */}
          <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
            <View style={styles.listContainer}>
              <ListItem>Invalid Agreement ID.</ListItem>
              <ListItem>Discrepancies in repayment calculation.</ListItem>
              <ListItem>Unauthorized access.</ListItem>
            </View>
          </Section>

          {/* User Activity Diagram (Flowchart) */}
          <Section title="User Activity Diagram (Flowchart)" icon={List}>
            <Text style={styles.paragraph}>
              As described in the document with paths for discrepancy and authorization.
            </Text>
          </Section>

          {/* Parking Lot */}
          <Section title="Parking Lot" icon={Info}>
            <View style={styles.listContainer}>
              <ListItem>Potential integration with payment gateways.</ListItem>
              <ListItem>Automated customer notifications.</ListItem>
            </View>
          </Section>

          {/* System Components Involved */}
          <Section title="System Components Involved" icon={Settings}>
            <View style={styles.listContainer}>
              <ListItem>Finance Account Database</ListItem>
              <ListItem>Repayment Engine</ListItem>
              <ListItem>UI for Prepayment Entry</ListItem>
              <ListItem>Notification System</ListItem>
            </View>
          </Section>

          {/* Test Scenarios */}
          <Section title="Test Scenarios" icon={TestTube}>
            <View style={styles.listContainer}>
              <ListItem>Valid bulk prepayment triggers correct schedule recalculation.</ListItem>
              <ListItem>Discrepancy results in modification prompt.</ListItem>
              <ListItem>Checker approval generates notification.</ListItem>
              <ListItem>Invalid Agreement ID halts the process.</ListItem>
            </View>
          </Section>

          {/* Infra & Deployment Notes */}
          <Section title="Infra & Deployment Notes" icon={Server}>
            <View style={styles.listContainer}>
              <ListItem>Requires secure transaction logging.</ListItem>
              <ListItem>Real-time data update capabilities.</ListItem>
            </View>
          </Section>

          {/* Dev Team Ownership */}
          <Section title="Dev Team Ownership" icon={User}>
            <Text style={styles.paragraph}>
              Squad: Finance Operations Automation Team{"\n"}
              Contact: Sunil Reddy{"\n"}
              JIRA: FMS-BULK-991{"\n"}
              Git Repo: git.company.com/FMS/bulk-prepayment
            </Text>
            <ImageModal imageSource={'https://i.ibb.co/ymY8fBs6/29.png'}/>
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

export default System_BulkPrepayment;