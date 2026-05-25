"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TranslationSource {
  id: number;
  name: string;
  language: string;
}

interface TranslationEntry {
  id: number;
  text: string;
  source: TranslationSource;
}

interface TafsirEntry {
  id: number;
  source: string;
  language: string;
  author?: string;
  text: string;
}

interface WordEntry {
  id: number;
  position: number;
  textAr: string;
  transliteration?: string | null;
  translation?: string | null;
  root?: string | null;
}

interface AyahCardProps {
  ayah: {
    id: number;
    number: number;
    verseKey: string;
    textUthmani: string;
    textSimple?: string | null;
    words: WordEntry[];
    translations: TranslationEntry[];
    tafsirs: TafsirEntry[];
  };
}

export function AyahCard({ ayah }: AyahCardProps) {
  const [showTafsir, setShowTafsir] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState<number>(
    ayah.translations[0]?.id ?? 0,
  );
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [bookmarkSaving, setBookmarkSaving] = useState(false);

  const activeTranslation = useMemo(
    () =>
      ayah.translations.find((item) => item.id === selectedTranslation) ??
      ayah.translations[0],
    [ayah.translations, selectedTranslation],
  );

  const handleBookmark = async () => {
    setBookmarkSaving(true);
    setBookmarkError(null);

    try {
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ayahId: ayah.id }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        setBookmarkError(result.error ?? "Unable to save bookmark.");
        return;
      }

      setBookmarked(true);
    } catch (error) {
      setBookmarkError("Unable to save bookmark. Please log in and try again.");
    } finally {
      setBookmarkSaving(false);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
            Ayah {ayah.number}
          </p>
          <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">
            {ayah.textUthmani}
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-flow-col sm:grid-cols-[auto_auto]">
          <Button
            className={cn(
              "inline-flex items-center gap-2",
              bookmarked
                ? "bg-slate-700 text-white hover:bg-slate-600"
                : "bg-emerald-500/90 text-slate-950 hover:bg-emerald-400",
            )}
            type="button"
            onClick={handleBookmark}
            disabled={bookmarkSaving}
          >
            <Bookmark className="h-4 w-4" />
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button
            className="inline-flex items-center gap-2 bg-slate-950 text-slate-100 hover:bg-slate-800"
            type="button"
            onClick={() => setShowTafsir((current) => !current)}
          >
            {showTafsir ? "Hide tafsir" : "Show tafsir"}
          </Button>
        </div>
      </div>
      {bookmarkError ? (
        <p className="mt-3 text-sm text-rose-300">{bookmarkError}</p>
      ) : null}

      <div className="mt-5 rounded-3xl border border-white/10 bg-slate-900/90 p-5">
        <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
          <label className="text-sm font-medium text-slate-300">
            Translation
          </label>
          <select
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400"
            value={selectedTranslation}
            onChange={(event) =>
              setSelectedTranslation(Number(event.target.value))
            }
          >
            {ayah.translations.map((translation) => (
              <option key={translation.id} value={translation.id}>
                {translation.source.name}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-6 rounded-3xl bg-slate-950/80 p-5 text-base leading-8 text-slate-200">
          {activeTranslation?.text ?? "No translation available."}
        </p>
      </div>

      <div className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-slate-900/90 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Word breakdown
          </p>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            {ayah.words.length} words
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {ayah.words.slice(0, 6).map((word) => (
            <div
              key={word.id}
              className="rounded-3xl border border-white/10 bg-slate-950/80 p-4"
            >
              <p className="text-right text-2xl font-semibold leading-tight text-white">
                {word.textAr}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {word.translation ?? "—"}
              </p>
              {word.root ? (
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-emerald-300">
                  Root: {word.root}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {showTafsir ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-emerald-500/5 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">
                  Tafsir sources
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Toggle between commentary sources and inspect the ayah
                  context.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-2 text-emerald-200">
                <span>{showTafsir ? "Expanded" : "Collapsed"}</span>
                {showTafsir ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>

            <div className="mt-5 space-y-5">
              {ayah.tafsirs.length > 0 ? (
                ayah.tafsirs.map((tafsir) => (
                  <div
                    key={tafsir.id}
                    className="rounded-3xl bg-slate-950/90 p-5"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                      {tafsir.source} • {tafsir.language.toUpperCase()}
                    </p>
                    <p className="mt-3 text-slate-300 leading-8">
                      {tafsir.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">
                  No tafsir data available for this ayah.
                </p>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
