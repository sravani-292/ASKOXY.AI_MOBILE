import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
  Clipboard,
  Image,
} from "react-native";
import BASE_URL from "../../../Config";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const BharathAgentstore = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const navigation = useNavigation();

  // Fetch agents
  const getAgents = async (afterId = null, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let url = `${BASE_URL}student-service/user/getAllAssistants?limit=10`;
      if (afterId) {
        url += `&after=${afterId}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization:
            "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI4ZjI5MjJkMS0yNmZjLTRlY2ItYWE4ZC00OWM1YjQ4ZDk3NDQiLCJpYXQiOjE3NTM1MjU0MzUsImV4cCI6MTc1NDM4OTQzNX0.TsIcuOPETQVFavDWoqK8Mo_fxbzOHSu_0AM_KfR79RtA0O3bCJ0E2jLpeT0jjTbEvQ4Ub4hapU3-EdxZycNgig",
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();

      if (result?.data && Array.isArray(result.data)) {
        const newAgents = result.data;
        const nextCursor = result.last_id || null;

        if (append) {
          setAgents((prev) => [...prev, ...newAgents]);
        } else {
          setAgents(newAgents);
        }

        setLastId(nextCursor);
        if (result.totalCount !== undefined) setTotalCount(result.totalCount);
      } else {
        if (!append) setAgents([]);
      }
    } catch (error) {
      console.error("Fetch agents error:", error);
      Alert.alert("Error", "Failed to load assistants.");
      if (!afterId) setAgents([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getAgents(null, false);
  }, []);

  useEffect(() => {
    const filtered = agents.filter((agent) => {
      const a = agent.assistant || agent;
      const text =
        `${a.name} ${a.instructions} ${a.description} ${a.model}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
    setFilteredAgents(filtered);
  }, [agents, search]);

  const onRefresh = () => {
    setRefreshing(true);
    setLastId(null);
    setSearch("");
    getAgents(null, false);
  };

  const loadMore = () => {
    if (lastId) {
      getAgents(lastId, true);
    } else {
      Alert.alert("No More Data", "All assistants have been loaded.");
    }
  };


  const goToChat = (agent) => {
    const assistant = agent.assistant || agent;
    const assistantId = assistant.id || assistant.assistantId;

    if (!assistantId) {
      Alert.alert("Error", "Assistant ID not found.");
      return;
    }

    navigation.navigate("GenOxyChatScreen", {
      assistantId,
      query: "",
      category: "Assistant",
      categoryType: assistant.name || "Assistant",
      fd: null,
    });
  };

  // Truncate description
  const getPreview = (text) => {
    if (!text) return "No description available";
    const clean = text.replace(
      /You are the dedicated .*? AI Assistant\.\s*/,
      ""
    );
    return clean.length > 120 ? clean.substring(0, 117) + "..." : clean;
  };

  
const renderAgentCard = ({ item }) => {
  const agent = item.assistant || item;
  const price = agent.price || "Free";
  const rating = agent.rating || 5;

  return (
    <View style={styles.agentCard}>
     <View style={styles.cardHeader}>
  <View style={styles.avatarContainer}>
    <Text style={styles.avatarText}>
      {agent.name?.charAt(0).toUpperCase() || "AI"}
    </Text>
  </View>

  <View style={styles.nameContainer}>
    <Text style={styles.agentName} numberOfLines={1}>
      {agent.name || "Unnamed Assistant"}
    </Text>
  </View>

  {/* Status Badge */}
  <View style={styles.statusBadge}>
    <Text style={styles.statusText}>Active</Text>
  </View>
</View>

      {/* Description */}
      <Text style={styles.agentPreview} numberOfLines={2}>
        {getPreview(agent.instructions || agent.description)}
      </Text>

      {/* Price */}
      <Text style={styles.price}>
        {price === "Free" ? "Free" : `₹${price}`}
      </Text>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Text key={i} style={[styles.star, i < rating ? styles.filledStar : {}]}>
            ★
          </Text>
        ))}
      </View>

      {/* Use Agent Button */}
      <TouchableOpacity style={styles.useButton} onPress={() => goToChat(agent)}>
        <Text style={styles.useButtonText}>→ Use Agent</Text>
      </TouchableOpacity>
    </View>
  );
};
  // Only show Load More if lastId exists
  const shouldShowLoadMore = lastId && agents.length > 0;

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {loading ? "" : search ? "No match found." : "No assistants available."}
      </Text>
      {!loading && !search && (
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading assistants...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search assistants..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>
       
      {/* Grid List */}
      <View style={{ flex: 1,marginBottom:60 }}>
      <FlatList
        data={filteredAgents}
        renderItem={renderAgentCard}
        keyExtractor={(item) =>
          item.id || item.assistantId || "key-" + Math.random()
        }
        numColumns={1}
        key={`grid-${1}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8B5CF6"
          />
        }
        ListEmptyComponent={renderEmpty}
        initialNumToRender={10}
      />
      </View>

      {/* Load More Button */}
      {shouldShowLoadMore && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={loadMore}
          disabled={loadingMore}
        >
          {loadingMore ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.loadMoreButtonText}>Load More</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BharathAgentstore;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    fontSize: 15,
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  agentCard: {
    backgroundColor: "#FFF",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // No flex: 1 — not needed in single column
  },
cardHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 12,
  gap: 10,
},

avatarContainer: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#8B5CF6",
  justifyContent: "center",
  alignItems: "center",
},

avatarText: {
  color: "#FFF",
  fontSize: 16,
  fontWeight: "bold",
},

nameContainer: {
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
},

agentName: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#1E293B",
  overflow: "hidden",
  textOverflow: "ellipsis", 
},

statusBadge: {
  backgroundColor: "#10B981",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 12,
  minWidth: 60,
  alignItems: "center",
},

statusText: {
  color: "#FFF",
  fontSize: 11,
  fontWeight: "600",
},
  agentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  price: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "600",
    marginBottom: 6,
  },
  agentPreview: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 12,
  },
  star: {
    fontSize: 14,
    color: "#E2E8F0",
  },
  filledStar: {
    color: "#FFD700",
  },
  useButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  useButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748B",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  loadMoreButton: {
    backgroundColor: "#8B5CF6",
    margin: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    top:-60,
  },
  loadMoreButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
