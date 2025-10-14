import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import ImageModal from '../../ImageModal';
const QueueCuringUseCase = ({ navigation }) => {
  const [expandedSections, setExpandedSections] = useState({
    useCaseName: true,
    actors: true,
    description: true,
    trigger: true,
    preconditions: true,
    postconditions: true,
    basicFlow: true,
    alternateFlows: true,
    exceptionFlows: true,
    businessRules: true,
    assumptions: true,
    notes: true,
    author: true,
    date: true,
    flowchart: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ScrollView style={commonStyles.container}>
      <Text style={commonStyles.heading}>Queue Curing</Text>
    
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('useCaseName')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="file-text" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Use Case Name</Text>
          </View>
          <Icon name={expandedSections.useCaseName ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.useCaseName && (
          <Text style={commonStyles.sectionContent}>Queue Curing</Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('actors')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="users" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Actor(s)</Text>
          </View>
          <Icon name={expandedSections.actors ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.actors && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>• Collections Team Member (User)</Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('description')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="info" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Description</Text>
          </View>
          <Icon name={expandedSections.description ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.description && (
          <Text style={commonStyles.sectionContent}>
            This use case describes the process of specifying curing actions for delinquent customer cases that have been classified into specific Queues based on parameters like delinquency category, trends, or demographic/financial attributes. These curing actions define the follow-up actions used by the system or manually by collectors.
          </Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('trigger')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="chevron-right" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Trigger</Text>
          </View>
          <Icon name={expandedSections.trigger ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.trigger && (
          <Text style={commonStyles.sectionContent}>
            Completion of the Beginning of Day (BOD) process and Queue definition based on classification rules.
          </Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('preconditions')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="check-circle" size={20} color="#16a34a" />
            <Text style={commonStyles.sectionTitleText}>Preconditions</Text>
          </View>
          <Icon name={expandedSections.preconditions ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.preconditions && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>• BOD process must be completed.</Text>
            <Text style={commonStyles.listItem}>• Mapping of classification rules to Queues must be done.</Text>
            <Text style={commonStyles.listItem}>• Customer data (delinquent and non-delinquent) must be available in the database.</Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('postconditions')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="check-circle" size={20} color="#16a34a" />
            <Text style={commonStyles.sectionTitleText}>Postconditions</Text>
          </View>
          <Icon name={expandedSections.postconditions ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.postconditions && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>• Curing actions are saved in the system for each Queue.</Text>
            <Text style={commonStyles.listItem}>• Delinquent cases are ready for follow-up based on defined curing actions.</Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('basicFlow')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="list" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Basic Flow</Text>
          </View>
          <Icon name={expandedSections.basicFlow ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.basicFlow && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>1. User defines the Queue by mapping classification rules with product and financier.</Text>
            <Text style={commonStyles.listItem}>2. User prioritizes the Queues to determine assignment logic.</Text>
            <Text style={commonStyles.listItem}>3. User selects the Queue and specifies the curing action.</Text>
            <Text style={commonStyles.listItem}>4. User selects the communication method (e.g., SMS, Email, Letter, Telecalling).</Text>
            <Text style={commonStyles.listItem}>5. System applies the curing actions to delinquent cases in the Queue.</Text>
            <Text style={commonStyles.listItem}>6. User saves the curing details in the system.</Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('alternateFlows')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="chevron-right" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Alternate Flow(s)</Text>
          </View>
          <Icon name={expandedSections.alternateFlows ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.alternateFlows && (
          <Text style={commonStyles.sectionContent}>None</Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('exceptionFlows')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="alert-circle" size={20} color="#dc2626" />
            <Text style={commonStyles.sectionTitleText}>Exception Flow(s)</Text>
          </View>
          <Icon name={expandedSections.exceptionFlows ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.exceptionFlows && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>• Incomplete or missing Queue-classification mappings can prevent curing setup.</Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('businessRules')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="lock" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Business Rules</Text>
          </View>
          <Icon name={expandedSections.businessRules ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.businessRules && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>• Each Queue must have a defined curing strategy.</Text>
            <Text style={commonStyles.listItem}>• Multiple communication methods can be selected for a Queue.</Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('assumptions')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="info" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Assumptions</Text>
          </View>
          <Icon name={expandedSections.assumptions ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.assumptions && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>• Classification rules and communication methods are preconfigured and available in the system.</Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('notes')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="info" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Notes</Text>
          </View>
          <Icon name={expandedSections.notes ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.notes && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>• Properly defined curing actions ensure timely and effective customer follow-up.</Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('author')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="user" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Author</Text>
          </View>
          <Icon name={expandedSections.author ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.author && (
          <Text style={commonStyles.sectionContent}>System Analyst</Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('date')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="calendar" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Date</Text>
          </View>
          <Icon name={expandedSections.date ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.date && (
          <Text style={commonStyles.sectionContent}>2025-05-03</Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity style={commonStyles.sectionButton} onPress={() => toggleSection('flowchart')}>
          <View style={commonStyles.sectionTitle}>
            <Icon name="list" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Flowchart</Text>
          </View>
          <Icon name={expandedSections.flowchart ? 'chevron-up' : 'chevron-down'} size={20} color="#4b5563" />
        </TouchableOpacity>
        {expandedSections.flowchart && (
          <View style={commonStyles.flowchartContainer}>
            <Text style={commonStyles.flowchartText}>
{`
Start
   |
   v
Define Queue
   |
   v
Set Queue Priorities
   |
   v
Specify Curing Actions
   |
   v
Select Curing Methods
   |
   v
Apply Curing Actions
   |
   v
Save Curing Details
   |
   v
End
`}
            </Text>
                        <ImageModal imageSource={'https://i.ibb.co/k2Jf7N5R/queue.jpg'}/>

          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default QueueCuringUseCase;

const commonStyles=StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  sectionContent: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 24,
  },
  list: {
    paddingLeft: 20,
  },
  listItem: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 24,
  },
  flowchartContainer: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  flowchartText: {
    color: '#374151',
    fontSize: 14,
    fontFamily: 'monospace', // May not work on all devices, but approximate
  },
  navContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  navButton: {
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 4,
    margin: 4,
  },
  navButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },

})