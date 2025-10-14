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
  List, 
  ChevronDown, 
  ChevronUp,
  ClipboardList 
} from 'lucide-react-native';
import ImageModal from '../../ImageModal';

const WorkPlan = () => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    keyComponents: true,
    workflow: true,
    purpose: true,
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
            Work Plan for Delinquent Case Prioritization and Allocation
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.sectionsContainer}>
          {/* Overview */}
          <Section title="Overview" icon={Info} sectionKey="overview">
            <Text style={styles.text}>
              The work plan process is a key component of the Collections
              System, designed to prioritize and allocate delinquent cases to
              collectors for follow-up. Initiated after case allocation, it
              allows the supervisor to define case priorities based on
              criteria like the amount overdue. The system displays relevant
              case details, enabling informed prioritization and assignment,
              ensuring collectors focus on high-priority cases.
            </Text>
          </Section>

          {/* Key Components */}
          <Section title="Key Components" icon={Users} sectionKey="keyComponents">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Actors:</Text> Supervisor.
              </Text>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Pre-conditions:</Text>
              </Text>
              <View style={styles.nestedList}>
                <Text style={styles.bulletItem}>• Delinquent cases saved in the database.</Text>
                <Text style={styles.bulletItem}>• Supervisor has permission to prioritize and allocate cases to collectors.</Text>
              </View>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Actions:</Text> Supervisor prioritizes cases based on amount overdue and assigns them to collectors.
              </Text>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Post-conditions:</Text> Delinquent cases are allocated to collectors for follow-up.
              </Text>
            </View>
          </Section>

          {/* Workflow */}
          <Section title="Workflow" icon={List} sectionKey="workflow">
            <View style={styles.numberedList}>
              <Text style={styles.numberedItem}>1. Supervisor initiates the work plan process after case allocation.</Text>
              <Text style={styles.numberedItem}>2. Supervisor generates the work plan, and the system displays case details:</Text>
              
              <View style={styles.detailsGrid}>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Loan Account</Text>
                  <Text style={styles.bulletItem}>• Customer Name</Text>
                  <Text style={styles.bulletItem}>• Financier Type</Text>
                  <Text style={styles.bulletItem}>• Product</Text>
                  <Text style={styles.bulletItem}>• Amount Overdue</Text>
                  <Text style={styles.bulletItem}>• Principal Outstanding</Text>
                  <Text style={styles.bulletItem}>• Late Fee</Text>
                  <Text style={styles.bulletItem}>• Installment Overdue</Text>
                  <Text style={styles.bulletItem}>• Remarks</Text>
                </View>
               
              </View>

              <Text style={styles.numberedItem}>3. Supervisor reviews details, prioritizes cases based on amount overdue, and allocates them to collectors.</Text>
            </View>
          </Section>

          {/* Purpose */}
          <Section title="Purpose" icon={CheckCircle} sectionKey="purpose">
            <Text style={styles.text}>
              The work plan process ensures systematic prioritization and
              allocation of delinquent cases, optimizing follow-up efforts. By
              focusing on high-priority cases, it enhances resource
              allocation, improves collection outcomes, and supports
              data-driven decision-making in the Collections System.
            </Text>
          </Section>

          {/* Flowchart */}
          <Section title="Flowchart" icon={ClipboardList} sectionKey="flowchart">
            <View style={styles.flowchart}>
              <Text style={styles.flowchartText}>
                Start: Case Allocation Completed{'\n'}
                |{'\n'}
                v{'\n'}
                Supervisor Initiates Work Plan{'\n'}
                |{'\n'}
                v{'\n'}
                Generate Work Plan{'\n'}
                | (System Displays Case Details){'\n'}
                v{'\n'}
                Prioritize and Allocate Cases{'\n'}
                | (Based on Amount Overdue){'\n'}
                v{'\n'}
                End: Cases Allocated to Collectors
              </Text>
            </View>
                        <ImageModal imageSource={'https://i.ibb.co/Nd8gn6c9/Workplan.png'}/>

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
    gap: 8,
  },
  bulletItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  nestedList: {
    paddingLeft: 16,
    gap: 4,
  },
  bold: {
    fontWeight: '600',
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
    minWidth: 140,
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

export default WorkPlan;