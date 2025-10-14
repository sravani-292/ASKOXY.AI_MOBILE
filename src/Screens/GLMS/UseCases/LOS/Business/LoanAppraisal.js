import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  FileText,
  Users, 
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import ImageModal from '../../ImageModal';

const { width } = Dimensions.get('window');

const LoanAppraisal = () => {
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

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Work Flow for Loan Appraisal
        </Text>
      </View>

      {/* Content Sections */}
      <View style={styles.sectionsContainer}>
        {/* Overview Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Overview"
            icon={Info}
            isExpanded={expandedSections.overview}
            onPress={() => toggleSection('overview')}
          />
          {expandedSections.overview && (
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>
                The Loan Origination System (LOS) is a centralized web-based solution designed for processing loan applications efficiently. It includes modules such as Retail and Corporate, ensuring uniform guidelines across the bank and streamlining electronic workflows to minimize delays.
              </Text>
              <Text style={styles.paragraph}>
                Users input loan application details, and the system automatically retrieves relevant data like interest rates, margins, and product guidelines. It also generates reports such as Credit Score Sheets, Process Notes, Sanction Letters, and more.
              </Text>
              <Text style={styles.paragraph}>
                The Bank Officer evaluates loan details, customer income and expenses, experience and services, terms and conditions, and verification details to provide an appraisal for the applied loan.
              </Text>
            </View>
          )}
        </View>

        {/* Actors Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Actors"
            icon={Users}
            isExpanded={expandedSections.actors}
            onPress={() => toggleSection('actors')}
          />
          {expandedSections.actors && (
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>Bank Officer</Text>
            </View>
          )}
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Actions"
            icon={FileText}
            isExpanded={expandedSections.actions}
            onPress={() => toggleSection('actions')}
          />
          {expandedSections.actions && (
            <View style={styles.sectionContent}>
              <Text style={styles.paragraph}>
                The Bank Officer evaluates loan details, customer income and expenses, experience and services, external verification details, and provides remarks for the appraisal.
              </Text>
            </View>
          )}
        </View>

        {/* Preconditions Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Preconditions"
            icon={CheckCircle}
            isExpanded={expandedSections.preconditions}
            onPress={() => toggleSection('preconditions')}
            iconColor="#16a34a"
          />
          {expandedSections.preconditions && (
            <View style={styles.sectionContent}>
              <BulletList
                items={[
                  'Customer ID created and linked to the loan account, with all customer details captured in LOS, including proposed asset details, asset and liabilities details, proposed loan limit, and particulars of the Co-applicant/Guarantor/Co-Obligant.',
                ]}
              />
            </View>
          )}
        </View>

        {/* Post Conditions Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Post Conditions"
            icon={CheckCircle}
            isExpanded={expandedSections.postconditions}
            onPress={() => toggleSection('postconditions')}
            iconColor="#16a34a"
          />
          {expandedSections.postconditions && (
            <View style={styles.sectionContent}>
              <BulletList
                items={[
                  'Loan appraisal note/Process note generated, and the Bank Officer can proceed with Risk Analysis.',
                ]}
              />
            </View>
          )}
        </View>

        {/* Workflow Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Workflow"
            icon={FileText}
            isExpanded={expandedSections.workflow}
            onPress={() => toggleSection('workflow')}
          />
          {expandedSections.workflow && (
            <View style={styles.sectionContent}>
              <BulletList
                items={[
                  'After the Customer ID is created, linked to the loan account, and all customer details (proposed asset, assets and liabilities, loan limit, Co-applicant/Guarantor/Co-Obligant particulars) are captured in LOS, the Bank Officer initiates the appraisal process.',
                  'Requests and obtains the Legal Scrutiny Report (LSR) from the Bank\'s advocate and Security Valuation Report from engineers appointed by the Bank.',
                  'Obtains verification reports on the customer\'s personal and employment details from external/internal agencies, and Income Verification Report from the employer/IT department.',
                  'Obtains the Credit Information Report from the customer\'s existing bankers and extracts the Credit Report from the Credit Information Bureau.',
                  'Captures the details of the obtained reports into the appraisal process in LOS.',
                  'Saves the record to generate the Appraisal Note/Process Note.',
                ]}
              />
              
              {/* Reports Grid */}
              <View style={styles.reportsGrid}>
                <Text style={styles.subtitle}>Required Reports:</Text>
                <View style={styles.reportsContainer}>
                  <View style={styles.reportsColumn}>
                    <BulletList
                      items={[
                        'Legal Scrutiny Report (LSR)',
                        'Security Valuation Report',
                        'Verification Report (personal & employment)',
                      ]}
                    />
                  </View>
                  <View style={styles.reportsColumn}>
                    <BulletList
                      items={[
                        'Income Verification Report',
                        'Credit Information Report',
                        'Credit Report from Credit Bureau',
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Flowchart Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Flowchart"
            icon={FileText}
            isExpanded={expandedSections.flowchart}
            onPress={() => toggleSection('flowchart')}
          />
          {expandedSections.flowchart && (
            <View style={styles.sectionContent}>
              <View style={styles.flowchartContainer}>
                <Text style={styles.flowchartText}>
                  {`Start
  |
  v
Customer ID created and linked to loan account
All customer details captured in LOS:
- Proposed Asset details
- Asset & Liabilities details
- Proposed Loan Limit
- Co-applicant/Guarantor/Co-Obligant details
  |
  v
Bank Officer initiates appraisal process
  |
  v
Request and obtain reports:
- Legal Scrutiny Report (LSR) from Bank's advocate
- Security Valuation Report from Bank's engineers
- Verification Report (personal & employment) from agencies
- Income Verification Report from Employer/IT department
- Credit Information Report from customer's bankers
- Credit Report from Credit Information Bureau
  |
  v
Capture report details in LOS appraisal process
  |
  v
Save record
  |
  v
Generate Appraisal Note/Process Note
  |
  v
Proceed to Risk Analysis
  |
  v
End`}
                </Text>
                <ImageModal imageSource={'https://i.ibb.co/b5rknXQ6/workflow-for-loan-apparisal.png'}/>
              </View>
            </View>
          )}
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
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: '800',
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: width * 0.07,
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
  sectionContent: {
    gap: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#6b7280',
    textAlign: 'left',
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
  reportsGrid: {
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  reportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  reportsColumn: {
    flex: 1,
    minWidth: width * 0.35,
  },
  flowchartContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  flowchartText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
  },
});

export default LoanAppraisal;