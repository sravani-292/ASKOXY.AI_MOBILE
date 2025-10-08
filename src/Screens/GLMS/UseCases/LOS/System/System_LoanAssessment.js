import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  FileText,
  Users,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import styles from "./Styles";

const System_LoanAssessment = () => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    actors: true,
    trigger: true,
    preconditions: true,
    postconditions: true,
    mainFlow: true,
    alternateFlow: true,
    exceptionFlow: true,
    specialRequirements: true,
    businessRules: true,
    dataRequirements: true,
    frequency: true,
    notes: true,
    extensionPoints: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const Section = ({ title, icon: Icon, children, sectionKey }) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(sectionKey)}
      >
        <View style={styles.sectionTitle}>
          <Icon size={20} color="#2563eb" />
          <Text style={styles.sectionTitleText}>{title}</Text>
        </View>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={20} color="#4b5563" />
        ) : (
          <ChevronDown size={20} color="#4b5563" />
        )}
      </TouchableOpacity>
      {expandedSections[sectionKey] && children}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Loan Assessment Process</Text>
        </View>

        <View style={styles.sectionsContainer}>
          <Section title="Description" icon={Info} sectionKey="description">
            <Text style={styles.text}>
              The Loan Origination System (LOS) is a web-based solution
              developed to streamline the loan application process. It ensures
              uniform appraisal of loan proposals by adhering to the bank's
              guidelines. The system eliminates delays caused by manual
              exchanges between branches and zonal offices by facilitating
              electronic workflows. Once a loan application is received, the
              Bank Officer enters the required details, and the system
              automatically retrieves data like Rate of Interest, Margin, and
              Product Guidelines, ensuring compliance with discretionary
              powers for sanctioning. The user can generate reports such as
              Credit Score Sheet, Process Note, Sanction Letter, and
              Assessment Worksheet. After the Customer ID is created, linked
              to the loan account, and all relevant data (Proposed Asset
              Details, Asset & Liabilities, Loan Limit, etc.) are captured,
              the Bank Officer initiates the loan assessment process to
              determine the maximum loan amount that can be extended.
            </Text>
          </Section>

          <Section title="Actors" icon={Users} sectionKey="actors">
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Primary Actor</Text>
                <Text style={styles.listItem}>• Bank Officer</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Secondary Actors</Text>
                <Text style={styles.listItem}>• Credit Bureau (for Credit Score)</Text>
                <Text style={styles.listItem}>• Legal Team (for Legal Documentation)</Text>
                <Text style={styles.listItem}>• Valuation Experts (for Asset Valuation)</Text>
                <Text style={styles.listItem}>• Internal Systems (for financial data validation)</Text>
              </View>
            </View>
          </Section>

          <Section title="Trigger" icon={ChevronRight} sectionKey="trigger">
            <Text style={styles.listItem}>• The Customer ID is created and linked to the loan account.</Text>
            <Text style={styles.listItem}>• Customer data is fully entered in the Loan Origination System (LOS).</Text>
            <Text style={styles.listItem}>• The Appraisal Note and Process Note are generated, and risk analysis is completed.</Text>
            <Text style={styles.listItem}>• Bank Officer initiates the loan assessment process.</Text>
          </Section>

          <Section title="Preconditions" icon={CheckCircle} sectionKey="preconditions">
            <Text style={styles.listItem}>• Customer ID is created and associated with the loan account.</Text>
            <Text style={styles.listItem}>• All necessary details about the loan, including:</Text>
            <Text style={styles.nestedListItem}>  - Proposed Asset Details</Text>
            <Text style={styles.nestedListItem}>  - Asset & Liabilities Details</Text>
            <Text style={styles.nestedListItem}>  - Loan Limit</Text>
            <Text style={styles.nestedListItem}>  - Co-applicant/Guarantor/Co-obligant Information</Text>
            <Text style={styles.nestedListItem}>  - Appraisal Note</Text>
            <Text style={styles.nestedListItem}>  - Process Note</Text>
            <Text style={styles.nestedListItem}>  - Risk Analysis</Text>
            <Text style={styles.listItem}>• The loan application is ready for Loan Assessment to determine the maximum loan that can be sanctioned.</Text>
          </Section>

          <Section title="Postconditions" icon={CheckCircle} sectionKey="postconditions">
            <Text style={styles.listItem}>• The Loan Assessment Process is completed.</Text>
            <Text style={styles.listItem}>• The Bank Officer verifies the Maximum Loan Amount that can be extended.</Text>
            <Text style={styles.listItem}>• The Bank Officer proceeds to specify the Terms & Conditions for the loan.</Text>
            <Text style={styles.listItem}>• The Assessment Report is finalized and available for review.</Text>
            <Text style={styles.listItem}>• The system generates reports, including the Sanction Letter and Assessment Worksheet.</Text>
          </Section>

          <Section title="Main Flow (Basic Flow)" icon={FileText} sectionKey="mainFlow">
            <Text style={styles.orderedListItem}>1. Bank Officer logs into the Loan Origination System (LOS).</Text>
            <Text style={styles.orderedListItem}>2. The Bank Officer opens the loan account for the respective customer.</Text>
            <Text style={styles.orderedListItem}>3. The system retrieves and displays the customer details, including:</Text>
            <Text style={styles.nestedListItem}>  - Proposed asset details</Text>
            <Text style={styles.nestedListItem}>  - Asset & liabilities details</Text>
            <Text style={styles.nestedListItem}>  - Loan limit</Text>
            <Text style={styles.nestedListItem}>  - Co-applicant/guarantor/co-obligant details</Text>
            <Text style={styles.orderedListItem}>4. The Bank Officer verifies that all necessary data has been entered correctly and completely.</Text>
            <Text style={styles.orderedListItem}>5. The system automatically computes the Maximum Loan Amount based on:</Text>
            <Text style={styles.nestedListItem}>  - Loan Amount requested by the customer</Text>
            <Text style={styles.nestedListItem}>  - Present income of the customer</Text>
            <Text style={styles.nestedListItem}>  - Present value of the security (collateral)</Text>
            <Text style={styles.nestedListItem}>  - Rate of Interest</Text>
            <Text style={styles.nestedListItem}>  - Loan Tenure</Text>
            <Text style={styles.nestedListItem}>  - Future period of service</Text>
            <Text style={styles.nestedListItem}>  - Repayment capacity of the customer</Text>
            <Text style={styles.orderedListItem}>6. The Bank Officer reviews the computed loan details and adjusts the Loan Assessment Amount if necessary, based on:</Text>
            <Text style={styles.nestedListItem}>  - Margin Requirement</Text>
            <Text style={styles.nestedListItem}>  - Maximum and Minimum Loan Cap</Text>
            <Text style={styles.orderedListItem}>7. The Bank Officer finalizes the Loan Assessment.</Text>
            <Text style={styles.orderedListItem}>8. The Assessment Sheet is generated and stored in the system for record-keeping and reporting purposes.</Text>
            <Text style={styles.orderedListItem}>9. The Bank Officer proceeds with the specification of the Terms & Conditions for the loan, to be communicated to the customer.</Text>
          </Section>

          <Section title="Alternate Flow" icon={ChevronRight} sectionKey="alternateFlow">
            <Text style={styles.listItem}><Text style={styles.bold}>Insufficient Information:</Text> If essential data (e.g., asset details, liabilities, or income) is missing or incomplete, the system prompts the Bank Officer to complete the data before proceeding with the assessment.</Text>
            <Text style={styles.listItem}><Text style={styles.bold}>Adjustment of Loan Amount:</Text> If the Bank Officer manually adjusts the loan amount (e.g., reducing it based on margin requirements), the system allows manual input, and the officer can add remarks for the change.</Text>
            <Text style={styles.listItem}><Text style={styles.bold}>Request for Additional Documents:</Text> If additional documents or reports (e.g., asset valuation, legal clearance) are required, the system notifies the Bank Officer, and the loan assessment is paused until the required documents are provided.</Text>
          </Section>

          <Section title="Exception Flow" icon={AlertCircle} sectionKey="exceptionFlow">
            <Text style={styles.listItem}><Text style={styles.bold}>Data Validation Failure:</Text> If the loan data (e.g., requested loan amount, collateral value, or repayment capacity) does not meet the bank's predefined criteria, the system generates an error, and the Bank Officer must correct the data before proceeding.</Text>
            <Text style={styles.listItem}><Text style={styles.bold}>Missing Report:</Text> If any reports required for the loan assessment (e.g., credit report, valuation report) are not available, the system pauses the assessment process until the missing data is received.</Text>
          </Section>

          <Section title="Special Requirements" icon={Info} sectionKey="specialRequirements">
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Automation</Text>
                <Text style={styles.listItem}>• Automatically calculate the maximum loan amount based on parameters like margin requirements and repayment capacity.</Text>
                <Text style={styles.listItem}>• Auto-generate the Assessment Report with pre-defined templates.</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Data Integrity</Text>
                <Text style={styles.listItem}>• Ensure all entered customer data passes integrity checks for completeness and accuracy before assessment.</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Report Generation</Text>
                <Text style={styles.listItem}>• Enable generation of key reports, including Credit Score Sheet, Process Note, Sanction Letter, and Assessment Worksheet.</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Audit Trail</Text>
                <Text style={styles.listItem}>• Log all changes to the loan assessment with timestamps and user identity for auditing purposes.</Text>
              </View>
            </View>
          </Section>

          <Section title="Business Rules" icon={Info} sectionKey="businessRules">
            <Text style={styles.listItem}><Text style={styles.bold}>Margin Requirements:</Text> The loan amount cannot exceed the margin limit set for the specific loan product.</Text>
            <Text style={styles.listItem}><Text style={styles.bold}>Loan Limit Caps:</Text> The loan amount must adhere to the minimum and maximum cap limits defined by the bank for different products.</Text>
            <Text style={styles.listItem}><Text style={styles.bold}>Discretionary Powers:</Text> The Bank Officer can exercise discretionary powers when approving loans but must follow bank guidelines to ensure fairness and consistency in the appraisal process.</Text>
          </Section>

          <Section title="Data Requirements" icon={Info} sectionKey="dataRequirements">
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Customer Data</Text>
                <Text style={styles.listItem}>• Customer ID, loan account number, proposed asset details, income details, liabilities, co-applicant/guarantor details, etc.</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Financial Data</Text>
                <Text style={styles.listItem}>• Income data, asset value, proposed loan limit, security/collateral details, repayment capacity.</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Reports</Text>
                <Text style={styles.listItem}>• Credit Score Sheet</Text>
                <Text style={styles.listItem}>• Process Note</Text>
                <Text style={styles.listItem}>• Sanction Letter</Text>
                <Text style={styles.listItem}>• Assessment Worksheet</Text>
              </View>
            </View>
          </Section>

          <Section title="Frequency of Use" icon={Info} sectionKey="frequency">
            <Text style={styles.text}>
              This use case is executed every time a loan application is assessed for the maximum loan amount, occurring frequently based on the bank's loan application volume.
            </Text>
          </Section>

          <Section title="Notes and Issues" icon={Info} sectionKey="notes">
            <Text style={styles.listItem}>• Integration with external agencies (e.g., Credit Bureau, Asset Valuation Team) should be seamless to avoid delays in the assessment process.</Text>
            <Text style={styles.listItem}>• The system must have robust data validation features to ensure that no incomplete or incorrect data is submitted for assessment.</Text>
          </Section>

          <Section title="Extension Points" icon={Info} sectionKey="extensionPoints">
            <Text style={styles.orderedListItem}>1. <Text style={styles.bold}>Document Uploads and Verification:</Text> Integrate with document verification tools (e.g., e-signature platforms, OCR for automatic document reading) during the loan assessment.</Text>
            <Text style={styles.orderedListItem}>2. <Text style={styles.bold}>Customer Communication Integration:</Text> Automatically notify the customer via email or SMS once the loan assessment is completed, providing sanction details or additional information if required.</Text>
            <Text style={styles.orderedListItem}>3. <Text style={styles.bold}>Automated Workflow Adjustments:</Text> Automate manual processes, such as adjusting loan amounts based on changing bank policies or re-evaluating when parameters (e.g., rate of interest) change.</Text>
            <Text style={styles.orderedListItem}>4. <Text style={styles.bold}>Integration with Third-party Risk Management Tools:</Text> Incorporate third-party services to assess credit risk or analyze the customer's financial standing for comprehensive assessments.</Text>
          </Section>
        </View>
      </View>
    </ScrollView>
  );
};



export default System_LoanAssessment;