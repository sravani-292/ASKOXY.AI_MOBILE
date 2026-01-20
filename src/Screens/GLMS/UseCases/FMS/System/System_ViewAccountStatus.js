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

const System_ViewAccountStatus = () => {
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
          <Text style={styles.title}>WF_Closure_View_Account_Status</Text>
        </View> */}

        <View style={styles.mainCard}>
          {/* Description */}
          <Section title="Description" icon={Info}>
            <Text style={styles.paragraph}>
              This use case defines the process of verifying the account status in preparation for closure of a Finance Account, either at maturity or due to early termination (foreclosure).
            </Text>
          </Section>

          {/* Actors */}
          <Section title="Actors" icon={Users}>
            <Text style={styles.subheading}>Primary Actor</Text>
            <View style={styles.listContainer}>
              <ListItem>User</ListItem>
            </View>
            
            <Text style={styles.subheading}>System Actors</Text>
            <View style={styles.listContainer}>
              <ListItem>Finance Account Status Service</ListItem>
              <ListItem>UI Viewer</ListItem>
              <ListItem>Customer Ledger</ListItem>
            </View>
          </Section>

          {/* User Actions & System Responses */}
          <Section title="User Actions & System Responses" icon={List}>
            <View style={styles.orderedList}>
              <OrderedListItem number={1}>
                User selects 'View Account Status' in the system.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System prompts for Agreement ID.</ListItem>
              </View>
              
              <OrderedListItem number={2}>
                User enters Agreement ID.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System retrieves and displays Finance Account details:</ListItem>
                <View style={styles.doubleNestedList}>
                  <ListItem>Agreement ID</ListItem>
                  <ListItem>Customer Name</ListItem>
                  <ListItem>Amount Finance</ListItem>
                  <ListItem>Tenure</ListItem>
                  <ListItem>Profit Rate</ListItem>
                  <ListItem>Agreement No</ListItem>
                  <ListItem>EMI</ListItem>
                </View>
                
                <ListItem>Dues:</ListItem>
                <View style={styles.doubleNestedList}>
                  <ListItem>Balance Principal</ListItem>
                  <ListItem>Due Installments</ListItem>
                  <ListItem>Outstanding Payments</ListItem>
                  <ListItem>Prepayment Penalty</ListItem>
                  <ListItem>Profit on Termination</ListItem>
                  <ListItem>Total Due</ListItem>
                </View>
                
                <ListItem>Refunds:</ListItem>
                <View style={styles.doubleNestedList}>
                  <ListItem>Excess Amount</ListItem>
                  <ListItem>Advance Installments</ListItem>
                  <ListItem>Excess Principal</ListItem>
                  <ListItem>Excess Profit</ListItem>
                  <ListItem>Total Refund</ListItem>
                </View>
              </View>
              
              <OrderedListItem number={3}>
                User views status.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>If dues exist: User requests customer repayment.</ListItem>
                <ListItem>If refund exists: User initiates refund process.</ListItem>
              </View>
            </View>
          </Section>

          {/* Precondition */}
          <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>A valid and active Finance Account must exist.</ListItem>
            </View>
          </Section>

          {/* Post Condition */}
          <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Finance Account status reviewed.</ListItem>
              <ListItem>Next steps toward closure (payment or refund) initiated.</ListItem>
            </View>
          </Section>

          {/* Straight Through Process (STP) */}
          <Section title="Straight Through Process (STP)" icon={ArrowRight}>
            <Text style={styles.paragraph}>
              Login → Enter Agreement ID → View Status → Decide Next Action → Logout
            </Text>
          </Section>

          {/* Alternative Flows */}
          <Section title="Alternative Flows" icon={ArrowRight}>
            <View style={styles.listContainer}>
              <ListItem>Assisted customer service or bulk status retrieval via batch job.</ListItem>
            </View>
          </Section>

          {/* Exception Flows */}
          <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
            <View style={styles.listContainer}>
              <ListItem>Invalid Agreement ID.</ListItem>
              <ListItem>Data retrieval error.</ListItem>
              <ListItem>System unresponsive.</ListItem>
            </View>
          </Section>

          {/* User Activity Diagram (Flowchart) */}
          <Section title="User Activity Diagram (Flowchart)" icon={List}>
            <Text style={styles.paragraph}>
              User → Enter Agreement ID → View Status → Payment/Refund action → End
            </Text>
          </Section>

          {/* Parking Lot */}
          <Section title="Parking Lot" icon={Info}>
            <View style={styles.listContainer}>
              <ListItem>Auto-recommend refund/payment based on rules.</ListItem>
              <ListItem>Integrate email notification to customer.</ListItem>
            </View>
          </Section>

          {/* System Components Involved */}
          <Section title="System Components Involved" icon={Settings}>
            <View style={styles.listContainer}>
              <ListItem>UI for status view</ListItem>
              <ListItem>Finance Account DB</ListItem>
              <ListItem>Agreement Details Service</ListItem>
              <ListItem>Refund/Repayment Module</ListItem>
            </View>
          </Section>

          {/* Test Scenarios */}
          <Section title="Test Scenarios" icon={TestTube}>
            <View style={styles.listContainer}>
              <ListItem>Valid Agreement ID returns all details.</ListItem>
              <ListItem>Dues detected and flagged correctly.</ListItem>
              <ListItem>Refund detected and system initiates next step.</ListItem>
              <ListItem>Invalid ID returns error.</ListItem>
            </View>
          </Section>

          {/* Infra & Deployment Notes */}
          <Section title="Infra & Deployment Notes" icon={Server}>
            <View style={styles.listContainer}>
              <ListItem>System should be able to handle multiple concurrent requests.</ListItem>
              <ListItem>Ensure high availability for account detail service.</ListItem>
            </View>
          </Section>

          {/* Dev Team Ownership */}
          <Section title="Dev Team Ownership" icon={User}>
            <Text style={styles.paragraph}>
              Squad: Closure Workflows Team{"\n"}
              Contact: Jane Smith{"\n"}
              JIRA: FMS-Closure-567{"\n"}
              Git Repo: git.company.com/FMS/view-status
            </Text>
            <ImageModal imageSource={'https://i.ibb.co/hFGsRgH6/account-status.jpg'}/>
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
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 2,
    borderLeftColor: "#f1f5f9",
  },
});

export default System_ViewAccountStatus ;