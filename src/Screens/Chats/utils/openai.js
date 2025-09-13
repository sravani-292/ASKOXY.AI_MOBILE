import axios from 'axios';

export const sendMessageToAssistant = async (messages, token) => {
  try {
    const response = await axios({
      url: 'https://meta.oxyloans.com/api/student-service/user/question',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      data: messages,
    });

    console.log('API Response:', response.data);

    const data = response.data;

    // Split by lines
const lines = data.split("\n");

// Extract values
let description = "";
let keywords = "";

lines.forEach(line => {
  if (line.startsWith("Description:")) {
    description = line.replace(/^Description:\s*/, '').trim() ;
    console.log({description});
  }else{
    description = data || 'Sorry, I could not process your request.';
  }
  if (line.startsWith("Keywords:")) {
    keywords = line.replace(/^Keywords:\s*/, "").trim().split(', ').map(k => k.trim()).filter(k => k) || '';
  }
});

const parsedResponse = { Description: description, Keywords: keywords };

console.log({parsedResponse});

    // Parse the API response, assuming it has Description and Keywords fields
    // const description = data.Description || data.replace(/^Description:\s*/, '') ||'Sorry, I could not process your request.';
    // const keywords = data.Keywords ? data.Keywords.split(', ').map(k => k.trim()).filter(k => k) : [];

    return {
      role: 'assistant',
      content: description.replace(/^Description:\s*/, ''),
      // type: keywords.length > 0 ? 'product' : 'text',
      // products: keywords.length > 0 ? keywords : null,
    };
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw error;
  }
};

// Dynamically map keywords to product data (mock implementation)
const mapKeywordsToProducts = (keywords) => {
  return keywords.map(keyword => {
    // Capitalize the keyword for display as title
    const title = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    
    // Generate a random price between 100 and 50000 based on keyword type
    let price;
    if (keyword.toLowerCase() === 'gold') {
      price = Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000; // Gold: 10,000–50,000
    } else if (keyword.toLowerCase() === 'offers' || keyword.toLowerCase().includes('combo')) {
      price = Math.floor(Math.random() * (2000 - 500 + 1)) + 500; // Offers/Combos: 500–2,000
    } else if (keyword.toLowerCase() === 'rakhi' || keyword.toLowerCase().includes('festival')) {
      price = Math.floor(Math.random() * (500 - 50 + 1)) + 50; // Festival items: 50–500
    } else {
      price = Math.floor(Math.random() * (1000 - 100 + 1)) + 100; // General items: 100–1,000
    }

    // Use a placeholder image (replace with real image URLs if available)
    const image = `https://via.placeholder.com/150?text=${encodeURIComponent(title)}`;

    return {
      title,
      price,
      image,
    };
  });
};