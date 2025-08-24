import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, folderName } = await req.json();
    if (!accessToken || !folderName) {
      return new Response("Missing required fields", { status: 400 });
    }
    const fetchFileapi = await axios.get(`${process.env.DRIVE_API}/files`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },params:{
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
      }
    });

    let data = fetchFileapi.data;

    if(data.files.length > 0) {
      return NextResponse.json({ folderId: data.files[0].id });
    }

    const api = await axios.post(`${process.env.DRIVE_API}/files`, {
      "name": "ai-editor",
      "mimeType": "application/vnd.google-apps.folder"
    },{
      headers:{
        Authorization :`Bearer ${accessToken}`,
         "Content-Type": "application/json",
      }
    })

    data = api.data;

    if(data){
      return NextResponse.json(data);
    }

    return NextResponse.json({ message: "Failed to create folder" });

  } catch (error:any) {
    console.log(error)
    console.log(error.response?.data);

    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}