import { openai } from '../Config/openai';

const synonymMap = {
  'g': 'grams',
  'kg': 'kilograms',
  'ml': 'milliliters',
  'ltr': 'liters',
  'litre': 'liters',
  'facewash': 'face wash',
  'gold': 'golden',
  'basmati': 'long grain',
};

// Utility: Normalize and expand keywords
function normalizeKeywords(keywords) {
  const expanded = new Set();
  for (let kw of keywords) {
    kw = kw.toLowerCase().trim();
    expanded.add(kw);

    // Add synonym
    if (synonymMap[kw]) expanded.add(synonymMap[kw]);

    // Add plural
    if (!kw.endsWith('s')) expanded.add(`${kw}s`);
  }
  return Array.from(expanded);
}

// Utility: Normalize units
function normalizeUnit(unit) {
  const u = unit?.toLowerCase().trim();
  if (['g', 'gram', 'grams'].includes(u)) return 'grams';
  if (['kg', 'kilogram', 'kilograms'].includes(u)) return 'kilograms';
  if (['ml', 'milliliter', 'milliliters'].includes(u)) return 'milliliters';
  if (['l', 'ltr', 'liter', 'liters'].includes(u)) return 'liters';
  return u;
}

export async function getChatbotReply(userInput, products = [], offers = [], language = 'en', botName = 'OxyBot') {
  const lowerText = userInput.toLowerCase();

  // 🔹 Check if user asking about offers
  const isAskingForOffer = ['offer', 'discount', 'deal', 'sale'].some(word => lowerText.includes(word));
  if (isAskingForOffer && offers.length > 0) {
    return {
      text: `${botName} found these offers for you!`,
      type: 'offers',
      data: offers,
    };
  }

  // 🔹 Use GPT to extract relevant keywords
  const systemPrompt = `You are ${botName}, a helpful assistant in an e-commerce app. Reply in ${language}. First, briefly suggest what product types suit the user's need. Then list 3-5 keywords to help match products. Reply in this format:

Description: <1 sentence helpful reply>
Keywords: <comma-separated keywords for filtering>`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput }
    ],
  });

  const gptMessage = response.choices?.[0]?.message?.content || '';
  console.log('GPT Response:', gptMessage);

   const descriptionMatch = gptMessage.match(/Description:\s*(.*)/i);
const keywordsMatch = gptMessage.match(/Keywords:\s*(.*)/i);

const description = descriptionMatch?.[1]?.trim() || "Here's what I found for you!";
const rawKeywords = keywordsMatch?.[1]?.toLowerCase()?.split(',').map(k => k.trim()).filter(Boolean) || [];

// 🔹 Set of words from keywords
const keywordTokens = new Set();
rawKeywords.forEach((kw) => {
  const words = kw.split(/\s+/);
  words.forEach(word => {
    if (word.length > 1) keywordTokens.add(word);
  });
});

// 🔹 Known brands and categories (you can expand this)
const knownBrands = ['india gate', 'daawat', 'fortune', 'kohinoor', 'oxy', '24 mantra', 'amul', 'tata', 'hdfc', 'yesbank'];
const knownCategories = ['rice', 'grocery', 'gold', 'dal', 'atta', 'milk', 'coins', 'jewelry', 'bar', 'bullion'];

const mentionedBrand = rawKeywords.find(k => knownBrands.includes(k));
const mentionedCategory = rawKeywords.find(k => knownCategories.includes(k));

const matchedProducts = [];
const addedIds = new Set();

for (const item of products) {
  const name = item?.name?.toLowerCase() || '';
  const description = item?.description?.toLowerCase() || '';
  const category = item?.category?.toLowerCase() || '';
  const brand = item?.brand?.toLowerCase?.() || '';
  const weight = item?.weight?.toString().toLowerCase?.() || '';
  const units = item?.units?.toLowerCase?.() || '';

  const combined = `${name} ${description} ${category} ${brand} ${weight} ${units}`;

  // ✅ Check for keyword token match
  const isTokenMatch = [...keywordTokens].some(token => combined.includes(token));

  // ✅ Category match (if mentioned)
  const categoryMatch = mentionedCategory ? combined.includes(mentionedCategory) : true;

  // ✅ Brand match (if mentioned)
  const brandMatch = mentionedBrand ? combined.includes(mentionedBrand) : true;

  if (isTokenMatch && categoryMatch && brandMatch && !addedIds.has(item.id)) {
    matchedProducts.push(item);
    addedIds.add(item.id);
  }
}

  if (matchedProducts.length > 0) {
    return {
      text: description,
      type: 'products',
      data: matchedProducts,
    };
  }

  return {
    text: description,
    type: 'text',
    data: null,
  };
}


export function filterProducts(userInput, allProducts) {
  const inputWords = userInput.toLowerCase().split(/\s+/); // Split user input into words
  const matched = [];

  for (const category of allProducts.categoryType || []) {
    const items = category.itemsResponseDtoList || [];

    for (const item of items) {
      const name = item.itemName?.toLowerCase() || '';
      const desc = item.itemDescription?.toLowerCase() || '';
      const combined = `${name} ${desc}`;

      // Match if all input words are found in name or description
      const isMatch = inputWords.every(word => combined.includes(word));

      if (isMatch) {
        matched.push({
          name: item.itemName,
          price: item.itemPrice,
          image: item.itemImage,
          description: item.itemDescription || '',
        });
      }
    }
  }

  return matched;
}


