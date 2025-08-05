import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const EligibilityModal = ({ visible, onClose, cutoffTime = "14:00" }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  // Convert 24-hour time to 12-hour format
  const convertTo12Hour = (time24) => {
    const [hour, minute] = time24.split(":").map(Number);
    const isPM = hour >= 12;
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute?.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
  };

  const displayTime = convertTo12Hour(cutoffTime);

  // Calculate deadline for today
  const getDeadlineTime = () => {
    const now = new Date();
    const [hour, minute] = cutoffTime.split(":").map(Number);
    const deadline = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
    
    // If deadline has passed today, set it for tomorrow
    if (deadline <= now) {
      deadline.setDate(deadline.getDate() + 1);
    }
    
    return deadline;
  };

  // Calculate time remaining
  const calculateTimeLeft = () => {
    const deadline = getDeadlineTime();
    const now = new Date();
    const difference = deadline - now;

    if (difference <= 0) {
      setIsExpired(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    if (visible) {
      setIsExpired(false);
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft();
        setTimeLeft(newTimeLeft);
      }, 1000);

      // Initial calculation
      const initialTimeLeft = calculateTimeLeft();
      setTimeLeft(initialTimeLeft);

      return () => clearInterval(timer);
    }
  }, [visible, cutoffTime]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>
              {isExpired ? "Time's Up!" : "You're All Set!"}
            </Text>
            <Text style={styles.subtitle}>
              {isExpired 
                ? "The deadline has passed for today's orders" 
                : "Order today and get your delivery today."
              }
            </Text>
            
            {/* Countdown Timer */}
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownLabel}>
                {isExpired ? "Next deadline:" : "Time remaining:"}
              </Text>
              <View style={styles.timerRow}>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeNumber}>{timeLeft.days.toString().padStart(2, '0')}</Text>
                  <Text style={styles.timeUnitLabel}>Days</Text>
                </View>
                <Text style={styles.separator}>:</Text>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeNumber}>{timeLeft.hours.toString().padStart(2, '0')}</Text>
                  <Text style={styles.timeUnitLabel}>Hours</Text>
                </View>
                <Text style={styles.separator}>:</Text>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeNumber}>{timeLeft.minutes.toString().padStart(2, '0')}</Text>
                  <Text style={styles.timeUnitLabel}>Minutes</Text>
                </View>
                <Text style={styles.separator}>:</Text>
                <View style={styles.timeUnit}>
                  <Text style={styles.timeNumber}>{timeLeft.seconds.toString().padStart(2, '0')}</Text>
                  <Text style={styles.timeUnitLabel}>Seconds</Text>
                </View>
              </View>
            </View>

            {/* Static Time Display */}
            {/* <View style={styles.staticTimeContainer}>
              <Text style={styles.staticTimeLabel}>Deadline at:</Text>
              <Text style={styles.staticTimeText}>{displayTime}</Text>
            </View> */}

            {/* Info Text */}
            <Text style={styles.infoText}>
              {isExpired 
                ? "You can place your order for the next available slot."
                : "Make sure to complete your order before the countdown reaches zero!"
              }
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity onPress={onClose} style={styles.button} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EligibilityModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 0,
    width: Math.min(width - 40, 350),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  iconContainer: {
    width: '100%',
    backgroundColor: '#f8fffe',
    paddingTop: 32,
    paddingBottom: 20,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmark: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  countdownLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
    fontWeight: '500',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeUnit: {
    alignItems: 'center',
    minWidth: 50,
  },
  timeNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563eb',
    fontFamily: 'monospace',
  },
  timeUnitLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  separator: {
    fontSize: 20,
    color: '#2563eb',
    marginHorizontal: 8,
    fontWeight: '600',
  },
  staticTimeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  staticTimeLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    fontWeight: '500',
  },
  staticTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  infoText: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
    minWidth: 120,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});