import axios from 'axios';
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { useSelector } from 'react-redux';
const { width, height } = Dimensions.get('window');
import BASE_URL from "../../../../Config"

const InterestedModal = ({ visible, onClose, onSubmit,AlreadyParticipatedfunc }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
 const userData = useSelector((state) => state.counter);
//  console.log({userData})
    const token = userData?.accessToken;
    const customerId = userData?.userId;
  const options = [
    {
      id: 'PARTNER',
      title: 'Join as Partner',
      description: 'Sell your products and services',
      icon: '🤝',
      gradient: ['#667eea', '#764ba2']
    },
    {
      id: 'USER',
      title: 'Join as User',
      description: 'Buy my products and services',
      icon: '👤',
      gradient: ['#f093fb', '#f5576c']
    },
    {
      id: 'FREELANCER',
      title: 'Join as Freelancer',
      description: 'Bring partners and users to earn money',
      icon: '💼',
      gradient: ['#4facfe', '#00f2fe']
    }
  ];

  const toggleOption = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleSubmit = () => {
    console.log(selectedOptions);
    // setSelectedOptions([]);
    console.log('Selected Options:', selectedOptions);
    Alert.alert("Confirmation",`Are you sure you want to join as ${selectedOptions} ?`,
        [ {
                text:"Cancel",onPress:()=>{onClose()}
            },
            {
                text:"Yes,I'm sure",onPress:()=>{interestedfunc(selectedOptions)}
            },
           
        ] 
    )
  };

  const interestedfunc=(selectedOptions)=>{
    console.log({selectedOptions})
 const selectedOptionsString = selectedOptions.join(", "); // 👉 "partner, user, freelancer"

    console.log("Selected Options:", selectedOptionsString);
    var data={
        "askOxyOfers":"GLMS OPEN SOURCE HUB & JOB STREET",
        "mobileNumber": userData?.mobileNumber && userData.mobileNumber.trim() !== ""
                            ? userData.mobileNumber
                            : userData?.whatsappNumber || "",
        "userId":customerId,
        "projectType":"ASKOXY",
        "userRole":selectedOptionsString
    }
    console.log({data})
    axios({
        method:"post",
        url:`${BASE_URL}marketing-service/campgin/askOxyOfferes`,
        data:data,
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${token}`
        }
    })
    .then((response)=>{
        handleCancel()
        AlreadyParticipatedfunc()
        console.log("response",response.data)
        Alert.alert('Success',"Thank you for joining as USER PARTNER in our GLMS OPEN SOURCE HUB & JOB STREET offer campaign!")
    })
    .catch((error)=>{
        console.log("error", error.response)
        Alert.alert('Error',error.response.data.error)
    })
  }

  const handleCancel = () => {
    setSelectedOptions([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="formSheet"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header with Background */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>ASKOXY.AI</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>GLMS</Text>
            </View>
          </View>
          <Text style={styles.title}>Choose Your Path</Text>
          <Text style={styles.subtitle}>
            How would you like to participate in our OPEN SOURCE HUB & JOB STREET?
          </Text>
        </View>

        {/* Options List */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedOptions.includes(option.id) && styles.optionCardSelected
              ]}
              onPress={() => toggleOption(option.id)}
              activeOpacity={0.8}
            >
              {/* Gradient Background for Selected State */}
              {selectedOptions.includes(option.id) && (
                <View style={[styles.gradientBackground, {
                  backgroundColor: option.gradient[0]
                }]} />
              )}
              
              <View style={styles.optionContent}>
                {/* Icon */}
                <View style={[
                  styles.iconContainer,
                  selectedOptions.includes(option.id) && styles.iconContainerSelected
                ]}>
                  <Text style={styles.icon}>{option.icon}</Text>
                </View>
                
                {/* Text Content */}
                <View style={styles.optionTextContainer}>
                  <Text style={[
                    styles.optionTitle,
                    selectedOptions.includes(option.id) && styles.optionTitleSelected
                  ]}>
                    {option.title}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    selectedOptions.includes(option.id) && styles.optionDescriptionSelected
                  ]}>
                    {option.description}
                  </Text>
                </View>

                {/* Checkbox */}
                <View style={styles.checkboxContainer}>
                  <View
                    style={[
                      styles.checkbox,
                      selectedOptions.includes(option.id) && styles.checkboxSelected
                    ]}
                  >
                    {selectedOptions.includes(option.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Maybe Later</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              selectedOptions.length === 0 && styles.submitButtonDisabled
            ]}
            onPress={()=>handleSubmit()}
            disabled={selectedOptions.length === 0}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>
              Continue {selectedOptions.length > 0 && `(${selectedOptions.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.04,
    paddingBottom: height * 0.03,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.015,
  },
  logo: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: width * 0.02,
  },
  badge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.005,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: width * 0.025,
    fontWeight: 'bold',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.035,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: height * 0.025,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.03,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  optionCardSelected: {
    borderColor: 'transparent',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.04,
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  icon: {
    fontSize: width * 0.06,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: width * 0.03,
  },
  optionTitle: {
    fontSize: width * 0.045,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: height * 0.005,
  },
  optionTitleSelected: {
    color: '#007AFF',
  },
  optionDescription: {
    fontSize: width * 0.035,
    color: '#666666',
    lineHeight: height * 0.022,
  },
  optionDescriptionSelected: {
    color: '#333333',
  },
  checkboxContainer: {
    marginLeft: 'auto',
  },
  checkbox: {
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: width * 0.035,
    borderWidth: 2,
    borderColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.025,
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
    gap: width * 0.03,
    backgroundColor: '#ffffff',
  },
  button: {
    flex: 1,
    paddingVertical: height * 0.02,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e1e5e9',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  cancelButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#666666',
  },
  submitButtonText: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default InterestedModal;