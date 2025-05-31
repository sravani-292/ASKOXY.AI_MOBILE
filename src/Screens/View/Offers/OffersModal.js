 import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BASE_URL from '../../../../Config';

const OffersModel = ({ navigation }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = useSelector((state) => state.counter);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      
      // 1. Get all active offers first - this will be our main data source
      const activeOffersResponse = await axios.get(
        BASE_URL + 'cart-service/cart/activeOffers',
        {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const allOffers = activeOffersResponse.data || [];
      
      // 2. Get eligible offers with status
      const eligibleOffersResponse = await axios.get(
        BASE_URL + `cart-service/cart/userEligibleOffer/${userData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const eligibleOffersData = eligibleOffersResponse.data || [];

      console.log({eligibleOffersData});

      console.log({allOffers})
      
      
      // NEW CONDITION: If the eligible offers list is empty, it means the user is eligible for all available offers
      let finalOffers = [];
      
      if (eligibleOffersData.length === 0) {
        console.log("No eligibility restrictions found. User is eligible for all available offers!");
        // User is eligible for all available offers
        finalOffers = allOffers;
        
        // Add a property to track that these are unrestricted offers 
        finalOffers = finalOffers.map(offer => ({
          ...offer,
          isUnrestrictedOffer: true
        }));
      } else {
                // Extract the weights of offers user is eligible for
        const eligibleWeights = eligibleOffersData
          .filter(offer => offer.eligible === false)
          .map(offer => offer.weight); // use 'weight' from eligibleOffersData

        console.log(`User is eligible for ${eligibleWeights.length} specific offers`);

        // Match offers based on minQtyKg
        finalOffers = allOffers.filter(offer => 
          eligibleWeights.includes(offer.minQtyKg)
        );

        // Attach additional eligibility info (if needed)
        finalOffers = finalOffers.map(offer => {
          const match = eligibleOffersData.find(e => e.weight === offer.minQtyKg);
          return {
            ...offer,
            eligibilityReason: match?.reason || null,
            isUnrestrictedOffer: false,
          };
        });
      }

console.log("Final offers after eligibility check:", JSON.stringify(finalOffers, null, 2));
      
      // If no eligible offers found but we have the example container offers, use them
      // This is just for testing - you can remove this in production
      if (finalOffers.length === 0) {
        console.log("No offers found, using example offers for testing");
        const exampleContainerOffers = [
          {
            "id": "6380a5a3-e6fd-40ab-9633-cdafecc944cd",
            "offerName": "10 + STAINLESS STEEL RICE VAULT - 20KG+",
            "minQtyKg": 10,
            "minQty": 1,
            "freeItemName": "STAINLESS STEEL RICE VAULT - 20KG+",
            "freeItemId": "53d7f68c-f770-4a70-ad67-ee2726a1f8f3",
            "freeGivenItemId": "53d7f68c-f770-4a70-ad67-ee2726a1f8f3",
            "freeQty": 1,
            "freeOnce": true,
            "active": true,
            "offerCreatedAt": 1746873275374,
            "isUnrestrictedOffer": false
          },
          {
            "id": "24c974a8-6321-42ca-a58a-5228e42892ea",
            "offerName": "26 + Premium Steel Rice Storage - 35kg+",
            "minQtyKg": 26,
            "minQty": 1,
            "freeItemName": "Premium Steel Rice Storage - 35kg+",
            "freeItemId": "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61",
            "freeGivenItemId": "9b5c671a-32bb-4d18-8b3c-4a7e4762cc61",
            "freeQty": 1,
            "freeOnce": true,
            "active": true,
            "offerCreatedAt": 1746861676629,
            "isUnrestrictedOffer": true
          }
        ];
        finalOffers = exampleContainerOffers;
      }
      
      // 3. Now check container status - if freeContainerStatus is NOT null, filter out container offers
      // Check if there are container or vault offers
      const containerOffers = finalOffers.filter(offer => 
        offer.offerName.toLowerCase().includes('rice vault') || 
        offer.offerName.toLowerCase().includes('rice storage') ||
        offer.offerName.toLowerCase().includes('steel')
      );
      
      if (containerOffers.length > 0) {
        const containerStatusResponse = await axios.get(
          BASE_URL + `cart-service/cart/ContainerInterested/${userData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${userData.accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        const containerStatus = containerStatusResponse.data;
        
        // If freeContainerStatus is NOT null, filter out container offers
        if (containerStatus && containerStatus.freeContainerStatus !== null) {
          finalOffers = finalOffers.filter(offer => 
            !(offer.offerName.toLowerCase().includes('rice vault') || 
              offer.offerName.toLowerCase().includes('rice storage') ||
              offer.offerName.toLowerCase().includes('steel'))
          );
        }
      }
      
      // Pre-process offers to add display-friendly details
      finalOffers = finalOffers.map(offer => {
        const processedOffer = { ...offer };
        console.log({finalOffers});
        
        // Identify offer type
        if (offer.offerName.toLowerCase().includes('rice vault') || 
            offer.offerName.toLowerCase().includes('rice storage') ||
            offer.offerName.toLowerCase().includes('steel')) {
          processedOffer.offerType = 'CONTAINER';
          
          // Parse the container offer format (e.g. "10 + STAINLESS STEEL RICE VAULT - 20KG+")
          const parts = offer.offerName.split('+');
          console.log("parts",parts);
          
          processedOffer.displayBuyAmount = parts[0].trim();
          processedOffer.displayFreeItem = parts[1].trim();
          
          // Container capacity
          if (processedOffer.displayFreeItem.toLowerCase().includes('20kg')) {
            processedOffer.containerCapacity = '20KG';
          } else if (processedOffer.displayFreeItem.toLowerCase().includes('35kg')) {
            processedOffer.containerCapacity = '35KG';
          } else {
            processedOffer.containerCapacity = 'LARGE';
          }
        } 
        // Regular rice buy-x-get-y offers
        else {
          processedOffer.offerType = 'RICE';

          // First, handle the "BUY X + GET Y" format           
          if (offer.offerName.includes('+')) {
            let buyPart = '';
            let getPart = '';
            
            // Split by "+" to separate buy and get parts
            const parts = offer.offerName.split('+');
            
            if (parts.length >= 2) {
              buyPart = parts[0].trim();
              getPart = parts[1].trim();
              
              // Extract buy quantity and item
              const buyMatch = buyPart.match(/buy\s+(\d+)\s+(.+)/i) || 
                               buyPart.match(/(\d+)\s*(.+)/i);


              
              if (buyMatch) {
                processedOffer.displayBuyQty = buyMatch[1];
                processedOffer.displayBuyItem = buyMatch[2].trim();
                console.log("Display Buy Item",processedOffer);
                
              }
              
              // Extract free quantity and item
              const getMatch = getPart.match(/get\s+(\d+)\s+(.+)/i);
              
              if (getMatch) {
                processedOffer.displayFreeQty = getMatch[1];
                processedOffer.displayFreeItem = getMatch[2].trim();
              } else {
                // Sometimes format is "GET X ItemName"
                const getMatch2 = getPart.match(/(.+)/i);
                if (getMatch2) {
                  // Check if it starts with a number
                  const numMatch = getMatch2[1].match(/^(\d+)\s+(.+)/i);
                  if (numMatch) {
                    processedOffer.displayFreeQty = numMatch[1];
                    processedOffer.displayFreeItem = numMatch[2].trim();
                  } else {
                    processedOffer.displayFreeQty = offer.freeQty;
                    processedOffer.displayFreeItem = getMatch2[1].trim();
                  }
                }
              }
            }
          } 
          // No + symbol in offer name, use fields directly
          else {
            processedOffer.displayBuyQty = offer.minQty;
            processedOffer.displayBuyItem = 'Rice';
            processedOffer.displayFreeQty = offer.freeQty;
            processedOffer.displayFreeItem = offer.freeItemName;
          }
          
          // Some special handling for kg values
          if (offer.minQtyKg && !processedOffer.displayBuyItem.toLowerCase().includes('kg')) {
            processedOffer.displayBuyKg = `${offer.minQtyKg}kg`;
          }
        }
        
        return processedOffer;
      });
      
      setOffers(finalOffers);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to load offers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getCustomDescription = (item) => {
    if (item.offerType === 'CONTAINER') {
      const buyAmount = item.displayBuyAmount;
      const containerSize = item.containerCapacity;
      
      // Check for container size
      if (containerSize === '20KG') {
        if (item.isUnrestrictedOffer) {
          return `🌟 EXCLUSIVELY FOR YOU! Buy ${buyAmount}KG of rice and get a FREE stainless steel storage container! Perfect for keeping your rice fresh and insect-free for months.`;
        } else {
          return `🎁 Buy ${buyAmount}KG of rice and get a FREE stainless steel storage container! Perfect for keeping your rice fresh and insect-free for months.`;
        }
      } 
      // Check for larger container
      else if (containerSize === '35KG') {
        if (item.isUnrestrictedOffer) {
          return `🌟 PREMIUM MEMBER OFFER! Buy ${buyAmount}KG of rice and get a FREE premium steel rice container worth ₹1299! Ideal for large families to store rice safely.`;
        } else {
          return `🎁 Buy ${buyAmount}KG of rice and get a FREE premium steel rice container worth ₹1599! Ideal for large families to store rice safely.`;
        }
      } 
      // Default container description
      else {
        if (item.isUnrestrictedOffer) {
          return `🌟 SPECIAL SELECTION FOR YOU! Buy ${buyAmount}KG of rice and get a FREE premium storage container worth ₹999! Keep your rice fresh and protected.`;
        } else {
          return `🎁 Buy ${buyAmount}KG of rice and get a FREE premium storage container worth ₹999! Keep your rice fresh and protected.`;
        }
      }
    } else {
      // Regular rice offers
      const buyQty = item.displayBuyQty || item.minQty;
      const buyItem = item.displayBuyItem || 'rice';
      const freeQty = item.displayFreeQty || item.freeQty;
      const freeItem = item.displayFreeItem || item.freeItemName;
      
      // Special offer descriptions
      if (item.isUnrestrictedOffer) {
        return `✨ JUST FOR YOU! Buy ${buyQty} ${buyItem} and get ${freeQty} ${freeItem} absolutely free. We've unlocked this special offer for you!`;
      } else {
        return `🎉 Special deal! Buy ${buyQty} ${buyItem} and get ${freeQty} ${freeItem} free. Great value for premium quality rice!`;
      }
    }
  };

  const renderOfferItem = ({ item }) => {
    console.log(`Rendering offer: ${item.minQtyKg}`);
    
    // Determine if this is a personalized offer
    const isPersonalizedOffer = item.isUnrestrictedOffer;
    const isContainerOffer = item.offerType === 'CONTAINER';

    // Prepare display values
    let primaryTitle, buyDetails, freeDetails;
    
    if (isContainerOffer) {
      primaryTitle = `Free ${item.containerCapacity || 'Premium'} Rice Container`;
      buyDetails = ` ${item.displayBuyAmount || item.minQtyKg}`;
      freeDetails = item.displayFreeItem || `Premium Rice Storage Container`;

    } else {
      const riceVariety = item.displayBuyItem ? item.displayBuyItem : 
        'Premium Rice';
        console.log("rice variety",riceVariety);
      
      
      // Buy details with size if available
      buyDetails = `Buy ${item.displayBuyQty || item.minQty}`;
      console.log("buy details",buyDetails);
      
      if (item.displayBuyKg) {
        buyDetails += ` (${item.displayBuyKg})`;
      }
      buyDetails += ` ${item.displayBuyItem || 'Rice'}`;

      console.log({buyDetails});
       primaryTitle= buyDetails
      
      // Free details
      freeDetails = ` ${item.displayFreeQty || item.freeQty} ${ item.freeItemName} Free`;
    }

    return (
      <View style={styles.card}>
        <View style={[
          styles.tagContainer, 
          isContainerOffer ? styles.specialTagContainer : null,
          isPersonalizedOffer ? styles.personalizedTagContainer : null
        ]}>
          <Text style={styles.tagText}>
            {isPersonalizedOffer ? 'Just For You' : (isContainerOffer ? 'Premium Gift' : 'Special Offer')}
          </Text>
        </View>
        
        <Text style={styles.offerTitle}>{primaryTitle}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <MaterialCommunityIcons 
            name={isContainerOffer ? "rice" : "weight-kilogram"} 
            size={20} 
            color="#333" 
          />
          <Text style={styles.label}>You Purchase:</Text>
          <Text style={styles.value}>{buyDetails}</Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons 
            name={isContainerOffer ? "package-variant" : "gift-outline"} 
            size={20} 
            color={isContainerOffer ? "#ff6d00" : "#4caf50"} 
          />
          <Text style={styles.label}>You Receive:</Text>
          <Text style={[styles.value, { 
            color: isContainerOffer ? "#ff6d00" : "#4caf50",
            flex: 1,
            marginLeft: 0,
            textAlign: 'right'
          }]}>
            {freeDetails}
          </Text>
        </View>
        
        <Text style={[styles.description, isPersonalizedOffer && styles.personalizedDescription]}>
          {getCustomDescription(item)}
        </Text>
        
        <TouchableOpacity style={[styles.applyButton, isPersonalizedOffer && styles.personalizedApplyButton]}
          onPress={() => {
            // Handle apply offer action
            console.log(`Applying offer: ${item.offerName}`);
             navigation.navigate("Rice Products", {
                  screen: "Rice Products",
                  category: "All CATEGORIES",
                  offerId: item.minQtyKg,
                });
          }}
        >
          <Text style={styles.applyButtonText}>
            {isPersonalizedOffer ? 'Claim Your Special Offer' : 'Apply Offer'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="tag-off-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>No eligible offers available at the moment</Text>
      <Text style={styles.emptySubText}>Check back later for new offers!</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading offers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="alert-circle-outline" size={50} color="#f44336" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOffers}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.headerText}>Your Special Offers</Text> */}
      <FlatList
        data={offers}
        keyExtractor={(item, index) => `offer-${item.id || index}`}
        renderItem={renderOfferItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={offers.length === 0 ? styles.fullHeight : { paddingBottom: 20 }}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
    padding: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  tagContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff9800',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
  },
  specialTagContainer: {
    backgroundColor: '#ff6d00',
  },
  personalizedTagContainer: {
    backgroundColor: '#8e24aa', // Purple color for personalized offers
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 10,
    marginRight: 80, // Make sure title doesn't overlap with tag
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
    color: '#555',
    width: 120,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    color: '#1976d2',
    fontStyle: 'italic',
  },
  personalizedDescription: {
    color: '#8e24aa', // Purple color to match the personalized tag
    fontWeight: '500',
  },
  applyButton: {
    marginTop: 16,
    backgroundColor: '#6200ee',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  personalizedApplyButton: {
    backgroundColor: '#8e24aa', // Purple color for personalized offers
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#6200ee',
    fontSize: 16,
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#f44336',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  fullHeight: {
    flexGrow: 1,
  },
});

export default OffersModel;