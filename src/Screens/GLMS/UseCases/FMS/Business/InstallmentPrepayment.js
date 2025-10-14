import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { DollarSign, Users, PlayCircle, CheckCircle, FileText, ArrowRight, Calendar, CreditCard } from 'lucide-react-native';
import ImageModal from '../../ImageModal';

// Main Component
const InstallmentPrepayment = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <DollarSign size={28} color="#ffffff" />
        </View>
        <Text style={styles.headerText}>Work Flow – Installment Prepayment</Text>
        <Text style={styles.headerSubtext}>Advanced Payment Processing System</Text>
      </View>
      
      <View style={styles.content}>
        {/* Overview Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.primaryIcon]}>
              <FileText size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.paragraph}>
              The Installment Prepayment feature allows the user to receive a Prepayment Amount from the customer against Installments Outstanding. The user can enter payment given in advance by the customer for future installments, which reduces the loan tenure by allocating the amount towards the last installments.
            </Text>
          </View>
        </View>

        {/* Actors & Conditions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.userIcon]}>
              <Users size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Actors & Conditions</Text>
          </View>
          <View style={styles.sectionBody}>
            {/* Actors */}
            <View style={styles.actorsGrid}>
              <View style={styles.actorCard}>
                <Text style={styles.actorTitle}>Primary Actors</Text>
                <View style={styles.actorList}>
                  <View style={styles.actorItem}>
                    <Users size={14} color="#7c3aed" />
                    <Text style={styles.actorText}>User (Finance Officer)</Text>
                  </View>
                  <View style={styles.actorItem}>
                    <CreditCard size={14} color="#7c3aed" />
                    <Text style={styles.actorText}>Customer</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.actionsCard}>
                <Text style={styles.actionsTitle}>Key Actions</Text>
                <View style={styles.actionsList}>
                  <Text style={styles.actionItem}>• Processes prepayment of installments</Text>
                  <Text style={styles.actionItem}>• Pays prepayment as advance</Text>
                </View>
              </View>
            </View>

            {/* Conditions */}
            <View style={styles.conditionsRow}>
              <View style={styles.conditionBox}>
                <View style={styles.conditionHeader}>
                  <PlayCircle size={16} color="#dc2626" />
                  <Text style={styles.conditionTitle}>Pre Condition</Text>
                </View>
                <Text style={styles.conditionText}>
                  Prepayment amount received from customer needs processing
                </Text>
              </View>

              <View style={styles.conditionBox}>
                <View style={styles.conditionHeader}>
                  <CheckCircle size={16} color="#16a34a" />
                  <Text style={styles.conditionTitle}>Post Condition</Text>
                </View>
                <Text style={styles.conditionText}>
                  Installment prepayment completed successfully
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Work Flow Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.flowIcon]}>
              <ArrowRight size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Work Flow Process</Text>
          </View>
          <View style={styles.sectionBody}>
            {/* Process Steps */}
            <View style={styles.processSteps}>
              <View style={styles.processStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Receive Payment</Text>
                  <Text style={styles.stepDescription}>
                    User receives the prepayment amount from the customer
                  </Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Access System</Text>
                  <Text style={styles.stepDescription}>
                    User opens Financial Management System application
                  </Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Navigate to Screen</Text>
                  <Text style={styles.stepDescription}>
                    User navigates to Installment Prepayment screen
                  </Text>
                </View>
              </View>

              <View style={styles.processStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Enter Payment Details</Text>
                  <Text style={styles.stepDescription}>
                    User enters required payment information
                  </Text>
                </View>
              </View>
            </View>

            {/* Payment Fields */}
            <View style={styles.fieldsSection}>
              <Text style={styles.fieldsTitle}>Required Payment Fields:</Text>
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

            {/* System Processing */}
            <View style={styles.processingCard}>
              <View style={styles.processingHeader}>
                <Calendar size={16} color="#d97706" />
                <Text style={styles.processingTitle}>System Processing</Text>
              </View>
              <Text style={styles.processingText}>
The amount received will be allocated towards the last installment, and the tenure will be reduced by the number of installments prepaid by the customer towards the last installments.              </Text>
            </View>

            {/* Completion Steps */}
            <View style={styles.completionSteps}>
              <View style={styles.completionStep}>
                <View style={styles.completionIndicator}>
                  <CheckCircle size={16} color="#16a34a" />
                </View>
                <Text style={styles.completionText}>
User saves the record once the process is completed or resets the details.
                </Text>
              </View>
              <View style={styles.completionStep}>
                <View style={styles.completionIndicator}>
                  <CheckCircle size={16} color="#16a34a" />
                </View>
                <Text style={styles.completionText}>
Installment prepayment is done successfully.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Flowchart Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.flowchartIcon]}>
              <ArrowRight size={18} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Process Summary</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.flowchart}>
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>1</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User receives prepayment amount from customer
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>2</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User opens Financial Management System
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>3</Text>
                </View>
                <Text style={styles.flowchartText}>
                  Navigates to Installment Prepayment screen
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>4</Text>
                </View>
                <Text style={styles.flowchartText}>
                  Enters payment details (Prepayment ID, Customer Name, etc.)
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>5</Text>
                </View>
                <Text style={styles.flowchartText}>
                  System allocates amount and reduces tenure
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>6</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User saves record or resets details
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>7</Text>
                </View>
                <Text style={styles.flowchartText}>
                  Prepayment process completed successfully
                </Text>
              </View>
            </View>
            
            <View style={styles.imageContainer}>
              <ImageModal imageSource={'https://i.ibb.co/nq6ZjnXL/installprepayment.jpg'}/>
            </View>
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
  content: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    overflow: "hidden",
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 16,
    borderLeftWidth: 4,
  },
  primaryIcon: { 
    backgroundColor: "#059669",
    borderLeftColor: "#059669",
  },
  userIcon: { 
    backgroundColor: "#7c3aed",
    borderLeftColor: "#7c3aed",
  },
  flowIcon: { 
    backgroundColor: "#dc2626",
    borderLeftColor: "#dc2626",
  },
  flowchartIcon: { 
    backgroundColor: "#d97706",
    borderLeftColor: "#d97706",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  sectionBody: {
    padding: 20,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
    textAlign: "justify",
  },
  // Actors & Conditions
  actorsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  actorCard: {
    flex: 1,
    backgroundColor: "#faf5ff",
    padding: 16,
    borderRadius: 8,
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
    fontSize: 13,
    color: "#475569",
  },
  actionsCard: {
    flex: 1,
    backgroundColor: "#f0f9ff",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0ea5e9",
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  actionsList: {
    gap: 6,
  },
  actionItem: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  conditionsRow: {
    flexDirection: "row",
    gap: 16,
  },
  conditionBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  conditionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  conditionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  conditionText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  // Process Steps
  processSteps: {
    gap: 0,
    marginBottom: 24,
  },
  processStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: 16,
    width: 24,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  stepNumberText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  stepLine: {
    width: 2,
    backgroundColor: "#d1d5db",
    flex: 1,
    marginTop: 4,
    minHeight: 40,
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  // Fields Section
  fieldsSection: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  fieldsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
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
  // Processing Card
  processingCard: {
    backgroundColor: "#fffbeb",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#d97706",
    marginBottom: 20,
  },
  processingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  processingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400e",
    marginLeft: 8,
  },
  processingText: {
    fontSize: 14,
    color: "#b45309",
    lineHeight: 20,
  },
  // Completion Steps
  completionSteps: {
    gap: 12,
  },
  completionStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  completionIndicator: {
    marginTop: 2,
  },
  completionText: {
    flex: 1,
    fontSize: 14,
    color: "#15803d",
    lineHeight: 20,
    fontWeight: "500",
  },
  // Flowchart
  flowchart: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  flowchartStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  flowchartNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#d97706",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  flowchartNumberText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  flowchartText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    paddingTop: 2,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default InstallmentPrepayment;