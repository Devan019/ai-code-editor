import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { prompt, code } = await req.json();

    const newPrompt = `
You are a code generator.
Generate the output strictly in JSON format with three fields: "html", "css", "js".
Do not include explanations or extra text outside the JSON.
Prompt/Task: ${prompt}
Additional Code (if provided): ${code || ""}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
    return NextResponse.json(json);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}
