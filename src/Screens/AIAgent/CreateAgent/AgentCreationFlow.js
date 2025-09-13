import React, { useState } from "react";
import { View, Button } from "react-native";
import AgentVisionScreen from "./create";
import AgentSkillsScreen from "./Capabilities";
import AgentPricingScreen from "./RevenueSplit";
import AgentCreationProcess from "./AgentCreationProcess";
import AgentReviewScreen from "./AgentReviewScreen";

const AgentCreationFlow = () => {
  const [step, setStep] = useState(1);

  // central state to collect all agent data
  const [agentData, setAgentData] = useState({
    acheivements: "",
    activeStatus: true,
    ageLimit: "",
    agentId: "",
    agentName: "",
    agentStatus: "CREATED",
    assistantId: "",
    business: "",
    conStarter1: "",
    conStarter2: "",
    conStarter3: "",
    conStarter4: "",
    description: "",
    domain: "",
    gender: "",
    instructions: "",
    language: "",
    mainProblemSolved: "",
    rateThisPlatform: 0,
    responseFormat: "",
    shareYourFeedback: "",
    status: "APPROVED",
    subDomain: "",
    targetUser: "",
    uniqueSolution: "",
    usageModel: "",
    userExperience: 0,
    userExperienceSummary: "",
    userId: "",
    userRole: "",
    voiceStatus: true,
  });

  const updateAgentData = (updates) => {
    setAgentData((prev) => ({ ...prev, ...updates }));
  };

  const goNext = () => setStep((prev) => Math.min(prev + 1, 5));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/ai-service/agent/agentCreation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentData),
      });
      const data = await res.json();
      console.log("✅ Agent created:", data);
    } catch (err) {
      console.error("❌ Error submitting agent:", err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {step === 1 && (
        <AgentVisionScreen agentData={agentData} updateAgentData={updateAgentData} />
      )}
      {step === 2 && (
        <AgentSkillsScreen agentData={agentData} updateAgentData={updateAgentData} />
      )}
      {step === 3 && (
        <AgentPricingScreen agentData={agentData} updateAgentData={updateAgentData} />
      )}
      {step === 4 && (
        <AgentCreationProcess agentData={agentData} updateAgentData={updateAgentData} />
      )}
      {step === 5 && (
        <AgentReviewScreen
          agentData={agentData}
          updateAgentData={updateAgentData}
          handleSubmit={handleSubmit}
        />
      )}

      {/* Debug Navigation Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
        {step > 1 && <Button title="Back" onPress={goBack} />}
        {step < 5 && <Button title="Next" onPress={goNext} />}
      </View>
    </View>
  );
};

export default AgentCreationFlow;
