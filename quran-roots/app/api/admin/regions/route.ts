import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

const createRegionSchema = z.object({
  code: z.string().min(2).max(10),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
});

const updateRegionSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(2).max(10).optional(),
  name: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
});

const deleteRegionSchema = z.object({
  id: z.string().uuid(),
});

async function assertAdmin(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user || (user.role !== "ADMIN" && user.role !== "REGIONAL_ADMIN")) {
    return null;
  }
  return user;
}

export async function GET(request: Request) {
  const user = await assertAdmin(request);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const regions = await prisma.region.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ success: true, data: regions });
}

export async function POST(request: Request) {
  const user = await assertAdmin(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const parseResult = createRegionSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, error: parseResult.error.errors[0].message },
      { status: 400 },
    );
  }

  const region = await prisma.region.create({
    data: {
      code: parseResult.data.code.trim().toUpperCase(),
      name: parseResult.data.name.trim(),
      description: parseResult.data.description?.trim() ?? null,
    },
  });

  return NextResponse.json({ success: true, data: region });
}

export async function PATCH(request: Request) {
  const user = await assertAdmin(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const parseResult = updateRegionSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, error: parseResult.error.errors[0].message },
      { status: 400 },
    );
  }

  const region = await prisma.region.update({
    where: { id: parseResult.data.id },
    data: {
      code: parseResult.data.code?.trim().toUpperCase(),
      name: parseResult.data.name?.trim(),
      description: parseResult.data.description?.trim(),
    },
  });

  return NextResponse.json({ success: true, data: region });
}

export async function DELETE(request: Request) {
  const user = await assertAdmin(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Forbidden" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const parseResult = deleteRegionSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, error: parseResult.error.errors[0].message },
      { status: 400 },
    );
  }

  await prisma.region.delete({ where: { id: parseResult.data.id } });
  return NextResponse.json({ success: true });
}
