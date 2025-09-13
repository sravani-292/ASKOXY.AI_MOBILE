import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import FileUpload from './FileUpload';
import ImageUpload from './ImageUpload';
import { MessageCircle,BotMessageSquare } from 'lucide-react-native';
const ActiveAgents = ({ route }) => {
  const { activeAgents } = route.params;
  const navigation = useNavigation();
  const [assistantId, setAssistantId] = useState(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  useEffect(() => {
    if (activeAgents && Array.isArray(activeAgents) && activeAgents.length > 0) {
      setAssistantId(activeAgents[0].assistantId);
    }
  }, [activeAgents]);

  if (!activeAgents || (Array.isArray(activeAgents) && activeAgents.length === 0)) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <View style={styles.robotIcon}>
            <View style={styles.robotHead}>
              <View style={styles.robotEyes}>
                <View style={styles.robotEye} />
                <View style={styles.robotEye} />
              </View>
              <View style={styles.robotMouth} />
            </View>
            <View style={styles.robotBody} />
          </View>
        </View>
        <Text style={styles.emptyTitle}>No Active Agents</Text>
        <Text style={styles.emptyMessage}>
          You don't have any active agents at the moment. Create your first agent to get started!
        </Text>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Create New Agent</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleFileUpload = () => {
    if (!assistantId) {
      Alert.alert("Error", "Assistant ID not available.");
      return;
    }
    setShowFileUpload(!showFileUpload);
  };

  const toggleImageUpload = () => {
    if (!assistantId) {
      Alert.alert("Error", "Assistant ID not available.");
      return;
    }
    setShowImageUpload(!showImageUpload);
  };

  const handleChatNavigation = (agent) => {
    navigation.navigate("GenOxyChatScreen", {
      query: agent.query || "",
      category: agent.category || "tie",
      assistantId: agent.assistantId || "weygeywtre",
      categoryType: agent.categoryType || "TiE Assistant",
      fd: agent.fd || null,
      agentName: agent.agentName || "GENOXY",
      userRole: agent.userRole || "",
    });
  };



  const renderAgentDetails = (agent) => (
    <View style={styles.agentCard} key={agent.id || agent.assistantId || 'agent'}>
      <View style={styles.cardHeader}>
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
          >
           
           <ImageUpload assistantId={assistantId} name={agent.agentName} profileImage={agent.profileImagePath}/>

          </TouchableOpacity>

          <View style={styles.nameContainer}>
            <Text style={styles.agentName}>{agent.agentName}</Text>
            <Text style={styles.userRole}>{agent.userRole}</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <View style={[styles.statusBadge, agent.activeStatus ? styles.activeBadge : styles.inactiveBadge]}>
            <View style={styles.statusIndicator} />
            <Text style={[styles.statusText, !agent.activeStatus && styles.inactiveText]}>
              {agent.activeStatus ? 'Active' : 'Inactive'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => handleChatNavigation(agent)}
            activeOpacity={0.7}
          >
            {/* <Text style={{ fontSize: 20, color: '#ffffff' }}>🤖</Text> */}
          <BotMessageSquare color="#fff" size={28} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description} numberOfLines={3}>
          {agent.description || "No description provided."}
        </Text>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailsSectionHeader}>
          <MaterialIcons name="info-outline" size={18} color="#3b82f6" />
          <Text style={styles.detailsSectionTitle}>Agent Details</Text>
        </View>
        
        <View style={styles.detailsGrid}>
          <DetailRow label="Domain" value={agent.domain} icon="category" />
          <DetailRow label="Sub Domain" value={agent.subDomain} icon="apps" />
          <DetailRow label="Language" value={agent.language} icon="translate" />
          <DetailRow label="Status" value={agent.agentStatus} icon="info" />
          <DetailRow label="Experience" value={`${agent.userExperience}/5`} icon="star" />
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerInfo}>
          <View style={styles.footerItem}>
            <Ionicons name="calendar-outline" size={16} color="#64748b" />
            <Text style={styles.footerText}>
              Created: {new Date(agent.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.uploadButtons}>
          <TouchableOpacity style={styles.uploadButton} onPress={toggleFileUpload}>
            <MaterialIcons name="attach-file" size={18} color="#3b82f6" />
            <Text style={styles.uploadButtonText}> Files</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.uploadButton} onPress={toggleImageUpload}>
            <MaterialIcons name="image" size={18} color="#10b981" />
            <Text style={styles.uploadButtonText}>Images</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {showFileUpload && (
        <View style={styles.uploadSection}>
          <View style={styles.uploadSectionHeader}>
            <MaterialIcons name="attach-file" size={18} color="#3b82f6" />
            <Text style={styles.uploadSectionTitle}>File Upload</Text>
          </View>
          <FileUpload assistantId={assistantId} />
        </View>
      )}

     
    </View>
  );

  const DetailRow = ({ label, value, icon }) => (
    <View style={styles.detailRow}>
      <MaterialIcons name={icon} size={16} color="#3b82f6" style={styles.detailIcon} />
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || "N/A"}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
     

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cardsContainer}>
          {Array.isArray(activeAgents)
            ? activeAgents.map(agent => renderAgentDetails(agent))
            : renderAgentDetails(activeAgents)}
        </View>
      </ScrollView>
    </View>
  );
};

export default ActiveAgents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
    paddingTop: 48,
    backgroundColor: 'white',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -1,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  headerIcon: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 20,
  },
  headerChatbotIcon: {
    alignItems: 'center',
  },
  headerBotHead: {
    width: 24,
    height: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    position: 'relative',
    marginBottom: 2,
  },
  headerBotEyes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  headerBotEye: {
    width: 4,
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  headerBotMouth: {
    width: 8,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
    alignSelf: 'center',
    marginTop: 2,
  },
  headerBotBody: {
    width: 20,
    height: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  agentCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#3b82f6',
  },
  defaultProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f9ff',
    borderWidth: 3,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatbotIcon: {
    alignItems: 'center',
  },
  botHead: {
    width: 20,
    height: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    position: 'relative',
    marginBottom: 2,
  },
  botEyes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 3,
    paddingTop: 3,
  },
  botEye: {
    width: 3,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },
  botMouth: {
    width: 6,
    height: 1.5,
    backgroundColor: '#ffffff',
    borderRadius: 0.75,
    alignSelf: 'center',
    marginTop: 1.5,
  },
  botBody: {
    width: 16,
    height: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    position: 'relative',
  },
  botChest: {
    width: 8,
    height: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 2,
  },
  uploadOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#3b82f6',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  nameContainer: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 30,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  userRole: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  headerActions: {
    alignItems: 'flex-end',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 85,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
    borderWidth: 1,
  },
  inactiveBadge: {
    backgroundColor: '#fee2e2',
    borderColor: '#dc2626',
    borderWidth: 1,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
    marginRight: 6,
  },
  statusText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inactiveText: {
    color: '#b91c1c',
  },
chatButton: {
  backgroundColor: '#4F46E5',
  width: 48,
  height: 48,
  borderRadius: 24,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#4F46E5',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 6,
  borderWidth: 1,                     
  borderColor: '#3b82f6',             
},
  descriptionContainer: {
    marginBottom: 24,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    fontWeight: '400',
    backgroundColor: '#f8fafc',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  detailsSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 8,
  },
  detailsGrid: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  detailIcon: {
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    minWidth: 90,
  },
  detailValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 20,
  },
  footerInfo: {
    marginBottom: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginLeft: 8,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    flex: 1,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    marginLeft: 8,
  },
  uploadSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  uploadSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 8,
  },

  // Robot Icon for Empty State
  robotIcon: {
    alignItems: 'center',
  },
  robotHead: {
    width: 40,
    height: 32,
    backgroundColor: '#94a3b8',
    borderRadius: 12,
    position: 'relative',
    marginBottom: 4,
  },
  robotEyes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  robotEye: {
    width: 6,
    height: 6,
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  robotMouth: {
    width: 12,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
    alignSelf: 'center',
    marginTop: 4,
  },
  robotBody: {
    width: 32,
    height: 24,
    backgroundColor: '#94a3b8',
    borderRadius: 8,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
    backgroundColor: '#f8fafc',
  },
  emptyIconContainer: {
    backgroundColor: '#f1f5f9',
    padding: 24,
    borderRadius: 50,
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});