import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://server14.srvsh.com.br:7638/;"); 
  const body = res.body;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
