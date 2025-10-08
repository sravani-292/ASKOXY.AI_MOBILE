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
  Scale 
} from 'lucide-react-native';

const LegalCollection = () => {
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
            Legal Collections Workflow
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.sectionsContainer}>
          {/* Overview */}
          <Section title="Overview" icon={Info} sectionKey="overview">
            <Text style={styles.text}>
              The legal collections workflow is a specialized module within
              the Collections System designed to manage cases filed for legal
              action to recover overdue amounts from delinquent customers.
              This process follows predefined stages based on the lending
              institution's policies, ensuring a structured approach to
              initiating and tracking legal proceedings. The Legal Collections
              Module allows users to document court proceedings, update
              verdicts, and manage case withdrawals.
            </Text>
          </Section>

          {/* Key Components */}
          <Section title="Key Components" icon={Users} sectionKey="keyComponents">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Actors:</Text> User (collections staff or legal team representative).
              </Text>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Pre-conditions:</Text>
              </Text>
              <View style={styles.nestedList}>
                <Text style={styles.bulletItem}>• Customer is classified as delinquent.</Text>
              </View>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Actions:</Text> User initiates a legal case, sends legal notices, files cases, presents evidence, and records court proceedings.
              </Text>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Post-conditions:</Text> Court proceedings and verdicts are recorded and updated in the Collections Management Application.
              </Text>
            </View>
          </Section>

          {/* Workflow */}
          <Section title="Workflow" icon={List} sectionKey="workflow">
            <View style={styles.numberedList}>
              <Text style={styles.numberedItem}>1. User sends delinquent customer documents to the legal collection process team and marks the case for legal collection in the Collections Management Application.</Text>
              <Text style={styles.numberedItem}>2. Supervisor allocates the case to an appropriate lawyer based on the delinquent customer's details.</Text>
              <Text style={styles.numberedItem}>3. User sends a legal notice to the delinquent customer with the lawyer's assistance.</Text>
              <Text style={styles.numberedItem}>4. User (organization) files a legal case against the delinquent customer.</Text>
              <Text style={styles.numberedItem}>5. User submits documents and evidence against the customer to the court.</Text>
              <Text style={styles.numberedItem}>6. User records details of court proceedings and updates verdicts in the Collections Management Application.</Text>
            </View>
            
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>Notes:</Text>
              <View style={styles.notesList}>
                <Text style={styles.bulletItem}>• Cases can be withdrawn via the Case Withdrawal interface upon mutual agreement.</Text>
                <Text style={styles.bulletItem}>• A 'Legal Waiver' category prevents cases from moving to legal collections.</Text>
                <Text style={styles.bulletItem}>• Timely approvals are required, and a letter with customer, contract, collateral, and follow-up details may be generated.</Text>
              </View>
            </View>
          </Section>

          {/* Purpose */}
          <Section title="Purpose" icon={CheckCircle} sectionKey="purpose">
            <Text style={styles.text}>
              The legal collections workflow ensures systematic management of
              legal actions against delinquent customers, supporting
              transparency, compliance, and effective recovery of overdue
              amounts. It provides flexibility for case withdrawals and
              waivers, enhancing operational efficiency and decision-making.
            </Text>
          </Section>

          {/* Flowchart */}
          <Section title="Flowchart" icon={Scale} sectionKey="flowchart">
            <View style={styles.flowchart}>
              <Text style={styles.flowchartText}>
                Start: Delinquent Customer Identified{'\n'}
                |{'\n'}
                v{'\n'}
                Send Documents to Legal Team{'\n'}
                | (Mark for Legal Collection){'\n'}
                v{'\n'}
                Supervisor Allocates Case to Lawyer{'\n'}
                |{'\n'}
                v{'\n'}
                Send Legal Notice to Customer{'\n'}
                |{'\n'}
                v{'\n'}
                File Case Against Customer{'\n'}
                |{'\n'}
                v{'\n'}
                Present Documents and Evidence to Court{'\n'}
                |{'\n'}
                v{'\n'}
                Record Court Proceedings and Verdicts{'\n'}
                |{'\n'}
                v{'\n'}
                End: Details Updated in System
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
  notesSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  notesList: {
    paddingLeft: 8,
    gap: 4,
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

export default LegalCollection;