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
import ImageModal from "../../ImageModal";

const LinkingOfCoApplicantGuarantor = () => {
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
            Linking Co-Applicant / Co-Obligant / Guarantor in LOS
          </Text>
        </View>

        <View style={styles.sectionsContainer}>
          <Section title="Description" icon={Info} sectionKey="description">
            <Text style={styles.text}>
              This use case describes the process by which a Bank Officer links
              one or more Co-Applicants, Co-Obligants, or Guarantors to a
              primary loan application using the Loan Origination System (LOS).
              It covers the creation (if new) and linking (if existing) of
              customer IDs for these related parties and associates them with
              the main loan application to proceed for appraisal.
            </Text>
          </Section>

          <Section title="Actors" icon={Users} sectionKey="actors">
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Customer-facing</Text>
                <Text style={styles.listItem}>• Bank Officer</Text>
                <Text style={styles.listItem}>• Applicant</Text>
                <Text style={styles.listItem}>
                  • Co-applicant / Co-obligant / Guarantor
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>System Roles</Text>
                <Text style={styles.listItem}>• Loan Origination System (LOS)</Text>
                <Text style={styles.listItem}>• Core Banking System (CBS)</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Software Stakeholders</Text>
                <Text style={styles.listItem}>• API Developers</Text>
                <Text style={styles.listItem}>• QA Engineers</Text>
                <Text style={styles.listItem}>• DevOps / CloudOps</Text>
                <Text style={styles.listItem}>• Database Admins</Text>
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
                <Text style={styles.tableHeaderCell}>Step</Text>
                <Text style={styles.tableHeaderCell}>User Action</Text>
                <Text style={styles.tableHeaderCell}>System Response</Text>
              </View>
              {[
                {
                  step: "1",
                  action: "Customer submits loan application and documents",
                  response: "N/A",
                },
                {
                  step: "2",
                  action: "Bank Officer verifies documents",
                  response: "Highlights any missing or invalid data",
                },
                {
                  step: "3",
                  action: "Bank Officer initiates Customer ID creation (if needed)",
                  response: "LOS captures and saves customer details",
                },
                {
                  step: "4",
                  action: "Bank Officer enters details for Co-applicant / Co-obligant / Guarantor",
                  response: "System validates and creates new Cust ID (if not fetched from CBS)",
                },
                {
                  step: "5",
                  action: "Bank Officer links Co-applicant / Co-obligant / Guarantor to the loan",
                  response: "LOS stores relationship and eligibility flags",
                },
                {
                  step: "6",
                  action: "Bank Officer saves linkage",
                  response: "System updates the loan application with associated parties",
                },
              ].map((row, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{row.step}</Text>
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
                  • Primary Customer ID created and linked to loan product
                </Text>
                <Text style={styles.listItem}>
                  • Loan application form and mandatory documents submitted
                </Text>
                <Text style={styles.listItem}>• Basic KYC and verification completed</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Post Condition</Text>
                <Text style={styles.listItem}>
                  • Co-applicant / Co-obligant / Guarantor details linked to the loan application
                </Text>
                <Text style={styles.listItem}>• Cust IDs created (if new)</Text>
                <Text style={styles.listItem}>
                  • Loan application updated with eligibility-related income data
                </Text>
              </View>
            </View>
          </Section>

          <Section title="Straight Through Process (STP)" icon={ChevronRight} sectionKey="stp">
            <Text style={styles.text}>
              <Text style={styles.bold}>Ideal Path:</Text> Login → Validate Application → Create/Fetch
              Cust ID → Link to Loan → Save → Proceed to Loan Details
            </Text>
          </Section>

          <Section title="Alternative Flows" icon={ChevronRight} sectionKey="alternative">
            <Text style={styles.listItem}>
              • Assisted Mode: Bank Officer helps applicant in-person
            </Text>
            <Text style={styles.listItem}>
              • CBS Lookup: Fetches existing customer details using Cust ID
            </Text>
            <Text style={styles.listItem}>
              • Mobile / Web App (Future enhancement): Applicant submits associated party details
              directly
            </Text>
          </Section>

          <Section title="Exception Flows" icon={AlertCircle} sectionKey="exception">
            <Text style={styles.listItem}>• Document mismatch or missing information</Text>
            <Text style={styles.listItem}>• Cust ID creation failure due to invalid fields</Text>
            <Text style={styles.listItem}>• CBS unresponsive or slow</Text>
            <Text style={styles.listItem}>• Duplicate Cust ID error</Text>
            <Text style={styles.listItem}>• Incorrect relationship mapping</Text>
          </Section>

          <Section title="User Activity Diagram" icon={FileText} sectionKey="activity">
            <View style={styles.codeBlock}>
              <Text style={styles.codeText}>
                {`Start
Bank officer logs in
Verify Documents
Create/Fetch Cust ID for Associated Party
Capture Personal/Income/Asset Details
Link to Loan Application
Save Record
End`}
              </Text>
            </View>
          </Section>

          <Section title="Parking Lot" icon={Info} sectionKey="parking">
            <Text style={styles.listItem}>
              • Integration with Aadhaar/UID for instant verification
            </Text>
            <Text style={styles.listItem}>• Auto-fetch data using PAN/CKYC API</Text>
            <Text style={styles.listItem}>• ML model to validate document completeness</Text>
            <Text style={styles.listItem}>
              • Partner CRM integration for automated status updates
            </Text>
          </Section>

          <Section title="System Components Involved" icon={Info} sectionKey="components">
            <Text style={styles.listItem}>• UI Screens: Customer Info, Income, Employment, Linking</Text>
            <Text style={styles.listItem}>• APIs: Cust ID Creation API, CBS Lookup API, Linking API</Text>
            <Text style={styles.listItem}>
              • DB Tables: customers, loan_applications, applicant_relationships, income_details
            </Text>
            <Text style={styles.listItem}>
              • External Services: CBS System, Document Verification API
            </Text>
            <Text style={styles.listItem}>• Message Queues (optional): For async data sync with CBS</Text>
          </Section>

          <Section title="Test Scenarios" icon={FileText} sectionKey="test">
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Functional</Text>
                <Text style={styles.listItem}>• Create Cust ID</Text>
                <Text style={styles.listItem}>• Link Cust ID</Text>
                <Text style={styles.listItem}>• Save Form</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Edge Cases</Text>
                <Text style={styles.listItem}>• Duplicate PAN</Text>
                <Text style={styles.listItem}>• Long names</Text>
                <Text style={styles.listItem}>• Empty mandatory fields</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Negative</Text>
                <Text style={styles.listItem}>• Missing documents</Text>
                <Text style={styles.listItem}>• Invalid DOB format</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Integration</Text>
                <Text style={styles.listItem}>• CBS fetch</Text>
                <Text style={styles.listItem}>• Cust ID validation</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subtitle}>Performance</Text>
                <Text style={styles.listItem}>• Cust ID creation under load</Text>
                <Text style={styles.listItem}>• CBS fetch timeout handling</Text>
              </View>
            </View>
          </Section>

          <Section title="Infra & Deployment Notes" icon={Info} sectionKey="infra">
            <Text style={styles.listItem}>• Microservices-based deployment</Text>
            <Text style={styles.listItem}>• Config flags for CBS integration toggle</Text>
            <Text style={styles.listItem}>• Ensure data encryption in transit</Text>
            <Text style={styles.listItem}>• API throttling for Cust ID creation during peak hours</Text>
            <Text style={styles.listItem}>• Rollout: UAT → Staging → Production</Text>
          </Section>

          <Section title="Dev Team Ownership" icon={Users} sectionKey="dev">
            <Text style={styles.listItem}>• Squad: LOS-Customer-Management</Text>
            <Text style={styles.listItem}>• POC: Ramesh Nair (ramesh.nair@bank.com)</Text>
            <Text style={styles.listItem}>• JIRA: LOS-324</Text>
            <Text style={styles.listItem}>• Git Repo: git.bank.com/los/customer-module</Text>
                        <ImageModal imageSource={'https://i.ibb.co/Gv11dpRk/linking-of-co-applicant-guranter.png'}/>

          </Section>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    padding: 16,
  },
  header: {
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: "#4f46e5",
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  sectionsContainer: {
    gap: 24,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  text: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  bold: {
    fontWeight: "600",
  },
  grid: {
    gap: 16,
  },
  gridItem: {
    gap: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  listItem: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eef2ff",
    padding: 12,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    padding: 12,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#4b5563",
  },
  codeBlock: {
    backgroundColor: "#eef2ff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  codeText: {
    fontSize: 12,
    color: "#374151",
    fontFamily: "monospace",
  },
});

export default LinkingOfCoApplicantGuarantor;