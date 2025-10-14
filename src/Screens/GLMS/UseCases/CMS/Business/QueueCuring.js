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
  Activity 
} from 'lucide-react-native';
import ImageModal from '../../ImageModal';

const QueueCuring = () => {
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
            Queue Curing for Delinquent Case Classification
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.sectionsContainer}>
          {/* Overview */}
          <Section title="Overview" icon={Info} sectionKey="overview">
            <Text style={styles.text}>
              The queue curing process is a critical functionality within the Collections System, initiated after the Beginning of Day (BOD) process and queue classification. It involves specifying curing actions—communication methods like letters, SMS, emails, telecalling, or stat cards—for follow-up on cases within each queue. This ensures that follow-up actions align with the queue's collection strategy, enhancing case management efficiency.
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
                <Text style={styles.bulletItem}>• Classification rules mapped to queues.</Text>
              </View>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Actions:</Text> User specifies curing actions for follow-up on queue-associated cases.
              </Text>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Post-conditions:</Text> Curing actions are defined, enabling follow-up via specified communication methods.
              </Text>
            </View>
          </Section>

          {/* Workflow */}
          <Section title="Workflow" icon={List} sectionKey="workflow">
            <View style={styles.numberedList}>
              <Text style={styles.numberedItem}>1. User defines the queue by mapping a classification rule to a product and financier.</Text>
              <Text style={styles.numberedItem}>2. User sets the priority for the defined queues.</Text>
              <Text style={styles.numberedItem}>3. User specifies curing actions by providing:</Text>
              
              <View style={styles.detailsGrid}>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Strategy</Text>
                  <Text style={styles.bulletItem}>• Financier</Text>
                  <Text style={styles.bulletItem}>• Financier Type (Line of Business)</Text>
                   <Text style={styles.bulletItem}>• Queue Code</Text>
                  <Text style={styles.bulletItem}>• Making Date</Text>
                  <Text style={styles.bulletItem}>• Curing Action (Letter generation, SMS sending, Stat card, Telecalling, Email)</Text>
                
                </View>
            
              </View>

              <Text style={styles.numberedItem}>4. Curing actions are applied for follow-up on queue-associated cases.</Text>
              <Text style={styles.numberedItem}>5. User saves the curing action details in the system for future reference.</Text>
            </View>
          </Section>

          {/* Purpose */}
          <Section title="Purpose" icon={CheckCircle} sectionKey="purpose">
            <Text style={styles.text}>
              The queue curing process ensures that follow-up actions use appropriate communication methods, tailored to the queue's strategy. It enables efficient customer outreach, reduces manual effort, and improves case resolution rates, supporting effective case management and collections efficiency.
            </Text>
          </Section>

          {/* Flowchart */}
          <Section title="Flowchart" icon={Activity} sectionKey="flowchart">
            <View style={styles.flowchart}>
              <Text style={styles.flowchartText}>
                Start: BOD Process Completed{'\n'}
                |{'\n'}
                v{'\n'}
                Map Classification Rule to Queue{'\n'}
                | (With Product and Financier){'\n'}
                v{'\n'}
                Set Priority for Queues{'\n'}
                |{'\n'}
                v{'\n'}
                Specify Curing Actions{'\n'}
                | (Strategy, Financier, Type, Code, Date, Action){'\n'}
                v{'\n'}
                Apply Curing Actions for Follow-Up{'\n'}
                |{'\n'}
                v{'\n'}
                Save Curing Action Details{'\n'}
                |{'\n'}
                v{'\n'}
                End: Curing Actions Defined
              </Text>
            </View>
                        <ImageModal imageSource={'https://i.ibb.co/k2Jf7N5R/queue.jpg'}/>

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

export default QueueCuring;