import React, { useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

const { width } = Dimensions.get("window");

const SLIDES = [
    {
    q: "Q1. What is an LLM?",
    a: "An LLM (Large Language Model) is an AI system trained on massive text datasets to understand, generate, and reason in natural language. It adapts to context instead of following fixed scripts, making it far more flexible than chatbots.",
    imgs: ["https://i.ibb.co/7NQ8Xn7T/Q1-What-is-an-LLM.jpg"],
  },
  {
    q: "Q2. How is an LLM different from chatbots?",
    a: "Chatbots follow pre-coded rules or decision trees, so answers are limited. LLMs generate dynamic responses, reason with context, and can handle unpredictable queries — essential for complex domains like Insurance.",
    imgs: ["https://i.ibb.co/YTt6dMfb/Chatbots-vs-Large-Language-Models-2.png"],
  },
  {
    q: "Q3. What is RAG?",
    a: "Retrieval Augmented Generation (RAG) combines external data retrieval with model reasoning. The system fetches relevant documents, passes them to the LLM, and generates grounded answers. It reduces hallucinations but is only one piece of a complete domain LLM system.",
    imgs: ["https://i.ibb.co/Y78rWBqm/Q3-What-is-RAG.png"],
  },
  {
    q: "Q4. What is fine-tuning?",
    a: "Fine-tuning updates a pretrained model’s weights using domain-specific data, teaching it patterns and style permanently. Example: training on thousands of Insurance FAQs so the model speaks in an Insurance-specific way.",
    imgs: ["https://i.ibb.co/WN4LfSvv/Fine-tuning-for-Insurance-Domain.png"],
  },
  {
    q: "Q5. What is pretraining?",
    a: "Pretraining builds a foundation model from scratch on trillions of tokens (like GPT-4, Claude). It requires huge datasets and GPU clusters, and is only feasible for big tech labs.",
    imgs: ["https://i.ibb.co/B29p51Zw/Q5-What-is-pretraining.png"],
  },
  {
    q: "Q6. What is data grounding?",
    a: "Data grounding means feeding a model with your trusted, structured data at query time. Instead of “guessing,” the LLM answers based on insurance regulations, filings, or company documents.",
    imgs: ["https://i.ibb.co/VYwFWTHS/6-What-is-data-grounding.png"],
  },
  {
    q: "Q7. What is ontology in AI?",
    a: "An ontology is a structured map of relationships. In Insurance, it links Company → Product → Variant → Features → Exclusions → Claims, ensuring answers are precise and consistent.",
    imgs: ["https://i.ibb.co/svrDnq8G/Q7-What-is-ontology-in-AI.png"],
  },
  {
    q: "Q8. What is wrapper vs system?",
    a: "A wrapper just connects a chatbot to a model API. A system (like Insurance LLM) includes data pipelines, ontology, tools, compliance, and evaluation frameworks — built for production.",
    imgs: ["https://i.ibb.co/HpV6z66D/Q8-What-is-wrapper-vs-system.png"],
  },
  {
    q: "Q9. Why not build from scratch?",
    a: "Training a foundation model needs billions in investment. Domain builders like us achieve more impact by grounding existing models with regulatory-grade insurance data.",
    imgs: ["https://i.ibb.co/60YPPk6b/Why-Not-Build-LLMs-from-Scratch.png"],
  },
  {
    q: "Q10. What is a foundation model?",
    a: "A foundation model is a giant pretrained model (e.g., GPT, Claude, LLaMA, Mistral) that can be adapted for specific domains. It is the “brain” we build on.",
    imgs: ["https://i.ibb.co/Q3F2b2Gz/Foundation-Models-in-AI-Explained.png"],
  },
  {
    q: "Q11. How much data do LLMs need?",
    a: "Foundation models need trillions of tokens. But a domain LLM system needs far less — typically 10,000–1,000,000 carefully curated domain documents with structured metadata.",
    imgs: ["https://i.ibb.co/0yzJPGmc/Q11-How-much-data-do-LLMs-need.png"],
  },
  {
    q: "Q12. Why does Insurance need an LLM?",
    a: "Insurance policies are complex, full of exclusions, and difficult to compare. An Insurance LLM simplifies policy discovery, explains coverage clearly, and ensures compliance with regulators.",
    imgs: ["https://i.ibb.co/84QNHV06/Q12-Why-does-Insurance-need-an-LLM.png"],
  },
  {
    q: "Q13. Why OpenAI, Hugging Face, Ollama?",
    a: "OpenAI: Fast testing, reliable infra. Hugging Face: Commercial-grade deployment & fine-tuning. Ollama: Lightweight local runs for prototyping.",
    imgs: ["https://i.ibb.co/SDBJ3C4r/Why-Open-AI-Hugging-Face-Ollama.png"],
  },
  {
    q: "Q14. What is a commercial-grade model?",
    a: "A commercial-grade model is enterprise-ready: reliable, scalable, secure, compliant, and affordable at volume. It’s designed for production use, unlike research-only open weights.",
    imgs: [
      "https://i.ibb.co/FqWpSzLN/Q-14-What-is-a-commercial-grade-model.png",
    ],
  },
  {
    q: "Q15. Are we exposing PII?",
    a: "No. We mask sensitive data, enforce audit logs, and ensure Indian data residency per IRDAI and RBI guidelines.",
    imgs: ["https://i.ibb.co/mV51ZYfR/Q15-Are-we-exposing-PII.png"],
  },
  {
    q: "Q16. What is evaluation in LLMs?",
    a: "Evaluation means testing LLM responses against a gold standard. We use 1,000+ insurance test prompts daily to measure accuracy, hallucinations, and compliance.",
    imgs: ["https://i.ibb.co/mrS7DpgH/Q16-What-is-evaluation-in-LLMs.png"],
  },
  {
    q: "Q17. How do hallucinations happen?",
    a: "LLMs sometimes generate plausible but wrong answers if they lack data. Grounding with insurance filings, laws, and ontology reduces this risk.",
    imgs: ["https://i.ibb.co/3YTgmV43/Q17-How-do-hallucinations-happen.png"],
  },
  {
    q: "Q18. What is latency vs accuracy?",
    a: "Latency = response time. Accuracy = correctness. Faster responses sometimes skip deep retrieval; we balance both using hybrid search and caching.",
    imgs: [
      "https://i.ibb.co/sv1Mq1vH/Chat-GPT-Image-Aug-28-2025-06-29-09-PM.png",
    ],
  },
  {
    q: "Q19. What is inference cost?",
    a: "It’s the cost of tokens processed for each query. Tracking cost/session helps optimize usage and avoid unsustainable spending.",
    imgs: ["https://i.ibb.co/wZ2Z58Dy/Q19-What-is-inference-cost.png"],
  },
  {
    q: "Q20. What is JSON structured output?",
    a: "Instead of free text, answers are returned in JSON fields like {policy_name, exclusions[], claims_steps[]}. This ensures machine readability and reliable integration with tools.",
    imgs: ["https://i.ibb.co/0p216b6y/Q20-What-is-JSON-structured-output.png"],
  },
  {
    q: "Q21. Why use OpenAI APIs?",
    a: "OpenAI APIs let us validate ideas quickly with enterprise-grade reliability. It’s our Phase-1 platform before scaling to custom commercial models.",
    imgs: [
      "https://i.ibb.co/FcLN6bc/Chat-GPT-Image-Aug-29-2025-11-52-32-AM.png",
    ],
  },
  {
    q: "Q22. Why Hugging Face?",
    a: "Hugging Face allows model hosting, fine-tuning, and private deployments. It’s suitable for Phase-2, when we need commercial independence and control.",
    imgs: ["https://i.ibb.co/PZ3s878D/Q22-Why-Hugging-Face.png"],
  },
  {
    q: "Q23. Why Ollama?",
    a: "Ollama runs models locally on laptops or servers. It’s great for testing pipelines offline but not suitable for commercial-grade deployment.",
    imgs: ["https://i.ibb.co/0pSmgtY9/Why-Ollama-Limitations-Unveiled-23.png"],
  },
  {
    q: "Q24. OpenAI vs Hugging Face?",
    a: "OpenAI = API-first, closed model, fast validation. Hugging Face = open-source hosting, fine-tune support, enterprise flexibility. Together, they form a phased roadmap.",
    imgs: [
      "https://i.ibb.co/M5jWC3Fk/Q24-What-s-the-difference-between-Hugging-Face-and-Open-AI.png",
    ],
  },
  {
    q: "Q25. Why not use only free models?",
    a: "Free models often lack compliance, reliability, and support. For Insurance, regulatory trust demands enterprise-grade, well-managed models.",
    imgs: [
      "https://i.ibb.co/4RSdnnmZ/Free-vs-Enterprise-Grade-Insurance-Models.png",
    ],
  },
  {
    q: "Q26. Which models do we plan to use?",
    a: "We plan to use GPT, Claude, LLaMA, and Mistral depending on cost, compliance, and accuracy needs. The mix ensures flexibility and scalability.",
    imgs: ["https://i.ibb.co/fVz85xz7/Q26-Which-models-do-we-plan-to-use.png"],
  },
  {
    q: "Q27. What is LoRA fine-tuning?",
    a: "LoRA (Low-Rank Adaptation) fine-tunes only a small set of model parameters, making it faster and cheaper. It’s ideal for domain-specific tasks like Insurance.",
    imgs: ["https://i.ibb.co/XffLdCtt/27-What-is-Lo-RA-fine-tuning.jpg"],
  },
  {
    q: "Q28. What is embedding & vector DB?",
    a: "Embeddings turn text into numerical vectors that capture meaning. A vector database stores these for semantic search, helping the system find relevant insurance passages.",
    imgs: ["https://i.ibb.co/7xs3mnmp/Q28-What-is-embedding-vector-DB.png"],
  },
  {
    q: "Q29. What is hybrid search?",
    a: "Hybrid search combines keyword search with vector similarity search. This ensures retrieval is both precise (keywords) and context-rich (semantic meaning).",
    imgs: ["https://i.ibb.co/65BwMFH/Q29-What-is-hybrid-search.png"],
  },
  {
    q: "Q30. Why do we need ontology?",
    a: "Insurance data is messy and fragmented. Ontology organizes it into structured relationships, ensuring retrieval maps directly to insurance products, exclusions, and claims.",
    imgs: ["https://i.ibb.co/mCkxKWTb/The-Role-of-Ontology-in-Insurance.png"],
  },
  {
    q: "Q31. What are evaluation prompts?",
    a: "Evaluation prompts are a fixed set of test queries used daily. They help measure accuracy, coverage, hallucinations, and system stability.",
    imgs: ["https://i.ibb.co/KxHT9XrD/Infographic-on-Evaluation-Prompts.png"],
  },
  {
    q: "Q32. How do you run 1,000 test packs?",
    a: "We maintain a gold-answer dataset of 1,000+ prompts across insurance categories. Daily regression runs track hit-rate, accuracy, and error patterns.",
    imgs: [
      "https://i.ibb.co/cSpszj89/Q32-How-do-you-run-1-000-test-packs-1.png",
    ],
  },
  {
    q: "Q33. Why JSON/function calling?",
    a: "JSON outputs ensure answers are structured and machine-readable. Function calling enables integration with calculators, comparers, and claims APIs.",
    imgs: ["https://i.ibb.co/60zyzPJC/Q32-How-do-you-run-1-000-test-packs.png"],
  },
  {
    q: "Q34. Why compliance guardrails?",
    a: "Insurance is highly regulated. Guardrails like audit logs, citations, disclaimers, and refusal triggers prevent mis-selling and ensure IRDAI alignment.",
    imgs: ["https://i.ibb.co/ymF2c8rH/Why-compliance-guardrails.png"],
  },
  {
    q: "Q35. How does caching help?",
    a: "Caching stores frequent queries and results, reducing cost and speeding up responses. For Insurance, common FAQs benefit greatly from caching.",
    imgs: ["https://i.ibb.co/R4MHbN01/Q-35-How-does-caching-help.png"],
  },
  {
    q: "Q36. What is IRDAI?",
    a: "IRDAI (Insurance Regulatory and Development Authority of India) regulates all insurers. It protects policyholders, enforces solvency, and ensures fair practices.",
    imgs: ["https://i.ibb.co/35mqzwT6/Q-36-What-is-IRDAI.png"],
  },
  {
    q: "Q37. What are types of insurance?",
    a: "Insurance splits into Life Insurance (covers human life) and General Insurance (covers risks like health, motor, property, travel, liability, etc.).",
    imgs: ["https://i.ibb.co/f7g6cRR/Q37-What-are-types-of-insurance.png"],
  },
  {
    q: "Q38. Difference between Life & General Insurance?",
    a: "Life Insurance pays a fixed benefit on death or maturity. General Insurance covers loss or damage to assets, health, or liability risks.",
    imgs: [
      "https://i.ibb.co/spKYWFGR/Q38-Difference-between-Life-General-Insurance.png",
    ],
  },
  {
    q: "Q39. What is Motor Insurance?",
    a: "Motor Insurance covers vehicle damage and third-party liability. In India, third-party motor insurance is legally mandatory for all vehicle owners.",
    imgs: [
      "https://i.ibb.co/WvMmLYJM/Chat-GPT-Image-Aug-28-2025-06-56-30-PM.png",
    ],
  },
  {
    q: "Q40. What is Health Insurance?",
    a: "Health Insurance covers hospitalization, surgeries, and critical illnesses. It protects individuals from unexpected medical expenses and is regulated under IRDAI guidelines.",
    imgs: ["https://i.ibb.co/hJ9Wdgdc/Q40-What-is-Health-Insurance.png"],
  },
  {
    q: "Q41. What is Travel Insurance?",
    a: "Travel Insurance protects against trip cancellations, medical emergencies abroad, and baggage losses. It’s especially valuable for students and frequent travelers.",
    imgs: ["https://i.ibb.co/jPqmMgLS/Q41-What-is-Travel-Insurance.png"],
  },
  {
    q: "Q42. What is Property Insurance?",
    a: "Property Insurance covers risks to buildings, homes, or offices. It safeguards against fire, theft, or natural calamities.",
    imgs: ["https://i.ibb.co/39TKfm1h/Insurence-LLM-Q-42.png"],
  },
  {
    q: "Q43. What is Fire Insurance?",
    a: "Fire Insurance specifically protects property against losses caused by fire. It’s widely used by businesses, factories, and homeowners.",
    imgs: ["https://i.ibb.co/CKmbzLh3/Q43-What-is-Fire-Insurance.png"],
  },
  {
    q: "Q44. What is Marine Insurance?",
    a: "Marine Insurance covers goods in transit by sea, air, or land. It’s critical for exporters, importers, and logistics providers.",
    imgs: [
      "https://i.ibb.co/x8fWfz55/Marine-Insurance-Coverage-Overview-44.png",
    ],
  },
  {
    q: "Q45. What is Crop Insurance?",
    a: "Crop Insurance protects farmers from crop loss due to drought, floods, or pests. In India, schemes like PMFBY make it affordable.",
    imgs: ["https://i.ibb.co/twGSHN8s/Q45-What-is-Crop-Insurance.png"],
  },
  {
    q: "Q46. What is Liability Insurance?",
    a: "Liability Insurance covers legal liabilities if a person or company causes injury, damage, or loss to others. Businesses often use it for protection.",
    imgs: ["https://i.ibb.co/B5QN2wJS/How-do-we-source-data.png"],
  },
  {
    q: "Q47. What are miscellaneous covers?",
    a: "Miscellaneous Insurance covers niche risks like burglary, pets, personal accidents, and cyber threats. These are add-ons or standalone policies.",
    imgs: ["https://i.ibb.co/vC6LgDSx/Q47-What-are-miscellaneous-covers.png"],
  },
  {
    q: "Q48. What is a Sum Assured?",
    a: "The sum assured is the guaranteed amount an insurer pays under a policy. In Life Insurance, it’s the fixed payout on death or maturity.",
    imgs: ["https://i.ibb.co/S4RvtY35/48-What-is-a-Sum-Assured.png"],
  },
  {
    q: "Q49. What is a Waiting Period?",
    a: "The waiting period is the time you must wait before certain benefits activate in a Health Insurance policy. Commonly applies to pre-existing conditions.",
    imgs: ["https://i.ibb.co/mFhXVW3G/Q49-What-is-a-Waiting-Period.png"],
  },
  {
    q: "Q50. What are Exclusions?",
    a: "Exclusions are conditions or scenarios not covered by a policy. For example, cosmetic surgery or self-inflicted injuries are common exclusions in Health Insurance.",
    imgs: ["https://i.ibb.co/pvd5RtfC/Q50-What-are-Exclusions.png"],
  },
  {
    q: "Q51. How do claims work?",
    a: "The policyholder submits a claim with documents (policy copy, bills, certificates). The insurer verifies, processes, and pays out as per policy terms.",
    imgs: ["https://i.ibb.co/ns9CdvH4/51-How-Insurance-Claims-Work.png"],
  },
  {
    q: "Q52. What are Riders?",
    a: "Riders are optional add-ons to enhance insurance coverage, such as accidental death, critical illness, or hospital cash benefits. They give flexibility at low cost.",
    imgs: ["https://i.ibb.co/C3WjHJmw/What-Are-Riders.png"],
  },
  {
    q: "Q53. What is Reinsurance?",
    a: "Reinsurance is insurance for insurers. Companies transfer part of their risk to other insurers, ensuring financial stability during large claim events.",
    imgs: ["https://i.ibb.co/PGg8p4kN/Q53-What-is-Reinsurance.png"],
  },
  {
    q: "Q54. What is IRDA Sandbox?",
    a: "The IRDAI Sandbox allows insurers to test innovative products in a controlled environment before large-scale launch. It supports innovation with regulatory oversight.",
    imgs: ["https://i.ibb.co/YvcP4X8/Q54-What-is-IRDA-Sandbox.png"],
  },
  {
    q: "Q55. What is SEBI’s role in insurance?",
    a: "SEBI regulates the investment side of insurance products like ULIPs. It ensures transparency, protects investors, and prevents mis-selling of market-linked policies.",
    imgs: ["https://i.ibb.co/4gZhNyj8/What-is-SEBI-s-role-in-insurance.png"],
  },
  {
    q: "Q56. How does RBI intersect with insurance?",
    a: "RBI governs banks that sell insurance through bancassurance. It also regulates lending practices where insurance is bundled with loans.",
    imgs: [
      "https://i.ibb.co/XfdWLdrk/Q-56-How-does-RBI-intersect-with-insurance.png",
    ],
  },
  {
    q: "Q57. What is ROC’s relevance in insurance?",
    a: "The Registrar of Companies ensures insurers comply with company law. Insurers must file annual reports, financials, and governance disclosures with ROC.",
    imgs: [
      "https://i.ibb.co/rfFs6T23/Q57-What-is-ROC-s-relevance-in-insurance.png",
    ],
  },
  {
    q: "Q58. What is IBBI’s role in insurance?",
    a: "The Insolvency and Bankruptcy Board of India handles cases where insurers or related entities face financial distress, protecting policyholder interests.",
    imgs: ["https://i.ibb.co/HJf3tb3/Q58-What-is-IBBI-s-role-in-insurance.png"],
  },
  {
    q: "Q59. What is the Insurance Act?",
    a: "The Insurance Act provides the legal framework for insurance operations in India. It covers licensing, solvency, claims, and policyholder rights.",
    imgs: ["https://i.ibb.co/VWmTqFBD/Q59-What-is-the-Insurance-Act.png"],
  },
  {
    q: "Q60. How does Company Law overlap with Insurance Law?",
    a: "Insurers must comply with both insurance regulations and company law. For example, IRDAI sets product rules while ROC ensures governance compliance.",
    imgs: [
      "https://i.ibb.co/9k9ySjFS/Chat-GPT-Image-Aug-28-2025-07-05-46-PM.png",
    ],
  },
  {
    q: "Q61. What is Insurance LLM?",
    a: "Insurance LLM is a domain-specific AI system built on foundation models, enriched with insurance data, ontology, tools, and compliance features for accurate Q&A.",
    imgs: ["https://i.ibb.co/RGHNpPTt/Q61-What-is-Insurance-LLM.png"],
  },
  {
    q: "Q62. Why not call it RAG?",
    a: "Because RAG is just retrieval + generation. Our system adds ontology, structured outputs, compliance, evaluations, and workflows, making it a complete Insurance LLM.",
    imgs: ["https://i.ibb.co/BHhdpWrt/Q62-Why-not-call-it-RAG.png"],
  },
  {
    q: "Q63. Why not call it a wrapper?",
    a: "Wrappers only connect to APIs. We integrate data pipelines, domain-specific tools, and regulatory compliance, which makes it a robust LLM system.",
    imgs: ["https://i.ibb.co/MkPWJq8C/Insurence-LLM-Q-63.png"],
  },
  {
    q: "Q64. Are we training from scratch?",
    a: "No. Training from scratch requires billions in resources. Instead, we ground existing models with insurance data for faster, practical outcomes.",
    imgs: ["https://i.ibb.co/nqw1kndh/Q64-Are-we-training-from-scratch.png"],
  },
  {
    q: "Q65. Are we fine-tuning models?",
    a: "Not yet. Currently, we ground data. In future phases, we may fine-tune models for efficiency, cost optimization, and domain tone.",
    imgs: ["https://i.ibb.co/pBNpwBhB/Screenshot-2025-08-28-190524.png"],
  },
  {
    q: "Q66. Are we grounding data?",
    a: "Yes. We transform raw regulatory and company data into structured ontology and feed it into LLM pipelines for accurate answers.",
    imgs: [
      "https://i.ibb.co/cccqqpWt/Chat-GPT-Image-Aug-29-2025-11-53-25-AM.png",
    ],
  },
  {
    q: "Q67. How do we source data?",
    a: "We source data from IRDAI, insurers, ROC, RBI, SEBI, IBBI, Insurance Acts, and other official filings to ensure credibility.",
    imgs: ["https://i.ibb.co/PGw14jjy/How-will-insurers-benefit.png"],
  },
  {
    q: "Q68. How is data cleaned?",
    a: "Raw PDFs and filings are parsed, normalized, and mapped into structured fields. Noise is removed, and metadata (dates, sources) is tagged for trust.",
    imgs: ["https://i.ibb.co/TMXP9cK2/Q68-How-is-data-cleaned.png"],
  },
  {
    q: "Q69. How is data chunked?",
    a: "Data is divided by logical sections (eligibility, benefits, exclusions, claims). This avoids splitting mid-sentence and ensures retrieval relevance.",
    imgs: ["https://i.ibb.co/gZWpxNQq/69-How-is-data-chunked.jpg"],
  },
  {
    q: "Q70. How is ontology built?",
    a: "We map relationships: Insurer → Product → Plan → Features → Exclusions → Claims → Regulations. Ontology provides structured, queryable knowledge.",
    imgs: ["https://i.ibb.co/svrDnq8G/Q7-What-is-ontology-in-AI.png"],
  },
  {
    q: "Q71. What tools are integrated?",
    a: "Policy comparison, premium calculator, eligibility checker, claim process explainer, and glossary. These go beyond plain text answers.",
    imgs: ["https://i.ibb.co/GGXNm7Q/Q71-What-tools-are-integrated.png"],
  },
  {
    q: "Q72. How do evaluations run?",
    a: "We run 1,000+ queries daily across health, motor, travel, property, and liability. Gold answers are compared to outputs, tracking hit rate and accuracy.",
    imgs: ["https://i.ibb.co/vCcmn1QG/72-How-Evaluations-Run-An-Overview.png"],
  },
  {
    q: "Q73. How do we ensure compliance?",
    a: "We provide citations, disclaimers, and audit logs. Sensitive data is masked. Answers align with IRDAI and other regulator guidelines.",
    imgs: [
      "https://i.ibb.co/GQN9GspD/Ensuring-Compliance-Clear-Guidelines.png",
    ],
  },
  {
    q: "Q74. How do we ensure accuracy?",
    a: "We use hybrid retrieval, ontology alignment, and gold-answer comparisons. Responses failing accuracy checks are flagged for improvement.",
    imgs: [
      "https://i.ibb.co/fV5WBmXt/Chat-GPT-Image-Aug-28-2025-05-45-34-PM.png",
    ],
  },
  {
    q: "Q75. How do we measure hallucination rates?",
    a: "We compare outputs against ground truth. Any fabricated or unsupported answers count as hallucinations. Our target is ≤2% hallucination rate.",
    imgs: [
      "https://i.ibb.co/N2LpyQ62/Q75-How-do-we-measure-hallucination-rates.png",
    ],
  },
  {
    q: "Q76. What is our daily scorecard?",
    a: "We track accuracy, hallucination rate, retrieval hit-rate, latency, cost per session, and lead conversions. This ensures daily visibility into system health.",
    imgs: ["https://i.ibb.co/bjBKJ0yr/What-is-our-daily-scorecard.png"],
  },
  {
    q: "Q77. What is the business outcome?",
    a: "The Insurance LLM improves policy discovery, reduces mis-selling, builds regulator trust, and generates leads for insurers. It creates measurable business value.",
    imgs: ["https://i.ibb.co/SDF4rBLb/Q-77-What-is-the-business-outcome.png"],
  },
  {
    q: "Q78. Who benefits from the Insurance LLM?",
    a: "Regulators get transparency, insurers reduce servicing costs, agents get sales support, and customers gain clarity and confidence in policies.",
    imgs: [
      "https://i.ibb.co/5Xv01ZtN/Q78-Who-benefits-from-the-Insurance-LLM.png",
    ],
  },
  {
    q: "Q79. Why build domain LLMs instead of generic ones?",
    a: "Generic models lack compliance and domain precision. Domain LLMs capture regulatory rules and product details, making them production-ready for critical industries.",
    imgs: [
      "https://i.ibb.co/cKHYrXGB/Q79-Why-build-domain-LLMs-instead-of-generic-ones.png",
    ],
  },
  {
    q: "Q80. Why start with Insurance first?",
    a: "Insurance is complex, data-rich, and highly regulated — an ideal testbed. Success here creates reusable frameworks for other BFSI domains.",
    imgs: ["https://i.ibb.co/C3QL3d0H/Q80-Why-start-with-Insurance-first.png"],
  },
  {
    q: "Q81. Why are we building this?",
    a: "Because insurance discovery is broken. Customers are confused, regulators seek transparency, and insurers need efficient servicing — an LLM solves all.",
    imgs: [
      "https://i.ibb.co/s9W85gPm/Chat-GPT-Image-Aug-28-2025-07-12-56-PM.png",
    ],
  },
  {
    q: "Q82. Why not stop at wrappers?",
    a: "Wrappers don’t scale in production. They fail at compliance, accuracy, and structured responses, which are non-negotiable in Insurance.",
    imgs: ["https://i.ibb.co/W4Q6YZv5/Q82-Why-not-stop-at-Wrappers.png"],
  },
  {
    q: "Q83. How is this different from chatbots?",
    a: "Chatbots follow scripts. Our LLM reasons, compares, explains exclusions, and integrates with tools like calculators — making it intelligent and flexible.",
    imgs: [
      "https://i.ibb.co/QFcNn3Z3/Q83-How-is-this-different-from-chatbots.png",
    ],
  },
  {
    q: "Q84. How will this scale to 1,00,000+ policies?",
    a: "Through automated ingestion pipelines, ontology mapping, and scalable retrieval layers. This ensures continuous coverage of insurers and products.",
    imgs: ["https://i.ibb.co/mfwdnP9/Insurence-LLM-Q-84.png"],
  },
  {
    q: "Q85. What’s the roadmap after Insurance?",
    a: "We plan to extend the framework into Loans LLM, Jobs LLM, and Legal LLM, creating a BFSI-focused ecosystem of domain LLMs.",
    imgs: [
      "https://i.ibb.co/TBs72gZV/Q85-What-s-the-roadmap-after-Insurance.png",
    ],
  },
  {
    q: "Q86. How will customers benefit?",
    a: "They can easily compare policies, avoid mis-selling, and get transparent explanations of exclusions, claims, and benefits.",
    imgs: [
      "https://i.ibb.co/HpkvxS33/How-Customers-Benefit-A-Simple-Guide-86-png.png",
    ],
  },
  {
    q: "Q87. How will regulators benefit?",
    a: "They gain access to an auditable, transparent system where policy data is structured, cited, and validated against regulatory filings.",
    imgs: ["https://i.ibb.co/z1r6FZG/Q87-How-will-regulators-benefit.png"],
  },
  {
    q: "Q88. How will insurers benefit?",
    a: "They reduce servicing costs, improve customer trust, and gain better lead-to-policy conversion rates.",
    imgs: [
      "https://i.ibb.co/LzgSCJWy/Chat-GPT-Image-Aug-29-2025-11-55-27-AM.png",
    ],
  },
  {
    q: "Q89. What’s the revenue model?",
    a: "Revenue comes from lead generation, API licensing, insurer partnerships, compliance dashboards, and premium services.",
    imgs: ["https://i.ibb.co/svXKp9X3/Q89-What-s-the-revenue-model.png"],
  },
  {
    q: "Q90. What’s the compliance framework?",
    a: "We align with IRDAI for insurance, RBI for financial linkages, SEBI for investment products, and IBBI/ROC for legal frameworks.",
    imgs: ["https://i.ibb.co/HmBvqFV/What-s-the-compliance-framework.jpg"],
  },
  {
    q: "Q91. How is data residency ensured?",
    a: "Insurance data is stored and processed in India, as per IRDAI and Indian data protection laws.",
    imgs: ["https://i.ibb.co/fYz2DQyq/Q91-How-is-data-residency-ensured.png"],
  },
  {
    q: "Q92. How do we ensure trust?",
    a: "Every answer includes citations, disclaimers, and audit logs. This builds regulator and user confidence.",
    imgs: ["https://i.ibb.co/0j45BnFv/Q92-How-do-we-ensure-trust.png"],
  },
  {
    q: "Q93. Why not wait for big tech giants?",
    a: "Big tech often waits for domain players to prove real-world use cases. Our head start ensures early ownership of the Insurance space.",
    imgs: ["https://i.ibb.co/Kx4Sgb4t/93-Waiting-for-Big-Tech.png"],
  },
  {
    q: "Q94. Why do domain-led LLMs win?",
    a: "They solve niche problems with compliance-grade accuracy. Giants build broad tools, while domain LLMs dominate in regulated industries.",
    imgs: ["https://i.ibb.co/jkRX3rQQ/Why-Domain-Led-LLMs-Excel.png"],
  },
  {
    q: "Q95. How will this become a billion-dollar company?",
    a: "By scaling across Insurance, Loans, Jobs, and Legal, with reusable LLM infrastructure and partnerships with BFSI institutions.",
    imgs: [
      "https://i.ibb.co/wNhV7tnY/Q95-How-will-this-become-a-billion-dollar-company.png",
    ],
  },
  {
    q: "Q96. How will APIs integrate?",
    a: "We integrate with insurer APIs for premium calculations, quotes, claims status, and policy issuance.",
    imgs: ["https://i.ibb.co/bjDV2LzL/Q96-How-will-APIs-integrate.png"],
  },
  {
    q: "Q97. How will cost per query reduce over time?",
    a: "Through caching, fine-tuning, hybrid model use (large + small), and query optimization.",
    imgs: [
      "https://i.ibb.co/wNJzdzB1/How-will-cost-per-query-reduce-over-time.png",
    ],
  },
  {
    q: "Q98. How will multi-language support work?",
    a: "We’ll fine-tune models for Indian languages, enabling insurance discovery in Hindi, Telugu, Tamil, Bengali, and more.",
    imgs: [
      "https://i.ibb.co/RTpqSTTx/Q-98-How-will-multi-language-support-work.png",
    ],
  },
  {
    q: "Q99. How will system updates be handled?",
    a: "New data from IRDAI and insurers will be re-ingested regularly, with version tracking and freshness indicators.",
    imgs: [
      "https://i.ibb.co/Wv7c0x3n/Q99-How-will-system-updates-be-handled.png",
    ],
  },
  {
    q: "Q100. Why us, why now?",
    a: "We have 25+ years of BFSI tech expertise, regulatory trust, and timing advantage in the AI wave — making us uniquely positioned.",
    imgs: ["https://i.ibb.co/RkBCz8wg/Q100-Why-us-why-now.png"],
  },
  
];

export default function FaqLLMSlidesMobile() {
  const total = SLIDES.length;
  const [idx, setIdx] = useState(0);
  const [activeImg, setActiveImg] = useState(0);

  const current = SLIDES[idx];
  const images = current.imgs && current.imgs.length > 0 ? current.imgs : [];

  const qNumber = useMemo(() => {
    const m = /^Q(\d+)\./i.exec(current?.q ?? "");
    return m ? parseInt(m[1], 10) : idx + 1;
  }, [idx, current]);

  const go = (n) => {
    const clamped = Math.max(0, Math.min(total - 1, n));
    setIdx(clamped);
    setActiveImg(0);
  };

  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);
  const first = () => go(0);
  const last = () => go(total - 1);

  const copyText = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  // 👉 Swipe gesture handler
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 20, // detect horizontal move
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 50) {
          // swipe right → prev
          prev();
        } else if (gesture.dx < -50) {
          // swipe left → next
          next();
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${((idx + 1) / total) * 100}%` },
          ]}
        />
      </View>

      {/* Slide Content (swipe-enabled) */}
      <ScrollView
        {...panResponder.panHandlers}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Image Section */}
        <View style={styles.imageBox}>
          {images.length > 0 ? (
            <Image
              source={{ uri: images[activeImg] }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.noImage}>No image for this question</Text>
          )}
        </View>

        {/* Thumbnails */}
        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbRow}
          >
            {images.map((src, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveImg(i)}
                style={[
                  styles.thumb,
                  i === activeImg && styles.thumbActive,
                ]}
              >
                <Image
                  source={{ uri: src }}
                  style={{ width: 70, height: 50, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Q & A */}
        <View style={styles.qaBox}>
          <Text style={styles.progressText}>{`Q${qNumber} of ${total}`}</Text>
          <Text style={styles.question}>{current.q}</Text>
          <Text style={styles.answer}>{current.a}</Text>

          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => copyText(`${current.q}\n\n${current.a}`)}
          >
            <Ionicons name="copy-outline" size={18} color="#374151" />
            <Text style={styles.copyText}> Copy Q&A </Text>
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={first}
            disabled={idx === 0}
            style={styles.ctrlBtn}
          >
            <Ionicons name="play-skip-back" size={22} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={prev}
            disabled={idx === 0}
            style={styles.ctrlBtn}
          >
            <Ionicons name="chevron-back" size={26} color="#374151" />
          </TouchableOpacity>

          <Text style={styles.pageText}>{`${idx + 1} of ${total}`}</Text>

          <TouchableOpacity
            onPress={next}
            disabled={idx === total - 1}
            style={styles.ctrlBtn}
          >
            <Ionicons name="chevron-forward" size={26} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={last}
            disabled={idx === total - 1}
            style={styles.ctrlBtn}
          >
            <Ionicons name="play-skip-forward" size={22} color="#374151" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  progressBarBg: { height: 4, backgroundColor: "#e5e7eb", width: "100%" },
  progressBarFill: { height: 4, backgroundColor: "#6366f1" },
  imageBox: {
    width: width - 30,
    height: 250,
    margin: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: { width: "100%", height: "100%" },
  noImage: { color: "#9ca3af", fontSize: 14 },
  thumbRow: { flexDirection: "row", marginHorizontal: 15 },
  thumb: {
    marginRight: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
  },
  thumbActive: { borderColor: "#6366f1", borderWidth: 2 },
  qaBox: { paddingHorizontal: 18, paddingTop: 12 },
  progressText: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  question: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  answer: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
  copyBtn: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  copyText: { fontSize: 13, color: "#374151" },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  ctrlBtn: { marginHorizontal: 6, padding: 6 },
  pageText: { fontSize: 14, color: "#374151" },
});