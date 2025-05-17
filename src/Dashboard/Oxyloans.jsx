import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Main icon set for most icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // For star icon with fill
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // For other material icons
import { LinearGradient } from 'expo-linear-gradient';

// Import testimonial images - You'll need to add these to your assets folder
// In React Native, we'll import them directly from the assets folder
const testimonialImages = {
  I1: require('../../assets/Testimonial/testimonial1.png'),
  I2: require('../../assets/Testimonial/testimonial2.png'),
  I3: require('../../assets/Testimonial/testimonial3.png'),
  I4: require('../../assets/Testimonial/testimonial4.png'),
  I5: require('../../assets/Testimonial/testimonial5.png'),
  I6: require('../../assets/Testimonial/testimonial6.png'),
  I7: require('../../assets/Testimonial/testimonial7.png'),
  I8: require('../../assets/Testimonial/testimonial8.png'),
  I9: require('../../assets/Testimonial/testimonial9.png'),
  I12: require('../../assets/Testimonial/testimonial12.png'),
  I15: require('../../assets/Testimonial/testimonial15.png')
}

// RBI License image
const RBILicense = require('../../assets/RBI.png');

const { width } = Dimensions.get('window');

const OxyLoans = () => {
  const [activeTab, setActiveTab] = useState('lend');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [showRBILicense, setShowRBILicense] = useState(false);
  // App store badges
  const googlePlayBadge = { uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png' };
  const appStoreBadge = require ('../../assets/appstore.png');

  // Comprehensive testimonials data
  const testimonials = [
    {
      id: "testimonial1",
      author: "Aruna Videla",
      quote: "Oxyloans is best P2P lending platform in India. They are exceptionally proficient and genuine. I have been Investing in Oxyloans from past couple of years and getting great returns for my Investment best in the market.",
      image: testimonialImages.I1,
    },
    {
      id: "testimonial2",
      author: "Praveen Rayapudi",
      quote: "I am with oxyloans from past 2 years, it was a wonderful journey had earned very good return for the investment. The team is wonderful and they keep launching innovative and new deals regularly.",
      image: testimonialImages.I2,
    },
    {
      id: "testimonial4",
      author: "Manoj Sharma",
      quote: "What I like about OXYLOANS is that customers profit is their main aim. And that too not small profit as seen on other P2P lending platforms. The OXYLOANS company try their best to make our investment safe.",
      image: testimonialImages.I3,
    },
    {
      id: "testimonial5",
      author: "Sudheer Kumar Vakkalagadda",
      quote: "Everyone from Oxyloans team are highly transparent, professional, very responsive. I have also referred my friends and they are lending to people who are in need and getting benefited.",
      image: testimonialImages.I4,
    },
    {
      id: "testimonial7",
      author: "Vijaykanth Kothapalli",
      quote: "Student deals are awesome. Effective teamwork and coordination makes it easy to track.",
      image: testimonialImages.I5,
    },
    {
      id: "testimonial10",
      author: "Venu Kuchipudi",
      quote: "OXYLOANS team is very professional and responsive and mainly transparent. CEO Mr. Radha Krishna Garu is working very hard to take the company to next level.",
      image: testimonialImages.I6,
    },
    {
      id: "testimonial11",
      author: "Ravi Rao",
      quote: "As a user of OxyLoans. I have been very satisfied and happy. It has been a very rewarding experience for me.",
      image: testimonialImages.I7,
    },
    {
      id: "testimonial12",
      author: "Krishna Velguri",
      quote: "They provide the best interest rates in the current market and friendly customer services. I wish all the best to the team to grow much better.",
      image: testimonialImages.I8,
    },
    {
      id: "testimonial13",
      author: "Sreenivasa Rao Yenduri",
      quote: "FinTech start-ups drive the future of World Economy. I am proud to Invest in OxyLoans.",
      image: testimonialImages.I9,
    },
    {
      id: "testimonial16",
      author: "Sreedhar Reddy",
      quote: "I am happy to be part of FinTech start-up, OxyLoans. P2P Loans are the Future of Lending and Borrowing.",
      image: testimonialImages.I12,
    },
    {
      id: "testimonial18",
      author: "Nalluri Subbarao",
      quote: "FinTech start-ups drive the future of World Economy. I am proud to Invest in OxyLoans.",
      image: testimonialImages.I15,
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Navigation handlers
  const handleNavigation = (type) => {
    switch(type) {
      case 'lend':
        Linking.openURL('https://user.oxyloans.com/');
        break;
      case 'borrow':
        Linking.openURL('https://oxyloans.com/');
        break;
      case 'lendAndEarn':
        Linking.openURL('https://www.oxyloans.com/lend-and-earn');
        break;
    }
  };

  // Toggle RBI License Modal
  const toggleRBILicense = () => {
    setShowRBILicense(!showRBILicense);
  };

  // Impact Tiles Component
  const ImpactTiles = () => {
    const tiles = [
      { 
        iconName: "handshake-o", 
        value: "30,000+", 
        label: "Lenders",
        description: "Trusted Investors" 
      },
      { 
        iconName: "users", 
        value: "270,000+", 
        label: "Borrowers",
        description: "Growing Community" 
      },
      { 
        iconName: "dollar-sign", 
        value: "₹2,500,000,000+", 
        label: "Total Disbursal", 
        description: "In the Indian Financial Market" 
      }
    ];

    return (
      <View style={styles.tilesContainer}>
        {tiles.map((tile, index) => (
          <>
          {tile.label !== "Lenders"?
          <View key={index} style={styles.impactTile}>
            <Icon name={tile.iconName} color="#2563eb" size={48} style={styles.tileIcon} />
            <Text style={styles.tileValue}>{tile.value}</Text>
            <Text style={styles.tileLabel}>{tile.label}</Text>
            <Text style={styles.tileDescription}>{tile.description}</Text>
          </View>
          : 
          <View key={index} style={styles.impactTile}>
            <FontAwesome name={tile.iconName} color="#2563eb" size={48} style={styles.tileIcon} />
            <Text style={styles.tileValue}>{tile.value}</Text>
            <Text style={styles.tileLabel}>{tile.label}</Text>
            <Text style={styles.tileDescription}>{tile.description}</Text>
          </View>
          }
          </>
        ))}
      </View>
    );
  };

  // Benefit Tiles Component
  const BenefitTiles = () => {
    const benefits = [
      { 
        iconName: "credit-card", 
        title: "Easy Compare", 
        description: "Compare loan offers and investment opportunities effortlessly" 
      },
      { 
        iconName: "shield", 
        title: "Expert Assistance", 
        description: "Get professional guidance throughout your lending journey" 
      },
      { 
        iconName: "send", 
        title: "Save Money", 
        description: "Optimize your investments and borrowing with competitive rates" 
      }
    ];

    return (
      <View style={styles.tilesContainer}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitTile}>
            <Icon name={benefit.iconName} color="#2563eb" size={48} style={styles.tileIcon} />
            <Text style={styles.benefitTitle}>{benefit.title}</Text>
            <Text style={styles.benefitDescription}>{benefit.description}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Lend and Earn Section Component
  const LendAndEarnSection = () => {
    return (
      <LinearGradient
        colors={['#dbeafe', '#bfdbfe']}
        style={styles.lendEarnContainer}
      >
        <View style={styles.lendEarnContent}>
          <Text style={styles.sectionTitle}>Lend and Earn</Text>
          
          <View style={styles.lendEarnCards}>
            <View style={styles.lendEarnCard}>
              <Icon name="trending-up" color="#16a34a" size={48} style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Attractive Returns</Text>
              <Text style={styles.rateText}>
                Lend and Earn Upto 1.75% Monthly ROI and 24% P.A.
              </Text>
            </View>
            
            <View style={styles.lendEarnCard}>
              <Icon name="dollar-sign" color="#2563eb" size={48} style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Easy Investment</Text>
              <Text style={styles.rateText}>
                Start your investment journey with just ₹500
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleNavigation('lendAndEarn')}
          >
            <Icon name="trending-up" color="#ffffff" size={20} />
            <Text style={styles.actionButtonText}>Register for Lend and Earn</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* RBI License Modal */}
      <Modal
        visible={showRBILicense}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleRBILicense}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={toggleRBILicense}
            >
              <Icon name="x" size={20} color="#4b5563" />
            </TouchableOpacity>
            <Image 
              source={RBILicense} 
              style={styles.rbiLicenseImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>OxyLoans - RBI Approved P2P NBFC</Text>
        <Text style={styles.heroSubtitle}>
          Revolutionizing financial connections through transparent, efficient peer-to-peer lending.
        </Text>
        
        {/* RBI License Button */}
        <TouchableOpacity 
          style={styles.viewRbiButton}
          onPress={toggleRBILicense}
        >
          <Icon name="eye" color="#ffffff" size={20} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View RBI License Certificate</Text>
        </TouchableOpacity>
      </View>

      {/* Impact Tiles Section */}
      <ImpactTiles />

      {/* New Lend and Earn Section */}
      <LendAndEarnSection />

      {/* Testimonials Carousel */}
      <View style={styles.testimonialsContainer}>
        <Text style={styles.sectionTitle}>Lender Experiences</Text>
        <View style={styles.testimonialCard}>
          <Image 
            source={testimonials[currentTestimonialIndex].image} 
            style={styles.testimonialImage}
            resizeMode="cover"
          />
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <MaterialIcons key={i} name="star" color="#facc15" size={24} />
            ))}
          </View>
          <Text style={styles.testimonialQuote}>
            "{testimonials[currentTestimonialIndex].quote}"
          </Text>
          <Text style={styles.testimonialAuthor}>
            {testimonials[currentTestimonialIndex].author}
          </Text>
        </View>
      </View>
        
      {/* Benefits Tiles Section */}
      <BenefitTiles />

      {/* App Download Section */}
      <LinearGradient
        colors={['#2563eb', '#0d9488']}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.downloadSection}
      >
        <Text style={styles.downloadTitle}>Download OxyLoans App</Text>
        <Text style={styles.downloadSubtitle}>
          Start investing or borrowing right from your mobile
        </Text>
        <View style={styles.storeButtons}>
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.oxyloans.lender')}
            style={styles.storeButton}
          >
            <Image 
              source={googlePlayBadge} 
              style={styles.storeBadge}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://apps.apple.com/in/app/oxyloans-lender/id6444208708')}
            style={styles.storeButton}
          >
            <Image 
              source={appStoreBadge} 
              style={styles.storeBadge}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1
  },
  rbiLicenseImage: {
    width: '100%',
    height: 500,
  },
  heroSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center'
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#2563eb',
    width: width - 48, // Full width minus padding
  },
  heroSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4b5563',
    lineHeight: 28,
    marginBottom: 24,
    width: width - 48, // Full width minus padding
  },
  viewRbiButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonIcon: {
    marginRight: 8
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    width: 'auto', // Auto width for button text
  },
  tilesContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    marginBottom: 40
  },
  impactTile: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  tileIcon: {
    marginBottom: 16
  },
  tileValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    width: '100%', // Full width
    textAlign: 'center',
  },
  tileLabel: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 4,
    width: '100%', // Full width
    textAlign: 'center',
  },
  tileDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    width: '100%', // Full width
  },
  benefitTile: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  benefitTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    width: '100%', // Full width
    textAlign: 'center',
  },
  benefitDescription: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    width: '100%', // Full width
  },
  lendEarnContainer: {
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 40
  },
  lendEarnContent: {
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
    width: '100%', // Full width
  },
  lendEarnCards: {
    width: '100%'
  },
  lendEarnCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardIcon: {
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
    width: '100%', // Full width
  },
  rateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    width: '100%', // Full width
  },
  actionButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    justifyContent: 'center'
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    width: 'auto', // Auto width for button text
  },
  testimonialsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialCard: {
    alignItems: 'center',
    width: width * 0.9, 
  },
  testimonialImage: {
    width: width * 0.9,
    height: 250,
    borderRadius: 20,
    marginBottom: 16
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  testimonialQuote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 16,
    width: '100%', // Full width for quote
  },
  testimonialAuthor: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    width: 'auto', // Auto width for author name
  },
  downloadSection: {
    borderRadius: 12,
    padding: 32,
    marginHorizontal: 16,
    marginBottom: 40,
    alignItems: 'center'
  },
  downloadTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
    width: '100%', // Full width
  },
  downloadSubtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
    marginBottom: 24,
    textAlign: 'center',
    width: '100%', // Full width
  },
  storeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  storeButton: {
    margin: 8
  },
  storeBadge: {
    height: 48,
    width: 160
  }
});

export default OxyLoans;