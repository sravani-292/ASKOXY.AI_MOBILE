import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import ImageModal from "../../ImageModal";
const System_WorkPlan = ({ navigation }) => {
  const [expandedSections, setExpandedSections] = useState({
    useCaseName: true,
    actors: true,
    description: true,
    trigger: true,
    preconditions: true,
    postconditions: true,
    basicFlow: true,
    alternateFlows: true,
    exceptionFlows: true,
    businessRules: true,
    assumptions: true,
    notes: true,
    author: true,
    date: true,
    flowchart: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ScrollView style={commonStyles.container}>
      <Text style={commonStyles.heading}>Work Plan</Text>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("useCaseName")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="file-text" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Use Case Name</Text>
          </View>
          <Icon
            name={expandedSections.useCaseName ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.useCaseName && (
          <Text style={commonStyles.sectionContent}>Work Plan</Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("actors")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="users" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Actor(s)</Text>
          </View>
          <Icon
            name={expandedSections.actors ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.actors && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>• Supervisor</Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("description")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="info" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Description</Text>
          </View>
          <Icon
            name={expandedSections.description ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.description && (
          <Text style={commonStyles.sectionContent}>
            This use case defines the process of prioritizing and assigning
            delinquent cases to collectors. Supervisors generate the Work Plan
            which outlines the follow-up activities to be performed by
            collectors. The plan includes detailed information about each case
            to assist in the follow-up process.
          </Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("trigger")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="chevron-right" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Trigger</Text>
          </View>
          <Icon
            name={expandedSections.trigger ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.trigger && (
          <Text style={commonStyles.sectionContent}>
            Completion of delinquent case allocation to collectors.
          </Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("preconditions")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="check-circle" size={20} color="#16a34a" />
            <Text style={commonStyles.sectionTitleText}>Preconditions</Text>
          </View>
          <Icon
            name={
              expandedSections.preconditions ? "chevron-up" : "chevron-down"
            }
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.preconditions && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>
              • Delinquent cases are saved in the system database.
            </Text>
            <Text style={commonStyles.listItem}>
              • The system allows the Supervisor to prioritize and assign cases.
            </Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("postconditions")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="check-circle" size={20} color="#16a34a" />
            <Text style={commonStyles.sectionTitleText}>Postconditions</Text>
          </View>
          <Icon
            name={
              expandedSections.postconditions ? "chevron-up" : "chevron-down"
            }
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.postconditions && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>
              • Work Plan is generated and assigned to collectors.
            </Text>
            <Text style={commonStyles.listItem}>
              • Collectors can access case details for follow-up.
            </Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("basicFlow")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="list" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Basic Flow</Text>
          </View>
          <Icon
            name={expandedSections.basicFlow ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.basicFlow && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>
              1. Supervisor accesses the system post-allocation.
            </Text>
            <Text style={commonStyles.listItem}>
              2. System displays the list of allocated delinquent cases with
              details:
            </Text>
            <View style={commonStyles.list}>
              <Text style={commonStyles.listItem}>• Collector name</Text>
              <Text style={commonStyles.listItem}>• Customer details</Text>
              <Text style={commonStyles.listItem}>• Case details</Text>
              <Text style={commonStyles.listItem}>• Product details</Text>
              <Text style={commonStyles.listItem}>• Delinquency details</Text>
              <Text style={commonStyles.listItem}>• Contact details</Text>
              <Text style={commonStyles.listItem}>• Account details</Text>
              <Text style={commonStyles.listItem}>• Payment history</Text>
              <Text style={commonStyles.listItem}>• Follow-up history</Text>
              <Text style={commonStyles.listItem}>• Remarks</Text>
            </View>
            <Text style={commonStyles.listItem}>
              3. Supervisor reviews the case details.
            </Text>
            <Text style={commonStyles.listItem}>
              4. Supervisor defines priority for each case based on amount
              overdue.
            </Text>
            <Text style={commonStyles.listItem}>
              5. Supervisor assigns cases to collectors.
            </Text>
            <Text style={commonStyles.listItem}>
              6. Collectors perform follow-up actions as per the Work Plan.
            </Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("alternateFlows")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="chevron-right" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Alternate Flow(s)</Text>
          </View>
          <Icon
            name={
              expandedSections.alternateFlows ? "chevron-up" : "chevron-down"
            }
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.alternateFlows && (
          <Text style={commonStyles.sectionContent}>None</Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("exceptionFlows")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="alert-circle" size={20} color="#dc2626" />
            <Text style={commonStyles.sectionTitleText}>Exception Flow(s)</Text>
          </View>
          <Icon
            name={
              expandedSections.exceptionFlows ? "chevron-up" : "chevron-down"
            }
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.exceptionFlows && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>
              • Missing or incomplete case details may prevent generation of the
              Work Plan.
            </Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("businessRules")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="lock" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Business Rules</Text>
          </View>
          <Icon
            name={
              expandedSections.businessRules ? "chevron-up" : "chevron-down"
            }
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.businessRules && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>
              • Priority should be defined based on amount overdue and case
              criticality.
            </Text>
            <Text style={commonStyles.listItem}>
              • Each collector must receive a balanced number of cases based on
              their capacity.
            </Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("assumptions")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="info" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Assumptions</Text>
          </View>
          <Icon
            name={expandedSections.assumptions ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.assumptions && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>
              • Supervisor has system access and authority to assign cases.
            </Text>
            <Text style={commonStyles.listItem}>
              • Collector follows the Work Plan for timely follow-ups.
            </Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("notes")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="info" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Notes</Text>
          </View>
          <Icon
            name={expandedSections.notes ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.notes && (
          <View style={commonStyles.list}>
            <Text style={commonStyles.listItem}>
              • The Work Plan is crucial for efficient collection and tracking
              of delinquent accounts.
            </Text>
          </View>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("author")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="user" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Author</Text>
          </View>
          <Icon
            name={expandedSections.author ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.author && (
          <Text style={commonStyles.sectionContent}>System Analyst</Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("date")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="calendar" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Date</Text>
          </View>
          <Icon
            name={expandedSections.date ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.date && (
          <Text style={commonStyles.sectionContent}>2025-05-03</Text>
        )}
      </View>
      <View style={commonStyles.card}>
        <TouchableOpacity
          style={commonStyles.sectionButton}
          onPress={() => toggleSection("flowchart")}
        >
          <View style={commonStyles.sectionTitle}>
            <Icon name="list" size={20} color="#2563eb" />
            <Text style={commonStyles.sectionTitleText}>Flowchart</Text>
          </View>
          <Icon
            name={expandedSections.flowchart ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expandedSections.flowchart && (
          <View style={commonStyles.flowchartContainer}>
            <Text style={commonStyles.flowchartText}>
              {`
Start
   |
   v
Access System
   |
   v
Display Case Details
   |
   v
Review Case Details
   |
   v
Define Case Priorities
   |
   v
Assign Cases to Collectors
   |
   v
Perform Follow-up Actions
   |
   v
End
`}
            </Text>
            <ImageModal imageSource={'https://i.ibb.co/Nd8gn6c9/Workplan.png'}/>
            
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default System_WorkPlan;

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  sectionContent: {
    color: "#374151",
    fontSize: 16,
    lineHeight: 24,
  },
  list: {
    paddingLeft: 20,
  },
  listItem: {
    color: "#374151",
    fontSize: 16,
    lineHeight: 24,
  },
  flowchartContainer: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  flowchartText: {
    color: "#374151",
    fontSize: 14,
    fontFamily: "monospace", // May not work on all devices, but approximate
  },
  navContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  navButton: {
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 4,
    margin: 4,
  },
  navButtonText: {
    color: "#ffffff",
    textAlign: "center",
  },
});
