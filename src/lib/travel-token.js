import { createSignedToken, readSignedToken } from "./signed-token";

const SECRET = process.env.TRAVEL_TOKEN_SECRET;

// hours/days both contribute to the lifetime — e.g. { days: 7 } or
// { hours: 6 } or { hours: 12, days: 1 } for "a day and a half".
export function issueTravelToken({ scope, hours = 0, days = 0 }) {
  if (!SECRET) throw new Error("TRAVEL_TOKEN_SECRET is not set");
  const exp = Date.now() + (hours * 60 + days * 24 * 60) * 60 * 1000;
  return createSignedToken({ scope, exp }, SECRET);
}

export function verifyTravelToken(token) {
  if (!SECRET) return { valid: false, reason: "invalid" };

  const data = readSignedToken(token, SECRET);
  if (!data) return { valid: false, reason: "invalid" };

  if (typeof data.exp !== "number" || Date.now() > data.exp) {
    return { valid: false, reason: "expired" };
  }

  return { valid: true, scope: Array.isArray(data.scope) ? data.scope : [] };
}
