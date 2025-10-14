import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Printer, User, FileText, CheckCircle, AlertCircle, List } from "lucide-react-native";
import ImageModal from "../../ImageModal";

// Main Component
const PDCPrinting = () => {
  return (
    <ScrollView style={styles.container}> 
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Printer size={24} color="#ffffff" />
        </View>
        <Text style={styles.headerText}>Work Flow – PDC Printing</Text>
        <Text style={styles.headerSubtext}>Post-Dated Cheque Processing System</Text>
      </View>
      
      <View style={styles.content}>
        {/* Overview Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.primaryIcon]}>
              <FileText size={16} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.paragraph}>
              Once the finance application is approved by the underwriter, the
              customer is required to provide certain documents at the PDOC stage
              and specify the mode of repayment for the finance. The customer can
              choose cash, PDC, ATM, or remittance as the mode of repayment. When
              the mode of repayment is PDC, the customer provides blank PDCs for
              the entire tenure. Once the blank PDCs are received from the
              customer, the system shall print the PDCs for the finance
              application with the Payee Name, due date as the cheque date, and
              the installment amount on all the cheques as per the repayment
              schedule.
            </Text>
          </View>
        </View>

        {/* Actor & Conditions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.userIcon]}>
              <User size={16} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Actor & Conditions</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Actor:</Text>
              <View style={styles.chipContainer}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>User</Text>
                </View>
              </View>
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Actions:</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightText}>
                  User receives the PDC cheques from the customer and initiates the
                  PDC printing process in the System.
                </Text>
              </View>
            </View>

            <View style={styles.conditionsRow}>
              <View style={styles.conditionBox}>
                <View style={styles.conditionHeader}>
                  <CheckCircle size={14} color="#16a34a" />
                  <Text style={styles.conditionTitle}>Pre Conditions</Text>
                </View>
                <Text style={styles.conditionText}>
                  Submission of PDC cheques and Mode of repayment should be PDC.
                </Text>
              </View>

              <View style={styles.conditionBox}>
                <View style={styles.conditionHeader}>
                  <CheckCircle size={14} color="#16a34a" />
                  <Text style={styles.conditionTitle}>Post Conditions</Text>
                </View>
                <Text style={styles.conditionText}>
                  Cheques printed with installment amount, Payee Name, and due date.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Work Flow Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.flowIcon]}>
              <List size={16} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Work Flow</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.workflowSteps}>
              <View style={styles.workflowStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <Text style={styles.stepText}>
                  User receives the PDC cheques from the customer for use in finance repayment.
                </Text>
              </View>

              <View style={styles.workflowStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <Text style={styles.stepText}>
                  User enters PDC as the mode of payment and saves the repayment information in the System.
                </Text>
              </View>

              <View style={styles.workflowStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <Text style={styles.stepText}>
                  User enters the PDCs list on the PDC collections section. System displays the PDC Print screen.
                </Text>
              </View>

              <View style={styles.workflowStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>4</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <Text style={styles.stepText}>
                  User selects the Application ID/Agreement ID and submits to search the application/finance details.
                </Text>
              </View>

              <View style={styles.workflowStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>5</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <Text style={styles.stepText}>
                  User checks the details of all the due installments for cheque printing.
                </Text>
              </View>

              <View style={styles.workflowStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>6</Text>
                  </View>
                  <View style={styles.stepLine} />
                </View>
                <Text style={styles.stepText}>
                  User enters the blank cheques received from the customer in the printer.
                </Text>
              </View>

              <View style={styles.workflowStep}>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>7</Text>
                  </View>
                </View>
                <Text style={styles.stepText}>
                  Cheques are printed with Payee Name, Due Date, and installment amount for selected installments.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.noteIcon]}>
              <AlertCircle size={16} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Important Notes</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.notesGrid}>
              <View style={styles.noteCard}>
                {/* <Text style={styles.noteTitle}>Re-printing</Text> */}
                <Text style={styles.noteText}>
The User can print a cheque of a particular installment more than once by inserting another PDC received from the customer in case a particular PDC is not printed correctly.                </Text>
              </View>

              <View style={styles.noteCard}>
                {/* <Text style={styles.noteTitle}>Financial Changes</Text> */}
                <Text style={styles.noteText}>
If there is a change in any of the financial parameters of the finance which will change the installment amount, the User can print the cheques for the new installment amount when the customer provides a new PDC.                </Text>
              </View>

              <View style={styles.noteCard}>
                {/* <Text style={styles.noteTitle}>Date Filtering</Text> */}
                <Text style={styles.noteText}>
The System will show only those installments for printing for which the due date is greater than the current system date.                 </Text>
              </View>

              <View style={styles.noteCard}>
                {/* <Text style={styles.noteTitle}>Deferral Cases</Text> */}
                <Text style={styles.noteText}>
If the customer wishes to change the PDC or a new PDC needs to be printed in case of deferral of installments, the repayment schedule of the finance from the System will be available on the PDC Printing screen for the User to print the cheques.                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Flowchart Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.flowchartIcon]}>
              <List size={16} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Flowchart Summary</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.flowchart}>
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>1</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User receives PDC cheques from customer for finance repayment
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>2</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User enters PDC as payment mode and saves repayment information
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>3</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User enters PDCs list, System displays PDC Print screen
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>4</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User selects Application ID/Agreement ID, System displays details
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>5</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User checks due installment details for printing
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>6</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User places blank cheques in printer
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>7</Text>
                </View>
                <Text style={styles.flowchartText}>
                  Cheques printed with Payee Name, Due Date, and amount
                </Text>
              </View>
            </View>
            <View style={styles.imageContainer}>
              <ImageModal imageSource={'https://i.ibb.co/yngtGw2R/pdc-printing.jpg'} />
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
    backgroundColor: "#1e40af",
    borderLeftColor: "#1e40af",
  },
  userIcon: { 
    backgroundColor: "#7c3aed",
    borderLeftColor: "#7c3aed",
  },
  flowIcon: { 
    backgroundColor: "#dc2626",
    borderLeftColor: "#dc2626",
  },
  noteIcon: { 
    backgroundColor: "#d97706",
    borderLeftColor: "#d97706",
  },
  flowchartIcon: { 
    backgroundColor: "#059669",
    borderLeftColor: "#059669",
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionBody: {
    padding: 20,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
    textAlign: "justify",
  },
  subSection: {
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
  },
  chip: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3730a3",
  },
  highlightBox: {
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#0ea5e9",
  },
  highlightText: {
    fontSize: 14,
    color: "#0369a1",
    lineHeight: 20,
  },
  conditionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  conditionBox: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dcfce7",
  },
  conditionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  conditionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#166534",
    marginLeft: 6,
    textTransform: "uppercase",
  },
  conditionText: {
    fontSize: 13,
    color: "#15803d",
    lineHeight: 18,
  },
  workflowSteps: {
    gap: 0,
  },
  workflowStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepIndicator: {
    alignItems: "center",
    marginRight: 12,
    width: 24,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1e40af",
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
    minHeight: 30,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    paddingTop: 2,
  },
  notesGrid: {
    gap: 12,
  },
  noteCard: {
    backgroundColor: "#fffbeb",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 6,
  },
  noteText: {
    fontSize: 13,
    color: "#b45309",
    lineHeight: 18,
  },
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
    backgroundColor: "#059669",
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

export default PDCPrinting;