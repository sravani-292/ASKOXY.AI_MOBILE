import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Keyboard,
  Alert,
  Share,
  Clipboard,
  Dimensions,
  Platform,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";
import axios, { AxiosHeaders } from "axios";
import Markdown from "react-native-markdown-display";
import ChatInput from "../Genoxy/ChatInput";
import { useSelector } from "react-redux";

const { height: screenHeight } = Dimensions.get("window");

const AssistantChatScreen = ({ route, navigation }) => {
  const { assistantId, assistantName, query } = route.params;
  console.log({ assistantId, assistantName, query });

  const flatListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const fadeAnims = useRef(new Map()).current;
  const user = useSelector((state) => state.counter);
  const hasSentInitial = useRef(false);

  const getAuthHeaders = () => {
    return user?.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {};
  };

  // Initialize fade animations
  useEffect(() => {
    messages.forEach((msg) => {
      if (!fadeAnims.has(msg.id)) {
        fadeAnims.set(msg.id, new Animated.Value(0));
      }
    });
  }, [messages]);

  // Trigger fade-in
  useEffect(() => {
    messages.forEach((msg) => {
      const anim = fadeAnims.get(msg.id);
      if (anim && anim._value < 1) {
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [messages]);

  // Send initial message (only once)
  useEffect(() => {
    if (query && messages.length === 0 && !hasSentInitial.current) {
      hasSentInitial.current = true;
      console.log("📤 Sending initial query:", query);
      sendMessage(query, true);
    }
  }, [query, messages.length]);

  // Keyboard visibility
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showListener = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    const hideListener = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // API call for Assistant
  const callAssistantAPI = async (messageHistory) => {
    const headers = new AxiosHeaders();
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    const auth = getAuthHeaders();
    if (auth.Authorization) headers.set("Authorization", auth.Authorization);

    const url = `https://meta.oxyloans.com/api/student-service/user/askquestion?assistantId=${assistantId}`;
    const payload = messageHistory;
    
    console.log("Assistant API URL:", url);
    console.log("Request Payload:", payload);
    console.log("Headers:", headers);

    try {
      const { data } = await axios.post(url, payload, { headers });
      return data;
    } catch (error) {
      console.log("API Error Details:", error.response?.data);
      console.log("API Error Status:", error.response?.status);
      throw error;
    }
  };

  // Send message
  const sendMessage = async (text, isInitial = false) => {
    console.log("💬 sendMessage called with:", { text, isInitial });

    if (!text || !text.trim()) {
      console.log("❌ Empty message, skipped");
      return;
    }

    const userMessage = {
      role: "user",
      content: text.trim(),
      displayContent: text.trim(),
      id: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    fadeAnims.set(userMessage.id, new Animated.Value(0));

    const thinkingMessage = {
      role: "assistant",
      content: `${assistantName ? assistantName : "Assistant"} is thinking...`,
      temp: true,
      id: Date.now() + 1,
    };

    setMessages((prev) => [...prev, thinkingMessage]);
    fadeAnims.set(thinkingMessage.id, new Animated.Value(0));
    setLoading(true);

    try {
      // Build conversation history for assistant API
      const conversationHistory = [...messages, userMessage]
        .filter((msg) => !msg.temp)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      console.log("🚀 Calling Assistant API with:", { assistantId, conversationHistory });

      const response = await callAssistantAPI(conversationHistory);
      console.log("Assistant API response:", response);

      let assistantReply = "";

      // Handle different response formats
      if (typeof response === "string") {
        assistantReply = response;
      } else if (response?.content) {
        assistantReply = response.content;
      } else if (response?.message) {
        assistantReply = response.message;
      } else if (response?.answer) {
        assistantReply = response.answer;
      } else {
        console.warn("Unexpected response format:", response);
        assistantReply = "I couldn't understand the response.";
      }

      // Clean response by removing square bracket citations
      assistantReply = assistantReply.replace(/【[^】]*】/g, '').trim();

      if (!assistantReply || typeof assistantReply !== "string" || !assistantReply.trim()) {
        assistantReply = "Sorry, I couldn't generate a response.";
      }

      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.temp);
        const newId = Date.now() + 2;
        const updated = [
          ...filtered,
          {
            role: "assistant",
            content: assistantReply.trim(),
            id: newId,
          },
        ];
        fadeAnims.set(newId, new Animated.Value(0));
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        return updated;
      });
    } catch (error) {
      console.error("🚨 API Error:", error?.message);
      console.error("Full error:", error);

      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.temp);
        const newId = Date.now() + 3;
        const updated = [
          ...filtered,
          {
            role: "assistant",
            content: "⚠️ Failed to get response. Check network or try again.",
            id: newId,
          },
        ];
        fadeAnims.set(newId, new Animated.Value(0));
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy message
  const copyMessage = async (message) => {
    try {
      await Clipboard.setString(message.content);
      Alert.alert("Copied!", "Message copied to clipboard");
    } catch {
      Alert.alert("Error", "Copy failed");
    }
  };

  // Share message
  const shareMessage = async (message) => {
    try {
      await Share.share({
        message: `${assistantName}:\n\n${message.content}`,
        title: assistantName,
      });
    } catch {
      Alert.alert("Error", "Share failed");
    }
  };

  // Text-to-speech
  const speakMessage = async (message) => {
    try {
      if (speakingMessageId === message.id) {
        Speech.stop();
        setSpeakingMessageId(null);
        return;
      }

      Speech.stop();
      setSpeakingMessageId(message.id);

      const cleanText = message.content
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/【.*?】/g, "")
        .replace(/\|/g, " ")
        .replace(/\n+/g, ". ")
        .trim();

      await Speech.speak(cleanText, {
        onDone: () => setSpeakingMessageId(null),
        onStopped: () => setSpeakingMessageId(null),
        onError: () => setSpeakingMessageId(null),
      });
    } catch {
      Alert.alert("Error", "TTS not available");
      setSpeakingMessageId(null);
    }
  };

  // Render message
  const renderMessage = ({ item }) => (
    <Animated.View
      style={[
        styles.messageContainer,
        item.role === "user"
          ? styles.userMessageContainer
          : styles.botMessageContainer,
        { opacity: fadeAnims.get(item.id) || 1 },
      ]}
    >
      <View
        style={[
          styles.message,
          item.role === "user" ? styles.userMessage : styles.botMessage,
        ]}
      >
        {item.role === "user" ? (
          <Text style={[styles.messageText, styles.userMessageText]}>
            {item.displayContent}
          </Text>
        ) : item.temp ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text style={styles.thinkingText}> {item.content}</Text>
          </View>
        ) : (
          <Markdown style={markdownStyles}>{item.content}</Markdown>
        )}

        {item.role === "assistant" && !item.temp && (
          <View style={styles.messageActions}>
            <TouchableOpacity
              onPress={() => copyMessage(item)}
              style={styles.actionButton}
            >
              <Ionicons name="copy-outline" size={16} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => shareMessage(item)}
              style={styles.actionButton}
            >
              <Ionicons name="share-outline" size={16} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => speakMessage(item)}
              style={[
                styles.actionButton,
                speakingMessageId === item.id && styles.activeActionButton,
              ]}
            >
              <Ionicons
                name={
                  speakingMessageId === item.id
                    ? "stop-outline"
                    : "volume-high-outline"
                }
                size={16}
                color={speakingMessageId === item.id ? "#2563eb" : "#64748b"}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );

  // Main render
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f5" />
      


      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        </View>

        <View style={styles.inputWrapper}>
          <ChatInput
            placeholder="Type a message..."
            onSendMessage={(text) => {
              console.log("📤 SEND BUTTON PRESSED with text:", text);
              sendMessage(text, false);
            }}
            enableVoice={true}
            showAttachment={false}
            theme="light"
            navigation={navigation}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

// Styles (same as GenOxyChatScreen)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  headerSpacer: {
    width: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  messagesContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  botMessageContainer: {
    alignItems: "flex-start",
  },
  message: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userMessage: {
    backgroundColor: "#2563eb",
    borderTopRightRadius: 4,
  },
  botMessage: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  userMessageText: {
    color: "#ffffff",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  thinkingText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  messageActions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 12,
    justifyContent: "flex-end",
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
  },
  activeActionButton: {
    backgroundColor: "#2563eb20",
  },
  inputWrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

// Markdown styles
const markdownStyles = {
  body: {
    color: "#1f2937",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  strong: {
    fontWeight: "600",
    color: "#111827",
  },
  em: {
    fontStyle: "italic",
  },
  code_inline: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    backgroundColor: "#f3f4f6",
    color: "#1f2937",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
  },
  link: {
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  paragraph: {
    marginVertical: 6,
  },
  list_item: {
    marginVertical: 4,
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
};

export default AssistantChatScreen;