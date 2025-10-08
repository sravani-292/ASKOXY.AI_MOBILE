export type Role = "user" | "assistant";

export type ChatMessage = {
  role: Role;
  text: string;
  timestamp: string;
};

export type LanguageConfig = {
  code: string;
  nativeName: string;
  name: string;
  flag?: string;
  assistantName?: string;
  imageUrl?: string;
  speechLang?: string;
};

export const LANGUAGES: LanguageConfig[] = [
  { code: "en", nativeName: "English", name: "English", flag: "🇬🇧", assistantName: "Smaira", speechLang: "en-US" },
  { code: "hi", nativeName: "हिन्दी", name: "Hindi", flag: "🇮🇳", assistantName: "Praigya", speechLang: "hi-IN" },
  { code: "te", nativeName: "తెలుగు", name: "Telugu", flag: "🇮🇳", assistantName: "Priya", speechLang: "te-IN" },
];