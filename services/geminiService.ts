
import { GoogleGenAI, Modality } from '@google/genai';

export const restoreImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return part.inlineData.data;
        }
      }
    }
    
    throw new Error('Không nhận được hình ảnh hợp lệ từ API. Vui lòng thử lại với một yêu cầu khác.');

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error('Yêu cầu đến AI thất bại. Điều này có thể do hình ảnh không phù hợp hoặc sự cố mạng.');
  }
};
