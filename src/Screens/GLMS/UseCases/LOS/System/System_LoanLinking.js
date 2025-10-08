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

const LinkingOfCustomerIdToLoan = () => {
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
          <Icon size={20} color="#4f46e5" />
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
          <Text style={styles.title}>
            Linking of Customer ID to the Loan Product
          </Text>
        </View>

        <View style={styles.sectionsContainer}>
          <Section title="Description" icon={Info} sectionKey="description">
            <Text style={styles.text}>
              This use case enables the Bank Officer to link a Customer ID
              (already created or fetched from CBS) to a specific loan product
              in the Loan Origination System (LOS). This step is a prerequisite
              before the actual loan appraisal begins. It involves capturing key
              loan-related details like loan amount, tenure, margin, purpose,
              and repayment schedule - forming the foundation of the digital
              credit proposal workflow.
            </Text>
          </Section>

          <Section title="Actors" icon={Users} sectionKey="actors">
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Customer-facing</Text>
                <Text style={styles.listItem}>• Bank Officer (User)</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>System Roles</Text>
                <Text style={styles.listItem}>• Loan Origination System (LOS)</Text>
                <Text style={styles.listItem}>• Core Banking System (CBS)</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Software Stakeholders</Text>
                <Text style={styles.listItem}>• API Developers</Text>
                <Text style={styles.listItem}>• Database Administrators</Text>
                <Text style={styles.listItem}>• QA Testers</Text>
                <Text style={styles.listItem}>• Infra/CloudOps Team</Text>
              </View>
            </View>
          </Section>

          <Section
            title="User Actions & System Responses"
            icon={FileText}
            sectionKey="userActions"
          >
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>User Action</Text>
                <Text style={styles.tableHeaderCell}>System Response</Text>
              </View>
              {[
                {
                  action: "Login to LOS",
                  response: "Authenticates and loads user dashboard",
                },
                {
                  action: "Search or create Customer ID",
                  response: "System fetches from CBS or creates new",
                },
                {
                  action: "Select loan application",
                  response: "Loads customer's application form",
                },
                {
                  action: "Choose loan product",
                  response: "System fetches loan product configurations",
                },
                {
                  action: "Enter loan details: Amount, Tenure, ROI, Margin, etc.",
                  response: "System validates and pre-fills guidelines",
                },
                {
                  action: "Enter loan purpose & remarks",
                  response: "Captures text input",
                },
                {
                  action: 'Click "Save & Link"',
                  response: "System links Customer ID to selected Loan Product",
                },
                {
                  action: "Submit proposal",
                  response: "Proposal is routed to sanctioning authority",
                },
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
                <Text style={styles.listItem}>
                  • Customer ID has been created or fetched from CBS
                </Text>
                <Text style={styles.listItem}>
                  • All required KYC and loan documents are submitted
                </Text>
                <Text style={styles.listItem}>
                  • User has access to LOS with appropriate role
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Post Condition</Text>
                <Text style={styles.listItem}>
                  • Customer ID is successfully linked to a loan product
                </Text>
                <Text style={styles.listItem}>
                  • A new loan proposal record is created in LOS
                </Text>
                <Text style={styles.listItem}>
                  • Proposal moves to the appraisal or sanction stage
                </Text>
              </View>
            </View>
          </Section>

          <Section title="Straight Through Process (STP)" icon={ChevronRight} sectionKey="stp">
            <Text style={styles.text}>
              <Text style={styles.bold}>Ideal Path:</Text> Login → Fetch/Create
              Cust ID → Select Loan Product → Enter Loan Details → Save & Link
              → Submit
            </Text>
          </Section>

          <Section title="Alternative Flows" icon={ChevronRight} sectionKey="alternative">
            <Text style={styles.listItem}>
              • Assisted mode: Branch officer fills form on behalf of customer
            </Text>
            <Text style={styles.listItem}>
              • Self-service (future scope): Digital onboarding via app/website
            </Text>
            <Text style={styles.listItem}>
              • API Triggered: Loan product linkage via external partner API
            </Text>
          </Section>

          <Section title="Exception Flows" icon={AlertCircle} sectionKey="exception">
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Issue</Text>
                <Text style={styles.tableHeaderCell}>System Behavior</Text>
              </View>
              {[
                {
                  issue: "Customer ID not found",
                  behavior: "Show alert, suggest CBS fetch",
                },
                {
                  issue: "Missing mandatory fields",
                  behavior: "Display validation errors",
                },
                {
                  issue: "Product not available",
                  behavior: "Disable linking, prompt to reselect",
                },
                {
                  issue: "API/CBS timeout",
                  behavior: "Retry logic or fail gracefully",
                },
              ].map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{row.issue}</Text>
                  <Text style={styles.tableCell}>{row.behavior}</Text>
                </View>
              ))}
            </View>
          </Section>

          <Section title="User Activity Diagram" icon={FileText} sectionKey="activity">
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>
                {`Start
Login to LOS
Search/Create Customer ID
Select Loan Product
Enter Loan Details
Validate & Save
Link Customer ID to Loan Product
Submit Proposal
End`}
              </Text>
            </View>
          </Section>

          <Section title="Parking Lot" icon={Info} sectionKey="parking">
            <Text style={styles.listItem}>
              • Integrate Aadhaar/eKYC API for auto-Cust ID fetch
            </Text>
            <Text style={styles.listItem}>
              • Add ML-based recommendation for optimal loan product
            </Text>
            <Text style={styles.listItem}>
              • Enable WhatsApp/SMS alert post-linkage
            </Text>
            <Text style={styles.listItem}>
              • Pre-fill fields using data from CBS/CRM
            </Text>
          </Section>

          <Section title="System Components Involved" icon={Info} sectionKey="components">
            <Text style={styles.listItem}>• UI Screens: Loan Product Linking Form</Text>
            <Text style={styles.listItem}>
              • APIs: Fetch Customer ID, Fetch Loan Product Config, Submit Proposal
            </Text>
            <Text style={styles.listItem}>
              • DB Tables: Customer Master, Loan Application, Product Configurations
            </Text>
            <Text style={styles.listItem}>
              • External Services: CBS, Credit Bureau APIs (optional)
            </Text>
            <Text style={styles.listItem}>
              • Message Queues: Proposal Notification Queue (optional)
            </Text>
          </Section>

          <Section title="Test Scenarios" icon={FileText} sectionKey="test">
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Functional Tests</Text>
                <Text style={styles.listItem}>• Link customer ID with valid loan product</Text>
                <Text style={styles.listItem}>• Save and verify all loan fields</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Edge Cases</Text>
                <Text style={styles.listItem}>• Interest rate beyond allowed margin</Text>
                <Text style={styles.listItem}>• Linking same Customer ID to multiple products</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Negative Tests</Text>
                <Text style={styles.listItem}>• Attempt with missing customer ID</Text>
                <Text style={styles.listItem}>• Attempt with inactive user session</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Integration Tests</Text>
                <Text style={styles.listItem}>• LOS ↔ CBS</Text>
                <Text style={styles.listItem}>• LOS ↔ Product config engine</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Performance Tests</Text>
                <Text style={styles.listItem}>• Concurrent user load for peak hours</Text>
                <Text style={styles.listItem}>• API response under high volume</Text>
              </View>
            </View>
          </Section>

          <Section title="Infra & Deployment Notes" icon={Info} sectionKey="infra">
            <Text style={styles.listItem}>• Hosting: Cloud-native deployment (K8s or AppService)</Text>
            <Text style={styles.listItem}>• Environment: DEV, UAT, PROD</Text>
            <Text style={styles.listItem}>• Configs: Role-based access, loan product toggles</Text>
            <Text style={styles.listItem}>
              • Monitoring: LOS logs, API latency dashboard, audit trail
            </Text>
          </Section>

          <Section title="Dev Team Ownership" icon={Users} sectionKey="dev">
            <Text style={styles.listItem}>• Squad: LOS-Core Integration</Text>
            <Text style={styles.listItem}>• POC: Ramesh Nair (Product Owner)</Text>
            <Text style={styles.listItem}>• Jira Link: LOS-1234</Text>
            <Text style={styles.listItem}>• Repo: bitbucket.org/bank/los-core</Text>
          </Section>
        </View>
      </View>
    </ScrollView>
  );
};


export default LinkingOfCustomerIdToLoan;