import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return <>{children}</>;
}
