import React, { useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { WebView } from "react-native-webview";
import { Animated, Vibration } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const ChatInput = ({
  placeholder = "Type your message...",
  onSendMessage,
  onFileUpload,
  showAttachment = true,
  showMic = true,
  showSend = true,
  containerStyle,
  inputStyle,
  maxLength = 1000,
  multiline = true,
  enableVoice = false,
  customButtons = [],
  theme = "dark",
  navigation,
}) => {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState(null);
  const [speechResults, setSpeechResults] = useState([]);
  const [speechError, setSpeechError] = useState("");
  const [recording, setRecording] = useState(null);
  const [showWebView, setShowWebView] = useState(false);
  const webViewRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [listeningText, setListeningText] = useState('');

  const themes = {
    dark: {
      container: "#2d3748",
      input: "#4a5568",
      text: "#ffffff",
      placeholder: "#a0aec0",
      border: "#4a5568",
      buttonInactive: "#718096",
      buttonActive: "#3182ce",
      sendActive: "#3182ce",
      sendInactive: "#718096",
    },
    light: {
      container: "#f7fafc",
      input: "#ffffff",
      text: "#2d3748",
      placeholder: "#a0aec0",
      border: "#e2e8f0",
      buttonInactive: "#718096",
      buttonActive: "#3182ce",
      sendActive: "#3182ce",
      sendInactive: "#cbd5e0",
    },
  };

  const currentTheme = themes[theme];

  const startRecording = async () => {
    setIsRecording(true);
    setListeningText('🎤 Tap to speak...');
    setInputText('');
    
    // Haptic feedback
    Vibration.vibrate(50);
    
    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    setShowWebView(true);
    
    setTimeout(() => {
      if (webViewRef.current) {
        webViewRef.current.postMessage('start');
        setListeningText('🎤 Listening... Speak now!');
      }
    }, 1000);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setListeningText('');
    
    // Stop animation
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
    
    // Haptic feedback
    Vibration.vibrate(100);
    
    if (webViewRef.current) {
      webViewRef.current.postMessage('stop');
    }
    
    setInputText('✨ Processing...');
    
    setTimeout(() => {
      setShowWebView(false);
      if (inputText.includes('Processing')) {
        setInputText('');
        Alert.alert(
          '🎤 Voice Input',
          'Speech recognition completed! Type your message below.',
          [{ text: 'Got it!', style: 'default' }]
        );
      }
    }, 1500);
  };

  const handleSpeechResult = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'result') {
        setInputText(data.transcript);
        setIsRecording(false);
        setShowWebView(false);
      } else if (data.type === 'interim') {
        setInputText('🎤 ' + data.transcript);
      } else if (data.type === 'error') {
        Alert.alert('Speech Error', data.message || 'Speech recognition failed');
        setInputText('');
        setIsRecording(false);
        setShowWebView(false);
      }
    } catch (err) {
      console.error('Speech result error:', err);
    }
  };

  const handleFileUpload = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const { name, size, uri } = asset;

      let fileType = name.split(".").pop();
      const fileToUpload = {
        name,
        size,
        uri:
          Platform.OS === "android" && uri[0] === "/" ? `file://${uri}` : uri,
        type: `application/${fileType}`,
      };

      setFileData(fileToUpload);
      setFileName(name);
      setFiles((prev) => [
        ...prev,
        { id: Date.now().toString(), name, uri: fileToUpload.uri },
      ]);
    }
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (files.length === 1) {
      setFileData(null);
      setFileName("");
    }
  };

  const handleSend = () => {
    const finalQuery = inputText.trim();
    
    // Don't send if recording or if text is just the listening indicator
    if (isRecording || finalQuery.includes('🎤') || !finalQuery || finalQuery === '') {
      return;
    }

    if (onSendMessage) {
      onSendMessage(finalQuery, fileData);
    }

    if (navigation) {
      navigation.setParams({
        query: finalQuery,
        category: "General",
        assistantId: "64564t6464",
        categoryType: "ChatInput",
        fd: fileData,
      });
    }

    setInputText("");
    setFiles([]);
    setFileData(null);
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.container },
        containerStyle,
      ]}
    >
      {files.length > 0 && (
        <FlatList
          horizontal
          data={files}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.filePreview}>
              <Text style={styles.fileName} numberOfLines={1}>
                {item.name}
              </Text>
              <TouchableOpacity onPress={() => handleRemoveFile(item.id)}>
                <Ionicons name="close-circle" size={18} color="red" />
              </TouchableOpacity>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 8 }}
        />
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: currentTheme.input,
            borderColor: currentTheme.border,
          },
        ]}
      >
        {customButtons
          .filter((btn) => btn.position === "left")
          .map((button, index) => (
            <TouchableOpacity
              key={`left-${index}`}
              style={styles.actionButton}
              onPress={button.onPress}
            >
              <Ionicons
                name={button.icon}
                size={button.size || 20}
                color={currentTheme.buttonInactive}
              />
            </TouchableOpacity>
          ))}

        <TextInput
          style={[styles.textInput, { color: currentTheme.text }, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={currentTheme.placeholder}
          value={inputText}
          onChangeText={setInputText}
          multiline={multiline}
          maxLength={maxLength}
          textAlignVertical={multiline ? "top" : "center"}
        />

        {showMic && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              isRecording && { backgroundColor: "rgba(229, 62, 62, 0.1)" }
            ]}
            onPress={handleVoiceRecord}
          >
            <Ionicons
              name={isRecording ? "stop-circle" : "mic-outline"}
              size={24}
              color={isRecording ? "#e53e3e" : currentTheme.buttonInactive}
            />
          </TouchableOpacity>
        )}

        {showSend && (
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  (inputText.trim() && !inputText.includes('🎤') && !isRecording) || fileData
                    ? currentTheme.sendActive
                    : currentTheme.sendInactive,
              },
            ]}
            onPress={() => handleSend()}
            disabled={isRecording || inputText.includes('🎤') || (!inputText.trim() && !fileData)}
          >
            <Ionicons name="send" size={18} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Hidden WebView for Speech Recognition */}
      {showWebView && (
        <WebView
          ref={webViewRef}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Speech Recognition</title>
              </head>
              <body>
                <script>
                  let recognition;
                  let isListening = false;
                  
                  // Initialize speech recognition
                  if ('webkitSpeechRecognition' in window) {
                    recognition = new webkitSpeechRecognition();
                  } else if ('SpeechRecognition' in window) {
                    recognition = new SpeechRecognition();
                  }
                  
                  if (recognition) {
                    recognition.continuous = false;
                    recognition.interimResults = true;
                    recognition.lang = 'en-US';
                    recognition.maxAlternatives = 1;
                    
                    recognition.onstart = function() {
                      console.log('Speech recognition started');
                      isListening = true;
                    };
                    
                    recognition.onresult = function(event) {
                      let finalTranscript = '';
                      let interimTranscript = '';
                      
                      // Process only the current session results
                      for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        
                        if (event.results[i].isFinal) {
                          finalTranscript += transcript;
                        } else {
                          interimTranscript += transcript;
                        }
                      }
                      
                      // Send the result immediately
                      const currentText = finalTranscript || interimTranscript;
                      if (currentText.trim()) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: finalTranscript ? 'result' : 'interim',
                          transcript: currentText.trim()
                        }));
                      }
                    };
                    
                    recognition.onerror = function(event) {
                      console.log('Speech recognition error:', event.error);
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'error',
                        message: event.error
                      }));
                    };
                    
                    recognition.onend = function() {
                      console.log('Speech recognition ended');
                      isListening = false;
                    };
                  }
                  
                  // Listen for messages from React Native
                  window.addEventListener('message', function(event) {
                    if (event.data === 'start' && recognition) {
                      try {
                        isListening = true;
                        recognition.start();
                      } catch (e) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'error',
                          message: 'Failed to start recognition'
                        }));
                      }
                    } else if (event.data === 'stop' && recognition) {
                      isListening = false;
                      recognition.stop();
                    }
                  });
                  
                  // Handle document messages
                  document.addEventListener('message', function(event) {
                    window.dispatchEvent(new MessageEvent('message', { data: event.data }));
                  });
                </script>
              </body>
              </html>
            `
          }}
          onMessage={handleSpeechResult}
          style={{ height: 1, width: 1, opacity: 0, position: 'absolute' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          mixedContentMode="compatibility"
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: "#4a5568",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    minHeight: 50,
    maxHeight: 120,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    marginHorizontal: 4,
    padding: 6,
    borderRadius: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    paddingVertical: 4,
    paddingHorizontal: 8,
    minHeight: 20,
    lineHeight: 22,
  },
  sendButton: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  filePreview: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    marginRight: 8,
  },
  fileName: {
    fontSize: 13,
    marginRight: 6,
    maxWidth: screenWidth * 0.6,
  },
});


export default ChatInput;