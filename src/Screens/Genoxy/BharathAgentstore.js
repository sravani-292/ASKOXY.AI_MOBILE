import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import BASE_URL from "../../../Config";
import { useNavigation } from "@react-navigation/native";
import AIRoleImage from "../AIAgent/CreateAgent/AIRoleImage";
import CustomFAB from "./CustomFAB";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const BharathAgentstore = () => {
  const [agents, setAgents] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState("list");
  const [allAgentsLoaded, setAllAgentsLoaded] = useState(false);
  const [isLoadingAllAgents, setIsLoadingAllAgents] = useState(false);

  const navigation = useNavigation();
  const userData = useSelector((state) => state.counter);
  //  //console.log({userData})
    const token = userData?.accessToken;
    const userId = userData?.userId;
  // Image mapping
  const IMAGE_MAP = {
    code: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    finance: "https://media.licdn.com/dms/image/v2/D4D12AQH9ZTLfemnJgA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1730530043865?e=2147483647&v=beta&t=3GgdQbowwhu3jbuft6-XG2_jPZUSLa0XiCRgSz6AqBg",
    business: "https://media.istockphoto.com/id/1480239160/photo/an-analyst-uses-a-computer-and-dashboard-for-data-business-analysis-and-data-management.jpg?s=612x612&w=0&k=20&c=Zng3q0-BD8rEl0r6ZYZY0fbt2AWO9q_gC8lSrwCIgdk=",
    technology: "https://www.bluefin.com/wp-content/uploads/2020/08/ai-future.jpg",
    og: "https://i.ibb.co/gZjkJyQ8/1a.png",
    irdai: "https://www.livemint.com/lm-img/img/2024/05/30/600x338/Irdai_health_insurance_1717036677791_1717036677946.png",
    gst: "https://zetran.com/wp-content/uploads/2025/02/GST-Compliance-and-Fraud-Detection-using-AI.jpg",
    law: "https://royalsociety.org/-/media/events/2025/9/ai-and-the-law/ai-and-the-law-image.jpg",
  };

  const DEFAULT_IMAGE = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFQjSgjdQbvnhDH7go4ETwAOEu05VpFIAOVg&s",
    "https://www.bluefin.com/wp-content/uploads/2020/08/ai-future.jpg",
  ];

  const getAgentImage = (name, agentId) => {
    if (!name) {
      const index = agentId ? agentId.length % DEFAULT_IMAGE.length : 0;
      return DEFAULT_IMAGE[index];
    }

    const lowerName = name.toLowerCase();

    if (lowerName.includes("og")) {
      return IMAGE_MAP.og;
    }

    for (const key in IMAGE_MAP) {
      if (lowerName.includes(key)) {
        return IMAGE_MAP[key];
      }
    }

    const index = agentId ? agentId.length % DEFAULT_IMAGE.length : 0;
    return DEFAULT_IMAGE[index];
  };

  // Fetch agents
  const getAgents = async (afterId = null, append = false) => {
    // //console.log("Fetching agents, afterId:", afterId, "append:", append);

    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let url = `${BASE_URL}ai-service/agent/getAllAssistants?limit=100`;

      if (afterId) {
        url += `&after=${afterId}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      //console.log("Fetched agents count:", result.data?.length);

      if (result?.data && Array.isArray(result.data)) {
        const approvedAgents = result.data.filter(
          (agent) => agent.status === "APPROVED"
        );
        const nextCursor = result.lastId || null;

        if (append) {
          setAllAgents((prev) => [...prev, ...approvedAgents]);
          setAgents((prev) => [...prev, ...approvedAgents]);
        } else {
          setAllAgents(approvedAgents);
          setAgents(approvedAgents);
          setFilteredAgents(approvedAgents); // Set initial filtered agents
        }

        setLastId(nextCursor);
        setHasMore(!!nextCursor);

        if (!nextCursor) {
          setAllAgentsLoaded(true);
        }
        if (result.totalCount !== undefined) setTotalCount(result.totalCount);

        //console.log("Agents loaded successfully:", approvedAgents.length);
      } else {
        //console.log("No data received or invalid format");
        if (!append) {
          setAgents([]);
          setAllAgents([]);
          setFilteredAgents([]);
        }
      }
    } catch (error) {
      console.error("Fetch agents error:", error);
      Alert.alert("Error", "Failed to load assistants.");
      if (!afterId) {
        setAgents([]);
        setAllAgents([]);
        setFilteredAgents([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Load agents on mount
  useEffect(() => {
    //console.log("Component mounted, loading agents...");
    getAgents(null, false);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load all agents for search - wrapped in useCallback to prevent infinite loops
  const loadAllAgents = useCallback(async () => {
    if (allAgentsLoaded || isLoadingAllAgents) {
      //console.log("All agents already loaded or loading in progress");
      return allAgents; // Return existing agents if already loaded
    }

    //console.log("Loading all agents for search...");
    setIsLoadingAllAgents(true);
    
    let currentLastId = lastId;
    let allLoadedAgents = [...allAgents];

    try {
      while (currentLastId) {
        const url = `${BASE_URL}ai-service/agent/getAllAssistants?limit=100&after=${currentLastId}`;
        //console.log(`Fetching batch after ID: ${currentLastId}`);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          //console.log(`Failed to fetch batch: ${response.status}`);
          break;
        }

        const result = await response.json();
        const approvedAgents = result.data?.filter(agent => agent.status === "APPROVED") || [];

        allLoadedAgents = [...allLoadedAgents, ...approvedAgents];
        currentLastId = result.lastId;

        //console.log(`✓ Loaded batch: ${approvedAgents.length} agents, Total: ${allLoadedAgents.length}`);
        
        if (!currentLastId) {
          //console.log("No more pages to load");
          break;
        }
      }

      // Update state with all loaded agents
      setAllAgents(allLoadedAgents);
      setAllAgentsLoaded(true);
      setIsLoadingAllAgents(false);
      //console.log(`✅ All agents loaded successfully: ${allLoadedAgents.length} total`);
      
      return allLoadedAgents; // Return the complete list
    } catch (error) {
      console.error("❌ Error loading all agents:", error);
      setIsLoadingAllAgents(false);
      return allLoadedAgents; // Return what we have so far
    }
  }, [allAgentsLoaded, isLoadingAllAgents, lastId, allAgents]);

  // Search functionality - Fixed to wait for all agents to load
  useEffect(() => {
    const performSearch = async () => {
      //console.log("🔍 Performing search for:", debouncedSearch);
      
      // If no search, show current agents
      if (!debouncedSearch || debouncedSearch.trim() === '') {
        //console.log("No search query, showing all loaded agents:", agents.length);
        setFilteredAgents(agents);
        return;
      }

      // Always try to load all agents when searching
      let searchSource = agents;
      
      if (!allAgentsLoaded && hasMore && !isLoadingAllAgents) {
        //console.log("🔄 Loading all agents for comprehensive search...");
        const loadedAgents = await loadAllAgents();
        // Use the freshly loaded agents for search
        searchSource = loadedAgents && loadedAgents.length > 0 ? loadedAgents : allAgents;
        //console.log(`Using ${searchSource.length} agents for search`);
      } else if (allAgentsLoaded) {
        // All agents already loaded, use them
        searchSource = allAgents;
        //console.log(`Using cached ${searchSource.length} agents for search`);
      } else {
        // Fallback to currently loaded agents
        searchSource = agents;
        //console.log(`Using currently loaded ${searchSource.length} agents for search`);
      }

      const searchLower = debouncedSearch.toLowerCase().trim();

      const filtered = searchSource.filter((agent) => {
        const a = agent.assistant || agent;
        const name = String(a.name || '').toLowerCase();
        const description = String(a.description || '').toLowerCase();
        const instructions = String(a.instructions || '').toLowerCase();

        const matches = name.includes(searchLower) ||
          description.includes(searchLower) ||
          instructions.includes(searchLower);
        
        if (matches) {
          //console.log(`✓ Match found: ${a.name}`);
        }
        
        return matches;
      });

      setFilteredAgents(filtered);
      //console.log(`✅ Search '${debouncedSearch}': Found ${filtered.length} results from ${searchSource.length} total agents`);
      
      // Log first few matches for debugging
      if (filtered.length > 0) {
        //console.log("First matches:", filtered.slice(0, 3).map(f => (f.assistant || f).name));
      }
    };

    performSearch();
  }, [debouncedSearch, allAgentsLoaded]); // Depend on allAgentsLoaded too

  const handleSearchChange = (text) => {
    setSearch(text);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setLastId(null);
    setSearch("");
    setDebouncedSearch("");
    setAllAgentsLoaded(false);
    setIsLoadingAllAgents(false);
    setAllAgents([]);
    getAgents(null, false);
  };

  const loadMore = () => {
    if (lastId && !loadingMore && hasMore && !debouncedSearch.trim()) {
      //console.log('Loading more agents...');
      getAgents(lastId, true);
    }
  };

  const goToChat = (agent) => {
    const assistant = agent.assistant || agent;
    const assistantId = assistant.id || assistant.assistantId;

    if (!assistantId) {
      Alert.alert("Error", "Assistant ID not found.");
      return;
    }

    if (assistant.name === "THE FAN OF OG") {
      navigation.navigate("Image Creator", {
        assistantId,
        query: "",
        category: "Fan of OG",
        agentName: "Fan of OG",
        fd: null,
        agentId: assistant.agentId
      });
      return;
    } else {
      navigation.navigate("GenOxyChatScreen", {
        assistantId,
        query: "",
        category: "Assistant",
        agentName: assistant.name || "Assistant",
        fd: null,
        agentId: assistant.agentId
      });
    }
  };

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
    const isGridMode = viewMode === "grid";

    const agentImage = agent.imageUrl || getAgentImage(agent.name, agent.agentId || agent.id);

    return (
      <TouchableOpacity
        style={[
          styles.agentCard,
          isGridMode ? styles.gridCard : styles.listCard,
        ]}
        onPress={() => goToChat(agent)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: agentImage }}
            style={[isGridMode ? styles.agentImage : styles.listImage]}
            resizeMode="cover"
            fadeDuration={0}
          />
        </View>

        <View style={styles.cardHeader}>
          <View style={styles.headerInfo}>
            <Text style={styles.agentName} numberOfLines={2}>
              {agent.name || "Unnamed Assistant"}
            </Text>
            <View style={styles.metaRow}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor("active") },
                ]}
              >
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
              <Text style={styles.price}>
                {price === "Free" ? "Free" : `₹${price}`}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.agentPreview} numberOfLines={isGridMode ? 2 : 3}>
          {getPreview(agent.instructions || agent.description)}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, i) => (
              <Text
                key={i}
                style={[styles.star, i < rating ? styles.filledStar : {}]}
              >
                ★
              </Text>
            ))}
            <Text style={styles.ratingText}>({rating}.0)</Text>
          </View>

          <TouchableOpacity
            style={styles.useButton}
            onPress={() => goToChat(agent)}
          >
            <Text style={styles.useButtonText}>Use Agent</Text>
            <Text style={styles.arrowIcon}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cornerAccent} />
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status) => {
    return status === "active" ? "#10B981" : "#64748B";
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>🤖</Text>
      </View>
      <Text style={styles.emptyTitle}>
        {debouncedSearch ? "No matches found" : "No assistants available"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {debouncedSearch
          ? "Try adjusting your search terms"
          : "Check back later for new assistants"}
      </Text>
      {!loading && !debouncedSearch && (
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
     
      <View style={styles.searchInputWrapper}>
        <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIconLeft} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search AI assistants..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={handleSearchChange}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearchChange("")}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
       {/* <TouchableOpacity onPress={() => navigation.navigate("Agent Creation")} style={styles.addButton}>
        <Text style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>Add Agent</Text>
      </TouchableOpacity> */}
      {renderSearchBar()}
      <TouchableOpacity
        onPress={() => navigation.navigate("Agent Creation")}
      >
        <AIRoleImage />
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredAgents.length} assistant
          {filteredAgents.length !== 1 ? "s" : ""} available
        </Text>

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "list" && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode("list")}
          >
            <Text
              style={[
                styles.toggleIcon,
                viewMode === "list" && styles.toggleIconActive,
              ]}
            >
              ☰
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "grid" && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode("grid")}
          >
            <Text
              style={[
                styles.toggleIcon,
                viewMode === "grid" && styles.toggleIconActive,
              ]}
            >
              ⊞
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing && agents.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSpinner}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
        <Text style={styles.loadingText}>Discovering AI assistants...</Text>
        <Text style={styles.loadingSubtext}>This might take a moment</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}

      <View style={styles.contentContainer}>
        <FlatList
          data={filteredAgents}
          renderItem={renderAgentCard}
          keyExtractor={(item, index) =>
            `${item.id || item.assistantId || item.agentId}-${index}`
          }
          numColumns={viewMode === "grid" ? 2 : 1}
          key={viewMode}
          contentContainerStyle={[
            styles.listContainer,
            viewMode === "grid" && styles.gridContainer,
          ]}
          columnWrapperStyle={viewMode === "grid" && styles.gridWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8B5CF6"
              colors={["#8B5CF6"]}
            />
          }
          ListEmptyComponent={!loading && filteredAgents.length === 0 ? renderEmpty : null}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          updateCellsBatchingPeriod={100}
          ListFooterComponent={loadingMore && !debouncedSearch.trim() ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#8B5CF6" />
              <Text style={styles.footerText}>Loading more agents...</Text>
            </View>
          ) : null}
        />
      </View>

      <CustomFAB navigation={navigation} />
    </View>
  );
};

export default BharathAgentstore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerContainer: {
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    height: 48,
  },
  searchIconLeft: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleIcon: {
    fontSize: 16,
    color: "#64748B",
  },
  toggleIconActive: {
    color: "#8B5CF6",
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  gridContainer: {
    paddingHorizontal: 8,
  },
  gridWrapper: {
    justifyContent: "space-between",
  },
  agentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
    overflow: "hidden",
  },
  listCard: {
    marginHorizontal: 4,
    width: "100%",
    minHeight: 200,
  },
  gridCard: {
    flex: 0,
    marginHorizontal: 4,
    width: (width - 48) / 2,
    minHeight: 280,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  agentImage: {
    width: "100%",
    height: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  listImage: {
    width: "100%",
    height: 240,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  agentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    marginRight: 4,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  price: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "500",
  },
  agentPreview: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 16,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 12,
    color: "#D1D5DB",
    marginRight: 2,
  },
  filledStar: {
    color: "#FBBF24",
  },
  ratingText: {
    fontSize: 10,
    color: "#6B7280",
    marginLeft: 4,
  },
  useButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    elevation: 1,
  },
  useButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    marginRight: 4,
  },
  arrowIcon: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  cornerAccent: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: "#8B5CF6",
    opacity: 0.1,
    borderBottomLeftRadius: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 40,
  },
  loadingSpinner: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "500",
    marginBottom: 6,
  },
  loadingSubtext: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#F8FAFC",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  emptyIconText: {
    fontSize: 28,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1E293B",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 18,
  },
  retryButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 1,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  footerText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
 addButton: {
  backgroundColor: '#FBBF24', 
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  width: 120,
  alignItems: 'center',     
  justifyContent: 'center',  
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

});