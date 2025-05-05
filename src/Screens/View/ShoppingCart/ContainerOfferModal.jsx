import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Animated,
  ScrollView
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const CONTAINER_TYPES = {
  SMALL: { Price: 499 },
  LARGE: { Price: 899 }
};

const ContainerOfferModal = ({ 
  modalVisible, 
  setModalVisible, 
  hasWeight = "26kgs", 
  onAccept, 
  onDecline 
}) => {
  const [showFAQ, setShowFAQ] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true
      }).start();
    } else {
      setShowFAQ(false);
    }
  }, [modalVisible]);

  const handleYes = () => {
    onAccept && onAccept();
    setModalVisible(false);
  };

  const handleNo = () => {
    onDecline && onDecline();
    setModalVisible(false);
  };

  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  const renderOfferContent = () => (
    <>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Special Offer</Text>
      </View>
      <ScrollView>
      <View style={styles.modalBody}>
        <Image
          source={require("../../../../assets/Steelcontainer.png")}
          style={styles.containerImage}
          resizeMode="contain"
        />
        
        {/* <Text style={styles.modalText}>
          We noticed you're buying {hasWeight} rice. Would you like to add a special 
          container that keeps your rice fresh longer?
        </Text> */}
        
        <Text style={styles.specialOfferText}>
          <Text style={styles.specialOfferHighlight}>Special Offer:</Text> Free Rice Container!
        </Text>
        
        <Text style={styles.offerDescription}>
          Buy a {hasWeight} rice bag & get a FREE rice container!
          (Container remains Oxy Group asset until ownership is earned.)
        </Text>
        
        <View style={styles.plansContainer}>
          <Text style={styles.plansTitle}>How to Earn Ownership:</Text>
          
          <View style={styles.planBox}>
            <Text style={styles.planLabel}>Plan A:</Text>
            <Text style={styles.planDescription}>
              Buy 9 bags during the next 3 years, and the container is yours forever.
            </Text>
          </View>
          
          <View style={styles.planBox}>
            <Text style={styles.planLabel}>Plan B:</Text>
            <Text style={styles.planDescription}>
              Refer 9 people, and when they buy their first bag, the container is yours forever.
            </Text>
          </View>
        </View>
        
        <View style={styles.importantInfo}>
          <Text style={styles.importantInfoTitle}>Important Info:</Text>
          <Text style={styles.importantInfoText}>
            • No purchase within 90 days or a gap of 90 days between purchases will result in the container being taken back.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.faqButton}
          onPress={toggleFAQ}
        >
          <Text style={styles.faqButtonText}>Read FAQs</Text>
          <AntDesign name="questioncircleo" size={16} color="#3498db" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.modalFooter}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={handleNo}
        >
          <Text style={styles.buttonTextCancel}>No, Thanks</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modalButton, styles.confirmButton]}
          onPress={handleYes}
        >
          <Text style={styles.buttonTextConfirm}>Yes, Add It</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </>
  );

  const renderFAQContent = () => (
    <>
      <View style={styles.modalHeader}>
        <View style={styles.faqTitleContainer}>
          <TouchableOpacity onPress={toggleFAQ} style={styles.backButton}>
            <AntDesign name="arrowleft" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
        </View>
      </View>
      
      <ScrollView style={styles.faqScrollView}>
        <View style={styles.faqSection}>
          <Text style={styles.faqSectionTitle}>About ASKOXY.AI</Text>
          <Text style={styles.faqText}>
            ASKOXY.AI is an AI-powered platform integrating 34+ marketplaces, designed to simplify lives with innovative solutions, including premium rice delivery.
          </Text>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqSectionTitle}>Who is the founder of ASKOXY.AI?</Text>
          <Text style={styles.faqText}>
            AskOxy.ai is led by Radhakrishna Thatavarti (LinkedIn), an entrepreneur with over 24 years of experience in software technology and business leadership. His vision is to empower communities through sustainable, customer-centric solutions using AI, Blockchain, and Java technologies.
          </Text>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqSectionTitle}>What is the Free Steel Container offer?</Text>
          <Text style={styles.faqText}>
            Customers who purchase a 26kg rice bag will receive a FREE steel rice container. However, the container remains the property of OXY Group until ownership is earned.
          </Text>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqSectionTitle}>How can I earn ownership of the steel container?</Text>
          <Text style={styles.faqText}>
            You can own the container by meeting either of the following criteria:
          </Text>
          <Text style={styles.faqListItem}>1. Refer 9 new users to ASKOXY.AI.</Text>
          <Text style={styles.faqListItem}>2. Purchase 9 rice bags within 3 years.</Text>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqSectionTitle}>What happens if I do not purchase regularly?</Text>
          <Text style={styles.faqText}>
            If you do not make a purchase within 90 days, or if there is a gap of 90 days between purchases, then the container will be taken back.
          </Text>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqSectionTitle}>How long does delivery take?</Text>
          <Text style={styles.faqListItem}>• The rice bag will be delivered within 24 hours.</Text>
          <Text style={styles.faqListItem}>• Due to high demand, container delivery may be delayed.</Text>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqSectionTitle}>Who is eligible to be referred under this program?</Text>
          <Text style={styles.faqText}>
            Only new users who are not yet registered on ASKOXY.AI can be referred.
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.modalFooter}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={handleNo}
        >
          <Text style={styles.buttonTextCancel}>No, Thanks</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modalButton, styles.confirmButton]}
          onPress={handleYes}
        >
          <Text style={styles.buttonTextConfirm}>Yes, Add It</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.modalContainer,
                { transform: [{ scale: scaleValue }] }
              ]}
            >
              {showFAQ ? renderFAQContent() : renderOfferContent()}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '95%',
    maxHeight: '85%',
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    width:"80%"
  },
  faqTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 5
  },
  backButton: {
    position: 'absolute',
    left: -30,
    alignSelf: 'flex-start',
    padding: 10
  },
  modalBody: {
    marginBottom: 20
  },
  containerImage: {
    height: 150,
    width: '100%',
    marginBottom: 15
  },
  modalText: {
    fontSize: 15,
    marginBottom: 15,
    textAlign: 'center',
    color: '#34495e'
  },
  specialOfferText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#e74c3c'
  },
  specialOfferHighlight: {
    color: '#e74c3c',
    fontWeight: 'bold'
  },
  offerDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
    color: '#7f8c8d'
  },
  containerPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#16a085'
  },
  plansContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },
  plansTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50'
  },
  planBox: {
    marginBottom: 10,
    paddingLeft: 5
  },
  planLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#3498db'
  },
  planDescription: {
    fontSize: 14,
    color: '#34495e',
    paddingLeft: 5
  },
  importantInfo: {
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15
  },
  importantInfoTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: '#f39c12'
  },
  importantInfoText: {
    fontSize: 13,
    color: '#7f8c8d'
  },
  faqButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 5
  },
  faqButtonText: {
    color: '#3498db',
    marginRight: 5,
    fontSize: 14,
    fontWeight: '500'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#bdc3c7'
  },
  confirmButton: {
    backgroundColor: '#3498db'
  },
  buttonTextCancel: {
    color: '#7f8c8d',
    fontWeight: '600'
  },
  buttonTextConfirm: {
    color: 'white',
    fontWeight: '600'
  },
  faqScrollView: {
    maxHeight: 400,
    marginBottom: 15
  },
  faqSection: {
    marginBottom: 20
  },
  faqSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50'
  },
  faqText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#34495e',
    marginBottom: 5
  },
  faqListItem: {
    fontSize: 14,
    lineHeight: 20,
    color: '#34495e',
    marginBottom: 5,
    paddingLeft: 15
  }
});

export default ContainerOfferModal;