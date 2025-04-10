import React, { useState,useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
const { width, height } = Dimensions.get("window");
import BASE_URL,{userStage} from "../../Config";
import { MaterialIcons } from '@expo/vector-icons';


export default function WeAreHiring({navigation}) {
    const userData = useSelector((state) => state.counter);
    // console.log({ userData });
    const [loading, setLoading] = useState(false);
    const[AlreadyInterested,setAlreadyInterested]=useState(false)
    const[profileData,setProfileData]=useState()
// const[number,setNumber]=useState()
    let number;

  const requirements = [
    { icon: 'laptop', text: 'Bring your own laptop to take on this exciting role.' },
    { icon: 'favorite', text: 'Passion for content creation and customer engagement.' }
  ];

  const responsibilities = [
    { icon: 'edit', text: 'Content Creation: Write engaging blogs and posts.' },
    { icon: 'videocam', text: 'Social Media Engagement: Create and share videos.' },
    { icon: 'people', text: 'Customer Interaction: Visit customers to showcase our platform.' },
    { icon: 'public', text: 'Community Outreach: Engage with local communities.' },
    { icon: 'call', text: 'Follow-Up Communication: Call customers and guide them.' }
  ];

  const benefits = [
    { icon: 'flight', text: 'Be a part of the Study Abroad Digital Journey.' },
    { icon: 'code', text: 'Work on platforms powered by Askoxy.ai.' },
    { icon: 'stars', text: 'Gain experience in content creation, social media, and customer interaction.' }
  ];

  const ListItem = ({ icon, text }) => (
    <View style={styles.listItem}>
      <MaterialIcons name={icon} size={24} color="#3d2a71" />
      <Text style={styles.listItemText}>{text}</Text>
    </View>
  );


  useEffect(()=>{
 if(userData==null){
      Alert.alert("Alert","Please login to continue",[
        {text:"OK",onPress:()=>navigation.navigate("Login")},
        {text:"Cancel"}
      ])
      return;
    }else{
      getCall()
      getProfile()
    }  },[])
  
    const getProfile = async () => {
      axios({
       method:"get",
       url:BASE_URL+ `user-service/customerProfileDetails?customerId=${userData.userId}`
      })
      .then((response)=>{
       console.log(response.data)
       setProfileData(response.data)
      })
      .catch((error)=>{
       console.log(error.response.data)
      })
     };


    function getCall(){
      let data={
        userId: userData.userId
      }
      axios.post(BASE_URL+`marketing-service/campgin/allOfferesDetailsForAUser`,data)
      .then((response)=>{
        console.log("We are hiring",response)
        const hasFreeAI = response.data.some(item => item.askOxyOfers === "WEAREHIRING");
       
    if (hasFreeAI) {
      // Alert.alert("Yes", "askOxyOfers contains FREEAI");
      setAlreadyInterested(true)
    } else {
      // Alert.alert("No","askOxyOfers does not contain FREEAI");
      setAlreadyInterested(false)
    }
      })
      .catch((error)=>{
        console.log(error.response)
      })
    }
  function interestedfunc() {
    if (userData == null) {
         Alert.alert("Alert", "Please login to continue", [
           { text: "OK", onPress: () => navigation.navigate("Login") },
           { text: "Cancel" },
         ]);
         return;
       } 
     
      //  console.log("varalakshmi");
     
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
        askOxyOfers: "WEAREHIRING",
        userId: userData.userId,
        mobileNumber: number,
        projectType: "ASKOXY",
      };
      console.log(data);
       setLoading(true)
      axios({
        method: "post",
        url:  BASE_URL + "marketing-service/campgin/askOxyOfferes",
        data: data,
      })
        .then((response) => {
          console.log(response.data);
          setLoading(false);
          Alert.alert(
            "Success",
            "Your interest has been submitted successfully!"
          );
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          if (error.response.status == 400) {
            Alert.alert("Failed", "You have already participated. Thank you!")
          }
          else {
            Alert.alert("Failed", error.response.data);
          }
    
        })
    
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="always">
        <View style={styles.header}>
          <Text style={styles.title}>Digital Ambassadors</Text>
          <Text style={styles.subtitle}>
            Join Our Dynamic Team and Embark on a Digital Journey!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Role Overview</Text>
          <Text style={styles.overview}>
            As a Digital Ambassador, you will play a pivotal role in driving the
            digital transformation of our platforms, including our Study Abroad
            Platform and others powered by Askoxy.ai.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Do</Text>
          {responsibilities.map((item, index) => (
            <ListItem key={index} icon={item.icon} text={item.text} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {requirements.map((item, index) => (
            <ListItem key={index} icon={item.icon} text={item.text} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Join Us?</Text>
          {benefits.map((item, index) => (
            <ListItem key={index} icon={item.icon} text={item.text} />
          ))}
        </View>


{AlreadyInterested==false?
<>
{loading==false?
        <TouchableOpacity style={styles.applyButton} onPress={()=>interestedfunc()}>
          <Text style={styles.applyButtonText}>Join Us Now</Text>
        </TouchableOpacity>
        :
        <View style={styles.applyButton}>
            <ActivityIndicator size="small" color="#fff" />
        </View>
        }
        </>
        :
        <View style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Already Participated</Text>
      </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    // backgroundColor: '#2E7D32',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3d2a71',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#3d2a71',
    textAlign: 'center',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3d2a71',
    marginBottom: 15,
  },
  overview: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  listItemText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 10,
    flex: 1,
  },
  applyButton: {
    backgroundColor: '#3d2a71',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});