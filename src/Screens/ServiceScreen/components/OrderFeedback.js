import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getOrders, feedbackget } from '../../../ApiService';
import BASE_URL from '../../../../Config';

export default function OrderFeedback() {
  const { accessToken: token, userId: customerId } = useSelector(
    (state) => state.counter || {}
  );

  const [orderId, setOrderId] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [comments, setComments] = useState('');
  const [hasCheckedFeedback, setHasCheckedFeedback] = useState(false);

  const SKIP_KEY = `feedback_permanently_skipped_${customerId}`;
  const SUBMIT_KEY = `feedback_submitted_${customerId}`;
  const SESSION_SKIP_KEY = `feedback_session_skipped_${customerId}`;

  const emojis = [
    { emoji: '😡', label: 'Very Bad', color: '#FFB3B3', value: 'POOR' },
    { emoji: '😟', label: 'Bad', color: '#FFD9B3', value: 'BELOWAVERAGE' },
    { emoji: '🙂', label: 'Average', color: '#FFFFB3', value: 'AVERAGE' },
    { emoji: '😃', label: 'Good', color: '#D9FFB3', value: 'GOOD' },
    { emoji: '🤩', label: 'Excellent', color: '#B3FFB3', value: 'EXCELLENT' },
  ];

 const fetchFeedback = async (oid) => {
  if (hasCheckedFeedback) return;

  try {
    const [permanent, submitted, session] = await Promise.all([
      AsyncStorage.getItem(SKIP_KEY),
      AsyncStorage.getItem(SUBMIT_KEY),
      AsyncStorage.getItem(SESSION_SKIP_KEY),
    ]);

    if (permanent === 'true' || submitted === 'true' || session === 'true') {
      return;
    }

    const res = await feedbackget(customerId, oid);
    const data = res.data || [];
    setFeedback(data);
    if (data.length === 0) {
      setFeedbackModalVisible(true);
    }
  } catch (e) {
    console.error('Error fetching feedback:', e);
  } finally {
    setHasCheckedFeedback(true);
  }
};


  const fetchOrders = async () => {
    try {
      const res = await getOrders(customerId);
      const orders = res || [];
      const delivered = orders.find((o) => o.orderStatus === '4');
      if (delivered) {
        setOrderId(delivered.orderId);
        await fetchFeedback(delivered.orderId);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  };

useFocusEffect(
  React.useCallback(() => {
    const init = async () => {
      await AsyncStorage.removeItem(SESSION_SKIP_KEY); // ✅ Clear session-only skip
      setHasCheckedFeedback(false);
      setFeedback([]);
      setSelectedEmoji(null);
      setComments('');
      
      await fetchOrders(); // ✅ Now fetch orders *after* removal is complete
    };
    init();
  }, [customerId])
);


  const handleEmojiPress = (idx) => setSelectedEmoji(idx);

  const handleSubmit = async () => {
    if (selectedEmoji === null) {
      Alert.alert('Feedback Required', 'Please select an emoji to proceed.');
      return;
    }
    const payload = {
      comments,
      feedbackStatus: emojis[selectedEmoji].value,
      feedback_user_id: customerId,
      orderid: orderId,
    };
    try {
      await axios.post(`${BASE_URL}order-service/submitfeedback`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await AsyncStorage.setItem(SUBMIT_KEY, 'true');
      // Alert.alert('Success', 'Feedback submitted successfully!', [
      //   { text: 'OK', onPress: () => setFeedbackModalVisible(false) },
      // ]);
    } catch (e) {
      console.error('Submission error:', e);
      // Alert.alert('Error', 'Failed to submit feedback.');
    }finally{
      setFeedbackModalVisible(false)
    }
  };

  // ✅ Updated: Only SESSION skip on close
  const handleCloseModal = async () => {
    await AsyncStorage.setItem(SESSION_SKIP_KEY, 'true');
    setFeedbackModalVisible(false);
  };

  const handleRemindLater = async () => {
    await AsyncStorage.setItem(SESSION_SKIP_KEY, 'true');
    setFeedbackModalVisible(false);
  };

  if (!feedbackModalVisible) return null;

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCloseModal}
        />
        <View style={styles.modalContainer}>
          <View style={styles.handleBar} />
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>

          {feedback.length === 0 ? (
            <>
              <Text style={styles.title}>🎉 Order Delivered!</Text>
              <Text style={styles.subtitle}>How was your experience?</Text>
              <View style={styles.emojiContainer}>
                {emojis.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.emojiBox,
                      selectedEmoji === idx && {
                        backgroundColor: item.color,
                        transform: [{ scale: 1.1 }],
                        borderWidth: 2,
                        borderColor: '#4CAF50',
                      },
                    ]}
                    onPress={() => handleEmojiPress(idx)}
                  >
                    <Text style={styles.emoji}>{item.emoji}</Text>
                    <Text style={styles.emojiLabel}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.skipButton} onPress={handleRemindLater}>
                  <Text style={styles.skipButtonText}>Remind me later</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    selectedEmoji === null && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={selectedEmoji === null}
                >
                  <Text style={styles.submitButtonText}>Submit Feedback</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>✅ Thank You!</Text>
              <Text style={styles.subtitle}>Your feedback has been recorded</Text>
              <View style={styles.feedbackBox}>
                <View style={styles.feedbackRow}>
                  <Text style={styles.feedbackLabel}>Rating:</Text>
                  <View style={styles.ratingContainer}>
                    {emojis.map((item, idx) => (
                      <Text
                        key={idx}
                        style={[
                          styles.emoji,
                          { opacity: item.value === feedback[0]?.feedbackStatus ? 1 : 0.3 },
                        ]}
                      >
                        {item.emoji}
                      </Text>
                    ))}
                  </View>
                </View>
                {feedback[0]?.comments && (
                  <View style={styles.feedbackRow}>
                    <Text style={styles.feedbackLabel}>Your feedback:</Text>
                    <Text style={styles.feedbackText}>"{feedback[0].comments}"</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.okButton} onPress={handleCloseModal}>
                <Text style={styles.okButtonText}>Done</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    maxHeight: "45%", 
    minHeight: 280, 
  },
  handleBar: {
    width: 40,
    height: 3,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 16,
    zIndex: 1,
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 20, 
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
    color: "#2E7D32",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14, 
    color: "#666",
    textAlign: "center",
    marginBottom: 20, 
    lineHeight: 20,
  },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20, 
    paddingHorizontal: 4,
  },
  emojiBox: {
    alignItems: "center",
    padding: 8, 
    borderRadius: 12,
    minWidth: 48, 
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  emoji: {
    fontSize: 24, 
    marginBottom: 2,
  },
  emojiLabel: {
    fontSize: 10, 
    fontWeight: "500",
    textAlign: "center",
    color: "#495057",
  },
  inputContainer: {
    marginBottom: 16, 
  },
  input: {
    minHeight: 60, 
    borderWidth: 1,
    borderColor: "#E9ECEF",
    borderRadius: 10,
    padding: 12, 
    textAlignVertical: "top",
    fontSize: 14, 
    backgroundColor: "#F8F9FA",
    color: "#212529",
  },
  charCount: {
    fontSize: 11, 
    color: "#6C757D",
    textAlign: "right",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4, 
  },
  skipButton: {
    flex: 1,
    paddingVertical: 12, 
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#2E7D32",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  skipButtonText: {
    fontSize: 14, 
    fontWeight: "600",
    color: "#fff",
  },
  submitButton: {
    flex: 2,
    paddingVertical: 12, 
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#E9ECEF",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 14, 
    fontWeight: "600",
    color: "#fff",
  },
  feedbackBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16, 
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  feedbackRow: {
    marginBottom: 12, 
  },
  feedbackLabel: {
    fontSize: 13, 
    fontWeight: "600",
    color: "#495057",
    marginBottom: 6, 
  },
  feedbackText: {
    fontSize: 14, 
    color: "#212529",
    lineHeight: 20, 
    fontStyle: "italic",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 6, 
  },
  okButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 12, 
    marginTop: 6, 
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  okButtonText: {
    color: "#fff",
    fontSize: 14, 
    fontWeight: "600",
  },
});