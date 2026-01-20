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
const System_EODBODDisplay= () => {
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
          <Text style={styles.title}>WF_FMS_EOD_BOD</Text>
        </View>

        <View style={styles.mainCard}>
          {/* Description */}
          <Section title="Description" icon={Info}>
            <Text style={styles.paragraph}>
              This use case captures the End of Day (EOD) and Beginning of Day
              (BOD) processes in the Financial Management System (FMS). These
              processes execute daily financial calculations, accruals, and system
              resets to begin or conclude a business day.
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
              <ListItem>FMS Batch Processor</ListItem>
              <ListItem>Scheduling Service</ListItem>
              <ListItem>Accrual Engine</ListItem>
              <ListItem>Payment Engine</ListItem>
            </View>
          </Section>

          {/* User Actions & System Responses */}
          <Section title="User Actions & System Responses" icon={List}>
            <View style={styles.orderedList}>
              <OrderedListItem number={1}>
                User initiates the EOD process.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System runs scheduled EOD jobs: Profit Accruals, DPD, NPA, Date Change, etc.</ListItem>
              </View>
              
              <OrderedListItem number={2}>
                User confirms EOD completion.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System logs success and updates business date.</ListItem>
              </View>
              
              <OrderedListItem number={3}>
                User initiates BOD process.
              </OrderedListItem>
              <View style={styles.nestedList}>
                <ListItem>System triggers PEMI to EMI conversion and activates new day workflows.</ListItem>
              </View>
            </View>
          </Section>

          {/* Precondition */}
          <Section title="Precondition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>System date must be stable; no automatic date change should have occurred.</ListItem>
            </View>
          </Section>

          {/* Post Condition */}
          <Section title="Post Condition" icon={CheckCircle} iconColor="#16a34a">
            <View style={styles.listContainer}>
              <ListItem>EOD operations completed and logged.</ListItem>
              <ListItem>Business date updated.</ListItem>
              <ListItem>BOD operations initiated.</ListItem>
            </View>
          </Section>

          {/* Straight Through Process (STP) */}
          <Section title="Straight Through Process (STP)" icon={ArrowRight}>
            <Text style={styles.paragraph}>
              Login → Run EOD → Complete EOD → Run BOD → Complete BOD → Logout
            </Text>
          </Section>

          {/* Alternative Flows */}
          <Section title="Alternative Flows" icon={ArrowRight}>
            <View style={styles.listContainer}>
              <ListItem>N/A (Manual override or Assisted mode can apply).</ListItem>
            </View>
          </Section>

          {/* Exception Flows */}
          <Section title="Exception Flows" icon={AlertCircle} iconColor="#dc2626">
            <View style={styles.listContainer}>
              <ListItem>Failure in batch jobs, system downtime, or date mismatch requires manual intervention.</ListItem>
            </View>
          </Section>

          {/* User Activity Diagram (Flowchart) */}
          <Section title="User Activity Diagram (Flowchart)" icon={List}>
            <Text style={styles.paragraph}>
              Described in attached Word document (original).
            </Text>
          </Section>

          {/* Parking Lot */}
          <Section title="Parking Lot" icon={Info}>
            <View style={styles.listContainer}>
              <ListItem>Enhance NPA classification with ML.</ListItem>
              <ListItem>Integrate real-time accrual visualization.</ListItem>
            </View>
          </Section>

          {/* System Components Involved */}
          <Section title="System Components Involved" icon={Settings}>
            <View style={styles.listContainer}>
              <ListItem>UI for EOD/BOD trigger</ListItem>
              <ListItem>Batch Jobs</ListItem>
              <ListItem>Scheduling Module</ListItem>
              <ListItem>DB tables for Accrual, DPD, EMI</ListItem>
            </View>
          </Section>

          {/* Test Scenarios */}
          <Section title="Test Scenarios" icon={TestTube}>
            <View style={styles.listContainer}>
              <ListItem>EOD completes with all tasks.</ListItem>
              <ListItem>Business date rolls over.</ListItem>
              <ListItem>BOD initiates EMI conversion.</ListItem>
              <ListItem>Failure during accrual triggers alert.</ListItem>
            </View>
          </Section>

          {/* Infra & Deployment Notes */}
          <Section title="Infra & Deployment Notes" icon={Server}>
            <View style={styles.listContainer}>
              <ListItem>Should support daily scheduled runs.</ListItem>
              <ListItem>Flag toggles for automation.</ListItem>
              <ListItem>Batch job monitoring enabled.</ListItem>
            </View>
          </Section>

          {/* Dev Team Ownership */}
          <Section title="Dev Team Ownership" icon={User}>
            <Text style={styles.paragraph}>
              Squad: FMS Core Squad{"\n"}
              Contact: John Doe{"\n"}
              JIRA: FMS-12345{"\n"}
              Git Repo: git.company.com/FMS/eod-bod
            </Text>
            <ImageModal imageSource={'https://i.ibb.co/dwhb3S8y/eod-bod.png'}/>
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

export default System_EODBODDisplay