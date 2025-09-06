import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    try {
      console.log('Menu button pressed');
      
      // Debug: Check navigation state
      const navState = navigation.getState();
      console.log('Navigation state:', navState);
      
      // Debug: Check if we have a drawer parent
      const parent = navigation.getParent();
      console.log('Parent navigator:', parent?.getState()?.type);
      
      // Try to open drawer
      if (parent && parent.getState()?.type === 'drawer') {
        console.log('Opening drawer via parent');
        parent.dispatch(DrawerActions.openDrawer());
      } else {
        // Alternative: Try direct dispatch
        console.log('Trying direct drawer dispatch');
        navigation.dispatch(DrawerActions.openDrawer());
      }
      
    } catch (error) {
      console.error('Error opening drawer:', error);
      Alert.alert('Debug Info', `Error: ${error.message}`);
    }
  };

  const handleRefresh = () => {
    Alert.alert('Refresh', 'Refreshing content...');
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={handleMenuPress}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={26} color="#1f2937" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Get Plus</Text>
          <View style={styles.plusIconContainer}>
            <Ionicons name="add" size={18} color="#8b5cf6" />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={26} color="#1f2937" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop:50,
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
    zIndex: 1000,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    minHeight: 60,
  },

  menuButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3e8ff',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    letterSpacing: -0.3,
    marginRight: 6,
  },

  plusIconContainer: {
    backgroundColor: '#f3e8ff',
    borderRadius: 8,
    padding: 4,
    marginLeft: 4,
  },

  refreshButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});

export default Header;