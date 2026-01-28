import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { SendHorizontal, X, Sparkles, Trash2, Bot } from "lucide-react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale, scaleFont } from "../utils/scale.js";
import { useSelector } from "react-redux";

// Simple LinearGradient fallback (since you're not using Expo)
const LinearGradient = ({ colors, style, children, ...props }) => {
  return (
    <View style={[style, { backgroundColor: colors[0] }]} {...props}>
      {children}
    </View>
  );
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  primary: "#7C3AED",
  primaryLight: "#A78BFA",
  primaryDark: "#5B21B6",
  secondary: "#F8F7FF",
  userMessage: "#7C3AED",
  botMessage: "#FFFFFF",
  background: "#FAFAFA",
  border: "#E9E5F5",
  text: "#1F2937",
  textSecondary: "#6B7280",
  shadow: "rgba(124, 58, 237, 0.15)",
  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  overlay: "rgba(0, 0, 0, 0.5)",
  gradientStart: "#8B5CF6",
  gradientEnd: "#6366F1",
};

const SIZES = {
  borderRadius: scale(16),
  padding: scale(16),
  margin: scale(8),
  iconSize: scale(20),
  productCardWidth: scale(160),
  productImageHeight: verticalScale(100),
  inputMinHeight: verticalScale(44),
  inputMaxHeight: verticalScale(120),
};

const ANIMATION_DURATION = 300;

const QUICK_QUESTIONS = [
  { text: "Show today's rice and grocery offers", emoji: "🌾" },
  { text: "Which rice varieties are trending now?", emoji: "📈" },
  { text: "Check today's gold prices", emoji: "💰" },
  { text: "Explain what AskOxy.ai can do", emoji: "🤖" },
  { text: "How can I create my own AI agent?", emoji: "✨" },
  { text: "Track my recent order", emoji: "📦" },
  { text: "What payment methods are available?", emoji: "💳" },
  { text: "What is BMV coin and how can I use it?", emoji: "🪙" },
  { text: "What are the benefits of AI agents?", emoji: "🎯" },
];

export default function ChatScreen({ navigation, route }) {
  const userData = useSelector((state) => state.counter);

  const userId =
    userData?.userId ||
    route?.params?.userId ||
    "e00536d6-a7eb-40d9-840c-38acaceb6177";
  const token = userData?.accessToken;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputHeight, setInputHeight] = useState(SIZES.inputMinHeight);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const inputRef = useRef(null);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const quickQuestionsAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Enhanced keyboard listeners
  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      Animated.timing(quickQuestionsAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowQuickQuestions(false));
    }
  }, [messages.length]);

  const sendMessage = useCallback(
    async (customPrompt = null) => {
      const promptText = (customPrompt || input).trim();
      if (!promptText || loading) return;

      const userMsg = {
        role: "user",
        content: promptText,
        type: "text",
        timestamp: Date.now(),
        id: `user-${Date.now()}`,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setInputHeight(SIZES.inputMinHeight);
      setLoading(true);
      Keyboard.dismiss();

      try {
        const cleanUserId = String(userId).trim();
        if (!cleanUserId || cleanUserId.length !== 36) {
          throw new Error("Invalid userId");
        }

        const url = `https://meta.oxyloans.com/api/ai-service/chat1?userId=${encodeURIComponent(
          cleanUserId
        )}`;
        console.log("Final URL:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt: promptText }),
        });

        const rawText = await response.text();
        console.log("Raw API response:", rawText);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        // Handle BOTH JSON and plain-text responses
        let assistantContent = rawText;

        try {
          const parsed = JSON.parse(rawText);
          assistantContent =
            parsed?.response ||
            parsed?.message ||
            parsed?.description ||
            parsed?.content ||
            rawText;
        } catch {
          // Plain text → use as-is (expected for this API)
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: assistantContent,
            type: "text",
            timestamp: Date.now(),
            id: `assistant-${Date.now()}`,
          },
        ]);
      } catch (error) {
        console.error("API Error:", error.message || error);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I’m having trouble reaching the server right now. Please try again.",
            type: "text",
            timestamp: Date.now(),
            id: `error-${Date.now()}`,
            isError: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, userId, token]
  );

  const handleQuickQuestion = useCallback(
    (question) => {
      sendMessage(question);
    },
    [sendMessage]
  );

  const handleContentSizeChange = useCallback((event) => {
    const height = event.nativeEvent.contentSize.height;
    setInputHeight(
      Math.max(SIZES.inputMinHeight, Math.min(SIZES.inputMaxHeight, height))
    );
  }, []);

  const clearChat = useCallback(() => {
    Alert.alert("Clear Chat", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setMessages([]);
          setShowQuickQuestions(true);
          Animated.timing(quickQuestionsAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        },
      },
    ]);
  }, []);

  const renderWelcomeScreen = () => (
    <View style={styles.welcomeContainer}>
      <Animated.View
        style={[
          styles.welcomeContent,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.botIconContainer}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            style={styles.botIconGradient}
          >
            <Bot size={scale(48)} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <Text style={styles.welcomeTitle}>Hi there! 👋</Text>
        <Text style={styles.welcomeSubtitle}>
          I'm your AI shopping assistant. How can I help you today?
        </Text>
      </Animated.View>
    </View>
  );

  const renderTextMessage = useCallback(
    (msg, index) => {
      const isUser = msg.role === "user";
      return (
        <Animated.View
          key={msg.id || index}
          style={[styles.messageContainer, { opacity: fadeAnim }]}
        >
          {!isUser && (
            <View style={styles.botAvatarSmall}>
              <Bot size={scale(16)} color={COLORS.primary} />
            </View>
          )}
          <View
            style={[
              styles.messageBox,
              isUser ? styles.userMessage : styles.botMessage,
              msg.isError && styles.errorMessage,
            ]}
          >
            <View style={styles.messageContent}>
              {isUser ? (
                <Text style={styles.userMessageText}>{msg.content}</Text>
              ) : (
                <Markdown style={markdownStyles}>{msg.content}</Markdown>
              )}
              <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
          {isUser && <View style={styles.userAvatarPlaceholder} />}
        </Animated.View>
      );
    },
    [fadeAnim]
  );

  const renderMessage = useCallback(
    ({ item }) => renderTextMessage(item),
    [renderTextMessage]
  );

  const renderTypingIndicator = () => (
    <Animated.View style={[styles.typingContainer, { opacity: fadeAnim }]}>
      <View style={styles.botAvatarSmall}>
        <Bot size={scale(16)} color={COLORS.primary} />
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.typingDotsContainer}>
          <View style={[styles.typingDot, styles.typingDot1]} />
          <View style={[styles.typingDot, styles.typingDot2]} />
          <View style={[styles.typingDot, styles.typingDot3]} />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.gradientStart}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Header */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <View style={styles.headerIconContainer}>
              <Sparkles size={scale(20)} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <Text style={styles.headerSubtitle}>
                {messages.length > 0 ? `${messages.length} messages` : "Online"}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {messages.length > 0 && (
              <TouchableOpacity onPress={clearChat} style={styles.headerButton}>
                <Trash2 size={scale(18)} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerButton}
            >
              <X size={scale(20)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {messages.length === 0 ? (
            renderWelcomeScreen()
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={() => {
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
            />
          )}
        </View>

        {loading && renderTypingIndicator()}

        {/* Quick Questions */}
        {showQuickQuestions && messages.length === 0 && (
          <Animated.View
            style={[
              styles.quickQuestionsContainer,
              { opacity: quickQuestionsAnim },
            ]}
          >
            <Text style={styles.quickQuestionsTitle}>✨ Quick Questions</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickQuestionsList}
            >
              {QUICK_QUESTIONS.map((item, index) => (
                <TouchableOpacity
                  key={`quick-${index}`}
                  style={styles.quickQuestionButton}
                  onPress={() => handleQuickQuestion(item.text)}
                  disabled={loading}
                >
                  <Text style={styles.quickQuestionEmoji}>{item.emoji}</Text>
                  <Text style={styles.quickQuestionText}>{item.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View
            style={[
              styles.inputWrapper,
              { minHeight: inputHeight + verticalScale(8) },
            ]}
          >
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              onContentSizeChange={handleContentSizeChange}
              placeholder="Ask me anything..."
              placeholderTextColor={COLORS.textSecondary}
              style={[
                styles.textInput,
                { height: Math.max(SIZES.inputMinHeight, inputHeight) },
              ]}
              multiline
              maxLength={1000}
              returnKeyType="send"
              onSubmitEditing={() => input.trim() && sendMessage()}
              blurOnSubmit={false}
              textAlignVertical="top"
            />
            <TouchableOpacity
              onPress={() => sendMessage()}
              style={[
                styles.sendButton,
                (!input.trim() || loading) && styles.disabledButton,
              ]}
              disabled={!input.trim() || loading}
            >
              <LinearGradient
                colors={
                  input.trim() && !loading
                    ? [COLORS.gradientStart, COLORS.gradientEnd]
                    : ["#E5E7EB", "#E5E7EB"]
                }
                style={styles.sendButtonGradient}
              >
                <SendHorizontal size={scale(18)} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.gradientStart,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIconContainer: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  headerTitle: {
    fontSize: scaleFont(18),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: scaleFont(12),
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: verticalScale(2),
  },
  headerRight: {
    flexDirection: "row",
  },
  headerButton: {
    padding: scale(8),
    marginLeft: scale(4),
    borderRadius: scale(8),
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(32),
  },
  welcomeContent: {
    alignItems: "center",
  },
  botIconContainer: {
    marginBottom: verticalScale(24),
  },
  botIconGradient: {
    width: scale(96),
    height: scale(96),
    borderRadius: scale(48),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeTitle: {
    fontSize: scaleFont(28),
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: verticalScale(12),
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: scaleFont(16),
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: verticalScale(24),
  },
  quickQuestionsContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quickQuestionsTitle: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: verticalScale(12),
  },
  quickQuestionsList: {
    paddingRight: scale(16),
  },
  quickQuestionButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: scale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    marginRight: scale(10),
    minWidth: scale(160),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickQuestionEmoji: {
    fontSize: scaleFont(18),
    marginRight: scale(8),
  },
  quickQuestionText: {
    fontSize: scaleFont(13),
    color: COLORS.text,
    fontWeight: "500",
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesList: {
    flexGrow: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(8),
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: verticalScale(16),
    alignItems: "flex-end",
  },
  botAvatarSmall: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(8),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userAvatarPlaceholder: {
    width: scale(32),
    marginLeft: scale(8),
  },
  messageBox: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderRadius: scale(18),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: COLORS.userMessage,
    borderBottomRightRadius: scale(4),
  },
  botMessage: {
    backgroundColor: COLORS.botMessage,
    borderBottomLeftRadius: scale(4),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  errorMessage: {
    backgroundColor: "#FEE2E2",
    borderColor: COLORS.error,
  },
  messageContent: {
    flex: 1,
  },
  userMessageText: {
    fontSize: scaleFont(15),
    color: "#FFFFFF",
    lineHeight: verticalScale(22),
  },
  timestamp: {
    fontSize: scaleFont(10),
    color: COLORS.textSecondary,
    marginTop: verticalScale(6),
    textAlign: "right",
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    backgroundColor: COLORS.background,
  },
  typingBubble: {
    backgroundColor: COLORS.botMessage,
    borderRadius: scale(18),
    borderBottomLeftRadius: scale(4),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typingDotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: COLORS.primary,
    marginHorizontal: scale(3),
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  inputContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
    paddingBottom: Platform.OS === "ios" ? verticalScale(8) : verticalScale(12),
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#FFFFFF",
    borderRadius: scale(24),
    paddingLeft: scale(16),
    paddingRight: scale(4),
    paddingVertical: verticalScale(4),
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: scaleFont(15),
    color: COLORS.text,
    backgroundColor: "transparent",
    paddingVertical: verticalScale(10),
    paddingTop: verticalScale(10),
    maxHeight: SIZES.inputMaxHeight,
  },
  sendButton: {
    marginLeft: scale(8),
    marginBottom: verticalScale(2),
  },
  sendButtonGradient: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

const markdownStyles = {
  body: {
    color: COLORS.text,
    fontSize: scaleFont(15),
    lineHeight: verticalScale(22),
  },
  strong: { fontWeight: "bold", color: COLORS.text },
  em: { fontStyle: "italic" },
  paragraph: { marginBottom: verticalScale(4) },
  heading1: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    marginBottom: verticalScale(8),
    color: COLORS.text,
  },
  heading2: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    marginBottom: verticalScale(6),
    color: COLORS.text,
  },
  code_inline: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: scale(4),
    paddingVertical: verticalScale(2),
    borderRadius: scale(4),
    fontSize: scaleFont(13),
    color: COLORS.primary,
  },
  code_block: {
    backgroundColor: COLORS.secondary,
    padding: scale(12),
    borderRadius: scale(8),
    marginVertical: verticalScale(8),
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
};
