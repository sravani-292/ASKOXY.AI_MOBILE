import React, { useState, useEffect, useRef } from "react";
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
  Linking,
  Platform,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Markdown from "react-native-markdown-display";
import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";
import { header } from "framer-motion/m";

const { height: screenHeight } = Dimensions.get("window");

const GenOxyChatScreen = ({ route, navigation }) => {
  const { query, category, assistantId, agentName, fd, agentId } = route.params;
  const flatListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [helperQuestions, setHelperQuestions] = useState([]);
  const [loadingHelperQuestions, setLoadingHelperQuestions] = useState(true);
  const fadeAnims = useRef(new Map()).current;
  const user = useSelector((state) => state.counter);

  const API_URL = `https://meta.oxyloans.com/api/student-service/user/askquestion?assistantId=${assistantId}`;
  const HELPER_QUESTIONS_URL = `https://meta.oxyloans.com/api/ai-service/agent/getConversation/${agentId}`;

  // Fetch helper questions
  useEffect(() => {
    const fetchHelperQuestions = async () => {
      try {
        setLoadingHelperQuestions(true);
        const response = await axios.get(HELPER_QUESTIONS_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          timeout: 10000,
        });

        // console.log("Helper questions response:", response.data[0]);

        // Extract conversation starters from response
        const data = response.data[0] || {};
        const questions = [
          data.conStarter1,
          data.conStarter2,
          data.conStarter3,
          data.conStarter4,
        ].filter((q) => q && typeof q === "string" && q.trim().length > 0);

        setHelperQuestions(questions);
      } catch (error) {
        console.error("Failed to fetch helper questions:", error.response?.data || error.message);
        // Fallback to default questions
        setHelperQuestions([
          "What are my loan eligibility criteria?",
          "How do I apply for an education loan?",
          "What documents are required?",
          "What are the interest rates?",
        ]);
      } finally {
        setLoadingHelperQuestions(false);
      }
    };
    fetchHelperQuestions();
  }, [agentId, user.accessToken]);

  // Initialize fade animation for each message
  useEffect(() => {
    messages.forEach((msg) => {
      if (!fadeAnims.has(msg.id)) {
        fadeAnims.set(msg.id, new Animated.Value(0));
      }
    });
  }, [messages]);

  // Fade-in animation for new messages
  useEffect(() => {
    messages.forEach((msg) => {
      if (fadeAnims.get(msg.id)?.toValue !== 1) {
        Animated.timing(fadeAnims.get(msg.id), {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [messages]);

  // Send initial message
  useEffect(() => {
    if (query && messages.length === 0) {
      sendMessage(query, true);
    }
  }, [query, messages.length]);

  // Keyboard listeners
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
      showListener?.remove();
      hideListener?.remove();
    };
  }, []);

  // Scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // File upload handler
  const handleFileUpload = async (fileData, prompt) => {
    const formData = new FormData();
    formData.append("file", fileData);
    formData.append("prompt", prompt);

    try {
      const response = await axios.post(
        "https://meta.oxyloans.com/api/student-service/user/chat-with-file",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      );

      if (response.data?.answer) return response.data.answer;
      if (typeof response.data === "string") return response.data;
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[response.data.length - 1].content;
      }
      return "I couldn't process the file.";
    } catch (error) {
      console.error("File upload error:", error.response?.data || error.message);
      return "File upload failed. Please try again.";
    }
  };

  // Send message
  const sendMessage = async (text, isInitial = false) => {
    if (!text || !text.trim()) return;
    console.log("Sending message:", text);

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
      content: `${agentName} is thinking...`,
      temp: true,
      id: Date.now() + 1000,
    };

    setMessages((prev) => [...prev, thinkingMessage]);
    fadeAnims.set(thinkingMessage.id, new Animated.Value(0));
    setLoading(true);

    try {
      let assistantReply = "";

      if (fd && isInitial) {
        assistantReply = await handleFileUpload(fd, text);
      } else {
        const validMessages = Array.isArray(messages) ? messages : [];
        const conversationHistory = [...validMessages, userMessage]
          .filter((msg) => !msg.temp)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        console.log("📤 Sending to API:", conversationHistory);

        const response = await axios.post(API_URL, conversationHistory, {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        });

        if (typeof response.data === "string") {
          assistantReply = response.data;
        } else if (response.data?.content) {
          assistantReply = response.data.content;
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          assistantReply = response.data[response.data.length - 1]?.content || "No response content.";
        } else {
          assistantReply = "I couldn't understand the response.";
        }
      }

      if (!assistantReply || typeof assistantReply !== "string" || !assistantReply.trim()) {
        assistantReply = "Sorry, I couldn't generate a response.";
      }

      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.temp);
        const updated = [
          ...filtered,
          {
            role: "assistant",
            content: assistantReply.trim(),
            id: Date.now() + 2000,
          },
        ];
        fadeAnims.set(Date.now() + 2000, new Animated.Value(0));
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        return updated;
      });
    } catch (error) {
      console.error("🚨 API Error:", error.response?.data || error.message);
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.temp);
        const updated = [
          ...filtered,
          {
            role: "assistant",
            content: "⚠️ Failed to get response. Check network.",
            id: Date.now() + 3000,
          },
        ];
        fadeAnims.set(Date.now() + 3000, new Animated.Value(0));
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
        message: `${agentName}:\n\n${message.content}`,
        title: agentName,
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
      } else {
        Speech.stop();
        setSpeakingMessageId(message.id);

        const cleanText = message.content
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/`(.*?)`/g, "$1")
          .replace(/【.*?†source】/g, "")
          .replace(/\|/g, " ")
          .replace(/\n+/g, ". ")
          .trim();

        await Speech.speak(cleanText, {
          onDone: () => setSpeakingMessageId(null),
          onStopped: () => setSpeakingMessageId(null),
          onError: () => setSpeakingMessageId(null),
        });
      }
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
        item.role === "user" ? styles.userMessageContainer : styles.botMessageContainer,
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
          <Text style={[styles.messageText, { color: "#fff" }]}>
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
            <TouchableOpacity onPress={() => copyMessage(item)} style={styles.actionButton}>
              <Ionicons name="copy-outline" size={16} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareMessage(item)} style={styles.actionButton}>
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
                name={speakingMessageId === item.id ? "stop-outline" : "volume-high-outline"}
                size={16}
                color={speakingMessageId === item.id ? "#2563eb" : "#64748b"}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );

  // Render helper questions
  const renderHelperQuestions = () => {
    if (messages.length > 0 || loadingHelperQuestions || helperQuestions.length === 0) {
      return null;
    }

    return (
      <View style={styles.helperContainer}>
        <Text style={styles.helperTitle}>Welcome to {agentName}!</Text>
        <Text style={styles.headerSubtitle}>Start chatting to explore how this assistant can help you.</Text>
        {helperQuestions.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={styles.helperChip}
            onPress={() => sendMessage(question)}
          >
            <Text style={styles.helperText}>{question}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Main render
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f5" />

      {/* Chat and Helper Questions */}
      <View style={styles.chatContainer}>
        {loadingHelperQuestions && messages.length === 0 ? (
          <View style={styles.loadingContainerCentered}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Loading suggestions...</Text>
          </View>
        ) : (
          <>
            {renderHelperQuestions()}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderMessage}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>

      {/* Chat Input */}
      <View style={styles.inputWrapper}>
        <ChatInput
          placeholder="Type a message..."
          onSendMessage={(text) => {
            console.log("📤 Sending:", text);
            sendMessage(text, false);
          }}
          enableVoice={true}
          showAttachment={true}
          containerStyle={styles.inputContainer}
          theme="light"
          navigation={navigation}
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f5",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  messagesContainer: {
    paddingBottom: 80, // Space for input
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
    color: "#1f2937",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingContainerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 12,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
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
  helperContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  helperTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
  },
  helperChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginVertical: 4,
    width: "90%",
    maxWidth: 400,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  helperText: {
    fontSize: 14,
    color: "#1f2937",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  inputWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputContainer: {
    paddingVertical: 8,
    backgroundColor: "#f4f4f5",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#d1d5db",
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
  },
  em: {
    fontStyle: "italic",
  },
  code_inline: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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

export default GenOxyChatScreen;