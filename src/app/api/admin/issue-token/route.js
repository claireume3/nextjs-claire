import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "@/lib/admin-session";
import { issueTravelToken } from "@/lib/travel-token";
import { TRAVEL_SECTIONS } from "@/content/travel-reveal";

export async function POST(request) {
  const cookieStore = await cookies();
  if (!isAdminSessionValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { scope, hours, days, note } = await request.json();
  const cleanScope = Array.isArray(scope) ? scope.filter((key) => TRAVEL_SECTIONS[key]) : [];

  if (cleanScope.length === 0) {
    return NextResponse.json({ error: "Pick at least one location" }, { status: 400 });
  }

  const totalHours = Number(hours) || 0;
  const totalDays = Number(days) || 0;
  if (totalHours <= 0 && totalDays <= 0) {
    return NextResponse.json({ error: "Set a lifetime greater than zero" }, { status: 400 });
  }

  const { id, token } = await issueTravelToken({
    scope: cleanScope,
    hours: totalHours,
    days: totalDays,
    note: typeof note === "string" ? note.slice(0, 500) : "",
  });

  return NextResponse.json({ id, token });
}
