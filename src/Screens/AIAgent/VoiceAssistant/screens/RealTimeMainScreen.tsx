// src/realtime/RealtimeMainScreen.native.tsx
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import RealtimeHeader from "../components/RealTimeHeader";
import WelcomeScreen from "./RealTimeWelcomeScreen";
import StartScreen from "./RealTimeStartScreen";
import ConversationScreen from "./RealTimeConversation";
import { LanguageConfig, ChatMessage } from "../util/types";
import { voiceSessionServiceNative } from "./VoiceSessionService";

type Screen = "welcome" | "start" | "conversation";

export default function RealtimeMainScreen() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageConfig | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [selectedInstructions, setSelectedInstructions] = useState("");

  useEffect(() => {
    if (currentScreen === "welcome") {
      setSelectedLanguage(null);
      setIsSessionActive(false);
      setChat([]);
      setIsAssistantSpeaking(false);
      setSelectedInstructions("");
    }
  }, [currentScreen]);

  const handleLanguageSelect = (lang: LanguageConfig, instructions: string) => {
    setSelectedLanguage(lang);
    setSelectedInstructions(instructions);
    setCurrentScreen("start");
  };

  const handleStartSession = async () => {
    if (!selectedLanguage) return;
    setIsConnecting(true);
    try {
    //   await voiceSessionServiceNative.startSession(
    //     "askoxy-ai",
    //     selectedLanguage,
    //     selectedInstructions,
    //     (message: ChatMessage) => {
    //       // merge assistant partial updates into last assistant message if needed
    //       setChat((prev) => {
    //         if (message.role === "assistant") {
    //           const last = prev[prev.length - 1];
    //           if (last && last.role === "assistant") {
    //             return [...prev.slice(0, prev.length - 1), { ...message, text: last.text + message.text }];
    //           }
    //         }
    //         return [...prev, message];
    //       });
    //     },
    //     (speaking: boolean) => setIsAssistantSpeaking(speaking)
    //   );
    await voiceSessionServiceNative.startSession(
                    "askoxy-ai",
                    selectedLanguage,
                    selectedInstructions, // e.g., "Speak English only..." or empty
                    (message: ChatMessage) => {
                    // merge assistant partial updates into last assistant message if needed
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
                    (speaking: boolean) => setIsAssistantSpeaking(speaking)
                );  
    setIsSessionActive(true);
      setChat([]);
      setCurrentScreen("conversation");
    } catch (err) {
      console.error("Start session failed", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStopSession = () => {
    voiceSessionServiceNative.stopSession();
    setIsSessionActive(false);
    setIsAssistantSpeaking(false);
    setChat([]);
    setSelectedLanguage(null);
    setCurrentScreen("welcome");
  };

  const handleSendMessage = (msg: string) => {
    const userMsg: ChatMessage = { role: "user", text: msg, timestamp: new Date().toLocaleTimeString() };
    setChat((p) => [...p, userMsg]);
    voiceSessionServiceNative.sendMessage(msg);
  };

  return (
    <View style={{ flex: 1 }}>
      {currentScreen !== "welcome" && (
        <RealtimeHeader
          selectedLanguage={selectedLanguage}
          isSessionActive={isSessionActive}
          isConnecting={isConnecting}
          onBackClick={() => setCurrentScreen("welcome")}
          onStartSession={handleStartSession}
          onStopSession={handleStopSession}
          currentScreen={currentScreen}
        />
      )}

      {currentScreen === "welcome" && <WelcomeScreen onLanguageSelect={handleLanguageSelect} />}
      {currentScreen === "start" && selectedLanguage && <StartScreen selectedLanguage={selectedLanguage} isConnecting={isConnecting} onStartSession={handleStartSession} />}
      {currentScreen === "conversation" && selectedLanguage && (
        <ConversationScreen selectedLanguage={selectedLanguage} chat={chat} isAssistantSpeaking={isAssistantSpeaking} onSendMessage={handleSendMessage} />
      )}
    </View>
  );
}