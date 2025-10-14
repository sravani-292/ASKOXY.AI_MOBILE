import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import {
  FileText,
  Users,
  List,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Settings,
  TestTube,
  Server,
  User,
} from "lucide-react-native";
import ImageModal from "../../ImageModal";
const System_FinanceViewer = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Heading */}
      <View style={styles.header}>
        <Text style={styles.headerText}>WF_ FMS Finance Viewer</Text>
      </View>
      
      <View style={styles.card}>
        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.text}>
            The Finance Viewer module in the Financial Management System (FMS)
            allows bank officers to search and view detailed finance information
            for customer accounts after disbursal. The Finance Query screen
            provides flexible search options using various identifiers like
            Finance ID, Customer Name, etc. Once identified, the system displays
            comprehensive finance details retrieved from the Loan Origination
            System (LOS).
          </Text>
        </View>

        {/* Actors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Actors</Text>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Business User</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Bank Officer</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>System Roles</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Financial Management System (FMS)</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Stakeholders</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Loan Operations</Text>
              <Text style={styles.bulletPoint}>• Credit</Text>
              <Text style={styles.bulletPoint}>• Customer Service</Text>
            </View>
          </View>
        </View>

        {/* User Actions & System Responses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>User Actions & System Responses</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.numberedPoint}>1. Bank Officer logs into the FMS application.</Text>
            <Text style={styles.numberedPoint}>2. Navigates to the Finance Query screen.</Text>
            <Text style={styles.numberedPoint}>3. Searches for a finance deal using parameters such as Finance ID, Customer Name, or Branch.</Text>
            <Text style={styles.numberedPoint}>4. System retrieves matching finance record(s) and displays detailed view-only information including:</Text>
            <View style={styles.nestedList}>
              <Text style={styles.bulletPoint}>• Application Info:</Text>
              <View style={styles.doubleNestedList}>
                <Text style={styles.bulletPoint}>- Finance ID</Text>
                <Text style={styles.bulletPoint}>- Date</Text>
                <Text style={styles.bulletPoint}>- Branch Name</Text>
                <Text style={styles.bulletPoint}>- Customer Name</Text>
                <Text style={styles.bulletPoint}>- Co-applicant</Text>
                <Text style={styles.bulletPoint}>- Guarantor</Text>
              </View>
              <Text style={styles.bulletPoint}>• Financial Info:</Text>
              <View style={styles.doubleNestedList}>
                <Text style={styles.bulletPoint}>- Requested & Sanctioned Amounts</Text>
                <Text style={styles.bulletPoint}>- Disbursal Type</Text>
                <Text style={styles.bulletPoint}>- Disbursal Date</Text>
                <Text style={styles.bulletPoint}>- Tenure</Text>
              </View>
              <Text style={styles.bulletPoint}>• Employment Info:</Text>
              <View style={styles.doubleNestedList}>
                <Text style={styles.bulletPoint}>- Employer Name</Text>
                <Text style={styles.bulletPoint}>- Employee Code</Text>
              </View>
              <Text style={styles.bulletPoint}>• Installments:</Text>
              <View style={styles.doubleNestedList}>
                <Text style={styles.bulletPoint}>- Installment Plan</Text>
                <Text style={styles.bulletPoint}>- Frequency</Text>
                <Text style={styles.bulletPoint}>- Mode</Text>
                <Text style={styles.bulletPoint}>- No. of Installments</Text>
                <Text style={styles.bulletPoint}>- Advance Installment</Text>
                <Text style={styles.bulletPoint}>- Due Date</Text>
                <Text style={styles.bulletPoint}>- First Installment Date</Text>
              </View>
            </View>
            <Text style={styles.numberedPoint}>5. Bank Officer views the details; system restricts any modification.</Text>
          </View>
        </View>

        {/* Precondition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Precondition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Finance must be disbursed and recorded in FMS.</Text>
          </View>
        </View>

        {/* Post Condition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Post Condition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Finance details are displayed in read-only mode.</Text>
          </View>
        </View>

        {/* Straight Through Process (STP) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Straight Through Process (STP)</Text>
          </View>
          <Text style={styles.text}>
            Login → Navigate to Finance Query Screen → Enter Search Criteria →
            View Finance Details → Logout
          </Text>
        </View>

        {/* Alternative Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Alternative Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Search by Co-applicant or Guarantor Name.</Text>
            <Text style={styles.bulletPoint}>• Search using Branch and Disbursal Date filters.</Text>
          </View>
        </View>

        {/* Exception Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={18} color="#dc2626" />
            <Text style={styles.sectionTitle}>Exception Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Invalid Finance ID entered.</Text>
            <Text style={styles.bulletPoint}>• No matching records found.</Text>
          </View>
        </View>

        {/* User Activity Diagram (Flowchart) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>User Activity Diagram (Flowchart)</Text>
          </View>
          <Text style={styles.text}>
            Start → Login → Enter Query → System Fetches Data → Display Details
            → End
          </Text>
        </View>

        {/* Parking Lot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Parking Lot</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Enable export of finance details to PDF or Excel.</Text>
            <Text style={styles.bulletPoint}>• Add bookmark or save search functionality.</Text>
          </View>
        </View>

        {/* System Components Involved */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>System Components Involved</Text>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>UI</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Finance Viewer Screen in FMS</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>APIs</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Data Fetch from LOS</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>DB Tables</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Finance Master</Text>
              <Text style={styles.bulletPoint}>• Customer Details</Text>
              <Text style={styles.bulletPoint}>• Installment Schedules</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Services</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Query Engine</Text>
              <Text style={styles.bulletPoint}>• Read-Only Data Display Handler</Text>
            </View>
          </View>
        </View>

        {/* Test Scenarios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TestTube size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Test Scenarios</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Valid search using Finance ID.</Text>
            <Text style={styles.bulletPoint}>• Search by Customer Name or Branch.</Text>
            <Text style={styles.bulletPoint}>• Attempt to edit read-only data (negative test).</Text>
            <Text style={styles.bulletPoint}>• Search with no results.</Text>
          </View>
        </View>

        {/* Infra & Deployment Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Server size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Infra & Deployment Notes</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• High system availability needed for frequent access.</Text>
            <Text style={styles.bulletPoint}>• Logging enabled for audit of search/view activities.</Text>
          </View>
        </View>

        {/* Dev Team Ownership */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Dev Team Ownership</Text>
          </View>
          <Text style={styles.text}>
            Squad: Finance Information Services Team{"\n"}
            Contact: Lead Dev - finance_viewer@bankdomain.com{"\n"}
            JIRA: WF-FINANCE-VIEW-01{"\n"}
            Git Repo: /fms/finance-viewer
          </Text>
          <ImageModal imageSource={'https://i.ibb.co/cKxCvbHW/finance-details.jpg'}/>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginLeft: 8,
  },
  subsection: {
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
  },
  listContainer: {
    paddingLeft: 8,
  },
  nestedList: {
    paddingLeft: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  doubleNestedList: {
    paddingLeft: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 4,
  },
  numberedPoint: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 8,
  },
});

export default System_FinanceViewer;