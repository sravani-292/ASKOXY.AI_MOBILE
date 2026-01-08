import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios, { AxiosResponse } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { JSX, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from "react-redux";
import BASE_URL from '../../../../Config';
// import FileUpload from './FileUpload';
// import ColoredScrollFlatList from './FlatlistScroll';
// import ImageUpload from './ImageUpload';
import { error } from 'console';
import KycCreationModal from './KycCreationModal';

const { height, width } = Dimensions.get('window');

interface User {
  accessToken: string;
  userId: string;
}

interface AgentFile {
  fileName: string;
  fileSize: string;
  fileId: string;
  id: string;
  url: string;
  fileType: string;
}

interface ChatHistory {
  prompt: string;
  userId: string;
  name: string;
}

interface AgentHistoryResponse {
  agentName: string;
  agentId: string;
  creatorName: string;
  agentChatListList: ChatHistory[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: number;
}

interface Assistant {
  status: string;
  id: string;
  agentName: string;
  name: string;
  userRole: string;
  language: string;
  agentStatus: string;
  activeStatus: boolean;
  userExperience: number;
  acheivements: string;
  headerTitle: string;
  screenStatus: string;
  description?: string;
  userExperienceSummary?: string;
  instructions?: string;
  created_at: string;
  updatedAt: string;
  assistantId?: string;
  profileImagePath?: string;
  purpose?: string;
  goals?: string;
  view?: string;
  usageModel?: string;
  roleUser?: string;
  responseFormat?: string;
  freeTrail?: number;
  businessCardId?: string;
  certificateUrl?: string;
}

interface AssistantsData {
  assistants: Assistant[];
}

interface Conversation {
  id: string;
  conStarter1: string;
  conStarter2: string;
}

interface EditAgentResponse {
  assistants: Assistant[];
  conversations: Conversation[];
}

export type ParsedMessage = { role: string; content: string };
function tryJsonParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function normalizeUnquotedKeys(s: string) {
  return s.replace(
    /([{,]\s*)([a-zA-Z0-9_@$-]+)\s*:/g,
    '$1"$2":'
  );
}

/**
 * Loose parser for strings like:
 * [{role=user, content=...}, {role=assistant, content=...}]
 * The main fix: content is allowed to contain commas.
 */
function parseLooseRoleContent(s: string): ParsedMessage[] | null {
  try {
    // Break into object-like blocks: { ... }
    const blocks = s.match(/\{[^}]+\}/g) || [s];
    const out: ParsedMessage[] = [];

    for (const blk of blocks) {
      // role=user OR role: "user"
      const roleMatch = blk.match(
        /role\s*(?:=|:)\s*(?:"([^"]+)"|'([^']+)'|([^,\n}]+))/i
      );

      // content=... OR content: "..."
      // IMPORTANT: allow commas, only stop at '}'
      const contentMatch = blk.match(
        /content\s*(?:=|:)\s*(?:"([\s\S]*?)"|'([\s\S]*?)'|([^}]+))/i
      );

      const role = roleMatch
        ? (roleMatch[1] || roleMatch[2] || roleMatch[3] || "").trim()
        : undefined;

      const content = contentMatch
        ? (contentMatch[1] || contentMatch[2] || contentMatch[3] || "").trim()
        : undefined;

      if (role || content) {
        out.push({
          role: role?.toString() ?? "",
          content: content?.toString() ?? "",
        });
      }
    }

    return out.length ? out : null;
  } catch {
    return null;
  }
}

function normalizeMessage(m: any, i: number): ParsedMessage {
  const rawRole = (m?.role ?? "").toString().trim().toLowerCase();
  const role = rawRole || (i % 2 === 0 ? "user" : "assistant");
  const content = String(m?.content ?? m?.text ?? "");
  return { role, content };
}

export function parsePrompt(promptRaw: any): ParsedMessage[] {
  if (promptRaw === null || promptRaw === undefined) return [];

  // CASE 1: Already an array
  if (Array.isArray(promptRaw)) {
    return promptRaw.map(normalizeMessage);
  }

  const rawStr = String(promptRaw).trim();

  // CASE 2: Direct JSON parse
  let parsed: any = tryJsonParse(rawStr);
  if (Array.isArray(parsed)) {
    return parsed.map(normalizeMessage);
  }

  // CASE 3: Unwrap quoted JSON
  if (/^".+"$/.test(rawStr) || /^'.+'$/.test(rawStr)) {
    const unwrapped = rawStr
      .replace(/^"(.*)"$/s, "$1")
      .replace(/^'(.*)'$/s, "$1");

    parsed = tryJsonParse(unwrapped);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeMessage);
    }
  }

  // CASE 4: Convert single quotes → double quotes
  const singleToDouble = rawStr.replace(/'/g, '"');
  parsed = tryJsonParse(singleToDouble);
  if (Array.isArray(parsed)) {
    return parsed.map(normalizeMessage);
  }

  // CASE 5: Add quotes to keys
  const keyed = normalizeUnquotedKeys(rawStr);
  parsed = tryJsonParse(keyed);
  if (Array.isArray(parsed)) {
    return parsed.map(normalizeMessage);
  }

  // CASE 6: Loose extraction (role/text)
  const loose = parseLooseRoleContent(rawStr);
  if (loose && loose.length) {
    return loose.map(normalizeMessage);
  }

  // CASE 7: Extract array substring
  const arrayInside = rawStr.match(/\[.*\]/s);
  if (arrayInside) {
    parsed = tryJsonParse(arrayInside[0]);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeMessage);
    }
  }

  // CASE 8: Final fallback → single user message
  return [{ role: "user", content: rawStr }];
}

const AllAgentCreations: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [assistantsData, setAssistantsData] = useState<AssistantsData | null>(null);
  const [filteredData, setFilteredData] = useState<AssistantsData | null>(null);
  const [conversationsData, setConversationsData] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [expandedInstructions, setExpandedInstructions] = useState<Record<string, boolean>>({});
  const [expandedDescription, setExpandedDescription] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFileUpload, setShowFileUpload] = useState<string | undefined>(undefined);
  const [agentFile, setAgentFile] = useState<Record<string, AgentFile[]>>({});
  const [showAgentFile, setShowAgentFile] = useState<Record<string, boolean>>({});
  const [viewFileModal, setViewFileModal] = useState<boolean>(false);
  const [viewFileData, setViewFileData] = useState<AgentFile[]>([]);
  const [historyModal, setHistoryModal] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<AgentHistoryResponse | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [editInstructions, setEditInstructions] = useState<string>('');
  const [editConversation1, setEditConversation1] = useState<string>('');
  const [editConversation2, setEditConversation2] = useState<string>('');
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [generatingInstructions, setGeneratingInstructions] = useState<boolean>(false);
  const [generatingConversations, setGeneratingConversations] = useState<boolean>(false);
  const [savingEdit, setSavingEdit] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedDeleteAssistant, setSelectedDeleteAssistant] = useState<Assistant | null>(null);
  const [deletingAgent, setDeletingAgent] = useState<boolean>(false);
  const [businessCardModal, setBusinessCardModal] = useState<boolean>(false);
  const [businessCardData, setBusinessCardData] = useState<any>(null);
  const [loadingBusinessCard, setLoadingBusinessCard] = useState<boolean>(false);
  const [editingBusinessCard, setEditingBusinessCard] = useState<boolean>(false);
  const [editBusinessCardData, setEditBusinessCardData] = useState<any>(null);
  const [updatingBusinessCard, setUpdatingBusinessCard] = useState<boolean>(false);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [kycModalVisible, setKycModalVisible] = useState(false);

  // const token = useSelector((state: any) => state.userData?.accessToken);
  // const userId = useSelector((state: any) => state.userData?.userId);
   const userData = useSelector((state:any) => state.counter);
  //  console.log({userData})
    const token = userData?.accessToken;
    const userId = userData?.userId;
  const fetchAssistants = (): void => {
    setLoading(true);
    axios({
      url: `${BASE_URL}ai-service/agent/allAgentDataList?userId=${userId}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response: AxiosResponse<EditAgentResponse>) => {
        // Filter out deleted agents and sort by created_at in descending order (recent first)
        const sortedData = {
          ...response.data,
          assistants: response.data.assistants
            .filter(assistant => assistant.status !== 'DELETED')
            .sort((a, b) => {
              // First sort by activeStatus (active first)
              if (a.activeStatus !== b.activeStatus) {
                return b.activeStatus ? 1 : -1;
              }
              // Then sort by date (recent first)
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            })
        };
        setAssistantsData(sortedData);
        setFilteredData(sortedData);
        setConversationsData(response.data.conversations || []);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log('Assistants error', error.response);
        setLoading(false);
      });
  };

  const getAgentFile = (assistantId: string): void => {
    console.log('getting agent file');
    axios
      .get(`${BASE_URL}ai-service/agent/getUploaded?assistantId=${assistantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<AgentFile[]>) => {
        // console.log(response.data);
        if (response.data.length === 0) {
          setShowAgentFile((prev) => ({ ...prev, [assistantId]: false }));
        } else {
          setShowAgentFile((prev) => ({ ...prev, [assistantId]: true }));
          setAgentFile((prev) => ({ ...prev, [assistantId]: response.data }));
        }
      })
      .catch((error: any) => {
        console.error(error.response);
      });
  };

  const viewAgentFiles = (assistantId: string): void => {
    axios
      .get(`${BASE_URL}ai-service/agent/getUploaded?assistantId=${assistantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<AgentFile[]>) => {
        console.log(response.data)
        if (response.status === 200) {
          setViewFileData(response.data);
        } else if (response.status === 204) {
          setViewFileData([]);
        }
        setViewFileModal(true);
      })
      .catch((error: any) => {
        console.error(error.response);
        Alert.alert('Error', 'Failed to load files');
      });
  };

  // const parsePrompt = (promptString: string) => {
  //   try {
  //     // Parse the JSON array from the prompt string
  //     const parsedArray = JSON.parse(promptString);
      
  //     if (Array.isArray(parsedArray)) {
  //       return parsedArray.map(item => ({
  //         role: item.role || 'user',
  //         content: item.content || ''
  //       }));
  //     }
      
  //     return [{ role: 'user', content: promptString }];
  //   } catch {
  //     return [{ role: 'user', content: promptString }];
  //   }
  // };

  const viewUserHistory = (agentId: string): void => {

    axios
      .get(`${BASE_URL}ai-service/agent/getCreatorAgentDeatils?agentId=${agentId}&userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<AgentHistoryResponse>) => {
        console.log(response.data);
        setHistoryData(response.data);
        setHistoryModal(true);
      })
      .catch((error: any) => {
        console.error(error.response);
        Alert.alert('Error', 'Failed to load user history');
      });
  };

  const handleEdit = (assistant: Assistant): void => {
    setSelectedAssistant(assistant);
    setEditInstructions(assistant.instructions || '');
    setEditConversation1('');
    setEditConversation2('');
    setEditModal(true);
    
    // Find conversation by matching assistant id
    const conversation = conversationsData.find(conv => conv.agentId === assistant.id);
    if (conversation) {
      setEditConversation1(conversation.conStarter1 || '');
      setEditConversation2(conversation.conStarter2 || '');
    }
  };

  const handleDownloadCertificate = (assistant: Assistant): void => {
    if (!assistant.certificateUrl) {
      Alert.alert('Error', 'Certificate URL is not available');
      return;
    }
    
    Linking.openURL(assistant.certificateUrl)
      .then(() => {
        Alert.alert('Success', 'Certificate downloaded successfully');
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to download certificate');
      });
  };

  const handleBusinessCard = (assistant: Assistant): void => {
    if (!assistant.businessCardId) {
      Alert.alert('Error', 'Business card ID not available');
      return;
    }
    
    setLoadingBusinessCard(true);
    axios.get(`${BASE_URL}ai-service/agent/getBusinessCardById/${assistant.businessCardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.data.status === 'SUCCESS') {
        setBusinessCardData(response.data.data);
        setBusinessCardModal(true);
      } else {
        Alert.alert('Error', 'Failed to fetch business card');
      }
      setLoadingBusinessCard(false);
    })
    .catch((error) => {
      console.error('Error fetching business card:', error);
      Alert.alert('Error', 'Failed to fetch business card');
      setLoadingBusinessCard(false);
    });
  };

  const updateBusinessCard = (): void => {
    if (!editBusinessCardData) return;
    
    setUpdatingBusinessCard(true);
    const requestBody = {
      fullName: editBusinessCardData.fullName,
      jobTitle: editBusinessCardData.jobTitle,
      companyName: editBusinessCardData.companyName,
      email: editBusinessCardData.email,
      mobileNumber: editBusinessCardData.mobileNumber,
      website: editBusinessCardData.webSite || '',
      address: editBusinessCardData.address,
      userId: editBusinessCardData.userId,
      id: editBusinessCardData.id,
      imagePath: editBusinessCardData.imagePath
    };
    console.log({ requestBody });
    axios.patch(`${BASE_URL}ai-service/agent/updateBusinessCardData`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log('Business card updated:', response.data);
      Alert.alert('Success', 'Business card updated successfully');
      setBusinessCardData(editBusinessCardData);
      setEditingBusinessCard(false);
      setUpdatingBusinessCard(false);
      setBusinessCardModal(false)
    })
    .catch((error) => {
      console.error('Error updating business card:', error.response);
      Alert.alert('Error', 'Failed to update business card');
      setUpdatingBusinessCard(false);
    });
  };

  const generateInstructions = (assistant: Assistant): void => {
    if (!assistant.description) {
      Alert.alert('Error', 'No description available to generate instructions');
      return;
    }
    
    setGeneratingInstructions(true);
    axios.post(`${BASE_URL}ai-service/agent/classifyInstruct?description=${encodeURIComponent(assistant.description)}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse) => {
      console.log('Instructions generated:', response.data);
      if (response.data) {
        setEditInstructions(response.data);
      }
      setGeneratingInstructions(false);
    })
    .catch((error: any) => {
      console.error('Error generating instructions:', error.response);
      Alert.alert('Error', 'Failed to generate instructions');
      setGeneratingInstructions(false);
    });
  };

  const generateConversations = (assistant: Assistant): void => {
    if (!assistant.description) {
      Alert.alert('Error', 'No description available to generate conversations');
      return;
    }
    
    setGeneratingConversations(true);
    axios.post(`${BASE_URL}ai-service/agent/classifyStartConversation?description=${encodeURIComponent(assistant.description)}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response: AxiosResponse) => {
      console.log('Conversations generated:', response.data);
      if (response.data) {
        const conversationText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const lines = conversationText.split('\n').filter(line => line.trim());
        
        // Extract first two numbered questions
        const question1 = lines.find(line => line.trim().startsWith('1.'))?.replace(/^1\.\s*/, '') || '';
        const question2 = lines.find(line => line.trim().startsWith('2.'))?.replace(/^2\.\s*/, '') || '';
        
        setEditConversation1(question1);
        setEditConversation2(question2);
      }
      setGeneratingConversations(false);
    })
    .catch((error: any) => {
      console.error('Error generating conversations:', error.response);
      Alert.alert('Error', 'Failed to generate conversations');
      setGeneratingConversations(false);
    });
  };

  const saveEdit = (): void => {
    if (!selectedAssistant) return;
    
    setSavingEdit(true);
    const requestBody = {
      acheivements: selectedAssistant.acheivements,
      ageLimit: null,
      agentId: selectedAssistant.id,
      agentName: selectedAssistant.agentName,
      agentStatus: selectedAssistant.agentStatus,
      assistantId: selectedAssistant.assistantId,
      business: null,
      conStarter1: editConversation1,
      conStarter2: editConversation2,
      conStarter3: null,
      conStarter4: null,
      contactDetails: null,
      converstionTone: null,
      description: selectedAssistant.description,
      domain: null,
      freeTrial: selectedAssistant.freeTrail || 0,
      gender: null,
      goals: selectedAssistant.goals,
      instructions: editInstructions,
      language: selectedAssistant.language,
      mainProblemSolved: null,
      purpose: selectedAssistant.purpose,
      responseFormat: selectedAssistant.responseFormat,
      roleUser: selectedAssistant.roleUser,
      status: selectedAssistant.status,
      subDomain: null,
      targetUser: null,
      tool: null,
      uniqueSolution: null,
      usageModel: selectedAssistant.usageModel,
      userExperience: selectedAssistant.userExperience,
      userExperienceSummary: selectedAssistant.userExperienceSummary,
      userId: userId,
      userRole: selectedAssistant.userRole,
      view: selectedAssistant.view,
    };
    console.log({ requestBody });
    axios.patch(`${BASE_URL}ai-service/agent/newAgentPublish`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      Alert.alert('Success', 'Agent updated successfully');
      setEditModal(false);
      fetchAssistants();
      setSavingEdit(false);
    })
    .catch((error) => {
      console.error('Error updating agent:', error.response);
      Alert.alert('Error', 'Failed to update agent');
      setSavingEdit(false);
    });
  };

  const cancelEdit = (): void => {
    setEditModal(false);
    setSelectedAssistant(null);
    setEditInstructions('');
    setEditConversation1('');
    setEditConversation2('');
  };

  const editAgentStatus = async (agentId: string, newStatus: boolean): Promise<void> => {
    try {
      const response = await axios.patch(
        `${BASE_URL}ai-service/agent/${userId}/${agentId}/hideStatus?activeStatus=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Status updated:', response.data);
      fetchAssistants();
      Alert.alert('Success', 'Agent status updated successfully');
    } catch (error: any) {
      console.error('Error updating agent status:', error.response);
      Alert.alert('Error', 'Failed to update agent status');
    }
  };

  const deleteAgent = async (assistantId: string): Promise<void> => {
    try {
      setDeletingAgent(true);
      const response = await axios.delete(
        `${BASE_URL}ai-service/agent/delete/${assistantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Agent deleted:', response.data);
      fetchAssistants();
      Alert.alert('Success', 'Agent deleted successfully');
      setDeletingAgent(false);
    } catch (error: any) {
      console.error('Error deleting agent:', error.response);
      Alert.alert('Error', 'Failed to delete agent');
      setDeletingAgent(false);
    }
  };

  const toggleAgentStatus = (agent: Assistant): void => {
    const newStatus = !agent.activeStatus;
    const statusText = newStatus ? 'activate' : 'deactivate';

    Alert.alert(
      'Confirm Status Change',
      `Are you sure you want to ${statusText} ${agent.agentName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => editAgentStatus(agent.id, newStatus),
        },
      ]
    );
  };

    const handleContinue = (parsedMessages: any[], meta?: { rawPrompt?: any; item?: any }) => {
      console.log("Raw message data:", meta?.rawPrompt);
      console.log("Parsed data:", parsedMessages);
      
      // Use rawPrompt from meta which contains complete conversation
      const messagesToUse = Array.isArray(meta?.rawPrompt) ? meta.rawPrompt : 
                           Array.isArray(parsedMessages) ? parsedMessages : [];
      
      if (messagesToUse.length > 0) {
        const allMessages: Message[] = messagesToUse.map((msg, index) => ({
          role: (msg.role || "assistant") as "user" | "assistant",
          content: msg.content || "",
          id: Date.now() + index,
        }));
        
        setMessages(allMessages);
      }
    };

  const uploadFile = async (assistantId: string): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setUploadingFile(true);
        
        const formData = new FormData();
        formData.append('file', {
          uri: asset.uri,
          type: asset.type === 'image' ? 'image/jpeg' : 'application/pdf',
          name: asset.fileName || 'file',
        } as any);

        const response = await axios.post(
          `${BASE_URL}ai-service/agent/${assistantId}/addfiles`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        Alert.alert('Success', 'File uploaded successfully');
        getAgentFile(assistantId);
        setUploadingFile(false);
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload file');
      setUploadingFile(false);
    }
  };

  const downloadPDF = (item: AgentFile) => {
    Linking.openURL(item.url);
  };

  const removeFile = (fileId: string, assistantId: string): void => {
    axios
      .delete(`${BASE_URL}ai-service/agent/removeFiles?assistantId=${assistantId}&fileId=${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse) => {
        Alert.alert('Success', 'File removed successfully');
        getAgentFile(assistantId);
      })
      .catch((error: any) => {
        console.error("Error removing file:", error);
        Alert.alert('Error', 'Failed to remove file');
      });
  };

  const renderAgentFileInfo = ({ item, assistantId }: { item: AgentFile; assistantId: string }): JSX.Element => {
    return (
      <View style={[
        styles.fileInfo,
        showAgentFile[assistantId] === true && styles.uploadedFileInfo,
      ]}>
        <View style={styles.fileInfoHeader}>
          <MaterialIcons
            name={showAgentFile[assistantId] === true ? 'check-circle' : 'description'}
            size={20}
            color={showAgentFile[assistantId] === true ? '#28a745' : '#007bff'}
          />
          <Text
            style={[
              styles.fileName,
              showAgentFile[assistantId] === true && styles.uploadedFileName,
            ]}
            numberOfLines={2}>
            {item.fileName}
          </Text>
        </View>
        {/* <Text style={styles.fileInfoText}>Size: {item.fileSize}</Text> */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Delete File',
              'Are you sure you want to delete this file?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => removeFile(item.fileId, assistantId),
                },
              ]
            );
          }}
          style={styles.deleteButton}>
          <MaterialIcons name="delete" size={20} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  const filterAssistants = (query: string): void => {
    if (!assistantsData || !assistantsData.assistants) return;

    if (!query.trim()) {
      setFilteredData(assistantsData);
      return;
    }

    const filteredAssistants = assistantsData.assistants.filter((assistant: Assistant) => {
      const searchLower = query.toLowerCase();
      return (
        (assistant.userRole && assistant.userRole.toLowerCase().includes(searchLower)) ||
        (assistant.name && assistant.name.toLowerCase().includes(searchLower)) ||
        (assistant.agentName && assistant.agentName.toLowerCase().includes(searchLower)) ||
        (assistant.headerTitle && assistant.headerTitle.toLowerCase().includes(searchLower))
      );
    });

    setFilteredData({
      ...assistantsData,
      assistants: filteredAssistants,
    });
  };

  const handleSearchChange = (text: string): void => {
    setSearchQuery(text);
    filterAssistants(text);
  };

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    fetchAssistants();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAssistants();
    }, [])
  );

  const toggleInstructions = (assistantId: string): void => {
    setExpandedInstructions((prev) => ({
      ...prev,
      [assistantId]: !prev[assistantId],
    }));
  };

  const toggleDescription = (id: string): void => {
    setExpandedDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const truncateText = (text: string, lines: number = 3): string => {
    if (!text) return '';
    const words = text.split(' ');
    const wordsPerLine = 10;
    const maxWords = lines * wordsPerLine;
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string, screenStatus: string, assistantId?: string) => {
    switch (status) {
      case 'PUBLISHED':
        return {
          text: 'Published',
          style: styles.publishedBadge,
          textStyle: styles.publishedBadgeText,
        };
      case 'APPROVED':
        return {
          text: 'Approved',
          style: styles.publishedBadge,
          textStyle: styles.publishedBadgeText,
        };
      case 'REQUESTED':
        return {
          text: 'Requested',
          style: styles.pendingBadge,
          textStyle: styles.pendingBadgeText,
        };
      case 'REJECTED':
        return {
          text: 'Rejected',
          style: styles.inactiveBadge,
          textStyle: styles.inactiveBadgeText,
        };
      default:
        return {
          text: status,
          style: styles.defaultBadge,
          textStyle: styles.defaultBadgeText,
        };
    }
  };

  const renderAssistantCard = ({ item: assistant }: { item: Assistant }): JSX.Element => {
    const statusBadge = getStatusBadge(assistant?.status, assistant.screenStatus, assistant.assistantId);
    const isExpanded = expandedInstructions[assistant.id];
    const isDescExpanded = expandedDescription[assistant.id];
    const agentFiles = agentFile[assistant.assistantId || assistant.id] || [];

    return (
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
         
          <View style={styles.headerTop}>
             <View style={styles.avatar}>
           
          </View>
            <View style={styles.avatarContainer}>
              <View style={styles.nameContainer}>
                <Text style={styles.agentName}>{assistant.agentName || assistant.name}</Text>
                {/* <Text style={styles.userName}>{assistant.name}</Text> */}
                  <View style={statusBadge.style}>
              <Text style={statusBadge.textStyle}>{assistant.status}</Text>
            </View>
              </View>
            </View>
            {/* Use Agent Button - Always Visible */}
            <View>
            <TouchableOpacity 
              style={{
                marginVertical:10,
                alignSelf:"flex-end",
                opacity: assistant.status === 'DELETED' || assistant.status === 'REJECTED' ? 0.5 : 1
              }}
              disabled={assistant.status === 'DELETED' || assistant.status === 'REJECTED'}
              onPress={() => {
                setSelectedDeleteAssistant(assistant);
                setDeleteModal(true);
              }}
            >
              <MaterialIcons name="delete" size={20} color="red" />
            </TouchableOpacity>
          <TouchableOpacity
            style={styles.useAgentBtn}
            onPress={() => {
              navigation.navigate({
                name: 'AssistantChatScreen',
                params: {
                  assistantId: assistant.assistantId,
                  query: "",
                  category: "Assistant",
                  agentName: assistant.agentName || "Assistant",
                  fd: null,
                  agentId: assistant?.id,
                  title: assistant.agentName || "Chat with Agent",
                }
              });
            }}>
            <Text style={styles.useAgentText}>
              Use Agent <Ionicons name="arrow-forward" size={13} color="#3730A3" />
            </Text>
          </TouchableOpacity>
          </View>
          </View>
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Active</Text>
                <TouchableOpacity 
                  style={[styles.toggleSwitch, assistant.activeStatus && styles.toggleSwitchActive]}
                  onPress={() => toggleAgentStatus(assistant)}
                >
                  <View style={[styles.toggleThumb, assistant.activeStatus && styles.toggleThumbActive]} />
                </TouchableOpacity>
              </View>

        
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
     

          {/* Description */}
          {assistant.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionText}>
                {isDescExpanded
                  ? (assistant.description || 'No description provided')
                  : truncateText(assistant.description || 'No description provided', 3)}
              </Text>
              <TouchableOpacity
                onPress={() => toggleDescription(assistant.id)}
                style={styles.moreButton}>
                <Text style={styles.moreButtonText}>
                  {isDescExpanded ? 'Show Less' : 'View More➔ '}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Experience Summary */}
          {assistant.userExperienceSummary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience Summary</Text>
              <Text style={styles.sectionText}>{assistant.userExperienceSummary}</Text>
            </View>
          )}

      
      

            <View style={styles.actionHintContainer}>
              <View style={styles.buttonRows}>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionHint, {backgroundColor: '#6366F1'}, uploadingFile && styles.generateBtnDisabled]}
                    disabled={uploadingFile}
                    onPress={() => {
                      if (assistant.assistantId) {
                        uploadFile(assistant.assistantId);
                      }
                    }}>
                    <Text style={styles.actionText}>{uploadingFile ? 'Uploading...' : 'Upload File'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionHint,{backgroundColor: '#E0E7FF'}]}
                    onPress={() => {
                      if (assistant.assistantId) {
                        viewAgentFiles(assistant.assistantId);
                      }
                    }}>
                    <Text style={[styles.actionText,{color:"#6366F1"}]}>View File</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionHint,{backgroundColor: '#aab7e2ff'}]}
                    onPress={() => {
                      if (assistant.id) {
                        viewUserHistory(assistant.id);
                      }
                    }}>
                    <Text style={[styles.actionText,{color:"#1114baff"}]}>User History</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.buttonRow, (assistant.businessCardId === null || assistant.status !== 'APPROVED') && styles.buttonRowTwoItems]}>
                  {assistant.status === 'APPROVED' && (
                    <TouchableOpacity
                      style={[styles.actionHint,{backgroundColor: '#10B981'}]}
                      onPress={() => handleDownloadCertificate(assistant)}>
                      <Text style={styles.actionText}>Download Certificate</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionHint,{backgroundColor: '#F59E0B'}]}
                    onPress={() => handleEdit(assistant)}>
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  {assistant.businessCardId!==null &&
                  <TouchableOpacity
                    style={[styles.actionHint,{backgroundColor: '#8B5CF6'}]}
                    onPress={() => handleBusinessCard(assistant)}>
                    <Text style={styles.actionText}>Business Card</Text>
                  </TouchableOpacity>
                  }
                </View>
              </View>
             
            </View>
          

          {/* {showAgentFile[assistant.assistantId || ''] && (
            <View style={styles.fileContainer}>
              <ColoredScrollFlatList
                data={agentFile[assistant.assistantId || ''] || []}
                renderItem={(info) =>
                  renderAgentFileInfo({ item: info.item, assistantId: assistant.assistantId || '' })
                }
                keyExtractor={(item: AgentFile) => item.id}
              />
            </View>
          )} */}

          {/* {showFileUpload === assistant.assistantId && (
            <View style={styles.uploadSection}>
              <View style={styles.uploadSectionHeader}>
                <MaterialIcons name="attach-file" size={18} color="#3b82f6" />
                <Text style={styles.uploadSectionTitle}>File Upload</Text>
              </View>
              <FileUpload assistantId={assistant.assistantId ?? ''} />
            </View>
          )} */}
        </View>
      </View>
    );
  };

  const renderHeader = (): JSX.Element | null => (
    <View style={styles.header}>
      <Text style={styles.headerCount}>
        Total Assistants: {filteredData?.assistants?.length || 0}
      </Text>
    </View>
  );

  const renderSearchBar = (): JSX.Element => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by role, agent name, user name, or title..."
        placeholderTextColor="#94A3B8"
        value={searchQuery}
        onChangeText={handleSearchChange}
        clearButtonMode="while-editing"
      />
    </View>
  );

  const renderEmpty = (): JSX.Element => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No Matching Assistants Found' : 'No Assistants Found'}
      </Text>
      <Text style={styles.emptyText}>
        {searchQuery ? 'Try a different search term' : "You haven't created any assistants yet."}
      </Text>
    </View>
  );

  const renderFooter = (): JSX.Element | null => {
    if (!filteredData?.assistants || filteredData.assistants.length === 0) {
      return null;
    }
    
    return (
      <View style={styles.footerContainer}>
        <View style={styles.footerDivider} />
        <Text style={styles.footerText}>
          You've reached the end • {filteredData.assistants.length} agent{filteredData.assistants.length !== 1 ? 's' : ''} total
        </Text>
      </View>
    );
  };

  const keyExtractor = (item: Assistant): string => item.id?.toString() || Math.random().toString();

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
      {/* File View Modal */}
      <Modal
        visible={viewFileModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setViewFileModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Uploaded Files</Text>
            <TouchableOpacity onPress={() => setViewFileModal(false)}>
              <MaterialIcons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          {viewFileData.length > 0 ? (
            <FlatList
  data={viewFileData}
  keyExtractor={(item) => item.id}
  contentContainerStyle={styles.modalContent}
  renderItem={({ item }) => {
    const isPDF = item.fileName?.toLowerCase().includes("pdf");
    const Wrapper = isPDF ? TouchableOpacity : View;

    return (
      <Wrapper
        style={styles.fileModalItem}
        {...(isPDF && {
          onPress: () => downloadPDF(item),
        })}
      >
        <Image
          source={{ uri: item.url }}
          style={styles.fileImage}
          resizeMode="cover"
        />

        <View style={styles.fileDetails}>
          <Text style={styles.fileModalName}>{item.fileName}</Text>
          <Text style={styles.fileModalType}>{item.fileType}</Text>

          {isPDF && (
            <Text style={styles.downloadHint}>Tap to download</Text>
          )}
        </View>
      </Wrapper>
    );
  }}
/>

          ) : (
            <View style={styles.noFilesContainer}>
              <MaterialIcons name="image-not-supported" size={64} color="#9CA3AF" />
              <Text style={styles.noFilesText}>No images found</Text>
            </View>
          )}
        </View>
      </Modal>

      {/* User History Modal */}
      <Modal
        visible={historyModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setHistoryModal(false);
          setSelectedUser(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedUser ? `${selectedUser}'s Chat History` : 'User History'}
            </Text>
            <TouchableOpacity onPress={() => {
              if (selectedUser) {
                setSelectedUser(null);
              } else {
                setHistoryModal(false);
              }
            }}>
              <MaterialIcons name={selectedUser ? "arrow-back" : "close"} size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          {!selectedUser ? (
            historyData?.agentChatListList && historyData.agentChatListList.length > 0 ? (
              <FlatList
                data={Array.from(new Set(historyData.agentChatListList.map(item => item.name) || []))}
                keyExtractor={(item) => item}
                renderItem={({ item: userName }) => (
                  <TouchableOpacity 
                    style={styles.userItem}
                    onPress={() => setSelectedUser(userName)}
                  >
                    <MaterialIcons name="person" size={24} color="#6366F1" />
                    <Text style={styles.userName}>{userName}</Text>
                    <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.modalContent}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No data found</Text>
              </View>
            )
          ) : (
            <FlatList
              data={historyData?.agentChatListList.filter(item => item.name === selectedUser) || []}
              keyExtractor={(item, index) => `${item.userId}-${index}`}
              renderItem={({ item }) => {
                const messages = parsePrompt(item.prompt);
                console.log('Parsed messages:', messages);
                return (
                  <View style={styles.conversationItem}>
                    {messages.map((message, msgIndex) => (
                      <View key={msgIndex} style={[
                        styles.messageBubble,
                        message.role === 'user' ? styles.userBubble : styles.assistantBubble
                      ]}>
                        <Text style={styles.roleLabel}>
                          {message.role === 'user' ? 'User' : 'Assistant'}
                        </Text>
                        <Text style={[
                          styles.messageContent,
                          message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                        ]}>{message.content}</Text>
                      </View>
                    ))}
                  </View>
                );
              }}
              contentContainerStyle={styles.chatContent}
            />
          )}
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal
        visible={deleteModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDeleteModal(false)}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Agent</Text>
              <TouchableOpacity onPress={() => setDeleteModal(false)}>
                <MaterialIcons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.deleteContent}>
              <Text style={styles.deleteMessage}>
                Make it Inactive to hide and keep history. Delete Permanently erases all data and can't be undone. Are you sure you want to delete anyway?
              </Text>
            </View>
            
            <View style={styles.deleteFooter}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setDeleteModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.inactiveBtn}
                onPress={() => {
                  if (selectedDeleteAssistant) {
                    const newStatus = !selectedDeleteAssistant.activeStatus;
                    editAgentStatus(selectedDeleteAssistant.id, newStatus);
                    setDeleteModal(false);
                  }
                }}
              >
                <Text style={styles.inactiveBtnText}>
                  {selectedDeleteAssistant?.activeStatus ? 'Make Inactive' : 'Make Active'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.deleteBtn, deletingAgent && styles.generateBtnDisabled]}
                disabled={deletingAgent}
                onPress={() => {
                  if (selectedDeleteAssistant?.assistantId) {
                    deleteAgent(selectedDeleteAssistant.assistantId);
                    setDeleteModal(false);
                  } else {
                    Alert.alert('Error', 'Assistant ID is not available');
                    setDeleteModal(false)
                  }
                }}
              >
                <Text style={styles.deleteBtnText}>{deletingAgent ? 'Deleting...' : 'Delete'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={editModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={cancelEdit}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit AI Agent</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={[styles.generateBtn, generatingInstructions && styles.generateBtnDisabled]} 
                onPress={() => generateInstructions(selectedAssistant!)}
                disabled={generatingInstructions}
              >
                <Text style={styles.generateBtnText}>
                  {generatingInstructions ? 'Generating...' : 'Generate Instructions'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.generateBtn, generatingConversations && styles.generateBtnDisabled]} 
                onPress={() => generateConversations(selectedAssistant!)}
                disabled={generatingConversations}
              >
                <Text style={styles.generateBtnText}>
                  {generatingConversations ? 'Generating...' : 'Generate Conversations'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView style={styles.editContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Instructions</Text>
              <ScrollView style={styles.scrollableTextArea} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                <TextInput
                  style={styles.textArea}
                  value={editInstructions}
                  onChangeText={setEditInstructions}
                  multiline
                  numberOfLines={10}
                  placeholder="Enter instructions..."
                />
              </ScrollView>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Conversation 1</Text>
              <TextInput
                style={styles.textArea}
                value={editConversation1}
                onChangeText={setEditConversation1}
                multiline
                numberOfLines={2}
                placeholder="Enter conversation 1..."
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Conversation 2</Text>
              <TextInput
                style={styles.textArea}
                value={editConversation2}
                onChangeText={setEditConversation2}
                multiline
                numberOfLines={2}
                placeholder="Enter conversation 2..."
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveBtn, savingEdit && styles.generateBtnDisabled]} 
              onPress={() => saveEdit()}
              disabled={savingEdit}
            >
              <Text style={styles.saveBtnText}>{savingEdit ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Business Card Modal */}
      <Modal
        visible={businessCardModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setBusinessCardModal(false);
          setEditingBusinessCard(false);
        }}
      >
        <View style={styles.businessCardOverlay}>
          <View style={styles.businessCardModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Business Card Details</Text>
              <TouchableOpacity onPress={() => {
                setBusinessCardModal(false);
                setEditingBusinessCard(false);
              }}>
                <MaterialIcons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            {businessCardData && (
              <ScrollView style={styles.businessCardContent} showsVerticalScrollIndicator={false}>
                <View style={styles.businessCardRow}>
                  <View style={styles.businessCardField}>
                    <Text style={styles.businessCardLabel}>Full Name:</Text>
                    {editingBusinessCard ? (
                      <TextInput
                        style={styles.businessCardInput}
                        value={editBusinessCardData?.fullName || ''}
                        onChangeText={(text) => setEditBusinessCardData({...editBusinessCardData, fullName: text})}
                      />
                    ) : (
                      <Text style={styles.businessCardValue}>{businessCardData.fullName}</Text>
                    )}
                  </View>
                  <View style={styles.businessCardField}>
                    <Text style={styles.businessCardLabel}>Job Title:</Text>
                    {editingBusinessCard ? (
                      <TextInput
                        style={styles.businessCardInput}
                        value={editBusinessCardData?.jobTitle || ''}
                        onChangeText={(text) => setEditBusinessCardData({...editBusinessCardData, jobTitle: text})}
                      />
                    ) : (
                      <Text style={styles.businessCardValue}>{businessCardData.jobTitle}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.businessCardRow}>
                  <View style={styles.businessCardField}>
                    <Text style={styles.businessCardLabel}>Company:</Text>
                    {editingBusinessCard ? (
                      <TextInput
                        style={styles.businessCardInput}
                        value={editBusinessCardData?.companyName || ''}
                        onChangeText={(text) => setEditBusinessCardData({...editBusinessCardData, companyName: text})}
                      />
                    ) : (
                      <Text style={styles.businessCardValue}>{businessCardData.companyName}</Text>
                    )}
                  </View>
                  <View style={styles.businessCardField}>
                    <Text style={styles.businessCardLabel}>Email:</Text>
                    {editingBusinessCard ? (
                      <TextInput
                        style={styles.businessCardInput}
                        value={editBusinessCardData?.email || ''}
                        onChangeText={(text) => setEditBusinessCardData({...editBusinessCardData, email: text})}
                      />
                    ) : (
                      <Text style={styles.businessCardValue}>{businessCardData.email}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.businessCardRow}>
                  <View style={styles.businessCardField}>
                    <Text style={styles.businessCardLabel}>Mobile:</Text>
                    {editingBusinessCard ? (
                      <TextInput
                        style={styles.businessCardInput}
                        value={editBusinessCardData?.mobileNumber || ''}
                        onChangeText={(text) => setEditBusinessCardData({...editBusinessCardData, mobileNumber: text})}
                      />
                    ) : (
                      <Text style={styles.businessCardValue}>{businessCardData.mobileNumber}</Text>
                    )}
                  </View>
                  <View style={styles.businessCardField}>
                    <Text style={styles.businessCardLabel}>Website:</Text>
                    {editingBusinessCard ? (
                      <TextInput
                        style={styles.businessCardInput}
                        value={editBusinessCardData?.webSite || ''}
                        onChangeText={(text) => setEditBusinessCardData({...editBusinessCardData, webSite: text})}
                      />
                    ) : (
                      <Text style={styles.businessCardValue}>{businessCardData.webSite || 'N/A'}</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.businessCardFieldFull}>
                  <Text style={styles.businessCardLabel}>Address:</Text>
                  {editingBusinessCard ? (
                    <TextInput
                      style={[styles.businessCardInput, styles.businessCardTextArea]}
                      value={editBusinessCardData?.address || ''}
                      onChangeText={(text) => setEditBusinessCardData({...editBusinessCardData, address: text})}
                      multiline
                      numberOfLines={3}
                    />
                  ) : (
                    <Text style={styles.businessCardValue}>{businessCardData.address}</Text>
                  )}
                </View>
                
                {businessCardData.imagePath && (
                  <View style={styles.businessCardImageContainer}>
                    <Text style={styles.businessCardLabel}>Business Card Image:</Text>
                    <Image 
                      source={{ uri: businessCardData.imagePath }} 
                      style={styles.businessCardImage} 
                      resizeMode="contain"
                    />
                  </View>
                )}
              </ScrollView>
            )}
            
            <View style={styles.businessCardFooter}>
              {editingBusinessCard ? (
                <>
                  <TouchableOpacity 
                    style={styles.cancelBtn} 
                    onPress={() => {setBusinessCardModal(false),setEditingBusinessCard(false)}}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.saveBtn, updatingBusinessCard && styles.generateBtnDisabled]}
                    disabled={updatingBusinessCard}
                    onPress={updateBusinessCard}
                  >
                    <Text style={styles.saveBtnText}>{updatingBusinessCard ? 'Updating...' : 'Submit'}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity 
                    style={styles.cancelBtn} 
                    onPress={() => setBusinessCardModal(false)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveBtn}
                    onPress={() => {
                      setEditBusinessCardData({...businessCardData});
                      setEditingBusinessCard(true);
                    }}
                  >
                    <Text style={styles.saveBtnText}>Edit</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
<TouchableOpacity
        style={[styles.createBtn,{backgroundColor: '#C19810'}]}
          onPress={() => setKycModalVisible(true)}        >
        <Text style={styles.createBtnText}>KYC Verification</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.createBtn,{backgroundColor: '#6366F1',}]}
        onPress={() => navigation.navigate('Agent Creation')}
        
        >
        <Text style={styles.createBtnText}>Create Agent</Text>
      </TouchableOpacity>
      </View>

      <KycCreationModal
  visible={kycModalVisible}
  onClose={() => setKycModalVisible(false)}
/>
      
      {renderSearchBar()}
      <FlatList<Assistant>
        data={filteredData?.assistants || []}
        renderItem={renderAssistantCard}
        keyExtractor={keyExtractor}
        ListHeaderComponent={(filteredData?.assistants?.length ?? 0) > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366F1']}
            tintColor="#6366F1"
          />
        }
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default AllAgentCreations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  flatListContent: {
    paddingHorizontal: 12,
    paddingBottom: 80,
    flexGrow: 1,
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },
  createBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 4,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  createBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  headerCount: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#6366F1',
    marginBottom: 10,
  },
  nameContainer: {
    flex: 1,
  },
  agentName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginLeft:10,

  },

  publishedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    width:90,
    margin:10,
    justifyContent:"center"
  },
  publishedBadgeText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '600',
  },
  draftBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  draftBadgeText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '600',
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    width: 90,
    margin: 10,
    justifyContent: 'center',
  },
  activeBadgeText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '600',
  },
  inactiveBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    width: 90,
    margin: 10,
    justifyContent: 'center',
  },
  inactiveBadgeText: {
    color: '#991B1B',
    fontSize: 11,
    fontWeight: '600',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    width: 90,
    margin: 10,
    justifyContent: 'center',
  },
  pendingBadgeText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '600',
  },
  defaultBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    width: 90,
    margin: 10,
    justifyContent: 'center',
  },
  defaultBadgeText: {
    color: '#374151',
    fontSize: 11,
    fontWeight: '600',
  },

  useAgentBtn: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-end',
    minWidth: 110,
  },
  useAgentText: {
    color: '#3730A3',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardBody: {
    padding: 14,
  },

  section: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  sectionText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },
  moreButton: {
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  moreButtonText: {
    color: '#204593ff',
    fontSize: 12,
    fontWeight: '500',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.25,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  footerContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  footerDivider: {
    height: 1,
    width: '60%',
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  actionHintContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  actionHint: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: width * 0.28,
  },
  actionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  uploadSection: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  uploadSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginLeft: 6,
  },
  fileInfo: {
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
    width: width * 0.42,
    minHeight: 90,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
    marginRight: 10,
  },
  fileInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#495057',
    marginLeft: 6,
    marginRight: 10,
    flex: 1,
  },
  uploadedFileName: {
    color: '#155724',
  },
  uploadedFileInfo: {
    backgroundColor: '#d4edda',
    borderLeftColor: '#28a745',
  },
  fileInfoText: {
    fontSize: 12,
    color: '#6c757d',
    marginVertical: 2,
  },
  fileContainer: {
    width: width * 0.88,
    minHeight: 90,
    borderRadius: 8,
    marginTop: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    // flex: 1,
    justifyContent: 'flex-end',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    padding: 16,
  },
  chatContent: {
    paddingVertical: 8,
  },
  fileModalItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  fileImage: {
    width: '100%',
    height: 200,
  },
  fileDetails: {
    padding: 12,
  },
  fileModalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  fileModalType: {
    fontSize: 14,
    color: '#6B7280',
  },
  noFilesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noFilesText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    fontWeight: '500',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 12,
  },
  conversationItem: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 2,
    marginHorizontal: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
    borderBottomLeftRadius: 4,
  },

 
  messageContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  assistantMessageText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  generateBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  generateBtnDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  editContent: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
    minHeight: 120,
  },
  scrollableTextArea: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 7,
    justifyContent:"center"
  },
  cancelBtnText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    // justifyContent: 'center',
  },
  saveBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonRows: {
    gap: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  buttonRowTwoItems: {
    justifyContent: 'space-around',
  },
  deleteContent: {
    // flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  deleteMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  deleteFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 7,
  },
  inactiveBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  inactiveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent:"center"
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 12,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#10B981',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deleteModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  businessCardOverlay: {
    // flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop:50
  },
  businessCardModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  businessCardContent: {
    // flex: 1,
    padding: 16,
  },
  businessCardRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  businessCardField: {
    flex: 1,
  },
  businessCardFieldFull: {
    marginBottom: 16,
  },
  businessCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  businessCardValue: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  businessCardInput: {
    fontSize: 14,
    color: '#374151',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  businessCardTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  businessCardImageContainer: {
    marginTop: 16,
  },
  businessCardImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  businessCardFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noDataText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  downloadHint: {
    fontSize: 12,
    color: '#6366F1',
    fontStyle: 'italic',
    marginTop: 4,
  },
});