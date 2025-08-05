import React, { useState, useRef, useEffect } from 'react';
import {
  View, TextInput, ScrollView, Button, Text, KeyboardAvoidingView, Platform, StyleSheet, Image, ActivityIndicator
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { sendMessageToAssistant } from './utils/openai';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input, type: 'text' };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessageToAssistant(newMessages);
      console.log('response', response);
      
      setMessages(prev => [...prev, response]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Something went wrong. Please try again.',
        type: 'text'
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

 const renderTextMessage = (msg, index) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hasImage = urlRegex.test(msg.content) && msg.content.match(/\.(jpeg|jpg|gif|png|webp)/i);

  return (
    <View
      key={index}
      style={[
        styles.bubble,
        msg.role === 'user' ? styles.userBubble : styles.assistantBubble
      ]}
    >
      <Text style={styles.avatar}>
        {msg.role === 'user' ? '🧑' : '🤖'}
      </Text>
      <View style={{ flex: 1,width:300 }}>
        {/* <Text style={styles.messageText}>{msg.content}</Text> */}
        <Markdown style={markdownStyles}>{msg.content}</Markdown>
        {/* 🖼️ If there's an image URL, show it */}
        {hasImage && (
          <Image
            source={{ uri: msg.content.match(urlRegex)[0] }}
            style={styles.inlineImage}
          />
        )}
      </View>
    </View>
  );
};

  const renderProductMessage = (msg, index) => (
    <View key={index} style={styles.productContainer}>
      <Text style={styles.avatar}>🤖</Text>
      <Text style={styles.messageText}>{msg.content}</Text>
      {msg.products?.map((product, i) => (
        <View key={i} style={styles.card}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>₹{product.price}</Text>
          <Button title="🛒 Add to Cart" onPress={() => alert(`Added ${product.title}`)} />
        </View>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
      >
        {messages.map((msg, index) =>
          msg.type === 'product'
            ? renderProductMessage(msg, index)
            : renderTextMessage(msg, index)
        )}
        {loading && (
          <View style={styles.typingBubble}>
            <Text style={styles.avatar}>🤖</Text>
            <ActivityIndicator size="small" color="#555" />
            <Text style={styles.typingText}>Typing...</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask Jarvis..."
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
    paddingBottom: 100
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  bubble: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: '90%'
  },
  userBubble: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end'
  },
  assistantBubble: {
    backgroundColor: '#e6e6e6',
    alignSelf: 'flex-start'
  },
  avatar: {
    marginRight: 6,
    fontSize: 18
  },
  messageText: {
    fontSize: 16
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start'
  },
  typingText: {
    marginLeft: 10,
    fontStyle: 'italic'
  },
  productContainer: {
    marginBottom: 15
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16
  },
  price: {
    marginVertical: 4,
    color: 'green'
  },
  inlineImage: {
  width: 200,
  height: 150,
  resizeMode: 'cover',
  marginTop: 8,
  borderRadius: 8
}
});

const markdownStyles = {
  body: { color: '#333', fontSize: 14 },
  image: { width: 200, height: 150, borderRadius: 10, marginTop: 8 },
  strong: { fontWeight: 'bold' },
  paragraph: { marginBottom: 10 },
};
