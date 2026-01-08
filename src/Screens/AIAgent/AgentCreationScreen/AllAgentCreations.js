import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BASE_URL from "../../../../Config";

const { height, width } = Dimensions.get("window");

const AllAgentCreations = () => {
  const navigation = useNavigation();
  const [assistantsData, setAssistantsData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedInstructions, setExpandedInstructions] = useState({});
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAssistants = () => {
    setLoading(true);
    axios({
      url: `${BASE_URL}ai-service/agent/allAgentDataList?userId=e00536d6-a7eb-40d9-840c-38acaceb6177`,
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMDA1MzZkNi1hN2ViLTQwZDktODQwYy0zOGFjYWNlYjYxNzciLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjg4NzI0NTI0fQ.3n7mXGm8K8k3bX4eHkG3p7Ykqfq5r8u1i3rUuXv6U8",
      },
    })
      .then((response) => {
        setAssistantsData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Assistants error", error);
        setLoading(false);
      });
  };

  // Filter assistants based on search query
  const filterAssistants = (query) => {
    if (!assistantsData || !assistantsData.assistants) return;
    
    if (!query.trim()) {
      setFilteredData(assistantsData);
      return;
    }
    
    const filteredAssistants = assistantsData.assistants.filter(assistant => {
      const searchLower = query.toLowerCase();
      return (
        (assistant.userRole && assistant.userRole.toLowerCase().includes(searchLower)) ||
        (assistant.name && assistant.name.toLowerCase().includes(searchLower)) ||
        (assistant.headerTitle && assistant.headerTitle.toLowerCase().includes(searchLower))
      );
    });
    
    setFilteredData({
      ...assistantsData,
      assistants: filteredAssistants
    });
  };

  // Handle search input change
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    filterAssistants(text);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchAssistants();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAssistants();
    }, [])
  );

  const toggleInstructions = (assistantId) => {
    setExpandedInstructions((prev) => ({
      ...prev,
      [assistantId]: !prev[assistantId],
    }));
  };

  const toggleDescription = (id) => {
    setIsDescriptionExpanded((prev) => !prev);
  };

  const truncateText = (text, lines = 3) => {
    if (!text) return "";
    const words = text.split(" ");
    const wordsPerLine = 10; // Approximate words per line
    const maxWords = lines * wordsPerLine;
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status, screenStatus) => {
    if (screenStatus === "publish") {
      return {
        text: "Published",
        style: styles.publishedBadge,
        textStyle: styles.publishedBadgeText,
      };
    } else {
      return {
        text: "Draft",
        style: styles.draftBadge,
        textStyle: styles.draftBadgeText,
      };
    }
  };

  const renderAssistantCard = ({ item: assistant }) => {
    const statusBadge = getStatusBadge(
      assistant.status,
      assistant.screenStatus
    );
    const isExpanded = expandedInstructions[assistant.id];

    return (
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.headerTop}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {assistant.name?.charAt(0) || "A"}
                </Text>
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.agentName}>{assistant.agentName}{assistant.id}</Text>
                <Text style={styles.userName}>{assistant.name}</Text>
              </View>
            </View>
            <View style={statusBadge.style}>
              <Text style={statusBadge.textStyle}>{statusBadge.text}</Text>
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.leftGroup}>
              <Text style={styles.roleText}>👤 {assistant.userRole}</Text>
              <Text style={styles.roleText}>🌐 {assistant.language}</Text>
            </View>
            <TouchableOpacity style={styles.updatebtn} onPress={()=>navigation.navigate("Agent Creation Screen",{agentData:assistant})}>
              <Text style={styles.updateText}>📝 Update</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          {/* Key Information */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{assistant.agentStatus}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Active:</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: assistant.activeStatus ? "#10B981" : "#EF4444" },
                ]}
              >
                {assistant.activeStatus ? "Yes" : "No"}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Experience:</Text>
              <Text style={styles.infoValue}>
                {assistant.userExperience} years
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Achievements:</Text>
              <Text style={styles.infoValue}>🏆 {assistant.acheivements}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>headerTitle:</Text>
              <Text style={styles.infoValue}>{assistant.headerTitle}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.infoValue}>{assistant.screenStatus}</Text>
            </View>
          </View>

          {/* Description */}
          {assistant.description && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Description</Text>
                <TouchableOpacity
                  onPress={() => toggleDescription(assistant.id)}
                  style={styles.moreButton}
                >
                  <Text style={styles.moreButtonText}>
                    {isDescriptionExpanded ? "Show Less" : "More"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionText}>
                {isDescriptionExpanded
                  ? assistant.description
                  : truncateText(assistant.description, 3)}
              </Text>
            </View>
          )}

          {/* Experience Summary */}
          {assistant.userExperienceSummary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience Summary</Text>
              <Text style={styles.sectionText}>
                {assistant.userExperienceSummary}
              </Text>
            </View>
          )}

          {/* Instructions */}
          {assistant.instructions && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📋 Instructions</Text>
                <TouchableOpacity
                  onPress={() => toggleInstructions(assistant.id)}
                  style={styles.moreButton}
                >
                  <Text style={styles.moreButtonText}>
                    {isExpanded ? "Show Less" : "More"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sectionText}>
                {isExpanded
                  ? assistant.instructions
                  : truncateText(assistant.instructions, 3)}
              </Text>
            </View>
          )}

          {/* Timestamps */}
          <View style={styles.timestampContainer}>
            <View style={styles.timestampRow}>
              <Text style={styles.timestampLabel}>Created:</Text>
              <Text style={styles.timestampValue}>
                {formatDate(assistant.created_at)}
              </Text>
            </View>
            <View style={styles.timestampRow}>
              <Text style={styles.timestampLabel}>Updated:</Text>
              <Text style={styles.timestampValue}>
                {formatDate(assistant.updatedAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerCount}>
        Total Assistants: {filteredData?.assistants?.length || 0}
      </Text>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by role, name, or title..."
        value={searchQuery}
        onChangeText={handleSearchChange}
        clearButtonMode="while-editing"
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No Matching Assistants Found" : "No Assistants Found"}
      </Text>
      <Text style={styles.emptyText}>
        {searchQuery 
          ? "Try a different search term" 
          : "You haven't created any assistants yet."}
      </Text>
    </View>
  );

  const keyExtractor = (item) =>
    item.id?.toString() || Math.random().toString();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading Assistants...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createBtn} onPress={()=>navigation.navigate("Agent Creation Screen")}>
        <Text style={{color:"white"}}>Create agent</Text>
      </TouchableOpacity>
      {renderSearchBar()}
      <FlatList
        data={filteredData?.assistants || []}
        renderItem={renderAssistantCard}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          filteredData?.assistants?.length > 0 ? renderHeader : null
        }
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366F1"]}
            tintColor="#6366F1"
          />
        }
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 400, // Approximate height of each card
          offset: 400 * index,
          index,
        })}
      />
    </View>
  );
};

export default AllAgentCreations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchInput: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  createBtn:{
    padding:10,
    backgroundColor:"#6366F1",
    margin:10,
    borderRadius:5,
    alignItems:"center",
    alignSelf:"flex-end"
  },
  header: {
    padding: 20,
    paddingTop: 20,
    paddingHorizontal: 4,
  },
  headerCount: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  nameContainer: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  userName: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  publishedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  publishedBadgeText: {
    color: "#166534",
    fontSize: 12,
    fontWeight: "500",
  },
  draftBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  draftBadgeText: {
    color: "#92400E",
    fontSize: 12,
    fontWeight: "500",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  updatebtn: {
    backgroundColor: "#E0E7FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  updateText: {
    color: "#3730A3",
    fontSize: 15,
    fontWeight: "500",
  },
  roleText: {
    fontSize: 14,
    color: "#6B7280",
  },
  cardBody: {
    padding: 20,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  infoItem: {
    width: "50%",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  sectionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  moreButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  moreButtonText: {
    color: "#6366F1",
    fontSize: 12,
    fontWeight: "500",
  },
  timestampContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  timestampRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timestampLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  timestampValue: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});