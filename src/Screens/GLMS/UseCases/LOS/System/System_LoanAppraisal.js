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
import Styles from "./Styles";

const System_LoanAppraisal = () => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    actors: true,
    userActions: true,
    conditions: true,
    stp: true,
    alternative: true,
    exception: true,
    activity: true,
    parking: true,
    components: true,
    test: true,
    infra: true,
    dev: true,
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
          <Text style={styles.title}>Loan Organization System Appraisal</Text>
        </View>

        <View style={styles.sectionsContainer}>
          <Section title="Description" icon={Info} sectionKey="description">
            <Text style={styles.text}>
              This use case captures the loan appraisal process where the Bank
              Officer assesses the customer's loan eligibility based on
              financial, personal, employment, and verification data. The
              outcome is the generation of a Loan Appraisal Note / Process
              Note, which is used for risk analysis and further loan
              processing.
            </Text>
          </Section>

          <Section title="Actors" icon={Users} sectionKey="actors">
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Customer-facing</Text>
                <Text style={styles.listItem}>• Bank Officer</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>System Roles</Text>
                <Text style={styles.listItem}>• Loan Origination System (LOS)</Text>
                <Text style={styles.listItem}>• External Services (Legal, Engineering, Employment Verification, Credit Bureaus)</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Software Stakeholders</Text>
                <Text style={styles.listItem}>• API Developers</Text>
                <Text style={styles.listItem}>• QA Team</Text>
                <Text style={styles.listItem}>• CloudOps</Text>
                <Text style={styles.listItem}>• Infra</Text>
              </View>
            </View>
          </Section>

          <Section title="User Actions & System Responses" icon={FileText} sectionKey="userActions">
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>User Action</Text>
                <Text style={styles.tableHeaderCell}>System Response</Text>
              </View>
              {[
                { action: "Logs into LOS", response: "Authenticates and displays dashboard" },
                { action: "Selects linked Customer ID and Loan Account", response: "Fetches and displays customer and loan details" },
                { action: "Initiates Appraisal Process", response: "Loads appraisal input screen" },
                { action: "Requests Legal Scrutiny Report (LSR)", response: "Triggers request to external legal API / document upload" },
                { action: "Requests Security Valuation Report", response: "Interfaces with engineering agency or document upload" },
                { action: "Requests Income and Employment Verification", response: "Sends verification requests via internal/external API" },
                { action: "Fetches Credit Reports", response: "Integrates with Credit Bureau APIs to retrieve reports" },
                { action: "Inputs and reviews appraisal data", response: "Validates and saves input" },
                { action: "Saves appraisal note", response: "System generates Loan Appraisal / Process Note" },
              ].map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{row.action}</Text>
                  <Text style={styles.tableCell}>{row.response}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="Conditions" icon={CheckCircle} sectionKey="conditions">
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Precondition</Text>
                <Text style={styles.listItem}>• Customer ID is created and linked to a loan account</Text>
                <Text style={styles.listItem}>• Customer details captured: assets, liabilities, co-applicants, proposed loan limit, etc.</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Post Condition</Text>
                <Text style={styles.listItem}>• Appraisal note / process note is generated</Text>
                <Text style={styles.listItem}>• Data available for Risk Analysis module</Text>
              </View>
            </View>
          </Section>

          <Section title="Straight Through Process (STP)" icon={ChevronRight} sectionKey="stp">
            <Text style={styles.text}>
              <Text style={styles.bold}>Ideal Path:</Text> Login → Select Customer → Request Reports → Input Appraisal → Generate Appraisal Note → Logout
            </Text>
          </Section>

          <Section title="Alternative Flows" icon={ChevronRight} sectionKey="alternative">
            <Text style={styles.listItem}>• Reports uploaded manually instead of fetched via API</Text>
            <Text style={styles.listItem}>• Verification steps bypassed in pre-approved cases</Text>
            <Text style={styles.listItem}>• Assisted input by branch support team</Text>
          </Section>

          <Section title="Exception Flows" icon={AlertCircle} sectionKey="exception">
            <Text style={styles.listItem}>• Missing report (e.g., Credit Bureau unresponsive)</Text>
            <Text style={styles.listItem}>• Invalid/mismatched verification data</Text>
            <Text style={styles.listItem}>• Incomplete customer information in LOS</Text>
            <Text style={styles.listItem}>• LOS server downtime or session timeout</Text>
          </Section>

          <Section title="User Activity Diagram" icon={FileText} sectionKey="activity">
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>
                {`Start
Login to LOS
Select Customer ID + Loan
Initiate Appraisal Process
Request Legal/Security/Verification Reports
Input Appraisal Details
Generate Appraisal Note
End`}
              </Text>
            </View>
          </Section>

          <Section title="Parking Lot" icon={Info} sectionKey="parking">
            <Text style={styles.listItem}>• Integration with AI for auto-risk rating</Text>
            <Text style={styles.listItem}>• ML-based suggestion engine for appraisal remarks</Text>
            <Text style={styles.listItem}>• Partner dashboard for report status tracking</Text>
            <Text style={styles.listItem}>• API for instant employment/income verification</Text>
          </Section>

          <Section title="System Components Involved" icon={Info} sectionKey="components">
            <Text style={styles.listItem}>• UI: Appraisal Input Form, Customer Detail Screen</Text>
            <Text style={styles.listItem}>• APIs: Legal Report, Engineer Valuation, Employment Verification, Credit Bureau</Text>
            <Text style={styles.listItem}>• DB: Loan, Customer, Asset, Liabilities, Co-Applicant</Text>
            <Text style={styles.listItem}>• External Systems: CIBIL/Experian, Internal Verification Systems</Text>
            <Text style={styles.listItem}>• Message Queues: Report status notifications</Text>
          </Section>

          <Section title="Test Scenarios" icon={FileText} sectionKey="test">
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Functional</Text>
                <Text style={styles.listItem}>• Successful appraisal note creation</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Edge Cases</Text>
                <Text style={styles.listItem}>• Missing one or more reports</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Negative</Text>
                <Text style={styles.listItem}>• Mismatched verification data</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Integration</Text>
                <Text style={styles.listItem}>• API with Credit Bureau</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Performance</Text>
                <Text style={styles.listItem}>• Load test with concurrent appraisal sessions</Text>
              </View>
            </View>
          </Section>

          <Section title="Infra & Deployment Notes" icon={Info} sectionKey="infra">
            <Text style={styles.listItem}>• Secure APIs for external reports</Text>
            <Text style={styles.listItem}>• Cloud DB with encrypted storage</Text>
            <Text style={styles.listItem}>• Feature toggle for manual vs API-based verification</Text>
            <Text style={styles.listItem}>• Role-based access controls</Text>
          </Section>

          <Section title="Dev Team Ownership" icon={Users} sectionKey="dev">
            <Text style={styles.listItem}>• Squad: Lending LOS Appraisal Team</Text>
            <Text style={styles.listItem}>• Contact: Lead Dev - Rajesh Kumar</Text>
            <Text style={styles.listItem}>• Jira Reference: LOS-APP-UC102</Text>
            <Text style={styles.listItem}>• Repo: gitlab.com/bank-loan/los/appraisal-module</Text>
          </Section>
        </View>
      </View>
    </ScrollView>
  );
};


export default System_LoanAppraisal;