// ✅ FUNCTIONAL SUMMARY
// This screen shows a scrollable list of AI Masterclass videos on mobile.
// - Displays YouTube thumbnails with titles & descriptions
// - On tap, plays the video inside a WebView (autoplay enabled)
// - Shows a loading spinner until the video loads
// - Uses SafeAreaView + FlatList (for better performance on large video lists)

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
const CARD_WIDTH = width * 0.92;
const CARD_HEIGHT = 220;

const videos = [
  {
    id: "L4FEg97j0y4",
    title: "AI Prompt Engineer — No Coding",
    description:
      "Kickstart your GenAI journey with this free masterclass! Learn prompt engineering, explore AI’s future, and join 1M+ coders — no coding required. 🚀",
  },
  {
    id: "6KbsbrJWagk",
    title: "Generative AI Market — $1.5 Trillion",
    description:
      "Discover how the Generative AI market is projected to hit $1.5 Trillion by 2025 in this Free AI & GenAI Masterclass.",
  },
  // ... include the rest of your video objects here
].map((v) => ({
  ...v,
  thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
  url: `https://www.youtube.com/embed/${v.id}`,
}));

export default function OurAIVideosMobile() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
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
              style={{ flex: 1 }}
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
              <Ionicons name="play-circle" size={60} color="#6b21a8" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Info Section */}
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
      <Text style={styles.heading}>
        Unlock Your AI Potential with Our Masterclasses
      </Text>
      <Text style={styles.subheading}>
        Dive into expertly crafted AI masterclasses on cutting-edge technologies,
        tools, and strategies. Learn AI for tomorrow.
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
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 14,
  },
  heading: {
    fontSize: 20,
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
    paddingHorizontal: 12,
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
    height: CARD_HEIGHT,
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
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
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
