import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const AgentReviewScreen = ({ agentData, handleSubmit }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#6B73FF', '#9644FF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 3 of 3</Text>
          </View>
          
          <Text style={styles.headerTitle}>Review & Submit Agent</Text>
          <Text style={styles.headerSubtitle}>
            Review all agent details below and submit for approval. Once approved, your agent will be available in the 
            agent marketplace for other users.
          </Text>
          
          <Text style={styles.sectionTitle}>Complete Preview</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Agent Preview Card */}
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Agent Preview</Text>
          <Text style={styles.previewSubtitle}>
            This is how your agent will appear to users in the marketplace. Review all details carefully before submitting.
          </Text>

          {/* Agent Info */}
          <View style={styles.agentCard}>
            <View style={styles.agentHeader}>
              <View style={styles.agentIcon}>
                <Text style={styles.agentIconText}>AI</Text>
              </View>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{agentData.agentName}</Text>
                <Text style={styles.agentDescription}>
                 {agentData.description}
                </Text>
              </View>
              <View style={styles.draftBadge}>
                <Text style={styles.draftText}>Draft</Text>
              </View>
            </View>

            {/* Features Grid */}
            <View style={styles.featuresGrid}>
              {/* Vision & Purpose */}
              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Ionicons name="eye-outline" size={20} color="#FF9500" />
                  <Text style={styles.featureTitle}>Vision & Purpose</Text>
                </View>
                <Text style={styles.featureText}>
                  To world-famous customer service by providing 
                  instant, accurate, and personalized support that 
                  enhances customer satisfaction while reducing 
                  operational costs.
                </Text>
                <View style={styles.featureTags}>
                  <Text style={styles.tag}>CUSTOMER SERVICE</Text>
                  <Text style={styles.tag}>LIVE SUPPORT</Text>
                  <Text style={styles.tag}>MULTILINGUAL</Text>
                </View>
              </View>

              {/* Core Instructions */}
              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Ionicons name="settings-outline" size={20} color="#007AFF" />
                  <Text style={styles.featureTitle}>Core Instructions</Text>
                </View>
                <View style={styles.instructionsList}>
                  <Text style={styles.instructionItem}>• Respond professionally and empathetically</Text>
                  <Text style={styles.instructionItem}>• Escalate complex issues to human representatives</Text>
                  <Text style={styles.instructionItem}>• Provide accurate information</Text>
                  <Text style={styles.instructionItem}>• Follow brand voice and tone guidelines</Text>
                  <Text style={styles.instructionItem}>• Collect feedback for continuous improvement</Text>
                </View>
              </View>

              {/* Pricing Structure */}
              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Ionicons name="card-outline" size={20} color="#34C759" />
                  <Text style={styles.featureTitle}>Pricing Structure</Text>
                </View>
                <View style={styles.pricingContainer}>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceAmount}>$0.02</Text>
                    <Text style={styles.priceLabel}>Per Message</Text>
                  </View>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceAmount}>$29</Text>
                    <Text style={styles.priceLabel}>Monthly Rate</Text>
                  </View>
                </View>
              </View>

              {/* Knowledge Assets */}
              <View style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Ionicons name="library-outline" size={20} color="#FF9500" />
                  <Text style={styles.featureTitle}>Knowledge Assets</Text>
                </View>
                <View style={styles.assetsList}>
                  <View style={styles.assetItem}>
                    <Ionicons name="document-outline" size={16} color="#8E8E93" />
                    <Text style={styles.assetText}>FAQ_Database.csv</Text>
                  </View>
                  <View style={styles.assetItem}>
                    <Ionicons name="document-outline" size={16} color="#8E8E93" />
                    <Text style={styles.assetText}>Product_Catalog.json</Text>
                  </View>
                  <View style={styles.assetItem}>
                    <Ionicons name="document-outline" size={16} color="#8E8E93" />
                    <Text style={styles.assetText}>Support_Guidelines.pdf</Text>
                  </View>
                  <View style={styles.assetItem}>
                    <Ionicons name="document-outline" size={16} color="#8E8E93" />
                    <Text style={styles.assetText}>Brand_Guidelines.pdf</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons Row */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Test Agent Talk</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Edit Agent</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Add Instructions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Test Preview</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Edit Assets</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ready to Submit */}
          <View style={styles.submitSection}>
            <Text style={styles.submitTitle}>Ready to Submit?</Text>
            <Text style={styles.submitText}>
              Your agent will be reviewed by our Team within 24 hours. You'll receive an email notification once it's approved and available.
            </Text>
          </View>

          {/* Bottom Buttons */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.saveButton}>
              <Ionicons name="bookmark-outline" size={20} color="#007AFF" />
              <Text style={styles.saveButtonText}>Save as Draft</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <LinearGradient
                colors={['#6B73FF', '#9644FF']}
                style={styles.submitButtonGradient}
              >
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.submitButtonText}>Submit for Approval</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  stepIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  stepText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    marginTop: -10,
  },
  previewCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    minHeight: '100%',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  previewSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  agentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  agentIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  agentIconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  agentDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  draftBadge: {
    backgroundColor: '#FFF2CC',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  draftText: {
    color: '#B25000',
    fontSize: 12,
    fontWeight: '600',
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
    marginBottom: 12,
  },
  featureTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E5E5EA',
    color: '#3C3C43',
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  instructionsList: {
    gap: 4,
  },
  instructionItem: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
  },
  pricingContainer: {
    flexDirection: 'row',
    gap: 24,
  },
  priceItem: {
    alignItems: 'flex-start',
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  priceLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  assetsList: {
    gap: 8,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assetText: {
    fontSize: 14,
    color: '#3C3C43',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  submitSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  submitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  submitText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
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

export default AgentReviewScreen;