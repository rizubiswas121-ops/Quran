import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

const bookmarkSchema = z.object({
  ayahId: z.number().int().positive(),
  label: z.string().max(128).optional(),
  note: z.string().max(1024).optional(),
  category: z.string().max(64).optional(),
});

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: { ayah: { include: { surah: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: bookmarks });
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
  const parseResult = bookmarkSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, error: parseResult.error.errors[0].message },
      { status: 400 },
    );
  }

  const { ayahId, label, note, category } = parseResult.data;

  const newBookmark = await prisma.bookmark.upsert({
    where: { userId_ayahId: { userId: user.id, ayahId } },
    update: {
      label,
      note,
      category,
      updatedAt: new Date(),
    },
    create: {
      userId: user.id,
      ayahId,
      label,
      note,
      category,
    },
    include: { ayah: { include: { surah: true } } },
  });

  return NextResponse.json({ success: true, data: newBookmark });
}

export async function DELETE(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const ayahId = Number(url.searchParams.get("ayahId"));
  if (!ayahId || Number.isNaN(ayahId)) {
    return NextResponse.json(
      { success: false, error: "ayahId is required" },
      { status: 400 },
    );
  }

  await prisma.bookmark.deleteMany({ where: { userId: user.id, ayahId } });
  return NextResponse.json({ success: true });
}
