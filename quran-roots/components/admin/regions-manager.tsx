"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Plus, Save, Trash2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Region {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  settings?: Record<string, unknown> | null;
}

interface RegionsManagerProps {
  initialRegions: Region[];
  role: string;
}

export function RegionsManager({ initialRegions, role }: RegionsManagerProps) {
  const [regions, setRegions] = useState<Region[]>(initialRegions);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canEdit = useMemo(() => role === "ADMIN", [role]);

  const createRegion = async () => {
    if (!code.trim() || !name.trim()) {
      setError("Region code and name are required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          name: name.trim(),
          description: description.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        setError(payload.error ?? "Unable to save region.");
        return;
      }
      setRegions((current) => [payload.data, ...current]);
      setCode("");
      setName("");
      setDescription("");
    } catch {
      setError("Unable to create region. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRegion = async (regionId: string) => {
    if (!canEdit) return;
    const response = await fetch("/api/admin/regions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: regionId }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.success) {
      setError(payload.error ?? "Unable to delete region.");
      return;
    }
    setRegions((current) => current.filter((region) => region.id !== regionId));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="bg-slate-900/85 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
              Region administration
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Managed regions
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-emerald-200">
            <UserCheck className="h-4 w-4" />
            {role}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {regions.map((region) => (
            <div
              key={region.id}
              className="rounded-3xl border border-white/10 bg-slate-950/80 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {region.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{region.code}</p>
                </div>
                {canEdit ? (
                  <Button
                    variant="secondary"
                    className="bg-rose-600/10 text-rose-200 hover:bg-rose-600/20"
                    onClick={() => deleteRegion(region.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {region.description ?? "No region description provided."}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-slate-900/85 p-6">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
              Create new region
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Region settings
            </h2>
          </div>
          <Plus className="h-5 w-5 text-emerald-300" />
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Region code
              <input
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="e.g. MEA"
                disabled={!canEdit}
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Region name
              <input
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Middle East & Africa"
                disabled={!canEdit}
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Description
              <textarea
                rows={4}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Regional quality and translation preferences."
                disabled={!canEdit}
              />
            </label>
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <Button
            className="w-full bg-emerald-500/90 text-slate-950 hover:bg-emerald-400"
            onClick={createRegion}
            disabled={!canEdit || saving}
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save region"}
          </Button>
          {!canEdit ? (
            <p className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
              Regional admins may review access here, but only full admins can
              create or delete regions.
            </p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
