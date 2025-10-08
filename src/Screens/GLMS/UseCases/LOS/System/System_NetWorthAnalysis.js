import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Icon from '@expo/vector-icons';
import styles from './Styles';

const System_NetWorthAnalysis = () => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    actors: true,
    userActions: true,
    preconditions: true,
    postconditions: true,
    normalFlow: true,
    alternativeFlows: true,
    exceptionFlows: true,
    dataInputs: true,
    outputs: true,
    systemComponents: true,
    testScenarios: true,
    nextStep: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ScrollView style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.h1}>Evaluating the Net Worth of the Parties in LOS</Text>
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
              This use case describes the process by which a Bank Officer evaluates the net worth of the applicant, co-applicant(s), co-obligant(s), and guarantor(s) in the Loan Origination System (LOS). The system evaluates the assets and liabilities of the parties involved to calculate their net worth, which is then used for loan assessment.
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
                <Text style={styles.h3}>Supporting Systems</Text>
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
                <Text style={styles.bold}>User Action:</Text> Officer verifies Customer ID and links Co-applicant, Co-obligant, and Guarantor to the proposed loan.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS links IDs and displays relevant details.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer initiates the process for evaluating net worth.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS presents forms for Assets & Liabilities data.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer enters the Asset details for the applicant, co-applicant, co-obligant, and guarantor.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System stores data in LOS.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer enters the Liability details for the applicant, co-applicant, co-obligant, and guarantor.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System stores data in LOS.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer submits the form.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS calculates the net worth (Assets - Liabilities).
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> System displays the calculated net worth of all parties.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS displays net worth summary.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer captures the net worth details into the LOS.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System stores the calculated net worth for further appraisal.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Proceed to the next workflow step (Appraisal of the loan).{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS prepares for the next workflow.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.grid}>
            <View style={styles.subSection}>
              <TouchableOpacity style={styles.button} onPress={() => toggleSection('preconditions')}>
                <View style={styles.buttonContent}>
                  <Icon.MaterialCommunityIcons name="check-circle" size={20} color="#16a34a" />
                  <Text style={styles.sectionTitle}>Preconditions</Text>
                </View>
                <Icon.MaterialCommunityIcons
                  name={expandedSections.preconditions ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#4b5563"
                />
              </TouchableOpacity>
              {expandedSections.preconditions && (
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Customer ID and Co-applicant/Co-obligant/Guarantor IDs exist and are linked to the proposed loan</Text>
                  <Text style={styles.listItem}>• Proposed Asset details are already captured in the LOS</Text>
                </View>
              )}
            </View>
            <View style={styles.subSection}>
              <TouchableOpacity style={styles.button} onPress={() => toggleSection('postconditions')}>
                <View style={styles.buttonContent}>
                  <Icon.MaterialCommunityIcons name="check-circle" size={20} color="#16a34a" />
                  <Text style={styles.sectionTitle}>Post Conditions</Text>
                </View>
                <Icon.MaterialCommunityIcons
                  name={expandedSections.postconditions ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#4b5563"
                />
              </TouchableOpacity>
              {expandedSections.postconditions && (
                <View style={styles.list}>
                  <Text style={styles.listItem}>• The net worth of the applicant, co-applicant, co-obligant, and guarantor is calculated and saved</Text>
                  <Text style={styles.listItem}>• The system is ready for further loan appraisal</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('normalFlow')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="format-list-bulleted" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Normal Flow</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.normalFlow ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.normalFlow && (
            <Text style={styles.monoText}>
{`
Start
  |
  v
Link Customer IDs
  |
  v
Initiate Net Worth Evaluation
  |
  v
Enter Assets Details
  |
  v
Enter Liabilities Details
  |
  v
Submit Form
  |
  v
System Calculates Net Worth
  |
  v
Display Net Worth Summary
  |
  v
Capture Data in LOS
  |
  v
Proceed to Loan Appraisal
  |
  v
End
`}
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
              <Text style={styles.listItem}><Text style={styles.bold}>Missing Asset or Liability data:</Text> System prompts user to fill all required fields.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Assets and Liabilities not balanced:</Text> System flags an alert for incomplete data.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Multiple guarantors:</Text> Net worth calculated for each and displayed separately.</Text>
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
              <Text style={styles.listItem}><Text style={styles.bold}>Invalid or missing Customer ID:</Text> System throws an error message.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Insufficient data on assets or liabilities:</Text> System prevents calculation and prompts user for completion.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Inconsistent financial data:</Text> System flags potential discrepancies and asks for verification.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('dataInputs')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="information-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Data Inputs Required</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.dataInputs ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.dataInputs && (
            <View style={styles.grid}>
              <View>
                <Text style={styles.h3}>Assets Details</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Savings in Bank</Text>
                  <Text style={styles.listItem}>• Immovable Properties/Assets with current value</Text>
                  <Text style={styles.listItem}>• Deposits in Banks</Text>
                  <Text style={styles.listItem}>• Investments in shares/Mutual Funds/others</Text>
                  <Text style={styles.listItem}>• LIC Policies with Sum Assured, Date of Maturity & Surrender Value</Text>
                </View>
              </View>
              <View>
                <Text style={styles.h3}>Liabilities Details</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Borrowings from the Banks/others with the present outstanding balance</Text>
                  <Text style={styles.listItem}>• Liabilities with the employer with the present outstanding balance</Text>
                  <Text style={styles.listItem}>• Liabilities with others with the present outstanding balance</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('outputs')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="information-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Outputs / System Actions</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.outputs ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.outputs && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• Calculated Net Worth for Applicant, Co-applicant, Co-obligant, and Guarantor (Assets - Liabilities)</Text>
              <Text style={styles.listItem}>• Display of Net Worth summary for all parties</Text>
              <Text style={styles.listItem}>• Captured Net Worth data stored in LOS</Text>
              <Text style={styles.listItem}>• Message to proceed to loan appraisal workflow</Text>
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
              <Text style={styles.listItem}>• LOS UI (Net Worth Input Forms)</Text>
              <Text style={styles.listItem}>• Asset & Liability Calculation Engine</Text>
              <Text style={styles.listItem}>• Business Rule Service (validates asset/liability values)</Text>
              <Text style={styles.listItem}>• Data Store (for storing Net Worth data)</Text>
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
              <Text style={styles.listItem}>• Complete Assets and Liabilities entered: Net Worth calculated and saved successfully</Text>
              <Text style={styles.listItem}>• Missing assets or liabilities data: Error preventing submission and prompting for missing fields</Text>
              <Text style={styles.listItem}>• Multiple guarantors with data: System calculates individual net worth for each party</Text>
              <Text style={styles.listItem}>• Inconsistent data in assets/liabilities: System flags discrepancy for further verification</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('nextStep')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="chevron-right" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Next Step in Workflow</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.nextStep ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.nextStep && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• Proceed with Appraisal of the proposed loan, using the calculated net worth as one of the evaluation parameters</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default System_NetWorthAnalysis;