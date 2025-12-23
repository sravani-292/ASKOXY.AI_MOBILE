/* eslint-disable no-dupe-keys */
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios, { AxiosResponse } from "axios";

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import BASE_URL from "../../../Config";
// API Service for profile data
const handleGetProfileData = async (customerId: string) => {
  try {
    const response = await axios({
      method: "Get",
      url: `${BASE_URL}user-service/customerProfileDetails?customerId=${customerId}`,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const MIN_DESC = 25;
const MAX_DESC = 350;
const BORDER = '#E2E8F0';

type ViewType = "Public" | "Private";

interface Option {
  label: string;
  value: string;
}

interface AgentData {
  agentName: string;
  creatorName:string;
  description: string;
  roleSelect: string;
  goalSelect: string;
  purposeSelect: string;
  roleOther: string;
  goalOther: string;
  purposeOther: string;
  view: ViewType;
  instructions: string;
  conStarter1: string;
  conStarter2: string;
  businessCardId:string
}

type RootStackParamList = {
  Creation: undefined;
  Preview: { agentData: AgentData };
  Upload: { agentData: AgentData };
};

function useDebounced<T>(value: T, delay = 600): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const ROLE_OPTS: Option[] = [
  { label: "Student", value: "Student" },
  { label: "Fresher", value: "Fresher" },
  { label: "Job Seeker", value: "JobSeeker" },
  { label: "Working Professional", value: "WorkingProfessional" },
  { label: "Founder / Startup", value: "FounderStartup" },
  { label: "CEO", value: "CEO" },
  { label: "Business Owner", value: "BusinessOwner" },
  { label: "Salesperson", value: "Salesperson" },
  { label: "Market", value: "Market" },
  { label: "Doctor", value: "Doctor" },
  { label: "Chartered Accountant", value: "CharteredAccountant" },
  { label: "Company Secretary", value: "CompanySecretary" },
  { label: "Lawyer", value: "Lawyer" },
  { label: "Real Estate", value: "RealEstate" },
  { label: "Consultant", value: "Consultant" },
  { label: "Developer", value: "Developer" },
  { label: "Tester", value: "Tester" },
  { label: "Manager", value: "Manager" },
  { label: "Customer", value: "Customer" },
  { label: "Other", value: "Other" },
];

const GOAL_OPTS: Option[] = [
  { label: "Job / Internship", value: "JobInternship" },
  { label: "Upskilling", value: "Upskilling" },
  { label: "Clients", value: "Clients" },
  { label: "Leads", value: "Leads" },
  { label: "Investors", value: "Investors" },
  { label: "Funding", value: "Funding" },
  { label: "Recruiting", value: "Recruiting" },
  { label: "Hiring", value: "Hiring" },
  { label: "Sales", value: "Sales" },
  { label: "Revenue", value: "Revenue" },
  { label: "Brand Visibility", value: "BrandVisibility" },
  { label: "Growth", value: "Growth" },
  { label: "Community Network", value: "CommunityNetwork" },
  { label: "Automation", value: "Automation" },
  { label: "AI Tools", value: "AITools" },
  { label: "Projects", value: "Projects" },
  { label: "Collaboration", value: "Collaboration" },
  { label: "Support", value: "Support" },
  { label: "Helpdesk", value: "Helpdesk" },
  { label: "Other", value: "Other" },
];

const PURPOSE_OPTS: Option[] = [
  { label: "Learn", value: "Learn" },
  { label: "Build", value: "Build" },
  { label: "Offer", value: "Offer" },
  { label: "Earn", value: "Earn" },
  { label: "Hire", value: "Hire" },
  { label: "Automate", value: "Automate" },
  { label: "Market", value: "Market" },
  { label: "Support", value: "Support" },
  { label: "Legal Help", value: "LegalHelp" },
  { label: "Medical Help", value: "MedicalHelp" },
  { label: "Company Setup", value: "CompanySetup" },
  { label: "Company Audit", value: "CompanyAudit" },
  { label: "Other", value: "Other" },
];

const CustomSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={styles.selectContainer}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={value ? styles.selectText : styles.selectPlaceholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.selectArrow}>▼</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsScroll}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    value === option.value && styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Simplified Suggestion Popup - Only Use and Cancel buttons
const SuggestionPopup: React.FC<{
  visible: boolean;
  title: string;
  suggestion: string;
  onUse: () => void;
  onCancel: () => void;
}> = ({ visible, title, suggestion, onUse, onCancel }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.suggestionOverlay}>
        <View style={styles.suggestionCard}>
          <Text style={styles.suggestionTitle}>{title}</Text>
          <ScrollView style={styles.suggestionTextContainer}>
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </ScrollView>
          
          <View style={styles.suggestionButtons}>
            <TouchableOpacity
              style={[styles.suggestionButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.suggestionButton, styles.useButton]}
              onPress={onUse}
            >
              <Text style={styles.useButtonText}>Use</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
    </Modal>
  );
};

const CardUploadComponent: React.FC<{
  setRoleSelect: (value: string) => void;
  setGoalSelect: (value: string) => void;
  setPurposeSelect: (value: string) => void;
  setRoleOther: (value: string) => void;
  setGoalOther: (value: string) => void;
  setPurposeOther: (value: string) => void;
  setAgentName: (value: string) => void;
  setDescription: (value: string) => void;
   setVisible: (value: boolean) => void;        
  setCardDataForm: (value: any) => void; 
  setCardId: (id: string | '') => void; 
  setCreatorName: (name:string)=>void;
  setBusinessCardDocumentPath: (path: string) => void;
  setBusinessCardId: (id: string) => void;
}> = ({ setRoleSelect, setGoalSelect, setPurposeSelect, setRoleOther, setGoalOther, setPurposeOther, setAgentName, setDescription,setVisible,setCardDataForm, setCardId,setCreatorName, setBusinessCardDocumentPath, setBusinessCardId }) => {
  // Future: Add activeTab state for multiple card types
  // const [activeTab, setActiveTab] = useState<'Occupation' | 'Student' | 'Identity'>('Occupation');
  const [cardFile, setCardFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const userData = useSelector((state: any) => state.counter);
  const userId = userData?.userId || '';
  const token = userData?.accessToken;
  const handleFileSelect = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: openCamera },
        { text: 'Gallery', onPress: openGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      // aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      validateAndSetFile(result.assets[0]);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      validateAndSetFile(result.assets[0]);
    }
  };

  const validateAndSetFile = (file: ImagePicker.ImagePickerAsset) => {
    // Validate file size (5MB)
    if (file.fileSize && file.fileSize > 5 * 1024 * 1024) {
      Alert.alert('Error', 'File size must be less than 5MB');
      return;
    }

    setCardFile(file);
  };
// helper to map API text to dropdown or "Other"
const applyDropdownValue = (
  rawValue: string,
  options: Option[],
  setSelect: (value: string) => void,
  setOther: (value: string) => void
) => {
  if (!rawValue) return;

  const trimmed = rawValue.trim().toLowerCase();

  // try to match by label or value (case-insensitive)
  const matched = options.find(opt =>
    opt.label.trim().toLowerCase() === trimmed ||
    opt.value.trim().toLowerCase() === trimmed
  );

  if (matched) {
    // select actual option
    setSelect(matched.value);
    setOther(""); // clear "Other" text
  } else {
    // no match → put "Other" and show text below
    setSelect("Other");
    setOther(rawValue.trim());
  }
};

  const handleUpload = async () => {
    if (!cardFile) return;
    
    if (!userId || !token) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: cardFile.uri,
        type: cardFile.mimeType || 'image/jpeg',
        name: cardFile.fileName || 'card.jpg',
        size: cardFile.fileSize || 0,
      } as any);
      const response = await axios.post(
        `${BASE_URL}ai-service/agent/uploadBusinessCard?fileType=kyc&userId=${userId}`,
        // `${BASE_URL}ai-service/agent/updateBusinessCard?fileType=kyc&userId=${userId}`,
        formData,
       { 
          headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      }
      );
      
      const data = response.data;
  console.log('Upload response full data:', data.uploadDetails.documentPath);
    
      // Alert.alert(
      //   'Success',
      //   'Card processed successfully! Fields have been auto-filled.',
      //   [
      //     // { text: 'Edit', onPress: () => showEditOptions(data) },
      //     { text: 'OK', style: 'default' },
      //   ]
      // );
setBusinessCardDocumentPath(data.uploadDetails.documentPath || '');
// safely pull fields from response
const ai = data.aiData || {};
const { role, goal, goals, purpose, agentName: apiAgentName, description: apiDescription } = ai;

// Role → "I am"
if (role) {
  applyDropdownValue(role, ROLE_OPTS, setRoleSelect, setRoleOther);
}

// Goal → "Looking for"
if (goal || goals) {
  const goalText = goal || goals;
  applyDropdownValue(goalText, GOAL_OPTS, setGoalSelect, setGoalOther);
}

// Purpose → "To"
if (purpose) {
  applyDropdownValue(purpose, PURPOSE_OPTS, setPurposeSelect, setPurposeOther);
}

// Agent Name
if (apiAgentName) {
  setAgentName(apiAgentName);
}

// Description
if (apiDescription) {
  setDescription(apiDescription);
}
const cardData = data.cardData || {};
console.log('Extracted Card Data:', cardData);
if (cardData.id) {
  setCardId(cardData.id.toString());
} else {
  setCardId('');
}

// 🔹 Populate the editable form in parent
setCardDataForm({
  fullName: cardData.fullName || "",
  jobTitle: cardData.jobTitle || "",
  companyName: cardData.companyName || "",
  email: cardData.email || "",
  mobileNumber: cardData.phone || "",
  website: cardData.website || "",
  address: cardData.address || "",
});

// 🔹 Open the modal from parent
setVisible(true);

    
    } 
    
    catch (error: any) {
      console.log('Upload error:', error);
      Alert.alert('Failed to upload', error.response.data.message || 'Failed to process card');
    } finally {
      setUploading(false);
    }
  };
  
  const showEditOptions = (data: any) => {
    Alert.alert(
      'Edit Extracted Data',
      'Which field would you like to edit?',
      [
        { text: 'Role', onPress: () => editField('role', data.role) },
        { text: 'Goal', onPress: () => editField('goal', data.goal) },
        { text: 'Purpose', onPress: () => editField('purpose', data.purpose) },
        { text: 'Agent Name', onPress: () => editField('agentName', data.agentName) },
        { text: 'Description', onPress: () => editField('description', data.description) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
  
  const editField = (field: string, currentValue: string) => {
    Alert.prompt(
      `Edit ${field}`,
      `Current value: ${currentValue}`,
      (newValue) => {
        if (newValue) {
          switch (field) {
            case 'role':
              setRoleSelect('Other');
              setRoleOther(newValue);
              break;
            case 'goal':
              setGoalSelect('Other');
              setGoalOther(newValue);
              break;
            case 'purpose':
              setPurposeSelect('Other');
              setPurposeOther(newValue);
              break;
            case 'agentName':
              setAgentName(newValue);
              break;
            case 'description':
              setDescription(newValue);
              break;
          }
        }
      },
      'plain-text',
      currentValue
    );
  };

  // Future: Add functions for multiple card types
  // const getTabIcon = () => { ... }
  // const getTabTitle = () => { ... }
  // const getDescription = () => { ... }

  return (
    <View style={cardStyles.container}>
      <View style={cardStyles.header}>
        <View style={cardStyles.titleSection}>
          <View style={cardStyles.iconContainer}>
            <Text style={cardStyles.icon}>💼</Text>
          </View>
          <View>
            <Text style={cardStyles.title}>Business Card</Text>
            <Text style={cardStyles.subtitle}>AI-Powered Agent Creation</Text>
          </View>
        </View>
        
        {/* Future: Add tab container for multiple card types */}
        {/* <View style={cardStyles.tabContainer}>...</View> */}
      </View>

      <View style={cardStyles.content}>
        <Text style={cardStyles.description}>
          Upload your <Text style={cardStyles.highlight}>business card</Text> and let AI extract all details to create your personalized agent instantly.
        </Text>

        <TouchableOpacity style={cardStyles.uploadArea} onPress={handleFileSelect}>
          {cardFile ? (
            <View style={cardStyles.previewContainer}>
              <Image source={{ uri: cardFile.uri }} style={cardStyles.previewImage} />
              <Text style={cardStyles.fileName}>✓ {cardFile.fileName?.slice(0, 20)}...</Text>
              <Text style={cardStyles.changeText}>Click to change</Text>
            </View>
          ) : (
            <View style={cardStyles.uploadContent}>
              <Text style={cardStyles.uploadIcon}>📤</Text>
              <View>
                <Text style={cardStyles.uploadTitle}>Upload Card</Text>
                <Text style={cardStyles.uploadSubtitle}>JPG, PNG, PDF</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {cardFile && (
          <View style={cardStyles.actionButtons}>
            <TouchableOpacity
              style={cardStyles.removeButton}
              onPress={() => setCardFile(null)}
            >
              <Text style={cardStyles.removeButtonText}>✕ Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[cardStyles.uploadButton, uploading && cardStyles.uploadButtonDisabled]}
              onPress={handleUpload}
              disabled={uploading}
            >
              <Text style={cardStyles.uploadButtonText}>
                {uploading ? '⏳ Processing...' : '⚡ Extract & Create Agent'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={cardStyles.tip}>
          <Text style={cardStyles.tipBold}>💡 Pro Tip:</Text> Use a clear, well-lit image for best results
        </Text>
      </View>

      <View style={cardStyles.footer}>
        <View style={cardStyles.badge}>
          <Text style={cardStyles.badgeText}>🤖 AI Powered</Text>
        </View>
        <View style={[cardStyles.badge, cardStyles.badgeGreen]}>
          <Text style={cardStyles.badgeText}>⚡ Instant</Text>
        </View>
        <View style={[cardStyles.badge, cardStyles.badgePurple]}>
          <Text style={cardStyles.badgeText}>🎯 Accurate</Text>
        </View>
      </View>
    </View>
  );
};

const AgentCreationScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const userData = useSelector((state: any) => state.counter);
  const token = userData?.accessToken;
  const customerId = userData?.userId;
  const [selectedMode, setSelectedMode] = useState<'role' | 'card' | null>(null);
  const [roleSelect, setRoleSelect] = useState("");
  const [goalSelect, setGoalSelect] = useState("");
  const [purposeSelect, setPurposeSelect] = useState("");
  const [roleOther, setRoleOther] = useState("");
  const [goalOther, setGoalOther] = useState("");
  const [purposeOther, setPurposeOther] = useState("");
  const [agentName, setAgentName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [profileData, setProfileData] = useState<any>(null);
  const[businessCardDocumentPath,setBusinessCardDocumentPath]=useState('')
  const [businessCardId, setBusinessCardId] = useState('');
  const [description, setDescription] = useState("");
  const [view, setView] = useState<ViewType>("Private");
  const [nameLoading, setNameLoading] = useState(false);
  const [descSuggestLoading, setDescSuggestLoading] = useState(false);
  const [showAgentNameModal, setShowAgentNameModal] = useState(false);
  const [suggestedAgentName, setSuggestedAgentName] = useState('');
  const [cardErrors, setCardErrors] = useState<{[key: string]: string}>({});

  const [showNamePopup, setShowNamePopup] = useState(false);
  const [showDescPopup, setShowDescPopup] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const [suggestedDesc, setSuggestedDesc] = useState("");
  
  // Modal and card data states
  const [visible, setVisible] = useState(false);
  const [cardDataForm, setCardDataForm] = useState({
    fullName: '',
    jobTitle: '',
    companyName: '',
    email: '',
    mobileNumber: '',
    website: '',
    address: '',
    // userId:userData?.userId || '',
    // id : ''
  });
  const [cardDataSaving, setCardDataSaving] = useState(false);
const userId = customerId || "";
const [cardId, setCardId] = useState<string | ''>('');  // 🔹 add this

  const roleResolved = roleSelect === "Other" ? roleOther.trim() : roleSelect;
  const goalResolved = goalSelect === "Other" ? goalOther.trim() : goalSelect;
  const purposeResolved =
    purposeSelect === "Other" ? purposeOther.trim() : purposeSelect;

  const roleDeb = useDebounced(roleResolved, 700);
  const goalDeb = useDebounced(goalResolved, 700);
  const purposeDeb = useDebounced(purposeResolved, 700);

  const descCount = description.trim().length;
  const canPreview =
    agentName.trim().length >= 3 &&
    !!roleResolved &&
    !!goalResolved &&
    !!purposeResolved &&
    descCount >= MIN_DESC &&
    descCount <= MAX_DESC;

  const suggestAgentName = async () => {
    if (!roleResolved || !goalResolved || !purposeResolved) {
      Alert.alert("Missing Info", "Pick Role, Goal, and Purpose first.");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Authentication token not found");
      return;
    }

    setNameLoading(true);
    try {
      const response: AxiosResponse = await axios({
        url: `${BASE_URL}ai-service/agent/getAgentName`,
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role: roleResolved,
          goal: goalResolved,
          purpose: purposeResolved,
        },
      });

      const data = response.data;
      let suggestion =
        typeof data === "string" ? data : data.name || data.agentName || "";

      if (suggestion && typeof suggestion === "string") {
        suggestion = suggestion
          .replace(/^✅\s*Generated Agent Name:\s*/i, "")
          .replace(/^Generated Agent name:\s*/i, "")
          .trim();
      }

      if (suggestion) {
        setSuggestedName(suggestion);
        setShowNamePopup(true);
      }
    } catch (error) {
      console.error("Failed to generate name:", error);
      Alert.alert("Error", "Failed to generate name");
    } finally {
      setNameLoading(false);
    }
  };

  const suggestDescription = async () => {
    if (!roleResolved || !goalResolved || !purposeResolved) {
      Alert.alert("Missing Info", "Pick Role, Goal, and Purpose first.");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Authentication token not found");
      return;
    }

    setDescSuggestLoading(true);
    try {
      const response: AxiosResponse = await axios({
        url: `${BASE_URL}ai-service/agent/getAgentDescription`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          role: roleResolved,
          goal: goalResolved,
          purpose: purposeResolved,
        },
      });

      const data = response.data;
      let suggestion =
        typeof data === "string" ? data : data.description || "";

      // Clean up any formatting prefixes
      if (suggestion && typeof suggestion === "string") {
        suggestion = suggestion
          .replace(/^✅\s*Generated Description:\s*/i, "")
          .replace(/^Generated Description:\s*/i, "")
          .trim();
      }

      if (suggestion) {
        setSuggestedDesc(suggestion);
        setShowDescPopup(true);
      }
    } catch (error) {
      console.error("Failed to generate description:", error);
      Alert.alert("Error", "Failed to generate description");
    } finally {
      setDescSuggestLoading(false);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (customerId) {
        try {
          const response = await handleGetProfileData(customerId);
          if (response.status === 200) {
            setProfileData(response.data);
            const fullName = `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim();
            setCreatorName(fullName);
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };
    
    fetchProfileData();
  }, [customerId]);

  // Auto-suggest name only when all three fields are filled
  useEffect(() => {
    if (!roleDeb || !goalDeb || !purposeDeb) return;
    if (selectedMode === 'role') {
      suggestAgentName();
    }
  }, [roleDeb, goalDeb, purposeDeb]);

  const handleCancel = async () => {
    setVisible(false);
    // Silent API call without loading or success message
    try {
      const response = await axios({
        url: `${BASE_URL}ai-service/agent/updateBusinessCardData`,
        method: "patch",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ...cardDataForm,
          userId,
          id: cardId,
          imagePath: businessCardDocumentPath || "",
        },
      });
      console.log("Background update successful",response.data);
      setAgentName('');
      setRoleSelect('');
      setGoalSelect('');
      setPurposeSelect('');
      setRoleOther('');
      setGoalOther('');
      setPurposeOther('');
      setDescription('');
      // setBusinessCardDocumentPath('');
      // setBusinessCardId('');
    } catch (err) {
      // Silent fail
    }
  };

  const validateCardData = (data: any) => {
    const errors: {[key: string]: string} = {};
    if (!data.fullName?.trim()) errors.fullName = 'Full name is mandatory';
    if (!data.companyName?.trim()) errors.companyName = 'Company name is mandatory';
    if (!data.mobileNumber?.trim()) errors.phone = 'Phone is mandatory';
    if (!data.address?.trim()) errors.address = 'Address is mandatory';
    return errors;
  };

  const handleCardDataSubmit = () => {
    const errors = validateCardData(cardDataForm);
    setCardErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      handleCardDataUpdate();
    }
  };

  const handleAgentNameAccept = () => {
    setAgentName(suggestedAgentName);
    setShowAgentNameModal(false);
  };

  const handleAgentNameReject = () => {
    setAgentName('');
    setShowAgentNameModal(false);
  };
  
const handleCardDataUpdate = async () => {
  if (!token) {
    Alert.alert("Error", "Authentication token not found");
    return;
  }

  setCardDataSaving(true);
  console.log("Updating card data with:", {
        ...cardDataForm,
        userId,
        id: cardId,
        imagePath: businessCardDocumentPath || "",
      },)
  try {
    const res: AxiosResponse = await axios({
      url: `${BASE_URL}ai-service/agent/updateBusinessCardData`,
      method: "patch",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        ...cardDataForm,
        userId,
        id: cardId,
        imagePath: businessCardDocumentPath || "",
      },
    });
    console.log("Update response:", res.data.id);
    Alert.alert("Success! Your business card details have been updated successfully."); 
    // setBusinessCardDocumentPath(res.data.uploadDetails.documentPath || '');   
    setBusinessCardId(res.data.id || '');
    setVisible(false);
    
    // Show agent name suggestion modal
    setTimeout(() => {
      setSuggestedAgentName(agentName || 'AI Agent');
      setShowAgentNameModal(true);
    }, 300);
  } catch (err: any) {
    console.log("Update error:", err.response || err);
    Alert.alert("Error", err?.response?.data?.message || "Failed to update card details");
  } finally {
    setCardDataSaving(false);
  }
};


  const handlePreview = () => {
    if (!canPreview) {
      Alert.alert("Incomplete", "Please complete all required fields.");
      return;
    }

    const agentData = {
      agentName,
      description,
      roleSelect,
      goalSelect,
      purposeSelect,
      roleOther,
      goalOther,
      purposeOther,
      view,
      instructions: "",
      conStarter1: "",
      conStarter2: "",
      BusinessCardId: businessCardId
    };
     console.log("agent data",agentData);
     
    (navigation as any).navigate('Agent Preview', { agentData });
  };

  if (!selectedMode) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerEmoji}>🤖</Text>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerTitle}>Create New Agent</Text>
                  <Text style={styles.headerSubtitle}>Choose your preferred method</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.modeCard}
              onPress={() => setSelectedMode('role')}
            >
              <Text style={styles.modeIcon}>💼</Text>
              <Text style={styles.modeTitle}>Role Based</Text>
              <Text style={styles.modeDescription}>
                Select your role and create a customized AI agent
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeCard}
              onPress={() => setSelectedMode('card')}
            >
              <Text style={styles.modeIcon}>📇</Text>
              <Text style={styles.modeTitle}>Card Based</Text>
              <Text style={styles.modeDescription}>
                Upload your business card and let AI do the work
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedMode(null)}
                >
                  <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerLeft}>
                  <Text style={styles.headerEmoji}>{selectedMode === 'role' ? '💼' : '🪪'}</Text>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>
                      {selectedMode === 'role' ? 'Role-based AI Agent' : 'Card-based AI Agent'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                      {selectedMode === 'role' 
                        ? 'Choose a role. We auto-apply tone, goals, and defaults.'
                        : 'Upload your card and let AI extract the details.'}
                    </Text>
                  </View>
                </View>
                <View style={styles.headerBadges}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>AI Powered</Text>
                  </View>
                  <View style={[styles.badge, styles.badgeFastest]}>
                    <Text style={styles.badgeTextFastest}>Fastest</Text>
                  </View>
                </View>
              </View>

              {/* Switch Options */}
              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  {selectedMode === 'role' 
                    ? 'Want to use your business card instead?' 
                    : 'Prefer manual entry?'}
                </Text>
                <TouchableOpacity onPress={() => {
                  // Clear all fields when switching modes
                  setRoleSelect('');
                  setGoalSelect('');
                  setPurposeSelect('');
                  setRoleOther('');
                  setGoalOther('');
                  setPurposeOther('');
                  setAgentName('');
                  setCreatorName('');
                  setDescription('');
                  setSelectedMode(selectedMode === 'role' ? 'card' : 'role');
                  setBusinessCardId('')
                }}>
                  <Text style={styles.switchLink}>
                    {selectedMode === 'role' ? 'Switch to Card Based' : 'Switch to Role Based'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

             {/* Card Upload Section - Only for card mode */}
            {selectedMode === 'card' && (
              <CardUploadComponent 
                setRoleSelect={setRoleSelect}
                setGoalSelect={setGoalSelect}
                setPurposeSelect={setPurposeSelect}
                setRoleOther={setRoleOther}
                setGoalOther={setGoalOther}
                setPurposeOther={setPurposeOther}
                setAgentName={setAgentName}
                setDescription={setDescription}
                setVisible={setVisible}               
                setCardDataForm={setCardDataForm} 
                setCardId={setCardId}
                setCreatorName={setCreatorName}
                setBusinessCardDocumentPath={setBusinessCardDocumentPath}
                setBusinessCardId={setBusinessCardId} 
              />
            )}

            {/* Note for card mode */}
            {/* {selectedMode === 'card' && (
              <View style={styles.noteContainer}>
                <Text style={styles.noteText}>
                  <Text style={styles.noteBold}>Note:</Text> Please review the details and make any necessary changes.
                </Text>
              </View>
            )} */}

            {/* Role Selection Card */}
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>I am</Text>
                <View style={styles.inputWrapper}>
                  <CustomSelect
                    value={roleSelect}
                    onChange={setRoleSelect}
                    options={ROLE_OPTS}
                    placeholder="Select your role"
                  />
                {roleSelect === "Other" && (
  <>
    <TextInput
      style={styles.otherInput}
      value={roleOther}
      onChangeText={setRoleOther}
      
      placeholder="Type your role…"
      placeholderTextColor="#94A3B8"
      maxLength={60}
    />
    {roleOther.length >= 60 && (
      <Text style={{ color: 'red', fontSize: 12 }}>
        Max limit is 60 characters
      </Text>
    )}
  </>
)}

                </View>
              </View>

              <View style={styles.row}>
                <Text style={[styles.label, styles.labelBlue]}>
                  Looking for
                </Text>
                <View style={styles.inputWrapper}>
                  <CustomSelect
                    value={goalSelect}
                    onChange={setGoalSelect}
                    options={GOAL_OPTS}
                    placeholder="Select your goal"
                  />
                 {goalSelect === "Other" && (
  <>
    <TextInput
      style={styles.otherInput}
      value={goalOther}
      onChangeText={setGoalOther}
      placeholder="Type your goal…"
      placeholderTextColor="#94A3B8"
      maxLength={60}
    />
    {goalOther.length >= 60 && (
      <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
        Max limit is 60 characters
      </Text>
    )}
  </>
)}
                </View>
              </View>

              <View style={styles.row}>
                <Text style={[styles.label, styles.labelGreen]}>To</Text>
                <View style={styles.inputWrapper}>
                  <CustomSelect
                    value={purposeSelect}
                    onChange={setPurposeSelect}
                    options={PURPOSE_OPTS}
                    placeholder="Select purpose"
                  />
                 {purposeSelect === "Other" && (
  <>
    <TextInput
      style={styles.otherInput}
      value={purposeOther}
      onChangeText={setPurposeOther}
      placeholder="Type your purpose…"
      placeholderTextColor="#94A3B8"
      maxLength={60}
    />
    {purposeOther.length >= 60 && (
      <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
        Max limit is 60 characters
      </Text>
    )}
  </>
)}
                </View>
              </View>
            </View>

{/* Creator Name  */}
 <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Creator Name</Text>
                  <Text style={styles.helperText}>Max 25 characters</Text>
                </View>
             
              </View>
              <TextInput
                style={styles.input}
                value={creatorName}
                onChangeText={setCreatorName}
                placeholder="Enter Your Creator Name"
                placeholderTextColor="#94A3B8"
                maxLength={25}
              />
            </View>

            {/* Agent Name */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Agent Name</Text>
                  <Text style={styles.helperText}>Min 3 – 80 characters</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.suggestButton,
                    (nameLoading ||
                      !roleResolved ||
                      !goalResolved ||
                      !purposeResolved) &&
                      styles.suggestButtonDisabled,
                  ]}
                  onPress={suggestAgentName}
                  disabled={
                    nameLoading ||
                    !roleResolved ||
                    !goalResolved ||
                    !purposeResolved
                  }
                >
                  {nameLoading ? (
                    <ActivityIndicator size="small" color="#6D28D9" />
                  ) : (
                    <>
                      <Text style={styles.suggestIcon}>💡</Text>
                      <Text style={styles.suggestButtonText}>AI Suggest</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                value={agentName}
                onChangeText={setAgentName}
                placeholder="Enter Your Agent Name"
                placeholderTextColor="#94A3B8"
                maxLength={80}
              />
            </View>

            {/* Description */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Agent Description</Text>
                <TouchableOpacity
                  style={[
                    styles.suggestButton,
                    (descSuggestLoading ||
                      !roleResolved ||
                      !goalResolved ||
                      !purposeResolved) &&
                      styles.suggestButtonDisabled,
                  ]}
                  onPress={suggestDescription}
                  disabled={
                    descSuggestLoading ||
                    !roleResolved ||
                    !goalResolved ||
                    !purposeResolved
                  }
                >
                  {descSuggestLoading ? (
                    <ActivityIndicator size="small" color="#6D28D9" />
                  ) : (
                    <>
                      <Text style={styles.suggestIcon}>💡</Text>
                      <Text style={styles.suggestButtonText}>AI Suggest</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Tell what this agent does in your own words…"
                placeholderTextColor="#94A3B8"
                multiline
                maxLength={MAX_DESC}
              />
              <View style={styles.counterRow}>
                <Text style={styles.helperText}>
                  Keep it between {MIN_DESC}–{MAX_DESC} characters
                </Text>
                <Text
                  style={[
                    styles.counter,
                    descCount > MAX_DESC - 20 && styles.counterWarning,
                  ]}
                >
                  {descCount}/{MAX_DESC}
                </Text>
              </View>
            </View>

            {/* Visibility */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Visibility</Text>
              <View style={styles.visibilityRow}>
                <TouchableOpacity
                  style={[
                    styles.visibilityButton,
                    view === "Private" && styles.visibilityButtonActive,
                  ]}
                  onPress={() => setView("Private")}
                >
                  <Text
                    style={[
                      styles.visibilityText,
                      view === "Private" && styles.visibilityTextActive,
                    ]}
                  >
                    Personal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.visibilityButton,
                    view === "Public" && styles.visibilityButtonActive,
                  ]}
                  onPress={() => setView("Public")}
                >
                  <Text
                    style={[
                      styles.visibilityText,
                      view === "Public" && styles.visibilityTextActive,
                    ]}
                  >
                    Public
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

           

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.previewButton,
                  !canPreview && styles.buttonDisabled,
                ]}
                onPress={handlePreview}
                disabled={!canPreview}
              >
                <Text style={styles.previewButtonText}>Preview</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Suggestion Popups - Only Use and Cancel */}
      <SuggestionPopup
        visible={showNamePopup}
        title="AI Suggested Agent Name"
        suggestion={suggestedName}
        onUse={() => {
          setAgentName(suggestedName);
          setShowNamePopup(false);
        }}
        onCancel={() => setShowNamePopup(false)}
      />

      <SuggestionPopup
        visible={showDescPopup}
        title="AI Suggested Description"
        suggestion={suggestedDesc}
        onUse={() => {
          setDescription(suggestedDesc.slice(0, MAX_DESC));
          setShowDescPopup(false);
        }}
        onCancel={() => setShowDescPopup(false)}
      />



       <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => {
        Alert.alert("Hold on", "Please save or cancel your edits first.");
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalWrapper}
      >
        <View style={styles.backdrop} />
        <View style={styles.modalContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.emoji}>💼</Text>
            <Text style={styles.titleText}>Edit Business Card Details</Text>
          </View>
          <Text style={styles.noteText}>Note: Please review the details and make any necessary changes.</Text>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  value={cardDataForm.fullName}
                  onChangeText={(text) => {
                    setCardDataForm((prev) => ({ ...prev, fullName: text }));
                    if (cardErrors.fullName) {
                      setCardErrors(prev => ({...prev, fullName: ''}));
                    }
                  }}
                  placeholder="Enter full name"
                  style={[styles.input, cardErrors.fullName && styles.errorInput]}
                  placeholderTextColor="#9CA3AF"
                />
                {cardErrors.fullName && <Text style={styles.errorText}>{cardErrors.fullName}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Job Title</Text>
                <TextInput
                  value={cardDataForm.jobTitle}
                  onChangeText={(text) =>
                    setCardDataForm((prev) => ({ ...prev, jobTitle: text }))
                  }
                  placeholder="Enter job title"
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Company Name *</Text>
                <TextInput
                  value={cardDataForm.companyName}
                  onChangeText={(text) => {
                    setCardDataForm((prev) => ({ ...prev, companyName: text }));
                    if (cardErrors.companyName) {
                      setCardErrors(prev => ({...prev, companyName: ''}));
                    }
                  }}
                  placeholder="Enter company name"
                  style={[styles.input, cardErrors.companyName && styles.errorInput]}
                  placeholderTextColor="#9CA3AF"
                />
                {cardErrors.companyName && <Text style={styles.errorText}>{cardErrors.companyName}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={cardDataForm.email}
                  onChangeText={(text) =>
                    setCardDataForm((prev) => ({ ...prev, email: text }))
                  }
                  placeholder="Enter email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Phone *</Text>
                <TextInput
                  value={cardDataForm.mobileNumber}
                  onChangeText={(text) => {
                    setCardDataForm((prev) => ({ ...prev, mobileNumber: text }));
                    if (cardErrors.phone) {
                      setCardErrors(prev => ({...prev, phone: ''}));
                    }
                  }}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  style={[styles.input, cardErrors.phone && styles.errorInput]}
                  placeholderTextColor="#9CA3AF"
                />
                {cardErrors.phone && <Text style={styles.errorText}>{cardErrors.phone}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Website</Text>
                <TextInput
                  value={cardDataForm.website}
                  onChangeText={(text) =>
                    setCardDataForm((prev) => ({ ...prev, website: text }))
                  }
                  placeholder="Enter website"
                  autoCapitalize="none"
                  style={styles.input}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>Address *</Text>
              <TextInput
                value={cardDataForm.address}
                onChangeText={(text) => {
                  setCardDataForm((prev) => ({ ...prev, address: text }));
                  if (cardErrors.address) {
                    setCardErrors(prev => ({...prev, address: ''}));
                  }
                }}
                placeholder="Enter address"
                style={[styles.input, styles.textArea, cardErrors.address && styles.errorInput]}
                placeholderTextColor="#9CA3AF"
                multiline
              />
              {cardErrors.address && <Text style={styles.errorText}>{cardErrors.address}</Text>}
            </View>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleCancel}
              disabled={cardDataSaving}
              style={[
                styles.cancelButton1,
                cardDataSaving && { opacity: 0.6 },
              ]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCardDataSubmit}
              disabled={cardDataSaving}
              style={[
                styles.saveButton,
                cardDataSaving && { opacity: 0.7 },
              ]}
            >
              {cardDataSaving ? (
                <>
                  <ActivityIndicator size="small" />
                  <Text style={styles.saveButtonText}>  Submitting...</Text>
                </>
              ) : (
                <Text style={styles.saveButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>

      {/* Agent Name Suggestion Modal */}
      <Modal
        visible={showAgentNameModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAgentNameModal(false)}
      >
        <View style={styles.suggestionOverlay}>
          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionTitle}>Suggested Agent Name</Text>
            <Text style={styles.suggestedName}>{suggestedAgentName}</Text>
            <Text style={styles.suggestionText}>Would you like to use this agent name?</Text>
            
            <View style={styles.suggestionButtons}>
              <TouchableOpacity
                style={[styles.suggestionButton, styles.useButton]}
                onPress={handleAgentNameAccept}
              >
                <Text style={styles.useButtonText}>Yes</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.suggestionButton, styles.cancelButton]}
                onPress={handleAgentNameReject}
              >
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },

  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  headerEmoji: {
    fontSize: 28,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  headerBadges: {
    gap: 6,
    alignItems: "flex-end",
  },
  badge: {
    backgroundColor: "#6D28D9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  badgeFastest: {
    backgroundColor: "#FCD34D",
  },
  badgeTextFastest: {
    color: "#78350F",
    fontSize: 10,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6D28D9",
    minWidth: 85,
    paddingTop: 12,
  },
  labelBlue: {
    color: "#2563EB",
  },
  labelGreen: {
    color: "#059669",
  },
  inputWrapper: {
    flex: 1,
  },

  selectContainer: {
    zIndex: 1,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  selectText: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "600",
    flex: 1,
  },
  selectPlaceholder: {
    fontSize: 14,
    color: "#94A3B8",
    flex: 1,
  },
  selectArrow: {
    fontSize: 10,
    color: "#94A3B8",
    marginLeft: 8,
  },
  otherInput: {
    marginTop: 8,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    color: "#0F172A",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalClose: {
    fontSize: 24,
    color: "#64748B",
  },
  optionsScroll: {
    maxHeight: 400,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  optionItemSelected: {
    backgroundColor: "#F3E8FF",
  },
  optionText: {
    fontSize: 15,
    color: "#0F172A",
  },
  optionTextSelected: {
    color: "#6D28D9",
    fontWeight: "600",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  suggestButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 4,
  },
  suggestButtonDisabled: {
    opacity: 0.5,
  },
  suggestIcon: {
    fontSize: 14,
  },
  suggestButtonText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6D28D9",
  },

  input: {
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    color: "#0F172A",
  },
  textArea: {
    minHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    color: "#0F172A",
    textAlignVertical: "top",
  },

  helperText: {
    fontSize: 12,
    color: "#64748B",
  },

  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  counter: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0EA5E9",
  },
  counterWarning: {
    color: "#F59E0B",
  },

  visibilityRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  visibilityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  visibilityButtonActive: {
    borderColor: "#6D28D9",
    backgroundColor: "#F3E8FF",
  },
  visibilityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  visibilityTextActive: {
    color: "#6D28D9",
    fontWeight: "700",
  },

  actions: {
    marginTop: 8,
    marginBottom: 20,
  },
  previewButton: {
    backgroundColor: "#6D28D9",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#6D28D9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
    elevation: 0,
  },
  previewButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  suggestionOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  suggestionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
    textAlign: "center",
  },
  suggestionTextContainer: {
    maxHeight: 250,
    marginBottom: 20,
    paddingRight: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
  },
  suggestedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6D28D9',
    marginVertical: 15,
    textAlign: 'center',
  },
  suggestionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  suggestionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  useButton: {
    backgroundColor: "#059669",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  useButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "#E2E8F0",
  },
  cancelButtonText: {
    color: "#475569",
    fontSize: 15,
    fontWeight: "700",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  modalContainer: {
    width: "92%",
    maxHeight: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emoji: {
    fontSize: 22,
    marginRight: 6,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  row1: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  field: {
    flex: 1,
  },
  label1: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    color: "#0F172A",
  },
  input1: {
    width: "100%",
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  textArea1: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    gap: 10,
  },
  cancelButton1: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#FFFFFF",
  },
  cancelButtonText1: {
    color: "#0F172A",
    fontWeight: "800",
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 9,
    paddingHorizontal: 22,
    borderRadius: 999,
    borderWidth: 0,
    backgroundColor: "#6366F1", // solid for now; you can add gradient via LinearGradient
    flexDirection: "row",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },
  cardContainer: {
    padding: 20,
    gap: 20,
  },
  modeCard: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modeIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#6D28D9',
    fontWeight: 'bold',
  },
  switchContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  switchLink: {
    fontSize: 14,
    color: '#6D28D9',
    fontWeight: '600',
  },
  noteContainer: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  noteText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  noteBold: {
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButton: {
    backgroundColor: '#6D28D9',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6D28D9',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalButtonTextSecondary: {
    color: '#6D28D9',
    fontWeight: '600',
    fontSize: 16,
  },
  errorInput: {
    borderColor: '#dc3545',
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 5,
  },
});

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#C4B5FD',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#6D28D9',
    padding: 18,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#E9D5FF',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 6,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  activeTabText: {
    color: '#6D28D9',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 15,
    color: '#57534E',
    lineHeight: 21,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 15,
  },
  highlight: {
    color: '#6D28D9',
    fontWeight: '700',
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#C4B5FD',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F3E8FF',
    marginBottom: 10,
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  uploadIcon: {
    fontSize: 36,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6D28D9',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 10,
    color: '#5B21B6',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    textAlign: 'center',
  },
  previewContainer: {
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
  },
  previewImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  fileName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 3,
  },
  changeText: {
    fontSize: 10,
    color: '#059669',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  removeButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 11,
  },
  uploadButton: {
    flex: 3,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#6D28D9',
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.7,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  tip: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 13,
    color: '#6D28D9',
  },
  tipBold: {
    fontWeight: '700',
  },
  footer: {
    backgroundColor: '#F3E8FF',
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#C4B5FD',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#6D28D9',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeGreen: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  badgePurple: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

export default AgentCreationScreen;