// import React from 'react';
// import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

// const { width, height } = Dimensions.get('window');

// const CustomModal = ({
//   visible,
//   type, // e.g., 'error', 'info', 'payment'
//   title,
//   message,
//   primaryButtonText,
//   secondaryButtonText,
//   onClose,
//   onPrimaryPress,
//   onSecondaryPress,
// }) => {
//   const getTitleColor = () => {
//     switch (type) {
//       case 'error':
//         return '#dc3545'; // Red for error
//       case 'info':
//         return '#007bff'; // Blue for info
//       case 'payment':
//         return '#28a745'; // Green for payment
//       default:
//         return '#333';
//     }
//   };

//   const getPrimaryButtonColor = () => {
//     switch (type) {
//       case 'error':
//         return '#dc3545';
//       case 'info':
//         return '#007bff';
//       case 'payment':
//         return '#28a745';
//       default:
//         return '#007bff';
//     }
//   };

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           <Text style={[styles.modalTitle, { color: getTitleColor() }]}>{title}</Text>
//           <Text style={styles.modalMessage}>{message}</Text>

//           <View style={styles.buttonContainer}>
//             {secondaryButtonText && (
//               <TouchableOpacity style={styles.secondaryButton} onPress={onSecondaryPress}>
//                 <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
//               </TouchableOpacity>
//             )}
//             {primaryButtonText && (
//               <TouchableOpacity
//                 style={[styles.primaryButton, { backgroundColor: getPrimaryButtonColor() }]} 
//                 onPress={onPrimaryPress}
//               >
//                 <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: width * 0.8,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   modalMessage: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 20,
//     lineHeight: 22,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
//   primaryButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginHorizontal: 5,
//   },
//   primaryButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   secondaryButton: {
//     backgroundColor: '#6c757d', // Grey for secondary
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginHorizontal: 5,
//   },
//   secondaryButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default CustomModal;






import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  Platform 
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CustomModal = ({
  visible,
  type = 'info', // 'error', 'success', 'warning', 'info', 'payment'
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
  onClose,
  onPrimaryPress,
  onSecondaryPress,
  showCloseButton = true,
}) => {
  const getModalConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: '❌',
          titleColor: '#E53E3E',
          backgroundColor: '#FED7D7',
          borderColor: '#E53E3E',
          primaryButtonColor: '#E53E3E',
        };
      case 'success':
        return {
          icon: '✅',
          titleColor: '#38A169',
          backgroundColor: '#C6F6D5',
          borderColor: '#38A169',
          primaryButtonColor: '#38A169',
        };
      case 'warning':
        return {
          icon: '⚠️',
          titleColor: '#D69E2E',
          backgroundColor: '#FEFCBF',
          borderColor: '#D69E2E',
          primaryButtonColor: '#D69E2E',
        };
      case 'payment':
        return {
          icon: '💳',
          titleColor: '#3182CE',
          backgroundColor: '#BEE3F8',
          borderColor: '#3182CE',
          primaryButtonColor: '#3182CE',
        };
      default: // info
        return {
          icon: 'ℹ️',
          titleColor: '#3182CE',
          backgroundColor: '#BEE3F8',
          borderColor: '#3182CE',
          primaryButtonColor: '#3182CE',
        };
    }
  };

  const config = getModalConfig();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalContent,
            { borderTopColor: config.borderColor }
          ]}>
            {/* Close button */}
            {showCloseButton && (
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            )}

            {/* Icon and Header */}
            <View style={[
              styles.iconContainer,
              { backgroundColor: config.backgroundColor }
            ]}>
              <Text style={styles.iconText}>{config.icon}</Text>
            </View>

            {/* Title */}
            {title && (
              <Text style={[
                styles.modalTitle, 
                { color: config.titleColor }
              ]}>
                {title}
              </Text>
            )}

            {/* Message */}
            {message && (
              <Text style={styles.modalMessage}>
                {message}
              </Text>
            )}

            {/* Action Buttons */}
            {(primaryButtonText || secondaryButtonText) && (
              <View style={styles.buttonContainer}>
                {secondaryButtonText && (
                  <TouchableOpacity 
                    style={styles.secondaryButton} 
                    onPress={onSecondaryPress}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.secondaryButtonText}>
                      {secondaryButtonText}
                    </Text>
                  </TouchableOpacity>
                )}
                
                {primaryButtonText && (
                  <TouchableOpacity
                    style={[
                      styles.primaryButton, 
                      { backgroundColor: config.primaryButtonColor }
                    ]}
                    onPress={onPrimaryPress}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.primaryButtonText}>
                      {primaryButtonText}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      android: {
        elevation: 10,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
    }),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    borderTopWidth: 4,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#718096',
    fontWeight: 'bold',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 32,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 28,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 24,
    color: '#4A5568',
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CustomModal;