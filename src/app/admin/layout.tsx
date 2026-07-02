import "../globals.css";
import Link from "next/link";
import { isAdmin, isAuthConfigured } from "@/lib/admin-auth";
import { logoutAction } from "./actions";

export const metadata = {
  title: "Khabar Admin",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/published", label: "Published" },
  { href: "/admin/rejected", label: "Rejected" },
  { href: "/admin/new", label: "+ New Article" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin();

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-100 font-sans text-slate-900 antialiased">
        <div className="border-b border-slate-300 bg-slate-900 text-slate-100">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
            <Link href="/admin" className="font-bold tracking-tight">
              Khabar Admin
            </Link>
            {authed && (
              <nav className="flex flex-wrap items-center gap-4 text-sm">
                {NAV.map((item) => (
                  <Link key={item.href} href={item.href} className="text-slate-300 hover:text-white">
                    {item.label}
                  </Link>
                ))}
                <a href="/" target="_blank" className="text-slate-300 hover:text-white">
                  View site ↗
                </a>
              </nav>
            )}
            <div className="ml-auto flex items-center gap-3 text-xs text-slate-400">
              {authed && isAuthConfigured() ? (
                <form action={logoutAction}>
                  <button className="rounded border border-slate-600 px-2 py-1 hover:bg-slate-800">
                    Log out
                  </button>
                </form>
              ) : (
                <span>Internal review tool</span>
              )}
            </div>
          </div>
        </div>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
