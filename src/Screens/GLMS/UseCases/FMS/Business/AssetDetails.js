import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ImageModal from "../../ImageModal";

// Main Component
const AssetDetails = () => {
  return (
    <ScrollView style={styles.container}> 
      <View style={styles.content}>
        <Text style={styles.title}>
          Work Flow – Maintains the Asset Details
        </Text>
        
        {/* Overview Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.paragraph}>
              At the time of entering finance details in the Loan Origination
              System, information about the asset for which the finance is sought
              is entered. This information includes details such as type,
              description, cost, age, and remaining life of the asset. After the
              asset is purchased, the bank needs to ensure that the details of the
              asset are updated in the system. Also, the bank needs to
              periodically inspect the condition of the asset and ensure that it
              is insured adequately.
            </Text>
          </View>
        </View>

        {/* Actor & Conditions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actor & Conditions</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Actor:</Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• User</Text>
              </View>
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Actions:</Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>
                  • User: Updates the Asset details and insurance details in the
                  System.
                </Text>
              </View>
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Pre Condition:</Text>
              <Text style={styles.paragraph}>
                System should support to capture the Asset details and insurance
                details.
              </Text>
            </View>

            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Post Condition:</Text>
              <Text style={styles.paragraph}>
                Updated Asset details and insurance details saved in database.
              </Text>
            </View>
          </View>
        </View>

        {/* Work Flow Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Work Flow</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.workflowStep}>
            
              <View style={styles.stepContent}>
               
                <View style={styles.detailsList}>
                   <Text style={styles.detailsItem}>
                   • After the asset is purchased by the customer, the User updates and
                  maintains the following details of the asset in the system:
                </Text>
                  <Text style={styles.detailsItem}>• Supplier</Text>
                  <Text style={styles.detailsItem}>• Delivery Order Date</Text>
                  <Text style={styles.detailsItem}>• Asset Cost</Text>
                  <Text style={styles.detailsItem}>• Origination State</Text>
                  <Text style={styles.detailsItem}>• Installation State</Text>
                  <Text style={styles.detailsItem}>• Registration Number, etc.</Text>
                  <Text style={styles.detailsItem}>
                  • Once the User updates the asset details in the system, the User
                  needs to physically identify the asset and ensure that it is
                  maintained in a good condition and is adequately insured, and
                  maintains the following inspection details of the asset in the
                  System:
                </Text>
                   <Text style={styles.detailsItem}>• Asset ID</Text>
                  <Text style={styles.detailsItem}>• Agreement No</Text>
                  <Text style={styles.detailsItem}>• Inspection Date</Text>
                  <Text style={styles.detailsItem}>• Remarks</Text>
                  <Text style={styles.detailsItem}>• Defect Reason (If any)</Text>
                  <Text style={styles.detailsItem}>• Inspection Done By</Text>
                  <Text style={styles.detailsItem}>• Next Inspection Date</Text>
                   <Text style={styles.detailsItem}>
                  • After inspection details are entered in the system, the User
                  captures the following insurance details in the system:
                </Text>
                 <Text style={styles.detailsItem}>• Asset Description</Text>
                  <Text style={styles.detailsItem}>• Nature of Insurance</Text>
                  <Text style={styles.detailsItem}>• Policy No</Text>
                  <Text style={styles.detailsItem}>• Coverage / Insured Amount</Text>
                  <Text style={styles.detailsItem}>• Insured Date</Text>
                  <Text style={styles.detailsItem}>• Expiry Date</Text>
                  <Text style={styles.detailsItem}>• Premium</Text>
                  <Text style={styles.detailsItem}>• Insurance Company</Text>
                    <Text style={styles.stepDescription}>
                 • System saves the updated details in the database.
                </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Flowchart Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Flowchart Summary</Text>
          </View>
          <View style={styles.sectionBody}>
            <View style={styles.flowchart}>
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>1</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User: Maintains the details of the updated asset in the system.
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>2</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User: Physically identifies the asset and ensures it is
                  maintained in a good condition.
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>3</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User: Maintains the inspection details of the asset and
                  insurance details in the System.
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>4</Text>
                </View>
                <Text style={styles.flowchartText}>
                  User: Submits the records.
                </Text>
              </View>
              
              <View style={styles.flowchartStep}>
                <View style={styles.flowchartNumber}>
                  <Text style={styles.flowchartNumberText}>5</Text>
                </View>
                <Text style={styles.flowchartText}>
                  System: Saves the updated details in the database.
                </Text>
              </View>
              
              <View style={styles.flowchartNote}>
                <Text style={styles.flowchartNoteText}>
                  For any modification, the User updates the details.
                </Text>
              </View>
            </View>
            <ImageModal imageSource={'https://i.ibb.co/SXBxHxbK/asset-insurance.jpg'}/>
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
  content: {
    padding: 0,
    backgroundColor: "white",
    margin: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#1e293b",
    padding: 20,
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  section: {
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionHeader: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  sectionBody: {
    padding: 16,
  },
  subSection: {
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4b5563",
  },
  listContainer: {
    marginLeft: 8,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
    marginBottom: 4,
  },
  // Workflow Styles
  workflowStep: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4b5563",
    marginBottom: 12,
  },
  detailsList: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#dbeafe",
  },
  detailsItem: {
    fontSize: 13,
    lineHeight: 20,
    color: "#4b5563",
    marginBottom: 4,
  },
  // Flowchart Styles
  flowchart: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  flowchartStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  flowchartNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  flowchartNumberText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  flowchartText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  flowchartNote: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#fffbeb",
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  flowchartNoteText: {
    fontSize: 13,
    color: "#92400e",
    fontStyle: "italic",
  },
});

export default AssetDetails;