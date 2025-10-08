import React, { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { RTCView } from "react-native-webrtc";
import { ChatMessage, LanguageConfig } from "../util/types";
import { voiceSessionServiceNative } from "./VoiceSessionService";

type Props = {
  selectedLanguage: LanguageConfig | null;
  chat: ChatMessage[];
  isAssistantSpeaking: boolean;
  onSendMessage: (message: string) => void;
  onEndCall: () => void;
  onEscalate: () => void;
};

export default function ConversationScreen({ selectedLanguage, chat, isAssistantSpeaking, onSendMessage, onEndCall, onEscalate }: Props) {
  const [input, setInput] = useState("");
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isNoiseCancellationEnabled, setIsNoiseCancellationEnabled] = useState(false);
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

  const handleToggleNoiseCancellation = async () => {
    const newState = !isNoiseCancellationEnabled;
    setIsNoiseCancellationEnabled(newState);
    await voiceSessionServiceNative.toggleNoiseCancellation(newState);
  };

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
      <View style={styles.callStatus}>
        <Text style={styles.statusText}>
          {selectedLanguage
            ? isAssistantSpeaking
              ? "Assistant Speaking..."
              : "Connected"
            : "Say: English, Hindi, or Telugu"}
        </Text>
      </View>

      <View style={styles.videoSection}>
        {isVideoEnabled && remoteStream && (
          <RTCView streamURL={remoteStream.toURL()} style={styles.videoView} />
        )}
        {isVideoEnabled && localStream && (
          <View style={styles.localVideo}>
            <RTCView streamURL={localStream.toURL()} style={styles.smallVideoView} />
          </View>
        )}
        {!isVideoEnabled && (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.placeholderText}>Video Off</Text>
          </View>
        )}
      </View>

      <FlatList
        ref={flatRef}
        data={chat}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ padding: 12, flexGrow: 1 }}
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
          <Text style={styles.btnText}>Send</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controlButtons}>
        <TouchableOpacity style={[styles.controlBtn, isNoiseCancellationEnabled ? styles.btnActive : {}]} onPress={handleToggleNoiseCancellation}>
          <Text style={styles.btnText}>{isNoiseCancellationEnabled ? "ANC/ENC On" : "ANC/ENC Off"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, isSpeakerEnabled ? styles.btnActive : {}]} onPress={handleToggleSpeaker}>
          <Text style={styles.btnText}>{isSpeakerEnabled ? "Speaker" : "Earpiece"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, isVideoEnabled ? styles.btnActive : {}]} onPress={handleToggleVideo}>
          <Text style={styles.btnText}>{isVideoEnabled ? "Video On" : "Video Off"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, { backgroundColor: "#ff9800" }]} onPress={onEscalate}>
          <Text style={styles.btnText}>Human Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, styles.endCallBtn]} onPress={onEndCall}>
          <Text style={styles.btnText}>End Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#00101a", justifyContent: "space-between" },
  callStatus: { alignItems: "center", padding: 16, backgroundColor: "#041022" },
  statusText: { color: "#7de3ff", fontSize: 16, fontWeight: "600" },
  videoSection: { flex: 0.3, padding: 16, alignItems: "center", justifyContent: "center" },
  videoView: { width: "100%", height: "100%", borderRadius: 12, backgroundColor: "#000" },
  localVideo: { position: "absolute", top: 16, right: 16, width: 80, height: 120, borderRadius: 8, borderWidth: 2, borderColor: "#00bcd4" },
  smallVideoView: { flex: 1, borderRadius: 8 },
  videoPlaceholder: { width: "100%", height: "100%", backgroundColor: "#000", borderRadius: 12, justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#9ad6f8", fontSize: 16 },
  msgRow: { marginBottom: 12 },
  msgContent: { padding: 12, borderRadius: 14, maxWidth: "80%" },
  msgText: { color: "#e7f7ff" },
  msgTime: { color: "#a9cbd8", marginTop: 6, fontSize: 11 },
  inputRow: { flexDirection: "row", padding: 12, alignItems: "center", backgroundColor: "#041022" },
  input: { flex: 1, backgroundColor: "#04212b", color: "#e7f7ff", paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 12 : 8, borderRadius: 24, marginRight: 8 },
  sendBtn: { backgroundColor: "#00bcd4", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24 },
  controlButtons: { flexDirection: "row", justifyContent: "space-around", padding: 16, backgroundColor: "#041022", flexWrap: "wrap" },
  controlBtn: { backgroundColor: "#4caf50", padding: 12, borderRadius: 50, width: 80, height: 80, justifyContent: "center", alignItems: "center", margin: 8 },
  btnActive: { backgroundColor: "#2196f3" },
  endCallBtn: { backgroundColor: "#ff1744" },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});