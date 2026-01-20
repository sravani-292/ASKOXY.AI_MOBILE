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

const System_SettlementsWaiveOff = () => {
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
          <Text style={styles.title}>WF_FMS Settlements - Waive Off</Text>
        </View>

        <View style={styles.mainCard}>
          {/* Description */}
          <Section title="Description" icon={Info}>
            <Text style={styles.paragraph}>
              The Waive Off function within the Financial Management System (FMS)
              enables authorized users to waive partial or full receivable charges
              for customers under specific business justifications. This feature
              is key to managing exceptions, customer satisfaction, and internal
              financial adjustments.
            </Text>
          </Section>

          {/* Actors */}
          <Section title="Actors" icon={Users}>
            <Text style={styles.subheading}>Business User</Text>
            <View style={styles.listContainer}>
              <ListItem>Bank Officer</ListItem>
            </View>
            
            <Text style={styles.subheading}>System Roles</Text>
            <View style={styles.listContainer}>
              <ListItem>Financial Management System (FMS)</ListItem>
            </View>
            
            <Text style={styles.subheading}>Stakeholders</Text>
            <View style={styles.listContainer}>
              <ListItem>Settlements Team</ListItem>
              <ListItem>Finance Department</ListItem>
              <ListItem>Risk Management</ListItem>
            </View>
          </Section>

          {/* User Actions & System Responses */}
          <Section title="User Actions & System Responses" icon={List}>
            <View style={styles.orderedList}>
              <OrderedListItem number={1}>
                User logs into FMS and navigates to Settlements Waive Off screen.
              </OrderedListItem>
              
              <OrderedListItem number={2}>
                System displays eligible receivables for waive off.
              </OrderedListItem>
              
              <OrderedListItem number={3}>
                User enters:
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>Agreement Number</ListItem>
                <ListItem>Branch</ListItem>
                <ListItem>Currency</ListItem>
                <ListItem>Waive Off Date</ListItem>
                <ListItem>Advice Details</ListItem>
                <ListItem>Advice Date</ListItem>
                <ListItem>Original Amount</ListItem>
                <ListItem>Current Advice Amount</ListItem>
                <ListItem>Already Waived Off Amount</ListItem>
                <ListItem>Already Adjusted Amount</ListItem>
                <ListItem>Amount to be Waived Off</ListItem>
                <ListItem>Remarks</ListItem>
              </View>
              
              <OrderedListItem number={4}>
                User saves the record and sends it for authorization.
              </OrderedListItem>
              
              <OrderedListItem number={5}>
                System processes the waive off upon approval and logs it.
              </OrderedListItem>
            </View>
          </Section>

          {/* Precondition */}
          <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Receivables must be eligible for waive off.</ListItem>
              <ListItem>User has appropriate access rights.</ListItem>
            </View>
          </Section>

          {/* Post Condition */}
          <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Waive off recorded and applied successfully.</ListItem>
            </View>
          </Section>

          {/* Straight Through Process (STP) */}
          <Section title="Straight Through Process (STP)" icon={ArrowRight}>
            <Text style={styles.paragraph}>
              Login → Navigate to Waive Off Screen → Enter Details → Save and Send
              for Authorization → Processed Upon Approval → Logout
            </Text>
          </Section>

          {/* Alternative Flows */}
          <Section title="Alternative Flows" icon={ArrowRight}>
            <View style={styles.listContainer}>
              <ListItem>Manual waiver outside system in exceptional cases.</ListItem>
              <ListItem>Adjustment of previously waived amounts.</ListItem>
            </View>
          </Section>

          {/* Exception Flows */}
          <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
            <View style={styles.listContainer}>
              <ListItem>Waive off exceeds permissible limit.</ListItem>
              <ListItem>Missing mandatory fields.</ListItem>
              <ListItem>Duplicate waiver attempt.</ListItem>
            </View>
          </Section>

          {/* User Activity Diagram (Flowchart) */}
          <Section title="User Activity Diagram (Flowchart)" icon={List}>
            <Text style={styles.paragraph}>
              Start → Login → Enter Waive Off Details → Validate & Save → Send for
              Authorization → Waive Off Processed → End
            </Text>
          </Section>

          {/* Parking Lot */}
          <Section title="Parking Lot" icon={Info}>
            <View style={styles.listContainer}>
              <ListItem>Integration with receivables aging report.</ListItem>
              <ListItem>Audit dashboard for waiver trend analysis.</ListItem>
            </View>
          </Section>

          {/* System Components Involved */}
          <Section title="System Components Involved" icon={Settings}>
            <Text style={styles.subheading}>UI</Text>
            <View style={styles.listContainer}>
              <ListItem>Waive Off Screen</ListItem>
            </View>
            
            <Text style={styles.subheading}>DB Tables</Text>
            <View style={styles.listContainer}>
              <ListItem>Receivables Ledger</ListItem>
              <ListItem>Waiver History</ListItem>
            </View>
            
            <Text style={styles.subheading}>APIs</Text>
            <View style={styles.listContainer}>
              <ListItem>Waive Off Processor</ListItem>
              <ListItem>Authorization Queue</ListItem>
            </View>
            
            <Text style={styles.subheading}>Services</Text>
            <View style={styles.listContainer}>
              <ListItem>Validation Engine</ListItem>
              <ListItem>Workflow Manager</ListItem>
            </View>
          </Section>

          {/* Test Scenarios */}
          <Section title="Test Scenarios" icon={TestTube}>
            <View style={styles.listContainer}>
              <ListItem>Waive full vs. partial receivable.</ListItem>
              <ListItem>Authorization scenarios (approved/rejected).</ListItem>
              <ListItem>Waive Off with max cap validation.</ListItem>
              <ListItem>Input validation and audit log check.</ListItem>
            </View>
          </Section>

          {/* Infra & Deployment Notes */}
          <Section title="Infra & Deployment Notes" icon={Server}>
            <View style={styles.listContainer}>
              <ListItem>Ensure audit logs are enabled.</ListItem>
              <ListItem>Authorization logic should enforce role-based access.</ListItem>
            </View>
          </Section>

          {/* Dev Team Ownership */}
          <Section title="Dev Team Ownership" icon={User}>
            <Text style={styles.paragraph}>
              Squad: Settlements Management Team{"\n"}
              Contact: Lead Dev - waiveoff_fms@bankdomain.com{"\n"}
              JIRA: WF-WAIVEOFF-01{"\n"}
              Git Repo: /fms/settlements/waiveoff
            </Text>
            <ImageModal imageSource={'https://i.ibb.co/KzwZKxyR/settlements-payments.jpg'}/>
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  sectionCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginTop: 12,
    marginBottom: 6,
  },
  listContainer: {
    marginLeft: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 8,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#374151",
    marginTop: 8,
    marginRight: 10,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  orderedList: {
    marginLeft: 4,
  },
  orderedListItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  orderedListNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginRight: 8,
    lineHeight: 20,
    minWidth: 20,
  },
  orderedListText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  nestedList: {
    marginLeft: 20,
    marginTop: 6,
    marginBottom: 8,
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#e2e8f0",
  },
});

export default System_SettlementsWaiveOff ;