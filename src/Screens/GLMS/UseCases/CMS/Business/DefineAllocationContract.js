import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { 
  Info, 
  Users, 
  CheckCircle, 
  ChevronRight, 
  List, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react-native';


const DefineAllocationContract = () => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    actors: true,
    actions: true,
    preconditions: true,
    postconditions: true,
    workflow: true,
    flowchart: true,
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
          <ChevronUp size={20} color="#4b5563" />
        ) : (
          <ChevronDown size={20} color="#4b5563" />
        )}
      </TouchableOpacity>
      {expandedSections[sectionKey] && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Define Allocation for Delinquent Customers
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.sectionsContainer}>
          {/* Overview */}
          <Section title="Overview" icon={Info} sectionKey="overview">
            <Text style={styles.text}>
              Allocation is a process where the system assigns the cases of a
              particular queue to a unit defined in the system. The
              Collections System allows the user to define new allocation
              rules and modify existing allocations for the selected strategy.
              The user can view or modify only those allocation rules which
              are either defined by them or by their child units.
            </Text>
          </Section>

          {/* Actors */}
          <Section title="Actors" icon={Users} sectionKey="actors">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• User</Text>
            </View>
          </Section>

          {/* Actions */}
          <Section title="Actions" icon={ChevronRight} sectionKey="actions">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                User segregates the delinquent cases based on criteria such as
                due amount, default date, and default percentage, modifies the
                details if needed, and assigns to a Collector.
              </Text>
            </View>
          </Section>

          {/* Preconditions */}
          <Section title="Preconditions" icon={CheckCircle} sectionKey="preconditions">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Delinquent cases are classified and mapped to the communication templates for auto communication.</Text>
              <Text style={styles.bulletItem}>• System should allow modifications to existing allocations.</Text>
            </View>
          </Section>

          {/* Post Conditions */}
          <Section title="Post Conditions" icon={CheckCircle} sectionKey="postconditions">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Delinquent case is assigned to a Collector.</Text>
            </View>
          </Section>

          {/* Workflow */}
          <Section title="Workflow" icon={List} sectionKey="workflow">
            <View style={styles.numberedList}>
              <Text style={styles.numberedItem}>1. User defines the rules in allocation and prepares the delinquent case.</Text>
              <Text style={styles.numberedItem}>2. User maps the delinquent case to the Collector by providing the following details:</Text>
              
              <View style={styles.detailsGrid}>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Strategy</Text>
                  <Text style={styles.bulletItem}>• Financier</Text>
                  <Text style={styles.bulletItem}>• Financier Type</Text>
                  <Text style={styles.bulletItem}>• Queue Code</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Rule Code</Text>
                  <Text style={styles.bulletItem}>• Rule Unit Level</Text>
                  <Text style={styles.bulletItem}>• Rule Unit Code</Text>
                  <Text style={styles.bulletItem}>• Unit Level</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Unit Code</Text>
                  <Text style={styles.bulletItem}>• % Age Allocation</Text>
                  <Text style={styles.bulletItem}>• Execution Sequence</Text>
                  <Text style={styles.bulletItem}>• Maker ID</Text>
                  <Text style={styles.bulletItem}>• Making Date</Text>
                </View>
              </View>

              <Text style={styles.numberedItem}>3. User provides the percentage of allocation and specifies the priority.</Text>
              <Text style={styles.numberedItem}>4. User saves the details in the system for future reference.</Text>
            </View>
          </Section>

          {/* Flowchart */}
          <Section title="Flowchart" icon={List} sectionKey="flowchart">
            <View style={styles.flowchart}>
              <Text style={styles.flowchartText}>
                Start{'\n'}
                |{'\n'}
                v{'\n'}
                Delinquent cases classified and mapped to communication templates{'\n'}
                System allows modifications to existing allocations{'\n'}
                |{'\n'}
                v{'\n'}
                User defines allocation rules based on:{'\n'}
                - Due Amount{'\n'}
                - Default Date{'\n'}
                - Default Percentage{'\n'}
                |{'\n'}
                v{'\n'}
                User maps delinquent case to Collector with details:{'\n'}
                - Strategy{'\n'}
                - Financier{'\n'}
                - Financier Type{'\n'}
                - Queue Code{'\n'}
                - Rule Code{'\n'}
                - Rule Unit Level{'\n'}
                - Rule Unit Code{'\n'}
                - Unit Level{'\n'}
                - Unit Code{'\n'}
                - % Age Allocation{'\n'}
                - Execution Sequence{'\n'}
                - Maker ID{'\n'}
                - Making Date{'\n'}
                |{'\n'}
                v{'\n'}
                User sets allocation percentage and priority{'\n'}
                |{'\n'}
                v{'\n'}
                User saves details in the system{'\n'}
                |{'\n'}
                v{'\n'}
                Delinquent case assigned to Collector{'\n'}
                |{'\n'}
                v{'\n'}
                End
              </Text>
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
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    padding: 16,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  sectionsContainer: {
    gap: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sectionContent: {
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  bulletList: {
    paddingLeft: 8,
    gap: 4,
  },
  bulletItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  numberedList: {
    paddingLeft: 8,
    gap: 8,
  },
  numberedItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginLeft: 16,
    marginTop: 8,
  },
  column: {
    flex: 1,
    minWidth: 120,
  },
  flowchart: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  flowchartText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
});

export default DefineAllocationContract;