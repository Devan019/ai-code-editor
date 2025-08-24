import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { accessToken, fileId, mimeType } = await req.json();
    if (!accessToken || !fileId || !mimeType) {
      return new Response("Missing required fields", { status: 400 });
    }
    const api = await axios.get(`${process.env.DRIVE_API}/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        alt: "media"
      },
      responseType: "arraybuffer"
    });

    const fileContent = Buffer.from(api.data).toString("utf-8");
    return NextResponse.json({ fileContent });
  } catch (error: any) {
    console.log(error.response?.data);
    return NextResponse.json("Failed to fetch file content", { status: 500 });
  }
}