import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const System_LegalCollection = ({ navigation }) => {
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

  const SectionCard = ({ title, icon, color, sectionKey, children }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(sectionKey)}
      >
        <View style={styles.row}>
          <Icon name={icon} size={20} color={color || "#2563EB"} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Icon
          name={expandedSections[sectionKey] ? "chevron-up" : "chevron-down"}
          size={20}
          color="#4B5563"
        />
      </TouchableOpacity>
      {expandedSections[sectionKey] && <View>{children}</View>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wrapper}>
        {/* Heading */}
        <View style={styles.headingBox}>
          <Text style={styles.heading}>Legal Collections Workflow</Text>
          {/* <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("DefineQueueUseCase")}
            >
              <Text style={styles.buttonText}>Define Queue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("ContactRecordingUseCase")}
            >
              <Text style={styles.buttonText}>Contact Recording</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("QueueCommunicationMappingUseCase")}
            >
              <Text style={styles.buttonText}>Queue Communication</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("PrioritizeQueueUseCase")}
            >
              <Text style={styles.buttonText}>Prioritize Queue</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Sections */}
        <SectionCard title="Use Case Name" icon="file-text" sectionKey="useCaseName">
          <Text style={styles.text}>Legal Collections Workflow</Text>
        </SectionCard>

        <SectionCard title="Actor(s)" icon="users" sectionKey="actors">
          <Text style={styles.list}>• Legal Collections Team Member</Text>
          <Text style={styles.list}>• Collections Admin/Supervisor</Text>
          <Text style={styles.list}>• Lawyer</Text>
        </SectionCard>

        <SectionCard title="Description" icon="info" sectionKey="description">
          <Text style={styles.text}>
            This use case defines the process followed in the Legal Collections
            module to initiate and manage legal cases against delinquent
            customers. It involves steps from document submission, lawyer
            assignment, legal notice issuance, case filing, to court proceeding
            updates in the Collections Management application.
          </Text>
        </SectionCard>

        <SectionCard title="Trigger" icon="chevron-right" sectionKey="trigger">
          <Text style={styles.text}>
            A customer account is identified as delinquent and qualifies for legal
            action as per the lending institution’s policy.
          </Text>
        </SectionCard>

        <SectionCard title="Preconditions" icon="check-circle" color="#16A34A" sectionKey="preconditions">
          <Text style={styles.list}>• Customer must be marked delinquent.</Text>
          <Text style={styles.list}>• Documentation must be available.</Text>
        </SectionCard>

        <SectionCard title="Postconditions" icon="check-circle" color="#16A34A" sectionKey="postconditions">
          <Text style={styles.list}>• Legal case is filed and tracked in system.</Text>
          <Text style={styles.list}>• Court proceedings and verdicts are recorded.</Text>
        </SectionCard>

        <SectionCard title="Basic Flow" icon="list" sectionKey="basicFlow">
          <Text style={styles.list}>1. User sends documents and marks case for Legal.</Text>
          <Text style={styles.list}>2. Admin/Supervisor assigns lawyer.</Text>
          <Text style={styles.list}>3. Lawyer issues legal notice.</Text>
          <Text style={styles.list}>4. Organization files legal case in court.</Text>
          <Text style={styles.list}>5. User records proceedings & verdict.</Text>
        </SectionCard>

        <SectionCard title="Alternate Flow(s)" icon="shuffle" sectionKey="alternateFlows">
          <Text style={styles.list}>• Case withdrawal if mutually resolved.</Text>
          <Text style={styles.list}>• Legal waiver stops further action.</Text>
        </SectionCard>

        <SectionCard title="Exception Flow(s)" icon="alert-circle" color="#DC2626" sectionKey="exceptionFlows">
          <Text style={styles.list}>• Missing documents block allocation.</Text>
          <Text style={styles.list}>• Notice undelivered due to wrong info.</Text>
        </SectionCard>

        <SectionCard title="Business Rules" icon="lock" sectionKey="businessRules">
          <Text style={styles.list}>• Only delinquent customers are eligible.</Text>
          <Text style={styles.list}>• Waiver cases cannot go legal.</Text>
          <Text style={styles.list}>• Notices must include complete details.</Text>
        </SectionCard>

        <SectionCard title="Assumptions" icon="info" sectionKey="assumptions">
          <Text style={styles.list}>• Legal module is integrated with CMS.</Text>
          <Text style={styles.list}>• Roles (Admin/User) are defined.</Text>
        </SectionCard>

        <SectionCard title="Notes" icon="info" sectionKey="notes">
          <Text style={styles.list}>• Timely approvals required.</Text>
          <Text style={styles.list}>• Proper documentation is essential.</Text>
        </SectionCard>

        <SectionCard title="Author" icon="user" sectionKey="author">
          <Text style={styles.text}>System Analyst</Text>
        </SectionCard>

        <SectionCard title="Date" icon="calendar" sectionKey="date">
          <Text style={styles.text}>2025-05-03</Text>
        </SectionCard>

        <SectionCard title="Flowchart" icon="git-commit" sectionKey="flowchart">
          <View style={styles.flowBox}>
            <Text style={styles.mono}>
              {`
Start
   |
   v
Mark Case for Legal
   |
   v
Assign Lawyer
   |
   v
Send Legal Notice
   |
   v
File Legal Case
   |
   v
Record Proceedings
   |
   v
Update Verdict
   |
   v
End
              `}
            </Text>
          </View>
        </SectionCard>
      </View>
    </ScrollView>
  );
};

export default System_LegalCollection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 12,
  },
  wrapper: {
    maxWidth: 900,
    alignSelf: "center",
  },
  headingBox: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    borderBottomWidth: 2,
    borderBottomColor: "#2563EB",
    paddingBottom: 8,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
  text: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 6,
  },
  list: {
    fontSize: 15,
    color: "#374151",
    marginLeft: 10,
    marginBottom: 4,
  },
  flowBox: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  mono: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#374151",
  },
});
