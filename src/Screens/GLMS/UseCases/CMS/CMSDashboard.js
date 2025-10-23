import React, { useEffect, useState, memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Icon from '@expo/vector-icons';
import styles from './styles';
import InterestedModal from '../InterestedModal';
import axios from 'axios';
import { useSelector } from 'react-redux';
import BASE_URL from "../../../../../Config"


const useCases = [
  {
    path: 'AllocationHoldUseCaseBusiness',
    system_path: 'System_AllocationHold',
    title: 'Allocation of Delinquent Cases_Allocation Hold',
    description: 'Place delinquent cases on hold based on predefined rules.',
  },
  {
    path: 'DefineAllocationContract',
    system_path: 'System_DefineAllocation',
    title: 'Allocation of Delinquent Cases_Define Allocation contract',
    description: 'Upload and manage contracts for delinquent case allocation.',
  },
  {
    path: 'ManualAllocationUseCaseBusiness',
    system_path: 'System_ManualAllocation',
    title: 'Allocation of Delinquent Cases_Manual Allocation',
    description: 'Manually assign delinquent cases to collection agents.',
  },
  {
    path: 'ManualReAllocationUseCaseBusiness',
    system_path: 'System_ManualReallocation',
    title: 'Allocation of Delinquent Cases_Manual Reallocation',
    description: 'Reassign cases based on collector availability and performance.',
  },
  {
    path: 'BeginingDayProcess',
    system_path: 'System_BeginingDayProcess',
    title: 'Beginning of Day Process',
    description: 'Initialize and prepare daily queue for collections.',
  },
  {
    path: 'ClassificationDefineQueue',
    system_path: 'System_DefineQueue',
    title: 'Classification of Delinquent Cases - Define Queue',
    description: 'Create and manage delinquent case queues.',
  },
  {
    path: 'ContractRecording',
    system_path: 'System_ContractRecord',
    title: 'Contact Recording',
    description: 'Record contact attempts and customer communication logs.',
  },
  {
    path: 'LegalCollections',
    system_path: 'System_LegalCollection',
    title: 'Legal Collections Workflow',
    description: 'Initiate and track legal recovery processes.',
  },
  {
    path: 'PrioritizeQueue',
    system_path: 'System_PrioritizeQueue',
    title: 'Prioritizing a Queue',
    description: 'Set priority for follow-up based on risk and aging.',
  },
  {
    path: 'CommunicationMapping',
    system_path: 'System_CommunicationMapping',
    title: 'Queue Communication Mapping',
    description: 'Assign communication templates to specific queues.',
  },
  {
    path: 'QueueCuring',
    system_path: 'System_QueueCuring',
    title: 'Queue Curing',
    description: 'Monitor and track cured accounts from delinquency.',
  },
  {
    path: 'WorkPlan',
    system_path: 'System_WorkPlan',
    title: 'Collector Work Plan',
    description: 'Design and track daily plans for collection agents.',
  },
];

// Memoized Use Case Card
const UseCaseCard = memo(({ title, description, onBusinessClick, onSystemClick }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    <View style={styles.cardButtonContainer}>
      <TouchableOpacity style={styles.cardButton} onPress={onBusinessClick}>
        <Text style={styles.cardButtonText}>Business Use Case</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.cardButton, styles.systemButton]}
        onPress={onSystemClick}
      >
        <Text style={styles.cardButtonText}>System Use Case</Text>
      </TouchableOpacity>
    </View>
  </View>
));

const CMSDashboard = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);
  const userData = useSelector((state) => state.counter);

  const token = userData?.accessToken;
  const customerId = userData?.userId;

  // Function to check participation
  useFocusEffect(
    useCallback(()=>{
      AlreadyParticipatedfunc()
    },[])
  )
  const AlreadyParticipatedfunc = () => {
    axios({
      method: 'post',
      url: `${BASE_URL}marketing-service/campgin/allOfferesDetailsForAUser`,
      data: {
        userId: customerId,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const participated = response?.data?.some(
          (item) =>
            item?.askOxyOfers?.trim().toUpperCase() ===
            'GLMS OPEN SOURCE HUB & JOB STREET'
        );
        setAlreadyParticipated(participated);
      })
      .catch((error) => {
        console.log('Error checking participation:', error?.response || error);
      });
  }

  useEffect(() => {
    if (customerId && token) {
      AlreadyParticipatedfunc();
    }
  }, [customerId, token, AlreadyParticipatedfunc]);

  const handleInterest = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      await AsyncStorage.setItem('submitclicks', 'true');

      if (userId) {
        navigation.navigate('GLMSOpenSourceHubJobStree');
      } else {
        Alert.alert('Warning', 'Please login to submit your interest.');
        await AsyncStorage.setItem(
          'redirectPath',
          '/main/services/a6b5/glms-open-source-hub-job-stree'
        );
        navigation.navigate('WhatsAppRegister');
      }
    } catch (error) {
      console.error('Error handling interest:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.main} scrollEventThrottle={16}>
        {/* Conditionally Render Button */}
        {alreadyParticipated ? (
          <View style={[styles.openButton, { backgroundColor: '#ddd' }]}>
            <Text style={[styles.openButtonText, { color: '#555' }]}>
              Already Participated
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.openButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.openButtonText}>I'm Interested</Text>
          </TouchableOpacity>
        )}

        <InterestedModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          func={()=>AlreadyParticipatedfunc()}
        />

        <View style={styles.section}>
          <Text style={styles.h1}>Collection Management System (CMS)</Text>
          <Text style={styles.description}>
            The <Text style={styles.bold}>Collection Management System (CMS)</Text> is an
            intelligent platform that empowers financial institutions to manage
            and recover overdue payments efficiently. It streamlines the entire
            collection workflow — from case assignment and segmentation to
            customer contact and legal escalation.
            {'\n\n'}
            CMS boosts recovery rates by prioritizing critical accounts,
            automating follow-ups, and offering real-time visibility into
            collection activities. The result? Lower default risks, improved
            compliance, and better customer experience across every recovery
            stage.
          </Text>
        </View>

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

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          &copy; {new Date().getFullYear()} Global Lending Management Solutions.
          All rights reserved.
        </Text>
      </View>
    </View>
  );
};

export default CMSDashboard;
