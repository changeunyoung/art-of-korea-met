import { NextResponse } from "next/server";
import { verifyPassword, getSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return res;
}
