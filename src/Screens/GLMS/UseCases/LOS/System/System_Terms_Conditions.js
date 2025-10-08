import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import * as Icon from '@expo/vector-icons';
import styles from './Styles'

const System_Terms_Conditions = () => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    actors: true,
    userActions: true,
    precondition: true,
    postcondition: true,
    stp: true,
    alternativeFlows: true,
    exceptionFlows: true,
    activityDiagram: true,
    parkingLot: true,
    systemComponents: true,
    testScenarios: true,
    infra: true,
    devTeam: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ScrollView style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.h1}>Terms & Conditions in LOS</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('description')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="information-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.description ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.description && (
            <Text style={styles.paragraph}>
              This use case outlines the process where the Bank Officer initiates, customizes, and finalizes the Terms & Conditions (T&C) for a proposed loan after completing customer and loan data entry. The Loan Origination System (LOS) assists by presenting default T&C based on product type and allows for addition, deletion, and modification before proceeding to recommendations.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('actors')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="account-group" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Actors</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.actors ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.actors && (
            <View style={styles.grid}>
              <View>
                <Text style={styles.h3}>Primary Actor</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Bank Officer - Reviews, customizes, and finalizes T&C</Text>
                </View>
              </View>
              <View>
                <Text style={styles.h3}>System Actors</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Loan Origination System (LOS)</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('userActions')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="chevron-right" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>User Actions & System Responses</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.userActions ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.userActions && (
            <View style={styles.list}>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Bank Officer initiates the T&C entry for the proposed loan.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS displays a list of default (generic/product-specific) T&C.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer reviews the listed T&C.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS provides interface to edit/delete existing T&C.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer modifies or deletes default T&C if needed.{"\n"}
                <Text style={styles.bold}>System Response:</Text> Changes are reflected immediately in the T&C section.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer adds any additional/loan-specific T&C.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System updates Appraisal Note/Process Note accordingly.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer finalizes and saves the complete T&C.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS validates and stores the finalized T&C.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer proceeds to the next stage (recommendation submission).{"\n"}
                <Text style={styles.bold}>System Response:</Text> System allows continuation in the workflow.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.grid}>
            <View style={styles.subSection}>
              <TouchableOpacity style={styles.button} onPress={() => toggleSection('precondition')}>
                <View style={styles.buttonContent}>
                  <Icon.MaterialCommunityIcons name="check-circle" size={20} color="#16a34a" />
                  <Text style={styles.sectionTitle}>Precondition</Text>
                </View>
                <Icon.MaterialCommunityIcons
                  name={expandedSections.precondition ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#4b5563"
                />
              </TouchableOpacity>
              {expandedSections.precondition && (
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Customer ID and Loan Account are created and linked</Text>
                  <Text style={styles.listItem}>• All required customer and financial data have been entered in LOS</Text>
                  <Text style={styles.listItem}>• Appraisal/Process note is generated</Text>
                  <Text style={styles.listItem}>• Risk Analysis and Loan Assessment completed</Text>
                </View>
              )}
            </View>
            <View style={styles.subSection}>
              <TouchableOpacity style={styles.button} onPress={() => toggleSection('postcondition')}>
                <View style={styles.buttonContent}>
                  <Icon.MaterialCommunityIcons name="check-circle" size={20} color="#16a34a" />
                  <Text style={styles.sectionTitle}>Post Condition</Text>
                </View>
                <Icon.MaterialCommunityIcons
                  name={expandedSections.postcondition ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#4b5563"
                />
              </TouchableOpacity>
              {expandedSections.postcondition && (
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Finalized Terms & Conditions are saved in LOS</Text>
                  <Text style={styles.listItem}>• Appraisal/Process Note is updated with T&C</Text>
                  <Text style={styles.listItem}>• Workflow proceeds to recommendation stage</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('stp')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="file-document" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Straight Through Process (STP)</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.stp ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.stp && (
            <Text style={styles.paragraph}>
              Default T&C → Review/Edit → Finalize → Proceed to Recommendation
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('alternativeFlows')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="chevron-right" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Alternative Flows</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.alternativeFlows ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.alternativeFlows && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• Bank Officer skips deletion/modification if all T&C are valid</Text>
              <Text style={styles.listItem}>• Only additional T&C are added without touching defaults</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('exceptionFlows')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="alert-circle" size={20} color="#dc2626" />
              <Text style={styles.sectionTitle}>Exception Flows</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.exceptionFlows ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.exceptionFlows && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• System fails to load default T&C → Error message shown</Text>
              <Text style={styles.listItem}>• Bank Officer attempts to proceed without saving T&C → Validation error</Text>
              <Text style={styles.listItem}>• Invalid format or missing mandatory T&C → System blocks progression</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('activityDiagram')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="format-list-bulleted" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>User Activity Diagram (Flowchart)</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.activityDiagram ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.activityDiagram && (
            <Text style={styles.paragraph}>
              Start → [Initiate T&C Entry in LOS] → [System Displays Default T&C] → [Officer Reviews and Edits/Deletes T&C] → [Officer Adds Additional T&C if Required] → [Finalize and Save T&C] → [Proceed to Recommendation] → End
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('parkingLot')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="information-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Parking Lot (Future Enhancements)</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.parkingLot ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.parkingLot && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• Maintain version control of T&C history</Text>
              <Text style={styles.listItem}>• Enable digital acceptance of T&C by customer</Text>
              <Text style={styles.listItem}>• Auto-suggestion of T&C based on customer risk profile</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('systemComponents')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="server" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>System Components Involved</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.systemComponents ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.systemComponents && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• LOS Web Interface for T&C Management</Text>
              <Text style={styles.listItem}>• T&C Rules Engine (for product-specific clauses)</Text>
              <Text style={styles.listItem}>• Workflow Engine</Text>
              <Text style={styles.listItem}>• Appraisal Note Generator</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('testScenarios')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="code-braces" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Test Scenarios</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.testScenarios ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.testScenarios && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• Bank Officer modifies and saves T&C successfully</Text>
              <Text style={styles.listItem}>• Additional T&C added and visible in Appraisal Note</Text>
              <Text style={styles.listItem}>• Bank Officer tries to proceed without saving - error shown</Text>
              <Text style={styles.listItem}>• T&C module fails to load defaults - error logged and notified</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('infra')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="server" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Infra & Deployment Notes</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.infra ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.infra && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• Ensure product-type mappings for T&C are current</Text>
              <Text style={styles.listItem}>• T&C editor must be role-based (Bank Officer only)</Text>
              <Text style={styles.listItem}>• Ensure audit trail of T&C edits for compliance</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('devTeam')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="git" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Dev Team Ownership</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.devTeam ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.devTeam && (
            <View style={styles.list}>
              <Text style={styles.listItem}><Text style={styles.bold}>Squad:</Text> LOS Documentation & Workflow</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Contact:</Text> Product Owner - LOS Core</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Git Repo:</Text> /los-core/terms-conditions-module</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Jira Ref:</Text> LOS-2112</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default System_Terms_Conditions;


