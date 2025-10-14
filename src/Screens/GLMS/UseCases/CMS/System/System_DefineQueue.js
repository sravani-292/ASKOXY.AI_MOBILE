import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import ImageZoom from "react-native-image-pan-zoom";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const System_DefineQueue = ({ navigation }) => {
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

  const [modalVisible, setModalVisible] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.wrapper}>
          {/* Heading */}
          <View style={styles.headingBox}>
            <Text style={styles.heading}>
              Classification of Delinquent Cases - Define Queue
            </Text>
          </View>

          <View style={styles.card}>
            {/* Description */}
            <Section
              icon="info"
              title="Description"
              expanded={expandedSections.description}
              onToggle={() => toggleSection("description")}
            >
              <Text style={styles.text}>
                The "Define Queue" functionality is part of the classification
                process within the Collections System. Once the Beginning of Day
                (BOD) process is completed, users can define queues and map them
                to classification rules for delinquent customers. This
                categorization is essential for effective collection strategies,
                as it allows collectors to prioritize and handle cases based on
                severity, financial status, and business rules.
              </Text>
            </Section>
            <View style={styles.divider} />

            {/* Actors */}
            <Section
              icon="users"
              title="Actors"
              expanded={expandedSections.actors}
              onToggle={() => toggleSection("actors")}
            >
              <View style={styles.rowWrap}>
                <View style={styles.cardBox}>
                  <Text style={styles.cardTitle}>Business User</Text>
                  <Text style={styles.text}>• Collections Admin/Supervisor</Text>
                </View>
                <View style={styles.cardBox}>
                  <Text style={styles.cardTitle}>System Roles</Text>
                  <Text style={styles.text}>• Collections Management System</Text>
                </View>
                <View style={styles.cardBox}>
                  <Text style={styles.cardTitle}>Stakeholders</Text>
                  <Text style={styles.text}>• Collections Department</Text>
                  <Text style={styles.text}>• Risk Management</Text>
                </View>
              </View>
            </Section>
            <View style={styles.divider} />

            {/* User Actions */}
            <Section
              icon="chevron-right"
              title="User Actions & System Responses"
              expanded={expandedSections.userActions}
              onToggle={() => toggleSection("userActions")}
            >
              <Text style={styles.text}>1. User logs into the system post-BOD.</Text>
              <Text style={styles.text}>2. Navigates to Queue Definition.</Text>
              <Text style={styles.text}>3. Inputs details:</Text>
              <View style={styles.rowWrap}>
                <View style={styles.flexCol}>
                  <Text style={styles.listText}>• Strategy</Text>
                  <Text style={styles.listText}>• Financier</Text>
                  <Text style={styles.listText}>• Financier Type</Text>
                  <Text style={styles.listText}>• Queue Code</Text>
                  <Text style={styles.listText}>• Rule Code</Text>
                </View>
                <View style={styles.flexCol}>
                  <Text style={styles.listText}>• Severity</Text>
                  <Text style={styles.listText}>• Execution Sequence</Text>
                  <Text style={styles.listText}>• Maker ID</Text>
                  <Text style={styles.listText}>• Making Date</Text>
                </View>
              </View>
              <Text style={styles.text}>4. System validates inputs.</Text>
              <Text style={styles.text}>5. Map queue to classification rule.</Text>
              <Text style={styles.text}>6. Provide description.</Text>
              <Text style={styles.text}>7. Save details.</Text>
              <Text style={styles.text}>
                8. System confirms successful queue creation.
              </Text>
            </Section>
            <View style={styles.divider} />

            {/* Precondition */}
            <Section
              icon="check-circle"
              title="Precondition"
              expanded={expandedSections.precondition}
              onToggle={() => toggleSection("precondition")}
            >
              <Text style={styles.listText}>• Completion of the BOD process.</Text>
              <Text style={styles.listText}>• Availability of customer data in DB.</Text>
            </Section>
            <View style={styles.divider} />

            {/* Post Condition */}
            <Section
              icon="check-circle"
              title="Post Condition"
              expanded={expandedSections.postCondition}
              onToggle={() => toggleSection("postCondition")}
            >
              <Text style={styles.listText}>• Queue and classification mapping stored.</Text>
              <Text style={styles.listText}>• Cases ready for allocation based on rules.</Text>
            </Section>
            <View style={styles.divider} />

            {/* STP */}
            <Section
              icon="list"
              title="Straight Through Process (STP)"
              expanded={expandedSections.stp}
              onToggle={() => toggleSection("stp")}
            >
              <Text style={styles.text}>
                Login → Queue Definition → Input → Map Rule → Save → Confirmation
              </Text>
            </Section>
            <View style={styles.divider} />

            {/* Flowchart */}
            <Section
              icon="list"
              title="User Activity Diagram (Flowchart)"
              expanded={expandedSections.flowchart}
              onToggle={() => toggleSection("flowchart")}
            >
              <View style={styles.flowchart}>
                <Text style={styles.code}>
{`Start → Login → Access Queue
→ Enter Details → Map Rule
→ Provide Description → Save → End`}
                </Text>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.modalButtonText}>View Flowchart Image</Text>
                </TouchableOpacity>
              </View>
            </Section>
          </View>
        </View>
      </ScrollView>

      {/* Fullscreen Zoomable Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <ImageZoom
              cropWidth={screenWidth}
              cropHeight={screenHeight}
              imageWidth={screenWidth}
              imageHeight={screenHeight}
              minScale={0.5}
              maxScale={3}
            >
              <Image
                 source={{ uri: 'https://i.ibb.co/Y4m7jf8K/defining-a-queue.png' }}
                style={{ width: screenWidth, height: screenHeight/1.4,marginTop:screenHeight/6 }}
                resizeMode="contain"
              />
            </ImageZoom>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default System_DefineQueue;

/* ---------------- Reusable Section Component ---------------- */
const Section = ({ icon, title, expanded, onToggle, children }) => (
  <View style={{ marginBottom: 20 }}>
    <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
      <View style={styles.row}>
        <Icon name={icon} size={20} color="#2563EB" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Icon name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#4B5563" />
    </TouchableOpacity>
    {expanded && <View>{children}</View>}
  </View>
);

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingVertical: 16, paddingHorizontal: 16 },
  wrapper: { maxWidth: 900, alignSelf: "center" },
  headingBox: { marginBottom: 24 },
  heading: { fontSize: 22, fontWeight: "bold", color: "#111827", borderBottomWidth: 2, borderBottomColor: "#2563EB", paddingBottom: 12, textAlign: "center" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, borderColor: "#E5E7EB", padding: 16, borderTopColor: "black" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 12 },
  row: { flexDirection: "row", alignItems: "center" },
  sectionTitle: { marginLeft: 8, fontSize: 18, fontWeight: "600", color: "#111827" },
  text: { fontSize: 15, color: "#374151", lineHeight: 22, marginBottom: 6 },
  listText: { fontSize: 15, color: "#374151", marginLeft: 12, marginBottom: 6 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap" },
  cardBox: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 8, padding: 12, margin: 6, minWidth: 150, flex: 1 },
  cardTitle: { fontWeight: "600", color: "#1F2937", marginBottom: 6 },
  flexCol: { flex: 1, minWidth: 150 },
  flowchart: { backgroundColor: "#F3F4F6", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#D1D5DB", alignItems: "center" },
  code: { fontFamily: "monospace", fontSize: 14, color: "#374151", lineHeight: 20, marginBottom: 12 },
  modalButton: { backgroundColor: "#2563EB", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  divider: { borderBottomWidth: 0.5, borderBottomColor: "black", marginVertical: 4 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" },
  modalContent: { flex: 1, width: screenWidth, height: screenHeight, justifyContent: "center", alignItems: "center" },
  closeButton: { position: "absolute", top: 40, right: 20, zIndex: 10 },
  closeButtonText: { fontSize: 18, color: "#fff", fontWeight: "600" },
});
