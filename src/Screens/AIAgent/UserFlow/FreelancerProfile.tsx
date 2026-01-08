import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import BASE_URL from "../../../../Config";
import { useSelector } from "react-redux";
import { Navigation } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";

// Type definitions
interface RootState {
  counter: {
    accessToken: string;
    userId: string;
  };
}

type RateKey = 'hour' | 'day' | 'week' | 'month' | 'year';

const periodLabels: Record<RateKey, string> = {
  hour: 'Per Hour',
  day: 'Per Day', 
  week: 'Per Week',
  month: 'Per Month',
  year: 'Per Year'
};

const { width } = Dimensions.get("window");

const rateOptions = {
  hour: ["125-150", "150-175", "175-200", "200-225", "225-250", "250+"],
  day: [
    "1000-1200",
    "1200-1400",
    "1400-1600",
    "1600-1800",
    "1800-2000",
    "2000+",
  ],
  week: [
    "5000-6000",
    "6000-7000",
    "7000-8000",
    "8000-9000",
    "9000-10000",
    "10000+",
  ],
  month: [
    "20000-22000",
    "22000-24000",
    "24000-26000",
    "26000-28000",
    "28000-30000",
    "30000+",
  ],
  year: [
    "240000-260000",
    "260000-280000",
    "280000-300000",
    "300000-320000",
    "320000+",
  ],
};

export default function FreelancerProfile() {
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const[errorModal,setErrorModal]=useState(false);
  const[errorMessage,setErrorMessage]=useState("");
  const [nameModal, setNameModal] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [isOpenForFreelancing, setIsOpenForFreelancing] = useState("");
  const [isRateNegotiable, setIsRateNegotiable] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [documentPath, setDocumentPath] = useState("");
  const [modalName,setModalName]=useState(false)
  const [profileData, setProfileData] = useState(null);
  const[freelancerData,setFreelancerData]=useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [rateCard, setRateCard] = useState({
    hour: "",
    day: "",
    week: "",
    month: "",
    year: "",
  });
  const[showConfirmModal,setShowConfirmModal]=useState(false);

  const userData = useSelector((state: RootState) => state.counter);
  //   console.log("User Data in Freelancer Profile:", userData);

  const token = userData.accessToken;
  const userId = userData.userId;

  const handleRateChange = (key: RateKey, value: string) => {
    setRateCard((prev) => ({ ...prev, [key]: value }));
  };

useFocusEffect(
 useCallback(() => {
    getProfile();
    getFreelancerData();
  }, [])
)

  const getProfile = async () => {
    // setProfileLoader(true);
 
      axios({
        method: "GET",
        url: BASE_URL + `user-service/customerProfileDetails?customerId=${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setProfileData(response.data);
        if(response.data.firstName==null){
          setNameModal(true);
        }
  })   
  .catch((error)=>{
    console.log(error.response)
  })     
      
  

  };

  const getFreelancerData = async () => {

       axios.get(
        `${BASE_URL}ai-service/agent/getFreeLancersData/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
console.log("Freelancer Data:", response.data);

 if (response.data && response.data.length > 0) {
        setProfileExists(true);
        setFreelancerData(response.data);
        
        // Populate form with existing data
        setIsOpenForFreelancing(response.data[0].openForFreeLancing?.toLowerCase() || "");
        setIsRateNegotiable(response.data[0].amountNegotiable?.toLowerCase() || "");
        setDocumentPath(response.data[0].resumeUrl || "");
  const mapValueToOption = (value: number, period: RateKey) => {
          if (!value || value === 0) return '';
          const options = rateOptions[period];
          return options.find(option => {
            const match = option.match(/^(\d+)/);
            return match && parseInt(match[1]) === value;
          }) || value.toString();
        };
        setRateCard({
            hour: mapValueToOption(response.data[0].perHour, 'hour'),
          day: mapValueToOption(response.data[0].perDay, 'day'),
          week: mapValueToOption(response.data[0].perWeek, 'week'),
          month: mapValueToOption(response.data[0].perMonth, 'month'),
          year: mapValueToOption(response.data[0].perYear, 'year')
        });
      }
      })
       .catch((error) =>{
      console.log('No existing freelancer data:', error.response);
      setProfileExists(false);
    })
    } 
   
 

  const pickResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/msword"],
    });

    if (result.assets) {
      setResumeFile(result.assets[0]);
      uploadResume(result.assets[0]);
    }
  };

  const uploadResume = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as any);

    axios
      .post(
        `${BASE_URL}upload-service/upload?id=45880e62-acaf-4645-a83e-d1c8498e923e&fileType=aadhar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("Upload Response:", res.data);
        setDocumentPath(res.data.documentPath);
        setLoading(false);
        Alert.alert("Success", "Resume uploaded successfully");
      })
      .catch((err) => {
        console.log("Upload Error:", err.response);
        setLoading(false);
        Alert.alert("Error", "Failed to upload resume");
      });
  };

  const validateFields = () => {
    const newErrors: any = {};
    
    if (!isOpenForFreelancing) {
      newErrors.freelancing = "Please select if you're open for freelancing";
    }
    
    if (isOpenForFreelancing === "yes") {
      const selectedRates = Object.values(rateCard).filter(rate => rate !== "");
      if (selectedRates.length === 0) {
        newErrors.rateCard = "Please select at least one rate";
      }
      if (!isRateNegotiable) newErrors.negotiable = "Please select if rate is negotiable";
    }
    
    if (!documentPath) {
      newErrors.resume = "Please upload your resume";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitProfile = async () => {
    if (!validateFields()) {
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);


      const extract = (rateString: string) => {
        if (!rateString) return 0;
        const match = rateString.match(/^(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
    const payload = {
      userId,
      openForFreeLancing: isOpenForFreelancing.toUpperCase(),
      amountNegotiable: isRateNegotiable.toUpperCase(),
      perHour: extract(rateCard.hour),
      perDay: extract(rateCard.day),
      perWeek: extract(rateCard.week),
      perMonth: extract(rateCard.month),
      perYear: extract(rateCard.year),
      resumeUrl: documentPath,
      email:profileData.email || "",
      id: (freelancerData && freelancerData[0] && freelancerData[0].id) || "",
    };
console.log(payload)
    try {
      await axios.patch(
        `${BASE_URL}ai-service/agent/freeLancerInfo`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile saved successfully");
      setSuccessModal(true);
      setShowConfirmModal(false)
    } catch (error) {
      console.log(error.response);
      setShowConfirmModal(false)
      setErrorModal(true)
      setErrorMessage(error.response.data.error || "Failed to save profile");
      // Alert.alert("Failed", error.response.data.error || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Freelance Resume</Text>
<Text style={[styles.note,{backgroundColor:"#9333ea",padding:10,color:"white",borderRadius:10,marginBottom:10,fontSize:16}]}>Welcome to ASKOXY.AI. We help professionals showcase their skills, connect with opportunities, and receive fair payouts for their work.</Text>
      <Text style={styles.label}>Open for Freelancing?</Text>
      <View style={styles.row}>
        {["yes", "no"].map((v) => (
          <TouchableOpacity
            key={v}
            style={[
              styles.radio,
              isOpenForFreelancing === v && styles.radioActive,
            ]}
            onPress={() => setIsOpenForFreelancing(v)}
          >
            <Text>{v.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.freelancing && <Text style={styles.errorText}>{errors.freelancing}</Text>}

      {isOpenForFreelancing === "yes" && (
        <>
          <Text style={styles.label}>Rate Card</Text>
          {errors.rateCard && <Text style={styles.errorText}>{errors.rateCard}</Text>}

          <View style={styles.rateGrid}>
            {(Object.keys(rateCard) as RateKey[]).map((key) => (
              <View key={key} style={styles.rateItem}>
                <Text style={styles.rateLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <View style={styles.pickerWrapper}>
                  <Dropdown
                    data={rateOptions[key].map(opt => ({ label: `₹${opt}`, value: opt }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select"
                    value={rateCard[key]}
                    onChange={(item) => handleRateChange(key, item.value)}
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    renderRightIcon={() => (
                      <Ionicons name="chevron-down" size={20} color="#666" />
                    )}
                  />
                </View>
                {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
              </View>
            ))}
          </View>
          <Text>Rate Guidelines: In India per hour ₹125-500, per day ₹1000-2000, per week ₹5000-10,000, per month ₹20,000-30,000

</Text>

          <Text style={styles.label}>Is Rate Negotiable?</Text>
          <View style={styles.row}>
            {["yes", "no"].map((v) => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.radio,
                  isRateNegotiable === v && styles.radioActive,
                ]}
                onPress={() => setIsRateNegotiable(v)}
              >
                <Text>{v.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.negotiable && <Text style={styles.errorText}>{errors.negotiable}</Text>}

          <View style={styles.uploadSection}>
            <Text style={styles.uploadLabel}>📄 Resume</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickResume}>
              <Text style={styles.uploadText}>
                {resumeFile ? `✓ ${resumeFile.name}` : "📎 Upload Resume"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.note}>
              💡 Upload your resume to showcase skills to clients
            </Text>
            {profileExists && documentPath ? (
              <TouchableOpacity onPress={()=>Linking.openURL(documentPath)}>
              <Text style={styles.selectedValue}>{documentPath}</Text>
              </TouchableOpacity>
            ) : null}
            {errors.resume && <Text style={styles.errorText}>{errors.resume}</Text>}
          </View>
        </>
      )}

      {isOpenForFreelancing === "no" && (
        <View style={styles.uploadSection}>
          <Text style={styles.uploadLabel}>📄 Resume</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickResume}>
            <Text style={styles.uploadText}>
              {resumeFile ? `✓ ${resumeFile.name}` : "📎 Upload Resume"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.note}>
            💡 Keep your profile updated with latest resume
          </Text>
          {errors.resume && <Text style={styles.errorText}>{errors.resume}</Text>}
        </View>
      )}

{isOpenForFreelancing === "no" || isOpenForFreelancing === "yes" ? (
      <TouchableOpacity style={styles.submitBtn} onPress={() => submitProfile()}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Save Freelance Profile</Text>
        )}
      </TouchableOpacity>
):null}

      {/* Name Modal */}
      <Modal visible={nameModal} transparent>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile Incomplete</Text>
            <Text style={styles.modalText}>Please complete your profile setup first by adding your name.</Text>
            <TouchableOpacity style={styles.modalBtn} 
            // onPress={() =>{ navigation.navigate('Profile Edit') ,setNameModal(false)}}
            >
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirm Modal */}
  <Modal
  visible={showConfirmModal}
  transparent
  animationType="fade"
  onRequestClose={() => setShowConfirmModal(false)}
>
  <View style={styles.overlay}>
    <View style={styles.modalContainer}>

      {/* Header */}
      <View style={[styles.header,{backgroundColor:"#7e22ce",alignItems:"center"}]}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>💼</Text>
        </View>
        <Text style={styles.title}>Confirm Your Details</Text>
        <Text style={styles.subtitle}>
          Please review your information before saving
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Freelancing Status */}
        <View style={styles.cardRow}>
          <Text style={styles.label}>Open for Freelancing</Text>
          <Text
            style={[
              styles.value,
              isOpenForFreelancing === "yes"
                ? styles.success
                : styles.warning,
            ]}
          >
            {isOpenForFreelancing === "yes" ? "YES" : "NO"}
          </Text>
        </View>

        {/* Email */}
        {/* <View style={styles.cardRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.muted}>{profileData.email}</Text>
        </View> */}

        {isOpenForFreelancing === "yes" && (
          <>
            {/* Rate Card */}
            <Text style={styles.sectionTitle}>💰 Rate Card</Text>
            <View style={styles.rateContainer}>
              {Object.entries(rateCard).map(([period, rate]) =>
                rate ? (
                  <View key={period} style={styles.rateChip}>
                    <Text style={styles.rateLabel}>
                      {periodLabels[period]}
                    </Text>
                    <Text style={styles.rateValue}>₹{rate}</Text>
                  </View>
                ) : null
              )}
            </View>

            {/* Negotiable */}
            <View style={styles.cardRow}>
              <Text style={styles.label}>Rate Negotiable</Text>
              <Text
                style={[
                  styles.value,
                  isRateNegotiable === "yes"
                    ? styles.success
                    : styles.error,
                ]}
              >
                {isRateNegotiable === "yes" ? "YES" : "NO"}
              </Text>
            </View>
          </>
        )}

        {/* Resume */}
        <View style={styles.cardRow}>
          <Text style={styles.label}>Resume</Text>
          <Text
            style={[
              styles.value,
              resumeFile?.name ? styles.success : styles.error,{width:200}
            ]}
          >
            {resumeFile?.name || documentPath || "Not Uploaded"}
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => setShowConfirmModal(false)}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => confirmSubmit()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Confirm & Save</Text>
          )}
        </TouchableOpacity>
      </View>

    </View>
  </View>
</Modal>


      {/* Success Modal */}
<Modal visible={successModal} transparent animationType="fade">
  <View style={styles.successOverlay}>
    <View style={styles.successCard}>

      {/* Success Icon */}
      <View style={styles.successIconWrapper}>
        <Text style={styles.successIcon}>🎉</Text>
      </View>

      {/* Text */}
      <Text style={styles.successTitle}>Profile Saved!</Text>
      <Text style={styles.successSubtitle}>
        Your freelancer profile has been successfully updated.
      </Text>

      {/* Info Box */}
      <View style={styles.successInfo}>
        <Text style={styles.successInfoText}>
          🚀 You are now visible for new opportunities.
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.successBtn}
        onPress={() => setSuccessModal(false)}
      >
        <Text style={styles.successBtnText}>Continue</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>


{/* Error Modal */}
<Modal visible={errorModal} transparent animationType="fade">
  <View style={styles.errorOverlay}>
    <View style={styles.errorCard}>

      {/* Error Icon */}
      <View style={styles.errorIconWrapper}>
        <Text style={styles.errorIcon}>❌</Text>
      </View>

      {/* Text */}
      <Text style={styles.errorTitle}>Something Went Wrong</Text>
      <Text style={styles.errorSubtitle}>
        We couldn’t save your profile. Please try again.
      </Text>

      {/* Info Box */}
      <View style={styles.errorInfo}>
        <Text style={styles.errorInfoText}>
{errorMessage}       
 </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.errorBtn}
        onPress={() => setErrorModal(false)}
      >
        <Text style={styles.errorBtnText}>Try Again</Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#faf5ff" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  label: { fontSize: 14, marginTop: 16, fontWeight: "600" },
  row: { flexDirection: "row", gap: 12, marginTop: 8 },
  radio: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    width: width / 3,
    alignItems: "center",
  },
  radioActive: { backgroundColor: "#e9d5ff", borderColor: "#9333ea" },
  rateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  rateItem: {
    width: "48%",
    marginBottom: 16,
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: "relative",
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },
  uploadSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  uploadLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  uploadBtn: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#7e22ce",
    borderStyle: "dashed",
    alignItems: "center",
    marginBottom: 8,
  },
  uploadText: {
    color: "#7e22ce",
    fontWeight: "600",
    fontSize: 14,
  },
  note: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 16,
  },
  submitBtn: {
    marginTop: 30,
    marginBottom:50,
    backgroundColor: "#7e22ce",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700" },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtn: {
    backgroundColor: '#7e22ce',
    padding: 15,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  selectedValue: {
    color: '#27ae60',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 20,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  confirmScroll: {
    maxHeight: 300,
    marginVertical: 10,
  },
  confirmLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  confirmValue: {
    fontWeight: '400',
    color: '#666',
  },
  confirmRate: {
    fontSize: 13,
    color: '#333',
    marginLeft: 10,
    marginBottom: 4,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#7e22ce',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.55)",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
},

modalContainer: {
  width: "100%",
  maxHeight: "90%",
  backgroundColor: "#fff",
  borderRadius: 22,
  overflow: "hidden",
  elevation: 15,
},



iconCircle: {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: "#ede9fe",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10,
},

icon: { fontSize: 26 },

title: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "800",
},

subtitle: {
  color: "#e9d5ff",
  fontSize: 13,
  marginTop: 4,
  textAlign: "center",
},

content: {
  padding: 16,
},

sectionTitle: {
  fontSize: 14,
  fontWeight: "800",
  color: "#4c1d95",
  marginVertical: 12,
},

cardRow: {
  backgroundColor: "#f9fafb",
  borderRadius: 14,
  padding: 14,
  marginBottom: 12,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

// label: {
//   fontSize: 13,
//   color: "#6b7280",
//   fontWeight: "600",
// },

value: {
  fontSize: 13,
  fontWeight: "800",
},

muted: {
  fontSize: 13,
  color: "#6b7280",
},

rateContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
},

rateChip: {
  backgroundColor: "#f3e8ff",
  borderRadius: 14,
  paddingVertical: 10,
  paddingHorizontal: 12,
  minWidth: "45%",
},

// rateLabel: {
//   fontSize: 11,
//   color: "#6d28d9",
//   fontWeight: "700",
// },

rateValue: {
  fontSize: 14,
  fontWeight: "900",
  color: "#4c1d95",
  marginTop: 2,
},

footer: {
  flexDirection: "row",
  gap: 12,
  padding: 16,
  borderTopWidth: 1,
  borderColor: "#e5e7eb",
},

// cancelBtn: {
//   flex: 1,
//   paddingVertical: 14,
//   borderRadius: 14,
//   backgroundColor: "#f1f5f9",
//   alignItems: "center",
// },

cancelText: {
  color: "#475569",
  fontWeight: "800",
},

// confirmBtn: {
//   flex: 1.3,
//   paddingVertical: 14,
//   borderRadius: 14,
//   backgroundColor: "#7e22ce",
//   alignItems: "center",
// },

confirmText: {
  color: "#fff",
  fontWeight: "900",
},

success: { color: "#16a34a" },
warning: { color: "#f59e0b" },
error: { color: "#dc2626" },
successOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
},

successCard: {
  width: "100%",
  backgroundColor: "#ffffff",
  borderRadius: 24,
  padding: 24,
  alignItems: "center",
  elevation: 20,
},

successIconWrapper: {
  width: 90,
  height: 90,
  borderRadius: 45,
  backgroundColor: "#ecfdf5",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 16,
  borderWidth: 3,
  borderColor: "#10b981",
},

successIcon: {
  fontSize: 40,
},

successTitle: {
  fontSize: 22,
  fontWeight: "900",
  color: "#065f46",
  marginBottom: 6,
},

successSubtitle: {
  fontSize: 14,
  color: "#4b5563",
  textAlign: "center",
  marginBottom: 16,
  lineHeight: 20,
},

successInfo: {
  backgroundColor: "#f0fdf4",
  borderRadius: 12,
  padding: 12,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: "#bbf7d0",
},

successInfoText: {
  fontSize: 13,
  color: "#15803d",
  textAlign: "center",
  fontWeight: "600",
},

successBtn: {
  width: "100%",
  backgroundColor: "#10b981",
  paddingVertical: 14,
  borderRadius: 14,
  alignItems: "center",
},

successBtnText: {
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "900",
},
errorOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
},

errorCard: {
  width: "100%",
  backgroundColor: "#ffffff",
  borderRadius: 24,
  padding: 24,
  alignItems: "center",
  elevation: 20,
},

errorIconWrapper: {
  width: 90,
  height: 90,
  borderRadius: 45,
  backgroundColor: "#fef2f2",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 16,
  borderWidth: 3,
  borderColor: "#ef4444",
},

errorIcon: {
  fontSize: 38,
},

errorTitle: {
  fontSize: 22,
  fontWeight: "900",
  color: "#7f1d1d",
  marginBottom: 6,
},

errorSubtitle: {
  fontSize: 14,
  color: "#4b5563",
  textAlign: "center",
  marginBottom: 16,
  lineHeight: 20,
},

errorInfo: {
  backgroundColor: "#fff1f2",
  borderRadius: 12,
  padding: 12,
  marginBottom: 20,
  borderWidth: 1,
  borderColor: "#fecaca",
},

errorInfoText: {
  fontSize: 13,
  color: "#991b1b",
  textAlign: "center",
  fontWeight: "600",
},

errorBtn: {
  width: "100%",
  backgroundColor: "#ef4444",
  paddingVertical: 14,
  borderRadius: 14,
  alignItems: "center",
},

errorBtnText: {
  color: "#ffffff",
  fontSize: 16,
  fontWeight: "900",
},

});
