// import React, { useState } from "react";
// import { useNavigation } from "@react-navigation/native";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Dimensions,
//   FlatList,
//   Platform,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as DocumentPicker from "expo-document-picker";
// import axios from "axios";
// const { width: screenWidth } = Dimensions.get("window");
// // import { FormData } from "formdata-node";

// const ChatInput = ({
//   placeholder = "Type your message...",
//   onSendMessage,
//   onFileUpload,
//   showAttachment = true,
//   showMic = true,
//   showSend = true,
//   containerStyle,
//   inputStyle,
//   maxLength = 1000,
//   multiline = true,
//   enableVoice = false,
//   customButtons = [],
//   theme = "dark",
//   navigation, // ✅ receive navigation as a prop
// }) => {
//   // const navigation = useNavigation();
//   const [inputText, setInputText] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [files, setFiles] = useState([]);
//   const [fileName,setFileName] = useState("");
//  const [fileData,setFileData] = useState(null);
//   const themes = {
//     dark: {
//       container: "#2d3748",
//       input: "#4a5568",
//       text: "#ffffff",
//       placeholder: "#a0aec0",
//       border: "#4a5568",
//       buttonInactive: "#718096",
//       buttonActive: "#3182ce",
//       sendActive: "#3182ce",
//       sendInactive: "#718096",
//     },
//     light: {
//       container: "#f7fafc",
//       input: "#ffffff",
//       text: "#2d3748",
//       placeholder: "#a0aec0",
//       border: "#e2e8f0",
//       buttonInactive: "#718096",
//       buttonActive: "#3182ce",
//       sendActive: "#3182ce",
//       sendInactive: "#cbd5e0",
//     },
//   };

//   const currentTheme = themes[theme];

//   const fd = new FormData();

//   const handleFileUpload = async () => {
//     // console.log("Pan");
//     let result = await DocumentPicker.getDocumentAsync({
//       type: "*/*",
//       copyToCacheDirectory: true,
//       allowsEditing: false,
//       aspect: [4, 4],
//     })
//       .then((response) => {
//         console.log("response", response);
//         if (response.canceled == false) {
//           let { name, size, uri } = response.assets[0];
//           // console.log();
//           // ------------------------/

//           if (Platform.OS === "android" && uri[0] === "/") {
//             uri = `file://${uri}`;
//             console.log(uri);
//             uri = uri.replace(/%/g, "%25");
//             console.log(uri);
//           }
//           // ------------------------/
//           let nameParts = name.split(".");
//           let fileType = nameParts[nameParts.length - 1];
//           var fileToUpload = {
//             name: name,
//             size: size,
//             uri: uri,
//             type: "application/" + fileType,
//           };
//           setFileData(fileToUpload);
//           console.log(fileToUpload.name, "...............file");
//           setFileName(fileToUpload.name)
//           setFiles((prev) => [
//             ...prev,
//             {
//               id: Date.now().toString(),
//               name: fileToUpload.name,
//               uri: fileToUpload.uri,
//             },
//           ]);
//           fd.append("file", fileToUpload);
//           console.log("fd.....", fd);
//           // fd.append("prompt", "Tell about this file content");
//           // fd.append("fileType", "kyc");
//           console.log({ fileToUpload });
//         }
//         }).catch((err) => {
//           console.log("error", err);
//         });

//   };

//   const handleRemoveFile = (id) => {
//     setFiles((prev) => prev.filter((f) => f.id !== id));
//   };

//   const handleSend = (selectedQuery) => {
//     const finalQuery = inputText || selectedQuery;
//     if (!finalQuery.trim()) return;

//     navigation.navigate("GenOxyChatScreen", {
//       query: finalQuery,
//       category: "General",
//       assistantId: "64564t6464",
//       categoryType: "ChatInput",
//       fd: fileData,
//     });

//     setInputText("");
//   };
//   const handleVoiceRecord = () => {
//     if (enableVoice) {
//       setIsRecording(!isRecording);
//       Alert.alert(
//         "Voice",
//         isRecording ? "Stopped recording" : "Started recording"
//       );
//     } else {
//       Alert.alert("Voice", "Voice feature not enabled");
//     }
//   };

//   return (
//     <View
//       style={[
//         styles.container,
//         { backgroundColor: currentTheme.container },
//         containerStyle,
//       ]}
//     >
//       {/* File preview list */}
//       {files.length > 0 && (
//         <FlatList
//           horizontal
//           data={files}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => {
//             return (
//               <View style={styles.filePreview}>
//                 <Text style={styles.fileName}>{item.name}</Text>
//                 <TouchableOpacity onPress={() => handleRemoveFile(item.id)}>
//                   <Ionicons name="close-circle" size={18} color="red" />
//                 </TouchableOpacity>
//               </View>
//             );
//           }}
//         />
//       )}

//       <View
//         style={[
//           styles.inputWrapper,
//           {
//             backgroundColor: currentTheme.input,
//             borderColor: currentTheme.border,
//           },
//         ]}
//       >
//         {/* Attachment Button */}
//         {showAttachment && (
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={handleFileUpload}
//             activeOpacity={0.7}
//           >
//             <Ionicons
//               name="add"
//               size={20}
//               color={currentTheme.buttonInactive}
//             />
//           </TouchableOpacity>
//         )}

//         {/* Custom Buttons */}
//         {customButtons
//           .filter((btn) => btn.position === "left")
//           .map((button, index) => (
//             <TouchableOpacity
//               key={`left-${index}`}
//               style={styles.actionButton}
//               onPress={button.onPress}
//               activeOpacity={0.7}
//             >
//               <Ionicons
//                 name={button.icon}
//                 size={button.size || 20}
//                 color={currentTheme.buttonInactive}
//               />
//             </TouchableOpacity>
//           ))}

//         {/* Text Input */}
//         <TextInput
//           style={[styles.textInput, { color: currentTheme.text }, inputStyle]}
//           placeholder={placeholder}
//           placeholderTextColor={currentTheme.placeholder}
//           value={inputText}
//           onChangeText={setInputText}
//           multiline={multiline}
//           maxLength={maxLength}
//           textAlignVertical={multiline ? "top" : "center"}
//         />

//         {/* Mic Button */}
//         {showMic && (
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={handleVoiceRecord}
//             activeOpacity={0.7}
//           >
//             <Ionicons
//               name={isRecording ? "mic" : "mic-outline"}
//               size={20}
//               color={
//                 isRecording
//                   ? currentTheme.buttonActive
//                   : currentTheme.buttonInactive
//               }
//             />
//           </TouchableOpacity>
//         )}

//         {/* Send Button */}
//         {showSend && (
//           <TouchableOpacity
//             style={[
//               styles.sendButton,
//               {
//                 backgroundColor: inputText.trim()
//                   ? currentTheme.sendActive
//                   : currentTheme.sendInactive,
//               },
//             ]}
//             onPress={handleSend}
//             disabled={!inputText.trim()}
//             activeOpacity={0.8}
//           >
//             <Ionicons name="send" size={18} color="#ffffff" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 20,
//     paddingTop: 15,
//     paddingBottom: 25,
//     borderTopWidth: 1,
//     borderTopColor: "#4a5568",
//   },
//   inputWrapper: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     minHeight: 50,
//     maxHeight: 120,
//     borderWidth: 1,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   actionButton: {
//     marginHorizontal: 6,
//     padding: 6,
//     borderRadius: 8,
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: "400",
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     minHeight: 20,
//     lineHeight: 22,
//   },
//   sendButton: {
//     marginLeft: 8,
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   filePreview: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 6,
//     backgroundColor: "#e2e8f0",
//     borderRadius: 12,
//     marginBottom: 10,
//     marginRight: 8,
//   },
//   fileName: {
//     fontSize: 13,
//     marginRight: 6,
//     maxWidth: screenWidth * 0.6,
//   },
// });

// export default ChatInput;

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
import * as Speech from "expo-speech"; // Optional TTS feedback
import { Audio } from "expo-av";

const { width: screenWidth } = Dimensions.get("window");

// --- Voice Recording Constants ---
let recording = null;

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

  // Request audio recording permission
  const getPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Audio Recording Permission",
            message: "App needs permission to record audio",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const { status } = await Audio.requestPermissionsAsync();
        return status === "granted";
      }
    } catch (err) {
      console.warn("Permission error:", err);
      return false;
    }
  };

  // Start recording
  const startRecording = async () => {
    const hasPermission = await getPermission();
    if (!hasPermission) {
      Alert.alert(
        "Permission Required",
        "Permission to record audio is required!"
      );
      return;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          meters: false,
        },
      });

      recording = newRecording;
      setIsRecording(true);
      Alert.alert("Recording", "Voice recording started...");
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Recording Error", "Could not start recording.");
    }
  };

  // Stop recording and upload for transcription
  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recording = null;

      if (!uri) {
        Alert.alert("Error", "No audio recorded.");
        return;
      }

      Alert.alert("Processing", "Transcribing your voice...");

      // Upload audio to backend for transcription
      const transcript = await transcribeAudio(uri);
      if (transcript) {
        setInputText((prev) => prev + " " + transcript.trim());
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
      Alert.alert("Error", "Failed to process audio.");
    }
  };

  // Upload audio file and get transcript from backend
  const transcribeAudio = async (uri) => {
    const formData = new FormData();
    const fileName = "voice_note_" + Date.now() + ".m4a";
    const type = "audio/m4a";

    formData.append("file", {
      uri,
      name: fileName,
      type,
    });

    try {
      const response = await axios.post(
        "https://your-api.com/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );
      return response.data.text || "";
    } catch (error) {
      console.error(
        "Transcription error:",
        error.response?.data || error.message
      );
      Alert.alert("Transcription Failed", "Could not convert voice to text.");
      return "";
    }
  };

  // File Upload Handler
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
console.log("Handle Send Triggered", result);
    const result = onSendMessage(inputText.trim(), fileData);
    
    
    const finalQuery = inputText.trim();
    if (!finalQuery && !fileData) return;

    if (navigation) {
      navigation.navigate("GenOxyChatScreen", {
        query: finalQuery,
        category: "General",
        assistantId: "64564t6464",
        categoryType: "ChatInput",
        fd: fileData, // pass file data
      });
    } else {
      Alert.alert("Navigation Error", "Navigation prop is missing");
    }

    setInputText("");
    // Optionally clear files after send
    // setFiles([]); setFileData(null);
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
      {/* File Preview */}
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
        {/* Attachment Button */}
        {showAttachment && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFileUpload}
          >
            <Ionicons
              name="attach"
              size={20}
              color={currentTheme.buttonInactive}
            />
          </TouchableOpacity>
        )}

        {/* Custom Left Buttons */}
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

        {/* Text Input */}
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

        {/* Mic Button */}
        {showMic && enableVoice && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleVoiceRecord}
          >
            <Ionicons
              name={isRecording ? "stop-circle" : "mic-outline"}
              size={24}
              color={isRecording ? "#e53e3e" : currentTheme.buttonInactive}
            />
          </TouchableOpacity>
        )}

        {/* Send Button */}
        {showSend && (
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor:
                  inputText.trim() || fileData
                    ? currentTheme.sendActive
                    : currentTheme.sendInactive,
              },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() && !fileData}
          >
            <Ionicons name="send" size={18} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// --- Styles ---
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
