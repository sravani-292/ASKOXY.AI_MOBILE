import React, { useEffect, useState, memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import * as Icon from '@expo/vector-icons';
import styles from './styles';
// import { message } from 'antd'; // Note: antd is not typically used in React Native; consider an alternative

const useCases = [
  {
    path: 'AllocationHoldUseCaseBusiness',
    system_path:'System_AllocationHold',
    title: 'Allocation of Delinquent Cases_Allocation Hold',
    description: 'Place delinquent cases on hold based on predefined rules.',
  },
  {
    path: 'DefineAllocationContract',
    system_path:'System_DefineAllocation',
    title: 'Allocation of Delinquent Cases_Define Allocation contract',
    description: 'Upload and manage contracts for delinquent case allocation.',
  },
  {
    path: 'ManualAllocationUseCaseBusiness',
    system_path:'System_ManualAllocation',
    title: 'Allocation of Delinquent Cases_Manual Allocation',
    description: 'Manually assign delinquent cases to collection agents.',
  },
  {
    path: 'ManualReAllocationUseCaseBusiness',
    system_path:'System_ManualReallocation',
    title: 'Allocation of Delinquent Cases_Manual Reallocation',
    description: 'Reassign cases based on collector availability and performance.',
  },
  {
    path: 'BeginingDayProcess',
    system_path:'System_BeginingDayProcess',
    title: 'Beginning of Day Process',
    description: 'Initialize and prepare daily queue for collections.',
  },


  {
    path: 'ClassificationDefineQueue',
    system_path:'System_DefineQueue',
    title: 'Classification of Delinquent Cases - Define Queue',
    description: 'Create and manage delinquent case queues.',
  },
  {
    path: 'ContractRecording',
    system_path:'System_ContractRecord',
    title: 'Contact Recording',
    description: 'Record contact attempts and customer communication logs.',
  },
  {
    path: 'LegalCollections',
    system_path:'System_LegalCollection',
    title: 'Legal Collections Workflow',
    description: 'Initiate and track legal recovery processes.',
  },
  {
    path: 'PrioritizeQueue',
    system_path:'System_PrioritizeQueue',
    title: 'Prioritizing a Queue',
    description: 'Set priority for follow-up based on risk and aging.',
  },
  {
    path: 'CommunicationMapping',
    system_path:'System_CommunicationMapping',
    title: 'Queue Communication Mapping',
    description: 'Assign communication templates to specific queues.',
  },
  {
    path: 'QueueCuring',
    system_path:'System_QueueCuring',
    title: 'Queue Curing',
    description: 'Monitor and track cured accounts from delinquency.',
  },
  {
    path: 'WorkPlan',
    system_path:'System_WorkPlan',
    title: 'Collector Work Plan',
    description: 'Design and track daily plans for collection agents.',
  },
];

// Memoized Use Case Card for performance
const UseCaseCard = memo(({ title, description, onBusinessClick, onSystemClick }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      <View style={styles.cardButtonContainer}>
        <TouchableOpacity style={styles.cardButton} onPress={onBusinessClick}>
          <Text style={styles.cardButtonText}>Business Use Case</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cardButton, styles.systemButton]} onPress={onSystemClick}>
          <Text style={styles.cardButtonText}>System Use Case</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const CMSDashboard = () => {
  const navigation = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleInterest = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await AsyncStorage.setItem('submitclicks', 'true');

      if (userId) {
        navigation.navigate('GLMSOpenSourceHubJobStree');
      } else {
        // Replace antd's message with a React Native alternative like Toast or Alert
        // For example, using Alert:
        Alert.alert('Warning', 'Please login to submit your interest.');
        await AsyncStorage.setItem('redirectPath', '/main/services/a6b5/glms-open-source-hub-job-stree');
        navigation.navigate('WhatsAppRegister');
      }
    } catch (error) {
      console.error('Error handling interest:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  }, [navigation]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleLogoClick = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const handleGLMSClick = useCallback(() => {
    navigation.navigate('GLMS');
  }, [navigation]);

  // Handle scroll events in ScrollView
  const handleScroll = useCallback((event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 10);
  }, []);

  useEffect(() => {
    // Google Analytics placeholder
    // Use a React Native analytics library like @react-native-firebase/analytics
    console.log('Analytics event: CMS Use Case Page View');
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* Add your header component here if needed */}

      {/* Main Section */}
      <ScrollView
        style={styles.main}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Adjust for performance; 16ms is a good default
      >
        <View style={styles.section}>
          <Text style={styles.h1}>Collection Management System (CMS)</Text>
          <Text style={styles.description}>
            The <Text style={styles.bold}>Collection Management System (CMS)</Text> is an intelligent platform that empowers financial institutions to manage and recover overdue payments efficiently. It streamlines the entire collection workflow — from case assignment and segmentation to customer contact and legal escalation.
            {'\n\n'}
            CMS boosts recovery rates by prioritizing critical accounts, automating follow-ups, and offering real-time visibility into collection activities. The result? Lower default risks, improved compliance, and better customer experience across every recovery stage.
          </Text>
        </View>

        {/* Use Case Cards */}
        <View style={styles.cardGrid}>
          {useCases.map((useCase) => (
            <UseCaseCard
              key={useCase.path}
              title={useCase.title}
              description={useCase.description} 
              onBusinessClick={() => navigation.navigate(useCase.path)}
              onSystemClick={() => navigation.navigate(useCase.system_path)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          &copy; {new Date().getFullYear()} Global Lending Management Solutions. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

export default CMSDashboard;