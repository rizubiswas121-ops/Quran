import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

const updateUserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["ADMIN", "REGIONAL_ADMIN", "USER"]).optional(),
  regionId: z.string().uuid().nullable().optional(),
});

const deleteUserSchema = z.object({
  id: z.string().uuid(),
});

async function assertAdmin(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return null;
  }
  return user;
}

export async function GET(request: Request) {
  const user = await assertAdmin(request);
  if (!user || (user.role !== "ADMIN" && user.role !== "REGIONAL_ADMIN")) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  // Regional admins see users in their region only
  const whereClause =
    user.role === "REGIONAL_ADMIN" && user.regionId
      ? { regionId: user.regionId }
      : {};

  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      locale: true,
      regionId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ success: true, data: users });
}

export async function PATCH(request: Request) {
  const user = await assertAdmin(request);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  // Only full ADMINs can change roles
  if (user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0].message },
      { status: 400 },
    );
  }

  const updated = await prisma.user.update({
    where: { id: parsed.data.id },
    data: {
      role: parsed.data.role,
      regionId: parsed.data.regionId ?? null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      locale: true,
      regionId: true,
    },
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: Request) {
  const user = await assertAdmin(request);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const parsed = deleteUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0].message },
      { status: 400 },
    );
  }

  await prisma.user.delete({ where: { id: parsed.data.id } });
  return NextResponse.json({ success: true });
}
