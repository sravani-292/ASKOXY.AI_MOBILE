import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const AgentVisionScreen = () => {
  const [agentName, setAgentName] = useState('');
  const [visionDescription, setVisionDescription] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedSubdomain, setSelectedSubdomain] = useState('');

    const navigation = useNavigation();

  const sectors = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Marketing',
    'Real Estate',
  ];

  const subdomains = [
    'AI & Machine Learning',
    'Web Development',
    'Mobile Development',
    'Data Analytics',
    'Cybersecurity',
    'Cloud Computing',
    'DevOps',
    'UI/UX Design',
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepText}>Step 1 of 5</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <View style={[styles.tab, styles.activeTab]}>
            <View style={styles.tabDot} />
            <Text style={[styles.tabText, styles.activeTabText]}>Vision</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Skills</Text>
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
        {/* Agent Name */}
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <Text style={styles.label}>Agent Name <Text style={styles.required}>*</Text></Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter a descriptive name for your agent"
            value={agentName}
            onChangeText={setAgentName}
          />
          <Text style={styles.helper}>Choose a clear, memorable name that reflects your agent's purpose</Text>
        </View>

        {/* Vision & Unique Selling Proposition */}
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>👁</Text>
            </View>
            <Text style={styles.label}>Vision & Unique Selling Proposition <Text style={styles.required}>*</Text></Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your agent's core mission, value proposition, and what makes it unique..."
            value={visionDescription}
            onChangeText={setVisionDescription}
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={styles.helper}>Explain what problem your agent solves and what sets it apart from existing solutions</Text>
        </View>

        {/* Sector */}
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>🏢</Text>
            </View>
            <Text style={styles.label}>Sector <Text style={styles.required}>*</Text></Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSector}
              onValueChange={(itemValue) => setSelectedSector(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a sector..." value="" />
              {sectors.map((sector, index) => (
                <Picker.Item key={index} label={sector} value={sector} />
              ))}
            </Picker>
          </View>
          <Text style={styles.helper}>Choose the primary industry your agent will serve</Text>
        </View>

        {/* Subdomain */}
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>⚡</Text>
            </View>
            <Text style={styles.label}>Subdomain</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSubdomain}
              onValueChange={(itemValue) => setSelectedSubdomain(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a subdomain..." value="" />
              {subdomains.map((subdomain, index) => (
                <Picker.Item key={index} label={subdomain} value={subdomain} />
              ))}
            </Picker>
          </View>
          <Text style={styles.helper}>Specify the particular area within your sector (optional but recommended)</Text>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>← Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={() => {navigation.navigate("Agent Skills Screen")}}>
          <Text style={styles.nextButtonText}>Next: Define Skills →</Text>
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
    width: '20%',
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
  tabDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8b5cf6',
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#6c757d',
  },
  activeTabText: {
    color: '#8b5cf6',
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
    alignItems: 'center',
    marginBottom: 8,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#dc3545',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    height: 120,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  helper: {
    fontSize: 14,
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
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
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

export default AgentVisionScreen;