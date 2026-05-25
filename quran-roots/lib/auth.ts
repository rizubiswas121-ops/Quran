import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "qlean_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30,
};

export async function createSession(userId: string) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
  return { token, expiresAt };
}

export async function destroySession(token?: string) {
  if (!token) return;
  await prisma.session.deleteMany({
    where: {
      token,
    },
  });
}

export async function getUserFromSession(token?: string) {
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || !session.user) {
    return null;
  }

  return session.user;
}

export async function getUserFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const sessionToken = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split("=")[1];

  if (!sessionToken) return null;
  return getUserFromSession(sessionToken);
}

export function sanitizeUser(user: {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  locale: string;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    role: user.role,
    locale: user.locale,
  };
}
