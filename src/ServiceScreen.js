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
} from "react-native";
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import BASE_URL from "../Config";
import { useNavigationState } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import LoginModal from "./Components/LoginModal";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccessToken } from "../Redux/action/index";
import FreeSampleScreen from "./FreeSample";
import GoogleAnalyticsService from "./Components/GoogleAnalytic";

const { height, width } = Dimensions.get("window");

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
  // {
  //   id: "3",
  //   name: "Buy Villa @36Lakhs",
  //   image: require("../assets/service_icons/villa.png"),
  //   screen: "FREE AI & GEN AI",
  // },
  
  // {
  //   id: "4",
  //   name: "Order Rice Online",
  //   image: require("../assets/RiceSamples.png"),
  //   screen: "Rice Products",
  // },
  // {
  //   id: "5",
  //   name: "Study Abroad",
  //   image: require("../assets/study abroad.png"),
  //   screen: "STUDY ABROAD",
  // },
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

const bannerImages = [
  require("../assets/Images/r1.png"),
  require("../assets/Images/r2.png"),
];

const DEFAULT_IMAGE = 'https://www.askoxy.ai/static/media/askoxylogostatic.3e03c861742645ba9a15.png';

const ServiceScreen = () => {
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
  const [studyAbroad,setStudyAbroad] = useState([])
  const dispatch = useDispatch();

  const currentScreen = useNavigationState(
    (state) => state.routes[state.index]?.name
  );

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [currentScreen])
  );

  useFocusEffect(
    useCallback(() => {
      checkLoginData();
      getAllCampaign();
      getRiceCategories();
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

  const profile = async () => {
    if (userData) {
      try {
        const response = await axios({
          method: "get",
          url: BASE_URL + `user-service/getProfile/${userData.userId}`,
          headers: {
            Authorization: `Bearer ${userData.accessToken}`,
          },
        });
        
        setChainId(response.data.multiChainId);
        setCoin(response.data.coinAllocated);
        setLoginModal(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching profile:", error);
      }
    }
  };

  // function getAllCampaign() {
  //   setLoading(true);
  //   axios
  //     .get(`${BASE_URL}marketing-service/campgin/getAllCampaignDetails`)
  //     .then((response) => {
  //       // console.log("campaign details",response);
  //       setLoading(false);
  
  //       if (!Array.isArray(response.data)) {
  //         console.error("Invalid API response format");
  //         setData(services);
  //         return;
  //       }
  //       
  //       const studyAbroadCampaigns = response.data.filter((item)=>item.campaignType.includes("STUDY ABROAD GLOBAL EDUCATION")&& item.campaignStatus===true)
  //       console.log("studyAbroadCampaigns",studyAbroadCampaigns);

       

  //       const activeCampaigns = response.data.filter((item) => item.campaignStatus === true);
  //       //insert study abroad related campaigns into STUDY ABROAD service
  //       const updatedServices = services.map((item) => {
  //         if(item.screen==="STUDY ABROAD"){
  //           return{
  //             ...item,
  //             campaigns : studyAbroadCampaigns
  //           }
  //         }
  //         return;
  //       });
  //       setData(updatedServices);
  //       console.log("updatedServices",updatedServices);
  //       if (activeCampaigns.length === 0) {
  //         setData(services); 
  //         return;
  //       }
  
  //       const campaignScreens = activeCampaigns.map((item) => item.campaignType);
  
  //       const mergedData = [
  //         ...activeCampaigns,
  //         ...services.filter((service) => !campaignScreens.includes(service.screen)),
  //       ];
  //         console.log("mergedData",mergedData);
             
  //       setData(mergedData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching campaigns", error);
  //       setData(services);
  //       setLoading(false);
  //     });
  // }


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
  
        // 🧠 Merge updatedServices with remaining campaigns
        const mergedData = [
          ...updatedServices,
          ...filteredCampaigns
        ];
  
        // console.log("Merged Data:", mergedData);
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
        // console.log("Rice Categories:", response.data);
        
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

  // const arrangeCategories = (categories) => {
  //   if (!categories || categories.length === 0) return [];

  //   // Find the exact "Sample Rice" category
  //   const sampleRiceIndex = categories.findIndex(
  //     (cat) => cat.categoryName === "Sample Rice"
  //   );

  //   // If "Sample Rice" category is found, move it to the first position
  //   if (sampleRiceIndex !== -1) {
  //     const result = [...categories];
  //     const sampleRiceCategory = result.splice(sampleRiceIndex, 1)[0];
  //     return [sampleRiceCategory, ...result];
  //   }

  //   return categories;
  // };

  const arrangeCategories = (categories) => {
  if (!categories || categories.length === 0) return [];

  // Remove the "Sample Rice" category if it exists
  return categories.filter(cat => cat.categoryName !== "Sample Rice");
};

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  // Function to truncate the ID (Example: "0x1234567890abcdef" → "0x12...ef")
  const truncateId = (id) => {
    return id && id.length > 4 ? `${id.slice(0, 6)}...${id.slice(-4)}` : id;
  };
  
  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(chainId);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  useEffect(() => {
    getAllCampaign();
    getRiceCategories();
    profile();
    setLoginModal(true);
    GoogleAnalyticsService.screenView("Service Screen");
    GoogleAnalyticsService.sendEvent("Service Screen", {
      modal_type: "Service Screen",
    });
  }, [userData]);

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => {
        if (item.screen !== "Crypto Currency") {
          if (item.screen) {
         
          navigation.navigate(item.screen, {
            campaigns: item.campaigns,
          });
          
        } else {
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
          } else {
            navigation.navigate("Campaign", { campaignType: item.campaignType });
          }
        }
      }}
    >
      <View style={styles.serviceIconContainer}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.serviceImage}
          />
        ) : item.imageUrls ? (
          <Image
            source={{ uri: item.imageUrls[0].imageUrl || DEFAULT_IMAGE }}
            style={styles.serviceImage}
          />
        ) : (
          <Image
            source={require("../assets/icon.png")}
            style={styles.serviceImage}
          />
        )}
      </View>
      <Text numberOfLines={2} style={styles.serviceName}>
        {item.name || item.campaignType}
      </Text>
    </TouchableOpacity>
  );
  

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => navigation.navigate("Rice Products", { 
        screen: "Rice Products", 
        category: item.categoryName 
      })}
    >
      <Image
        source={{ uri: item.categoryLogo }}
        style={styles.categoryImage}
      />
      <View style={styles.categoryContent}>
        <Text style={styles.categoryName}>{item.categoryName}</Text>
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
            {/* Banner Carousel */}
            <View style={styles.bannerContainer}>
              <FlatList
                data={bannerImages}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                renderItem={({ item }) => (
                  <View style={styles.bannerImageContainer}>
                    <Image source={item} style={styles.bannerImage} />
                  </View>
                )}
              />

              {/* Pagination Dots */}
              <View style={styles.paginationContainer}>
                {bannerImages.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      activeIndex === index ? styles.activeDot : styles.inactiveDot,
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* User Info Section */}
            {userData && (
              <View style={styles.userInfoCard}>
                <View style={styles.userInfoHeader}>
                  <FontAwesome5 name="user-circle" size={20} color="#4A148C" />
                  <Text style={styles.userInfoTitle}>Account Information</Text>
                </View>
                
                <View style={styles.userInfoDivider} />
                
                <View style={styles.infoRow}>
                  <View style={styles.blockchainIdContainer}>
                    <Text style={styles.infoLabel}>Blockchain ID:</Text>
                    <Text style={styles.infoValue}>{truncateId(chainId)}</Text>
                    <TouchableOpacity
                      style={[styles.copyButton, copied ? styles.copiedButton : null]}
                      onPress={handleCopy}
                    >
                      <MaterialIcons
                        name={copied ? "check" : "content-copy"}
                        size={16}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.coinContainer}>
                    <Text style={styles.infoLabel1}>BMV Coins:</Text>
                    <View style={styles.coinBadge}>
                      <Text style={styles.coinValue}>{coin}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.infoButton}
                      onPress={() => setInfoModalVisible(true)}
                    >
                      <MaterialIcons name="info-outline" size={18} color="#4A148C" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

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
      data={data}
      // numColumns={3}  
      horizontal
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => (item.id || index.toString())}
      renderItem={renderServiceItem}
      contentContainerStyle={styles.servicesGridContent}
      scrollEnabled={true}
    />
  </View>
</View>


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
              
              <FlatList
                data={arrangeCategories(getCategories)}
                keyExtractor={(item, index) => index}
                numColumns={2}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.categoriesColumnWrapper}
                renderItem={renderCategoryItem}
              />
            </View>

            {/* Free Sample Section */}
            {userData && (
              <View style={styles.freeSampleContainer}>
                <FreeSampleScreen />
              </View>
            )}
          </ScrollView>
          
          {/* BMVCoins Info Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={infoModalVisible}
            onRequestClose={() => setInfoModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <FontAwesome5 name="coins" size={20} color="#4A148C" />
                    <Text style={styles.modalTitle}>About BMVCoins</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setInfoModalVisible(false)}
                  >
                    <Ionicons name="close" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalText}>
                  Collect BMVCoins and redeem them for discounts on rice bags and other products across our platform.
                </Text>

                <View style={styles.valueBox}>
                  <Text style={styles.valueTitle}>Current Exchange Rate:</Text>
                  <View style={styles.exchangeRate}>
                    <FontAwesome5 name="coins" size={18} color="#F1C40F" />
                    <Text style={styles.valueText}>1,000 BMVCoins = ₹10 discount</Text>
                  </View>
                </View>

                <Text style={styles.infoTitle}>Important information:</Text>
                <View style={styles.bulletList}>
                  <View style={styles.bulletPoint}>
                    <MaterialIcons name="check-circle" size={16} color="#4CAF50" style={styles.bulletIcon} />
                    <Text style={styles.bulletText}>
                      A minimum of 20,000 BMVCoins is required for redemption.
                    </Text>
                  </View>
                  <View style={styles.bulletPoint}>
                    <MaterialIcons name="check-circle" size={16} color="#4CAF50" style={styles.bulletIcon} />
                    <Text style={styles.bulletText}>
                      Exchange rates subject to change. Check app for latest values.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.gotItButton}
                  onPress={() => setInfoModalVisible(false)}
                >
                  <Text style={styles.gotItText}>Got it</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
    paddingTop: StatusBar.currentHeight,
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#4A148C",
    elevation: 4,
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
    height: 140,
    position: "relative",
    marginTop: 16,
  },
  bannerImageContainer: {
    width: width,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: width - 32,
    height: 140,
    borderRadius: 16,
    resizeMode: "cover",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 12,
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
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  userInfoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    margin: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A148C",
    marginLeft: 10,
  },
  userInfoDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 12,
  },
  infoRow: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    alignItems: "flex-start",
  },
  blockchainIdContainer: {
    marginTop:10,
    flexDirection: "row",
    alignItems:"flex-start",
    flex: 1,
    marginBottom:5
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#757575",
    // marginRight: 6,
    // justifyContent:"flex-start"
  },
   infoLabel1: {
    fontSize: 14,
    fontWeight: "500",
    color: "#757575",
    alignItems:"flex-start",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4A148C",
  },
  copyButton: {
    backgroundColor: "#4A148C",
    padding: 6,
    borderRadius: 6,
    marginLeft:width/3
  },
  copiedButton: {
    backgroundColor: "#4CAF50",
  },
  coinContainer: {
    // marginTop:50,
    flexDirection: "row",
  justifyContent:"flex-start"
  },
  coinBadge: {
    backgroundColor: "#F1F6FF",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 6,
    // marginLeft:width/2.5
  },
  coinValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4A148C",
  },
  infoButton: {
    padding: 4,
    marginLeft:width/2.5
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
    width: (width - 40) / 2,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryImage: {
    width: "100%",
    height: 160,
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
  freeSampleContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A148C",
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: "#4A148C",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#424242",
    marginBottom: 16,
    lineHeight: 24,
  },
  valueBox: {
    backgroundColor: "#F1F6FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  valueTitle: {
    fontSize: 16,
    color: "#212121",
    marginBottom: 12,
    fontWeight: "600",
  },
  exchangeRate: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A148C",
    marginLeft: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 12,
  },
  bulletList: {
    marginBottom: 20,
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bulletIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 15,
    color: "#424242",
    lineHeight: 22,
    flex: 1,
  },
  gotItButton: {
    backgroundColor: "#4A148C",
    borderRadius: 8,
    paddingVertical: 14,
      alignItems: "center",
    },
    gotItText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    servicesGridContainer: {
      marginTop: 10,
    },
    servicesGridContent: {
      paddingVertical: 8,
    },
    serviceItem: {
      alignItems: "center",
      width: (width - 64) / 3,
      marginBottom: 20,
    },
    serviceIconContainer: {
      width: 100,
      height: 100,
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
      width: 80,
      height: 80,
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