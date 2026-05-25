import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export default async function ProfilePage() {
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    redirect("/login");
  }

  const user = await getUserFromSession(sessionToken);
  if (!user) {
    redirect("/login");
  }

  const bookmarkCount = await prisma.bookmark.count({
    where: { userId: user.id },
  });
  const progressCount = await prisma.progress.count({
    where: { userId: user.id },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
                Profile
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-white">
                Hello, {user.name ?? user.email}
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex rounded-full bg-emerald-500/90 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              View dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-950/90 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Email
              </p>
              <p className="mt-3 text-lg text-slate-100">{user.email}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Role
              </p>
              <p className="mt-3 text-lg text-slate-100">{user.role}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Bookmarks
              </p>
              <p className="mt-3 text-lg text-slate-100">{bookmarkCount}</p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Progress entries
              </p>
              <p className="mt-3 text-lg text-slate-100">{progressCount}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
            Account
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Personal settings
          </h2>
          <p className="mt-4 text-slate-300">
            Your profile page contains the account data used to personalize the
            QLean learning experience.
          </p>
          <div className="mt-6 space-y-4 text-slate-300">
            <p>
              <strong className="text-white">Locale:</strong> {user.locale}
            </p>
            <p>
              <strong className="text-white">Region:</strong>{" "}
              {user.regionId ?? "Not assigned"}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
