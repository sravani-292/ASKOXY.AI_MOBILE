import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Icon components (simplified versions of Lucide icons)
const CheckIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>✓</Text>
  </View>
);

const EyeIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>👁</Text>
  </View>
);

const EditIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>✏️</Text>
  </View>
);

const ShareIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>🔗</Text>
  </View>
);

const QRIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>📱</Text>
  </View>
);

const WhatsAppIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>💬</Text>
  </View>
);

const TwitterIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>🐦</Text>
  </View>
);

const LinkedInIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>💼</Text>
  </View>
);

const DownloadIcon = () => (
  <View style={styles.iconContainer}>
    <Text style={styles.iconText}>⬇️</Text>
  </View>
);

const AgentCreationProcess = ({ agentData, updateAgentData }) => {
  const [blogDescription, setBlogDescription] = useState(
    'Discover how EduAssist Pro is revolutionizing education with AI-powered personalized tutoring. Learn about our adaptive learning technology that helps K-12 students excel in mathematics, science, and reading comprehension through intelligent, responsive teaching methods.'
  );

  const navigation = useNavigation();

  const StepIndicator = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Agent Creation Process</Text>
      <Text style={styles.stepSubtitle}>Step 4 of 5</Text>
      
      <View style={styles.stepsRow}>
        {[
          { number: 1, label: 'Vision', completed: true },
          { number: 2, label: 'Capabilities', completed: true },
          { number: 3, label: 'Training', completed: true },
          { number: 4, label: 'Publish', active: true },
          { number: 5, label: 'Deploy', completed: false }
        ].map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={[
              styles.stepCircle,
              step.completed && styles.completedStep,
              step.active && styles.activeStep
            ]}>
              {step.completed ? (
                <Text style={styles.checkMark}>✓</Text>
              ) : (
                <Text style={[
                  styles.stepNumber,
                  step.active && styles.activeStepNumber
                ]}>
                  {step.number}
                </Text>
              )}
            </View>
            <Text style={[
              styles.stepLabel,
              (step.completed || step.active) && styles.activeStepLabel
            ]}>
              {step.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const AgentPreview = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <EyeIcon />
        <Text style={styles.cardTitle}>Agent Page Preview</Text>
      </View>
      
      <View style={styles.successBanner}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.successText}>Agent page automatically generated and ready to publish</Text>
      </View>

      <View style={styles.agentProfile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>EA</Text>
        </View>
        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>EduAssist Pro</Text>
          <Text style={styles.agentMeta}>Education • Created today</Text>
          <Text style={styles.agentDescription}>
            An intelligent tutoring assistant that provides personalized learning experiences for K-12 students. Specializes in mathematics, science, and reading comprehension with adaptive questioning techniques.
          </Text>
          
          <View style={styles.tags}>
            {['Education', 'K-12', 'Tutoring', 'Adaptive Learning'].map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <EditIcon />
        <Text style={styles.editButtonText}>Edit Preview</Text>
      </TouchableOpacity>
    </View>
  );

  const BlogDraft = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <EditIcon />
        <Text style={styles.cardTitle}>Auto-Generated Blog Draft</Text>
      </View>
      
      <View style={styles.draftBanner}>
        <Text style={styles.draftIcon}>✏️</Text>
        <Text style={styles.draftText}>Draft ready for review and editing</Text>
      </View>

      <View style={styles.blogForm}>
        <Text style={styles.fieldLabel}>Blog Title</Text>
        <TextInput
          style={styles.titleInput}
          defaultValue="Introducing EduAssist Pro: The Future of Personalized K-12 Learning"
          multiline
        />
        
        <Text style={styles.fieldLabel}>Blog Description</Text>
        <TextInput
          style={styles.descriptionInput}
          value={agentData.description}
          onChangeText={(text) => updateAgentData({ description: text })}
          multiline
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.editButton}>
        <EditIcon />
        <Text style={styles.editButtonText}>Edit Full Blog Post</Text>
      </TouchableOpacity>
    </View>
  );

  const ShareSection = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ShareIcon />
        <Text style={styles.cardTitle}>Share Kit & Distribution</Text>
      </View>
      
      <View style={styles.shareGrid}>
        {[
          { Icon: ShareIcon, label: 'Copy Link' },
          { Icon: QRIcon, label: 'Share QR' },
          { Icon: WhatsAppIcon, label: 'WhatsApp Share' },
          { Icon: TwitterIcon, label: 'Share on X' },
          { Icon: LinkedInIcon, label: 'LinkedIn' },
          { Icon: DownloadIcon, label: 'Download Kit' }
        ].map((option, index) => (
          <TouchableOpacity key={index} style={styles.shareOption}>
            <View style={styles.shareIconContainer}>
              <option.Icon />
            </View>
            <Text style={styles.shareLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <StepIndicator />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AgentPreview />
        <BlogDraft />
        <ShareSection />

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.saveButton}>
              <Ionicons name="bookmark-outline" size={20} color="#007AFF" />
              <Text style={styles.saveButtonText}>Save as Draft</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.submitButton} onPress={() => {navigation.navigate('Agent Review')}}>
              <LinearGradient
                colors={['#6B73FF', '#9644FF']}
                style={styles.submitButtonGradient}
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.submitButtonText}>Review and Submit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  
  // Step Indicator Styles
  stepContainer: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  stepTitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 24,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 350,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  completedStep: {
    backgroundColor: '#F59E0B',
  },
  activeStep: {
    backgroundColor: '#6366F1',
  },
  checkMark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeStepNumber: {
    color: 'white',
  },
  stepLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  activeStepLabel: {
    color: '#1E293B',
    fontWeight: '500',
  },

  // Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },

  // Banner Styles
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  successIcon: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  successText: {
    color: '#065F46',
    fontSize: 14,
    flex: 1,
  },
  draftBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  draftIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  draftText: {
    color: '#92400E',
    fontSize: 14,
  },

  // Agent Profile Styles
  agentProfile: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  agentMeta: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  agentDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#475569',
  },

  // Blog Form Styles
  blogForm: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    minHeight: 60,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#4B5563',
    minHeight: 120,
    lineHeight: 20,
  },

  // Share Grid Styles
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shareOption: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 16,
  },
  shareIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shareLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },

  // Button Styles
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },

  // Icon Styles
  iconContainer: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 12,
  },

    // Bottom Buttons
    bottomButtons: {
    flexDirection: 'row',
    gap: 12,
  },
    saveButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AgentCreationProcess;