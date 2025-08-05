import { openai } from '../../../Config/openai';
import * as api from '../api/apiFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tools } from './assistantTools';

export const sendMessageToAssistant = async (chatHistory, onUpdateResponse) => {
  try {
    const userId = (await AsyncStorage.getItem('userId')) || '14996e93-46c9-46cb-a5fb-8050b8af17ab';

    const systemMessage = {
      role: 'system',
      content: userId
        ? `The user's ID is ${userId}. Use this for authenticated API calls.`
        : `The user is not logged in. Only show general help or trending offers.`,
    };

    const validMessages = [systemMessage, ...chatHistory.filter(m => typeof m === 'object')];

    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: validMessages,
      tools,
      tool_choice: 'auto',
    });

    const assistantMessage = response.choices[0].message;
    const toolCalls = assistantMessage.tool_calls;

    if (toolCalls?.length) {
      onUpdateResponse?.('⏳ Fetching results...');

      const toolMessages = [];

      for (const toolCall of toolCalls) {
        let args = {};
        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch (e) {
          console.error('Invalid tool arguments:', toolCall.function.arguments);
          return '❌ Invalid tool arguments received.';
        }

        let result;
        try {
          result = await api[toolCall.function.name](args);
        } catch (e) {
          console.error('Tool call failed:', e);
          result = { error: e.message || '❌ Tool call failed.' };
        }

        toolMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      const followUpMessages = [...validMessages, assistantMessage, ...toolMessages];

      const followUp = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: followUpMessages,
      });

      const finalMessage = followUp.choices[0].message || '✅ Done.';
      onUpdateResponse?.(finalMessage);
      return finalMessage;
    }
       
    const finalMessage = assistantMessage || '✅ Done.';
    onUpdateResponse?.(finalMessage);
    console.log(finalMessage);
    
    return finalMessage;
  } catch (err) {
    console.error('Assistant error:', err);
    return '❌ Something went wrong while processing your request. Please try again.';
  }
};
