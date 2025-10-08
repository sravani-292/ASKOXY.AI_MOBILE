import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Icon from '@expo/vector-icons';
import styles from './Styles';

const System_Saction_CustomerResponse = () => {
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
        <Text style={styles.h1}>Sanction Letter Generation & Customer Response in LOS</Text>
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
              This use case enables the Bank Officer to generate a Sanction or Rejection letter after the sanctioning authority’s decision and facilitates capturing the Customer’s response in the system. Based on acceptance, the process for opening the loan account is initiated in the Core Banking System (CBS).
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
                <Text style={styles.h3}>Customer-facing</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Bank Officer</Text>
                  <Text style={styles.listItem}>• Customer</Text>
                </View>
              </View>
              <View>
                <Text style={styles.h3}>System Roles & Stakeholders</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Loan Origination System (LOS)</Text>
                  <Text style={styles.listItem}>• Core Banking System (CBS)</Text>
                  <Text style={styles.listItem}>• API Developer</Text>
                  <Text style={styles.listItem}>• QA</Text>
                  <Text style={styles.listItem}>• Infra</Text>
                  <Text style={styles.listItem}>• Product Owner</Text>
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
                <Text style={styles.bold}>User Action:</Text> Bank Officer logs into LOS.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System authenticates the Bank Officer and grants access to LOS.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Loan Proposal is approved/rejected by authority.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS updates the loan proposal status to approved or rejected.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Bank Officer initiates Sanction Letter generation.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS generates a Sanction or Rejection letter based on the proposal status.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Bank Officer reviews and confirms letter contents.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS saves the confirmed letter content.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Letter is shared with Customer (email/print).{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS sends the letter via email or marks it for printing.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Customer responds with Acceptance or Rejection.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS records the Customer’s response.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> If Accepted, Bank Officer triggers Loan Account creation in CBS.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS initiates loan account creation via CBS API.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> System confirms loan account created.{"\n"}
                <Text style={styles.bold}>System Response:</Text> Status updated in LOS for tracking.
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
                  <Text style={styles.listItem}>• Loan proposal already approved/rejected by sanctioning authority</Text>
                  <Text style={styles.listItem}>• All mandatory fields and verification steps completed in LOS</Text>
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
                  <Text style={styles.listItem}>• Customer response (Accepted/Rejected) is recorded</Text>
                  <Text style={styles.listItem}>• If accepted, loan account creation is triggered in CBS</Text>
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
              Approval → Letter Generated → Shared with Customer → Response Captured → Loan Account Opened (CBS)
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
              <Text style={styles.listItem}>• Letter delivered via App/Email/Branch</Text>
              <Text style={styles.listItem}>• Customer responds online/offline</Text>
              <Text style={styles.listItem}>• Auto-scheduling for CBS integration on acceptance</Text>
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
              <Text style={styles.listItem}>• Letter not delivered (email bounce/technical issue)</Text>
              <Text style={styles.listItem}>• Customer does not respond within timeline</Text>
              <Text style={styles.listItem}>• CBS API failure during account creation</Text>
              <Text style={styles.listItem}>• Manual override required for sanction changes</Text>
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
              Start → [Loan Approved/Rejected] → [Generate Letter in LOS] → [Send to Customer] → [Capture Response] → [If Accepted → Create Loan A/C in CBS] → End
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('parkingLot')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="information-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Parking Lot</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.parkingLot ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.parkingLot && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• Option for digital signature by Customer</Text>
              <Text style={styles.listItem}>• Auto-reminders if Customer hasn’t responded</Text>
              <Text style={styles.listItem}>• Integration with customer portal for self-service</Text>
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
              <Text style={styles.listItem}>• LOS Frontend (UI)</Text>
              <Text style={styles.listItem}>• Sanction Letter Generator Module</Text>
              <Text style={styles.listItem}>• LOS DB</Text>
              <Text style={styles.listItem}>• CBS API (Loan Account Creation)</Text>
              <Text style={styles.listItem}>• Notification Service (SMS/Email)</Text>
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
              <Text style={styles.listItem}>• Sanction Letter Generated for approved proposal</Text>
              <Text style={styles.listItem}>• Letter Rejection flow</Text>
              <Text style={styles.listItem}>• Customer response recorded correctly</Text>
              <Text style={styles.listItem}>• Failure in CBS account creation</Text>
              <Text style={styles.listItem}>• Load test for bulk letter generation</Text>
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
              <Text style={styles.listItem}>• LOS-CBS API latency</Text>
              <Text style={styles.listItem}>• Email server dependency</Text>
              <Text style={styles.listItem}>• Retry logic for failed CBS integration</Text>
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
              <Text style={styles.listItem}><Text style={styles.bold}>Squad:</Text> LOS Core Processing</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Contact:</Text> LOS Module Lead</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Jira:</Text> LOS-1278</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Git Repo:</Text> /los-core/sanction-letter-service</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default System_Saction_CustomerResponse;