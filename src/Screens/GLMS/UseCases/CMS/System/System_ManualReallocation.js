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
  Lock,
  GitBranch,
  Server,
  Code,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";

const System_ManualReallocation = () => {
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

  const Section = ({ title, icon: Icon, children, sectionKey }) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(sectionKey)}
      >
        <View style={styles.sectionHeaderLeft}>
          <Icon size={20} color="#2563eb" />
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
            Allocation of Delinquent Cases - Manual Reallocation
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.card}>
          <Section title="Description" icon={Info} sectionKey="description">
            <Text style={styles.text}>
              Manual reallocation is a functionality within the Collections System
              that enables supervisors to reassign delinquent accounts to more
              suitable collectors. This process enhances the efficiency of
              collections by allocating cases to collectors who are better
              equipped to handle specific scenarios. The reallocation is done
              using the Manual Reallocation screen and is restricted to
              supervisors managing the corresponding users.
            </Text>
          </Section>

          <Section title="Actors" icon={Users} sectionKey="actors">
            <View style={styles.grid}>
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>Business User</Text>
                <View style={styles.list}>
                  <Text style={styles.bullet}>• Collections Admin/Supervisor</Text>
                </View>
              </View>
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>System Roles</Text>
                <View style={styles.list}>
                  <Text style={styles.bullet}>• Collections System</Text>
                </View>
              </View>
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>Stakeholders</Text>
                <View style={styles.list}>
                  <Text style={styles.bullet}>• Collections Department</Text>
                  <Text style={styles.bullet}>• Branch Operations</Text>
                  <Text style={styles.bullet}>• Risk Management</Text>
                </View>
              </View>
            </View>
          </Section>

          <Section title="User Actions & System Responses" icon={ChevronRight} sectionKey="userActions">
            <View style={styles.orderedList}>
              <Text style={styles.orderedItem}>1. Collections Admin/Supervisor logs into the Collections System.</Text>
              <Text style={styles.orderedItem}>2. Navigates to the Manual Reallocation screen.</Text>
              <Text style={styles.orderedItem}>3. System displays delinquent cases based on defined queues.</Text>
              <Text style={styles.orderedItem}>
                4. Supervisor selects a delinquent case and updates necessary fields:
              </Text>
              <View style={styles.grid}>
                <View style={styles.column}>
                  <Text style={styles.bullet}>• Loan No. or Account No.</Text>
                  <Text style={styles.bullet}>• Customer Name</Text>
                  <Text style={styles.bullet}>• Customer ID</Text>
                  <Text style={styles.bullet}>• Card No.</Text>
                  <Text style={styles.bullet}>• Overdue Position</Text>
                  <Text style={styles.bullet}>• Financier</Text>
                  <Text style={styles.bullet}>• Financier Type</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bullet}>• Rule Unit Code</Text>
                  <Text style={styles.bullet}>• Unit Level</Text>
                  <Text style={styles.bullet}>• Product Type</Text>
                  <Text style={styles.bullet}>• Product</Text>
                  <Text style={styles.bullet}>• Queue</Text>
                  <Text style={styles.bullet}>• Branch</Text>
                </View>
              </View>
              <Text style={styles.orderedItem}>
                5. Supervisor assigns the case to a new collector who reports to them.
              </Text>
              <Text style={styles.orderedItem}>
                6. System confirms reallocation and updates the case ownership.
              </Text>
            </View>
          </Section>

          <Section title="Precondition" icon={CheckCircle} sectionKey="precondition">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Delinquent cases are classified and auto-communicated.</Text>
              <Text style={styles.bullet}>• Initial allocation must be completed.</Text>
            </View>
          </Section>

          <Section title="Post Condition" icon={CheckCircle} sectionKey="postCondition">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Case is reallocated to a new collector.</Text>
              <Text style={styles.bullet}>• Updated in system for future collection follow-ups.</Text>
            </View>
          </Section>

          <Section title="Straight Through Process (STP)" icon={List} sectionKey="stp">
            <Text style={styles.text}>
              Login → Access Manual Reallocation Screen → Select Case → Update
              Info → Assign New Collector → Save
            </Text>
          </Section>

          <Section title="Alternative Flows" icon={ChevronRight} sectionKey="alternativeFlows">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Bulk reallocation feature (future enhancement).</Text>
              <Text style={styles.bullet}>• Reassignment based on predefined performance metrics.</Text>
            </View>
          </Section>

          <Section title="Exception Flows" icon={AlertCircle} sectionKey="exceptionFlows">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Attempted reassignment outside supervisor's hierarchy.</Text>
              <Text style={styles.bullet}>• Missing mandatory case data.</Text>
              <Text style={styles.bullet}>• Queue mismatch or stale data error.</Text>
            </View>
          </Section>

          <Section title="User Activity Diagram (Flowchart)" icon={List} sectionKey="flowchart">
            <View style={styles.flowchart}>
              <Text style={styles.flowchartText}>Start</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Login as Collections Admin/Supervisor</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Access Manual Reallocation Screen</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Select Delinquent Case</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Update Case Info</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Reassign to New Collector</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Confirm Save</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>End</Text>
            </View>
          </Section>

          <Section title="Parking Lot" icon={Info} sectionKey="parkingLot">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Option to track collector performance post-reallocation.</Text>
              <Text style={styles.bullet}>
                • Integration with real-time dashboards for reassignment load balancing.
              </Text>
            </View>
          </Section>

          <Section title="System Components Involved" icon={Server} sectionKey="systemComponents">
            <View style={styles.list}>
              <Text style={styles.bullet}>• UI: Manual Reallocation Screen</Text>
              <Text style={styles.bullet}>• DB Tables: Delinquent Cases, Collector Assignment Log</Text>
              <Text style={styles.bullet}>• APIs: Case Search, Collector Hierarchy Validator</Text>
              <Text style={styles.bullet}>• Services: Allocation Engine, Role-Based Access Control</Text>
            </View>
          </Section>

          <Section title="Test Scenarios" icon={Code} sectionKey="testScenarios">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Supervisor reallocates a case successfully.</Text>
              <Text style={styles.bullet}>• System blocks unauthorized reassignment.</Text>
              <Text style={styles.bullet}>• Queue filtering works as expected.</Text>
              <Text style={styles.bullet}>• Reallocation audit is properly logged.</Text>
            </View>
          </Section>

          <Section title="Infra & Deployment Notes" icon={Server} sectionKey="infraNotes">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Ensure real-time data refresh for delinquent queues.</Text>
              <Text style={styles.bullet}>• Access control must reflect reporting hierarchy accurately.</Text>
            </View>
          </Section>

          <Section title="Dev Team Ownership" icon={GitBranch} sectionKey="devTeam">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Squad: Collections Workflow Team</Text>
              <Text style={styles.bullet}>• Contact: Lead Dev - delinquent_allocation@bankdomain.com</Text>
              <Text style={styles.bullet}>• JIRA: COLL-MANUAL-REALLOC-01</Text>
              <Text style={styles.bullet}>• Git Repo: /collections/manual-reallocation</Text>
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
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    minWidth: 150,
    marginRight: 16,
  },
  actorCard: {
    flex: 1,
    minWidth: 150,
    margin: 8,
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

export default System_ManualReallocation;