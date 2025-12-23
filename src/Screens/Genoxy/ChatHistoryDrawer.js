import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import axios, { AxiosHeaders } from 'axios';
import BASE_URL from '../../../Config';

const { width: screenWidth } = Dimensions.get('window');

const ChatHistoryDrawer = ({ 
  isVisible, 
  onClose, 
  userId, 
  agentId, 
  onHistorySelect,
  currentChatId,
  refreshTrigger // Add refresh trigger prop
}) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.counter);

  const getAuthHeaders = () => {
    return user?.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {};
  };

  const fetchUserHistory = async (userIdParam, agentIdParam) => {
    console.log("Fetching user history", { userIdParam, agentIdParam });
    
    try {
      const { data } = await axios.get(
        `${BASE_URL}ai-service/agent/getUserHistory/${userIdParam}/${agentIdParam}`,
        { headers: { ...getAuthHeaders() } }
      );
      console.log("Fetched user history", data);
      return data;
    } catch (error) {
      console.error("Error fetching history:", error);
      throw error;
    }
  };

  const loadHistory = async () => {
    if (!userId || !agentId || !user?.accessToken) return;
    console.log("into the laod history method",{userId,agentId});
    
    setLoading(true);
    try {
      const history = await fetchUserHistory(userId, agentId);
      console.log("Loaded history:", history);
      
      if (Array.isArray(history)) {
        setHistoryData(history);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      Alert.alert('Error', 'Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && user?.accessToken) {
      loadHistory();
    }
  }, [isVisible, userId, agentId, user?.accessToken, refreshTrigger]);

  const handleHistoryItemPress = (item) => {
    const historyId = item?.threadId || item?.id || item?.historyId;
    if (historyId && onHistorySelect) {
      onHistorySelect(historyId);
      onClose();
    }
  };

  const getPreviewText = (item) => {
    // Extract content from prompt field
    if (item?.prompt) {
      try {
        // Parse the prompt string to extract content
        const match = item.prompt.match(/content=([^}]+)/);
        if (match && match[1]) {
          return match[1].trim();
        }
      } catch (error) {
        console.log('Error parsing prompt:', error);
      }
    }
    
    if (item?.messages && Array.isArray(item.messages) && item.messages.length > 0) {
      const firstUserMessage = item.messages.find(msg => msg.role === 'user');
      return firstUserMessage?.content || 'No preview available';
    }
    if (item?.messageHistory && Array.isArray(item.messageHistory) && item.messageHistory.length > 0) {
      const firstUserMessage = item.messageHistory.find(msg => msg.role === 'user');
      return firstUserMessage?.content || 'No preview available';
    }
    return 'Chat conversation';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Unknown date';
    }
  };

  const renderHistoryItem = ({ item, index }) => {
    const historyId = item?.threadId || item?.id || item?.historyId;
    const isActive = currentChatId === historyId;
    
    return (
      <TouchableOpacity
        style={[styles.historyItem, isActive && styles.activeHistoryItem]}
        onPress={() => handleHistoryItemPress(item)}
      >
        <View style={styles.historyItemContent}>
          <Text style={[styles.historyPreview, isActive && styles.activeText]} numberOfLines={2}>
            {getPreviewText(item)}
          </Text>
          {/* <Text style={[styles.historyDate, isActive && styles.activeDateText]}>
            {formatDate(item?.createdAt || item?.timestamp || item?.date)}
          </Text> */}
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color={isActive ? "#2563eb" : "#9ca3af"} 
        />
      </TouchableOpacity>
    );
  };

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={styles.drawer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat History</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading history...</Text>
          </View>
        ) : historyData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No chat history found</Text>
            <Text style={styles.emptySubtext}>Start a conversation to see your history here</Text>
          </View>
        ) : (
          <FlatList
            data={historyData}
            keyExtractor={(item, index) => (item?.threadId || item?.id || item?.historyId || index).toString()}
            renderItem={renderHistoryItem}
            contentContainerStyle={styles.historyList}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={loadHistory}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: screenWidth * 0.8,
    maxWidth: 320,
    backgroundColor: '#ffffff',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  historyList: {
    paddingVertical: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activeHistoryItem: {
    backgroundColor: '#eff6ff',
    borderRightWidth: 3,
    borderRightColor: '#2563eb',
  },
  historyItemContent: {
    flex: 1,
    marginRight: 12,
  },
  historyPreview: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  activeText: {
    color: '#1f2937',
    fontWeight: '500',
  },
  historyDate: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  activeDateText: {
    color: '#6b7280',
  },
});

export default ChatHistoryDrawer;