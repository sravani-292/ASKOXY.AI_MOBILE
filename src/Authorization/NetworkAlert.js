// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Image } from 'react-native';
// import NetInfo from '@react-native-community/netinfo';

// const { width, height } = Dimensions.get('window');

// const NetworkAlert = () => {
//   const [networkStatus, setNetworkStatus] = useState('connected');
//   const [modalVisible, setModalVisible] = useState(false);
//   const scaleAnim = useState(new Animated.Value(0))[0];
//   const prevStatusRef = useRef('connected');

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       const isDisconnected = !state.isConnected || state.isInternetReachable === false;
//       const isSlow =
//         (state.type === 'cellular' &&
//           (state.details.cellularGeneration === '2g' || state.details.cellularGeneration === '3g')) ||
//         (state.type === 'wifi' && state.details.strength && state.details.strength < 30);
  
//       const prevStatus = prevStatusRef.current;
  
//       if (isDisconnected) {
//         if (prevStatus !== 'disconnected') {
//           setNetworkStatus('disconnected');
//           prevStatusRef.current = 'disconnected';
//           setModalVisible(true);
//         }
//       } else if (isSlow) {
//         if (prevStatus !== 'slow') {
//           setNetworkStatus('slow');
//           prevStatusRef.current = 'slow';
//           setModalVisible(true);
//         }
//       } else if (prevStatus === 'disconnected' || prevStatus === 'slow') {
//         // We were offline/slow before, now we're back
//         setNetworkStatus('restored');
//         prevStatusRef.current = 'connected'; // ✅ Important: Update it here
//         setModalVisible(true);
  
//         // Auto-dismiss after 3 seconds
//         setTimeout(() => {
//           setModalVisible(false);
//           setNetworkStatus('connected');
//         }, 3000);
//       }
//     });
  
//     return () => unsubscribe();
//   }, []);
  

//   useEffect(() => {
//     if (modalVisible) {
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(scaleAnim, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [modalVisible]);

//   const hideModal = () => {
//     setModalVisible(false);
//     setNetworkStatus('connected');
//   };

//   if (!modalVisible) return null;

//   const getContent = () => {
//     console.log("my mobile network");
    
//     console.log("network status", networkStatus);
    
//     switch (networkStatus) {
      
//       case 'slow':
//         return {
//           title: 'Slow Internet Connection',
//           description: 'Your internet is slow. Some features may not work correctly.',
//           button: 'Dismiss',
//           canDismiss: true,
//         };
//       case 'disconnected':
//         return {
//           title: 'No Internet',
//           description: 'Check your wifi or mobile data connection.',
//           button: '',
//           canDismiss: false,
//         };
//       case 'restored':
//         return {
//           title: 'Internet Restored',
//           description: 'Welcome back! You’re back online.',
//           button: '',
//           canDismiss: false,
//         };
//       default:
//         return {
//           title: '',
//           description: '',
//           button: '',
//           canDismiss: true,
//         };
//     }
//   };

//   const { title, description, button, canDismiss } = getContent();

//   return (
//     <View style={styles.overlay}>
//       <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
//         <Image
//           source={require('../../assets/NetworkImage.jpg')}
//           style={styles.image}
//           resizeMode="contain"
//         />
//         <Text style={styles.title}>{title}</Text>
//         <Text style={styles.description}>{description}</Text>

//         {canDismiss && (
//           <TouchableOpacity style={styles.button} onPress={hideModal}>
//             <Text style={styles.buttonText}>{button}</Text>
//           </TouchableOpacity>
//         )}
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     position: 'absolute',
//     top: 0, left: 0, right: 0, bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//   },
//   modalContainer: {
//     width: width * 0.85,
//     padding: 20,
//     borderRadius: 15,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     elevation: 8,
//   },
//   image: {
//     width: width*0.4,
//     height: 50,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 20,
//     textAlign: 'center',
//     lineHeight: 22,
//   },
//   button: {
//     backgroundColor: '#007BFF',
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default NetworkAlert;




import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const { width, height } = Dimensions.get('window');

const NetworkAlert = () => {
  const [networkStatus, setNetworkStatus] = useState('connected');
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = useState(new Animated.Value(0))[0];
  const prevStatusRef = useRef('connected');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isDisconnected = !state.isConnected || state.isInternetReachable === false;
      const isSlow =
        (state.type === 'cellular' &&
          (state.details.cellularGeneration === '2g' || state.details.cellularGeneration === '3g')) ||
        (state.type === 'wifi' && state.details.strength && state.details.strength < 30);
  
      const prevStatus = prevStatusRef.current;
  
      if (isDisconnected) {
        if (prevStatus !== 'disconnected') {
          setNetworkStatus('disconnected');
          prevStatusRef.current = 'disconnected';
          setModalVisible(true);
        }
      } else if (isSlow) {
        if (prevStatus !== 'slow') {
          setNetworkStatus('slow');
          prevStatusRef.current = 'slow';
          setModalVisible(true);
        }
      } else if (prevStatus === 'disconnected' || prevStatus === 'slow') {
        // We were offline/slow before, now we're back
        setNetworkStatus('restored');
        prevStatusRef.current = 'connected';
        setModalVisible(true);
  
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
          setModalVisible(false);
          setNetworkStatus('connected');
        }, 3000);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (modalVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const hideModal = () => {
    setModalVisible(false);
    setNetworkStatus('connected');
  };

  if (!modalVisible) return null;

  const getContent = () => {
    switch (networkStatus) {
      case 'slow':
        return {
          title: 'Slow Internet Connection',
          description: 'Your internet is slow. Some features may not work correctly.',
          button: 'Dismiss',
          canDismiss: true,
        };
      case 'disconnected':
        return {
          title: 'No Internet',
          description: 'Check your wifi or mobile data connection.',
          button: '',
          canDismiss: false,
        };
      case 'restored':
        return {
          title: 'Internet Restored',
          description: 'Welcome back! You’re back online.',
          button: '',
          canDismiss: false,
        };
      default:
        return {
          title: '',
          description: '',
          button: '',
          canDismiss: true,
        };
    }
  };

  const { title, description, button, canDismiss } = getContent();

  // Determine which network image to use based on status
  const getNetworkImage = () => {
    try {
   
      return networkStatus === 'disconnected' 
        ? require('../../assets/UpdateImage2.jpg') 
        : networkStatus === 'slow'
        ? require('../../assets/UpdateImage2.jpg') 
        : require('../../assets/UpdateImage2.jpg');
    } catch (error) {
      console.error('Error loading network image:', error);
      // Fallback image
      return null;
    }
  };

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
        {/* Close button in the corner */}
        {canDismiss && (
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={hideModal}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.imageContainer}>
          {/* Use inline error handling for image */}
          <Image
            // source={getNetworkImage()}
            source={require('../../assets/UpdateImage2.jpg')}
            style={styles.image}
            resizeMode="contain"
            defaultSource={require('../../assets/UpdateImage2.jpg')} 
            // onError={(e) => console.log('Image failed to load:', e.nativeEvent.error)}
          />
        </View>
        
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {canDismiss && button && (
          <TouchableOpacity style={styles.button} onPress={hideModal}>
            <Text style={styles.buttonText}>{button}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalContainer: {
    width: width * 0.85,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    elevation: 8,
    position: 'relative', 
    height:250
   
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  imageContainer: {
    width: width * 0.8,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: width*0.8,
    height: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default NetworkAlert;