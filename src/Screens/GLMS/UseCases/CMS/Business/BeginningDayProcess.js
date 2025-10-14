import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { 
  Info, 
  Users, 
  CheckCircle, 
  ChevronRight, 
  List, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Image } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BeginningDayProcess = () => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    actors: true,
    actions: true,
    preconditions: true,
    postconditions: true,
    workflow: true,
    flowchart: true,
  });

  const [modalVisible, setModalVisible] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const Section = ({ title, icon: Icon, children, sectionKey }) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(sectionKey)}
      >
        <View style={styles.sectionHeaderLeft}>
          <Icon size={20} color="#2563eb" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={20} color="#4b5563" />
        ) : (
          <ChevronDown size={20} color="#4b5563" />
        )}
      </TouchableOpacity>
      {expandedSections[sectionKey] && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Beginning of Day Process
            </Text>
          </View>

          {/* Content Sections */}
          <View style={styles.sectionsContainer}>
            {/* Overview */}
            <Section title="Overview" icon={Info} sectionKey="overview">
              <Text style={styles.text}>
                The Beginning of Day (BOD) process sources the Collections
                System with delinquent cases (customers unable to pay the
                contracted amount by the due date) from the Collections
                Management Application. It fetches details of both delinquent
                and non-delinquent accounts, ensuring the Collections System is
                updated daily with delinquent account data. The user must
                manually invoke this process through the Collections System.
              </Text>
            </Section>

            {/* Actors */}
            <Section title="Actors" icon={Users} sectionKey="actors">
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• User</Text>
              </View>
            </Section>

            {/* Actions */}
            <Section title="Actions" icon={ChevronRight} sectionKey="actions">
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>
                  User retrieves the details of delinquent and non-delinquent
                  customers.
                </Text>
              </View>
            </Section>

            

            {/* Preconditions */}
            <Section title="Preconditions" icon={CheckCircle} sectionKey="preconditions">
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>
                  • Details of delinquent and non-delinquent customers should be
                  available in the database.
                </Text>
              </View>
            </Section>

            {/* Post Conditions */}
            <Section title="Post Conditions" icon={CheckCircle} sectionKey="postconditions">
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>
                  • System displays details of delinquent and non-delinquent
                  customers, and the user views them.
                </Text>
              </View>
            </Section>

            {/* Workflow */}
            <Section title="Workflow" icon={List} sectionKey="workflow">
              <View style={styles.numberedList}>
                <Text style={styles.numberedItem}>1. User opens the Collections Management Application and navigates to the BOD process.</Text>
                <Text style={styles.numberedItem}>2. User enters the line of business (Credit Card, Overdraft, Finance) and initiates the BOD process.</Text>
                <Text style={styles.numberedItem}>3. System displays the following details of delinquent customers:</Text>
                
                <View style={styles.detailsGrid}>
                  <View style={styles.column}>
                    <Text style={styles.bulletItem}>• Total loan amount</Text>
                    <Text style={styles.bulletItem}>• Outstanding loan amount</Text>
                    <Text style={styles.bulletItem}>• Customer/Co-applicant/Guarantor details</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.bulletItem}>• Due date</Text>
                    <Text style={styles.bulletItem}>• Due amount</Text>
                    <Text style={styles.bulletItem}>• Customer contact details</Text>
                  </View>
                </View>

                <Text style={styles.numberedItem}>4. User checks the delinquent customers' data and proceeds to classify delinquent cases.</Text>
              </View>
            </Section>

            {/* Flowchart */}
            <Section title="Flowchart" icon={List} sectionKey="flowchart">
              <View style={styles.flowchart}>
                <Text style={styles.flowchartText}>
                  Start{'\n'}
                  |{'\n'}
                  v{'\n'}
                  Delinquent and non-delinquent customer data available in database{'\n'}
                  |{'\n'}
                  v{'\n'}
                  User opens Collections Management Application{'\n'}
                  |{'\n'}
                  v{'\n'}
                  User navigates to BOD process{'\n'}
                  |{'\n'}
                  v{'\n'}
                  User selects line of business:{'\n'}
                  - Credit Card{'\n'}
                  - Overdraft{'\n'}
                  - Finance{'\n'}
                  |{'\n'}
                  v{'\n'}
                  User initiates BOD process{'\n'}
                  |{'\n'}
                  v{'\n'}
                  System displays delinquent customer details:{'\n'}
                  - Total loan amount{'\n'}
                  - Outstanding loan amount{'\n'}
                  - Customer/Co-applicant/Guarantor details{'\n'}
                  - Due date{'\n'}
                  - Due amount{'\n'}
                  - Customer contact details{'\n'}
                  |{'\n'}
                  v{'\n'}
                  User reviews data{'\n'}
                  |{'\n'}
                  v{'\n'}
                  User proceeds to classify delinquent cases{'\n'}
                  |{'\n'}
                  v{'\n'}
                  End
                </Text>
              </View>
              

              {/* Button to open Modal */}
                <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.modalButtonText}>View Flowchart Image</Text>
              </TouchableOpacity>
            
            </Section>
            
          </View>
        </View>
      </ScrollView>

      {/* Modal for Image */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

            <ImageZoom
              cropWidth={screenWidth - 32}
              cropHeight={screenHeight / 1.7}
              imageWidth={screenWidth - 32}
              imageHeight={screenHeight / 1.7}
              pinchToZoom={true}
              enableCenterFocus={true}
            >
              <Image
                source={{ uri: 'https://i.ibb.co/TyMnqfw/beggaining-of-day-process.png' }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </ImageZoom>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    padding: 16,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  sectionsContainer: {
    gap: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sectionContent: {
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  bulletList: {
    paddingLeft: 8,
    gap: 4,
  },
  bulletItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  numberedList: {
    paddingLeft: 8,
    gap: 8,
  },
  numberedItem: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginLeft: 16,
    marginTop: 8,
  },
  column: {
    flex: 1,
    minWidth: 140,
  },
  flowchart: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  flowchartText: {
    fontSize: 12,
    color: '#374151',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  modalButton: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 600,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default BeginningDayProcess;
