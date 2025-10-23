import React, { useEffect, useState, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import Toast from 'react-native-toast-message'; // Assuming react-native-toast-message is installed
import * as Icon from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import InterestedModal from '../InterestedModal';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios'; 
import BASE_URL from "../../../../../Config"

const useCases = [
  {
    path: 'assetDetails',
    system_path:'System_AssetDetails',
    title: 'Asset Details',
    description: 'Manage and monitor asset-related case information.',
  },
  {
    path: 'PDCPrinting',
    system_path:'System_PDCPrinting',
    title: 'PDC Printing',
    description: 'Automated post-dated cheque processing.',
  },
  {
    path: 'Installment_Prepayment',
    system_path:"System_InstallmentPrepayment",
    title: 'WF_ Installment Prepayment',
    description: 'Handle early repayments and installment adjustments.',
  },
  {
    path: 'NPAGrading',
    system_path:'System_NPAGrading',
    title: 'WF_ NPA Grading',
    description: 'Non-performing asset classification system.',
  },
  {
    path: 'NPA_Provision',
    system_path:'System_NPAProvisioning', 
    title: 'WF_ NPA Provisioning',
    description: 'Process provisioning for non-performing assets.',
  },
  {
    path: 'Settlements_KnockOff',
    system_path:'System_SettlementsKnockOff',
    title: 'WF_ Settlements - Knock Off',
    description: 'Record settlements and update outstanding balances.',
  },
  {
    path: 'Settlements_Cheque_Processing',
    system_path:'System_SettlementsCheque',
    title: 'WF_ Settlements_Cheque(Receipt_Payment) Processing',
    description: 'Manage cheque-based settlements and payments.',
  },
  {
    path: 'Settlements_Manual_Advice',
    system_path:'System_SettlementsManualAdvice',
    title: 'WF_ Settlements_Manual Advise',
    description: 'Provide manual advisory for payment settlements.',
  },
  {
    path: 'TerminationForeclosure',
    system_path:'System_TerminationForeclosure',
    title: 'WF_ Termination - Foreclosure - Closure',
    description: 'Handle early closure and foreclosure of loans.',
  },
  {
    path: 'FinanceDetailsViewer',
    system_path:'System_FinanceViewer',
    title: 'WF_FMS_ Finance Viewer',
    description: 'View financial metrics and account overviews.',
  },
  {
    path: 'FloatingReview',
    system_path:'System_FloatingReviewProcess',
    title: 'WF_FMS_ Floating Review Process',
    description: 'Manage reviews for floating-rate financial products.',
  },
  {
    path: 'SettlementReciepts', 
   system_path:"System_SettlementsReceipts",
    title: 'WF_FMS_ Settlements - Receipts',
    description: 'Automated receipt settlement processing',
  },
  {
    path: 'SettlementsPayments',
    system_path:"System_SettlementsPayments",
    title: 'WF_FMS_ Settlements_Payment',
    description: 'Track and process all types of settlement payments.',
  },
  {
    path: 'SettlementsWaiveOff',
    system_path:"System_SettlementsWaiveOff",
    title: 'WF_FMS_ Settlements_Waive Off',
    description: 'Manage waived-off cases and financial adjustments.',
  },
  {
    path: 'EodBodDisplay',
    system_path:"System_EODBODDisplay",
    title: 'WF_FMS_EOD_ BOD',
    description: 'Run end-of-day and beginning-of-day operations.',
  },
  {
    path: 'AccountClosureDisplay',
    system_path:'System_AccountClosure',
    title: 'Work Flow Closure_Account Closure',
    description: 'Close accounts after settlement or full repayment.',
  },
  {
    path: 'ViewAccountStatusDisplay',
    system_path:'System_ViewAccountStatus',
    title: 'Work Flow Closure_View Account Status',
    description: 'Check and track account lifecycle and changes.',
  },
  {
    path: 'DocumentMasterDisplay',
    system_path:'System_DocumentMaster',
    title: 'Work Flow_Document Master',
    description: 'Manage and define all finance-related documentation.',
  }, 
  {
    path: 'FinanceRescheduleDisplay',
    system_path:'System_BulkPrepayment',
    title: 'Work Flow_Finance Rescheduling_Bulk Prepayment',
    description: 'Handle bulk prepayment processing and schedules.',
  },
  {
    path: 'FinanceReschedulingDueDateDisplay',
    system_path:'System_ReschedulingDueDate',
    title: 'Work Flow_Finance Rescheduling_Due Date Change',
    description: 'Edit due dates for finance repayments.',
  },
  {
    path: 'FinanceReschedulingProfitRateChange',
    system_path:'System_ProfitRateChange',
    title: 'Work Flow_Finance Rescheduling_Profit Rate Change',
    description: 'Adjust profit rates for financial products.',
  },
    {
    path: 'FinanceReschedulingTenureChange',
    system_path:"System_ReschedulingTenureChange",
    title: 'Work Flow_Finance Rescheduling_Tenure Change',
    description: 'Modify loan tenures and repayment terms.',
  },  
  {
    path: 'PostDisbursalEdit',
    system_path:"System_PostDisbursalEdit",
    title: 'Work Flow_Post Disbursal Edit',
    description: 'Amend disbursed loans for corrections or changes.',
  },  
  {
    path: 'RepaymentDeferralConstitutionBased',
    system_path:"System_DeferralConstitutionWise",
    title: 'Work Flow_Repayment Deferral_Constitution Wise Deferral',
    description: 'Manage repayment deferrals by constitution types',
  },  
  {
    path: 'RepaymentDeferralFinanceWise',
    system_path:"System_DeferralFinanceWise",
    title: 'Work Flow_Repayment Deferral_Finance Wise Deferral',
    description: 'Apply deferrals based on finance criteria.',
  },  {
    path: 'RepaymentDeferralBatchWise',
    system_path:'System_DeferralPortfolio',
    title: 'Work Flow_Repayment Deferral_Portfolio Wise Deferral',
    description: 'Initiate deferrals across loan portfolios.',
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

const FMSDashboard = () => {
  const navigation = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);
      const [modalVisible, setModalVisible] = useState(false);
    
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
    const userId = await AsyncStorage.getItem('userId');
    await AsyncStorage.setItem('submitclicks', 'true');

    if (userId) {
      navigation.navigate('GLMSOpenSourceHubJobStree');
    } else {
      Toast.show({
        type: 'info',
        text1: 'Please login to submit your interest.',
      });
      await AsyncStorage.setItem('redirectPath', '/main/services/a6b5/glms-open-source-hub-job-stree');
      navigation.navigate('WhatsAppRegister');
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

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10); // Note: React Native ScrollView uses onScroll prop
    // For simplicity, assuming web-like behavior; in RN, attach to ScrollView
    console.log('Analytics event: FMS Use Case Page View');
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
  
      {/* Main Section */}
      <ScrollView style={styles.main}>
        <View style={styles.section}>
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
          <Text style={styles.h1}>Financial Management System (FMS)</Text>
          <Text style={styles.description}>
            The <Text style={styles.bold}>Financial Management System (FMS)</Text> is a comprehensive solution that helps organizations manage financial operations with precision. From planning, budgeting, and accounting to real-time financial reporting, FMS offers streamlined workflows and data-driven insights that support strategic decisions, enhance compliance, and foster long-term growth.
          </Text>
        </View>

        {/* Use Cases Grid */}
        <View style={styles.cardGrid}>
          {useCases.map(({ path, title, description ,system_path}) => (
            <UseCaseCard
              key={path}
              title={title}
              description={description}
              onBusinessClick={() => navigation.navigate(path)}
              onSystemClick={() => navigation.navigate(system_path)}
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
      {/* <Toast /> */}
    </View>
  );
};

export default FMSDashboard;