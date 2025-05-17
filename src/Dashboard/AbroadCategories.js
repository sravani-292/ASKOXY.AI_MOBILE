import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Linking,
    Image,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  const { height, width } = Dimensions.get("window");
  import axios from "axios";
  import { MaterialIcons } from '@expo/vector-icons';
  import BASE_URL, { userStage } from "../../Config";
  import { useSelector } from "react-redux";
  import { WebView } from 'react-native-webview';
  const AbroadCategories = ({ navigation ,route}) => {

    const [loadingStates, setLoadingStates] = useState({});
    const DEFAULT_IMAGE = 'https://www.askoxy.ai/static/media/askoxylogostatic.3e03c861742645ba9a15.png';
    console.log("abroad categories",route.params);
    
    const userData = useSelector((state) => state.counter);
    const [AlreadyInterested, setAlreadyInterested] = useState(false);
    const [profileData, setProfileData] = useState();
    const [data, setData] = useState([]);
    console.log("userData", userData);
    let number;
  
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (userData == null) {
        Alert.alert("Alert", "Please login to continue", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
          { text: "Cancel" },
        ]);
        return;
      } else {
        getCall();
        getProfile();
        getAllCampaign();
      }
    }, []);
  
    const getProfile = async () => {
      axios({
        method: "get",
        url:
          BASE_URL +
          `user-service/customerProfileDetails?customerId=${userData.userId}`,
      })
        .then((response) => {
          console.log("profile data", response.data);
          setProfileData(response.data);
        })
        .catch((error) => {
          console.log(error.response);
        });
    };
  
    function getCall() {
      let data = {
        userId: userData.userId,
      };
      axios
        .post(
          BASE_URL + `marketing-service/campgin/allOfferesDetailsForAUser`,
          data
        )
        .then((response) => {
          // console.log(response.data)
          const hasFreeAI = response.data.some(
            (item) => item.askOxyOfers === "STUDYABROAD"
          );
  
          if (hasFreeAI) {
            // Alert.alert("Yes", "askOxyOfers contains FREEAI");
            setAlreadyInterested(true);
          } else {
            // Alert.alert("No","askOxyOfers does not contain FREEAI");
            setAlreadyInterested(false);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  
    function interestedfunc() {
      console.log("I am interested in abroad");
    
      if (userData == null) {
        Alert.alert("Alert", "Please login to continue", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
          { text: "Cancel" },
        ]);
        return;
      } 
    
      console.log("varalakshmi");
    
      let number = null; 
    
      if (profileData?.whatsappNumber && profileData?.mobileNumber) {
        console.log("sravani");
        number = profileData.whatsappNumber;
        console.log("whatsapp number", number);
      } else if (profileData?.whatsappNumber && profileData?.whatsappNumber !== "") {
        number = profileData.whatsappNumber;
      } else if (profileData?.mobileNumber && profileData?.mobileNumber !== "") {
        number = profileData.mobileNumber;
      }
    
      if (!number) {
      console.log ("Error", "No valid phone number found.");
        return;
      }
    
      let data = {
        askOxyOfers: "STUDYABROAD",
        userId: userData.userId,
        mobileNumber: number,
        projectType: "ASKOXY",
      };
    
      console.log("Sending Data:", data);
    
      setLoading(true);
    
      axios
        .post(BASE_URL + "marketing-service/campgin/askOxyOfferes", data)
        .then((response) => {
          console.log("STUDYABROAD Response:", response.data);
          getCall();
          setLoading(false);
          Alert.alert("Success", "Your interest has been submitted successfully!");
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
          if (error.response?.status === 400) {
            Alert.alert("Failed", "You have already participated. Thank you!");
          } else {
            Alert.alert("Failed", error.response?.data || "Something went wrong!");
          }
        });
    }
    

    function getAllCampaign() {
        setLoading(true);
        axios
          .get(`${BASE_URL}marketing-service/campgin/getAllCampaignDetails`)
          .then((response) => {
            setLoading(false);
      
            if (!Array.isArray(response.data)) {
              console.error("Invalid API response format");
              setData(services);
              return;
            }
      
            const allCampaigns = response.data;
      
            // for getting Study Abroad campaigns
            const studyAbroadCampaigns = allCampaigns.filter(
              (item) =>
                item.campaignType.includes("STUDY ABROAD GLOBAL EDUCATION") &&
                item.campaignStatus === true
            );
      
            //  Filter all active campaigns
            const activeCampaigns = allCampaigns.filter(
              (item) => item.campaignStatus === true
            );
      
            
            const filteredCampaigns = activeCampaigns.filter(
              (item) => !item.campaignType.includes("STUDY ABROAD GLOBAL EDUCATION")
            );
      
            // 🧠 Merge updatedServices with remaining campaigns
            const mergedData = [
              // ...updatedServices,
              ...studyAbroadCampaigns,
              
            ];
      
            console.log("Merged Data:", mergedData);
            setData(mergedData);
          })
          .catch((error) => {
            console.error("Error fetching campaigns", error);
            setData(services);
            setLoading(false);
          });
      }
  
    function exploreGptfun() {
      if (userData == null) {
        Alert.alert("Alert", "Please login to continue", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
          { text: "Cancel" },
        ]);
        return;
      } else {
        navigation.navigate("Explore Gpt");
      }
    }
  
    return (
      <View style={styles.container} >
       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
        <Text style={styles.topHeading}>
          🌍 World's #1 AI & Blockchain-Based Platform for University Admissions
          🌟
        </Text>
  
        <View>
          
          <Text style={styles.missionHeading}>🎯 Our Mission & Vision</Text>
  
        
          <WebView
          source={{ uri: 'https://youtube.com/embed/LLRFyQ5y3HY?autoplay=1&mute=1' }}
          style={{ width: '100%', height: 300 }}
          allowsFullscreenVideo
        />
          <View style={styles.card}>
          <Text style={styles.heading}>🎓 Fulfill Your Dreams</Text>
  
          <Text style={styles.bullet}>🎯 Upto 5% Cashback on University Fees</Text>
          <Text style={styles.bullet}>🎯 100% Scholarship for Selected Students</Text>
          <Text style={styles.bullet}>
            🎯 Get Offer Letter in 10 Minutes - Share preferences on{' '}
            <Text style={styles.bold}>ASKOXY.AI</Text> & get a sample offer letter.
          </Text>
          {AlreadyInterested == false ? (
            <>
              {loading == false ? (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#6f2dbd" }]} 
                  onPress={() => interestedfunc()}
                >
                  <Text style={[styles.buttonText, { color: "white" }]}>
                    I'm Interested
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={[styles.button, { backgroundColor: "#6f2dbd" }]} 
                >
                  <Text style={styles.buttonText}>
                    <ActivityIndicator size="small" color="#fff" />
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View
              style={[styles.button, { backgroundColor: "#9367c7" }]} 
              onPress={() => interestedfunc()}
            >
              <Text style={[styles.buttonText, { color: "white" }]}>
                Already Participated
              </Text>
            </View>
          )}
        </View>
  
        
        <Text style={styles.textBold}>
          Study Abroad: <Text style={styles.text}>Get a 10-minute sample offer letter and enjoy up to 5% fee cashback!</Text>
        </Text>
  
        
        <Text style={styles.paragraph}>
          Welcome! <Text style={styles.bold}>ASKOXY.AI</Text> fuels your study abroad journey with data-driven insights. 
          Answer questions on country, university, course, budget, UG/PG & academics to get personalized recommendations, 
          a ROI scorecard, a 10-min sample offer letter & up to 5% fee cashback.
        </Text>
  
     
      
          <Text
            style={{
              marginBottom: 10,
              fontSize: 16,
              textAlign: "center",
              fontWeight: "bold",
              width: width * 0.9,
              alignSelf: "center",
            }}
          >
            To enable 1 million students to fulfill their abroad dream by 2030.
            Our vision is to connect all stakeholders seamlessly with high trust.
          </Text>
          <View>
        {/* <Text style={styles.title}>Students Studying Abroad</Text>
        <Text style={styles.description}>
          Join thousands of students making their study abroad dreams a reality. Discover top universities with{' '}
          <Text style={styles.highlight}>StudentX.world, the World's 1st AI & Blockchain-powered platform</Text> for university admissions.
          Access <Text style={styles.highlight}>bAnkD's innovative education loan marketplace</Text>, connecting students with leading Banks and NBFCs to finance their global education journey.
        </Text> */}
  
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#008CBA' }]} onPress={()=>navigation.navigate("Countries Dispaly")}>
            <Text style={styles.buttonText}>StudentX.world</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#00C853' }]}>
            <Text style={styles.buttonText}>BankD</Text>
          </TouchableOpacity>
        </View> */}
      </View>
          <View style={styles.featureBox}>
            <Text style={styles.featureText}>
              🏠{" "}
              <Text style={{ fontWeight: "bold", color: "#3d2a71" }}>
                3000+ Students {"\n"}
              </Text>
              Availed this platform and are currently studying in universities
              abroad.
            </Text>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Countries")}>
                <Text style={styles.buttonText}>StudentX.World</Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.featureBox}>
            <Text style={styles.featureText}>
              🌍{" "}
              <Text style={{ fontWeight: "bold", color: "#3d2a71" }}>
                150+ Recruiters {"\n"}
              </Text>
              Support in mapping students to universities with 85% accuracy.
            </Text>
          </View>
  
          <View style={styles.featureBox}>
            <Text style={styles.featureText}>
              ✈️{" "}
              <Text style={{ fontWeight: "bold", color: "#3d2a71" }}>
                100+ Universities {"\n"}
              </Text>
              Spread across the UK, Europe, US, Canada, Australia, and New
              Zealand.
            </Text>
            <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Offer Letters")}>
            <Text style={styles.buttonText}>📄 View Offer Samples</Text>
          </TouchableOpacity>
  
          {/* <TouchableOpacity style={styles.button} onPress={()=>exploreGptfun()}> */}
          <TouchableOpacity style={styles.button} onPress={()=>Linking.openURL('https://chatgpt.com/g/g-67bb1a92a0488191b4c44678cc6cd958-study-abroad-10-min-sample-offer-5-fee-cashback')}>
            <Text style={styles.buttonText}>🌍 Study Abroad GPT</Text>
          </TouchableOpacity>
        </View>
  
          </View>
  
          <View style={styles.featureBox}>
            <Text style={styles.featureText}>
              📔{" "}
              <Text style={{ fontWeight: "bold", color: "#3d2a71" }}>
                Free {"\n"}
              </Text>
              Lifetime Access to students.
            </Text>
          </View>
        </View>
  
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          
         
        </View>
        {data.map((campaign, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.heading}>{campaign.campaignType}</Text>
            {/* <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate("AllCampaigns", { type: campaign.campaignType })}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#6f2dbd" />
            </TouchableOpacity> */}
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {campaign.imageUrls && campaign.imageUrls.length > 0 ? (
              campaign.imageUrls.map((img, idx) => {
                const imageUri = typeof img === "string" ? img : img?.imageUrl;
                const imageSource = imageUri ? { uri: imageUri } : require("../../assets/Images/E.jpeg");
                
                return (
                  <TouchableOpacity
                    key={idx}
                    style={styles.imageTouchable}
                    onPress={() => navigation.navigate("Campaign", campaign)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={imageSource}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    {/* <View style={styles.imageOverlay}>
                      <Text style={styles.campaignTitle} numberOfLines={2}>
                        {campaign.title || `Campaign ${idx + 1}`}
                      </Text>
                    </View> */}
                  </TouchableOpacity>
                );
              })
            ) : (
              <TouchableOpacity
                style={styles.imageTouchable}
                onPress={() => navigation.navigate("Campaign", campaign)}
                activeOpacity={0.8}
              >
                <Image
                  source={require("../../assets/Images/E.jpeg")}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.campaignTitle} numberOfLines={2}>
                    {campaign.title || "Campaign"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
          
          {/* {campaign.alreadyInterested ? (
            <View style={styles.interestedBadge}>
              <MaterialIcons name="check-circle" size={16} color="#fff" />
              <Text style={styles.interestedText}>Interested</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.interestButton}
              onPress={() => handleInterested(campaign.id)}
              disabled={loadingStates[campaign.id]}
            >
              {loadingStates[campaign.id] ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="star" size={16} color="#fff" />
                  <Text style={styles.interestButtonText}>I'm Interested</Text>
                </>
              )}
            </TouchableOpacity>
          )} */}
        </View>
      ))}
 </ScrollView>
      </View>
    );
  };
  
  export default AbroadCategories;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F9F9F9",
      paddingHorizontal: 15,
    },
    scrollContent: {
      paddingHorizontal: 15,
      paddingBottom: 50, 
    },
    topHeading: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#4B0082",
      textAlign: "center",
      marginVertical: 20,
      borderBottomWidth: 2,
      borderColor: "#4B0082",
      paddingBottom: 10,
    },
    missionHeading: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#800080",
      textAlign: "center",
      marginBottom: 25,
    },
    featureBox: {
      backgroundColor: "#FFFFFF",
      borderRadius: 15,
      padding: 20,
      marginBottom: 15,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 16,
    },
    featureText: {
      fontSize: 15,
      color: "#333333",
      lineHeight: 22,
    },
    processHeading: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#008080",
      textAlign: "center",
      marginVertical: 30,
      textDecorationLine: "underline",
    },
    processBox: {
      backgroundColor: "#E6F7F7",
      borderRadius: 10,
      padding: 20,
      elevation: 3,
      marginBottom: 30,
    },
    processText: {
      fontSize: 16,
      color: "#333333",
      marginBottom: 15,
      lineHeight: 24,
    },
   
    // card: {
    //   backgroundColor: '#ffffff',
    //   borderRadius: 10,
    //   padding: 20,
    //   marginBottom: 20,
    //   width: '100%',
    //   elevation: 3,
    //   height:height
    // },
    heading: {
      fontSize: 20,
      fontWeight: '700',
      color: '#8B3DFF',
      marginBottom: 10,
    },
    bullet: {
      fontSize: 14,
      marginBottom: 8,
      color: '#444',
    },
    textBold: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 10,
      color: '#000',
    },
    text: {
      fontWeight: '400',
      color: '#333',
    },
    paragraph: {
      fontSize: 15,
      color: '#333',
      marginBottom: 20,
    },
    bold: {
      fontWeight: '600',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      width: '100%',
      flexWrap: 'wrap',
    },
    button: {
      backgroundColor: '#8B3DFF',
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 8,
      marginVertical: 5,
      flex: 1,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: '600',
    },
    video: {
      width: '100%',
      height: 300,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign:"center"
    },
    description: {
      textAlign: 'center',
      fontSize: 15,
      color: '#333',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    highlight: {
      color: 'purple',
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 10,
    },
   
  image: {
    width: width / 2,
    height: height / 3, 
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    alignSelf: 'center', 
  },
  
  container: {
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6f2dbd',
    marginRight: 4,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  imageTouchable: {
    // marginRight: 12,
    width: width *0.6 , 
    height: height/3.5,
    borderRadius: 50,
   overflow:"visible",
    position: 'relative',
    alignSelf:"center",
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
  },
  campaignTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  interestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6f2dbd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  interestButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  interestedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  interestedText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
    
  });