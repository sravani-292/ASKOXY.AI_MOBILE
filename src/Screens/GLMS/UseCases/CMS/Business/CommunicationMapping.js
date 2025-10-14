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
  Mail 
} from 'lucide-react-native';
import ImageModal from '../../ImageModal';

const CommunicationMaping = () => {
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
            Queue Communication Mapping for Delinquent Case Classification
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.sectionsContainer}>
          {/* Overview */}
          <Section title="Overview" icon={Info} sectionKey="overview">
            <Text style={styles.text}>
              The queue communication mapping process is a key functionality
              within the Collections System, initiated after the Beginning of
              Day (BOD) process and queue classification. It involves mapping
              queues to communication templates to enable automated customer
              communications based on specified curing actions. This process
              ensures that follow-up actions align with the collection
              strategy for each queue, enhancing communication efficiency.
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
                <Text style={styles.bulletItem}>• Classification rules and curing actions mapped to queues.</Text>
              </View>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Actions:</Text> User maps queues to communication templates for automated communication.
              </Text>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Post-conditions:</Text> System communicates with customers based on the specified curing actions, and mapping details are saved.
              </Text>
            </View>
          </Section>

          {/* Workflow */}
          <Section title="Workflow" icon={List} sectionKey="workflow">
            <View style={styles.numberedList}>
              <Text style={styles.numberedItem}>1. User defines the queue by mapping a classification rule to a product and financier.</Text>
              <Text style={styles.numberedItem}>2. User sets the priority for the defined queues.</Text>
              <Text style={styles.numberedItem}>3. User specifies curing actions for mapping to the communication template.</Text>
              <Text style={styles.numberedItem}>4. User maps the queue to a communication template.</Text>
              <Text style={styles.numberedItem}>5. System automatically communicates with customers based on the selected curing action.</Text>
              <Text style={styles.numberedItem}>6. User saves the mapping details in the system for future reference.</Text>
            </View>
          </Section>

          {/* Purpose */}
          <Section title="Purpose" icon={CheckCircle} sectionKey="purpose">
            <Text style={styles.text}>
              The queue communication mapping process automates customer
              communications, ensuring consistent and timely follow-up actions
              aligned with queue-specific collection strategies. It reduces
              manual effort, improves case management, and enhances recovery
              outcomes by streamlining outreach efforts.
            </Text>
          </Section>

          {/* Flowchart */}
          <Section title="Flowchart" icon={Mail} sectionKey="flowchart">
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
                |{'\n'}
                v{'\n'}
                Map Queue to Communication Template{'\n'}
                |{'\n'}
                v{'\n'}
                System Sends Automated Communication{'\n'}
                | (Based on Curing Action){'\n'}
                v{'\n'}
                Save Mapping Details{'\n'}
                |{'\n'}
                v{'\n'}
                End: Communication Mapping Completed
              </Text>
            </View>
                        <ImageModal imageSource={'https://i.ibb.co/v6qK9sbF/queue-communication-mapping.png'}/>

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

export default CommunicationMaping;