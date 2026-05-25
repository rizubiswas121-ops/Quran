import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  createSession,
  sanitizeUser,
} from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = loginSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, error: parseResult.error.errors[0].message },
      { status: 400 },
    );
  }

  const { email, password } = parseResult.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials." },
      { status: 401 },
    );
  }

  const isValid = await compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials." },
      { status: 401 },
    );
  }

  const session = await createSession(user.id);
  const response = NextResponse.json({
    success: true,
    data: sanitizeUser(user),
  });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: session.token,
    ...SESSION_COOKIE_OPTIONS,
  });

  return response;
}
