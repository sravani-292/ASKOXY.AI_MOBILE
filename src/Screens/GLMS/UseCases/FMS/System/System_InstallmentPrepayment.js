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
  DollarSign,
  Calculator,
  Database,
  Smartphone,
  Mail,
  Menu
} from "lucide-react-native";
import ImageModal from "../../ImageModal";

const System_InstallmentPrepayment = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <DollarSign size={28} color="#ffffff" />
        </View>
        <Text style={styles.headerText}>WF_Installment_Prepayment</Text>
        <Text style={styles.headerSubtext}>Financial Management System</Text>
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
              The Installment Prepayment feature allows the Financial Management
              System (FMS) to process advance payments from customers toward their
              future installments. This functionality enables efficient loan
              management by reducing loan tenure and re-allocating installments
              when prepayment is made.
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
                    <User size={14} color="#7c3aed" />
                    <Text style={styles.actorText}>Bank Officer</Text>
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
                    <Users size={14} color="#059669" />
                    <Text style={styles.actorText}>Finance Department</Text>
                  </View>
                  <View style={styles.actorItem}>
                    <FileText size={14} color="#059669" />
                    <Text style={styles.actorText}>Loan Operations</Text>
                  </View>
                  <View style={styles.actorItem}>
                    <User size={14} color="#059669" />
                    <Text style={styles.actorText}>Customer</Text>
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
                  Customer provides prepayment amount toward future installments
                </Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  User logs into FMS and navigates to Installment Prepayment screen
                </Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Enters payment details and customer information
                </Text>
              </View>
               {/* Payment Fields */}
            <View style={styles.fieldsSection}>
              <Text style={styles.fieldsTitle}>Required Payment Details:</Text>
              <View style={styles.fieldsGrid}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldItem}>• Prepayment ID</Text>
                  <Text style={styles.fieldItem}>• Customer Name</Text>
                  <Text style={styles.fieldItem}>• Agreement ID</Text>
                  <Text style={styles.fieldItem}>• Prepayment Amount</Text>
                  <Text style={styles.fieldItem}>• Account No</Text>
                  <Text style={styles.fieldItem}>• Agreement Number</Text>
                  <Text style={styles.fieldItem}>• Installment Amount</Text>
                  <Text style={styles.fieldItem}>• Principal Amount</Text>
                                    <Text style={styles.fieldItem}>• Balance Installment Amount</Text>

                </View>
               
              </View>
            </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={styles.stepText}>
                  System calculates number of installments covered by prepayment
                </Text>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>5</Text>
                </View>
                <Text style={styles.stepText}>
System updates the installment schedule:
                </Text>
              </View>

            <View style={styles.fieldsSection}>
              <View style={styles.fieldsGrid}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldItem}>• Allocates the received amount to the last installment(s).</Text>
                  <Text style={styles.fieldItem}>• Reduces the loan tenure accordingly.</Text>
                </View>
               
              </View>
            </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>6</Text>
                </View>
                <Text style={styles.stepText}>
User saves or resets the record.
                </Text>
              </View>
            </View>
            <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>6</Text>
                </View>
                <Text style={styles.stepText}>
System confirms successful prepayment entry.
                </Text>
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
                  <Text style={styles.conditionItem}>• Valid prepayment amount provided</Text>
                  <Text style={styles.conditionItem}>• Active loan agreement exists</Text>
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
                  <Text style={styles.conditionItem}>• Prepayment applied</Text>
                  <Text style={styles.conditionItem}>• Loan tenure adjusted</Text>
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
                Receive Prepayment → Login to FMS → Navigate to Prepayment Screen →
                Enter Details → Save Entry → Tenure Updated → Logout
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
                  <ArrowRight size={16} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Alternative Flows</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.flowList}>
                  <Text style={styles.flowItem}>• Manual allocation for business rules</Text>
                  <Text style={styles.flowItem}>• Partial prepayment across agreements</Text>
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
                  <Text style={styles.exceptionItem}>• Invalid account details</Text>
                  <Text style={styles.exceptionItem}>• Minimum amount not met</Text>
                  <Text style={styles.exceptionItem}>• System downtime</Text>
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
               Start → Receive Prepayment → Enter Prepayment Info → System Calculates Installments → Save Entry → Update Schedule → End
              </Text>
            </View>
          </View>
        </View>



<View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.successIcon]}>
                  <Info size={16} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Parking Lot</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.conditionList}>
                  <Text style={styles.conditionItem}>• Option to re-apply prepayments against principal vs. tenure.</Text>
                  <Text style={styles.conditionItem}>• Automated SMS/email alerts for prepayment acknowledgment.</Text>
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
                  <Text style={styles.componentItem}>• Installment Prepayment Screen</Text>
                </View>
              </View>
              
              <View style={styles.componentCard}>
                <Database size={20} color="#059669" />
                <Text style={styles.componentTitle}>Database Tables</Text>
                <View style={styles.componentList}>
                  <Text style={styles.componentItem}>• Installment Ledger</Text>
                  <Text style={styles.componentItem}>• Customer Agreement</Text>
                </View>
              </View>
              
              <View style={styles.componentCard}>
                <Settings size={20} color="#dc2626" />
                <Text style={styles.componentTitle}>APIs & Services</Text>
                <View style={styles.componentList}>
                  <Text style={styles.componentItem}>• Prepayment Processor</Text>
                  <Text style={styles.componentItem}>• Schedule Updater</Text>
                  <Text style={styles.componentItem}>• Recalculation Engine</Text>
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
                <Text style={styles.testText}>Prepayment of 1-3 installments</Text>
              </View>
              <View style={styles.testCard}>
                <Text style={styles.testText}>Tenure update verification</Text>
              </View>
              <View style={styles.testCard}>
                <Text style={styles.testText}>Invalid data rejection</Text>
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
                  <Text style={styles.infraItem}>• Regulatory compliance checks</Text>
                  <Text style={styles.infraItem}>• Batch process scheduling</Text>
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
                    <Calculator size={14} color="#7c3aed" />
                    <Text style={styles.futureText}>Principal vs tenure allocation</Text>
                  </View>
                  <View style={styles.futureItem}>
                    <Mail size={14} color="#7c3aed" />
                    <Text style={styles.futureText}>Automated SMS/email alerts</Text>
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
                <Text style={styles.ownerValue}>Loan Management Systems Team</Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>Contact:</Text>
                <Text style={styles.ownerValue}>prepayment_fms@bankdomain.com</Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>JIRA:</Text>
                <Text style={styles.ownerValue}>WF-INST-PREPAY-01</Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerLabel}>Git Repo:</Text>
                <Text style={styles.ownerValue}>/fms/installment/prepayment</Text>
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
            <ImageModal imageSource={'https://i.ibb.co/nq6ZjnXL/installprepayment.jpg'}/>
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
    backgroundColor: "#059669",
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
    color: "#d1fae5",
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
    backgroundColor: "#dc2626",
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
    gap: 8,
  },
  testCard: {
    backgroundColor: "#faf5ff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9d5ff",
  },
  testText: {
    fontSize: 14,
    color: "#7c3aed",
    fontWeight: "500",
    textAlign: "center",
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

export default System_InstallmentPrepayment;