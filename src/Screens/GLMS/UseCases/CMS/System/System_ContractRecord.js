import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import ImageModal from "../../ImageModal";

const System_ContractRecord = ({ navigation }) => {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    actors: true,
    userActions: true,
    precondition: true,
    postCondition: true,
    stp: true,
    alternativeFlows: true,
    exceptionFlows: true,
    flowchart: true,
    parkingLot: true,
    systemComponents: true,
    testScenarios: true,
    infraNotes: true,
    devTeam: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // 🔹 Reusable Card Component
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
          <Text style={styles.heading}>Contact Recording</Text>
        
        </View>

        {/* Description */}
        <SectionCard title="Description" icon="info" sectionKey="description">
          <Text style={styles.text}>
            The Contact Recording process is part of the Collections Workflow,
            enabling users—especially collectors and telecallers—to log follow-up
            actions and communications with delinquent customers. This ensures
            proper documentation and tracking of curing actions to recover dues.
          </Text>
        </SectionCard>

        {/* Actors */}
        <SectionCard title="Actors" icon="users" sectionKey="actors">
          <Text style={styles.list}>• Collector/Telecaller (User)</Text>
          <Text style={styles.list}>• Supervisor</Text>
          <Text style={styles.list}>• Collections Management System</Text>
        </SectionCard>

        {/* User Actions */}
        <SectionCard
          title="User Actions & System Responses"
          icon="chevron-right"
          sectionKey="userActions"
        >
          <Text style={styles.text}>1. Supervisor allocates delinquent cases.</Text>
          <Text style={styles.text}>2. User reviews customer details.</Text>
          <Text style={styles.text}>3. User initiates follow-up actions:</Text>
          <Text style={styles.list}>• Letter generation, SMS, Stat Card</Text>
          <Text style={styles.list}>• Telecalling, Email</Text>
          <Text style={styles.text}>4. User records follow-up details:</Text>
          <Text style={styles.list}>• Action date, type, mode, remarks, etc.</Text>
          <Text style={styles.text}>5. System saves and updates case follow-up status.</Text>
        </SectionCard>

        {/* Precondition */}
        <SectionCard
          title="Precondition"
          icon="check-circle"
          color="#16A34A"
          sectionKey="precondition"
        >
          <Text style={styles.list}>• Cases must be saved in database.</Text>
          <Text style={styles.list}>• Supervisor must allocate and prioritize cases.</Text>
        </SectionCard>

        {/* Post Condition */}
        <SectionCard
          title="Post Condition"
          icon="check-circle"
          color="#16A34A"
          sectionKey="postCondition"
        >
          <Text style={styles.list}>• Follow-up actions are recorded successfully.</Text>
        </SectionCard>

        {/* STP */}
        <SectionCard
          title="Straight Through Process (STP)"
          icon="list"
          sectionKey="stp"
        >
          <Text style={styles.text}>
            Login → Access Allocation → Review Details → Take Action → Record →
            Submit
          </Text>
        </SectionCard>

        {/* Alternative Flows */}
        <SectionCard
          title="Alternative Flows"
          icon="shuffle"
          sectionKey="alternativeFlows"
        >
          <Text style={styles.list}>• Follow-up postponed and rescheduled.</Text>
          <Text style={styles.list}>• Follow-up assigned to another collector.</Text>
        </SectionCard>

        {/* Exception Flows */}
        <SectionCard
          title="Exception Flows"
          icon="alert-circle"
          color="#DC2626"
          sectionKey="exceptionFlows"
        >
          <Text style={styles.list}>• Attempt to record without case allocation.</Text>
          <Text style={styles.list}>• Missing/invalid entry fields.</Text>
        </SectionCard>

        {/* Flowchart */}
        <SectionCard
          title="User Activity Diagram (Flowchart)"
          icon="git-commit"
          sectionKey="flowchart"
        >
          <View style={styles.flowBox}>
            <Text style={styles.mono}>
              {`
Start → Login → Open Customer → Review → Action → Record → Submit → End
              `}
            </Text>
          </View>
        </SectionCard>

        {/* Parking Lot */}
        <SectionCard title="Parking Lot" icon="info" sectionKey="parkingLot">
          <Text style={styles.list}>• Predictive dialer / auto-SMS integration.</Text>
          <Text style={styles.list}>• Dashboard for efficiency analytics.</Text>
        </SectionCard>

        {/* System Components */}
        <SectionCard
          title="System Components Involved"
          icon="server"
          sectionKey="systemComponents"
        >
          <Text style={styles.list}>• UI: Contact Recording Form</Text>
          <Text style={styles.list}>• DB: Follow-up Actions, Customer Info</Text>
          <Text style={styles.list}>• APIs: Notification Service, Reminder Engine</Text>
          <Text style={styles.list}>• Services: Case Tracking, Audit Logger</Text>
        </SectionCard>

        {/* Test Scenarios */}
        <SectionCard title="Test Scenarios" icon="code" sectionKey="testScenarios">
          <Text style={styles.list}>• Record and save follow-up action.</Text>
          <Text style={styles.list}>• Validate reminder scheduling.</Text>
          <Text style={styles.list}>• Test invalid/missing entry data.</Text>
        </SectionCard>

        {/* Infra Notes */}
        <SectionCard
          title="Infra & Deployment Notes"
          icon="cloud"
          sectionKey="infraNotes"
        >
          <Text style={styles.list}>• High availability for services.</Text>
          <Text style={styles.list}>• Real-time reminder sync.</Text>
        </SectionCard>

        {/* Dev Team */}
        <SectionCard
          title="Dev Team Ownership"
          icon="git-branch"
          sectionKey="devTeam"
        >
          <Text style={styles.list}>• Squad: Collections Support</Text>
          <Text style={styles.list}>• Email: collections_dev@bank.com</Text>
          <Text style={styles.list}>• JIRA: COLL-CONTACT-01</Text>
          <Text style={styles.list}>• Repo: /collections/contact-recording</Text>
          <ImageModal imageSource={'https://i.ibb.co/4RBpJrcr/contact-recording.png'}/>

        </SectionCard>


      </View>
    </ScrollView>
  );
};

export default System_ContractRecord;

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
  button: {
    marginTop: 12,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "center",
    width: "60%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
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
