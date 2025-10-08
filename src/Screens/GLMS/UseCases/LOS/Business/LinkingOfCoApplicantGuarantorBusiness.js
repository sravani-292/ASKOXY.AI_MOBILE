import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const LinkingOfCoApplicantGuarantorBusiness = () => {
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
          LOS Workflow for Linking of Co-Applicant/Co-Obligant/Guarantor
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
              After creating and linking a Customer ID to a loan product, the Bank Officer links Co-applicants, Co-obligants, or Guarantors to the proposed loan before appraising the loan proposal.
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
          <Text style={styles.text}>
            The user links Co-applicant/Co-obligant/Guarantors to the proposed loan of the customer.
          </Text>
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
            <Text style={styles.listItem}>1. Customer ID and linking to the loan product are completed.</Text>
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
            <Text style={styles.listItem}>1. Co-applicant/Co-obligant/Guarantor particulars are updated.</Text>
            <Text style={styles.listItem}>2. Customer IDs for Co-applicant/Co-obligant/Guarantor are created.</Text>
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
              <Text style={styles.listItem}>• Customer submits the loan application with required documents.</Text>
              <Text style={styles.listItem}>• Bank Officer verifies documents, requesting corrections if needed.</Text>
              <Text style={styles.listItem}>• Upon verification, issues acknowledgment and initiates Customer Creation.</Text>
              <Text style={styles.listItem}>• Captures customer details (Personal, Communication, Employment, Income) and links in LOS for Customer ID creation.</Text>
              <Text style={styles.listItem}>• Links Customer ID to the proposed loan product and asset details.</Text>
              <Text style={styles.listItem}>• Creates Customer IDs for Co-applicant(s)/Co-obligant(s)/Guarantor(s).</Text>
            </View>
            <Text style={styles.subHeader}>Personal Details</Text>
            <View style={styles.grid}>
              {[
                'First Name',
                'Middle Name',
                'Last Name',
                'Father Name',
                'Date of Birth',
                'Age',
                'Gender',
                'Marital Status',
                'Nominee Name',
                'Nominee Relation',
              ].map((item) => (
                <Text key={item} style={styles.gridItem}>• {item}</Text>
              ))}
            </View>
            <Text style={styles.subHeader}>Communication Details</Text>
            <View style={styles.grid}>
              {[
                'Phone Number',
                'Mobile Number',
                'Email ID',
                'Residence Address',
                'Office Address',
                'Permanent Address',
                'District',
                'State',
              ].map((item) => (
                <Text key={item} style={styles.gridItem}>• {item}</Text>
              ))}
            </View>
            <Text style={styles.subHeader}>Employment Details</Text>
            <View style={styles.grid}>
              {[
                'Employment Type',
                'Company Name',
                'Designation',
                'Office Address',
                'Experience Years',
                'Experience Months',
              ].map((item) => (
                <Text key={item} style={styles.gridItem}>• {item}</Text>
              ))}
            </View>
            <Text style={styles.subHeader}>Income & Expenses Details</Text>
            <View style={styles.grid}>
              {[
                'Monthly Income',
                'Monthly Expenses',
                'EMI Payment',
              ].map((item) => (
                <Text key={item} style={styles.gridItem}>• {item}</Text>
              ))}
            </View>
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
Customer submits loan application + documents
  |
  v
Bank Officer verifies documents
  |                           Yes
  v----------------------------> Any discrepancies?
  |                                   |
  | No                                v
  v                             Request customer for details/documents
Issue acknowledgement                 |
  |                                   v
  v                             Documents corrected
Initiate Customer Creation           
  |                                   
  v                                 
Capture Customer Details:
- Personal (Name, DOB, PAN, etc.)
- Communication (Address, Phone, Email)
- Employment (Company, Designation, etc.)
- Income & Expenses (Income, Savings, etc.)
  |
  v
Link Customer ID to Loan Product + Asset Details
  |
  v
Create Customer IDs for Co-applicant/Co-obligant/Guarantor
  |
  v
Capture Co-applicant Details:
- Personal (Name, DOB, PAN, etc.)
- Communication (Address, Phone, Email)
- Employment (Company, Designation, etc.)
- Income & Expenses (Income, Savings, etc.)
- Assets & Liabilities (Net Worth)
  |
  v
Save Co-applicant Customer IDs
  |
  v
Link Co-applicant to Loan Application:
- Select Type (Co-applicant/Co-obligant/Guarantor)
- Customer ID
- Name
- Relationship
- Include Income
- Remarks
  |
  v
Save Linking Details
  |
  v
Proceed with Loan Details Capture
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

export default LinkingOfCoApplicantGuarantorBusiness;