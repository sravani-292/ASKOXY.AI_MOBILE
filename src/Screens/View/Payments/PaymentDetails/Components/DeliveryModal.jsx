import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const DeliveryTimelineModal = ({ visible, onClose }) => {
  const [showTelugu, setShowTelugu] = useState(false);

  const toggleLanguage = () => setShowTelugu(!showTelugu);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>📦 Delivery Timeline</Text>
          
          <ScrollView style={styles.scrollView}>
            {!showTelugu ? (
              // English Content
              <View style={styles.section}>
                <Text style={styles.sectionText}>
                  Your order will be delivered within 4 hours to 4 days, depending on the volume of orders and location.
                </Text>
                <Text style={styles.sectionText}>
                  We're doing our best to group nearby orders together so we can deliver more efficiently and quickly. 🚚
                </Text>
                <Text style={styles.sectionText}>
                  This 1+1 free offer is our way of starting a lasting relationship with you — not just a one-time delivery. With your support, we'll be able to grow and serve you even better.
                </Text>
                <Text style={styles.sectionText}>
                  🙏 Please support us by spreading the word to friends and family nearby!
                </Text>
                <Text style={styles.sectionText}>
                  More orders = faster and more efficient deliveries for everyone!
                </Text>
              </View>
            ) : (
              // Telugu Content
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📦 డెలివరీ సమయం:</Text>
                <Text style={styles.sectionText}>
                  మీ ఆర్డర్‌ 4 గంటల నుండి 4 రోజుల్లోపు మీకు అందుతుంది. ఇది మీ ప్రాంతంలో ఉన్న ఇతర ఆర్డర్ల మీద ఆధారపడి ఉంటుంది.
                </Text>
                <Text style={styles.sectionText}>
                  మేము సమీప ఆర్డర్లను సమూహంగా ఏర్పాటు చేసి, సమర్థవంతంగా మరియు వేగంగా డెలివరీ చేయడానికి శ్రమిస్తున్నాం. 🚚
                </Text>
                <Text style={styles.sectionText}>
                  ఈ 1+1 ఉచిత ఆఫర్‌ ద్వారా మీతో శాశ్వతమైన మంచి సంబంధం ఏర్పడాలని మేము ఆశిస్తున్నాం. దయచేసి మీ మిత్రులు, బంధువులతో AskOxy గురించి పంచుకోండి!
                </Text>
                <Text style={styles.sectionText}>
                  ఆర్డర్లు పెరిగినకొద్దీ డెలివరీలు వేగంగా జరిగే అవకాశముంటుంది.
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
              <Text style={styles.languageButtonText}>
                {showTelugu ? "View in English" : "తెలుగులో చూడండి"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3E7D8F',
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollView: {
    width: '100%',
    marginBottom: 15,
  },
  section: {
    marginBottom: 10,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  languageButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    width: '80%',
  },
  languageButtonText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#3E7D8F',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '80%',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DeliveryTimelineModal;