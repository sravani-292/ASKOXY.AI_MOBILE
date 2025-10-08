import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Icon from '@expo/vector-icons';
import styles from './Styles';

const System_CapturingAssetDetails = () => {
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
        <Text style={styles.h1}>Capturing Proposed Asset Details in LOS</Text>
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
              This use case describes how a Bank Officer captures Proposed Asset details in the Loan Origination System (LOS) based on the applicant’s loan application form. These asset details are essential for further appraisal, loan assessment, and sanction processes.
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
                  <Text style={styles.listItem}>• Bank Officer</Text>
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
                <Text style={styles.bold}>User Action:</Text> Bank Officer initiates asset entry after linking Customer ID to Loan Product.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS opens the Proposed Asset Details form.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer reviews loan application for asset-related data.{"\n"}
                <Text style={styles.bold}>System Response:</Text> N/A (Manual review step).
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer enters loan type and asset type.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS validates allowed loan and asset types.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer inputs purpose of loan and asset cost.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System captures and stores entries.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer enters total purchase price, incidental cost, and other cost (if any).{"\n"}
                <Text style={styles.bold}>System Response:</Text> System calculates total cost if configured.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer provides market value and loan outstanding (for refinance).{"\n"}
                <Text style={styles.bold}>System Response:</Text> System stores financial attributes.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> For home loans: Officer fills in address, land area, built-up area, stage of construction.{"\n"}
                <Text style={styles.bold}>System Response:</Text> Conditional fields displayed by LOS based on loan type.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer completes and saves the record.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS validates completeness and saves asset details.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer proceeds to check proposed loan limit.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System redirects to proposed loan limit check.
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
                  <Text style={styles.listItem}>• Customer ID exists and is linked to a Loan Product</Text>
                  <Text style={styles.listItem}>• Loan application form is available with proposed asset details</Text>
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
                  <Text style={styles.listItem}>• Proposed Asset details are captured and saved in LOS</Text>
                  <Text style={styles.listItem}>• Workflow proceeds to check proposed loan limit</Text>
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
              Customer ID Linked → Asset Details Entered → Saved → Proceed to Proposed Limit Check
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
              <Text style={styles.listItem}>• Refinance Loan: Enter loan outstanding and market value</Text>
              <Text style={styles.listItem}>• Home Loan: Enter address, land area, built-up area, and stage of construction</Text>
              <Text style={styles.listItem}>• Non-Home Loan: Skip address and construction fields</Text>
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
              <Text style={styles.listItem}>• Missing mandatory fields: Error shown, form not submitted</Text>
              <Text style={styles.listItem}>• Invalid loan/asset type: Validation error displayed</Text>
              <Text style={styles.listItem}>• Asset cost exceeds predefined limit: System alerts officer</Text>
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
              Start → [Link Customer ID to Loan Product] → [Initiate Asset Details Entry] → [Enter General Asset Info] → [Enter Cost and Market Info] → [Enter Home Loan Info (if applicable)] → [Save] → [Proceed to Proposed Limit Check] → End
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
              <Text style={styles.listItem}>• Auto-fetch property valuation via integration with external systems</Text>
              <Text style={styles.listItem}>• GIS integration for property location validation</Text>
              <Text style={styles.listItem}>• Document upload for property proofs</Text>
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
              <Text style={styles.listItem}>• LOS Front-End (Web Form UI for Asset Details)</Text>
              <Text style={styles.listItem}>• Asset Master (Back-End Storage & Validation Engine)</Text>
              <Text style={styles.listItem}>• Product Rules Engine (For conditional fields and validation)</Text>
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
              <Text style={styles.listItem}>• All fields filled correctly: Asset details saved successfully</Text>
              <Text style={styles.listItem}>• Missing mandatory field: Error shown; form not submitted</Text>
              <Text style={styles.listItem}>• Refinance selected: Loan Outstanding field is visible and required</Text>
              <Text style={styles.listItem}>• Home loan selected: Address, area, stage fields are shown</Text>
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
              <Text style={styles.listItem}>• Ensure responsive form layout for all modules</Text>
              <Text style={styles.listItem}>• Mandatory field logic must be aligned with product type</Text>
              <Text style={styles.listItem}>• Field-level audit trail enabled for compliance</Text>
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
              <Text style={styles.listItem}><Text style={styles.bold}>Squad:</Text> LOS Asset Management</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Product Owner:</Text> Mani - Dev (lead)</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Git Repo:</Text> /los-core/asset-capture</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Jira Reference:</Text> LOS-2153</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default System_CapturingAssetDetails