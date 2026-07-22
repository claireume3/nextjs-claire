import { Redis } from "@upstash/redis";

let client;

// Lazy singleton: importing this module shouldn't throw just because the
// env vars aren't set yet (e.g. during `next build`, before any request
// needs a real connection) — only instantiating the client does that.
//
// Reads the TOKENS_KV_REST_API_* vars (not the plain UPSTASH_REDIS_REST_*
// names @upstash/redis's Redis.fromEnv() looks for by default) — Vercel
// prefixes env vars with the storage resource's name ("TOKENS") when it
// connects a Marketplace database to the project.
export function getRedis() {
  if (!client) {
    client = new Redis({
      url: process.env.TOKENS_KV_REST_API_URL,
      token: process.env.TOKENS_KV_REST_API_TOKEN,
    });
  }
  return client;
}
