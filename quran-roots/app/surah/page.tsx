import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

const getSurahs = async () => {
  return prisma.surah.findMany({
    select: {
      number: true,
      nameAr: true,
      transliteration: true,
      englishName: true,
      ayahCount: true,
      type: true,
    },
    orderBy: { number: "asc" },
  });
};

export default async function SurahListPage() {
  const surahs = await getSurahs();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <SectionTitle>Quran Surah Index</SectionTitle>
          <p className="max-w-3xl text-slate-300">
            Browse all 114 surahs with Arabic titles, transliteration, and ayah
            count. Tap into the word-level reader and deep tafsir experience.
          </p>
        </section>

        <section className="grid gap-4">
          {surahs.map((surah) => (
            <Link key={surah.number} href={`/surah/${surah.number}`}>
              <Card className="group flex cursor-pointer items-center justify-between gap-6 border-emerald-500/10 bg-slate-950/80 transition hover:-translate-y-0.5 hover:bg-slate-900/95">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-200">
                      {surah.number}
                    </span>
                    <h2 className="text-xl font-semibold text-white">
                      {surah.nameAr}
                    </h2>
                  </div>
                  <p className="text-sm text-slate-400">
                    {surah.transliteration} • {surah.englishName}
                  </p>
                </div>
                <div className="text-right text-sm text-slate-400">
                  <p>{surah.ayahCount} ayahs</p>
                  <p className="text-emerald-300">{surah.type}</p>
                </div>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
