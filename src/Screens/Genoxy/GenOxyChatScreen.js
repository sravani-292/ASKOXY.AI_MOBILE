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
} from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Markdown from 'react-native-markdown-display';
import ChatInput from "./ChatInput";

const { height: screenHeight } = Dimensions.get("window");

const GenOxyChatScreen = ({ route, navigation }) => {
  const { query, category, assistantId, categoryType, fd } = route.params;
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  const API_URL = `https://meta.oxyloans.com/api/student-service/user/askquestion?assistantId=${assistantId}`;

  // Send initial message once
  useEffect(() => {
    if (query && messages.length === 0) {
      sendMessage(query, true);
    }
  }, [query, messages.length]);

  // Keyboard listeners
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showListener = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsKeyboardVisible(true);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    const hideListener = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    });

    return () => {
      showListener?.remove();
      hideListener?.remove();
    };
  }, []);

  // Scroll to bottom when messages update
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

  // Main send function
  const sendMessage = async (text, isInitial = false) => {
    if (!text || !text.trim()) return;
     console.log("Sending message:", text);
     
    const userMessage = {
      role: "user",
      content: text.trim(),
      displayContent: text.trim(),
      id: Date.now(),
    };

    // Add user message
    setMessages((prev) => {
      const updated = [...prev, userMessage];
      return updated;
    });

    // Add thinking message
    const thinkingMessage = {
      role: "assistant",
      content: `${categoryType} is thinking...`,
      temp: true,
      id: Date.now() + 1000,
    };

    setMessages((prev) => [...prev, thinkingMessage]);
    setLoading(true);

    try {
      let assistantReply = "";

      if (fd && isInitial) {
        assistantReply = await handleFileUpload(fd, text);
      } else {
        // ✅ Safely use current messages
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

        // console.log("✅ API Response:", response);

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

      // Fallback
      if (!assistantReply || typeof assistantReply !== "string" || !assistantReply.trim()) {
        assistantReply = "Sorry, I couldn't generate a response.";
      }

      // Remove thinking message and add assistant reply
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
        message: `${categoryType}:\n\n${message.content}`,
        title: categoryType,
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

  // Render formatted text
  const renderFormattedText = (text) => {
    if (!text) return null;

    let cleanedText = text
      .replace(/【.*?†source】/g, "")
      .replace(/\s*LOG\s*/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s{2,}/g, " ")
      .trim();

    const parts = cleanedText.split(
      /(\*\*.*?\*\*|\*.*?\*|`.*?`|\n|https?:\/\/[^\s]+|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu
    );

    return (
      <Text style={styles.messageText}>
        {parts.map((part, index) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <Text key={index} style={styles.boldText}>
                {part.slice(2, -2)}
              </Text>
            );
          } else if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
            return (
              <Text key={index} style={styles.italicText}>
                {part.slice(1, -1)}
              </Text>
            );
          } else if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <Text key={index} style={styles.codeText}>
                {part.slice(1, -1)}
              </Text>
            );
          } else if (part === "\n") {
            return <Text key={index}>{"\n"}</Text>;
          } else if (/^https?:\/\//.test(part)) {
            return (
              <Text key={index} style={styles.linkText} onPress={() => Linking.openURL(part)}>
                🔗 {part.length > 50 ? part.substring(0, 47) + "..." : part}
              </Text>
            );
          } else if (
            /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(part)
          ) {
            return <Text key={index} style={styles.emojiText}>{part}</Text>;
          } else {
            return <Text key={index}>{part}</Text>;
          }
        })}
      </Text>
    );
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.role === "user" ? styles.userMessageContainer : styles.botMessageContainer,
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
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.thinkingText}> {item.content}</Text>
          </View>
        ) : (
          // renderFormattedText(item.content)
          <Markdown style={markdownStyles}>{item.content}</Markdown>
        )}

        {item.role === "assistant" && !item.temp && (
          <View style={styles.messageActions}>
            <TouchableOpacity onPress={() => copyMessage(item)} style={styles.actionButton}>
              <Ionicons name="copy-outline" size={18} color="#6c757d" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => shareMessage(item)} style={styles.actionButton}>
              <Ionicons name="share-outline" size={18} color="#6c757d" />
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
                size={18}
                color={speakingMessageId === item.id ? "#007AFF" : "#6c757d"}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2d3748" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{categoryType}</Text>
          <Text style={styles.headerSubtitle}>{category}</Text>
        </View>
      </View> */}

      {/* Chat */}
      <View
        style={[
          styles.chatContainer,
          isKeyboardVisible && Platform.OS === "android" && {
            maxHeight: screenHeight - keyboardHeight - 200,
          },
        ]}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
 
      {/* Chat Input */}
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

      {isKeyboardVisible && Platform.OS === "android" && (
        <View style={{ height: keyboardHeight }} />
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: Platform.OS === "ios" ? 50 : 16,
  },
  backButton: { marginRight: 12 },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#2d3748" },
  headerSubtitle: { fontSize: 14, color: "#6c757d", marginTop: 2 },
  chatContainer: { flex: 1, padding: 16 },
  messagesContainer: { paddingBottom: 10 },
  messageContainer: { marginBottom: 12 },
  userMessageContainer: { alignItems: "flex-end" },
  botMessageContainer: { alignItems: "flex-start" },
  message: { maxWidth: "85%", padding: 12, borderRadius: 18 },
  userMessage: { backgroundColor: "#007AFF", alignSelf: "flex-end", borderTopRightRadius: 4 },
  botMessage: { backgroundColor: "#e9ecef", alignSelf: "flex-start", borderTopLeftRadius: 4 },
  messageText: { fontSize: 16, lineHeight: 22, color: "#2d3748" },
  boldText: { fontWeight: "600" },
  italicText: { fontStyle: "italic" },
  codeText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    backgroundColor: "#dee2e6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  linkText: { color: "#007AFF", textDecorationLine: "underline" },
  emojiText: { fontSize: 18 },
  loadingContainer: { flexDirection: "row", alignItems: "center" },
  thinkingText: { fontSize: 14, color: "#6c757d", marginLeft: 8 },
  messageActions: { flexDirection: "row", marginTop: 8, gap: 12 },
  actionButton: { padding: 6, borderRadius: 6 },
  activeActionButton: { backgroundColor: "#007AFF20" },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderColor: "#e9ecef",
  },
});

export default GenOxyChatScreen;

const markdownStyles = {
  body: { color: '#333', fontSize: 14 },
  image: { width: 200, height: 150, borderRadius: 10, marginTop: 8 },
  strong: { fontWeight: 'bold' },
  paragraph: { marginBottom: 10 },
};