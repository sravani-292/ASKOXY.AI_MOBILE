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
  AlertCircle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const RepaymentSchedule = () => {
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

  const StrongText = ({ children }) => (
    <Text style={styles.strongText}>{children}</Text>
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
          Work Flow for Sanction of Loan
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
                Once the Customer ID is created, linked to the loan account, and all customer details are captured in the LOS (e.g., Proposed Asset details, Assets & Liabilities, Proposed Loan Limit, Co-applicant/Guarantor details, Appraisal/Process Note), Risk Analysis is completed, Loan Amount assessed, Terms & Conditions finalized, and recommendations are forwarded to the Sanctioning Authorities for loan approval.
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
              <BulletList
                items={[
                  'Bank Officer',
                  'Sanctioning Authority',
                ]}
              />
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
              <BulletList
                items={[
                  <Text>
                    <StrongText>Bank Officer:</StrongText> Coordinates with the Customer/Agency/Department to clear discrepancies, updates the LOS, and forwards the proposal to the Sanctioning Authority for approval.
                  </Text>,
                  <Text>
                    <StrongText>Sanctioning Authority:</StrongText> Reviews the Appraisal Note/Process Note for loan approval.
                  </Text>,
                ]}
              />
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
                  'Customer ID created and linked to the loan account, with all customer details captured in the LOS, including Proposed Asset details, Assets & Liabilities, Proposed Loan Limit, Co-applicant/Guarantor details, Appraisal/Process Note generated, Risk Analysis completed, Loan Amount assessed, Terms & Conditions finalized, and recommendations forwarded to the Sanctioning Authorities.',
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
                  'The Sanctioning Authority updates the sanction/rejection of the Proposed Loan in LOS, and the Bank Officer communicates the decision to the customer.',
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
                  'Once the Customer ID is created, linked to the loan account, and all customer details are captured in the LOS, the proposal is forwarded to the Sanctioning Authority for approval.',
                  'The Sanctioning Authority reviews the Appraisal Note/Process Note for loan approval.',
                  'If discrepancies are found, the Sanctioning Authority comments and requests additional information/reports.',
                  'The proposal is retransmitted to the Bank Officer for discrepancy clearance.',
                  'The Bank Officer reviews comments, obtains additional information/reports from the customer/agency/department, updates the Appraisal/Process Note in LOS, and forwards it to the Sanctioning Authority.',
                  'The Sanctioning Authority reviews the updated note and, if satisfied, approves the loan with conditions (if any); otherwise, rejects the proposal.',
                  'The decision is updated in LOS and forwarded to the Bank Officer for further processing.',
                ]}
              />
              
              {/* Customer Details Grid */}
              <View style={styles.detailsGrid}>
                <Text style={styles.subtitle}>Customer details captured in LOS:</Text>
                <View style={styles.gridContainer}>
                  <View style={styles.gridColumn}>
                    <BulletList
                      items={[
                        'Proposed Asset details',
                        'Assets & Liabilities details',
                        'Proposed Loan Limit',
                      ]}
                    />
                  </View>
                  <View style={styles.gridColumn}>
                    <BulletList
                      items={[
                        'Co-applicant/Guarantor details',
                        'Appraisal/Process Note generated',
                        'Risk Analysis completed',
                      ]}
                    />
                  </View>
                  <View style={styles.gridColumn}>
                    <BulletList
                      items={[
                        'Loan Amount assessed',
                        'Terms & Conditions finalized',
                        'Recommendations updated',
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
- Proposed Loan Amount assessed
- Terms & conditions finalized
- Recommendations updated
  |
  v
Forward recommendations to Sanctioning Authority
  |
  v
Sanctioning Authority reviews Appraisal Note/Process Note
  |
  v
Discrepancies found?
  | Yes
  v
Sanctioning Authority comments and requests additional information/reports
  |
  v
Retransmit proposal to Bank Officer
  |
  v
Bank Officer obtains additional information/reports
  |
  v
Update Appraisal Note/Process Note in LOS
  |
  v
Forward updated note to Sanctioning Authority
  |
  v
Sanctioning Authority reviews updated note
  |
  v
Convinced with updates?
  | Yes            | No
  v               v
Approve Loan     Reject Loan
(with conditions Proposal
if any)
  |
  v
Update decision in LOS
  |
  v
Forward to Bank Officer for further processing
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
  strongText: {
    fontWeight: '600',
    color: '#374151',
  },
  detailsGrid: {
    marginTop: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  gridContainer: {
    gap: 12,
  },
  gridColumn: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
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

export default RepaymentSchedule;