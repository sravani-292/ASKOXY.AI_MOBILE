import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Dimensions,
  StyleSheet,
  Alert,
  Modal,
  StatusBar,
  SafeAreaView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import BASE_URL from "../Config";
import { useNavigationState } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import LoginModal from "./Components/LoginModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccessToken } from "../Redux/action/index";
import FreeSampleScreen from "./FreeSample";
import GoogleAnalyticsService from "./Components/GoogleAnalytic";
import AskoxyOffers from "./Screens/View/Offers/AskoxyOffers";

// Default banners as fallback
const defaultBanners = [
  require("../assets/Images/r1.png"),
  require("../assets/Images/r2.png"),
];

const DEFAULT_IMAGE = 'https://www.askoxy.ai/static/media/askoxylogostatic.3e03c861742645ba9a15.png';

const services = [
  {
    id: "1",
    name: "Earn upto 24% Yearly RoI",
    image: require("../assets/service_icons/earn.png"),
    screen: "OxyLoans",
  },
  {
    id: "2",
    name: "Study Abroad",
    image: require("../assets/service_icons/StudyAboard.jpg"),
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

const ServiceScreen = () => {
  // Using useWindowDimensions hook for responsive layouts
  const { width, height } = useWindowDimensions();
  const userData = useSelector((state) => state.counter);
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState([]);
  const [getCategories, setGetCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chainId, setChainId] = useState("");
  const [coin, setCoin] = useState("");
  const [loginModal, setLoginModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [studyAbroad, setStudyAbroad] = useState([]);
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const dispatch = useDispatch();

  const currentScreen = useNavigationState(
    (state) => state.routes[state.index]?.name
  );

  // Calculate responsive dimensions
  const getResponsiveWidth = (percentage) => {
    return width * (percentage / 100);
  };

  const getResponsiveHeight = (percentage) => {
    return height * (percentage / 100);
  };

  // Responsive values
  const bannerHeight = getResponsiveHeight(18);
  const serviceItemWidth = getResponsiveWidth(30);
  const categoryCardWidth = getResponsiveWidth(44);

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        Alert.alert(
          "Exit",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      };
  
      // ✅ Updated: Save the subscription and call remove() during cleanup
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );
  
      return () => backHandler.remove(); // ✅ correct way to clean up
    }, [currentScreen])
  );
  

  useFocusEffect(
    useCallback(() => {
      checkLoginData();
      getAllCampaign();
      getRiceCategories();
      fetchDynamicBanners();
    }, [currentScreen])
  );

  const checkLoginData = async () => {
    if (userData && userData.accessToken) {
      setLoginModal(false);
      navigation.navigate("Home");
    } else {
      try {
        const loginData = await AsyncStorage.getItem("userData");
        if (loginData) {
          const user = JSON.parse(loginData);
          if (user.accessToken) {
            setLoginModal(false);
            dispatch(AccessToken(user));
            navigation.navigate("Home");
          }
        } else {
          navigation.navigate("Service Screen");
        }
      } catch (error) {
        console.error("Error fetching login data", error);
      }
    }
  };

  // Fetch dynamic banners from your personal API
  const fetchDynamicBanners = async () => {
    setBannersLoading(true);
    try {
      // Replace with your personal API endpoint
      const response = await axios.get(`${BASE_URL}banner-service/getBanners`);
      
      if (response.data && Array.isArray(response.data)) {
        // Assuming your API returns data in this format
        // Modify this structure based on your actual API response
        const formattedBanners = response.data.map(item => ({
          id: item.id,
          imageUrl: item.imageUrl,
          name: item.title,
          navigationTarget: item.navigationScreen,
          params: item.navigationParams
        }));
        
        setBanners(formattedBanners);
      } else {
        // Fallback to default banners if API fails
        setBanners(defaultBanners.map((img, index) => ({
          id: `default-${index}`,
          image: img,
          name: `Banner ${index + 1}`,
          navigationTarget: null
        })));
      }
    } catch (error) {
      // console.error("Error fetching banners:", error);
      // Set default banners as fallback
      setBanners(defaultBanners.map((img, index) => ({
        id: `default-${index}`,
        image: img,
        name: `Banner ${index + 1}`,
        navigationTarget: null
      })));
    } finally {
      setBannersLoading(false);
    }
  };

  function getAllCampaign() {
    setLoading(true);
    axios
      .get(`${BASE_URL}marketing-service/campgin/getAllCampaignDetails`)
      .then((response) => {
        setLoading(false);
  
        if (!Array.isArray(response.data)) {
          console.error("Invalid API response format");
          setData(services);
          return;
        }
  
        const allCampaigns = response.data;
  
        // for getting Study Abroad campaigns
        const studyAbroadCampaigns = allCampaigns.filter(
          (item) =>
            item.campaignType.includes("STUDY ABROAD GLOBAL EDUCATION") &&
            item.campaignStatus === true
        );
  
        //  Filter all active campaigns
        const activeCampaigns = allCampaigns.filter(
          (item) => item.campaignStatus === true
        );
  
        //  Build updated services: attach preview campaign only to STUDY ABROAD
        const updatedServices = services.map((service) => {
          if (service.screen === "STUDY ABROAD") {
            return {
              ...service,
              previewCampaign: studyAbroadCampaigns[0], // show one preview campaign
              campaigns: studyAbroadCampaigns,          // pass all campaigns for navigation
            };
          }
          return service;
        });
  
        //  Filter out campaigns that are already handled (like STUDY ABROAD ones)
        const filteredCampaigns = activeCampaigns.filter(
          (item) => !item.campaignType.includes("STUDY ABROAD GLOBAL EDUCATION")
        );
  
        // Merge updatedServices with remaining campaigns
        const mergedData = [
          ...updatedServices,
          ...filteredCampaigns
        ];
  
        setData(mergedData);
      })
      .catch((error) => {
        console.error("Error fetching campaigns", error);
        setData(services);
        setLoading(false);
      });
  }
  
  function getRiceCategories() {
    setLoading(true);
    axios({
      method: "get",
      url: BASE_URL + "product-service/showItemsForCustomrs",
    })
      .then((response) => {
        setLoading(false);
        setGetCategories(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching rice categories:", error);
      });
  }

  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("userData");
              navigation.navigate("Login");
            } catch (error) {
              console.error("Error clearing user data:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const arrangeCategories = (categories) => {
    if (!categories || categories.length === 0) return [];
    // Remove the "Sample Rice" category if it exists
    return categories.filter(cat => cat.categoryName !== "Sample Rice");
  };

  const handleScroll = (event) => {
    const scrollWidth = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / scrollWidth);
    setActiveIndex(index);
  };

  const handleServicePress = (item) => {
    try {
      if (item.screen !== "Crypto Currency") {
        if (item.screen) {
          navigation.navigate(item.screen, {
            campaigns: item.campaigns,
          });
        } else if (item.campaignType) {
          navigation.navigate("Campaign", { campaignType: item.campaignType });
        }
      } else {
        if (userData == null || userData == undefined) {
          Alert.alert("Login Required", "Please login to continue", [
            {
              text: "Login",
              onPress: () => navigation.navigate("Login"),
            },
            { text: "Cancel" },
          ]);
        } else if (item.screen) {
          navigation.navigate(item.screen);
        } else if (item.campaignType) {
          navigation.navigate("Campaign", { campaignType: item.campaignType });
        }
      }
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  const handleBannerPress = (banner) => {
    if (banner.navigationTarget) {
      navigation.navigate(banner.navigationTarget, banner.params || {});
    }
  };

  useEffect(() => {
    getAllCampaign();
    getRiceCategories();
    fetchDynamicBanners();
    setLoginModal(true);
    GoogleAnalyticsService.screenView("Service Screen");
    GoogleAnalyticsService.sendEvent("Service Screen", {
      modal_type: "Service Screen",
    });
  }, [userData]);

  const renderServiceItem = ({ item }) => {
    // Safety check to ensure item is valid
    if (!item) return null;
    
    return (
      <TouchableOpacity
        style={[styles.serviceItem, { width: serviceItemWidth }]}
        onPress={() => handleServicePress(item)}
      >
        <View style={styles.serviceIconContainer}>
          {item.image ? (
            <Image
              source={item.image}
              style={styles.serviceImage}
            />
          ) : item.imageUrls && item.imageUrls[0]?.imageUrl ? (
            <Image
              source={{ uri: item.imageUrls[0]?.imageUrl }}
              style={styles.serviceImage}
              defaultSource={require("../assets/icon.png")}
            />
          ) : (
            <Image
              source={require("../assets/icon.png")}
              style={styles.serviceImage}
            />
          )}
        </View>
        <Text numberOfLines={2} style={styles.serviceName}>
          {item.name || item.campaignType || "Service"}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderBannerItem = ({ item, index }) => {
    // Get dynamic height for responsive banners - using the same logic from your original code
    const bannerHeight = getResponsiveHeight(18);
    
    return (
      <TouchableOpacity 
        style={[styles.bannerImageContainer, { width }]}
        onPress={() => handleBannerPress(item)}
        activeOpacity={0.8}
      >
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={[styles.bannerImage, { height: bannerHeight }]}
            resizeMode="contain"
            defaultSource={require("../assets/Images/r1.png")}
          />
        ) : (
          <Image 
            source={item.image} 
            style={[styles.bannerImage, { height: bannerHeight }]} 
            resizeMode="contain"
          />
        )}
        {/* {item.name && (
          <View style={styles.bannerNameContainer}>
            <Text style={styles.bannerName}>{item.name}</Text>
          </View>
        )} */}
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { width: categoryCardWidth }]}
      onPress={() => navigation.navigate("Rice Products", { 
        screen: "Rice Products", 
        category: item.categoryName 
      })}
    >
      <View style={styles.categoryImageContainer}>
        <Image
          source={{ uri: item.categoryLogo }}
          style={styles.categoryImage}
          defaultSource={require("../assets/icon.png")}
        />
      </View>
      <View style={styles.categoryContent}>
        <Text style={styles.categoryName} numberOfLines={1}>{item.categoryName}</Text>
        <View style={styles.viewItemsButton}>
          <Text style={styles.viewItemsText}>Browse Collection</Text>
          <MaterialIcons name="arrow-forward-ios" size={14} color="#FFFFFF" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A148C" barStyle="light-content" />
      
      {loading ? (
        <View style={styles.loaderContainer}>
          <LottieView 
            source={require("../assets/AnimationLoading.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require("../assets/Images/logo2.png")}
              style={styles.logo}
            />
            <View style={styles.headerRightContainer}>
              {userData ? (
                <TouchableOpacity
                  onPress={handleLogout}
                  style={styles.authButton}
                >
                  <MaterialCommunityIcons name="account-arrow-right-outline" size={22} color="#FFFFFF" />
                  <Text style={styles.authButtonText}>Logout</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  style={styles.authButton}
                >
                  <MaterialCommunityIcons name="account-arrow-left-outline" size={22} color="#FFFFFF" />
                  <Text style={styles.authButtonText}>Login</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Dynamic Banner Carousel */}
            <View style={[styles.bannerContainer, { height: bannerHeight }]}>
              {bannersLoading ? (
                <View style={[styles.bannerLoadingContainer, { height: bannerHeight }]}>
                  <LottieView 
                    source={require("../assets/AnimationLoading.json")}
                    autoPlay
                    loop
                    style={{ width: 80, height: 80 }}
                  />
                </View>
              ) : (
                <>
                  <FlatList
                    data={banners.length > 0 ? banners : defaultBanners.map((img, index) => ({
                      id: `default-${index}`,
                      image: img,
                      name: `Banner ${index + 1}`
                    }))}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    renderItem={renderBannerItem}
                  />

                  {/* Pagination Dots */}
                  <View style={styles.paginationContainer}>
                    {(banners.length > 0 ? banners : defaultBanners).map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.paginationDot,
                          activeIndex === index ? styles.activeDot : styles.inactiveDot,
                        ]}
                      />
                    ))}
                  </View>
                </>
              )}
            </View>
           
            {/* Services Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Our Services</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Services")}
                  style={styles.viewAllButton}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                  <MaterialIcons name="chevron-right" size={18} color="#4A148C" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.servicesGridContainer}>
                <FlatList
                  data={data.length > 0 ? data : services}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => (item?.id || `service-${index}`)}
                  renderItem={renderServiceItem}
                  contentContainerStyle={styles.servicesGridContent}
                  scrollEnabled={true}
                />
              </View>
            </View>

            <AskoxyOffers/>

            {/* Categories Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Popular Categories</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Rice Products", {
                      screen: "Rice Products",
                      category: "All CATEGORIES",
                    })
                  }
                  style={styles.viewAllButton}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                  <MaterialIcons name="chevron-right" size={18} color="#4A148C" />
                </TouchableOpacity>
              </View>
              
              {getCategories && getCategories.length > 0 ? (
                <FlatList
                  data={arrangeCategories(getCategories)}
                  keyExtractor={(item, index) => `category-${index}`}
                  numColumns={2}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  columnWrapperStyle={styles.categoriesColumnWrapper}
                  renderItem={renderCategoryItem}
                />
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No categories available</Text>
                </View>
              )}
            </View>
          </ScrollView>
          
          {userData == null && (
            <LoginModal visible={loginModal} onClose={() => setLoginModal(false)} />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginBottom: 25
  },
  scrollContent: {
    paddingBottom: 34,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  bannerLoadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#4A148C",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: "contain",
    tintColor: "#FFFFFF",
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  authButtonText: {
    marginLeft: 6,
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  bannerContainer: {
    position: "relative",
    marginTop: 16,
    alignItems: "center",
    borderRadius: 16, 
  },
  
  bannerImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderRadius: 16,
  },
  
  bannerImage: {
    width: "94%", 
    borderRadius: 16,
  },
  
  bannerNameContainer: {
    position: "absolute",
    bottom: 12,
    left: "7%", // Aligned with image margins
    right: "7%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 8, // Slightly more padding
    paddingHorizontal: 12,
    borderRadius: 8,
    maxWidth: "86%", // Match image width
  },
  
  bannerName: {
    color: "#FFFFFF",
    fontSize: 14, // Slightly larger font
    fontWeight: "600",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -15,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#4A148C",
    width: 20,
  },
  inactiveDot: {
    backgroundColor: "rgba(74, 20, 140, 0.3)",
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
  },
  noDataContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  noDataText: {
    fontSize: 16,
    color: "#757575",
    fontWeight: "500",
  },
  servicesListContainer: {
    paddingVertical: 8,
  },
  categoriesColumnWrapper: {
    justifyContent: "space-between",
  },
  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryImageContainer: {
    width: "100%",
    aspectRatio: 1.5, // Maintain aspect ratio
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryContent: {
    padding: 12,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    color: "#212121",
  },
  viewItemsButton: {
    backgroundColor: "#4A148C",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewItemsText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  servicesGridContainer: {
    marginTop: 10,
  },
  servicesGridContent: {
    paddingVertical: 8,
  },
  serviceItem: {
    alignItems: "center",
    marginRight: 12,
    marginBottom: 16,
  },
  serviceIconContainer: {
    width: "85%",
    aspectRatio: 1, // Square aspect ratio
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(74, 20, 140, 0.1)",
  },
  serviceImage: {
    width: "75%",
    height: "75%",
    resizeMode: "contain",
  },
  serviceName: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    color: "#424242",
    fontWeight: "500",
    height: 32,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(74, 20, 140, 0.08)",
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A148C",
  },
});

export default ServiceScreen;