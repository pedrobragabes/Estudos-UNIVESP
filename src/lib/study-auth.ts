import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "univesp-session";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;
export function passwordMatches(candidate: string, password: string) {
  const digest = (value: string) => createHmac("sha256", "univesp-password-comparison").update(value).digest();
  return timingSafeEqual(digest(candidate), digest(password));
}
function signature(payload: string, password: string) {
  return createHmac("sha256", password).update(`univesp-session-v1:${payload}`).digest("base64url");
}
export function createSession(password: string, now = Date.now()) {
  const expires = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${expires}.${signature(expires, password)}`;
}
export function validSession(token: string | undefined, password: string, now = Date.now()) {
  if (!token || token.length > 200) return false;
  const [expires, signed, extra] = token.split(".");
  if (extra !== undefined || !/^\d+$/.test(expires) || !signed || Number(expires) <= Math.floor(now / 1000)) return false;
  return passwordMatches(signed, signature(expires, password));
}
