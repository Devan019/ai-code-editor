import { encrypt } from "@/lib/crypo";
import getRedisClient from "@/lib/redisClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { apiKey , provider, userId} = await req.json();

    if (!apiKey || !provider || !userId) {
      return NextResponse.json({ error: "Missing apiKey or provider or userId" });
    }

    const encrypted = encrypt(apiKey);
    const redis = await getRedisClient();
    // Save with namespace: apiKey:user123:gemini
    await redis.set(
      `apiKey:${userId}:${provider}`,
      JSON.stringify(encrypted),
      { EX: 3600 * 24 } // expire in 24h
    );

    return NextResponse.json({ success: true });
}