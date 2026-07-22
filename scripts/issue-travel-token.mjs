#!/usr/bin/env node
// Issues a "reveal travel dates" token to paste into an email you send
// yourself (Resend's sandbox mode can only email your own signup address,
// so this isn't wired up to send automatically — see /gallery/selfies-travel
// era notes in the session, same limitation as the booking form).
//
// Usage:
//   node scripts/issue-travel-token.mjs --scope=uk --days=7
//   node scripts/issue-travel-token.mjs --scope=us,hk --hours=12
//   node scripts/issue-travel-token.mjs --scope=us,uk,sg,hk --days=30 --note="trusted regular"
//
// --scope is a comma-separated list of keys from src/content/travel-reveal.js
// (currently us/uk/sg/hk) — the token only unlocks the location(s) listed,
// so you can send one applicant a UK-only token and another a token that
// reveals every location, without changing any code.
//
// Requires UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN in .env.local
// (same store the /admin token list reads from) — every token issued here
// shows up there too, and can be revoked or edited from that page.

import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const args = { scope: [], hours: 0, days: 0, note: "" };
  for (const raw of argv) {
    const [flag, value] = raw.replace(/^--/, "").split(/=(.*)/s);
    if (flag === "scope") args.scope = value.split(",").map((s) => s.trim()).filter(Boolean);
    if (flag === "hours") args.hours = Number(value);
    if (flag === "days") args.days = Number(value);
    if (flag === "note") args.note = value;
  }
  return args;
}

loadEnvLocal();
const { scope, hours, days, note } = parseArgs(process.argv.slice(2));

if (scope.length === 0) {
  console.error("Missing --scope, e.g. --scope=dates or --scope=dates,itinerary");
  process.exit(1);
}
if (hours <= 0 && days <= 0) {
  console.error("Missing lifetime — pass --hours=N and/or --days=N");
  process.exit(1);
}

const { issueTravelToken } = await import("../src/lib/travel-token.js");
const { TRAVEL_SECTIONS } = await import("../src/content/travel-reveal.js");

const unknown = scope.filter((key) => !TRAVEL_SECTIONS[key]);
if (unknown.length > 0) {
  console.error(
    `Unknown scope key(s): ${unknown.join(", ")} — valid keys: ${Object.keys(TRAVEL_SECTIONS).join(", ")}`
  );
  process.exit(1);
}

const { id, token } = await issueTravelToken({ scope, hours, days, note });
const lifetime = [days && `${days}d`, hours && `${hours}h`].filter(Boolean).join(" ");

console.log(`\nToken (id: ${id}, scope: ${scope.join(", ")}, valid ${lifetime}):\n`);
console.log(token);
console.log("\nPaste this into the email you send the applicant.\n");
