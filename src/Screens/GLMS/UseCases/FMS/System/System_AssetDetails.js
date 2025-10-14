import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { FileText, Users, CheckCircle, Info, List, AlertCircle } from "lucide-react-native";
import ImageModal from "../../ImageModal";

const System_AssetDetails = () => { 
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <FileText size={24} color="#ffffff" />
        </View>
        <Text style={styles.headerText}>Asset Details Use Case</Text>
        <Text style={styles.headerSubtext}>Workflow Management System</Text>
      </View>
      
      <View style={styles.card}>
        {/* Use Case Name */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.primaryIcon]}>
              <FileText size={16} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Use Case Name</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>WF_Asset Details</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.infoIcon]}>
              <Info size={16} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.text}>
              This use case describes the process by which a user updates and
              maintains asset details, including insurance and inspection
              information, in the system post-purchase.
            </Text>
          </View>
        </View>

        {/* Actors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.userIcon]}>
              <Users size={16} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Actors</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>User</Text>
            </View>
          </View>
        </View>

        {/* Preconditions & Postconditions */}
        <View style={styles.rowSection}>
          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.successIcon]}>
                  <CheckCircle size={14} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Preconditions</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.listContainer}>
                  <Text style={styles.bulletPoint}>
                    • System must support entry and update of asset details
                  </Text>
                  <Text style={styles.bulletPoint}>
                    • Inspection and insurance information capabilities
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.successIcon]}>
                  <CheckCircle size={14} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Postconditions</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.listContainer}>
                  <Text style={styles.bulletPoint}>
                    • Updated asset details saved
                  </Text>
                  <Text style={styles.bulletPoint}>
                    • Inspection records stored
                  </Text>
                  <Text style={styles.bulletPoint}>
                    • Insurance information updated
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Main Flow */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.flowIcon]}>
              <List size={16} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Main Flow</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.flowSteps}>
              <View style={styles.flowStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.flowText}>
                  User enters asset details in the system after purchase (Supplier, Delivery Order Date, Asset Cost, etc.)
                </Text>
              </View>
              
              <View style={styles.flowStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.flowText}>
                  User physically identifies the asset and ensures its condition and insurance
                </Text>
              </View>
              
              <View style={styles.flowStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.flowText}>
                  User enters inspection details (Asset ID, Agreement No, Inspection Date, Remarks, etc.)
                </Text>
              </View>
              
              <View style={styles.flowStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={styles.flowText}>
                  User enters insurance details (Policy No, Coverage, Dates, Premium, etc.)
                </Text>
              </View>
              
              <View style={styles.flowStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>5</Text>
                </View>
                <Text style={styles.flowText}>
                  System saves all updated details in the database
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Alternative Flows & Exceptions */}
        <View style={styles.rowSection}>
          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.warningIcon]}>
                  <List size={14} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Alternative Flows</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>None specified</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, styles.errorIcon]}>
                  <AlertCircle size={14} color="#ffffff" />
                </View>
                <Text style={styles.sectionTitle}>Exceptions</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>None specified</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Assumptions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.assumptionIcon]}>
              <Info size={16} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Assumptions</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.assumptionBox}>
              <Text style={styles.assumptionText}>
                User has access rights and proper training to enter and manage
                asset-related information in the system.
              </Text>
            </View>
          </View>
        </View>

        {/* Notes and Issues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconContainer, styles.noteIcon]}>
              <Info size={16} color="#ffffff" />
            </View>
            <Text style={styles.sectionTitle}>Notes and Issues</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                Periodic inspections and insurance updates are essential to keep
                data current and ensure compliance with organizational policies.
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <ImageModal imageSource={'https://i.ibb.co/SXBxHxbK/asset-insurance.jpg'}/>
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
    backgroundColor: "#2563eb",
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
    fontSize: 28,
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
  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  column: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  primaryIcon: { backgroundColor: "#2563eb" },
  infoIcon: { backgroundColor: "#0ea5e9" },
  userIcon: { backgroundColor: "#7c3aed" },
  successIcon: { backgroundColor: "#16a34a" },
  flowIcon: { backgroundColor: "#dc2626" },
  warningIcon: { backgroundColor: "#d97706" },
  errorIcon: { backgroundColor: "#dc2626" },
  assumptionIcon: { backgroundColor: "#8b5cf6" },
  noteIcon: { backgroundColor: "#64748b" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    paddingLeft: 38,
  },
  text: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
  tag: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e40af",
  },
  chip: {
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#7c3aed",
  },
  listContainer: {
    paddingLeft: 4,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 4,
  },
  flowSteps: {
    gap: 12,
  },
  flowStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumberText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  flowText: {
    flex: 1,
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  placeholder: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 14,
    color: "#94a3b8",
    fontStyle: "italic",
    textAlign: "center",
  },
  assumptionBox: {
    backgroundColor: "#faf5ff",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#8b5cf6",
  },
  assumptionText: {
    fontSize: 14,
    color: "#6b21a8",
    lineHeight: 20,
    fontStyle: "italic",
  },
  noteBox: {
    backgroundColor: "#f1f5f9",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#64748b",
    marginBottom: 16,
  },
  noteText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default System_AssetDetails;