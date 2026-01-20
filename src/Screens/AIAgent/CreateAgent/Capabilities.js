import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const AgentSkillsScreen = ({ agentData, updateAgentData }) => {

  const toggleCapability = (capability) => {
    updateAgentData({
      [capability]: !agentData[capability],
    });
  };
  const [instructions, setInstructions] = useState(
    "You are a helpful assistant specialized in providing accurate, timely information. Always be professional, concise, and provide sources when possible. If you're unsure about something, acknowledge the uncertainty and suggest how the user might get more information."
  );
  
  const [capabilities, setCapabilities] = useState({
    webSearch: true,
    fileSearch: false,
    codeInterpreter: false,
    customFunctions: false,
  });

  const navigation = useNavigation();

  const handleNext = () => {
    if (!instructions.trim()) {
      Alert.alert('Required Field', 'Please provide agent instructions');
      return;
    }
    
    const enabledCount = Object.values(capabilities).filter(Boolean).length;
    console.log(`Moving to Step 3 with ${enabledCount} capabilities enabled`);
    // Navigate to next screen
    navigation.navigate('Agent Pricing');
  };

  const handleBack = () => {
    // Navigate to previous screen
    Alert.alert('Navigation', 'Going back to Step 1: Vision');
  };

  const CapabilityCard = ({ icon, title, subtitle, description, capability, enabled }) => (
    <View style={[styles.capabilityCard, enabled && styles.capabilityCardActive]}>
      <View style={styles.capabilityHeader}>
        <View style={styles.capabilityLeft}>
          <Text style={styles.capabilityIcon}>{icon}</Text>
          <View style={styles.capabilityContent}>
            <Text style={styles.capabilityName}>{title}</Text>
            <Text style={styles.capabilitySubtitle}>{subtitle}</Text>
          </View>
        </View>
        <Switch
          value={enabled}
          onValueChange={() => toggleCapability(capability)}
          trackColor={{ false: '#ccc', true: '#8b5cf6' }}
          thumbColor={enabled ? '#ffffff' : '#ffffff'}
          ios_backgroundColor="#ccc"
        />
      </View>
      <Text style={styles.capabilityDescription}>{description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepText}>Step 2 of 5</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <View style={[styles.tab, styles.completedTab]}>
            <View style={[styles.tabDot, styles.completedDot]} />
            <Text style={[styles.tabText, styles.completedTabText]}>Vision</Text>
          </View>
          <View style={[styles.tab, styles.activeTab]}>
            <View style={[styles.tabDot, styles.activeDot]} />
            <Text style={[styles.tabText, styles.activeTabText]}>Skills</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Training</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Testing</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Deploy</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Agent Instructions */}
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <Text style={styles.icon}>📝</Text>
            <Text style={styles.label}>
              Agent Instructions <Text style={styles.required}>*</Text>
            </Text>
          </View>
           <TextInput
        style={styles.textArea}
        value={agentData.instructions}
        onChangeText={(text) => updateAgentData({ instructions: text })}
        multiline
      />
          <Text style={styles.helper}>
            Be specific about your agent's behavior, tone, and how it should handle different scenarios. 
            These instructions will guide all of your agent's interactions.
          </Text>
        </View>

        {/* Enable Capabilities */}
        <View style={styles.section}>
          <View style={styles.capabilitiesTitle}>
            <Text style={styles.icon}>⚙️</Text>
            <Text style={styles.label}>Enable Capabilities</Text>
          </View>

          <CapabilityCard
        icon="🔍"
        title="Web Search"
        subtitle="Allow agent to search..."
        description="Enables access to current web data"
        capability="webSearch"
        enabled={agentData.webSearch}
      />

          <CapabilityCard
            icon="📁"
            title="File Search"
            subtitle="Search and analyze uploaded documents and files"
            description="Process PDFs, documents, spreadsheets, and other file formats to extract and analyze information."
            capability="fileSearch"
            enabled={agentData.fileSearch}
          />

          <CapabilityCard
            icon="💻"
            title="Code Interpreter"
            subtitle="Execute code and perform data analysis tasks"
            description="Run Python code, create visualizations, analyze data, and perform complex calculations in real-time."
            capability="codeInterpreter"
            enabled={agentData.codeInterpreter}
          />

          <CapabilityCard
            icon="🔧"
            title="Custom Functions"
            subtitle="Connect to external APIs and custom tools"
            description="Integrate with third-party services, databases, and custom APIs to extend functionality."
            capability="customFunctions"
            enabled={agentData.customFunctions}
          />
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next: Training Data →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  stepText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 15,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '40%',
    backgroundColor: '#8b5cf6',
    borderRadius: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 5,
    flex: 1,
  },
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: '#8b5cf6',
  },
  completedDot: {
    backgroundColor: '#10b981',
  },
  tabText: {
    fontSize: 14,
    color: '#6c757d',
  },
  activeTabText: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  completedTabText: {
    color: '#10b981',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#dc3545',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: 'white',
    marginBottom: 8,
    minHeight: 100,
  },
  helper: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 18,
    marginBottom: 15,
  },
  capabilitiesTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  capabilityCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  capabilityCardActive: {
    borderColor: '#8b5cf6',
    backgroundColor: '#faf9ff',
  },
  capabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  capabilityLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  capabilityIcon: {
    fontSize: 14,
    marginRight: 12,
    marginTop: 2,
  },
  capabilityContent: {
    flex: 1,
  },
  capabilityName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  capabilitySubtitle: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 8,
  },
  capabilityDescription: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6c757d',
  },
  nextButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default AgentSkillsScreen;