import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

const AgentPricingScreen = ({ agentData, updateAgentData }) => {
  const [selectedModel, setSelectedModel] = useState('hybrid');
  const [amount, setAmount] = useState('0.00');
  const [currency, setCurrency] = useState('USD');
  const [revenueShare, setRevenueShare] = useState(0.75);

  const navigation = useNavigation();

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleNext = () => {
    if (selectedModel === 'paid' && (!amount || parseFloat(amount) <= 0)) {
      Alert.alert('Required Field', 'Please enter a valid pricing amount');
      return;
    }
    
    console.log('Pricing configuration:', {
      model: selectedModel,
      amount,
      currency,
      revenueShare
    });
    // Alert.alert('Navigation', 'Moving to Step 4: Testing & Validation');
    navigation.navigate('Agent Creation');
  };

  const handleBack = () => {
    Alert.alert('Navigation', 'Going back to Step 2: Skills');
  };

  const ModelCard = ({ model, title, description, isSelected, onSelect }) => (
    <TouchableOpacity 
      style={[styles.modelCard, isSelected && styles.modelCardSelected]} 
      onPress={() => onSelect(model)}
    >
      <View style={styles.radioButton}>
        <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
      </View>
      <View style={styles.modelContent}>
        <Text style={styles.modelTitle}>{title}</Text>
        <Text style={styles.modelDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Agent — Step 3</Text>
        <Text style={styles.headerSubtitle}>Monetization & Revenue Split</Text>
        
        <Text style={styles.stepText}>Step 3 of 5</Text>
        
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
          <View style={[styles.tab, styles.completedTab]}>
            <View style={[styles.tabDot, styles.completedDot]} />
            <Text style={[styles.tabText, styles.completedTabText]}>Skills</Text>
          </View>
          <View style={[styles.tab, styles.activeTab]}>
            <View style={[styles.tabDot, styles.activeDot]} />
            <Text style={[styles.tabText, styles.activeTabText]}>Pricing</Text>
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
        {/* Monetization Model */}
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <Text style={styles.icon}>💰</Text>
            <Text style={styles.label}>
              Monetization Model <Text style={styles.required}>*</Text>
            </Text>
          </View>

          <ModelCard
        model="free"
        title="Free"
        description="Users can access your agent..."
        isSelected={agentData.usageModel === "free"}
        onSelect={(val) => updateAgentData({ usageModel: val })}
      />

          <ModelCard
            model="paid"
            title="Paid"
            description="Users pay a fixed fee to access your agent. Ideal for premium, specialized services."
            isSelected={agentData.usageModel === 'paid'}
            onSelect={(val) => updateAgentData({ usageModel: val })}
          />

          <ModelCard
            model="hybrid"
            title="Hybrid (Freemium)"
            description="Offer basic features for free with premium features behind a paywall."
            isSelected={agentData.usageModel === 'hybrid'}
            onSelect={(val) => updateAgentData({ usageModel: val })}
          />
        </View>

        {/* Pricing Section - Only show for paid/hybrid */}
        {(agentData.usageModel === "paid" || agentData.usageModel === "hybrid") && (
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <Text style={styles.icon}>💳</Text>
              <Text style={styles.label}>Pricing</Text>
            </View>

            <View style={styles.pricingRow}>
              <View style={styles.pricingColumn}>
                <Text style={styles.pricingLabel}>Amount</Text>
                <TextInput
                  style={styles.amountInput}
                  value={agentData.amount}
                  onChangeText={(val) => updateAgentData({ amount: val })}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.pricingColumn}>
                <Text style={styles.pricingLabel}>Currency</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={agentData.currency}
                    onValueChange={(val) => updateAgentData({ currency: val })}
                    style={styles.picker}
                  >
                    {currencies.map((curr) => (
                      <Picker.Item key={curr} label={`${curr} ($)`} value={curr} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
            
            <Text style={styles.helper}>
              Set your pricing per interaction, session, or monthly subscription
            </Text>
          </View>
        )}

        {/* Revenue Split */}
        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <Text style={styles.icon}>📊</Text>
            <Text style={styles.label}>Revenue Split</Text>
          </View>

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={agentData.revenueShare}
              onValueChange={(val) => updateAgentData({ revenueShare: val })}
              minimumTrackTintColor="#8b5cf6"
              maximumTrackTintColor="#e9ecef"
              thumbStyle={styles.sliderThumb}
            />
            <View style={styles.sliderLabels}>
              <View style={styles.sliderLabel}>
                <Text style={styles.sliderLabelText}>Creator: {Math.round(revenueShare * 100)}%</Text>
              </View>
              <View style={styles.sliderLabel}>
                <Text style={styles.sliderLabelText}>Platform: {Math.round((1 - revenueShare) * 100)}%</Text>
              </View>
            </View>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Platform keeps a minimum of 25% to cover infrastructure, support, and platform 
              maintenance costs.
            </Text>
          </View>

          <Text style={styles.helper}>
            Adjust the revenue split between you and the platform. Higher platform percentages 
            may include additional marketing support.
          </Text>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next: Testing & Validation →</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
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
    width: '60%',
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
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#dc3545',
  },
  modelCard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  modelCardSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: '#faf9ff',
  },
  radioButton: {
    marginRight: 12,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#dee2e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#8b5cf6',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8b5cf6',
  },
  modelContent: {
    flex: 1,
  },
  modelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  pricingRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  pricingColumn: {
    flex: 1,
    marginRight: 12,
  },
  pricingLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  helper: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 18,
  },
  sliderContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
  },
  sliderThumb: {
    backgroundColor: '#8b5cf6',
    width: 20,
    height: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    alignItems: 'center',
  },
  sliderLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  warningText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 18,
    flex: 1,
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

export default AgentPricingScreen;