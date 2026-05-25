import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  createSession,
  sanitizeUser,
} from "@/lib/auth";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = registerSchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, error: parseResult.error.errors[0].message },
      { status: 400 },
    );
  }

  const { email, password, name } = parseResult.data;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json(
      { success: false, error: "User already exists with this email." },
      { status: 409 },
    );
  }

  const passwordHash = await hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      emailVerified: false,
    },
  });

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
