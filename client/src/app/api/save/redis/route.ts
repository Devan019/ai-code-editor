import redisClient from "@/lib/redisClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
  try {
    const { content, fileId }  = await req.json();
    console.log("Saving file:", fileId, content);
    if(!content || !fileId) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const redis = await redisClient();
    await redis.set(`${fileId}:content`, content);
    return NextResponse.json({ message: "File saved successfully" });
  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}