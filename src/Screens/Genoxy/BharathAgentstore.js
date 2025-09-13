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
  Image,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import BASE_URL from "../../../Config";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const { width } = Dimensions.get('window');

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
  const [viewMode, setViewMode] = useState('grid'); // Default to grid
  const [showData, setShowData] = useState(false); // New state to control data visibility

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

  const renderAgentCard = ({ item, index }) => {
    const agent = item.assistant || item;
    const price = agent.price || "Free";
    const rating = agent.rating || 5;
    const isGridMode = viewMode === 'grid';
    const hasImage = agent.imageUrl; // Assuming imageUrl exists in agent data, adjust key as needed
    const initial = agent.name?.charAt(0).toUpperCase() || "A";

    return (
      <TouchableOpacity 
        style={[
          styles.agentCard,
          isGridMode ? styles.gridCard : styles.listCard,
          { opacity: showData ? 1 : 0 }
        ]}
        onPress={() => goToChat(agent)}
        activeOpacity={0.8}
      >
        {/* Agent Image or Initial */}
        <View style={styles.imageContainer}>
          {hasImage ? (
            <Image
              source={{ uri: agent.imageUrl }}
              style={styles.agentImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.initialContainer, { backgroundColor: getAvatarColor(agent.name) }]}>
              <Text style={styles.initialText}>{initial}</Text>
            </View>
          )}
        </View>

        {/* Enhanced Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.headerInfo}>
            <Text style={styles.agentName} numberOfLines={1}>
              {agent.name || "Unnamed Assistant"}
            </Text>
            <View style={styles.metaRow}>
              <View style={[styles.statusBadge, { 
                backgroundColor: getStatusColor('active') 
              }]}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
              <Text style={styles.price}>
                {price === "Free" ? "Free" : `₹${price}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Enhanced Description */}
        <Text style={styles.agentPreview} numberOfLines={isGridMode ? 2 : 3}>
          {getPreview(agent.instructions || agent.description)}
        </Text>

        {/* Enhanced Rating & Actions */}
        <View style={styles.cardFooter}>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, i) => (
              <Text key={i} style={[styles.star, i < rating ? styles.filledStar : {}]}>
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

        {/* Floating corner accent */}
        <View style={styles.cornerAccent} />
      </TouchableOpacity>
    );
  };

  // Helper functions for dynamic styling
  const getAvatarColor = (name) => {
    const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5A2B'];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#10B981' : '#64748B';
  };

  const shouldShowLoadMore = lastId && agents.length > 0;

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>🤖</Text>
      </View>
      <Text style={styles.emptyTitle}>
        {search ? "No matches found" : "No assistants available"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {search 
          ? "Try adjusting your search terms" 
          : "Check back later for new assistants"
        }
      </Text>
      {!loading && !search && (
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Enhanced Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search AI assistants..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats & View Toggle */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredAgents.length} assistant{filteredAgents.length !== 1 ? 's' : ''} available
        </Text>
        
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleIcon, viewMode === 'list' && styles.toggleIconActive]}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'grid' && styles.toggleButtonActive]}
            onPress={() => setViewMode('grid')}
          >
            <Text style={[styles.toggleIcon, viewMode === 'grid' && styles.toggleIconActive]}>⊞</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing) {
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
    <TouchableWithoutFeedback onPress={() => setShowData(true)}>
      <View style={styles.container}>
        {/* Enhanced Header */}
        {renderHeader()}
        
        {/* Enhanced Grid/List */}
        <View style={styles.contentContainer}>
          <FlatList
            data={showData ? filteredAgents : []}
            renderItem={renderAgentCard}
            keyExtractor={(item) =>
              item.id || item.assistantId || "key-" + Math.random()
            }
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={`${viewMode}-${viewMode === 'grid' ? 2 : 1}`}
            contentContainerStyle={[
              styles.listContainer,
              viewMode === 'grid' && styles.gridContainer
            ]}
            columnWrapperStyle={viewMode === 'grid' && styles.gridWrapper}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#8B5CF6"
                colors={['#8B5CF6']}
              />
            }
            ListEmptyComponent={showData ? renderEmpty : null}
            initialNumToRender={10}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
          />
        </View>

        {/* Enhanced Load More Button */}
        {shouldShowLoadMore && showData && (
          <View style={styles.loadMoreContainer}>
            <TouchableOpacity
              style={[styles.loadMoreButton, loadingMore && styles.loadMoreButtonDisabled]}
              onPress={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Text style={styles.loadMoreButtonText}>Load More Assistants</Text>
                  <Text style={styles.loadMoreIcon}>↓</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default BharathAgentstore;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" 
  },
  
  // Enhanced Header Styles
  headerContainer: {
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
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
  
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    height: 50,
  },
  
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    opacity: 0.6,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    height: "100%",
  },
  
  clearIcon: {
    fontSize: 14,
    color: "#64748B",
    padding: 4,
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

  // Enhanced Content Styles
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
    justifyContent: 'space-between',
  },

  // Enhanced Card Styles
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
    width: '48%', // Adjusted for better spacing in grid
  },
  
  listCard: {
    marginHorizontal: 4,
    width: '100%',
  },
  
  gridCard: {
    flex: 0,
    marginHorizontal: 4,
    maxWidth: (width - 32) / 2 - 8, // Adjusted for padding and margins
  },
  
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  
  agentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  initialContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  initialText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
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

  // Enhanced Loading Styles
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

  // Enhanced Empty State
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

  // Enhanced Load More
  loadMoreContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  
  loadMoreButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
  },
  
  loadMoreButtonDisabled: {
    opacity: 0.6,
  },
  
  loadMoreButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
  },
  
  loadMoreIcon: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});