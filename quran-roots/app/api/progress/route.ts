import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

const progressSchema = z.object({
  surahId: z.number().int().positive(),
  currentAyahId: z.number().int().positive(),
  type: z.enum(["READING", "REVIEW"]).optional(),
  meta: z.record(z.any()).optional(),
});

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const surahId = Number(url.searchParams.get("surahId"));

  const progress = await prisma.progress.findMany({
    where: {
      userId: user.id,
      ...(surahId ? { surahId } : {}),
    },
    include: { ayah: true, surah: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ success: true, data: progress });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const parseResult = progressSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, error: parseResult.error.errors[0].message },
      { status: 400 },
    );
  }

  const { surahId, currentAyahId, type = "READING", meta } = parseResult.data;
  const progress = await prisma.progress.upsert({
    where: { userId_surahId: { userId: user.id, surahId } },
    update: {
      currentAyahId,
      type,
      meta,
      updatedAt: new Date(),
    },
    create: {
      userId: user.id,
      surahId,
      currentAyahId,
      type,
      meta,
    },
    include: { ayah: true, surah: true },
  });

  return NextResponse.json({ success: true, data: progress });
}
