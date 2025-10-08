// src/realtime/RealtimeConversationScreen.native.tsx
import React, { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { RTCView } from "react-native-webrtc"; // NEW: For video rendering
import { ChatMessage, LanguageConfig } from "../util/types";
import { voiceSessionServiceNative } from "./VoiceSessionService";

type Props = {
  selectedLanguage: LanguageConfig;
  chat: ChatMessage[];
  isAssistantSpeaking: boolean;
  onSendMessage: (message: string) => void;
};

export default function ConversationScreen({ selectedLanguage, chat, isAssistantSpeaking, onSendMessage }: Props) {
  const [input, setInput] = useState("");
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false); // Earpiece default
  const [isVideoEnabled, setIsVideoEnabled] = useState(false); // NEW: Video toggle
  const flatRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    flatRef.current?.scrollToEnd({ animated: true });
    if (isAssistantSpeaking && voiceSessionServiceNative) {
      voiceSessionServiceNative.setSpeakerMode(isSpeakerEnabled);
    }
  }, [chat, isAssistantSpeaking, isSpeakerEnabled]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleToggleSpeaker = () => {
    const newState = !isSpeakerEnabled;
    setIsSpeakerEnabled(newState);
    voiceSessionServiceNative.setSpeakerMode(newState);
  };

  // NEW: Toggle video
  const handleToggleVideo = async () => {
    const newState = !isVideoEnabled;
    setIsVideoEnabled(newState);
    await voiceSessionServiceNative.toggleVideo(newState);
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    const contentStyle = {
      ...styles.msgContent,
      backgroundColor: isUser ? "#06344a" : "#2a2b3a",
      alignSelf: isUser ? "flex-end" : "flex-start",
    };

    return (
      <View style={styles.msgRow}>
        <View style={contentStyle}>
          <Text style={styles.msgText}>{item.text}</Text>
          <Text style={styles.msgTime}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  const localStream = voiceSessionServiceNative.getLocalStream();
  const remoteStream = voiceSessionServiceNative.getRemoteStream();

  return (
    <View style={styles.container}>
      {/* NEW: Video Section */}
      <View style={styles.videoSection}>
        <View style={styles.remoteVideo}>
          {remoteStream && isVideoEnabled && <RTCView streamURL={remoteStream.toURL()} style={styles.videoView} />}
          {!remoteStream && isVideoEnabled && <Text style={styles.videoPlaceholder}>Assistant Video</Text>}
        </View>
        {isVideoEnabled && localStream && (
          <View style={styles.localVideo}>
            <RTCView streamURL={localStream.toURL()} style={styles.smallVideoView} />
          </View>
        )}
        <View style={styles.videoControls}>
          <TouchableOpacity onPress={handleToggleVideo} style={styles.videoToggleBtn}>
            <Text style={styles.toggleText}>{isVideoEnabled ? "Stop Video" : "Start Video"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleSpeaker} style={styles.speakerToggleBtn}>
            <Text style={styles.toggleText}>{isSpeakerEnabled ? "Speaker" : "Earpiece"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.topBox}>
        <Text style={styles.topTitle}>
          {selectedLanguage.nativeName + " Assistant"}
        </Text>
        <Text style={styles.topSub}>
          {isAssistantSpeaking ? "Assistant speaking..." : "Assistant idle"}
        </Text>
      </View>

      <FlatList
        ref={flatRef}
        data={chat}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ padding: 12 }}
        renderItem={renderItem}
      />

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor="#9fbacb"
          style={styles.input}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#00101a" },
  videoSection: { padding: 16, backgroundColor: "#000812", alignItems: "center" }, // NEW
  remoteVideo: { width: "100%", height: 200, backgroundColor: "#000", borderRadius: 8, marginBottom: 8 }, // NEW
  localVideo: { position: "absolute", top: 16, right: 16, width: 80, height: 120, borderRadius: 8, borderWidth: 2, borderColor: "#00bcd4" }, // NEW: Picture-in-picture
  videoView: { flex: 1, borderRadius: 8 }, // NEW
  smallVideoView: { flex: 1, borderRadius: 8 }, // NEW
  videoControls: { flexDirection: "row", gap: 12, marginTop: 8 }, // NEW
  videoToggleBtn: { backgroundColor: "#00bcd4", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }, // NEW
  speakerToggleBtn: { backgroundColor: "#ff9800", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }, // NEW
  videoPlaceholder: { color: "#9ad6f8", textAlign: "center", paddingTop: 80 }, // NEW
  topBox: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#073241" },
  topTitle: { color: "#7fe9ff", fontSize: 16, fontWeight: "800" },
  topSub: { color: "#9ad6f8", marginTop: 4 },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  toggleText: { color: "#fff", fontWeight: "600" },
  msgRow: { marginBottom: 12 },
  msgContent: { padding: 12, borderRadius: 14, maxWidth: "80%" },
  msgText: { color: "#e7f7ff" },
  msgTime: { color: "#a9cbd8", marginTop: 6, fontSize: 11 },
  inputRow: { flexDirection: "row", padding: 12, alignItems: "center", borderTopWidth: 1, borderTopColor: "#073241" },
  input: { flex: 1, backgroundColor: "#04212b", color: "#e7f7ff", paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 12 : 8, borderRadius: 24, marginRight: 8 },
  sendBtn: { backgroundColor: "#00bcd4", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24 },
});