import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Linking,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

import BASE_URL from "../Config";
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

// Default services as fallback
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

// Default placeholder image
const DEFAULT_IMAGE = 'https://www.askoxy.ai/static/media/askoxylogostatic.3e03c861742645ba9a15.png';

// Get screen width for image sizing
const { width,height } = Dimensions.get('window');

// ImageCarousel as a separate functional component
const ImageCarousel = ({ images }) => {

  // console.log("campaigns params",route.params);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  // Update active index when scroll happens
  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const slideSize = width - 32;
      const index = Math.round(value / slideSize);
      setActiveIndex(index);
    });

    return () => {
      scrollX.removeListener(listener);
    };
  }, [scrollX]);

  // Safety check - ensure we have valid images
  const validImages = images && images.length > 0 ? images : [DEFAULT_IMAGE];

  return (
    <View>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        {validImages.map((image, index) => (
          <View key={`img-${index}`} style={styles.imageContainer}>
            <Image
              source={{ uri: image }}
              style={styles.carouselImage}
              resizeMode="contain"
              defaultSource={{ uri: DEFAULT_IMAGE }}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)']}
              style={styles.imageGradient}
            />
          </View>
        ))}
      </Animated.ScrollView>
      
      {/* Enhanced pagination dots */}
      {validImages.length > 1 && (
        <View style={styles.paginationContainer}>
          {validImages.map((_, index) => {
            // Create animated dots that shrink/expand based on active state
            const inputRange = [
              (index - 1) * (width - 32),
              index * (width - 32),
              (index + 1) * (width - 32)
            ];
            
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 16, 8],
              extrapolate: 'clamp'
            });
            
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp'
            });
            
            return (
              <Animated.View
                key={`dot-${index}`}
                style={[
                  styles.paginationDot,
                  { 
                    width: dotWidth,
                    opacity,
                    backgroundColor: index === activeIndex ? '#3498db' : '#ccc' 
                  }
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

// Single Campaign Card component
const SingleCampaignCard = ({ item, fadeAnim, handleComirmation, handleWriteToUs, getImages,navigation,AlreadyInterested,userData }) => {
  // Determine the title and description based on item type
  const title = item.campaignType || item.name || 'Unnamed Campaign';
  const description = item.campaignDescription || `Learn more about our ${item.name || 'services'}.`;
  const images = getImages(item);
  
  // Animation for scale effect on cards
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, []);
  
  return (
    <Animated.View style={[
      styles.cardContainer,
      { 
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }] 
      }
    ]}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.card}
      >
        <ImageCarousel images={images} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
          
          {/* Campaign message if available */}
          {item.message && (
            <Text style={styles.cardMessage}>{item.message}</Text>
          )}
          
          <View style={styles.cardMeta}>
            {item.campaignTypeAddBy && (
              <Text style={styles.cardMetaText}>Added by: {item.campaignTypeAddBy}</Text>
            )}
          </View>
          
          <View style={styles.cardButtons}>
          {AlreadyInterested==false?
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={() => handleComirmation(item)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3498db', '#2980b9']}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>I'm Interested</Text>
              </LinearGradient>
            </TouchableOpacity>
            :(
                <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#3498db', '#2980b9']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>You are already interested.</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            {userData&&(
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={() => navigation.navigate("Write To Us")}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Write to Us</Text>
            </TouchableOpacity>)}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default function CampaignScreen({ route, navigation }) {
  console.log("campaign screen",route.params);
  
  const [campaignData, setCampaignData] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const[profileData,setProfileData]=useState()
    const [AlreadyInterested,setAlreadyInterested]=useState(false)
//    const navigation = useNavigation();

   const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const userData = useSelector(state => state.counter);

     useEffect(()=>{
    if(userData==null){
         Alert.alert("Alert","Please login to continue",[
           {text:"OK",onPress:()=>navigation.navigate("Login")},
           {text:"Cancel"}
         ])
         return;
       }else{
         getCall()
         getProfile()
       }  },[])

       const getProfile = async () => {
        axios({
         method:"get",
         url:BASE_URL+ `user-service/customerProfileDetails?customerId=${userData.userId}`
        })
        .then((response)=>{
         console.log(response.data)
         setProfileData(response.data)
        })
        .catch((error)=>{
         console.log(error.response.data)
        })
       };
    
      function getCall(){
        let data={
          userId: userData.userId
        }
        axios.post(BASE_URL+`marketing-service/campgin/allOfferesDetailsForAUser`,data)
        .then((response)=>{
          console.log("Success",response.data)
          const hasFreeAI = response.data.some(item => item.askOxyOfers === campaignType);
    
      if (hasFreeAI) {
        // Alert.alert("Yes", "askOxyOfers contains FREEAI");
        setAlreadyInterested(true)
      } else {
        // Alert.alert("No","askOxyOfers does not contain FREEAI");
        setAlreadyInterested(false)
      }
        })
        .catch((error)=>{
          console.log(error.response)
        })
      }

 
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
// Get specific campaignId or campaignType from route params if available
const { campaignId, campaignType } = route.params || {};
console.log("campaingId",campaignId);
console.log("campainType",campaignType);


  useEffect(() => {
    loadCampaigns();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();
  }, []);

 
  useEffect(() => {
    
    if (campaignData.length > 0) {
      selectCampaign();
      console.log("Selected campaign ID:", campaignId);
    console.log("Selected campaign type:", campaignType);
    }
  }, [campaignData, campaignId, campaignType]);

  const loadCampaigns = () => {
    setLoading(true);
    
    // If no specific ID, fetch all and filter as needed
    axios.get(`${BASE_URL}marketing-service/campgin/getAllCampaignDetails`)
      .then(response => {
        setLoading(false);
        // console.log("API Response:", response.data);r
        
        if (!Array.isArray(response.data)) {
          console.error("Invalid API response format");
          // Find first matching service from defaults as fallback
          const defaultService = campaignType 
            ? services.find(s => s.screen === campaignType) || services[0] 
            : services[0];
          setCampaignData(defaultService);
          return;
        }
        
        // Filter only active campaigns
        const activeCampaigns = response.data.filter(item => item.campaignStatus === true);

        // console.log("Active Campaigns:", activeCampaigns);
        
        
        if (activeCampaigns.length === 0) {
          // No active campaigns, use default service
          const defaultService = campaignType 
            ? services.find(s => s.screen === campaignType) || services[0] 
            : services[0];
          setCampaignData(defaultService);

        //   console.log({defaultService});
          
          return;
        }
        
        // If specific campaign type requested, try to find it
        if (campaignType) {
          const matchingCampaign = activeCampaigns.find(
            item => item.campaignType === campaignType
          );
        //   console.log({matchingCampaign});
          
          if (matchingCampaign) {
            setCampaignData(matchingCampaign);
          } else {
            // No matching campaign found in API, check services
            const matchingService = services.find(s => s.screen === campaignType);
            setCampaignData(matchingService || activeCampaigns[0]);
          }
        } else {
          // No specific type requested, just show the first active campaign
          setCampaignData(activeCampaigns[0]);
        }
      })
      .catch(error => {
        console.error("Error fetching campaigns", error);
        // Fallback to first default service on error
        setCampaignData(services[0]);
        setLoading(false);
      });
  };


  // Logic to select which campaign to show
  const selectCampaign = () => {
    // If campaign ID is specified
    console.log("Selected campaign ID:", campaignId);
    console.log("Selected campaign type:", campaignType);
    
    if (campaignId) {
      const matchingCampaign = campaignData.find(c => c.campaignId === campaignId);
      if (matchingCampaign) {
        setCurrentCampaign(matchingCampaign);
        return;
      }
    }
    
    // If campaign type is specified
    if (campaignType) {
      const matchingCampaign = campaignData.find(c => c.campaignType === campaignType);
      if (matchingCampaign) {
        setCurrentCampaign(matchingCampaign);
        return;
      }
    }
    
    // Default: show first active campaign or fallback to first campaign
    const activeCampaigns = campaignData.filter(c => c.campaignStatus === true);
    if (activeCampaigns.length > 0) {
      setCurrentCampaign(activeCampaigns[0]);
    } else if (campaignData.length > 0) {
      setCurrentCampaign(campaignData[0]);
    } else {
      // No campaigns found, fall back to default service
      setCurrentCampaign(services[0]);
    }
  };

  // Extract image URLs from campaign data
  const getImages = (item) => {
    // For campaign items with imageUrls array from API
    if (item.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
      // Extract URLs from the imageUrl property in each object
      const urls = item.imageUrls
        .filter(img => img && img.status === true && img.imageUrl)
        .map(img => img.imageUrl);
      
      return urls.length > 0 ? urls : [DEFAULT_IMAGE];
    }
    
    // For service items with single image
    if (item.image) {
      // If it's a require'd asset
      if (typeof item.image === 'number') {
        return [DEFAULT_IMAGE]; // We can't display require'd images directly, use default
      } else {
        return [item.image];
      }
    }
    
    // Default placeholder
    return [DEFAULT_IMAGE];
  };

  

  const ConfirmationModal = ({ visible, onCancel, onConfirm, item }) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onCancel}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalTitle}>Confirmation</Text>
            
            <Text style={modalStyles.modalText}>
              Are you sure you want to proceed ?
            </Text>
            
            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={modalStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.confirmButton]}
                onPress={() => onConfirm(item)}
              >
                <Text style={modalStyles.confirmButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const showConfirmationModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleConfirm = (item) => {
    handleInterested(item);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  // Replace your current handleConfirmation function with this:
  const handleConfirmation = (item) => {
    showConfirmationModal(item);
  };

  const handleInterested = (item) => {   
        if (userData == null) {
          Alert.alert("Alert", "Please login to continue", [
            { text: "OK", onPress: () => navigation.navigate("Login") },
            { text: "Cancel" },
          ]);
          return;
        } 
        let number =null;
      if(profileData?.whatsappNumber && profileData?.mobileNumber)   {
      number=(profileData.whatsappNumber)
      
    }
    else if(profileData?.whatsappNumber && profileData?.whatsappNumber) {
      number=(profileData.whatsappNumber)
     
    }
    else if(profileData?.mobileNumber && profileData?.mobileNumber) {
      number=(profileData.mobileNumber)
     
    }
    
    if (!number) {
      console.log ("Error", "No valid phone number found.");
        return;
      }
          let data = {
            askOxyOfers: campaignType,
            userId: userData.userId,
            mobileNumber: number,
            projectType: "ASKOXY",
          };
          console.log(data);
           setLoading(true)
          axios({
            method: "post",
            url:  BASE_URL + "marketing-service/campgin/askOxyOfferes",
            data: data,
          })
            .then((response) => {
              console.log(" study abroad intrested Success", response);
              
              console.log(response.data);
              setLoading(false);
              Alert.alert(
                "Success",
                "Your interest has been submitted successfully!",
                [
                  {
                    text: "OK",
                    onPress: () => getCall(),
                  },
                    { text: "Cancel", onPress: () => getCall() },
                { text: "Write to Us", onPress: () => navigation.navigate("Write To Us") },
                ]
              );
            })
            .catch((error) => {
              console.log("error",error.response);
              setLoading(false);
              if (error.response.status == 400) {
                Alert.alert("Failed", "You have already participated. Thank you!")
              }
              else {
                Alert.alert("Failed", error.response.data);
              }
        
            })
  };

  const handleWriteToUs = (item) => {
    // Determine the appropriate email address based on campaign type
    let emailAddress = 'contact@askoxy.ai';
    
    // For study abroad campaigns
    if (item.campaignType?.includes('STUDY ABROAD') || item.campaignType?.includes('EDUCATION')) {
      emailAddress = 'studyabroad@askoxy.ai';
    }
    // For real estate campaigns
    else if (item.campaignType?.includes('VILLA') || item.campaignType?.includes('REAL ESTATE')) {
      emailAddress = 'realestate@askoxy.ai';
    }
    // For financial/loan campaigns
    else if (item.campaignType?.includes('NBFC') || item.campaignType?.includes('LOAN')) {
      emailAddress = 'finance@askoxy.ai';
    }
    
    const subject = encodeURIComponent(`Inquiry about ${item.campaignType || 'Campaign'}`);
    const body = encodeURIComponent(`
Hello,

I'd like more information about ${item.campaignType || 'your campaign'}.

Thank you!
`);
    
    Linking.openURL(`mailto:${emailAddress}?subject=${subject}&body=${body}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <LinearGradient
          colors={['#f8f9fa', '#f5f5f5']}
          style={styles.headerContainer}
        >
          <Text style={styles.header}>
            {campaignData ? (campaignData.campaignType || campaignData.name) : 'Campaign'}
          </Text>
        </LinearGradient>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading campaign...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadCampaigns}>
              <LinearGradient
                colors={['#3498db', '#2980b9']}
                style={styles.retryButtonGradient}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : !campaignData ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No campaign available</Text>
          </View>
        ) : (
          <SingleCampaignCard 
            item={campaignData}
            fadeAnim={fadeAnim}
            handleComirmation={handleConfirmation }
            handleWriteToUs={handleWriteToUs}
            getImages={getImages}
            navigation={navigation}
            AlreadyInterested={AlreadyInterested}
            userData={userData}
          />
        )}
      </ScrollView>

      <ConfirmationModal
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        item={selectedItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    padding: 16,
    textAlign: 'center',
  },
  cardContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: width - 32,
    height: height*0.64,
    overflow: 'hidden',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  carouselImage: {
    // width: width - 32,
    width:width*0.9,
    height: height*0.63,
    alignSelf: 'center',
    resizeMode:"contain"
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardMessage: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  cardMeta: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  cardMetaText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 5,
  },
  button: {
    borderRadius: 10,
    overflow: 'hidden',
    flex: 1,
    height: 46,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 15,
  },
  loadingContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#555',
    fontSize: 16,
  },
  errorContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 17,
    color: '#555',
    textAlign: 'center',
  },
});

const modalStyles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#333',
    },
    modalText: {
      marginBottom: 24,
      textAlign: 'center',
      fontSize: 16,
      color: '#555',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      borderRadius: 8,
      padding: 12,
      elevation: 2,
      minWidth: '40%',
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#f0f0f0',
    },
    confirmButton: {
      backgroundColor: '#4285F4',
    },
    cancelButtonText: {
      color: '#555',
      fontWeight: '600',
    },
    confirmButtonText: {
      color: 'white',
      fontWeight: '600',
    },
  });