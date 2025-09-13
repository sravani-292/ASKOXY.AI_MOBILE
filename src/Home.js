import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import BASE_URL from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { AccessToken } from '../Redux/action/index';
import Logout from './Authorization/Logout';
import DashboardHeader from './DashboardHeader';

const { width, height } = Dimensions.get('window');

const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;
const HORIZONTAL_PADDING = 20;

const HomeScreen = ({ navigation }) => {
  const services = [
    {
      id: 1,
      title: 'AI | Blockchain',
      subtitle: '& IT Services',
      icon: 'git-network-outline',
      gradientColors: ['#FF8A50', '#FF6B35'],
      screenName: 'AI BLOCKCHAIN & IT SERVICES',
    },
    {
      id: 2,
      title: 'RICE 2 ROBO',
      subtitle: 'ECommerce',
      icon: 'storefront-outline',
      gradientColors: ['#EC407A', '#E91E63'],
      screenName: 'Rice Products',
    },
    {
      id: 3,
      title: 'CA | CS',
      subtitle: 'SERVICES',
      icon: 'calculator-outline',
      gradientColors: ['#F8BBD0', '#F06292'],
      screenName: 'CA SERVICES',
    },
    {
      id: 4,
      title: 'GOLD | SILVER',
      subtitle: 'DIAMONDS',
      icon: 'diamond-outline',
      gradientColors: ['#FFB74D', '#FF8A65'],
      screenName: 'GOLD, SILVER & DIAMONDS',
    },
    {
      id: 5,
      title: 'Loans &',
      subtitle: 'Investments',
      icon: 'card-outline',
      gradientColors: ['#FFCDD2', '#E57373'],
      screenName: 'OxyLoans',
    },
    {
      id: 6,
      title: 'NYAYA GPT',
      subtitle: 'Legal AI',
      icon: 'scale-outline',
      gradientColors: ['#8E24AA', '#7B1FA2'],
      screenName: 'NyayaGPTScreen',
    },
    {
      id: 7,
      title: 'FRACTIONAL',
      subtitle: 'OWNERSHIP',
      icon: 'business-outline',
      gradientColors: ['#A8E6CF', '#56C596'],
      screenName: 'FractionalScreen',
    },
    {
      id: 8,
      title: 'SOFTWARE',
      subtitle: 'TRAINING',
      icon: 'school-outline',
      gradientColors: ['#FF7043', '#FF5722'],
      screenName: 'GLMS OPEN SOURCE HUB & JOB STREET',
    },
    {
      id: 9,
      title: 'STUDY',
      subtitle: 'ABROAD',
      icon: 'airplane-outline',
      gradientColors: ['#FFB74D', '#FF9800'],
      screenName: 'Study',
    },
  ];

  const featureGradients = {
  "Genoxy": ['#6a0dad', '#6a0dad'],
  "Voice AI": ["#7957c8ff", "#6a0dad"],
  "Explore AI LLMs": ["#8B5CF6", "#6a0dad"],
  "Blockchain": ['#FFB74D', '#be8024ff'],
  "Crypto": ["#F59E0B", "#B45309"],
  "Loans & Investments": ["#10B981", "#047857"],
  "NyayaGPT": ["#FACC15", "#EAB308"],
  "Real Estate": ["#3B82F6", "#1D4ED8"],
  "Rice2Robo Ecommerce": ["#EC4899", "#DB2777"],
  "Gold, Silver & Diamonds": ["#FCD34D", "#FBBF24"],
  "IT Services": ["#64748B", "#334155"],
  "Study Abroad": ["#38BDF8", "#0EA5E9"],
  "Jobs, Blogs & Training": ["#34D399", "#059669"],
};


  const dispatch = useDispatch();
  const [loginModal, setLoginModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userData, setUserData] = React.useState(null);

  const checkLoginData = async () => {
      if (userData && userData.accessToken) {
        setLoginModal(false);
        console.log('User already logged in, navigating to Home');
        navigation.navigate("Home");
      } else {
        try {
          const loginData = await AsyncStorage.getItem("userData");
          if (loginData) {
            const user = JSON.parse(loginData);
            if (user.accessToken) {
                console.log('User already logged in, navigating to Home store');
                setLoginModal(false);
                dispatch(AccessToken(user));
                navigation.navigate("Home");
            }
          } else {
            navigation.navigate("Main Screen");
          }
        } catch (error) {
          console.error("Error fetching login data", error);
        }
      }
    };

    useFocusEffect(
      React.useCallback(() => {
        checkLoginData(); 
        setIsLoading(false);
      }, [])
    );

  const handleServicePress = (screenName) => {
    if(screenName === 'OxyLoans') {
      navigation.navigate('OxyLoans');
    } else if (screenName === 'NyayaGPTScreen') {
      navigation.navigate('LEGAL SERVICE');
    }else if(screenName === 'Study') {
      navigation.navigate('STUDY ABROAD');
    }else if(screenName === 'Rice Products') {
      navigation.navigate("Rice Products", {
                      screen: "Rice Products",
                      category: "All CATEGORIES",
                    }) 
    }else if(screenName === 'FractionalScreen') {
      navigation.navigate('Fractional Ownership');  
    }else if (screenName && navigation) {
      navigation.navigate("Campaign", {
        campaignType: screenName,
      });
    } else {
      console.log('Service pressed:', screenName);
    }
  };

 const featuresTop = [
  { label: "Genoxy", icon: require("../assets/chat.png"), color: "#FFD700",radius:"left",screen:"GENOXY" },
  // { label:"AI Agents 2 Earn Money", icon: require("../assets/AgentEarn2.png"), color: "#34D399", screen:"Agent Store",radius:"right", },
  // { label: "Explore AI LLMs", icon: require("../assets/brain.png"), color: "#A78BFA", screen:"DrawerScreens" },
  // { label: "Blockchain", icon: require("../assets/blockchain.png"), color: "#FACC15",radius:"right", screen:"AI BLOCKCHAIN & IT SERVICES" },
];



const renderIcon = (item, size = 125) => {
  return (
    <View style={{alignItems: "center", justifyContent: "center"}}>
    <Image
      source={item.icon}
      style={{
        width: size,
        height: size,
        resizeMode: "contain",
        alignSelf: "center",
      }}
    />
    </View>
  );
};

  const userDetails = useSelector((state) => state.counter);

  useEffect(() => {
    const fetchUserDetails = async () => {  
      try {
       await axios.get(`${BASE_URL}user-service/customerProfileDetails?customerId=${userDetails?.userId}`, {
          headers: {
            Authorization: `Bearer ${userDetails?.accessToken}`,
          },
        })
        .then((response) => {
          console.log('User Details Response:', response.data);
          // Assuming the response contains user details
          setUserData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user details:', error);
        });
      } catch (error) {
        console.error('Error fetching user details', error);
      }
    };
    if(userDetails?.userId) {
      console.log('Fetching user details for userId:', userDetails.userId);
    fetchUserDetails();
    }
  }, []);

  const renderServiceItem = (service) => {
    return (
      <TouchableOpacity
        key={service.id}
        style={styles.serviceItem}
        onPress={() => handleServicePress(service.screenName)}
        activeOpacity={0.85}
      >
        {/* Icon Above */}
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={service.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Ionicons 
              name={service.icon} 
              size={32} 
              color="#FFFFFF" 
            />
          </LinearGradient>
        </View>
        
        {/* Text Container Below */}
        <View style={styles.textContainer}>
          <Text style={styles.serviceTitle} numberOfLines={2}>
            {service.title}
          </Text>
          <Text style={styles.serviceSubtitle} numberOfLines={2}>
            {service.subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Group services into rows of 3
  const renderServiceRows = () => {
    const rows = [];
    for (let i = 0; i < services.length; i += 3) {
      const rowServices = services.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.serviceRow}>
          {rowServices.map((service) => renderServiceItem(service))}
        </View>
      );
    }
    return rows;
  };

  const onPressNavigation = (screen) => {
    if(screen !== "AI BLOCKCHAIN & IT SERVICES") {
    navigation.navigate(screen);
  }
  else{
   navigation.navigate("Campaign", {
        campaignType: "AI BLOCKCHAIN & IT SERVICES",
      })
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#360256" 
        translucent={true}
      />
      
      <LinearGradient
        colors={['#6a0dad', '#360256', '#6a0dad']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mainContainer}
      >
         <View style={{position: 'absolute', top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40, right: 20, zIndex: 10,justifyContent:'flex-end'}}>
                  <Logout/>
         </View>
        {/* Header */}
        <DashboardHeader userData={userData} />
        {/* <SafeAreaView style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.appTitle}>ASKOXY.AI</Text>
            <Text style={styles.appSubtitle}>AI-Z Marketplace</Text>
           <View>
              <Text style={styles.welcomeText}>
                Welcome, {userData?.firstName
                  ? `${userData.firstName} ${userData.lastName || ''}`
                  : 'Guest'}!
              </Text>
              <Text style={styles.subtitle}>
                Explore our services below
              </Text>
            </View>
          </View>
        </SafeAreaView> */}

        {/* Services */}
        <View style={{alignItems: 'center',flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10,width:width*0.9, alignSelf: 'center',}}>
          <View style={styles.topRow}>
            {featuresTop.map((item, index) => (
              <LinearGradient
                colors={featureGradients[item.label] || ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.05)"]} 
                 style={item.radius == "right" ? styles.cardRightRadius : item.radius == "left" ? styles.cardLeftRadius : styles.topCard}> 
                <TouchableOpacity onPress={() => onPressNavigation(item.screen)}>
                  {renderIcon(item, 48)}
                  <View style={{alignItems: "center", justifyContent: "center"}}>
                  <Text style={styles.topCardText}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View> 
          <View style={styles.topleft}>
               <LinearGradient colors={['#FFB74D', '#be8024ff']} style={styles.topLeftCard}> 
                <TouchableOpacity onPress={() => {
                  if(userDetails?.userId) {
                  onPressNavigation('Profile')}
                  else {
                    navigation.navigate("Login")
                  }}}>
                  <Image 
                    source={require("../assets/rupee.png")}
                    style={{
                      width: 45,
                      height: 45,
                      resizeMode: "contain",
                      alignSelf: "center",
                    }}
                  />
                  <Text style={styles.topCardText}>Crypto</Text>
                </TouchableOpacity>
              </LinearGradient>
          </View> 
        </View>


        {/* <View style={{alignItems: 'center',flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10,width:width*0.9, alignSelf: 'center',}}>
          <View style={styles.topRow}>
            {featuresTop.map((item, index) => (
              <LinearGradient
                colors={featureGradients[item.label] || ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.05)"]} 
                 style={item.radius == "right" ? styles.cardRightRadius : item.radius == "left" ? styles.cardLeftRadius : styles.topCard}> 
                <TouchableOpacity onPress={() => onPressNavigation(item.screen)}>
                  {renderIcon(item, 45)}
                  <View style={{alignItems: "center", justifyContent: "center"}}>
                  <Text style={styles.topCardText}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            ))}
          </View> 
        </View>
         */}

        {/* Services Container */}
        <View style={styles.servicesOuterContainer}>
          <LinearGradient
            colors={['#360256', '#6a0dad', '#360256']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.servicesRoundedContainer}
          >
            <ScrollView 
              style={styles.servicesContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.servicesContent}
              bounces={true}
            >
              <View style={styles.servicesGrid}>
                {renderServiceRows()}
              </View>
              
              {/* Footer */}
              {!userDetails && (
                <View style={styles.footerContainer}>
                  <Text style={styles.footerText}>Welcome to OXY Group</Text>
                  <Text style={styles.footerText1}>Please login or register to continue</Text>
              {/* <View style={styles.footerContainer}> */}
                  <View style={styles.buttonContainer}>
                      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.buttonWrapper}>
                        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.button}>
                          <Text style={styles.buttonText}>Login</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')} style={styles.buttonWrapper}>
                        <LinearGradient colors={['#ff6a00', '#ee0979']} style={styles.button}>
                          <Text style={styles.buttonText}>Register</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                  </View>
              
              <Text style={styles.footerText}>100% Trusted Services</Text>
                <Text style={styles.footerText1}>Powered by OXY Group</Text>
              {/* </View> */}
               </View>
              )}
             
            </ScrollView>
          </LinearGradient>
        </View>
         <View style={styles.footerContainerbottom}>
                <Text style={styles.footerText1}>
                  © 2024 OXY Group. All rights reserved.
                </Text> 
              </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a3e',
  },
  mainContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: 15,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 30,
  },
 appTitle: {
    fontSize: SCREEN_WIDTH > 400 ? 36 : 32,
    fontFamily: 'BebasNeue-Regular', // Make sure it's loaded!
    fontWeight: '900',
       color: '#D4AF37',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 20,
    letterSpacing: 2,
    textAlign: 'center',
    fontWeight: '400',
  },
  superAppText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  servicesButton: {
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: 'rgba(26, 26, 62, 0.3)',
    marginBottom: 25,
  },
  servicesButtonText: {
    color: '#D4AF37',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 2,
    textAlign: 'center',
  },
  servicesOuterContainer: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 30,
    width: '100%', 
  },
  servicesRoundedContainer: {
  flex: 1,
  borderRadius: 35,
  paddingTop: 20,
  paddingHorizontal: 15,
  paddingBottom: 15,
  elevation: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.4,
  shadowRadius: 12,

  // 👇 Add these for a bold white border
  borderWidth: 2.5,
  borderColor: '#B8860B',
},
  servicesContainer: {
    flex: 1,
  },
  servicesContent: {
    paddingTop: 15,
    paddingBottom: 10,
  },
  servicesGrid: {
    flex: 1,
    paddingHorizontal: 10,
    // marginTop: 20,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingHorizontal: 2,
    // marginTop: 10,
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: 8,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  iconWrapper: {
    marginBottom: 10,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  textContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 45,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    lineHeight: 14,
  },
  serviceSubtitle: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.85,
    fontWeight: '500',
    lineHeight: 12,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 15,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  footerText: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footerText1: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    width: '100%',
  },
  footerContainerbottom: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 15,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  aboutButton: {
    // backgroundColor: '#D4AF37',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 25,
  },
  aboutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 2,
    textAlign: 'center',
  },
   buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '400',
  },
  suggestionButton: {
    backgroundColor: '#6a0dad',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginHorizontal: 5,
    marginTop: 10,
  },
  suggestionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  topLeftCard:{
    flex: 1,
    // backgroundColor: "#FACC15",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width:'100%',
    borderRadius:25
  },
   topCard: {
    // flex: 1,
    // backgroundColor: "#FACC15",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    width:width*0.14,
  },
  cardRightRadius:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderTopRightRadius:25,
    borderBottomRightRadius:25,
    width:width*0.14,
  },
  cardLeftRadius:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderTopLeftRadius:25,
    borderBottomLeftRadius:25,
    width:width*0.14,
  },
  topCardText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 6,
    textAlign: "center",
  },
   topRow: {
    flexDirection: "row",
    width: '70%',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 25,
  },
  topleft:{
    alignSelf:"flex-end",
    width:'20%',
    marginBottom:20,
    borderWidth:2,
    borderColor:'#D4AF37',
    borderRadius:25,
  }
});

export default HomeScreen;