"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";

interface SearchResult {
  surahs: Array<{
    number: number;
    nameAr: string;
    transliteration: string;
    englishName: string;
  }>;
  ayahs: Array<{
    id: number;
    verseKey: string;
    textSimple?: string;
    surah: { number: number; englishName: string };
  }>;
  roots: Array<{ id: number; entry: string; kind: string; meaning: string }>;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query.trim())}`,
      );
      const payload = await response.json();
      if (!payload.success) {
        setError(payload.error ?? "Search failed.");
        setResults(null);
      } else {
        setResults(payload.data);
      }
    } catch (caught) {
      setError("Unable to connect to search service.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <SectionTitle>Search the Quran</SectionTitle>
          <p className="max-w-3xl text-slate-300">
            Search by Surah name, Arabic word, translation text or root entry.
            Results are fetched from the enterprise-ready Quran search API.
          </p>
          <form
            className="flex flex-col gap-4 sm:flex-row"
            onSubmit={handleSearch}
          >
            <input
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-5 py-4 text-slate-100 outline-none transition focus:border-emerald-400"
              placeholder="Search Arabic or English…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Button type="submit" className="w-full sm:w-auto">
              {loading ? "Searching…" : "Search"}
            </Button>
          </form>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </section>

        {results ? (
          <section className="grid gap-6">
            <Card className="bg-slate-900/85 p-6">
              <h2 className="text-xl font-semibold text-white">
                Surah matches
              </h2>
              {results.surahs.length ? (
                <ul className="mt-4 space-y-3 text-slate-300">
                  {results.surahs.map((surah) => (
                    <li
                      key={surah.number}
                      className="rounded-3xl border border-white/10 bg-slate-950/90 p-4"
                    >
                      <p className="font-semibold text-white">{surah.nameAr}</p>
                      <p className="text-sm text-slate-400">
                        {surah.transliteration} · {surah.englishName}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-slate-400">No matching surahs found.</p>
              )}
            </Card>

            <Card className="bg-slate-900/85 p-6">
              <h2 className="text-xl font-semibold text-white">Ayah matches</h2>
              {results.ayahs.length ? (
                <ul className="mt-4 space-y-3 text-slate-300">
                  {results.ayahs.map((ayah) => (
                    <li
                      key={ayah.id}
                      className="rounded-3xl border border-white/10 bg-slate-950/90 p-4"
                    >
                      <p className="font-semibold text-white">
                        {ayah.verseKey}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {ayah.textSimple}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-emerald-300">
                        {ayah.surah.englishName}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-slate-400">No ayah matches found.</p>
              )}
            </Card>

            <Card className="bg-slate-900/85 p-6">
              <h2 className="text-xl font-semibold text-white">
                Dictionary & roots
              </h2>
              {results.roots.length ? (
                <ul className="mt-4 space-y-3 text-slate-300">
                  {results.roots.map((entry) => (
                    <li
                      key={entry.id}
                      className="rounded-3xl border border-white/10 bg-slate-950/90 p-4"
                    >
                      <p className="font-semibold text-white">{entry.entry}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {entry.meaning}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.24em] text-emerald-300">
                        {entry.kind}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-slate-400">
                  No dictionary or root matches found.
                </p>
              )}
            </Card>
          </section>
        ) : null}
      </div>
    </main>
  );
}
