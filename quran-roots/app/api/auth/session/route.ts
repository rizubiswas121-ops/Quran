import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getUserFromSession,
  sanitizeUser,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function GET() {
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return NextResponse.json({ success: true, data: null });
  }

  const user = await getUserFromSession(sessionToken);
  if (!user) {
    return NextResponse.json({ success: true, data: null });
  }

  return NextResponse.json({ success: true, data: sanitizeUser(user) });
}
