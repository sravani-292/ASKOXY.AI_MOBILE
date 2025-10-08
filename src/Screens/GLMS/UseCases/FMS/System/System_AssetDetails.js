import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { FileText, Users, CheckCircle, Info, List, AlertCircle } from "lucide-react-native";

const System_AssetDetails = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Heading */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Asset Details Use Case</Text>
      </View>
      
      <View style={styles.card}>
        {/* Use Case Name */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Use Case Name</Text>
          </View>
          <Text style={styles.text}>WF_Asset Details</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.text}>
            This use case describes the process by which a user updates and
            maintains asset details, including insurance and inspection
            information, in the system post-purchase.
          </Text>
        </View>

        {/* Actors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Actors</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• User</Text>
          </View>
        </View>

        {/* Preconditions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Preconditions</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>
              • System must support entry and update of asset details, inspection
              details, and insurance information.
            </Text>
          </View>
        </View>

        {/* Postconditions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Postconditions</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>
              • Updated asset, inspection, and insurance details are saved in the
              database.
            </Text>
          </View>
        </View>

        {/* Main Flow */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Main Flow</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.numberedPoint}>1. User enters asset details in the system after purchase (e.g., Supplier, Delivery Order Date, Asset Cost, Origination/Installation State, Registration Number).</Text>
            <Text style={styles.numberedPoint}>2. User physically identifies the asset and ensures its condition and insurance.</Text>
            <Text style={styles.numberedPoint}>3. User enters inspection details (e.g., Asset ID, Agreement No, Inspection Date, Remarks, Defect Reason).</Text>
            <Text style={styles.numberedPoint}>4. User enters insurance details (e.g., Asset Description, Nature of Insurance, Policy No, Coverage, Insured/Expiry Date, Premium, Insurance Company).</Text>
            <Text style={styles.numberedPoint}>5. System saves all updated details in the database.</Text>
          </View>
        </View>

        {/* Alternative Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Alternative Flows</Text>
          </View>
          <Text style={styles.text}>None specified.</Text>
        </View>

        {/* Exceptions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={18} color="#dc2626" />
            <Text style={styles.sectionTitle}>Exceptions</Text>
          </View>
          <Text style={styles.text}>None specified.</Text>
        </View>

        {/* Assumptions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Assumptions</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>
              • User has access rights and proper training to enter and manage
              asset-related information.
            </Text>
          </View>
        </View>

        {/* Notes and Issues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Notes and Issues</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>
              • Periodic inspections and insurance updates are essential to keep
              data current.
            </Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
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
  text: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
  },
  listContainer: {
    paddingLeft: 8,
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

export default System_AssetDetails;