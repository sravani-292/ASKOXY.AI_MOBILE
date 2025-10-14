import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import {
  Info,
  Users,
  CheckCircle,
  ChevronRight,
  List,
  ChevronDown,
  ChevronUp,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react-native";
import Ionicons from "react-native-vector-icons/Ionicons"

import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

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

  const [modalVisible, setModalVisible] = useState(false);
  const scale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
    },
    onEnd: () => {
      scale.value = withTiming(1); // Reset zoom after pinch ends
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Allocation Hold for Delinquent Cases</Text>
        </View>

        {/* Content Sections */}
        <View style={styles.sections}>
          {/* Overview */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("overview")}
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
                Allocation hold is used to defer allocation of a case to another
                user in the next allocation process, by marking the case.
              </Text>
            )}
          </View>

          {/* Actors */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("actors")}
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
                <Text style={styles.listItem}>
                  • User may hold the allocation of the cases.
                </Text>
              </View>
            )}
          </View>

          {/* Preconditions */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("preconditions")}
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
                  • Delinquent cases are classified and mapped to the
                  communication templates for auto communication.
                </Text>
              </View>
            )}
          </View>

          {/* Post Conditions */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("postconditions")}
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
              <Text style={styles.sectionText}>
                The user extracts the list of delinquent cases and may keep
                certain cases on hold to defer allocation.
              </Text>
            )}
          </View>

          {/* Flowchart */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection("flowchart")}
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
              <View>
                <Text style={styles.flowchartText}>
                  Tap below to view detailed flowchart image.
                </Text>

                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.linkButton}
                >
                  <Text style={styles.linkText}>View Image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Modal for Image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          <View style={styles.modalContainer}>
            

            <PinchGestureHandler onGestureEvent={pinchHandler}>
              <Animated.View style={[styles.imageContainer, animatedStyle]}>
                <Image
                  source={{ uri: "https://i.ibb.co/LD6k5ZYn/allocation-hold-for-delinquent-cases.png" }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </PinchGestureHandler>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { paddingVertical: 40, paddingHorizontal: 16, alignItems: "center" },
  header: { marginBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 16,
    width: width * 0.9,
    textAlign: "center",
  },
  sections: { gap: 32 },
  section: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: width * 0.9,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "600", color: "#111827" },
  sectionText: { fontSize: 16, color: "#4b5563", lineHeight: 24 },
  listItem: { fontSize: 16, color: "#4b5563", lineHeight: 24, marginBottom: 4 },
  linkButton: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  linkText: { color: "#fff", fontWeight: "600" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.95,
    height: height * 0.85,
    borderRadius: 12,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  flowchartText: { fontSize: 16, color: "#374151", marginBottom: 8 },
});

export default AllocationHoldUseCaseBusiness;
