import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

const featureRows = [
  {
    title: "Deep Quran reader",
    description:
      "Surah-by-surah navigation with ayah detail, word segmentation, and Mushaf-style readability.",
  },
  {
    title: "Word-by-word tafsir",
    description:
      "Arabic root linking, translation chains, and contextual semantics for every word.",
  },
  {
    title: "Regional admin layer",
    description:
      "Manage translations, tafsir sources, and user progress by region in one dashboard.",
  },
  {
    title: "Offline-first PWA",
    description:
      "Fast installable reader with service-worker caching and local progress sync.",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-slate-950 px-6 pb-24 pt-20 text-slate-100 lg:px-12">
      <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-emerald-500/20 to-transparent blur-3xl" />
      <div className="mx-auto flex max-w-7xl flex-col gap-16">
        <header className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-400">QLean</div>
          <div className="flex gap-3 text-sm text-slate-300">
            <a href="/login" className="transition hover:text-white">
              Login
            </a>
            <a
              href="/register"
              className="rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-200 transition hover:bg-emerald-500/30 hover:text-white"
            >
              Register
            </a>
          </div>
        </header>
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <p className="inline-flex rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Premium Quran platform
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Build the world’s most powerful Quran research experience.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              A green-tech Islamic learning platform with full Quran text,
              word-by-word tafsir, root discovery, audio-ready architecture,
              admin workflows, and mobile PWA excellence.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/surah" className="inline-block w-full sm:w-auto">
                <Button className="min-w-45 w-full">
                  Explore the Quran reader
                </Button>
              </Link>
              <Link href="/search" className="inline-block w-full sm:w-auto">
                <Button className="min-w-45 w-full bg-slate-800 text-white hover:bg-slate-700">
                  Search the Quran
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            <Card className="border-emerald-400/10 bg-slate-900/80">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
                Fast architecture
              </p>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-2xl font-semibold text-white">95+</p>
                  <p className="text-sm text-slate-400">
                    Lighthouse performance baseline
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-white">
                    Offline-ready
                  </p>
                  <p className="text-sm text-slate-400">
                    PWA caching with localism and asset prefetching.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="border-slate-700/50 bg-slate-900/85">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Built for seekers
              </p>
              <ul className="mt-6 space-y-3 text-slate-300">
                <li>Arabic-first typography</li>
                <li>Word-level tafsir queries</li>
                <li>Root-driven ayaah discovery</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionTitle>Platform architecture</SectionTitle>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Open, secure, and scalable system design using Next.js App Router,
              Prisma + PostgreSQL, modern API routes, and a reusable Islamic
              learning component library.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featureRows.map((feature) => (
              <Card key={feature.title} className="bg-slate-900/80">
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-slate-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="bg-slate-900/75">
            <SectionTitle>Feature preview</SectionTitle>
            <p className="mt-4 text-slate-300">
              The next stage is a modular Quran reader with multi-source tafsir
              toggle, dictionary exploration, robust search, and an admin panel
              for localization and editorial control.
            </p>
            <div className="mt-8 grid gap-4 text-slate-300 sm:grid-cols-2">
              <div>
                <strong className="text-white">Search</strong>
                <p className="mt-2 text-sm text-slate-400">
                  Query surah names, Arabic words, translations, and root
                  entries instantly.
                </p>
              </div>
              <div>
                <strong className="text-white">Bookmarks</strong>
                <p className="mt-2 text-sm text-slate-400">
                  Save tafsir entry points, page modes, and user progress by
                  ayah.
                </p>
              </div>
              <div>
                <strong className="text-white">Dictionary</strong>
                <p className="mt-2 text-sm text-slate-400">
                  Deep lookup for letters, roots, words, and thematic
                  connections.
                </p>
              </div>
              <div>
                <strong className="text-white">PWA</strong>
                <p className="mt-2 text-sm text-slate-400">
                  Installable reading experience with offline synchronization.
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-6 rounded-3xl border border-emerald-500/10 bg-emerald-500/5 p-8 text-slate-200 shadow-2xl shadow-emerald-500/10">
            <p className="text-sm uppercase tracking-[0.22em] text-emerald-200">
              Next steps
            </p>
            <h2 className="text-3xl font-semibold text-white">
              Work plan for the first production sprint
            </h2>
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Build the core Quran reader, Surah navigation, and word-level
                data models.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Add Prisma schema, PostgreSQL persistence, and search API with
                root matching.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Implement user bookmark / progress tracking, admin region model,
                and offline PWA service worker.
              </li>
            </ul>
            <Button>
              View architecture <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
