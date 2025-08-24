import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  try {
     const { accessToken, folderId } = await req.json();
    if (!accessToken || !folderId) {
      return new Response("Missing required fields", { status: 400 });
    }
    const fetchFileapi = await axios.get(`${process.env.DRIVE_API}/files`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },params: {
        q: `'${folderId}' in parents and mimeType!='application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id, name, mimeType, size)",
      },
    });
    const files = fetchFileapi.data.files;
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}