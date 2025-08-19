
// app/api/files/route.ts
import { getClient } from "@/lib/getAuthClient";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { accessToken, folderId } = await req.json();
    const auth = getClient({access_token:accessToken});

    const drive = google.drive({ version: "v3", auth });

    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, name, mimeType, webViewLink)",
    });

    return NextResponse.json({ files: res.data.files });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
