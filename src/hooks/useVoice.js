import Voice from '@react-native-voice/voice';
import * as Speech from 'expo-speech';
import { useState, useEffect } from 'react';

export default function useVoice({ onResult, language = 'en-US' }) {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      const result = e.value?.[0];
      if (result) onResult(result);
    };

    Voice.onSpeechEnd = () => setIsListening(false);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start(language);
    } catch (err) {
      console.error('Voice Start Error:', err);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Voice Stop Error:', err);
    }
  };

  const speakText = (text, lang = language) => {
    Speech.speak(text, { language: lang });
  };

  return { isListening, startListening, stopListening, speakText };
}
