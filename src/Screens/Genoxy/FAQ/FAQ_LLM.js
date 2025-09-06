import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Sample FAQ data (replace with your full FAQ_SECTIONS)
const FAQ_SECTIONS = [
  {
    key: "basics",
    title: "LLM Basics",
    questions: [
      {
        q: "Q1. What is an LLM?",
        a: "An LLM (Large Language Model) is an AI system trained on massive text datasets to understand, generate, and reason in natural language. It adapts to context instead of following fixed scripts, making it far more flexible than chatbots.",
      },
      {
        q: "Q2. How is an LLM different from chatbots?",
        a: "Chatbots follow pre-coded rules or decision trees, so answers are limited. LLMs generate dynamic responses, reason with context, and can handle unpredictable queries — essential for complex domains like Insurance.",
      },
      {
        q: "Q3. What is RAG?",
        a: "Retrieval Augmented Generation (RAG) combines external data retrieval with model reasoning. The system fetches relevant documents, passes them to the LLM, and generates grounded answers. It reduces hallucinations but is only one piece of a complete domain LLM system.",
      },
      {
        q: "Q4. What is fine-tuning?",
        a: "Fine-tuning updates a pretrained model's weights using domain-specific data, teaching it patterns and style permanently. Example: training on thousands of Insurance FAQs so the model speaks in an Insurance-specific way.",
      },
      {
        q: "Q5. What is pretraining?",
        a: "Pretraining builds a foundation model from scratch on trillions of tokens (like GPT-4, Claude). It requires huge datasets and GPU clusters, and is only feasible for big tech labs.",
      },
      {
        q: "Q6. What is data grounding?",
        a: "Data grounding means feeding a model with your trusted, structured data at query time. Instead of 'guessing,' the LLM answers based on insurance regulations, filings, or company documents.",
      },
      {
        q: "Q7. What is ontology in AI?",
        a: "An ontology is a structured map of relationships. In Insurance, it links Company → Product → Variant → Features → Exclusions → Claims, ensuring answers are precise and consistent.",
      },
      {
        q: "Q8. What is wrapper vs system?",
        a: "A wrapper just connects a chatbot to a model API. A system (like Insurance LLM) includes data pipelines, ontology, tools, compliance, and evaluation frameworks — built for production.",
      },
      {
        q: "Q9. Why not build from scratch?",
        a: "Training a foundation model needs billions in investment. Domain builders like us achieve more impact by grounding existing models with regulatory-grade insurance data.",
      },
      {
        q: "Q10. What is a foundation model?",
        a: "A foundation model is a giant pretrained model (e.g., GPT, Claude, LLaMA, Mistral) that can be adapted for specific domains. It is the 'brain' we build on.",
      },
      {
        q: "Q11. How much data do LLMs need?",
        a: "Foundation models need trillions of tokens. But a domain LLM system needs far less — typically 10,000–1,000,000 carefully curated domain documents with structured metadata.",
      },
      {
        q: "Q12. Why does Insurance need an LLM?",
        a: "Insurance policies are complex, full of exclusions, and difficult to compare. An Insurance LLM simplifies policy discovery, explains coverage clearly, and ensures compliance with regulators.",
      },
      {
        q: "Q13. Why OpenAI, Hugging Face, Ollama?",
        a: "OpenAI: Fast testing, reliable infra. Hugging Face: Commercial-grade deployment & fine-tuning. Ollama: Lightweight local runs for prototyping.",
      },
      {
        q: "Q14. What is a commercial-grade model?",
        a: "A commercial-grade model is enterprise-ready: reliable, scalable, secure, compliant, and affordable at volume. It's designed for production use, unlike research-only open weights.",
      },
      {
        q: "Q15. Are we exposing PII?",
        a: "No. We mask sensitive data, enforce audit logs, and ensure Indian data residency per IRDAI and RBI guidelines.",
      },
      {
        q: "Q16. What is evaluation in LLMs?",
        a: "Evaluation means testing LLM responses against a gold standard. We use 1,000+ insurance test prompts daily to measure accuracy, hallucinations, and compliance.",
      },
      {
        q: "Q17. How do hallucinations happen?",
        a: "LLMs sometimes generate plausible but wrong answers if they lack data. Grounding with insurance filings, laws, and ontology reduces this risk.",
      },
      {
        q: "Q18. What is latency vs accuracy?",
        a: "Latency = response time. Accuracy = correctness. Faster responses sometimes skip deep retrieval; we balance both using hybrid search and caching.",
      },
      {
        q: "Q19. What is inference cost?",
        a: "It's the cost of tokens processed for each query. Tracking cost/session helps optimize usage and avoid unsustainable spending.",
      },
      {
        q: "Q20. What is JSON structured output?",
        a: "Instead of free text, answers are returned in JSON fields like {policy_name, exclusions[], claims_steps[]}. This ensures machine readability and reliable integration with tools.",
      },
    ],
  },
  {
    key: "platforms",
    title: "Platforms & Tools",
    questions: [
      {
        q: "Q21. Why use OpenAI APIs?",
        a: "OpenAI APIs let us validate ideas quickly with enterprise-grade reliability. It's our Phase-1 platform before scaling to custom commercial models.",
      },
      {
        q: "Q22. Why Hugging Face?",
        a: "Hugging Face allows model hosting, fine-tuning, and private deployments. It's suitable for Phase-2, when we need commercial independence and control.",
      },
      {
        q: "Q23. Why Ollama?",
        a: "Ollama runs models locally on laptops or servers. It's great for testing pipelines offline but not suitable for commercial-grade deployment.",
      },
      {
        q: "Q24. OpenAI vs Hugging Face?",
        a: "OpenAI = API-first, closed model, fast validation. Hugging Face = open-source hosting, fine-tune support, enterprise flexibility. Together, they form a phased roadmap.",
      },
      {
        q: "Q25. Why not use only free models?",
        a: "Free models often lack compliance, reliability, and support. For Insurance, regulatory trust demands enterprise-grade, well-managed models.",
      },
      {
        q: "Q26. Which models do we plan to use?",
        a: "We plan to use GPT, Claude, LLaMA, and Mistral depending on cost, compliance, and accuracy needs. The mix ensures flexibility and scalability.",
      },
      {
        q: "Q27. What is LoRA fine-tuning?",
        a: "LoRA (Low-Rank Adaptation) fine-tunes only a small set of model parameters, making it faster and cheaper. It's ideal for domain-specific tasks like Insurance.",
      },
      {
        q: "Q28. What is embedding & vector DB?",
        a: "Embeddings turn text into numerical vectors that capture meaning. A vector database stores these for semantic search, helping the system find relevant insurance passages.",
      },
      {
        q: "Q29. What is hybrid search?",
        a: "Hybrid search combines keyword search with vector similarity search. This ensures retrieval is both precise (keywords) and context-rich (semantic meaning).",
      },
      {
        q: "Q30. Why do we need ontology?",
        a: "Insurance data is messy and fragmented. Ontology organizes it into structured relationships, ensuring retrieval maps directly to insurance products, exclusions, and claims.",
      },
      {
        q: "Q31. What are evaluation prompts?",
        a: "Evaluation prompts are a fixed set of test queries used daily. They help measure accuracy, coverage, hallucinations, and system stability.",
      },
      {
        q: "Q32. How do you run 1,000 test packs?",
        a: "We maintain a gold-answer dataset of 1,000+ prompts across insurance categories. Daily regression runs track hit-rate, accuracy, and error patterns.",
      },
      {
        q: "Q33. Why JSON/function calling?",
        a: "JSON outputs ensure answers are structured and machine-readable. Function calling enables integration with calculators, comparers, and claims APIs.",
      },
      {
        q: "Q34. Why compliance guardrails?",
        a: "Insurance is highly regulated. Guardrails like audit logs, citations, disclaimers, and refusal triggers prevent mis-selling and ensure IRDAI alignment.",
      },
      {
        q: "Q35. How does caching help?",
        a: "Caching stores frequent queries and results, reducing cost and speeding up responses. For Insurance, common FAQs benefit greatly from caching.",
      },
    ],
  },
  {
    key: "domain",
    title: "Insurance Domain",
    questions: [
      {
        q: "Q36. What is IRDAI?",
        a: "IRDAI (Insurance Regulatory and Development Authority of India) regulates all insurers. It protects policyholders, enforces solvency, and ensures fair practices.",
      },
      {
        q: "Q37. What are types of insurance?",
        a: "Insurance splits into Life Insurance (covers human life) and General Insurance (covers risks like health, motor, property, travel, liability, etc.).",
      },
      {
        q: "Q38. Difference between Life & General Insurance?",
        a: "Life Insurance pays a fixed benefit on death or maturity. General Insurance covers loss or damage to assets, health, or liability risks.",
      },
      {
        q: "Q39. What is Motor Insurance?",
        a: "Motor Insurance covers vehicle damage and third-party liability. In India, third-party motor insurance is legally mandatory for all vehicle owners.",
      },
      {
        q: "Q40. What is Health Insurance?",
        a: "Health Insurance covers hospitalization, surgeries, and critical illnesses. It protects individuals from unexpected medical expenses and is regulated under IRDAI guidelines.",
      },
      {
        q: "Q41. What is Travel Insurance?",
        a: "Travel Insurance protects against trip cancellations, medical emergencies abroad, and baggage losses. It's especially valuable for students and frequent travelers.",
      },
      {
        q: "Q42. What is Property Insurance?",
        a: "Property Insurance covers risks to buildings, homes, or offices. It safeguards against fire, theft, or natural calamities.",
      },
      {
        q: "Q43. What is Fire Insurance?",
        a: "Fire Insurance specifically protects property against losses caused by fire. It's widely used by businesses, factories, and homeowners.",
      },
      {
        q: "Q44. What is Marine Insurance?",
        a: "Marine Insurance covers goods in transit by sea, air, or land. It's critical for exporters, importers, and logistics providers.",
      },
      {
        q: "Q45. What is Crop Insurance?",
        a: "Crop Insurance protects farmers from crop loss due to drought, floods, or pests. In India, schemes like PMFBY make it affordable.",
      },
      {
        q: "Q46. What is Liability Insurance?",
        a: "Liability Insurance covers legal liabilities if a person or company causes injury, damage, or loss to others. Businesses often use it for protection.",
      },
      {
        q: "Q47. What are miscellaneous covers?",
        a: "Miscellaneous Insurance covers niche risks like burglary, pets, personal accidents, and cyber threats. These are add-ons or standalone policies.",
      },
      {
        q: "Q48. What is a Sum Assured?",
        a: "The sum assured is the guaranteed amount an insurer pays under a policy. In Life Insurance, it's the fixed payout on death or maturity.",
      },
      {
        q: "Q49. What is a Waiting Period?",
        a: "The waiting period is the time you must wait before certain benefits activate in a Health Insurance policy. Commonly applies to pre-existing conditions.",
      },
      {
        q: "Q50. What are Exclusions?",
        a: "Exclusions are conditions or scenarios not covered by a policy. For example, cosmetic surgery or self-inflicted injuries are common exclusions in Health Insurance.",
      },
      {
        q: "Q51. How do claims work?",
        a: "The policyholder submits a claim with documents (policy copy, bills, certificates). The insurer verifies, processes, and pays out as per policy terms.",
      },
      {
        q: "Q52. What are Riders?",
        a: "Riders are optional add-ons to enhance insurance coverage, such as accidental death, critical illness, or hospital cash benefits. They give flexibility at low cost.",
      },
      {
        q: "Q53. What is Reinsurance?",
        a: "Reinsurance is insurance for insurers. Companies transfer part of their risk to other insurers, ensuring financial stability during large claim events.",
      },
      {
        q: "Q54. What is IRDA Sandbox?",
        a: "The IRDAI Sandbox allows insurers to test innovative products in a controlled environment before large-scale launch. It supports innovation with regulatory oversight.",
      },
      {
        q: "Q55. What is SEBI's role in insurance?",
        a: "SEBI regulates the investment side of insurance products like ULIPs. It ensures transparency, protects investors, and prevents mis-selling of market-linked policies.",
      },
      {
        q: "Q56. How does RBI intersect with insurance?",
        a: "RBI governs banks that sell insurance through bancassurance. It also regulates lending practices where insurance is bundled with loans.",
      },
      {
        q: "Q57. What is ROC's relevance in insurance?",
        a: "The Registrar of Companies ensures insurers comply with company law. Insurers must file annual reports, financials, and governance disclosures with ROC.",
      },
      {
        q: "Q58. What is IBBI's role in insurance?",
        a: "The Insolvency and Bankruptcy Board of India handles cases where insurers or related entities face financial distress, protecting policyholder interests.",
      },
      {
        q: "Q59. What is the Insurance Act?",
        a: "The Insurance Act provides the legal framework for insurance operations in India. It covers licensing, solvency, claims, and policyholder rights.",
      },
      {
        q: "Q60. How does Company Law overlap with Insurance Law?",
        a: "Insurers must comply with both insurance regulations and company law. For example, IRDAI sets product rules while ROC ensures governance compliance.",
      },
    ],
  },
  {
    key: "system",
    title: "Our Insurance LLM System",
    questions: [
      {
        q: "Q61. What is Insurance LLM?",
        a: "Insurance LLM is a domain-specific AI system built on foundation models, enriched with insurance data, ontology, tools, and compliance features for accurate Q&A.",
      },
      {
        q: "Q62. Why not call it RAG?",
        a: "Because RAG is just retrieval + generation. Our system adds ontology, structured outputs, compliance, evaluations, and workflows, making it a complete Insurance LLM.",
      },
      {
        q: "Q63. Why not call it a wrapper?",
        a: "Wrappers only connect to APIs. We integrate data pipelines, domain-specific tools, and regulatory compliance, which makes it a robust LLM system.",
      },
      {
        q: "Q64. Are we training from scratch?",
        a: "No. Training from scratch requires billions in resources. Instead, we ground existing models with insurance data for faster, practical outcomes.",
      },
      {
        q: "Q65. Are we fine-tuning models?",
        a: "Not yet. Currently, we ground data. In future phases, we may fine-tune models for efficiency, cost optimization, and domain tone.",
      },
      {
        q: "Q66. Are we grounding data?",
        a: "Yes. We transform raw regulatory and company data into structured ontology and feed it into LLM pipelines for accurate answers.",
      },
      {
        q: "Q67. How do we source data?",
        a: "We source data from IRDAI, insurers, ROC, RBI, SEBI, IBBI, Insurance Acts, and other official filings to ensure credibility.",
      },
      {
        q: "Q68. How is data cleaned?",
        a: "Raw PDFs and filings are parsed, normalized, and mapped into structured fields. Noise is removed, and metadata (dates, sources) is tagged for trust.",
      },
      {
        q: "Q69. How is data chunked?",
        a: "Data is divided by logical sections (eligibility, benefits, exclusions, claims). This avoids splitting mid-sentence and ensures retrieval relevance.",
      },
      {
        q: "Q70. How is ontology built?",
        a: "We map relationships: Insurer → Product → Plan → Features → Exclusions → Claims → Regulations. Ontology provides structured, queryable knowledge.",
      },
      {
        q: "Q71. What tools are integrated?",
        a: "Policy comparison, premium calculator, eligibility checker, claim process explainer, and glossary. These go beyond plain text answers.",
      },
      {
        q: "Q72. How do evaluations run?",
        a: "We run 1,000+ queries daily across health, motor, travel, property, and liability. Gold answers are compared to outputs, tracking hit rate and accuracy.",
      },
      {
        q: "Q73. How do we ensure compliance?",
        a: "We provide citations, disclaimers, and audit logs. Sensitive data is masked. Answers align with IRDAI and other regulator guidelines.",
      },
      {
        q: "Q74. How do we ensure accuracy?",
        a: "We use hybrid retrieval, ontology alignment, and gold-answer comparisons. Responses failing accuracy checks are flagged for improvement.",
      },
      {
        q: "Q75. How do we measure hallucination rates?",
        a: "We compare outputs against ground truth. Any fabricated or unsupported answers count as hallucinations. Our target is ≤2% hallucination rate.",
      },
      {
        q: "Q76. What is our daily scorecard?",
        a: "We track accuracy, hallucination rate, retrieval hit-rate, latency, cost per session, and lead conversions. This ensures daily visibility into system health.",
      },
      {
        q: "Q77. What is the business outcome?",
        a: "The Insurance LLM improves policy discovery, reduces mis-selling, builds regulator trust, and generates leads for insurers. It creates measurable business value.",
      },
      {
        q: "Q78. Who benefits from the Insurance LLM?",
        a: "Regulators get transparency, insurers reduce servicing costs, agents get sales support, and customers gain clarity and confidence in policies.",
      },
      {
        q: "Q79. Why build domain LLMs instead of generic ones?",
        a: "Generic models lack compliance and domain precision. Domain LLMs capture regulatory rules and product details, making them production-ready for critical industries.",
      },
      {
        q: "Q80. Why start with Insurance first?",
        a: "Insurance is complex, data-rich, and highly regulated — an ideal testbed. Success here creates reusable frameworks for other BFSI domains.",
      },
    ],
  },
  {
    key: "business",
    title: "Business, Scale & Vision",
    questions: [
      {
        q: "Q81. Why are we building this?",
        a: "Because insurance discovery is broken. Customers are confused, regulators seek transparency, and insurers need efficient servicing — an LLM solves all.",
      },
      {
        q: "Q82. Why not stop at wrappers?",
        a: "Wrappers don't scale in production. They fail at compliance, accuracy, and structured responses, which are non-negotiable in Insurance.",
      },
      {
        q: "Q83. How is this different from chatbots?",
        a: "Chatbots follow scripts. Our LLM reasons, compares, explains exclusions, and integrates with tools like calculators — making it intelligent and flexible.",
      },
      {
        q: "Q84. How will this scale to 1,00,000+ policies?",
        a: "Through automated ingestion pipelines, ontology mapping, and scalable retrieval layers. This ensures continuous coverage of insurers and products.",
      },
      {
        q: "Q85. What's the roadmap after Insurance?",
        a: "We plan to extend the framework into Loans LLM, Jobs LLM, and Legal LLM, creating a BFSI-focused ecosystem of domain LLMs.",
      },
      {
        q: "Q86. How will customers benefit?",
        a: "They can easily compare policies, avoid mis-selling, and get transparent explanations of exclusions, claims, and benefits.",
      },
      {
        q: "Q87. How will regulators benefit?",
        a: "They gain access to an auditable, transparent system where policy data is structured, cited, and validated against regulatory filings.",
      },
      {
        q: "Q88. How will insurers benefit?",
        a: "They reduce servicing costs, improve customer trust, and gain better lead-to-policy conversion rates.",
      },
      {
        q: "Q89. What's the revenue model?",
        a: "Revenue comes from lead generation, API licensing, insurer partnerships, compliance dashboards, and premium services.",
      },
      {
        q: "Q90. What's the compliance framework?",
        a: "We align with IRDAI for insurance, RBI for financial linkages, SEBI for investment products, and IBBI/ROC for legal frameworks.",
      },
      {
        q: "Q91. How is data residency ensured?",
        a: "Insurance data is stored and processed in India, as per IRDAI and Indian data protection laws.",
      },
      {
        q: "Q92. How do we ensure trust?",
        a: "Every answer includes citations, disclaimers, and audit logs. This builds regulator and user confidence.",
      },
      {
        q: "Q93. Why not wait for big tech giants?",
        a: "Big tech often waits for domain players to prove real-world use cases. Our head start ensures early ownership of the Insurance space.",
      },
      {
        q: "Q94. Why do domain-led LLMs win?",
        a: "They solve niche problems with compliance-grade accuracy. Giants build broad tools, while domain LLMs dominate in regulated industries.",
      },
      {
        q: "Q95. How will this become a billion-dollar company?",
        a: "By scaling across Insurance, Loans, Jobs, and Legal, with reusable LLM infrastructure and partnerships with BFSI institutions.",
      },
      {
        q: "Q96. How will APIs integrate?",
        a: "We integrate with insurer APIs for premium calculations, quotes, claims status, and policy issuance.",
      },
      {
        q: "Q97. How will cost per query reduce over time?",
        a: "Through caching, fine-tuning, hybrid model use (large + small), and query optimization.",
      },
      {
        q: "Q98. How will multi-language support work?",
        a: "We'll fine-tune models for Indian languages, enabling insurance discovery in Hindi, Telugu, Tamil, Bengali, and more.",
      },
      {
        q: "Q99. How will system updates be handled?",
        a: "New data from IRDAI and insurers will be re-ingested regularly, with version tracking and freshness indicators.",
      },
      {
        q: "Q100. Why us, why now?",
        a: "We have 25+ years of BFSI tech expertise, regulatory trust, and timing advantage in the AI wave — making us uniquely positioned.",
      },
    ],
  },
];

export default function FaqLLMMobile() {
  // Flatten all sections into one list
  const flatAll = useMemo(
    () =>
      FAQ_SECTIONS.flatMap((sec) =>
        sec.questions.map((q) => ({ ...q, _section: sec.title }))
      ),
    []
  );

  const [expanded, setExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("all"); // "all" | "page"
  const [activePage, setActivePage] = useState(1);

  const pages = useMemo(() => {
    let arr = [];
    for (let p = 1; p <= 10; p++) {
      arr.push({ page: p, start: (p - 1) * 10 + 1, end: p * 10 });
    }
    return arr;
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery) return flatAll;
    const query = searchQuery.toLowerCase();
    return flatAll.filter(
      (item) =>
        item.q.toLowerCase().includes(query) ||
        item.a.toLowerCase().includes(query) ||
        item._section.toLowerCase().includes(query)
    );
  }, [flatAll, searchQuery]);

  const pageSlice = useMemo(() => {
    const meta = pages.find((p) => p.page === activePage);
    const getNum = (q) => parseInt(q.replace(/[^0-9]/g, ""), 10);
    return filtered.filter((it) => {
      const k = getNum(it.q);
      return k >= meta.start && k <= meta.end;
    });
  }, [filtered, pages, activePage]);

  const itemsToRender = viewMode === "all" ? filtered : pageSlice;

  const toggleExpand = (q) => {
    LayoutAnimation.easeInEaseOut();
    setExpanded(expanded === q ? null : q);
  };

  const copyText = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.questionRow}
        onPress={() => toggleExpand(item.q)}
      >
        <Ionicons name="document-text" size={20} color="#2563eb" />
        <Text style={styles.questionText}>{item.q}</Text>
        <Ionicons
          name={expanded === item.q ? "chevron-up" : "chevron-down"}
          size={18}
          color="#6b7280"
        />
      </TouchableOpacity>

      {expanded === item.q && (
        <View style={styles.answerBox}>
          <Text style={styles.answerText}>{item.a}</Text>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => copyText(`${item.q}\n\n${item.a}`)}
          >
            <Ionicons name="copy-outline" size={16} color="#374151" />
            <Text style={styles.copyText}> Copy Q&A </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <Text style={styles.heading}>Insurance AI LLM FAQ</Text>
        <Text style={styles.subheading}>
          Get answers about Large Language Models and Insurance AI.
        </Text>

        {/* Search Bar */}
        <TextInput
          style={styles.search}
          placeholder="Search FAQs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Mode Switch */}
        <View style={styles.modeSwitch}>
          <TouchableOpacity
            onPress={() => setViewMode("all")}
            style={[
              styles.modeBtn,
              viewMode === "all" && styles.modeBtnActive,
            ]}
          >
            <Text
              style={[
                styles.modeText,
                viewMode === "all" && styles.modeTextActive,
              ]}
            >
              Show All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode("page")}
            style={[
              styles.modeBtn,
              viewMode === "page" && styles.modeBtnActive,
            ]}
          >
            <Text
              style={[
                styles.modeText,
                viewMode === "page" && styles.modeTextActive,
              ]}
            >
              Page Mode
            </Text>
          </TouchableOpacity>
        </View>

        {/* FAQ List */}
        <FlatList
          data={itemsToRender}
          keyExtractor={(item) => item.q}
          renderItem={renderItem}
          scrollEnabled={false}
        />

        {/* Pagination */}
        {viewMode === "page" && (
          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={() => setActivePage(Math.max(1, activePage - 1))}
            >
              <Ionicons name="chevron-back" size={22} color="#374151" />
            </TouchableOpacity>
            <Text>
              Page {activePage} of {pages.length}
            </Text>
            <TouchableOpacity
              onPress={() => setActivePage(Math.min(10, activePage + 1))}
            >
              <Ionicons name="chevron-forward" size={22} color="#374151" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 12 },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
    marginVertical: 12,
  },
  subheading: {
    textAlign: "center",
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    overflow: "hidden",
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
  },
  questionText: { flex: 1, marginLeft: 8, fontWeight: "600", color: "#111827" },
  answerBox: { padding: 12, borderTopWidth: 1, borderColor: "#f3f4f6" },
  answerText: { fontSize: 14, color: "#374151", marginBottom: 10 },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  copyText: { fontSize: 12, color: "#374151" },
  modeSwitch: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  modeBtn: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  modeBtnActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  modeText: { color: "#374151", fontWeight: "500" },
  modeTextActive: { color: "#fff" },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 14,
    alignItems: "center",
  },
});
