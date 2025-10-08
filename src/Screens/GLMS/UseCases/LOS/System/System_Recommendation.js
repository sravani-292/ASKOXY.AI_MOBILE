import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Icon from '@expo/vector-icons';
import styles from './Styles';

const System_Recommendation = () => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    actors: true,
    trigger: true,
    preconditions: true,
    postconditions: true,
    mainFlow: true,
    alternateFlows: true,
    exceptionFlows: true,
    specialRequirements: true,
    businessRules: true,
    dataRequirements: true,
    frequency: true,
    notes: true,
    nonFunctional: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ScrollView style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.h1}>Recommendations Workflow in LOS</Text>
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
              The Loan Origination System (LOS) enables Bank Officers to process loan applications by capturing customer details, proposed loan amounts, asset details, and liabilities. After completing preliminary steps (e.g., customer ID creation, asset details, proposed loan limits, risk analysis), the Bank Officer initiates the recommendation process to modify the proposed loan. Recommendations include changes to the loan amount, interest rate, loan tenure, and repayment terms, with justifications for each modification. These are forwarded to the Sanctioning Authorities for final approval.
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
                <Text style={styles.h3}>Secondary Actors</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Sanctioning Authorities (for approval of recommendations)</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('trigger')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="chevron-right" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Trigger</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.trigger ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.trigger && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• Customer ID has been created and linked to the loan account.</Text>
              <Text style={styles.listItem}>• All customer details are captured in the Loan Origination System (LOS), including proposed asset details, liabilities, proposed loan limit, co-applicant/guarantor/co-obligant information, and the process note.</Text>
              <Text style={styles.listItem}>• Risk analysis has been completed, and the proposed loan amount and terms have been finalized.</Text>
              <Text style={styles.listItem}>• The Bank Officer decides to initiate the recommendation process to modify the proposed loan.</Text>
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
                  <Text style={styles.listItem}>• Customer ID exists and is linked to the loan account</Text>
                  <Text style={styles.listItem}>• All customer details are captured in the Loan Origination System (LOS), including proposed asset details, liabilities, proposed loan limit, co-applicant/guarantor/co-obligant information, and the process note</Text>
                  <Text style={styles.listItem}>• Risk analysis has been completed, and the proposed loan amount and terms have been finalized</Text>
                </View>
              )}
            </View>
            <View style={styles.subSection}>
              <TouchableOpacity style={styles.button} onPress={() => toggleSection('postconditions')}>
                <View style={styles.buttonContent}>
                  <Icon.MaterialCommunityIcons name="check-circle" size={20} color="#16a34a" />
                  <Text style={styles.sectionTitle}>Postconditions</Text>
                </View>
                <Icon.MaterialCommunityIcons
                  name={expandedSections.postconditions ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#4b5563"
                />
              </TouchableOpacity>
              {expandedSections.postconditions && (
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Loan proposal is updated with recommendations, including justifications</Text>
                  <Text style={styles.listItem}>• Updated proposal is forwarded to the Sanctioning Authorities for final approval</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('mainFlow')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="format-list-bulleted" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Main Flow</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.mainFlow ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.mainFlow && (
            <View style={styles.list}>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Bank Officer initiates recommendation process.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS opens the recommendation form with pre-filled proposed loan details.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer modifies loan amount, interest rate, tenure, or repayment terms.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System validates changes against business rules and recalculates dependent fields.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer provides justification for each modification.{"\n"}
                <Text style={styles.bold}>System Response:</Text> System stores justifications and associates them with changes.
              </Text>
              <Text style={styles.listItem}>
                <Text style={styles.bold}>User Action:</Text> Officer submits updated proposal with recommendations.{"\n"}
                <Text style={styles.bold}>System Response:</Text> LOS updates the loan proposal and forwards it to Sanctioning Authorities.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('alternateFlows')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="chevron-right" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Alternate Flows</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.alternateFlows ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.alternateFlows && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• No modifications needed: Officer submits without changes</Text>
              <Text style={styles.listItem}>• Partial modifications: Only specific fields (e.g., tenure) are updated</Text>
              <Text style={styles.listItem}>• Multiple iterations: Recommendations revised based on feedback from authorities</Text>
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
              <Text style={styles.listItem}>• Invalid modifications (e.g., loan amount exceeds limits): System prevents submission and shows error</Text>
              <Text style={styles.listItem}>• Missing justifications: System prompts for required explanations</Text>
              <Text style={styles.listItem}>• System error during submission: Changes are saved as draft for retry</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('specialRequirements')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="information-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Special Requirements</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.specialRequirements ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.specialRequirements && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• Recommendations must include justifications for each change</Text>
              <Text style={styles.listItem}>• System should auto-calculate impacts of changes (e.g., EMI recalculation)</Text>
              <Text style={styles.listItem}>• Audit trail for all modifications</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('businessRules')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="information-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Business Rules</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.businessRules ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.businessRules && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• Loan amount cannot exceed predefined limits based on risk score</Text>
              <Text style={styles.listItem}>• Interest rate modifications require approval levels</Text>
              <Text style={styles.listItem}>• Tenure changes must align with customer age and product rules</Text>
              <Text style={styles.listItem}>• All changes require justifications</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('dataRequirements')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="information-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Data Requirements</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.dataRequirements ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.dataRequirements && (
            <View style={styles.grid}>
              <View>
                <Text style={styles.h3}>Customer Data</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Customer ID</Text>
                  <Text style={styles.listItem}>• Loan account number</Text>
                  <Text style={styles.listItem}>• Proposed asset details</Text>
                  <Text style={styles.listItem}>• Asset & liabilities details</Text>
                  <Text style={styles.listItem}>• Co-applicant/guarantor information</Text>
                </View>
              </View>
              <View>
                <Text style={styles.h3}>Loan Data</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Proposed loan amount</Text>
                  <Text style={styles.listItem}>• Rate of interest</Text>
                  <Text style={styles.listItem}>• Loan tenure</Text>
                  <Text style={styles.listItem}>• Proposed repayment terms</Text>
                </View>
              </View>
              <View>
                <Text style={styles.h3}>Reports</Text>
                <View style={styles.list}>
                  <Text style={styles.listItem}>• Appraisal Note</Text>
                  <Text style={styles.listItem}>• Process Note</Text>
                  <Text style={styles.listItem}>• Recommendations History</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('frequency')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="information-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Frequency of Use</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.frequency ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.frequency && (
            <Text style={styles.paragraph}>
              This use case is executed whenever a loan proposal requires modifications and recommendations need to be added before forwarding it to the sanctioning authorities.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('notes')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="information-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Notes and Issues</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.notes ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.notes && (
            <View style={styles.list}>
              <Text style={styles.listItem}>• Integration with third-party systems (e.g., credit bureaus, asset valuation systems) should be seamless to ensure timely updates to the loan recommendations.</Text>
              <Text style={styles.listItem}>• The system should be robust enough to prevent errors in calculations when recommendations are entered (e.g., loan amount exceeding limits, incorrect interest rates).</Text>
              <Text style={styles.listItem}>• A comprehensive audit trail should be maintained for all changes made during the recommendation process.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection('nonFunctional')}>
            <View style={styles.buttonContent}>
              <Icon.MaterialCommunityIcons name="lock-outline" size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Non-Functional Requirements</Text>
            </View>
            <Icon.MaterialCommunityIcons
              name={expandedSections.nonFunctional ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4b5563"
            />
          </TouchableOpacity>
          {expandedSections.nonFunctional && (
            <View style={styles.list}>
              <Text style={styles.listItem}><Text style={styles.bold}>Performance:</Text> The system should allow the Bank Officer to enter and save loan recommendation data with minimal delay (less than 2 seconds per action).</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Security:</Text> The system should implement proper user authentication and authorization protocols to ensure only authorized Bank Officers can modify loan proposals. Sensitive data such as loan amount, rate of interest, and customer details must be encrypted at rest and in transit.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Scalability:</Text> The system should be able to handle increasing numbers of loan proposals without significant degradation in performance.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Usability:</Text> The Loan Origination System (LOS) should have an intuitive and user-friendly interface that allows the Bank Officer to efficiently enter and update recommendations, with clear instructions and validation checks to guide the process.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Availability:</Text> The system should be available 99.9% of the time, with minimal downtime, and ensure that no data is lost during the recommendation process.</Text>
              <Text style={styles.listItem}><Text style={styles.bold}>Auditability:</Text> The system should maintain an audit log of all actions taken by Bank Officers during the recommendation process, including timestamps and user IDs.</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default System_Recommendation;