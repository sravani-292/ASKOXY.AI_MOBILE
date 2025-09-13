import React, { useState, useEffect } from "react";
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
  StyleSheet
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5Preview from "./Step5Preview";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

export  const CustomButton = ({ title, onPress, variant = 'primary', disabled = false, loading = false }) => (
    <TouchableOpacity
      style={[
        styles.customButton,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityLabel={title}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={
          variant === 'primary' && !disabled
            ? ['#6366F1', '#8B5CF6'] 
            : ['#F3F4F6', '#E5E7EB']
        }
        style={styles.buttonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#fff' : '#374151'} size="small" />
        ) : (
          <Text 
            style={[
              styles.buttonText,
              variant === 'secondary' && styles.secondaryButtonText
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
  const [instructionOptions, setInstructionOptions] = useState("");
  const [error, setError] = useState("");
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const [formData, setFormData] = useState({
    agentName: "",
    domain: "",
    customDomain: "",
    subDomain: "",
    gender: "",
    ageLimit: "",
    language: "",
    voiceStatus: true,
    description: "",
    targetUser: "",
    mainProblemSolved: "",
    uniqueSolution: "",
    business: "",
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
    rateThisPlatform: 0,
    shareYourFeedback: "",
    userExperience: 0,
    userExperienceSummary: "",
  });

  const navigation = useNavigation();

  // Handle route.params for update mode
  useEffect(() => {
    if (route.params?.agentData) {
      setIsUpdateMode(true);
      const agentData = route.params.agentData;
      setFormData({
        ...formData,
        ...agentData,
        rateThisPlatform: parseInt(agentData.rateThisPlatform, 10) || 0,
        userExperience: parseInt(agentData.userExperience, 10) || 0,
      });
    }
  }, [route.params]);

  const handleChange = (field, value) => {
    if (field === 'rateThisPlatform' || field === 'userExperience') {
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
    setIsLoading(true);
    try {
      const res = await axios.post(
        `http://65.0.147.157:9040/api/ai-service/agent/classifyInstruct?description=${formData.description}`
      );
      setInstructionOptions(res.data || "");
    } catch (e) {
      console.error("Instruction fetch error", e);
      Alert.alert("Error", "Failed to fetch suggestions.");
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        agentStatus: "CREATED",
        status: "APPROVED",
        activeStatus: true,
      };
      if (isUpdateMode) {
        payload.agentId = route.params?.agentData?.id || "";
        payload.userId = route.params?.agentData?.userId || "";
        payload.assistantId = route.params?.agentData?.assistantId || "";
      }
      console.log("Submitting payload:", payload); // Debug log
      const res = await axios.patch(`http://65.0.147.157:9040/api/ai-service/agent/agentCreation`, payload);
      Alert.alert("Success", isUpdateMode ? "Agent updated successfully!" : "Agent created successfully!",
        [{ text: "OK", onPress: () => {
            // Navigate back or to another screen if needed
            navigation.navigate('My Agents');
          }
        }]
      );
      console.log("Submitted:", res.data);
    } catch (e) {
      console.error("Submit error", e);
      Alert.alert("Error", "Something went wrong while submitting");
    }
    setIsLoading(false);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (
          !formData.agentName ||
          !formData.domain ||
          (formData.domain === "Other" && !formData.customDomain) ||
          !formData.subDomain
        ) {
          setError("Please fill all required fields in Basic Info.");
          return false;
        }
        break;
      case 2:
        if (
          !formData.description ||
          !formData.targetUser ||
          !formData.mainProblemSolved ||
          !formData.uniqueSolution
        ) {
          setError("Please complete all Purpose fields.");
          return false;
        }
        break;
      case 3:
        if (
          !formData.conversationTone ||
          !formData.responseFormat ||
          !formData.usageModel
        ) {
          setError("Please complete Personality settings.");
          return false;
        }
        break;
      case 4:
        const rating = parseInt(formData.rateThisPlatform, 10);
        const ux = parseInt(formData.userExperience, 10);
        if (isNaN(rating) || rating < 0 || rating > 5 || isNaN(ux) || ux < 0 || ux > 5) {
          setError("Please provide valid ratings (0-5) before proceeding.");
          return false;
        }
        break;
    }
    setError("");
    return true;
  };

  const animateTransition = (direction) => {
    const slideValue = direction === 'next' ? -width : width;
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
      setStep(direction === 'next' ? step + 1 : step - 1);
      slideAnim.setValue(direction === 'next' ? width : -width);
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

  const nextStep = () => {
    if (validateStep()) {
      if (step < 5) animateTransition('next');
    }
  };

  const prevStep = () => {
    setError("");
    if (step > 1) animateTransition('prev');
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
            isLoading={isLoading}
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
      { num: 1, label: "Basic Info", icon: "👤" },
      { num: 2, label: "Purpose", icon: "🎯" },
      { num: 3, label: "Personality", icon: "🧠" },
      { num: 4, label: "Feedback", icon: "⭐" },
      { num: 5, label: "Preview", icon: "👀" },
    ];

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View 
            style={[styles.progressFill, { width: `${((step - 1) / 4) * 100}%` }]} 
          />
        </View>
        <View style={styles.stepsContainer}>
          {steps.map((s, i) => (
            <View key={i} style={[styles.progressStep, { flexBasis: `${100 / 5}%` }]}>
              <Animated.View
                style={[
                  styles.circle,
                  {
                    backgroundColor: step > s.num ? "#6366F1" : step === s.num ? "#6366F1" : "#E5E7EB",
                    transform: [{ scale: step === s.num ? 1.1 : 1 }],
                  },
                ]}
              >
                {step > s.num ? (
                  <Text style={styles.circleText}>✓</Text>
                ) : (
                  <Text style={[styles.circleText, step === s.num ? { color: '#fff' } : { color: "#9CA3AF" }]}>
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

  return (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isUpdateMode ? "Update Your AI Agent" : "Create Your AI Agent"}
          </Text>
          <Text style={styles.headerSubtitle}>
            Step {step} of 5 • {Math.round((step / 5) * 100)}% Complete
          </Text>
        </View>

        {renderProgress()}

        <Animated.View 
          style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ translateX: slideAnim }]}]}
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
                onPress={prevStep} 
                variant="secondary"
              />
            )}
            <View style={{ flex: 1 }} />
            {step < 5 ? (
              <CustomButton 
                title="Next →" 
                onPress={nextStep} 
                variant="primary"
                disabled={isLoading}
                loading={isLoading}
              />
            ) : (
              <CustomButton 
                title={isUpdateMode ? "🚀 Update Agent" : "🚀 Create Agent"}
                onPress={handleSubmit} 
                variant="primary"
                loading={isLoading}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    position: 'relative',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStep: { 
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  circleText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 16,
  },
  stepIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  stepLabel: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    textAlign: 'center',
    fontWeight: '600',
  },
  activeLabel: { 
    color: '#6366F1', 
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    marginTop: 16,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  errorText: { 
    color: '#DC2626', 
    flex: 1,
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: Platform.OS === 'ios' ? 40 : 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  customButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#374151',
  },
});

export default AgentCreationScreen;