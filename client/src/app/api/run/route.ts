import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }


    const result = await axios.post(`${process.env.JDOOLE_URL}`, {
      clientId: process.env.JDOOLE_CLIENT_ID,
      clientSecret: process.env.JDOOLE_CLIENT_SECRET,
      script: code,
      stdin: "",
      language: language.toLowerCase() == "javascript" ? "nodejs" : language.toLowerCase(),
      versionIndex: "0", // must be string per JDoodle docs
      compileOnly: false,
    });

    // ✅ Only return the JDoodle response body
    return NextResponse.json({ response: result.data });

  } catch (error: any) {
    console.error("JDoodle error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to execute code" }, { status: 500 });
  }
}
