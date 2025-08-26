import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { decrypt } from "@/lib/crypo";
import getRedisClient from "@/lib/redisClient";


export async function POST(req: NextRequest) {
  try {
    const { prompt, code, model, userId } = await req.json();
    if (!prompt || !model || !userId) {
      return NextResponse.json({ error: "missing fields are required" }, { status: 400 });
    }

    const redis = await getRedisClient();
    const geminiKey = await redis.get(`apiKey:${userId}:gemini`);
    const geminiApi = geminiKey ? decrypt(JSON.parse(geminiKey )) : null;

    if (!geminiApi) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey: geminiApi });
     const newPrompt = `
      You are an AI code assistant. 
      Always respond in **valid JSON** format:
      {
        "filename": "<name of the file with correct extension>",
        "code": "<the code only, no explanation>"
      }
        ${prompt}
    `;


    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: newPrompt }] }],
    });

    if (!response.text) {
      throw new Error("No response text");
    }

    const text = response.text
      .trim()
      .replace("```json", "")
      .replace("```", "")
      .trim();

    const json = JSON.parse(text);
    return NextResponse.json({response : json});
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}

