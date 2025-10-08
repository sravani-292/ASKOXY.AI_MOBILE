import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Info,
  Users,
  CheckCircle,
  ChevronRight,
  List,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
const {width,height}=Dimensions.get('window')

const AllocationHoldUseCaseBusiness = () => {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    actors: true,
    actions: true,
    preconditions: true,
    postconditions: true,
    workflow: true,
    flowchart: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Allocation Hold for Delinquent Cases
          </Text>
        </View>

        {/* Content Sections */}
        <View style={styles.sections}>
          {/* Overview */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("overview")}
              accessibilityRole="button"
              accessibilityState={{ expanded: expandedSections.overview }}
            >
              <View style={styles.sectionHeaderLeft}>
                <Info size={20} color="#2563eb" />
                <Text style={styles.sectionTitle}>Overview</Text>
              </View>
              {expandedSections.overview ? (
                <ChevronUp size={20} color="#4b5563" />
              ) : (
                <ChevronDown size={20} color="#4b5563" />
              )}
            </TouchableOpacity>
            {expandedSections.overview && (
              <Text style={styles.sectionText}>
                Allocation hold is used to defer allocation of a case to another user in the next allocation process, by marking the case.
              </Text>
            )}
          </View>

          {/* Actors */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("actors")}
              accessibilityRole="button"
              accessibilityState={{ expanded: expandedSections.actors }}
            >
              <View style={styles.sectionHeaderLeft}>
                <Users size={20} color="#2563eb" />
                <Text style={styles.sectionTitle}>Actors</Text>
              </View>
              {expandedSections.actors ? (
                <ChevronUp size={20} color="#4b5563" />
              ) : (
                <ChevronDown size={20} color="#4b5563" />
              )}
            </TouchableOpacity>
            {expandedSections.actors && (
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• User (Supervisor)</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("actions")}
              accessibilityRole="button"
              accessibilityState={{ expanded: expandedSections.actions }}
            >
              <View style={styles.sectionHeaderLeft}>
                <ChevronRight size={20} color="#2563eb" />
                <Text style={styles.sectionTitle}>Actions</Text>
              </View>
              {expandedSections.actions ? (
                <ChevronUp size={20} color="#4b5563" />
              ) : (
                <ChevronDown size={20} color="#4b5563" />
              )}
            </TouchableOpacity>
            {expandedSections.actions && (
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• User may hold the allocation of the cases.</Text>
              </View>
            )}
          </View>

          {/* Preconditions */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("preconditions")}
              accessibilityRole="button"
              accessibilityState={{ expanded: expandedSections.preconditions }}
            >
              <View style={styles.sectionHeaderLeft}>
                <CheckCircle size={20} color="#16a34a" />
                <Text style={styles.sectionTitle}>Preconditions</Text>
              </View>
              {expandedSections.preconditions ? (
                <ChevronUp size={20} color="#4b5563" />
              ) : (
                <ChevronDown size={20} color="#4b5563" />
              )}
            </TouchableOpacity>
            {expandedSections.preconditions && (
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>
                  • Delinquent cases are classified and mapped to the communication templates for auto communication.
                </Text>
              </View>
            )}
          </View>

          {/* Post Conditions */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("postconditions")}
              accessibilityRole="button"
              accessibilityState={{ expanded: expandedSections.postconditions }}
            >
              <View style={styles.sectionHeaderLeft}>
                <CheckCircle size={20} color="#16a34a" />
                <Text style={styles.sectionTitle}>Post Conditions</Text>
              </View>
              {expandedSections.postconditions ? (
                <ChevronUp size={20} color="#4b5563" />
              ) : (
                <ChevronDown size={20} color="#4b5563" />
              )}
            </TouchableOpacity>
            {expandedSections.postconditions && (
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>
                  • Delinquent case is not allotted and kept on hold.
                </Text>
              </View>
            )}
          </View>

          {/* Workflow */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("workflow")}
              accessibilityRole="button"
              accessibilityState={{ expanded: expandedSections.workflow }}
            >
              <View style={styles.sectionHeaderLeft}>
                <List size={20} color="#2563eb" />
                <Text style={styles.sectionTitle}>Workflow</Text>
              </View>
              {expandedSections.workflow ? (
                <ChevronUp size={20} color="#4b5563" />
              ) : (
                <ChevronDown size={20} color="#4b5563" />
              )}
            </TouchableOpacity>
            {expandedSections.workflow && (
              <View style={styles.workflowContainer}>
                <View style={styles.workflowItem}>
                  <Text style={styles.workflowNumber}>1.</Text>
                  <View style={styles.workflowContent}>
                    <Text style={styles.sectionText}>
                      The user extracts the list of delinquent cases by providing details such as:
                    </Text>
                    <View style={styles.detailsGrid}>
                      <View style={styles.detailsColumn}>
                        <Text style={styles.detailItem}>• Loan No./Account No</Text>
                        <Text style={styles.detailItem}>• Customer Name</Text>
                        <Text style={styles.detailItem}>• Customer ID</Text>
                        <Text style={styles.detailItem}>• Card No.</Text>
                      </View>
                      <View style={styles.detailsColumn}>
                        <Text style={styles.detailItem}>• Overdue Position</Text>
                        <Text style={styles.detailItem}>• Financier</Text>
                        <Text style={styles.detailItem}>• Financier Type (Line of Business)</Text>
                        <Text style={styles.detailItem}>• Rule Unit Code</Text>
                      </View>
                      <View style={styles.detailsColumn}>
                        <Text style={styles.detailItem}>• Unit Level</Text>
                        <Text style={styles.detailItem}>• Product Type</Text>
                        <Text style={styles.detailItem}>• Product</Text>
                        <Text style={styles.detailItem}>• Queue</Text>
                        <Text style={styles.detailItem}>• Branch</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.workflowItem}>
                  <Text style={styles.workflowNumber}>2.</Text>
                  <Text style={styles.sectionText}>
                    Once the list of delinquent cases is extracted, the user can allocate/re-allocate/hold the delinquent cases.
                  </Text>
                </View>
                <View style={styles.workflowItem}>
                  <Text style={styles.workflowNumber}>3.</Text>
                  <Text style={styles.sectionText}>
                    User may keep on hold the delinquent cases to prevent them from getting reallocated to another user despite satisfying all conditions (Allocation hold is used to defer allocation of a case to another user in the next allocation process, by marking the case).
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Flowchart */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("flowchart")}
              accessibilityRole="button"
              accessibilityState={{ expanded: expandedSections.flowchart }}
            >
              <View style={styles.sectionHeaderLeft}>
                <List size={20} color="#2563eb" />
                <Text style={styles.sectionTitle}>Flowchart</Text>
              </View>
              {expandedSections.flowchart ? (
                <ChevronUp size={20} color="#4b5563" />
              ) : (
                <ChevronDown size={20} color="#4b5563" />
              )}
            </TouchableOpacity>
            {expandedSections.flowchart && (
              <View style={styles.flowchartContainer}>
                <Text style={styles.flowchartText}>
{`Start
  |
  v
Delinquent cases classified and mapped to communication templates
  |
  v
User defines delinquent cases based on rules
  |
  v
User extracts list of delinquent cases using:
- Loan No./Account No
- Customer Name
- Customer ID
- Card No.
- Overdue Position
- Financier
- Financer Type
- Rule Unit Code
- Unit Level
- Product Type
- Product
- Queue
- Branch
  |
  v
User marks specific delinquent cases for allocation hold
  |
  v
Delinquent cases kept on hold, preventing reallocation
  |
  v
End`}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    maxWidth: 1024,
    marginHorizontal: "auto",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "800", 
    color: "#111827",
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 16,
    width:width*0.9,
    textAlign: "center",
  },
  sections: {
    gap: 32,
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 12,
    // marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width:width*0.9
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  sectionText: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
  },
  listContainer: {
    paddingLeft: 8,
  },
  listItem: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
    marginBottom: 4,
  },
  workflowContainer: {
    gap: 16,
  },
  workflowItem: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  workflowNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
  },
  workflowContent: {
    flex: 1,
  },
  detailsGrid: {
    marginTop: 8,
    gap: 8,
  },
  detailsColumn: {
    marginBottom: 8,
  },
  detailItem: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
    marginBottom: 4,
  },
  flowchartContainer: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  flowchartText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "monospace",
    lineHeight: 20,
  },
});

export default AllocationHoldUseCaseBusiness;