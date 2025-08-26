import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { fileId, accessToken, code, mimeType } = await req.json();

    if (!fileId || !accessToken || !code || !mimeType) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
    console.log(mimeType, " in bro")

    await axios.patch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}`,
      code,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": mimeType
        },
      }
    );


    return NextResponse.json({ message: "File updated successfully" });
  } catch (error: any) {
    console.log(error.response?.data || error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
