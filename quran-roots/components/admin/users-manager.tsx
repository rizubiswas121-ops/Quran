"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Edit3, Save, Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  locale: string;
  regionId: string | null;
  regionName?: string | null;
}

interface RegionOption {
  id: string;
  name: string;
}

interface UsersManagerProps {
  initialUsers: AdminUser[];
  regions: RegionOption[];
  role: string;
}

export function UsersManager({
  initialUsers,
  regions,
  role,
}: UsersManagerProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEdit = useMemo(() => role === "ADMIN", [role]);

  const updateUser = async (
    userId: string,
    updates: Partial<Pick<AdminUser, "role" | "regionId">>,
  ) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, ...updates }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        setError(payload.error ?? "Unable to update user.");
        return;
      }
      setUsers((current) =>
        current.map((user) =>
          user.id === userId ? { ...user, ...payload.data } : user,
        ),
      );
      setSelectedUser(null);
    } catch {
      setError("Could not update user. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) {
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        setError(payload.error ?? "Unable to delete user.");
        return;
      }
      setUsers((current) => current.filter((user) => user.id !== userId));
    } catch {
      setError("Could not delete user. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-slate-900/85 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
            User administration
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Manage team access
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-emerald-200">
          <UserCog className="h-4 w-4" />
          {role}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-3xl border border-white/10 bg-slate-950/90 p-4"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">
                  {user.name ?? user.email}
                </p>
                <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                <p className="mt-2 text-sm text-slate-300">
                  Role: <strong>{user.role}</strong>
                </p>
                <p className="text-sm text-slate-300">
                  Region:{" "}
                  <strong>
                    {user.regionName ?? user.regionId ?? "Global"}
                  </strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {canEdit ? (
                  <Button
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
                    onClick={() =>
                      setSelectedUser(user.id === selectedUser ? null : user.id)
                    }
                  >
                    <Edit3 className="h-4 w-4" />
                    {selectedUser === user.id ? "Close" : "Edit"}
                  </Button>
                ) : null}
                {canEdit ? (
                  <Button
                    variant="secondary"
                    className="bg-rose-600/10 text-rose-200 hover:bg-rose-600/20"
                    onClick={() => deleteUser(user.id)}
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                ) : null}
              </div>
            </div>

            {selectedUser === user.id ? (
              <div className="mt-4 space-y-4 rounded-3xl border border-slate-800 bg-slate-900/85 p-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Role
                  </label>
                  <select
                    defaultValue={user.role}
                    className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                    onBlur={(event) =>
                      updateUser(user.id, {
                        role: event.target.value as AdminUser["role"],
                      })
                    }
                    disabled={!canEdit || saving}
                  >
                    <option value="USER">USER</option>
                    <option value="REGIONAL_ADMIN">REGIONAL_ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300">
                    Region
                  </label>
                  <select
                    defaultValue={user.regionId ?? ""}
                    className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                    onBlur={(event) =>
                      updateUser(user.id, {
                        regionId: event.target.value || null,
                      })
                    }
                    disabled={!canEdit || saving}
                  >
                    <option value="">Global</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    className="bg-emerald-500/90 text-slate-950 hover:bg-emerald-400"
                    onClick={() =>
                      updateUser(user.id, {
                        role: user.role,
                        regionId: user.regionId,
                      })
                    }
                    disabled={saving}
                  >
                    <Save className="h-4 w-4" />
                    Save changes
                  </Button>
                  {saving ? (
                    <p className="text-sm text-slate-400">Saving...</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

      {!canEdit ? (
        <p className="mt-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
          Regional admins may view users in their region. Only full admins can
          edit roles and delete user accounts.
        </p>
      ) : null}
    </Card>
  );
}
