// components/OfferCard.js
import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // or react-native-linear-gradient
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const OfferCard = ({ offer, onPress }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={()=> navigation.navigate('Rice Products', { offerId: offer.weight })}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        {/* Image Container with Gradient Overlay */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: offer.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.gradientOverlay}
          />
          
          {/* Discount Badge */}
          {offer.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{offer.discount}</Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {offer.itemName}
          </Text>
          
          <Text style={styles.desc} numberOfLines={2}>
            {offer.itemDescription}
          </Text>

        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginRight: 16,
    marginBottom: 8,
  },
  card: {
    width: width * 0.55, // Responsive width
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    transform: [{ translateY: 0 }], // For animation potential
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  favoriteIcon: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    lineHeight: 20,
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: '#7F8C8D',
    lineHeight: 18,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    fontSize: 12,
    color: '#95A5A6',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  star: {
    fontSize: 12,
    color: '#F39C12',
    marginRight: 4,
  },
  rating: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
  },
  actionBtn: {
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OfferCard;