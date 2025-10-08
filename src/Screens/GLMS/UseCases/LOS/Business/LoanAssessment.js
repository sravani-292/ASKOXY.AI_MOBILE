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

const { width } = Dimensions.get('window');

const LoanAssessment = () => {
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
          Work Flow for Loan Assessment
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
                Once the Customer ID is created, linked to the loan account, and all customer details (proposed asset, assets and liabilities, loan limit, Co-applicant/Guarantor/Co-Obligant particulars, appraisal note, and risk analysis) are captured in LOS, the Bank Officer initiates the Loan Assessment process to determine the maximum loan amount that can be extended.
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
                The Bank Officer initiates the Loan Assessment process to determine the maximum loan amount.
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
                  'Customer ID created and linked to the loan account, with all customer details captured in LOS, including proposed asset details, assets and liabilities, proposed loan limit, particulars of the Co-applicant/Guarantor/Co-Obligant, appraisal note generated, and risk analysis completed.',
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
                  'Assessment process of the proposed loan is completed, and the Bank Officer proceeds with specifying Terms & Conditions.',
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
                  'After the Customer ID is created, linked to the loan account, and all customer details (proposed asset, assets and liabilities, loan limit, Co-applicant/Guarantor/Co-Obligant particulars, appraisal note, and risk analysis) are captured in LOS, the Bank Officer initiates the Loan Assessment process to determine the maximum loan amount.',
                  'The Bank Officer ensures all required processes are completed and calculates the maximum loan amount based on project cost, margin, and product max/min cap limits.',
                  'The Bank Officer verifies the details and adds remarks for any changes in the assessment amount.',
                  'Upon completion of the assessment process, the Bank Officer proceeds with specifying Terms & Conditions.',
                ]}
              />
              
              {/* Assessment Sheet Fields */}
              <View style={styles.assessmentGrid}>
                <Text style={styles.subtitle}>Assessment Sheet includes:</Text>
                <View style={styles.gridContainer}>
                  <View style={styles.gridColumn}>
                    <BulletList
                      items={[
                        'Loan Amount Requested',
                        'Present Income',
                        'Present Value of Security',
                        'Rate of Interest',
                      ]}
                    />
                  </View>
                  <View style={styles.gridColumn}>
                    <BulletList
                      items={[
                        'Loan Tenure',
                        'Future Period of Service',
                        'Repayment Capacity',
                        'Assessed Loan Amount',
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
- Appraisal note/Process note generated
- Risk Analysis completed
  |
  v
Bank Officer initiates Loan Assessment process
  |
  v
Ensure all processes completed and calculate
Maximum Loan Amount based on:
- Project cost
- Margin
- Product max/min cap limits
  |
  v
Populate Assessment Sheet with:
- Loan Amount Requested
- Present Income
- Present Value of Security
- Rate of Interest
- Loan Tenure
- Future Period of Service
- Repayment Capacity
- Assessed Loan Amount
  |
  v
Bank Officer verifies details and adds remarks
for any changes in assessment amount
  |
  v
Any discrepancies?
  | Yes
  v
Resolve discrepancies
  |
  v
No
  |
  v
Loan Assessment completed
  |
  v
Proceed to Terms & Conditions
  |
  v
End`}
                </Text>
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
  assessmentGrid: {
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridColumn: {
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

export default LoanAssessment;