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
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";

const System_ManualAllocation = () => {
  const [expandedSections, setExpandedSections] = useState({
    useCaseName: true,
    actors: true,
    description: true,
    trigger: true,
    preconditions: true,
    postconditions: true,
    basicFlow: true,
    alternateFlows: true,
    exceptionFlows: true,
    businessRules: true,
    assumptions: true,
    notes: true,
    author: true,
    date: true,
    flowchart: true,
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
            Allocation of Delinquent Cases - Manual Allocation
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.card}>
          <Section title="Use Case Name" icon={FileText} sectionKey="useCaseName">
            <Text style={styles.text}>Manual Allocation for Delinquent Cases</Text>
          </Section>

          <Section title="Actor(s)" icon={Users} sectionKey="actors">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Collections Admin/Supervisor (User)</Text>
            </View>
          </Section>

          <Section title="Description" icon={Info} sectionKey="description">
            <Text style={styles.text}>
              This use case covers the manual allocation of delinquent cases
              that have not been assigned to any unit. The user manually
              assigns unallocated delinquent cases to collectors based on
              specific criteria.
            </Text>
          </Section>

          <Section title="Trigger" icon={ChevronRight} sectionKey="trigger">
            <Text style={styles.text}>
              User initiates the manual allocation process for unassigned
              delinquent cases.
            </Text>
          </Section>

          <Section title="Preconditions" icon={CheckCircle} sectionKey="preconditions" iconColor="#16a34a">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Allocation definitions already exist.</Text>
              <Text style={styles.bullet}>• Delinquent cases are available in the system.</Text>
            </View>
          </Section>

          <Section title="Postconditions" icon={CheckCircle} sectionKey="postconditions" iconColor="#16a34a">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Selected delinquent cases are successfully assigned to
                collectors.
              </Text>
            </View>
          </Section>

          <Section title="Basic Flow" icon={List} sectionKey="basicFlow">
            <View style={styles.orderedList}>
              <Text style={styles.orderedItem}>1. User logs into the system.</Text>
              <Text style={styles.orderedItem}>
                2. User searches for delinquent cases using parameters like
                Amount Overdue and Bucket.
              </Text>
              <Text style={styles.orderedItem}>3. User modifies case details if required.</Text>
              <Text style={styles.orderedItem}>
                4. User selects the Unit Level and Unit Code for allocation.
              </Text>
              <Text style={styles.orderedItem}>
                5. User manually assigns cases to collectors based on details
                such as:
              </Text>
              <View style={styles.grid}>
                <View style={styles.column}>
                  <Text style={styles.bullet}>• Loan No., Customer Name, Customer ID, Card No.</Text>
                  <Text style={styles.bullet}>• Days Past Due, Financier, Financier Type</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bullet}>
                    • Rule Unit Code, Unit Level, Product Type, Product,
                    Queue, Branch
                  </Text>
                </View>
              </View>
              <Text style={styles.orderedItem}>
                6. Allocation is done in bulk or selectively by checking
                respective finance accounts.
              </Text>
              <Text style={styles.orderedItem}>
                7. User saves the allocation for record and future reference.
              </Text>
            </View>
          </Section>

          <Section title="Alternate Flow(s)" icon={ChevronRight} sectionKey="alternateFlows">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • User may modify case details or reassign during allocation.
              </Text>
            </View>
          </Section>

          <Section title="Exception Flow(s)" icon={AlertCircle} sectionKey="exceptionFlows" iconColor="#dc2626">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • If no delinquent cases match search criteria, user is
                notified.
              </Text>
            </View>
          </Section>

          <Section title="Business Rules" icon={Lock} sectionKey="businessRules">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Only unit levels and codes under the logged-in user are shown.
              </Text>
              <Text style={styles.bullet}>• Only unallocated cases can be assigned.</Text>
            </View>
          </Section>

          <Section title="Assumptions" icon={Info} sectionKey="assumptions">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Proper system access and user role permissions are available.
              </Text>
              <Text style={styles.bullet}>• Delinquent case data is accurate and current.</Text>
            </View>
          </Section>

          <Section title="Notes" icon={Info} sectionKey="notes">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Ensures manual control over allocation for unassigned cases.
              </Text>
              <Text style={styles.bullet}>
                • Useful in edge cases not covered by automated allocation
                rules.
              </Text>
            </View>
          </Section>

          <Section title="Author" icon={User} sectionKey="author">
            <Text style={styles.text}>System Analyst</Text>
          </Section>

          <Section title="Date" icon={Calendar} sectionKey="date">
            <Text style={styles.text}>2025-05-03</Text>
          </Section>

          <Section title="Flowchart" icon={List} sectionKey="flowchart">
            <View style={styles.flowchart}>
              <Text style={styles.flowchartText}>Start</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Login to System</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Search Delinquent Cases</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Modify Case Details (Optional)</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Select Unit Level & Code</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Assign Cases to Collectors</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Save Allocation</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>End</Text>
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

export default System_ManualAllocation;