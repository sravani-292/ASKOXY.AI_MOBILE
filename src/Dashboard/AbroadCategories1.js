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
} from "react-native";
import React, { useState, useEffect } from "react";
const { height, width } = Dimensions.get("window");
import axios from "axios";
import BASE_URL, { userStage } from "../../Config";
import { useSelector } from "react-redux";
import { WebView } from 'react-native-webview';
const AbroadCategories = ({ navigation }) => {
  const userData = useSelector((state) => state.counter);
  const [AlreadyInterested, setAlreadyInterested] = useState(false);
  const [profileData, setProfileData] = useState();
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
        {/* Features */}
        <View style={styles.featureBox}>
          <Text style={styles.featureText}>
            🏠{" "}
            <Text style={{ fontWeight: "bold", color: "#3d2a71" }}>
              3000+ Students {"\n"}
            </Text>
            Availed this platform and are currently studying in universities
            abroad.
          </Text>
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
      {/* <View style={styles.featureBox}>
        <Text style={styles.featureText}>
          🎓 **Free Lifetime Access** {"\n"}
          For students to access our platform.
        </Text>
      </View>

      <Text style={styles.processHeading}>
        📋 End-to-End Process of Studying Abroad
      </Text>

      <View style={styles.processBox}>
        <Text style={styles.processText}>
          1️⃣ **Research & Choose Your Destination** 🌍{"\n"}
          Begin by identifying countries and universities that align with your
          study goals. Research the culture, courses, and living expenses to
          make an informed decision.
        </Text>

        <Text style={styles.processText}>
          2️⃣ **Prepare for Standardized Tests** 📝{"\n"}
          Prepare for tests like GRE, IELTS, TOEFL. Start early to improve your
          skills and practice regularly.
        </Text>

        <Text style={styles.processText}>
          3️⃣ **Shortlist Universities** 📚{"\n"}
          Research universities that offer programs in your field. Evaluate them
          based on ranking, location, and scholarships.
        </Text>

        <Text style={styles.processText}>
          4️⃣ **Apply to Universities** 📨{"\n"}
          Submit applications to your selected universities, along with your
          transcripts, recommendation letters, and personal statement.
        </Text>

        <Text style={styles.processText}>
          5️⃣ **Apply for Scholarships** 💰{"\n"}
          Look for scholarships from universities, governments, and
          organizations to reduce financial costs.
        </Text>

        <Text style={styles.processText}>
          6️⃣ **Attend Interviews/Assessments** 🎤{"\n"}
          Be ready for interviews or assessments if required. Showcase your
          motivations and readiness for studying abroad.
        </Text>

        <Text style={styles.processText}>
          7️⃣ **Receive Admission Offers** 🎓{"\n"}
          Once accepted, evaluate your offers based on funding, program fit, and
          overall benefits.
        </Text>

        <Text style={styles.processText}>
          8️⃣ **Accept Offer & Confirm Enrollment** 📝{"\n"}
          After receiving your offers, accept the one that best fits your goals.
          Confirm your enrollment and pay any necessary deposits.
        </Text>

        <Text style={styles.processText}>
          9️⃣ **Apply for a Student Visa** 🛂{"\n"}
          Apply for your student visa by gathering the required documents like
          proof of admission and financial support.
        </Text>

        <Text style={styles.processText}>
          🔟 **Arrange Accommodation & Travel** ✈️🏠{"\n"}
          Book your flight and secure accommodation. Many universities offer
          on-campus housing.
        </Text>

        <Text style={styles.processText}>
          1️⃣1️⃣ **Pre-Departure Orientation & Packing** 📦{"\n"}
          Attend pre-departure orientations and pack everything you need,
          including important documents and essentials.
        </Text>

        <Text style={styles.processText}>
          1️⃣2️⃣ **Travel & Settle In** ✈️{"\n"}
          After receiving your visa, fly to your destination, attend your
          university’s orientation, and start your academic journey abroad!
        </Text>
      </View> */}
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
  // container: {
  //   padding: 20,
  //   backgroundColor: '#F4F2FF',
  //   flexGrow: 1,
   
  // },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    elevation: 3,
  },
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
});
