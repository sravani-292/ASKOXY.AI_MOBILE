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
  TrendingDown,
  Shield,
  BarChart3,
  Calendar,
  Database,
  Smartphone,
  GitBranch,
  Menu
} from "lucide-react-native";
import ImageModal from "../../ImageModal";

const System_NPAGrading = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <TrendingDown size={28} color="#ffffff" />
        </View>
        <Text style={styles.headerText}>WF_NPA_Grading</Text>
        <Text style={styles.headerSubtext}>Non-Performing Asset Classification System</Text>
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
              The NPA Grading module in the Financial Management System (FMS)
              enables users to assign risk grades to finance accounts based on
              repayment behavior. This grading supports risk assessment, credit
              monitoring, and financial reporting by identifying delinquent
              clients and classifying loans by risk category.
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
            <View style={styles.actorsGrid}>
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>Business User</Text>
                <View style={styles.actorList}>
                  <View style={styles.actorItem}>
                    <Shield size={14} color="#7c3aed" />
                    <Text style={styles.actorText}>Risk Officer</Text>
                  </View>
                  <View style={styles.actorItem}>
                    <User size={14} color="#7c3aed" />
                    <Text style={styles.actorText}>Credit Admin</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>System Roles</Text>
                <View style={styles.actorList}>
                  <View style={styles.actorItem}>
                    <Settings size={14} color="#2563eb" />
                    <Text style={styles.actorText}>Financial Management System</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>Stakeholders</Text>
                <View style={styles.actorList}>
                  <View style={styles.actorItem}>
                    <BarChart3 size={14} color="#059669" />
                    <Text style={styles.actorText}>Risk Management</Text>
                  </View>
                  <View style={styles.actorItem}>
                    <Users size={14} color="#059669" />
                    <Text style={styles.actorText}>Credit Committee</Text>
                  </View>
                  <View style={styles.actorItem}>
                    <FileText size={14} color="#059669" />
                    <Text style={styles.actorText}>Finance Department</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Process Flow */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.flowIcon]}>
              <List size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Process Flow</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.processSteps}>
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  User logs into FMS and accesses Finance Grading screen
                </Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Selects finance account and defines NPA stage
                </Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Specifies movement direction (Forward/Backward)
                </Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={styles.stepText}>
                  Enters manual grading details if required
                </Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>5</Text>
                </View>
                <Text style={styles.stepText}>
                  Saves grading record for processing
                </Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>6</Text>
                </View>
                <Text style={styles.stepText}>
                  System updates NPA status accordingly
                </Text>
              </View>
            </View>

            {/* NPA Stages */}
            <View style={styles.stagesSection}>
              <Text style={styles.stagesTitle}>NPA Classification Stages:</Text>
              <View style={styles.stagesGrid}>
                <View style={[styles.stageCard, styles.standardStage]}>
                  <Text style={styles.stageTitle}>Standard</Text>
                  <Text style={styles.stageDesc}>Regular repayment</Text>
                </View>
                <View style={[styles.stageCard, styles.substandardStage]}>
                  <Text style={styles.stageTitle}>Sub-standard</Text>
                  <Text style={styles.stageDesc}>DPD 1-90 days</Text>
                </View>
                <View style={[styles.stageCard, styles.doubtfulStage]}>
                  <Text style={styles.stageTitle}>Doubtful</Text>
                  <Text style={styles.stageDesc}>DPD 91-360 days</Text>
                </View>
                <View style={[styles.stageCard, styles.lossStage]}>
                  <Text style={styles.stageTitle}>Loss</Text>
                  <Text style={styles.stageDesc}>DPD 360+ days</Text>
                </View>
              </View>
            </View>

            {/* Manual Grading Fields */}
            <View style={styles.fieldsSection}>
              <Text style={styles.fieldsTitle}>Manual Grading Fields:</Text>
              <View style={styles.fieldsGrid}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldItem}>• Agreement ID</Text>
                  <Text style={styles.fieldItem}>• New NPA Stage</Text>
                  <Text style={styles.fieldItem}>• Remarks</Text>
                  <Text style={styles.fieldItem}>• NPA Change Date</Text>
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldItem}>• Current NPA Stage</Text>
                  <Text style={styles.fieldItem}>• Final NPA Stage</Text>
                  <Text style={styles.fieldItem}>• NPA Reason</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Conditions & STP */}
        <View style={styles.columns}>
          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.successIcon]}>
                  <CheckCircle size={16} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Preconditions</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.conditionList}>
                  <Text style={styles.conditionItem}>• Account flagged for NPA evaluation</Text>
                  <Text style={styles.conditionItem}>• User has grading privileges</Text>
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
                <Text style={styles.sectionTitle}>Post Conditions</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.conditionList}>
                  <Text style={styles.conditionItem}>• NPA grading updated</Text>
                  <Text style={styles.conditionItem}>• Audit trail created</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* STP Flow */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.primaryIcon]}>
              <ArrowRight size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Straight Through Process (STP)</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.stpFlow}>
              <Text style={styles.stpText}>
                Login → Navigate to Grading Screen → Define NPA Stage → Save Grading → Logout
              </Text>
            </View>
          </View>
        </View>

        {/* Alternative & Exception Flows */}
        <View style={styles.columns}>
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
                  <Text style={styles.flowItem}>• Automatic DPD-based grading</Text>
                  <Text style={styles.flowItem}>• Bulk account processing</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.errorIcon]}>
                  <AlertCircle size={16} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Exception Flows</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.exceptionList}>
                  <Text style={styles.exceptionItem}>• Invalid Agreement ID</Text>
                  <Text style={styles.exceptionItem}>• Unauthorized access</Text>
                  <Text style={styles.exceptionItem}>• Missing parameters</Text>
                </View>
              </View>
            </View>
          </View>
        </View>


        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.primaryIcon]}>
              <Menu size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>User Activity Diagram (Flowchart)</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.stpFlow}>
              <Text style={styles.stpText}>
Start → Login → Select Finance → Input Grading Details → Save Entry → NPA Grading Complete → End
              </Text>
            </View>
          </View>
        </View>

  <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.warningIcon]}>
                  <Info size={16} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Parking Lot </Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.flowList}>
                  <Text style={styles.flowItem}>• Integration with credit risk scoring systems.</Text>
                  <Text style={styles.flowItem}>• Dashboard for NPA trend visualization.</Text>
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
                <Smartphone size={20} color="#2563eb" />
                <Text style={styles.componentTitle}>UI Components</Text>
                <View style={styles.componentList}>
                  <Text style={styles.componentItem}>• NPA Grading Screen</Text>
                </View>
              </View>
              
              <View style={styles.componentCard}>
                <Database size={20} color="#059669" />
                <Text style={styles.componentTitle}>Database Tables</Text>
                <View style={styles.componentList}>
                  <Text style={styles.componentItem}>• Finance Accounts</Text>
                  <Text style={styles.componentItem}>• NPA History Log</Text>
                </View>
              </View>
              
              <View style={styles.componentCard}>
                <Settings size={20} color="#dc2626" />
                <Text style={styles.componentTitle}>APIs & Services</Text>
                <View style={styles.componentList}>
                  <Text style={styles.componentItem}>• DPD Calculator</Text>
                  <Text style={styles.componentItem}>• Grading Engine</Text>
                  <Text style={styles.componentItem}>• Workflow Tracker</Text>
                  <Text style={styles.componentItem}>• Audit Logger</Text>
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
                <Text style={styles.testText}>Manual grading validation</Text>
              </View>
              <View style={styles.testCard}>
                <Text style={styles.testText}>Stage regression testing</Text>
              </View>
              <View style={styles.testCard}>
                <Text style={styles.testText}>Auto-grading from DPD</Text>
              </View>
              <View style={styles.testCard}>
                <Text style={styles.testText}>Error handling</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Infrastructure & Future Enhancements */}
        <View style={styles.columns}>
          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.infraIcon]}>
                  <Server size={16} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Infrastructure</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.infraList}>
                  <Text style={styles.infraItem}>• Audit trail requirements</Text>
                  <Text style={styles.infraItem}>• Holiday calendar integration</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.futureIcon]}>
                  <Info size={16} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Future Enhancements</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.futureList}>
                  <View style={styles.futureItem}>
                    <BarChart3 size={14} color="#7c3aed" />
                    <Text style={styles.futureText}>Risk scoring integration</Text>
                  </View>
                  <View style={styles.futureItem}>
                    <TrendingDown size={14} color="#7c3aed" />
                    <Text style={styles.futureText}>NPA trend dashboard</Text>
                  </View>
                </View>
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
                <Text style={styles.ownerValue}>Credit Risk & Provisioning Team</Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>Contact:</Text>
                <Text style={styles.ownerValue}>npa_fms@bankdomain.com</Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>JIRA:</Text>
                <Text style={styles.ownerValue}>WF-NPA-GRADING-01</Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>Git Repo:</Text>
                <Text style={styles.ownerValue}>/fms/npa/grading</Text>
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
            <ImageModal imageSource={'https://i.ibb.co/rR0mxDKS/NPA-GRADING.jpg'}/>
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
    backgroundColor: "#dc2626",
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
    color: "#fecaca",
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
  flowIcon: { backgroundColor: "#2563eb" },
  successIcon: { backgroundColor: "#16a34a" },
  primaryIcon: { backgroundColor: "#2563eb" },
  warningIcon: { backgroundColor: "#d97706" },
  errorIcon: { backgroundColor: "#dc2626" },
  techIcon: { backgroundColor: "#475569" },
  testIcon: { backgroundColor: "#9333ea" },
  infraIcon: { backgroundColor: "#059669" },
  futureIcon: { backgroundColor: "#7c3aed" },
  ownerIcon: { backgroundColor: "#c2410c" },
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
  // Actors Section
  actorsGrid: {
    gap: 12,
  },
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
    marginBottom: 12,
  },
  actorList: {
    gap: 8,
  },
  actorItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actorText: {
    fontSize: 14,
    color: "#475569",
  },
  // Process Flow
  processSteps: {
    gap: 12,
    marginBottom: 20,
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
  // NPA Stages
  stagesSection: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  stagesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  stagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  stageCard: {
    flex: 1,
    minWidth: "45%",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  standardStage: { backgroundColor: "#f0fdf4" },
  substandardStage: { backgroundColor: "#fffbeb" },
  doubtfulStage: { backgroundColor: "#fef3c7" },
  lossStage: { backgroundColor: "#fef2f2" },
  stageTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  stageDesc: {
    fontSize: 11,
    color: "#475569",
    textAlign: "center",
  },
  // Fields Section
  fieldsSection: {
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0ea5e9",
  },
  fieldsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: 12,
  },
  fieldsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  fieldColumn: {
    flex: 1,
  },
  fieldItem: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 6,
  },
  // Layout
  columns: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  // Conditions
  conditionList: {
    gap: 8,
  },
  conditionItem: {
    fontSize: 14,
    color: "#15803d",
    lineHeight: 20,
  },
  // STP Flow
  stpFlow: {
    backgroundColor: "#dbeafe",
    padding: 16,
    borderRadius: 8,
  },
  stpText: {
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
  // Alternative & Exception Flows
  flowList: {
    gap: 8,
  },
  flowItem: {
    fontSize: 13,
    color: "#92400e",
    lineHeight: 18,
  },
  exceptionList: {
    gap: 8,
  },
  exceptionItem: {
    fontSize: 13,
    color: "#dc2626",
    lineHeight: 18,
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
    alignItems: "center",
  },
  componentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
  },
  componentList: {
    gap: 6,
    alignItems: "center",
  },
  componentItem: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
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
  // Infrastructure & Future
  infraList: {
    gap: 8,
  },
  infraItem: {
    fontSize: 13,
    color: "#065f46",
    lineHeight: 18,
  },
  futureList: {
    gap: 12,
  },
  futureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  futureText: {
    fontSize: 13,
    color: "#7c3aed",
    lineHeight: 18,
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
});

export default System_NPAGrading;