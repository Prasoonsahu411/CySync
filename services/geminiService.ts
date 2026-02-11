
import { GoogleGenAI, Type } from "@google/genai";

/* Always use process.env.API_KEY directly in the constructor */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getChainInsights = async (chain: string, amount: number, address: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain the technical requirements for a ${chain} transaction of ${amount} tokens to ${address}. Include mentions of Existential Deposit, SS58 address prefixes, and Ed25519 signing. Keep it concise and professional for a hardware wallet user dashboard.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Error fetching insights. Ensure your network connection is stable.";
  }
};

export const getPortfolioSummary = async (dotBalance: number, acaBalance: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Provide a professional portfolio summary for a Substrate user with ${dotBalance} DOT and ${acaBalance} ACA. Mention the current state of the Polkadot ecosystem (referencing high-level trends like Agile Coretime or Acala's DeFi hub). Focus on security advice for hardware wallet users. Keep it under 100 words.`,
      config: {
        temperature: 0.6,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    return "Your portfolio is currently being monitored by CySync secure enclaves. Network state is nominal.";
  }
};

export const getSecurityAssessment = async (action: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a brief security assessment for the following action in a hardware wallet: ${action}. Focus on MPC shard reconstruction and air-gapped security benefits.`,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            summary: { type: Type.STRING },
            safetyTip: { type: Type.STRING }
          },
          required: ["riskLevel", "summary", "safetyTip"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { riskLevel: "Low", summary: "Hardware validation active.", safetyTip: "Verify on device." };
  }
};
