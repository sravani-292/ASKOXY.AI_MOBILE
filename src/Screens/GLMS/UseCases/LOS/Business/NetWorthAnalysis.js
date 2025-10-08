import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NetWorthAnalysis = () => {
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
          Workflow for Evaluating the Net Worth of the Parties
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
              The Bank Officer evaluates the Assets and Liabilities of the parties to arrive at their net worth.
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
              • The Bank Officer evaluates the Assets and Liabilities of the parties for arriving at the net worth.
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
              • Customer IDs have already been created for all the parties and linked to the proposed Loan.
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
            <Text style={styles.listItem}>• Net Worth of all parties evaluated and captured in LOS.</Text>
            <Text style={styles.listItem}>
              • The Bank Officer can proceed further for the Appraisal of the proposed loan.
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
                • Once the Proposed Asset details are captured in the LOS, the Bank Officer checks the primary eligibility of the customer in LOS.
              </Text>
              <Text style={styles.listItem}>
                • The Bank Officer creates the Customer IDs for the Co-applicant / Co-obligant / Guarantor and links the same to the proposed loan of the customer.
              </Text>
              <Text style={styles.listItem}>
                • The Bank Officer initiates the process for evaluating the Assets & Liabilities of the Customer / Co-applicant / Co-obligant / Guarantor for arriving at the Net Worth of all the parties.
              </Text>
              <Text style={styles.listItem}>
                • The Bank Officer enters the following details regarding the Assets & Liabilities of the parties in LOS:
              </Text>
              <View style={styles.gridContainer}>
                <View style={styles.gridColumn}>
                  <Text style={styles.subHeader}>Assets Details (A):</Text>
                  {[
                    'Savings in Bank',
                    'Immovable Properties/Assets with Current Value',
                    'Deposits in Banks',
                    'Investments in Shares/Mutual Funds/Others',
                    'LIC Policies with Sum Assured, Date of Maturity & Surrender Value',
                  ].map((item) => (
                    <Text key={item} style={styles.gridItem}>• {item}</Text>
                  ))}
                </View>
                <View style={styles.gridColumn}>
                  <Text style={styles.subHeader}>Liabilities Details (B):</Text>
                  {[
                    'Borrowings from Banks/Others with Present Outstanding Balance',
                    'Liabilities with Employer with Present Outstanding Balance',
                    'Liabilities with Others with Present Outstanding Balance',
                  ].map((item) => (
                    <Text key={item} style={styles.gridItem}>• {item}</Text>
                  ))}
                </View>
              </View>
              <Text style={styles.listItem}>
                • The Bank Officer evaluates the above assets and liabilities of the Applicant / Co-applicant / Co-obligant / Guarantor and captures the same in LOS and arrives at the net worth of the parties (A-B).
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
Customer IDs created and linked to Proposed Loan
Proposed Asset details captured in LOS
  |
  v
Bank Officer checks primary customer eligibility in LOS
  |
  v
Bank Officer creates and links Customer IDs for:
- Co-applicant
- Co-obligant
- Guarantor
  |
  v
Bank Officer initiates evaluation of Assets & Liabilities
  |
  v
Bank Officer enters Assets & Liabilities details in LOS:
- Assets (A):
  - Savings in Bank
  - Immovable Properties/Assets (Current Value)
  - Deposits in Banks
  - Investments (Shares/Mutual Funds/Others)
  - LIC Policies (Sum Assured, Maturity, Surrender Value)
- Liabilities (B):
  - Borrowings (Banks/Others, Outstanding Balance)
  - Liabilities with Employer (Outstanding Balance)
  - Liabilities with Others (Outstanding Balance)
  |
  v
Bank Officer evaluates and captures in LOS:
- Net Worth = Assets (A) - Liabilities (B)
  |
  v
Proceed to Appraisal of Proposed Loan
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
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
    marginVertical: 10,
    gap: 10,
  },
  gridColumn: {
    width: Dimensions.get('window').width * 0.42,
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

export default NetWorthAnalysis;