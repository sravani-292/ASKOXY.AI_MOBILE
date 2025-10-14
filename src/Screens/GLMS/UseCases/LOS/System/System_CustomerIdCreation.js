import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react-native';
import ImageModal from '../../ImageModal';
const { width } = Dimensions.get('window');

const System_CustomerIdCreation = () => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    actors: true,
    userActions: true,
    conditions: true,
    stp: true,
    alternative: true,
    exception: true,
    activity: true,
    parking: true,
    components: true,
    test: true,
    infra: true,
    dev: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const openDocument = async (url, title) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open ${title}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open document');
    }
  };

  const SectionHeader = ({ title, icon: Icon, isExpanded, onPress, iconColor = '#4f46e5' }) => (
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.sectionHeaderLeft}>
        <Icon size={20} color={iconColor} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {isExpanded ? (
        <ChevronUp size={20} color="#6b7280" />
      ) : (
        <ChevronDown size={20} color="#6b7280" />
      )}
    </TouchableOpacity>
  );

  const BulletList = ({ items, style }) => (
    <View style={[styles.bulletList, style]}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );

  const TableRow = ({ step, userAction, systemResponse }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.tableText}>{step}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableText}>{userAction}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableText}>{systemResponse}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Customer ID Creation in LOS
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.documentButton, { backgroundColor: '#008CBA' }]}
            onPress={() => openDocument(
              'https://docs.google.com/document/d/1F8aXmDQpwGQ-bKGZpEPBDHrzltPxJ5bM/preview',
              'Back End Code View'
            )}
          >
            <ExternalLink size={16} color="#fff" />
            <Text style={styles.buttonText}>View Back End Code</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.documentButton, { backgroundColor: '#04AA6D' }]}
            onPress={() => openDocument(
              'https://docs.google.com/document/d/1ixT9000eGGKk7GBjeW6QOEMRsmX5YGqn/preview',
              'Front End Code View'
            )}
          >
            <ExternalLink size={16} color="#fff" />
            <Text style={styles.buttonText}>View Front End Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Sections */}
      <View style={styles.sectionsContainer}>
        {/* Description */}
        <View style={styles.section}>
          <SectionHeader
            title="Description"
            icon={Info}
            isExpanded={expandedSections.description}
            onPress={() => toggleSection('description')}
          />
          {expandedSections.description && (
            <Text style={styles.paragraph}>
              This use case outlines the process of creating a new Customer ID in the Loan Origination System (LOS). It starts when a customer submits a loan application with required documents. The Bank Officer enters customer data across multiple tabs (Personal, Communication, Employment, Income/Expenses) into LOS. The system validates the data and assigns a unique Customer ID, enabling downstream loan processing.
            </Text>
          )}
        </View>

        {/* Actors */}
        <View style={styles.section}>
          <SectionHeader
            title="Actors"
            icon={Users}
            isExpanded={expandedSections.actors}
            onPress={() => toggleSection('actors')}
          />
          {expandedSections.actors && (
            <View style={styles.actorsGrid}>
              <View style={styles.actorColumn}>
                <Text style={styles.columnTitle}>Customer-facing</Text>
                <BulletList
                  items={[
                    'Customer: Initiates inquiry, submits loan form',
                    'Bank Officer: Captures and verifies customer information',
                  ]}
                />
              </View>
              <View style={styles.actorColumn}>
                <Text style={styles.columnTitle}>System Roles</Text>
                <BulletList
                  items={[
                    'LOS: Main processing system',
                    'CBS: Reference for existing customer data',
                  ]}
                />
              </View>
              <View style={styles.actorColumn}>
                <Text style={styles.columnTitle}>Software Stakeholders</Text>
                <BulletList
                  items={[
                    'API Developer: Customer creation APIs, validations',
                    'QA Team: Tests data entry & validation flows',
                    'Infra/CloudOps: Ensures LOS availability',
                    'UI/UX Team: Designs Customer Capture Screens',
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* User Actions & System Responses */}
        <View style={styles.section}>
          <SectionHeader
            title="User Actions & System Responses"
            icon={FileText}
            isExpanded={expandedSections.userActions}
            onPress={() => toggleSection('userActions')}
          />
          {expandedSections.userActions && (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <View style={styles.tableCell}>
                  <Text style={styles.tableHeaderText}>Step</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableHeaderText}>User Action (UI/API)</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableHeaderText}>System Response</Text>
                </View>
              </View>
              <TableRow step="1" userAction="Customer submits filled loan form & documents" systemResponse="N/A" />
              <TableRow step="2" userAction="Bank Officer logs into LOS" systemResponse="Authenticates & opens dashboard" />
              <TableRow step="3" userAction="Selects 'Create New Customer' option" systemResponse="Loads Customer Master form" />
              <TableRow step="4" userAction="Fills in Personal, Communication, Employment, and Income details" systemResponse="Validates mandatory fields & formats" />
              <TableRow step="5" userAction="N/A" systemResponse="LOS checks duplicates, integrates with CBS" />
              <TableRow step="6" userAction="N/A" systemResponse="Confirmation shown, ID stored in DB" />
              <TableRow step="7" userAction="Officer proceeds to loan application entry" systemResponse="Links new Customer ID to loan workflow" />
            </View>
          )}
        </View>

        {/* Precondition & Post Condition */}
        <View style={styles.section}>
          <SectionHeader
            title="Conditions"
            icon={CheckCircle}
            isExpanded={expandedSections.conditions}
            onPress={() => toggleSection('conditions')}
            iconColor="#16a34a"
          />
          {expandedSections.conditions && (
            <View style={styles.conditionsGrid}>
              <View style={styles.conditionColumn}>
                <Text style={styles.columnTitle}>Precondition</Text>
                <BulletList
                  items={[
                    'Completed loan application form received',
                    'Required documents submitted (e.g., ID proof, address proof, income proof)',
                  ]}
                />
              </View>
              <View style={styles.conditionColumn}>
                <Text style={styles.columnTitle}>Post Condition</Text>
                <BulletList
                  items={[
                    'New Customer ID created and saved in Customer Master',
                    'Ready for further loan processing and eligibility checks',
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* Straight Through Process (STP) */}
        <View style={styles.section}>
          <SectionHeader
            title="Straight Through Process (STP)"
            icon={ChevronRight}
            isExpanded={expandedSections.stp}
            onPress={() => toggleSection('stp')}
          />
          {expandedSections.stp && (
            <Text style={styles.paragraph}>
              <Text style={styles.boldText}>Ideal Path:</Text> Login → Fill Customer Details → Save → Customer ID Created → Proceed to Loan Processing → Logout
            </Text>
          )}
        </View>

        {/* Alternative Flows */}
        <View style={styles.section}>
          <SectionHeader
            title="Alternative Flows"
            icon={ChevronRight}
            isExpanded={expandedSections.alternative}
            onPress={() => toggleSection('alternative')}
          />
          {expandedSections.alternative && (
            <BulletList
              items={[
                'Assisted Mode: Officer assists customer at branch',
                'Self-Service Mode: (Future scope) Digital form via app/portal',
                'API Call: Pre-filled data fetched from national KYC registry (CKYC, UIDAI)',
                'Data Prefill: If PAN exists in CBS, auto-fetch basic data',
              ]}
            />
          )}
        </View>

        {/* Exception Flows */}
        <View style={styles.section}>
          <SectionHeader
            title="Exception Flows"
            icon={AlertCircle}
            isExpanded={expandedSections.exception}
            onPress={() => toggleSection('exception')}
            iconColor="#dc2626"
          />
          {expandedSections.exception && (
            <BulletList
              items={[
                'PAN already exists in LOS or CBS → Show duplicate alert',
                'Missing mandatory fields → Show validation errors',
                'Invalid document types or expired proof → Show rejection message',
                'CBS integration timeout → Show retry option',
                'System crash → Auto-save as draft',
              ]}
            />
          )}
        </View>

        {/* User Activity Diagram */}
        <View style={styles.section}>
          <SectionHeader
            title="User Activity Diagram"
            icon={FileText}
            isExpanded={expandedSections.activity}
            onPress={() => toggleSection('activity')}
          />
          {expandedSections.activity && (
            <View style={styles.activityDiagram}>
              <Text style={styles.activityText}>
                {`Start
Customer submits loan form
→ Officer logs into LOS
Selects "Create New Customer"
Enters Customer Details in UI Tabs
[Validation]
- {Fail} → Show error → Revise & retry
- {Pass} → Save → System generates unique Customer ID
Show confirmation to officer
End {Proceed to Loan Entry}`}
              </Text>
            </View>
          )}
        </View>

        {/* Parking Lot */}
        <View style={styles.section}>
          <SectionHeader
            title="Parking Lot"
            icon={Info}
            isExpanded={expandedSections.parking}
            onPress={() => toggleSection('parking')}
          />
          {expandedSections.parking && (
            <BulletList
              items={[
                'ML Model to auto-suggest missing fields (based on past profiles)',
                'OCR integration for auto-filling data from scanned documents',
                'Aadhaar/PAN-based digital KYC fetch via API',
                'Customer photo capture/upload',
                'Multi-lingual UI for vernacular data entry',
              ]}
            />
          )}
        </View>

        {/* System Components Involved */}
        <View style={styles.section}>
          <SectionHeader
            title="System Components Involved"
            icon={Info}
            isExpanded={expandedSections.components}
            onPress={() => toggleSection('components')}
          />
          {expandedSections.components && (
            <BulletList
              items={[
                'UI Screens: Customer Master Entry, ID Confirmation',
                'APIs: CreateCustomerAPI, ValidatePAN, FetchFromCBS',
                'Database Tables: customer_master, customer_documents',
                'External Services: CBS integration, PAN/KYC validation',
                'Queues: Async retry for CBS validation (if needed)',
              ]}
            />
          )}
        </View>

        {/* Test Scenarios */}
        <View style={styles.section}>
          <SectionHeader
            title="Test Scenarios"
            icon={FileText}
            isExpanded={expandedSections.test}
            onPress={() => toggleSection('test')}
          />
          {expandedSections.test && (
            <View style={styles.testGrid}>
              <View style={styles.testColumn}>
                <Text style={styles.columnTitle}>Functional</Text>
                <BulletList
                  items={[
                    'Create customer with all valid fields',
                    'Duplicate PAN check',
                    'Missing mandatory field handling',
                  ]}
                />
              </View>
              <View style={styles.testColumn}>
                <Text style={styles.columnTitle}>Edge Cases</Text>
                <BulletList
                  items={[
                    '100-character names',
                    'Special characters in address',
                  ]}
                />
              </View>
              <View style={styles.testColumn}>
                <Text style={styles.columnTitle}>Negative</Text>
                <BulletList
                  items={[
                    'Invalid DOB (e.g., future date)',
                    'Invalid email/mobile',
                  ]}
                />
              </View>
              <View style={styles.testColumn}>
                <Text style={styles.columnTitle}>Integration</Text>
                <BulletList
                  items={[
                    'CBS lookup for existing PAN',
                    'PAN validation API down scenario',
                  ]}
                />
              </View>
              <View style={styles.testColumn}>
                <Text style={styles.columnTitle}>Performance</Text>
                <BulletList
                  items={[
                    'Load test for 100 concurrent customer creations',
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* Infra & Deployment Notes */}
        <View style={styles.section}>
          <SectionHeader
            title="Infra & Deployment Notes"
            icon={Info}
            isExpanded={expandedSections.infra}
            onPress={() => toggleSection('infra')}
          />
          {expandedSections.infra && (
            <BulletList
              items={[
                'Hosted on private cloud (Bank\'s internal data center or AWS)',
                'Customer creation feature behind feature toggle',
                'Auto-scaling enabled for high-load weekdays',
                'Encrypted data storage (AES-256)',
                'Data masking in logs for PII fields',
              ]}
            />
          )}
        </View>

        {/* Dev Team Ownership */}
        <View style={styles.section}>
          <SectionHeader
            title="Dev Team Ownership"
            icon={Users}
            isExpanded={expandedSections.dev}
            onPress={() => toggleSection('dev')}
          />
          {expandedSections.dev && (
            <BulletList
              items={[
                'Team: LOS-Core Services Squad',
                'Contact: Anil Rao (Product Owner)',
                'Jira Epic: LOS-001-CustomerOnboarding',
                'Git Repo: bank-loan-os/customer-service',
              ]}
            />
          )}
                      <ImageModal imageSource={'https://i.ibb.co/7dXKJFyq/customer-id-creation.png'}/>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    paddingHorizontal: width * 0.04,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 24,
    gap: 16,
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: width * 0.07,
  },
  buttonContainer: {
    gap: 12,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionsContainer: {
    gap: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6b7280',
    textAlign: 'left',
  },
  boldText: {
    fontWeight: '600',
    color: '#374151',
  },
  actorsGrid: {
    gap: 16,
  },
  actorColumn: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  conditionsGrid: {
    gap: 16,
  },
  conditionColumn: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  testGrid: {
    gap: 16,
  },
  testColumn: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  bulletList: {
    gap: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 8,
    lineHeight: 24,
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6b7280',
    flex: 1,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    flex: 1,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  tableText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  activityDiagram: {
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  activityText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
});

export default System_CustomerIdCreation;