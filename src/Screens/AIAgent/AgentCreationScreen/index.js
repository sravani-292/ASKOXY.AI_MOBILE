import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5Preview from "./Step5Preview";
import axios from "axios";
import BASE_URL from "../../../../Config";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { a, form } from "framer-motion/m";
import { customText } from "react-native-paper";

const { width } = Dimensions.get("window");

export const CustomButton = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}) => (
  <TouchableOpacity
    style={[
      styles.customButton,
      variant === "primary" ? styles.primaryButton : styles.secondaryButton,
      disabled && styles.disabledButton,
    ]}
    onPress={() => onPress()}
    disabled={disabled || loading}
    accessible={true}
    accessibilityLabel={title}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={
        variant === "primary" && !disabled
          ? ["#6366F1", "#8B5CF6"]
          : ["#F3F4F6", "#E5E7EB"]
      }
      style={styles.buttonGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#fff" : "#374151"}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.buttonText,
            variant === "secondary" && styles.secondaryButtonText,
          ]}
        >
          {title}
        </Text>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

const AgentCreationScreen = ({ route }) => {
  const [step, setStep] = useState(1);
  const [selectedRole,setSelectedRole] = useState(null);
  const [instructionOptions, setInstructionOptions] = useState("");
  const [error, setError] = useState("");
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(false);
  const [instructionLoading, setInstructionLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState(""); // default Bharat AI Store
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const navigation = useNavigation();
  const user = useSelector((state) => state.counter);
  const token = user.accessToken;

  const initialFormData = {
    agentName: "",
    domain: "",
    customDomain: "",
    creatorName: "",
    gender: "",
    description: "",
    creatorExperience: "",
    strengths: "",
    language: "",
    voiceStatus: true,
    business_idea: "",
    Domain_Sector: "",
    customDomain_Sector: "",
    SubDomain_Subsector: "",
    customSubDomain_Subsector: "",
    GPT_Model: "",
    gptModel: "",
    targetUser: "",
    isSolvingProblem: "",
    mainProblemSolved: "",
    uniqueSolution: "",
    business: "",
    targetCustomers: [],
    targetAgeLimit: [],
    targetGender: [],
    conversationTone: "",
    responseFormat: "",
    usageModel: "",
    instructions: "",
    conStarter1: "",
    conStarter2: "",
    conStarter3: "",
    conStarter4: "",
    contactDetails: "",
    userRole: "",
    customUserRole:"",
    rateThisPlatform: 0,
    shareYourFeedback: "",
    userExperience: 0,
    userExperienceSummary: "",
    agentId: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const mapAgentDataToFormData = (agentData) => ({
    agentName: agentData.agentName || "",
    domain: agentData.userRole || "",
    customDomain: agentData.customDomain || "",
    creatorName: agentData.name || "",
    gender: agentData.gender || "",
    description: agentData.description || "",
    creatorExperience: agentData.creatorExperience || "",
    strengths: agentData.strengths || "",
    language: agentData.language || "",
    voiceStatus: agentData.voiceStatus ?? true,
    business_idea: agentData.business || "",
    Domain_Sector: agentData.domain || "",
    customDomain_Sector: agentData.customDomain_Sector || "",
    SubDomain_Subsector: agentData.subDomain || "",
    customSubDomain_Subsector: agentData.customSubDomain_Subsector || "",
    GPT_Model: agentData.GPT_Model || "",
    gptModel: agentData.usageModel || "",
    isSolvingProblem: agentData.isSolvingProblem || "",
    mainProblemSolved: agentData.mainProblemSolved || "",
    uniqueSolution: agentData.uniqueSolution || "",
    business: agentData.business || "",
    targetCustomers: typeof agentData.targetUser === "string"
      ? agentData.targetUser.split(",").map((item) => item.trim()).filter(Boolean)
      : agentData.targetUser || [],
    targetAgeLimit: typeof agentData.ageLimit === "string"
      ? agentData.ageLimit.split(",").map((item) => item.trim()).filter(Boolean)
      : agentData.ageLimit || [],
    targetGender: typeof agentData.gender === "string"
      ? agentData.gender.split(",").map((item) => item.trim()).filter(Boolean)
      : agentData.gender || [],
    conversationTone: agentData.converstionTone || "",
    responseFormat: agentData.responseFormat || "",
    usageModel: agentData.usageModel || "",
    instructions: agentData.instructions || "",
    conStarter1: agentData.conStarter1 || "",
    conStarter2: agentData.conStarter2 || "",
    conStarter3: agentData.conStarter3 || "",
    conStarter4: agentData.conStarter4 || "",
    contactDetails: agentData.contactDetails || "",
    userRole: agentData.userRole || "",
    rateThisPlatform: agentData.rateThisPlatform || 0,
    shareYourFeedback: agentData.shareYourFeedback || "",
    userExperience: agentData.userExperience || 0,
    userExperienceSummary: agentData.userExperienceSummary || "",
    agentId: agentData.id || "",
  });

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.agentData) {
        console.log("Editing agent data:", route.params.agentData);
        setIsUpdateMode(true);
        setFormData(mapAgentDataToFormData(route.params.agentData));
      } else if(route?.params?.selectedRole){ 
          setSelectedRole(route?.params?.selectedRole)
      }else{
        setIsUpdateMode(false);
        setFormData(initialFormData);
      }
      setIsDataLoaded(true);
      
    }, [route?.params?.agentData])
  );

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    axios
      .get(`${BASE_URL}user-service/getProfile/${user?.userId}`)
      .then((response) => {
        // console.log("Profile data", response.data);
        if (response.data?.shareContactDetails) {
          handleChange(
            "shareContactDetails",
            response.data.whatsappNumber ?? response.data.mobileNumber
          );
        }
      })
      .catch((error) => {
        console.log("Profile error", error);
      });
  };

  const handleChange = (field, value) => {
    if (field === "rateThisPlatform" || field === "userExperience") {
      value = value ? parseInt(value, 10) || 0 : 0;
      if (value > 5) value = 5;
    }
    setFormData({ ...formData, [field]: value });
  };

  const fetchInstructions = async () => {
    if (!formData.description) {
      Alert.alert("Info", "Please add a description first.");
      return;
    }
    setInstructionLoading(true);
    try {
    await  axios({
        url: `${BASE_URL}ai-service/agent/classifyInstruct?description=${formData.description}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      })
        .then((response) => {
          console.log("Instruction fetch response", response.data);
          setInstructionOptions(response.data || "");
          setInstructionLoading(false);
        })
        .catch((error) => {
          console.log("error", error.response);
          setInstructionLoading(false);
        });
    } catch (e) {
      console.error("Instruction fetch error", e.response);
      Alert.alert("Error", "Failed to fetch suggestions.");
    }
    setInstructionLoading(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log("Submitting formData:", formData.agentId);
    const conStarters = [
      formData.conStarter1,
      formData.conStarter2,
      formData.conStarter3,
      formData.conStarter4,
    ].filter((item) => item && item.trim() !== "");

    let data = {
      agentId: formData.agentId,
      userId: user?.userId,
      agentStatus: "CREATED",
      rateThisPlatform: 0,
      chooseStore: selectedStore,
      conStarter1: formData.conStarter1 || "",
      conStarter3: formData.conStarter3 || "",
      conStarter2: formData.conStarter2 || "",
      conStarter4: formData.conStarter4 || "",
      status: "REQUESTED",
      activeStatus: true,
      voiceStatus: formData.voiceStatus,
    };

    conStarters.forEach((starter, index) => {
      data[`conStarter${index + 1}`] = starter;
    });

    console.log("Publishing final data:", data);

  await  axios({
      url: `${BASE_URL}ai-service/agent/agentPublish`,
      data: data,
      method: "patch",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("Publish response", response.data);
        Alert.alert("Success", "Agent published successfully!");
        setModalVisible(false);
        setIsLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Publish error", error.response);
        Alert.alert(
          "Error",
          error.response.data.message || "Failed to publish agent."
        );
        setIsLoading(false);
        setModalVisible(false);
      });
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (
          !formData.agentName ||
          !formData.creatorName ||
          !formData.userRole ||
          !formData.description ||
          !formData.language
        ) {
          setError("Please fill all required fields in Profile.");
          alert("Please fill all required fields in Profile.");
          return false;
        }
        break;
      case 2:
        if (
          !formData.business_idea ||
          !formData.Domain_Sector ||
          (formData.Domain_Sector === "Other" &&
            !formData.customDomain_Sector) ||
          !formData.SubDomain_Subsector ||
          (formData.SubDomain_Subsector === "Other" &&
            !formData.customSubDomain_Subsector) ||
          !formData.gptModel ||
          !formData.isSolvingProblem
        ) {
          setError(
            "Please fill the following before Continue: Business/Idea, Domain/Sector, Sub-Domain/Subsector, GPT Model, Are you solving a problem?"
          );
          alert(
            "Please fill the following before Continue: Business/Idea, Domain/Sector, Sub-Domain/Subsector, GPT Model, Are you solving a problem?"
          )
          return false;
        }
        if (
          formData.isSolvingProblem === "yes" &&
          !formData.mainProblemSolved
        ) {
          setError(
            "Please fill the main problem solved field as you indicated you are solving a problem."
          );
          alert(
            "Please fill the main problem solved field as you indicated you are solving a problem."
          )
          return false;
        }
        break;
      case 3:
        if (
          !formData.instructions ||
          !formData.conversationTone ||
          !formData.responseFormat ||
          !formData.targetGender ||
          !formData.targetAgeLimit ||
          !formData.targetCustomers
        ) {
          setError(
            "Please fill the following before Continue: Target Audience Gender, Target Age Limit(s)."
          );
          alert(
            "Please fill the following before Continue: Target Audience Gender, Target Age Limit(s)."
          )
          return false;
        }
        break;
      case 4:
        const rating = parseInt(formData.rateThisPlatform, 10);
        const ux = parseInt(formData.userExperience, 10);
        if (
          isNaN(rating) ||
          rating < 0 ||
          rating > 5 ||
          isNaN(ux) ||
          ux < 0 ||
          ux > 5
        ) {
          setError("Please provide valid ratings (0-5) before proceeding.");
          alert("Please provide valid ratings (0-5) before proceeding.");
          return false;
        }
        break;
    }
    setError("");
    return true;
  };

  const animateTransition = (direction) => {
    const slideValue = direction === "next" ? -width : width;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: slideValue,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(direction === "next" ? step + 1 : step - 1);
      slideAnim.setValue(direction === "next" ? width : -width);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const next = () => {
    if (validateStep()) {
      if (step < 5) animateTransition("next");
    }
  };

  const nextStep =async () => {
    if (step === 1 && validateStep()) {
      const data = {
        userId: user?.userId,
        headerTitle: selectedRole,
        headerStatus: false,
        userRole: formData.userRole === "Other" ? formData.customUserRole : formData.userRole,
        description: formData.description,
        language: formData.language,
        name: formData.creatorName,
        agentName: formData.agentName,
        creatorName: formData.creatorName,
        agentId : formData.agentId || ""
      };
      console.log("Profile Screen data to submit", data);
      setIsLoading(true);
      axios
        .patch(`${BASE_URL}ai-service/agent/agentScreen1`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("Profile Screen data response", res.data);
          setFormData({ ...formData, agentId: res.data.agentId });
          Alert.alert(
            "Success",
            "Profile information saved. Proceed to Business & GPT Model.",
            [
              {
                text: "OK",
                onPress: () => {
                  setIsLoading(false);
                  next();
                },
              },
            ]
          );
        })
        .catch((err) => {
          console.log("Screen 1 data error", err.response);
          setIsLoading(false);
          return;
        });
    }
    if (step === 2 && validateStep()) {
      var data = {
        agentId: formData.agentId,
        business: formData.business_idea,
        domain:
          formData.Domain_Sector === "Other"
            ? formData.customDomain_Sector
            : formData.Domain_Sector,
        responseFormat: formData.responseFormat,
        subDomain:
          formData.SubDomain_Subsector === "Other"
            ? formData.customSubDomain_Subsector
            : formData.SubDomain_Subsector,
        userId: user?.userId,
        solveProblem: formData.isSolvingProblem,
        uniqueSolution: formData.uniqueSolution,
        usageModel: formData.gptModel,
        mainProblemSolved: formData.mainProblemSolved,
      };
      console.log("Business & GPT Model data", data);
      setIsLoading(true)
      axios
        .patch(`${BASE_URL}ai-service/agent/agentScreen2`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("Business & GPT Model data response", res.data);
          Alert.alert(
            "Success",
            "Business & GPT Model information saved. Proceed to Audience & Configuration.",
            [
              {
                text: "OK",
                onPress: () => {
                  setIsLoading(false);
                  next();
                },
              },
            ]
          );
        })
        .catch((err) => {
          console.log("Screen 2 data error", err.response);
          setIsLoading(false);
          return;
        });
    }
    if (step === 3 && validateStep()) {
      var data = {
        ageLimit: formData.targetAgeLimit.join(","),
        agentId: formData.agentId,
        converstionTone: formData.conversationTone,
        gender: formData.targetGender.join(","),
        instructions: formData.instructions,
        targetUser: formData.targetCustomers.join(","),
        contactDetails: user.mobileNumber || user.whatsappNumber,
        shareContact: "YES",
        userId: user?.userId,
      };
      console.log("Audience & Configurations data", data);
      setIsLoading(true);
      axios
        .patch(`${BASE_URL}ai-service/agent/agentScreen3`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("Audience & Configurations response", res.data);
          Alert.alert(
            "Success",
            "Audience & Configurations information saved. Proceed to Publish to create an agent.",
            [
              {
                text: "OK",
                onPress: () => {
                  setIsLoading(false);
                  next();
                },
              },
            ]
          );
        })
        .catch((err) => {
          console.log("Screen 3 data error", err.response);
          setIsLoading(false);
          return;
        });
    }
    if (step === 4) {
      setModalVisible(true);
      return;
    }
  };

  const prevStep = () => {
    setError("");
    if (step > 1) animateTransition("prev");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 formData={formData} handleChange={handleChange} />;
      case 2:
        return <Step2 formData={formData} handleChange={handleChange} />;
      case 3:
        return (
          <Step3
            formData={formData}
            handleChange={handleChange}
            instructionOptions={instructionOptions}
            fetchInstructions={fetchInstructions}
            isLoading={instructionLoading}
          />
        );
      case 4:
        return <Step4 formData={formData} handleChange={handleChange} />;
      case 5:
        return <Step5Preview formData={formData} />;
      default:
        return null;
    }
  };

  const renderProgress = () => {
    const steps = [
      { num: 1, label: "Profile", icon: "👤" },
      { num: 2, label: "Business & GPT Model", icon: "⚙️" },
      { num: 3, label: "Audience & Configuration", icon: "💡" },
      { num: 4, label: "Publish", icon: "🚀" },
    ];

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: `${((step - 1) / 4) * 100}%` },
            ]}
          />
        </View>
        <View style={styles.stepsContainer}>
          {steps.map((s, i) => (
            <View
              key={i}
              style={[styles.progressStep, { flexBasis: `${100 / 5}%` }]}
            >
              <Animated.View
                style={[
                  styles.circle,
                  {
                    backgroundColor:
                      step > s.num
                        ? "#6366F1"
                        : step === s.num
                        ? "#6366F1"
                        : "#E5E7EB",
                    transform: [{ scale: step === s.num ? 1.1 : 1 }],
                  },
                ]}
              >
                {step > s.num ? (
                  <Text style={styles.circleText}>✓</Text>
                ) : (
                  <Text
                    style={[
                      styles.circleText,
                      step === s.num ? { color: "#fff" } : { color: "#9CA3AF" },
                    ]}
                  >
                    {s.num}
                  </Text>
                )}
              </Animated.View>
              <Text style={styles.stepIcon}>{s.icon}</Text>
              <Text
                style={[styles.stepLabel, step === s.num && styles.activeLabel]}
              >
                {s.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Early return for loading state after all hooks
  if (!isDataLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <LinearGradient colors={["#F8FAFC", "#F1F5F9"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {renderProgress()}
          <View style={styles.header}>
          {/* <Text style={styles.headerTitle}>
            {isUpdateMode ? "Update Your AI Agent" : "Create Your AI Agent"}
          </Text> */}
          <Text style={styles.headerSubtitle}>
            Step {step} of 4 • {Math.round((step / 4) * 100)}% Complete
          </Text>
        </View>
        <Animated.View
          style={[
            styles.contentContainer,
            { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
          ]}
        >
          <View style={styles.stepCard}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {error ? (
                <View style={styles.errorCard}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              {renderStep()}
            </ScrollView>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            {step > 1 && (
              <CustomButton
                title="← Back"
                onPress={() => prevStep()}
                variant="secondary"
              />
            )}
            <View style={{ flex: 1 }} />
            {step < 5 ? (
              <CustomButton
                title="Next →"
                onPress={() => nextStep()}
                variant="primary"
                disabled={isLoading}
                loading={isLoading}
              />
            ) : (
              <CustomButton
                title={isUpdateMode ? "🚀 Update Agent" : "🚀 Create Agent"}
                onPress={() => handleSubmit()}
                variant="primary"
                loading={isLoading}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Preview & Final Checks</Text>
            <Text style={styles.modalSubtitle}>
              {formData.agentName || "Your Agent"}
            </Text>
            {[
              formData.conStarter1,
              formData.conStarter2,
              formData.conStarter3,
              formData.conStarter4,
            ]
              .filter((item) => item && item.trim() !== "")
              .map((item, index) => (
                <Text key={index} style={styles.modalDesc}>
                  {item}
                </Text>
              ))}

            <View style={styles.storeOption}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedStore === "Bharath ai store" && styles.radioSelected,
                ]}
                onPress={() => setSelectedStore("Bharath ai store")}
              />
              <Text style={styles.storeLabel}>Bharat AI Store (Free)</Text>
            </View>

            <View style={styles.storeOption}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedStore === "oxy gpt" && styles.radioSelected,
                ]}
                onPress={() => setSelectedStore("oxy gpt")}
              />
              <Text style={styles.storeLabel}>
                OXY GPT Store ($19, Coming soon)
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <CustomButton
                title="Cancel"
                variant="secondary"
                onPress={() => {
                  setModalVisible(false);
                  setIsLoading(false);
                }}
              />
              <CustomButton
                title="Publish"
                onPress={() => handleSubmit()}
                loading={isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  keyboardContainer: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    position: "relative",
  },
  progressTrack: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressStep: {
    alignItems: "center",
    flex: 1,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  circleText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  stepIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  stepLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    fontWeight: "600",
  },
  activeLabel: {
    color: "#6366F1",
    fontWeight: "700",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
    marginTop: 16,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  errorText: {
    color: "#DC2626",
    flex: 1,
    fontWeight: "600",
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    // marginBottom: Platform.OS === "ios" ? 40 : 80,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  customButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    minWidth: 120,
  },
  secondaryButton: {
    minWidth: 100,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButtonText: {
    color: "#374151",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1F2937",
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366F1",
    marginBottom: 4,
  },
  modalDesc: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  storeOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#6366F1",
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: "#6366F1",
  },
  storeLabel: {
    fontSize: 14,
    color: "#374151",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
});

export default AgentCreationScreen;