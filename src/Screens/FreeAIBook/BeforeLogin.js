import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView ,Dimensions} from 'react-native'
import React, { useState, useEffect } from 'react'
import { BASE_URL } from '../../../Config'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
const { width ,height} = Dimensions.get('window');
const BeforeLogin = () => {
    const userData = useSelector((state) => state?.counter);
    const customerId = userData?.userId;
    const navigation = useNavigation();

    useEffect(() => {
        if (customerId) {
            navigation.replace('After Login');
        }
        else {
            // Stay on the current screen
        }
    }, [customerId, navigation]);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: 'https://www.askoxy.ai/static/media/book.7f71f18d48944a4c9049.png' }}
                    resizeMode='cover'
                    style={styles.bookImage}
                />
                <View style={styles.imageOverlay} />
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.mainTitle}>Welcome to AI Universe</Text>

                <View style={styles.contentBlock}>
                    <Text style={styles.subHeading}>Step into the AI Universe:</Text>
                    <Text style={styles.bodyText}>
                        Discover, learn, and create with today's most powerful AI tools. From your very first prompt to shaping global impact, explore how AI is transforming industries, generating text, images, music, and code, and powering innovations like ChatGPT and MidJourney.
                    </Text>
                </View>

                <View style={styles.contentBlock}>
                    <Text style={styles.subHeading}>Our Mission:</Text>
                    <Text style={styles.bodyText}>
                        To empower one million learners with AI skills and unlock career opportunities of the future. Join the revolution, master AI, and be part of the next wave of technological innovation.
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={userData?.userId ? () => navigation.replace('After Login') : () => navigation.navigate('Login')}
                    style={styles.ctaButton}
                    activeOpacity={0.8}
                >
                    <Text style={styles.ctaButtonText}>Get Free AI Book</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpacing} />
            </View>
        </ScrollView>
    )
}

export default BeforeLogin

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    imageContainer: {
        position: 'relative',
        height: 280,
        marginBottom: 20,
    },
    bookImage: {
        width: width,
        height: '100%',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        resizeMode:'cover',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.1))',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 30,
        letterSpacing: -0.5,
    },
    contentBlock: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    subHeading: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        color: '#2c3e50',
        letterSpacing: -0.3,
    },
    bodyText: {
        fontSize: 16,
        color: '#4a5568',
        lineHeight: 24,
        textAlign: 'justify',
        fontWeight: '400',
    },
    ctaButton: {
        backgroundColor: '#007bff',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 14,
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007bff',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
        transform: [{ scale: 1 }],
    },
    ctaButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    bottomSpacing: {
        height: 30,
    },
})