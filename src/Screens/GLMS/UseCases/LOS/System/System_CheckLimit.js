import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Icon from '@expo/vector-icons';
import styles from './Styles';

const System_CheckLimit = () => {
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
        <Text style={styles.h1}>Check Limit in LOS</Text>
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
              This use case describes the process by which a Bank Officer checks the customer’s eligibility and proposed loan limit using the Loan Calculator in the Loan Origination System (LOS). The process is based on information such as income, expenditure, asset cost, loan amount, and tenure. After calculating eligibility, the proposed loan limit is recorded in the system.
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
                  <Text style={styles.listItem}>• Loan Calculator Engine</Text>
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
                <Text style={styles.bold}>User Action:</Text> Officer opens the Loan Calculator screen after asset details are captured.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS presents calculator input form.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer refers to the loan application for financial and personal details.{"\n"}
                <Text style={styles.bold}>System Response:</Text> N/A (manual lookup).
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer enters Loan Type and Purpose of Loan.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS validates loan type rules.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer enters DOB and Occupation.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS checks age eligibility.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer enters Cost of Asset and Requested Loan Amount.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS prepares to calculate LTV and eligibility.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer enters Loan Tenure and Retirement Age.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS validates tenure against retirement.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer inputs Company Details and Work Experience.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS stores employment data.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer enters Monthly Income, Other Income, and Existing EMIs.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS uses data for income-expense ratio calculation.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer inputs Co-Applicant Details (if any).{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS considers combined eligibility.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer submits calculator form.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS calculates eligibility & shows Proposed Loan Limit.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer captures the approved limit in the LOS.{"\n"}
                <Text style={styles.bold}>System Response:</Text> Data is saved and workflow proceeds to next stage.
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
                  <Text style={styles.listItem}>• Customer ID exists and is linked to a Loan Product</Text>
                  <Text style={styles.listItem}>• Proposed Asset details are already captured</Text>
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
                  <Text style={styles.listItem}>• Customer eligibility and proposed loan limit are calculated</Text>
                  <Text style={styles.listItem}>• Proposed Loan Limit is captured in LOS</Text>
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
Proposed Asset Details Captured
  |
  v
Open Loan Calculator
  |
  v
Enter Required Details (Loan, Income, Asset, EMI, etc.)
  |
  v
Submit Calculator Form
  |
  v
System Calculates Eligibility
  |
  v
Display and Capture Proposed Loan Limit
  |
  v
Proceed to Next Step
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
              <Text style={styles.listItem}><Text style={styles.bold}>Co-Applicant present:</Text> System includes co-applicant income and liabilities.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Retirement Age &lt; Loan Tenure:</Text> System throws validation error.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>High EMI burden:</Text> System reduces eligible loan limit or flags exception.</Text>
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
              <Text style={styles.listItem}><Text style={styles.bold}>Missing income or EMI details:</Text> Prompt to fill required fields.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Invalid DOB or Retirement Age:</Text> Error shown and prevents submission.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Loan amount exceeds asset value:</Text> System flags LTV breach warning.</Text>
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
              <View style={styles.listColumn}>
                <Text style={styles.listItem}>• Loan Type</Text>
                <Text style={styles.listItem}>• Date of Birth</Text>
                <Text style={styles.listItem}>• Purpose of Loan</Text>
                <Text style={styles.listItem}>• Cost of Asset</Text>
                <Text style={styles.listItem}>• Requested Loan Amount</Text>
              </View>
              <View style={styles.listColumn}>
                <Text style={styles.listItem}>• Loan Tenure</Text>
                <Text style={styles.listItem}>• Occupation</Text>
                <Text style={styles.listItem}>• Company Details</Text>
                <Text style={styles.listItem}>• Work Experience</Text>
                <Text style={styles.listItem}>• Age of Retirement</Text>
              </View>
              <View style={styles.listColumn}>
                <Text style={styles.listItem}>• Monthly Income</Text>
                <Text style={styles.listItem}>• Other Income</Text>
                <Text style={styles.listItem}>• Total EMI (existing liabilities)</Text>
                <Text style={styles.listItem}>• Co-applicant Info (optional)</Text>
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
              <Text style={styles.listItem}>• Eligibility Check Result</Text>
              <Text style={styles.listItem}>• Proposed Loan Limit</Text>
              <Text style={styles.listItem}>• Message on Loan Eligibility Success/Failure</Text>
              <Text style={styles.listItem}>• Storage of result in LOS</Text>
              <Text style={styles.listItem}>• Ready for next workflow stage: Assets & Liabilities Capture</Text>
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
              <Text style={styles.listItem}>• LOS UI (Loan Calculator Form)</Text>
              <Text style={styles.listItem}>• Eligibility & Loan Limit Engine</Text>
              <Text style={styles.listItem}>• Business Rule Service (validates age, income, EMI thresholds)</Text>
              <Text style={styles.listItem}>• Data Store (for saving results)</Text>
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
              <Text style={styles.listItem}>• Valid income, DOB, and EMI data: Proposed Loan Limit calculated</Text>
              <Text style={styles.listItem}>• Invalid DOB or retirement age: Error preventing calculation</Text>
              <Text style={styles.listItem}>• Co-applicant included: Loan limit adjusted based on combined eligibility</Text>
              <Text style={styles.listItem}>• Loan tenure exceeds remaining working years: System blocks with warning</Text>
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
              <Text style={styles.listItem}>• Capture Assets & Liabilities of the customer</Text>
              <Text style={styles.listItem}>• Proceed to Appraisal and Sanction Stages</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default System_CheckLimit;