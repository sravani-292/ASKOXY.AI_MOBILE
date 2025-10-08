import React, { useEffect, useState } from "react";
import { View } from "react-native";
import RealtimeHeader from "../components/RealTimeHeader";
import ConversationScreen from "./RealTimeConversation";
import { LanguageConfig, ChatMessage } from "../util/types";
import { voiceSessionServiceNative } from "./VoiceSessionService";

type Props = {
  onClose: () => void;
};

export default function RealtimeMainScreen({ onClose }: Props) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageConfig | null>(null);

  useEffect(() => {
    handleStartSession();
    return () => {
      voiceSessionServiceNative.stopSession();
    };
  }, []);

  const handleStartSession = async () => {
    setIsSessionActive(true);
    try {
      await voiceSessionServiceNative.startSession(
        "askoxy-ai",
        (message: ChatMessage) => {
          setChat((prev) => {
            if (message.role === "assistant") {
              const last = prev[prev.length - 1];
              if (last && last.role === "assistant") {
                return [...prev.slice(0, prev.length - 1), { ...message, text: last.text + message.text }];
              }
            }
            return [...prev, message];
          });
        },
        (speaking: boolean) => setIsAssistantSpeaking(speaking),
        (lang: LanguageConfig) => setSelectedLanguage(lang)
      );
    } catch (err) {
      console.error("Start session failed", err);
      setIsSessionActive(false);
    }
  };

  const handleStopSession = () => {
    voiceSessionServiceNative.stopSession();
    setIsSessionActive(false);
    setIsAssistantSpeaking(false);
    setChat([]);
    setSelectedLanguage(null);
    onClose();
  };

  const handleSendMessage = (msg: string) => {
    const userMsg: ChatMessage = { role: "user", text: msg, timestamp: new Date().toLocaleTimeString() };
    setChat((p) => [...p, userMsg]);
    voiceSessionServiceNative.sendMessage(msg);
  };

  const handleEscalate = () => {
    console.log("Escalating to human support...");
    // Implement: Navigate to support screen or trigger email/Slack
  };

  return (
    <View style={{ flex: 1 }}>
      <RealtimeHeader selectedLanguage={selectedLanguage} isSessionActive={isSessionActive} />
      <ConversationScreen
        selectedLanguage={selectedLanguage}
        chat={chat}
        isAssistantSpeaking={isAssistantSpeaking}
        onSendMessage={handleSendMessage}
        onEndCall={handleStopSession}
        onEscalate={handleEscalate}
      />
    </View>
  );
}