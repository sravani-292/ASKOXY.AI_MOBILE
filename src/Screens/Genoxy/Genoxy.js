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
    Modal,
  } from "react-native";
  import { LinearGradient } from "expo-linear-gradient";
  import { Ionicons } from "@expo/vector-icons";
  import axios from "axios";
  import * as DocumentPicker from "expo-document-picker";
  import * as ImagePicker from "expo-image-picker";
  import Markdown from "react-native-markdown-display";
import * as Clipboard from 'expo-clipboard';
  const { width, height } = Dimensions.get("window");

  const Genoxy = ({navigation}) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [threadId, setThreadId] = useState(null);
    const [remainingPrompts, setRemainingPrompts] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [showFeaturesModal, setShowFeaturesModal] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
const [copyMessage,setCopyMessage]=useState(false);
    const flatListRef = useRef(null);
    const inputRef = useRef(null);

    const API_BASE = "https://meta.oxyloans.com/api/student-service/user";

    // LLM icons data from the image
    const llmIcons = [
      { id: 1, title: "AI Agent to Earn Money", icon: "chatbubbles", color: "#a78bfa",navigation:"Store" },
      { id: 2, title: "AI LLMs", icon: "logo-react", color: "#60a5fa",navigation:"DrawerScreens"  },
      { id: 3, title: "Free AI Book", icon: "book", color: "#34d399" ,navigation:"Before Login" },
      { id: 4, title: "AI Videos", icon: "videocam", color: "#f472b6",navigation:"AI Videos"  },
      { id: 5, title: "AI Masterclasses", icon: "school", color: "#fbbf24" ,navigation:"Our AI Videos" },
      { id: 6, title: "GenOxy Voice Assistant", icon: "mic", color: "#f87171" ,navigation:"Genoxy" },
    ];

    // Prompt suggestions
    const promptSuggestions = [
      "What is AI?",
      "Tell a joke",
      "How to make coffee",
      "Latest AI news",
      "React Native basics",
      "Write a story"
    ];

    // Feature options for the modal
    const featureOptions = [
      { id: 1, title: "Upload File", icon: "document", action: "upload" },
      { id: 2, title: "Image Generation", icon: "camera", action: "imageGeneration" },
      { id: 3, title: "Learning", icon: "book", action: "learning" },
      { id: 4, title: "Development", icon: "code", action: "development" },
      { id: 5, title: "News", icon: "newspaper", action: "news" },
    ];

    useEffect(() => {
      const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
      const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

      const onKeyboardShow = (e) => {
        const height = (e?.endCoordinates && e.endCoordinates.height) || 0;
        setKeyboardHeight(height);
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

    // Scroll to bottom when messages change
    useEffect(() => {
      if (messages.length > 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }, [messages]);

    // Handle feature selection from modal
    const handleFeatureSelect = async (action) => {
      setShowFeaturesModal(false);
      
      switch (action) {
        case "upload":
          await handleFileUpload();
          break;
        case "imageGeneration":
          setInputText("Tell me about image generation");
          break;
        case "learning":
          setInputText("Help me learn something new");
          break;
        case "development":
          setInputText("Tell me about React Native");
          break;
        case "news":
          setInputText("What's the latest in tech?");
          break;
        default:
          break;
      }
    }

    // File upload function
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

    // Take photo function
    const takePhoto = async () => {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert("Permission required", "Camera permission is needed to take photos");
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.5,
        });

        if (!result.canceled) {
          const asset = result.assets[0];
          setUploadedFiles((prev) => [...prev, {
            uri: asset.uri,
            name: `photo_${Date.now()}.jpg`,
            mimeType: 'image/jpeg'
          }]);
        }
      } catch (error) {
        console.error("Camera error:", error);
      }
    };

    // Pick image from gallery
    const pickImage = async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert("Permission required", "Gallery permission is needed to select images");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 0.5,
        });

        if (!result.canceled) {
          const asset = result.assets[0];
          setUploadedFiles((prev) => [...prev, {
            uri: asset.uri,
            name: asset.fileName || `image_${Date.now()}.jpg`,
            mimeType: asset.type || 'image/jpeg'
          }]);
        }
      } catch (error) {
        console.error("Gallery error:", error);
      }
    };

    // Remove file
    const removeFile = (index) => {
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle microphone press
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

    // Send Message
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

    // Component for LLM icons
    const LLMIcon = ({ title, icon, color, onPress }) => (
      <TouchableOpacity style={styles.llmIcon} onPress={onPress}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={styles.llmIconText}>{title}</Text>
      </TouchableOpacity>
    );

    // Component for prompt suggestions
    const PromptSuggestion = ({ title, onPress }) => (
      <TouchableOpacity style={styles.promptSuggestion} onPress={onPress}>
        <Text style={styles.promptText}>{title}</Text>
      </TouchableOpacity>
    );

    // Component for feature options in modal
    const FeatureOption = ({ title, icon, onPress }) => (
      <TouchableOpacity style={styles.featureOption} onPress={onPress}>
        <Ionicons name={icon} size={24} color="#a78bfa" />
        <Text style={styles.featureOptionText}>{title}</Text>
      </TouchableOpacity>
    );

    // Chat bubble component
   // Chat bubble component with copy functionality
const ChatMessage = ({ item }) => {
  const isUser = item.role === "user";
  
  const handleCopy = () => {
    // Copy the message content to clipboard
    Clipboard.setString(item.content.replace(/\n\n🟣 \d+ prompts remaining/, ''));
    // Alert.alert("Copied!", "Message copied to clipboard");
    setCopyMessage(true)
  };

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
        <Markdown style={markdownStyles}>
          {item.content}
        </Markdown>
        
        {/* Copy button for assistant messages */}
        {!isUser && (
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={handleCopy}
          >
           {copyMessage==false? 
           <Ionicons name="copy-outline" size={16} color="#e2e8f0" />:
           <View style={{alignItems:"center",flexDirection:"row",backgroundColor:"white",width:width*0.3,padding:10}}>

           <Ionicons name="checkmark-outline" size={16} color="green" style={{backgroundColor:"white",marginTop:30,}}/>
           <Text>Copied</Text>

           </View>
           }
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#1a1d29" />
        <SafeAreaView style={styles.container}>
          <LinearGradient colors={["#1a1d29", "#2d3748"]} style={styles.background}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.logoContainer}>
                  <Ionicons name="sparkles" size={24} color="#a78bfa" />
                </View>
                <Text style={styles.headerTitle}>OXYGPT</Text>
              </View>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreText}>Explore AI LLMs</Text>
              </TouchableOpacity>
            </View>

            {/* Main content area */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 10}
              style={styles.mainContent}
            >
              {/* Welcome message when no messages */}
              {messages.length === 0 && (
                <View style={styles.welcomeSection}>
                  <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeTitle}>Welcome to OXYGPT</Text>
                    <Text style={styles.welcomeSubtitle}>Pick an assistant from the sidebar to begin.</Text>
                  </View>

                  {/* Input Container - At the top when no messages */}
                  <View style={styles.inputContainerTop}>
                    <View style={styles.inputWrapper}>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setShowFeaturesModal(true)}
                      >
                        <Ionicons name="add" size={24} color="#64748b" />
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
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
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

                  {/* Prompt Suggestions */}
                  <View style={styles.promptSuggestionsContainer}>
                    <Text style={styles.promptTitle}>Try asking:</Text>
                    <View style={styles.promptGrid}>
                      {promptSuggestions.map((prompt, index) => (
                        <PromptSuggestion
                          key={index}
                          title={prompt}
                          onPress={() => setInputText(prompt)}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              )}

              {/* Chat List (shown when there are messages) */}
              {messages.length > 0 && (
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  renderItem={({ item }) => <ChatMessage item={item} />}
                  keyExtractor={(item) => item.id}
                  style={styles.messagesList}
                  contentContainerStyle={{ paddingBottom: 100 }}
                  showsVerticalScrollIndicator={false}
                />
              )}

              {/* Loader */}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Thinking</Text>
                  <Text style={styles.dots}>...</Text>
                </View>
              )}
            </KeyboardAvoidingView>

            {/* File Previews */}
            {uploadedFiles.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[
                  styles.filesPreviewBar,
                  { bottom: isInputFocused && Platform.OS === 'ios' ? keyboardHeight + 60 : 60 }
                ]}
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

            {/* Input Container - At the bottom when messages exist */}
            {messages.length > 0 && (
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                style={[
                  styles.inputContainerBottom,
                  { marginBottom: isInputFocused && Platform.OS === 'ios' ? keyboardHeight : 0 }
                ]}
              >
                <View style={styles.inputWrapper}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowFeaturesModal(true)}
                  >
                    <Ionicons name="add" size={24} color="#64748b" />
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
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
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
              </KeyboardAvoidingView>
            )}

            {/* LLM Icons Row at Bottom (shown when no messages) */}
            {messages.length === 0 && (
              <View style={[
                styles.llmIconsBottomContainer,
                { bottom: isInputFocused && Platform.OS === 'ios' ? keyboardHeight + 10 : 10 }
              ]}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.llmIconsContent}
                >
                  {llmIcons.map((icon) => (
                    <LLMIcon
                      key={icon.id}
                      title={icon.title}
                      icon={icon.icon}
                      color={icon.color}
                      onPress={() =>navigation.navigate(icon.navigation)}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Features Modal */}
            <Modal
              visible={showFeaturesModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowFeaturesModal(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowFeaturesModal(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Add Content</Text>
                      <View style={styles.featuresGrid}>
                        {featureOptions.map((feature) => (
                          <FeatureOption
                            key={feature.id}
                            title={feature.title}
                            icon={feature.icon}
                            onPress={() => handleFeatureSelect(feature.action)}
                          />
                        ))}
                      </View>
                      <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setShowFeaturesModal(false)}
                      >
                        <Text style={styles.modalCloseText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </LinearGradient>
        </SafeAreaView>
      </>
    );
  };

  const markdownStyles = StyleSheet.create({
    body: {
      color: '#fff',
      fontSize: 16,
      lineHeight: 22,
    },
    paragraph: {
      marginBottom: 0,
    },
    code_inline: {
      backgroundColor: '#f8f8f8',
      color: '#000',
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 2,
      borderRadius: 3,
    },
    code_block: {
      backgroundColor: '#f8f8f8',
      color: '#000',
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginVertical: 5,
    },
    fence: {
      backgroundColor: '#f8f8f8',
      color: '#000',
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginVertical: 5,
    },
  });

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1a1d29" },
    background: { flex: 1 },
    
    // Main content area
    mainContent: {
      flex: 1,
    },
    
    // Header styles
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 15,
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
    
    // LLM Icons at Bottom
    llmIconsBottomContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      paddingBottom: 10,
    },
    llmIconsContent: {
      paddingHorizontal: 15,
    },
    llmIcon: {
      alignItems: 'center',
      marginHorizontal: 8,
      width: 90,
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    llmIconText: {
      color: '#e2e8f0',
      fontSize: 12,
      textAlign: 'center',
    },
    
    // Welcome section
    welcomeSection: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingTop: height * 0.02,
    },
    welcomeContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      marginBottom: 20,
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
    },
    
    // Input container at top (when no messages)
    inputContainerTop: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 20,
    },
    
    // Input container at bottom (when messages exist)
    inputContainerBottom: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: '#1a1d29',
      borderTopWidth: 1,
      borderTopColor: '#2d3748',
    },
    
    inputWrapper: {
      flexDirection: "row",
      alignItems: "flex-end",
      backgroundColor: "#374151",
      borderRadius: 25,
      paddingHorizontal: 15,
      minHeight: 50,
    },
    addButton: {
      padding: 8,
      marginRight: 6,
    },
    textInput: { 
      flex: 1, 
      color: "#fff", 
      fontSize: 16, 
      maxHeight: 100,
      paddingVertical: 8,
    },
    micButton: { 
      padding: 8, 
      marginRight: 6,
    },
    micActive: { 
      backgroundColor: "rgba(251,191,36,0.2)", 
      borderRadius: 20,
    },
    sendButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    sendButtonActive: { 
      backgroundColor: "#a78bfa",
    },
    sendButtonInactive: { 
      backgroundColor: "transparent",
    },
    
    // Prompt suggestions
    promptSuggestionsContainer: {
      paddingHorizontal: 20,
    },
    promptTitle: {
      color: '#94a3b8',
      fontSize: 16,
      marginBottom: 12,
      textAlign: 'center',
    },
    promptGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 10,
    },
    promptSuggestion: {
      backgroundColor: 'rgba(167, 139, 250, 0.1)',
      borderColor: 'rgba(167, 139, 250, 0.3)',
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
    },
    promptText: {
      color: '#a78bfa',
      fontSize: 14,
    },
    
    // Messages
    messagesList: { 
      flex: 1, 
      padding: 12,
    },
    messageContainer: { 
      marginVertical: 8,
    },
    userMessage: { 
      alignItems: "flex-end" 
    },
    assistantMessage: { 
      alignItems: "flex-start" 
    },
    messageBubble: { 
      maxWidth: width * 0.8, 
      borderRadius: 18, 
      padding: 12,
      marginBottom: 8,
    },
    userBubble: { 
      backgroundColor: "#a78bfa" 
    },
    assistantBubble: { 
      backgroundColor: "#374151" ,
    },
    
    // File previews
    filesPreviewBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      maxHeight: 80,
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: '#1a1d29',
    },
    filePreview: {
      width: 80,
      marginRight: 8,
      backgroundColor: "#2d3748",
      borderRadius: 8,
      alignItems: "center",
      padding: 6,
    },
    fileThumbnail: { 
      width: 40, 
      height: 40, 
      borderRadius: 6, 
      marginBottom: 4 
    },
    fileName: { 
      color: "#fff", 
      fontSize: 12, 
      textAlign: "center" 
    },
    
    // Loading
    loadingContainer: { 
      position: 'absolute',
      bottom: 30,
      left: 0,
      right: 0,
      alignItems: "center", 
      padding: 10,
    },
    loadingText: { 
      color: "#fff", 
      fontSize: 16 
    },
    dots: { 
      color: "#a78bfa", 
      fontSize: 18, 
      fontWeight: "bold" 
    },
    
    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#2d3748',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 30,
    },
    modalTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    featureOption: {
      width: '48%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(167, 139, 250, 0.1)',
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,
    },
    featureOptionText: {
      color: '#e2e8f0',
      marginLeft: 10,
      fontSize: 16,
    },
    modalCloseButton: {
      backgroundColor: '#a78bfa',
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
    },
    modalCloseText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

  export default Genoxy;