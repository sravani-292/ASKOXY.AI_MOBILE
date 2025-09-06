import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import Markdown from "react-native-markdown-display";

const { width } = Dimensions.get("window");

const Genoxy = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [remainingPrompts, setRemainingPrompts] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]); // multiple files
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // 🎤 Voice states
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  const API_BASE = "https://meta.oxyloans.com/api/student-service/user";

  // 🔑 Track keyboard height for Android fix
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onKeyboardShow = (e) => {
      const height = (e?.endCoordinates && e.endCoordinates.height) || 0;
      setKeyboardHeight(height);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 120);
    };

    const onKeyboardHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // 📎 Pick File
  const handleFileUpload = async () => {
    try {
      if (uploadedFiles.length >= 3) {
        Alert.alert("Limit Reached", "You can upload a maximum of 3 files.");
        return;
      }

      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      setUploadedFiles((prev) => [...prev, result.assets[0]]);
    } catch (error) {
      console.error("File selection failed:", error);
    }
  };

  // ❌ Remove file
  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 🎤 Handle microphone press
  const handleMicPress = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Start "recording"
  const startRecording = () => {
    setIsRecording(true);
    // Alert.alert("Voice Input", "Simulating voice recording...");
  };

  // Stop "recording" and fake transcription
  const stopRecording = () => {
    setIsRecording(false);
    setIsTranscribing(true);

    setTimeout(() => {
      const demoTexts = [
        "Hello, how are you?",
        "Tell me about React Native.",
        "What's the weather today?",
        "I need coding help.",
        "Explain machine learning."
      ];
      const randomText = demoTexts[Math.floor(Math.random() * demoTexts.length)];
      setInputText(randomText);
      setIsTranscribing(false);
      inputRef.current?.focus();
    }, 1500);
  };

  // 📤 Send Message
  const sendMessage = async () => {
    if (!inputText.trim() && uploadedFiles.length === 0) return;

    if (remainingPrompts === 0) {
      Alert.alert("Limit Reached", "No more prompts available for this file.");
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim() || uploadedFiles.map((f) => `📎 ${f.name}`).join(", "),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      if (uploadedFiles.length > 0 && !threadId) {
        const formData = new FormData();
        uploadedFiles.forEach((file) => {
          formData.append("file", {
            uri: file.uri,
            type: file.mimeType || "application/octet-stream",
            name: file.name,
          });
        });
        formData.append("prompt", userMessage.content);

        const response = await axios.post(`${API_BASE}/chat-with-file`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const {
          answer,
          threadId: newThreadId,
          remainingPrompts: updatedPrompts,
        } = response.data;

        setThreadId(newThreadId);
        setRemainingPrompts(updatedPrompts);
        setUploadedFiles([]);

        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `${String(answer).trim()}\n\n🟣 ${updatedPrompts} prompts remaining`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else if (threadId) {
        const formData = new FormData();
        formData.append("prompt", userMessage.content);
        formData.append("threadId", threadId);

        const response = await axios.post(`${API_BASE}/chat-with-file`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const { answer, remainingPrompts: updatedPrompts } = response.data;
        setRemainingPrompts(updatedPrompts);

        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `${String(answer).trim()}\n\n🟣 ${updatedPrompts} prompts remaining`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const responseChat = await axios.post(
          `${API_BASE}/chat1`,
          [{ role: "user", content: userMessage.content }],
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("Chat response:", responseChat);
        

        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            responseChat.data.content ||
            responseChat.data ||
            "❌ Could not process request.",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }

      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "❌ Error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

    // Component for suggested action buttons
  const SuggestionButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.suggestionButton} onPress={onPress}>
      <Text style={styles.suggestionText}>{title}</Text>
    </TouchableOpacity>
  );

  // 📨 Chat bubble
  const ChatMessage = ({ item }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.assistantMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          <Text
            style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}
          >
            <Markdown>{item.content}</Markdown>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1d29" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.container}>
            <LinearGradient colors={["#1a1d29", "#2d3748"]} style={styles.background}>
            {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <Ionicons name="sparkles" size={24} color="#a78bfa" />
              </View>
              <Text style={styles.headerTitle}>GENOXY</Text>
            </View>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreText}>Explore AI LLMs</Text>
            </TouchableOpacity>
          </View>

           {/* Welcome message when no messages */}
            {messages.length === 0 && (
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Welcome to GENOXY</Text>
                <Text style={styles.welcomeSubtitle}>Pick an assistant from the sidebar to begin.</Text>
              </View>
            )}

          {/* Suggestion buttons (shown when no messages) */}
            {messages.length === 0 && (
              <View style={styles.suggestionsContainer}>
                <SuggestionButton 
                  title="📱 Image Generation" 
                  onPress={() => setInputText("Tell me about image generation")} 
                />
                <SuggestionButton 
                  title="📚 Learning" 
                  onPress={() => setInputText("Help me learn something new")} 
                />
                <SuggestionButton 
                  title="💻 Development" 
                  onPress={() => setInputText("Tell me about React Native")} 
                />
                <SuggestionButton 
                  title="📰 News" 
                  onPress={() => setInputText("What's the latest in tech?")} 
                />
              </View>
            )}
              {/* Chat List */}
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => <ChatMessage item={item} />}
                keyExtractor={(item) => item.id}
                style={styles.messagesList}
                onContentSizeChange={() =>
                  flatListRef.current?.scrollToEnd({ animated: true })
                }
                showsVerticalScrollIndicator={false}
              />

              {/* Loader */}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Thinking</Text>
                  <Text style={styles.dots}>...</Text>
                </View>
              )}

              {/* File Previews */}
              {uploadedFiles.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.filesPreviewBar}
                >
                  {uploadedFiles.map((file, index) => (
                    <View key={index} style={styles.filePreview}>
                      {file.mimeType?.startsWith("image/") ? (
                        <Image source={{ uri: file.uri }} style={styles.fileThumbnail} />
                      ) : (
                        <Ionicons name="document" size={32} color="#fff" />
                      )}
                      <Text style={styles.fileName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <TouchableOpacity onPress={() => removeFile(index)}>
                        <Ionicons name="close-circle" size={20} color="#f87171" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}



              {/* Input */}
              <View
                style={[
                  styles.inputContainer,
                  { marginBottom: Platform.OS === "android" ? keyboardHeight : 0 },
                ]}
              >
                <View style={styles.inputWrapper}>
                  <TouchableOpacity
                    style={styles.attachButton}
                    onPress={handleFileUpload}
                  >
                    <Ionicons name="attach" size={20} color="#64748b" />
                  </TouchableOpacity>

                  <TextInput
                    ref={inputRef}
                    style={styles.textInput}
                    placeholder={
                      isTranscribing
                        ? "Converting speech..."
                        : isRecording
                        ? "Recording..."
                        : "Type your question..."
                    }
                    placeholderTextColor="#64748b"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    editable={!isRecording && !isTranscribing}
                  />

                  {/* Mic Button */}
                  <TouchableOpacity
                    style={[
                      styles.micButton,
                      isRecording || isTranscribing ? styles.micActive : null,
                    ]}
                    onPress={handleMicPress}
                  >
                    <Ionicons
                      name={isRecording ? "stop" : "mic"}
                      size={20}
                      color={isRecording ? "#ff4444" : "#64748b"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.sendButton,
                      inputText.trim() || uploadedFiles.length > 0
                        ? styles.sendButtonActive
                        : styles.sendButtonInactive,
                    ]}
                    onPress={sendMessage}
                    disabled={(!inputText.trim() && uploadedFiles.length === 0) || isLoading}
                  >
                    <Ionicons
                      name="send"
                      size={18}
                      color={inputText.trim() || uploadedFiles.length > 0 ? "#fff" : "#64748b"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1d29" },
  background: { flex: 1 },
  messagesList: { flex: 1, padding: 12 },
  messageContainer: { marginVertical: 4 },
  userMessage: { alignItems: "flex-end" },
  assistantMessage: { alignItems: "flex-start" },
  messageBubble: { maxWidth: width * 0.8, borderRadius: 18, padding: 12 },
  userBubble: { backgroundColor: "#a78bfa" },
  assistantBubble: { backgroundColor: "#374151" },
  messageText: { fontSize: 16, lineHeight: 22 },
  userText: { color: "#fff" },
  assistantText: { color: "#fff" },

  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#1a1d29",
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#374151",
    borderRadius: 25,
    paddingHorizontal: 10,
    minHeight: 50,
  },
  textInput: { flex: 1, color: "#fff", fontSize: 16, top:-2 },
  attachButton: { padding: 8, marginRight: 6,top:-2 },
  micButton: { padding: 8, marginRight: 6,top:-2 },
  micActive: { backgroundColor: "rgba(251,191,36,0.2)", borderRadius: 20,top:-2 },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    top:-2
  },
  sendButtonActive: { backgroundColor: "#a78bfa",top:-2 },
  sendButtonInactive: { backgroundColor: "transparent",top:-2 },

  filesPreviewBar: {
    maxHeight: 80,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  filePreview: {
    width: 80,
    marginRight: 8,
    backgroundColor: "#2d3748",
    borderRadius: 8,
    alignItems: "center",
    padding: 6,
  },
  fileThumbnail: { width: 40, height: 40, borderRadius: 6, marginBottom: 4 },
  fileName: { color: "#fff", fontSize: 12, textAlign: "center" },

  loadingContainer: { alignItems: "center", padding: 10 },
  loadingText: { color: "#fff", fontSize: 16 },
  dots: { color: "#a78bfa", fontSize: 18, fontWeight: "bold" },
    // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a78bfa',
  },
  exploreButton: {
    backgroundColor: '#a78bfa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exploreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Suggestion buttons styles
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
    gap: 10,
  },
  suggestionButton: {
    backgroundColor: 'rgba(167, 139, 250, 0.1)',
    borderColor: 'rgba(167, 139, 250, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  suggestionText: {
    color: '#a78bfa',
    fontSize: 14,
    fontWeight: '500',
  },

    // Welcome screen styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#a78bfa',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
  },
});

export default Genoxy;
