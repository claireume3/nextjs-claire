import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "@/lib/admin-session";

export async function GET() {
  const cookieStore = await cookies();
  const authed = isAdminSessionValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  return NextResponse.json({ authed });
}
