
import { GoogleGenAI, Type } from "@google/genai";
import { Goal, Task, UserState } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getStrategicAdvice(goals: Goal[], tasks: Task[], userStats: UserState) {
  const victory = userStats.weeklyVictory;
  const prompt = `
    You are an AI Strategy Partner for "Amor", an Egyptian entrepreneur and educator. 
    He is highly influenced by Peter Drucker and Stephen Covey.
    
    CRITICAL FOCUS FOR THE WEEK (The Sovereign Goal): ${victory ? `${victory.title} - ${victory.description}. Expected Outcome: ${victory.reward}` : "Not set yet"}.
    
    Overall Strategic Goals: ${JSON.stringify(goals)}.
    Daily Tasks: ${JSON.stringify(tasks)}.

    Instructions:
    1. Give him 3-4 pieces of advice in a witty, professional, and encouraging Egyptian Arabic tone.
    2. Make sure at least one piece of advice directly relates to achieving his "Weekly Victory".
    3. Use phrases like "يا بطل", "الصح صح", "عينك على الجاي".
    4. Focus on the 80/20 rule.

    Format: JSON array of objects with "title" and "content" properties.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING }
            },
            required: ["title", "content"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { title: "حصل عطل فني يا بطل", content: "الذكاء الاصطناعي مريح شوية، بس كمل شغل على أهدافك!" }
    ];
  }
}
