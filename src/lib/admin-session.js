import { createSignedToken, readSignedToken } from "./signed-token.js";

const SECRET = process.env.ADMIN_SESSION_SECRET;
const SESSION_HOURS = 12;

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_HOURS * 60 * 60;

export function createAdminSession() {
  if (!SECRET) throw new Error("ADMIN_SESSION_SECRET is not set");
  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  return createSignedToken({ exp }, SECRET);
}

export function isAdminSessionValid(token) {
  if (!SECRET) return false;
  const data = readSignedToken(token, SECRET);
  return Boolean(data) && typeof data.exp === "number" && Date.now() <= data.exp;
}
