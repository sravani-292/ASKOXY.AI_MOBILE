import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import BASE_URL from "../../../Config";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

const AIStore = ({navigation}) => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStoreCount, setActiveStoreCount] = useState(0);
  const [searchText, setSearchText] = useState("");


   const userData = useSelector((state) => state.counter);
  //  console.log({userData})
    const token = userData?.accessToken;
    const userId = userData?.userId;
  const getStores = async () => {
   
    axios.get(
        `${BASE_URL}ai-service/agent/getAiStoreAllAgents`,{headers:{
          Authorization:`Bearer ${token}`
        }}
      )
      .then((res) => {
        // console.log("Store data:", res.data);
        setLoading(false);
        const allStores = res.data || [];
        
        // Filter stores: ACTIVE status and has agents
        const filteredStores = allStores.filter(store => 
          store.aiStoreStatus === "ACTIVE" && 
          store.agentDetailsOnAdUser && 
          store.agentDetailsOnAdUser.length > 0
        );
        
        setStores(filteredStores);
        setFilteredStores(filteredStores);
        setActiveStoreCount(filteredStores.length);
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error fetching stores:", err.response);
      });
   
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === "") {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store =>
        store.storeName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

    function footer() {
    return (
      <View style={{ alignSelf: "center" }}>
        <Text>No More Stores Found </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore curated collections of AI Agents created by our community.</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stores..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor={"#808080"}
          />
        </View>
        
      </View>
              <Text style={styles.activeCount}>Active Stores: {activeStoreCount}</Text>

      <FlatList
      // horizontal
      data={filteredStores}
      keyExtractor={(item) => item.storeId}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const initials = item.storeName
          ?.split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        const agentCount = item.agentDetailsOnAdUser?.length || 0;

        const gradientColors = item.isCompanyStore
          ? ["#c084fc", "#9333ea"]
          : ["#fbbf24", "#d97706"];

        return (
          <View style={styles.card}>
            {/* Top Section */}
            <LinearGradient colors={gradientColors} style={styles.gradient}>
              {item.aiStoreStatus === "ACTIVE" && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredText}>Featured</Text>
                </View>
              )}

              {item.storeImageUrl ? (
                <Image
                  source={{ uri: item.storeImageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.initials}>{initials}</Text>
              )}
            </LinearGradient>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{item.storeName}</Text>
              <Text style={styles.description} numberOfLines={3}>
                {item.description}
              </Text>

              {/* Bottom Row */}
              <View style={styles.row}>
                <View style={styles.agentBadge}>
                  <Ionicons
                    name="sparkles"
                    size={14}
                    color="#6d28d9"
                  />
                  <Text style={styles.agentText}>
                    {agentCount} Agents
                  </Text>
                </View>

                {/*<TouchableOpacity style={styles.shareBtn}>
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color="#475569"
                  />
                </TouchableOpacity>*/}
              </View>

              {/* CTA */}
              <TouchableOpacity style={styles.exploreBtn} onPress={()=>navigation.navigate('Agent Details',{storeId:item.storeId,storeName:item.storeName,storeDescription:item.description})}>
                <Text style={styles.exploreText}>Explore Agent</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
 ListFooterComponent={footer}
                ListFooterComponentStyle={styles.footerStyle}

    />
    </View>
  );
};

export default AIStore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
    textAlign:"center"
  },
  activeCount: {
    fontSize: 14,
    color: "#7c3aed",
    fontWeight: "600",
    margin: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 16,
    elevation: 6,
    alignSelf:"center",
    marginBottom:15,
    shadowColor: "#000",
  },

  gradient: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 2,
  },

  featuredText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  initials: {
    fontSize: 44,
    fontWeight: "900",
    color: "#fff",
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  agentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ede9fe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },

  agentText: {
    color: "#6d28d9",
    fontWeight: "700",
    fontSize: 13,
  },

  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },

  exploreBtn: {
    backgroundColor: "#7c3aed",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  exploreText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },
    footerStyle: {
    marginTop: 80,
  },
});

