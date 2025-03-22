import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions,Alert,ScrollView,ActivityIndicator} from 'react-native';
import { Icon } from 'react-native-elements';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { useSelector } from "react-redux";
import axios from 'axios';
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';
import { Dropdown } from "react-native-element-dropdown";
import BASE_URL from '../../../Config';  

const { width, height } = Dimensions.get('window');
export default function UniversityGpt({ navigation }) {
  const userData = useSelector((state) => state.counter);

  const [visible, setVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: "0",
      type: "system",
      text: "You can assist only with scholarships for global education and for international students and hometown students based on their location. Provide information on which exams to apply for scholarships based on user requirements and location. Offer mock tests for scholarships when requested by the user. Limit responses to one answer, keeping them concise. Do not respond to non-scholarship questions and inform the user accordingly. You can also assist by writing questions for each exam. When the user says any greeting message, respond with a greeting along with the answer. If the response includes options and the user selects any of them, provide the correct answer and briefly explain that particular option. At the end, include the message: 'This is funded by BMV.Money. If you have any queries, please feel free to contact No.8125861874.'"
    }
        // { id: '1', type: 'received', text: 'Got any questions? We are happy to help.' }
  ]);
  const [recording, setRecording] = useState(null);
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState(false);
  const [fileUri, setFileUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const animation = useRef(null);
  const [showButton,setShowButton] = useState(false);
    const [selectGpt, setSelectGpt] = useState("");
  
  // const question1 = "How can international students effectively search for and apply to scholarships for studying abroad?"
  // const question2 = "What are some lesser-known global scholarships available for students from developing countries?"
  // const question3 = "What are the eligibility criteria for popular global education scholarships like the Fulbright Program, Chevening Scholarship, and Erasmus Mundus?"
  // const question4 = "How do scholarship opportunities differ between undergraduate and postgraduate international students?"
  const flatListRef = useRef(null);
  const data = [
    { label: "University information", value: "University" },
    { label: "Visa", value: "Visa" },
    { label: "Countries", value: "Countries" },
    { label: "Accomidation", value: "Accomidation" },
    {
      label: "Foreign Exchange & Pre-departure",
      value: "Foreign Exchange & Pre-departure",
    },
    { label: "Courses", value: "Courses" },
    { label: "Travel Arrangements", value: "Travel Arrangements" },
    { label: "Loans", value: "Loans" },
    {
      label: "Accrediations Recognization",
      value: "Accrediations Recognization",
    },
    { label: "Scholarship", value: "Scholarship" },
    { label: "University Reviews", value: "University Reviews" },
    { label: "Application Support", value: "Application Support" },
    { label: "Placements", value: "Placements" },
    {
      label: "English Test & Interview Preparation",
      value: "English Test & Interview Preparation",
    },
    {
      label: "Offer letter & Acceptance letter",
      value: "Offer letter & Acceptance letter",
    },
    {
      label: "Qualification & Specialization",
      value: "Qualification & Specialization",
    },
    { label: "University Agents", value: "University Agents" },
    { label: "University Reviews", value: "University Reviews" },
  ];


  const question1 =
    selectGpt == "University"
      ? "Choosing a university Abroad"
      : selectGpt == "Visa"
      ? "Types of student Visa"
      : selectGpt == "Accomidation"
      ? "Student Accomidation Types"
      : selectGpt == "Foreign Exchange & Pre-departure"
      ? "Use Currency Exchange apps"
      : selectGpt == "Courses"
      ? "In demand global courses"
      : selectGpt == "Travel Arrangements"
      ? "Essential items to pack for travel"
      : selectGpt == "Loans"
      ? "Student Loan Options foir Study Abroad"
      : selectGpt == "Scholarship"
      ? "Student Loan Options foir Study Abroad"
      : selectGpt == "Accrediations Recognization"
      ? "Importance of Global Accrediation"
      : selectGpt == "Countries"
      ? "Which country gives the easiest student visa?"
      : selectGpt == "University Reviews"
      ? "What do current and past students say about their experiences"
      : selectGpt == "Application Support"
      ? "What are the key deadlines for university applications"
      : selectGpt == "Placements"
      ? "What is the university’s placement rate for international students"
      : selectGpt == "English Test & Interview Preparation"
      ? "What are the minimum English language test score requirements for my university"
      : selectGpt == "Offer letter & Acceptance letter"
      ? "How long does it take to receive an offer letter after applying to study abroad"
      : selectGpt == "Qualification & Specialization"
      ? "What are the minimum qualification requirements to study abroad"
      : selectGpt == "University Agents"
      ? "How can a university agent help me with my study abroad application"
      : selectGpt == "University Reviews"
      ? "How do I check the reputation and ranking of a university for studying abroad"
      : null;

  const question2 =
    selectGpt == "University"
      ? "Researching Universities and Programs"
      : selectGpt == "Visa"
      ? "Visa application Process"
      : selectGpt == "Accomidation"
      ? "Cost of living"
      : selectGpt == "Foreign Exchange & Pre-departure"
      ? "Best ways to send money abroad"
      : selectGpt == "Courses"
      ? "Top universities for popular courses"
      : selectGpt == "Travel Arrangements"
      ? "Travel arrangements"
      : selectGpt == "Loans"
      ? "US student loan options"
      : selectGpt == "Scholarship"
      ? "US study abroad scholarships"
      : selectGpt == "Accrediations Recognization"
      ? "Recognized Accrediation Bodies"
      : selectGpt == "Countries"
      ? "Which country is best for studying abroad"
      : selectGpt == "University Reviews"
      ? "What are the career opportunities and post-graduation employment rates"
      : selectGpt == "Application Support"
      ? "What documents are required for the application process"
      : selectGpt == "Placements"
      ? "Does the university provide career support and job placement services"
      : selectGpt == "English Test & Interview Preparation"
      ? "What are the best strategies to prepare for the English proficiency test"
      : selectGpt == "Offer letter & Acceptance letter"
      ? "What is the difference between a conditional and unconditional offer letter for studying abroad"
      : selectGpt == "Qualification & Specialization"
      ? "Can I study abroad if my academic percentage is low"
      : selectGpt == "University Agents"
      ? "How do I verify if a study abroad university agent is legitimate"
      : selectGpt == "University Reviews"
      ? "How is student life, campus environment, and accommodation at this university for studying abroad"
      : null;

  const question3 =
    selectGpt == "University"
      ? "University Application Documents"
      : selectGpt == "Visa"
      ? "Common Visa interview questions"
      : selectGpt == "Accomidation"
      ? "Location and Campus Proximity"
      : selectGpt == "Foreign Exchange & Pre-departure"
      ? "Pre departure preparation"
      : selectGpt == "Courses"
      ? "Course Structure & Curriculum"
      : selectGpt == "Travel Arrangements"
      ? "Essential travel insurance for study abroad"
      : selectGpt == "Loans"
      ? "International student loan repayment"
      : selectGpt == "Scholarship"
      ? "Graduate Scholarships abroad"
      : selectGpt == "Accrediations Recognization"
      ? "Accrediation and Career Opportunities"
      : selectGpt == "Countries"
      ? "Which country has the highest quality education system"
      : selectGpt == "University Reviews"
      ? "Is this university internationally recognized and accredited"
      : selectGpt == "Application Support"
      ? "What are the common mistakes to avoid in my application"
      : selectGpt == "Placements"
      ? "What are the post-study work visa policies in this country"
      : selectGpt == "English Test & Interview Preparation"
      ? "How can I improve my speaking skills for the English test"
      : selectGpt == "Offer letter & Acceptance letter"
      ? "What are the next steps after receiving a study abroad offer letter"
      : selectGpt == "Qualification & Specialization"
      ? "Can I change my specialization after starting my study abroad program"
      : selectGpt == "University Agents"
      ? "What are the benefits of using a university agent to study abroad"
      : selectGpt == "University Reviews"
      ? "What are the tuition fees, scholarships, and living expenses at this university for study abroad students"
      : null;

  const question4 =
    selectGpt == "University"
      ? "Preparing for university interview"
      : selectGpt == "Visa"
      ? "Managing visa timelines"
      : selectGpt == "Accomidation"
      ? "Facilities & Amenities"
      : selectGpt == "Foreign Exchange & Pre-departure"
      ? "Packing list for study abroad"
      : selectGpt == "Courses"
      ? "Entry Requirements for courses"
      : selectGpt == "Travel Arrangements"
      ? "Best ways to book study abroad flights"
      : selectGpt == "Loans"
      ? "Insead MBA program Loan Options"
      : selectGpt == "Scholarship"
      ? "INSEAD MBA program scholarship"
      : selectGpt == "Accrediations Recognization"
      ? "I Understanding Accrediation Levels"
      : selectGpt == "Countries"
      ? "Which country offers the best post-study work opportunities"
      : selectGpt == "University Reviews"
      ? "What is the university’s global ranking and reputation"
      : selectGpt == "Application Support"
      ? "Are there any scholarships or financial aid options available"
      : selectGpt == "Placements"
      ? "What is the average salary package for graduates"
      : selectGpt == "English Test & Interview Preparation"
      ? "What common mistakes should I avoid in the writing section"
      : selectGpt == "Offer letter & Acceptance letter"
      ? "How do I accept my offer and secure my admission to study abroad"
      : selectGpt == "Qualification & Specialization"
      ? "Which are the best specializations for high-paying jobs after studying abroad"
      : selectGpt == "University Agents"
      ? "What are the fees for using a university agent to study abroad"
      : selectGpt == "University Reviews"
      ? "What are the job placement and career support services like at this university for study abroad students"
      : null;



  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };
  
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const handleTextToSpeech = (text) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  const stopTextToSpeech = () => {
    Speech.stop();
    setIsSpeaking(false);
  };


  const playAudio = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      setPlaybackInstance(sound);
      setPlaybackStatus(true);
      await sound.playAsync();
    } catch (err) {
      console.error('Failed to play audio', err);
    }
  };

  const stopAudio = async () => {
    if (playbackInstance) {
      await playbackInstance.stopAsync();
      setPlaybackInstance(null);
      setPlaybackStatus(false);
    }
  };




const sendMessage = async (inputText) => {
  if(!inputText) return false;
  setLoading(true)
  setShowButton(true)
  if (inputText.trim()) {
     // Adding a new user message
     const newMessage = {
      id: String(messages.length + 1),
      type: 'sent',
      text: inputText.trim(),
    };
    setMessages([...messages, newMessage]);

    const mapTypeToRole = (type) => {
      if (type === 'sent') return 'user';
      if (type === 'received') return 'assistant';
      return 'system';
    };
    
    const previousMessages = messages.map(msg => ({
      role: mapTypeToRole(msg.type),
      content: msg.text,
    }));
    
    // Add new user message to the conversation
    previousMessages.push({
      role: 'user',
      content: newMessage.text,
    });

    // Function to get the last assistant's response
    const getLastAssistantMessage = (messages) => {
      // Find the last message with the type 'received' (which means it's from the assistant)
      return messages.reverse().find(msg => msg.type === 'received')?.text || '';
    };
    
    // Include last assistant response
    const lastAssistantMessage = getLastAssistantMessage(messages);
    if (lastAssistantMessage) {
      previousMessages.push({
        role: 'assistant',
        content: lastAssistantMessage,
      });
    }

    const request = getFunctions(newMessage.text);
    console.log({request});

    // const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    //   model: "gpt-4o-2024-08-06",
    //   messages: previousMessages
    console.log({
      method: request.method,
      data: request.data,
      url: request.url,
      headers: {
        Authorization: `Bearer ${userData.accessToken}`,
      },
    })
   axios({
      method: request.method,
      data: request.data,
      url: request.url,
      headers: {
        Authorization: `Bearer ${userData.accessToken}`,
      },
    })
    .then((response) => {
      console.log("response",response.data)
      let counter = 1;
     
      const assistantResponse = {
        id: String(messages.length + 2),
        type: 'received',
        text: response.data.replace(/\*\*/g, ""),
      };
      setMessages((prevMessages) => [...prevMessages, assistantResponse]);
      // console.log("assistantResponse",assistantResponse)
      scrollToEnd();
    setLoading(false)
    })
    .catch((error) => {
      console.log("error",error)
      setLoading(false)
    })

  

}
}



  function getFunctions(question) {
    console.log({ question });
      if (selectGpt == "Loans") {
        let request = {
          url: BASE_URL + "student-service/user/loans",
          data: [
            {
              role: "user",
              content: question,
            },
          ],
          method: "post",
        };
        return request;
      } else if (selectGpt == "Accrediations Recognization") {
        // console.log("Labhi")

        let request = {
          url:
            BASE_URL + `student-service/user/accreditationsRecognization`,
          data: [
            {
              role: "user",
              content: question,
            },
          ],
          method: "post",
        };
        console.log("Sreeja",request)
        return request;
      } else if (selectGpt == "Travel Arrangements") {
        let request = {
          url: BASE_URL + `student-service/user/travelArrangement`,
          data: [
            {
              role: "user",
              content: question,
            },
          ],
          method: "post",
        };
        return request;
      }  else if (selectGpt == "Foreign Exchange & Pre-departure") {
        let request = {
          url: BASE_URL + `foreignExchange?InfoType=${question}`,
          method: "post",
        };
        return request;
      } 
      
      else if (selectGpt == "Scholarship") {
        let request = {
          url: BASE_URL + `student-service/user/scholarship`,
          data: [
            {
              role: "user",
              content: question,
            },
          ],
          method: "post",
        };
        return request;
      } else if (selectGpt == "Foreign Exchange& Pre-departure") {
        let request = {
          url:
            BASE_URL +
            `student-service/user/foreignExchange?InfoType=${question}&userId=${userId}`,
          method: "post",
        };
        return request;
      } else if (selectGpt == "Countries") {
        let request = {
          url: BASE_URL + `student-service/user/studentCountries?countries=${question}`,
          method: "post",
        };
        return request;
      } else if (selectGpt == "University Reviews") {
        let request = {
          url: BASE_URL + `student-service/user/reviewsTest`,
          data: [
            {
              role: "user",
              content: question,
            },
          ],
          method: "post",
        };
        return request;
      } else if (selectGpt == "Visa") {
        let request = {
          url: BASE_URL + `student-service/user/visa`,
          data: [
            {
              role: "user",
              content: question,
            },
          ],
          method: "post",
        };
        return request;
      } else if (selectGpt == "Application Support") {
        let request = {
          url: BASE_URL + `student-service/user/endToEnd`,
          data: [
            {
              role: "user",
              content: question,
            },
          ],
          method: "post",
        };
        return request;
      } else if (selectGpt == "Accomidation") {
        let request = {
          url:
            BASE_URL +
            `student-service/user/chat?InfoType=${question}`,
          method: "post",
        };
        return request;
      } else if (selectGpt == "University") {
        let request = {
          url:
            BASE_URL + `student-service/user/universityGpt?prompt=${question}`,
          method: "post",
        };
        return request;
      } else if (selectGpt == "Placements") {
        let request = {
          url:
            BASE_URL + `student-service/user/placements?placement=${question}`,
          method: "post",
        };
        return request;
      } else if (selectGpt == "Courses") {
        let request = {
          url:
            BASE_URL +
            `student-service/user/globalEducationQuery?InfoType=${question}&userId=${userId}`,
          method: "post",
        };
        return request;
      } else if (selectGpt == "English Test & Interview Preparation") {
        let request = {
          url:
            BASE_URL +
            `student-service/user/globalEducationQuery?InfoType=${question}&userId=${userId}`,
          method: "post",
        };
        return request;
      } else if (selectGpt == "Offer letter & Acceptance letter") {
        let request = {
          url: BASE_URL + `student-service/user/offerletterAcceptanceTest`,
          data: [
            {
              role: "user",
              content: question,
            },
          ],
          method: "post",
        };
        return request;
      } else if (selectGpt == "Qualification & Specialization") {
        let request = {
          url:
            BASE_URL +
            `student-service/user/classification?prompt=${question}&userId=${userId}`,
          method: "post",
        };
        return request;
      } else if (selectGpt == "University Agents") {
        let request = {
          url:
            BASE_URL +
            `student-service/user/enterChat?prompt=${question}`,
          method: "post",
        };
        return request;
      } else if (selectGpt == "University Reviews") {
        let request = {
          url: BASE_URL + `student-service/user/reviews`,
          data: [
            {
              role: "user",
              content: question,
            },
          ],
          method: "post",
        };
        return request;
      }
   
  }

const renderChatItem = ({ item }) => {
  // const isLastItem = String(item.id) === String(item[item.length - 1].id);
  return(
  <View>
    {item.type !== 'system' && (
<View>
  <View style={item.type === 'sent' ? styles.sentMessage : styles.receivedMessage}>
    <Icon
      name={item.type === 'sent' ? 'person' : 'chatbubbles'}
      type="ionicon"
      color="black"
      size={24}
      containerStyle={styles.icon}
    />
    <Text style={item.type === 'sent' ? styles.sentMessageText : styles.receivedMessageText}>
       {/* <DynamicTextScreen responseText={item.text} /> */}
       {item.text}
    </Text>
    {item.type === 'received' && (
      <>
        {isSpeaking ? (
          <TouchableOpacity style={styles.stopButton} onPress={stopTextToSpeech}>
            <Text style={styles.stopButtonText}>
              <Icon
                name={'volume-off'}
                type="ionicon"
                color="white"
                size={24}
                containerStyle={styles.icon}
              />
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.speakButton} onPress={() => handleTextToSpeech(item.text)}>
            <Text style={styles.speakButtonText}>
              <Icon
                name={'volume-high'}
                type="ionicon"
                color="white"
                size={24}
                containerStyle={styles.icon}
              />
            </Text>
          </TouchableOpacity>
        )}
      </>
    )}
    {item.audioUri && (
      <View style={styles.audioContainer}>
        {!playbackStatus?
        <TouchableOpacity style={styles.audioButton} onPress={() => playAudio(item.audioUri)}>
          <Text style={styles.audioButtonText}>
            <Icon
              name={'play'}
              type="ionicon"
              color="white"
              size={24}
              containerStyle={styles.icon}
            />
          </Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.stopAudioButton} onPress={stopAudio}>
          <Text style={styles.stopAudioButtonText}>
            <Icon
              name={'stop'}
              type="ionicon"
              color="white"
              size={24}
              containerStyle={styles.icon}
            />
          </Text>
        </TouchableOpacity>
        }
      </View>
    )}
  </View>
  </View>
  )}
</View>
)
}

  return (
    <PaperProvider>
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="help-circle" type="ionicon" size={55} color="#e4e4e4" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Need Help? Ask OXYGPT</Text>
          <Text style={styles.headerSubtitle}>We typically reply within a few minutes regarding scholarship inquiries.</Text>
        </View>
      </View>
      {selectGpt == "" ? (
               <Text
                 style={{
                   top: 15,
                   fontSize: 16,
                   alignSelf: "center",
                   fontWeight: "bold",
                 }}
               >
                 Please select any of the GPT
               </Text>
             ) : null}
     
             <Dropdown
               style={styles.dropdown}
               data={data}
               labelField="label"
               valueField="value"
               placeholder="Select Gpt"
               value={selectGpt}
               onChange={(item) => {
                 setSelectGpt(item.value);
                 setMessages([]);
                 setShowButton(false);
                 // fetchTickets(item.value);
                 // setTickets([]);
               }}
             />
             {/* <Text>{ selectGpt}</Text> */}
     
             {selectGpt != "" ? (
               <View style={styles.container}>
                 {showButton === false ? (
                   <View
                     style={[styles.messagesContainer, { justifyContent: "center" }]}
                   >
                     <View
                       style={{
                         flexDirection: "row",
                         justifyContent: "space-between",
                         // marginTop: 10,
                       }}
                     >
                       <TouchableOpacity
                         style={styles.boxStyle}
                         onPress={() => sendMessage(question1)}
                       >
                         <Text style={styles.boxText}>{question1}</Text>
                       </TouchableOpacity>
                       <TouchableOpacity
                         style={styles.boxStyle}
                         onPress={() => sendMessage(question2)}
                       >
                         <Text style={styles.boxText}>{question2}</Text>
                       </TouchableOpacity>
                     </View>
                     <View
                       style={{
                         flexDirection: "row",
                         justifyContent: "space-between",
                         marginTop: 10,
                       }}
                     >
                       <TouchableOpacity
                         style={styles.boxStyle}
                         onPress={() => sendMessage(question3)}
                       >
                         <Text style={styles.boxText}>{question3}</Text>
                       </TouchableOpacity>
                       <TouchableOpacity
                         style={styles.boxStyle}
                         onPress={() => sendMessage(question4)}
                       >
                         <Text style={styles.boxText}>{question4}</Text>
                       </TouchableOpacity>
                     </View>
                   </View>
                 ) : (
                   <View style={styles.messagesContainer}>
                     <FlatList
                       ref={flatListRef}
                       data={messages}
                       renderItem={renderChatItem}
                       keyExtractor={(item) => item.id}
                       contentContainerStyle={styles.messagesList}
                     />
                   </View>
                 )}
                 <View style={styles.inputContainer}>
                   <TextInput
                     style={styles.textInput}
                     placeholder="Write a message"
                     value={inputText}
                     onChangeText={setInputText}
                     onSubmitEditing={() => sendMessage(inputText)}
                   />
                   {loading ? (
                     <View style={styles.sendButton}>
                       <ActivityIndicator size="small" color="white" />
                     </View>
                   ) : (
                     <TouchableOpacity
                       style={styles.sendButton}
                       onPress={() => sendMessage(inputText)}
                     >
                       <Text style={styles.sendButtonText}>Send</Text>
                     </TouchableOpacity>
                   )}
                   {/* {recording ? (
                 <TouchableOpacity style={styles.sendButton} onPress={stopRecording}>
                   <Text style={styles.sendButtonText}>Stop</Text>
                 </TouchableOpacity>
               ) : (
                 <TouchableOpacity
                   style={styles.sendButton}
                   onPress={startRecording}
                 >
                   <Text style={styles.sendButtonText}>Record</Text>
                 </TouchableOpacity>
               )} */}
                 </View>
               </View>
             ) : null}
     
    </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    borderWidth: 1.5,
    padding: 10,
    marginTop: 10,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
  },
  headerIcon: {
    width: 55,
    height: 55,
    borderRadius: 55,
    backgroundColor: "#e4e4e4",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dropdown: {
    margin: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
    backgroundColor: "white",
    padding: 10,
    width: "50%",
    alignSelf: "flex-end",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 5,
    width: width * 0.7,
    // textAlign:"center"
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5e5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.9,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0084ff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.9,
  },
  receivedMessageText: {
    color: "black",
    marginLeft: 10,
    fontWeight: "600",
    width: width * 0.7,
  },
  sentMessageText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "600",
    width: width * 0.7,
  },
  audioButton: {
    backgroundColor: "#0084ff",
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
    alignItems: "center",
  },
  audioButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  speakButton: {
    backgroundColor: "#4caf50",
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
    alignItems: "center",
  },
  speakButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
  },
  sendButton: {
    backgroundColor: "#0084ff",
    padding: 10,
    borderRadius: 15,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  stopAudioButton: {
    backgroundColor: "#ff0000",
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  stopAudioButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  stopButton: {
    backgroundColor: "#ff0000",
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  stopButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 50,
  },
  h3: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    width: width * 0.6,
  },
  h4: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    width: width * 0.6,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 8,
    width: width * 0.6,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 4,
    width: width * 0.6,
  },
  boxStyle: {
    // borderWidth:0.5,
    width: width * 0.45,
    padding: 10,
    height: height * 0.18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 8,
  },
  boxText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});