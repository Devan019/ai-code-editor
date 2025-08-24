import axios from "axios";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req:NextRequest){
  try {
    const {accessToken, fileName, mimeType, folderId} =  await req.json();
    if(!accessToken || !fileName || !mimeType || !folderId){
      return new Response("Missing required fields", {status:400});
    }

    const api = await axios.post(`${process.env.DRIVE_API}/files?fields=*`, {
      "name": fileName,
      "mimeType": mimeType,
      "parents": [folderId]
    },{
      headers:{
        Authorization :`Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    })

    const data = api.data;
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: "Failed to create file" }, { status: 500 });
  }
}