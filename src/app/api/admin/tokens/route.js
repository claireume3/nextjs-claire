import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "@/lib/admin-session";
import { listTravelTokens } from "@/lib/travel-token";

export async function GET() {
  const cookieStore = await cookies();
  if (!isAdminSessionValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tokens = await listTravelTokens();
  return NextResponse.json({ tokens });
}
