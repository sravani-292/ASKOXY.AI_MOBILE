import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Icon from '@expo/vector-icons';
import styles from './Styles';

const System_RepaymentSchedule = () => {
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
        <Text style={styles.h1}>Sanction of Loan in LOS</Text>
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
              This use case describes the process of loan proposal sanctioning, which includes capturing customer details, generating appraisal notes, validating the proposal through the Sanctioning Authority, and handling clarifications and decisions (approval/rejection). The final decision is recorded in the Loan Origination System (LOS), and the Bank Officer proceeds with post-sanction activities.
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
                <Text style={styles.h3}>Primary Actors</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Bank Officer - Prepares the proposal and coordinates for discrepancy resolution</Text>
                  <Text style={styles.listItem}>• Sanctioning Authority - Reviews and decides on loan proposal</Text>
                </View>
              </View>
              <View>
                <Text style={styles.h3}>System Actors</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• LOS (Loan Origination System)</Text>
                  <Text style={styles.listItem}>• Notification Service</Text>
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
                <Text style={styles.bold}>User Action:</Text> Bank Officer enters customer details.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System stores customer profile and links to loan proposal.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Bank Officer prepares loan proposal.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS calculates eligibility and proposed loan.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer prepares Appraisal Note/Process Note.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System generates draft appraisal documents.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Risk analysis and T&C are finalized and proposal is submitted.{"\n"}
                <Text style={styles.bold}>System Response:</Text> Proposal forwarded to Sanctioning Authority via workflow.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Sanctioning Authority reviews proposal.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System provides view of all notes, risks, and conditions.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> If complete, Authority approves/rejects loan.{"\n"}
                <Text style={styles.bold}>System Response:</Text> Decision updated in LOS.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> If discrepancy found, Authority comments and sends back.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System notifies Bank Officer with remarks.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Bank Officer collects additional info/reports.{"\n"}
                <Text style={styles.bold}>System Response:</Text> Updated documents uploaded in LOS.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Revised proposal resubmitted.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System notifies Sanctioning Authority.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Final review by Authority.{"\n"}
                <Text style={styles.bold}>System Response:</Text> Approves with/without conditions or rejects.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Bank Officer records final decision.{"\n"}
                <Text style={styles.bold}>System Response:</Text> Loan status updated in LOS.
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
                  <Text style={styles.listItem}>• Loan proposal is prepared and submitted</Text>
                  <Text style={styles.listItem}>• Appraisal Note/Process Note is generated</Text>
                  <Text style={styles.listItem}>• Risk Analysis and T&C are completed</Text>
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
                  <Text style={styles.listItem}>• Loan proposal is approved/rejected</Text>
                  <Text style={styles.listItem}>• Decision is recorded in LOS</Text>
                  <Text style={styles.listItem}>• Workflow proceeds to post-sanction activities</Text>
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
              Proposal Submitted → Reviewed → Approved/Rejected → Decision Recorded → Proceed to Post-Sanction
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
              <Text style={styles.listItem}>• Approval with conditions: Additional T&C added before final sanction</Text>
              <Text style={styles.listItem}>• Multi-level approval: Proposal routed to higher authority if exceeds limit</Text>
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
              <Text style={styles.listItem}>• Incomplete proposal: Returned for clarification</Text>
              <Text style={styles.listItem}>• Missing mandatory documents: Officer notified to upload</Text>
              <Text style={styles.listItem}>• Proposal rejected: Recorded with reasons</Text>
              <Text style={styles.listItem}>• System timeout during review: Session saved and resumed</Text>
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
              Start → [Customer Details Entered in LOS] → [Loan Proposal Prepared] → [Proposal Sent to Sanctioning Authority] → [Authority Reviews Proposal] → [If Discrepancy → Comments Sent to Officer → Officer Updates Info → Resubmits Proposal] → [Final Approval/Rejection] → [Decision Updated in LOS] → End
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
              <Text style={styles.listItem}>• Auto-notification to customer on sanction status</Text>
              <Text style={styles.listItem}>• Dashboard for Sanctioning Authority on pending proposals</Text>
              <Text style={styles.listItem}>• SLA tracking between Officer and Authority</Text>
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
              <Text style={styles.listItem}>• LOS UI for Bank Officer and Sanctioning Authority</Text>
              <Text style={styles.listItem}>• LOS Workflow Engine</Text>
              <Text style={styles.listItem}>• Document Upload & Versioning</Text>
              <Text style={styles.listItem}>• Notification Service (Email/Alerts)</Text>
              <Text style={styles.listItem}>• LOS Database</Text>
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
              <Text style={styles.listItem}>• Proposal successfully sanctioned</Text>
              <Text style={styles.listItem}>• Proposal rejected with comments</Text>
              <Text style={styles.listItem}>• Proposal returned for clarification and re-approved</Text>
              <Text style={styles.listItem}>• Proposal not submitted due to missing mandatory fields</Text>
              <Text style={styles.listItem}>• Failure in system notification delivery</Text>
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
              <Text style={styles.listItem}>• Proposal attachments (Appraisal note, Risk Reports) must be accessible</Text>
              <Text style={styles.listItem}>• Notification queues must be monitored for delayed message delivery</Text>
              <Text style={styles.listItem}>• Role-based access: Bank Officer cannot override Authority’s decision</Text>
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
              <Text style={styles.listItem}><Text style={styles.bold}>Squad:</Text> LOS Workflow Engine</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Contact:</Text> Process Automation Lead</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Git Repo:</Text> /los-core/loan-sanction-module</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Jira Ref:</Text> LOS-2105</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default System_RepaymentSchedule;