import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedLore, ToyStyle } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "A creative, catchy name for this collectible item.",
    },
    description: {
      type: Type.STRING,
      description: "A short, exciting description of the collectible building (max 40 words).",
    },
    rarity: {
      type: Type.STRING,
      description: "The rarity level (e.g., Common, Rare, Legendary, Mystic).",
    },
    stats: {
      type: Type.OBJECT,
      properties: {
        innovation: { type: Type.INTEGER, description: "Score from 1-100" },
        security: { type: Type.INTEGER, description: "Score from 1-100" },
        community: { type: Type.INTEGER, description: "Score from 1-100" },
      },
      required: ["innovation", "security", "community"],
    },
  },
  required: ["name", "description", "rarity", "stats"],
};

export const analyzeImageForPrompt = async (base64Image: string): Promise<string> => {
  try {
    const cleanBase64 = base64Image.split(',')[1] || base64Image;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: cleanBase64 } },
          { text: "Describe the main character or object in this image in detail. Focus on visual features, colors, clothing, and pose. Keep it concise but descriptive enough for a 3D artist to recreate it." }
        ]
      }
    });
    return response.text || "A mysterious figure";
  } catch (error) {
    console.error("Image analysis failed:", error);
    return "A surprise custom character";
  }
};

export const generateCollectibleMetadata = async (userPrompt: string): Promise<GeneratedLore> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "The user wants a blind box collectible based on this description: " + userPrompt + ". Generate a creative name, description, and RPG-style stats for it. It should fit a Miniature 3D City/Toy aesthetic.",
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a creative copywriter for high-end collectible toys. Your tone is futuristic, exciting, and concise.",
      },
    });
    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as GeneratedLore;
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return {
      name: "Mystery Item",
      description: "A mysterious artifact emerging from the void.",
      rarity: "Unknown",
      stats: { innovation: 50, security: 50, community: 50 }
    };
  }
};

export const generateCollectibleImage = async (prompt: string, style: ToyStyle = 'vinyl'): Promise<string | null> => {
  try {
    const styleModifiers: Record<ToyStyle, string> = {
      vinyl: "smooth glossy vinyl toy texture, clean matte finish, vibrant colors, kidrobot style",
      plush: "soft felt and wool texture, fuzzy, stitched details, stuffed animal aesthetic, warm lighting",
      clay: "polymer clay texture, handmade feel, stop-motion animation aesthetic, matte, soft edges",
      crystal: "translucent glass and crystal material, subsurface scattering, glowing inner light, ethereal, magical",
      gold: "solid polished gold and metallic texture, luxury, reflection, shiny, expensive look",
      cyber: "cyberpunk aesthetic, neon glowing lines, translucent plastic, mechanical parts, futuristic",
      voxel: "translucent glass blocks, 3D voxel grid construction, glowing core, minecraft rtx style, high tech, digital artifact",
      ichiki: "modern japanese minimalist art toy, porcelain texture, matte white ceramic with gold kintsugi details, soft studio lighting, light beige background, high fashion toy, elegant, sophisticated"
    };

    const selectedModifier = styleModifiers[style] || styleModifiers.vinyl;
    const enhancedPrompt = "A high-quality 3D rendering of a blind box toy figure: " + prompt + ". Material & Style: " + selectedModifier + ". Composition: Chibi, miniature, isometric, octane render, c4d, studio lighting, clean soft background, centered.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: enhancedPrompt }] },
      config: { imageConfig: { aspectRatio: "3:4" } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return "data:image/png;base64," + part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
