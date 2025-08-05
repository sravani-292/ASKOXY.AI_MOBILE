import React from 'react';
import { View, Text } from 'react-native';

export default function ChatBubble({ message, isUser }) {
  return (
    <View
      style={{
        backgroundColor: isUser ? '#dcf8c6' : '#e2e2e2',
        padding: 10,
        borderRadius: 10,
        marginLeft: isUser ? 10 : 5,
        marginRight: isUser ? 5 : 10,
        maxWidth: '85%'
      }}
    >
      <Text>{message}</Text>
    </View>
  );
}
