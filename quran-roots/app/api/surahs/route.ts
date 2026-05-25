import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    const surahs = await prisma.surah.findMany({
      select: {
        id: true,
        number: true,
        nameAr: true,
        transliteration: true,
        englishName: true,
        type: true,
        ayahCount: true,
      },
      orderBy: { number: "asc" },
    });

    return NextResponse.json({ success: true, data: surahs });
  }

  const surahNumber = Number(id);
  if (Number.isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return NextResponse.json(
      { success: false, error: "Invalid surah id" },
      { status: 400 },
    );
  }

  const surah = await prisma.surah.findUnique({
    where: { number: surahNumber },
    include: {
      ayahs: {
        orderBy: { number: "asc" },
        include: {
          words: true,
          translations: { include: { source: true } },
          tafsirs: true,
        },
      },
    },
  });

  if (!surah) {
    return NextResponse.json(
      { success: false, error: "Surah not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, data: surah });
}
