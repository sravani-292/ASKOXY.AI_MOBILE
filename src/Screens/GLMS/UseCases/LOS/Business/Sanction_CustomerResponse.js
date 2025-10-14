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
  Send,
  Check,
} from 'lucide-react-native';
import ImageModal from '../../ImageModal';
const { width } = Dimensions.get('window');

const Sanction_CustomerResponse = () => {
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
          Work Flow for Sanction Letter Generation & Customer Response
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
                The Loan Origination System (LOS) is a centralized web-based
                solution designed for processing loan applications efficiently.
                It includes modules such as Retail and Corporate, ensuring
                uniform guidelines across the bank and streamlining electronic
                workflows to minimize delays.
              </Text>
              <Text style={styles.paragraph}>
                Users input loan application details, and the system
                automatically retrieves relevant data like interest rates,
                margins, and product guidelines. It also generates reports such
                as Credit Score Sheets, Process Notes, Sanction Letters, and
                more.
              </Text>
              <Text style={styles.paragraph}>
                Once the Loan Proposal is generated, forwarded to the
                Sanctioning Authorities, and approved or rejected, the Bank
                Officer generates a Sanction/Rejection letter to communicate
                the loan status to the customer, obtains their response, and
                updates it in the LOS.
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
                items={['Customer', 'Bank Officer']}
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
                  'Customer: Receives the Loan offer and acknowledges the offer in case of acceptance.',
                  'Bank Officer: Generates the Sanction/Rejection letter to communicate the loan status to the customer, obtains the response, and updates it in LOS.',
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
                  'Loan Proposal has been approved or rejected by the Sanctioning Authorities.',
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
                  'Loan Offer accepted by the customer, and the Bank Officer initiates the process for opening a Loan Account in CBS.',
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
                  'Once the Loan Proposal is generated, forwarded to the Sanctioning Authorities, and approved or rejected.',
                  'Based on the Sanctioning Authority\'s decision, the Bank Officer generates the Sanction/Rejection letter containing various details.',
                ]}
              />
              
              {/* Letter Details Grid */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailsColumn}>
                  <BulletList
                    items={[
                      'Name of the customer',
                      'Name of Co-applicant',
                      'Address of Applicant/Co-applicant',
                      'Type of Loan',
                      'Loan Status',
                    ]}
                  />
                </View>
                <View style={styles.detailsColumn}>
                  <BulletList
                    items={[
                      'Loan Amount',
                      'Rate of Interest',
                      'Loan Tenure',
                      'EMI',
                      'Repayment Schedule',
                    ]}
                  />
                </View>
                <View style={styles.detailsColumn}>
                  <BulletList
                    items={[
                      'Holiday Period (if any)',
                      'Guarantor details',
                      'Terms & Conditions',
                      'Time clause for availment of Loan',
                      'Remarks',
                    ]}
                  />
                </View>
              </View>

              <BulletList
                items={[
                  'The Bank Officer forwards the Sanction/Rejection letter to the customer to communicate the loan status and obtain acceptance.',
                  'The Customer receives the letter and acknowledges acceptance or communicates rejection to the Bank Officer.',
                  'The Bank Officer updates the customer\'s response in the LOS.',
                  'If the customer accepts the offer, the Bank Officer initiates the process for opening a Loan Account in CBS using the loan details from LOS.',
                ]}
              />
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
Loan Proposal generated and forwarded to Sanctioning Authorities
  |
  v
Sanctioning Authority approves/rejects Loan Proposal
  |
  v
Bank Officer generates Sanction/Rejection letter
  |
  v
Forward letter to Customer
  |
  v
Customer receives letter
  |
  v
Customer responds
  |-----------------|
  v                 v
Accepts Offer     Rejects Offer
  |                 |
  v                 v
Acknowledge       Intimate
Offer             Rejection
  |                 |
  v                 v
Bank Officer updates response in LOS
  |
  v
Offer Accepted?
  | Yes
  v
Initiate Opening of Loan Account in CBS
  |
  v
End
  | No
  v
End`}
                </Text>
                <ImageModal imageSource={'https://i.ibb.co/Q7ZhS8Ft/Usecase13.png'}/>
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
  detailsGrid: {
    gap: 16,
    marginVertical: 12,
  },
  detailsColumn: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
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

export default Sanction_CustomerResponse;