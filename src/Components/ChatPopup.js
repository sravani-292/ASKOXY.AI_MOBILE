import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SendHorizontal, X } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
import { sendMessageToAssistant } from '../Screens/Chats/utils/openai';

const COLORS = {
  primary: '#007AFF',
  secondary: '#F0F0F0',
  userMessage: '#DCF8C6',
  botMessage: '#F0F0F0',
  background: '#FFFFFF',
  border: '#E5E5E5',
  text: '#333333',
  textSecondary: '#666666',
  shadow: 'rgba(0, 0, 0, 0.1)',
  error: '#FF3B30',
  success: '#34C759',
};

const SIZES = {
  borderRadius: 12,
  padding: 16,
  margin: 8,
  iconSize: 20,
  productCardWidth: 160,
  productImageHeight: 100,
};

const { height: screenHeight } = Dimensions.get('window');

export default function ChatPopup({ onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef(null);
  const flatListRef = useRef(null);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, loading]);

  // Send message handler with OpenAI integration
  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input, type: 'text' };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    inputRef.current?.blur();

    try {
      const response = await sendMessageToAssistant(newMessages);
      console.log('response', response);
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Something went wrong. Please try again.',
        type: 'text'
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages]);

  // Render text message with markdown support and image detection
  const renderTextMessage = useCallback((msg, index) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hasImage = urlRegex.test(msg.content) && msg.content.match(/\.(jpeg|jpg|gif|png|webp)/i);
    const isUser = msg.role === 'user';

    return (
      <View key={index} style={styles.messageContainer}>
        <View style={[
          styles.messageBox,
          isUser ? styles.userMessage : styles.botMessage
        ]}>
          <Text style={styles.avatar}>
            {isUser ? '🧑' : '🤖'}
          </Text>
          <View style={styles.messageContent}>
            <Markdown style={markdownStyles}>{msg.content}</Markdown>
            {hasImage && (
              <Image
                source={{ uri: msg.content.match(urlRegex)[0] }}
                style={styles.inlineImage}
                resizeMode="cover"
              />
            )}
          </View>
        </View>
      </View>
    );
  }, []);

  // Render product message
  const renderProductMessage = useCallback((msg, index) => (
    <View key={index} style={styles.messageContainer}>
      <View style={styles.productContainer}>
        <Text style={styles.avatar}>🤖</Text>
        <View style={styles.messageContent}>
          <Text style={styles.messageText}>{msg.content}</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.productScroll}
          >
            {msg.products?.map((product, i) => (
              <View key={i} style={styles.productCard}>
                <Image 
                  source={{ uri: product.image }} 
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <Text style={styles.productName}>{product.title}</Text>
                <Text style={styles.productPrice}>₹{product.price}</Text>
                <TouchableOpacity 
                  style={styles.addToCartButton}
                  onPress={() => Alert.alert('Added to Cart', `${product.title} added to cart`)}
                >
                  <Text style={styles.addToCartText}>🛒 Add to Cart</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  ), []);

  // Main message renderer
  const renderMessage = useCallback(({ item, index }) => {
    if (item.type === 'product') {
      return renderProductMessage(item, index);
    }
    return renderTextMessage(item, index);
  }, [renderProductMessage, renderTextMessage]);

  // Calculate popup position based on keyboard
  const getPopupBottom = () => {
    if (keyboardHeight > 0) {
      // When keyboard is open, position popup above keyboard with some margin
      return keyboardHeight + 20;
    }
    // Default position when keyboard is closed
    return 190;
  };

  // Dynamic popup positioning
  const popupStyle = [
    styles.popup,
    { 
      bottom: getPopupBottom(),
      // Reduce height when keyboard is open to prevent overflow
      height: keyboardHeight > 0 ? Math.min(400, screenHeight - keyboardHeight - 100) : 500
    }
  ];

  return (
    <View style={popupStyle}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <TouchableOpacity 
          onPress={onClose} 
          style={styles.closeButton}
          accessibilityLabel="Close chat"
        >
          <X size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Messages list */}
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `message-${index}-${item.timestamp || Date.now()}`}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.avatar}>🤖</Text>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Typing...</Text>
        </View>
      )}

      {/* Input area */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          value={input}
          onChangeText={setInput}
          placeholder="Ask something..."
          placeholderTextColor={COLORS.textSecondary}
          style={styles.textInput}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
        />
        
        <TouchableOpacity 
          onPress={sendMessage}
          style={[styles.sendButton, !input.trim() && styles.disabledButton]}
          disabled={!input.trim()}
          accessibilityLabel="Send message"
        >
          <SendHorizontal 
            size={SIZES.iconSize} 
            color={input.trim() ? COLORS.primary : COLORS.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.borderRadius,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.secondary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageBox: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: '90%',  
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.userMessage,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.botMessage,
  },
  avatar: {
    marginRight: 8,
    fontSize: 18,
  },
  messageContent: {
    flex: 1,
    maxWidth: 300,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  inlineImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productScroll: {
    marginTop: 8,
  },
  productCard: {
    width: SIZES.productCardWidth,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.borderRadius,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productImage: {
    width: '100%',
    height: SIZES.productImageHeight,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.secondary,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addToCartText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.secondary,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  textInput: {
    flex: 1,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
    color: COLORS.text,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

const markdownStyles = {
  body: { 
    color: COLORS.text, 
    fontSize: 14 
  },
  strong: { 
    fontWeight: 'bold' 
  },
  paragraph: { 
    marginBottom: 8 
  },
};