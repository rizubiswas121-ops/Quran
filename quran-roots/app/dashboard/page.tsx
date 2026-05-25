import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

export default async function DashboardPage() {
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    redirect("/login");
  }

  const user = await getUserFromSession(sessionToken);
  if (!user) {
    redirect("/login");
  }

  const [bookmarkCount, progressCount, recentBookmarks, recentProgress] =
    await Promise.all([
      prisma.bookmark.count({ where: { userId: user.id } }),
      prisma.progress.count({ where: { userId: user.id } }),
      prisma.bookmark.findMany({
        where: { userId: user.id },
        include: { ayah: { include: { surah: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.progress.findMany({
        where: { userId: user.id },
        include: { ayah: true, surah: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
                Dashboard
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-white">
                Your learning overview
              </h1>
              <p className="mt-2 text-slate-300">
                Track your Quran progress, bookmarks, and recent activity from a
                single view.
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex rounded-full bg-emerald-500/90 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              View profile
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-slate-900/85 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
              Bookmarks
            </p>
            <p className="mt-4 text-4xl font-semibold text-white">
              {bookmarkCount}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Saved ayah bookmarks for review.
            </p>
          </Card>
          <Card className="bg-slate-900/85 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
              Progress entries
            </p>
            <p className="mt-4 text-4xl font-semibold text-white">
              {progressCount}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Active reading progress records.
            </p>
          </Card>
          <Card className="bg-slate-900/85 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
              Current region
            </p>
            <p className="mt-4 text-3xl font-semibold text-white">
              {user.regionId ?? "Global"}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Regional preferences and content tuning.
            </p>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-slate-900/85 p-6">
            <SectionTitle>Recent bookmarks</SectionTitle>
            {recentBookmarks.length ? (
              <div className="mt-4 space-y-4">
                {recentBookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/90 p-4"
                  >
                    <p className="font-semibold text-white">
                      {bookmark.ayah.verseKey}
                    </p>
                    <p className="mt-2 text-slate-300">
                      {bookmark.ayah.textSimple ?? bookmark.ayah.textUthmani}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-emerald-300">
                      {bookmark.ayah.surah.englishName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-400">No bookmarks saved yet.</p>
            )}
          </Card>

          <Card className="bg-slate-900/85 p-6">
            <SectionTitle>Recent progress</SectionTitle>
            {recentProgress.length ? (
              <div className="mt-4 space-y-4">
                {recentProgress.map((progress) => (
                  <div
                    key={progress.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/90 p-4"
                  >
                    <p className="font-semibold text-white">
                      {progress.surah.englishName}
                    </p>
                    <p className="mt-2 text-slate-300">
                      Current Ayah: {progress.ayah.verseKey}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">
                      Last updated{" "}
                      {progress.updatedAt.toISOString().split("T")[0]}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-400">No progress entries yet.</p>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}
