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
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SendHorizontal, X, Copy, Share, Trash2 } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
import { sendMessageToAssistant } from '../Screens/Chats/utils/openai';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, scaleFont } from '../utils/scale.js';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  warning: '#FF9500',
  services: '#666666',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const SIZES = {
  borderRadius: scale(12),
  padding: scale(16),
  margin: scale(8),
  iconSize: scale(20),
  productCardWidth: scale(160),
  productImageHeight: verticalScale(100),
  inputMinHeight: verticalScale(40),
  inputMaxHeight: verticalScale(100),
};

const ANIMATION_DURATION = 300;

export default function ChatScreen({ navigation }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      type: 'text',
      timestamp: Date.now(),
      id: `assistant-${Date.now()}`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [inputHeight, setInputHeight] = useState(SIZES.inputMinHeight);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef(null);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Initialize screen with fade-in animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Enhanced keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      // Scroll to end when keyboard appears
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    const keyboardWillShowListener = Platform.OS === 'ios' 
      ? Keyboard.addListener('keyboardWillShow', (e) => {
          setKeyboardHeight(e.endCoordinates.height);
        })
      : null;

    const keyboardWillHideListener = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', () => {
          setKeyboardHeight(0);
        })
      : null;

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  // Auto-scroll when messages change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [messages, loading]);

  // Enhanced send message handler
  const sendMessage = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const timestamp = Date.now();
    const userMsg = { 
      role: 'user', 
      content: trimmedInput, 
      type: 'text',
      timestamp,
      id: `user-${timestamp}`,
    };
    
    // System message with only role and content
    const systemMessage = {
      role: 'system',
      content: 'You are a smart assistant for an e-commerce platform that sells: rice (like HMT, Sonamasoori), groceries, gold, combo offers, and festival items (like rakhis).\n\nRespond with:\n1. A helpful, one-sentence natural reply to the user\'s message.\n2. 3–5 keywords from the input, only if they match platform items.\n\nRules:\n- Answer the question normally in the description.\n- Always include specific item names (like hmt, rakhi, sonamasoori) in keywords if mentioned.\n- If user mentions **offers, deals, discounts, or today’s specials**, include "offers" in keywords.\n- If only general rice is asked (e.g., “what rice do you sell”), use "rice" in keyword. If specific rice is asked (e.g., “what is HMT”), include only "hmt".\n- For valid festival items (e.g., “rakhi”), describe them in the reply and include them in keywords.\n- If it’s a casual message (e.g., “hi”), respond politely and leave keywords blank.\n- Never include unrelated categories like electronics or fashion.\n\nFormat:\nDescription: <helpful reply>\nKeywords: <comma-separated keywords or leave blank>',
    };
    
    // Prepare messages for API with only role and content
    const apiMessages = [
      systemMessage,
      ...messages.map(({ role, content }) => ({ role, content })),
      { role: 'user', content: trimmedInput },
    ];
    
    // Update local messages with full user message
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setInputHeight(SIZES.inputMinHeight);
    setLoading(true);
    setIsTyping(true);
    
    // Blur input and dismiss keyboard
    inputRef.current?.blur();
    Keyboard.dismiss();

    try {
      // Replace 'your-auth-token' with actual token source (e.g., props, context, or auth state)
      const token = 'your-auth-token'; // TODO: Replace with actual token
      const response = await sendMessageToAssistant(apiMessages, token);
      const assistantMsg = {
        ...response,
        timestamp: Date.now(),
        id: `assistant-${Date.now()}`,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg = {
        role: 'assistant',
        content: '❌ Sorry, something went wrong. Please check your connection and try again.',
        type: 'text',
        timestamp: Date.now(),
        id: `error-${Date.now()}`,
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  }, [input, messages, loading]);

  // Handle input content size change
  const handleContentSizeChange = useCallback((event) => {
    const height = event.nativeEvent.contentSize.height;
    const newHeight = Math.max(
      SIZES.inputMinHeight,
      Math.min(SIZES.inputMaxHeight, height)
    );
    setInputHeight(newHeight);
  }, []);

  // Message actions
  const handleLongPress = useCallback((message) => {
    if (message.role === 'assistant' && !message.isError) {
      Alert.alert(
        'Message Options',
        'What would you like to do?',
        [
          {
            text: 'Copy',
            onPress: () => {
              // Implement copy functionality
              Alert.alert('Copied', 'Message copied to clipboard');
            },
          },
          {
            text: 'Share',
            onPress: () => {
              // Implement share functionality
              Alert.alert('Share', 'Share functionality would be implemented here');
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  }, []);

  // Clear chat
  const clearChat = useCallback(() => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([{
              role: 'assistant',
              content: 'Hello! How can I help you today?',
              type: 'text',
              timestamp: Date.now(),
              id: `assistant-${Date.now()}`,
            }]);
          },
        },
      ]
    );
  }, []);

  // Enhanced text message renderer
  const renderTextMessage = useCallback((msg, index) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const hasImage = urlRegex.test(msg.content) && 
      msg.content.match(/\.(jpeg|jpg|gif|png|webp|svg)/i);
    const isUser = msg.role === 'user';

    return (
      <Animated.View 
        key={msg.id || index} 
        style={[
          styles.messageContainer,
          { opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity
          onLongPress={() => handleLongPress(msg)}
          activeOpacity={0.8}
          style={[
            styles.messageBox,
            isUser ? styles.userMessage : styles.botMessage,
            msg.isError && styles.errorMessage,
          ]}
        >
          <Text style={styles.avatar}>
            {isUser ? '🧑' : (msg.isError ? '⚠️' : '🤖')}
          </Text>
          <View style={styles.messageContent}>
            <Markdown style={markdownStyles}>{msg.content}</Markdown>
            {hasImage && (
              <Image
                source={{ uri: msg.content.match(urlRegex)[0] }}
                style={styles.inlineImage}
                resizeMode="cover"
                onError={() => console.log('Image failed to load')}
              />
            )}
            <Text style={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [fadeAnim, handleLongPress]);

  // Enhanced product message renderer
  const renderProductMessage = useCallback((msg, index) => (
    <Animated.View 
      key={msg.id || index} 
      style={[
        styles.messageContainer,
        { opacity: fadeAnim }
      ]}
    >
      <View style={styles.productContainer}>
        <Text style={styles.avatar}>🤖</Text>
        <View style={styles.messageContent}>
          <Text style={styles.messageText}>{msg.content}</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.productScroll}
            contentContainerStyle={styles.productScrollContent}
          >
            {msg.products?.map((product, i) => (
              <TouchableOpacity 
                key={`product-${i}`}
                style={styles.productCard}
                activeOpacity={0.8}
                onPress={() => {
                  Alert.alert('Product Details', `View details for ${product.title}`);
                }}
              >
                <Image 
                  source={{ uri: product.image }} 
                  style={styles.productImage}
                  resizeMode="cover"
                  onError={() => console.log('Product image failed to load')}
                />
                <Text style={styles.productName} numberOfLines={2}>
                  {product.title}
                </Text>
                <Text style={styles.productPrice}>₹{product.price}</Text>
                <TouchableOpacity 
                  style={styles.addToCartButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    Alert.alert('Added to Cart', `${product.title} added to cart`);
                  }}
                >
                  <Text style={styles.addToCartText}>🛒 Add to Cart</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.timestamp}>
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    </Animated.View>
  ), [fadeAnim]);

  // Main message renderer
  const renderMessage = useCallback(({ item, index }) => {
    if (item.type === 'product') {
      return renderProductMessage(item, index);
    }
    return renderTextMessage(item, index);
  }, [renderProductMessage, renderTextMessage]);

  // Enhanced typing indicator
  const renderTypingIndicator = () => (
    <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
      <Text style={styles.avatar}>🤖</Text>
      <View style={styles.typingIndicator}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Typing</Text>
        <View style={styles.typingDots}>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.dot}>•</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.secondary}
        translucent={false}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Animated.View 
          style={[
            styles.container,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Enhanced Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <Text style={styles.headerSubtitle}>
                {messages.length > 1 ? `${messages.length - 1} messages` : 'Ready to help'}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                onPress={clearChat}
                style={styles.headerButton}
                accessibilityLabel="Clear chat"
              >
                <Trash2 size={scale(18)} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.headerButton}
                accessibilityLabel="Go back"
              >
                <X size={scale(20)} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages list */}
          <View style={styles.messagesContainer}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id || `message-${item.timestamp}`}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10,
              }}
              onScrollToIndexFailed={() => {
                // Handle scroll failures gracefully
              }}
            />
          </View>

          {/* Enhanced Loading/Typing indicator */}
          {loading && renderTypingIndicator()}

          {/* Enhanced Input area */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { height: inputHeight + verticalScale(16) }]}>
              <TextInput
                ref={inputRef}
                value={input}
                onChangeText={setInput}
                onContentSizeChange={handleContentSizeChange}
                placeholder="Type your message..."
                placeholderTextColor={COLORS.textSecondary}
                style={[styles.textInput, { height: inputHeight }]}
                multiline
                maxLength={1000}
                returnKeyType="send"
                onSubmitEditing={() => {
                  if (!loading) sendMessage();
                }}
                blurOnSubmit={false}
                textAlignVertical="top"
                autoCorrect
                autoCapitalize="sentences"
              />
              <TouchableOpacity 
                onPress={sendMessage}
                style={[
                  styles.sendButton,
                  (!input.trim() || loading) && styles.disabledButton
                ]}
                disabled={!input.trim() || loading}
                accessibilityLabel="Send message"
                activeOpacity={0.7}
              >
                <SendHorizontal 
                  size={scale(18)}
                  color={
                    input.trim() && !loading 
                      ? COLORS.background 
                      : COLORS.textSecondary
                  } 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.characterCount}>
              {input.length}/1000
            </Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: scaleFont(18),
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: scaleFont(12),
    color: COLORS.textSecondary,
    marginTop: verticalScale(2),
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: scale(8),
    marginLeft: scale(4),
    borderRadius: scale(8),
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.background,
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: verticalScale(12),
  },
  messageContainer: {
    marginBottom: verticalScale(12),
  },
  messageBox: {
    flexDirection: 'row',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    borderRadius: scale(16),
    maxWidth: '85%',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.userMessage,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.botMessage,
  },
  errorMessage: {
    backgroundColor: '#FFE5E5',
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  avatar: {
    marginRight: scale(10),
    fontSize: scaleFont(18),
    alignSelf: 'flex-start',
  },
  messageContent: {
    flex: 1,
    maxWidth: scale(280),
  },
  messageText: {
    fontSize: scaleFont(15),
    color: COLORS.text,
    lineHeight: verticalScale(22),
  },
  timestamp: {
    fontSize: scaleFont(10),
    color: COLORS.textSecondary,
    marginTop: verticalScale(4),
    textAlign: 'right',
  },
  inlineImage: {
    width: scale(220),
    height: verticalScale(150),
    borderRadius: scale(10),
    marginTop: verticalScale(8),
    backgroundColor: COLORS.secondary,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productScroll: {
    marginTop: verticalScale(10),
  },
  productScrollContent: {
    paddingRight: scale(16),
  },
  productCard: {
    width: SIZES.productCardWidth,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.borderRadius,
    padding: scale(12),
    marginRight: scale(12),
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: SIZES.productImageHeight,
    borderRadius: scale(8),
    marginBottom: verticalScale(8),
    backgroundColor: COLORS.secondary,
  },
  productName: {
    fontSize: scaleFont(13),
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: verticalScale(4),
    lineHeight: verticalScale(18),
  },
  productPrice: {
    fontSize: scaleFont(15),
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: verticalScale(8),
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  addToCartText: {
    color: COLORS.background,
    fontSize: scaleFont(12),
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    backgroundColor: COLORS.secondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: scale(8),
    fontSize: scaleFont(14),
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  typingDots: {
    flexDirection: 'row',
    marginLeft: scale(4),
  },
  dot: {
    fontSize: scaleFont(16),
    color: COLORS.textSecondary,
    marginHorizontal: scale(1),
  },
  inputContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.secondary,
    borderRadius: scale(20),
    paddingHorizontal: scale(4),
    paddingVertical: verticalScale(4),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    fontSize: scaleFont(15),
    color: COLORS.text,
    backgroundColor: 'transparent',
  },
  sendButton: {
    padding: scale(10),
    borderRadius: scale(16),
    backgroundColor: COLORS.primary,
    marginLeft: scale(8),
  },
  disabledButton: {
    backgroundColor: COLORS.border,
    opacity: 0.6,
  },
  characterCount: {
    fontSize: scaleFont(10),
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: verticalScale(4),
  },
});

const markdownStyles = {
  body: { 
    color: COLORS.text, 
    fontSize: scaleFont(15),
    lineHeight: verticalScale(22),
  },
  strong: { 
    fontWeight: 'bold' 
  },
  em: {
    fontStyle: 'italic'
  },
  paragraph: { 
    marginBottom: verticalScale(8) 
  },
  heading1: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
  },
  heading2: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(6),
  },
  code_inline: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: scale(4),
    paddingVertical: verticalScale(2),
    borderRadius: scale(4),
    fontSize: scaleFont(13),
  },
  code_block: {
    backgroundColor: COLORS.secondary,
    padding: scale(12),
    borderRadius: scale(8),
    marginVertical: verticalScale(8),
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
};