import { useState } from 'react';
import { getChatbotReply, filterProducts } from './chatUtils';
import { fetchProducts } from '../utils/useProductSearch';
import { fetchOffers } from '../utils/useOffers';

export default function useChat({ language = 'en', botName = 'OxyBot' }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  
  const [isChatLoading, setIsChatLoading] = useState(false);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleUserMessage = async (userInput) => {
    const userMsg = { from: 'user', text: userInput };
    addMessage(userMsg);
    setIsChatLoading(true);
       console.log("userInput",userInput);
       
    try {
      const [allProducts, offers] = await Promise.all([
            fetchProducts(), // no userInput
            fetchOffers(userInput),
            ]);

const products = filterProducts(userInput, allProducts);

// console.log("products....",allProducts);


      const botReply = await getChatbotReply(userInput, allProducts, offers, language, botName);

      addMessage({
        from: 'bot',
        text: botReply.text,
        type: botReply.type,
        data: botReply.data,
      });
    } catch (err) {
      console.error('Chat Error:', err);
      addMessage({ from: 'bot', text: 'Sorry, something went wrong.' });
    } finally {
      setIsChatLoading(false);
    }
  };

  return {
    messages,
    handleUserMessage,
    isChatLoading,
  };
}
