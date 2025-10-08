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

const System_AllocationHold = () => {
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
            Allocation of Delinquent Cases - Allocation Hold
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.card}>
          <Section title="Use Case Name" icon={FileText} sectionKey="useCaseName">
            <Text style={styles.text}>Allocation Hold for Delinquent Cases</Text>
          </Section>

          <Section title="Actor(s)" icon={Users} sectionKey="actors">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Supervisor</Text>
            </View>
          </Section>

          <Section title="Description" icon={Info} sectionKey="description">
            <Text style={styles.text}>
              This use case describes the process of holding the allocation of
              delinquent cases. The Supervisor may mark specific delinquent
              cases to be held, preventing their allocation during the process.
            </Text>
          </Section>

          <Section title="Trigger" icon={ChevronRight} sectionKey="trigger">
            <Text style={styles.text}>
              Supervisor initiates the allocation process and chooses to hold
              specific cases.
            </Text>
          </Section>

          <Section title="Preconditions" icon={CheckCircle} sectionKey="preconditions">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Delinquent cases are classified.</Text>
              <Text style={styles.bullet}>
                • Cases are mapped to communication templates for auto-communication.
              </Text>
            </View>
          </Section>

          <Section title="Postconditions" icon={CheckCircle} sectionKey="postconditions">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Selected delinquent cases are marked and held, and thus not
                assigned during the allocation process.
              </Text>
            </View>
          </Section>

          <Section title="Basic Flow" icon={List} sectionKey="basicFlow">
            <View style={styles.orderedList}>
              <Text style={styles.orderedItem}>
                1. Supervisor accesses the system and extracts the list of
                delinquent cases using filters like:
              </Text>
              <View style={styles.grid}>
                <View style={styles.column}>
                  <Text style={styles.bullet}>• Loan/Account Number</Text>
                  <Text style={styles.bullet}>• Customer Name/ID</Text>
                  <Text style={styles.bullet}>• Card Number</Text>
                  <Text style={styles.bullet}>• Overdue Position</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bullet}>• Financier & Financier Type</Text>
                  <Text style={styles.bullet}>• Rule Unit Code, Unit Level, Product Type/Product</Text>
                  <Text style={styles.bullet}>• Queue and Branch</Text>
                </View>
              </View>
              <Text style={styles.orderedItem}>2. Supervisor reviews the extracted cases.</Text>
              <Text style={styles.orderedItem}>3. Supervisor selects specific cases to be held.</Text>
              <Text style={styles.orderedItem}>4. The system marks these cases as on "allocation hold."</Text>
              <Text style={styles.orderedItem}>5. These held cases are not allocated in the next cycle.</Text>
            </View>
          </Section>

          <Section title="Alternate Flow(s)" icon={ChevronRight} sectionKey="alternateFlows">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Supervisor may re-enable allocation for a previously held case.
              </Text>
            </View>
          </Section>

          <Section title="Exception Flow(s)" icon={AlertCircle} sectionKey="exceptionFlows">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • If case data is incomplete or not found, it may not be
                eligible for hold action.
              </Text>
            </View>
          </Section>

          <Section title="Business Rules" icon={Lock} sectionKey="businessRules">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • A held case must remain unassigned even if it matches all
                allocation rules.
              </Text>
              <Text style={styles.bullet}>• Only authorized users may place a case on hold.</Text>
            </View>
          </Section>

          <Section title="Assumptions" icon={Info} sectionKey="assumptions">
            <View style={styles.list}>
              <Text style={styles.bullet}>• Supervisor has the necessary permissions.</Text>
              <Text style={styles.bullet}>• System supports marking and tracking of held cases.</Text>
            </View>
          </Section>

          <Section title="Notes" icon={Info} sectionKey="notes">
            <View style={styles.list}>
              <Text style={styles.bullet}>
                • Holding allocation helps in managing exceptions or flagged
                accounts pending resolution.
              </Text>
            </View>
          </Section>

          <Section title="Author" icon={User} sectionKey="author">
            <Text style={styles.text}>System Analyst</Text>
          </Section>

          <Section title="Date" icon={Calendar} sectionKey="date">
            <Text style={styles.text}>2025-05-03</Text>
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
});

export default System_AllocationHold;