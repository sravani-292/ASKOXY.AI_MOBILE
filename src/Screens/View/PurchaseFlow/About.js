import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function About() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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
      answer: 'The rewards vary based on ongoing promotions. Typically, you (the referrer) will receive ₹100 cashback once your referral (the referee) registers using your referral link, places an order for rice, and does not cancel the order.'
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
      answer: 'No, there is no limit to the number of people you can refer. You can refer as many friends as you like, and you will receive ₹100 cashback for each successful referral who meets the eligibility criteria. However, specific promotions may have restrictions, so please check the referral terms for details.'
    },
    {
      id: 8,
      question: 'What happens if my friend forgets to use my referral link?',
      answer: 'Unfortunately, referrals must use your link at the time of sign-up. If they forget, the referral may not be counted, and you will not receive the reward.'
    },
    {
      id: 9,
      question: 'Can I refer myself using another account?',
      answer: 'No, self-referrals are not allowed. Any fraudulent activity may result in disqualification from the referral program.'
    },
    {
      id: 10,
      question: 'Who do I contact if I have issues with my referral reward?',
      answer: "If you haven't received your reward or have any issues, please contact our support team at ASKOXY.ai for assistance."
    }
  ];

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
        <Text style={[styles.headerSubtitle, { color: colors.primary }]}>Referral Process in ASKOXY.ai</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.faqContainer}>
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
    paddingVertical: 20,
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
});