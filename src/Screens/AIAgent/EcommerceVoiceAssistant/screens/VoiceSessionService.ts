// src/realtime/VoiceSessionService.native.ts
import { RTCPeerConnection, mediaDevices, MediaStream, MediaStreamTrack } from "react-native-webrtc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LanguageConfig, ChatMessage, LANGUAGES } from "../util/types";
import BASE_URL from "../../../../../Config";

// Import API functions
import {
  get_user_cart,
  get_user_profile,
  get_trending_products,
  get_active_offers,
  add_to_cart,
  remove_from_cart,
} from "../../../Chats/api/apiFunctions"; // Adjust path to apiFunctions.js

// Optional InCallManager for audio routing
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
  private cachedToken: string | null = null;
  private selectedLanguage: LanguageConfig | null = null;
  private isNoiseCancellationEnabled = false;
  private cachedProducts: any[] | null = null; // Cache all products for fast search
  private userId: string | null = null; // Store userId for API calls
  private customerId: string | null = null; // Store customerId if different from userId
  private isSelectingLanguage = true; // Flag to track language selection state

  // Method to set userId and customerId (call before starting session)
  setUserIds(userId: string, customerId: string = userId) {
    this.userId = userId;
    this.customerId = customerId;
  }

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

  async toggleNoiseCancellation(enable: boolean) {
    if (!this.pc || !this.isStarted) {
      console.warn("Session not started; cannot toggle noise cancellation");
      return;
    }
    this.isNoiseCancellationEnabled = enable;
    try {
      this.localStream?.getAudioTracks().forEach((track: MediaStreamTrack) => track.stop());
      const audioStream = await mediaDevices.getUserMedia({
        audio: {
          echoCancellation: enable,
          noiseSuppression: enable,
          autoGainControl: enable,
        },
        video: this.isVideoEnabled ? { facingMode: "user" } : false,
      });
      audioStream.getTracks().forEach((track: MediaStreamTrack) => {
        this.pc!.addTrack(track, audioStream);
      });
      this.localStream = audioStream;
      console.log(`Noise cancellation (ANC/ENC) ${enable ? "enabled" : "disabled"}`);
    } catch (err) {
      console.error("Failed to toggle noise cancellation:", err);
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

  private async getAllProducts(assistantId: string): Promise<any[]> {
    if (this.cachedProducts) return this.cachedProducts;
    try {
      const products = await get_trending_products();
      this.cachedProducts = products;
      await AsyncStorage.setItem("cachedProducts", JSON.stringify(products));
      console.log("Products cached for fast search");
      return products;
    } catch (err) {
      console.error("All products fetch error:", err);
      return [];
    }
  }

  private async getEphemeralToken(instructions: string, assistantId: string): Promise<string> {
    const auth = await this.getAuthToken();
    const url = `${BASE_URL}student-service/user/token?assistantId=${assistantId}&voicemode=alloy`;
    const instructionBody = { instructions };
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
    this.cachedToken = newToken;
    console.log("New token generated and cached");
    return newToken;
  }

  private getLanguagePrompt(langCode: string | null = null): string {
    const lang = langCode
      ? LANGUAGES.find((l) => l.code === langCode) || { code: "en", nativeName: "English", assistantName: "Smaira", speechLang: "en-US" }
      : { code: "en", nativeName: "English", assistantName: "Smaira", speechLang: "en-US" };
    
    switch (lang.code) {
      case "hi":
        return "आप कौन सी भाषा में बात करना चाहेंगे? अंग्रेजी, हिंदी, या तेलुगु?";
      case "te":
        return "మీరు ఏ భాషలో మాట్లాడాలనుకుంటున్నారు? ఆంగ్లం, హిందీ, లేదా తెలుగు?";
      default:
        return "Hello, I’m ASKOXY.AI. Which language would you like to speak in? English, Hindi, or Telugu?";
    }
  }

  private getLanguageSpecificInstructions(): string {
    const lang = this.selectedLanguage || { code: "en", nativeName: "English", assistantName: "Smaira", speechLang: "en-US" };
    const basePrompt = `You are an e-commerce voice assistant using OpenAI Realtime. Speak in ${lang.nativeName} only. Greet: 'Hello, I'm ${lang.assistantName}. How can I assist with products, orders, or support today?' 
    Use tools proactively: 
    - get_trending_products for product queries (describe top 3 matches, prices, stock; suggest alternatives in ${lang.nativeName}).
    - get_user_cart to check cart items.
    - add_to_cart/remove_from_cart for cart updates (confirm details in ${lang.nativeName}).
    - get_user_profile for user details.
    - get_active_offers for promotions.
    - submit_complaint for issues (empathize: 'I'm sorry—logged for team to fix in 24h' in ${lang.nativeName}).
    Be friendly, concise, proactive. Escalate complex issues. Only respond with natural language in ${lang.nativeName}, never raw JSON or instructions.`;

    switch (lang.code) {
      case "en":
        return basePrompt;
      case "hi":
        return `आप एक ई-कॉमर्स वॉयस असिस्टेंट हैं। केवल हिंदी में बोलें। अभिवादन: 'नमस्ते, मैं ${lang.assistantName} हूँ। उत्पादों, ऑर्डर या समर्थन में आज कैसे मदद कर सकता हूँ?' 
        टूल्स का उपयोग करें: 
        - get_trending_products पूछताछ के लिए (शीर्ष 3 मिलान, कीमतें, स्टॉक का वर्णन करें; हिंदी में विकल्प सुझाएं).
        - get_user_cart कार्ट आइटम जांचने के लिए.
        - add_to_cart/remove_from_cart कार्ट अपडेट के लिए (हिंदी में विवरण की पुष्टि करें).
        - get_user_profile उपयोगकर्ता विवरण के लिए.
        - get_active_offers प्रोमोशन्स के लिए.
        - submit_complaint मुद्दों के लिए (सहानुभूति: 'मुझे खेद है—टीम के लिए लॉग किया, 24 घंटों में ठीक करेंगे' हिंदी में). 
        स्नेहपूर्ण, संक्षिप्त, सक्रिय रहें। जटिल मुद्दों पर एस्केलेट करें। केवल हिंदी में प्राकृतिक भाषा में जवाब दें, कभी भी कच्चा JSON या निर्देश नहीं।`;
      case "te":
        return `మీరు ఈ-కామర్స్ వాయిస్ అసిస్టెంట్. తెలుగులో మాత్రమే మాట్లాడండి। పలుకురు: 'హలో, నేను ${lang.assistantName}. ఉత్పత్తులు, ఆర్డర్లు లేదా మద్దతులో ఈ రోజు ఎలా సహాయపడగలను?' 
        టూల్స్ ఉపయోగించండి: 
        - get_trending_products క్వెరీల కోసం (టాప్ 3 మ్యాచ్‌లు, ధరలు, స్టాక్ వివరించండి; తెలుగులో ప్రత్యామ్నాయాలు సూచించండి).
        - get_user_cart కార్ట్ ఐటెమ్‌లను తనిఖీ చేయడానికి.
        - add_to_cart/remove_from_cart కార్ట్ అప్‌డేట్‌ల కోసం (తెలుగులో వివరాలు నిర్ధారించండి).
        - get_user_profile యూజర్ వివరాల కోసం.
        - get_active_offers ప్రమోషన్‌ల కోసం.
        - submit_complaint సమస్యల కోసం (సహానుభూతి: 'క్షమించండి—టీమ్ కోసం లాగ్ చేశాను, 24 గంటల్లో సరిచేస్తాము' తెలుగులో). 
        స్నేహపూర్వకంగా, సంక్షిప్తంగా, చురుకుగా ఉండండి। సంక్లిష్ట సమస్యలపై ఎస్కలేట్ చేయండి। తెలుగులో మాత్రమే సహజ భాషలో స్పందించండి, ఎప్పుడూ జాసన్ లేదా సూచనలు చెప్పవద్దు।`;
      default:
        return basePrompt;
    }
  }

  private formatProductResponse(products: any[], langCode: string | null): string {
    const lang = langCode
      ? LANGUAGES.find((l) => l.code === langCode) || { code: "en", nativeName: "English" }
      : this.selectedLanguage || { code: "en", nativeName: "English" };
    
    if (!products.length) {
      return lang.code === "hi" ? "कोई उत्पाद नहीं मिला। कृपया कुछ और खोजें।" :
             lang.code === "te" ? "ఎటువంటి ఉత్పత్తులు కనుగొనబడలేదు. దయచేసి మరొకటి ప్రయత్నించండి." :
             "No products found. Please try something else.";
    }

    const productList = products.map(p => 
      lang.code === "hi" ? `${p.name} - ₹${p.price}, स्टॉक में: ${p.quantity}, ${p.category}` :
      lang.code === "te" ? `${p.name} - ₹${p.price}, స్టాక్‌లో: ${p.quantity}, ${p.category}` :
      `${p.name} - ₹${p.price}, in stock: ${p.quantity}, ${p.category}`
    ).join("; ");

    return lang.code === "hi" ? `मुझे ${products.length} उत्पाद मिले: ${productList}` :
           lang.code === "te" ? `నాకు ${products.length} ఉత్పత్తులు దొరికాయి: ${productList}` :
           `I found ${products.length} products: ${productList}`;
  }

  private formatCartResponse(cart: any, langCode: string | null): string {
    const lang = langCode
      ? LANGUAGES.find((l) => l.code === langCode) || { code: "en", nativeName: "English" }
      : this.selectedLanguage || { code: "en", nativeName: "English" };
    
    if (!cart?.items?.length) {
      return lang.code === "hi" ? "आपका कार्ट खाली है।" :
             lang.code === "te" ? "మీ కార్ట్ ఖాళీగా ఉంది." :
             "Your cart is empty.";
    }

    const itemList = cart.items.map((item: any) => 
      lang.code === "hi" ? `${item.name} - मात्रा: ${item.quantity}, कीमत: ₹${item.price}` :
      lang.code === "te" ? `${item.name} - పరిమాణం: ${item.quantity}, ధర: ₹${item.price}` :
      `${item.name} - Quantity: ${item.quantity}, Price: ₹${item.price}`
    ).join("; ");

    return lang.code === "hi" ? `आपके कार्ट में ${cart.items.length} आइटम हैं: ${itemList}` :
           lang.code === "te" ? `మీ కార్ట్‌లో ${cart.items.length} ఐటెమ్‌లు ఉన్నాయి: ${itemList}` :
           `Your cart has ${cart.items.length} items: ${itemList}`;
  }

  private formatProfileResponse(profile: any, langCode: string | null): string {
    const lang = langCode
      ? LANGUAGES.find((l) => l.code === langCode) || { code: "en", nativeName: "English" }
      : this.selectedLanguage || { code: "en", nativeName: "English" };
    
    if (!profile) {
      return lang.code === "hi" ? "प्रोफाइल जानकारी उपलब्ध नहीं है।" :
             lang.code === "te" ? "ప్రొఫైల్ సమాచారం అందుబాటులో లేదు." :
             "Profile information not available.";
    }

    return lang.code === "hi" ? `आपका प्रोफाइल: नाम - ${profile.name || "अज्ञात"}, ईमेल - ${profile.email || "अज्ञात"}` :
           lang.code === "te" ? `మీ ప్రొఫైల్: పేరు - ${profile.name || "తెలియదు"}, ఈమెయిల్ - ${profile.email || "తెలియదు"}` :
           `Your profile: Name - ${profile.name || "Unknown"}, Email - ${profile.email || "Unknown"}`;
  }

  private formatOffersResponse(offers: any[], langCode: string | null): string {
    const lang = langCode
      ? LANGUAGES.find((l) => l.code === langCode) || { code: "en", nativeName: "English" }
      : this.selectedLanguage || { code: "en", nativeName: "English" };
    
    if (!offers?.length) {
      return lang.code === "hi" ? "कोई सक्रिय ऑफर उपलब्ध नहीं है।" :
             lang.code === "te" ? "ఏ చురుకైన ఆఫర్‌లు అందుబాటులో లేవు." :
             "No active offers available.";
    }

    const offerList = offers.map((offer: any) => 
      lang.code === "hi" ? `${offer.title || "ऑफर"} - ${offer.description || "विवरण उपलब्ध नहीं"}` :
      lang.code === "te" ? `${offer.title || "ఆఫర్"} - ${offer.description || "వివరాలు అందుబాటులో లేవు"}` :
      `${offer.title || "Offer"} - ${offer.description || "Details not available"}`
    ).join("; ");

    return lang.code === "hi" ? `सक्रिय ऑफर: ${offerList}` :
           lang.code === "te" ? `చురుకైన ఆఫర్‌లు: ${offerList}` :
           `Active offers: ${offerList}`;
  }

  private formatCartActionResponse(result: any, action: "add" | "remove", langCode: string | null): string {
    const lang = langCode
      ? LANGUAGES.find((l) => l.code === langCode) || { code: "en", nativeName: "English" }
      : this.selectedLanguage || { code: "en", nativeName: "English" };
    
    if (result?.success) {
      return lang.code === "hi" ? 
        action === "add" ? "उत्पाद कार्ट में जोड़ा गया।" : "उत्पाद कार्ट से हटाया गया।" :
        lang.code === "te" ? 
        action === "add" ? "ఉత్పత్తి కార్ట్‌లో చేర్చబడింది." : "ఉత్పత్తి కార్ట్ నుండి తొలగించబడింది." :
        action === "add" ? "Product added to cart." : "Product removed from cart.";
    }
    return lang.code === "hi" ? 
      action === "add" ? "कार्ट में उत्पाद जोड़ने में विफल। कृपया पुनः प्रयास करें।" : "कार्ट से उत्पाद हटाने में विफल। कृपया पुनः प्रयास करें।" :
      lang.code === "te" ? 
      action === "add" ? "కార్ట్‌లో ఉత్పత్తి చేర్చడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి." : "కార్ట్ నుండి ఉత్పత్తి తొలగించడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి." :
      action === "add" ? "Failed to add product to cart. Please try again." : "Failed to remove product from cart. Please try again.";
  }

  private formatComplaintResponse(json: any, langCode: string | null): string {
    const lang = langCode
      ? LANGUAGES.find((l) => l.code === langCode) || { code: "en", nativeName: "English" }
      : this.selectedLanguage || { code: "en", nativeName: "English" };
    
    if (json?.success) {
      return lang.code === "hi" ? `शिकायत दर्ज की गई। टिकट ID: ${json.ticketId || "उपलब्ध नहीं"}` :
             lang.code === "te" ? `ఫిర్యాదు నమోదు చేయబడింది। టికెట్ ID: ${json.ticketId || "అందుబాటులో లేదు"}` :
             `Complaint logged. Ticket ID: ${json.ticketId || "Not available"}`;
    }
    return lang.code === "hi" ? "शिकायत दर्ज करने में विफल। इसे मानव सहायता के लिए भेज रहा हूँ।" :
           lang.code === "te" ? "ఫిర్యాదు నమోదు చేయడం విఫలమైంది। దీన్ని మానవ సహాయానికి పంపుతున్నాను。" :
           "Failed to log complaint. Escalating to human support.";
  }

  private getEcommerceTools(): any[] {
    return [
      {
        type: "function",
        function: {
          name: "get_user_cart",
          description: "Fetch the user's cart items using their customerId",
          parameters: {
            type: "object",
            properties: { customerId: { type: "string" } },
            required: ["customerId"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_user_profile",
          description: "Get profile details of the user using userId",
          parameters: {
            type: "object",
            properties: { userId: { type: "string" } },
            required: ["userId"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_trending_products",
          description: "Fetch trending product categories and items",
          parameters: {
            type: "object",
            properties: { query: { type: "string", description: "Optional search query" } },
            required: [],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_active_offers",
          description: "Fetch all currently active offers",
          parameters: {
            type: "object",
            properties: {},
            required: [],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "add_to_cart",
          description: "Add or increment quantity of a product in user's cart",
          parameters: {
            type: "object",
            properties: {
              customerId: { type: "string" },
              itemId: { type: "string" },
              quantity: { type: "number" },
            },
            required: ["customerId", "itemId", "quantity"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "remove_from_cart",
          description: "Remove item from user's cart",
          parameters: {
            type: "object",
            properties: {
              customerId: { type: "string" },
              itemId: { type: "string" },
            },
            required: ["customerId", "itemId"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "submit_complaint",
          description: "Log a complaint or query (e.g., refund, delay). Returns ticket ID.",
          parameters: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["complaint", "query"] },
              description: { type: "string" },
              orderId: { type: "string" },
              userId: { type: "string" },
            },
            required: ["type", "description"],
          },
        },
      },
    ];
  }

  async startSession(
    assistantId: string,
    onMessage: (message: ChatMessage) => void,
    onAssistantSpeaking: (speaking: boolean) => void,
    onLanguageSelected: (lang: LanguageConfig) => void
  ) {
    this.isSelectingLanguage = true;
    let ephemeralKey = this.cachedToken;
    if (!ephemeralKey) {
      try {
        // Use language prompt as initial instructions
        ephemeralKey = await this.getEphemeralToken(this.getLanguagePrompt(), assistantId);
      } catch (err) {
        console.error("Failed to generate token, session cannot start:", err);
        return;
      }
    } else {
      console.log("Reusing cached token for session");
    }

    // Pre-fetch products for fast search
    await this.getAllProducts(assistantId);

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

    const localStream = await mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: this.isNoiseCancellationEnabled,
        noiseSuppression: this.isNoiseCancellationEnabled,
        autoGainControl: this.isNoiseCancellationEnabled,
      }, 
      video: false 
    });
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

    dc.onopen = () => {
      console.log("Data channel open");
      // Send initial language prompt immediately
      this.dataChannel.send(JSON.stringify({
        type: "conversation.item.create",
        item: { type: "message", role: "assistant", content: [{ type: "input_text", text: this.getLanguagePrompt() }] },
      }));
      this.dataChannel.send(JSON.stringify({ type: "response.create" }));
    };

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
              const args = JSON.parse(tc.function?.arguments || "{}");
              let output = "";
              switch (fname) {
                case "get_user_cart":
                  if (!this.customerId) {
                    output = this.selectedLanguage?.code === "hi" ? "कृपया पहले ग्राहक ID प्रदान करें।" :
                             this.selectedLanguage?.code === "te" ? "దయచేసి ముందు కస్టమర్ ID అందించండి." :
                             "Please provide a customer ID first.";
                  } else {
                    const cart = await get_user_cart({ customerId: this.customerId });
                    output = this.formatCartResponse(cart, this.selectedLanguage?.code);
                  }
                  break;
                case "get_user_profile":
                  if (!this.userId) {
                    output = this.selectedLanguage?.code === "hi" ? "कृपया पहले उपयोगकर्ता ID प्रदान करें।" :
                             this.selectedLanguage?.code === "te" ? "దయచేసి ముందు యూజర్ ID అందించండి." :
                             "Please provide a user ID first.";
                  } else {
                    const profile = await get_user_profile({ userId: this.userId });
                    output = this.formatProfileResponse(profile, this.selectedLanguage?.code);
                  }
                  break;
                case "get_trending_products":
                  const products = await this.handleGetProductInfo(args.query || "", assistantId);
                  output = this.formatProductResponse(products.matches || [], this.selectedLanguage?.code);
                  break;
                case "get_active_offers":
                  const offers = await get_active_offers();
                  output = this.formatOffersResponse(offers, this.selectedLanguage?.code);
                  break;
                case "add_to_cart":
                  if (!this.customerId) {
                    output = this.selectedLanguage?.code === "hi" ? "कृपया पहले ग्राहक ID प्रदान करें।" :
                             this.selectedLanguage?.code === "te" ? "దయచేసి ముందు కస్టమర్ ID అందించండి." :
                             "Please provide a customer ID first.";
                  } else {
                    const result = await add_to_cart({ customerId: this.customerId, ...args });
                    output = this.formatCartActionResponse(result, "add", this.selectedLanguage?.code);
                  }
                  break;
                case "remove_from_cart":
                  if (!this.customerId) {
                    output = this.selectedLanguage?.code === "hi" ? "कृपया पहले ग्राहक ID प्रदान करें।" :
                             this.selectedLanguage?.code === "te" ? "దయచేసి ముందు కస్టమర్ ID అందించండి." :
                             "Please provide a customer ID first.";
                  } else {
                    const result = await remove_from_cart({ customerId: this.customerId, ...args });
                    output = this.formatCartActionResponse(result, "remove", this.selectedLanguage?.code);
                  }
                  break;
                case "submit_complaint":
                  if (!this.userId) {
                    output = this.selectedLanguage?.code === "hi" ? "कृपया पहले उपयोगकर्ता ID प्रदान करें।" :
                             this.selectedLanguage?.code === "te" ? "దయచేసి ముందు యూజర్ ID అందించండి." :
                             "Please provide a user ID first.";
                  } else {
                    const complaint = await this.handleSubmitComplaint(tc.id, { userId: this.userId, ...args }, assistantId);
                    output = this.formatComplaintResponse(complaint, this.selectedLanguage?.code);
                  }
                  break;
                default:
                  output = this.selectedLanguage?.code === "hi" ? "अज्ञात अनुरोध। कृपया फिर से प्रयास करें।" :
                           this.selectedLanguage?.code === "te" ? "తెలియని అభ్యర్థన. దయచేసి మళ్లీ ప్రయత్నించండి。" :
                           "Unknown request. Please try again.";
              }
              const submitJson = {
                type: "response.submit_tool_outputs",
                response_id: event.response.id,
                tool_outputs: [{ tool_call_id: tc.id, output }],
              };
              this.dataChannel?.send(JSON.stringify(submitJson));
              // Send formatted response to user
              this.dataChannel?.send(JSON.stringify({
                type: "conversation.item.create",
                item: { type: "message", role: "assistant", content: [{ type: "input_text", text: output }] },
              }));
              this.dataChannel?.send(JSON.stringify({ type: "response.create" }));
            }
          }
        } else if (event.type === "conversation.item.create" && this.isSelectingLanguage) {
          const userInput = event.item?.content?.[0]?.text?.toLowerCase();
          let selectedLang: LanguageConfig | null = null;
          if (userInput?.includes("english")) {
            selectedLang = LANGUAGES.find((l) => l.code === "en") || null;
          } else if (userInput?.includes("hindi")) {
            selectedLang = LANGUAGES.find((l) => l.code === "hi") || null;
          } else if (userInput?.includes("telugu")) {
            selectedLang = LANGUAGES.find((l) => l.code === "te") || null;
          }
          if (selectedLang) {
            this.selectedLanguage = selectedLang;
            this.isSelectingLanguage = false;
            onLanguageSelected(selectedLang);
            // Update session with language-specific instructions
            const sessionConfig = {
              type: "session.update",
              session: {
                instructions: this.getLanguageSpecificInstructions(),
                voice: "alloy",
                input_audio_transcription: { model: "whisper-1" },
                tools: this.getEcommerceTools(),
                tool_choice: "auto",
              },
            };
            this.dataChannel.send(JSON.stringify(sessionConfig));
            // Trigger greeting in selected language
            const greeting = selectedLang.code === "hi" ? `नमस्ते, मैं ${selectedLang.assistantName} हूँ। उत्पादों, ऑर्डर या समर्थन में आज कैसे मदद कर सकता हूँ?` :
                            selectedLang.code === "te" ? `హలో, నేను ${selectedLang.assistantName}. ఉత్పత్తులు, ఆర్డర్లు లేదా మద్దతులో ఈ రోజు ఎలా సహాయపడగలను?` :
                            `Hello, I'm ${selectedLang.assistantName}. How can I assist with products, orders, or support today?`;
            this.dataChannel.send(JSON.stringify({
              type: "conversation.item.create",
              item: { type: "message", role: "assistant", content: [{ type: "input_text", text: greeting }] },
            }));
            this.dataChannel.send(JSON.stringify({ type: "response.create" }));
          } else {
            // Repeat language prompt if invalid
            const repeatPrompt = this.getLanguagePrompt(this.selectedLanguage?.code);
            this.dataChannel.send(JSON.stringify({
              type: "conversation.item.create",
              item: { type: "message", role: "assistant", content: [{ type: "input_text", text: repeatPrompt }] },
            }));
            this.dataChannel.send(JSON.stringify({ type: "response.create" }));
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

    let sdpResp = await fetch(realtimeUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${ephemeralKey}`, "Content-Type": "application/sdp" },
      body: offer.sdp,
    });
    if (!sdpResp.ok) {
      const txt = await sdpResp.text();
      console.warn("SDP negotiation failed, regenerating token:", txt);
      ephemeralKey = await this.getEphemeralToken(this.getLanguagePrompt(), assistantId);
      sdpResp = await fetch(realtimeUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${ephemeralKey}`, "Content-Type": "application/sdp" },
        body: offer.sdp,
      });
      if (!sdpResp.ok) {
        throw new Error("Failed to renegotiate SDP with new token: " + await sdpResp.text());
      }
    }
    const sdpAnswer = await sdpResp.text();
    await pc.setRemoteDescription({ type: "answer", sdp: sdpAnswer });

    // Initial session config with language prompt
    const sessionConfig = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        instructions: this.getLanguagePrompt(),
        voice: "alloy",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: { model: "whisper-1" },
        tools: this.getEcommerceTools(),
        tool_choice: "auto",
        temperature: 0.8,
      },
    };
    this.dataChannel.send(JSON.stringify(sessionConfig));

    // Fallback to English after 10s if no language selected
    setTimeout(() => {
      if (this.isSelectingLanguage) {
        this.isSelectingLanguage = false;
        this.selectedLanguage = LANGUAGES.find((l) => l.code === "en") || null;
        onLanguageSelected(this.selectedLanguage!);
        const sessionConfig = {
          type: "session.update",
          session: { instructions: this.getLanguageSpecificInstructions(), voice: "alloy" },
        };
        this.dataChannel.send(JSON.stringify(sessionConfig));
        this.dataChannel.send(JSON.stringify({
          type: "conversation.item.create",
          item: { type: "message", role: "assistant", content: [{ type: "input_text", text: "No language selected, using English. How can I assist you today?" }] },
        }));
        this.dataChannel.send(JSON.stringify({ type: "response.create" }));
      }
    }, 10000);

    this.isStarted = true;
    console.log("Realtime session started with voice language selection.");
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

  private async handleGetProductInfo(query: string, assistantId: string): Promise<any> {
    try {
      const products = await this.getAllProducts(assistantId);
      if (!products.length) return { matches: [], summary: "No products available." };
      const matches = products
        .filter((p: any) => 
          p.name.toLowerCase().includes(query.toLowerCase()) || 
          p.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3);
      return { matches, summary: matches.length ? `Found ${matches.length} matches.` : "No matches found." };
    } catch (err) {
      console.error("Product info error:", err);
      return { matches: [], summary: "Error searching products." };
    }
  }

  private async handleSubmitComplaint(toolCallId: string, args: any, assistantId: string): Promise<any> {
    try {
      const auth = await this.getAuthToken();
      const res = await fetch(`${BASE_URL}/support/complaints?assistantId=${assistantId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify(args),
      });
      if (!res.ok) throw new Error("Complaint submission failed");
      const json = await res.json();
      return { success: true, ...json };
    } catch (err) {
      console.error("Complaint error:", err);
      return { error: "Couldn't log that—escalating to human support." };
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
    this.cachedProducts = null;
    AsyncStorage.removeItem("cachedProducts");
    this.pc = null;
    this.localStream = null;
    this.remoteStream = null;
    this.dataChannel = null;
    this.isStarted = false;
    this.isVideoEnabled = false;
    this.isNoiseCancellationEnabled = false;
    this.isSelectingLanguage = false;
    this.userId = null;
    this.customerId = null;
  }
}

export const voiceSessionServiceNative = new VoiceSessionServiceNative();
export default voiceSessionServiceNative;