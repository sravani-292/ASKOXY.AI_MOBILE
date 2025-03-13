import React, { useState,useRef,useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView,Animated, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


export default function About() {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedId1, setExpandedId1] = useState(null);
  const[hide,setHide]=useState(false)
const[show,setShow]=useState(false)
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setExpandedId1(false)
  };
  const toggleExpand1 = (id) => {
    setExpandedId1(expandedId1 === id ? null : id);
    setExpandedId(false)
  };


  useEffect(() => {
    // Blinking animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Subtle pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const faqs = [
    {
      id: 1,
      question: 'How does the referral program work?',
      answer: 'Our referral program allows you to invite friends to join our platform. When your referral signs up using your unique link, places an order for rice, and does not cancel it, you (the referrer) will receive a ₹100 cashback reward.'
    },
    {
      id: 2,
      question: 'Who can I refer?',
      answer: 'You can refer anyone who is not already a registered user on ASKOXY.ai. To count as a referral, they must sign up using your referral link.'
    },
    {
      id: 3,
      question: 'How do I refer someone?',
      answer: "• Share your unique referral link with your friends.\n• Your friend must sign up using your referral link during registration.\n• Once they place an order for rice and do not cancel it, you'll receive the reward."
    },
    {
      id: 4,
      question: 'What rewards do I get for referring a friend?',
      answer: 'Apart from getting a *free steel container, you will also receive *₹100 cashback** in your *AskOxy.ai wallet* when you successfully refer someone.'
    },
    {
      id: 5,
      question: 'When will I receive my referral reward?',
      answer: 'Referral rewards are credited once your referred friend successfully places an order for rice and does not cancel it.'
    },
    {
      id: 6,
      question: 'Where can I check my referral status?',
      answer: 'You can track your referrals in your ASKOXY.ai dashboard.'
    },
    {
      id: 7,
      question: 'Is there a limit to the number of people I can refer?',
      answer: 'No, you can refer *as many friends as you like. You will receive *₹100 cashback for each successful referral**, subject to promotional terms.'
    },
    {
      id: 8,
      question: 'What happens if my friend forgets to use my referral link?',
      answer: 'Referrals must use your link at the time of sign-up. If they forget, the referral may not be counted, and you will **not receive the reward.'
    },
    {
      id: 9,
      question: 'Can I refer myself using another account?',
      answer: 'No, self-referrals are not allowed. Any fraudulent activity may result in disqualification from the referral program.'
    },
    {
      id: 10,
      question: 'Who do I contact if I have issues with my referral reward?',
      answer: "If you have any issues with your referral reward, please contact AskOxy.ai support at:\n 📞 Phone : 814-327-1103 \n 📧 Email : SUPPORT@ASKOXY.AI"
    }
  ];

  const freeSteelContainerfaqs=[
    {
      id:1,
      question:"About AskOxy.ai",
      answer:"AskOxy.ai is an AI-powered platform integrating 34+ marketplaces, designed to simplify lives with innovative solutions, including premium rice delivery"
    },
    {
      id:2,
      question:"Who is the founder of AskOxy.ai?",
      answer:"AskOxy.ai is led by Radhakrishna Thatavarti ([LinkedIn](https://www.linkedin.com/in/oxyradhakrishna/)), an entrepreneur with over 24 years of experience in software technology and business leadership. His vision is to empower communities through sustainable, customer-centric solutions using AI, Blockchain, and Java technologies."
    },
    {
      id:3,
      question:"What is the Free Steel Container offer?",
      answer:"Customers who purchase a 26kg rice bag* will receive a FREE steel rice container. However, the container remains the property of OXY Group* until ownership is earned."
    },
    {
      id:4,
      question:"How can I earn ownership of the steel container?",
      answer:"You can *own* the container by meeting either of the following criteria: \n1. Refer 9 new users to AskOxy.ai. \n2. Purchase 9 rice bags within 1 year."
    },
    {
      id:5,
      question:"What happens if I do not purchase regularly?",
      answer:"- If you do not make a purchase within 45 days, or \n- If there is a gap of 45 days between purchases, then the container will be taken back."
    },
    {
      id:6,
      question:"How long does delivery take for the rice bag and container?",
      answer:"- The *rice bag* will be delivered *within 24 hours*\n- Due to high demand, container delivery may be delayed."
    },
    {
      id:7,
      question:"Who is eligible to be referred under this program?",
      answer:"Only new users who are not yet registered on AskOxy.ai can be referred."
    }

]

  // Brand colors
  const colors = {
    primary: '#3d2a71', // Purple
    secondary: '#ff8c00', // Orange
    light: '#f8f5ff',
    white: '#ffffff',
    text: '#333333',
    lightText: '#666666',
    border: '#e0d5ff'
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.light }]}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={[styles.header]}>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Frequently Asked Questions</Text>
        {/* <Text style={[styles.headerSubtitle, { color: colors.primary }]}>Referral Process in ASKOXY.ai</Text> */}
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.faqContainer}>
        <Animated.View style={[
      styles.buttonContainer,
      {
        transform: [{ scale: scaleAnim }],
      }
    ]}>
      <TouchableOpacity activeOpacity={0.8} onPress={()=>{setHide(!hide),setShow(false)}}>
        <LinearGradient
          colors={['#4776E6', '#8E54E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.mainText}>Free Steel Container Policy!</Text>
              <Text style={styles.subText}>Limited time offer</Text>
            </View>
            <View style={styles.actionContainer}>
              <Animated.View style={[styles.badge, { opacity: blinkAnim }]}>
                <Text style={styles.badgeText}>NEW</Text>
              </Animated.View>
              <Text style={styles.actionText}>Click here</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>

{hide==true?
    <>
          {freeSteelContainerfaqs.map((freeSteelContainerfaq) => (
            <View key={freeSteelContainerfaq.id} style={[styles.faqItem, { borderLeftColor: colors.secondary, borderLeftWidth: 4 }]}>
              <TouchableOpacity 
                style={styles.questionContainer} 
                onPress={() => toggleExpand1(freeSteelContainerfaq.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.questionText, { color: colors.primary }]}>
                  {freeSteelContainerfaq.id}. {freeSteelContainerfaq.question}
                </Text>
                <Ionicons 
                  name={expandedId1 === freeSteelContainerfaq.id ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={colors.secondary} 
                />
              </TouchableOpacity>
              
              {expandedId1 === freeSteelContainerfaq.id && (
                <View style={[styles.answerContainer, { borderTopColor: colors.border }]}>
                  <Text style={styles.answerText}>{freeSteelContainerfaq.answer}</Text>
                </View>
              )}
            </View>
          ))}
</>
:null}


<Animated.View style={[
      styles.buttonContainer,
      {
        transform: [{ scale: scaleAnim }],
      }
    ]}>
      <TouchableOpacity activeOpacity={0.8} onPress={()=>{setShow(!show),setHide(false)}}>
        <LinearGradient
          colors={['#4776E6', '#8E54E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.mainText}>Referral Program</Text>
              <Text style={styles.subText}>Earn a Free Container & ₹100 Cashback!</Text>
            </View>
            <View style={styles.actionContainer}>
              <Animated.View style={[styles.badge, { opacity: blinkAnim }]}>
                <Text style={styles.badgeText}>NEW</Text>
              </Animated.View>
              <Text style={styles.actionText}>Click here</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>

{show==true?
    <>
          {faqs.map((faq) => (
            <View key={faq.id} style={[styles.faqItem, { borderLeftColor: colors.secondary, borderLeftWidth: 4 }]}>
              <TouchableOpacity 
                style={styles.questionContainer} 
                onPress={() => toggleExpand(faq.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.questionText, { color: colors.primary }]}>
                  {faq.id}. {faq.question}
                </Text>
                <Ionicons 
                  name={expandedId === faq.id ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color={colors.secondary} 
                />
              </TouchableOpacity>
              
              {expandedId === faq.id && (
                <View style={[styles.answerContainer, { borderTopColor: colors.border }]}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
</>
:null}



          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    // paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  faqContainer: {
    padding: 16,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  answerContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
  },
  answerText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    margin: 16,
  },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  mainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  actionContainer: {
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});