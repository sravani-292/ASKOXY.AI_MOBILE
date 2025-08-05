import { openai } from '../Config/openai'; // Assuming you set this up already

export const handleTranslateProduct = async (product, language) => {
  try {
    const prompt = `Translate the following product description into ${language}:\n\n"${product.description}"`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a translator. Only return the translated text, no explanations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const translated = completion.choices[0].message.content.trim();

    // Replace description in place (or you can also store translatedDescription)
    const updatedMessages = messages.map((msg) => {
      if (msg.type === 'products') {
        return {
          ...msg,
          data: msg.data.map((p) =>
            p.name === product.name ? { ...p, description: translated } : p
          ),
        };
      }
      return msg;
    });

    setMessages(updatedMessages);
  } catch (error) {
    console.error('Translation failed:', error);
  }
};
