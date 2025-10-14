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

const System_FloatingReviewProcess = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Heading */}
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>WF_FMS Floating Review Process</Text>
      </View> */}
      
      <View style={styles.card}>
        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.text}>
            The Floating Review Process allows users to update the profit rate
            for all finances booked under a floating profit rate type. The
            Financial Management System (FMS) recalculates the new applicable
            profit rate based on the spread and updated anchor rate. The system
            also recalculates and generates a revised repayment schedule in
            accordance with the updated rate.
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
              <Text style={styles.bulletPoint}>• Finance Operations</Text>
              <Text style={styles.bulletPoint}>• Risk & Compliance</Text>
              <Text style={styles.bulletPoint}>• Treasury</Text>
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
            <Text style={styles.numberedPoint}>1. User logs into the FMS application.</Text>
            <Text style={styles.numberedPoint}>2. Navigates to the Floating Review Process screen.</Text>
            <Text style={styles.numberedPoint}>3. Selects finance accounts subject to floating rates.</Text>
            <Text style={styles.numberedPoint}>4. System fetches the current profit rate details and applicable anchor rates (PLR).</Text>
            <Text style={styles.numberedPoint}>5. User applies the appropriate prime rate types (e.g., EIBOR, LIBOR) for EMI and Pre-EMI.</Text>
            <Text style={styles.numberedPoint}>6. System recalculates the floating profit rate and regenerates the EMI schedule, if required.</Text>
            <Text style={styles.numberedPoint}>7. User reviews the new schedule.</Text>
            <Text style={styles.numberedPoint}>8. User saves the transaction or cancels to reset changes.</Text>
          </View>
        </View>

        {/* Precondition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Precondition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Finance accounts are booked under floating profit rate type.</Text>
            <Text style={styles.bulletPoint}>• Updated anchor rates (e.g., PLR) are configured in the system.</Text>
          </View>
        </View>

        {/* Post Condition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Post Condition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Floating rate review is completed and, if applicable, revised repayment schedules are saved.</Text>
          </View>
        </View>

        {/* Straight Through Process (STP) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Straight Through Process (STP)</Text>
          </View>
          <Text style={styles.text}>
            Login → Navigate to Floating Review → Select Finances → Apply Prime
            Rate → Recalculate → Review → Save/Cancel → Logout
          </Text>
        </View>

        {/* Alternative Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Alternative Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Review floating rate on a daily schedule using automated batch process.</Text>
          </View>
        </View>

        {/* Exception Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={18} color="#dc2626" />
            <Text style={styles.sectionTitle}>Exception Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• System error in rate update or invalid profit rate entry.</Text>
            <Text style={styles.bulletPoint}>• Finance accounts not eligible for floating rate review.</Text>
          </View>
        </View>

        {/* User Activity Diagram (Flowchart) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>User Activity Diagram (Flowchart)</Text>
          </View>
          <Text style={styles.text}>
            Start → Login → Select Finance Accounts → Apply Rate → Recalculate →
            Review Schedule → Save/Cancel → End
          </Text>
        </View>

        {/* Parking Lot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Parking Lot</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Integrate automatic trigger based on PLR rate update.</Text>
            <Text style={styles.bulletPoint}>• Enable version control for historical floating rate schedules.</Text>
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
              <Text style={styles.bulletPoint}>• Floating Review Process Screen</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>APIs</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Anchor Rate Fetch</Text>
              <Text style={styles.bulletPoint}>• EMI Schedule Generator</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>DB Tables</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Profit Rate Ledger</Text>
              <Text style={styles.bulletPoint}>• Finance Schedule</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Services</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Rate Recalculation Engine</Text>
              <Text style={styles.bulletPoint}>• Schedule Updater</Text>
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
            <Text style={styles.bulletPoint}>• Update of floating rate with new PLR.</Text>
            <Text style={styles.bulletPoint}>• Recalculation of EMI and Pre-EMI schedules.</Text>
            <Text style={styles.bulletPoint}>• Saving and rollback of floating review process.</Text>
            <Text style={styles.bulletPoint}>• Handling of invalid profit rate configuration.</Text>
          </View>
        </View>

        {/* Infra & Deployment Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Server size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Infra & Deployment Notes</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Requires reliable job scheduler for daily PLR updates.</Text>
            <Text style={styles.bulletPoint}>• Audit logging for all floating rate adjustments.</Text>
          </View>
        </View>

        {/* Dev Team Ownership */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Dev Team Ownership</Text>
          </View>
          <Text style={styles.text}>
            Squad: Interest Rate Management Team{"\n"}
            Contact: Lead Dev - fms_floating@bankdomain.com{"\n"}
            JIRA: WF-FLOAT-REVIEW-01{"\n"}
            Git Repo: /fms/floating-review
          </Text>
          <ImageModal source={'https://i.ibb.co/4RG7VkKk/floating-review-process.jpg'}/>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6", // Softer background for contrast
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#2563EB", // Blue accent header
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderBottomWidth: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  card: {
    // backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 18,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
    // borderWidth: 1,
    // borderColor: "#E5E7EB",
  },
  section: {
    marginBottom: 24,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E3A8A",
    marginLeft: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    marginTop: 4,
  },
  subheading: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginTop: 8,
    marginBottom: 6,
  },
  listContainer: {
    marginLeft: 8,
    marginBottom: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#2563EB",
    marginTop: 8,
    marginRight: 10,
  },
  listText: {
    flex: 1,
    fontSize: 14.5,
    lineHeight: 21,
    color: "#374151",
  },
  orderedList: {
    marginLeft: 8,
  },
  orderedListItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  orderedListNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
    marginRight: 8,
    lineHeight: 21,
  },
  orderedListText: {
    flex: 1,
    fontSize: 14.5,
    lineHeight: 21,
    color: "#374151",
  },
  nestedList: {
    marginLeft: 18,
    marginTop: 4,
    marginBottom: 10,
  },
});


export default System_FloatingReviewProcess;