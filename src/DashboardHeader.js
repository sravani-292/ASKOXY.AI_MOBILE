import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform, 
  Dimensions 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HORIZONTAL_PADDING = 20;
const { width, height } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

const DashboardHeader = ({ userData }) => {
  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.headerContent}>
        {/* App Title */}
        <Text style={styles.appTitle}>ASKOXY.AI</Text>
        <Text style={styles.appSubtitle}>AI-Z Marketplace</Text>
        
        {/* Welcome Message */}
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>
            Welcome,{" "}
            {userData?.firstName
              ? `${userData.firstName} ${userData.lastName || ""}`
              : "Guest"}
            !
          </Text>
          <Text style={styles.subtitle}>Explore our services below</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DashboardHeader;

const styles = StyleSheet.create({
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
    fontFamily: 'BebasNeue-Regular', // Make sure this font is loaded in your project
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
  welcomeBox: {
    marginTop: 6,
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