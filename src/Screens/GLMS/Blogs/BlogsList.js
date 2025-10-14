import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import BASE_URL from "../../../../Config";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

const { height, width } = Dimensions.get("window");

const BlogsList = ({navigation}) => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  const userData = useSelector((state) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;

  useFocusEffect(
    useCallback(() => {
      fetchblogs();
    }, [])
  );

  useEffect(() => {
    filterAndSortBlogs();
  }, [searchQuery, blogs, sortOrder]);

  function fetchblogs() {
    setLoading(true);
    axios({
      method: "get",
      url: `${BASE_URL}marketing-service/campgin/getAllCampaignDetails`,
    })
      .then((response) => {
        setBlogs(response.data || []);
      })
      .catch((error) => {
        console.log("error", error);
        setBlogs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const filterAndSortBlogs = () => {
    let filtered = [...blogs];

    // Filter blogs based on search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(blog => {
        const campaignType = blog.campaignType?.toLowerCase() || "";
        const campaignTypeAddBy = blog.campaignTypeAddBy?.toLowerCase() || "";
        
        return campaignType.includes(query) || campaignTypeAddBy.includes(query);
      });
    }

    // Sort blogs by createdAt date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      if (sortOrder === "asc") {
        return dateA - dateB; // Oldest first
      } else {
        return dateB - dateA; // Newest first (default)
      }
    });

    setFilteredBlogs(filtered);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === "asc" ? "desc" : "asc");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const renderBlogItem = ({ item }) => {
    const imageUrl =
      item.imageUrls && item.imageUrls.length > 0
        ? item.imageUrls[0].imageUrl
        : null;

    return (
      <TouchableOpacity style={styles.blogCard} activeOpacity={0.8} onPress={()=>navigation.navigate("Blog Details",{blogData:item})}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.blogImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.fallbackImage}>
            <Text style={styles.fallbackText}>
              {item.campaignType
                ? item.campaignType.charAt(0).toUpperCase()
                : "No Image"}
            </Text>
          </View>
        )}

        <View style={styles.blogContent}>
          <View style={styles.campaignTypeContainer}>
            <Text style={styles.campaignType}>{item.campaignType}</Text>
          </View>

          {item.campaignTypeAddBy && (
            <View style={styles.addByContainer}>
              <Text style={styles.addByText}>Added by: {item.campaignTypeAddBy}</Text>
            </View>
          )}

          <Text style={styles.description}>
            {truncateDescription(item.campaignDescription)}
          </Text>

          {item.socialMediaCaption && (
            <View style={styles.captionContainer}>
              <Text style={styles.captionLabel}>Social Media Caption:</Text>
              <Text style={styles.caption}>
                {truncateDescription(item.socialMediaCaption, 100)}
              </Text>
            </View>
          )}

          <View style={styles.footerContainer}>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  {
                    backgroundColor: item.campaignStatus
                      ? "#4CAF50"
                      : "#F44336",
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {item.campaignStatus ? "Active" : "Inactive"}
              </Text>
            </View>
            <View>
              <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading blogs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Blogs & Campaigns</Text>
          <Text style={styles.headerSubtitle}>
            {filteredBlogs.length} {filteredBlogs.length === 1 ? "item" : "items"}
            {searchQuery ? ` (filtered from ${blogs.length})` : ""}
          </Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Add Blog")}>
          <Ionicons name="add-circle-outline" size={28} color="#6C63FF" />
        </TouchableOpacity>
      </View>

      {/* Search and Sort Bar */}
      <View style={styles.searchSortContainer}>
        {/* Search Input */}
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#7F8C8D" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by campaign type or added by..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close" size={18} color="#7F8C8D" />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Button */}
        <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
          <Ionicons 
            name={sortOrder === "asc" ? "arrow-up" : "arrow-down"} 
            size={20} 
            color="#6C63FF" 
          />
          <Text style={styles.sortButtonText}>
            {sortOrder === "asc" ? "Oldest" : "Newest"}
          </Text>
        </TouchableOpacity>
      </View>

      {filteredBlogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          {searchQuery ? (
            <>
              <Text style={styles.emptyText}>No matching blogs found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search terms or clear the search
              </Text>
              <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.emptyText}>No blogs available</Text>
              <Text style={styles.emptySubtext}>
                Pull to refresh or try again later
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredBlogs}
          renderItem={renderBlogItem}
          keyExtractor={(item) => item.campaignId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          onRefresh={fetchblogs}
          refreshing={loading}
        />
      )}
    </View>
  );
};

export default BlogsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  searchSortContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#2C3E50",
  },
  clearButton: {
    padding: 4,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#6C63FF",
    minWidth: 100,
    justifyContent: "center",
  },
  sortButtonText: {
    color: "#6C63FF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  blogCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  blogImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#E5E5E5",
  },
  blogContent: {
    padding: 16,
  },
  fallbackImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#BDC3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  campaignTypeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    maxWidth: width*0.8,
    alignSelf: "center",
    marginBottom: 8,
  },
  campaignType: {
    color: "#6C63FF",
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    flexShrink: 1,
    textAlign: "center"
  },
  addByContainer: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  addByText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#2C3E50",
    lineHeight: 20,
    marginBottom: 12,
    textAlign: "justify",
  },
  captionContainer: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#6C63FF",
    marginBottom: 12,
  },
  captionLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  caption: {
    fontSize: 13,
    color: "#34495E",
    fontStyle: "italic",
    lineHeight: 18,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#7F8C8D",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#2C3E50",
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  clearSearchButton: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearSearchText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});