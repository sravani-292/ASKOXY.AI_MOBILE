// components/VideosSection.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const videos = [
  {
    id: 1,
    title: "AI x Banking: 52 Real Use Cases in 60 Bite-Sized Videos",
    description:
      "A free video series built on 25 years of banking software experience, exploring the intersection of AI, GenAI, and banking through 52 real-world use cases",
    thumbnail: "https://img.youtube.com/vi/Ja0xLoXB9wQ/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/Ja0xLoXB9wQ",
    youtubeUrl: "https://www.youtube.com/watch?v=Ja0xLoXB9wQ",
  },
  {
    id: 2,
    title: "Banking Use Cases with AI Prompt Design",
    description:
      "Explore real banking scenarios with user actions, system responses, activity diagrams, edge cases, and AI prompt design for automation.",
    thumbnail: "https://img.youtube.com/vi/razHRDyGvVs/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/razHRDyGvVs",
    youtubeUrl: "https://www.youtube.com/watch?v=razHRDyGvVs",
  },
  {
    id: 3,
    title: "Unlock Career Opportunities in Loan Management Software",
    description:
      "100,000+ banks rely on loan management software. Learn skills in coding, banking domain, and prompt engineering for high-paying IT jobs.",
    thumbnail: "https://img.youtube.com/vi/YcutEdAwZ5k/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/YcutEdAwZ5k",
    youtubeUrl: "https://www.youtube.com/watch?v=YcutEdAwZ5k",
  },
  {
    id: 4,
    title: "AI x Banking: 52 Real Use Cases in 60 Bite-Sized Videos",
    description:
      "A free video series built on 25 years of banking software experience, exploring the intersection of AI, GenAI, and banking through 52 real-world use cases",
    thumbnail: "https://img.youtube.com/vi/pB8Ny9Nlw3w/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/pB8Ny9Nlw3w",
    youtubeUrl: "https://www.youtube.com/watch?v=pB8Ny9Nlw3w",
  },
  {
    id: 5,
    title: "Banking Use Cases with AI Prompt Design",
    description:
      "Explore real banking scenarios with user actions, system responses, activity diagrams, edge cases, and AI prompt design for automation.",
    thumbnail: "https://img.youtube.com/vi/V7bgksFxk10/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/V7bgksFxk10",
    youtubeUrl: "https://www.youtube.com/watch?v=V7bgksFxk10",
  },
  {
    id: 6,
    title: "Unlock Career Opportunities in Loan Management Software",
    description:
      "100,000+ banks rely on loan management software. Learn skills in coding, banking domain, and prompt engineering for high-paying IT jobs.",
    thumbnail: "https://img.youtube.com/vi/Am2yg9Ala7w/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/Am2yg9Ala7w",
    youtubeUrl: "https://www.youtube.com/watch?v=Am2yg9Ala7w",
  },
];

const VideosSection = ({ navigation }) => {
  // Display only first 3 videos initially
  const displayVideos = videos.slice(0, 3);

  const handleVideoPress = async (youtubeUrl) => {
    try {
      const supported = await Linking.canOpenURL(youtubeUrl);
      if (supported) {
        await Linking.openURL(youtubeUrl);
      } else {
        console.log("Don't know how to open URI: " + youtubeUrl);
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>See Our Platform in Action</Text>
      <Text style={styles.sectionSubtitle}>
        Watch how ASKOXY's Global Loan Management System transforms banking operations with real AI-powered use cases.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.videoCardsContainer}
      >
        {displayVideos.map((video) => (
          <TouchableOpacity 
            key={video.id} 
            style={styles.videoCard}
            onPress={() => handleVideoPress(video.youtubeUrl)}
            activeOpacity={0.7}
          >
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: video.thumbnail }}
                style={styles.videoImage}
                resizeMode="cover"
              />
              <View style={styles.playOverlay}>
                <View style={styles.playButton}>
                  <Text style={styles.playIcon}>▶️</Text>
                </View>
              </View>
            </View>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {video.title}
            </Text>
            <Text style={styles.videoDescription} numberOfLines={3}>
              {video.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity 
        style={styles.viewAllButton} 
        onPress={() => navigation.navigate('Videos', { videos })}
      >
        <Text style={styles.viewAllText}>View All Videos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  horizontalScroll: {
    paddingVertical: 10,
  },
  videoCardsContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  videoCard: {
    width: width * 0.75,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    marginBottom: 10,
  },
  videoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playIcon: {
    fontSize: 24,
    color: '#1E40AF',
    marginLeft: 3, // Slight offset to center the play icon
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  videoDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  viewAllButton: {
    backgroundColor: '#6D28D9',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VideosSection;