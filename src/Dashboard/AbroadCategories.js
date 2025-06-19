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
import { MaterialIcons } from "@expo/vector-icons";
import BASE_URL, { userStage } from "../../Config";
import { useSelector } from "react-redux";
import { WebView } from "react-native-webview";
import {
  getAllCampaignDetails,
  getUserFeedback,
  submitUserIntrest,
  handleGetProfileData,
} from "../ApiService";
import UserTypeModal from "./UserTypeModal";
const AbroadCategories = ({ navigation, route }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const DEFAULT_IMAGE =
    "https://www.askoxy.ai/static/media/askoxylogostatic.3e03c861742645ba9a15.png";
  console.log("abroad categories", route.params);

  const userData = useSelector((state) => state.counter);
   const token = userData?.accessToken;
  const customerId = userData?.userId;
  const [AlreadyInterested, setAlreadyInterested] = useState(false);
  const [profileData, setProfileData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserTypes, setSelectedUserTypes] = useState("");
  const [data, setData] = useState([]);
  // console.log("userData", userData);
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
    console.log("customerId",customerId);
     try {
      const response = await handleGetProfileData(customerId);
      // console.log("Profile Response:", response);

      if (response && response.status === 200) {
        setProfileData(response.data); // assuming setProfileData is defined
      } else {
        console.warn("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const getCall = async () => {
    try {
      const data = {
        userId: userData.userId,
      };

      const response = await getUserFeedback(data);

      const hasFreeAI = response?.data?.some(
        (item) => item.askOxyOfers === "STUDYABROAD"
      );

      if (hasFreeAI) {
        setAlreadyInterested(true);
      } else {
        setAlreadyInterested(false);
      }
    } catch (error) {
      console.log(
        "Error fetching user feedback:",
        error?.response || error.message
      );
    }
  };



   const handleInterestedClick = () => {
    if (!userData) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    }
    setModalVisible(true);
  };

  // Handle modal submission
  const handleModalSubmit = async (selectedTypesString) => {
    setSelectedUserTypes(selectedTypesString);
    setModalVisible(false);
    
    // Call the API with selected types
    await interestedfunc(selectedTypesString);
  };

  // Handle modal cancellation
  const handleModalCancel = () => {
    setModalVisible(false);
  };


 const interestedfunc = async (selectedTypes = "") => {
    console.log("I am interested in abroad with types:", selectedTypes);
     
    if (!userData) {
      Alert.alert("Alert", "Please login to continue", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
        { text: "Cancel" },
      ]);
      return;
    }

    let number = null;
   console.log("profiledata",profileData);

    if (profileData?.whatsappNumber) {
      number = profileData.whatsappNumber;
    } else if (profileData?.mobileNumber) {
      number = profileData.mobileNumber;
    }

    if (!number) {
      Alert.alert("Error", "No valid phone number found. Please update your profile.");
      return;
    }

    const data = {
      askOxyOfers: "STUDYABROAD",
      userId: userData.userId,
      mobileNumber: number,
      projectType: "ASKOXY",
      userRole: selectedTypes.toLocaleUpperCase(), 
    };

    console.log("Sending Data:", data);
    setLoading(true);

    try {
      const response = await submitUserIntrest(data);
      console.log("STUDYABROAD Response:", response.data);
      await getCall();
      Alert.alert(
        "Success", 
        `Your interest as ${selectedTypes} has been submitted successfully!`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 400) {
        Alert.alert("Already Registered", "You have already participated. Thank you!");
      } else {
        Alert.alert(
          "Failed", 
          error.response?.data?.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

 
  const getAllCampaign = async () => {
    setLoading(true);
    try {
      const response = await getAllCampaignDetails();

      if (!Array.isArray(response.data)) {
        console.error("Invalid API response format");
        setData(services);
        return;
      }

      const allCampaigns = response.data;

      //  Filter campaigns for study abroad
      const studyAbroadCampaigns = allCampaigns.filter(
        (item) =>
          item.campaignType.includes("STUDY ABROAD GLOBAL EDUCATION") &&
          item.campaignStatus === true
      );

      //  Filter all active campaigns
      const activeCampaigns = allCampaigns.filter(
        (item) => item.campaignStatus === true
      );

      //  Exclude study abroad campaigns from active
      const filteredCampaigns = activeCampaigns.filter(
        (item) => !item.campaignType.includes("STUDY ABROAD GLOBAL EDUCATION")
      );

      //  Combine only the campaigns you want to show (currently only studyAbroadCampaigns)
      const mergedData = [
        ...studyAbroadCampaigns,
        // ...filteredCampaigns, // Uncomment if you want to include other active campaigns
      ];

      console.log("Merged Data:", mergedData);
      setData(mergedData);
    } catch (error) {
      console.error("Error fetching campaigns", error);
      setData(services); // fallback
    } finally {
      setLoading(false);
    }
  };

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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <Text style={styles.topHeading}>
          🌍 World's #1 AI & Blockchain-Based Platform for University Admissions
          🌟
        </Text>

        <View>
          <Text style={styles.missionHeading}>🎯 Our Mission & Vision</Text>

          <WebView
            source={{
              uri: "https://youtube.com/embed/LLRFyQ5y3HY?autoplay=1&mute=1",
            }}
            style={{ width: "100%", height: 300 }}
            allowsFullscreenVideo
          />
          <View style={styles.card}>
            <Text style={styles.heading}>🎓 Fulfill Your Dreams</Text>

            <Text style={styles.bullet}>
              🎯 Upto 5% Cashback on University Fees
            </Text>
            <Text style={styles.bullet}>
              🎯 100% Scholarship for Selected Students
            </Text>
            <Text style={styles.bullet}>
              🎯 Get Offer Letter in 10 Minutes - Share preferences on{" "}
              <Text style={styles.bold}>ASKOXY.AI</Text> & get a sample offer
              letter.
            </Text>
            {AlreadyInterested == false ? (
              <>
                {loading == false ? (
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#6f2dbd" }]}
                    onPress={() => handleInterestedClick ()}
                  >
                    <Text style={[styles.buttonText, { color: "white" }]}>
                      I'm Interested
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.button, { backgroundColor: "#6f2dbd" }]}>
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


             {selectedUserTypes !== "" && (
              <View style={styles.selectedTypesContainer}>
                <Text style={styles.selectedTypesLabel}>Selected as:</Text>
                <Text style={styles.selectedTypesText}>{selectedUserTypes}</Text>
              </View>
            )}
          </View>

          <Text style={styles.textBold}>
            Study Abroad:{" "}
            <Text style={styles.text}>
              Get a 10-minute sample offer letter and enjoy up to 5% fee
              cashback!
            </Text>
          </Text>

          <Text style={styles.paragraph}>
            Welcome! <Text style={styles.bold}>ASKOXY.AI</Text> fuels your study
            abroad journey with data-driven insights. Answer questions on
            country, university, course, budget, UG/PG & academics to get
            personalized recommendations, a ROI scorecard, a 10-min sample offer
            letter & up to 5% fee cashback.
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
            Our vision is to connect all stakeholders seamlessly with high
            trust.
          </Text>
          <View></View>
          <View style={styles.featureBox}>
            <Text style={styles.featureText}>
              🏠{" "}
              <Text style={{ fontWeight: "bold", color: "#3d2a71" }}>
                3000+ Students {"\n"}
              </Text>
              Availed this platform and are currently studying in universities
              abroad.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Countries")}
            >
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Offer Letters")}
              >
                <Text style={styles.buttonText}>📄 View Offer Samples</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.button} onPress={()=>exploreGptfun()}> */}
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  Linking.openURL(
                    "https://chatgpt.com/g/g-67bb1a92a0488191b4c44678cc6cd958-study-abroad-10-min-sample-offer-5-fee-cashback"
                  )
                }
              >
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

        <View
          style={{ flexDirection: "row", justifyContent: "space-around" }}
        ></View>
        {data.map((campaign, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.heading}>{campaign.campaignType}</Text>
             
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {campaign.imageUrls && campaign.imageUrls.length > 0 ? (
                campaign.imageUrls.map((img, idx) => {
                  const imageUri =
                    typeof img === "string" ? img : img?.imageUrl;
                  const imageSource = imageUri
                    ? { uri: imageUri }
                    : require("../../assets/Images/E.jpeg");

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
          </View>
        ))}
      </ScrollView>
      <UserTypeModal
        visible={modalVisible}
        onSubmit={handleModalSubmit}
        onCancel={handleModalCancel}
      />
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
    fontWeight: "700",
    color: "#8B3DFF",
    marginBottom: 10,
  },
  bullet: {
    fontSize: 14,
    marginBottom: 8,
    color: "#444",
  },
  textBold: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#000",
  },
  text: {
    fontWeight: "400",
    color: "#333",
  },
  paragraph: {
    fontSize: 15,
    color: "#333",
    marginBottom: 20,
  },
  bold: {
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#8B3DFF",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginVertical: 5,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  video: {
    width: "100%",
    height: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    fontSize: 15,
    color: "#333",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  highlight: {
    color: "purple",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  image: {
    width: width / 2,
    height: height / 3,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    alignSelf: "center",
  },

  container: {
    padding: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#6f2dbd",
    marginRight: 4,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  imageTouchable: {
    // marginRight: 12,
    width: width * 0.6,
    height: height / 3.5,
    borderRadius: 50,
    overflow: "visible",
    position: "relative",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
  },
  campaignTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  interestButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6f2dbd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  interestButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  interestedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  interestedText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  selectedTypesContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c3e6c3',
  },
  selectedTypesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d5a2d',
    marginBottom: 4,
  },
  selectedTypesText: {
    fontSize: 14,
    color: '#2d5a2d',
    fontWeight: '500',
  },
});
