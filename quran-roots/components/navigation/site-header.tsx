"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserSession {
  id: string;
  email: string;
  name: string | null;
  role: string;
  locale: string;
}

export function SiteHeader() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const payload = await response.json();
        setSession(payload.success ? payload.data : null);
      } catch {
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSession(null);
    router.push("/");
  };

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-slate-100 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-3 text-base font-semibold text-white"
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
            Q
          </div>
          QLean
        </Link>

        <nav className="hidden items-center gap-3 text-sm text-slate-300 md:flex">
          <Link href="/surah" className="transition hover:text-white">
            Surah reader
          </Link>
          <Link href="/search" className="transition hover:text-white">
            Search
          </Link>
          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
          {session?.role === "ADMIN" || session?.role === "REGIONAL_ADMIN" ? (
            <Link href="/admin" className="transition hover:text-white">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {session === undefined || isLoading ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-slate-800" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2 text-slate-200 sm:flex">
                <UserCircle2 className="h-5 w-5 text-emerald-300" />
                <span>{session.name ?? session.email}</span>
              </div>
              <Button
                className="bg-slate-800 text-white hover:bg-slate-700"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-200 transition hover:text-white"
              >
                Sign in
              </Link>
              <Button
                className="bg-emerald-500/90 text-slate-950 hover:bg-emerald-400"
                onClick={() => router.push("/register")}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
