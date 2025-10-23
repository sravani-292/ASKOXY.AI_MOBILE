import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import InterestedModal from '../InterestedModal';
import axios from 'axios';
import { useSelector } from 'react-redux';
import BASE_URL from "../../../../../Config"
import { useFocusEffect } from '@react-navigation/native';
// import styles from './styles';
const {height,width}=Dimensions.get('window')

const useCases = [
  {
    path: 'CustomerIdCreation',
    system_path:'System_CustomerIdCreation',
    title: 'Customer ID Creation',
    description: 'Generate unique customer ID and link it to the Core Banking System (CBS)',
  },
  {
    path: 'LinkingOfCoApplicantGuarantorBusiness',
    system_path:'LinkingOfCoapplicant',
    title: 'Co-applicant & Guarantor Linking',
    description: 'Upload and link KYC/supporting documents for co-applicants or guarantors',
  },
  {
    path: 'LinkingOfCustomerIdToLoanBusiness',
    system_path:'LoanLinkingCustomerId',
    title: 'Customer ID to Loan Linking',
    description: 'Map customer ID to the loan application for tracking and verification',
  },
  {
    path: 'LoanAppraisal',
    system_path:'System_LoanAppraisal',
    title: 'Loan Appraisal System',
    description: 'Perform customer credit scoring and financial appraisal',
  },
  {
    path: 'LoanAssessmentWorkflow',
    system_path:'System_LoanAssessment',
    title: 'Loan Assessment Workflow',
    description: 'Capture loan application and perform preliminary checks',
  },
  {
    path: 'Recommendation_SanctionLetter',
    system_path:'System_Recommendation',
    title: 'Recommendation & Sanction Letter',
    description: 'Review loan details and generate sanction recommendations',
  },
  {
    path: 'RiskAnalysis',
    system_path:'System_RiskAnalysis',
    title: 'Risk Analysis Documentation',
    description: 'Upload signed agreements and perform risk validation',
  },
  {
    path: 'Sanction&CustomerResponse',
    system_path:'System_Saction_CustomerResponse',
    title: 'Sanction & Customer Response Tracking',
    description: 'Track sanction status and customer acknowledgments',
  },
  {
    path: 'RepaymentSchedule',
    system_path:'System_RepaymentSchedule',
    title: 'Repayment Schedule Generation',
    description: 'Generate EMI schedule and repayment tracking data',
  },
  {
    path: 'Terms&ConditionsApprovals',
    system_path:'System_Terms_Conditions',
    title: 'Terms & Conditions Approval',
    description: 'Approve and manage loan terms and condition agreements',
  },
  {
    path: 'CaptureAssetDetails',
    system_path:'System_CapturingAssetDetails',
    title: 'Asset Details Capture',
    description: 'Record asset details offered as collateral or security',
  },
  {
    path: 'CheckLimitBusiness',
    system_path:'System_CheckLimit',
    title: 'Profile Update & Limit Check',
    description: 'Update customer info and check applicable credit limits',
  },
  {
    path: 'NetWorthAnalysis',
    system_path:'System_NetWorthAnalysis',
    title: 'Account Closure & Net Worth Analysis',
    description: 'Initiate account closure and analyze party\'s net worth',
  },
];

// Reusable UseCaseCard component
const UseCaseCard = ({ title, description, onSystemClick,onBusinessClick }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    <View style={styles.cardButtonContainer}>
      <TouchableOpacity style={styles.cardButtonBusiness} onPress={onBusinessClick}>
        <Text style={styles.cardButtonText}>Business Use Case</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cardButtonSystem} onPress={onSystemClick}>
        <Text style={styles.cardButtonText}>System Use Case</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const LOSDashboard = ({ navigation }) => {
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

// const navigation=useNavigation()
  const handleInterest = useCallback(() => {
    const userId = null; // Simulate localStorage.getItem("userId") - not available in React Native
    if (userId) {
      navigation.navigate('GLMSOpenSourceHub'); // Placeholder screen
    } else {
      Alert.alert(
        'Login Required',
        'Please login to submit your interest.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('WhatsAppRegister'), // Placeholder screen
          },
        ]
      );
    }
  }, [navigation]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleLogoClick = useCallback(() => {
    navigation.navigate('LOSDashboard'); // Navigate to self for home
  }, [navigation]);

  const handleGLMSClick = useCallback(() => {
    navigation.navigate('GLMS Home'); // Placeholder screen
  }, [navigation]);

  useEffect(() => {
    const onScroll = (e) => {
      const scrollY = e.nativeEvent.contentOffset.y;
      setIsScrolled(scrollY > 10);
    };
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={[styles.header, isScrolled && styles.headerScrolled]}>
        <TouchableOpacity onPress={handleLogoClick} style={styles.logoContainer}>
          <Text style={styles.logoText}>Askoxy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMobileMenu} style={styles.menuButton}>
          <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={24} color="#4B5563" />
        </TouchableOpacity>
      </View> */}

      {/* Mobile Menu Modal */}
      <Modal
        visible={mobileMenuOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleMobileMenu}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={handleGLMSClick}>
              <Text style={styles.modalButtonText}>Go To GLMS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleInterest}>
              <Text style={styles.modalButtonText}>I'm Interested</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={toggleMobileMenu}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      <ScrollView style={styles.main}>
        <View style={styles.introSection}>
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
          <Text style={styles.introTitle}>Loan Origination System (LOS)</Text>
          <Text style={styles.introText}>
            The <Text style={styles.bold}>Loan Origination System (LOS)</Text> is a modern digital platform that simplifies and accelerates the loan process. From the initial loan application to the final disbursement, LOS automates every critical step — including <Text style={styles.bold}>data capture</Text>, <Text style={styles.bold}>credit evaluation</Text>, <Text style={styles.bold}>approval workflows</Text>, <Text style={styles.bold}>document management</Text>, and <Text style={styles.bold}>compliance checks</Text>.
          </Text>
          <Text style={styles.introText}>
            With its intuitive interface and streamlined tracking capabilities, LOS improves customer satisfaction, reduces errors, and ensures faster loan approvals — all while maintaining regulatory compliance.
          </Text>
        </View>

        {/* Use Case Cards */}
        <View style={styles.cardsContainer}>
          {useCases.map(({ path, title, description,system_path }) => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 15,
    backgroundColor: '#FFFFFFCC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 50,
  },
  headerScrolled: {
    backgroundColor: '#FFFFFFE6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    padding: 5,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B5EAA',
  },
  menuButton: {
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.9,
    padding: 20,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#4B5EAA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    width: '100%',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  main: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 15,
  },
  introText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  bold: {
    fontWeight: '600',
  },
  cardsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom:100
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    width: Dimensions.get('window').width * 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 15,
  },
  cardButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardButtonBusiness: {
    backgroundColor: '#E0E7FF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cardButtonSystem: {
    backgroundColor: '#D1FAE5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cardButtonText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#1F2937',
    padding: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
   openButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    width:width*0.4,
    alignItems: 'center',
    alignSelf:"flex-end",
    marginBottom:10
  },
  openButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LOSDashboard;