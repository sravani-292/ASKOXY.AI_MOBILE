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

const System_NPAProvisioning = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>WF_NPA_Provisioning</Text>
      </View>
      
      <View style={styles.card}>
        {/* Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.text}>
            WF_NPA Provisioning is the process where a bank maintains a buffer
            for each finance in case a client becomes delinquent. This includes
            provisioning for both the secured and unsecured portions of finance
            based on regulatory and internal policies. Provisioning is executed
            automatically or manually via the Financial Management System.
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
              <Text style={styles.bulletPoint}>• Bank Officer performing provisioning tasks</Text>
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
              <Text style={styles.bulletPoint}>• Core Banking</Text>
              <Text style={styles.bulletPoint}>• API Developers</Text>
              <Text style={styles.bulletPoint}>• QA Team</Text>
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
            <Text style={styles.numberedPoint}>2. Navigates to the Provisioning screen.</Text>
            <Text style={styles.numberedPoint}>3. Initiates provisioning (Auto or Manual).</Text>
            <Text style={styles.numberedPoint}>4. System calculates and posts provisioned amounts to GL.</Text>
            <Text style={styles.numberedPoint}>5. User saves or resets the provisioning entry.</Text>
            <Text style={styles.numberedPoint}>6. System confirms successful provisioning.</Text>
          </View>
        </View>

        {/* Precondition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Precondition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Only selected accounts are marked eligible for provisioning.</Text>
          </View>
        </View>

        {/* Post Condition */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CheckCircle size={18} color="#16a34a" />
            <Text style={styles.sectionTitle}>Post Condition</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Provisioning records are successfully saved and updated in the system.</Text>
          </View>
        </View>

        {/* Straight Through Process (STP) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Straight Through Process (STP)</Text>
          </View>
          <Text style={styles.text}>
            Login → Navigate to Provisioning → Select Method → Complete Entry → Save → Logout
          </Text>
        </View>

        {/* Alternative Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ArrowRight size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Alternative Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Auto Provisioning: System-driven entry based on predefined rules.</Text>
            <Text style={styles.bulletPoint}>• Manual Provisioning: User inputs detailed information manually.</Text>
          </View>
        </View>

        {/* Exception Flows */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={18} color="#dc2626" />
            <Text style={styles.sectionTitle}>Exception Flows</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Unauthorized user access.</Text>
            <Text style={styles.bulletPoint}>• Missing data or criteria mismatch.</Text>
            <Text style={styles.bulletPoint}>• System unavailability during EOD process.</Text>
          </View>
        </View>

        {/* User Activity Diagram (Flowchart) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <List size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>User Activity Diagram (Flowchart)</Text>
          </View>
          <Text style={styles.text}>
            Start → Login → Navigate to Provisioning → Choose Provisioning Type → Enter Details → Save or Cancel → End
          </Text>
        </View>

        {/* Parking Lot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Parking Lot</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• ML-based predictive provisioning.</Text>
            <Text style={styles.bulletPoint}>• Partner system integrations.</Text>
            <Text style={styles.bulletPoint}>• Audit trail enhancements.</Text>
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
              <Text style={styles.bulletPoint}>• FMS Screens (Provisioning Interface)</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>APIs</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• NPA Criteria</Text>
              <Text style={styles.bulletPoint}>• GL Posting</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>DB Tables</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• Provisioning Master</Text>
              <Text style={styles.bulletPoint}>• Customer Account</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <Text style={styles.subtitle}>Services</Text>
            <View style={styles.listContainer}>
              <Text style={styles.bulletPoint}>• EOD Batch Processing</Text>
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
            <Text style={styles.bulletPoint}>• Verify provisioning for eligible accounts.</Text>
            <Text style={styles.bulletPoint}>• Handle edge cases like zero balance or over-provisioning.</Text>
            <Text style={styles.bulletPoint}>• Ensure correct GL postings.</Text>
            <Text style={styles.bulletPoint}>• Test failure recovery.</Text>
          </View>
        </View>

        {/* Infra & Deployment Notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Server size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Infra & Deployment Notes</Text>
          </View>
          <View style={styles.listContainer}>
            <Text style={styles.bulletPoint}>• Cloud-based FMS</Text>
            <Text style={styles.bulletPoint}>• EOD batch jobs run per schedule (monthly, quarterly, yearly)</Text>
            <Text style={styles.bulletPoint}>• Feature flags for internal vs regulatory provisioning</Text>
          </View>
        </View>

        {/* Dev Team Ownership */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={18} color="#2563eb" />
            <Text style={styles.sectionTitle}>Dev Team Ownership</Text>
          </View>
          <Text style={styles.text}>
            Squad: Finance Automation Team{"\n"}
            Contact: Lead Developer - finance_provisioning@bankdomain.com{"\n"}
            JIRA: WF-NPA-PROV-01{"\n"}
            Git Repo: /finance/provisioning
          </Text>
          <ImageModal imageSource={''}/>
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

export default System_NPAProvisioning;