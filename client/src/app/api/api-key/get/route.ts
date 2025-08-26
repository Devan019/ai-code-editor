import { decrypt } from "@/lib/crypo";
import getRedisClient from "@/lib/redisClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const redis = await getRedisClient();

    const groqKey = await redis.get(`apiKey:${userId}:groq`);
    const geminiKey = await redis.get(`apiKey:${userId}:gemini`);
    const openaiKey = await redis.get(`apiKey:${userId}:openai`);
    const anthropicKey = await redis.get(`apiKey:${userId}:anthropic`);


    const groq = groqKey ? decrypt(JSON.parse(groqKey)) : null;
    const gemini = geminiKey ? decrypt(JSON.parse(geminiKey)) : null;
    const openai = openaiKey ? decrypt(JSON.parse(openaiKey)) : null;
    const anthropic = anthropicKey ? decrypt(JSON.parse(anthropicKey)) : null;

    return NextResponse.json({ groq, gemini, openai, anthropic });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to retrieve API keys" }, { status: 500 });
  }
}
