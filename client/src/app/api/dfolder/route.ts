// app/api/drive/folder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getClient } from "@/lib/getAuthClient";

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();
    const auth = getClient({access_token : accessToken});
    const drive =  google.drive({ version: "v3", auth });
    // 1. Check if "ai-editor" folder exists
    const existing = await drive.files.list({
      q: "name='ai-editor' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: "files(id, name)",
    });

    if (existing.data.files && existing.data.files.length > 0) {
      return NextResponse.json({ folderId: existing.data.files[0].id });
    }

    // 2. Create folder if not found
    const folder = await drive.files.create({
      requestBody: {
        name: "ai-editor",
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id, name",
    });

    return NextResponse.json({ folderId: folder.data.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
