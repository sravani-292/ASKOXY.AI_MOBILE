import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    whatsappNumber: '',
    alternativeNumber: '',
    email: '',
  });

  const [isLoginWithWhatsapp] = useState(false);
  const [isSameAsMain, setIsSameAsMain] = useState(false);
  const [showWhatsappVerification, setShowWhatsappVerification] = useState(false);
  const [otp, setOtp] = useState('');  const handleInputChange = (field, value) => {
    if (field === 'alternativeNumber') {
      if (value === formData.whatsappNumber || value === formData.mobileNumber) {
        toast.error('Alternative number must be different from WhatsApp and mobile numbers');
        return;
      }
      // Validate phone number format (10 digits)
      if (value.length > 0 && !/^\d{10}$/.test(value)) {
        toast.error('Alternative number must be 10 digits');
        return;
      }
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSameNumberToggle = () => {
    setIsSameAsMain(!isSameAsMain);
    if (isLoginWithWhatsapp) {
      setFormData(prev => ({
        ...prev,
        mobileNumber: !isSameAsMain ? prev.whatsappNumber : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        whatsappNumber: !isSameAsMain ? prev.mobileNumber : ''
      }));
      setShowWhatsappVerification(false);
    }
  };

  const handleVerifyWhatsapp = () => {
    if (otp === '1234') {
      toast.success('WhatsApp verified successfully');
      setShowWhatsappVerification(false);
    } else {
      toast.error('Invalid OTP');
    }
  };

  const handleSubmit = () => {    const required = ['firstName', 'lastName', 'email', 'alternativeNumber'];
    const missing = required.find(field => !formData[field]);
    
    if (missing) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }    if (!formData.mobileNumber && !formData.whatsappNumber) {
      toast.error('Please provide at least one contact number');
      return;
    }

    if (!formData.alternativeNumber) {
      toast.error('Alternative number is required');
      return;
    }

    if (formData.alternativeNumber === formData.mobileNumber || 
        formData.alternativeNumber === formData.whatsappNumber) {
      toast.error('Alternative number must be different from WhatsApp and mobile numbers');
      return;
    }

    if (!/^\d{10}$/.test(formData.alternativeNumber)) {
      toast.error('Alternative number must be 10 digits');
      return;
    }

    toast.success('Profile updated successfully!');
    console.log('Form submitted:', formData);
  };

  const InputField = ({ label, value, onChange, placeholder, keyboardType = 'default', required, editable = true }) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 16, marginBottom: 4, color: '#444' }}>
        {label} {required && '*'}
      </Text>
      <TextInput
        style={{
          backgroundColor: editable ? 'white' : '#f0f0f0',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ddd',
          fontSize: 16,
        }}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView>
        {/* Personal Information Section */}
        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#333' }}>
            Personal Information
          </Text>
          <InputField
            label="First Name"
            value={formData.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            placeholder="Enter first name"
            required
          />
          <InputField
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            placeholder="Enter last name"
            required
          />
          <InputField
            label="Email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            placeholder="Enter email address"
            keyboardType="email-address"
            required
          />
        </View>

        {/* Contact Information Section */}
        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#333' }}>
            Contact Information
          </Text>
          
          <InputField
            label={isLoginWithWhatsapp ? 'WhatsApp Number' : 'Mobile Number'}
            value={isLoginWithWhatsapp ? formData.whatsappNumber : formData.mobileNumber}
            placeholder="Enter number"
            keyboardType="phone-pad"
            editable={false}
            required
          />

          <TouchableOpacity 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 8,
              padding: 8,
            }}
            onPress={handleSameNumberToggle}
          >
            <MaterialIcons 
              name={isSameAsMain ? "check-box" : "check-box-outline-blank"} 
              size={24} 
              color="#007AFF"
            />
            <Text style={{ marginLeft: 8, fontSize: 16, color: '#666' }}>
              {isLoginWithWhatsapp ? 'Same as mobile number' : 'Same as WhatsApp number'}
            </Text>
          </TouchableOpacity>

          {!isSameAsMain && (
            <>
              <InputField
                label={isLoginWithWhatsapp ? 'Mobile Number' : 'WhatsApp Number'}
                value={isLoginWithWhatsapp ? formData.mobileNumber : formData.whatsappNumber}
                onChange={(value) => handleInputChange(isLoginWithWhatsapp ? 'mobileNumber' : 'whatsappNumber', value)}
                placeholder="Enter number"
                keyboardType="phone-pad"
              />
              
              {!isLoginWithWhatsapp && !isSameAsMain && (
                <TouchableOpacity 
                  style={{
                    backgroundColor: '#007AFF',
                    padding: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                    marginTop: 8,
                  }}
                  onPress={() => setShowWhatsappVerification(true)}
                >
                  <Text style={{ color: 'white', fontSize: 16 }}>Verify WhatsApp</Text>
                </TouchableOpacity>
              )}
            </>
          )}          <InputField
            label="Alternative Number"
            value={formData.alternativeNumber}
            onChange={(value) => handleInputChange('alternativeNumber', value)}
            placeholder="Enter alternative number"
            keyboardType="phone-pad"
            required
          />
        </View>

        {showWhatsappVerification && (
          <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 16, marginBottom: 12, color: '#666' }}>
              Enter WhatsApp Verification Code
            </Text>
            <TextInput
              style={{
                backgroundColor: '#f5f5f5',
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
                fontSize: 16,
                marginBottom: 12,
              }}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={4}
              placeholder="Enter 4-digit code"
            />
            <TouchableOpacity 
              style={{
                backgroundColor: '#007AFF',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={handleVerifyWhatsapp}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Verify Code</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={{
            backgroundColor: '#007AFF',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            marginVertical: 24,
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
            Save Profile
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;