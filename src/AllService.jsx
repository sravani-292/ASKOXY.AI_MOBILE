import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import BASE_URL from '../Config';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - 48) / numColumns;

// Default image to use if campaign image is missing
const DEFAULT_IMAGE = 'https://www.askoxy.ai/static/media/askoxylogostatic.3e03c861742645ba9a15.png';

const ServicesScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const userData = useSelector((state) => state.counter);

  // Default services data to fall back on
  const services = [
    {
      id: "1",
      name: "Earn upto 1.7% Monthly RoI",
      image: require("../assets/oxyloans.jpg"),
      screen: "OxyLoans",
    },
    {
      id: "2",
      name: "Free Rudraksha",
      image: require("../assets/freerudraksha.png"),
      screen: "FREE RUDRAKSHA",
    },
    {
      id: "3",
      name: "Free Rice Samples",
      image: require("../assets/RiceSamples.png"),
      screen: "FREE CONTAINER",
    },
    {
      id: "4",
      name: "Free AI & Gen AI",
      image: require("../assets/FreeAI.png"),
      screen: "FREE AI & GEN AI",
    },
    {
      id: "5",
      name: "Study Abroad",
      image: require("../assets/study abroad.png"),
      screen: "STUDY ABROAD",
    },
    {
      id: "6",
      name: "Cryptocurrency",
      image: require("../assets/BMVCOIN1.png"),
      screen: "Crypto Currency",
    },
    {
      id: "7",
      name: "Legal Knowledge Hub",
      image: require("../assets/LegalHub.png"),
      screen: "LEGAL SERVICE",
    },
    {
      id: "8",
      name: "My Rotary",
      image: require("../assets/Rotary.png"),
      screen: "MY ROTARY ",
    },
    {
      id: "9",
      name: "We are Hiring",
      image: require("../assets/Careerguidance.png"),
      screen: "We Are Hiring",
    },
    {
      id: "10",
      name: "Manufacturing Services",
      image: require("../assets/Machines.png"),
      screen: "Machines",
    },
  ];

  useEffect(() => {
    getAllCampaign();
  }, []);

  // Filter data based on search
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = data.filter(item => 
        (item.name?.toLowerCase().includes(query)) || 
        (item.campaignType?.toLowerCase().includes(query))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data]);

  function getAllCampaign() {
    setLoading(true);
    axios
      .get(`${BASE_URL}marketing-service/campgin/getAllCampaignDetails`)
      .then((response) => {
        console.log("API Response:", JSON.stringify(response.data));
        setLoading(false);
  
        if (!response.data || !Array.isArray(response.data)) {
          console.error("Invalid API response format:", response.data);
          setData(services);
          setFilteredData(services);
          return;
        }
  
        // Filter only active campaigns
        const activeCampaigns = response.data.filter((item) => item.campaignStatus === true);
        console.log("Active campaigns:", activeCampaigns.length);
  
        if (activeCampaigns.length === 0) {
          setData(services);
          setFilteredData(services);
          return;
        }
  
        // Transform campaign data to match the expected format
        const formattedCampaigns = activeCampaigns.map((campaign) => {
          return {
            ...campaign,
            id: campaign.campaignId?.toString(),
            // Use campaignType as name if campaign name is not available
            name: campaign.campaignName || campaign.campaignType,
            screen: null // This indicates it's a campaign item, not a service
          };
        });
  
        const campaignScreens = activeCampaigns.map((item) => item.campaignType);
  
        // Merge campaigns with services that don't overlap
        const mergedData = [
          ...formattedCampaigns,
          ...services.filter((service) => !campaignScreens.includes(service.screen)),
        ];
  
        console.log("Merged data length:", mergedData.length);
        setData(mergedData);
        setFilteredData(mergedData);
      })
      .catch((error) => {
        console.error("Error fetching campaigns", error);
        setData(services);
        setFilteredData(services);
        setLoading(false);
      });
  }

  const handleServicePress = (item) => {
    // Handle navigation based on whether it's a campaign or service
    if (item.screen === "Crypto Currency") {
      // Special case for Crypto Currency
      if (!userData) {
        Alert.alert("Login Required", "Please login to continue", [
          {
            text: "Login",
            onPress: () => navigation.navigate("Login"),
          },
          { text: "Cancel" },
        ]);
        return;
      }
      navigation.navigate(item.screen);
    } else if (item.screen) {
      // For regular services
      navigation.navigate(item.screen);
    } else {
      // For campaigns
      navigation.navigate("Campaign", { campaignType: item.campaignType });
    }
  };

  const renderServiceItem = ({ item }) => {
    // Determine if item is a campaign or service
    const isService = !!item.screen;
    const name = isService ? item.name : (item.campaignName || item.campaignType);
    
    // Handle image source based on item type
    let imageSource;
    if (isService) {
      imageSource = item.image;
    } else {
      // For campaign items
      if (item.imageUrls && item.imageUrls.length > 0 && item.imageUrls[0].imageUrl) {
        imageSource = { uri: item.imageUrls[0].imageUrl };
      } else {
        imageSource = { uri: DEFAULT_IMAGE };
      }
    }
    
    return (
      <TouchableOpacity 
        style={styles.serviceCard}
        onPress={() => handleServicePress(item)}
        activeOpacity={0.8}
      >
        <Image 
          source={imageSource} 
          style={styles.serviceImage} 
          resizeMode="cover"
          defaultSource={DEFAULT_IMAGE} // Add a default placeholder image
        />
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleRefresh = () => {
    getAllCampaign();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading Services...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        {/* <Text style={styles.headerTitle}>Our Services</Text> */}
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <FlatList
        data={filteredData}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id?.toString() || item.campaignId?.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        key={numColumns}
        onRefresh={handleRefresh}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No services found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#999',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    width: '100%',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 8,
    width: cardWidth,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceInfo: {
    padding: 12,
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default ServicesScreen;