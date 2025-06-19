import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

const OPENAI_API_KEY = 'sk-proj-OdiZZYjrCd68sWzlkcHgT3BlbkFJgaRmcLYH0u1JvPtLkk9e'; // Replace with your actual API key
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I\'m your legal assistant. I can help you analyze cases, provide legal suggestions, and cite relevant law points. What legal matter would you like to discuss?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [caseContext, setCaseContext] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Request permissions on component mount
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to upload images');
    }
  };

  const sendMessage = async (text, attachment = null) => {
    if (!text.trim() && !attachment) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text || '',
      isUser: true,
      timestamp: new Date(),
      attachment,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepare messages for OpenAI API
      // Enhanced system prompt for legal assistance
      const systemPrompt = {
        role: 'system',
        content: `You are an expert legal assistant with comprehensive knowledge of law. Your role is to:

1. CASE ANALYSIS: Analyze legal cases thoroughly by asking clarifying questions about:
   - Facts of the case
   - Parties involved
   - Jurisdiction
   - Timeline of events
   - Legal issues identified
   - Evidence available

2. PROVIDE SUGGESTIONS: Offer practical legal advice including:
   - Potential legal strategies
   - Relevant precedents
   - Procedural requirements
   - Risk assessment
   - Alternative dispute resolution options

3. CITE LAW POINTS: Reference specific legal authorities such as:
   - Relevant statutes and sections
   - Case law and precedents
   - Constitutional provisions
   - Rules and regulations
   - Legal principles and doctrines

4. ASK PROBING QUESTIONS: When information is incomplete, ask specific questions to gather:
   - Missing facts
   - Documentary evidence
   - Witness information
   - Procedural history
   - Client objectives

Always structure responses with clear sections: ANALYSIS, QUESTIONS, SUGGESTIONS, and LEGAL AUTHORITIES. Be thorough but conversational. Ask follow-up questions to build a complete picture of the case.

IMPORTANT: Always include a disclaimer that this is informational only and not substitute for professional legal advice.`
      };

      const conversationHistory = [
        systemPrompt,
        ...messages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text,
        })),
        { role: 'user', content: userMessage.text }
      ];

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: conversationHistory,
          max_tokens: 800,
          temperature: 0.3,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: data.choices[0].message.content,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error?.message || 'Failed to get response');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to send message');
      console.error('OpenAI API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const attachment = {
          type: 'image',
          uri: result.assets[0].uri,
          name: 'image.jpg',
        };
        sendMessage('Shared an image', attachment);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
    setShowAttachmentModal(false);
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const attachment = {
          type: 'video',
          uri: result.assets[0].uri,
          name: 'video.mp4',
        };
        sendMessage('Shared a video', attachment);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video');
    }
    setShowAttachmentModal(false);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const attachment = {
          type: 'document',
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          mimeType: result.assets[0].mimeType,
        };
        sendMessage(`Shared a document: ${result.assets[0].name}`, attachment);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
    setShowAttachmentModal(false);
  };

  const renderAttachment = (attachment) => {
    if (!attachment) return null;

    switch (attachment.type) {
      case 'image':
        return (
          <Image
            source={{ uri: attachment.uri }}
            style={styles.attachmentImage}
            resizeMode="cover"
          />
        );
      case 'video':
        return (
          <Video
            source={{ uri: attachment.uri }}
            style={styles.attachmentVideo}
            useNativeControls
            resizeMode="contain"
            shouldPlay={false}
          />
        );
      case 'document':
        return (
          <View style={styles.documentAttachment}>
            <Ionicons name="document-text" size={24} color="#007AFF" />
            <Text style={styles.documentName} numberOfLines={1}>
              {attachment.name}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.systemMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.systemBubble
      ]}>
        {item.attachment && renderAttachment(item.attachment)}
        {item.text ? (
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userText : styles.systemText
          ]}>
            {item.text}
          </Text>
        ) : null}
        <Text style={[
          styles.timestamp,
          item.isUser ? styles.userTimestamp : styles.systemTimestamp
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const AttachmentModal = () => (
    <Modal
      visible={showAttachmentModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAttachmentModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Share Something</Text>
          
          <TouchableOpacity style={styles.modalOption} onPress={pickImage}>
            <Ionicons name="image" size={24} color="#007AFF" />
            <Text style={styles.modalOptionText}>Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.modalOption} onPress={pickVideo}>
            <Ionicons name="videocam" size={24} color="#007AFF" />
            <Text style={styles.modalOptionText}>Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.modalOption} onPress={pickDocument}>
            <Ionicons name="document-text" size={24} color="#007AFF" />
            <Text style={styles.modalOptionText}>Document</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => setShowAttachmentModal(false)}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>AI</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Friend</Text>
            <Text style={styles.headerSubtitle}>Always here to chat</Text>
          </View>
        </View>
        <View style={styles.callActions}>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.videoButton}>
            <Ionicons name="videocam" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View> */}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={() => setShowAttachmentModal(true)}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Say something..."
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons
            name="send"
            size={20}
            color={(!inputText.trim() || isLoading) ? '#ccc' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      <AttachmentModal />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  callActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  videoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 5,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  systemMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 24,
    marginVertical: 2,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 8,
  },
  systemBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  systemText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 5,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  systemTimestamp: {
    color: '#999',
  },
  attachmentImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  attachmentVideo: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  documentAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingText: {
    marginLeft: 10,
    color: '#666',
    fontStyle: 'italic',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  modalCancel: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default ChatScreen;