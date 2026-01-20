import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Linking,
  PanResponder,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
const { width, height } = Dimensions.get('window');
import BASE_URL, { userStage } from "../../../../Config";

// Zoomable Image Component
const ZoomableImage = ({ source, style, onError }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        scale.setOffset(lastScale.current);
        translateX.setOffset(lastTranslateX.current);
        translateY.setOffset(lastTranslateY.current);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (evt.nativeEvent.touches.length === 2) {
          // Pinch to zoom
          const touch1 = evt.nativeEvent.touches[0];
          const touch2 = evt.nativeEvent.touches[1];
          const distance = Math.sqrt(
            Math.pow(touch2.pageX - touch1.pageX, 2) +
            Math.pow(touch2.pageY - touch1.pageY, 2)
          );
          
          if (!this.initialDistance) {
            this.initialDistance = distance;
          }
          
          const scaleValue = Math.max(0.5, Math.min(3, distance / this.initialDistance));
          scale.setValue(scaleValue);
        } else if (lastScale.current > 1) {
          // Pan when zoomed in
          translateX.setValue(gestureState.dx);
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: () => {
        // Save current values
        lastScale.current = scale._value;
        lastTranslateX.current = translateX._value;
        lastTranslateY.current = translateY._value;
        
        // Flatten offsets
        scale.flattenOffset();
        translateX.flattenOffset();
        translateY.flattenOffset();
        
        // Reset bounds if needed
        if (lastScale.current < 1) {
          resetImageTransform();
        }
        
        this.initialDistance = null;
      },
    })
  ).current;

  const resetImageTransform = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    lastScale.current = 1;
    lastTranslateX.current = 0;
    lastTranslateY.current = 0;
  };

  const handleDoubleTap = () => {
    if (lastScale.current > 1) {
      // Reset zoom
      resetImageTransform();
    } else {
      // Zoom in
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 2.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      lastScale.current = 2.5;
      lastTranslateX.current = 0;
      lastTranslateY.current = 0;
    }
  };

  let lastTap = null;
  const handleSingleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      handleDoubleTap();
      lastTap = null;
    } else {
      lastTap = now;
    }
  };

  return (
    <View style={style}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleSingleTap}
        style={{ flex: 1 }}
      >
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            flex: 1,
            transform: [
              { scale: scale },
              { translateX: translateX },
              { translateY: translateY },
            ],
          }}
        >
          <Image
            source={source}
            style={styles.zoomableImage}
            resizeMode="contain"
            onError={onError}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const GoldDetailModal = ({ visible, itemId, onClose }) => {
  const [images, setImages] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [websiteLoading, setWebsiteLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  useEffect(() => {
    if (visible && itemId) {
      fetchGoldDetails();
    }
  }, [visible, itemId]);

  const fetchGoldDetails = async () => {
    setLoading(true);
    setImageLoading(true);
    setWebsiteLoading(true);

    try {
      // Fetch images
      await fetchImages();
      // Fetch websites
      await fetchWebsites();
    } catch (error) {
      console.error('Error fetching gold details:', error);
      Alert.alert('Error', 'Failed to load gold details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}product-service/imagePriceBasedOnItemId?itemId=${itemId}`,
        {
          method: 'GET',
          headers: {
            'accept': '*/*',
          },
        }
      );

      if (!response) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setImages(data.list || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      Alert.alert('Error', 'Failed to load images.');
    } finally {
      setImageLoading(false);
    }
  };

  const fetchWebsites = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}product-service/goldUrsBasedOnItemId?itemId=${itemId}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        }
      );

      if (!response) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("response data", data);
      
      setWebsites((data.goLdUrls || "").split(","));

    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setWebsiteLoading(false);
    }
  };

  const handleWebsiteClick = async (url) => {
    console.log("urls ", url);
    
    try {
      if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
        Alert.alert('Invalid URL', 'The website URL is not valid.');
        return;
      }

      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL.');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Failed to open website.');
    }
  };

  const openFullScreenImage = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const closeFullScreenImage = () => {
    setFullScreenImage(null);
  };

  const renderImageCarousel = () => {
    if (imageLoading) {
      return (
        <View style={styles.imageLoadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading images...</Text>
        </View>
      );
    }

    if (images.length === 0) {
      return (
        <View style={styles.noImagesContainer}>
          <Ionicons name="image-outline" size={50} color="#ccc" />
          <Text style={styles.noImagesText}>No images available</Text>
        </View>
      );
    }

    return (
      <View style={styles.imageCarouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.floor(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
        >
          {images.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageContainer}
              onPress={() => openFullScreenImage(item.images)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: item.images }}
                style={styles.image}
                resizeMode="contain"
                onError={(error) => {
                  console.error('Image loading error:', error);
                }}
              />
              <View style={styles.zoomHint}>
                <Ionicons name="expand-outline" size={20} color="#fff" />
                <Text style={styles.zoomHintText}>Tap to zoom</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {images.length > 1 && (
          <View style={styles.imageIndicatorContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.imageIndicator,
                  currentImageIndex === index && styles.activeImageIndicator,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderWebsiteLinks = () => {
    if (websiteLoading) {
      return (
        <View style={styles.websiteLoadingContainer}>
          <ActivityIndicator size="small" color="#FFD700" />
          <Text style={styles.loadingText}>Loading websites...</Text>
        </View>
      );
    }

    if (websites.length === 0) {
      return (
        <View style={styles.noWebsitesContainer}>
          <Text style={styles.noWebsitesText}>No website links available</Text>
        </View>
      );
    }

    return (
      <View style={styles.websiteLinksContainer}>
        <Text style={styles.websiteTitle}>Related Websites:</Text>
        {websites.map((website, index) => (
          <TouchableOpacity
            key={index}
            style={styles.websiteLink}
            onPress={() => handleWebsiteClick(website)}
            activeOpacity={0.7}
          >
            <View style={styles.websiteLinkContent}>
              <Ionicons name="globe-outline" size={20} color="#FFD700" />
              <Text style={styles.websiteLinkText} numberOfLines={2}>
                {website}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderFullScreenModal = () => (
    <Modal
      visible={!!fullScreenImage}
      transparent={true}
      animationType="fade"
      onRequestClose={closeFullScreenImage}
    >
      <View style={styles.fullScreenContainer}>
        <TouchableOpacity
          style={styles.fullScreenCloseButton}
          onPress={closeFullScreenImage}
        >
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
        
        <ZoomableImage
          source={{ uri: fullScreenImage }}
          style={styles.fullScreenImageContainer}
          onError={(error) => {
            console.error('Full screen image loading error:', error);
          }}
        />
        
        <View style={styles.fullScreenInstructions}>
          <Text style={styles.instructionText}>
            • Double tap to zoom in/out
          </Text>
          <Text style={styles.instructionText}>
            • Pinch to zoom • Drag to pan when zoomed
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Gold Details</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Image Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Images</Text>
              {renderImageCarousel()}
            </View>

            {/* Website Links Section */}
            <View style={styles.section}>
              {renderWebsiteLinks()}
            </View>
          </ScrollView>

          {/* Loading Overlay */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingOverlayText}>Loading...</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Full Screen Image Modal */}
      {renderFullScreenModal()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  imageCarouselContainer: {
    height: 280,
  },
  imageContainer: {
    width: width - 32,
    height: 220,
    marginRight: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  zoomHint: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomHintText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  imageIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  imageIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  activeImageIndicator: {
    backgroundColor: '#FFD700',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  imageLoadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImagesText: {
    marginTop: 8,
    color: '#666',
  },
  websiteLinksContainer: {
    marginTop: 8,
  },
  websiteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  websiteLink: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  websiteLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  websiteLinkText: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
    color: '#333',
  },
  websiteLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noWebsitesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noWebsitesText: {
    color: '#666',
    fontStyle: 'italic',
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlayText: {
    marginTop: 8,
    color: '#666',
  },
  // Full Screen Image Styles
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  fullScreenImageContainer: {
    width: width,
    height: height * 0.8,
  },
  zoomableImage: {
    width: '100%',
    height: '100%',
  },
  fullScreenInstructions: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 8,
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 2,
  },
});

export default GoldDetailModal;