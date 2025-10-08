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


const System_SettlementsReceipts = () => {
  const Section = ({ title, icon: Icon, iconColor = "#2563eb", children }) => (
    <View style={styles.section}>
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
        {/* <View style={styles.header}>
          <Text style={styles.title}>WF_FMS Settlements - Receipts</Text>
        </View> */}

        <View style={styles.card}>
          {/* Description */}
          <Section title="Description" icon={Info}>
            <Text style={styles.paragraph}>
              The Settlements - Receipts module within the Financial Management
              System (FMS) captures and processes funds received by the financial
              institution. These include receipts from various channels such as
              cheque, cash, draft, transfer, and point of sale. Receipt Advices
              are generated automatically during standard business processes
              (e.g., billing, late payments) or manually through user input.
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
              <ListItem>Treasury</ListItem>
              <ListItem>Finance Department</ListItem>
            </View>
          </Section>

          {/* User Actions & System Responses */}
          <Section title="User Actions & System Responses" icon={List}>
            <View style={styles.orderedList}>
              <OrderedListItem number={1}>
                User logs into FMS.
              </OrderedListItem>
              <OrderedListItem number={2}>
                Navigates to Settlements Receipts screen.
              </OrderedListItem>
              <OrderedListItem number={3}>
                Enters details such as:
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>Cheque ID</ListItem>
                <ListItem>Date</ListItem>
                <ListItem>Currency</ListItem>
                <ListItem>Customer Name</ListItem>
                <ListItem>Account No.</ListItem>
                <ListItem>Payee Info</ListItem>
              </View>
              <OrderedListItem number={4}>
                Specifies payment mode (Cheque, Cash, Draft, Transfer, POS).
              </OrderedListItem>
              <OrderedListItem number={5}>
                System validates and records receipt advice.
              </OrderedListItem>
              <OrderedListItem number={6}>
                For cheque payments, processes via:
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>Receipt</ListItem>
                <ListItem>Deposit (Maker & Checker)</ListItem>
                <ListItem>Realization (Maker & Checker)</ListItem>
              </View>
              <OrderedListItem number={7}>
                For cash payments, processes via:
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>Receipt</ListItem>
                <ListItem>Deposit</ListItem>
              </View>
              <OrderedListItem number={8}>
                System prompts for and generates payment voucher upon successful save.
              </OrderedListItem>
              <OrderedListItem number={9}>
                Voucher is printed for physical confirmation.
              </OrderedListItem>
            </View>
          </Section>

          {/* Precondition */}
          <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Receipt advice must be generated in system.</ListItem>
              <ListItem>Customer or transaction reference available.</ListItem>
            </View>
          </Section>

          {/* Post Condition */}
          <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>Payment details recorded and voucher generated.</ListItem>
            </View>
          </Section>

          {/* Straight Through Process (STP) */}
          <Section title="Straight Through Process (STP)" icon={ArrowRight}>
            <Text style={styles.paragraph}>
              Login → Access Receipt Screen → Input Details → Validate Payment →
              Process via Module → Generate Voucher → Logout
            </Text>
          </Section>

          {/* Alternative Flows */}
          <Section title="Alternative Flows" icon={ArrowRight}>
            <View style={styles.listContainer}>
              <ListItem>
                Receipt generation through manual advice (non-standard scenarios).
              </ListItem>
              <ListItem>POS-based transactions processed directly.</ListItem>
            </View>
          </Section>

          {/* Exception Flows */}
          <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
            <View style={styles.listContainer}>
              <ListItem>Missing mandatory fields.</ListItem>
              <ListItem>Invalid Cheque ID or Account Number.</ListItem>
              <ListItem>Payment mismatch or duplication error.</ListItem>
            </View>
          </Section>

          {/* User Activity Diagram (Flowchart) */}
          <Section title="User Activity Diagram (Flowchart)" icon={List}>
            <Text style={styles.paragraph}>
              Start → Login → Enter Receipt Details → Select Mode → Process
              Payment → Generate Voucher → End
            </Text>
          </Section>

          {/* Parking Lot */}
          <Section title="Parking Lot" icon={Info}>
            <View style={styles.listContainer}>
              <ListItem>
                Add integration with real-time bank systems for cheque clearance status.
              </ListItem>
              <ListItem>Implement automated duplicate cheque detection.</ListItem>
            </View>
          </Section>

          {/* System Components Involved */}
          <Section title="System Components Involved" icon={Settings}>
            <Text style={styles.subheading}>UI</Text>
            <View style={styles.listContainer}>
              <ListItem>Receipts Screen in FMS</ListItem>
            </View>
            
            <Text style={styles.subheading}>DB Tables</Text>
            <View style={styles.listContainer}>
              <ListItem>Receipt Master</ListItem>
              <ListItem>Customer Ledger</ListItem>
            </View>
            
            <Text style={styles.subheading}>APIs</Text>
            <View style={styles.listContainer}>
              <ListItem>Payment Processing Engine</ListItem>
              <ListItem>Voucher Generator</ListItem>
            </View>
            
            <Text style={styles.subheading}>Services</Text>
            <View style={styles.listContainer}>
              <ListItem>Validation</ListItem>
              <ListItem>Maker-Checker Workflow Engine</ListItem>
            </View>
          </Section>

          {/* Test Scenarios */}
          <Section title="Test Scenarios" icon={TestTube}>
            <View style={styles.listContainer}>
              <ListItem>Receipt entry through all payment modes.</ListItem>
              <ListItem>Cheque realization with Maker & Checker.</ListItem>
              <ListItem>Voucher printing on receipt save.</ListItem>
              <ListItem>Input validation for incomplete or incorrect data.</ListItem>
            </View>
          </Section>

          {/* Infra & Deployment Notes */}
          <Section title="Infra & Deployment Notes" icon={Server}>
            <View style={styles.listContainer}>
              <ListItem>Ensure stable printer connectivity for voucher generation.</ListItem>
              <ListItem>Audit trail must be logged for all receipt entries.</ListItem>
            </View>
          </Section>

          {/* Dev Team Ownership */}
          <Section title="Dev Team Ownership" icon={User}>
            <Text style={styles.paragraph}>
              Squad: Settlements & Receivables Team{"\n"}
              Contact: Lead Dev - receipts_fms@bankdomain.com{"\n"}
              JIRA: WF-RECEIPTS-01{"\n"}
              Git Repo: /fms/settlements/receipts
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
    // backgroundColor: "#F3F4F6", // Softer background for contrast
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#2563EB", // Blue accent header
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderBottomWidth: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  card: {
    // backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 18,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
    // borderWidth: 1,
    // borderColor: "#E5E7EB",
  },
  section: {
    marginBottom: 24,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E3A8A",
    marginLeft: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    marginTop: 4,
  },
  subheading: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginTop: 8,
    marginBottom: 6,
  },
  listContainer: {
    marginLeft: 8,
    marginBottom: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#2563EB",
    marginTop: 8,
    marginRight: 10,
  },
  listText: {
    flex: 1,
    fontSize: 14.5,
    lineHeight: 21,
    color: "#374151",
  },
  orderedList: {
    marginLeft: 8,
  },
  orderedListItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  orderedListNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
    marginRight: 8,
    lineHeight: 21,
  },
  orderedListText: {
    flex: 1,
    fontSize: 14.5,
    lineHeight: 21,
    color: "#374151",
  },
  nestedList: {
    marginLeft: 18,
    marginTop: 4,
    marginBottom: 10,
  },
});


export { System_SettlementsReceipts };