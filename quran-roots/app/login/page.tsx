"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        setError(payload.error ?? "Login failed");
        return;
      }

      router.push("/surah");
    } catch {
      setError("Unable to sign in. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-12">
      <div className="mx-auto flex max-w-md flex-col gap-8 rounded-3xl border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-black/30">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
            Sign in
          </p>
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="text-slate-400">
            Use your account to continue Quran reading and bookmarking.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-200">
              Email
              <input
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Password
              <input
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <Button type="submit" className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400">
          New to QLean?{" "}
          <Link
            href="/register"
            className="font-semibold text-emerald-300 hover:text-emerald-200"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
