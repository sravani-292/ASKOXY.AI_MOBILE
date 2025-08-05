import { OpenAI } from 'openai';
import { OPENAI_KEY } from '@env';

export const openai = new OpenAI({
  apiKey: OPENAI_KEY,
  dangerouslyAllowBrowser: true, // Required for Expo
});