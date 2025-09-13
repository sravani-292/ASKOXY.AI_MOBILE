
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.9;

const videos = [
  {
    id: "NJ2IVNFmF3g",
    title: "Study Abroad 2025",
    description:
      "Secure scholarships, cashback, and quick offer letters for studying abroad from India. Expert guidance for visas, loans, and top destinations",
  },
  {
    id: "rtOQ0Tu4mYE",
    title: "Grow Your Money with OxyLoans",
    description:
      "Earn up to 1.75% monthly and 24% yearly ROI with OxyLoans P2P Lending. Register instantly and start growing wealth.",
  },
  {
    id: "B0fB2l8N8o4",
    title:
      "Insurance LLM 🦁 | Smarter Health, Life & General Insurance with ASKOXY.AI 🚀",
    description:
      "Discover ASKOXY.AI Insurance LLM 🚀 Compare policies, get AI-powered recommendations, and make smarter Health, Life, and General Insurance decisions.",
  },

  {
    id: "9NK4jw3-Iqs",
    title: "Study & Work Abroad 2025",
    description:
      "Get scholarships, cashback, offer letters, and financial guidance for studying or working abroad with ASKOXY.AI’s expert support.",
  },
  {
    id: "yVT1s89cv-A",
    title: "ASKOXY.AI – Insurance LLM | AI-Powered Insurance Simplified",
    description:
      "Discover ASKOXY.AI Insurance LLM – compare health, life, general policies with AI suggestions, insurance marketplace, and futuristic AI concepts.",
  },
  {
    id: "m54i-Umtku4",
    title: "Top AI News & Insights",
    description:
      "Stay updated on AI trends, innovations, and breakthroughs worldwide. Discover tools, insights, and strategies with ASKOXY.AI",
  },
  {
    id: "weFSPylTdeI",
    title: "Study & Work Abroad 2025",
    description:
      "Get scholarships, cashback, fast offer letters, and complete financial guidance for studying or working abroad with ASKOXY.AI.",
  },
  {
    id: "TLIBduMpbRg",
    title: "CA & CS Professional Services",
    description:
      "ASKOXY.AI offers expert Chartered Accountancy and Company Secretary services to keep your business compliant, financially strong, and growth-ready",
  },
  {
    id: "dwA_t5wRL9k",
    title: "Free AI & GenAI Masterclass 2025",
    description:
      "Learn AI, Generative AI, Java, Microservices, and prompt engineering for future-ready tech skills. Join ASKOXY.AI’s free training.",
  },
  {
    id: "9Y0eeJr9FxM",
    title: "Buy 5kg ASKOXY Rice, Get 1kg FREE!",
    description:
      "Choose from HMT, Sonamasoori, Brown, JSR, or Low GI. Enjoy premium quality rice, free delivery, and easy online ordering",
  },
  {
    id: "Va-ZCN4yniQ",
    title: "Celebrate Festivities with AI",
    description:
      "Combine tradition and innovation this festive season. Simplify rituals, enjoy family time, and embrace joy, wisdom, and prosperity with AI.",
  },
  {
    id: "nrllljDzf0E",
    title: "5% Cashback & AI-Powered Services",
    description:
      "Explore ASKOXY.AI’s AI-Z Marketplace: cashback, financial guidance, career opportunities, and everyday services—all on one innovative platform",
  },
  {
    id: "nep-7FxUtFE",
    title: "ASKOXY.AI – Your AI-Z Marketplace",
    description:
      "One AI-powered platform for study abroad, loans, jobs, real estate, CA services, agriculture, and more. Trusted, smart, and seamless.",
  },
  {
    id: "0H6qkIlug24",
    title: "Lend & Earn with OxyLoans",
    description:
      "Earn up to 1.75% monthly and 24% yearly ROI with OxyLoans, an RBI-approved P2P NBFC. Register and start today.",
  },
  {
    id: "W2l3mpATxy4",
    title: "Study Abroad Smarter with AI",
    description:
      "Explore top universities, best-fit courses, scholarships, and visa guidance with ASKOXY.AI. No agents, just clear, AI-powered advice",
  },
  {
    id: "yfgqz7W9hGY",
    title: "Free AI & GenAI Masterclass",
    description:
      "Learn prompt engineering, real-world AI use cases, live tools, and career opportunities with ASKOXY.AI’s free Masterclass replay.",
  },
  {
    id: "ncf42m4YqLQ",
    title: "Free AI & Prompt Engineering Workshop",
    description:
      "Join ASKOXY.AI’s free workshop on prompt engineering, hands-on demos, industry use cases, and career growth insights. Register now!",
  },
  {
    id: "4O1Utr81LTE",
    title: "Amazon Prime Day vs Flipkart GOAT 2025",
    description:
      "See real-time smartphone deals with ASKOXY.AI’s Price GPT. Compare Amazon and Flipkart offers and shop smarter using AI insights.",
  },
  {
    id: "-aqH31YbSA0",
    title: "Happy Independence Day, India!",
    description:
      "Celebrate India’s freedom! Honor our heroes, unity, and spirit. Let’s carry forward their legacy with love, respect, and dedication.",
  },
  {
    id: "NMtJkmg10As",
    title: "Study Abroad Smarter with AI",
    description:
      "Use AI tools to explore top universities, personalized courses, and scholarships. Study abroad smarter, faster, and more efficiently with ASKOXY.AI.",
  },
  {
    id: "KBXF2TnGEWw",
    title: "Buy Rice Online in Hyderabad – Free Rice Offer",
    description:
      "Get 5KG rice + 2KG free or 2KG JSR rice + 1KG free. Free delivery and AI-powered savings on AskOxy.ai. Order now!",
  },
  {
    id: "G8nhYKQM7i0",
    title: "Study Abroad Made Easy with ASKOXY.AI",
    description:
      "Get cashback, student loans, admissions, and visa support for top destinations. Go global smarter, faster, and easier with ASKOXY.AI.",
  },
].map((v) => ({
  ...v,
  thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
  url: `https://www.youtube.com/embed/${v.id}`,
}));

export default function AiVideosGeneratedMobile() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const renderVideoCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.videoContainer}>
        {activeVideo === item.id ? (
          <>
            {loading && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
            <WebView
              source={{ uri: item.url + "?autoplay=1" }}
              style={styles.webview}
              onLoad={() => setLoading(false)}
            />
          </>
        ) : (
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              setActiveVideo(item.id);
              setLoading(true);
            }}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.playButton}>
              <Ionicons name="play-circle" size={50} color="#6b21a8" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Explore AI & Global Opportunities</Text>
      <Text style={styles.subheading}>
        Browse short, insightful AI videos covering study abroad,
        scholarships, investments, and more.
      </Text>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={renderVideoCard}
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4c1d95",
    textAlign: "center",
    marginTop: 16,
  },
  subheading: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
    width: CARD_WIDTH,
    alignSelf: "center",
    overflow: "hidden",
  },
  videoContainer: {
    height: 200,
    backgroundColor: "#000",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    top: "40%",
    left: "40%",
  },
  webview: {
    flex: 1,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 10,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5b21b6",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#4b5563",
  },
});
