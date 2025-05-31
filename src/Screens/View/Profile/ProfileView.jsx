import React,{useCallback} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar,Platform,Alert,Dimensions,Modal } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, Feather,MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import axios from 'axios';
import * as Clipboard from "expo-clipboard";
import BASE_URL from "../../../../Config";
import { useSelector } from "react-redux";
import CoinsTransferrModal from "../../View/MyCrypto/CoinsTransferrModal";                  
const jsonData = require('../../../../app.json');

const { width } = Dimensions.get('window');

export default function ProfileSettings({ navigation }) {
    const [version, setVersion] = React.useState('');

  // App version info
 React.useEffect(() => {
    if(Platform.OS === 'ios'){
      setVersion(jsonData.expo.ios.buildNumber);
    }else{
      setVersion(jsonData.expo.android.versionCode.toString());
    }
 },[]);

  const userData = useSelector((state) => state.counter);
   const token = userData.accessToken;
   const customerId = userData.userId;

  // Updated settings menu items with new options
  const menuItems = 
    [
      { 
        id: 1, 
        icon: 'map-pin', 
        type: 'Feather', 
        label: 'Address', 
        showArrow: true,
        navigation: "Saved Address",
        gradient: ['#36D1DC', '#5B86E5'] // teal to blue, location-friendly
      },
      { 
        id: 2, 
        icon: 'user-plus', 
        type: 'Feather', 
        label: 'Invite', 
        showArrow: true,
        navigation: "Invite a friend", 
        gradient: ['#7B61FF', '#4D2CFF'] // inviting purple
      },
      { 
        id: 3, 
        icon: 'refresh-cw', 
        type: 'Feather', 
        label: 'Referral History',
        navigation: "Referral History",  
        showArrow: true,
        gradient: ['#00C9FF', '#92FE9D'] // fresh and clean, reflects activity
      },
      { 
        id: 4, 
        icon: 'hand-coin', 
        type: 'MaterialCommunityIcons', 
        label: 'My Crypto', 
        showArrow: true,
        navigation: 'View BMVcoins History',
        gradient: ['#00B4DB', '#0083B0'] 
      },
      { id: 5, type: 'divider' },
      { 
        id: 6, 
        icon: 'credit-card', 
        type: 'Feather', 
        label: 'Subscription',
        navigation: "Subscription", 
        showArrow: true,
        gradient: ['#F7971E', '#FFD200'] // gold/yellow hues, finance-friendly
      },
      { 
        id: 7, 
        icon: 'help-circle', 
        type: 'Feather', 
        label: 'FAQ\'s', 
        showArrow: true,
        navigation: "Terms and Conditions",
        gradient: ['#36D1DC', '#5B86E5'] // consistent with helpful/support tone
      },
      { 
        id: 8, 
        icon: 'phone', 
        type: 'Feather', 
        label: 'Contact Us', 
        showArrow: true,
        navigation: 'Write To Us',
        gradient: ['#00B4DB', '#0083B0'] // professional blue gradient
      },
      { id: 9, type: 'divider' },
      {
        id: 10, 
        icon: 'user-x', 
        type: 'Feather', 
        label: 'DeActivate Account', 
        showArrow: true,
        navigation: 'Active',
        gradient: ['#FF4B2B', '#FF416C'] // serious red-pink for account closure
      },
      {
        id: 11,
        icon: 'user-minus',
        type: 'Feather',
        label: 'Delete Account',
        showArrow: true,
        navigation: 'Account Deletion',
        gradient: ['#8B0000', '#B22222'] // deep red tones for account deletion
      }
      
    ];
    

  const [formData, setFormData] = React.useState({});
  const [profileLoader, setProfileLoader] = React.useState(false);
  const [chainId, setChainId] = React.useState("");
  const [coin, setCoin] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [infoModalVisible, setInfoModalVisible] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [bmvCoinModalVisible, setBmvCoinModalVisible] = React.useState(false);

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase();
  };

  // React.useEffect(() => {
  //   getProfile();
  //   profile()
  // }, []);


 useFocusEffect(
    useCallback(() => {
      getProfile();
    profile();
    }, [])
  );

   const handleLogout = () => {
      Alert.alert(
        "Logout Confirmation",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Logout cancelled"),
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

    const profile = async () => {
      console.log("userId",customerId);
      
      if (userData) {
        try {
          const response = await axios({
            method: "get",
            url: BASE_URL + `user-service/getProfile/${customerId}`,
            // headers: {
            //   Authorization: `Bearer ${userData.accessToken}`,
            // },
          });
          console.log("get profile call response",response);
          
          setChainId(response.data.multiChainId);
          setCoin(response.data.coinAllocated);
        } catch (error) {
          console.error("Error fetching profile:", error.response);
        }
      }
    };

  const getProfile = async () => {
    console.log("profile get call response");
    setProfileLoader(true);
    try {
      const response = await axios({
        method: "GET",
        url:
          BASE_URL +
          `user-service/customerProfileDetails?customerId=${customerId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileLoader(false);
      if (response.status === 200) {
        // setUser(response.data);
        console.log("response", response.data);
        
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          whatsappNumber: response.data.whatsappNumber,
          backupPhone: response.data.alterMobileNumber.trim(" "),
          phone: response.data.mobileNumber,
          status: response.data.whatsappVerified,
        });
      }
    } catch (error) {
      setProfileLoader(false);
      console.error("ERROR", error.response);
    } finally {
      setProfileLoader(false);
    }
  };

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

  // Render the correct icon based on type
  const renderIcon = (item) => {
    return (
      <LinearGradient
        colors={item.gradient || ['#4C6FFF', '#6B8DFF']}
        style={styles.iconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {item.type === 'Ionicons' && <Ionicons name={item.icon} size={16} color="#fff" />}
        {item.type === 'FontAwesome5' && <FontAwesome5 name={item.icon} size={16} color="#fff" />}
        {item.type === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={item.icon} size={16} color="#fff" />}
        {item.type === 'Feather' && <Feather name={item.icon} size={16} color="#fff" />}
      </LinearGradient>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="always">
        {/* Profile Header */}
        <View style={styles.profileHeader}>
        <LinearGradient
            colors={['#8A2BE2', '#4169E1']}
            style={styles.avatarContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>{getInitials(formData.firstName? formData.firstName : "")}</Text>
          </LinearGradient>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{formData.firstName? formData.firstName : ""} {formData.lastName? formData.lastName : ""}</Text>
            <Text style={styles.profileEmail}>{formData.email}</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={() => {navigation.navigate('Profile Edit');}}>
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              style={styles.editButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {userData && (
              <View style={styles.userInfoCard}>
                <View style={styles.userInfoHeader}>
                <View style={styles.userInfoHeader}>
                  <FontAwesome5 name="user-circle" size={20} color="#4A148C" />
                  <Text style={styles.userInfoTitle}>Account Information</Text>
                </View>
                <View style={{flex:1,alignItems:"flex-end"}}>
                  <TouchableOpacity
                    style={styles.transferButton}
                    onPress={() => setBmvCoinModalVisible(true)}
                  >
                    <Text style={styles.transferButtonText}>Transfer Coins</Text>
                  </TouchableOpacity>
                </View>
                </View>
                <View style={styles.userInfoDivider} />
                
                <View>
                  <View style={styles.blockchainIdContainer}>
                    <View>
                    <Text style={styles.infoLabel}>Blockchain ID:<Text style={styles.infoValue}>{truncateId(chainId)}</Text></Text>
                    </View>
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
                    <View style={{flexDirection:"row",alignItems:"center",width:width*0.4}}>
                     <Text style={styles.infoLabel1}>BMV Coins:</Text>
                    <View style={styles.coinBadge}>
                      <Text style={styles.coinValue}>{coin}</Text>
                    </View>
                    </View>
                    <TouchableOpacity
                      style={styles.infoButton}
                      onPress={() => setInfoModalVisible(true)}
                    >
                      <MaterialIcons name="info-outline" size={24} color="#4A148C" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

        {/* Settings Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => {
            if (item.type === 'divider') {
              return <View key={item.id} style={styles.divider} />;
            }
            
            return (
              <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => {navigation.navigate(item.navigation);}}>
                <View style={styles.menuItemLeft}>
                  {renderIcon(item)}
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <View style={styles.arrowContainer}>
                  <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={['#F56565', '#E53E3E']}
            style={styles.logoutButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Feather name="log-out" size={18} color="#fff" style={styles.logoutIcon} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Version Information */}
        <View style={styles.versionContainer}>
          <Feather name="code" size={14} color="#718096" style={styles.versionIcon} />
          <Text style={styles.versionText}>Version {version}</Text>
        </View>
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
                <CoinsTransferrModal visible={bmvCoinModalVisible} onClose={()=>setBmvCoinModalVisible(false)}   availableCoins={coin} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    marginBottom:60
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  profileHeader: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  profileEmail: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  editButton: {
    marginTop: 16,
    width: '50%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  editButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  editButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  menuContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#2D3748',
    fontWeight: '500',
  },
  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginVertical: 10,
    marginHorizontal: 12,
  },
  logoutButton: {
    marginTop: 24,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutButtonGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutIcon: {
    marginRight: 8,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 10,
  },
  versionText: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '400',
  },
  versionIcon: {
    marginRight: 6,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
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
    overflow: "hidden",
    width:width*0.9,
    alignSelf:"center",
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
  blockchainIdContainer: {
    marginTop:10,
    flexDirection: "row",
    justifyContent:"space-between",
    marginBottom:5
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#757575",
    width: width*0.4,
    justifyContent:"flex-start",
    alignItems:"flex-start",
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
    alignItems:"flex-end",
    justifyContent:"flex-end",
    // marginLeft:width/3
  },
  copiedButton: {
    backgroundColor: "#4CAF50",
  },
  coinContainer: {
    // marginTop:50,
    flexDirection: "row",
  justifyContent:"space-between"
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
    alignItems:"flex-end",
    justifyContent:"flex-end",
    // marginLeft:width/2.5
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
  transferButton: {
    backgroundColor: "#4A148C",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  transferButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    // paddingVertical: 8,
    width:width*0.2,
  },
});