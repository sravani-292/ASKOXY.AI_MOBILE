import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity,Linking,
          Modal, Image,Platform,SafeAreaView, Dimensions,Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import axios from 'axios';
import { useSelector } from "react-redux";
import BASE_URL,{userStage} from "../../Config";


const { width,height } = Dimensions.get('window');
const cardWidth = width * 0.92;

export default function CryptoCurrency() {
  const [modalVisible, setModalVisible] = useState(false);
  const [blockchainId, setBlockchainId] = useState('');
  const[coins,setCoins]=useState('')
   const userData = useSelector((state) => state.counter);
      // console.log({ userData });
      const [copied, setCopied] = useState(false);
      const [isExpanded, setIsExpanded] = useState(false);
      // const bmvCoins = 10000;
      const url = "http://bmv.money:2750"; // Given URL

    
      const copyToClipboard = async (text) => {
        // try {
        //   await Clipboard.setStringAsync(blockchainId);
        //   setCopied(true);
        //   setTimeout(() => setCopied(false), 2000);
        //   Alert.alert('Copied!', 'Blockchain ID copied to clipboard');
        // } catch (error) {
        //   Alert.alert('Error', 'Failed to copy to clipboard');
        // }
        Clipboard.setString(text);
    Alert.alert("Copied!", "Text has been copied to clipboard.");
      };

  const ValueEstimate = ({ label, value, extraInfo }) => (
    <View style={styles.estimateCard}>
      <Text style={styles.estimateLabel}>{label}</Text>
      <Text style={styles.estimateValue}>{value}</Text>
      {extraInfo && <Text style={styles.estimateExtra}>{extraInfo}</Text>}
    </View>
  );


  const TimelineImage = () => (
    <Image
      source={require('../../assets/bmvcoin.png')} // Make sure to add the timeline image to your assets folder
      style={styles.timelineImage}
      resizeMode="contain"
    />
  );

const getProfile=()=>{
  axios({
    method:"get",
    url:BASE_URL+`user-service/getProfile/${userData?.userId}`,
    headers:{
      "Authorization":`Bearer ${userData?.accessToken}`
    }
  })
  .then((response)=>{
    console.log(response.data);
    setBlockchainId(response?.data?.multiChainId);
    setCoins(response?.data?.coinAllocated)
  })
  .catch((error)=>{
    console.log("error",error.response);
  })

}

useEffect(()=>{
  getProfile()
},[])

  const openUrl = async () => {
    console.log(url)
    if (!url.startsWith("https://")) {
      Alert.alert("Error", "The URL is not secure. HTTPS is required.");
      return;
    }

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Can't open this URL");
    }
  };




  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* <LinearGradient
            colors={['#1E3A8A', '#2563EB']}
            style={styles.header}
          > */}
          <View>
            <Text style={styles.headerTitle}>BMVCOIN and OXYCHAIN</Text>
            <Text style={styles.headerSubtitle}>Timeline and Strategic Decisions</Text>
            </View>
            <View style={{borderBottomWidth:1,margin:10}}/>
          {/* </LinearGradient> */}
          {/* {userData==null?<Text>Blockchain Id : {blockchainId}</Text>:null} */}
  {/* <Text>Blockchain Id :</Text> */}
          <TimelineImage />




          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Learn More About BMVCOIN</Text>
          </TouchableOpacity>


          <View style={styles.contentContainer}>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.headerContainer}
              onPress={() => setIsExpanded(!isExpanded)}
              activeOpacity={0.7}
            >
              <View style={styles.headerLeft}>
                <MaterialIcons name="account-balance-wallet" size={24} color="#3498db" />
                <Text style={styles.headerText}>Blockchain Details</Text>
              </View>
              <MaterialIcons 
                name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={28} 
                color="#3498db" 
              />
            </TouchableOpacity>
            
            {isExpanded && (
              <>
                <View style={styles.divider} />
                
                <View style={styles.section}>
                  <Text style={styles.label}>Blockchain ID</Text>
                  <View style={styles.blockchainContainer}>
                    <Text style={styles.blockchainText} numberOfLines={1} ellipsizeMode="middle">
                      {blockchainId} 
                    </Text>
                    {/* <TouchableOpacity 
                      onPress={copyToClipboard} 
                      style={styles.copyButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <MaterialIcons 
                        name={copied ? "check-circle" : "content-copy"} 
                        size={22} 
                        color="#3498db" 
                      />
                    </TouchableOpacity> */}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>BMV Coins</Text>
                  <View style={styles.coinWrapper}>
                    <View style={styles.coinContainer}>
                      <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
                      <MaterialIcons name="diamond" size={24} color="#3498db" />
                    </View>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>


          {/* <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <MaterialIcons name="close" size={24} color="#1E3A8A" />
                </TouchableOpacity>

                <ScrollView>
                  <Text style={styles.modalTitle}>About BMVCOIN</Text>

                  <View style={styles.infoSection}>
                    <MaterialIcons name="history" size={24} color="#1E3A8A" />
                    <Text style={styles.infoTitle}>Our Journey</Text>
                    <Text style={styles.infoText}>
                      Started in 2016, laying the foundation for a transformative financial ecosystem.
                    </Text>
                  </View>

                  <View style={styles.infoSection}>
                    <MaterialIcons name="token" size={24} color="#1E3A8A" />
                    <Text style={styles.infoTitle}>Technology</Text>
                    <Text style={styles.infoText}>
                      BMVCOIN operates on both Ethereum blockchain and private OXYChain, ensuring security and scalability.
                    </Text>
                  </View>

                  <View style={styles.infoSection}>
                    <MaterialIcons name="security" size={24} color="#1E3A8A" />
                    <Text style={styles.infoTitle}>Compliance</Text>
                    <Text style={styles.infoText}>
                      Secured RBI P2P NBFC license and maintaining regulatory compliance.
                    </Text>
                  </View>

                  <View style={styles.infoSection}>
                    <MaterialIcons name="trending-up" size={24} color="#1E3A8A" />
                    <Text style={styles.infoTitle}>Future Plans</Text>
                    <Text style={styles.infoText}>
                      Planning public Ethereum chain integration with optimized gas fees for transparency.
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Join BMVCOIN Network</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal> */}

  <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#9333EA" />
              </TouchableOpacity>

              <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient
                  colors={['#9333EA', '#7C3AED']}
                  style={styles.modalHeader}
                >
                  <Text style={styles.modalTitle}>Introducing BMVCOINS</Text>
                  <Text style={styles.modalSubtitle}>A Revolutionary Opportunity!</Text>
                </LinearGradient>

                <View style={styles.offerSection}>
                  <Text style={styles.offerTitle}>FREE 10,000 BMVCOINS for You!</Text>
                  <Text style={styles.offerDescription}>
                    We are giving away 10,000 BMVCOINS to every user absolutely free!
                  </Text>
                  <Text style={styles.highlightText}>
                    But that's not all—these coins come with game-changing potential.
                  </Text>
                </View>

                <View style={styles.valueSection}>
                  <Text style={styles.sectionTitle}>Future Value Estimates</Text>
                  <ValueEstimate label="Minimum" value="₹10,000" />
                  <ValueEstimate label="Maximum" value="₹1,00,000" />
                  <ValueEstimate label="Great Value" value="₹10,000" extraInfo="(₹8,00,000+)" />
                </View>

                <View style={styles.magicSection}>
                  <Text style={styles.sectionTitle}>When does the magic happen?</Text>
                  <View style={styles.magicContent}>
                    <MaterialIcons name="rocket-launch" size={24} color="#9333EA" />
                    <Text style={styles.magicText}>
                    Once we reach 1 million users, BMVCOINS will be launched on public 
                    tradeable blockchains. On that day, the coin is expected to open at a 
                    minimum of $0.10 USD, with the potential to grow exponentially!
                    </Text>
                  </View>
                </View>

                <View style={styles.growthSection}>
                  <Text style={styles.sectionTitle}>How are we ensuring growth?</Text>
                  <View style={styles.growthItem}>
                    <MaterialIcons name="lock" size={24} color="#9333EA" />
                    <Text style={styles.growthText}>
                      Private Chain (OXYCHAIN): Until we reach 1 million users, all transactions
                      will be tracked securely in our private chain.
                    </Text>
                  </View>
                  <View style={styles.growthItem}>
                    <MaterialIcons name="public" size={24} color="#9333EA" />
                    <Text style={styles.growthText}>
                      Public Chain (Ethereum): Post-launch, BMVCOINS will move to Ethereum,
                      one of the world's most trusted blockchain networks.
                    </Text>
                  </View>
                </View>

                <View style={styles.magicSection}>
                  <Text style={styles.sectionTitle}>The Next Big Crypto Opportunity!
                  </Text>
                  <View style={styles.magicContent}>
                    <MaterialIcons name="rocket-launch" size={24} color="#9333EA" />
                    <Text style={styles.magicText}>
                    Bitcoin started at just a few cents and skyrocketed to thousands of dollars. 
                    BMVCOINS hold the same explosive potential! This is your chance to be an early 
                    adopter and ride the wave to incredible value.
                    </Text>
                  </View>
                </View>

                <View style={styles.claimSection}>
                  {/* <TextInput
                    style={styles.input}
                    placeholder="Enter Your Blockchain ID"
                    value={blockchainId}
                    onChangeText={setBlockchainId}
                    placeholderTextColor="#666"
                  /> */}
                  <TouchableOpacity style={styles.claimButton} onPress={()=>openUrl()}>
                    <Text style={styles.claimButtonText}>
                      Copy Your Blockchain ID & check in OxyChain Explorer
                    </Text>
                  </TouchableOpacity>
                  {/* <Text style={styles.reminderText}>
                    Remember how Bitcoin grew from a few cents to thousands of dollars?
                    The same explosive potential lies in BMVCOINS. This is your chance
                    to be an early adopter and ride the wave to incredible value!
                  </Text> */}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3d2a71',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#3d2a71',
    marginTop: 8,
    textAlign: 'center',
  },
  timelineImage: {
    width: width,
    height: width * 1.2,
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: '#1E3A8A',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoSection: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#1E3A8A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  growthSection: {
    padding: 20,
  },
  growthItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    gap: 10,
    backgroundColor: '#F8F7FF',
    padding: 15,
    borderRadius: 10,
  },
  growthText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 24,
  },
  claimSection: {
    padding: 20,
  },
  input: {
    backgroundColor: '#F8F7FF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  claimButton: {
    backgroundColor: '#9333EA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom:30
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:"center/"
  },
  magicSection: {
    padding: 20,
    backgroundColor: '#F8F7FF',
  },
  magicContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  magicText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 24,
  },
  offerSection: {
    padding: 20,
    backgroundColor: '#F8F7FF',
  },
  offerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9333EA',
    textAlign: 'center',
  },
  offerDescription: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginTop: 10,
  },
  highlightText: {
    fontSize: 16,
    color: '#9333EA',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
  valueSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9333EA',
    marginBottom: 15,
  },
  estimateCard: {
    backgroundColor: '#F8F7FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estimateLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  estimateValue: {
    fontSize: 16,
    color: '#9333EA',
    fontWeight: 'bold',
  },
  estimateExtra: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 5,
  },
   modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 5,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.05,
  },
  card: {
    width: cardWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    marginTop:-20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  blockchainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  blockchainText: {
    flex: 1,
    fontSize: 15,
    color: '#2c3e50',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  copyButton: {
    padding: 4,
  },
  coinWrapper: {
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    padding: 2,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  coinText: {
    fontSize: 24,
    color: '#2c3e50',
    fontWeight: '700',
  },
});