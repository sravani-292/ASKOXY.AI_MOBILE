import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageModal from '../../ImageModal';
const RiskAnalysis = () => {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Work Flow for Risk Analysis
        </Text>
      </View>

      {/* Overview */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('overview')}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ expanded: expandedSections.overview }}
        >
          <View style={styles.sectionTitleContainer}>
            <Icon name="information-circle-outline" size={20} color="#4B5EAA" />
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <Icon
            name={expandedSections.overview ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#4B5563"
          />
        </TouchableOpacity>
        {expandedSections.overview && (
          <View style={styles.sectionContent}>
            <Text style={styles.text}>
              The Loan Origination System (LOS) is a centralized web-based solution designed for processing loan applications efficiently. It includes modules such as Retail and Corporate, ensuring uniform guidelines across the bank and streamlining electronic workflows to minimize delays.
            </Text>
            <Text style={styles.text}>
              Users input loan application details, and the system automatically retrieves relevant data like interest rates, margins, and product guidelines. It also generates reports such as Credit Score Sheets, Process Notes, Sanction Letters, and more.
            </Text>
            <Text style={styles.text}>
              The first step in limiting credit risk involves screening customers to ensure their willingness and ability to repay the loan. This requires scrutinizing the customer's character history with banks under risk analysis.
            </Text>
          </View>
        )}
      </View>

      {/* Actors */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('actors')}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ expanded: expandedSections.actors }}
        >
          <View style={styles.sectionTitleContainer}>
            <Icon name="people-outline" size={20} color="#4B5EAA" />
            <Text style={styles.sectionTitle}>Actors</Text>
          </View>
          <Icon
            name={expandedSections.actors ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#4B5563"
          />
        </TouchableOpacity>
        {expandedSections.actors && (
          <Text style={styles.text}>Bank Officer</Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('actions')}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ expanded: expandedSections.actions }}
        >
          <View style={styles.sectionTitleContainer}>
            <Icon name="document-text-outline" size={20} color="#4B5EAA" />
            <Text style={styles.sectionTitle}>Actions</Text>
          </View>
          <Icon
            name={expandedSections.actions ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#4B5563"
          />
        </TouchableOpacity>
        {expandedSections.actions && (
          <Text style={styles.text}>
            The Bank Officer initiates the risk rating process by evaluating the customer’s Financial Details, Employment Details, Personal Details, Security Details, and other relevant information.
          </Text>
        )}
      </View>

      {/* Preconditions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('preconditions')}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ expanded: expandedSections.preconditions }}
        >
          <View style={styles.sectionTitleContainer}>
            <Icon name="checkmark-circle-outline" size={20} color="#16A34A" />
            <Text style={styles.sectionTitle}>Preconditions</Text>
          </View>
          <Icon
            name={expandedSections.preconditions ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#4B5563"
          />
        </TouchableOpacity>
        {expandedSections.preconditions && (
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • Customer ID created and linked to the loan account, with all customer details captured in LOS, including proposed asset details, assets and liabilities, proposed loan limit, particulars of the Co-applicant/Guarantor/Co-Obligant, and appraisal note/process note generated.
            </Text>
          </View>
        )}
      </View>

      {/* Post Conditions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('postconditions')}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ expanded: expandedSections.postconditions }}
        >
          <View style={styles.sectionTitleContainer}>
            <Icon name="checkmark-circle-outline" size={20} color="#16A34A" />
            <Text style={styles.sectionTitle}>Post Conditions</Text>
          </View>
          <Icon
            name={expandedSections.postconditions ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#4B5563"
          />
        </TouchableOpacity>
        {expandedSections.postconditions && (
          <View style={styles.list}>
            <Text style={styles.listItem}>• Risk Rating evaluated & captured in LOS.</Text>
            <Text style={styles.listItem}>
              • The Bank Officer can proceed further for the Loan Assessment.
            </Text>
          </View>
        )}
      </View>

      {/* Workflow */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('workflow')}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ expanded: expandedSections.workflow }}
        >
          <View style={styles.sectionTitleContainer}>
            <Icon name="document-text-outline" size={20} color="#4B5EAA" />
            <Text style={styles.sectionTitle}>Workflow</Text>
          </View>
          <Icon
            name={expandedSections.workflow ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#4B5563"
          />
        </TouchableOpacity>
        {expandedSections.workflow && (
          <View style={styles.sectionContent}>
            <View style={styles.list}>
              <Text style={styles.listItem}>
                • After the Customer ID is created, linked to the loan account, and all customer details (proposed asset, assets and liabilities, loan limit, Co-applicant/Guarantor/Co-Obligant particulars, and appraisal note/process note) are captured in LOS, the Bank Officer initiates the Risk Rating process.
              </Text>
              <Text style={styles.listItem}>
                • The Bank Officer obtains and verifies reports such as Legal Scrutiny Report, Technical Report, Financial Verification Report, and Employment/Personal Verification Report from various departments/agencies.
              </Text>
              <Text style={styles.listItem}>
                • The Bank Officer verifies the Loan Application for Financial Details, Employment Details, Personal Details, and Security Details.
              </Text>
              <Text style={styles.listItem}>
                • The Bank Officer evaluates the customer’s risk rating based on:
              </Text>
              <View style={styles.gridContainer}>
                <View style={styles.gridColumn}>
                  <Text style={styles.subHeader}>Personal Data</Text>
                  {[
                    'Age',
                    'Education',
                    'Occupation',
                    'No of dependents',
                    'Length of Service in present Job/Current Business',
                    'Existing Relationship with the Bank',
                    'Other Business support',
                    'Period of Stay in current Address',
                    'Type of ownership of the residence',
                    'Whether owning Two Wheeler/Four Wheeler',
                  ].map((item) => (
                    <Text key={item} style={styles.gridItem}>• {item}</Text>
                  ))}
                </View>
                <View style={styles.gridColumn}>
                  <Text style={styles.subHeader}>Income/Net Worth</Text>
                  {[
                    'Present Annual Income',
                    'Income Proof',
                    'Present Monthly deductions & proposed loan deduction',
                    'Net worth',
                    'Undertaking letter for EMI deduction/Salary Credit',
                    'Income of spouse',
                  ].map((item) => (
                    <Text key={item} style={styles.gridItem}>• {item}</Text>
                  ))}
                </View>
                <View style={styles.gridColumn}>
                  <Text style={styles.subHeader}>Loan Details</Text>
                  {[
                    'Repayment Period',
                    'Security coverage',
                    'Enforceability of the security',
                    'Guarantor’s Net worth',
                    'Type of Loan',
                  ].map((item) => (
                    <Text key={item} style={styles.gridItem}>• {item}</Text>
                  ))}
                </View>
              </View>
              <Text style={styles.listItem}>
                • The Bank Officer assigns weightages to the above parameters to calculate the Risk Rating score.
              </Text>
              <Text style={styles.listItem}>
                • Based on the Risk Rating score, the customer is categorized into different risk ratings, and this is captured in LOS.
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Flowchart */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('flowchart')}
          accessible={true}
          accessibilityRole="button"
          accessibilityState={{ expanded: expandedSections.flowchart }}
        >
          <View style={styles.sectionTitleContainer}>
            <Icon name="document-text-outline" size={20} color="#4B5EAA" />
            <Text style={styles.sectionTitle}>Flowchart</Text>
          </View>
          <Icon
            name={expandedSections.flowchart ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#4B5563"
          />
        </TouchableOpacity>
        {expandedSections.flowchart && (
          <View style={styles.flowchart}>
            <Text style={styles.flowchartText}>
              {`
Start
  |
  v
Customer ID created and linked to loan account
All customer details captured in LOS:
- Proposed Asset details
- Asset & Liabilities details
- Proposed Loan Limit
- Co-applicant/Guarantor/Co-Obligant details
- Appraisal note/Process note generated
  |
  v
Bank Officer initiates Risk Rating process
  |
  v
Obtain and verify reports:
- Legal Scrutiny Report
- Technical Report
- Financial Verification Report
- Employment/Personal Verification Report
  |
  v
Verify Loan Application for:
- Financial Details
- Employment Details
- Personal Details
- Security Details
  |
  v
Evaluate Risk Rating based on:
- Personal Data:
  - Age
  - Education
  - Occupation
  - No of dependents
  - Length of Service
  - Bank Relationship
  - Business support
  - Period of Stay
  - Residence ownership
  - Vehicle ownership
- Income/Net Worth:
  - Annual Income
  - Income Proof
  - Monthly deductions
  - Net worth
  - EMI undertaking
  - Spouse’s income
- Loan Details:
  - Repayment Period
  - Security coverage
  - Security enforceability
  - Guarantor’s Net worth
  - Type of Loan
  |
  v
Assign weightages to parameters
Calculate Risk Rating score
  |
  v
Categorize customer into risk rating
Capture in LOS
  |
  v
Risk Analysis completed
  |
  v
Proceed to Loan Assessment
  |
  v
End
`}
            </Text>
            <ImageModal imageSource={'https://i.ibb.co/27bX7GGK/15.png'}/>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  sectionContent: {
    paddingTop: 10,
  },
  text: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 10,
  },
  list: {
    paddingLeft: 10,
  },
  listItem: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 10,
    marginBottom: 5,
  },
  gridContainer: {
    // flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
    marginVertical: 10,
    gap: 10,
  },
  gridColumn: {
    width: Dimensions.get('window').width * 0.8,
  },
  gridItem: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  flowchart: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  flowchartText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'monospace',
  },
});

export default RiskAnalysis;