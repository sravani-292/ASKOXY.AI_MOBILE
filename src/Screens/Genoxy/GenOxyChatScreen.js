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
  Platform,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
} from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";
import axios, { AxiosHeaders } from "axios";
import Markdown from "react-native-markdown-display";
import ChatInput from "./ChatInput";
import ChatHistoryDrawer from "./ChatHistoryDrawer";
import { useSelector } from "react-redux";
import BASE_URL, { userStage } from "../../../Config";
const { height: screenHeight } = Dimensions.get("window");

const GenOxyChatScreen = ({ route, navigation }) => {
  const { query, category, assistantId, agentName, fd, agentId } = route.params;
  console.log({ query, category, assistantId, agentName, fd, agentId });

  const flatListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [helperQuestions, setHelperQuestions] = useState([]);
  const [loadingHelperQuestions, setLoadingHelperQuestions] = useState(true);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);
  const fadeAnims = useRef(new Map()).current;
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.counter);
  const hasSentInitial = useRef(false); // Prevent double initial send
  const userId = user?.userId || user?.id;

  // FIXED: Removed extra spaces in URLs
  const HELPER_QUESTIONS_URL = `https://meta.oxyloans.com/api/ai-service/agent/getConversation/${agentId}`;

  const getAuthHeaders = () => {
    return user?.accessToken
      ? { Authorization: `Bearer ${user.accessToken}` }
      : {};
  };

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

        const data = response.data[0] || {};
        const questions = [
          data.conStarter1,
          data.conStarter2,
          data.conStarter3,
          data.conStarter4,
        ].filter((q) => q && typeof q === "string" && q.trim().length > 0);

        setHelperQuestions(questions);
      } catch (error) {
        console.error(
          "Failed to fetch helper questions:",
          error.response?.data || error.message
        );
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

    if (agentId && user?.accessToken) {
      fetchHelperQuestions();
    }
  }, [agentId, user?.accessToken]);

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

      // Add user message first, then send to API
      const userMessage = {
        role: "user",
        content: query.trim(),
        displayContent: query.trim(),
        id: Date.now(),
      };
      setMessages([userMessage]);
      fadeAnims.set(userMessage.id, new Animated.Value(0));

      sendMessage(query, true);
    }
  }, [query, messages.length]);

  // Keyboard visibility
  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showListener = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );
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
          timeout: 10000,
        }
      );

      if (response.data?.answer) return response.data.answer;
      if (typeof response.data === "string") return response.data;
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[response.data.length - 1].content;
      }
      return "I couldn't process the file.";
    } catch (error) {
      console.error(
        "File upload error:",
        error.response?.data || error.message
      );
      return "File upload failed. Please try again.";
    }
  };

  // API Functions for chat history
  const postAgentChat = async (agentIdParam, userIdParam, messageHistory) => {
    const headers = new AxiosHeaders();
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    const auth = getAuthHeaders();
    if (auth.Authorization) headers.set("Authorization", auth.Authorization);

    const payload = {
      agentId: agentIdParam,
      userId: userIdParam,
      messageHistory,
    };

    if (threadId) {
      payload.threadId = threadId;
    }

    console.log("chat api payload", payload);

    const { data } = await axios.post(
      `http://65.0.147.157:9040/api/ai-service/agent/agentChat1`,
      payload,
      { headers }
    );
    return data;
  };

  const fetchUserHistory = async (userIdParam, agentIdParam) => {
    console.log("Fetching user history", { userIdParam, agentIdParam });

    const { data } = await axios.get(
      `${BASE_URL}/ai-service/agent/getUserHistory/${userIdParam}/${agentIdParam}`,
      { headers: { ...getAuthHeaders() } }
    );
    // console.log("Fetched user history", data);
    return data;
  };

  const fetchThreadHistory = async (threadIdParam) => {
    if (
      !threadIdParam ||
      threadIdParam.trim() === "" ||
      String(threadIdParam).toLowerCase() === "null"
    ) {
      return null;
    }

    try {
      const headers = new AxiosHeaders();
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      const auth = getAuthHeaders();
      if (auth.Authorization) {
        headers.set("Authorization", auth.Authorization);
      }

      const url = `http://65.0.147.157:9040/api/ai-service/agent/getconversations/${threadIdParam}/messages`;
      console.log("[fetchThreadHistory] Calling URL:", url);
      const response = await axios.get(url, { headers });

      const data = response.data;
      console.log("[fetchThreadHistory] Raw response:", data);

      if (data && typeof data === "object" && !Array.isArray(data)) {
        if (Array.isArray(data.data)) {
          console.log(
            "[fetchThreadHistory] Returning data.data:",
            data.data.length,
            "messages"
          );
          return data.data;
        }
        if (Array.isArray(data.messages)) {
          console.log(
            "[fetchThreadHistory] Returning data.messages:",
            data.messages.length,
            "messages"
          );
          return data.messages;
        }
        if (Array.isArray(data.history)) {
          console.log(
            "[fetchThreadHistory] Returning data.history:",
            data.history.length,
            "messages"
          );
          return data.history;
        }
      }

      if (Array.isArray(data)) {
        console.log(
          "[fetchThreadHistory] Returning direct array:",
          data.length,
          "messages"
        );
        return data;
      }
      console.log("[fetchThreadHistory] No valid data found, returning null");
      return null;
    } catch (error) {
      console.error("fetchThreadHistory error:", error);
      return null;
    }
  };

  const extractQAFromHistory = (threadMessages) => {
    if (!Array.isArray(threadMessages)) return [];

    return threadMessages
      .map((msg, index) => {
        let content = "";

        // Handle new thread message format
        if (
          msg.content &&
          Array.isArray(msg.content) &&
          msg.content.length > 0
        ) {
          const textContent = msg.content.find((c) => c.type === "text");
          if (textContent?.text?.value) {
            content = textContent.text.value;
          }
        } else if (typeof msg.content === "string") {
          content = msg.content;
        } else if (msg.message) {
          content = msg.message;
        }

        return {
          id: msg.id || Date.now() + index,
          role: msg.role || (msg.sender === "user" ? "user" : "assistant"),
          content: content,
          displayContent: content, // Add displayContent for user messages
          created_at: msg.created_at || 0,
        };
      })
      .filter((msg) => msg.content.trim())
      .sort((a, b) => a.created_at - b.created_at); // Sort by timestamp to show user question first
  };

  const normalizeMessages = (messages) => {
    if (!Array.isArray(messages)) return [];

    return messages
      .map((msg, index) => ({
        id: msg.id || Date.now() + index,
        role: msg.role || "assistant",
        content: msg.content || msg.message || "",
      }))
      .filter((msg) => msg.content.trim());
  };

  const openHistoryChat = async (hid) => {
    console.log("[openHistoryChat] Opening chat:", hid);

    if (!userId) return;

    setCurrentChatId(hid);
    setThreadId(hid);

    try {
      const threadMessages = await fetchThreadHistory(hid);
      console.log("[openHistoryChat] Thread messages:", threadMessages);

      if (Array.isArray(threadMessages) && threadMessages.length > 0) {
        const messages = extractQAFromHistory(threadMessages);
        console.log("[openHistoryChat] Extracted messages:", messages);
        setMessages(messages);
      } else {
        console.log("[openHistoryChat] No thread messages found");
        setMessages([]);
      }
    } catch (err) {
      console.error("[openHistoryChat] Error:", err);
      setMessages([]);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Send message

  const sendMessage = async (text, isInitial = false, assistantId = null) => {
    console.log("💬 sendMessage called with:", {
      text,
      isInitial,
      assistantId,
    });

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
      content: `${agentName ? agentName : "OXYGPT"} is thinking...`,
      temp: true,
      id: Date.now() + 1,
    };

    setMessages((prev) => [...prev, thinkingMessage]);
    fadeAnims.set(thinkingMessage.id, new Animated.Value(0));
    setLoading(true);

    try {
      let assistantReply = "";

      if (fd && isInitial) {
        assistantReply = await handleFileUpload(fd, text);
      } else {
        // const conversationHistory = [...messages, userMessage]
        //   .filter((msg) => !msg.temp && msg.role === 'user')
        //   .map((msg) => ({
        //     role: msg.role,
        //     content: msg.content,
        //   }));

        const conversationHistory = [
          {
            role: "user",
            content: userMessage.content,
          },
        ];

        console.log("🚀 Calling postAgentChat with:", {
          agentId,
          userId,
          conversationHistory,
        });

        const response = await postAgentChat(
          agentId,
          userId,
          conversationHistory
        );

        console.log("send message api response", response);

        // Update threadId if returned
        if (response?.thread_id && !threadId) {
          setThreadId(response.thread_id);
        } else if (response?.threadId && !threadId) {
          setThreadId(response.threadId);
        }

        // Handle agentChat1 API response format
        if (response?.assistant_reply) {
          assistantReply = response.assistant_reply;
        } else if (typeof response === "string") {
          assistantReply = response;
        } else if (response?.content) {
          assistantReply = response.content;
        } else if (response?.message) {
          assistantReply = response.message;
        } else {
          console.warn("Unexpected response format:", response);
          assistantReply = "I couldn't understand the response.";
        }

        // Clean response by removing square bracket citations
        assistantReply = assistantReply.replace(/【[^】]*】/g, "").trim();
      }

      if (
        !assistantReply ||
        typeof assistantReply !== "string" ||
        !assistantReply.trim()
      ) {
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
        setTimeout(
          () => flatListRef.current?.scrollToEnd({ animated: true }),
          100
        );
        // Trigger history refresh after successful message
        setHistoryRefreshTrigger((prev) => prev + 1);
        return updated;
      });
    } catch (error) {
      console.error("🚨 API Error:", error?.message);
      console.error("Full error:", error); // Log full error object

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
        setTimeout(
          () => flatListRef.current?.scrollToEnd({ animated: true }),
          100
        );
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
        return;
      }

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

  // Render helper questions
  const renderHelperQuestions = () => {
    if (
      messages.length > 0 ||
      loadingHelperQuestions ||
      helperQuestions.length === 0
    ) {
      return null;
    }

    return (
      <View style={styles.helperContainer}>
        <Text style={styles.helperTitle}>Welcome to {agentName}!</Text>
        <Text style={styles.headerSubtitle}>
          Start chatting to explore how this assistant can help you.
        </Text>
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f4f5" />

      {/* Header with menu button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsDrawerVisible(true)}
        >
          <Ionicons name="menu" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{agentName || "OXYGPT"}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
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
                contentContainerStyle={[
                  styles.messagesContainer,
                  messages.length === 0 && { flexGrow: 0 },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
              />
            </>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <ChatInput
            placeholder="Type a message..."
            onSendMessage={(text) => {
              console.log("📤 SEND BUTTON PRESSED with text:", text);
              sendMessage(text, false);
            }}
            enableVoice={true}
            showAttachment={true}
            theme="light"
            navigation={navigation}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Chat History Drawer */}
      <ChatHistoryDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        userId={userId}
        agentId={agentId}
        onHistorySelect={openHistoryChat}
        currentChatId={currentChatId}
        refreshTrigger={historyRefreshTrigger}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
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
    paddingHorizontal: 16,
    paddingVertical:15,
    alignItems: "center",
  },
  helperTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#6b7280",
    lineHeight: 22,
    marginBottom: 18,
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  helperChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginVertical: 6,
    width: "100%",
    maxWidth: 400,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  helperText: {
    fontSize: 15,
    color: "#374151",
    textAlign: "center",
    lineHeight: 18,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
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

export default GenOxyChatScreen;
