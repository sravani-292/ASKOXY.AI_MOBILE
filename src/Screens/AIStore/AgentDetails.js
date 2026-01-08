import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useSelector } from "react-redux";
import BASE_URL from "../../../Config";
import Ionicons from "react-native-vector-icons/Ionicons"
const AgentDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { agentId, agentName, agentDetailsOnAdUser } = route.params || {};
  console.log("Agent Details ", route.params);
  const [aiStoreDetails, setAIStoreDetails] = React.useState([]);
 

     const userData = useSelector((state) => state.counter);
    //  console.log({userData})
      const token = userData?.accessToken;
      const userId = userData?.userId;  

  useEffect(() => {
    getAIStoreDetails();
  }, []);

  const getAIStoreDetails = () => {
    axios
      .get(
        `${BASE_URL}ai-service/agent/getAllStoreDataByStoreId/${route.params.storeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("AI Agent Store Details data:", res.data);
        setAIStoreDetails(res.data.agentDetailsOnAdUser);
      })
      .catch((err) => {
        console.log("Error fetching Agent Details:", err.response);
      });
  };

  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{agentName}</Text>
      </View> */}

      <View style={styles.content}>
        <Text style={styles.agentName}>
          {route.params.storeName || "Agent Name"}
        </Text>
        <Text style={styles.agentId}>{route.params.storeDescription}</Text>

        {aiStoreDetails && aiStoreDetails.length > 0 ? (
          aiStoreDetails.map((agent, index) => (
            <TouchableOpacity style={styles.agentCard} 
                          key={index} onPress={()=> navigation.navigate("GenOxyChatScreen", {
                                            assistantId: agent.assistantId,
                                            query: "",
                                            category: "Assistant",
                                            agentName: agent.agentName || "Assistant",
                                            fd: null,
                                            agentId: agent.agentId
                                          })}>
            <View key={index}>
              <Text style={styles.agentTitle}>{agent.agentName || "Agent"}</Text>      
            </View>
            <View>
              <Ionicons name="chevron-forward" size={20} color="#333" style={{marginTop:15}} />
            </View>
            </TouchableOpacity>
            
          ))
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>No Agent Details Available</Text>
          </View>
        )}

     
      </View>
      
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    padding: 20,
  },
  agentName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign:"center"
  },
  agentId: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    // textAlign:"center"
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  useButton: {
    backgroundColor: "#7c3aed",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  useButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  agentCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  agentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  agentDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  agentInstructions: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  rateButton: {
    backgroundColor: "#f59e0b",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  rateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingModal: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 30,
    gap: 10,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 15,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#7c3aed",
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default AgentDetails;
