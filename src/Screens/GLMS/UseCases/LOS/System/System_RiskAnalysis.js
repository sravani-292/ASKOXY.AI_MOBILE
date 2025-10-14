import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Icon from '@expo/vector-icons';
import styles from './Styles';
import ImageModal from '../../ImageModal';
const System_RiskAnalysis = () => {
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
        <Text style={styles.h1}>Risk Analysis in LOS</Text>
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
              Risk Analysis in the Loan Origination System (LOS) evaluates a customer’s creditworthiness by assessing financial, employment, personal, and security information. The purpose is to assign a risk rating score to determine loan eligibility and facilitate uniform loan appraisal processes.
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
                  <Text style={styles.listItem}>• Bank Officer (Customer-facing)</Text>
                  <Text style={styles.listItem}>• Loan Origination System (LOS) (System role)</Text>
                  <Text style={styles.listItem}>• Risk Engine Module (System role)</Text>
                  <Text style={styles.listItem}>• External Verification Agencies (Legal, Technical, Financial, Employment checks)</Text>
                  <Text style={styles.listItem}>• Core Banking System (for data integration and validation)</Text>
                </View>
              </View>
              <View>
                <Text style={styles.h3}>Software Stakeholders</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• API Developers</Text>
                  <Text style={styles.listItem}>• QA Team</Text>
                  <Text style={styles.listItem}>• CloudOps</Text>
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
                <Text style={styles.bold}>User Action:</Text> Bank Officer selects a loan application with linked Customer ID.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS fetches all customer and loan details.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer requests Legal/Technical/Employment/Financial verification.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System routes requests to respective departments or integrated APIs.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer enters/updates data from received reports.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS stores and confirms all relevant verification inputs.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer initiates risk analysis.{"\n"}
                <Text style={styles.bold}>System Response:</Text> Risk Engine calculates risk rating based on parameters and weightages.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer reviews calculated risk score.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System displays recommended risk category and allows manual comments.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer submits final risk analysis.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS updates the loan record with finalized risk score.
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
                  <Text style={styles.listItem}>• Customer ID created and linked to loan account</Text>
                  <Text style={styles.listItem}>• Complete capture of asset, liabilities, proposed loan limits, and details of co-applicants/guarantors</Text>
                  <Text style={styles.listItem}>• Appraisal or Process Note generated</Text>
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
                  <Text style={styles.listItem}>• Risk rating score computed and categorized</Text>
                  <Text style={styles.listItem}>• Risk data stored in LOS</Text>
                  <Text style={styles.listItem}>• Loan progresses to Assessment stage</Text>
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
              Login → Select Loan App → Submit for Verifications → Auto Score → Submit Risk → Proceed to Loan Assessment
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
              <Text style={styles.listItem}>• Assisted Mode via branch login</Text>
              <Text style={styles.listItem}>• API-driven automation by backend risk rules engine</Text>
              <Text style={styles.listItem}>• Self-service dashboards for status tracking</Text>
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
              <Text style={styles.listItem}>• Missing reports from Legal/Technical/Financial agency</Text>
              <Text style={styles.listItem}>• Invalid or incomplete customer data</Text>
              <Text style={styles.listItem}>• Risk engine timeout or API failure</Text>
              <Text style={styles.listItem}>• Manual override required due to risk score anomalies</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('activityDiagram')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="format-list-bulleted" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>User Activity Diagram (Simplified Flow)</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.activityDiagram ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.activityDiagram && (
            <Text style={styles.paragraph}>
              Start → [Select Loan Application] → [Fetch Customer Details] → [Trigger Verifications] → [Receive Reports] → [Run Risk Engine] → [View & Submit Risk] → End
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
              <Text style={styles.listItem}>• Integration with Credit Bureau APIs for auto pull of credit history</Text>
              <Text style={styles.listItem}>• ML-based predictive scoring engine</Text>
              <Text style={styles.listItem}>• Risk score visualization graphs</Text>
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
              <Text style={styles.listItem}><Text style={styles.bold}>UI Screens:</Text> Risk Analysis, Loan Summary, Report Uploads</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>APIs:</Text> Verification APIs, Risk Engine API</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>DB Tables:</Text> Customer, Loan Account, Risk Score</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Message Queues:</Text> Report Triggers</Text>
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
              <Text style={styles.listItem}><Text style={styles.bold}>Functional:</Text> Risk score calculation, data fetch</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Edge:</Text> Missing/incorrect report values</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Negative:</Text> Fail with missing customer ID</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Integration:</Text> APIs for report fetching</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Performance:</Text> Handle concurrent requests for 1000+ officers</Text>
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
              <Text style={styles.listItem}>• Cloud-based deployment of LOS modules</Text>
              <Text style={styles.listItem}>• Feature flags for Risk Scoring toggle</Text>
              <Text style={styles.listItem}>• Daily batch run for score re-evaluation</Text>
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
              <Text style={styles.listItem}><Text style={styles.bold}>Squad:</Text> LOS Risk Analysis Team</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Contact:</Text> Rahul Sharma (PM), Archana Desai (Lead Dev)</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Jira:</Text> RSK-1083</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Repo:</Text> gitlab.com/bankLOS/risk-analysis</Text>
              <ImageModal imageSource={'https://i.ibb.co/27bX7GGK/15.png'}/>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default System_RiskAnalysis;