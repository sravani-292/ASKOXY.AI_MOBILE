import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar,Platform,Alert } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from "../../../../Config";
import { useSelector } from "react-redux";
const jsonData = require('../../../../app.json');

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
  const menuItems = [
    { 
      id: 1, 
      icon: 'map-pin', 
      type: 'Feather', 
      label: 'Address', 
      showArrow: true,
      navigation: "Saved Address",
      gradient: ['#FF7676', '#FF4848']
    },
    { 
      id: 2, 
      icon: 'user-plus', 
      type: 'Feather', 
      label: 'Invite', 
      showArrow: true,
      navigation: "Invite a friend", 
      gradient: ['#7B61FF', '#5A3FFF']
    },
    { 
        id: 3, 
        icon: 'refresh-cw', 
        type: 'Feather', 
        label: 'Referral History',
        navigation: "Referral History",  
        showArrow: true,
        gradient: ['#6673FF', '#4D5DFF']
      },
    { id: 4, type: 'divider' },
    { 
      id: 5, 
      icon: 'credit-card', 
      type: 'Feather', 
      label: 'Subscription',
      navigation: "Subscription", 
      showArrow: true,
      gradient: ['#42C2FF', '#00A3FF']
    },
    { 
      id: 6, 
      icon: 'help-circle', 
      type: 'Feather', 
      label: 'FAQ\'s', 
      showArrow: true,
      navigation: "Terms and Conditions",
      gradient: ['#FF5C5C', '#FF3E3E']
    },
    { 
        id: 7, 
        icon: 'phone', 
        type: 'Feather', 
        label: 'Contact Us', 
        showArrow: true,
        navigation: 'Write To Us',
        gradient: ['#FF9D66', '#FF7D3D']
      },
  ];

  const [formData, setFormData] = React.useState({});
  const [profileLoader, setProfileLoader] = React.useState(false);

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase();
  };

  React.useEffect(() => {
    getProfile();
  }, []);

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
      console.error("ERROR", error);
    } finally {
      setProfileLoader(false);
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
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
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
});