import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageModal from '../../ImageModal';
const CaptureAssetDetails = () => {
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
          Workflow for Capturing Proposed Asset Details
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
              The Bank Officer captures the Proposed Asset details in LOS to facilitate further assessment and processing.
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
              • The Bank Officer captures the Proposed Asset details in the LOS for further assessment & process.
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
            <Text style={styles.listItem}>• Customer ID has already been created.</Text>
            <Text style={styles.listItem}>• Customer ID linked to the Loan Product.</Text>
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
            <Text style={styles.listItem}>• Proposed Asset details captured in LOS.</Text>
            <Text style={styles.listItem}>• The Bank Officer can check the proposed limit.</Text>
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
                • Once the Customer ID is linked to the Loan Product, the Bank Officer initiates the capturing of Proposed Asset details in LOS.
              </Text>
              <Text style={styles.listItem}>
                • The Bank Officer checks the application form for the Purpose of the loan and Proposed Asset details.
              </Text>
              <Text style={styles.listItem}>
                • The Bank Officer captures the Proposed Asset details in LOS, including:
              </Text>
              <View style={styles.gridContainer}>
                <View style={styles.gridColumn}>
                  {['Loan Type', 'Type of Asset', 'Purpose of Loan', 'Asset Cost', 'Total Purchase Price of the Asset'].map((item) => (
                    <Text key={item} style={styles.gridItem}>• {item}</Text>
                  ))}
                </View>
                <View style={styles.gridColumn}>
                  {['Incidental Cost (if any)', 'Other Cost (if any)', 'Market Value of the Property', 'Loan Outstanding (for refinance)'].map((item) => (
                    <Text key={item} style={styles.gridItem}>• {item}</Text>
                  ))}
                </View>
                <View style={styles.gridColumn}>
                  {['Address of the Property (for home loan)', 'Area of Land (for home loan)', 'Built-up Area (for home loan)', 'Stage of Construction (for home loan)'].map((item) => (
                    <Text key={item} style={styles.gridItem}>• {item}</Text>
                  ))}
                </View>
              </View>
              <Text style={styles.listItem}>
                • Once the above details are captured, the Bank Officer saves the record and proceeds further for checking the proposed limit/loan.
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
Customer ID created
  |
  v
Customer ID linked to Loan Product
  |
  v
Bank Officer initiates capturing of Proposed Asset details in LOS
  |
  v
Bank Officer checks application form for:
- Purpose of Loan
- Proposed Asset details
  |
  v
Bank Officer captures Proposed Asset details in LOS:
- Loan Type
- Type of Asset
- Purpose of Loan
- Asset Cost
- Total Purchase Price
- Incidental Cost (if any)
- Other Cost (if any)
- Market Value of Property
- Loan Outstanding (for refinance)
- Address of Property (for home loan)
- Area of Land (for home loan)
- Built-up Area (for home loan)
- Stage of Construction (for home loan)
  |
  v
Bank Officer saves record in LOS
  |
  v
Proceed to check proposed loan limit
  |
  v
End
`}
            </Text>
            <ImageModal imageSource={'https://i.ibb.co/nMntMRSG/caparing-proposed-asset-details.png'}/>

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

export default CaptureAssetDetails;