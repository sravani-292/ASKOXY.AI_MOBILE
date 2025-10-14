// components/VideoItem.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Linking, FlatList, Alert } from 'react-native';

const { width } = Dimensions.get('window');

const GlmsVideos = ({ route }) => {
  console.log({route},route?.params?.videos)
  const item = route?.params?.videos;
  const extractVideoId = (embedUrl) => {
    if (!embedUrl) return '';
    // Extract video ID from embed URL like: https://www.youtube.com/embed/Ja0xLoXB9wQ
    const match = embedUrl.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : '';
  };

  const handlePlayVideo = async (data) => {
    console.log({data})
    try {
      let youtubeUrl;
      
      // Check if youtubeUrl exists, otherwise create from embedUrl
      if (data?.youtubeUrl) {
        youtubeUrl = data?.youtubeUrl;
      } else if (item.embedUrl) {
        const videoId = extractVideoId(data?.embedUrl);
        youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      } else {
        console.log('No valid YouTube URL found');
        Alert.alert('Error', 'No valid YouTube URL found');
        return;
      }

      console.log('Opening YouTube URL:', youtubeUrl); // Debug log
      
      const supported = await Linking.canOpenURL(youtubeUrl);
      if (supported) {
        await Linking.openURL(youtubeUrl);
      } else {
        console.log("Cannot open YouTube URL: " + youtubeUrl);
      }
    } catch (error) {
      console.error('Error opening YouTube video:', error);
    }
  };


   const renderItem = ({ item }) => (
       <View style={styles.videoItem}>
      <TouchableOpacity 
        style={styles.thumbnailContainer} 
        onPress={()=>handlePlayVideo(item)}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: item.thumbnail }} 
          style={styles.videoThumbnail}
          resizeMode="cover"
        />
        <View style={styles.playOverlay}>
          <View style={styles.playIconContainer}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.videoDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        <TouchableOpacity 
          style={styles.playButton} 
        onPress={()=>handlePlayVideo(item)}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.playButtonIcon}>▶</Text>
            <Text style={styles.playButtonText}>Watch on YouTube</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
    );

     function footer() {
      return (
        <View style={{ alignSelf: "center" }}>
          <Text></Text>
        </View>
      );
    }

  return (
  <View style={{width:width*0.95,alignSelf:'center',marginTop:20}}>
    <FlatList
             data={item}
             renderItem={renderItem}
             numColumns={2}
             ListFooterComponent={footer}
             ListFooterComponentStyle={styles.footerStyle}
           />
  </View>
  );
};

const styles = StyleSheet.create({
  videoItem: {
    width: width * 0.45,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#F3F4F6',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  playIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  playIcon: {
    fontSize: 24,
    color: '#DC2626',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  contentContainer: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 24,
  },
  videoDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
    fontWeight: 'bold',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
      footerStyle: {
      marginTop: 50,
    },
});

export default GlmsVideos;