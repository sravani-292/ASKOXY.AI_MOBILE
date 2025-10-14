import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Dimensions
} from 'react-native';
import { 
  Info, 
  Users, 
  CheckCircle, 
  ChevronRight, 
  List, 
  ChevronDown, 
  ChevronUp,
  Repeat ,
  X
} from 'lucide-react-native';
const {height,width}=Dimensions.get('window')
const ManualReallocationUseCaseBusiness = () => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    actors: true,
    actions: true,
    preconditions: true,
    postconditions: true,
    workflow: true,
    flowchart: true,
  });
    const [isModalVisible, setIsModalVisible] = useState(false);


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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Manual Reallocation for Delinquent Customers
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.sectionsContainer}>
          {/* Overview */}
          <Section title="Overview" icon={Info} sectionKey="overview">
            <Text style={styles.text}>
              Manual reallocation is used to reallocate cases to another Collector who can handle them more effectively than the current Collector. The Collections System facilitates this through the Manual Reallocation screen. Supervisors can only reallocate cases of users reporting to them.
            </Text>
          </Section>

          {/* Actors */}
          <Section title="Actors" icon={Users} sectionKey="actors">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• User (Supervisor)</Text>
            </View>
          </Section>

          {/* Actions */}
          <Section title="Actions" icon={ChevronRight} sectionKey="actions">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>
                User can reallocate cases to another Collector who can handle them more effectively than the current Collector.
              </Text>
            </View>
          </Section>

          {/* Preconditions */}
          <Section title="Preconditions" icon={CheckCircle} sectionKey="preconditions">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Delinquent cases are classified and mapped to communication templates for auto-communication.</Text>
              <Text style={styles.bulletItem}>• Case allocation has been completed.</Text>
            </View>
          </Section>

          {/* Post Conditions */}
          <Section title="Post Conditions" icon={CheckCircle} sectionKey="postconditions">
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Delinquent case is reassigned to another Collector who can handle it more effectively than the existing Collector.</Text>
            </View>
          </Section>

          {/* Workflow */}
          <Section title="Workflow" icon={List} sectionKey="workflow">
            <View style={styles.numberedList}>
              <Text style={styles.numberedItem}>1. If allotted cases are not closed properly, the Supervisor may reallocate them to a new Collector who can handle them effectively, limited to users reporting to the Supervisor.</Text>
              <Text style={styles.numberedItem}>2. The User updates the following details before reassigning to a new Collector, if required:</Text>
              
              <View style={styles.detailsGrid}>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Loan No./Account No</Text>
                  <Text style={styles.bulletItem}>• Customer Name</Text>
                  <Text style={styles.bulletItem}>• Customer ID</Text>
                  <Text style={styles.bulletItem}>• Card No.</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Overdue Position</Text>
                  <Text style={styles.bulletItem}>• Financier</Text>
                  <Text style={styles.bulletItem}>• Financier Type (Line of Business)</Text>
                  <Text style={styles.bulletItem}>• Rule Unit Code</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.bulletItem}>• Unit Level</Text>
                  <Text style={styles.bulletItem}>• Product Type</Text>
                  <Text style={styles.bulletItem}>• Product</Text>
                  <Text style={styles.bulletItem}>• Queue</Text>
                  <Text style={styles.bulletItem}>• Branch</Text>
                </View>
              </View>

              <Text style={styles.numberedItem}>3. The system displays delinquent cases based on the defined queue.</Text>
              <Text style={styles.numberedItem}>4. The User selects delinquent cases, provides the percentage of allocation, specifies priority, and assigns them to a new Collector who handles more efficiently and reports to the Supervisor.</Text>
              <Text style={styles.numberedItem}>5. The User saves the reallocation details in the system for future reference.</Text>
            </View>
          </Section>

          {/* Flowchart */}
          <Section title="Flowchart" icon={Repeat} sectionKey="flowchart">
            <View style={styles.flowchart}>
              <Text style={styles.flowchartText}>
                Start{'\n'}
                |{'\n'}
                v{'\n'}
                Delinquent cases classified and mapped to communication templates{'\n'}
                Initial case allocation completed{'\n'}
                |{'\n'}
                v{'\n'}
                User defines delinquent cases based on allocation rules{'\n'}
                |{'\n'}
                v{'\n'}
                System displays delinquent cases by defined queue{'\n'}
                |{'\n'}
                v{'\n'}
                Cases not closed properly?{'\n'}
                |{'\n'}
                v{'\n'}
                User updates case details if required:{'\n'}
                - Loan No./Account No{'\n'}
                - Customer Name{'\n'}
                - Customer ID{'\n'}
                - Card No.{'\n'}
                - Overdue Position{'\n'}
                - Financier{'\n'}
                - Financier Type{'\n'}
                - Rule Unit Code{'\n'}
                - Unit Level{'\n'}
                - Product Type{'\n'}
                - Product{'\n'}
                - Queue{'\n'}
                - Branch{'\n'}
                |{'\n'}
                v{'\n'}
                User selects cases for reallocation{'\n'}
                |{'\n'}
                v{'\n'}
                User sets allocation percentage and priority{'\n'}
                |{'\n'}
                v{'\n'}
                User reassigns cases to new Collector who:{'\n'}
                - Handles more effectively{'\n'}
                - Reports to Supervisor{'\n'}
                |{'\n'}
                v{'\n'}
                User saves reallocation details in system{'\n'}
                |{'\n'}
                v{'\n'}
                Delinquent cases reassigned to new Collector{'\n'}
                |{'\n'}
                v{'\n'}
                End
              </Text>
               <TouchableOpacity
            style={styles.button}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.buttonText}>View Flowchart</Text>
          </TouchableOpacity>
            </View>
          </Section>
          <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <X size={22} color="black" />
            </TouchableOpacity>

            <Image
              source={{ uri: "https://i.ibb.co/RTzZPnrm/manual-recollection.png" }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>
        </View>
      </View>
    </ScrollView>
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
    minWidth: 120,
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
   button: {
    backgroundColor: "#6D28D9",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width*0.9,
    height: height/1.5,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  modalImage: {
    width: "100%",
    height: height/1.7,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
  },
});

export default ManualReallocationUseCaseBusiness;