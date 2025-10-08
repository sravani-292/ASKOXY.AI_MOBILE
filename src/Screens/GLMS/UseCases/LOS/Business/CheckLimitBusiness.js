import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CheckLimitBusiness = () => {
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
          Workflow for Checking Customer Eligibility & Loan Limit
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
              The Bank Officer checks the proposed loan limit by considering the customer’s Income, Expenditure, Asset cost, requested loan amount, and tenure.
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
          <View style={styles.list}>
            <Text style={styles.listItem}>• Bank Officer</Text>
          </View>
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
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • The Bank Officer checks the proposed loan limit by considering the customer Income, Expenditure, Asset cost & requested loan amount & tenure.
            </Text>
          </View>
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
              • Customer ID has already been created, linked to the Loan product & proposed asset details captured.
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
            <Text style={styles.listItem}>• Loan Limit checked & captured in LOS.</Text>
            <Text style={styles.listItem}>
              • The Bank Officer can proceed further for capturing the Asset & Liabilities details of the customer.
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
                • Once the Proposed Asset details are captured into the LOS, the Bank Officer initiates the process for checking the Loan limit & capturing the same in the LOS.
              </Text>
              <Text style={styles.listItem}>
                • The Bank Officer checks the application form for the Income, Expenditure, Asset details & Loan Amount & tenure.
              </Text>
              <Text style={styles.listItem}>
                • The Bank Officer enters the following customer details in the Loan calculator to check the primary eligibility of the customer & to arrive at the proposed loan limit:
              </Text>
              <View style={styles.gridContainer}>
                <View style={styles.gridColumn}>
                  {['Loan Type', 'Date of Birth', 'Purpose of Loan', 'Asset Details', 'Cost of Asset'].map((item) => (
                    <Text key={item} style={styles.gridItem}>• {item}</Text>
                  ))}
                </View>
                <View style={styles.gridColumn}>
                  {['Loan Amount', 'Loan Tenure', 'Occupation', 'Company Details', 'Total Work Experience'].map((item) => (
                    <Text key={item} style={styles.gridItem}>• {item}</Text>
                  ))}
                </View>
                <View style={styles.gridColumn}>
                  {['Age of Retirement', 'Monthly Income', 'Other Income', 'Total EMI for the Existing Liabilities', 'Co-Applicant Details'].map((item) => (
                    <Text key={item} style={styles.gridItem}>• {item}</Text>
                  ))}
                </View>
              </View>
              <Text style={styles.listItem}>
                • Once the above details are captured, the Bank Officer submits the record to arrive at the eligibility of the customer & the proposed Loan Limit.
              </Text>
              <Text style={styles.listItem}>
                • Once the Proposed Loan limit is obtained, the Bank Officer captures the same into the LOS.
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
Customer ID created and linked to Loan Product
Proposed Asset details captured in LOS
  |
  v
Bank Officer initiates Loan Limit checking process in LOS
  |
  v
Bank Officer checks application form for:
- Income
- Expenditure
- Asset Details
- Loan Amount
- Tenure
  |
  v
Bank Officer enters customer details into Loan Calculator:
- Loan Type
- Date of Birth
- Purpose of Loan
- Asset Details
- Cost of Asset
- Loan Amount
- Loan Tenure
- Occupation
- Company Details
- Total Work Experience
- Age of Retirement
- Monthly Income
- Other Income
- Total EMI for Existing Liabilities
- Co-Applicant Details
  |
  v
Bank Officer submits record to determine:
- Customer Eligibility
- Proposed Loan Limit
  |
  v
Bank Officer captures Proposed Loan Limit in LOS
  |
  v
Proceed to capture Asset & Liabilities details
  |
  v
End
`}
            </Text>
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
    marginVertical: 10,
  },
  gridColumn: {
    width: Dimensions.get('window').width * 0.28,
    paddingRight: 10,
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

export default CheckLimitBusiness;