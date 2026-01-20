import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  StatusBar,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const OfferLetters = () => {
  // Sample data with dummy names and placeholder drive links
  const offerLetters = [
    { id: 1, name: "BINGHAMTON UNIVERSITY", driveLink: "https://drive.google.com/file/d/1kobjdS-QlbrSBA2wU56peVNyJ0PrmjZA/preview" },
    { id: 2, name: "EDINBURGH NAPIER UNIVERSITY", driveLink: "https://drive.google.com/file/d/1NRVO8M74UjQlcRH7BrDwktHmcqb8ZU_p/preview" },
    { id: 3, name: "Anglia Ruskin University", driveLink: "https://drive.google.com/file/d/1lzoNNmzsAXtz2ckt2-u02gYFqBGPOBE6/preview" },
    { id: 4, name: "Aston University", driveLink: "https://drive.google.com/file/d/1Cn8NjDic_0PTtv7epzMKALG9RrkH3sVn/preview" },
    { id: 5, name: "AUBURN UNIVERSITY AT MONTGOMERY", driveLink: "https://drive.google.com/file/d/1kQSXRtRWflcbrOw4S9sbONm3BQIX-3Bp/preview" },
    { id: 6, name: "BPP UNIVERSITY", driveLink: "https://drive.google.com/file/d/1ktgOyTcqht2Mx-H_G1uM5XdLLbaGGaQe/preview" },
    { id: 7, name: "Broad Horizons", driveLink: "https://drive.google.com/file/d/1_9kQTFvRIY8G_7SFktal67QjFBkUCnHo/preview" },
    { id: 8, name: "BUCKINGHAMSHIRE NEW UNIVERSITY", driveLink: "https://drive.google.com/file/d/1KsTA3oZUveFHF35O9cQwi2kC6E_Dhs3q/preview" },
    { id: 9, name: "CARDIFF METROPOLITAN UNIVERSITY", driveLink: "https://drive.google.com/file/d/1pnDPB2REHAaQo9J5_M31xlsZQSGJF2GV/preview" },
    { id: 10, name: "COVENTRY UNIVERSITY", driveLink: "https://drive.google.com/file/d/11Ssmnpsr091Ewcp_3yroIZOIMmA1YTQU/preview" },
    { id: 11, name: "Dublin Business School", driveLink: "https://drive.google.com/file/d/1hxZ7dW_k3bGTDirZSAYxO7RJDKX6GAFy/preview" },
    { id: 12, name: "University of Texas at San Antonio", driveLink: "https://drive.google.com/file/d/1OGoqvmOAKDmXVhrAQdn28MpdL_TygxBy/preview" },
    { id: 13, name: "Vistula University", driveLink: "https://drive.google.com/file/d/1RXXmHxCi-vqxr_PIhP-giTKsOZYDPFbM/preview" }
  ];

  const [selectedLetterId, setSelectedLetterId] = useState(null);

  const handleLetterClick = (id) => {
    if (selectedLetterId === id) {
      setSelectedLetterId(null); // Close if already open
    } else {
      setSelectedLetterId(id); // Open the selected letter
    }
  };

  const renderLetterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.letterCard}
      onPress={() => handleLetterClick(item.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.letterTitle} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.offerLabel}>Offer Letter</Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleLetterClick(item.id)}
        >
          <Text style={styles.viewButtonText}>
            {selectedLetterId === item.id ? 'Close' : 'View'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const selectedLetter = offerLetters.find(l => l.id === selectedLetterId);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f9fafb" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>University Offer Letters</Text>
      </View>

      {/* Letters List */}
      <FlatList
        data={offerLetters}
        renderItem={renderLetterItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={1}
      />

      {/* PDF Viewer Modal */}
      <Modal
        visible={selectedLetterId !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedLetterId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {selectedLetter?.name} - Offer Letter
              </Text>
              <TouchableOpacity 
                onPress={() => setSelectedLetterId(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.webViewContainer}>
              {selectedLetter && (
                <WebView
                  source={{ uri: selectedLetter.driveLink }}
                  style={styles.webView}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  listContainer: {
    padding: 10,
  },
  letterCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  letterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  offerLabel: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  viewButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    height: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6b7280',
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  }
});

export default OfferLetters;