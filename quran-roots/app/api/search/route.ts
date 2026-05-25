import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.string().min(1, "Search query is required");

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";

  const parseResult = querySchema.safeParse(q.trim());
  if (!parseResult.success) {
    return NextResponse.json(
      { success: false, error: parseResult.error.errors[0].message },
      { status: 400 },
    );
  }

  const query = parseResult.data;
  const [surahs, ayahs, roots] = await Promise.all([
    prisma.surah.findMany({
      where: {
        OR: [
          { nameAr: { contains: query, mode: "insensitive" } },
          { transliteration: { contains: query, mode: "insensitive" } },
          { englishName: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 20,
      orderBy: { number: "asc" },
    }),
    prisma.ayah.findMany({
      where: {
        OR: [
          { textUthmani: { contains: query } },
          { textSimple: { contains: query, mode: "insensitive" } },
          {
            translations: {
              some: { text: { contains: query, mode: "insensitive" } },
            },
          },
        ],
      },
      include: { surah: true },
      take: 40,
      orderBy: { globalNumber: "asc" },
    }),
    prisma.dictionaryEntry.findMany({
      where: {
        OR: [
          { entry: { contains: query, mode: "insensitive" } },
          { meaning: { contains: query, mode: "insensitive" } },
          { root: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 20,
    }),
  ]);

  return NextResponse.json({ success: true, data: { surahs, ayahs, roots } });
}
