// src/realtime/voiceSessionService.native.ts
import { RTCPeerConnection, mediaDevices, MediaStream, MediaStreamTrack, RTCView } from "react-native-webrtc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LanguageConfig, ChatMessage } from "../util/types";
import BASE_URL from "../../../../../Config";

// Optional InCallManager
let InCallManager: any = null;
try {
  InCallManager = require("react-native-incall-manager").default;
} catch (err) {
  console.warn("react-native-incall-manager not found. Falling back to default audio routing.", err);
}

class VoiceSessionServiceNative {
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private dataChannel: any = null;
  private isStarted = false;
  private isVideoEnabled = false;
  private cachedToken: string | null = null; // NEW: Store the last valid token
  private selectedLanguage: LanguageConfig | null = null;

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  setSpeakerMode(isSpeaker: boolean) {
    if (InCallManager) {
      try {
        InCallManager.setForceSpeakerphoneOn(isSpeaker);
        console.log(`Audio mode set to ${isSpeaker ? "speaker" : "earpiece"}`);
      } catch (err) {
        console.error("Failed to set speaker mode:", err);
      }
    } else {
      console.warn("InCallManager not available; audio mode unchanged");
    }
  }

  async toggleVideo(enable: boolean) {
    if (!this.pc || !this.isStarted) {
      console.warn("Session not started; cannot toggle video");
      return;
    }

    try {
      if (enable && !this.isVideoEnabled) {
        const videoStream = await mediaDevices.getUserMedia({ audio: false, video: { facingMode: "user" } });
        videoStream.getTracks().forEach((track: MediaStreamTrack) => {
          this.pc!.addTrack(track, videoStream);
        });
        this.localStream = videoStream;
        this.isVideoEnabled = true;
        console.log("Video enabled and track added");
      } else if (!enable && this.isVideoEnabled) {
        this.localStream?.getVideoTracks().forEach((track: MediaStreamTrack) => {
          this.pc!.removeTrack(track);
          track.stop();
        });
        this.isVideoEnabled = false;
        console.log("Video disabled and tracks removed");
      }
      const offer = await this.pc.createOffer({ offerToReceiveVideo: enable });
      await this.pc.setLocalDescription(offer);
    } catch (err) {
      console.error("Failed to toggle video:", err);
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      return (await AsyncStorage.getItem("accessToken")) || null;
    } catch {
      return null;
    }
  }

  private async getEphemeralToken(instructions: string, assistantId: string): Promise<string> {
    const auth = await this.getAuthToken();
    const url = `${BASE_URL}student-service/user/token?assistantId=${assistantId}`;
    const instructionBody = {
      instructions: this.getLanguageSpecificInstructions(instructions)
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth ? `Bearer ${auth}` : "" },
      body: JSON.stringify(instructionBody),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Failed to mint ephemeral token: ${txt}`);
    }
    const body = await res.json();
    const newToken = body?.client_secret?.value || body?.ephemeral_key || body?.token;
    this.cachedToken = newToken; // Cache the new token
    console.log("New token generated and cached");
    return newToken;
  }

  private getLanguageSpecificInstructions(baseInstructions: string): string {
    switch (baseInstructions.split(" ")[0]) {
      case "Speak":
        return baseInstructions;
      default:
        return this.buildInstructionsFromLanguage();
    }
  }

  private buildInstructionsFromLanguage(): string {
    const lang = this.selectedLanguage || { code: "en", nativeName: "English", assistantName: "Smaira", speechLang: "en-US" };

    switch (lang.code) {
      case "en":
        return `You are a professional voice assistant conducting interviews at the Hyderabad Indexpo – JIA Industrial Technology Expo 2025. Speak in English only. Start speaking automatically when the participant joins. Greet them: 'Hi, I’m ${lang.assistantName}, welcome to the Hyderabad Indexpo – JIA Industrial Technology Expo 2025. Thank you for joining us. Please tell me your name and designation, and let me know when you are ready to start.' Once they confirm, ask questions naturally about their company, products, services, achievements, pricing, dealer and distributor network, challenges, and future plans. Encourage elaboration and follow up with context-aware questions. Use their name to create a personal connection and summarize at the end: 'Thank you for sharing your insights. It has been a pleasure speaking with you. We wish you all the best at this exhibition. Would you like to share contact information, promotional offers, or any other announcements?' Maintain a friendly, professional, and engaging tone throughout.`;
      case "hi":
        return `आप एक पेशेवर वॉयस असिस्टेंट हैं जो हैदराबाद इंडेक्सपो – JIA इंडस्ट्रियल टेक्नोलॉजी एक्सपो 2025 में साक्षात्कार आयोजित कर रहे हैं। केवल हिंदी में बोलें। जब प्रतिभागी जुड़ें, तो स्वचालित रूप से बोलना शुरू करें। अभिवादन करें: 'नमस्ते, मैं ${lang.assistantName} हूँ, हैदराबाद इंडेक्सपो – JIA इंडस्ट्रियल टेक्नोलॉजी एक्सपो 2025 में आपका स्वागत है। हमारे साथ जुड़ने के लिए धन्यवाद। कृपया अपना नाम और पद बताएं, और मुझे बताएं कि आप शुरू करने के लिए तैयार हैं।' एक बार जब वे पुष्टि करें, तो उनकी कंपनी, उत्पादों, सेवाओं, उपलब्धियों, कीमतों, डीलर और वितरक नेटवर्क, चुनौतियों, और भविष्य की योजनाओं के बारे में प्राकृतिक रूप से प्रश्न पूछें। विस्तार के लिए प्रोत्साहित करें और संदर्भ-जागरूक प्रश्नों का पालन करें। उनके नाम का उपयोग व्यक्तिगत संबंध बनाने के लिए करें और अंत में सारांश करें: 'अपने विचार साझा करने के लिए धन्यवाद। आपके साथ बातचीत करना सुखद रहा। हम आपको इस प्रदर्शनी में शुभकामनाएं देते हैं। क्या आप संपर्क जानकारी, प्रचार प्रस्ताव, या अन्य घोषणाएं साझा करना चाहेंगे?' पूरे समय दोस्ताना, पेशेवर और आकर्षक टोन बनाए रखें।`;
      case "te":
        return `నీవు హైదరాబాద్ ఇండెక్స్‌పో – JIA ఇండస్ట్రియల్ టెక్నాలజీ ఎక్స్‌పో 2025లో ఇంటర్వ్యూలు నిర్వహిస్తున్న ప్రొఫెషనల్ వాయిస్ అసిస్టెంట్‌ను. తెలుగులో మాత్రమే మాట్లాడండి. పాల్గొనే వ్యక్తి చేరినప్పుడు ఆటోమేటిక్‌గా మాట్లాడటం ప్రారంభించండి. వారిని స్వాగతించండి: 'హాయ్, నేను ${lang.assistantName}, హైదరాబాద్ ఇండెక్స్‌పో – JIA ఇండస్ట్రియల్ టెక్నాలజీ ఎక్స్‌పో 2025కి స్వాగతం. మా అవతరణకు ధన్యవాదాలు. దయచేసి మీ పేరు మరియు పదవిని చెప్పండి, మరియు నేను మొదలుపెట్టడానికి సిద్ధంగా ఉన్నానని నాకు తెలియజేయండి.' వారు నిర్ధారించిన తర్వాత, వారి కంపెనీ, ఉత్పత్తులు, సేవలు, సాధనలు, ధరలు, డీలర్ మరియు డిస్ట్రిబ్యూటర్ నెట్‌వర్క్, సవాళ్లు, మరియు భవిష్యత్ ప్రణాళికల గురించి సహజంగా ప్రశ్నలు అడగండి. వివరణ కోసం ప్రోత్సహించండి మరియు సందర్భ-జాగ్రత్త దర్పణాలతో ప్రశ్నలు అడగండి. వారి పేరును వినియోగించి వ్యక్తిగత సంబంధాన్ని సృష్టించండి మరియు చివరలో సంగ్రహించండి: 'మీ ధృర్వాదాలను పంచుకోవడానికి ధన్యవాదాలు. మీతో మాట్లాడటం సంతోషంగా ఉంది. ఈ ప్రదర్శనలో మీకు అన్ని శుభాలు కోరుకుంటున్నాము. మీరు సంప్రదింపు సమాచారం, ప్రచార అవకాశాలు, లేదా ఏదైనా ఇతర ప్రకటనలను పంచుకోవాలనుకుంటున్నారా?' మొత్తం సమయంలో స్నేహపూర్వక, ప్రొఫెషనల్ మరియు ఆకర్షణీయమైన టోన్‌ను కాపాడండి.`;
      default:
        return `You are a professional voice assistant conducting interviews at the Hyderabad Indexpo – JIA Industrial Technology Expo 2025. Speak in English only. Start speaking automatically when the participant joins. Greet them: 'Hi, I’m Smaira, welcome to the Hyderabad Indexpo – JIA Industrial Technology Expo 2025. Thank you for joining us. Please tell me your name and designation, and let me know when you are ready to start.' Once they confirm, ask questions naturally about their company, products, services, achievements, pricing, dealer and distributor network, challenges, and future plans. Encourage elaboration and follow up with context-aware questions. Use their name to create a personal connection and summarize at the end: 'Thank you for sharing your insights. It has been a pleasure speaking with you. We wish you all the best at this exhibition. Would you like to share contact information, promotional offers, or any other announcements?' Maintain a friendly, professional, and engaging tone throughout.`;
    }
  }

  async startSession(
    assistantId: string,
    selectedLanguage: LanguageConfig,
    selectedInstructions: string,
    onMessage: (m: ChatMessage) => void,
    onAssistantSpeaking: (speaking: boolean) => void
  ) {
    this.selectedLanguage = selectedLanguage;
    if (this.isStarted) return;

    // Use cached token if available, otherwise generate a new one
    let ephemeralKey = this.cachedToken;
    if (!ephemeralKey) {
      try {
        ephemeralKey = await this.getEphemeralToken(selectedInstructions, assistantId);
      } catch (err) {
        console.error("Failed to generate token, session cannot start:", err);
        return; // Halt if token generation fails
      }
    } else {
      console.log("Reusing cached token for session");
    }

    if (InCallManager) {
      try {
        InCallManager.start({ media: "video", auto: true });
        InCallManager.setForceSpeakerphoneOn(false);
        console.log("InCallManager started with earpiece mode");
      } catch (err) {
        console.error("InCallManager start failed", err);
      }
    } else {
      console.warn("No InCallManager; using default audio/video routing");
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    this.pc = pc;

    const localStream = await mediaDevices.getUserMedia({ audio: true, video: false });
    this.localStream = localStream;
    localStream.getTracks().forEach((t: MediaStreamTrack) => pc.addTrack(t, localStream));

    pc.ontrack = (event: any) => {
      this.remoteStream = event.streams[0];
      if (InCallManager) {
        try {
          InCallManager.setForceSpeakerphoneOn(false);
        } catch (err) {
          console.error("InCallManager setSpeaker failed on track", err);
        }
      }
      onAssistantSpeaking(true);
    };

    const dc = pc.createDataChannel("oai-events");
    this.dataChannel = dc;

    dc.onopen = () => console.log("Data channel open");
    dc.onmessage = async (ev: any) => {
      try {
        const event = JSON.parse(ev.data);
        if (event.type === "response.output_text.delta" && event.delta) {
          onMessage({ role: "assistant", text: event.delta, timestamp: new Date().toLocaleTimeString() });
          onAssistantSpeaking(true);
        } else if (event.type === "response.stop") {
          onAssistantSpeaking(false);
        } else if (event.type === "response.required_action") {
          const requiredAction = event.response?.required_action;
          if (requiredAction?.type === "submit_tool_outputs") {
            const toolCalls = requiredAction.submit_tool_outputs.tool_calls || [];
            for (const tc of toolCalls) {
              const fname = tc.function?.name;
              if (fname === "get_detailed_info") {
                const args = JSON.parse(tc.function.arguments || "{}");
                await this.handleToolCall(tc.id, args.query, assistantId);
              }
            }
          }
        }
      } catch (err) {
        console.warn("Failed to parse dc msg", err, ev?.data);
      }
    };

    const offer = await pc.createOffer({ offerToReceiveVideo: true });
    await pc.setLocalDescription(offer);

    const model = "gpt-4o-realtime-preview-2025-06-03";
    const realtimeUrl = `https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`;

    const sdpResp = await fetch(realtimeUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${ephemeralKey}`, "Content-Type": "application/sdp" },
      body: offer.sdp,
    });
    if (!sdpResp.ok) {
      const txt = await sdpResp.text();
      console.warn("SDP negotiation failed, regenerating token:", txt);
      // Regenerate token if SDP fails (token might be expired)
      ephemeralKey = await this.getEphemeralToken(selectedInstructions, assistantId);
      const newSdpResp = await fetch(realtimeUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${ephemeralKey}`, "Content-Type": "application/sdp" },
        body: offer.sdp,
      });
      if (!newSdpResp.ok) {
        throw new Error("Failed to renegotiate SDP with new token: " + await newSdpResp.text());
      }
    }
    const sdpAnswer = await sdpResp.text();
    await pc.setRemoteDescription({ type: "answer", sdp: sdpAnswer });

    this.isStarted = true;
    console.log("Realtime session started (native) with video support.");
  }

  sendMessage(text: string) {
    if (!this.dataChannel || this.dataChannel.readyState !== "open") {
      console.warn("Data channel not open yet");
      return;
    }
    const ev = {
      type: "conversation.item.create",
      item: { type: "message", role: "user", content: [{ type: "input_text", text }] },
    };
    this.dataChannel.send(JSON.stringify(ev));
    this.dataChannel.send(JSON.stringify({ type: "response.create" }));
  }

  private async handleToolCall(toolCallId: string, query: string, assistantId: string) {
    try {
      const res = await fetch(`${BASE_URL}/student-service/user/askquestion?assistantId=${assistantId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: query }] }),
      });
      const json = await res.json();
      const submitJson = {
        type: "response.submit_tool_outputs",
        response_id: toolCallId,
        tool_outputs: [{ tool_call_id: toolCallId, output: json.answer || json }],
      };
      this.dataChannel?.send(JSON.stringify(submitJson));
      console.log("Tool outputs submitted");
    } catch (err) {
      console.error("Tool call error", err);
    }
  }

  stopSession() {
    if (InCallManager) {
      try {
        InCallManager.stop();
      } catch (err) {
        console.error("InCallManager stop failed", err);
      }
    }
    if (this.isVideoEnabled) {
      this.localStream?.getVideoTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    try {
      this.dataChannel?.close?.();
    } catch {}
    try {
      this.localStream?.getTracks().forEach((t) => t.stop());
    } catch {}
    try {
      this.pc?.close?.();
    } catch {}
    this.pc = null;
    this.localStream = null;
    this.remoteStream = null;
    this.dataChannel = null;
    this.isStarted = false;
    this.isVideoEnabled = false;
  }
}

export const voiceSessionServiceNative = new VoiceSessionServiceNative();
export default voiceSessionServiceNative;