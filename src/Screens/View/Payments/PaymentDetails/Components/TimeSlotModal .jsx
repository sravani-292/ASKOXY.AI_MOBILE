import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
// If you need blur effects, properly import it:
// import { BlurView } from 'expo-blur';

const TimeSlotModal = ({ 
  visible, 
  onClose, 
  days, 
  timeSlots, 
  selectedDay, 
  selectedTimeSlot, 
  onDayChange, 
  onTimeSlotChange,
  onConfirm,
  primaryColor = '#4E37B2', // Default primary color (rich purple)
  theme = 'light' // Support for light/dark mode
}) => {
  const [localSelectedDay, setLocalSelectedDay] = useState(selectedDay);
  const [localSelectedTimeSlot, setLocalSelectedTimeSlot] = useState(selectedTimeSlot);
  const [animation] = useState(new Animated.Value(0));
  const [dayScrollViewRef, setDayScrollViewRef] = useState(null);
  const [timeScrollViewRef, setTimeScrollViewRef] = useState(null);
  
  // Create animation values for all buttons up front with safety checks
  const [dayAnimations, setDayAnimations] = useState([]);
  const [timeSlotAnimations, setTimeSlotAnimations] = useState([]);
  
  // Update animations when days or timeSlots change
  useEffect(() => {
    if (days && days.length > 0) {
      setDayAnimations(
        days.map((_, index) => ({
          fadeIn: new Animated.Value(0),
          scaleIn: new Animated.Value(0.8),
          delay: index * 50
        }))
      );
    }
  }, [days]);
  
  useEffect(() => {
    if (timeSlots && timeSlots.length > 0) {
      setTimeSlotAnimations(
        timeSlots.map((_, index) => ({
          fadeIn: new Animated.Value(0),
          scaleIn: new Animated.Value(0.8),
          delay: 100 + (index * 30)
        }))
      );
    }
  }, [timeSlots]);
  
  // Colors based on theme
  const colors = {
    background: theme === 'dark' ? '#121212' : '#FFFFFF',
    card: theme === 'dark' ? '#242424' : '#FFFFFF',
    text: theme === 'dark' ? '#F5F5F7' : '#151515',
    textSecondary: theme === 'dark' ? '#ADADAD' : '#6E6E6E',
    separator: theme === 'dark' ? '#333333' : '#E5E5EA',
    buttonBackground: theme === 'dark' ? '#333333' : '#F0F0F5',
    buttonText: theme === 'dark' ? '#F5F5F7' : '#3A3A3C',
    overlay: theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.5)', // Made overlay more opaque
  };
  
  useEffect(() => {
    if (visible) {
      setLocalSelectedDay(selectedDay);
      setLocalSelectedTimeSlot(selectedTimeSlot);
      
      // Start entrance animation
      Animated.spring(animation, {
        toValue: 1,
        friction: 8,
        tension: 30,
        useNativeDriver: true
      }).start();
      
      // Start animations for day buttons
      if (dayAnimations.length > 0) {
        dayAnimations.forEach(({ fadeIn, scaleIn, delay }) => {
          // Reset to initial state first
          fadeIn.setValue(0);
          scaleIn.setValue(0.8);
          
          Animated.parallel([
            Animated.timing(fadeIn, {
              toValue: 1,
              duration: 300,
              delay,
              useNativeDriver: true
            }),
            Animated.spring(scaleIn, {
              toValue: 1,
              friction: 6,
              tension: 40,
              delay,
              useNativeDriver: true
            })
          ]).start();
        });
      }
      
      // Start animations for time slot buttons
      if (timeSlotAnimations.length > 0) {
        timeSlotAnimations.forEach(({ fadeIn, scaleIn, delay }) => {
          // Reset to initial state first
          fadeIn.setValue(0);
          scaleIn.setValue(0.8);
          
          Animated.parallel([
            Animated.timing(fadeIn, {
              toValue: 1,
              duration: 300,
              delay,
              useNativeDriver: true
            }),
            Animated.spring(scaleIn, {
              toValue: 1,
              friction: 6,
              tension: 40,
              delay,
              useNativeDriver: true
            })
          ]).start();
        });
      }
      
      // Scroll to selected day and time slot after a short delay
      setTimeout(() => {
        scrollToSelectedButtons();
      }, 300);
    } else {
      // Exit animation
      Animated.timing(animation, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }).start();
    }
  }, [visible, selectedDay, selectedTimeSlot, dayAnimations, timeSlotAnimations]);
  
  // Scroll to center the selected buttons in their containers
  const scrollToSelectedButtons = () => {
    if (dayScrollViewRef && localSelectedDay) {
      const dayIndex = days.findIndex(day => day.value === localSelectedDay);
      if (dayIndex > -1) {
        // Calculate position to center the button (approx. button width + margin)
        const position = dayIndex * 120;
        dayScrollViewRef.scrollTo({ x: position, animated: true });
      }
    }
    
    if (timeScrollViewRef && localSelectedTimeSlot) {
      const timeIndex = timeSlots.indexOf(localSelectedTimeSlot);
      if (timeIndex > -1) {
        // For time slots in a grid view, this would need adjustment based on your layout
        const position = Math.floor(timeIndex / 3) * 100; // Approximate for grid
        timeScrollViewRef.scrollTo({ y: position, animated: true });
      }
    }
  };
  
  const handleDayChange = (dayValue) => {
    setLocalSelectedDay(dayValue);
    onDayChange(dayValue);
  };
  
  const handleTimeSlotChange = (timeSlot) => {
    setLocalSelectedTimeSlot(timeSlot);
    onTimeSlotChange(timeSlot);
  };
  
  const handleConfirm = () => {
    // Quick scale animation before closing
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start(() => {
      onConfirm(localSelectedDay, localSelectedTimeSlot);
      onClose();
    });
  };

  // Adjust color brightness (utility function)
  const adjustBrightness = (hex, percent) => {
    // Simple hex adjustment function - in production use a proper color library
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    
    const adjustedR = Math.max(0, Math.min(255, r + percent));
    const adjustedG = Math.max(0, Math.min(255, g + percent));
    const adjustedB = Math.max(0, Math.min(255, b + percent));
    
    return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
  };

  // Render day buttons - now using animations prepared at component level
  const renderDayButtons = () => {
    if (!days || days.length === 0) return null;
    
    return days.map((day, index) => {
      // Get animation values safely, or use default values
      const animation = dayAnimations[index];
      const fadeIn = animation ? animation.fadeIn : new Animated.Value(1);
      const scaleIn = animation ? animation.scaleIn : new Animated.Value(1);
      const isSelected = localSelectedDay === day.value;
      
      return (
        <Animated.View key={day.value} style={{
          opacity: fadeIn,
          transform: [{ scale: scaleIn }]
        }}>
          <LinearGradient
            colors={isSelected ? 
              [primaryColor, adjustBrightness(primaryColor, -15)] : 
              [colors.buttonBackground, adjustBrightness(colors.buttonBackground, -5)]
            }
            style={[styles.dayButton, isSelected && styles.selectedDayButtonShadow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity
              style={styles.buttonTouchable}
              onPress={() => handleDayChange(day.value)}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.dayButtonText,
                  { color: isSelected ? '#FFFFFF' : colors.buttonText },
                  isSelected && styles.selectedDayButtonText
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      );
    });
  };

  // Grid layout for time slots - now using animations prepared at component level
  const renderTimeSlotButtons = () => {
    if (!timeSlots || timeSlots.length === 0) return null;
    
    return (
      <View style={styles.timeSlotGrid}>
        {timeSlots.map((slot, index) => {
          const isSelected = localSelectedTimeSlot === slot;
          // Get animation values safely, or use default values
          const animation = timeSlotAnimations[index];
          const fadeIn = animation ? animation.fadeIn : new Animated.Value(1);
          const scaleIn = animation ? animation.scaleIn : new Animated.Value(1);
          
          return (
            <Animated.View 
              key={slot} 
              style={{
                opacity: fadeIn,
                transform: [{ scale: scaleIn }],
                width: '30%', // For 3-column grid
                marginBottom: 12,
              }}
            >
              <LinearGradient
                colors={isSelected ? 
                  [primaryColor, adjustBrightness(primaryColor, -15)] : 
                  [colors.buttonBackground, adjustBrightness(colors.buttonBackground, -5)]
                }
                style={[styles.timeSlotButton, isSelected && styles.selectedTimeSlotButtonShadow]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TouchableOpacity
                  style={styles.buttonTouchable}
                  onPress={() => handleTimeSlotChange(slot)}
                  activeOpacity={0.6}
                >
                  <Text 
                    style={[
                      styles.timeSlotButtonText,
                      { color: isSelected ? '#FFFFFF' : colors.buttonText },
                      isSelected && styles.selectedTimeSlotButtonText
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  // Modal slide and fade animation
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });
  
  const modalOpacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none" // Using custom animations
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: 'transparent' }]}>
        <Animated.View 
          style={[
            styles.modalOverlay,
            { opacity: modalOpacity, backgroundColor: colors.overlay }
          ]}
        >
          <Pressable 
            style={styles.backdropPressable} 
            onPress={onClose}
            android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
          />
          
          {/* If you want to use BlurView, uncomment and properly implement it:
          <BlurView 
            intensity={70} 
            tint={theme === 'dark' ? 'dark' : 'default'} 
            style={StyleSheet.absoluteFill} 
          />
          */}
          
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                transform: [{ translateY }],
                backgroundColor: colors.card,
                borderColor: colors.separator
              }
            ]}
          >
            {/* Style handle for dragging */}
            <View style={[styles.dragHandle, { backgroundColor: colors.separator }]} />
            
            <View style={[styles.modalHeader, { borderBottomColor: colors.separator }]}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={[styles.cancelButtonText, { color: primaryColor }]}>Cancel</Text>
              </TouchableOpacity>
              
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Date & Time
              </Text>
              
              <TouchableOpacity 
                onPress={handleConfirm}
                disabled={!localSelectedDay || !localSelectedTimeSlot}
                style={styles.doneButton}
              >
                <Text 
                  style={[
                    styles.doneButtonText,
                    { color: primaryColor },
                    (!localSelectedDay || !localSelectedTimeSlot) && 
                      { color: adjustBrightness(primaryColor, 100) }
                  ]}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.modalBody, { backgroundColor: colors.background }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Day</Text>
              
              {/* Horizontal scrolling days */}
              <ScrollView
                ref={ref => setDayScrollViewRef(ref)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.daysScrollContainer}
                decelerationRate="normal"
                snapToInterval={80} // Approximate button width + padding
                // snapToAlignment="center"
              >
                {renderDayButtons()}
              </ScrollView>
              
              {/* Divider with subtle gradient */}
              <View style={styles.dividerContainer}>
                <LinearGradient
                  colors={[
                    'transparent', 
                    theme === 'dark' ? '#333333' : '#E5E5EA', 
                    'transparent'
                  ]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.divider}
                />
              </View>

              {timeSlots && timeSlots.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Select Time Slot
                  </Text>
                  
                  <ScrollView
                    ref={ref => setTimeScrollViewRef(ref)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.timeSlotContainer}
                  >
                    {renderTimeSlotButtons()}
                  </ScrollView>
                </>
              )}
            </View>

            {/* Floating action button for confirm */}
            <Animated.View style={[
              styles.confirmButtonContainer,
              { 
                opacity: animation,
                transform: [{ 
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  })
                }]
              }
            ]}>
              <TouchableOpacity 
                style={[
                  styles.confirmButton,
                  { backgroundColor: (!localSelectedDay || !localSelectedTimeSlot) ? 
                    colors.separator : primaryColor 
                  },
                  styles.confirmButtonShadow
                ]}
                onPress={handleConfirm}
                disabled={!localSelectedDay || !localSelectedTimeSlot}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={(!localSelectedDay || !localSelectedTimeSlot) ? 
                    [colors.separator, adjustBrightness(colors.separator, -10)] : 
                    [primaryColor, adjustBrightness(primaryColor, -15)]
                  }
                  style={styles.confirmButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.confirmButtonText}>Confirm Selection</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdropPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderRadius: 24,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
    borderWidth: 0.5,
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
    letterSpacing: 0.3,
  },
  cancelButton: {
    padding: 8,
    minWidth: 70,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  doneButton: {
    padding: 8,
    minWidth: 70,
    alignItems: 'flex-end',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalBody: {
    padding: 20,
    paddingBottom: 100, // Extra padding for the floating button
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 10,
    letterSpacing: 0.3,
  },
  daysScrollContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  dayButton: {
    borderRadius: 16,
    marginRight: 12,
    marginVertical: 4,
    minWidth: 90,
    overflow: 'hidden',
  },
  selectedDayButtonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  selectedDayButtonText: {
    fontWeight: '700',
  },
  buttonTouchable: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerContainer: {
    paddingVertical: 10,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  timeSlotContainer: {
    paddingBottom: 40,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  timeSlotButton: {
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 60,
  },
  selectedTimeSlotButtonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  timeSlotButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedTimeSlotButtonText: {
    fontWeight: '700',
  },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  confirmButton: {
    width: '100%',
    borderRadius: 22,
    height: 56,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    paddingVertical: 16,
  }
});

export default TimeSlotModal;