import { GoogleGenAI, Modality } from "@google/genai";

export const restoreImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API key is not configured. Please set VITE_GEMINI_API_KEY in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: {
        parts: [
          { inlineData: { data: base64ImageData, mimeType } },
          { text: prompt },
        ],
      },
      config: { responseModalities: [Modality.IMAGE] },
    });

    // Trích xuất base64 ảnh
    const imageBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!imageBase64) {
      throw new Error("Không nhận được dữ liệu ảnh từ Gemini API.");
    }

    return imageBase64;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
