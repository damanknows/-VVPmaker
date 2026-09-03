import { INITIAL_RECOMMENDATIONS } from "@/lib/mockData";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(INITIAL_RECOMMENDATIONS);
}
