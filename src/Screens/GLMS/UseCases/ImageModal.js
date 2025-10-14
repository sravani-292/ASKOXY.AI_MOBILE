import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import { 
  Info, 
  Users, 
  CheckCircle, 
  List, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react-native';
import ImageZoom from 'react-native-image-pan-zoom';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImageModal = ({imageSource}) => {
      const [modalVisible, setModalVisible] = useState(false);
    
  return (
    <View style={{marginTop:10}}>
 <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.modalButtonText}>View Flowchart</Text>
                </TouchableOpacity>
                
    <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

            <ImageZoom
              cropWidth={screenWidth - 32}
              cropHeight={screenHeight / 1.7}
              imageWidth={screenWidth - 32}
              imageHeight={screenHeight / 1.7}
              pinchToZoom={true}
              enableCenterFocus={true}
            >
              <Image
                source={{ uri: imageSource}}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </ImageZoom>
          </View>
        </View>
      </Modal>
                    </View>
  )
}

export default ImageModal

const styles = StyleSheet.create({
 flowchart: { backgroundColor: '#f3f4f6', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  flowchartText: { fontSize: 12, color: '#374151', fontFamily: 'monospace', lineHeight: 18, marginBottom: 12 },
  modalButton: { backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
 modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    maxWidth: 600,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
})