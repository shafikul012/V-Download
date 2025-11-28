import { GoogleGenAI, Type } from "@google/genai";
import { ScrapedVideoData, TrendingVideo } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getTrendingVideos = async (): Promise<TrendingVideo[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a list of 8 trending fictional viral video titles with their platform (YouTube, TikTok, Instagram) and fake view counts (e.g. 1.2M).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              platform: { type: Type.STRING },
              views: { type: Type.STRING },
            },
            required: ["title", "platform", "views"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Enrich with placeholder images since Gemini generates text
    return data.map((item: any, index: number) => ({
      id: `trend-${index}-${Date.now()}`,
      title: item.title,
      platform: item.platform,
      views: item.views,
      thumbnail: `https://picsum.photos/seed/${index + 100}/400/225`
    }));

  } catch (error) {
    console.error("Gemini Trending Error:", error);
    // Fallback data
    return [
      { id: '1', title: 'Amazing Cat Tricks 2024', platform: 'YouTube', views: '2.5M', thumbnail: 'https://picsum.photos/seed/cat/400/225' },
      { id: '2', title: 'Top 10 Travel Destinations', platform: 'YouTube', views: '1.2M', thumbnail: 'https://picsum.photos/seed/travel/400/225' },
    ];
  }
};

export const analyzeUrl = async (url: string): Promise<ScrapedVideoData | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this URL: "${url}". 
      Assume it is a video page. Generate a plausible video title relevant to the URL domain or a generic viral video title. 
      Generate 4 download formats: 1080p MP4, 720p MP4, 360p MP4, and MP3 Audio. 
      Estimate plausible file sizes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            formats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  size: { type: Type.STRING },
                  ext: { type: Type.STRING },
                },
                required: ["label", "size", "ext"]
              }
            }
          },
          required: ["title", "formats"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");

    if (!result.title) return null;

    return {
      title: result.title,
      source: new URL(url).hostname,
      thumbnail: `https://picsum.photos/seed/${url.length}/400/225`,
      formats: result.formats.map((f: any, i: number) => ({ ...f, id: `fmt-${i}` }))
    };

  } catch (error) {
    console.error("Gemini Analyze Error:", error);
    // Fallback for demo purposes if API fails or key is missing
    return {
      title: "Sample Detected Video",
      source: "unknown.com",
      thumbnail: "https://picsum.photos/400/225",
      formats: [
        { id: 'f1', label: '1080p', size: '120 MB', ext: 'mp4' },
        { id: 'f2', label: '720p', size: '65 MB', ext: 'mp4' },
        { id: 'f3', label: 'Audio', size: '4 MB', ext: 'mp3' },
      ]
    };
  }
};