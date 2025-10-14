import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import ImageModal from "../../ImageModal";
const PrioritizeQueueUseCase = ({ navigation }) => {
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
          <Text style={styles.heading}>Prioritizing a Queue</Text>
        </View>

        {/* Sections */}
        <SectionCard title="Use Case Name" icon="file-text" sectionKey="useCaseName">
          <Text style={styles.text}>Prioritizing a Queue</Text>
        </SectionCard>

        <SectionCard title="Actor(s)" icon="users" sectionKey="actors">
          <Text style={styles.list}>• Collections Team Member (User)</Text>
        </SectionCard>

        <SectionCard title="Description" icon="info" sectionKey="description">
          <Text style={styles.text}>
            This use case describes the process of prioritizing Queues in the
            Collections System. Queues are created based on classification rules
            for delinquent accounts, and prioritization ensures that if a case
            qualifies for multiple Queues, it is assigned to the one with the
            highest priority.
          </Text>
        </SectionCard>

        <SectionCard title="Trigger" icon="chevron-right" sectionKey="trigger">
          <Text style={styles.text}>
            Completion of the Beginning of Day (BOD) process and availability of
            delinquent customer details.
          </Text>
        </SectionCard>

        <SectionCard title="Preconditions" icon="check-circle" color="#16A34A" sectionKey="preconditions">
          <Text style={styles.list}>• BOD process must be completed.</Text>
          <Text style={styles.list}>• Classification rules must be mapped to Queues.</Text>
        </SectionCard>

        <SectionCard title="Postconditions" icon="check-circle" color="#16A34A" sectionKey="postconditions">
          <Text style={styles.list}>• Queues are prioritized and stored in the system.</Text>
          <Text style={styles.list}>• Cases are routed to Queues based on defined priorities.</Text>
        </SectionCard>

        <SectionCard title="Basic Flow" icon="list" sectionKey="basicFlow">
          <Text style={styles.list}>1. User defines Queues by mapping classification rules.</Text>
          <Text style={styles.list}>2. User sets the priority for each Queue.</Text>
          <Text style={styles.list}>3. User provides details (Strategy, Financier, Queue Code, etc.).</Text>
          <Text style={styles.list}>4. User provides execution sequence.</Text>
          <Text style={styles.list}>5. User saves the Queue prioritization data.</Text>
        </SectionCard>

        <SectionCard title="Alternate Flow(s)" icon="shuffle" sectionKey="alternateFlows">
          <Text style={styles.text}>None</Text>
        </SectionCard>

        <SectionCard title="Exception Flow(s)" icon="alert-circle" color="#DC2626" sectionKey="exceptionFlows">
          <Text style={styles.list}>• Queue creation fails due to missing classification mapping.</Text>
          <Text style={styles.list}>• Invalid data inputs for Queue configuration.</Text>
        </SectionCard>

        <SectionCard title="Business Rules" icon="lock" sectionKey="businessRules">
          <Text style={styles.list}>
            • Cases must be assigned to the highest priority Queue if they qualify for multiple Queues.
          </Text>
          <Text style={styles.list}>
            • Each Queue must be associated with a valid strategy and financier.
          </Text>
        </SectionCard>

        <SectionCard title="Assumptions" icon="info" sectionKey="assumptions">
          <Text style={styles.list}>• Classification rules are available in the system.</Text>
          <Text style={styles.list}>• System supports execution sequence for prioritization logic.</Text>
        </SectionCard>

        <SectionCard title="Notes" icon="info" sectionKey="notes">
          <Text style={styles.list}>
            • This process helps streamline collection efforts by ensuring strategic alignment.
          </Text>
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
Define Queues
   |
   v
Set Queue Priorities
   |
   v
Provide Queue Details
   |
   v
Set Execution Sequence
   |
   v
Save Prioritization
   |
   v
End
              `}
            </Text>
          </View>
                      <ImageModal imageSource={'https://i.ibb.co/mFzB0c2X/prioritizing-a-queue.png'}/>

        </SectionCard>
      </View>
    </ScrollView>
  );
};

export default PrioritizeQueueUseCase;

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
