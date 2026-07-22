import crypto from "crypto";

// Shared primitive behind every self-verifying token on this site (travel
// reveal tokens, the admin session cookie): payload + HMAC signature, no
// database or lookup table needed to check one, which matters since this
// runs on Vercel's stateless serverless functions.
function sign(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSignedToken(data, secret) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

// Returns the decoded payload if the signature checks out, otherwise null.
// Doesn't know about "expiry" or any other payload shape — callers decide
// what the data means and whether it's still valid.
export function readSignedToken(token, secret) {
  if (typeof token !== "string") return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload, secret);
  const given = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !crypto.timingSafeEqual(given, wanted)) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}
