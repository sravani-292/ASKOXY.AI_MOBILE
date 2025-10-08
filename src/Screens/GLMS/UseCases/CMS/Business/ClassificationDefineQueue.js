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
  ChevronUp 
} from 'lucide-react-native';

const ClassificationDefineQueue = () => {
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
            Queue Definition for Delinquent Case Classification
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.sectionsContainer}>
          {/* Overview */}
          <Section title="Overview" icon={Info} sectionKey="overview">
            <Text style={styles.text}>
              The queue definition process is a core functionality of the Collections System, triggered after the Beginning of Day (BOD) process. It focuses on classifying delinquent customers into queues based on delinquency categories, trends, or demographic and financial parameters. Known as queuing, this categorization helps collectors understand the nature of each case and select appropriate collection strategies.
            </Text>
          </Section>

          {/* Key Components */}
          <Section title="Key Components" icon={Users} sectionKey="keyComponents">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Actors:</Text> User (system operator or collections staff).
              </Text>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Pre-conditions:</Text>
              </Text>
              <View style={styles.nestedList}>
                <Text style={styles.bulletItem}>• BOD process completed.</Text>
                <Text style={styles.bulletItem}>• Details of delinquent and non-delinquent customers available in the database.</Text>
              </View>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Actions:</Text> User defines the queue and maps it to a classification rule.
              </Text>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Post-conditions:</Text> Classification rule is mapped to the queue, enabling case allocation.
              </Text>
            </View>
          </Section>

          {/* Workflow */}
          <Section title="Workflow" icon={List} sectionKey="workflow">
            <View style={styles.numberedList}>
              <Text style={styles.numberedItem}>1. User defines rules for case allocation and prepares delinquent cases.</Text>
              <Text style={styles.numberedItem}>2. User specifies queue details, including:</Text>
              
              <View style={styles.detailsGrid}>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Strategy</Text>
                  <Text style={styles.bulletItem}>• Financier</Text>
                  <Text style={styles.bulletItem}>• Financier Type (Line of Business)</Text>
                  <Text style={styles.bulletItem}>• Queue Code</Text>
                  <Text style={styles.bulletItem}>• Rule Code</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Severity</Text>
                  <Text style={styles.bulletItem}>• Execution Sequence</Text>
                  <Text style={styles.bulletItem}>• Maker ID</Text>
                  <Text style={styles.bulletItem}>• Making Date</Text>
                </View>
              </View>

              <Text style={styles.numberedItem}>3. User maps the queue to a classification rule, associating it with a product and financier.</Text>
              <Text style={styles.numberedItem}>4. User provides a description for the queue.</Text>
              <Text style={styles.numberedItem}>5. User saves the queue details in the system for future reference.</Text>
            </View>
          </Section>

          {/* Purpose */}
          <Section title="Purpose" icon={CheckCircle} sectionKey="purpose">
            <Text style={styles.text}>
              The queue definition process ensures that delinquent cases are systematically categorized, allowing collectors to prioritize and manage cases effectively. By mapping queues to classification rules, the system clarifies case characteristics and supports tailored collection strategies, enhancing operational efficiency.
            </Text>
          </Section>

          {/* Flowchart */}
          <Section title="Flowchart" icon={List} sectionKey="flowchart">
            <View style={styles.flowchart}>
              <Text style={styles.flowchartText}>
                Start: BOD Process Completed{'\n'}
                |{'\n'}
                v{'\n'}
                User Defines Allocation Rules{'\n'}
                |{'\n'}
                v{'\n'}
                Prepare Delinquent Cases{'\n'}
                |{'\n'}
                v{'\n'}
                Define Queue Details{'\n'}
                | (Strategy, Financier, Type, Codes, Severity, Sequence, Maker ID, Date){'\n'}
                v{'\n'}
                Map Queue to Classification Rule{'\n'}
                | (With Product and Financier){'\n'}
                v{'\n'}
                Provide Queue Description{'\n'}
                |{'\n'}
                v{'\n'}
                Save Details in System{'\n'}
                |{'\n'}
                v{'\n'}
                End: Queue Defined
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

export default ClassificationDefineQueue;