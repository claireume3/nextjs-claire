import { NextResponse } from "next/server";
import { verifyTravelToken } from "@/lib/travel-token";
import { TRAVEL_SECTIONS } from "@/content/travel-reveal";

export async function POST(request) {
  const { token } = await request.json();
  const result = await verifyTravelToken(token);

  if (!result.valid) {
    return NextResponse.json({ valid: false, reason: result.reason }, { status: 401 });
  }

  const sections = result.scope.map((key) => TRAVEL_SECTIONS[key]).filter(Boolean);

  return NextResponse.json({ valid: true, sections });
}
