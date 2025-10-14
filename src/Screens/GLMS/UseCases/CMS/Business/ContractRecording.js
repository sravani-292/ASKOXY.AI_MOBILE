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
  ChevronUp,
  Phone 
} from 'lucide-react-native';
import ImageModal from '../../ImageModal';

const ContractRecording = () => {
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
            Contact Recording for Delinquent Case Follow-Up
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.sectionsContainer}>
          {/* Overview */}
          <Section title="Overview" icon={Info} sectionKey="overview">
            <Text style={styles.text}>
              The contact recording process is a critical feature of the Collections System, designed to document interactions between users (typically tele-callers or collectors) and delinquent customers. This process is initiated after the supervisor prioritizes and allocates cases through the work list process. The Contact Recording menu option enables users to log details of follow-up actions and contacts, ensuring a structured and transparent approach to managing delinquent cases.
            </Text>
          </Section>

          {/* Key Components */}
          <Section title="Key Components" icon={Users} sectionKey="keyComponents">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Actors:</Text> User (tele-caller or collector).
              </Text>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Pre-conditions:</Text>
              </Text>
              <View style={styles.nestedList}>
                <Text style={styles.bulletItem}>• Delinquent cases are saved in the database.</Text>
                <Text style={styles.bulletItem}>• Supervisor has prioritized and allocated cases to the collector.</Text>
                <Text style={styles.bulletItem}>• System allows recording of follow-up action details.</Text>
              </View>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Actions:</Text> User contacts the delinquent customer and records the interaction in the system.
              </Text>
              <Text style={styles.bulletItem}>
                <Text style={styles.bold}>Post-conditions:</Text> Action details are saved in the system, enabling further processing.
              </Text>
            </View>
          </Section>

          {/* Workflow */}
          <Section title="Workflow" icon={List} sectionKey="workflow">
            <View style={styles.numberedList}>
              <Text style={styles.numberedItem}>1. Supervisor prioritizes cases based on the Amount Overdue Method and allocates them to the collector.</Text>
              <Text style={styles.numberedItem}>2. User initiates the follow-up process for allocated cases.</Text>
              <Text style={styles.numberedItem}>3. User opens the customer details page, viewing:</Text>
              
              <View style={styles.detailsGrid}>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Customer communication details</Text>
                  <Text style={styles.bulletItem}>• Co-applicant/Guarantor details</Text>
                  <Text style={styles.bulletItem}>• Collateral details</Text>
                  <Text style={styles.bulletItem}>• Payments details</Text>
                  <Text style={styles.bulletItem}>• Repayment schedule details</Text>
                    <Text style={styles.bulletItem}>• Loan statement details</Text>
                  <Text style={styles.bulletItem}>• Foreclosure details</Text>
                  <Text style={styles.bulletItem}>• Follow-up details</Text>
                  <Text style={styles.bulletItem}>• Allocation history report</Text>
                  <Text style={styles.bulletItem}>• Legal case details</Text>
                   <Text style={styles.bulletItem}>• Expense details</Text>
                  <Text style={styles.bulletItem}>• Disbursal details</Text>
                  <Text style={styles.bulletItem}>• Deposit details</Text>
                  <Text style={styles.bulletItem}>• Finance details</Text>
                  <Text style={styles.bulletItem}>• Allocation details</Text>
                  <Text style={styles.bulletItem}>• Overdue details</Text>
                  <Text style={styles.bulletItem}>• Account summary details</Text>
                </View>
             
              </View>

              <Text style={styles.numberedItem}>4. User contacts the customer using curing actions:</Text>
              
              <View style={styles.curingActionsGrid}>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Letter generation</Text>
                  <Text style={styles.bulletItem}>• SMS sending</Text>
                  <Text style={styles.bulletItem}>• Stat Card</Text>
                    <Text style={styles.bulletItem}>• Tele Calling</Text>
                  <Text style={styles.bulletItem}>• Email</Text>
                </View>
              
              </View>

              <Text style={styles.numberedItem}>5. User records follow-up details in the system, including:</Text>
              
              <View style={styles.followUpGrid}>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Action date</Text>
                  <Text style={styles.bulletItem}>• Action start time</Text>
                  <Text style={styles.bulletItem}>• Action type</Text>
                  <Text style={styles.bulletItem}>• Contact mode</Text>
                  <Text style={styles.bulletItem}>• Person contacted</Text>
                     <Text style={styles.bulletItem}>• Place contacted</Text>
                  <Text style={styles.bulletItem}>• Next action date and time</Text>
                  <Text style={styles.bulletItem}>• Reminder mode</Text>
                  <Text style={styles.bulletItem}>• Contacted by</Text>
                  <Text style={styles.bulletItem}>• Remarks</Text>
                </View>
              
              </View>

              <Text style={styles.numberedItem}>6. User saves the details and proceeds with further processes.</Text>
            </View>
          </Section>

          {/* Purpose */}
          <Section title="Purpose" icon={CheckCircle} sectionKey="purpose">
            <Text style={styles.text}>
              The contact recording process ensures that all interactions with delinquent customers are thoroughly documented, enabling efficient case tracking, follow-up management, and strategic decision-making. By maintaining detailed records of actions taken, the system supports supervisors and collectors in prioritizing cases, monitoring progress, and optimizing collection efforts.
            </Text>
          </Section>

          {/* Flowchart */}
          <Section title="Flowchart" icon={Phone} sectionKey="flowchart">
            <View style={styles.flowchart}>
              <Text style={styles.flowchartText}>
                Start: Cases Allocated{'\n'}
                |{'\n'}
                v{'\n'}
                Supervisor Prioritizes Cases{'\n'}
                | (Amount Overdue Method){'\n'}
                v{'\n'}
                User Initiates Follow-Up{'\n'}
                |{'\n'}
                v{'\n'}
                Open Customer Details Page{'\n'}
                | (View Communication, Loan, Legal, etc.){'\n'}
                v{'\n'}
                Contact Customer{'\n'}
                | (Letter, SMS, Call, Email, Stat Card){'\n'}
                v{'\n'}
                Record Follow-Up Details{'\n'}
                | (Action Date, Type, Contact Mode, Remarks, etc.){'\n'}
                v{'\n'}
                Save Details in System{'\n'}
                |{'\n'}
                v{'\n'}
                Proceed with Further Process{'\n'}
                |{'\n'}
                v{'\n'}
                End
              </Text>
            </View>
            <ImageModal imageSource={'https://i.ibb.co/4RBpJrcr/contact-recording.png'}/>
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
  curingActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginLeft: 16,
    marginTop: 8,
  },
  followUpGrid: {
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

export default ContractRecording; 