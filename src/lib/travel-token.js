import crypto from "crypto";
import { createSignedToken, readSignedToken } from "./signed-token.js";
import { getRedis } from "./kv.js";

const SECRET = process.env.TRAVEL_TOKEN_SECRET;
const INDEX_KEY = "travel-tokens:index";
const recordKey = (id) => `travel-tokens:record:${id}`;

function computeExp({ hours = 0, days = 0 }) {
  return Date.now() + (hours * 60 + days * 24 * 60) * 60 * 1000;
}

// hours/days both contribute to the lifetime — e.g. { days: 7 } or
// { hours: 6 } or { hours: 12, days: 1 } for "a day and a half".
//
// The signed token embeds an `id`, but scope/expiry/revoked are NOT
// trusted from the token itself at verify time — they're read fresh from
// the KV record every time, so an admin edit or revoke takes effect
// immediately without reissuing a new token string. The signature only
// proves the id wasn't forged/tampered with.
export async function issueTravelToken({ scope, hours = 0, days = 0, note = "" }) {
  if (!SECRET) throw new Error("TRAVEL_TOKEN_SECRET is not set");

  const id = crypto.randomBytes(9).toString("base64url");
  const exp = computeExp({ hours, days });
  const token = createSignedToken({ id, scope, exp }, SECRET);
  const issuedAt = Date.now();

  const redis = getRedis();
  await redis.set(recordKey(id), { id, token, scope, exp, note, issuedAt, revoked: false });
  await redis.zadd(INDEX_KEY, { score: issuedAt, member: id });

  return { id, token };
}

export async function verifyTravelToken(tokenString) {
  if (!SECRET) return { valid: false, reason: "invalid" };

  const payload = readSignedToken(tokenString, SECRET);
  if (!payload || typeof payload.id !== "string") return { valid: false, reason: "invalid" };

  const record = await getRedis().get(recordKey(payload.id));
  if (!record) return { valid: false, reason: "invalid" };

  if (record.revoked) return { valid: false, reason: "revoked" };
  if (typeof record.exp !== "number" || Date.now() > record.exp) {
    return { valid: false, reason: "expired" };
  }

  return { valid: true, scope: Array.isArray(record.scope) ? record.scope : [] };
}

// Most-recently-issued first.
export async function listTravelTokens() {
  const redis = getRedis();
  const ids = await redis.zrange(INDEX_KEY, 0, -1, { rev: true });
  if (ids.length === 0) return [];

  const records = await Promise.all(ids.map((id) => redis.get(recordKey(id))));
  return records.filter(Boolean);
}

// `patch` is applied as-is over the existing record — callers build it
// (e.g. resolving hours/days into a fresh `exp`) rather than this function
// guessing which fields were meant to change.
export async function updateTravelToken(id, patch) {
  const redis = getRedis();
  const record = await redis.get(recordKey(id));
  if (!record) return null;

  const next = { ...record, ...patch };
  await redis.set(recordKey(id), next);
  return next;
}

export { computeExp };
