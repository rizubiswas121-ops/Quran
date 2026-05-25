import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AyahCard } from "@/components/quran/ayah-card";
import { SectionTitle } from "@/components/ui/section-title";

interface SurahPageProps {
  params: { number: string };
}

const getSurah = async (surahNumber: number) => {
  return prisma.surah.findUnique({
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
};

export default async function SurahDetailPage({ params }: SurahPageProps) {
  const surahNumber = Number(params.number);

  if (Number.isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    notFound();
  }

  const surah = await getSurah(surahNumber);
  if (!surah) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
                Surah {surah.number}
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {surah.nameAr}
              </h1>
              <p className="mt-2 text-lg text-slate-300">
                {surah.transliteration} · {surah.englishName}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 p-5 text-slate-200">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
                Ayahs
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {surah.ayahCount}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6">
          {surah.ayahs.map((ayah) => (
            <AyahCard key={ayah.id} ayah={ayah} />
          ))}
        </section>
      </div>
    </main>
  );
}
