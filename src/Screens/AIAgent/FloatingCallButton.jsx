import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Phone, PhoneOff, Mic, Check, Copy } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  RTCPeerConnection,
  mediaDevices,
  RTCView,
  MediaStream,
} from "react-native-webrtc";
import { Audio } from "expo-av";
import * as Clipboard from "expo-clipboard";
import BASE_URL from "../../../Config";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

const FloatingCallButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callerInfo, setCallerInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Voice call states
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [remoteStreamUrl, setRemoteStreamUrl] = useState(null);

  const peerConnectionRef = useRef(null);
  const micStreamRef = useRef(null);
  const dataChannelRef = useRef(null);
  const bufferRef = useRef("");
  const userId = useSelector((state) => state.counter.userId);
  const accessToken = useSelector((state) => state.counter.accessToken);

  const fetchCallerInfo = async () => {
    setLoading(true);
    try {
      const idToUse = userId || "default-user-id";
      console.log("userId", userId);
      const response = await fetch(
        `${BASE_URL}user-service/callerNumberToUserMapping/${idToUse}`
      );
      const data = await response.json();
      setCallerInfo(data);
    } catch (error) {
      console.error("Error fetching caller info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallClick = () => {
    setIsModalOpen(true);
    fetchCallerInfo();
  };

  const copyToClipboard = async (text, type) => {
    await Clipboard.setStringAsync(text);
    if (type === "phone") {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  // Voice calling functions
  const getEphemeralToken = useCallback(
    async (instructions, assistantId, voicemode) => {
      try {
        const res = await fetch(
          `${BASE_URL}student-service/user/token?assistantId=${assistantId || ""}&voicemode=${voicemode}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ instructions }),
          }
        );
        const data = await res.json();
        return data.client_secret.value;
      } catch (error) {
        console.error("Failed to get ephemeral token:", error);
        throw error;
      }
    },
    []
  );

  const handleRaisequery = useCallback(async (_callId, query) => {
    if (!userId) {
      return { error: "User not logged in" };
    }
    const profileRaw = await AsyncStorage.getItem("profileData");
    if (!profileRaw) {
      setErrorMessage("Please complete your profile");
      return { error: "Profile data missing" };
    }

    let profile;
    try {
      profile = JSON.parse(profileRaw);
    } catch {
      setErrorMessage("Please complete your profile");
      return { error: "Invalid profile data" };
    }

    const firstName = profile.userFirstName?.trim() || "";
    const lastName = profile.userLastName?.trim() || "";
    const email = profile.customerEmail?.trim() || null;

    const userName = `${firstName} ${lastName}`.trim();

    const whatsappNumber = await AsyncStorage.getItem("whatsappNumber");
    const storedMobile = await AsyncStorage.getItem("mobileNumber");
    const mobileNumber = whatsappNumber?.trim() || storedMobile?.trim() || null;

    if (!userName || !email) {
      setErrorMessage("Please complete your profile");
      return { error: "Incomplete profile" };
    }

    const payload = {
      email,
      mobileNumber,
      queryStatus: "PENDING",
      projectType: "ASKOXY",
      askOxyOfers: "FREESAMPLE",
      adminDocumentId: "",
      comments: "",
      id: "",
      resolvedBy: "",
      resolvedOn: "",
      status: "",
      userDocumentId: "",
      query,
      userId,
    };

    try {
      const response = await fetch(`${BASE_URL}user-service/write/saveData`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      return data
        ? {
            success: true,
            message:
              "Your query has been raised successfully. Our support team will contact you soon.",
          }
        : { error: "Failed to raise query" };
    } catch (err) {
      console.error("Error raising query:", err);
      return {
        error:
          "Something went wrong while raising your query. Please try again.",
      };
    }
  }, []);

  const handleToolCall = useCallback(
    async (_callId, query, _assistantId) => {
      if (!userId) {
        return { error: "User not found" };
      }

      const res = await fetch(`${BASE_URL}ai-service/chat1?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ prompt: query }),
      });

      const text = await res.text();

      return {
        success: true,
        data: text,
      };
    },
    []
  );

  const injectRealtimeTools = (instructions) => {
    if (!dataChannelRef.current) return;

    const event = {
      type: "session.update",
      session: {
        instructions,
        modalities: ["text", "audio"],
        tool_choice: "auto",
        tools: [
          {
            type: "function",
            name: "get_detailed_info",
            description:
              "Fetch user-specific or platform-related information such as orders, offers, gold prices, products, services, AI agents, or account details.",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" },
              },
              required: ["query"],
            },
          },
          {
            type: "function",
            name: "raise_query",
            description: "Raises a support query.",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" },
              },
              required: ["query"],
            },
          },
        ],
      },
    };

    dataChannelRef.current.send(JSON.stringify(event));
    console.log("✅ Realtime tools registered");
  };

  const setupDataChannelHandlers = useCallback(
    (
      dc,
      onMessage,
      onAssistantSpeaking,
      assistantId,
      selectedInstructions
    ) => {
      const pendingArgs = {};

      dc.onmessage = async (e) => {
        try {
          const event = JSON.parse(e.data);

          if (event.status === "session_started") {
            console.log("✅ Realtime session started");
            return;
          }

          if (event.type === "response.output_text.delta" && event.delta) {
            bufferRef.current += event.delta;
            onAssistantSpeaking(true);
            onMessage({
              role: "assistant",
              text: bufferRef.current,
              timestamp: new Date().toLocaleTimeString(),
            });
            return;
          }

          if (event.type === "response.stop") {
            bufferRef.current = "";
            onAssistantSpeaking(false);
            return;
          }

          if (event.type === "response.function_call_arguments.delta") {
            if (!pendingArgs[event.call_id]) {
              pendingArgs[event.call_id] = "";
            }
            pendingArgs[event.call_id] += event.delta;
            return;
          }

          if (event.type === "response.function_call_arguments.done") {
            const callId = event.call_id;
            const args = JSON.parse(pendingArgs[callId] || "{}");

            console.log("🛠 Realtime tool called:", event.name);

            let result = {};

            if (event.name === "get_detailed_info") {
              result = await handleToolCall(callId, args.query, assistantId);
            }

            if (event.name === "raise_query") {
              result = await handleRaisequery(callId, args.query);
            }

            dc.send(
              JSON.stringify({
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: callId,
                  output: JSON.stringify(result),
                },
              })
            );

            dc.send(JSON.stringify({ type: "response.create" }));

            delete pendingArgs[callId];
            return;
          }
        } catch (err) {
          console.error("❌ Failed to parse Realtime event:", err, e.data);
        }
      };

      dc.onopen = () => {
        console.log("Voice channel opened ✅");
        injectRealtimeTools(selectedInstructions);
        setTimeout(() => {
          dc.send(JSON.stringify({ type: "response.create" }));
        }, 300);
      };
    },
    [handleToolCall, handleRaisequery]
  );

  const startVoiceSession = useCallback(
    async (
      assistantId,
      selectedInstructions,
      onMessage,
      onAssistantSpeaking,
      voicemode
    ) => {
      try {
        const EPHEMERAL_KEY = await getEphemeralToken(
          selectedInstructions,
          assistantId,
          voicemode
        );

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peerConnectionRef.current = pc;

        // In React Native we don't need audio element. 
        // We use RTCView to bind streams if needed, or it plays automatically.
        pc.ontrack = (event) => {
          if (event.streams && event.streams[0]) {
             setRemoteStreamUrl(event.streams[0].toURL());
          }
        };

        const constraints = {
          audio: true,
          video: false, // Voice only
        };

        const localStream = await mediaDevices.getUserMedia(constraints);
        micStreamRef.current = localStream;

        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        const dc = pc.createDataChannel("oai-events");
        dataChannelRef.current = dc;

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const model = "gpt-4o-realtime-preview-2024-12-17"; // Matches backend compatible model usually
        const sdpRes = await fetch(
          `https://api.openai.com/v1/realtime?model=${model}`,
          {
            method: "POST",
            body: offer.sdp,
            headers: {
              Authorization: `Bearer ${EPHEMERAL_KEY}`,
              "Content-Type": "application/sdp",
            },
          }
        );

        if (!sdpRes.ok) {
           throw new Error(`SDP Error: ${await sdpRes.text()}`);
        }

        const answerSdp = await sdpRes.text();
        const answer = {
          type: "answer",
          sdp: answerSdp,
        };
        await pc.setRemoteDescription(answer);

        setupDataChannelHandlers(
          dc,
          onMessage,
          onAssistantSpeaking,
          assistantId,
          selectedInstructions
        );
      } catch (error) {
        console.error("Failed to start voice session:", error);
        throw error;
      }
    },
    [getEphemeralToken, setupDataChannelHandlers]
  );

  const stopVoiceSession = useCallback(() => {
    dataChannelRef.current?.close();
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerConnectionRef.current?.close();
    dataChannelRef.current = null;
    micStreamRef.current = null;
    peerConnectionRef.current = null;
    bufferRef.current = "";
    setRemoteStreamUrl(null);
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Microphone permission denied:", error);
      return false;
    }
  };

  const handleStartVoiceCall = async () => {
    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) {
      setShowMicPermissionModal(true);
      return;
    }

    try {
      setIsVoiceCallActive(true);
      setVoiceTranscript("");
      setConversationMessages([]);
      setErrorMessage("");

      const onVoiceMessage = (msg) => {
        if (msg.role === "user") {
          setVoiceTranscript(msg.text);
        }
        setConversationMessages((prev) => [...prev, msg]);
      };

      await startVoiceSession(
        "",
        `You are the ASKOXY.AI Voice Assistant.
  
  SCOPE (MANDATORY):
  Answer ONLY questions related to ASKOXY.AI, its platform, features, services, marketplace offerings, AI agents, and capabilities.
  Do NOT respond to topics unrelated to ASKOXY.AI.
  Do NOT suggest that ASKOXY.AI runs, manages, or owns users’ businesses.
  
 LANGUAGE & VOICE HANDLING (STRICT):
  
• English is the default language. Start conversations in English whenever possible.
• If the user speaks in Telugu or Hindi, detect the language and respond in the same language.
• Once detected, lock the response language for that user input.
• Do NOT switch or mix languages in the same response.
• Change language only if the user clearly speaks a different language again.
• Respond ONLY in Telugu, English, or Hindi.
• If the user speaks in any other language, respond politely:
“Sorry, I can assist only in English, Hindi, or Telugu.”
• Ignore background noise, silence, and unclear sounds.
• Do NOT guess or respond to unclear or incomplete speech.
• If the user’s voice is not clear, politely ask them to repeat in the same detected language.
  
  VOICE STYLE:
  This is a voice-first assistant.
  • Keep responses short, clear, natural, polite, and conversational.
  • Avoid long explanations unless explicitly asked.
  • If a request is unclear or incomplete, ask simple follow-up questions before proceeding.
  
  ABOUT ASKOXY.AI :
  ASKOXY.AI is an AI-Z marketplace and AI enablement platform.
  
  ASKOXY.AI provides:
  • A marketplace to sell products such as rice, groceries, gold, and silver
  • Services including study-abroad support, job opportunities, and free AI learning resources
  • A platform where users can create AI agents for personal and business needs
  • Askoxy.ai offers BMV coins on every orders include gold,silver,products etc
  
  ASKOXY.AI does NOT run or manage users’ businesses.
  It enables individuals and businesses to build and use AI agents based on their own data, services, and requirements.
  
  The core foundation of ASKOXY.AI is the Bharath AI Store, which allows users to create, configure, and manage AI agents for automation, support, and information delivery. Explain this clearly when asked.
  
  TOOL CALLING RULES (CRITICAL — NO EXCEPTIONS):
  For ANY request related to:
  • user data
  • orders
  • offers
  • gold prices
  • products
  • services
  • AI agents
  • account information
  
  YOU MUST call the get_detailed_info function.
  • Do NOT answer from memory and don't Guess
  • Do NOT respond before the function call
  • Always wait for the function result before replying
  
  REAL-TIME DATA :
  Whenever a user asks any questions related to products or items (including item details, price, availability, offers, specifications), you must call the get_detailed_info function to fetch the information.
  
  SUPPORT & QUERY RAISING (SIMPLIFIED FLOW):
  If the user asks for help, support, complaint, or says they want to raise a query:
  • Ask the user to explain the issue clearly in their own words
  • Accept the explanation in Telugu, English, or Hindi
  • If needed, internally convert the issue to English
  • YOU MUST call the raise_query function using ONLY the detailed issue text
  • After the function completes, politely confirm that the query has been raised
  
  IMPORTANT BEHAVIOR RULES:
  • Never mention APIs, tools, functions, or technical processes
  • Maintain a calm, helpful, and reassuring tone at all times
  • Encourage users to ask questions or raise queries whenever needed
  `,
        onVoiceMessage,
        setIsAssistantSpeaking,
        "alloy"
      );
    } catch (error) {
      console.error("Failed to start voice call:", error);
      setErrorMessage(
        "Failed to start voice call. Please check your microphone permissions."
      );
      setIsVoiceCallActive(false);
    }
  };

  const handleEndVoiceCall = () => {
    stopVoiceSession();
    setIsVoiceCallActive(false);
    setIsAssistantSpeaking(false);
    setVoiceTranscript("");
    setConversationMessages([]);
  };

  const MicrophonePermissionModal = () => (
    <Modal
      transparent={true}
      visible={showMicPermissionModal}
      animationType="fade"
      onRequestClose={() => setShowMicPermissionModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.micIconContainer}>
            <Mic size={32} color="#dc2626" />
          </View>
          <Text style={styles.modalTitle}>Microphone Permission Required</Text>
          <Text style={styles.modalText}>
            To use voice features, please allow microphone access settings and try
            again.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={async () => {
                 try {
                  const { status } = await Audio.requestPermissionsAsync();
                  if (status === 'granted') {
                      setShowMicPermissionModal(false);
                      handleStartVoiceCall();
                  }
                 } catch(e) { console.error(e); }
              }}
              style={styles.permissionButton}
            >
              <Text style={styles.buttonText}>Give Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowMicPermissionModal(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <MicrophonePermissionModal />

      <TouchableOpacity
        onPress={handleCallClick}
        style={styles.floatingButton}
      >
        <View style={styles.floatingButtonInner}>
          <FontAwesome name="phone" size={24} color="white" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
            handleEndVoiceCall();
            setIsModalOpen(false);
        }}
      >
        <View style={styles.modalOverlay}>
            {/* Touchable outside to close */}
          <TouchableOpacity 
             style={StyleSheet.absoluteFill} 
             onPress={() => {
                handleEndVoiceCall();
                setIsModalOpen(false);
             }}
          />
          <View style={styles.popupContent}>
            {!isVoiceCallActive ? (
              <>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>
                    <Phone size={20} color="#16a34a" style={{marginRight: 8}} />
                    {" "}Contact Support
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleEndVoiceCall();
                      setIsModalOpen(false);
                    }}
                  >
                     <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#16a34a" />
                    <Text style={styles.loadingText}>Loading...</Text>
                  </View>
                ) : callerInfo ? (
                  <View>
                    {errorMessage ? (
                      <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                      </View>
                    ) : null}

                    <View style={styles.centerButtonContainer}>
                      <TouchableOpacity
                        onPress={handleStartVoiceCall}
                        style={styles.startCallButton}
                      >
                         <Phone size={20} color="white" style={{marginRight: 8}}/>
                        <Text style={styles.buttonText}>Start AI Call</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Text style={{fontSize: 18}}>👤</Text>
                        <Text style={styles.infoText}>
                          {callerInfo.callerName}
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={{fontSize: 18}}>📱</Text>
                        <Text style={styles.infoText}>
                          +91 {callerInfo.callerNumber}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          copyToClipboard(callerInfo.callerNumber, "phone")
                        }
                        style={[
                          styles.copyButton,
                          { backgroundColor: copiedPhone ? "#22c55e" : "#3b82f6" },
                        ]}
                      >
                       {copiedPhone ? <Check size={16} color="white"/> : <Copy size={16} color="white"/>}
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>
                      No caller information available
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View>
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>
                    <Phone size={20} color="#16a34a" style={{marginRight: 8}} />
                    {" "}Speak with AI
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      handleEndVoiceCall();
                      setIsModalOpen(false);
                    }}
                  >
                    <Text style={styles.closeButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.voiceContainer}>
                  <View style={styles.animationContainer}>
                    <View
                      style={[
                        styles.voiceBubble,
                        isAssistantSpeaking && styles.voiceBubbleActive,
                      ]}
                    >
                      <Phone size={48} color="white" />
                    </View>
                  </View>

                  <View>
                    <Text style={styles.statusTitle}>
                       Voice Call Active
                    </Text>
                    <Text style={styles.statusText}>
                      {isAssistantSpeaking
                        ? "🔊 Assistant is speaking..."
                        : "🎤 Listening..."}
                    </Text>
                  </View>

                  {voiceTranscript ? (
                    <View style={styles.transcriptBox}>
                      <Text style={styles.transcriptLabel}>You said:</Text>
                      <Text style={styles.transcriptText}>
                        {voiceTranscript}
                      </Text>
                    </View>
                  ) : null}

                  {conversationMessages.length > 0 && (
                     <View style={styles.messagesList}>
                         <ScrollView style={{maxHeight: 120}} nestedScrollEnabled>
                            {conversationMessages.slice(-3).map((msg, idx) => (
                                <View
                                key={idx}
                                style={[
                                    styles.messageBubble,
                                    msg.role === "user"
                                    ? styles.userBubble
                                    : styles.assistantBubble,
                                ]}
                                >
                                <Text style={styles.roleText}>
                                    {msg.role === "user" ? "You" : "Assistant"}
                                </Text>
                                <Text style={styles.messageText}>{msg.text}</Text>
                                </View>
                            ))}
                        </ScrollView>
                     </View>
                  )}

                  <TouchableOpacity
                    onPress={handleEndVoiceCall}
                    style={styles.endCallButton}
                  >
                    <PhoneOff size={20} color="white" style={{marginRight: 8}}/>
                    <Text style={styles.buttonText}>End Call</Text>
                  </TouchableOpacity>

                  <Text style={styles.hintText}>
                    💡 Speak naturally - the assistant will respond with voice
                  </Text>
                </View>

                {/* Hidden RTCView to enable audio playback */}
                {remoteStreamUrl && (
                    <View style={{ height: 0, width: 0, overflow: 'hidden' }}>
                        <RTCView
                        streamURL={remoteStreamUrl}
                        style={{ width: 0, height: 0 }}
                        />
                    </View>
                )}

                <View style={styles.divider} />
                 
                  {callerInfo && (
                    <View style={[styles.infoRow, { marginTop: 16 }]}>
                         <View style={styles.infoItem}>
                        <Text style={{fontSize: 18}}>👤</Text>
                        <Text style={styles.infoText}>
                          {callerInfo.callerName}
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={{fontSize: 18}}>📱</Text>
                        <Text style={styles.infoText}>
                          +91 {callerInfo.callerNumber}
                        </Text>
                      </View>
                    </View>   
                   )}

              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    top: "50%",
    right: 0,
    zIndex: 9999,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonInner: {
    backgroundColor: "#22c55e",
    borderRadius: 30,
    padding: 14,
    margin: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  popupContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: 24,
    color: "#9ca3af",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 12,
  },
  loadingText: {
    color: "#4b5563",
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
  },
  centerButtonContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  startCallButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#d1d5db",
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    flexWrap: 'wrap'
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: "#374151",
    fontWeight: "500",
    fontSize: 14,
  },
  copyButton: {
    padding: 6,
    borderRadius: 8,
  },
  voiceContainer: {
    alignItems: "center",
    gap: 16,
  },
  animationContainer: {
    marginBottom: 8,
  },
  voiceBubble: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7c3aed", // purple
  },
  voiceBubbleActive: {
    backgroundColor: "#34d399", // green
    // Simple pulse effect could be added with Reanimated if needed
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: 'center'
  },
  statusText: {
    color: "#4b5563",
    marginTop: 8,
    textAlign: 'center'
  },
  transcriptBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    width: "100%",
  },
  transcriptLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: 14,
    color: "#1f2937",
  },
  messagesList: {
    width: '100%',
    marginBottom: 8
  },
  messageBubble: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: "#f3e8ff", // purple-100
  },
  assistantBubble: {
    backgroundColor: "#dcfce7", // green-100
  },
  roleText: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#4b5563",
  },
  messageText: {
    fontSize: 12,
    color: "#1f2937",
  },
  endCallButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 9999,
    elevation: 3,
  },
  hintText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: width - 40,
    alignItems: "center",
  },
  micIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#fee2e2",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  modalText: {
    color: "#4b5563",
    marginBottom: 24,
    textAlign: "center",
  },
  modalButtons: {
    width: "100%",
    gap: 12,
  },
  permissionButton: {
    backgroundColor: "#7c3aed",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontWeight: "500",
  },
});

export default FloatingCallButton;
