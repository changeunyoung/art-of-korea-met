import { createHash } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin-session";

export function getSessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "fallback-secret";
  const password = process.env.ADMIN_PASSWORD ?? "";
  return createHash("sha256").update(password + secret).digest("hex");
}

export function verifyPassword(input: string): boolean {
  return input === (process.env.ADMIN_PASSWORD ?? "");
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === getSessionToken();
}

export { COOKIE_NAME };
