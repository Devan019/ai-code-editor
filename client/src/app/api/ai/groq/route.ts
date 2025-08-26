import { decrypt } from '@/lib/crypo';
import getRedisClient from '@/lib/redisClient';
import { Groq } from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { model, prompt, code, userId } = await req.json();
    if (!model || !prompt || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const redis = await getRedisClient();
    const groqKey = await redis.get(`apiKey:${userId}:groq`);
    const groqapi = groqKey ? decrypt(JSON.parse(groqKey)) : null;

    if (!groqapi) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    console.log(groqapi)

    const groq = new Groq({ apiKey: groqapi });
    const newPrompt = `
      You are an AI code assistant. 
      Always respond in **valid JSON** format:
      {
        "filename": "<name of the file with correct extension>",
        "code": "<the code only, no explanation>"
      }
        ${prompt}
    `;
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": newPrompt
        },
      ],
      "model": model,
      "temperature": 1,
      "max_completion_tokens": 8192,
      "top_p": 1,
      "stream": true,
      "reasoning_effort": "medium",
      "stop": null
    });
    let responseText = '';
    for await (const chunk of chatCompletion) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        responseText += content;
      }
    }
    const parsed = JSON.parse(responseText);
    const formattedCode = parsed.code.replace(/\\n/g, "\n");
    return NextResponse.json({ response : {code: formattedCode, filename : parsed.filename} });
  } catch (error:any) {
    console.log(error)
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}