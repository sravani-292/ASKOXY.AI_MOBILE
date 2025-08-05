import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import BASE_URL  from '../../../../Config';

const { width: screenWidth } = Dimensions.get('window');
const BANNER_WIDTH = screenWidth - 55;
const AUTO_SCROLL_INTERVAL = 4000;

// Helper to filter only one promo per weight
const getUniquePromosByWeight = (promos) => {
  const seen = new Set();
  return promos.filter((p) => {
    if (seen.has(p.weight)) return false;
    seen.add(p.weight);
    return true;
  });
};

const PromoBannerCarousel = () => {
  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const [promoList, setPromoList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const PROMO_API = `${ BASE_URL}product-service/getComboActiveInfo`;
  const fetchPromos = async () => {
    try {
      const res = await axios.get(PROMO_API);
      const unique = getUniquePromosByWeight(res.data || []);     
      setPromoList(unique);
    } catch (err) {
      console.error('Promo API Error:', err);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  useEffect(() => {
    if (promoList.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % promoList.length;
      scrollRef.current?.scrollTo({ x: nextIndex * BANNER_WIDTH, animated: true });
      setCurrentIndex(nextIndex);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [currentIndex, promoList.length]);

  const navigateToRice = (weight) => {
    navigation.navigate('Rice Products', { offerId: weight });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
            listener: (e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
              setCurrentIndex(index);
            },
          }
        )}
        scrollEventThrottle={16}
      >
        {promoList.map((item) => (
          <TouchableOpacity
            key={item.itemId}
            activeOpacity={0.9}
            onPress={() => navigateToRice(item.weight)}
          >
            <View style={[styles.promoCard, { width: BANNER_WIDTH }]}>
                <View style={{ width: 100, height: 100, marginRight: 12 }}>
              <Image source={{ uri: item.imageUrl }} style={styles.promoImage} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.promoTitle}>🎉 {item.itemName}</Text>
                <Text style={styles.promoDescription} numberOfLines={2}>
                  {item.itemDescription}
                </Text>

                <Animatable.View
                  animation="pulse"
                  iterationCount="infinite"
                  duration={1800}
                  easing="ease-in-out"
                >
                  <TouchableOpacity
                    onPress={() => navigateToRice(item.weight)}
                    style={styles.shopButton}
                  >
                    <Text style={styles.shopButtonText}>Shop Now</Text>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {promoList.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentIndex === i ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default PromoBannerCarousel;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  promoCard: {
    flexDirection: 'row',
    backgroundColor: '#fffbea',
    borderColor: '#ffd54f',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    marginRight: 15
  },
  promoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  promoTitle: {
    fontWeight: 'bold',
    color: '#8a4b00',
    marginBottom: 4,
    fontSize: 16,
  },
  promoDescription: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
  },
  shopButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    marginHorizontal: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activeDot: {
    backgroundColor: '#ff9800',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
});