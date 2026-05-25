import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { RegionsManager } from "@/components/admin/regions-manager";
import { SectionTitle } from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";

export default async function AdminPage() {
  const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    redirect("/login");
  }

  const user = await getUserFromSession(sessionToken);
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN" && user.role !== "REGIONAL_ADMIN") {
    redirect("/login");
  }

  const regions = await prisma.region.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
          <SectionTitle>Admin console</SectionTitle>
          <p className="mt-4 text-slate-300">
            This panel is reserved for admins and regional administrators.
            Manage region settings, editorial access, and user localization
            controls.
          </p>
        </section>

        <section className="grid gap-6">
          <Card className="bg-slate-900/85 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
              Current role
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {user.role}
            </p>
            <p className="mt-3 text-slate-400">
              Users with ADMIN can create and delete regions. Regional admins
              may review region data and manage users assigned to their region.
            </p>
          </Card>

          <RegionsManager initialRegions={regions} role={user.role} />
        </section>
      </div>
    </main>
  );
}
