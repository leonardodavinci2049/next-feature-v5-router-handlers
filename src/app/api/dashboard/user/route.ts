import { NextResponse } from "next/server";

export async function GET() {
  //return new Response('User Dashboard Page');
  return NextResponse.json({ message: 'Hello from API' });
}
