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
  Printer,
  Shield,
  GitBranch,
} from "lucide-react-native";
import ImageModal from "../../ImageModal";

const PDC_Printing_Use_Case = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Printer size={28} color="#ffffff" />
        </View>
        <Text style={styles.headerText}>PDC Printing Use Case</Text>
        <Text style={styles.headerSubtext}>Post-Dated Cheque Processing System</Text>
      </View>
      
      <View style={styles.card}>
        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.infoIcon]}>
              <Info size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.text}>
              This use case describes the process of printing Post Dated Cheques
              (PDCs) once a finance application has been approved and the customer
              has opted to repay via PDCs. The process includes collecting blank
              cheques, saving repayment details, and printing cheques with
              appropriate installment information based on the repayment schedule.
            </Text>
          </View>
        </View>

        {/* Actors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.userIcon]}>
              <Users size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Actors & Stakeholders</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.columns}>
              <View style={styles.column}>
                <View style={styles.actorCard}>
                  <Text style={styles.actorTitle}>Customer-facing</Text>
                  <View style={styles.actorList}>
                    <Text style={styles.actorItem}>• Finance Officer</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.column}>
                <View style={styles.actorCard}>
                  <Text style={styles.actorTitle}>System Roles</Text>
                  <View style={styles.actorList}>
                    <Text style={styles.actorItem}>• Loan Origination System</Text>
                    <Text style={styles.actorItem}>• PDC Printing Module</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.column}>
                <View style={styles.actorCard}>
                  <Text style={styles.actorTitle}>Software Team</Text>
                  <View style={styles.actorList}>
                    <Text style={styles.actorItem}>• API Developer</Text>
                    <Text style={styles.actorItem}>• QA Engineer</Text>
                    <Text style={styles.actorItem}>• Infra Team</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* User Actions & System Responses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.flowIcon]}>
              <List size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Process Flow</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.processFlow}>
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>User receives blank PDCs from customer</Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>User sets 'PDC' as repayment mode</Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>System enables PDC collections section</Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={styles.stepText}>User enters Application ID</Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>5</Text>
                </View>
                <Text style={styles.stepText}>System displays due installments</Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>6</Text>
                </View>
                <Text style={styles.stepText}>User inserts cheques into printer</Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>7</Text>
                </View>
                <Text style={styles.stepText}>System prints cheques with details</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Conditions & Flows */}
        <View style={styles.columns}>
          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.successIcon]}>
                  <CheckCircle size={16} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Precondition</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.conditionBox}>
                  <Text style={styles.conditionText}>
                    Customer must have submitted PDC cheques and selected 'PDC' as repayment mode
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.successIcon]}>
                  <CheckCircle size={16} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Post Condition</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.conditionBox}>
                  <Text style={styles.conditionText}>
                    PDCs printed with correct details, ready for installment processing
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* STP & Alternative Flows */}
        <View style={styles.columns}>
          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.primaryIcon]}>
                  <ArrowRight size={16} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>STP Flow</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.stpBox}>
                  <Text style={styles.stpText}>
                    Login → Enter App ID → Insert Cheques → Print → Logout
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.warningIcon]}>
                  <GitBranch size={16} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Alternative Flows</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.flowList}>
                  <Text style={styles.flowItem}>• Reprint for misprints</Text>
                  <Text style={styles.flowItem}>• Revised cheques for updates</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Exception Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.errorIcon]}>
              <AlertCircle size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Exception Flows</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.exceptionGrid}>
              <View style={styles.exceptionCard}>
                <Text style={styles.exceptionTitle}>Hardware Issues</Text>
                <Text style={styles.exceptionText}>Printer jam or error</Text>
              </View>
              
              <View style={styles.exceptionCard}>
                <Text style={styles.exceptionTitle}>Input Errors</Text>
                <Text style={styles.exceptionText}>Incorrect Application ID</Text>
              </View>
              
              <View style={styles.exceptionCard}>
                <Text style={styles.exceptionTitle}>Supply Issues</Text>
                <Text style={styles.exceptionText}>Missing/invalid cheque paper</Text>
              </View>
            </View>
          </View>
        </View>

        {/* System Components */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.techIcon]}>
              <Settings size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>System Components</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.componentsGrid}>
              <View style={styles.componentCard}>
                <Text style={styles.componentTitle}>UI Components</Text>
                <View style={styles.componentList}>
                  <Text style={styles.componentItem}>• PDC Collections Screen</Text>
                  <Text style={styles.componentItem}>• Print Interface</Text>
                </View>
              </View>
              
              <View style={styles.componentCard}>
                <Text style={styles.componentTitle}>APIs</Text>
                <View style={styles.componentList}>
                  <Text style={styles.componentItem}>• Application Lookup</Text>
                  <Text style={styles.componentItem}>• Installment Fetch</Text>
                </View>
              </View>
              
              <View style={styles.componentCard}>
                <Text style={styles.componentTitle}>Database</Text>
                <View style={styles.componentList}>
                  <Text style={styles.componentItem}>• RepaymentSchedule</Text>
                  <Text style={styles.componentItem}>• ChequePrintLog</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Test Scenarios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.testIcon]}>
              <TestTube size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Test Scenarios</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.testGrid}>
              <View style={styles.testCard}>
                <Text style={styles.testText}>✓ Successful printing</Text>
              </View>
              <View style={styles.testCard}>
                <Text style={styles.testText}>✓ Invalid ID handling</Text>
              </View>
              <View style={styles.testCard}>
                <Text style={styles.testText}>✓ Printer errors</Text>
              </View>
              <View style={styles.testCard}>
                <Text style={styles.testText}>✓ Schedule updates</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Infra & Deployment */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.infraIcon]}>
              <Server size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Infrastructure & Deployment</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.infraList}>
              <View style={styles.infraItem}>
                <Shield size={14} color="#059669" />
                <Text style={styles.infraText}>Secure printer connectivity</Text>
              </View>
              <View style={styles.infraItem}>
                <Settings size={14} color="#059669" />
                <Text style={styles.infraText}>Pre-installed printer drivers</Text>
              </View>
              <View style={styles.infraItem}>
                <GitBranch size={14} color="#059669" />
                <Text style={styles.infraText}>Phased regional rollout</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Ownership */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.ownerIcon]}>
              <User size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Development Ownership</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.ownerCard}>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>Squad:</Text>
                <Text style={styles.ownerValue}>Lending Ops Automation</Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>Contact:</Text>
                <Text style={styles.ownerValue}>lending-tech-lead@company.com</Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>Jira:</Text>
                <Text style={styles.ownerValue}>PDC-PRINT-101</Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>Repo:</Text>
                <Text style={styles.ownerValue}>gitlab.com/company/lending/pdc-printing</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Parking Lot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.parkingIcon]}>
              <Info size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Future Enhancements</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.parkingGrid}>
              <View style={styles.parkingCard}>
                <Text style={styles.parkingText}>Digital cheque systems</Text>
              </View>
              <View style={styles.parkingCard}>
                <Text style={styles.parkingText}>OCR verification</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Diagram */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.diagramIcon]}>
              <FileText size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Process Diagram</Text>
          </View>
          <View style={styles.sectionContent}>
            <ImageModal imageSource={'https://i.ibb.co/yngtGw2R/pdc-printing.jpg'}/>
          </View>
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
    backgroundColor: "#1e40af",
    padding: 24,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 50,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 14,
    color: "#dbeafe",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    margin: 16,
    marginTop: 0,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoIcon: { backgroundColor: "#0ea5e9" },
  userIcon: { backgroundColor: "#7c3aed" },
  flowIcon: { backgroundColor: "#dc2626" },
  successIcon: { backgroundColor: "#16a34a" },
  primaryIcon: { backgroundColor: "#2563eb" },
  warningIcon: { backgroundColor: "#d97706" },
  errorIcon: { backgroundColor: "#dc2626" },
  techIcon: { backgroundColor: "#475569" },
  testIcon: { backgroundColor: "#9333ea" },
  infraIcon: { backgroundColor: "#059669" },
  ownerIcon: { backgroundColor: "#c2410c" },
  parkingIcon: { backgroundColor: "#6b7280" },
  diagramIcon: { backgroundColor: "#be185d" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  sectionContent: {
    // Content styles will inherit from parent
  },
  text: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    textAlign: "justify",
  },
  columns: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  // Actors Section
  actorCard: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#7c3aed",
  },
  actorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  actorList: {
    paddingLeft: 8,
  },
  actorItem: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 4,
  },
  // Process Flow
  processFlow: {
    gap: 12,
  },
  processStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  // Conditions
  conditionBox: {
    backgroundColor: "#f0fdf4",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  conditionText: {
    fontSize: 14,
    color: "#15803d",
    lineHeight: 20,
    textAlign: "center",
  },
  // STP
  stpBox: {
    backgroundColor: "#dbeafe",
    padding: 16,
    borderRadius: 8,
  },
  stpText: {
    fontSize: 13,
    color: "#1e40af",
    fontWeight: "500",
    textAlign: "center",
  },
  // Alternative Flows
  flowList: {
    gap: 8,
  },
  flowItem: {
    fontSize: 13,
    color: "#92400e",
    lineHeight: 18,
  },
  // Exceptions
  exceptionGrid: {
    gap: 12,
  },
  exceptionCard: {
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  exceptionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 4,
  },
  exceptionText: {
    fontSize: 13,
    color: "#b91c1c",
  },
  // System Components
  componentsGrid: {
    gap: 12,
  },
  componentCard: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  componentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  componentList: {
    paddingLeft: 8,
  },
  componentItem: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 4,
  },
  // Test Scenarios
  testGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  testCard: {
    backgroundColor: "#faf5ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  testText: {
    fontSize: 12,
    color: "#7c3aed",
    fontWeight: "500",
  },
  // Infrastructure
  infraList: {
    gap: 12,
  },
  infraItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 8,
  },
  infraText: {
    fontSize: 14,
    color: "#065f46",
    fontWeight: "500",
  },
  // Ownership
  ownerCard: {
    backgroundColor: "#fffbeb",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#c2410c",
  },
  ownerInfo: {
    flexDirection: "row",
    marginBottom: 8,
  },
  ownerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400e",
    width: 80,
  },
  ownerValue: {
    fontSize: 14,
    color: "#b45309",
    flex: 1,
  },
  // Parking Lot
  parkingGrid: {
    flexDirection: "row",
    gap: 12,
  },
  parkingCard: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  parkingText: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default PDC_Printing_Use_Case;