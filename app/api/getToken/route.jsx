import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";


const assemblyAi = new AssemblyAI({ apiKey: process.env.ASSEMBLY_API_KEY });

export async function GET() {
  try {
    const token = await assemblyAi.realtime.createTemporaryToken({
      expires_in: 3600,
    });

    return NextResponse.json(token);
  } catch (err) {
    console.error("Error generating token:", err);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
