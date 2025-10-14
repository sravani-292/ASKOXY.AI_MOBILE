import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageModal from '../../ImageModal';
const LinkingOfCustomerIdToLoanBusiness = () => {
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
          LOS Workflow for Linking of Customer ID to the Loan Product
        </Text>
      </View>

      {/* Overview */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('overview')}
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
              Once the Customer ID is created, the Bank Officer links it to the respective Loan Product before appraising the loan proposal.
            </Text>
          </View>
        )}
      </View>

      {/* Actors */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('actors')}
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
          <Text style={styles.text}>User (Bank Officer)</Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('actions')}
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
            <Text style={styles.listItem}>• Links the Customer ID to the Loan product.</Text>
            <Text style={styles.listItem}>
              • Enters customer details (personal, employment, income, loan, repayment period, security, credit report) to generate and forward the loan proposal for sanction/approval.
            </Text>
          </View>
        )}
      </View>

      {/* Preconditions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('preconditions')}
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
            <Text style={styles.listItem}>1. Customer ID has already been created.</Text>
            <Text style={styles.listItem}>2. All required documents for the proposed loan are submitted.</Text>
          </View>
        )}
      </View>

      {/* Post Conditions */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('postconditions')}
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
            <Text style={styles.listItem}>1. The Customer ID is linked to a particular Loan account.</Text>
            <Text style={styles.listItem}>2. Proposed asset particulars are updated for the loan.</Text>
          </View>
        )}
      </View>

      {/* Workflow */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('workflow')}
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
                • After creating or fetching the Customer ID from CBS for existing customers, the Bank Officer initiates linking to a loan product.
              </Text>
              <Text style={styles.listItem}>• Checks the application for the loan's purpose.</Text>
              <Text style={styles.listItem}>• Selects the appropriate loan product in LOS based on the purpose.</Text>
              <Text style={styles.listItem}>• Enters the following details in LOS:</Text>
            </View>
            <Text style={styles.subHeader}>Loan Product Details</Text>
            <View style={styles.grid}>
              {[
                'Loan Amount Requested',
                'Project Cost',
                'Interest Type',
                'Interest Rate',
                'Initial Holiday Period',
                'Loan Period',
                'Periodicity of Installments',
                '% of Margin Required',
                'Margin Offered by Customer',
                'Purpose of Loan',
              ].map((item) => (
                <Text key={item} style={styles.gridItem}>• {item}</Text>
              ))}
            </View>
            <Text style={styles.text}>
              The Bank Officer provides a brief description of the loan, considering Income & Expenditure, Repayment Capacity, and other parameters.
            </Text>
            <Text style={styles.text}>
              The record is saved, completing the linking of the Customer ID with the Loan Product.
            </Text>
          </View>
        )}
      </View>

      {/* Flowchart */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('flowchart')}
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
Customer ID created or fetched from CBS
  |
  v
Bank Officer initiates linking process
  |
  v
Check loan application for purpose
  |
  v
Select Loan Product in LOS
  |
  v
Enter Loan Product Details:
- Loan Amount Requested
- Project Cost
- Interest Type
- Interest Rate
- Initial Holiday Period
- Loan Period
- Periodicity of Installments
- % of margin required
- Margin offered
- Purpose of Loan
  |
  v
Provide brief description:
- Income & Expenditure
- Repayment Capacity
- Other parameters
  |
  v
Save record
  |
  v
Customer ID linked to Loan Product
  |
  v
End
`}
            </Text>
            <ImageModal imageSource={'https://i.ibb.co/PsqpSJyK/Linking-of-customer-id-to-loan.png'}/>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
  },
  gridItem: {
    width: Dimensions.get('window').width * 0.4,
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

export default LinkingOfCustomerIdToLoanBusiness;