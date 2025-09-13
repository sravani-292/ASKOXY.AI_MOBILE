// ✅ FUNCTIONAL SUMMARY
// This screen shows a scrollable list of AI Masterclass videos on mobile.
// - Displays YouTube thumbnails with titles & descriptions
// - On tap, plays the video inside a WebView (autoplay enabled)
// - Shows a loading spinner until the video loads
// - Uses SafeAreaView + FlatList (for better performance on large video lists)

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.92;
const CARD_HEIGHT = 220;

const videos = [
  {
    id: "L4FEg97j0y4",
    title: "AI Prompt Engineer — No Coding",
    description:
      "Kickstart your GenAI journey with this free masterclass! Learn prompt engineering, explore AI’s future, and join 1M+ coders — no coding required. 🚀",
  },
  {
    id: "6KbsbrJWagk",
    title: "Generative AI Market — $1.5 Trillion",
    description:
      "Discover how the Generative AI market is projected to hit $1.5 Trillion by 2025 in this Free AI & GenAI Masterclass (Mission Million AI Coders).",
  },
  {
    id: "j5i8vdr0vUI",
    title: "How AI Understands Data Like the Human Brain",
    description:
      "In this Free AI & GenAI Masterclass, discover how machines transform simple 0s and 1s into powerful intelligence.",
  },
  {
    id: "VSkwxCaS0uw",
    title: "How AI Understands Text: Tokens & Embeddings",
    description:
      "Discover how AI understands language with tokens and embeddings, the core of ChatGPT and GenAI. Ideal for beginners, students, professionals.",
  },
  {
    id: "F_s-apltHsA",
    title: "potting Patterns in AI Output",
    description:
      "Learn to spot patterns in AI text, improve prompts, and boost GenAI skills. Perfect for beginners, students, and professionals.",
  },
  {
    id: "YpvvhhZzsfg",
    title: "Inside a GPU – Where AI Really Lives",
    description:
      "Discover how GPUs power ChatGPT and GenAI. Learn cloud AI, hardware basics, and unlock future skills with Mission Million AI Coders.",
  },
  {
    id: "YTxKHsTLpwM",
    title: "AI Careers Unlocked – Meet the Team Behind GenAI",
    description:
      "Explore AI project roles—engineers, designers, testers, and trainers. Discover where you fit in GenAI with Mission Million AI Coders.",
  },
  {
    id: "x9IP_p6Mpd4",
    title: "Master RAG: Retrieval-Augmented Generation for Smarter AI",
    description:
      "Learn how RAG blends search with generation, improving AI accuracy. Discover its power in compliance, legal, and enterprise workflows.",
  },
  {
    id: "4qmIPsy1jHs",
    title: "Inside AI Memory: How Vectors Power Instant Answers",
    description:
      "Explore how AI stores and retrieves data with vector databases—fueling RAG, chatbots, and image search with real-time intelligence.",
  },
  {
    id: "csv-rCOTlMY",
    title: "Top Generative AI Tools to Master in 2025",
    description:
      "Discover GPT, Claude, Midjourney, DALL·E, Whisper, Runway, and Sora—AI tools transforming text, art, speech, and video creation today.",
  },
  {
    id: "GW5CZgZwNyc",
    title: "What is an LLM? Masterclass on Large Language Models",
    description:
      "Learn how LLMs like GPT-4, Claude, and Gemini work. Understand training, prediction, and prompt power in this AI masterclass",
  },
  {
    id: "BcvaxM0cfF0",
    title: "Top Programming Languages for LLM Development in 2025",
    description:
      "Discover Python, JavaScript, Go, and Rust — the essential languages behind AI and LLMs. Perfect for developers, students, and prompt engineers.",
  },
  {
    id: "KfZAAG0fsFE",
    title: "What is Prompt Engineering & Why It Matters",
    description:
      "Learn to craft effective prompts that improve AI responses, boost accuracy, unlock creativity, and master communication with ChatGPT and GenAI tools.",
  },
  {
    id: "mwXB3YjyNBA",
    title: "Chain of Thought Prompting: Make AI Think Step by Step",
    description:
      "Discover how Chain of Thought prompting improves AI reasoning, solves complex tasks, ensures transparency, and enhances structured problem-solving with GenAI tools.",
  },
  {
    id: "43WiDqpD0qw",
    title: "Prompt Engineering Masterclass: Future-Proof Your AI Skills",
    description:
      "Learn why prompt engineering is the next 25-year AI skill—unlock jobs, boost productivity, spark innovation, and shape tomorrow’s tech revolution.",
  },
  {
    id: "D9B1YBhPh_k",
    title: "Why Prompt Engineering Matters in the AI Era",
    description:
      "Prompt engineering bridges humans and AI—unlocking creativity, jobs, and innovation without coding. Master it to thrive in tomorrow’s AI-driven world.",
  },
  {
    id: "7MZGyEQ_PcE",
    title: "Capabilities of Microservices in Modern AI Platforms",
    description:
      "Microservices boost scalability, flexibility, and innovation by splitting apps into independent services—ideal for AI, cloud-native, and future-ready systems.",
  },
  {
    id: "Cg3yTHimojo",
    title: "5 Traits That Make a Great AI Prompt Engineer",
    description:
      "Great prompt engineers think critically, simplify complex ideas, test patiently, stay curious, and communicate clearly—future-ready skills for AI success.",
  },
  {
    id: "KfaUURipNoo",
    title: "Unlock AI Mastery with the 3-Part Prompt Formula",
    description:
      "Master the System–User–Assistant structure to shape AI behavior, refine instructions, iterate responses, and solve complex problems effectively every time..",
  },
  {
    id: "h4Gy5zyHwRM",
    title: "The Rise of AI Prompt Engineers",
    description:
      "Discover how prompt engineering empowers coders, writers, designers, and analysts, creating hybrid roles that boost productivity and future careers.",
  },
  {
    id: "SG8zP3xtG1Q",
    title: "Prompt Templates: Reuse, Remix, Repeat",
    description:
      "Learn to create, scale, and monetize AI prompt templates—boost productivity with reusable frames, variables, automation, and workflow consistency.",
  },
  {
    id: "2RURIZBUXt8",
    title: "Prompt Engineering Kit – Must-Have Tools for 2025",
    description:
      "Discover the essential toolkit every prompt engineer needs—research, testing, visuals, and sharing tools to level up AI workflows.",
  },
  {
    id: "4mcec9IfTw4",
    title: "Zero-Shot, One-Shot & Few-Shot Prompts Explained",
    description:
      "Learn the 3 core prompt types—zero, one, and few-shot—to guide AI outputs, improve accuracy, tone, and real-world results..",
  },
  {
    id: "ogrmL91njEU",
    title: "Can AI Get a Virus? Securing Your Prompts",
    description:
      "Discover prompt injection risks, jailbreak attacks, and safety tips to secure GenAI workflows, ensuring smarter, safer, and controlled AI use.",
  },
  {
    id: "bw4FTsxMa_E",
    title: "Debugging Prompts Like a Pro",
    description:
      "Master prompt debugging with clarity, precision, and structure — fix broken prompts fast to get accurate, reliable AI results every time.",
  },
  {
    id: "Ym0ZYTpcPTg",
    title: "Prompting Mistakes to Avoid",
    description:
      "Avoid vague prompts, multi-questions, and weak roles — fix mistakes to unlock clear, powerful AI responses every time.",
  },
  {
    id: "yebcT_p_5H8",
    title: "Prompt vs Completion – Know the Difference",
    description:
      "Learn how clear prompts shape AI completions. Master prompt vs response basics to boost clarity, automation, and GenAI results.",
  },
  {
    id: "LP_IicZEHYs",
    title: "From Average to Awesome: Upgrading Your Prompts",
    description:
      "Discover how to refine prompts with roles, examples, and style. Transform vague instructions into powerful GenAI outputs that truly impress.",
  },
  {
    id: "iZqil5BK1Wo",
    title: "Your First 5 Prompts – Get Started Today",
    description:
      "Kickstart your GenAI journey with 5 beginner-friendly prompts for emails, resumes, brainstorming, and more. Start mastering AI today!",
  },
  {
    id: "hhTOxiKF1KY",
    title: "Platforms & Niches for Prompt Engineers",
    description:
      "Discover top freelancing platforms, explore profitable niches, and learn how to monetize your AI prompt skills in today’s booming economy.",
  },
  {
    id: "MYPZWzu2DJM",
    title: "How to Earn as a Prompt Engineer",
    description:
      "Learn practical ways to monetize prompt engineering — from freelancing and prompt libraries to AI workflows and automation opportunities.",
  },
  {
    id: "bnYzu5j7ohs",
    title: "Creating Prompt Products – Templates & Packs",
    description:
      "Learn to transform prompt skills into digital products — resume packs, email templates, classroom prompts, and micro-products for growing AI income.",
  },
  {
    id: "1Bs5YeezU_Y",
    title: "Teaching Prompting to Others – Become a Mentor",
    description:
      "Share prompts, tutorials, and workshops to mentor beginners, strengthen your skills, and grow visibility while inspiring future AI learners.",
  },
  {
    id: "wJT9P-3lTOM",
    title: "Graduation Session – Step Into Your Next AI Journey",
    description:
      "Apply AI skills in real life, mentor others, join communities, and begin building, earning, and teaching with purpose.",
  },
  {
    id: "ZnERBfMN8Vc",
    title: "Build Your Prompt Portfolio – Showcase Your AI Skills",
    description:
      "Create a professional portfolio with examples, results, and improvements to demonstrate your prompt engineering expertise and impact.",
  },
  {
    id: "eVti8ARpO98",
    title: "Explore Career Opportunities in Prompt Engineering",
    description:
      "Discover high-demand AI careers for prompt engineers, from content strategist to chatbot designer, even without coding experience.",
  },
  {
    id: "BNa1FDaERc4",
    title: "Level Up Your Prompting Skills into an AI Career",
    description:
      "Advance from basic prompts to AI consulting expertise: optimize workflows, build libraries, train teams, and become a Prompt Architect.",
  },
  {
    id: "3AaF0VepqT8",
    title: "Master Instructional Prompts – Level 2 AI & GenAI Masterclass",
    description:
      "Learn to give clear, structured AI instructions, automate tasks, and boost productivity with instructional prompts for smarter outputs",
  },
  {
    id: "8KG3eJWGauA",
    title: "Level 1: Ad Hoc Prompting – Start Your AI Journey",
    description:
      "Learn the basics of casual AI prompting, its limits, and how to transition to structured, scalable prompt engineering.",
  },
  {
    id: "6VqxOOk2IkE",
    title: "Evaluated Prompting – Improve AI Accuracy & Reliability",
    description:
      "Learn to assess AI outputs, score effectiveness, refine prompts, and build trust for professional-level AI prompt engineering.",
  },
  {
    id: "vzMwzErB3i0",
    title:
      "Level 4: Precision Prompting – Smarter, Faster, Reliable AI Outputs",
    description:
      "Master structured prompts, reduce AI errors, guide with context, and achieve consistent, optimized outputs for smarter AI results.",
  },
  {
    id: "fJpyURIUXs0",
    title: "Advanced AI Agents & Copilots – Automate, Decide, Execute",
    description:
      "Learn to create AI agents and copilots, orchestrate workflows, enable decision-making, and unlock enterprise-level automation with GenAI.",
  },
].map((v) => ({
  ...v,
  thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
  url: `https://www.youtube.com/embed/${v.id}`,
}));

export default function OurAIVideosMobile() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const renderVideoCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.videoContainer}>
        {activeVideo === item.id ? (
          <>
            {loading && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
            <WebView
              source={{ uri: item.url + "?autoplay=1" }}
              style={{ flex: 1 }}
              onLoad={() => setLoading(false)}
            />
          </>
        ) : (
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              setActiveVideo(item.id);
              setLoading(true);
            }}
          >
            <Image
              source={{ uri: item.thumbnail }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            <View style={styles.playButton}>
              <Ionicons name="play-circle" size={60} color="#6b21a8" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>
        Unlock Your AI Potential with Our Masterclasses
      </Text>
      <Text style={styles.subheading}>
        Dive into expertly crafted AI masterclasses on cutting-edge technologies,
        tools, and strategies. Learn AI for tomorrow.
      </Text>

      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={renderVideoCard}
        contentContainerStyle={{ paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 14,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4c1d95",
    textAlign: "center",
    marginTop: 16,
  },
  subheading: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
    width: CARD_WIDTH,
    alignSelf: "center",
    overflow: "hidden",
  },
  videoContainer: {
    height: CARD_HEIGHT,
    backgroundColor: "#000",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    top: "40%",
    left: "40%",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5b21b6",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#4b5563",
  },
});
