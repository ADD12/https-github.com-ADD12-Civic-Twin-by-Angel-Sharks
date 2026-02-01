
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TwinMetadata, SmartCityInsight, BranchSuggestion } from "../types";

// Always use the required initialization format with process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateDigitalTwinInsights = async (metadata: TwinMetadata): Promise<SmartCityInsight[]> => {
  const prompt = `
    Analyze the following entity for a Digital Twin application based on the NIST Smart Cities framework.
    Entity Name: ${metadata.name}
    Address: ${metadata.address}
    Type: ${metadata.type}
    Location: ${metadata.location?.lat}, ${metadata.location?.lng}
    Official Portal: ${metadata.officialUrl || 'Not provided'}

    Provide detailed, realistic (but simulated) data insights for the following layers:
    - Energy
    - Water
    - Waste
    - Transportation
    - Public Safety
    - Healthcare

    If an Official Portal is provided, tailor your analysis to typical data found on that city's/district's portal.
    For each layer, provide a status (optimal, warning, critical), a current value/metric (use units), a summary, and 2 key recommendations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              layer: { type: Type.STRING },
              status: { type: Type.STRING },
              value: { type: Type.STRING },
              summary: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["layer", "status", "value", "summary", "recommendations"]
          }
        }
      }
    });

    // Access .text property directly instead of calling it as a method
    const results = JSON.parse(response.text || "[]");
    return results as SmartCityInsight[];
  } catch (error) {
    console.error("Error generating twin insights:", error);
    throw error;
  }
};

export const chatWithMapsGrounding = async (message: string, metadata: TwinMetadata | null) => {
  const systemInstruction = `You are a helpful assistant for the Civic Twin platform of ${metadata?.name || 'a community'}. 
  You have access to Google Maps grounding. If the user asks about places, locations, or points of interest, 
  provide accurate and up-to-date information. Context: Entity ${metadata?.name} is located at ${metadata?.address}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction,
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: metadata?.location ? {
              latitude: metadata.location.lat,
              longitude: metadata.location.lng
            } : undefined
          }
        }
      },
    });

    // Extracting website URLs from grounding metadata chunks
    const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.maps?.uri)
      .filter(Boolean);

    return {
      // Access .text property directly
      text: response.text || "I couldn't process that request.",
      sources: urls || []
    };
  } catch (error) {
    console.error("Maps grounding chat failed", error);
    return { text: "Chat service currently unavailable. Using local knowledge.", sources: [] };
  }
};

export const getLiveAudioSession = (callbacks: any, metadata: TwinMetadata | null) => {
  // Return the session promise to handle proper initialization order in component
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: `You are the voice of Civic Twin for ${metadata?.name || 'this community'}. 
      You are helpful, professional, and aware of urban planning and NIST smart city standards. 
      Help users navigate the twin or understand their community data.`,
    },
  });
};

export const generatePRSummary = async (metadata: TwinMetadata | null, insights?: SmartCityInsight[]): Promise<{title: string, body: string}> => {
  const entityInfo = metadata ? `Entity: ${metadata.name}. Metrics: ${insights?.map(i => `${i.layer}: ${i.value}`).join(', ')}` : "Core System Update";
  
  const prompt = `
    Write a GitHub Pull Request description for the repository "ADD12/Civic-Twin-by-Angel-Sharks".
    Context: ${entityInfo}
    Target: Main Core Repository.

    The PR should be professional, technical, and include:
    1. Summary (Main Core architectural enhancements)
    2. List of new files/pages proposed
    3. Integration plan with NIST smart city frameworks.

    Return JSON with "title" and "body" (Markdown) fields.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            body: { type: Type.STRING }
          },
          required: ["title", "body"]
        }
      }
    });

    // Directly access text property
    return JSON.parse(response.text || '{"title": "feat: Main Core Update", "body": "Updating core architectural layers."}');
  } catch (error) {
    console.error("Error generating PR summary:", error);
    return {
      title: `feat: Core Architectural Update for Civic Twin`,
      body: "Proposed enhancements to the Main Core including new visualization pages and GIS data ingestion optimizations."
    };
  }
};

export const generateRepositoryStrategy = async (metadata: TwinMetadata): Promise<BranchSuggestion[]> => {
  const prompt = `
    Suggest 3 GitHub branches for forking the city "${metadata.name}" requirements off the main repo "ADD12/Civic-Twin-by-Angel-Sharks".
    Focus on city-specific persistence.
    Return JSON array of objects with "name", "purpose", "prTitle", and "prBody".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              purpose: { type: Type.STRING },
              prTitle: { type: Type.STRING },
              prBody: { type: Type.STRING }
            },
            required: ["name", "purpose", "prTitle", "prBody"]
          }
        }
      }
    });

    // Access text property directly
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating repo strategy:", error);
    return [];
  }
};

export const generateCoreArchitecturalSuggestions = async (): Promise<BranchSuggestion[]> => {
  const prompt = `
    Suggest 3 major architectural Pull Requests for the MAIN CORE of "ADD12/Civic-Twin-by-Angel-Sharks".
    These should include:
    - New specialized pages (e.g., "Sustainability-Impact.tsx")
    - New core services or file structures
    - Core NIST framework integration enhancements
    
    Return JSON array of objects with "name" (branch name), "purpose", "prTitle", and "prBody" (listing new files/pages).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              purpose: { type: Type.STRING },
              prTitle: { type: Type.STRING },
              prBody: { type: Type.STRING }
            },
            required: ["name", "purpose", "prTitle", "prBody"]
          }
        }
      }
    });

    // Access text property directly
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating core suggestions:", error);
    return [];
  }
};
