import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { toast, Toaster } from 'sonner-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import CountryPicker from 'react-native-country-picker-modal';

import BASE_URL from '../../../../Config';
import { useSelector } from 'react-redux';

const ProfileScreen = () => {
  // State management
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [alternativeNumber, setAlternativeNumber] = useState('');
  const [otp, setOtp] = useState('');
  
  // Error states
  const [emailError, setEmailError] = useState(false);
  const [whatsappNumberError, setWhatsappNumberError] = useState(false);
  const [alternativeNumberError, setAlternativeNumberError] = useState(false);
  const [otpError, setOtpError] = useState(false);
  
  // UI states
  const [isSameAsMain, setIsSameAsMain] = useState(false);
  const [showWhatsappVerification, setShowWhatsappVerification] = useState(false);
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [isLoginWithWhatsapp, setIsLoginWithWhatsapp] = useState(false);
  const [countryCode, setCountryCode] = useState('91');
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [profileLoader, setProfileLoader] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  
  // OTP verification data
  const [otpSession, setOtpSession] = useState('');
  const [salt, setSalt] = useState('');
  
  // Get user data from Redux store
  const userData = useSelector((state) => state.counter);
  const token = userData.accessToken;
  const customerId = userData.userId;

  // Fetch profile data on mount
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    setProfileLoader(true);
    try {
      const response = await axios({
        method: "GET",
        url: BASE_URL + `user-service/customerProfileDetails?customerId=${customerId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update verification statuses
      setWhatsappVerified(response.data.whatsappVerified);
      setMobileVerified(response.data.mobileVerified);
      if(response.data.whatsappVerified){
        setIsLoginWithWhatsapp(true);
      }
      
      if (response.status === 200) {
        // Update form fields
        setFirstName(response.data.firstName || '');
        setLastName(response.data.lastName || '');
        setEmail(response.data.email || '');
        setMobileNumber(response.data.mobileNumber || '');
        setWhatsappNumber(response.data.whatsappNumber || '');
        setAlternativeNumber(response.data.alterMobileNumber?.trim() || '');
      }
    } catch (error) {
      console.error("ERROR", error);
      toast.error("Failed to load profile data");
    } finally {
      setProfileLoader(false);
    }
  };

  // Validation helpers
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const validatePhoneNumber = (number) => {
    return number.length === 10 && /^\d+$/.test(number);
  };

  // Handle sending WhatsApp OTP
  const handleSendOtp = () => {
    // Don't allow sending OTP if WhatsApp number is already verified
    if (whatsappVerified) {
      toast.info('WhatsApp number already verified');
      return;
    }
    
    // Validate WhatsApp number
    if (!whatsappNumber) {
      setWhatsappNumberError(true);
      toast.error('Please enter WhatsApp number');
      return;
    }
    
    if (!validatePhoneNumber(whatsappNumber)) {
      setWhatsappNumberError(true);
      toast.error('WhatsApp number must be 10 digits');
      return;
    }
    
    const data = {
      countryCode: "+" + countryCode,
      chatId: whatsappNumber,
      id: customerId,
    };
    
    setOtpLoading(true);
    
    axios({
      method: "post",
      url: BASE_URL + `user-service/sendWhatsappOtpqAndVerify`,
      data: data,
    })
      .then((response) => {
        if (
          !response.data.whatsappOtpSession ||
          !response.data.salt
        ) {
          toast.error("This WhatsApp number already exists");
        } else {
          setShowWhatsappVerification(true);
          setWhatsappNumberError(false);
          setOtpSession(response.data.whatsappOtpSession);
          setSalt(response.data.salt);
          toast.success("OTP sent successfully");
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to send OTP");
      })
      .finally(() => {
        setOtpLoading(false);
      });
  };

  // Handle OTP verification
  const handleVerifyOtp = () => {
    // Validate WhatsApp number again
    if (!whatsappNumber) {
      setWhatsappNumberError(true);
      toast.error("Please enter WhatsApp number");
      return;
    }
    
    if (!validatePhoneNumber(whatsappNumber)) {
      setWhatsappNumberError(true);
      toast.error("Please enter a valid 10-digit WhatsApp number");
      return;
    }
    
    // Validate OTP
    if (!otp) {
      setOtpError(true);
      toast.error("Please enter OTP");
      return;
    }

    if (otp.length < 4 || otp.length > 5) {
      setOtpError(true);
      toast.error("Please enter a valid OTP");
      return;
    }
    
    const data = {
      countryCode: "+" + countryCode,
      chatId: whatsappNumber,
      id: customerId,
      salt: salt,
      whatsappOtp: otp,
      whatsappOtpSession: otpSession,
    };
    
    setOtpLoading(true);
    
    axios({
      method: "post",
      url: BASE_URL + `user-service/sendWhatsappOtpqAndVerify`,
      data: data,
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("WhatsApp number verified successfully");
          setWhatsappVerified(true);
        }
        
        setShowWhatsappVerification(false);
        setOtp('');
        setWhatsappNumberError(false);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            "Invalid OTP. Please try again."
        );
      })
      .finally(() => {
        setOtpLoading(false);
      });
  };

  // Handle same number toggle
  const handleSameNumberToggle = () => {
    // Only allow toggling if neither number is verified or both are verified
    if ((whatsappVerified && mobileVerified) || (!whatsappVerified && !mobileVerified)) {
      const newValue = !isSameAsMain;
      setIsSameAsMain(newValue);
      
      if (isLoginWithWhatsapp) {
        if (newValue) {
          setMobileNumber(whatsappNumber);
        } else {
          setMobileNumber('');
        }
      } else {
        if (newValue) {
          setWhatsappNumber(mobileNumber);
          setShowWhatsappVerification(false);
        } else {
          setWhatsappNumber('');
        }
      }
    } else {
      toast.error('Cannot make numbers the same when one is verified and the other is not');
    }
  };

  // Submit profile data
  const handleSubmit = async () => {
    // Reset all error states
    // setEmailError(false);
    // setWhatsappNumberError(false);
    // setAlternativeNumberError(false);
    
    // let hasErrors = false;
    
    // // Field validation (email only needs to be validated if provided)
    // if (email && !validateEmail(email)) {
    //   setEmailError(true);
    //   toast.error("Please enter a valid email");
    //   hasErrors = true;
    // }
    
    // // Alternative number validation - only validate if provided
    // if (alternativeNumber && !validatePhoneNumber(alternativeNumber)) {
    //   setAlternativeNumberError(true);
    //   toast.error("Alternative number must be 10 digits");
    //   hasErrors = true;
    // } else if (
    //   alternativeNumber && 
    //   (alternativeNumber === mobileNumber || alternativeNumber === whatsappNumber)
    // ) {
    //   setAlternativeNumberError(true);
    //   toast.error("Alternative number must be different from WhatsApp and mobile numbers");
    //   hasErrors = true;
    // }
    
    // if (hasErrors) {
    //   return;
    // }

    if(firstName=="" || firstName==null){
      Alert.alert("First Name is required");
      return;
    }
    
    if(mobileNumber=="" || mobileNumber==null){
      Alert.alert("Mobile Number is required");
      return;
    }
  

    setIsLoading(true);
    
    const data = {
      userFirstName: firstName,
      userLastName: lastName,
      customerEmail: email,
      customerId: customerId,
      alterMobileNumber: alternativeNumber,
      whatsappNumber: whatsappVerified ? whatsappNumber : (isSameAsMain ? mobileNumber : whatsappNumber || ""),
      mobileNumber: mobileVerified ? mobileNumber : mobileNumber,
    };
    
    try { 
      const response = await axios.patch(
        BASE_URL + "user-service/profileUpdate",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.errorMessage) {
        Alert.alert("Failed", response.data.errorMessage);
        // toast.error(response.data.errorMessage);
      } else {
        getProfile();
        Alert.alert("Success", "Profile saved successfully");
        // toast.success("Profile saved successfully");
      }
    } catch (error) {
      console.error(error.response);
      Alert.alert("Failed", error.response?.data?.message || "Failed to update profile");
      // toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle country selection
  const onSelectCountry = (country) => {
    setCountryCode(country.callingCode[0]);
    setCountryPickerVisible(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Toaster />
      
      {countryPickerVisible && (
        <CountryPicker
          visible={countryPickerVisible}
          onClose={() => setCountryPickerVisible(false)}
          onSelect={onSelectCountry}
          withCallingCode={true}
          withFilter={true}
          withFlag={true}
          withAlphaFilter={true}
        />
      )}
      
      {/* Loading Overlay */}
      {(profileLoader || isLoading || otpLoading) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
      
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Personal Information Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          {/* First Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
            />
          </View>
          
          {/* Last Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
            />
          </View>
          
          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(false);
              }}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError && (
              <Text style={styles.errorText}>Please enter a valid email</Text>
            )}
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          {/* Primary Number (Mobile or WhatsApp based on login method) */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                {isLoginWithWhatsapp ? 'WhatsApp Number' : 'Mobile Number'}
              </Text>
              {(isLoginWithWhatsapp ? whatsappVerified : mobileVerified) && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="check-circle" size={14} color="#28a745" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            <TextInput
              style={[
                styles.input, 
                { backgroundColor: '#f0f0f0' },
                (isLoginWithWhatsapp ? whatsappVerified : mobileVerified) && styles.verifiedInput
              ]}
              value={isLoginWithWhatsapp ? whatsappNumber : mobileNumber}
              placeholder="Enter number"
              keyboardType="phone-pad"
              editable={false}
            />
          </View>

          {/* Same Number Toggle */}
          {((whatsappVerified && mobileVerified) || (!whatsappVerified && !mobileVerified)) && (
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={handleSameNumberToggle}
            >
              <MaterialIcons 
                name={isSameAsMain ? "check-box" : "check-box-outline-blank"} 
                size={24} 
                color="#007AFF"
              />
              <Text style={styles.checkboxLabel}>
                {isLoginWithWhatsapp ? 'Same as mobile number' : 'Same as WhatsApp number'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Secondary Number (WhatsApp or Mobile based on login method) */}
          {!isSameAsMain && (
            <>
              {!isLoginWithWhatsapp && (
                <View style={styles.inputContainer}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>WhatsApp Number</Text>
                    {whatsappVerified && (
                      <View style={styles.verifiedBadge}>
                        <MaterialIcons name="check-circle" size={14} color="#28a745" />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.phoneInputContainer}>
                    {/* Country Code Selector */}
                    <TouchableOpacity
                      style={[
                        styles.countryCodeButton,
                        !whatsappVerified ? {} : { backgroundColor: '#f0f0f0' }
                      ]}
                      onPress={() => !whatsappVerified && setCountryPickerVisible(true)}
                      disabled={whatsappVerified}
                    >
                      <Text style={styles.countryCodeText}>+{countryCode}</Text>
                      {!whatsappVerified && (
                        <MaterialIcons name="arrow-drop-down" size={24} color="#444" />
                      )}
                    </TouchableOpacity>
                    
                    {/* WhatsApp Number Input */}
                    <TextInput
                      style={[
                        styles.phoneInput, 
                        whatsappNumberError && styles.inputError,
                        whatsappVerified && styles.verifiedInput
                      ]}
                      value={whatsappNumber}
                      onChangeText={(text) => {
                        if (/^\d*$/.test(text) && text.length <= 10) {
                          setWhatsappNumber(text);
                          setWhatsappNumberError(false);
                        }
                      }}
                      placeholder="WhatsApp number"
                      keyboardType="phone-pad"
                      maxLength={10}
                      editable={!whatsappVerified}
                    />
                  </View>
                  
                  {whatsappNumberError && (
                    <Text style={styles.errorText}>Please enter a valid WhatsApp number</Text>
                  )}
                  
                  {/* Verify WhatsApp Button */}
                  {!whatsappVerified && (
                    <TouchableOpacity 
                      style={[styles.button, styles.verifyButton]}
                      onPress={handleSendOtp}
                      disabled={otpLoading}
                    >
                      <Text style={styles.buttonText}>
                        {otpLoading ? 'Sending...' : 'Verify WhatsApp'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              
              {isLoginWithWhatsapp && (
                <View style={styles.inputContainer}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>Mobile Number</Text>
                    {mobileVerified && (
                      <View style={styles.verifiedBadge}>
                        <MaterialIcons name="check-circle" size={14} color="#28a745" />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  <TextInput
                    style={[
                      styles.input, 
                      (isLoginWithWhatsapp ? mobileVerified : whatsappVerified) && styles.verifiedInput
                    ]}
                    value={mobileNumber}
                    onChangeText={(text) => {
                      if (/^\d*$/.test(text) && text.length <= 10) {
                        setMobileNumber(text);
                      }
                    }}
                    placeholder="Enter mobile number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={!mobileVerified}
                  />
                </View>
              )}
            </>
          )}
          
          {/* Alternative Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Alternative Number</Text>
            <View style={styles.phoneInputContainer}>
              {/* Country Code Selector */}
              <TouchableOpacity
                style={styles.countryCodeButton}
                onPress={() => setCountryPickerVisible(true)}
              >
                <Text style={styles.countryCodeText}>+{countryCode}</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#444" />
              </TouchableOpacity>
              
              {/* Alternative Number Input */}
              <TextInput
                style={[styles.phoneInput, alternativeNumberError && styles.inputError]}
                value={alternativeNumber}
                onChangeText={(text) => {
                  if (/^\d*$/.test(text) && text.length <= 10) {
                    setAlternativeNumber(text);
                    setAlternativeNumberError(false);
                  }
                }}
                placeholder="Alternative number"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            {alternativeNumberError && (
              <Text style={styles.errorText}>Please enter a valid alternative number</Text>
            )}
          </View>
        </View>

        {/* WhatsApp Verification Modal */}
        {showWhatsappVerification && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>WhatsApp Verification</Text>
            <Text style={styles.verificationText}>
              Enter the verification code sent to your WhatsApp
            </Text>
            
            <TextInput
              style={[styles.otpInput, otpError && styles.inputError]}
              value={otp}
              onChangeText={(text) => {
                if (/^\d*$/.test(text) && text.length <= 5) {
                  setOtp(text);
                  setOtpError(false);
                }
              }}
              keyboardType="number-pad"
              maxLength={5}
              placeholder="Enter OTP"
            />
            
            {otpError && (
              <Text style={styles.errorText}>Please enter a valid OTP</Text>
            )}
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowWhatsappVerification(false)}
                disabled={otpLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={handleVerifyOtp}
                disabled={otpLoading}
              >
                <Text style={styles.buttonText}>
                  {otpLoading ? 'Verifying...' : 'Verify Code'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4d4f',
    borderWidth: 1,
  },
  verifiedInput: {
    borderColor: '#28a745',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 12,
    marginTop: 4,
  },
  phoneInputContainer: {
    flexDirection: 'row',
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    width: 90,
  },
  countryCodeText: {
    fontSize: 16,
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  otpInput: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 4,
  },
  verificationText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    marginRight: 8,
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7ee',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  verifiedText: {
    color: '#28a745',
    marginLeft: 4,
    fontSize: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
});

export default ProfileScreen;