// PremiumPlanModal.js
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const PremiumPlan = ({ visible, onClose }) => {
    const [openIndex, setOpenIndex] = useState(null);
    
    const premium = [
        { question: "Can I use both my advance and wallet balance for purchases?", answer: "Yes, you can use both your advance and wallet balance for purchases." },
        { question: "What if I withdraw on the 40th day?", answer: "You will receive the wallet amount in proportion to the days completed. For example, if you withdraw after 40 days, you will receive ₹2,667 (₹2,000 for the first 30 days + ₹667 for the extra 10 days)." },
        { question: "What happens if I withdraw my advance before 30 days?", answer: "No, you cannot withdraw within the first 30 days as the lock period is not completed." },
        { question: "Is there a limit on how many times I can withdraw my advance?", answer: "No, you can withdraw your full advance anytime, but your wallet earnings will be added only for the completed days." },
        { question: "Will I keep earning ₹2,000 every month indefinitely?", answer: "You will receive ₹2,000 every month as long as the ₹99,000 advance remains in your account and the 30-day period is completed." },
        { question: "Can I add more advance later to increase my earnings?", answer: "Currently, the earnings are based on a fixed advance of ₹99,000. Any changes will be communicated in the future." },
        { question: "Will my wallet balance expire if I don't use it?", answer: "No, your wallet balance will not expire. It will accumulate indefinitely month after month." },
        { question: "Can I withdraw my wallet balance instead of using it for purchases?", answer: "No, the wallet balance can only be used for purchases and cannot be withdrawn." }
    ];
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <LinearGradient colors={['#4776E6', '#8E54E9', '#4776E6']} style={styles.gradient}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>Premium Plan - FAQs</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={styles.scrollView}>
                            {premium.map((faq, index) => (
                                <View key={index} style={styles.faqContainer}>
                                    <TouchableOpacity onPress={() => setOpenIndex(openIndex === index ? null : index)}>
                                        <View style={styles.questionContainer}>
                                            <Text style={styles.question}>{faq.question}</Text>
                                            <Text style={styles.icon}>{openIndex === index ? '▲' : '▼'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {openIndex === index && <Text style={styles.answer}>{faq.answer}</Text>}
                                </View>
                            ))}
                        </ScrollView>
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.9,
        height: height * 0.8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    faqContainer: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    icon: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginLeft: 8,
    },
    answer: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    }
});

export default PremiumPlan;