import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions,Alert,ScrollView,ActivityIndicator} from 'react-native';
import { Icon } from 'react-native-vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import axios from 'axios';
import { FormData } from 'formdata-node';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import RenderHTML from 'react-native-render-html';

const { width, height } = Dimensions.get('window');
const OpenAI_API_KEY = 'sk-proj-UXWpd26UnGoTJTWklnSBT3BlbkFJmhtUQ90T7CPXz5quJVXr';
export default function GPT({ navigation }) {
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
  const question1 = "How can international students effectively search for and apply to scholarships for studying abroad?"
  const question2 = "What are some lesser-known global scholarships available for students from developing countries?"
  const question3 = "What are the eligibility criteria for popular global education scholarships like the Fulbright Program, Chevening Scholarship, and Erasmus Mundus?"
  const question4 = "How do scholarship opportunities differ between undergraduate and postgraduate international students?"
  const flatListRef = useRef(null);

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

  const startRecording = async () => {
    setLoading(true);
    setShowButton(true)
    try {
      // Request permissions to access the microphone
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      // Prepare to record audio with specified settings
      await recording.prepareToRecordAsync({
        android: {
          extension: '.mp3',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.mp3',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      // Start recording
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
      setLoading(false);
    }
  };

  const stopRecording = async () => {
    try {
      // Stop the recording
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      console.log('Recording stopped and stored at', uri);
      const newUri = FileSystem.documentDirectory + 'response.mp3';
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: String(messages.length + 1),
          type: 'sent',
          text: 'Audio message',
          audioUri: newUri,
        },
      ]);

      console.log('Recording renamed and stored at', newUri);

      // Upload the recorded audio file
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: newUri,
          name: 'response.mp3',
          type: 'audio/mpeg',
        });

        formData.append('model', 'whisper-1');

        console.log(formData._parts[0]);

        const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${OpenAI_API_KEY}`, // Replace with your OpenAI API key
          },
        });



        console.log('Audio file successfully uploaded', response.data);
        if (response.data.text) {
          if (response.data) {
            const assistantResponse = {
              id: String(messages.length + 2),
              type: 'received',
              text: response.data,
            };
            setMessages((prevMessages) => [...prevMessages, assistantResponse]);
          }
        } else {
          console.error('Failed to get response from assistant');
        }
        setLoading(false);
      } catch (uploadErr) {
        console.error('Failed to upload audio file', uploadErr.response);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to stop recording', err.response);
      setLoading(false);
    }
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

  const pickAudio = async () => {
    console.log('Picking audio...');
    setLoading(true)
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
      });
      console.log('Picked file:', result);
      if (!result.canceled) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: String(messages.length + 1),
            type: 'sent',
            text: 'Audio message',
            audioUri: result.assets[0].uri,
          },
        ]);
        console.log('Picked file:', result);
        // You can now upload this file to your server or handle it as needed
        // console.log('File URI:', result.uri);
        uploadFile(result);
      }
    } catch (error) {
        setLoading(false)
      console.error('Error picking file:', error);
    }
  };

  const uploadFile = async (result) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        name: 'response.mp3',
        type: 'audio/mpeg',
      });
      setShowButton(true)
      formData.append('model', 'whisper-1');

      console.log(formData._parts[0]);

      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${OpenAI_API_KEY}`, // Replace with your OpenAI API key
        },
      });

      console.log('Audio file successfully uploaded', response.data);
        if (response.data) {
          const assistantResponse = {
            id: String(messages.length + 2),
            type: 'received',
            text: response.data.text,
          };
          setMessages((prevMessages) => [...prevMessages, assistantResponse]);
      } else {
        console.error('Failed to get response from assistant');
      }
      setLoading(false);
    } catch (uploadErr) {
      console.error('Failed to upload audio file', uploadErr.response);
      setLoading(false);
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
   
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o-2024-08-06",
      messages: previousMessages
    }, {
      headers: {
        'Authorization': `Bearer ${OpenAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    setLoading(false)
    if (response.data) {
      console.log(JSON.stringify(response.data.choices[0].message.content));
      const assistantResponse = {
        id: String(messages.length + 2),
        type: 'received',
        text: JSON.stringify(response.data.choices[0].message.content),
      };
      setMessages((prevMessages) => [...prevMessages, assistantResponse]);
      scrollToEnd();
    } else {
      console.error('Failed to get response from assistant');
      setLoading(false)
    }
  } catch (error) {
    console.log(error.response);
    console.error('Error sending message:', error);
    const assistantResponse = {
      id: String(messages.length + 2),
      type: 'received',
      text: "Sorry, we can't assist you at the moment. Please try again later.",
    };
    setMessages((prevMessages) => [...prevMessages, assistantResponse]);
    scrollToEnd();
    setLoading(false)
  }
  setInputText('');
  setLoading(false)
};
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
      {showButton === false ? (
        <View style={[styles.messagesContainer,{justifyContent:"center"}]}> 
            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                <TouchableOpacity style={styles.boxStyle} onPress={() => sendMessage(question1)}>
                   <Text style={styles.boxText}>{question1}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boxStyle} onPress={() => sendMessage(question2)}>
                   <Text style={styles.boxText}>{question2}</Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                <TouchableOpacity style={styles.boxStyle} onPress={() => sendMessage(question3)}>
                   <Text style={styles.boxText}>{question3}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boxStyle} onPress={() => sendMessage(question4)}>
                   <Text style={styles.boxText}>{question4}</Text>
                </TouchableOpacity>
            </View>
        </View>
        )
        :
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
        />
      </View> }
      <View style={styles.inputContainer}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <Text style={styles.sendButtonText}>
                <Icon
                  name={'attach-outline'}
                  type="ionicon"
                  color="black"
                  size={24}
                  containerStyle={styles.icon}
                />
              </Text>
            </TouchableOpacity>
          }>
          <Menu.Item onPress={() => {pickAudio(),closeMenu()}} title="Audio upload" />
          <Menu.Item onPress={() => {closeMenu()}} title="File upload" />
          <Divider />
          <Menu.Item onPress={() => {closeMenu()}} title="Cancel" />
        </Menu>
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
         ) 
         :
        <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage(inputText)}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        }
        {recording ? (
          <TouchableOpacity style={styles.sendButton} onPress={stopRecording}>
            <Text style={styles.sendButtonText}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.sendButton} onPress={startRecording}>
            <Text style={styles.sendButtonText}>Record</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    borderWidth: 1.5,
    padding: 10,
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  headerIcon: {
    width: 55,
    height: 55,
    borderRadius: 55,
    backgroundColor: '#e4e4e4',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 5,
    width:width*0.7,
    // textAlign:"center"
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5e5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
  },
  receivedMessageText: {
    color: 'black',
    marginLeft: 10,
    fontWeight: '600',
    width: width * 0.7,
  },
  sentMessageText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: '600',
    width: width * 0.7,
  },
  audioButton: {
    backgroundColor: '#0084ff',
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
    alignItems: 'center',
  },
  audioButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  speakButton: {
    backgroundColor: '#4caf50',
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
    alignItems: 'center',
  },
  speakButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#0084ff',
    padding: 10,
    borderRadius: 15,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stopAudioButton: {
    backgroundColor: '#ff0000',
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopAudioButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: '#ff0000',
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 50,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    width: width*0.6,
  },
  h4: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    width: width*0.6,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 8,
    width: width*0.6,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 4,
    width: width*0.6,
  },
  boxStyle:{
    // borderWidth:0.5,
    width:width*0.45,
    padding:10,
    height:height*0.18,
    alignItems:"center",
    justifyContent:"center",
    borderRadius:10,
    backgroundColor:"white",
    elevation:8
  },
  boxText:{
    textAlign:"center",
    fontSize:16,
    fontWeight:"bold"
  }
});
