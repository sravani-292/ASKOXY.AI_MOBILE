import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomerIdCreation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const openModal = (content, title) => {
    setModalContent(content);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
    setModalTitle('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Customer ID Creation Workflow</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#008CBA' }]}
            onPress={() => openModal('Back End Code placeholder content', 'Back End Code View')}
          >
            <Text style={styles.buttonText}>View Back End Code</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#04AA6D' }]}
            onPress={() => openModal('Front End Code placeholder content', 'Front End Code View')}
          >
            <Text style={styles.buttonText}>View Front End Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Icon name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>{modalContent}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.sectionContent}>
          <Text style={styles.text}>
            The Loan Origination System (LOS) is a centralized web-based solution designed for processing loan applications efficiently. It supports various modules such as Retail and Corporate, ensuring uniform guidelines across the bank and streamlined electronic workflow.
          </Text>
          <Text style={styles.text}>
            Users input loan application details, and the system automatically retrieves relevant data like interest rates, margins, and product guidelines. It also generates reports such as Credit Score Sheets, Process Notes, and Sanction Letters.
          </Text>
          <Text style={styles.text}>
            Every customer is assigned a unique Customer ID, a prerequisite for any banking relationship. Customer details are captured and maintained in the Customer Master.
          </Text>
        </View>
      </View>

      {/* Actors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actors</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>• Customer</Text>
          <Text style={styles.listItem}>• Bank Officer</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.sectionContent}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Customer:</Text> Submits a completed loan application with required documents.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Bank Officer:</Text> Enters customer details into LOS to create a Customer ID.
          </Text>
        </View>
      </View>

      {/* Preconditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preconditions</Text>
        <Text style={styles.text}>
          Receipt of a completed loan application and required documents from the customer.
        </Text>
      </View>

      {/* Post Conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Post Conditions</Text>
        <Text style={styles.text}>
          Customer ID is created, enabling the Bank Officer to capture loan details in LOS.
        </Text>
      </View>

      {/* Workflow */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workflow</Text>
        <View style={styles.sectionContent}>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Customer inquires about loan processes at a bank branch.</Text>
            <Text style={styles.listItem}>• Bank Officer explains loan products and document requirements.</Text>
            <Text style={styles.listItem}>• Customer submits the loan application and documents.</Text>
            <Text style={styles.listItem}>• Bank Officer verifies documents and requests corrections if needed.</Text>
            <Text style={styles.listItem}>• Upon verification, issues an acknowledgment and initiates Customer ID creation.</Text>
            <Text style={styles.listItem}>• Captures customer details in LOS under Personal, Communication, Employment, and Income & Expenses tabs.</Text>
          </View>
          <Text style={styles.subHeader}>Personal Details</Text>
          <View style={styles.grid}>
            {[
              'First Name',
              'Middle Name',
              'Last Name',
              'Father Name',
              'Date of Birth',
              'Gender',
              'Pan No',
              'Passport Details',
              'Marital Status',
              'No of Dependents',
              'Age of Dependents',
              'Nationality',
              'Residential Status',
              'Religion',
              'Educational Qualification',
              'Earning Member in Family',
              'Length of Relationship with Bank',
              'Existing Borrower Status',
              'Staff',
              'Account No',
              'Deposits with Bank',
            ].map((item) => (
              <Text key={item} style={styles.gridItem}>• {item}</Text>
            ))}
          </View>
          <Text style={styles.subHeader}>Communication Details</Text>
          <View style={styles.grid}>
            {[
              'Current Address',
              'Current Residence Ownership',
              'Living Duration in Current Residence',
              'Permanent Address',
              'Mobile No',
              'Landline No',
              'Email ID',
            ].map((item) => (
              <Text key={item} style={styles.gridItem}>• {item}</Text>
            ))}
          </View>
          <Text style={styles.subHeader}>Employment Details</Text>
          <View style={styles.grid}>
            {[
              'Occupation',
              'Name of the Company',
              'Address of the Company',
              'Designation',
              'Department',
              'Employee No',
              'Office Phone No',
              'Ext',
              'Fax',
              'Years in Current Company',
              'Previous Employment History',
              'Total Length of Service',
            ].map((item) => (
              <Text key={item} style={styles.gridItem}>• {item}</Text>
            ))}
          </View>
          <Text style={styles.subHeader}>Income & Expenses Details</Text>
          <View style={styles.grid}>
            {[
              'Monthly Income',
              'Other Income',
              'Monthly Expenses',
              'Savings',
              'EMI Payment',
              'Stability of Income',
            ].map((item) => (
              <Text key={item} style={styles.gridItem}>• {item}</Text>
            ))}
          </View>
          <Text style={styles.text}>
            After capturing details, the Bank Officer saves the record to create the Customer ID, enabling further loan processing.
          </Text>
          <Text style={[styles.text, { fontStyle: 'italic' }]}>
            <Text style={styles.bold}>Note:</Text> Existing customer details can be fetched from the Core Banking System (CBS) using their Customer ID.
          </Text>
        </View>
      </View>

      {/* Flowchart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flowchart</Text>
        <View style={styles.flowchart}>
          <Text style={styles.flowchartText}>
            {`
Start
  |
  v
Customer enquires about loan
  |
  v
Bank Officer explains loan products & documents
  |
  v
Customer submits application + documents
  |
  v
Bank Officer verifies documents
  |
  v
Any discrepancies?
  |---Yes---> Request corrections from customer
  |
  v
Issue acknowledgement
  |
  v
Initiate Customer ID Creation
  |
  v
Capture Personal, Communication, Employment, Income/Expenses
  |
  v
Save Customer Details
  |
  v
Customer ID Created
`}
          </Text>
        </View>
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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.9,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalBody: {
    padding: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
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
  bold: {
    fontWeight: '600',
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

export default CustomerIdCreation;