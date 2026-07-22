import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isAdminSessionValid } from "@/lib/admin-session";
import { computeExp, updateTravelToken } from "@/lib/travel-token";
import { TRAVEL_SECTIONS } from "@/content/travel-reveal";

// One handler for both "edit" (scope/note/lifetime) and "revoke" (just
// `{ revoked: true }`) — same authorization, same shape of change: apply
// a partial patch to the stored record. verifyTravelToken reads that
// record fresh on every check, so a save here takes effect immediately.
export async function PATCH(request, { params }) {
  const cookieStore = await cookies();
  if (!isAdminSessionValid(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const patch = {};

  if (Array.isArray(body.scope)) {
    const cleanScope = body.scope.filter((key) => TRAVEL_SECTIONS[key]);
    if (cleanScope.length === 0) {
      return NextResponse.json({ error: "Pick at least one location" }, { status: 400 });
    }
    patch.scope = cleanScope;
  }

  if (typeof body.note === "string") patch.note = body.note.slice(0, 500);
  if (typeof body.revoked === "boolean") patch.revoked = body.revoked;

  if (body.hours !== undefined || body.days !== undefined) {
    const totalHours = Number(body.hours) || 0;
    const totalDays = Number(body.days) || 0;
    if (totalHours <= 0 && totalDays <= 0) {
      return NextResponse.json({ error: "Set a lifetime greater than zero" }, { status: 400 });
    }
    patch.exp = computeExp({ hours: totalHours, days: totalDays });
  }

  const updated = await updateTravelToken(id, patch);
  if (!updated) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  return NextResponse.json({ token: updated });
}
