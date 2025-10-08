import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  List,
  Server,
  Code,
  GitBranch,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";

const System_BeginingOfDay = () => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    actors: true,
    userActions: true,
    precondition: true,
    postCondition: true,
    stp: true,
    alternativeFlows: true,
    exceptionFlows: true,
    flowchart: true,
    parkingLot: true,
    systemComponents: true,
    testScenarios: true,
    infraNotes: true,
    devTeam: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const Section = ({ title, icon: Icon, children, sectionKey, iconColor = "#2563eb" }) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(sectionKey)}
      >
        <View style={styles.sectionHeaderLeft}>
          <Icon size={20} color={iconColor} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={20} color="#6b7280" />
        ) : (
          <ChevronDown size={20} color="#6b7280" />
        )}
      </TouchableOpacity>
      {expandedSections[sectionKey] && (
        <View style={styles.sectionContent}>{children}</View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Heading */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Beginning of Day (BOD) Process
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.card}>
          <Section title="Description" icon={Info} sectionKey="description">
            <Text style={styles.text}>
              The Beginning of Day (BOD) Process is a daily operation within
              the Collections Management System designed to retrieve and
              update delinquent and non-delinquent account data from the
              backend database. This data is sourced from the Collections
              Management Application and is essential for the classification
              and follow-up of delinquent accounts. The BOD process is
              initiated manually by the user.
            </Text>
          </Section>

          <Section title="Actors" icon={Users} sectionKey="actors">
            <View style={styles.actorsGrid}>
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>Business User</Text>
                <View style={styles.list}>
                  <Text style={styles.bullet}>• Collections System Operator</Text>
                </View>
              </View>
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>System Roles</Text>
                <View style={styles.list}>
                  <Text style={styles.bullet}>• Collections Management System</Text>
                </View>
              </View>
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>Stakeholders</Text>
                <View style={styles.list}>
                  <Text style={styles.bullet}>• Collections Department</Text>
                  <Text style={styles.bullet}>• Risk Team</Text>
                  <Text style={styles.bullet}>• Operations</Text>
                </View>
              </View>
            </View>
          </Section>

          <Section title="User Actions & System Responses" icon={ChevronRight} sectionKey="userActions">
            <View style={styles.orderedList}>
              <Text style={styles.orderedItem}>1. User logs into the Collections Management Application.</Text>
              <Text style={styles.orderedItem}>2. Navigates to the BOD Process screen.</Text>
              <Text style={styles.orderedItem}>
                3. Selects the Line of Business (e.g., Credit Card, Overdraft,
                Finance Loan).
              </Text>
              <Text style={styles.orderedItem}>4. Submits request to initiate BOD process.</Text>
              <Text style={styles.orderedItem}>
                5. System retrieves and displays details for each delinquent and
                non-delinquent customer, including:
              </Text>
              <View style={styles.grid}>
                <View style={styles.column}>
                  <Text style={styles.bullet}>• Total Loan Amount</Text>
                  <Text style={styles.bullet}>• Outstanding Loan Amount</Text>
                  <Text style={styles.bullet}>• Customer/Co-applicant/Guarantor Information</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bullet}>• Due Date and Due Amount</Text>
                  <Text style={styles.bullet}>• Customer Contact Details</Text>
                </View>
              </View>
              <Text style={styles.orderedItem}>
                6. User reviews retrieved data and proceeds to delinquency
                classification.
              </Text>
            </View>
          </Section>

          <Section title="Precondition" icon={CheckCircle} sectionKey="precondition" iconColor="#16a34a">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Database must contain updated information on delinquent and
                non-delinquent accounts.
              </Text>
            </View>
          </Section>

          <Section title="Post Condition" icon={CheckCircle} sectionKey="postCondition" iconColor="#16a34a">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • System displays delinquent case details, and user transitions
                to the classification process.
              </Text>
            </View>
          </Section>

          <Section title="Straight Through Process (STP)" icon={List} sectionKey="stp">
            <Text style={styles.text}>
              Login → Navigate to BOD Process Screen → Select Line of Business
              → Submit → View Delinquency Data → Proceed to Classification
            </Text>
          </Section>

          <Section title="Alternative Flows" icon={ChevronRight} sectionKey="alternativeFlows">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Data retrieval failure due to connectivity or database issues.
              </Text>
              <Text style={styles.bullet}>• User initiates BOD for an unsupported Line of Business.</Text>
            </View>
          </Section>

          <Section title="Exception Flows" icon={AlertCircle} sectionKey="exceptionFlows" iconColor="#dc2626">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Missing data for selected Line of Business.</Text>
              <Text style={styles.bullet}>• System timeout or failure during fetch.</Text>
            </View>
          </Section>

          <Section title="User Activity Diagram (Flowchart)" icon={List} sectionKey="flowchart">
            <View style={styles.flowchart}>
              <Text style={styles.flowchartText}>Start</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Login</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Open BOD Process Screen</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Select Line of Business</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Submit</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>View Customer Details</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Proceed to Classification</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>End</Text>
            </View>
          </Section>

          <Section title="Parking Lot" icon={Info} sectionKey="parkingLot">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Automate BOD process via scheduled batch job.</Text>
              <Text style={styles.bullet}>
                • Dashboard to visualize BOD execution status and exceptions.
              </Text>
            </View>
          </Section>

          <Section title="System Components Involved" icon={Server} sectionKey="systemComponents">
            <View style={styles.list}>
              <Text style={styles.bullet}>• UI: BOD Processing Screen</Text>
              <Text style={styles.bullet}>
                • DB Tables: Customer Info, Loan Details, Delinquency Records
              </Text>
              <Text style={styles.bullet}>• APIs: Data Fetch API, Classification Trigger</Text>
              <Text style={styles.bullet}>• Services: BOD Scheduler, Audit Logger</Text>
            </View>
          </Section>

          <Section title="Test Scenarios" icon={Code} sectionKey="testScenarios">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Run BOD for each Line of Business successfully.</Text>
              <Text style={styles.bullet}>• Simulate missing data and verify error handling.</Text>
              <Text style={styles.bullet}>• Confirm UI displays all expected customer details.</Text>
            </View>
          </Section>

          <Section title="Infra & Deployment Notes" icon={Server} sectionKey="infraNotes">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Ensure BOD fetch job has DB read permissions.</Text>
              <Text style={styles.bullet}>• System load optimization to handle early-day traffic.</Text>
            </View>
          </Section>

          <Section title="Dev Team Ownership" icon={GitBranch} sectionKey="devTeam">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Squad: Collections Process Team</Text>
              <Text style={styles.bullet}>• Contact: Lead Dev - bod_support@bankdomain.com</Text>
              <Text style={styles.bullet}>• JIRA: COLL-BOD-INIT-01</Text>
              <Text style={styles.bullet}>• Git Repo: /collections/bod-process</Text>
            </View>
          </Section>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 8,
  },
  sectionContent: {
    marginTop: 8,
    paddingLeft: 28,
  },
  text: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  list: {
    marginLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 4,
  },
  orderedList: {
    marginLeft: 8,
  },
  orderedItem: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  column: {
    flex: 1,
    minWidth: 150,
    marginRight: 16,
  },
  actorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actorCard: {
    flex: 1,
    minWidth: 150,
    margin: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
  },
  actorTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 8,
  },
  flowchart: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  flowchartText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "monospace",
    lineHeight: 20,
  },
});

export default System_BeginingOfDay;