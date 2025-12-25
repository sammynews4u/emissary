import { GoogleGenAI, Type } from "@google/genai";
import { MessageInputs, EmissaryResponse, SendPreference } from "../types";

export const generateEmissaryMessages = async (inputs: MessageInputs): Promise<EmissaryResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const senderInfo = inputs.isAnonymous ? "ANONYMOUS (Do not mention sender name)" : `Sender Name: ${inputs.senderName}`;
  const deliveryPerspective = inputs.sendPreference === SendPreference.EMISSARY 
    ? "THIRD-PERSON (You are the 'Digital Emissary' courier writing ON BEHALF of the sender. Use phrasing like 'I am writing to you on behalf of someone...' or 'I have a message for you...')"
    : "FIRST-PERSON (The user is sending this script personally. Use 'I' phrasing like 'I wanted to reach out...')";

  const emojiDirective = inputs.includeEmojis 
    ? "EMOJI ENHANCEMENT: Integrate appropriate, tasteful emojis into the messages to add warmth and expression." 
    : "NO EMOJIS: Do not use any emojis in the messages.";

  const prompt = `
    Category: ${inputs.category}
    Receiver: ${inputs.receiver}
    ${senderInfo}
    Perspective: ${deliveryPerspective}
    ${emojiDirective}
    The Raw Truth: ${inputs.keyDetails}
    Delivery Method: ${inputs.deliveryMethod}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are the "Digital Emissary," a highly empathetic, socially intelligent communication specialist. 
      Your goal is to help users articulate feelings they are too shy, anxious, or intimidated to say themselves. 
      You specialize in "vibe-matching"—turning raw, awkward thoughts into polished, meaningful messages.

      CRITICAL CONTENT LENGTH INSTRUCTIONS:
      - MAKE MESSAGES SUBSTANTIAL: Do not return short 1-2 sentence snippets. 
      - Each message should be 3-6 sentences long at minimum. 
      - For formal categories (Resignation, Professional, Grade Dispute, Landlord, etc.), write multi-paragraph messages that include a formal opening, a detailed middle section explaining the context, and a polite closing.
      - Ensure the "Direct Route" is thorough and clear, not just brief.
      - Ensure the "Soft Touch" is gentle and takes the time to build a bridge of empathy.

      CRITICAL DELIVERY INSTRUCTIONS:
      - If Perspective is THIRD-PERSON: You are a professional, kind, and neutral courier. You are delivering a message from the sender to the receiver.
      - If Perspective is FIRST-PERSON: You are writing the script for the user to send directly. The tone should be their own voice, but polished and well-structured.
      - If ANONYMOUS: Ensure the identity of the sender is strictly protected.

      CORE RULES:
      - No "AI-Speak": ABSOLUTELY AVOID words like "delve," "testament," "vibrant," "elevate," "tapestry," "multifaceted," "foster," "embrace," "bespoke," "meticulous." Write like a real human would text or email.
      - CONTEXTUAL TONE:
        * Romantic: Sweet, slightly vulnerable, but never "creepy." Include meaningful detail.
        * Resignation: Professional, firm, but appreciative. Mention gratitude for the opportunity and a smooth transition.
        * Apology: Sincere, taking full ownership. Explain the path forward or how you'll make it right.
        * Family/Friends: Warm, casual, and low-pressure. Take the time to show you care about their life.

      You MUST provide exactly three options:
      1. Option A (The Soft Touch): Subtle, gentle, and takes time to ease into the subject.
      2. Option B (The Direct Route): Clear, honest, and comprehensive. No fluff, but full of necessary detail.
      3. Option C (The "Icebreaker"): Uses a charming lead-in or light narrative to lower the tension before addressing the core topic.

      Return the response in JSON format.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                message: { type: Type.STRING },
                description: { type: Type.STRING },
                subject: { type: Type.STRING }
              },
              required: ["type", "message", "description", "subject"]
            }
          }
        },
        required: ["options"]
      }
    }
  });

  try {
    const text = response.text || '{}';
    const data = JSON.parse(text);
    return data as EmissaryResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not generate messages.");
  }
};

export const generateEmissaryVisual = async (message: string, vibe: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Create a professional, minimalist, and emotionally resonant conceptual illustration for a message about: "${message}". 
  The style should be clean, modern, and aesthetically pleasing. 
  Vibe: ${vibe}. 
  Avoid any text, words, or letters in the image. 
  Focus on symbolism and lighting.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  // Guard against undefined candidates and parts
// Safe handling of response.candidates
const candidates = response?.candidates;
if (!candidates || candidates.length === 0) {
  throw new Error("Visual synthesis failed: no candidates returned");
}

const parts = candidates[0].content?.parts;
if (!parts || parts.length === 0) {
  throw new Error("Visual synthesis failed: no content parts returned");
}

for (const part of parts) {
  if (part.inlineData) {
    return `data:image/png;base64,${part.inlineData.data}`;
  }
}

throw new Error("Visual synthesis failed: no inlineData found");

};
