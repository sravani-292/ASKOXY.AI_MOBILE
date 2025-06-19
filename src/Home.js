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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import axios from 'axios';
import BASE_URL from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { AccessToken } from '../Redux/action/index';
import Logout from './Authorization/Logout';

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
      title: 'CA | CS',
      subtitle: 'SERVICES',
      icon: 'calculator-outline',
      gradientColors: ['#F8BBD0', '#F06292'],
      screenName: 'CA SERVICES',
    },
    {
      id: 3,
      title: 'GOLD | SILVER',
      subtitle: 'DIAMONDS',
      icon: 'diamond-outline',
      gradientColors: ['#FFB74D', '#FF8A65'],
      screenName: 'GOLD, SILVER & DIAMONDS',
    },
    {
      id: 4,
      title: 'Loans &',
      subtitle: 'Investments',
      icon: 'card-outline',
      gradientColors: ['#FFCDD2', '#E57373'],
      screenName: 'OxyLoans',
    },
    {
      id: 5,
      title: 'NYAYA GPT',
      subtitle: 'Legal AI',
      icon: 'scale-outline',
      gradientColors: ['#8E24AA', '#7B1FA2'],
      screenName: 'NyayaGPTScreen',
    },
    {
      id: 6,
      title: 'FRACTIONAL',
      subtitle: 'OWNERSHIP',
      icon: 'business-outline',
      gradientColors: ['#A8E6CF', '#56C596'],
      screenName: 'FractionalScreen',
    },
    {
      id: 7,
      title: 'RICE 2 ROBO',
      subtitle: 'ECommerce',
      icon: 'storefront-outline',
      gradientColors: ['#EC407A', '#E91E63'],
      screenName: 'Rice Products',
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

  const dispatch = useDispatch();
  const [loginModal, setLoginModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userData, setUserData] = React.useState(null);

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

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#360256" 
        translucent={false}
      />
      
      <LinearGradient
        colors={['#6a0dad', '#360256', '#6a0dad']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mainContainer}
      >
         <View>
                  <Logout/>
         </View>
        {/* Header */}
        <SafeAreaView style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.appTitle}>ASKOXY.AI</Text>
            <Text style={styles.appSubtitle}>AI-Z Marketplace</Text>

            {/* Uncomment if you want to display the Super App text */}
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
            
            <TouchableOpacity style={styles.servicesButton} onPress={() => navigation.navigate('Services')}>
              <Text style={styles.servicesButtonText}>OUR SERVICES</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

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
    </View>
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
});

export default HomeScreen;