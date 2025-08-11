import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse){
  const { prompt, code } = await req.json();
  
  

}