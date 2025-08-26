import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
  try {
    const {fileId, accessToken} = await req.json();
    if(!fileId || !accessToken){
      return NextResponse.json({ error: "Missing fileId" }, { status: 400 });
    }
    await axios.delete(`${process.env.DRIVE_API}/files/${fileId}`,{
      headers : {
        Authorization : `Bearer ${accessToken}`
      }
    })

    return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}