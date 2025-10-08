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

const System_DefineAllocation = () => {
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
            Allocation of Delinquent Cases - Define Allocation
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.card}>
          <Section title="Use Case Name" icon={FileText} sectionKey="useCaseName">
            <Text style={styles.text}>Define Allocation for Delinquent Cases</Text>
          </Section>

          <Section title="Actor(s)" icon={Users} sectionKey="actors">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Collections Admin/Supervisor (User)</Text>
            </View>
          </Section>

          <Section title="Description" icon={Info} sectionKey="description">
            <Text style={styles.text}>
              This use case describes how a user defines or modifies
              allocation rules in the Collections System. It involves
              assigning delinquent cases to collectors based on defined rules
              and parameters.
            </Text>
          </Section>

          <Section title="Trigger" icon={ChevronRight} sectionKey="trigger">
            <Text style={styles.text}>
              User initiates the allocation configuration process.
            </Text>
          </Section>

          <Section title="Preconditions" icon={CheckCircle} sectionKey="preconditions" iconColor="#16a34a">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Delinquent cases are classified.</Text>
              <Text style={styles.bullet}>
                • Cases mapped to communication templates for auto-communication.
              </Text>
              <Text style={styles.bullet}>
                • System allows modification of existing allocation rules.
              </Text>
            </View>
          </Section>

          <Section title="Postconditions" icon={CheckCircle} sectionKey="postconditions" iconColor="#16a34a">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Delinquent cases are successfully assigned to collectors as
                per the defined rules.
              </Text>
            </View>
          </Section>

          <Section title="Basic Flow" icon={List} sectionKey="basicFlow">
            <View style={styles.orderedList}>
              <Text style={styles.orderedItem}>1. User logs into the Collections System.</Text>
              <Text style={styles.orderedItem}>
                2. User defines or modifies allocation rules for a strategy.
              </Text>
              <Text style={styles.orderedItem}>
                3. User segregates cases based on due amount, default date, and
                default percentage.
              </Text>
              <Text style={styles.orderedItem}>
                4. User provides rule parameters:
              </Text>
              <View style={styles.grid}>
                <View style={styles.column}>
                  <Text style={styles.bullet}>• Strategy, Financier, Financier Type</Text>
                  <Text style={styles.bullet}>• Queue Code, Rule Code, Rule Unit Level & Code</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bullet}>• Unit Level & Code, % Allocation, Execution Sequence</Text>
                  <Text style={styles.bullet}>• Maker ID, Making Date</Text>
                </View>
              </View>
              <Text style={styles.orderedItem}>5. User assigns delinquent cases to collectors.</Text>
              <Text style={styles.orderedItem}>6. User saves allocation settings for future reference.</Text>
            </View>
          </Section>

          <Section title="Alternate Flow(s)" icon={ChevronRight} sectionKey="alternateFlows">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • User may update percentage allocation and execution sequence
                based on priority changes.
              </Text>
            </View>
          </Section>

          <Section title="Exception Flow(s)" icon={AlertCircle} sectionKey="exceptionFlows" iconColor="#dc2626">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Invalid rule definitions or missing required fields result in
                validation errors.
              </Text>
            </View>
          </Section>

          <Section title="Business Rules" icon={Lock} sectionKey="businessRules">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Allocation rules must only be created or modified by users
                with appropriate access.
              </Text>
              <Text style={styles.bullet}>
                • Allocation rules can only apply to strategies assigned to the
                user's unit or child units.
              </Text>
            </View>
          </Section>

          <Section title="Assumptions" icon={Info} sectionKey="assumptions">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Proper data is available for allocation (queues, rules, units,
                etc.).
              </Text>
              <Text style={styles.bullet}>• System validates rule definitions before saving.</Text>
            </View>
          </Section>

          <Section title="Notes" icon={Info} sectionKey="notes">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • This module improves control and automation of delinquent case
                handling through structured allocation logic.
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
              <Text style={styles.flowchartText}>Login to Collections System</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Define/Modify Allocation Rules</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Segregate Cases</Text>
              <Text style={styles.flowchartText}>  | (Based on Due Amount, Default Date, Percentage)</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Provide Rule Parameters</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Assign Cases to Collectors</Text>
              <Text style={styles.flowchartText}>  |</Text>
              <Text style={styles.flowchartText}>  v</Text>
              <Text style={styles.flowchartText}>Save Allocation Settings</Text>
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

export default System_DefineAllocation;