import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "../../../../Config";
import { useSelector } from "react-redux";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const MyAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const userData = useSelector((state) => state.counter);

  // const userId = "38f71da3-5f1d-4b82-a83f-0fc4058e2554";
  // const agentId = "38c5f646-475d-41a2-b918-37587ae48381";

  const getAgents = async () => {
    console.log("Fetching agents...");
    setLoading(true);
    
    try {
      const response = await axios.get(`http://65.0.147.157:9040/api/ai-service/agent/allAgentDataList?userId=${userData.userId}`,
    );
      // console.log("API Response:", response.data);
      
      let agentsData = response.data?.assistants || [];
      // console.log("Agents fetched:", agentsData);
      setAgents(agentsData);
    } catch (error) {
      console.error("Error fetching agents:", error.response);
      // Alert.alert("Error", "Failed to fetch agents");/
    } finally {
      setLoading(false);
    }
  };

  const editAgentStatus = async (agentId, newStatus) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}ai-service/agent/${userData.userId}/${agentId}/hideStatus?activeStatus=${newStatus}`
      );
      console.log("Status updated:", response.data);
      getAgents();
      Alert.alert("Success", "Agent status updated successfully");
    } catch (error) {
      console.error("Error updating agent status:", error.response);
      Alert.alert("Error", "Failed to update agent status");
    }
  };

  const getActiveAgents = (allAgents) => {
    const activeAgents = allAgents.filter(agent => agent.activeStatus === true);
    navigation.navigate('Active Agents', { activeAgents });
  };

  const toggleAgentStatus = (agent) => {
    const newStatus = !agent.activeStatus;
    const statusText = newStatus ? 'activate' : 'deactivate';
    
    Alert.alert(
      "Confirm Status Change",
      `Are you sure you want to ${statusText} ${agent.agentName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          onPress: () => editAgentStatus(agent.id, newStatus)
        }
      ]
    );
  };

  useEffect(() => {
    getAgents();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.agentName}>{item.agentName}</Text>
        <View style={[styles.statusBadge, 
          item.activeStatus === true ? styles.activeBadge : styles.inactiveBadge
        ]}>
          <TouchableOpacity onPress={() => toggleAgentStatus(item)}>
          <Text style={styles.statusText}>
            {item.activeStatus === true ? 'Active' : 'Inactive'}
          </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.userRole}>{item.userRole}</Text>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      
      <View style={styles.itemDetails}>
        <Text style={styles.detailText}>Domain: {item.domain}</Text>
        <Text style={styles.detailText}>Sub Domain: {item.subDomain}</Text>
        <Text style={styles.detailText}>Language: {item.language}</Text>
        <Text style={styles.detailText}>Status: {item.agentStatus}</Text>
        <Text style={styles.detailText}>Experience: {item.userExperience}</Text>
      </View>
      
      <View style={styles.itemFooter}>
        <Text style={styles.dateText}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <Text style={styles.experienceText}>
          Experience: {item.userExperience}/5
        </Text>
      </View>
      
      <TouchableOpacity style={styles.actionHint} onPress={() => toggleAgentStatus(item)}>
        <Text style={styles.actionText}>
          Tap to {item.activeStatus ? 'deactivate' : 'activate'}
        </Text>
      </TouchableOpacity>

       <TouchableOpacity style={[styles.actionHint,{marginTop:15,flexDirection:"row",justifyContent:"center",alignItems:"center"}]} onPress={() => navigation.navigate('Create Agent', { agentData: item})}>
        <MaterialIcons name="update" size={16} color="#64748b" />
        <Text style={styles.actionText}>
         Tap to update
        </Text>
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading agents...</Text>
      ) : agents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>🤖</Text>
          </View>
          <Text style={styles.emptyTitle}>No Agents Found</Text>
          <Text style={styles.emptyText}>
            You haven't created any agents yet. Create your first agent to get started!
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={getAgents}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            {/* <Text style={styles.headerTitle}>My Agents</Text> */}
            <TouchableOpacity 
              style={styles.activeAgentsButton} 
              onPress={() => getActiveAgents(agents)}
            >
              <Text style={styles.activeAgentsButtonText}>
                View Active Agents ({agents.filter(agent => agent.activeStatus).length})
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={agents}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  activeAgentsButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-end',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  activeAgentsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#64748b',
    marginTop: 80,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  list: {
    paddingBottom: 100,
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  agentName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  inactiveBadge: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userRole: {
    fontSize: 16,
    color: '#3b82f6',
    marginBottom: 8,
    fontWeight: '600',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  itemDetails: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
    fontWeight: '500',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  experienceText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '700',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  actionHint: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    fontStyle: 'italic',
  },
});

export default MyAgents;