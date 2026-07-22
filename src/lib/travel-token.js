import crypto from "crypto";

// Self-contained (no database): a token is just its payload + an HMAC
// signature over that payload, so verifying it is pure computation — no
// lookup table to keep in sync across serverless invocations. Anyone
// holding TRAVEL_TOKEN_SECRET can mint tokens; anyone without it can't
// forge one, since changing the payload without the secret invalidates
// the signature.
const SECRET = process.env.TRAVEL_TOKEN_SECRET;

function sign(payload) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

// hours/days both contribute to the lifetime — e.g. { days: 7 } or
// { hours: 6 } or { hours: 12, days: 1 } for "a day and a half".
export function issueTravelToken({ scope, hours = 0, days = 0 }) {
  if (!SECRET) throw new Error("TRAVEL_TOKEN_SECRET is not set");
  const exp = Date.now() + (hours * 60 + days * 24 * 60) * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ scope, exp })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyTravelToken(token) {
  if (!SECRET || typeof token !== "string") return { valid: false, reason: "invalid" };

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return { valid: false, reason: "invalid" };

  const expected = sign(payload);
  const given = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) {
    return { valid: false, reason: "invalid" };
  }

  let data;
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return { valid: false, reason: "invalid" };
  }

  if (typeof data.exp !== "number" || Date.now() > data.exp) {
    return { valid: false, reason: "expired" };
  }

  return { valid: true, scope: Array.isArray(data.scope) ? data.scope : [] };
}
