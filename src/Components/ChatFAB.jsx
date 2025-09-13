// src/components/ChatFAB.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MessageCircle,BotMessageSquare,UserMessageSquare } from 'lucide-react-native';

export default function ChatFAB({ onPress }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.fab} onPress={()=> navigation.navigate('Chat With AI')}>
      <BotMessageSquare color="#fff" size={28} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 145,
    right: 20,
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 32,
    elevation: 5,
  },
});
