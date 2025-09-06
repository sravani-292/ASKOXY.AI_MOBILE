// ✅ FUNCTIONAL SUMMARY
// This React Native screen displays a grid of YouTube videos (with thumbnail previews).
// On tap, the video opens and plays inside an embedded WebView. A loading spinner is shown
// until the video is ready. Reuses design patterns from ASKOXY mobile components (SafeAreaView, ScrollView).

// ✅ MOBILE (React Native / Expo)
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
      "Secure scholarships, cashback, and quick offer letters for studying abroad...",
  },
  {
    id: "rtOQ0Tu4mYE",
    title: "Grow Your Money with OxyLoans",
    description:
      "Earn up to 1.75% monthly and 24% yearly ROI with OxyLoans P2P Lending...",
  },
  // ... add rest from your list
].map((v) => ({
  ...v,
  thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
  url: `https://www.youtube.com/embed/${v.id}`,
}));

export default function AiVideosGeneratedMobile() {
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
