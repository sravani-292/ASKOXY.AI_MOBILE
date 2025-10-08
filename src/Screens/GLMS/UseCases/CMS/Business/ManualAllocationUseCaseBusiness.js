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

const ManualAllocationUseCaseBusiness = () => {
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
            Manual Allocation for Delinquent Customers
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.sectionsContainer}>
          {/* Overview */}
          <Section title="Overview" icon={Info} sectionKey="overview">
            <Text style={styles.text}>
              The Manual Allocation option is used to allocate classified cases that have not been assigned to any units in the system. The User can search for cases using search parameters and perform bulk or selective manual allocation of cases displayed in the results. The User selects the Unit Level and Unit Code to which cases will be allocated. Only the Unit Level and Unit Code under the logged-in user are displayed in the List of Values (LoV). The User can allocate cases in Bulk or Selective mode for the selected unit.
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
                User segregates delinquent cases based on criteria such as Amount Overdue and Bucket, modifies the details if required, and assigns to a Collector.
              </Text>
            </View>
          </Section>

          {/* Preconditions */}
          <Section title="Preconditions" icon={CheckCircle} sectionKey="preconditions">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• The allocations have already been defined.</Text>
            </View>
          </Section>

          {/* Post Conditions */}
          <Section title="Post Conditions" icon={CheckCircle} sectionKey="postconditions">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Delinquent cases are assigned to a Collector.</Text>
            </View>
          </Section>

          {/* Workflow */}
          <Section title="Workflow" icon={List} sectionKey="workflow">
            <View style={styles.numberedList}>
              <Text style={styles.numberedItem}>1. User defines the rules in allocation and maps the queue with the allocation rule.</Text>
              <Text style={styles.numberedItem}>2. User allots the delinquent case to the Collector by providing details such as:</Text>
              
              <View style={styles.detailsGrid}>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Loan No./Account No</Text>
                  <Text style={styles.bulletItem}>• Customer Name</Text>
                  <Text style={styles.bulletItem}>• Customer ID</Text>
                  <Text style={styles.bulletItem}>• Card No.</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Days Past Due (No. of installments due)</Text>
                  <Text style={styles.bulletItem}>• Financier (Vendor)</Text>
                  <Text style={styles.bulletItem}>• Financier Type (Line of Business)</Text>
                  <Text style={styles.bulletItem}>• Rule Unit Code</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Unit Level</Text>
                  <Text style={styles.bulletItem}>• Product Type</Text>
                  <Text style={styles.bulletItem}>• Product</Text>
                  <Text style={styles.bulletItem}>• Queue</Text>
                  <Text style={styles.bulletItem}>• Branch</Text>
                </View>
              </View>

              <Text style={styles.numberedItem}>3. User selects the Unit Level and Unit Code for bulk or selective manual allocation of cases not previously allotted to any Collector.</Text>
              <Text style={styles.numberedItem}>4. User selects delinquent cases from the list and allocates them to the Collector based on the percentage of allocation and priority.</Text>
              <Text style={styles.numberedItem}>5. User saves the manually made allocation in the system for future reference.</Text>
            </View>
          </Section>

          {/* Flowchart */}
          <Section title="Flowchart" icon={List} sectionKey="flowchart">
            <View style={styles.flowchart}>
              <Text style={styles.flowchartText}>
                Start{'\n'}
                |{'\n'}
                v{'\n'}
                Allocation rules defined{'\n'}
                |{'\n'}
                v{'\n'}
                User defines rules and maps queue to allocation rule{'\n'}
                |{'\n'}
                v{'\n'}
                User searches for unallocated delinquent cases using:{'\n'}
                - Amount Overdue{'\n'}
                - Bucket{'\n'}
                |{'\n'}
                v{'\n'}
                User selects Unit Level and Unit Code from LoV{'\n'}
                |{'\n'}
                v{'\n'}
                User performs allocation:{'\n'}
                - Bulk: Allocate all cases in search results{'\n'}
                - Selective: Check boxes for specific finance accounts{'\n'}
                |{'\n'}
                v{'\n'}
                User assigns cases to Collector with details:{'\n'}
                - Loan No./Account No{'\n'}
                - Customer Name{'\n'}
                - Customer ID{'\n'}
                - Card No.{'\n'}
                - Days Past Due{'\n'}
                - Financier{'\n'}
                - Financier Type{'\n'}
                - Rule Unit Code{'\n'}
                - Unit Level{'\n'}
                - Product Type{'\n'}
                - Product{'\n'}
                - Queue{'\n'}
                - Branch{'\n'}
                |{'\n'}
                v{'\n'}
                User sets allocation percentage and priority{'\n'}
                |{'\n'}
                v{'\n'}
                User saves allocation details in system{'\n'}
                |{'\n'}
                v{'\n'}
                Delinquent cases assigned to Collector{'\n'}
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
  },
  bulletItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 4,
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

export default ManualAllocationUseCaseBusiness;